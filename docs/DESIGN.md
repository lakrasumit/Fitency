# Habit Tracker: Design Specification

Source: Figma Community file "Habit Tracker App UI Kit" (file key `TCU92j5lWZlACL65yC27VW`, page "Design", node `1:2`).
Target stack: React + Next.js (App Router). Styling-agnostic: tokens are given as CSS variables.

> **Check the Community license** on the Figma file page before shipping anything commercial.

---

## 0. Rules for the coding agent

1. **Take from Figma/this doc:** layout, page structure, components, spacing, colors, typography.
2. **Do not take features from the design.** Build only what is listed in `FEATURES.md`. If a screen shows UI for a feature not in that list, render it as a static placeholder.
3. **Ignore device chrome.** Do not build: iOS status bar (9:41, signal, battery), Dynamic Island, home indicator bar, phone frames, lock-screen clock, flashlight/camera buttons.
4. **Mobile-first.** The kit only has a 390px-wide design. On wider screens, center a single column (max-width 430px) until desktop designs exist.
5. **Build order:** tokens, then shared components, then pages.
6. **Backend is undecided.** Put every data call behind one `lib/api` module with mock data. Swap in real endpoints later.
7. All copy in this doc is placeholder copy from the kit (sarcastic tone). Replace per product decisions.
8. For pixel-level questions, query the Figma MCP with the node IDs below.

---

## 1. Screen inventory

| # | Figma frame | Node ID | Suggested route | Notes |
|---|-------------|---------|-----------------|-------|
| 1 | Daily Checklist | `1:1447` | `/` | Home tab |
| 2 | Log & Analytics | `1:1446` | `/analytics` | Only the "Overview" tab is designed |
| 3 | New Habit Creation | `1:1444` | `/habits/new` | No bottom nav on this screen |
| 4 | Roast & Relapse Notifications | `1:1445` | n/a | A lock-screen mockup of push notifications, not an app page. Use for notification copy and icons |
| 5 | Gamified Leveling | `1:1199` | `/rewards` | Rewards tab |
| 6 | Widgets | `1:1069` | n/a | iOS home-screen widget showcase. Needs native WidgetKit, so out of scope for a web app |
| n/a | Profile | n/a | `/profile` | **Not designed**, but exists as a nav tab |

---

## 2. Design tokens

### 2.1 Colors (literal values from the kit)

**Brand purple.** The kit is inconsistent (see section 8). Values as found:

| Screen | Value | Used for |
|--------|-------|----------|
| 1 Home | `#7357f6` | FAB, active tab, checked checkbox, active filter pill |
| 2 Analytics | `#7454f5` | Active tab, segmented control, chart line, FAB |
| 3 New Habit | `#635bff` | CTA, toggle, selected day chips |
| 5 Rewards | `#6d28d9` | Active tab, FAB, current step, "View all" |
| 5 Rewards | `#4f46e5` | "NEXT LEVEL" label, XP gradient end |
| 5 Rewards | `#9333ea` | Next-level progress fill |
| 5 Rewards | `#a855f7` | XP gradient start |

**Neutrals (slate, used on screens 1, 3, 4, 5, 6):**
`#0f172a` primary text, `#1e293b`, `#334155`, `#475569`, `#64748b` secondary text, `#94a3b8` muted text, `#cbd5e1` borders/unchecked, `#e2e8f0` input borders, `#f1f5f9` subtle fills/borders, `#f8fafc` page bg (screen 5).

**Neutrals (purple-tinted, screen 2 only):**
`#161338` H1, `#1c1939` card headings, `#413f58` row labels, `#46445b`, `#6e7084` body, `#787b91`, `#86879e`, `#9699aa`, `#9a9db2` inactive tab, `#eceef5` segmented-control bg, `#dfe0ec` pill border, `#f0edf8` card border, `#eef0f7` nav border, `#faf8fe` page bg.

**Semantic / status:**

