# Everyday

Personal workout tracker (frontend). Plan any date from seven pre-filled workout templates, record reps for each set, mark exercises complete or partial, and see streaks, completion trends and history over time.

This is the **frontend only**. It runs entirely against a mock service layer backed by `localStorage`; there is no backend, API, or database code in this repository.

> **Auth is currently disabled in the UI.** `/login` and `/signup` are not routed, and the app boots with a local device profile: it adopts the most recently saved account, or creates one named "You". The Login/Signup screens and all mock auth functions remain in `src/` so they can be re-enabled later. The Account tab keeps the profile name and theme; log out and delete account are hidden.

## What the app does

- **Home** opens on today and has a scrollable date strip plus a jump-to-date field. Dates without a saved record fall back to a suggested weekday session: Mon Chest, Tue Back, Wed Legs, Thu Shoulders, Fri Arms, Sat Core, Sun Full Body.
- Each exercise tracks **actual reps per set** against the target. The exercise status is calculated from reps (Completed, Partially completed, Not completed) and can be overridden manually for that date.
- You can change a day's workout, choose a **Rest day**, add custom exercises, edit targets, and remove exercises. Changes belong to that date only; templates and other dates stay untouched.
- **Library** lists the seven templates with full exercise details and adds a copy of a template to any date, warning before replacing a saved session.
- **Analytics** uses only recorded data: daily/weekly completion, exercises and reps completed versus planned, consistency, streaks, a heatmap, a trend chart, a workout-type breakdown, and history including partial workouts.
- Schedules, recorded reps, statuses and history persist across reloads. Light/dark themes, the responsive shell, and the local profile follow the existing app conventions.

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
| `npm run test`    | Run the Vitest unit tests for the workout helpers           |
| `npm run format`  | Format all files with Prettier                              |

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173. To check the production build locally:

```bash
npm run build
npm run preview
```

## Data layer (for the backend developer)

All data access goes through `src/lib/services/` — async functions such as `getWorkouts()`, `saveWorkout()`, `getWorkoutSettings()`, `saveWorkoutSettings()`, and the mock auth functions (`signUp()`, `logIn()`, ...). Components and stores never touch `localStorage` directly; `storage.ts` is the only adapter that reads and writes app data, and it validates saved data so corrupted storage fails with an error state instead of a crash.

| File             | Responsibility                                                                  |
| ---------------- | ------------------------------------------------------------------------------- |
| `auth.ts`        | `signUp`, `logIn`, `logOut`, `getCurrentUser`, `updateName`, `deleteAccount`    |
| `workouts.ts`    | Load/save workout records and settings, validation, serialized writes           |
| `storage.ts`     | localStorage adapter, keys, validation, simulated 200–500 ms delay              |
| `errors.ts`      | `ServiceError` and the user-facing error message helper                         |

Workout data helpers live in `src/lib/utils/workouts.ts`, and the exercise/template definitions live in `src/lib/data/workout-templates.ts`.

Current mock keys: `fitency:auth`, `fitency:data:<userId>:workouts`, and `fitency:data:<userId>:workout-settings`. The theme preference is UI state stored separately under `fitency-theme` and is not part of the data service.

To plug in a real backend, replace only the service functions; their signatures and the `WorkoutRecord`, `WorkoutTemplate`, `WorkoutExercise`, and `User` types in `src/lib/types.ts` are the seam. Nothing else in the app needs to change.

## Project structure

```
src/
  components/ui/     # shadcn/ui primitives
  components/        # shared components
  features/          # home, library, analytics, account, auth
  lib/data/          # exercise and template definitions
  lib/services/      # mock data layer (localStorage)
  lib/utils/         # date, workout, streak, and stats helpers
  store/             # Zustand stores
  routes/            # router setup and local-profile bootstrap
  styles/            # Tailwind entry, tokens, fonts
  main.tsx
```
