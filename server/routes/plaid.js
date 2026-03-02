const express = require('express');
const { PlaidApi, PlaidEnvironments, Configuration } = require('plaid');
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

function getPlaidClient() {
  const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });
  return new PlaidApi(config);
}

// Check connection status
router.get('/status', (_req, res) => {
  const tokens = loadTokens();
  res.json({ connected: !!tokens.plaid_access_token });
});

// Create link token
router.post('/create-link-token', async (_req, res) => {
  try {
    const client = getPlaidClient();
    const response = await client.linkTokenCreate({
      user: { client_user_id: 'lifeos-user' },
      client_name: 'Life OS Tracker',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exchange public token for access token
router.post('/exchange-token', async (req, res) => {
  try {
    const client = getPlaidClient();
    const { public_token } = req.body;
    const response = await client.itemPublicTokenExchange({ public_token });
    const tokens = loadTokens();
    tokens.plaid_access_token = response.data.access_token;
    tokens.plaid_item_id = response.data.item_id;
    saveTokens(tokens);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions (last 30 days)
router.get('/transactions', async (_req, res) => {
  try {
    const tokens = loadTokens();
    if (!tokens.plaid_access_token) return res.status(401).json({ error: 'Not connected' });

    const client = getPlaidClient();
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

    const response = await client.transactionsGet({
      access_token: tokens.plaid_access_token,
      start_date: start,
      end_date: end,
      options: { count: 100, offset: 0 },
    });

    const transactions = response.data.transactions.map(tx => ({
      name: tx.name,
      amount: tx.amount,
      date: tx.date,
      category: tx.personal_finance_category
        ? tx.personal_finance_category.primary
        : (tx.category ? tx.category[0] : 'Other'),
    }));

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get account balances
router.get('/balance', async (_req, res) => {
  try {
    const tokens = loadTokens();
    if (!tokens.plaid_access_token) return res.status(401).json({ error: 'Not connected' });

    const client = getPlaidClient();
    const response = await client.accountsBalanceGet({
      access_token: tokens.plaid_access_token,
    });

    const accounts = response.data.accounts.map(a => ({
      name: a.name,
      type: a.type,
      current: a.balances.current,
      available: a.balances.available,
    }));

    res.json({ accounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
