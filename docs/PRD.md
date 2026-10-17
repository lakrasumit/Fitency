# Fitency — Frontend Product Requirements Document (PRD)

| | |
|---|---|
| **Status** | Draft for review |
| **Version** | 0.1 |
| **Date** | 2026-10-18 |
| **Owner** | Frontend (Sarfarosh) |
| **Scope** | **Frontend only** |
| **Related docs** | [`DESIGN.md`](./DESIGN.md) · [`decisions.md`](./decisions.md) |

> **Scope boundary.** This document describes the **frontend web application only**. Backend development, database design, server-side logic, API implementation, and authentication implementation are explicitly **out of scope** and are owned by a separate developer. The backend is consumed exclusively through a single frontend API seam (`lib/api`) that is **mocked** until the real contract is provided.

---

## 1. Product overview

**Fitency** is a mobile-first habit-tracking web application. The user maintains a daily checklist of habits, receives light-hearted "honest" feedback, reviews analytics, and progresses through a gamified level system.

The visual source of truth is the Figma Community *"Habit Tracker App UI Kit"* (see `DESIGN.md`).

### 1.1 Frontend objectives

1. Deliver a complete, production-ready frontend for the four core screens (Home, Analytics, New Habit, Rewards).
2. Provide clear **loading, empty, and error** states for every list and form.
3. Be **responsive** (mobile-first with adaptive desktop layouts proposed by the frontend team).
4. Meet **WCAG 2.1 AA** accessibility.
5. Integrate with a separately-built backend through **one swappable API seam** (`lib/api`) with mock data.
6. Keep the codebase typed, lint-clean, and maintainable.

### 1.2 Non-objectives (v1)

- Backend, database, server logic, and authentication implementation.
- Native iOS widgets.
- Push notifications.
- Profile and authentication screens.
- Habit detail / edit / delete.
- Badges "View all" page.
- Automated testing (accepted risk — see `decisions.md` D-23).
- Light theme (dark is the default theme; see D-12/D-14).

---

## 2. Target users and needs

| | |
|---|---|
| **Primary user** | A person building better daily habits who wants fast logging and honest, slightly humorous feedback. |
| **Device context** | Primarily mobile web (phone browser), with a subset using tablet/desktop. |
| **Needs** | (1) Log today's habits quickly. (2) Understand consistency honestly. (3) Feel motivated via levels. (4) Create a habit in under a minute. |
| **Usability expectations** | Large tap targets, one-hand reachability, instant feedback, clear state on every action. |

---

## 3. Scope

### 3.1 In scope (v1)

- **Home** `/` — daily checklist
- **Analytics** `/analytics` — Overview only
- **New Habit** `/habits/new`
- **Rewards** `/rewards`
- Shared navigation (3 tabs + FAB), page headers, global toasts, error boundary, 404
- Loading / empty / error states for all lists and forms

### 3.2 Out of scope (v1)

- Profile screen · Authentication UI · Habit detail/edit/delete · Badges "View all" · Notifications · iOS widgets · Dark↔light toggle · PWA/offline support · Internationalization · Automated tests

### 3.3 Assumptions

1. The app is used by an authenticated user, but **auth UI is not part of v1**; during development the app runs against mock data.
2. The kit's placeholder copy is used as-is in v1 (product name: **Fitency**).
3. **Dark is the default (and only) theme** in v1.
4. The backend will expose the data described in §10 through HTTP; the frontend develops against mocks meanwhile.

### 3.4 Dependencies (owned externally)

See §10. These block **integration**, not the build.

---

## 4. Functional requirements

Requirement IDs: `FR-<AREA>-<n>`. "States" are mandatory UI states.

### 4.1 Home — Daily Checklist (`/`)

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-H-1 | Header **date selector** button showing the active date | Interaction (picker) undesigned → **Open item O-1** |
| FR-H-2 | **Calendar** icon button (36px, radius 12) | Opens date selection → **Open item O-1** |
| FR-H-3 | Title block: H1 "Today's Ambitions" + tagline | Static copy |
| FR-H-4 | **Category filter pills**: All, Morning, Afternoon, Evening, each with a count; single-select; filters the list | Counts are **data-dependent** (§10) |
| FR-H-5 | **Habit checklist**: one `HabitCard` per habit (icon tile, title, time label, reality pill, checkbox); whole row tappable to toggle | |
| FR-H-6 | **Reality pill** text + color per habit | Text is **data-dependent** (§10) |
| FR-H-7 | **Streak callout** card (flame tile, days, message); tappable | Destination undesigned → static in v1 |
| FR-H-8 | **States**: loading (skeleton), empty ("no habits" + CTA to New Habit), error (+ retry) | Required |

