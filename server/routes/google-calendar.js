const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const TOKENS_FILE = path.join(__dirname, '..', '.tokens.json');

function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// Check connection status
router.get('/status', (_req, res) => {
  const tokens = loadTokens();
  res.json({ connected: !!tokens.google_tokens });
});

// Get Google OAuth URL
router.get('/auth-url', (_req, res) => {
  const oauth2 = getOAuth2Client();
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    prompt: 'consent',
  });
  res.json({ url });
});

// OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const oauth2 = getOAuth2Client();
    const { tokens: googleTokens } = await oauth2.getToken(code);

    const stored = loadTokens();
    stored.google_tokens = googleTokens;
    saveTokens(stored);

    // Return HTML that posts message to opener and closes
    res.send(`
      <html><body><script>
        window.opener.postMessage('google-auth-success', '*');
        window.close();
      </script></body></html>
    `);
  } catch (err) {
    res.status(500).send('Auth failed: ' + err.message);
  }
});

// Get events (next 7 days)
router.get('/events', async (_req, res) => {
  try {
    const tokens = loadTokens();
    if (!tokens.google_tokens) return res.status(401).json({ error: 'Not connected' });

    const oauth2 = getOAuth2Client();
    oauth2.setCredentials(tokens.google_tokens);

    // Refresh token if needed
    oauth2.on('tokens', (newTokens) => {
      const stored = loadTokens();
      stored.google_tokens = { ...stored.google_tokens, ...newTokens };
      saveTokens(stored);
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2 });

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 86400000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nextWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    const events = (response.data.items || []).map(evt => {
      const start = evt.start.dateTime || evt.start.date;
      const isAllDay = !evt.start.dateTime;

      let date, time;
      if (isAllDay) {
        date = evt.start.date;
        time = null;
      } else {
        const d = new Date(start);
        date = d.toISOString().split('T')[0];
        time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      }

      return {
        title: evt.summary || '(No title)',
        date,
        time,
        location: evt.location || null,
        status: evt.status === 'tentative' ? 'tentative' : 'confirmed',
      };
    });

    res.json({ events });
  } catch (err) {
    if (err.code === 401) {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Disconnect
router.post('/disconnect', (_req, res) => {
  const tokens = loadTokens();
  delete tokens.google_tokens;
  saveTokens(tokens);
  res.json({ success: true });
});

module.exports = router;
