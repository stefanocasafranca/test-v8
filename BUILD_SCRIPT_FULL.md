# Life OS Tracker

## Prompts Up to date with Output

A minimal single-page web app called Life OS Tracker that displays one main screen for tracking daily habits via checkboxes — no screens after 10 PM, sleep by 10:30 PM, gym/physical activity, practice LangGraph, and Java Reading & Writing (no AI) — along with a text area for logging purchases of the day. The app uses a structured daily data model keyed by date (YYYY-MM-DD) where each record stores: date, noScreensAfter10, sleepBy1030, gym, practiceLangGraph, javaReadingWritingNoAI, and purchasesOfDay. If today's record does not exist on load, it is created automatically. Data is persisted to local storage exclusively. The UI uses a two-column flex layout on a dark clean theme where the left column contains date navigation with prev/next arrows plus a date picker, daily habit checkboxes, purchases textarea, and streak counter, and the right column contains a sticky weekly summary panel showing each habit's completion count out of 7 for the current Mon–Sun week plus an overall completion percentage. Clicking the date label returns to today. The container is 960px max-width with the right column fixed at 320px to fit everything on one desktop screen.

## Overview

Single-page habit tracker with local storage persistence.

## Tech Stack

- HTML, CSS, JavaScript (vanilla, no frameworks)
- LocalStorage for data persistence

## Structure

```
test-v8/
├── index.html          # Main app (HTML + CSS + JS in one file)
├── CLAUDE.md
├── BUILD_SCRIPT.md
├── BUILD_SCRIPT_FULL.md
└── start-sync.sh
```

## Data Model

Each day is stored in localStorage under key `lifeos-YYYY-MM-DD`:

```json
{
  "date": "2026-02-28",
  "noScreensAfter10": false,
  "sleepBy1030": false,
  "gym": false,
  "practiceLangGraph": false,
  "javaReadingWritingNoAI": false,
  "purchasesOfDay": ""
}
```

## Features

- 5 daily habit checkboxes with completion tracking
- Purchases text area per day
- Date navigation (prev/next arrows + date picker for any date)
- Click date label to return to today
- Edit past days' habits and purchases
- Streak counter for consecutive all-habits-done days
- Weekly Summary: per-habit completion count (x/7) for current week
- Weekly Summary: overall completion percentage
- Auto-creation of today's record on load
- Dark minimal UI
- LocalStorage persistence

## Commands

- Open `index.html` in a browser to use the app

## Prompts RAW

1. Create a minimal app called Life OS Tracker with one main screen. Track daily habits with checkboxes for: no screens after 10 pm, sleep by 10:30 pm, gym/physical activity, practice LangGraph, and Java Reading and Writing (no AI). Also add a text area for purchases of the day. Use local storage only and keep the UI clean.
2. Create a daily data model keyed by date. Each day should store: date, noScreensAfter10, sleepBy1030, gym, practiceLangGraph, javaReadingWritingNoAI, and purchasesOfDay. If today's record does not exist, create it automatically.
3. Add a simple date selector so I can switch to a previous date, view that day's record, and update its habits or purchases. Keep local storage working correctly for both current and past days.
4. Add a Weekly Summary section showing: days completed for each habit this week, Java Reading and Writing (no AI) completion count, and a simple overall completion percentage for the current week only.
