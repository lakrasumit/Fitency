# Fitency: Frontend Build Plan

**Source of truth:** `PRD.md`. This file only says *what order to build in* and *tracks progress*. If this plan and the PRD disagree, the PRD wins. Log the conflict under "Blockers and questions".

**Scope:** frontend only. No backend, API, or database work. Do not build anything listed under "Future / out of scope" in the PRD.

---

## How the agent must use this file

1. **At the start of every session:** read `PRD.md`, then this file. Find the first unchecked task and continue from there.
2. **Work in phase order.** Do not start a phase until the previous phase's "Done when" is met.
3. **Status markers** (use exactly these):
   - `[ ]` not started
   - `[~]` in progress (only one task at a time should be `[~]`)
   - `[x]` done and verified
   - `[!]` blocked (explain in "Blockers and questions")
4. **Verify before checking off.** A task is `[x]` only when it works, `npm run lint` and `npm run build` pass, and (for UI tasks) it looks right at **375px wide** and at **1280px wide**, in **both light and dark themes**.
5. **After finishing each task:** change its marker to `[x]` and add one line to the **Progress log** (date, task id, what was done, key files).
6. **After finishing each phase:** update the **Progress tracker** table, then make a commit using the suggested message.
7. **Never expand scope.** No extra pages, features, or libraries beyond the PRD stack. If something seems missing, log it as a question instead of building it.
8. **If the PRD is ambiguous or you are blocked:** mark the task `[!]`, log the question, and move to the next independent task. Do not guess on anything that changes behavior.
9. **Keep code clean:** TypeScript strict, small modular components, semantic HTML, brief meaningful comments, no unused code.

---

## Progress tracker

| Phase | Name | Status | Done / Total |
|---|---|---|---|
| 0 | Project setup | Done | 7 / 7 |
| 1 | Design system foundation | Done | 8 / 8 |
| 2 | Data layer and logic | Done | 8 / 8 |
| 3 | App shell, routing, and auth | Done | 7 / 7 |
| 4 | Habits page | Not started | 0 / 8 |
| 5 | Home (Dashboard) | Not started | 0 / 7 |
| 6 | Analytics | Not started | 0 / 8 |
| 7 | Account | Not started | 0 / 5 |
| 8 | Polish: states, responsive, accessibility | Not started | 0 / 6 |
| 9 | Final QA | Not started | 0 / 6 |

Status values: Not started, In progress, Done.

---

## Phase 0: Project setup
*PRD refs: sections 3 and 4.*

- [x] **0.1** Scaffold a **React + Vite + TypeScript** project (strict mode on).
- [x] **0.2** Install and configure **Tailwind CSS**.
- [x] **0.3** Initialize **shadcn/ui** (with Radix and Vaul) and confirm one component renders.
- [x] **0.4** Install the remaining PRD stack: React Router, Zustand, react-hook-form, zod, date-fns, Recharts, lucide-react, sonner, `@fontsource` (Roboto Condensed, Roboto), and the theme library (`next-themes` or a custom ThemeProvider).
- [x] **0.5** Configure **ESLint + Prettier**, and add `lint`, `format`, and `build` scripts.
- [x] **0.6** Create the **folder structure** from PRD section 4 (empty folders get a placeholder file only if needed).
- [x] **0.7** Set up path alias (`@/`), `import.meta.env` typing, and a clean `README` with run instructions.

**Done when:** `npm run dev`, `npm run lint`, and `npm run build` all succeed on the empty app.
**Commit:** `chore: scaffold Fitency with Vite, React, TypeScript, and Tailwind`

---

## Phase 1: Design system foundation
*PRD refs: section 5.*

