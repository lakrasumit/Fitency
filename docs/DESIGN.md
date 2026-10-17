# Fitency — Frontend Design Specification

| | |
|---|---|
| **Status** | Draft for review |
| **Version** | 2.0 (supersedes 1.0) |
| **Date** | 2026-10-18 |
| **Source** | Figma Community file *"Habit Tracker App UI Kit"* (file key `TCU92j5lWZlACL65yC27VW`, page "Design", node `1:2`) |
| **Related docs** | [`PRD.md`](./PRD.md) · [`decisions.md`](./decisions.md) |

> **License:** check the Figma Community license on the file page before shipping anything commercial.
>
> This document records the **finalized** frontend design system, layouts, navigation, components, responsive behavior, UI states, and architecture. The original Figma-derived reference (literal values, screen inventory, kit inconsistencies) is preserved verbatim in **Appendix A** for traceability. Decisions are cross-referenced as `(D-xx)` to [`decisions.md`](./decisions.md).

---

## 0. Confirmed decisions affecting design

| Decision | Value |
|----------|-------|
| Framework | Vite + React SPA (D-01) |
| Styling | Tailwind CSS v4 consuming semantic tokens (D-03, D-13) |
| **Theme** | **Dark is the default (and only) theme** (D-12, D-14) |
| Tokens | **Unified semantic token set** (D-13) |
| Responsive | **Mobile-first + adaptive desktop** (frontend-proposed) (D-11) |
| Navigation | **3 tabs + FAB**, Profile removed (D-16) |
| Scope | Home · Analytics (Overview only) · New Habit · Rewards (D-08, D-09, D-10) |
| Accessibility | WCAG 2.1 AA (D-19) |
| Chart | Custom SVG (D-17) |
| Copy | Kit placeholders; product name **Fitency** (D-15) |

> ⚠️ **Sections 2.1 (dark palette) and 3.2/4 (desktop layouts) are proposals pending review** (open items O-4, O-5).

---

## 1. Design principles

1. **Honest, playful feedback** — the product's tone (via pill text and copy) is light and self-aware.
2. **Fast daily loop** — logging a habit should take one tap; creating one under a minute.
3. **Dark-first** — surfaces are dark; hierarchy is built with elevation, borders, and tinted accents rather than heavy shadows.
4. **One primary accent** — a single brand purple unifies the kit's four inconsistent purples.
5. **Accessible by default** — AA contrast, ≥44px targets, ≥11px text, keyboard operability.

---

## 2. Design system

### 2.1 Color

The kit was light and internally inconsistent (four purples, three neutral palettes — see Appendix A §A.4). We use **one unified semantic token set** with **dark values as the default**.

The values below are **proposed** derivations from the kit's brand purple (`#7357f6`) and slate neutrals, adjusted for dark-surface contrast (AA). They are expected to be tuned visually during implementation.

```css
/* Proposed dark theme — pending review (O-4) */
:root {
  /* Surfaces */
  --bg-page:            #0b1220;
  --bg-surface:         #131c2e;   /* cards */
  --bg-surface-raised:  #1b2740;   /* elevated rows, sheets */
  --bg-sunken:          #080d18;
  --bg-subtle:          rgba(148,163,184,0.06);

  /* Text */
  --text-strong:        #f8fafc;
  --text:               #cbd5e1;
  --text-muted:         #94a3b8;
  --text-faint:         #64748b;

  /* Borders */
  --border:             rgba(148,163,184,0.16);
  --border-subtle:      rgba(148,163,184,0.10);
  --border-strong:      rgba(148,163,184,0.28);

  /* Brand (unified from the kit's 4 purples) */
  --color-primary:        #7c5cff;
  --color-primary-strong: #a78bfa;
  --color-primary-soft:   rgba(124,92,255,0.16);
  --color-on-primary:     #ffffff;

  /* Semantic (dark pill recipe: tinted bg + light text + soft border) */
  --success-bg: rgba(34,197,94,0.14);   --success-fg: #4ade80;  --success-bd: rgba(34,197,94,0.28);
  --warning-bg: rgba(245,158,11,0.14);  --warning-fg: #fbbf24;  --warning-bd: rgba(245,158,11,0.28);
  --danger-bg:  rgba(239,68,68,0.14);   --danger-fg:  #f87171;  --danger-bd:  rgba(239,68,68,0.28);
  --orange-bg:  rgba(249,115,22,0.14);  --orange-fg:  #fb923c;  --orange-bd:  rgba(249,115,22,0.28);
  --purple-bg:  rgba(124,92,255,0.16);  --purple-fg:  #a78bfa;  --purple-bd:  rgba(124,92,255,0.32);
}
```

