import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ReactNode } from 'react';

import { api } from '../lib/api';
import type {
  AnalyticsOverview,
  AnalyticsRange,
  Habit,
  HabitChecklist,
  HabitFilterId,
  NewHabitInput,
  Progress,
} from '../lib/api';
import { COPY } from '../lib/copy';
import { toDateKey } from '../lib/utils/date';
import { isAbortError, toErrorMessage } from '../lib/utils/errors';
import {
  DataContext,
  createIdleSlice,
  type DataContextValue,
  type DataState,
  type Slice,
  type ToggleResult,
} from './data-context';

/**
 * Server state for the whole app (D-05, DESIGN.md §8.3).
 *
 * There is no query cache by design: every fetch is explicit, and invalidating
 * `progress`/`analytics` after a habit toggle or creation is done deliberately
 * in `refreshDerived()`.
 */

type Action =
  | { type: 'date/set'; date: string }
  | { type: 'filter/set'; filter: HabitFilterId }
  | { type: 'range/set'; range: AnalyticsRange }
  | { type: 'checklist/request'; silent: boolean }
  | { type: 'checklist/success'; checklist: HabitChecklist }
  | { type: 'checklist/error'; error: string }
  | { type: 'checklist/optimistic'; habitId: string; completed: boolean }
  | { type: 'analytics/request'; silent: boolean }
  | { type: 'analytics/success'; analytics: AnalyticsOverview }
  | { type: 'analytics/error'; error: string }
  | { type: 'progress/request'; silent: boolean }
  | { type: 'progress/success'; progress: Progress }
  | { type: 'progress/error'; error: string };

function startRequest<T>(slice: Slice<T>, silent: boolean): Slice<T> {
  if (silent && slice.data) {
    return { ...slice, status: 'ready', error: null, isRefetching: true };
  }

  return { status: 'loading', data: null, error: null, isRefetching: false };
}

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case 'date/set':
      return { ...state, selectedDate: action.date };

    case 'filter/set':
      return { ...state, activeFilter: action.filter };

    case 'range/set':
      return { ...state, analyticsRange: action.range };

    case 'checklist/request':
      return { ...state, checklist: startRequest(state.checklist, action.silent) };

    case 'checklist/success':
      return {
        ...state,
        checklist: {
          status: 'ready',
          data: action.checklist,
          error: null,
          isRefetching: false,
        },
      };

    case 'checklist/error':
      return {
        ...state,
        checklist: { status: 'error', data: null, error: action.error, isRefetching: false },
      };

    case 'checklist/optimistic': {
      const current = state.checklist.data;
      if (!current) return state;

      return {
        ...state,
        checklist: {
          ...state.checklist,
          data: {
            ...current,
            items: current.items.map((item) =>
              item.habit.id === action.habitId ? { ...item, completed: action.completed } : item,
            ),
          },
        },
      };
    }

    case 'analytics/request':
      return { ...state, analytics: startRequest(state.analytics, action.silent) };

    case 'analytics/success':
      return {
        ...state,
        analytics: {
          status: 'ready',
          data: action.analytics,
          error: null,
          isRefetching: false,
        },
      };

    case 'analytics/error':
      return {
        ...state,
        analytics: { status: 'error', data: null, error: action.error, isRefetching: false },
      };

    case 'progress/request':
      return { ...state, progress: startRequest(state.progress, action.silent) };

    case 'progress/success':
      return {
        ...state,
        progress: { status: 'ready', data: action.progress, error: null, isRefetching: false },
      };

    case 'progress/error':
      return {
        ...state,
        progress: { status: 'error', data: null, error: action.error, isRefetching: false },
      };

    default:
      return state;
  }
}

