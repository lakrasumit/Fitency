# Fitency — Product Requirements Document

**Document type:** Current-state product reference  
**Last verified:** 2026-10-23  
**Application:** Fitency (`frontend/`)  
**Scope:** Frontend-only workout tracker with local persistence

This document describes what Fitency currently does, what it requires, and what is still missing. It is based on the source code, package manifests, automated checks, and a live navigation/routing smoke test.

---

## 1. Product Overview

### Purpose

Fitency is a personal workout tracker for planning a training session, recording actual reps for each set, and reviewing consistency over time. It provides a pre-filled weekly training schedule and lets the user customise any date without changing the underlying templates.

Fitency addresses this by:

- Providing a suggested workout for every weekday.
- Letting the user record reps set by set.
- Deriving completion status from recorded reps, with an optional manual override.
- Summarising completion, rep volume, consistency, and streaks.
- Keeping each day’s edits independent from all other days.

### Target Users

- Individuals following a weekly strength-training split.
- Users who want low-friction, single-device workout logging.
- Users who prefer not to create an online account for basic tracking.
- Users who want to review recent consistency rather than manage a complex coaching programme.

### Core Value Proposition

A ready-to-use weekly workout plan, per-set tracking, and progress summaries in a responsive, local-first application. No account or backend is required for normal use.

### Current Product Boundaries

Fitency is currently:

- A workout tracker, not a habit tracker.
- Frontend-only.
- Device-local, with no sync or backend API.
- Operated through an automatically created local profile while account features remain hidden.

---

## 2. Current Application Status

### Status Key

- **Implemented** — present in active code and reachable in the running application.
- **Implemented with caveats** — present, but with verified behavioural or design limitations.
- **Partially implemented** — some required pieces exist while others are missing or inaccessible.
- **Missing** — no implementation exists.
- **Needs verification** — evidence is incomplete or the behaviour depends on a decision not yet made.

### Status Summary

| Area | Status | Evidence / notes |
|---|---|---|
| Fitency branding | Implemented | Browser title, metadata, sidebar label, loader text, and README updated. |
| Home workout tracking | Implemented | Suggested weekday workouts, per-set rep entry, status overrides, custom exercises, rest days. |
| Workout library | Implemented with caveats | Seven templates and add-to-date flow work; replacing a saved day has only a warning, not a confirmation. |
| Analytics | Implemented with caveats | Summary, heatmap, trend, breakdown, and history exist; planned totals include unsaved suggested weekdays. |
| Local persistence | Implemented with caveats | `localStorage` services, validation, and serialised writes exist; no export, versioning, or sync. |
| Responsive shell | Implemented | Desktop sidebar and mobile bottom tab bar; three active destinations. |
| Light/dark theming | Implemented | Theme engine, tokens, and a compact header toggle are available on every active route; the choice persists locally. A stored `system` preference is resolved on use. |
| Account/auth UI | Intentionally hidden | `/account`, `/login`, and `/signup` are not routed; no active navigation links to them. Source files remain. |
| Habit management | Missing | No habit model, service, store, route, navigation item, or UI exists. |
| Light/dark-only theme policy | Missing / pending | Current code supports `light`, `dark`, and `system`; the decision requires removing `system`. |
| Data export/import/migration | Missing | No export, import, schema version, or migration path exists. |
| Automated tests | Limited | 14 unit tests cover workout helpers, including status recounting; no routing, store, persistence, or theme tests. |

### Verification Performed

- `npm test` — 14 tests passed.
- `npm run lint` — passed.
- `npm run build` — passed; production bundle emitted with a chunk-size warning.
- Live smoke test — active navigation showed Home, Analytics, and Library; `/account`, `/login`, and `/signup` resolved to the 404 page.
- Theme toggle smoke test — the control appeared in the Home, Analytics, and Library headers; it switched Light/Dark immediately, updated its accessible label, and persisted the choice to `fitency-theme`.
- Source inspection — all status claims above were checked against the current files.

### Requires Verification Before Future Work

- Whether analytics should count unsaved suggested workouts as planned days.
- What “relevant” means for displaying the future New Habit FAB.
- Whether a future backend or data migration will replace the current local persistence model.
- Whether hidden account/auth features will be reactivated, and under what security requirements.