**Habit icon tiles (44px, bg / border):**

| Habit | Background | Border |
|-------|-----------|--------|
| Water | `rgba(56,189,248,0.12)` | `rgba(56,189,248,0.24)` |
| Meditate | `rgba(168,85,247,0.12)` | `rgba(168,85,247,0.24)` |
| Gym | `rgba(99,102,241,0.14)` | `rgba(99,102,241,0.26)` |
| Food | `rgba(244,63,94,0.12)` | `rgba(244,63,94,0.24)` |
| Reading | `rgba(148,163,184,0.12)` | `rgba(148,163,184,0.22)` |

**Heatmap cells:** productive `#22c55e` · normal `rgba(34,197,94,0.45)` · struggled `rgba(248,113,113,0.5)` · missed `#ef4444` · future `rgba(148,163,184,0.10)` (with border `--border-subtle`).

**Analytics metric tiles (bg / value / label):** green `rgba(34,197,94,0.12)` / `#4ade80` / `--text-muted` · purple `rgba(124,92,255,0.14)` / `#a78bfa` / `--text-muted` · red `rgba(239,68,68,0.12)` / `#f87171` / `--text-muted`.

**Chart series:** perceived energy `#8b7cff` · coffee `#2dd4bf`.

**Streak callout:** gradient `rgba(249,115,22,0.16)` → `rgba(249,115,22,0.08)`; border `rgba(249,115,22,0.24)`; subtitle `#fdba74`.

**Create-habit form:** category active pill bg `rgba(124,92,255,0.16)` / border `rgba(139,92,246,0.5)` / text `#c4b5fd` · Easy card bg `rgba(16,185,129,0.10)` / border `rgba(16,185,129,0.24)` · Hard card bg `rgba(245,158,11,0.10)` / border `rgba(245,158,11,0.24)` · Delusional (selected) bg `rgba(244,63,94,0.12)` / border `rgba(244,63,94,0.40)` · warning banner bg `rgba(245,158,11,0.12)` / border `rgba(245,158,11,0.28)` / text `#fde68a`.

**Rewards:** level badge bg `rgba(168,85,247,0.16)` · current-step ring `rgba(168,85,247,0.25)` · XP gradient `#a855f7` → `#6366f1` · badge tints amber `rgba(245,158,11,0.14)` / rose `rgba(244,63,94,0.14)` / blue `rgba(59,130,246,0.14)`.

### 2.2 Typography

- **Font:** **Plus Jakarta Sans** (weights 400–800), loaded via a `@fontsource` package or self-hosted (no SSR font loader in a Vite SPA).
- **Minimum size 11px** (accessibility; the kit used 8–10px — raised, D-19).

| Use | Size / line | Weight | Tracking |
|-----|-------------|--------|----------|
| Page H1 | 24 / 32 | 800 | -0.6px |
| Sub-page title | 18 / 22.5 | 700 | -0.45px |
| Card heading | 15 / 22.5 | 700 | none |
| Habit title | 14 / 20 | 700 | -0.35px |
| Body | 13 / 19.5 | 400–500 | none |
| Caption | 11 / 16.5 | 500 | none |
| Micro (tab labels, pills) | 11 / 15 | 500–700 | none |

### 2.3 Spacing, radii, shadows

- Page horizontal padding: **20px** mobile; wider gutters on desktop.
- Section gap **16px**; habit card gap **12px**; card padding **16px**.
- Spacing steps: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24.

| Radius | Value | Use |
|--------|-------|-----|
| `--radius-sm` | 6px | heatmap cells, reality pills |
| `--radius-md` | 12px | inputs, icon tiles, difficulty cards |
| `--radius-lg` | 16px | cards, CTA |
| `--radius-xl` | 28px | widgets |
| `--radius-pill` | 9999px | pills, nav |

**Shadows (dark, subtle):** `--shadow-card: 0 4px 20px -2px rgba(0,0,0,0.40)` · `--shadow-fab: 0 10px 22px -4px rgba(124,92,255,0.50)` · `--shadow-cta: 0 10px 15px -3px rgba(124,92,255,0.35)` · `--shadow-widget: 0 8px 24px -4px rgba(0,0,0,0.45)`. Elevation leans on **borders + tinted surfaces** more than shadow.

