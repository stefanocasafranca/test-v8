// Workout tracker module — localStorage based

const EXERCISE_LIBRARY = [
  // Push
  { name: 'Barbell Bench Press', category: 'Chest' },
  { name: 'Incline Dumbbell Press', category: 'Chest' },
  { name: 'Cable Flyes', category: 'Chest' },
  { name: 'Overhead Press', category: 'Shoulders' },
  { name: 'Lateral Raises', category: 'Shoulders' },
  { name: 'Face Pulls', category: 'Shoulders' },
  { name: 'Tricep Pushdowns', category: 'Triceps' },
  { name: 'Overhead Tricep Extension', category: 'Triceps' },
  // Pull
  { name: 'Barbell Rows', category: 'Back' },
  { name: 'Pull-ups', category: 'Back' },
  { name: 'Lat Pulldown', category: 'Back' },
  { name: 'Seated Cable Row', category: 'Back' },
  { name: 'Dumbbell Rows', category: 'Back' },
  { name: 'Barbell Curls', category: 'Biceps' },
  { name: 'Hammer Curls', category: 'Biceps' },
  { name: 'Incline Dumbbell Curls', category: 'Biceps' },
  { name: 'Rear Delt Flyes', category: 'Shoulders' },
  // Legs
  { name: 'Barbell Squat', category: 'Quads' },
  { name: 'Leg Press', category: 'Quads' },
  { name: 'Leg Extension', category: 'Quads' },
  { name: 'Romanian Deadlift', category: 'Hamstrings' },
  { name: 'Leg Curl', category: 'Hamstrings' },
  { name: 'Bulgarian Split Squat', category: 'Quads' },
  { name: 'Calf Raises', category: 'Calves' },
  { name: 'Hip Thrust', category: 'Glutes' },
  // Compound
  { name: 'Deadlift', category: 'Back' },
  { name: 'Dips', category: 'Chest' },
  { name: 'Chin-ups', category: 'Back' },
  // Core
  { name: 'Cable Crunches', category: 'Core' },
  { name: 'Hanging Leg Raises', category: 'Core' },
];

