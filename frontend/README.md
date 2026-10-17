# Fitency — Frontend

Mobile-first habit tracker. Dark-first, app-like single-page application.

Implements the finalized frontend scope from [`../docs/PRD.md`](../docs/PRD.md),
[`../docs/DESIGN.md`](../docs/DESIGN.md) and [`../docs/decisions.md`](../docs/decisions.md).

## Stack

| Concern | Choice | Decision |
|---|---|---|
| Build | Vite + React (SPA) | D-01 |
| Language | TypeScript (`strict`) | D-02 |
| Styling | Tailwind CSS v4 + semantic tokens | D-03, D-13 |
| Routing | React Router v7 (library mode) | D-04 |
| Server state | custom hooks + Context | D-05 |
| Client state | Context + `useReducer` | D-06 |
| Forms | react-hook-form + zod | D-07 |
| Icons / dates / toasts | lucide-react / date-fns / sonner | D-25 |
| Chart | custom SVG | D-17 |
| Lint / format | ESLint + Prettier, npm | D-24 |

## Scripts

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # tsc --noEmit && vite build
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run format     # prettier --write .
```

No configuration is required: the app runs entirely against the in-memory mock
API. Optional variables are documented in [`.env.example`](./.env.example).

## Structure

```
src/
  app/          App.tsx (providers + router) · router.tsx (lazy routes) · error boundary
  layouts/      TabLayout (bottom nav / sidebar rail) · SubPageLayout (pushed forms)
  pages/        home · analytics · habits/new · rewards · not-found
  components/   ui/ · nav/ · habits/ · analytics/ · rewards/ · feedback/
  state/        DataProvider (server slices) · ThemeProvider (dark-only seam)
  hooks/        useHabits · useAnalytics · useProgress · useToggleHabit · …
  lib/          api/ (seam, types, mock) · validation/ (zod) · utils/ · copy.ts
  styles/       tokens.css (design tokens) · globals.css (base + type scale)
```

Data flows in one direction:

```
lib/api (ApiClient) → DataProvider (slices + explicit invalidation) → feature hooks → components
```

## Routing

| Route | Layout | Page |
|---|---|---|
| `/` | `TabLayout` | Home — daily checklist |
| `/analytics` | `TabLayout` | Analytics — Overview only |
| `/rewards` | `TabLayout` | Rewards — leveling |
| `/habits/new` | `SubPageLayout` | New Habit (no bottom nav) |
| `*` | — | 404 |

Pages are `React.lazy` route chunks; the chart ships only in the analytics chunk.

## Design tokens

Every colour, radius, shadow and type size is a token in
`src/styles/tokens.css`, mapped onto Tailwind utilities. Components never use
literal colour values. Dark is the default **and only** theme (D-12/D-14); the
`@theme inline` mapping keeps a future light theme additive rather than a
rewrite.

## Accessibility

- WCAG 2.1 AA: ≥11px text, ≥44px targets, AA contrast on the dark palette.
- Semantic HTML first: the checklist uses a real checkbox inside a `<label>`,
  the heatmap is a `<table>`, toggles use `role="switch"`, and the chart exposes
  its numbers as a visually hidden table.
- Keyboard-complete: skip link, visible focus rings, listbox popovers with
  arrow/Home/End support and Escape-to-dismiss.
- `prefers-reduced-motion` is respected globally.

## Backend integration

The frontend talks to the backend through exactly one module — `src/lib/api` —
implemented today by an in-memory mock (`src/lib/api/mock`) with simulated
latency, abortable requests, validation on write and injectable failures
(`VITE_API_MOCK_FAIL`).

The `HttpApiClient` is **deliberately not implemented**: the endpoint shapes,
error format, auth model, base URL and pagination semantics are still pending
from the backend owner. See [INTEGRATION.md](./INTEGRATION.md) for the exact
dependency list and the swap procedure.
