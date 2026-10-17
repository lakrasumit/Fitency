# Frontend integration notes

Status of the frontend ↔ backend seam, plus every place where the frontend had
to act on an undesigned interaction. Kept deliberately short: it exists so the
backend owner and product owner can see exactly what is pending.

## 1. The seam

- Single entry point: `src/lib/api/index.ts` exports `api: ApiClient`.
- Interface: `src/lib/api/client.ts`.
- Current implementation: `src/lib/api/mock/` (in-memory, latency, abortable,
  injectable failures, write-side validation through the shared zod schema).
- **Not implemented:** `HttpApiClient`. Writing it now would require inventing a
  contract the backend has not published.

Swapping in the real backend must not require changes to pages or hooks:

1. add `src/lib/api/http/client.ts` implementing `ApiClient`;
2. change the single binding in `src/lib/api/index.ts`;
3. map transport errors onto `ApiError` so `toErrorMessage()` keeps working.

## 2. Pending backend dependencies (PRD.md §10)

| # | Needed from backend | Frontend impact while missing |
|---|---|---|
| 1 | Auth model, "logged in" detection, 401 handling | No credentials are attached; no redirect on expiry |
| 2 | Endpoint list + request/response shapes | `HttpApiClient` cannot be written |
| 3 | Error response format | Errors are mapped from a generic shape only |
| 4 | Base URL(s) / environments | `VITE_API_BASE_URL` reserved but unused |
| 5 | Pagination / list semantics | Mock returns complete lists; Home assumes no paging |
| 6 | CORS for the dev origin | Local dev against a real backend not possible yet |
| 7 | Data backing reality pills, streak, levels/XP, heatmap statuses, chart values, filter counts | All of it is mock content; the UI renders whatever the API returns |

## 3. Undesigned interactions — frontend proposals

These are implemented, but they need review (docs/DESIGN.md §10).

| Item | Proposal implemented |
|---|---|
| O-1 Date selector | Pill showing the active date + calendar icon button opening a listbox of the previous seven days, with a "Jump to today" action. Future dates are excluded — there is nothing to log yet. |
| O-2 "This Week" range menu | `DropdownPill` listbox with **This Week** / **Last Week**; changing range refetches analytics. Other ranges are omitted rather than faked. |
| O-3 Locked / unearned badge | Same footprint as an earned badge, drained to `--bg-sunken`, lock glyph, explicit "Locked" text (no colour-only signalling). |
| O-4 Dark palette | Implemented verbatim from DESIGN.md §2.1 as tokens in `src/styles/tokens.css`. |
| O-5 Desktop layouts | `md`: centred ~720px column with the bottom nav. `lg`: sidebar rail, ~1100px canvas, two-column Home/Analytics/Rewards, forms stay ~600px. |

## 4. Deliberate v1 gaps (in scope boundaries, not blockers)

- Habit detail/edit/delete — out of scope (D-10); rows are toggle-only.
- Streak callout is a static card: the kit's destination is undesigned (D-10).
- Badges "View all" is a static control that explains its own absence (D-10).
- Analytics Habits/Patterns segments are visible but disabled (D-09).
- Offline: notice + disabled writes; no queueing or sync (D-21).
- No automated tests (D-23). Verification is TypeScript, ESLint (incl.
  `jsx-a11y`) and manual QA by the product owner.