---

## 3. Functional Requirements

### 3.1 Home and Daily Workout Tracking

- **FR-HOME-01 — Suggested weekday session:** A date without a saved record resolves to the weekday template: Monday Chest, Tuesday Back, Wednesday Legs, Thursday Shoulders, Friday Arms, Saturday Core, Sunday Full Body.
- **FR-HOME-02 — Date navigation:** The Home screen provides a 15-day date strip, previous/next two-week controls, a “Today” shortcut, and a jump-to-date input.
- **FR-HOME-03 — Per-set rep recording:** Each exercise shows an input for every target set. Enter or blur commits the value; values are clamped to whole numbers from 0 to 999.
- **FR-HOME-04 — Derived completion status:** An exercise is completed when every target set meets the target reps, partial when some reps are recorded, and not completed when no reps are recorded.
- **FR-HOME-05 — Manual status override:** The user can override the derived status with Completed, Partially completed, or Not completed, or return to automatic status.
- **FR-HOME-06 — Workout replacement:** The user can choose a template or a rest day. Replacing a saved workout requires confirmation because recorded reps and exercise edits are cleared.
- **FR-HOME-07 — Custom exercises:** The user can add an exercise with name, muscles worked, equipment, target sets, target reps, and optional weight; existing custom exercises can be edited or removed. Removing an exercise requires confirmation.
- **FR-HOME-08 — Rest-day conversion:** Adding the first exercise to a rest day converts the day into a custom full-body session.
- **FR-HOME-09 — Exercise details:** The user can open details for instructions, breathing guidance, common mistakes, and safety notes. Custom exercises may have empty detail lists.
- **FR-HOME-10 — Summary and streak:** The page shows rep progress, exercise counts by status, current workout streak, and a week/month/year progress summary.
- **FR-HOME-11 — Saved versus suggested state:** A suggested workout is labelled “Suggested” until the user records or saves changes.

### 3.2 Workout Library

- **FR-LIB-01 — Template catalogue:** Seven pre-filled templates are listed with category, focus, exercise count, and target totals.
- **FR-LIB-02 — Template details:** Each template can be expanded to view exercise targets, equipment, difficulty, weight guidance, instructions, breathing, mistakes, and safety notes.
- **FR-LIB-03 — Add to date:** A template can be copied to a chosen date. The copy is independent of the template and of other dates.
- **FR-LIB-04 — Replacement warning:** If the selected date already has a saved workout, the UI warns that adding the template will replace it. The current flow does not present a second confirmation dialog.

### 3.3 Analytics

- **FR-AN-01 — Range selection:** Analytics supports Week, Month, and Year ranges.
- **FR-AN-02 — Summary metrics:** The summary reports workout completion, exercises completed, reps completed versus planned, current streak, and best streak.
- **FR-AN-03 — Consistency heatmap:** A calendar heatmap is shown for week/month ranges and a contribution-style heatmap for the year range. Days can be opened for detail.
- **FR-AN-04 — Completion trend:** A line chart shows daily exercise-completion percentages, with a text summary for assistive technology.
- **FR-AN-05 — Workout breakdown:** Completion is grouped by workout category.
- **FR-AN-06 — History:** Up to 10 saved sessions in the selected range are shown, including partial workouts and per-exercise recorded reps.
- **FR-AN-07 — Empty state:** Analytics shows an empty state until at least one saved record contains recorded reps or a status override.
- **FR-AN-08 — Planned-day semantics:** Analytics resolves unsaved dates through the weekday template. Those suggested days currently contribute to planned-day and planned-exercise totals.

### 3.4 Account and Authentication

- Account and authentication are not active features.
- Login, Sign Up, and Account pages are retained in source but are not routed.
- No active buttons, links, or navigation items lead to those pages.
- Direct visits to `/account`, `/login`, or `/signup` show the 404 page.
- A local device profile is still created automatically for greetings and user-scoped storage.

### 3.5 Habit Functionality

