# Fitency — Architecture and Product Decisions

**Document type:** Decision and constraint reference  
**Last verified:** 2026-10-23  
**Application:** Fitency (`frontend/`)  
**Companion document:** `docs/PRD.md`

This document records established decisions, their implementation status, and the boundaries future work must respect. Product behaviour is described in the PRD; this document explains what has been decided and what must not change without explicit approval.

## Status Key

| Status | Meaning |
|---|---|
| **Confirmed** | Agreed direction or constraint; not necessarily implemented. |
| **Implemented** | Present in the current source and verified in the active application. |
| **Pending** | Confirmed decision that has not been implemented. |
| **Needs Verification** | Evidence or a required product decision is still missing. |

## Decision Summary

| ID | Decision | Status |
|---|---|---|
| D-01 | Application identity is Fitency | Implemented |
| D-02 | Changes are limited to this application | Confirmed |
| D-03 | Preserve the existing UI and design system | Confirmed |
| D-04 | New Habit uses a fixed bottom-right FAB | Pending |
| D-05 | Support Light and Dark themes only | Pending |
| D-06 | Account, Login, and Sign Up remain hidden but preserved | Implemented |
| D-07 | Active navigation and routing exclude account features | Implemented |
| D-08 | Persistence remains local and service-backed | Implemented |
| D-09 | Technical stack and conventions are fixed unless reopened | Confirmed |
| D-10 | Implementation boundaries require approval before expansion | Confirmed |
| D-11 | Open product and architecture questions remain | Needs Verification |

---

## D-01 — Application Identity

**Status: Implemented**

### Decision

The application is named **Fitency**. Use “Fitency” for visible product branding, browser metadata, documentation, and user-facing copy.

Do not use the former “Everyday” name in application branding.

### Current Evidence

- `frontend/index.html` uses `<title>Fitency</title>` and a Fitency application name/description.
- `frontend/src/components/layout/sidebar.tsx` displays “Fitency”.
- `frontend/src/components/full-page-loader.tsx` uses “Loading Fitency…”.
- `frontend/README.md` is titled “Fitency”.
- Storage keys already use the `fitency` namespace.

### Constraints

- Preserve the current logo and visual identity.
- The npm package name `frontend` is a technical package identifier, not product branding; it does not need to change for UI consistency.
- New user-facing copy must use “Fitency”.
- Maintain the existing `fitency:*` storage prefix to avoid breaking saved data.

---

## D-02 — Scope

**Status: Confirmed**

### Decision

All changes apply exclusively to the Fitency application in this repository.

### Constraints

- Modify only `frontend/` and the two files under `docs/`.
- Do not alter any other application, repository, or unrelated tooling.
- Do not introduce a second app, duplicate source tree, or unrelated package.
- When a change affects shared tooling, verify that it is still required only for Fitency.

---

## D-03 — Design Preservation

**Status: Confirmed**

### Decision

Preserve the existing UI, layout, visual language, and design system unless a change is explicitly requested and approved.

### Current Design Baseline

- Tailwind CSS tokens and shadcn/Radix primitives.
- Neon green palette with a vivid green primary accent in light and dark modes.
- Subtle surface gradients on the page background, cards, headers, sidebar, and bottom navigation.
- Roboto body text and Roboto Condensed headings.
- Desktop sidebar, mobile bottom tab bar.
- Rounded cards, soft shadows, compact analytics cards, responsive dialogs and bottom sheets.
- Light and dark token sets in `src/styles/index.css`.
- CSS-only hover, focus, entrance, and state transitions, reduced under `prefers-reduced-motion`.

### Constraints

- Do not restyle existing screens as part of unrelated work.
- Do not replace the component library or icon set without approval.
- New UI must reuse existing tokens, spacing, typography, and interaction patterns.
- Preserve responsive behaviour and safe-area handling.
- Preserve the current logo/favicon.

---

## D-04 — Habit Creation Button

**Status: Pending**

### Decision

The **New Habit** action must be presented as a fixed, rounded, bottom-right floating action button (FAB), displayed only where habit creation is relevant.

### Current State

- No habit feature exists.
- There is no habit model, service, store, route, navigation item, list, create form, edit flow, or delete flow.
- No New Habit button exists anywhere in the source.
- A repository-wide search for “habit” returned no matches in application code.

### Constraints for Implementation

- Use a single fixed FAB at the bottom-right, not an inline primary button, unless the decision is explicitly revised.
- Hide the FAB on screens where habit creation is not relevant.
- Keep the FAB clear of the mobile bottom tab bar and safe-area inset.
- Provide an accessible name and visible focus state.
- Do not place the FAB where it obscures workout controls or analytics content.
- Do not implement habit functionality until the habit data model and workflows are agreed.

### Open Question

“Displayed only where relevant” has not been defined. The exact screens and the relationship between habits and workouts must be decided first.

---

## D-05 — Theme System

**Status: Pending**

### Decision

Support **Light** and **Dark** themes only. Remove the **System** option and its associated logic.

### Current Implementation

