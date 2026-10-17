# Fitency — Frontend Decision Log

| | |
|---|---|
| **Status** | Draft for review |
| **Date** | 2026-10-18 |
| **Scope** | Frontend only |
| **Related docs** | [`PRD.md`](./PRD.md) · [`DESIGN.md`](./DESIGN.md) |

This log records decisions **agreed during the frontend planning discussion**. Each entry lists the purpose, the alternatives considered, the final choice, the reasoning, and the trade-offs, constraints, and dependencies.

Status values: **Agreed** · **Resolved (clarified)** · **Open**.

---

## Summary

| ID | Decision | Status |
|----|----------|--------|
| D-01 | Framework: Vite + React (SPA) | Agreed |
| D-02 | Language: TypeScript | Agreed |
| D-03 | Styling: Tailwind CSS v4 | Agreed |
| D-04 | Routing: React Router v7 | Agreed |
| D-05 | Server state: custom hooks + Context | Agreed |
| D-06 | Client state: Context + useReducer | Agreed |
| D-07 | Forms: react-hook-form + zod | Agreed |
| D-08 | v1 scope: 4 designed pages only | Agreed |
| D-09 | Analytics: Overview only, other tabs disabled | Agreed |
| D-10 | Secondary surfaces out of v1 | Agreed |
| D-11 | Responsive: mobile-first + adaptive desktop | Agreed |
| D-12 | Theme: dark is the default theme | Resolved (clarified) |
| D-13 | Tokens: unified semantic set | Agreed |
| D-14 | Light theme not built in v1 | Agreed |
| D-15 | Copy: kit placeholders; name "Fitency" | Agreed |
| D-16 | Nav: 3 tabs + FAB (Profile removed) | Agreed |
| D-17 | Chart: custom SVG | Agreed |
| D-18 | Errors: inline + global toast | Agreed |
| D-19 | Accessibility: WCAG 2.1 AA | Agreed |
| D-20 | Browser support: modern evergreen | Agreed |
| D-21 | PWA/offline: deferred | Agreed |
| D-22 | i18n: English-only | Agreed |
| D-23 | Testing: none in v1 | Agreed |
| D-24 | Tooling: ESLint + Prettier; npm | Agreed |
| D-25 | Supporting libs: lucide-react, date-fns, sonner | Agreed |
| D-26 | Data mocking via `lib/api` seam | Agreed |
| D-27 | Deployment target | **Open** |

---

## D-01 — Framework: Vite + React (SPA)

- **Purpose:** Choose the application foundation.
- **Alternatives considered:** Next.js (App Router) — the stack named in the original `DESIGN.md`; Vite + React SPA.
- **Final choice:** **Vite + React (SPA)**.
- **Reasoning:** The app is an authenticated, app-like UI with **no SEO requirement**. SSR benefits are largely unused, while Next.js adds server/client boundaries and caching concepts. Vite + React is simpler, deploys as static assets anywhere, and matches the previously scaffolded stack.
- **Trade-offs / constraints:** No SSR (acceptable). Built-in Next.js conveniences (fonts, image optimization, loading/error files) must be provided manually.
- **Dependencies:** None. 

## D-02 — Language: TypeScript

- **Purpose:** Choose the source language.
- **Alternatives:** JavaScript (the original scaffold), TypeScript.
- **Final choice:** **TypeScript**, `strict` mode.
- **Reasoning:** The backend contract is undefined and will evolve; static types around `lib/api` reduce integration bugs. Industry standard for production React.
- **Trade-offs:** Slightly more upfront ceremony.
- **Dependencies:** None.

## D-03 — Styling: Tailwind CSS v4

- **Purpose:** Choose the styling approach.
- **Alternatives:** CSS Modules; CSS-in-JS (styled-components/Emotion); a component library (MUI/Ant); vanilla-extract/Panda.
- **Final choice:** **Tailwind CSS v4**, with design tokens exposed as CSS variables and mapped into the theme.
- **Reasoning:** Fast iteration, strong token enforcement across ~25 components, first-class responsive utilities for the mobile-first→desktop work. Component libraries were rejected because they would fight the bespoke kit; CSS-in-JS adds runtime for no gain here.
- **Trade-offs / constraints:** Verbose markup; discipline required to avoid one-off values (mitigated by tokens).
- **Dependencies:** Design tokens (D-13).