### 4.2 Analytics (`/analytics`)

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-A-1 | Header (H1 "Analytics" + subtitle) and **"This Week" dropdown pill** | Range menu undesigned → **Open item O-2** |
| FR-A-2 | **Segmented control**: Overview (active) · Habits · Patterns (**disabled**, "coming soon") | Others intentionally non-functional |
| FR-A-3 | **Habit heatmap**: label column + 7 day columns × 5 habit rows; cell states: productive, normal, struggled, missed, future; legend | |
| FR-A-4 | **Weekly summary** card: summary text + emoji + 3 metric tiles | |
| FR-A-5 | **Line chart** "Perceived Energy vs. Actual Coffee": two series, legend, y-gridlines 0/5/10, 7 x-labels, points, area fill | Custom SVG |
| FR-A-6 | **States**: loading, empty, error (+ retry) | Required |

### 4.3 New Habit (`/habits/new`)

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-N-1 | Header: back button + centered title + subtitle | No bottom nav |
| FR-N-2 | **Habit name** input with validation | See §5.2 |
| FR-N-3 | **Category** pill group (Health, Mind, Growth, Lifestyle); single-select; default Health | |
| FR-N-4 | **Difficulty** cards (Easy, Hard, Delusional); single-select; default Delusional per kit | |
| FR-N-5 | **Reality check banner** ("tried this N times this year") | N is **data-dependent** (§10) |
| FR-N-6 | **Remind me** toggle; when on, **Time** button (e.g. "8:00 AM") | Toggle-off behavior undesigned → v1 hides/disables Time row |
| FR-N-7 | **Repeat** day chips (Mon–Sun), multi-select | |
| FR-N-8 | **Primary CTA "Add Habit"**: validates, submits, shows loading, then navigates home + toast; on error shows inline + toast | |
| FR-N-9 | **States**: field validation errors, disabled/loading CTA, save error | Required |

### 4.4 Rewards (`/rewards`)

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-R-1 | Top bar: back button + title/subtitle + share icon | |
| FR-R-2 | **Current level card**: badge, "Level N", "XP / XP-to-next" (right), rank title, XP progress bar | |
| FR-R-3 | **Milestone stepper**: 4 nodes — completed, current, locked | |
| FR-R-4 | **Next level card**: "NEXT LEVEL" label, title, unlock condition, counter, progress bar | |
| FR-R-5 | **Achievement badges** grid (earned state) | Locked state undesigned → **Open item O-3**; "View all" out of scope (disabled/static) |
| FR-R-6 | **States**: loading, empty, error (+ retry) | Required |

### 4.5 Shared / global

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-S-1 | **Bottom navigation**: 3 tabs (Home, Analytics, Rewards) + centered **FAB**; active/inactive states | Profile tab removed (D-16) |
| FR-S-2 | **FAB** navigates to `/habits/new` | |
| FR-S-3 | **Route-level code splitting** with a loading fallback | |
| FR-S-4 | **Global toast layer** for action success/failure | |
| FR-S-5 | **Route error boundary** + **404** page | |
| FR-S-6 | **Offline** detection → graceful message | |

---

## 5. UI states, interactions, validation, error handling

### 5.1 States (apply to every data-driven view)

| State | Behavior |
|-------|----------|
| **Loading** | Skeleton placeholders matching final layout |
| **Empty** | Friendly message + primary action where applicable |
| **Error** | Inline message + **Retry** action |
| **Refetching** | Non-blocking subtle indicator (list stays visible) |
| **Offline** | Banner/inline notice; actions disabled or queued (no offline sync in v1) |

### 5.2 Form validation (New Habit)

| Field | Rule |
|-------|------|
| Habit name | Required; trimmed; 2–80 chars |
| Category | Required; single-select (default provided) |
| Difficulty | Required; single-select (default provided) |
| Reminder time | Required **only when** "Remind me" is on; valid time value |
| Repeat days | At least one day selected |

Validation is defined in **Zod** schemas shared with the mock API payloads.

### 5.3 Key interactions

- **Toggle habit**: optimistic UI update, then reconcile; triggers `progress`/`analytics` refresh.
- **Filter pills / segmented control**: instant, client-side.
- **Dropdowns** (date, range, time): behavior undesigned → see open items.
- **Buttons/cards**: visible focus, pressed state, disabled state.

---

## 6. Non-functional requirements

### 6.1 Responsive
- Mobile-first. Breakpoints: `sm 640`, `md 768`, `lg 1024`.
- Mobile: single column. `md+`: adaptive layouts (multi-column lists/grids) proposed by the frontend team and reviewed by the product owner.
- No horizontal overflow at any width; touch targets ≥ 44px.