const JEFF_NIPPARD_PPL = {
  name: 'Jeff Nippard PPL',
  days: [
    {
      name: 'Push A',
      exercises: [
        { name: 'Barbell Bench Press', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }] },
        { name: 'Overhead Press', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Incline Dumbbell Press', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Cable Flyes', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
        { name: 'Lateral Raises', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
        { name: 'Tricep Pushdowns', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      ]
    },
    {
      name: 'Pull A',
      exercises: [
        { name: 'Barbell Rows', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }] },
        { name: 'Pull-ups', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }] },
        { name: 'Seated Cable Row', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Face Pulls', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
        { name: 'Barbell Curls', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Hammer Curls', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      ]
    },
    {
      name: 'Legs A',
      exercises: [
        { name: 'Barbell Squat', sets: [{ reps: 6, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }] },
        { name: 'Romanian Deadlift', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Leg Press', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
        { name: 'Leg Curl', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
        { name: 'Calf Raises', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
      ]
    },
    {
      name: 'Push B',
      exercises: [
        { name: 'Overhead Press', sets: [{ reps: 6, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }, { reps: 6, weight: 0 }] },
        { name: 'Incline Dumbbell Press', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Dips', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Cable Flyes', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
        { name: 'Lateral Raises', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
        { name: 'Overhead Tricep Extension', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      ]
    },
    {
      name: 'Pull B',
      exercises: [
        { name: 'Deadlift', sets: [{ reps: 5, weight: 0 }, { reps: 5, weight: 0 }, { reps: 5, weight: 0 }] },
        { name: 'Lat Pulldown', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Dumbbell Rows', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Rear Delt Flyes', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
        { name: 'Incline Dumbbell Curls', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Cable Crunches', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
      ]
    },
    {
      name: 'Legs B',
      exercises: [
        { name: 'Leg Press', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Bulgarian Split Squat', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Leg Extension', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
        { name: 'Leg Curl', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
        { name: 'Hip Thrust', sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
        { name: 'Hanging Leg Raises', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      ]
    },
  ]
};

let workoutInitialized = false;

function initWorkoutTab() {
  if (workoutInitialized) return;
  workoutInitialized = true;
  seedDefaults();
  renderWorkoutTab();
}

function seedDefaults() {
  if (!localStorage.getItem('lifeos-exercise-library')) {
    localStorage.setItem('lifeos-exercise-library', JSON.stringify(EXERCISE_LIBRARY));
  }
  if (!localStorage.getItem('lifeos-programs')) {
    localStorage.setItem('lifeos-programs', JSON.stringify([JEFF_NIPPARD_PPL]));
    localStorage.setItem('lifeos-active-program', '0');
    localStorage.setItem('lifeos-program-day-index', '0');
  }
}

function getPrograms() {
  const raw = localStorage.getItem('lifeos-programs');
  return raw ? JSON.parse(raw) : [];
}

function getActiveProgram() {
  const idx = parseInt(localStorage.getItem('lifeos-active-program') || '0');
  const programs = getPrograms();
  return programs[idx] || null;
}

function getNextProgramDay() {
  const program = getActiveProgram();
  if (!program) return null;
  const idx = parseInt(localStorage.getItem('lifeos-program-day-index') || '0');
  return { day: program.days[idx % program.days.length], index: idx };
}

function advanceProgramDay() {
  const program = getActiveProgram();
  if (!program) return;
  const idx = parseInt(localStorage.getItem('lifeos-program-day-index') || '0');
  localStorage.setItem('lifeos-program-day-index', String((idx + 1) % program.days.length));
}

function getTodayWorkout() {
  const key = dateKey(new Date());
  const raw = localStorage.getItem('lifeos-workouts-' + key);
  return raw ? JSON.parse(raw) : null;
}

function saveTodayWorkout(workout) {
  const key = dateKey(new Date());
  localStorage.setItem('lifeos-workouts-' + key, JSON.stringify(workout));
}

function startWorkout() {
  const next = getNextProgramDay();
  let workout;
  if (next) {
    workout = {
      date: dateKey(new Date()),
      programDay: next.day.name,
      exercises: next.day.exercises.map(ex => ({
        name: ex.name,
        category: (EXERCISE_LIBRARY.find(e => e.name === ex.name) || {}).category || '',
        sets: ex.sets.map(s => ({ reps: s.reps, weight: s.weight, completed: false })),
      })),
    };
    advanceProgramDay();
  } else {
    workout = { date: dateKey(new Date()), programDay: 'Custom', exercises: [] };
  }
  saveTodayWorkout(workout);
  renderWorkoutTab();
}

function renderWorkoutTab() {
  const el = document.getElementById('workout-content');
  const workout = getTodayWorkout();

  if (!workout) {
    const next = getNextProgramDay();
    el.innerHTML = `
      <div class="workout-header">
        <div class="section-title">Today's Workout</div>
      </div>
      <div class="connect-card">
        <p>${next ? `Next up: <strong>${next.day.name}</strong> from ${getActiveProgram().name}` : 'No active program'}</p>
        <button class="btn" onclick="startWorkout()">Start Workout</button>
      </div>
      ${renderProgramSection()}
      ${renderWorkoutHistory()}
      ${renderProgressSection()}
    `;
    return;
  }

  let html = `
    <div class="workout-header">
      <div>
        <div class="section-title">Today's Workout</div>
        <span style="font-size:0.8rem;color:#555">${workout.programDay}</span>
      </div>
      <button class="btn-outline btn-sm" onclick="showExerciseModal()">+ Add Exercise</button>
    </div>
  `;

  workout.exercises.forEach((ex, ei) => {
    html += `
      <div class="exercise-card">
        <div class="exercise-card-header">
          <span class="exercise-name">${ex.name}</span>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="exercise-category">${ex.category}</span>
            <button class="btn-outline btn-sm" onclick="removeExercise(${ei})" title="Remove">&times;</button>
          </div>
        </div>
        ${ex.sets.map((s, si) => `
          <div class="set-row">
            <span class="set-number">Set ${si + 1}</span>
            <input class="set-input" type="number" value="${s.reps}" min="0" placeholder="reps"
              onchange="updateSet(${ei},${si},'reps',this.value)">
            <span class="set-unit">reps</span>
            <input class="set-input" type="number" value="${s.weight}" min="0" step="2.5" placeholder="lbs"
              onchange="updateSet(${ei},${si},'weight',this.value)">
            <span class="set-unit">lbs</span>
            <input type="checkbox" class="set-check" ${s.completed ? 'checked' : ''}
              onchange="updateSet(${ei},${si},'completed',this.checked)">
          </div>
        `).join('')}
        <button class="add-set-btn" onclick="addSet(${ei})">+ Add Set</button>
      </div>
    `;
  });

  html += renderProgramSection();
  html += renderWorkoutHistory();
  html += renderProgressSection();

  el.innerHTML = html;
}

function updateSet(ei, si, field, value) {
  const workout = getTodayWorkout();
  if (!workout) return;
  if (field === 'completed') {
    workout.exercises[ei].sets[si][field] = value;
  } else {
    workout.exercises[ei].sets[si][field] = parseFloat(value) || 0;
  }
  saveTodayWorkout(workout);
  updateQuickStats();
}

function addSet(ei) {
  const workout = getTodayWorkout();
  if (!workout) return;
  const lastSet = workout.exercises[ei].sets[workout.exercises[ei].sets.length - 1];
  workout.exercises[ei].sets.push({ reps: lastSet ? lastSet.reps : 10, weight: lastSet ? lastSet.weight : 0, completed: false });
  saveTodayWorkout(workout);
  renderWorkoutTab();
}

function removeExercise(ei) {
  const workout = getTodayWorkout();
  if (!workout) return;
  workout.exercises.splice(ei, 1);
  saveTodayWorkout(workout);
  renderWorkoutTab();
}

function addExerciseToWorkout(name, category) {
  let workout = getTodayWorkout();
  if (!workout) {
    workout = { date: dateKey(new Date()), programDay: 'Custom', exercises: [] };
  }
  workout.exercises.push({
    name,
    category,
    sets: [{ reps: 10, weight: 0, completed: false }, { reps: 10, weight: 0, completed: false }, { reps: 10, weight: 0, completed: false }],
  });
  saveTodayWorkout(workout);
  closeExerciseModal();
  renderWorkoutTab();
}

function showExerciseModal() {
  const library = JSON.parse(localStorage.getItem('lifeos-exercise-library') || '[]');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'exercise-modal';
  overlay.onclick = (e) => { if (e.target === overlay) closeExerciseModal(); };

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">Add Exercise</span>
        <button class="modal-close" onclick="closeExerciseModal()">&times;</button>
      </div>
      <input class="modal-search" id="exercise-search" placeholder="Search exercises..." oninput="filterExercises(this.value)">
      <div class="modal-list" id="exercise-list">
        ${library.map(ex => `
          <div class="modal-item" onclick="addExerciseToWorkout('${ex.name}','${ex.category}')">
            <div class="modal-item-name">${ex.name}</div>
            <div class="modal-item-cat">${ex.category}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById('exercise-search').focus();
}

function filterExercises(query) {
  const library = JSON.parse(localStorage.getItem('lifeos-exercise-library') || '[]');
  const q = query.toLowerCase();
  const filtered = library.filter(ex => ex.name.toLowerCase().includes(q) || ex.category.toLowerCase().includes(q));
  document.getElementById('exercise-list').innerHTML = filtered.map(ex => `
    <div class="modal-item" onclick="addExerciseToWorkout('${ex.name}','${ex.category}')">
      <div class="modal-item-name">${ex.name}</div>
      <div class="modal-item-cat">${ex.category}</div>
    </div>
  `).join('');
}

function closeExerciseModal() {
  const modal = document.getElementById('exercise-modal');
  if (modal) modal.remove();
}

function renderProgramSection() {
  const programs = getPrograms();
  const activeIdx = parseInt(localStorage.getItem('lifeos-active-program') || '0');
  const dayIdx = parseInt(localStorage.getItem('lifeos-program-day-index') || '0');

  let html = '<div class="history-section"><div class="section-title" style="margin-top:24px">Programs</div>';
  programs.forEach((p, pi) => {
    const isActive = pi === activeIdx;
    const nextDay = isActive ? p.days[dayIdx % p.days.length] : null;
    html += `
      <div class="program-card ${isActive ? 'active-program' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div class="program-name">${p.name}</div>
            <div class="program-info">${p.days.length} days${isActive && nextDay ? ' · Next: ' + nextDay.name : ''}</div>
          </div>
          ${!isActive ? `<button class="btn-outline btn-sm" onclick="setActiveProgram(${pi})">Activate</button>` : '<span class="exercise-category">Active</span>'}
        </div>
        <div class="program-days">
          ${p.days.map((d, di) => `<span class="program-day-tag${isActive && (dayIdx % p.days.length) === di ? '" style="color:#22c55e;border:1px solid #22c55e44' : ''}">${d.name}</span>`).join('')}
        </div>
      </div>
    `;
  });
  html += '</div>';
  return html;
}

function setActiveProgram(idx) {
  localStorage.setItem('lifeos-active-program', String(idx));
  localStorage.setItem('lifeos-program-day-index', '0');
  renderWorkoutTab();
}

function renderWorkoutHistory() {
  const today = new Date();
  const workouts = [];

  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const raw = localStorage.getItem('lifeos-workouts-' + key);
    if (raw) {
      workouts.push({ key, data: JSON.parse(raw) });
    }
  }

  if (workouts.length === 0) return '';

  let html = '<div class="history-section"><div class="section-title" style="margin-top:24px">Recent Workouts</div>';
  workouts.forEach((w, wi) => {
    const exCount = w.data.exercises.length;
    const setCount = w.data.exercises.reduce((a, e) => a + e.sets.length, 0);
    html += `
      <div class="history-item">
        <div class="history-header" onclick="toggleHistory(${wi})">
          <span class="history-date">${formatDate(new Date(w.key + 'T00:00:00'))} · ${w.data.programDay || 'Custom'}</span>
          <span class="history-summary">${exCount} exercises · ${setCount} sets</span>
        </div>
        <div class="history-detail" id="history-${wi}">
          ${w.data.exercises.map(ex => `
            <div class="history-exercise">
              <div class="history-exercise-name">${ex.name}</div>
              <div class="history-sets">${ex.sets.map((s, i) => `Set ${i + 1}: ${s.reps}×${s.weight}lbs`).join(' · ')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  html += '</div>';
  return html;
}

function toggleHistory(idx) {
  const el = document.getElementById('history-' + idx);
  if (el) el.classList.toggle('open');
}

function renderProgressSection() {
  const today = new Date();
  const maxWeights = {};

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const raw = localStorage.getItem('lifeos-workouts-' + dateKey(d));
    if (!raw) continue;
    const w = JSON.parse(raw);
    w.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed && s.weight > 0) {
          if (!maxWeights[ex.name] || s.weight > maxWeights[ex.name]) {
            maxWeights[ex.name] = s.weight;
          }
        }
      });
    });
  }

  const entries = Object.entries(maxWeights);
  if (entries.length === 0) return '';

  const globalMax = Math.max(...entries.map(e => e[1]));

  let html = `
    <div class="progress-section">
      <div class="section-title" style="margin-top:24px">Max Weight (30 days)</div>
      <div class="progress-chart">
        <div class="progress-bars">
          ${entries.sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, weight]) => `
            <div class="progress-bar-row">
              <span class="progress-bar-label">${name}</span>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width:${(weight / globalMax * 100).toFixed(0)}%"></div>
              </div>
              <span class="progress-bar-value">${weight} lbs</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return html;
}
