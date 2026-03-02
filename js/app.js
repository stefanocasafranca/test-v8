// App init, tab switching, date navigation

let currentDate = new Date();

function dateKey(d) {
  return d.toISOString().split('T')[0];
}

function formatDate(d) {
  const today = new Date();
  const key = dateKey(d);
  const todayKey = dateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (key === todayKey) return 'Today';
  if (key === dateKey(yesterday)) return 'Yesterday';

  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Tab switching
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(tc => {
    tc.classList.toggle('active', tc.id === 'tab-' + tabId);
  });

  // Trigger tab-specific init
  if (tabId === 'workout') initWorkoutTab();
  if (tabId === 'spending') initSpendingTab();
  if (tabId === 'calendar') initCalendarTab();
}

// Quick Stats (sidebar)
function updateQuickStats() {
  const streak = updateStreak();

  // Workouts this week
  const weekDays = getWeekDays();
  let workoutCount = 0;
  weekDays.forEach(key => {
    const raw = localStorage.getItem('lifeos-workouts-' + key);
    if (raw) {
      const w = JSON.parse(raw);
      if (w.exercises && w.exercises.length > 0) workoutCount++;
    }
  });

  // Spending (from cache)
  let monthlySpending = '$--';
  const spendingCache = localStorage.getItem('lifeos-spending-cache');
  if (spendingCache) {
    const data = JSON.parse(spendingCache);
    if (data.total !== undefined) {
      monthlySpending = '$' + Math.round(data.total).toLocaleString();
    }
  }

  // Events today (from cache)
  let eventsToday = '--';
  const calCache = localStorage.getItem('lifeos-calendar-cache');
  if (calCache) {
    const data = JSON.parse(calCache);
    const todayKey = dateKey(new Date());
    if (data.events) {
      eventsToday = data.events.filter(e => e.date === todayKey).length;
    }
  }

  const statsEl = document.getElementById('quick-stats-content');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-row">
        <span class="stat-label">Streak</span>
        <span class="stat-value">${streak} days</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Workouts (week)</span>
        <span class="stat-value">${workoutCount}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Spent (30d)</span>
        <span class="stat-value">${monthlySpending}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Events today</span>
        <span class="stat-value">${eventsToday}</span>
      </div>
    `;
  }
}

// Date navigation
document.getElementById('prev-day').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  renderHabits();
});

document.getElementById('next-day').addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  renderHabits();
});

document.getElementById('date-picker').addEventListener('change', (e) => {
  if (e.target.value) {
    const [y, m, d] = e.target.value.split('-').map(Number);
    currentDate = new Date(y, m - 1, d);
    renderHabits();
  }
});

document.getElementById('date-label').addEventListener('click', () => {
  currentDate = new Date();
  renderHabits();
});

// Tab click handlers
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Init
ensureToday();
renderHabits();
updateQuickStats();