- [x] **1.1** Define **CSS-variable color tokens** for light and dark (soft charcoal dark), including accent orange, completed green, surfaces, text, borders, and chart colors.
- [x] **1.2** Load fonts: **Roboto Condensed** (headings, numbers) and **Roboto** (body). Add Tailwind font families and utility classes for each.
- [x] **1.3** Implement **theming** (Light / Dark / System) with no flash on load, persisted across reloads.
- [x] **1.4** Set the soft, rounded shape language (radius, shadow tokens) in the Tailwind config.
- [x] **1.5** Build base UI components: **Button, Input, Skeleton, EmptyState, Toast (sonner setup)**.
- [x] **1.6** Build **ProgressRing** (accessible, accepts value and label).
- [x] **1.7** Build **BottomSheet/Modal** (bottom sheet on mobile, modal on desktop) and **ConfirmDialog**.
- [x] **1.8** Create a temporary dev-only **style preview** route to eyeball all components in both themes, then remove it before Phase 9 ends.

**Done when:** every base component renders correctly in light and dark at 375px and 1280px, with visible focus states.
**Commit:** `feat: add design tokens, theming, and base UI components`

---

## Phase 2: Data layer and logic
*PRD refs: sections 8, 9, and the placeholder data shapes.*

- [x] **2.1** Add the placeholder **types** (`Habit`, `Completion`, `User`) in a shared types file.
- [x] **2.2** Build **date helpers** (local `YYYY-MM-DD`, weekday numbering Mon=1 to Sun=7, range builders for week, month, year, all).
- [x] **2.3** Build **logic helpers** in `lib/utils/`: `isScheduled`, `completionRate`, `currentStreak`, `bestStreak`, and per-day completion %, exactly following PRD section 8 (including zero-scheduled handling with no NaN).
- [x] **2.4** Verify the helpers with **unit tests** covering: habit created mid-range, days with no scheduled habits (skipped in streaks), unfinished today not breaking a streak, empty ranges, and weekday filtering. (Vitest is the Vite-native choice and is a dev-only dependency; if not permitted, use a plain verification script and note it in the log.)
- [x] **2.5** Build the **service layer** in `lib/services/` with simulated delay and `localStorage` persistence: habits (`getHabits`, `createHabit`, `updateHabit`, `deleteHabit`), completions (`getCompletions`, `toggleCompletion`), and mock auth (`signUp`, `logIn`, `logOut`, `getCurrentUser`, `updateName`, `deleteAccount`).
- [x] **2.6** Make the service layer **fail gracefully** if `localStorage` is unavailable or corrupted (return an error, never crash).
- [x] **2.7** Build **Zustand stores** (habits, completions, auth) that call only the service layer, expose loading and error state, and use `persist` only where appropriate.
- [x] **2.8** Enforce validation rules in one place (zod schemas): habit name required, trimmed, max 40 chars, unique (case-insensitive), at least one weekday.

**Done when:** logic helpers pass their tests, and the stores can create a habit, toggle a completion, and recompute stats in a quick throwaway check.
**Commit:** `feat: add types, logic helpers, mock service layer, and stores`

---

## Phase 3: App shell, routing, and auth
*PRD refs: sections 6 and 7.5.*

- [x] **3.1** Set up **React Router** with routes: `/` (Home), `/analytics`, `/habits`, `/account`, `/login`, `/signup`, and a not-found route.
- [x] **3.2** Build the **route guard**: unauthenticated users go to Login; authenticated users skip Login and Sign up.
- [x] **3.3** Build the **app shell**: **BottomTabBar** below 768px, **Sidebar** at 768px and up, **PageHeader**, content max-width and grid behavior.
- [x] **3.4** Build **LoginForm** (email, password) with validation, disabled submit while submitting, and clear errors such as "Incorrect email or password".
- [x] **3.5** Build **SignupForm** (name, email, password) with the same standards.
- [x] **3.6** Wire both forms to the mock auth service and redirect to Home on success.
- [x] **3.7** Add placeholder pages for Home, Analytics, Habits, and Account so navigation can be tested end to end.

**Done when:** a user can sign up, land on Home, move between all four tabs on mobile and desktop, log out, and be redirected to Login.
**Commit:** `feat: add routing, app shell, and mock auth screens`

---

## Phase 4: Habits page
*PRD refs: section 7.2.*

*(Built before Home because Home depends on habits existing.)*