### 2.4 Iconography

- Library: **`lucide-react`** (D-25). Icons needed: home, bar-chart, trophy, plus, calendar, chevron-down, chevron-right, check, droplet, lotus/meditate, dumbbell, apple, book-open, flame, clock, lock, share, arrow-left.
- Default stroke 1.75–2px; size 20px in nav, 16–18px inline.
- Decorative/emoji icons `aria-hidden`; meaningful icons get accessible labels.

---

## 3. Global layout and navigation

### 3.1 Mobile (default)
- Single scrollable column; content sits between a fixed top area and the bottom nav where present.
- **Bottom navigation** (Home, Analytics, Rewards + **FAB**), Profile removed (D-16):
  - Order: Home · Analytics · `[+ FAB]` · Rewards
  - Container: `--bg-surface` at ~95% opacity, `backdrop-blur(6px)`, 1px top `--border`, height ~76px (excluding any future safe-area inset)
  - Tab: 20px icon + 11px label; active = primary + bold; inactive = `--text-muted`
  - **FAB**: 48px circle, `--color-primary`, white "+", raised 16px, `--shadow-fab`, `aria-label="Add habit"`
  - Scroll content bottom padding ~96–112px to clear the bar
- **New Habit** has **no bottom nav**; it uses a back-button header.

### 3.2 Desktop *(proposal — O-5)*
- `md` (768px+): content max-width **~720px**, centered; nav remains at the bottom.
- `lg` (1024px+): **left sidebar rail** replaces the bottom nav; content max-width **~1100px**; FAB moves to the sidebar (or a top-right button). Layouts expand to two columns (see §4). **Pending review.**

---

## 4. Screens

### 4.1 Home — Daily Checklist (`/`)
**Mobile (top→bottom):** header row (date selector + calendar button) · title block · category filter pills (horizontal scroll) · habit checklist · streak callout · bottom nav.

**Desktop (`lg`) proposal:** two columns — checklist on the left (~2/3), streak callout + a summary on the right (~1/3).

Mock content (kit): 5 habits with reality pills (amber/red/purple/orange/green), a "0 Days" streak callout. Data is **mock/dependent** (Appendix A §A.1).

### 4.2 Analytics (`/analytics`)
**Mobile:** header (H1 + "This Week" pill) · segmented control (Overview active; Habits/Patterns disabled) · heatmap card · weekly summary card · line chart card · bottom nav.

**Desktop (`lg`) proposal:** heatmap full-width; summary metrics and chart side by side.

### 4.3 New Habit (`/habits/new`)
**Mobile:** back header · name input · category pills · difficulty cards · reality-check banner · remind toggle + time · repeat day chips · primary CTA.

**Desktop proposal:** centered single column (max ~600px) — forms stay narrow for readability.

### 4.4 Rewards (`/rewards`)
**Mobile:** top bar (back + title + share) · level card · milestone stepper · next-level card · achievement badges · bottom nav.

**Desktop (`lg`) proposal:** two columns — level/stepper/next-level on the left; badges grid on the right.

Mock content and per-screen details: Appendix A §A.1.

---

## 5. Component library

| Component | Variants / states | Notes |
|-----------|-------------------|-------|
| `BottomNav` | 3 tabs, active | Mobile only |
| `SidebarNav` | active | Desktop `lg+` proposal |
| `FAB` | default | 48px, primary, `--shadow-fab` |
| `PageHeader` | back +/-, right action +/- | Title + optional subtitle |
| `HabitCard` | unchecked, checked | Icon tile, title, time, `RealityPill`, checkbox; whole row tappable |
| `Checkbox` | unchecked, checked | 24px visual, ≥44px hit area |
| `RealityPill` | amber, red, purple, orange, green | Radius 6, 11px |
| `FilterPill` | active, inactive | label + count |
| `StreakCallout` | default (tappable) | gradient card |
| `SegmentedControl` | active, disabled | Overview/Habits/Patterns |
| `DropdownPill` | default | date, range |
| `HeatmapGrid` / `HeatmapCell` | productive, normal, struggled, missed, future | radius 6, 6px gap |
| `MetricTile` | green, purple, red | |
| `LineChart` | two series | custom SVG, code-split |
| `Card` | default | radius 16, padding 16 |
| `TextInput` | focus, filled, error | |
| `CategoryPill` | selected, unselected | |
| `DifficultyCard` | easy, hard, delusional; selected | |
| `WarningBanner` | default | |
| `Toggle` | on, off | 44×24 |
| `TimeButton` | default | |
| `DayChip` | selected, inactive | |
| `PrimaryButton` | default, loading, disabled | radius 16 |
| `LevelCard` / `ProgressBar` | n/a | 8px (XP), 6px (next level) |
| `MilestoneStepper` / `StepNode` | completed, current, locked | 32px |
| `BadgeCard` | earned, locked* | *locked undesigned (O-3) |
| `EmptyState` / `ErrorState` / `Skeleton` | default | new, per D-18/§7 |
| `Toast` | success, error, info | `sonner` |

