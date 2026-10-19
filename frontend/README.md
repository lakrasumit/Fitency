# Fitency

Personal fitness habit tracker (frontend). Create weekday-based habits, check them off each day, and see streaks and progress over time.

This is the **frontend only**. It runs entirely against a mock service layer backed by `localStorage`; there is no backend, API, or database code in this repository.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Scripts

| Script            | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Start the dev server (http://localhost:5173)                |
| `npm run build`   | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally                          |
| `npm run lint`    | Run ESLint                                                  |
| `npm run format`  | Format all files with Prettier                              |

## Setup

```bash
npm install
npm run dev
```

## Data layer (for the backend developer)

All data access goes through `src/lib/services/` — async functions such as `getHabits()`, `createHabit()`, `toggleCompletion()`, and the mock auth functions (`signUp()`, `logIn()`, ...). Components and stores never touch `localStorage` directly.

To plug in a real backend, replace only that layer; its function signatures are the seam. Nothing else in the app needs to change.

## Project structure

```
src/
  components/ui/     # shadcn/ui primitives
  components/        # shared components
  features/          # home, habits, analytics, account, auth
  lib/services/      # mock data layer (localStorage)
  lib/utils/         # date, streak, and completion helpers
  store/             # Zustand stores
  routes/            # router setup and route guard
  styles/            # Tailwind entry, tokens, fonts
  main.tsx
```