| Meaning | Background | Text/accent | Border |
|---------|-----------|-------------|--------|
| Success pill | `#ecfdf3` | `#16a34a` | `rgba(187,247,208,0.6)` |
| Warning pill (amber) | `#fff7e8` | `#c27803` | `rgba(255,231,186,0.6)` |
| Danger pill (red) | `#feecec` | `#dc2626` | `rgba(253,200,200,0.6)` |
| Orange pill | `#fff0e6` | `#ea580c` | `rgba(255,216,190,0.6)` |
| Purple pill | `#f1edfe` | `#6445ee` | `rgba(221,213,254,0.6)` |

**Habit icon tiles (44px, bg / border):**
water `#f0f9ff` / `#e0f2fe`, meditate `#faf5ff` / `#f3e8ff`, gym `#eef2ff` / `#e0e7ff`, food `#fff1f2` / `#ffe4e6`, reading `#f1f5f9` / `rgba(226,232,240,0.6)`.

**Heatmap cells:** productive `#50d890`, normal `#b3f4ca`, struggled `#ffc5c5`, didn't do `#ff7d7d`, not-yet/future `#fff0e7` with border `#fbe0ce`.

**Analytics metric tiles (bg / value / label):**
green `#ebfbf3` / `#23a26d` / `#55816f`, purple `#f1edfe` / `#7454f5` / `#7169a0`, red `#fff0f0` / `#e94b4b` / `#b16262`.

**Chart series:** perceived energy `#7454f5`, coffee `#44d7b6`.

**Streak callout:** gradient `#fff4ea` to `#ffefe4` (left to right), border `rgba(255,226,207,0.8)`, subtitle `rgba(180,83,9,0.8)`.

**Create-habit form:**
- Category active pill: bg `rgba(250,245,255,0.6)`, border `#d8b4fe`, text `#7e22ce`
- Easy card: bg `#ecfdf5`, border `#d1fae5`
- Hard card: bg `rgba(255,251,235,0.8)`, border `#fef3c7`
- Delusional card (selected): bg `rgba(255,228,230,0.8)`, border `#fda4af`
- Warning banner: bg `rgba(255,251,235,0.8)`, border `rgba(253,230,138,0.9)`, text `#451a03`

**Rewards:** level badge bg `#f3e8ff`; current-step ring `#f3e8ff`; XP gradient `#a855f7` to `#4f46e5`; badge tints: amber `#fffbeb`/`#fde68a`, rose `#fff1f2`/`#fecdd3`, blue `#eff6ff`/`#bfdbfe`.

**Notification app-icon tints:** bell `#fef3c7`, owl `#ecfccb`, droplet `#dbeafe`, ticket `#e0e7ff`. Lock-screen background: `linear-gradient(145.6deg, #7496cb 0%, #b2a9cc 35%, #ebbfb0 70%, #d89a7d 100%)`.

**Widgets:** bgs `#eff2fd`, `#f5f9f6`, `#f3f6fd`, `#efeffc`; page bg `#f7f8fc`; red pill `#ff4d4d`; grey pill `#e5e9f5`; progress `#10b981` on `#e2e8f0`.

### 2.2 Recommended token set (my suggestion, not from Figma)