## D-04 — Routing: React Router v7

- **Purpose:** Choose client-side routing.
- **Alternatives:** TanStack Router; Wouter.
- **Final choice:** **React Router v7** (library mode).
- **Reasoning:** Ubiquitous, stable, well-documented; handles nested tab/sub-page layouts cleanly. TanStack Router offers better type-safety but a newer API; Wouter is too minimal for nested layouts.
- **Trade-offs:** Route params/search are less type-safe than TanStack Router.
- **Dependencies:** None.

## D-05 — Server state: custom hooks + Context

- **Purpose:** Decide how remote data is fetched, cached, and shared.
- **Alternatives:** TanStack Query; SWR; RTK Query; **custom hooks + Context**.
- **Final choice:** **Custom hooks + Context** (over the `lib/api` seam).
- **Reasoning:** Keeps the dependency count low and gives full control. Valid for a small app.
- **Trade-offs / constraints:** **No built-in cache** — caching, refetch, deduplication, and loading/error/empty states are hand-built. **Invalidation is explicit**: e.g. toggling a habit must refresh `progress`/`analytics`. This must be designed deliberately (see `DESIGN.md` §8) to avoid stale data and duplicate requests.
- **Dependencies:** `lib/api` (D-26).

## D-06 — Client state: Context + useReducer

- **Purpose:** Manage global client-side state (selected date, filters, theme).
- **Alternatives:** Zustand; Jotai; Redux Toolkit.
- **Final choice:** **Context + useReducer** (zero extra dependencies).
- **Reasoning:** Global client state is small; React's built-ins suffice. Redux Toolkit would be over-engineering.
- **Trade-offs:** Context re-render scope must be managed via split providers/memoization as state grows.
- **Dependencies:** None.

## D-07 — Forms: react-hook-form + zod

- **Purpose:** Form handling and validation.
- **Alternatives:** TanStack Form; Formik + yup; manual validation.
- **Final choice:** **react-hook-form + zod**.
- **Reasoning:** Performant (uncontrolled), type-safe schemas that double as validation **and** mock/real API payload shapes. De facto standard.
- **Trade-offs:** Another dependency pair.
- **Dependencies:** Validation rules in `PRD.md` §5.2.

## D-08 — v1 scope: 4 designed pages only

- **Purpose:** Fix the product surface for v1.
- **Alternatives:** Add Profile; add Auth UI; add both.
- **Final choice:** **Home, Analytics, New Habit, Rewards only.** Profile and Auth deferred.
- **Reasoning:** Only these four screens are designed. Adding undesigned screens expands scope and requires inventing designs.
- **Trade-offs:** No account/logout UI; app runs against mocks/assumes an authenticated user.
- **Dependencies:** Auth model (backend) before any auth UI.

## D-09 — Analytics: Overview only

- **Purpose:** Handle the partially-designed segmented control.
- **Alternatives:** Hide other tabs; build all three; **show them disabled**.
- **Final choice:** **Overview active; Habits and Patterns visible but disabled ("coming soon").**
- **Reasoning:** Honest about what exists while preserving the designed segmented control.
- **Trade-offs:** Disabled tabs may confuse users; mitigated with a clear label.
- **Dependencies:** Designs for Habits/Patterns (future).

## D-10 — Secondary surfaces out of v1

- **Purpose:** Decide habit detail/edit/delete and badges "View all".
- **Alternatives:** Build them (design ourselves); **exclude**.
- **Final choice:** **Excluded** from v1; related buttons render as static placeholders.
- **Reasoning:** Undesigned; would require inventing flows. Keeps v1 focused.
- **Trade-offs:** No editing/deleting habits.
- **Dependencies:** Future designs.

## D-11 — Responsive: mobile-first + adaptive desktop

