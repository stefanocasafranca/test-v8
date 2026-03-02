# Life OS Tracker

## Prompts Up to date with Output

A comprehensive personal dashboard called Life OS Tracker that evolved from a single-file habit tracker into a tabbed multi-feature dashboard. The app is now structured as separate files — index.html for layout, css/main.css for styling, and individual JS modules (app.js, habits.js, workout.js, spending.js, calendar.js, api.js) — with a Node.js/Express backend server for API integrations. The dashboard uses a tabbed interface with four tabs: Habits (the original daily habit checkboxes for no screens after 10 PM, sleep by 10:30 PM, gym/physical activity, practice LangGraph, and Java Reading & Writing with no AI, plus purchases textarea), Workout (MacroFactor-style workout tracking with exercise logging, set tracking with reps/weight/completed, a pre-seeded Jeff Nippard PPL program with Push A/B Pull A/B Legs A/B, program management, workout history for the last 7 days, and 30-day max weight progress bars), Spending (Chase bank spending via Plaid integration with account balances, 30-day spending total, category breakdown bar chart, and recent transactions list), and Calendar (Google Calendar integration showing next 7 days of events grouped by day with time and location). The right sidebar (320px sticky) shows a weekly summary of habit completion counts, a Quick Stats card with streak days and workouts this week and 30-day spending and today's event count, and a Today's Events widget showing the next 3 calendar events. The UI uses a dark minimal theme at 1200px max-width with green accent color (#22c55e), tabs styled as uppercase text with green underline on active, loading skeletons for async data, and graceful degradation when the backend is offline. All habit and workout data persists in localStorage while spending and calendar data caches locally with auto-refresh intervals. The backend runs on Express port 3001 with Plaid routes for link token creation and token exchange and transaction/balance fetching, plus Google Calendar routes for OAuth consent flow via popup with token storage and event retrieval, all using a simple .tokens.json file for single-user token persistence.

## Overview

Personal dashboard combining habit tracking, workout logging, bank spending, and calendar events.

## Tech Stack

- HTML, CSS, JavaScript (vanilla, no frameworks)
- Node.js + Express backend
- Plaid API for bank transactions
- Google Calendar API for events
- LocalStorage for client-side persistence

## Structure

```
test-v8/
├── index.html
├── css/main.css
├── js/
│   ├── app.js
│   ├── habits.js
│   ├── workout.js
│   ├── spending.js
│   ├── calendar.js
│   └── api.js
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── index.js
│   ├── routes/plaid.js
│   ├── routes/google-calendar.js
│   └── middleware/cors.js
├── .gitignore
└── CLAUDE.md
```

## Data Model

Habits — each day stored in localStorage under key `lifeos-YYYY-MM-DD`:

```json
{
  "date": "2026-03-02",
  "noScreensAfter10": false,
  "sleepBy1030": false,
  "gym": false,
  "practiceLangGraph": false,
  "javaReadingWritingNoAI": false,
  "purchasesOfDay": ""
}
```

Workouts — stored under `lifeos-workouts-YYYY-MM-DD`:

```json
{
  "date": "2026-03-02",
  "programDay": "Push A",
  "exercises": [
    {
      "name": "Barbell Bench Press",
      "category": "Chest",
      "sets": [{ "reps": 8, "weight": 185, "completed": true }]
    }
  ]
}
```

Programs — stored under `lifeos-programs`, active index under `lifeos-active-program`.

## Features

- 5 daily habit checkboxes with completion tracking
- Purchases text area per day
- Date navigation (prev/next arrows + date picker)
- Streak counter for consecutive all-habits-done days
- Weekly Summary with per-habit completion and overall percentage
- Workout tracker with exercise logging, sets, reps, weight
- Pre-seeded Jeff Nippard PPL program (Push A/B, Pull A/B, Legs A/B)
- Program management and auto-suggestion of next workout day
- Workout history (last 7 days) and 30-day progress tracking
- Chase bank spending via Plaid (balances, transactions, categories)
- Google Calendar events (next 7 days, today's events widget)
- Quick Stats sidebar (streak, workouts, spending, events)
- Loading skeletons for async data
- Graceful degradation when backend offline
- Dark minimal UI with green accent

## Environment Variables

```env
PORT=3001
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3001/api/calendar/callback
```

## Commands

- Frontend: Open `index.html` in a browser
- Backend: `cd server && npm install && npm run dev`

## Prompts RAW

1. Create a minimal app called Life OS Tracker with one main screen. Track daily habits with checkboxes for: no screens after 10 pm, sleep by 10:30 pm, gym/physical activity, practice LangGraph, and Java Reading and Writing (no AI). Also add a text area for purchases of the day. Use local storage only and keep the UI clean.
2. Create a daily data model keyed by date. Each day should store: date, noScreensAfter10, sleepBy1030, gym, practiceLangGraph, javaReadingWritingNoAI, and purchasesOfDay. If today's record does not exist, create it automatically.
3. Add a simple date selector so I can switch to a previous date, view that day's record, and update its habits or purchases. Keep local storage working correctly for both current and past days.
4. Add a Weekly Summary section showing: days completed for each habit this week, Java Reading and Writing (no AI) completion count, and a simple overall completion percentage for the current week only.
5. Put all in one page, my weekly summary to the right.
6. Implement the full dashboard integration plan: restructure index.html into separate files (css/main.css, js/habits.js, js/workout.js, js/spending.js, js/calendar.js, js/api.js, js/app.js), add tabbed interface (Habits, Workout, Spending, Calendar), build workout tracker with exercise logging and Jeff Nippard PPL program, create Node.js/Express backend with Plaid routes for Chase bank spending and Google Calendar OAuth routes, add Quick Stats sidebar and Today's Events widget, loading skeletons, and graceful degradation.