Component layering: `ui → composed (nav/habits/analytics/rewards) → pages`.

---

## 6. Responsive behavior

| Breakpoint | Behavior |
|-----------|----------|
| `< 640px` | Mobile: single column, bottom nav |
| `640–767px` (sm) | Single column, wider padding |
| `768–1023px` (md) | Centered content (~720px); bottom nav retained |
| `≥1024px` (lg) | Sidebar rail, ~1100px max-width, two-column layouts (proposal) |

Rules: no horizontal overflow; ≥44px targets; fluid grids for heatmap/badges; forms stay narrow.

---

## 7. UI states

| State | Treatment |
|-------|-----------|
| Loading | Skeletons matching final layout |
| Empty | Message + primary action (e.g. Home → New Habit) |
| Error | Inline message + Retry |
| Refetching | Non-blocking subtle indicator |
| Offline | Notice; actions disabled/queued (no sync in v1) |
| Action feedback | Success/error **toast** (D-18) |

---

## 8. Frontend architecture

### 8.1 Structure

```
frontend/
  index.html · vite.config.ts · tsconfig.json · package.json
  src/
    main.tsx
    app/            App.tsx (providers + RouterProvider) · router.tsx (lazy pages)
    styles/         tokens.css · globals.css
    layouts/        TabLayout.tsx · SubPageLayout.tsx
    pages/          home/ · analytics/ · rewards/ · habits/new/ · NotFound/
    components/     ui/ · nav/ · habits/ · analytics/ · rewards/
    state/          DataProvider.tsx (Context + useReducer) · ThemeProvider.tsx
    lib/            api/ (types, client, mock, index) · utils/
    hooks/          useHabits · useAnalytics · useProgress · useToggleHabit …
```

### 8.2 The `lib/api` seam
`lib/api/client.ts` defines an **`ApiClient` interface**. `lib/api/mock/` implements it now (in-memory data, simulated latency, injectable errors). A future `HttpApiClient` implements the same interface against the backend — **no page changes** (D-26).

### 8.3 Data flow
`DataProvider` holds server-derived slices (`habits`, `logs`, `progress`, `analytics`) with explicit `{ status: 'idle'|'loading'|'error'|'ready', error }`. Feature hooks read it. Because there is no query cache (D-05), **invalidation is explicit**: toggling a habit updates local state and refreshes `progress`/`analytics`.

### 8.4 Routing

| Route | Layout |
|-------|--------|
| `/` | `TabLayout` |
| `/analytics` | `TabLayout` |
| `/rewards` | `TabLayout` |
| `/habits/new` | `SubPageLayout` |
| `*` | 404 |

### 8.5 Code splitting
Route pages lazy-loaded; chart isolated inside `/analytics`.

---

## 9. Accessibility

