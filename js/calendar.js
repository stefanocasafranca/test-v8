// Calendar module — Google Calendar integration

let calendarInitialized = false;
let calendarConnected = false;

async function initCalendarTab() {
  if (calendarInitialized) {
    renderCalendarTab();
    return;
  }
  calendarInitialized = true;

  const online = await checkBackend();
  if (!online) {
    renderCalendarOffline();
    return;
  }

  try {
    const status = await apiGet('/api/calendar/status');
    calendarConnected = status.connected;
  } catch {
    calendarConnected = false;
  }

  renderCalendarTab();

  if (calendarConnected) {
    await refreshCalendarIfNeeded();
  }
}

function renderCalendarOffline() {
  document.getElementById('calendar-content').innerHTML = `
    <div class="offline-msg">
      <p>Backend server is not running</p>
      <p>Start it with:</p>
      <code>cd server && npm run dev</code>
    </div>
  `;
}

function renderCalendarTab() {
  const el = document.getElementById('calendar-content');

  if (!calendarConnected) {
    el.innerHTML = `
      <div class="connect-card">
        <div class="section-title">Google Calendar</div>
        <p>Connect your Google Calendar to see upcoming events</p>
        <button class="btn" onclick="connectGoogleCalendar()">Connect Google Calendar</button>
      </div>
    `;
    return;
  }

  const cache = localStorage.getItem('lifeos-calendar-cache');
  if (!cache) {
    el.innerHTML = `
      <div class="skeleton skeleton-block"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
      <div class="skeleton skeleton-block"></div>
    `;
    return;
  }

  const data = JSON.parse(cache);
  renderCalendarData(data);
}

function renderCalendarData(data) {
  const el = document.getElementById('calendar-content');

  if (!data.events || data.events.length === 0) {
    el.innerHTML = `
      <div class="connect-card">
        <p>No upcoming events</p>
        <button class="btn-outline btn-sm" onclick="refreshCalendar()">Refresh</button>
      </div>
    `;
    return;
  }

  // Group events by day
  const grouped = {};
  data.events.forEach(evt => {
    const day = evt.date;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(evt);
  });

  let html = '';
  Object.entries(grouped).forEach(([day, events]) => {
    const dayDate = new Date(day + 'T00:00:00');
    const label = formatDate(dayDate);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

    html += `
      <div class="calendar-day-group">
        <div class="calendar-day-label">${label} · ${dayName}</div>
        ${events.map(evt => `
          <div class="calendar-event${evt.status === 'tentative' ? ' tentative' : ''}">
            <span class="calendar-event-time">${evt.time || 'All day'}</span>
            <div class="calendar-event-details">
              <div class="calendar-event-title">${evt.title}</div>
              ${evt.location ? `<div class="calendar-event-location">${evt.location}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  });

  html += `
    <div style="text-align:center;margin-top:16px">
      <button class="btn-outline btn-sm" onclick="refreshCalendar()">Refresh</button>
      <button class="btn-outline btn-sm btn-danger" onclick="disconnectCalendar()" style="margin-left:8px">Disconnect</button>
    </div>
  `;

  el.innerHTML = html;

  // Update sidebar widget
  updateTodayEventsWidget(data);
}

function updateTodayEventsWidget(data) {
  const widget = document.getElementById('today-events-content');
  if (!widget || !data.events) return;

  const todayKey = dateKey(new Date());
  const todayEvents = data.events.filter(e => e.date === todayKey);

  if (todayEvents.length === 0) {
    widget.innerHTML = '<span class="no-events-msg">No events today</span>';
    return;
  }

  widget.innerHTML = todayEvents.slice(0, 3).map(evt => `
    <div class="event-item">
      <span class="event-time">${evt.time || 'All day'}</span>
      <span class="event-name">${evt.title}</span>
    </div>
  `).join('') + (todayEvents.length > 3 ? `<span class="no-events-msg">+${todayEvents.length - 3} more</span>` : '');
}

async function connectGoogleCalendar() {
  try {
    const { url } = await apiGet('/api/calendar/auth-url');

    const popup = window.open(url, 'google-auth', 'width=500,height=600');

    window.addEventListener('message', async function handler(event) {
      if (event.data === 'google-auth-success') {
        window.removeEventListener('message', handler);
        if (popup) popup.close();
        calendarConnected = true;
        await refreshCalendar();
      }
    });
  } catch (err) {
    alert('Failed to connect: ' + err.message);
  }
}

async function refreshCalendarIfNeeded() {
  const cache = localStorage.getItem('lifeos-calendar-cache');
  if (cache) {
    const data = JSON.parse(cache);
    if (data._ts && Date.now() - data._ts < 900000) {
      // <15 min old, just render from cache
      updateTodayEventsWidget(data);
      return;
    }
  }
  await refreshCalendar();
}

async function refreshCalendar() {
  try {
    const data = await apiGet('/api/calendar/events');

    const cache = {
      events: data.events,
      _ts: Date.now(),
    };

    localStorage.setItem('lifeos-calendar-cache', JSON.stringify(cache));
    renderCalendarData(cache);
    updateQuickStats();
  } catch (err) {
    if (err.message.includes('401') || err.message.includes('403')) {
      document.getElementById('calendar-content').innerHTML = `
        <div class="connect-card">
          <p>Session expired</p>
          <button class="btn-reconnect" onclick="connectGoogleCalendar()">Reconnect</button>
        </div>
      `;
    }
  }
}

async function disconnectCalendar() {
  try {
    await apiPost('/api/calendar/disconnect', {});
  } catch {}
  calendarConnected = false;
  localStorage.removeItem('lifeos-calendar-cache');
  calendarInitialized = false;
  document.getElementById('today-events-content').innerHTML = '<span class="no-events-msg">No events loaded</span>';
  renderCalendarTab();
}
