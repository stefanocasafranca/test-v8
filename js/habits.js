// Habits module — data model and rendering

const HABITS = [
  { field: 'noScreensAfter10', label: 'No screens after 10 PM' },
  { field: 'sleepBy1030', label: 'Sleep by 10:30 PM' },
  { field: 'gym', label: 'Gym / Physical activity' },
  { field: 'practiceLangGraph', label: 'Practice LangGraph' },
  { field: 'javaReadingWritingNoAI', label: 'Java Reading & Writing (no AI)' },
];

function createDayRecord(key) {
  return {
    date: key,
    noScreensAfter10: false,
    sleepBy1030: false,
    gym: false,
    practiceLangGraph: false,
    javaReadingWritingNoAI: false,
    purchasesOfDay: '',
  };
}

function loadDay(key) {
  const raw = localStorage.getItem('lifeos-' + key);
  if (raw) return JSON.parse(raw);
  const record = createDayRecord(key);
  saveDay(key, record);
  return record;
}

function saveDay(key, data) {
  localStorage.setItem('lifeos-' + key, JSON.stringify(data));
}

function ensureToday() {
  const key = dateKey(new Date());
  if (!localStorage.getItem('lifeos-' + key)) {
    saveDay(key, createDayRecord(key));
  }
}

function renderHabits() {
  const key = dateKey(currentDate);
  const data = loadDay(key);

  document.getElementById('date-label').textContent = formatDate(currentDate);
  document.getElementById('date-picker').value = key;

  const habitsEl = document.getElementById('habits');
  habitsEl.innerHTML = HABITS.map(h => `
    <label class="habit">
      <input type="checkbox" data-field="${h.field}" ${data[h.field] ? 'checked' : ''}>
      <span class="checkmark">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="habit-label">${h.label}</span>
    </label>
  `).join('');

  document.getElementById('purchases').value = data.purchasesOfDay || '';

  habitsEl.querySelectorAll('input').forEach(cb => {
    cb.addEventListener('change', () => {
      const d = loadDay(key);
      d[cb.dataset.field] = cb.checked;
      saveDay(key, d);
      updateStreak();
      updateWeeklySummary();
      updateQuickStats();
    });
  });

  updateStreak();
  updateWeeklySummary();
}

function getWeekDays() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(dateKey(d));
  }
  return days;
}

function updateWeeklySummary() {
  const weekDays = getWeekDays();

  const weekRecords = weekDays.map(key => {
    const raw = localStorage.getItem('lifeos-' + key);
    return raw ? JSON.parse(raw) : null;
  });

  const rangeStart = new Date(weekDays[0] + 'T00:00:00');
  const rangeEnd = new Date(weekDays[6] + 'T00:00:00');
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  document.getElementById('weekly-range').textContent = fmt(rangeStart) + ' – ' + fmt(rangeEnd);

  let totalChecked = 0;
  let totalPossible = HABITS.length * 7;

  const habitsHtml = HABITS.map(h => {
    let count = 0;
    weekRecords.forEach(r => { if (r && r[h.field]) count++; });
    totalChecked += count;
    return `<div class="weekly-habit">
      <span class="weekly-habit-name">${h.label}</span>
      <span class="weekly-habit-count">${count} / 7</span>
    </div>`;
  }).join('');

  document.getElementById('weekly-habits').innerHTML = habitsHtml;

  const pct = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;
  document.getElementById('weekly-pct').textContent = pct + '%';
}

function updateStreak() {
  let streak = 0;
  const d = new Date();
  d.setDate(d.getDate() - 1);

  while (true) {
    const raw = localStorage.getItem('lifeos-' + dateKey(d));
    if (!raw) break;
    const data = JSON.parse(raw);
    const allDone = HABITS.every(h => data[h.field]);
    if (!allDone) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const todayData = loadDay(dateKey(new Date()));
  if (HABITS.every(h => todayData[h.field])) {
    streak++;
  }

  document.getElementById('streak-count').textContent = streak;
  return streak;
}