- WCAG 2.1 **AA**; ≥11px text; ≥44px targets.
- Contrast re-verified for the dark palette (kit's `#94a3b8`-on-white reasoning no longer applies).
- Visible focus; full keyboard operation; logical focus order; focus trap for any overlay.
- Programmatic labels; errors linked and announced.
- `prefers-reduced-motion` respected; emoji decorative.

---

## 10. Open design items

| ID | Item | Status |
|----|------|--------|
| O-1 | Date picker interaction | Frontend to propose |
| O-2 | "This week" range menu | Frontend to propose |
| O-3 | Locked/unearned badge state | Frontend to propose |
| O-4 | **Dark palette values (§2.1)** | **Proposed — needs review** |
| O-5 | **Desktop layouts (§3.2, §4)** | **Proposed — needs review** |
| O-6 | Deployment target | Product owner |
| O-7 | Figma access + license | Product owner |
| O-8 | Final copy | Product owner |

---

# Appendix A — Original Figma reference (v1.0, preserved)

Retained for traceability. **Light-theme literal values only**; the shipping theme is dark (§2.1).

## A.1 Screen inventory

| # | Figma frame | Node ID | Route | Notes |
|---|-------------|---------|-------|-------|
| 1 | Daily Checklist | `1:1447` | `/` | Home |
| 2 | Log & Analytics | `1:1446` | `/analytics` | Overview only |
| 3 | New Habit Creation | `1:1444` | `/habits/new` | No bottom nav |
| 4 | Roast & Relapse Notifications | `1:1445` | n/a | Lock-screen mockup (out of scope) |
| 5 | Gamified Leveling | `1:1199` | `/rewards` | Rewards |
| 6 | Widgets | `1:1069` | n/a | Native iOS (out of scope) |
| n/a | Profile | n/a | — | **Removed from v1** (D-16) |

## A.2 Screen contents (as designed)

- **Home:** date button "Mon, 16 Sep"; H1 "Today's Ambitions"; tagline; filters All 5 / Morning 2 / Afternoon 2 / Evening 1; 5 habit cards (Water/amber, Meditate/red-checked, Gym/purple, Eat Clean/orange, Read/green-checked); "0 Days" streak callout "Back to Square One, Champ."
- **Analytics:** H1 + "This Week"; segmented Overview/Habits/Patterns; heatmap (Exercise, Reading, Water, Eat Clean, Meditate); weekly summary "You were 80% productive on Tuesday…" 😅 with tiles 3/5, 2 (Tue), 0 streak; chart "Perceived Energy vs. Actual Coffee" (~314×113px).
- **New Habit:** title "Create a New Habit" / "Be honest with yourself."; name placeholder "e.g., Read 50 pages a day…"; categories Health 💜 (selected) / Mind 💬 / Growth 📊 / Lifestyle ✨; difficulty Easy/Hard/Delusional (Delusional selected); banner "You've tried adding this habit **4 times** this year."; Remind toggle + 8:00 AM; repeat Mon–Fri selected; CTA "Add Habit".
- **Rewards:** "Level Up"; Level 3, 120/200 XP, rank "Functional Caffeine Machine"; stepper (Habit Newbie, Slightly Consistent, Functional Caffeine Machine, Has Their Life Together); next level "Level 4 — Has Their Life Together", "Unlock at 7-day streak", 0/7 days; badges The Pretender, Snooze Warrior, Midnight Muncher, Hydration Hero.
- **Notifications copy:** "Your 6 AM workout habit is calling…"; "Your Duolingo owl…"; "You haven't logged water today…"; "Netflix again?…". (Out of scope; note third-party brand names.)

## A.3 Spacing / typography literal values
Page padding 20px (24px on widgets); section gap 16px; card gap 12px; card padding 15–17px; spacing steps 2,4,6,8,10,12,14,16,20,24. Type sizes 8–28px (see §2.2 for the accessible revised scale).

## A.4 Kit inconsistencies (resolved in v2)

1. Four purples (`#7357f6`, `#7454f5`, `#635bff`, `#6d28d9`) → **one primary** (D-13).
2. Font only specified on screen 1 → **Plus Jakarta Sans everywhere**.
3. Three neutral palettes + four page backgrounds → **one neutral scale** (D-13).
4. Bottom nav differs per screen (FAB 46/48px, label 9/10px, blur variance) → **one nav spec**.
5. Rewards had back button *and* tab bar → tab-destination convention standardized.
6. Stepper showed numbers for completed steps → checkmark convention recommended.
7. Badge grid too tight (4 columns truncate) → **2×2 or scrollable grid**.
8. Heatmap Sunday mixed future + real data → data must be consistent.
9. Widget checklist "2 / 5 done" but listed 4 → out of scope.
10. Difficulty icons mixed (check SVG vs emoji) → unified iconography.

## A.5 Accessibility notes (original)
8–9px text too small (raised to ≥11px); `#94a3b8` on white ≈2.6:1 (re-derived for dark); 24px checkboxes too small (≥44px hit area); emoji need labels or `aria-hidden`.