### 6.2 Accessibility (WCAG 2.1 AA)
- Text ≥ 11px; contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text/UI.
- Visible focus indicators; full keyboard operability; logical focus order.
- Emoji/decorative icons `aria-hidden`; meaningful icons labeled.
- Form fields have programmatic labels; errors announced and linked.
- Respect `prefers-reduced-motion`.

### 6.3 Performance
- Route-level code splitting; chart code isolated to `/analytics`.
- Lighthouse performance ≥ 90 on mobile.
- No hardcoded colors (design tokens only); No layout shift on load.

### 6.4 Browser support
- Latest 2 versions of Chrome, Edge, Firefox, Safari. No legacy polyfills.

### 6.5 Maintainability
- TypeScript `strict`; ESLint + Prettier enforced.
- Components small, focused, colocated with styles; consistent naming.
- All data access through `lib/api`.

### 6.6 Internationalization / PWA
- English-only; user-facing strings centralized to allow future i18n.
- PWA/offline deferred to post-v1; architecture must not preclude it.

---

## 7. Frontend technology stack

Vite + React (SPA) · TypeScript · Tailwind CSS v4 · React Router v7 · custom hooks + Context (server state) · Context + `useReducer` (client state) · react-hook-form + zod · lucide-react · date-fns · sonner · custom SVG chart · npm · ESLint + Prettier. Full rationale in `decisions.md`; architecture in `DESIGN.md`.

---

## 8. Pages, user flows, and component map

### 8.1 Primary user flows
1. **Log today's habits**: open `/` → see checklist → toggle habits → see streak/summary update.
2. **Create a habit**: FAB from any tab → `/habits/new` → complete form → submit → toast → back to `/`.
3. **Review analytics**: tab to `/analytics` → view heatmap, summary, chart.
4. **Check progress**: tab to `/rewards` → view level, stepper, badges.

### 8.2 Component hierarchy
`tokens → ui primitives → composed components (nav / habits / analytics / rewards) → pages`. Full list in `DESIGN.md` §5.

---

## 9. Acceptance criteria

| Area | Acceptance |
|------|-----------|
| Home | Checklist renders from data; toggling a habit updates UI immediately and refreshes progress/analytics; filters work; loading/empty/error present |
| Analytics | Overview renders heatmap, summary tiles, and chart from data; non-designed tabs disabled; loading/empty/error present |
| New Habit | All fields validate per §5.2; invalid submit blocked with messages; valid submit shows loading then success (toast + navigation); failure shows inline + toast |
| Rewards | Level, stepper, next-level, and badges render from data; loading/empty/error present |
| Shared | Nav + FAB navigate correctly; toasts fire; 404 and error boundary work; no console errors |
| Responsive | Usable 320px→desktop; no horizontal scroll; adaptive layouts at `md+` |
| Accessibility | Keyboard-only completion of core flows; AA contrast verified; axe/manual audit clean |
| Quality | `tsc` clean; ESLint clean; build succeeds |

---

## 10. Backend integration dependencies (frontend requirements *on* the backend)

The frontend will build fully against mocks. The following must be supplied by the backend developer before integration. **Not invented here.**

| # | Dependency | Why the frontend needs it |
|---|------------|---------------------------|
| 1 | Auth model (token/cookie/OAuth) + how "logged-in" is detected + 401 handling | Attach credentials; redirect on expiry |
| 2 | Endpoint list + request/response shapes | Implement the `HttpApiClient` |
| 3 | Error response format | Map backend errors → user-facing messages |
| 4 | Base URL(s) / environments | Env configuration |
| 5 | Pagination / list semantics | Habit list & analytics fetching |
| 6 | CORS for dev origin | Local development |
| 7 | Data backing the **reality pills**, "tried N times" banner, streak/level/XP, heatmap statuses, chart values, and filter counts | Content the UI must display |

---

## 11. Open items

| ID | Item | Status |
|----|------|--------|
| O-1 | Date selector / calendar picker interaction | Undesigned — frontend to propose |
| O-2 | "This Week" range menu behavior | Undesigned — frontend to propose |
| O-3 | Locked / unearned badge state | Undesigned — frontend to propose |
| O-4 | Concrete dark palette values | **Proposed in `DESIGN.md` — pending review** |
| O-5 | Desktop layouts | **Proposed in `DESIGN.md` — pending review** |
| O-6 | Deployment/hosting target | Unknown |
| O-7 | Figma access + Community license check | Pending |
| O-8 | Final copy (placeholder used meanwhile) | Pending |
