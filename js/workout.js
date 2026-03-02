// Workout module — simple program day display, anchored to Monday

const PROGRAM = [
  { day: 1, label: 'Day 1', title: 'Upper Push + Lat Width' },
  { day: 2, label: 'Day 2', title: 'Lower Hinge + Abs + Grip' },
  { day: 3, label: 'Day 3', title: 'Off or Zone 2' },
  { day: 4, label: 'Day 4', title: 'Upper Pull (Back Density + Arms)' },
  { day: 5, label: 'Day 5', title: 'Lower Squat + Calves + Abs' },
  { day: 6, label: 'Day 6', title: 'Carries + Conditioning + Grip (Optional)' },
];

function getWorkoutWeekStart() {
  // Find this week's Monday as the anchor
  const now = new Date();
  const jsDay = now.getDay(); // 0=Sun
  const offset = (jsDay === 0) ? 6 : jsDay - 1; // days since Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - offset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getTodayProgramDay() {
  const now = new Date();
  const jsDay = now.getDay(); // 0=Sun, 1=Mon...6=Sat
  // Mon=1 → Day 1, Tue=2 → Day 2, ... Sat=6 → Day 6, Sun=0 → rest
  if (jsDay === 0) return null; // Sunday = full rest
  return PROGRAM.find(p => p.day === jsDay) || null;
}

function getTomorrowProgramDay() {
  const now = new Date();
  const jsDay = now.getDay();
  const tmrDay = (jsDay + 1) % 7;
  if (tmrDay === 0) return null; // tomorrow is Sunday
  return PROGRAM.find(p => p.day === tmrDay) || null;
}

function getDayName(jsDay) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][jsDay];
}

function initWorkoutTab() {
  renderWorkoutTab();
}

function renderWorkoutTab() {
  const el = document.getElementById('workout-content');
  const today = getTodayProgramDay();
  const tomorrow = getTomorrowProgramDay();
  const now = new Date();
  const jsDay = now.getDay();
  const todayName = getDayName(jsDay);
  const tomorrowName = getDayName((jsDay + 1) % 7);

  let html = '';

  // Today's workout
  html += '<div class="section-title">Today · ' + todayName + '</div>';
  if (today) {
    html += `
      <div class="workout-day-card today">
        <div class="workout-day-label">${today.label}</div>
        <div class="workout-day-title">${today.title}</div>
      </div>
    `;
  } else {
    html += `
      <div class="workout-day-card rest">
        <div class="workout-day-title">Rest Day</div>
      </div>
    `;
  }

  // Tomorrow sneak peek
  html += '<div class="section-title" style="margin-top:24px">Tomorrow · ' + tomorrowName + '</div>';
  if (tomorrow) {
    html += `
      <div class="workout-day-card tomorrow">
        <div class="workout-day-label">${tomorrow.label}</div>
        <div class="workout-day-title">${tomorrow.title}</div>
      </div>
    `;
  } else {
    html += `
      <div class="workout-day-card rest tomorrow">
        <div class="workout-day-title">Rest Day</div>
      </div>
    `;
  }

  // Full week overview
  html += '<div class="section-title" style="margin-top:24px">This Week</div>';
  html += '<div class="workout-week-list">';
  for (let d = 1; d <= 6; d++) {
    const p = PROGRAM[d - 1];
    const dayName = getDayName(d);
    const isToday = d === jsDay;
    const isPast = (jsDay === 0) ? true : d < jsDay;
    html += `
      <div class="workout-week-row${isToday ? ' current' : ''}${isPast ? ' past' : ''}">
        <span class="workout-week-day">${dayName.slice(0, 3)}</span>
        <span class="workout-week-name">${p.label} – ${p.title}</span>
      </div>
    `;
  }
  html += `
    <div class="workout-week-row${jsDay === 0 ? ' current' : ''}">
      <span class="workout-week-day">Sun</span>
      <span class="workout-week-name">Rest</span>
    </div>
  `;
  html += '</div>';

  el.innerHTML = html;
}