```css
:root {
  --color-primary: #7357f6;        /* unified from screens 1 and 2 */
  --color-primary-strong: #6d28d9; /* pressed / rewards accents */
  --color-primary-soft: #f1edfe;
  --text-strong: #0f172a;
  --text: #334155;
  --text-muted: #64748b;
  --text-faint: #94a3b8;
  --border: #e2e8f0;
  --border-subtle: #f1f5f9;
  --surface: #ffffff;
  --surface-page: #f8fafc;
  --success: #16a34a;
  --danger: #dc2626;
  --warning: #c27803;

  --radius-sm: 6px;   /* heatmap cells, reality pills */
  --radius-md: 12px;  /* inputs, icon tiles, difficulty cards */
  --radius-lg: 16px;  /* cards, CTA */
  --radius-xl: 28px;  /* widgets */
  --radius-pill: 9999px;

  --shadow-card: 0 4px 20px -2px rgba(99,102,241,0.05), 0 2px 6px -1px rgba(0,0,0,0.02);
  --shadow-card-flat: 0 2px 6px rgba(0,0,0,0.03);
  --shadow-fab: 0 10px 22px -4px rgba(115,87,246,0.45);
  --shadow-cta: 0 10px 15px -3px rgba(99,91,255,0.25), 0 4px 6px -4px rgba(99,91,255,0.25);
  --shadow-widget: 0 8px 24px -4px rgba(100,116,139,0.12), 0 4px 8px -2px rgba(100,116,139,0.06);
}
```

### 2.3 Typography

- **Font:** Screen 1 uses **Plus Jakarta Sans** (500, 600, 700, 800). Screens 2 to 6 render in Liberation Sans, which looks like a fallback for a font that wasn't loaded. My inference: the kit intends Plus Jakarta Sans everywhere. Load it with `next/font/google`.
- **Scale seen in the kit (size / line-height):**

| Use | Size / line | Weight | Tracking |
|-----|-------------|--------|----------|
| Page H1 (Home) | 24 / 32 | 800 | -0.6px |
| Page H1 (Analytics) | 26 / 32.5 | 700 | -0.65px |
| Sub-page title | 18 / 22.5 or 28 | 700 | -0.45px |
| Card heading | 15 / 22.5 | 700 | none |
| Habit title | 14 / 20 | 700 | -0.35px |
| Body | 12 to 13 / 16 to 19.5 | 400 to 500 | none |
| Caption | 11 / 16.5 | 500 | none |
| Micro (tab labels, pills) | 10 / 15 | 500 to 700 | none |
| Smallest (badge text) | 8 to 9 | 400 | none |

### 2.4 Spacing, radii, shadows

- Page horizontal padding: **20px** (24px on the widgets page)
- Vertical gap between sections: **16px**; between habit cards: **12px**
- Card padding: **15 to 17px**
- Spacing steps seen: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24
- Radii and shadows: see tokens above

---

## 3. Global layout

- **Frame:** 390px wide. Scrollable content area sits between a fixed top and a fixed bottom nav.
- **Bottom navigation** (screens 1, 2, 5): 4 tabs plus a centered floating add button.
  - Order: Home, Analytics, **[+ FAB]**, Rewards, Profile
  - Container: white at 95% opacity, backdrop blur 6px, 1px top border (`#f1f5f9`), height about 76 to 97px including the home-indicator area (do not build the indicator itself)
  - Tab: 20px icon, 10px label (9px on screen 5), active = purple + bold, inactive = `#94a3b8`
  - FAB: 46 to 48px circle, brand purple, white "+", raised about 12 to 20px above the bar, purple glow shadow
  - Scroll content needs about **96 to 114px bottom padding** to clear the bar
- **Screen 3 (New Habit)** has no bottom nav; it has a back button and centered title.
- **Screen 5 (Rewards)** has both a back button and the bottom nav. Probably unintended (see section 8).

---

## 4. Screens

### 4.1 Home: Daily Checklist (`/`)

Top to bottom:

1. **Header row:** date dropdown button (text "Mon, 16 Sep", 12px semibold `#64748b`, tracking 0.3px, small chevron) on the left; 36px calendar icon button (radius 12) on the right.
2. **Title block:** H1 "Today's Ambitions"; tagline "Good luck! You got this... maybe." (12px medium `#94a3b8`).
3. **Category filter pills** (horizontal scroll, row height 38px): "All 5" (active), "Morning 2", "Afternoon 2", "Evening 1". Each pill has a label and a count (11px).
   - Active: bg primary, white text, small drop shadow, padding 6/14
   - Inactive: bg `rgba(255,255,255,0.8)`, border `#f1f5f9`, text `#475569` semibold, count `#94a3b8`, padding 7/15