- [ ] **4.1** Build **HabitList** and **HabitCard** (icon, name, weekday chips, Edit and Delete actions; long names truncate with ellipsis).
- [ ] **4.2** Add the preset **fitness icon set** and the **IconPicker** grid.
- [ ] **4.3** Build **ColorPicker** (small palette).
- [ ] **4.4** Build **WeekdayPicker** (7 toggle chips, plus "Every day" and "Weekdays" shortcuts).
- [ ] **4.5** Build **HabitForm** (shared for add and edit; full screen on mobile, modal on desktop) with react-hook-form + zod, inline errors, disabled submit while saving, and a success toast.
- [ ] **4.6** Wire **"+ New habit"**, **Edit**, and **Delete** (hard delete with ConfirmDialog; completions for that habit are removed too).
- [ ] **4.7** Add **loading** (skeleton), **empty** ("No habits yet" with a call to action), and **error** states.
- [ ] **4.8** Check keyboard access and screen-reader labels for all controls on this page.

**Done when:** a user can add, edit, and delete habits with every validation rule enforced, and data persists across reloads.
**Commit:** `feat: add Habits page with create, edit, and delete`

---

## Phase 5: Home (Dashboard)
*PRD refs: section 7.1.*

- [ ] **5.1** Build **GreetingHeader** (greeting, today's date, avatar).
- [ ] **5.2** Build **TodayProgressCard** (ProgressRing with "X / Y done" and percentage).
- [ ] **5.3** Build **StreakBadge** using the PRD streak rule.
- [ ] **5.4** Build **HabitItem** (accessible checkbox) and the **Pending / Completed** lists. Only habits scheduled today appear; checking and un-checking is **today only**.
- [ ] **5.5** Build **OverallProgressCard** (completed % vs left %, donut or bar) with the **Week / Month / All** toggle (default Week).
- [ ] **5.6** Add states: **loading** (skeletons), **empty, no habits** ("Add your first habit" button), **empty, nothing scheduled today**, **all done** (positive message), and **error**.
- [ ] **5.7** Confirm that every check or un-check updates the ring, lists, percentages, and streak immediately.

**Done when:** the full Home flow works end to end against mock data at 375px and 1280px, in both themes.
**Commit:** `feat: add Home dashboard with today's habits, streak, and overall progress`

---

## Phase 6: Analytics
*PRD refs: section 7.3.*

- [ ] **6.1** Build **RangeSwitcher** (Week / Month / Year, default Month).
- [ ] **6.2** Build **StatCard** and the 2x2 summary grid: completion rate, current streak, best streak, total check-ins.
- [ ] **6.3** Build the custom **Heatmap** (CSS grid, days shaded by completion %, keyboard-focusable cells, accessible labels).
- [ ] **6.4** Build **DayDetailSheet** (read-only; bottom sheet on mobile, modal on desktop) listing which habits were done and not done that day.
- [ ] **6.5** Build **TrendChart** with Recharts, including an accessible text summary.
- [ ] **6.6** Build **HabitBreakdown** (per-habit completion %).
- [ ] **6.7** Add states: **loading** (skeletons), **empty** ("Complete a few habits to see your analytics" with a link to Home), and **error**.
- [ ] **6.8** Cross-check every figure against the logic helpers on a small hand-calculated dataset.

**Done when:** all Analytics sections respond correctly to the range switcher, and numbers match the hand-calculated check.
**Commit:** `feat: add Analytics with heatmap, trend chart, and per-habit breakdown`

---

## Phase 7: Account
*PRD refs: section 7.4.*

- [ ] **7.1** Build **ProfileCard** (avatar with initials fallback, name, email).
- [ ] **7.2** Build **NameEditForm** (required, trimmed, validation, success toast).
- [ ] **7.3** Build **ThemeSelect** (Light / Dark / System), wired to the theme system.
- [ ] **7.4** Wire **Log out** (clear mock session, redirect to Login).
- [ ] **7.5** Build the **DangerZone** with **Delete account** behind a ConfirmDialog (clears the user's mock data and session, then redirects).

**Done when:** all Account actions work and persist correctly, including theme across reloads.
**Commit:** `feat: add Account page with profile, theme, logout, and delete account`

---

## Phase 8: Polish: states, responsive, accessibility
*PRD refs: sections 5, 6, and 11.*

- [ ] **8.1** Walk every screen and confirm **loading, empty, and error** states exist and look right.
- [ ] **8.2** Responsive pass at **375px, 768px, and 1280px**: no horizontal scroll, comfortable tap targets, correct nav switch at 768px.
- [ ] **8.3** Accessibility pass: semantic landmarks and heading order, WCAG AA contrast in both themes, visible focus rings, ARIA labels on icon buttons and charts, full keyboard use of checkboxes, heatmap cells, and sheets.
- [ ] **8.4** Respect **`prefers-reduced-motion`** for all animations and transitions.
- [ ] **8.5** Go through the PRD **edge case list** (section 11) and confirm each one is handled.
- [ ] **8.6** Remove the dev-only style preview route and any dead code or leftover logs.

**Done when:** all edge cases in the PRD are handled and the audit finds no open accessibility or responsive issues.
**Commit:** `fix: polish states, responsiveness, and accessibility`

---

## Phase 9: Final QA

- [ ] **9.1** `npm run lint` passes with no warnings.
- [ ] **9.2** `npm run build` passes with no errors, and `npm run preview` works.
- [ ] **9.3** Full manual walkthrough as a new user: sign up, create habits, check them off, view Analytics, change theme, edit name, log out, log back in, delete a habit, delete the account.
- [ ] **9.4** Confirm **no backend or API code** exists and the service layer is the only data access point.
- [ ] **9.5** Confirm **nothing from "Future / out of scope"** was built.
- [ ] **9.6** Update `README` with setup steps, scripts, and a short note on the service layer (so the backend developer knows what to replace).

**Done when:** every box in this file is `[x]` or has a logged reason.
**Commit:** `docs: finalize README and complete MVP frontend`

---

## Progress log

*Add one line per completed task, newest at the bottom. Format:*
`YYYY-MM-DD | task id | what was done | key files`

| Date | Task | What was done | Key files |
|---|---|---|---|
| 2026-10-20 | 0.1 | Scaffolded React + Vite + TS (strict) in `frontend/`; pinned TypeScript ~6.0.3 because typescript-eslint does not support TS 7 yet. Lint + build pass. | frontend/package.json, frontend/tsconfig.app.json |
| 2026-10-20 | 0.2 | Installed Tailwind CSS v4 + @tailwindcss/vite; wired Vite plugin; global CSS at src/styles/index.css. Lint + build pass. | frontend/vite.config.ts, frontend/src/styles/index.css |
| 2026-10-20 | 0.3 | Initialized shadcn/ui (radix base, nova preset); Button renders in dev verified at 375px and 1280px via iframe harness. | frontend/components.json, frontend/src/components/ui/button.tsx |
| 2026-10-20 | 0.4 | Installed react-router, zustand, react-hook-form, zod, date-fns, recharts, sonner, @fontsource roboto + roboto-condensed. Theme provider deferred to Phase 1 (custom). | frontend/package.json |
| 2026-10-20 | 0.5 | Added Prettier with .prettierrc/.prettierignore and `format` script; scoped react-refresh rule exception for generated shadcn primitives. Lint + build pass. | frontend/eslint.config.js, frontend/.prettierrc, frontend/package.json |
| 2026-10-20 | 0.6 | Created PRD folder structure (features, lib/services, store, routes, styles) with .gitkeep; moved the Tailwind entry to src/styles/index.css and updated components.json. | frontend/src/**, frontend/components.json |
| 2026-10-20 | 0.7 | `@/` alias in tsconfigs and Vite; import.meta.env typing via `types: ["vite/client"]`; README rewritten; .gitignore now covers .env files. | frontend/README.md, frontend/.gitignore, frontend/tsconfig.app.json |
| 2026-10-20 | 1.1 | Defined light + dark CSS-variable tokens (warm neutral surfaces, orange primary, green success, destructive, 5 chart colors, input/border/ring, sidebar). Key text pairs checked with a WCAG contrast script: body 16.4:1 / muted 5.2:1 / white-on-primary 5.2:1 (light), all ≥4.5:1; dark equivalents ≥6:1; input borders ≥3:1. Verified rendered tokens in both themes. | frontend/src/styles/index.css |
| 2026-10-20 | 1.2 | Loaded Roboto (400/500/700) and Roboto Condensed (400/500/600/700) via @fontsource; removed Geist; added `font-sans`/`font-heading` theme tokens. Verified computed fonts in the browser (h1 = Roboto Condensed, body = Roboto) and woff2 files in the build. | frontend/src/styles/index.css, frontend/package.json |
| 2026-10-20 | 1.3 | Custom ThemeProvider (Light/Dark/System, class on `<html>`), persisted in localStorage under `fitency-theme`; inline script in index.html applies the theme before first paint (no flash). System mode reacts to OS changes. Verified toggle, reload persistence, and system mode in the browser with a clean console. | frontend/src/components/theme/**, frontend/index.html, frontend/src/main.tsx |
| 2026-10-20 | 1.4 | Set `--radius: 1rem` and theme-dependent `--shadow-soft`/`--shadow-float`; exposed them as `shadow-soft`/`shadow-float` utilities. Verified computed shadows differ correctly between light and dark. | frontend/src/styles/index.css |
| 2026-10-20 | 1.5 | Added shadcn Input, Skeleton, sonner Toaster (adapted to the custom theme hook), plus Button sizes bumped for touch (default h-10, lg h-11, icon size-10; Input h-10), EmptyState, and mounted the Toaster at app root. Verified all states in both themes. | frontend/src/components/ui/**, frontend/src/components/empty-state.tsx, frontend/src/App.tsx |
| 2026-10-20 | 1.6 | Built ProgressRing (SVG, clamps value, `role="progressbar"` with aria value min/max/now and label, themed track/progress, reduced-motion guard). Verified semantics and visuals at 0/40/100%. | frontend/src/components/progress-ring.tsx |
| 2026-10-20 | 1.7 | Built BottomSheet (Vaul drawer below 768px, Radix dialog at ≥768px, shared title/description/content/footer) and ConfirmDialog (AlertDialog). Verified drawer at 375px, centered modal at 1280px, and confirm/cancel behavior. | frontend/src/components/bottom-sheet.tsx, frontend/src/components/confirm-dialog.tsx, frontend/src/components/use-media-query.ts |
| 2026-10-20 | 1.8 | Added temporary dev-only style preview at `?preview` (StylePreview) covering tokens, type, buttons, inputs, skeleton, ring, empty state, sheet/modal, confirm, and toasts. Verified in the browser at 375px and 1280px, light and dark, with visible focus ring. To be removed in Phase 8. | frontend/src/components/style-preview.tsx, frontend/src/App.tsx |
| 2026-10-20 | 2.1 | Added the shared `Habit`, `Completion`, and `User` types matching PRD section 9. Lint + build pass. | frontend/src/lib/types.ts |
| 2026-10-20 | 2.2 | Added local `YYYY-MM-DD` helpers, Monday=1 weekday numbering, and week/month/year/all range builders that separate full-period days from elapsed days (future days excluded from stats). Lint + build pass. | frontend/src/lib/utils/date.ts |
| 2026-10-20 | 2.3 | Added `isScheduled`, `completionRate`, `perDayCompletion`, `currentStreak`, and `bestStreak` with creation-date capping, weekday filtering, skipped unscheduled days, unfinished-today handling, and `null` percentages when nothing is scheduled. | frontend/src/lib/utils/habits.ts |
| 2026-10-20 | 2.4 | Added Vitest (dev-only, plan-approved) with a `test` script and 25 unit tests covering mid-range creation, weekday filtering, zero-scheduled/empty ranges, streak gaps, unfinished today, and all-habits-required days. `npm run test`, lint, and build pass. | frontend/src/lib/utils/habits.test.ts, frontend/package.json |
| 2026-10-20 | 2.5 | Built the mock service layer for auth, habits, and completions with 200-500ms simulated delay, per-user localStorage keys, ISO `createdAt`, duplicate-name checks, and cascade delete of completions. Verified with a temporary in-memory-storage check (signup/login, CRUD, toggle, stats); check file removed afterwards. | frontend/src/lib/services/** |
| 2026-10-20 | 2.6 | Added typed `ServiceError` and guarded storage reads/writes with validators; unavailable or corrupted localStorage rejects with a user-facing message instead of crashing. Temporary check verified both paths. | frontend/src/lib/services/storage.ts, frontend/src/lib/services/errors.ts |
| 2026-10-20 | 2.7 | Added habits, completions, and auth Zustand stores with loading/error state, optimistic completion toggle with rollback, and reset actions for account deletion. Temporary store check confirmed habit creation, check-in toggle, 100% recompute, and rollback on an invalid date. | frontend/src/store/** |
| 2026-10-20 | 2.8 | Added `habitFieldsSchema` plus `createHabitSchema` (trim, required, max 40, case-insensitive unique, at least one weekday) and wired the habit service to it. Rules verified in the temporary check. | frontend/src/lib/schemas.ts, frontend/src/lib/services/habits.ts |
| 2026-10-20 | 3.1 | Wired React Router (v8) with `/`, `/analytics`, `/habits`, `/account`, `/login`, `/signup`, and a not-found route; added temporary placeholder pages for the four tab destinations. Verified live: guest at `/` lands on `/login`, `/nope` renders the 404 page, no console errors. | frontend/src/routes/app-routes.tsx, frontend/src/routes/not-found-page.tsx, frontend/src/features/** |
| 2026-10-20 | 3.2 | Added `RequireAuth` and `PublicOnly` layout-route guards backed by an `initialized` flag in the auth store (one session check per load, no redirect flash). Verified live at 375px and 1280px: signed-out users are sent to Login, signed-in users visiting `/signup` bounce back to Home. | frontend/src/routes/require-auth.tsx, frontend/src/routes/public-only.tsx, frontend/src/store/auth-store.ts |
| 2026-10-20 | 3.3 | Built AppShell with a 240px sidebar at ≥768px and a bottom tab bar below it (NavLink active states, safe-area padding), plus PageHeader and a shared nav item list. Verified live: at 375px the sidebar is `display:none` and the tab bar is visible; at 1280px the reverse; both themes and no console warnings. | frontend/src/components/layout/**, frontend/src/components/full-page-loader.tsx |
| 2026-10-20 | 3.4 | Built LoginForm with react-hook-form + zod inline errors, `aria-invalid`/`aria-describedby`, focus moved to the first invalid field, disabled submit while saving, and store errors shown in a `role="alert"` message. Verified live: empty submit shows both inline errors; wrong password shows "Incorrect email or password." while staying on `/login`; submit is disabled with a "Signing in…" label mid-request. | frontend/src/features/auth/login-form.tsx, frontend/src/features/auth/auth-field.tsx |
| 2026-10-20 | 3.5 | Built SignupForm (name, email, password) to the same standards, sharing AuthField and AuthShell. Verified live: created an account from the 375px frame with inline validation and a disabled submitting state. | frontend/src/features/auth/signup-form.tsx, frontend/src/features/auth/auth-shell.tsx |
| 2026-10-20 | 3.6 | Wired both forms to the mock auth store/service; success shows a toast, redirects to Home, and persists the session (`fitency:auth`). Verified live: sign up and log in both land on `/` with the session stored. | frontend/src/features/auth/**, frontend/src/store/auth-store.ts |
| 2026-10-20 | 3.7 | Added placeholder Home, Analytics, Habits, and Account pages so all four destinations navigate end to end. Verified live: clicking each tab updates the URL, heading, and `aria-current` at both widths. | frontend/src/features/*/*-page.tsx |

---

## Blockers and questions

*Log anything ambiguous or blocking here. Format:*
`YYYY-MM-DD | task id | question or blocker | status (open / resolved + answer)`

| Date | Task | Question or blocker | Status |
|---|---|---|---|
| 2026-10-20 | 0.1 | This plan references `PRD.md` (sections 7.1 Home, 7.2 Habits, 7.3 Analytics, 7.4 Account, 11 edge cases; stack: Zustand, shadcn/ui + Radix + Vaul, Recharts, Roboto fonts, light + dark themes, Login/Signup/Account screens). The only PRD present is `docs/PRD.md`, which specifies different screens (Home / Analytics / New Habit / Rewards), a different stack (Context + useReducer, custom SVG chart, no component library), Plus Jakarta Sans, and a dark-only theme with no auth UI. The referenced `PRD.md` may be missing from the repo. Cannot start Phase 0 until the correct source of truth is confirmed. | resolved: stale entry from an earlier session, written before commit 003c4e8 replaced the old design-doc-era PRD. The current committed `docs/PRD.md` matches this plan exactly (Home/Analytics/Habits/Account, Login/Signup, Zustand, shadcn/ui + Radix + Vaul, Recharts, Roboto, light + dark). User confirmed: build from `docs/PRD.md`. |
| 2026-10-20 | 0.1 | Where should the frontend app live? The repo has an empty `frontend/` folder. | resolved: scaffold inside `frontend/` |
| 2026-10-20 | 3.4 | PRD requires a minimum password length but gives no number. | resolved: 8 characters |
| 2026-10-20 | 2.3 / 5.5 / 6 | Do future days in the current Week/Month/Year count toward completion %? | resolved: count only through today; heatmap shows the full period with future days neutral and not clickable |
| 2026-10-20 | 2.8 / 4.5 | @hookform/resolvers (zodResolver) is not in the PRD stack list, but react-hook-form cannot consume zod schemas without a resolver; shadcn's official RHF guide uses it. Add it, or write a small custom resolver against the same zod schemas? | resolved: user approved adding `@hookform/resolvers` |

---

## Decisions made during the build

*Record any small implementation choice not covered by the PRD (for example, a specific icon list or palette values), so the next session stays consistent.*

| Date | Decision | Reason |
|---|---|---|
| 2026-10-20 | Tailwind CSS v4 (CSS-first tokens in `src/styles/index.css`; no `tailwind.config.js`). | Current stable; the shadcn CLI validated v4. Needs no separate config file, tokens stay as CSS variables. |
| 2026-10-20 | Custom ThemeProvider (class on `<html>` + pre-hydration script) instead of `next-themes`. | PRD allows either; avoids an extra dependency. |
| 2026-10-20 | TypeScript pinned to `~6.0.3` (template default was ~7.0.2). | typescript-eslint@8 does not support TS 7 yet (peer `<6.1.0`); ESLint is required. |
| 2026-10-20 | shadcn preset `nova` (neutral base color, lucide icons) as the starting point. | PRD requires lucide-react; the starting palette is replaced by Fitency tokens in Phase 1. |
| 2026-10-20 | `react-refresh/only-export-components` disabled for `src/components/ui/**` only. | Generated shadcn primitives intentionally export variant helpers next to components. |
| 2026-10-20 | Global CSS lives at `src/styles/index.css` (moved from `src/index.css`). | Matches PRD folder structure (`styles/`); `components.json` updated so future `shadcn add` appends there. |
| 2026-10-20 | Fitency palette: light bg `#FAF9F7`, card `#FFFFFF`, primary `#C2410C`, success `#15803D`, input border `#948C82`; dark bg `#1C1A17`, card `#262320`, primary `#FB923C`, success `#4ADE80`, input border `#766F66`; chart colors orange/blue/green/purple/pink. | Warm neutrals + orange accent per PRD; darker light-mode orange and lighter dark-mode orange keep white/dark button labels ≥4.5:1. Input borders meet 3:1. Contrast checked numerically. |
| 2026-10-20 | Theme preference (`light`/`dark`/`system`) stored directly in localStorage under `fitency-theme`, read by an inline script in index.html. | Theme is presentation state, not app data; the no-flash requirement needs a synchronous read before React mounts. Service layer remains the only path for habits/auth data. |
| 2026-10-20 | Font weights: Roboto 400/500/700; Roboto Condensed 400/500/600/700. Default UI font is Roboto; headings and numbers use `font-heading`. | Covers body, labels, bold headings, and large stat numbers; avoids loading unused weights/italics. |
| 2026-10-20 | Radius 1rem (soft rounded); two shadow tokens (`shadow-soft` for cards, `shadow-float` for overlays), both theme-dependent CSS vars. | PRD asks for soft rounded shapes and gentle depth; vars let dark mode use stronger shadows. |
| 2026-10-20 | shadcn Button/Input sizes increased for touch: default h-10, sm h-9, lg h-11, icon size-10; Input h-10. | PRD requires large thumb-friendly tap targets on mobile; generated defaults were 32px. |
| 2026-10-20 | `@hookform/resolvers` pinned to v5.9.2 (not v6). | v6's optional peer set conflicts with `effect@4` under npm's resolver; v5.9 supports zod 4 and the same `zodResolver` API. |
| 2026-10-20 | Responsive overlay: `BottomSheet` renders a Vaul drawer below 768px and a Radix dialog at ≥768px; media query via `useMediaQuery`. | Matches PRD (bottom sheet on mobile, modal on desktop) and the 768px breakpoint used by navigation. |
| 2026-10-20 | Dev style preview lives at `src/components/style-preview.tsx`, shown when `?preview` is present in dev builds. | Temporary per plan; easy to find and delete in Phase 8. Not included in production routing. |
| 2026-10-20 | shadcn's sonner wrapper imports the custom `useTheme` instead of `next-themes`. | Keeps a single theme source; `next-themes` is not installed. |
| 2026-10-20 | Shared app types live in `src/lib/types.ts`; `HabitInput` is derived from `Habit` for forms and the service. | One place for the PRD's data shapes plus the create/edit payload without repeating fields. |
| 2026-10-20 | `Habit.createdAt` is stored as a full ISO timestamp (`new Date().toISOString()`) and converted to a local `YYYY-MM-DD` key for scheduling. | Matches the PRD's "ISO date" shape while keeping weekday/creation comparisons in device-local time. |
| 2026-10-20 | Mock data is namespaced per user under `fitency:data:<userId>:habits|completions`; the mock session and credentials live under `fitency:auth`. | Keeps accounts private if two people use the same browser and lets delete-account remove only that user's data. |
| 2026-10-20 | Zustand stores use no `persist` middleware. | The service layer already owns localStorage; persisting store snapshots would create a second source of truth and bypass the single data-access point. |
| 2026-10-20 | Completion toggles update the store optimistically and roll back to the previous list if the service fails. | PRD requires check-off updates immediately; the 200-500ms mock delay would otherwise make the UI feel unresponsive. |
| 2026-10-20 | Habit validation lives in `src/lib/schemas.ts`; `createHabitSchema(habits, editingId?)` covers field rules plus case-insensitive uniqueness, and the service parses inputs through it. | PRD 2.8 asks for one validation source shared by the future form and the service. |
| 2026-10-20 | Vitest 5 added as a dev-only dependency with `npm run test`. | Plan 2.4 explicitly allows Vitest; helpers are pure and need no DOM environment. |
| 2026-10-20 | Mock auth stores the typed password as-is in localStorage and returns only `User` fields to the UI. | It is a fake auth layer for the MVP; no real credentials or backend exist. To be replaced by the real auth service later. |
| 2026-10-20 | Routing uses one `AppRoutes` component with `BrowserRouter` and nested layout routes; `RequireAuth` and `PublicOnly` are layout routes that render `Outlet`. | Keeps guarded/public areas declared once instead of wrapping every page. |
| 2026-10-20 | Auth store exposes an `initialized` flag; guards trigger the session check once and render `FullPageLoader` until it finishes. | Prevents a redirect-to-Login flash on first paint and avoids a duplicate session read when moving between Login and the protected shell. |
| 2026-10-20 | Navigation lives in `src/components/layout/nav-items.ts` with lucide icons House, ChartColumn, ListChecks, UserRound. | Sidebar and bottom tab bar must render the same four destinations in the same order. |
| 2026-10-20 | Auth validation schemas (`loginSchema`, `signupSchema`, `MIN_PASSWORD_LENGTH = 8`) live in `src/lib/schemas.ts` beside the habit schema. | Keeps every zod rule in the "one place" the plan asks for; 8 characters comes from the resolved blocker entry. |
| 2026-10-20 | Login/Sign up share `AuthShell` (centered card, no nav) and `AuthField` (label + input + inline error). | PRD requires public screens without tab bar or sidebar, and both forms need identical field markup. |