Contrary to the confirmed target, the current source still supports three values:

- `Theme = "light" | "dark" | "system"` in `src/components/theme/theme-storage.ts`.
- Default theme is `system` when no preference is stored.
- `ThemeProvider` listens for `prefers-color-scheme` changes while the theme is `system`.
- `ThemeSelect` includes a System option.
- The inline theme bootstrap in `index.html` treats missing or `system` values as device-driven.
- A compact `ThemeToggle` in the Home greeting header and the shared page header switches between Light and Dark. When the stored value is `system`, the toggle uses the current appearance and stores an explicit Light or Dark choice.

### Constraints

- Remove the System option from the selector, type, storage resolution, and provider listener when implementing this decision.
- Preserve the pre-paint theme bootstrap so the app does not flash the wrong theme.
- Define a deterministic default for users with no stored preference.
- Define how existing stored `system` values migrate or fall back; do not leave an unsupported value in storage without handling.
- Keep both Light and Dark token sets and verify contrast in both.
- Keep the compact header toggle as the primary Light/Dark control on all active routes; do not reactivate the Account page as a settings surface.

### Status Rationale

The decision is confirmed, but implementation is pending. The current code must not be described as Light/Dark-only.

---

## D-06 — Account Features

**Status: Implemented**

### Decision

Login, Sign Up, and Account must remain hidden from the active application while their existing components and source files are preserved for potential future reactivation.

### Current Implementation

- The Account navigation item was removed from `src/components/layout/nav-items.ts`.
- The `/account` route and `AccountPage` import were removed from `src/routes/app-routes.tsx`.
- Login and Sign Up were already unrouted.
- Direct visits to `/account`, `/login`, and `/signup` show the 404 page.
- No active navigation or page links to those routes.
- The mobile navigation was reduced from four columns to three.

### Preserved Source

- `src/features/account/`
- `src/features/auth/`
- `src/store/auth-store.ts`
- `src/lib/services/auth.ts`
- `src/lib/schemas.ts` auth/account schemas
- `src/routes/require-auth.tsx`
- `src/routes/public-only.tsx`

### Important Distinction

The application still creates and uses a local device profile for normal operation. That profile supplies the greeting name and the user ID used to namespace workout storage. This internal bootstrap is not an active account feature and must not be confused with the hidden Login, Sign Up, and Account screens.

### Constraints

- Do not delete preserved account/auth files.
- Do not add account links, account navigation, or account redirects without explicit approval.
- Do not present the local profile as an online account.
- If auth is reactivated, complete a security review first; the current mock service stores plaintext passwords.
- Any future reactivation must explicitly wire routes, navigation, and guards.

---

## D-07 — Routing and Navigation

**Status: Implemented**

### Decision

The active application exposes only Home, Analytics, Library, and the 404 fallback. Account-related URLs are not routed.

### Active Configuration

| Path | Screen |
|---|---|
| `/` | Home |
| `/analytics` | Analytics |
| `/library` | Library |
| `*` | 404 |

Navigation contains exactly three items on desktop and three items on mobile.

### Constraints

- Do not add inactive destinations to `NAV_ITEMS`.
- Do not add redirects to `/account`, `/login`, or `/signup`.
- Preserve the 404 fallback for unknown paths.
- Keep desktop sidebar and mobile tab destinations in sync.
- The mobile grid currently uses a fixed three-column layout. If the navigation count changes, update the layout deliberately.
- Hidden auth guards must remain unreferenced unless reactivation is approved.
- The active app must not rely on `/login` for startup; the local-profile bootstrap is the supported startup path.

### Current URL Behaviour

Removed account URLs return the 404 page rather than redirecting to Home. Changing that behaviour requires an explicit routing decision.

---

## D-08 — Data Persistence

**Status: Implemented**

### Decision

The current application remains a local-first frontend using the existing service layer and browser `localStorage`. Components and stores must not access storage directly.

### Current Architecture

- `src/lib/services/storage.ts` is the only localStorage adapter.
- `src/lib/services/workouts.ts` loads and saves workout data through a serialised write queue.
- `src/lib/services/auth.ts` resolves the local profile and namespaces user data.
- `src/store/workouts-store.ts` performs optimistic state updates.
- `src/store/auth-store.ts` loads the local profile and retains preserved auth actions.
- UI state and theme preference are stored separately from workout data.

### Storage Keys

- `fitency:auth`
- `fitency:data:<userId>:workouts`
- `fitency:data:<userId>:workout-settings`
- `fitency-theme`

### Confirmed Limitations

- No backend, API, sync, or cross-device recovery.
- No export, import, schema version, or migration.
- No quota-usage UI or quota-recovery flow.
- Corrupted data produces an error instead of partial recovery.
- Passwords are plaintext in the local mock auth store.
- A failed optimistic save can roll back a whole-state snapshot and discard another date’s later record from the UI.
- No test currently protects persistence, rollback, or migration behaviour.

### Constraints