4. **Habit cards** (`HabitCard`, 5 in the mock): see component spec. Mock content:
   - Drink 3L of Water, All day, amber pill "Does iced coffee count?", unchecked
   - Meditate for 20 mins, Morning, red pill "Scrolled TikTok instead", **checked**
   - Gym / Workout, Morning, purple pill "Snoozed 5 times", unchecked
   - Eat Clean, All day, orange pill "Defeated by a midnight slice of pizza", unchecked (the long pill wraps to a second line and the card grows to about 95px)
   - Read 10 pages, Night, green pill "Actually did it! 🎉", **checked**
5. **Streak callout card** (tappable, chevron on right): flame icon tile, "0 Days" (16/24 weight 800), "Back to Square One, Champ."
6. **Bottom nav** (Home active).

### 4.2 Analytics (`/analytics`)

Page bg `#faf8fe`.

1. **Header:** H1 "Analytics" + subtitle "An honest look at your habits." Right side: "This Week" dropdown pill (white, border `#dfe0ec`, 12px text, chevron).
2. **Segmented control:** Overview (active), Habits, Patterns. Track `#eceef5`, radius 12, padding 4; active segment bg primary, white bold text, radius 9, shadow `0 2px 4px rgba(116,84,245,0.35)`. **Only Overview content is designed.**
3. **Habit Heatmap card:** title; grid with an 80px label column plus 7 equal columns (Mon to Sun), 6px gaps, square cells radius 6; 5 habit rows (Exercise, Reading, Water, Eat Clean, Meditate); legend row below a 1px `#f3f4f6` divider (Productive, Normal, Struggled, Didn't do).
4. **Weekly Summary card:** title "Weekly Summary", text "You were 80% productive on Tuesday, then remembered you had Netflix.", 😅 emoji top-right, then three metric tiles (equal width, gap 10, radius 12): "3/5 Habits done", "2 Best day (Tue)", "0 Streak (Back again)".
5. **Chart card:** "Perceived Energy vs. Actual Coffee"; legend (Perceived Energy purple, Cups of Coffee teal); smooth line chart about 314×113px, y-axis 0/5/10 with horizontal gridlines, x-axis Mon to Sun, dots on each point, light purple area fill under the energy line.
6. **Bottom nav** (Analytics active).

### 4.3 New Habit (`/habits/new`)

Header: back button (32px circle, left), centered title "Create a New Habit", subtitle "Be honest with yourself." (12px `#94a3b8`). Form, 16px gaps:

1. **Habit Name:** label (12px bold `#1e293b`, tracking 0.3px) + text input (white, 1px `#e2e8f0`, radius 12, padding 12/15). Placeholder: "e.g., Read 50 pages a day (Be honest with yourself)".
2. **Category:** pill group (horizontal scroll): Health 💜 (selected), Mind 💬, Growth 📊, Lifestyle ✨.
3. **Difficulty Level:** label + helper "Select how realistic this is for you." Three equal cards (gap 8, radius 12, padding 11), each with title and example line:
   - Easy ("Drink 1 glass of water"), Hard ("Gym at 6 AM"), Delusional ("Quitting sugar cold turkey", shown selected)
4. **Reality Check banner:** ⚠️ + "You've tried adding this habit **4 times** this year. Are you sure?"
5. **Remind me:** row with label and toggle (44×24, on state). Below it, **Time** row with label and a "8:00 AM" button (bg `#f1f5f9`, radius 12, chevron).
6. **Repeat:** 7 equal day chips (Mon to Sun), radius 12; Mon to Fri selected, Sat/Sun inactive.
7. **Primary CTA "Add Habit":** full width, radius 16, vertical padding 14, bold 14px white text, shadow.

### 4.4 Notifications (reference only)

Four notification cards on a lock-screen gradient: glass card (bg `rgba(255,255,255,0.72)`, blur 12, border `rgba(255,255,255,0.45)`, radius 16, padding 15), header with 24px tinted app-icon tile + "Habit Tracker" (12px bold `#334155`) + timestamp (11px `#94a3b8`), body 13/17.9px `#1e293b` indented 32px.

Copy in the kit:
1. "Hey! Your 6 AM workout habit is calling. You tapped snooze 5 times. 🤨"
2. "Your Duolingo owl is actively judging your life choices right now. 👀"
3. "You haven't logged water today. You are 70% dried fruit. 💧"
4. "Netflix again? Your reading habit is crying in the corner. 😭"

You cannot style the real lock screen. A web app controls only the title, body, and icon of a push notification. Messages 2 and 4 name third-party brands (Duolingo, Netflix); consider rewording.

### 4.5 Rewards: Gamified Leveling (`/rewards`)

Page bg `#f8fafc`. Top bar: back button (36px), title "Level Up", subtitle "Small habits. Big progress.", share icon button (36px) on the right.

1. **Current level card:** 48px badge tile (calendar icon, bg `#f3e8ff`), "Level 3" (16/24 bold), "120 / 200 XP" (12px bold `#64748b`, right-aligned), rank title "Functional Caffeine Machine", XP bar (8px track `#f1f5f9`, gradient fill, 60% in the mock).
2. **Milestone stepper:** 4 nodes (32px circles) joined by a 2px `#e2e8f0` line.
   - 1 "Habit Newbie" and 2 "Slightly Consistent": completed (bg `#f1f5f9`, border `#cbd5e1`, number `#475569`)
   - 3 "Functional Caffeine Machine": current (bg `#6d28d9`, white number, 4px ring `#f3e8ff`)
   - 4 "Has Their Life Together": locked (dashed border, lock icon, label `#94a3b8`)
3. **Next level card:** "NEXT LEVEL" (11px bold uppercase, tracking 0.55px, `#4f46e5`), "Level 4 — Has Their Life Together", "Unlock at 7-day streak", counter "0 / 7 days" (11px bold `#94a3b8`, right), progress bar (6px track).
4. **Achievement Badges:** header "Achievement Badges" + "View all" link. Four badge cards (white, border `#f1f5f9`, radius 12): 44px tinted circle with emoji, name (10px bold), description (8px `#64748b`):
   - 🏆 The Pretender: "Added 10 habits in one day."
   - ⏰ Snooze Warrior: "Postponed a habit 5 times in a row."
   - 🍔 Midnight Muncher: "Logged food at 11 PM. Again."
   - 💧 Hydration Hero: "Drank water 3 days in a row."
5. **Bottom nav** (Rewards active, purple `#6d28d9`).

### 4.6 Widgets (reference only)

Page bg `#f7f8fc`; title "Widgets", subtitle "Keep the guilt close. You're welcome.", section "Widget Styles". Four widgets (radius 28, `--shadow-widget`), each with a caption underneath (size + purpose):
- 1x1 Small "Daily reminder": "Did you do it yet?" with pills "No?" (red) and "Expected." (grey)
- 1x1 Small "Streak tracker": 🔥 + "0 Days" + "Back to square one, champ."
- 2x1 Medium "Checklist": "Today's Habits", mini progress bar + "2 / 5 done", list of habits with strike-through when done
- 2x1 Medium "Motivation": "Still scrolling?" + "Your habits aren't going to do themselves." + chevron

These are native iOS widgets. For a web app, either skip them or reuse the layouts as dashboard cards.

---

## 5. Component library

| Component | Variants / states | Key specs |
|-----------|-------------------|-----------|
| `BottomNav` | active tab | 4 tabs + FAB, see section 3 |
| `FAB` | default | 46 to 48px circle, primary bg, white "+", `--shadow-fab` |
| `PageHeader` | with/without back button, with/without right action | Title + optional subtitle |
| `HabitCard` | unchecked, checked | White, border `rgba(241,245,249,0.8)`, radius 16, padding 15, `--shadow-card`; left 44px icon tile (radius 12), title (14/20 bold), meta row (10px clock icon + time label 11px `#94a3b8` + `RealityPill`); right 24px checkbox |
| `Checkbox` (circle) | unchecked, checked | 24px; unchecked 2px border `#cbd5e1`; checked bg primary + white check (9.6×6.9) |
| `RealityPill` | amber, red, purple, orange, green | Radius 6, padding 3/9, 10px medium, tinted bg + border |
| `FilterPill` | active, inactive | Pill radius, label + count |
| `StreakCallout` | default (tappable) | Gradient card, 44px white flame tile, chevron |
| `SegmentedControl` | per segment active | See 4.2 |
| `DropdownPill` | default | White, 1px border, radius pill, text + chevron |
| `HeatmapGrid` / `HeatmapCell` | productive, normal, struggled, didn't-do, future | Square cells, radius 6, 6px gap |
| `MetricTile` | green, purple, red | Radius 12, value 17px bold, label 10px |
| `LineChart` | two series | Gridlines at 0/5/10, 7 x-labels, dots, area fill |
| `Card` | default | White, border (`#f0edf8` or `#f1f5f9`), radius 16, padding 17 |
| `TextInput` | **only placeholder shown** | White, 1px `#e2e8f0`, radius 12, padding 12/15, 12px text |
| `CategoryPill` | selected, unselected | Emoji + label, radius pill |
| `DifficultyCard` | easy, hard, delusional; selected | Radius 12, padding 11, title + example |
| `WarningBanner` | default | Amber tint, radius 16, padding 13 |
| `Toggle` | on (off not designed) | 44×24, knob 20px white |
| `TimeButton` | default | bg `#f1f5f9`, radius 12, text + chevron |
| `DayChip` | selected, inactive | Equal width, radius 12 |
| `PrimaryButton` | default (others not designed) | Primary bg, radius 16, py 14, bold 14px white, `--shadow-cta` |
| `LevelCard` + `ProgressBar` | n/a | 8px (XP) and 6px (next level) tracks, pill radius |
| `MilestoneStepper` / `StepNode` | completed, current, locked | 32px circles |
| `BadgeCard` | earned (locked not designed) | Tinted 44px circle + name + description |
| `NotificationCard` | n/a | Glass style, reference only |

### Icons needed

home, bar-chart, trophy, user, plus, calendar, chevron-down, chevron-right, check, droplet, lotus/meditate, dumbbell, apple, book-open, flame, clock, lock, share, arrow-left. The kit's SVGs come as temporary Figma URLs that expire after 7 days. Either export them from Figma (select the layer, then Export, then SVG) or substitute an icon library such as `lucide-react`.

---

## 6. Data the UI implies (for the API contract with your backend friend)

Inferred from the screens, not specified by Figma. Adjust to your real feature list.

```ts
type TimeOfDay = 'all-day' | 'morning' | 'afternoon' | 'evening' | 'night';
type Category = 'health' | 'mind' | 'growth' | 'lifestyle';
type Difficulty = 'easy' | 'hard' | 'delusional';

interface Habit {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  timeOfDay: TimeOfDay;
  reminderEnabled: boolean;
  reminderTime?: string;   // "08:00"
  repeatDays: number[];    // 0-6
}

type LogStatus = 'productive' | 'normal' | 'struggled' | 'missed' | 'future';
interface HabitLog { habitId: string; date: string; status: LogStatus; }

interface Progress { streakDays: number; level: number; xp: number; xpToNext: number; }
interface Badge { id: string; name: string; description: string; earnedAt?: string; }
```

Open data questions the UI raises:
- The "reality pill" text and the "tried this habit N times this year" banner need data: past attempts per habit name, snooze counts, logged times.
- The filter counts (Morning 2, Afternoon 2, Evening 1) don't match the cards (All day ×2, Morning ×2, Night ×1). Decide how "all day" and "night" map to filters.

---

## 7. Missing states and screens (not in the kit)

- **Loading, empty, and error states** for every list (no habits yet, failed save, offline)
- **Input states:** focus, filled, validation error (Habit Name); disabled/loading CTA
- **Toggle off state**, and what happens to the Time row when reminders are off
- **Dropdown behavior:** date selector, calendar picker, "This Week" range menu, time picker
- **Analytics tabs:** "Habits" and "Patterns" content
- **Profile** screen and settings
- **Locked/unearned badge** state, "View all" badges page
- **Habit detail / edit / delete**
- **Desktop and tablet** layouts; **dark mode**
- **Pressed/hover states** for all buttons and cards

---

## 8. Inconsistencies in the kit (decide before building)

1. **Four different purples** across screens (`#7357f6`, `#7454f5`, `#635bff`, `#6d28d9`). Recommend one primary token.
2. **Font:** only screen 1 specifies Plus Jakarta Sans; others fall back to a system sans.
3. **Three neutral palettes:** slate (most screens), purple-tinted (screen 2), and page backgrounds that differ per screen (white, `#faf8fe`, `#f8fafc`, `#f7f8fc`).
4. **Bottom nav differs per screen:** FAB 46px vs 48px, label 10px vs 9px, blur only on some.
5. **Rewards screen has a back button *and* a tab bar,** unusual for a tab destination.
6. **Stepper:** completed steps show numbers instead of checkmarks.
7. **Badge grid is too tight:** at 390px, four columns truncate names ("The…", "Snooze…") and cards clip. Suggest a 2×2 grid or horizontal scroll.
8. **Heatmap Sunday column** mixes "future" cells with real data in the mock.
9. **Widget checklist** says "2 / 5 done" but lists 4 habits.
10. **Difficulty icons** are mixed (a check SVG for Easy, emoji for the others).

### Accessibility notes

- Text at 8 to 9px (badge descriptions, tab labels on screen 5) is too small. Use at least 10 to 11px.
- `#94a3b8` on white is roughly 2.6:1, below WCAG AA for small text. Darken for body-size text.
- 24px checkboxes are small tap targets. Make the whole card row (or at least a 44px hit area) tappable.
- Emoji used as icons need accessible labels or should be decorative (`aria-hidden`).

---

## 9. Suggested Next.js structure

```
app/
  (tabs)/                 # layout with <BottomNav />
    layout.tsx
    page.tsx              # Home
    analytics/page.tsx
    rewards/page.tsx
    profile/page.tsx      # not designed
  habits/new/page.tsx     # no bottom nav
components/
  ui/                     # Card, Pill, Button, Toggle, Input, ProgressBar
  habits/                 # HabitCard, FilterPills, StreakCallout, Form parts
  analytics/              # Heatmap, MetricTile, LineChart
  rewards/                # LevelCard, MilestoneStepper, BadgeCard
  nav/                    # BottomNav, FAB, PageHeader
lib/
  api/                    # single module with mock data for now
  tokens.css
```

**Build order:** `tokens.css` and font, then `ui/*`, then `BottomNav` + layouts, then Home, New Habit, Analytics, Rewards. Verify each screen against its Figma screenshot before moving on.

---

## 10. Prompt template for opencode

```
Read DESIGN.md and FEATURES.md.
Build only <screen name>, using the Figma frame <node id> via the Figma MCP as the visual target.
Reuse components from components/ui before creating new ones.
Use CSS variables from lib/tokens.css; no hardcoded colors.
Data comes from lib/api (mock). Do not add features that are not in FEATURES.md.
Add loading, empty, and error states from section 7 where the screen has a list or a form.
```