- **Purpose:** Define responsive behavior given a mobile-only kit.
- **Alternatives:** Centered mobile shell at all widths; **mobile-first + adaptive desktop**.
- **Final choice:** **Mobile-first + adaptive desktop.** The frontend team **proposes** wide-screen layouts; the product owner reviews.
- **Reasoning:** The product should be genuinely responsive on tablet/desktop; a fixed phone column was judged insufficient.
- **Trade-offs / constraints:** No desktop design reference — proposals may need iteration. More implementation work than a centered shell.
- **Dependencies:** **Open item** — desktop proposals pending review (`DESIGN.md`).

## D-12 — Theme: dark is the default theme *(clarified)*

- **Purpose:** Resolve the kit's color direction.
- **Alternatives:** Light default with unified tokens; **dark as the default theme**; ship both themes.
- **Final choice:** **Dark is the default (and only) theme.** The kit's light design is adapted to a dark palette.
- **Reasoning:** An explicit product preference. Note: this **supersedes** the earlier "dark mode: architecture-ready only" answer, which was found to conflict during review.
- **Trade-offs / constraints:** Every surface, text, border, and semantic color must be re-derived for dark; the kit's literal light values are no longer directly usable. Contrast must be re-verified for AA.
- **Dependencies:** Proposed dark palette (`DESIGN.md` §2.1) — pending review.

## D-13 — Tokens: unified semantic set

- **Purpose:** Overcome the kit's inconsistency (four purples, three neutral palettes).
- **Alternatives:** Reproduce per-screen literal values; **adopt one unified semantic token set**.
- **Final choice:** **Unified semantic tokens**, with dark values as the default.
- **Reasoning:** Maintainability and a single source of truth; the kit's literal inconsistencies are baked-in defects.
- **Trade-offs:** Slight deviation from individual screens; values adapted for dark.
- **Dependencies:** D-12.

## D-14 — Light theme not built in v1

- **Purpose:** Clarify whether a light theme ships.
- **Final choice:** **No light theme in v1**; token structure permits adding one later.
- **Reasoning:** Dark is the default; no requirement for a toggle.
- **Trade-offs:** Users cannot switch to light.
- **Dependencies:** None.

## D-15 — Copy and product name

- **Purpose:** Establish content and identity.
- **Alternatives:** Rewrite to neutral/professional; adopt sarcastic tone as brand; **keep kit placeholders**.
- **Final choice:** **Keep the kit's placeholder copy** for v1; product name **Fitency**.
- **Reasoning:** Final copy is undecided; placeholders avoid blocking development. Strings kept centralized for easy revision.
- **Trade-offs:** Shipped copy is placeholder-quality if not revised before release.
- **Dependencies:** Final copy from product owner.

## D-16 — Navigation: 3 tabs + FAB

- **Purpose:** Handle the Profile tab, which is out of scope.
- **Alternatives:** Keep Profile tab disabled; keep it with a placeholder page; **remove it**.
- **Final choice:** **Remove the Profile tab.** Nav = Home, Analytics, `[FAB]`, Rewards.
- **Reasoning:** Cleanest UX; no dead tab.
- **Trade-offs:** Diverges from the kit's 4-tab layout.
- **Dependencies:** D-08.

## D-17 — Chart: custom SVG

- **Purpose:** Implement the Analytics line chart.
- **Alternatives:** Recharts; visx; Chart.js; **custom SVG**.
- **Final choice:** **Custom SVG** (isolated code-split chunk).
- **Reasoning:** Only one chart in the app; custom SVG matches the design precisely with no heavy dependency.
- **Trade-offs:** More manual work for axes/responsiveness.
- **Dependencies:** Chart data (backend, §10).

## D-18 — Errors: inline + global toast

- **Purpose:** Define error surfacing.
- **Alternatives:** Inline only; toast only; **both**.
- **Final choice:** **Inline per-section states + a global toast layer** for action outcomes.
- **Reasoning:** Inline states preserve context; toasts confirm transient actions without scrolling.
- **Trade-offs:** Two mechanisms to keep consistent.
- **Dependencies:** `sonner` (D-25).

## D-19 — Accessibility: WCAG 2.1 AA