- Keep all data access behind `src/lib/services/`.
- Preserve existing storage keys unless a migration is provided.
- Do not change the `WorkoutRecord`/`WorkoutExercise` shape without a versioned migration plan and backward-compatibility handling.
- Do not add a backend as an incidental part of a UI change.
- Any backend adoption must preserve the service signatures where practical or include a deliberate migration.
- Do not claim data is saved until the persistence promise resolves successfully.

---

## D-09 — Technical Constraints

**Status: Confirmed**

### Verified Stack

| Area | Current choice |
|---|---|
| UI framework | React 19.3 |
| Build tool | Vite 8.3 |
| Language | TypeScript 6.0, strict mode |
| Routing | React Router 8.5 |
| State | Zustand 5 |
| Styling | Tailwind CSS 4.3, shadcn/Radix primitives |
| Forms and validation | React Hook Form 7.90, Zod 4.6 |
| Charts | Recharts 3.10 |
| Dates | date-fns 4.4 |
| Feedback | Sonner |
| Mobile sheets | Vaul |
| Tests | Vitest 5.0 |

### Architectural Conventions

- `src/features/` — route-level features and feature-specific components.
- `src/components/` — shared components and UI primitives.
- `src/lib/services/` — data access and storage adapter.
- `src/lib/utils/` — pure workout, date, and statistics helpers.
- `src/store/` — Zustand stores.
- `src/routes/` — router, bootstrap, guards, and fallback.
- `@/` alias maps to `src/`.
- Prettier: no semicolons, double quotes, trailing commas.
- TypeScript is strict; unused locals/parameters are rejected.
- ESLint and Vitest have configured scripts.

### Environment

- README declares Node.js `^20.19.0` or `>=22.12.0`.
- A dependency engine mismatch at the lower Node bound needs verification before Node 20 can be treated as supported.
- The app requires browser `localStorage` and `crypto.randomUUID()`.

### Known Build Constraint

The production JavaScript bundle is approximately 957.75 kB raw / 290.91 kB gzip and triggers Vite’s >500 kB warning. Reducing it is an approved improvement area, not a completed change.

### Constraints

- Do not add dependencies without a clear product or engineering need.
- Do not replace Tailwind, shadcn/Radix, Zustand, React Router, or the test runner as part of unrelated work.
- Keep TypeScript, lint, and tests passing.
- Preserve the `@/` alias and existing folder boundaries.

---

## D-10 — Implementation Boundaries

**Status: Confirmed**

### Must Remain Unchanged Without Explicit Approval

- Fitency branding and preserved visual identity.
- Existing page layouts and responsive navigation patterns.
- The three active routes and the 404 fallback.
- Account/auth source preservation.
- Existing localStorage keys and data shape.
- The service-layer boundary.
- Workout calculations in `src/lib/utils/workouts.ts`.
- Current dependency choices and design tokens.

### Changes That Require a Separate Approved Task

- Implementing Light/Dark-only themes and removing System.
- Adding habit functionality or the New Habit FAB.
- Re-enabling Login, Sign Up, Account, or auth guards.
- Changing analytics semantics for suggested days.
- Changing persistence, storage schema, or adding a backend.
- Adding new navigation destinations.
- Large visual redesigns or component-library replacements.
- Adding a data export/import feature.

### Required Checks for Future Changes

- Run `npm test`, `npm run lint`, and `npm run build`.
- Verify active navigation and routing.
- Verify hidden pages remain unreachable.
- Verify both Light and Dark themes after any theme change.
- Verify mobile and desktop layouts.
- Re-check accessibility for changed controls.
- Update the PRD and this decision document when behaviour or constraints change.

---

## D-11 — Unresolved Decisions

**Status: Needs Verification**

The following questions are intentionally left open. Do not infer answers from the current implementation.

### Habit Product Model

- What is a habit in Fitency: a recurring action, a workout-derived streak, or a separate check-in object?
- Are habits daily, weekly, custom-frequency, or one-off?
- Can users create, edit, archive, and delete habits?
- Is historical habit data preserved after deletion?
- How do habits relate to workouts, streaks, and analytics?
- What screens count as “relevant” for the New Habit FAB?

### Theme

- What is the default theme when no preference exists after System is removed?
- How should stored `system` values be migrated?

### Analytics

- Should unsaved suggested weekdays count as planned days?
- If not, should suggested workouts remain visible on Home but be excluded from analytics?
- Should the analytics copy change if current planned-day semantics remain?

### Persistence and Data Safety

- Is export/import required before the app is considered production-ready?
- Is a schema version and migration strategy required for the next data-model change?
- Is a backend planned, and if so, what is the migration path from localStorage?
- Should old `/account` bookmarks redirect to Home instead of showing 404?

### Account Re-enablement

- Will auth be re-enabled, and for what user benefit?
- What password storage and authentication design is required before reactivation?
- Should the local profile remain invisible permanently, or eventually become editable through another approved surface?

### Platform Compatibility

- Which Node versions must actually be supported, given the declared README range and dependency engine requirements?
- Which browsers and minimum versions are supported?
