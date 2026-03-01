Life OS Tracker
Prompts Up to date with Output
A minimal single-page web app called Life OS Tracker that displays one main screen for tracking daily habits via checkboxes — no screens after 10 PM, sleep by 10:30 PM, gym/physical activity, practice LangGraph, and Java Reading & Writing (no AI) — along with a text area for logging purchases of the day. The app uses a structured daily data model keyed by date (YYYY-MM-DD) where each record stores: date, noScreensAfter10, sleepBy1030, gym, practiceLangGraph, javaReadingWritingNoAI, and purchasesOfDay. If today's record does not exist on load, it is created automatically. Data is persisted to local storage exclusively. The UI features a dark clean theme, date navigation with prev/next arrows plus a date picker input to jump to any date and edit past days' habits and purchases, clicking the date label returns to today, a streak counter that tracks consecutive days with all habits completed, and a Weekly Summary section showing each habit's completion count out of 7 for the current Mon–Sun week plus an overall completion percentage.Make the app accessible for all the users and bring the weekly report to the right side of the screen. I need the whole component system to fit in my desktop.
Overview
Single-page habit tracker with local storage persistence.
Tech Stack
HTML, CSS, JavaScript (vanilla, no frameworks)
LocalStorage for data persistence
Structure


Data Model
Each day is stored in localStorage under key lifeos-YYYY-MM-DD:


Features
5 daily habit checkboxes with completion tracking
Purchases text area per day
Date navigation (prev/next arrows + date picker for any date)
Click date label to return to today
Edit past days' habits and purchases
Streak counter for consecutive all-habits-done days
Weekly Summary: per-habit completion count (x/7) for current week
Weekly Summary: overall completion percentage
Auto-creation of today's record on load
Dark minimal UI
LocalStorage persistence
Commands
Open index.html in a browser to use the app