- **Purpose:** Set the accessibility bar.
- **Final choice:** **WCAG 2.1 AA** (min 11px text, ≥44px targets, AA contrast, keyboard operability, reduced-motion).
- **Reasoning:** Industry bar; the kit itself flags contrast/size failures.
- **Trade-offs:** Requires correcting kit values (esp. dark palette contrast).
- **Dependencies:** `eslint-plugin-jsx-a11y`; manual audits (no automated tests, D-23).

## D-20 — Browser support: modern evergreen

- **Final choice:** **Latest 2 versions of Chrome, Edge, Firefox, Safari.** No legacy polyfills.
- **Trade-offs:** Older Safari/iOS excluded.
- **Dependencies:** None.

## D-21 — PWA / offline: deferred

- **Final choice:** **Deferred to post-v1.**
- **Reasoning:** No offline requirement; service-worker complexity avoided.
- **Trade-offs:** No installability/offline; architecture kept compatible.
- **Dependencies:** None.

## D-22 — i18n: English-only

- **Final choice:** **English-only**, with strings centralized.
- **Trade-offs:** Multi-language support deferred.
- **Dependencies:** None.

## D-23 — Testing: none in v1

- **Purpose:** Define the quality strategy.
- **Alternatives:** Vitest + RTL; + Playwright; + Storybook; **none**.
- **Final choice:** **No automated testing in v1.**
- **Reasoning:** Explicit preference to prioritize shipping.
- **Trade-offs / risks:** **Accepted risk.** Quality rests on TypeScript, ESLint (incl. `jsx-a11y`), and manual QA. State logic (habit toggling, invalidation) is the most likely place for regressions. Retrofitting tests later is cheaper if components stay pure and logic is separated from UI.
- **Dependencies:** None.

## D-24 — Tooling: ESLint + Prettier; npm

- **Purpose:** Lint/format stack and package manager.
- **Alternatives:** Biome (lint+format); pnpm/yarn.
- **Final choice:** **ESLint + Prettier** and **npm**.
- **Reasoning:** ESLint has the richest React + a11y plugin ecosystem; npm is ubiquitous and matches the original scaffold's lockfile.
- **Trade-offs:** More config than Biome; slower installs than pnpm.
- **Dependencies:** None.

## D-25 — Supporting libraries

- **Purpose:** Pick icons, date, and toast utilities.
- **Final choice:** **lucide-react** (icons), **date-fns** (dates), **sonner** (toasts).
- **Reasoning:** lucide covers the kit's icon list (kit SVGs expire); date-fns is tree-shakeable; sonner is small and accessible.
- **Trade-offs:** Three small dependencies.
- **Dependencies:** D-18.

## D-26 — Data mocking via the `lib/api` seam

- **Purpose:** Enable building without a backend.
- **Alternatives:** MSW (network interception); **in-memory `lib/api` module**.
- **Final choice:** **A single `lib/api` module** exposing an `ApiClient` interface, implemented by an in-memory mock; a future `HttpApiClient` swaps in without touching pages.
- **Reasoning:** Follows the original `DESIGN.md` guidance; simplest seam that still allows a clean swap.
- **Trade-offs / constraints:** Mocks are not network-realistic (no real latency/HTTP shapes) — MSW remains an option if needed.
- **Dependencies:** Backend contract (`PRD.md` §10).

## D-27 — Deployment target *(Open)*

- **Purpose:** Determine build/env configuration and base paths.
- **Final choice:** **Unresolved.** Candidates: static host (Vercel/Netlify/Cloudflare/S3) or served by the backend.
- **Impact while open:** None for development; `.env`-based config keeps both options possible.

---

## Open / unresolved items

| ID | Item | Owner |
|----|------|-------|
| O-1 | Date picker interaction | Frontend to propose |
| O-2 | "This Week" range menu | Frontend to propose |
| O-3 | Locked badge state | Frontend to propose |
| O-4 | Concrete dark palette | Frontend proposed → review |
| O-5 | Desktop layouts | Frontend proposed → review |
| O-6 | Deployment target (D-27) | Product owner |
| O-7 | Figma access + license | Product owner |
| O-8 | Final copy | Product owner |
| O-9 | Auth model, endpoints, error format, base URL, pagination, CORS | Backend developer |