function createInitialState(): DataState {
  return {
    selectedDate: toDateKey(new Date()),
    activeFilter: 'all',
    checklist: createIdleSlice<HabitChecklist>(),
    analyticsRange: 'this-week',
    analytics: createIdleSlice<AnalyticsOverview>(),
    progress: createIdleSlice<Progress>(),
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const checklistController = useRef<AbortController | null>(null);
  const analyticsController = useRef<AbortController | null>(null);
  const progressController = useRef<AbortController | null>(null);

  /** Mirrors state for event handlers without re-creating callbacks. */
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  const loadChecklist = useCallback(async (date: string, options?: { silent?: boolean }) => {
    checklistController.current?.abort();
    const controller = new AbortController();
    checklistController.current = controller;

    dispatch({ type: 'checklist/request', silent: Boolean(options?.silent) });

    try {
      const checklist = await api.getChecklist(date, { signal: controller.signal });
      if (controller.signal.aborted) return;
      dispatch({ type: 'checklist/success', checklist });
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) return;
      dispatch({ type: 'checklist/error', error: toErrorMessage(error) });
    }
  }, []);

  const fetchAnalytics = useCallback(async (range: AnalyticsRange, silent: boolean) => {
    analyticsController.current?.abort();
    const controller = new AbortController();
    analyticsController.current = controller;

    dispatch({ type: 'analytics/request', silent });

    try {
      const analytics = await api.getAnalyticsOverview(range, { signal: controller.signal });
      if (controller.signal.aborted) return;
      dispatch({ type: 'analytics/success', analytics });
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) return;
      dispatch({ type: 'analytics/error', error: toErrorMessage(error) });
    }
  }, []);

  const fetchProgress = useCallback(async (silent: boolean) => {
    progressController.current?.abort();
    const controller = new AbortController();
    progressController.current = controller;

    dispatch({ type: 'progress/request', silent });

    try {
      const progress = await api.getProgress({ signal: controller.signal });
      if (controller.signal.aborted) return;
      dispatch({ type: 'progress/success', progress });
    } catch (error) {
      if (isAbortError(error) || controller.signal.aborted) return;
      dispatch({ type: 'progress/error', error: toErrorMessage(error) });
    }
  }, []);

  /** Explicit invalidation: only reload slices the user has already seen. */
  const refreshDerived = useCallback(() => {
    const current = latest.current;
    if (current.analytics.status === 'ready') {
      void fetchAnalytics(current.analyticsRange, true);
    }
    if (current.progress.status === 'ready') {
      void fetchProgress(true);
    }
  }, [fetchAnalytics, fetchProgress]);

  const ensureAnalytics = useCallback(
    async (range: AnalyticsRange) => {
      const current = latest.current;
      const alreadyLoaded =
        current.analytics.status === 'ready' &&
        current.analytics.data?.range === range &&
        current.analyticsRange === range;

      if (alreadyLoaded || current.analytics.status === 'loading') return;
      await fetchAnalytics(range, false);
    },
    [fetchAnalytics],
  );

  const ensureProgress = useCallback(async () => {
    const current = latest.current;
    if (current.progress.status === 'ready' || current.progress.status === 'loading') return;
    await fetchProgress(false);
  }, [fetchProgress]);

  const toggleHabit = useCallback(
    async (habitId: string): Promise<ToggleResult> => {
      const current = latest.current;
      const item = current.checklist.data?.items.find(
        (checklistItem) => checklistItem.habit.id === habitId,
      );

      if (!item) {
        return { ok: false, error: COPY.states.errorBody };
      }

      const nextCompleted = !item.completed;
      dispatch({ type: 'checklist/optimistic', habitId, completed: nextCompleted });

      try {
        await api.setHabitCompletion({
          habitId,
          date: current.selectedDate,
          completed: nextCompleted,
        });
        refreshDerived();
        return { ok: true };
      } catch (error) {
        dispatch({ type: 'checklist/optimistic', habitId, completed: item.completed });
        return { ok: false, error: toErrorMessage(error) };
      }
    },
    [refreshDerived],
  );

  const createHabit = useCallback(
    async (input: NewHabitInput): Promise<Habit> => {
      const habit = await api.createHabit(input);
      await loadChecklist(latest.current.selectedDate, { silent: true });
      refreshDerived();
      return habit;
    },
    [loadChecklist, refreshDerived],
  );

  const setFilter = useCallback((filter: HabitFilterId) => {
    dispatch({ type: 'filter/set', filter });
  }, []);

  const setDate = useCallback((date: string) => {
    dispatch({ type: 'date/set', date });
  }, []);

  const setAnalyticsRange = useCallback((range: AnalyticsRange) => {
    dispatch({ type: 'range/set', range });
  }, []);

  // Initial load, and reload whenever the selected date changes.
  useEffect(() => {
    void loadChecklist(state.selectedDate);
  }, [loadChecklist, state.selectedDate]);

  const value = useMemo<DataContextValue>(
    () => ({
      state,
      loadChecklist,
      ensureAnalytics,
      ensureProgress,
      setFilter,
      setDate,
      setAnalyticsRange,
      toggleHabit,
      createHabit,
    }),
    [
      state,
      loadChecklist,
      ensureAnalytics,
      ensureProgress,
      setFilter,
      setDate,
      setAnalyticsRange,
      toggleHabit,
      createHabit,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