No habit functionality is implemented. See [Habit Management](#9-habit-management) for the current state and the confirmed future direction.

---

## 4. User Flows

### 4.1 Application Start

1. The browser loads the app shell.
2. The bootstrap layer resolves a local profile: the active local session, the most recently saved local account, or a new profile named “You”.
3. The app shell renders the sidebar on desktop or the bottom tab bar on mobile.
4. Home loads saved workout records and the tracking start date.
5. Loading skeletons are shown while data is pending; a retryable error is shown if storage or profile loading fails.

### 4.2 Record a Workout

1. Open Home, which selects today by default.
2. If no saved record exists, the weekday’s suggested workout is shown.
3. Enter actual reps for each set using the per-set inputs.
4. Blur or press Enter to commit a value.
5. The exercise status updates automatically unless a manual override is set.
6. The workout summary, date-strip indicator, streak, and analytics data update from the saved records.

### 4.3 Change a Workout or Plan a Rest Day

1. Select “Change” on the workout summary, or “Choose workout” when no plan exists.
2. Choose a template or Rest day from the picker.
3. If the date already has a saved record, confirm replacement.
4. The selected plan is applied to that date only.

### 4.4 Add, Edit, or Remove a Custom Exercise

1. Select “Add exercise” from Home.
2. Complete the exercise form, including target sets and reps.
3. Save to add the exercise to the selected day.
4. Use “Edit” to change an existing exercise; target-set changes preserve existing rep entries where possible and pad new sets with zero.
5. Use “Remove” and confirm to delete the exercise and its recorded reps from that day.

### 4.5 Add a Library Template

1. Open Library.
2. Select a template card.
3. Review the exercise details.
4. Choose the destination date.
5. Select “Add workout” or “Replace workout”.
6. The app navigates to Home for that date and attempts to save the new workout.

### 4.6 Review Analytics

1. Open Analytics.
2. Choose Week, Month, or Year.
3. Review summary metrics, heatmap, trend, breakdown, and history.
4. Select an eligible heatmap day to open its detail sheet.

### 4.7 Access Removed Account Pages

1. No active UI exposes Login, Sign Up, or Account.
2. Entering `/account`, `/login`, or `/signup` directly shows “Page not found”.
3. The preserved source components can only become reachable again through an explicit routing change.

---

## 5. UI/UX Requirements

### 5.1 Layout and Navigation

- Responsive application shell with a maximum content width of `max-w-3xl` inside a `max-w-6xl` shell.
- Desktop: persistent left sidebar at `md` and above.
- Mobile: fixed bottom tab bar below `md`, with three evenly sized destinations.
- Active destinations: Home, Analytics, Library.
- No global footer exists.
- Page headers use a consistent title and optional description.
- Main content includes bottom padding to avoid overlap with the mobile tab bar.

### 5.2 Visual Design

- Neon green palette with a vivid green primary accent in both light and dark modes.
- Token-based colours for background, elevated surfaces, cards, borders, text, destructive states, exercise statuses, charts, and sidebar.
- Subtle layered gradients on page backgrounds, cards, headers, the sidebar, and bottom navigation, using a restrained primary tint and faint green glows.
- Primary actions and selected states use a soft neon green gradient with light elevation; status surfaces use low-opacity done, partial, not-done, and information tints.
- Typography: Roboto for body text and Roboto Condensed for headings.
- Rounded cards, pill controls, soft shadows, and compact data displays.
- Lightweight hover, focus, page entrance, and content entrance motion implemented with CSS transitions and keyframes.
- shadcn/Radix-style primitives, with responsive dialogs and bottom sheets.
- The existing logo/favicon and visual identity must be preserved unless an explicit design change is requested.

### 5.3 Feedback and States

- Loading skeletons for Home, Library, and Analytics.
- Retryable error panels for failed data or profile loading.
- Empty states for no workout plan, no analytics data, no history, and no template exercises.
- Success and error toasts for workout, exercise, and library actions.
- Confirmation dialogs for replacing a Home workout and removing an exercise.
- Focus restoration after closing dialogs and sheets.

### 5.4 Accessibility

- Semantic landmarks, headings, lists, fieldsets, and labelled form controls.
- Visible focus rings on interactive controls.
- Progress bar semantics for the workout progress ring.
- Accessible labels for heatmap days and date-strip buttons.
- Chart figures include text summaries.
- Reduced-motion support disables non-essential animation.
- Known accessibility gaps remain for small touch targets and date-strip accessible names; see [Known Issues and Gaps](#11-known-issues-and-gaps).

### 5.5 Habit FAB Placement

- No New Habit button or floating action button currently exists.
- The confirmed future direction is a fixed, rounded, bottom-right FAB, displayed only on screens where habit creation is relevant.
- The FAB must not overlap the mobile bottom navigation or obscure primary controls.

---

## 6. Theme Management

### 6.1 Current Implementation

- Themes are expressed through CSS custom properties in `src/styles/index.css`.
- Light and dark token sets are defined; the dark theme is applied with a `.dark` class on the document root.
- The theme preference is stored under `fitency-theme`.
- An inline script in `index.html` applies the stored theme before first paint to prevent a flash.
- The theme provider persists changes and listens for operating-system theme changes while the theme is `system`.
- The current `Theme` type is `light | dark | system`; the default is `system`.
- A compact `ThemeToggle` in the Home greeting header and the shared page header (Analytics and Library) switches between Light and Dark. When the stored value is `system`, it resolves the current appearance and then stores an explicit choice.
- The toggle exposes a dynamic accessible label describing the next theme and remains keyboard accessible.

### 6.2 Target Policy

- The confirmed product direction is to support **Light and Dark only**.
- The `system` option and associated system-preference logic must be removed when that change is explicitly implemented.
- A default theme for users with no stored preference must be decided before implementation.
- Existing stored `system` values will require a defined migration or fallback.

### 6.3 Theme Requirements

- Theme changes must apply immediately and persist locally.
- The theme control must be available in the header on every active route.
- Both themes must retain accessible text and control contrast.
- Theme handling must not cause a flash of the wrong theme on load.
- Removing the System option must not break stored preferences or the initial theme bootstrap.

---

## 7. Navigation and Routing

### 7.1 Active Routes

| Path | Screen | Status |
|---|---|---|
| `/` | Home | Active |
| `/analytics` | Analytics | Active |
| `/library` | Workout library | Active |
| `*` | Not found | Active fallback |

### 7.2 Navigation

- Desktop sidebar: Home, Analytics, Library.
- Mobile bottom tab bar: Home, Analytics, Library.
- The mobile grid is configured for three items.
- Adding or removing a navigation item requires updating the mobile grid layout as well as `NAV_ITEMS`.

### 7.3 Hidden Account and Auth Routes

- `/account`, `/login`, and `/signup` are not registered and resolve to the 404 page.
- No active redirects send users to removed account pages.
- The preserved pages and related components remain in source:
  - `src/features/account/`
  - `src/features/auth/`
  - `src/store/auth-store.ts`
  - `src/lib/services/auth.ts`
  - `src/routes/require-auth.tsx`
  - `src/routes/public-only.tsx`
- The auth route guards are currently unreferenced by the active router.
- The local profile bootstrap remains active because the app needs a profile name and user-scoped storage key.

---

## 8. Data Management

### 8.1 Data Models

| Model | Important fields | Purpose |
|---|---|---|
| `User` | `id`, `name`, `email` | Local profile used for greeting and namespaced storage |
| `WorkoutRecord` | `date`, `templateId`, `name`, `category`, `focus`, `description`, `exercises`, `updatedAt` | One saved day of training |
| `WorkoutExercise` | Exercise details, `targetSets`, `targetReps`, `actualReps[]`, `statusOverride` | One exercise within a saved day |
| `WorkoutTemplate` | `id`, `name`, `category`, `focus`, `description`, `exercises` | Pre-filled library session |
| `WorkoutSettings` | `startDate` | First tracked day used for ranges and analytics |

A saved workout copies the template’s exercise details into the daily record. Editing a day does not mutate the library template or other dates.

### 8.2 Persistence

- Persistence uses browser `localStorage` only.
- Storage keys:
  - `fitency:auth`
  - `fitency:data:<userId>:workouts`
  - `fitency:data:<userId>:workout-settings`
  - `fitency-theme` (separate UI preference)
- The adapter validates parsed data against expected structures.
- Corrupted or structurally invalid data produces a user-facing error rather than being silently accepted.
- Workouts are loaded through `getWorkoutData()` and saved through `saveWorkoutRecord()`.
- Writes are serialised through a promise queue.
- The mock service layer adds a simulated 200–500 ms delay.
- Theme persistence is best-effort and independent of workout data.

### 8.3 Data Limitations

- No backend, API, database, or cross-device sync.
- No export, import, backup, restore, or account-level recovery.
- No schema version or migration mechanism.
- Clearing browser storage deletes the profile and all workout history.
- Full exercise details are copied into every daily record; there is no compaction. A manual measurement during review found roughly 4 KB per daily record, or about 1.4 MiB per year of daily use.
- Storage quotas and quota-exceeded states are not surfaced as usage information.
- The local auth service stores passwords in plaintext if account features are re-enabled without redesign.
- `deleteAccount()` removes workout collections but does not wait for the workout write queue.
- A save rollback can revert more than the failing date; see [Known Issues and Gaps](#11-known-issues-and-gaps).

---

## 9. Habit Management

### 9.1 Current State

Habit management is **not implemented**. There is no habit entity, schema, service, store, route, navigation item, list, check-in, edit form, delete flow, or habit-specific analytics.

The current product tracks workouts and workout streaks. A workout streak is not a general habit model.

### 9.2 Confirmed Future Direction

- A New Habit action must use a fixed, rounded, bottom-right floating action button.
- The FAB should appear only on screens where habit creation is relevant.
- The existing layout and visual system should be preserved.

### 9.3 Not Yet Specified

The following must be decided before implementation:

- Habit data model and storage shape.
- Whether habits are daily, weekly, custom-frequency, or one-off.
- Check-in behaviour and historical editing.
- Habit editing and deletion rules.
- Whether archived/deleted habits retain history.
- Relationship between habits, workouts, streaks, and analytics.
- Definition of “relevant” for FAB visibility.
- Empty, loading, error, and offline states for habit screens.

No habit requirements should be treated as implemented until code exists and is verified.

---

## 10. Non-Functional Requirements

### 10.1 Accessibility

- Maintain semantic HTML and labelled controls.
- Preserve keyboard access and visible focus states.
- Keep text alternatives for charts and icon-only controls.
- Meet target sizes suitable for touch; current known gaps include 12 px heatmap cells and some 32–36 px controls.
- Ensure accessible names include visible label text; the date strip currently has a verified mismatch.
- Preserve reduced-motion behaviour.
- Test theme contrast in both Light and Dark modes.

### 10.2 Responsiveness

- Support desktop sidebar and mobile bottom navigation.
- Keep forms usable on small screens, including full-height mobile dialogs.
- Avoid horizontal overflow except where intentionally scrollable, such as the date strip and year heatmap.
- Account for safe-area insets on mobile.

### 10.3 Maintainability

- Keep feature code under `src/features/`, shared UI under `src/components/`, services under `src/lib/services/`, and state under `src/store/`.
- Use the `@/` path alias.
- Preserve the service-layer seam so a backend can replace the local adapter without changing components.
- Avoid duplicating workout logic outside `src/lib/utils/workouts.ts`.
- Keep hidden account/auth source available rather than deleting it.

### 10.4 Performance

- Current production build: approximately 957.75 kB JavaScript (290.91 kB gzip), with Vite reporting a chunk larger than 500 kB.
- All active routes are imported eagerly.
- Analytics brings in Recharts in the main bundle.
- Font imports include multiple Roboto and Roboto Condensed subsets and both woff/woff2 output.
- Future work should consider route-level code splitting, Latin-only font imports, and avoiding unnecessary runtime dependencies.

### 10.5 Reliability

- Workout saves are optimistic.
- Home persistence calls are currently fire-and-forget, and success toasts can appear before persistence resolves.
- The write queue serialises storage writes but does not eliminate stale rollback behaviour.
- There is no retry queue, conflict resolution, or background sync.
- Tests cover workout helpers but not storage, store rollback, routing, theme, or account hiding.

### 10.6 Compatibility

- Requires a modern browser with `localStorage` and `crypto.randomUUID()`.
- The README declares Node.js `^20.19.0` or `>=22.12.0`; dependency engine compatibility should be verified before relying on the lower bound.

---

## 11. Known Issues and Gaps

| Severity | Issue | Evidence / impact | Status |
|---|---|---|---|
| High | Store rollback can discard another date’s optimistic save | `saveWorkout` restores a whole-state snapshot when a save fails; concurrent saves for different dates can be lost from the UI. | Verified by source inspection |
| High | Save success is reported before persistence completes | Home calls `void saveWorkout(...)` and shows success immediately; rapid edits queue behind 200–500 ms delays. | Verified by source inspection |
| High | No backup, export, import, schema version, or migration | All history is device-local and can be lost by clearing storage or changing origin. | Verified |
| High | Plaintext passwords if auth is re-enabled | `StoredUser` contains `password`; service-level password policy is weaker than the form schema. | Verified; auth currently hidden |
| Medium | Date context can become stale across midnight | Home’s selected date and `todayKey` are not refreshed by a timer or visibility event; an app left open can record to the previous day. | Verified by source inspection |
| Medium | Analytics includes unsaved suggested weekdays | `aggregateStats`, heatmap, trend, and breakdown use `resolveWorkout`, which falls back to templates. Copy says figures come from recorded reps/statuses. | Verified; product semantics need confirmation |
| Medium | Library replacement lacks a confirmation step | Template sheet warns about replacement and then adds immediately when the button is pressed. | Verified |
| Medium | System theme still supported despite Light/Dark-only decision | `Theme` includes `system`; provider listens to OS changes; picker lists System. | Verified; change pending |
| Medium | Accessibility target and label issues | Date-strip accessible names do not contain visible text on 15 buttons; year heatmap cells are 12 px; some exercise controls are below recommended touch size. | Verified by live audit/source |
| Medium | Bundle and font payload are large | Build warning for >500 kB chunk; eager routes and all font subsets included. | Verified by build |
| Medium | Test coverage omits critical workflows | Only 14 helper tests exist; no persistence, rollback, routing, midnight, or theme tests. | Verified |
| Low | Home empty-state branch is effectively unreachable | Every valid weekday maps to a template, so the “No workout planned” branch rarely appears in normal use. | Verified by source |
| Low | Stale README API names | README refers to `getWorkouts()`/`saveWorkout()` while actual services are `getWorkoutData()`/`saveWorkoutRecord()`. | Documentation gap |
| Low | Possible Node engine mismatch | README supports Node 20, while an installed dependency may require Node 22 or newer. | Needs verification |

---

## 12. Future Improvements

### 12.1 Already Implemented

Do not re-plan these as future work:

- Fitency branding across the application shell, title, metadata, loader, and README.
- Removal of Account, Login, and Sign Up from the active navigation and routing.
- Preservation of account/auth components in source.
- Three-item responsive navigation.
- Compact Light/Dark theme toggle in the header on every active route.
- Local profile bootstrap for normal application operation.

### 12.2 Confirmed but Not Implemented

These are agreed directions, not completed features:

- Light and Dark themes only; remove the System option and associated logic.
- A fixed, rounded, bottom-right New Habit FAB, displayed only where relevant.
- Habit creation, tracking, editing, and deletion.

### 12.3 Proposed Enhancements

These require explicit approval before implementation:

- Fix save/rollback correctness and make save feedback await persistence.
- Add versioned data, export/import, and migration support.
- Refresh “today” automatically across midnight and visibility changes.
- Resolve analytics semantics for unsaved suggested days.
- Add a confirmation or undo step before replacing a Library workout.
- Lazy-load Analytics, subset fonts to Latin, and evaluate chunk splitting.
- Improve touch targets and date-strip accessible names.
- Add integration tests for persistence, rollback, routing, date rollover, and theme behaviour.
- Introduce a backend only if cross-device sync and account recovery become explicit requirements.

---

## 13. Document Maintenance

- Update this PRD when a feature is added, removed, or its verified status changes.
- Do not mark a pending decision as implemented without source code and a successful verification pass.
- Keep product requirements here and architectural/process constraints in `docs/decision.md`.
- Re-run tests, lint, and build after implementation changes; update the verification section with the date.
