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
| 1 | Design system foundation | Not started | 0 / 8 |
| 2 | Data layer and logic | Not started | 0 / 8 |
| 3 | App shell, routing, and auth | Not started | 0 / 7 |
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

- [ ] **1.1** Define **CSS-variable color tokens** for light and dark (soft charcoal dark), including accent orange, completed green, surfaces, text, borders, and chart colors.
- [ ] **1.2** Load fonts: **Roboto Condensed** (headings, numbers) and **Roboto** (body). Add Tailwind font families and utility classes for each.
- [ ] **1.3** Implement **theming** (Light / Dark / System) with no flash on load, persisted across reloads.
- [ ] **1.4** Set the soft, rounded shape language (radius, shadow tokens) in the Tailwind config.
- [ ] **1.5** Build base UI components: **Button, Input, Skeleton, EmptyState, Toast (sonner setup)**.
- [ ] **1.6** Build **ProgressRing** (accessible, accepts value and label).
- [ ] **1.7** Build **BottomSheet/Modal** (bottom sheet on mobile, modal on desktop) and **ConfirmDialog**.
- [ ] **1.8** Create a temporary dev-only **style preview** route to eyeball all components in both themes, then remove it before Phase 9 ends.

**Done when:** every base component renders correctly in light and dark at 375px and 1280px, with visible focus states.
**Commit:** `feat: add design tokens, theming, and base UI components`

---

## Phase 2: Data layer and logic
*PRD refs: sections 8, 9, and the placeholder data shapes.*

- [ ] **2.1** Add the placeholder **types** (`Habit`, `Completion`, `User`) in a shared types file.
- [ ] **2.2** Build **date helpers** (local `YYYY-MM-DD`, weekday numbering Mon=1 to Sun=7, range builders for week, month, year, all).
- [ ] **2.3** Build **logic helpers** in `lib/utils/`: `isScheduled`, `completionRate`, `currentStreak`, `bestStreak`, and per-day completion %, exactly following PRD section 8 (including zero-scheduled handling with no NaN).
- [ ] **2.4** Verify the helpers with **unit tests** covering: habit created mid-range, days with no scheduled habits (skipped in streaks), unfinished today not breaking a streak, empty ranges, and weekday filtering. (Vitest is the Vite-native choice and is a dev-only dependency; if not permitted, use a plain verification script and note it in the log.)
- [ ] **2.5** Build the **service layer** in `lib/services/` with simulated delay and `localStorage` persistence: habits (`getHabits`, `createHabit`, `updateHabit`, `deleteHabit`), completions (`getCompletions`, `toggleCompletion`), and mock auth (`signUp`, `logIn`, `logOut`, `getCurrentUser`, `updateName`, `deleteAccount`).
- [ ] **2.6** Make the service layer **fail gracefully** if `localStorage` is unavailable or corrupted (return an error, never crash).
- [ ] **2.7** Build **Zustand stores** (habits, completions, auth) that call only the service layer, expose loading and error state, and use `persist` only where appropriate.
- [ ] **2.8** Enforce validation rules in one place (zod schemas): habit name required, trimmed, max 40 chars, unique (case-insensitive), at least one weekday.

**Done when:** logic helpers pass their tests, and the stores can create a habit, toggle a completion, and recompute stats in a quick throwaway check.
**Commit:** `feat: add types, logic helpers, mock service layer, and stores`

---

## Phase 3: App shell, routing, and auth
*PRD refs: sections 6 and 7.5.*

- [ ] **3.1** Set up **React Router** with routes: `/` (Home), `/analytics`, `/habits`, `/account`, `/login`, `/signup`, and a not-found route.
- [ ] **3.2** Build the **route guard**: unauthenticated users go to Login; authenticated users skip Login and Sign up.
- [ ] **3.3** Build the **app shell**: **BottomTabBar** below 768px, **Sidebar** at 768px and up, **PageHeader**, content max-width and grid behavior.
- [ ] **3.4** Build **LoginForm** (email, password) with validation, disabled submit while submitting, and clear errors such as "Incorrect email or password".
- [ ] **3.5** Build **SignupForm** (name, email, password) with the same standards.
- [ ] **3.6** Wire both forms to the mock auth service and redirect to Home on success.
- [ ] **3.7** Add placeholder pages for Home, Analytics, Habits, and Account so navigation can be tested end to end.

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
| 2026-10-20 | 2.8 / 4.5 | @hookform/resolvers (zodResolver) is not in the PRD stack list, but react-hook-form cannot consume zod schemas without a resolver; shadcn's official RHF guide uses it. Add it, or write a small custom resolver against the same zod schemas? | open |

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
