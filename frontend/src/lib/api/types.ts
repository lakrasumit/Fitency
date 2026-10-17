/**
 * Domain types for the Fitency frontend.
 *
 * These describe what the **UI** needs. They are intentionally independent of
 * the backend's transport shapes: the `ApiClient` (./client.ts) is the seam that
 * maps a future `HttpApiClient` onto these types (D-26, PRD.md §10).
 */

export type HabitCategory = 'health' | 'mind' | 'growth' | 'lifestyle';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export type Difficulty = 'easy' | 'hard' | 'delusional';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** Reality-pill tones from the kit (amber · red · purple · orange · green). */
export type RealityTone = 'amber' | 'red' | 'purple' | 'orange' | 'green';

export type HabitIconKey = 'water' | 'meditate' | 'gym' | 'food' | 'reading' | 'default';

export interface RealityPill {
  /** Short, honest, slightly rude label (data-dependent — PRD.md §10). */
  readonly text: string;
  readonly tone: RealityTone;
}

export interface Habit {
  readonly id: string;
  readonly name: string;
  readonly category: HabitCategory;
  readonly timeOfDay: TimeOfDay;
  /** Display-ready time, e.g. "8:00 AM". */
  readonly timeLabel: string;
  readonly icon: HabitIconKey;
  readonly realityPill: RealityPill;
  readonly repeatDays: readonly Weekday[];
  readonly reminderEnabled: boolean;
  /** `HH:mm` 24h, present only when the reminder is enabled. */
  readonly reminderTime: string | null;
  readonly difficulty: Difficulty;
}

export interface ChecklistItem {
  readonly habit: Habit;
  readonly completed: boolean;
}

/** Home filter identifiers: `all` plus the three time-of-day buckets. */
export type HabitFilterId = 'all' | TimeOfDay;

export interface CategoryCount {
  readonly id: HabitFilterId;
  readonly label: string;
  /** Data-dependent count (PRD.md §10). */
  readonly count: number;
}

export interface StreakSummary {
  /** Consecutive days logged (data-dependent — PRD.md §10). */
  readonly days: number;
  readonly message: string;
}

export interface HabitChecklist {
  /** ISO `yyyy-MM-dd`. */
  readonly date: string;
  readonly items: readonly ChecklistItem[];
  readonly categoryCounts: readonly CategoryCount[];
  readonly streak: StreakSummary;
}

export interface HabitCompletion {
  readonly habitId: string;
  readonly date: string;
  readonly completed: boolean;
}

export type HeatStatus = 'productive' | 'normal' | 'struggled' | 'missed' | 'future';

export interface HeatmapRow {
  readonly habitId: string;
  readonly name: string;
  readonly cells: readonly HeatStatus[];
}

export interface HeatmapData {
  readonly dayLabels: readonly string[];
  readonly rows: readonly HeatmapRow[];
}

export type MetricTone = 'green' | 'purple' | 'red';

export interface SummaryMetric {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly tone: MetricTone;
}

export interface WeeklySummary {
  readonly message: string;
  readonly emoji: string;
  readonly metrics: readonly SummaryMetric[];
}

export interface ChartPoint {
  readonly label: string;
  /** 0–10 perceived energy. */
  readonly energy: number;
  /** 0–10 coffee consumed. */
  readonly coffee: number;
}

export interface AnalyticsChart {
  readonly title: string;
  readonly energyLabel: string;
  readonly coffeeLabel: string;
  readonly yMax: number;
  readonly yTicks: readonly number[];
  readonly points: readonly ChartPoint[];
}

export type AnalyticsRange = 'this-week' | 'last-week';

export interface AnalyticsOverview {
  readonly range: AnalyticsRange;
  readonly rangeLabel: string;
  readonly heatmap: HeatmapData;
  readonly summary: WeeklySummary;
  readonly chart: AnalyticsChart;
}

export type MilestoneState = 'completed' | 'current' | 'locked';

export interface Milestone {
  readonly id: string;
  readonly level: number;
  readonly title: string;
  readonly state: MilestoneState;
}

export type BadgeTone = 'amber' | 'rose' | 'blue';

export type BadgeIconKey = 'mask' | 'alarm' | 'moon' | 'droplet' | 'sunrise' | 'shield';

export interface Badge {
  readonly id: string;
  readonly title: string;
  readonly tone: BadgeTone;
  readonly icon: BadgeIconKey;
  readonly earned: boolean;
  /** e.g. "Earned 3 Sep" — omitted while locked or undesigned. */
  readonly earnedLabel?: string;
}

export interface NextLevel {
  readonly level: number;
  readonly title: string;
  readonly unlockCondition: string;
  readonly current: number;
  readonly target: number;
  readonly unit: string;
}

export interface Progress {
  readonly level: number;
  readonly levelTitle: string;
  readonly rankTitle: string;
  readonly xp: number;
  readonly xpToNext: number;
  readonly milestones: readonly Milestone[];
  readonly nextLevel: NextLevel;
  readonly badges: readonly Badge[];
}

/** Payload accepted by `ApiClient.createHabit` — mirrors the form schema. */
export interface NewHabitInput {
  readonly name: string;
  readonly category: HabitCategory;
  readonly difficulty: Difficulty;
  readonly reminderEnabled: boolean;
  readonly reminderTime: string | null;
  readonly repeatDays: readonly Weekday[];
}

export interface HabitAttempts {
  /** "You've tried this N times this year" (PRD.md §10). */
  readonly count: number;
}

/** Mock operations that can be force-failed for state previews. */
export type ApiOperation =
  'checklist' | 'completion' | 'create' | 'analytics' | 'progress' | 'attempts';
