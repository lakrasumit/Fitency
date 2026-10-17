/**
 * The single frontend API seam (D-26, DESIGN.md §8.2).
 *
 * `lib/api/mock` implements this interface today. A future `HttpApiClient` will
 * implement the same interface against the real backend contract — pages and
 * hooks must not change when that swap happens.
 *
 * NOTE: the HTTP client is deliberately **not** implemented yet. PRD.md §10
 * lists the endpoint shapes, error format, auth model, base URL and pagination
 * semantics the frontend is still waiting on; inventing them here would create a
 * contract the backend has not agreed to.
 */

import type {
  AnalyticsOverview,
  AnalyticsRange,
  Habit,
  HabitAttempts,
  HabitChecklist,
  HabitCompletion,
  NewHabitInput,
  Progress,
} from './types';

export interface ApiClient {
  /** Home checklist for a given ISO `yyyy-MM-dd` date. */
  getChecklist(date: string, options?: RequestOptions): Promise<HabitChecklist>;

  /** Persists a habit toggle and returns the reconciled completion. */
  setHabitCompletion(
    input: { habitId: string; date: string; completed: boolean },
    options?: RequestOptions,
  ): Promise<HabitCompletion>;

  /** Creates a habit and returns the stored entity. */
  createHabit(input: NewHabitInput, options?: RequestOptions): Promise<Habit>;

  /** Analytics overview for the selected range. */
  getAnalyticsOverview(range: AnalyticsRange, options?: RequestOptions): Promise<AnalyticsOverview>;

  /** Level, milestones, next level and badges. */
  getProgress(options?: RequestOptions): Promise<Progress>;

  /** "You've tried this N times this year" banner data. */
  getHabitAttempts(habitName: string, options?: RequestOptions): Promise<HabitAttempts>;
}

export interface RequestOptions {
  /** Aborts an in-flight mock request when a request becomes stale. */
  signal?: AbortSignal;
}
