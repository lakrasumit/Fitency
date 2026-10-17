import { createContext, useContext } from 'react';

import type {
  AnalyticsOverview,
  AnalyticsRange,
  Habit,
  HabitChecklist,
  HabitFilterId,
  NewHabitInput,
  Progress,
} from '../lib/api';

/** Lifecycle of a server-derived slice (DESIGN.md §8.3). */
export type Status = 'idle' | 'loading' | 'error' | 'ready';

export interface Slice<T> {
  readonly status: Status;
  readonly data: T | null;
  readonly error: string | null;
  /** A background refresh — the previous data stays on screen. */
  readonly isRefetching: boolean;
}

export function createIdleSlice<T>(): Slice<T> {
  return { status: 'idle', data: null, error: null, isRefetching: false };
}

export interface DataState {
  /** Home date selector value, ISO `yyyy-MM-dd`. */
  readonly selectedDate: string;
  /** Home category filter (client-side, PRD.md §5.3). */
  readonly activeFilter: HabitFilterId;
  readonly checklist: Slice<HabitChecklist>;
  readonly analyticsRange: AnalyticsRange;
  readonly analytics: Slice<AnalyticsOverview>;
  readonly progress: Slice<Progress>;
}

export interface ToggleResult {
  readonly ok: boolean;
  readonly error?: string;
}

export interface DataContextValue {
  readonly state: DataState;
  /** Loads (or reloads) the checklist for a date. */
  loadChecklist(date: string, options?: { silent?: boolean }): Promise<void>;
  /** Loads analytics if needed; de-duplicates in-flight requests. */
  ensureAnalytics(range: AnalyticsRange): Promise<void>;
  /** Loads progress if needed; de-duplicates in-flight requests. */
  ensureProgress(): Promise<void>;
  setFilter(filter: HabitFilterId): void;
  setDate(date: string): void;
  setAnalyticsRange(range: AnalyticsRange): void;
  /** Optimistic toggle with per-habit rollback (PRD.md §5.3). */
  toggleHabit(habitId: string): Promise<ToggleResult>;
  /** Creates a habit and refreshes the affected slices. */
  createHabit(input: NewHabitInput): Promise<Habit>;
}

export const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const value = useContext(DataContext);

  if (!value) {
    throw new Error('useData must be used inside <DataProvider>.');
  }

  return value;
}
