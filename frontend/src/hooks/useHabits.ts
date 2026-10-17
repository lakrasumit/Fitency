import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { CategoryCount, ChecklistItem, HabitFilterId, StreakSummary } from '../lib/api';
import { formatDateAccessible, formatDateLabel, toDateKey } from '../lib/utils/date';
import { useOnlineStatus } from './useOnlineStatus';
import { useData } from '../state/data-context';

export interface UseHabitsResult {
  /** ISO date currently being viewed. */
  readonly date: string;
  readonly dateLabel: string;
  readonly dateAccessibleLabel: string;
  readonly isToday: boolean;
  readonly activeFilter: HabitFilterId;
  readonly counts: readonly CategoryCount[];
  /** Habits after the client-side time-of-day filter (PRD.md §5.3). */
  readonly items: readonly ChecklistItem[];
  readonly allItems: readonly ChecklistItem[];
  readonly completedCount: number;
  readonly totalCount: number;
  readonly streak: StreakSummary | null;
  readonly status: 'idle' | 'loading' | 'error' | 'ready';
  readonly error: string | null;
  readonly isRefetching: boolean;
  readonly isOffline: boolean;
  readonly setFilter: (filter: HabitFilterId) => void;
  readonly setDate: (date: string) => void;
  readonly retry: () => void;
}

export function useHabits(): UseHabitsResult {
  const { state, setFilter, setDate, loadChecklist } = useData();
  const online = useOnlineStatus();

  const { checklist, activeFilter, selectedDate } = state;

  const allItems = useMemo(() => checklist.data?.items ?? [], [checklist.data]);

  const items = useMemo(
    () =>
      activeFilter === 'all'
        ? allItems
        : allItems.filter((item) => item.habit.timeOfDay === activeFilter),
    [activeFilter, allItems],
  );

  const counts = useMemo<readonly CategoryCount[]>(
    () =>
      checklist.data?.categoryCounts ?? [
        { id: 'all', label: 'All', count: 0 },
        { id: 'morning', label: 'Morning', count: 0 },
        { id: 'afternoon', label: 'Afternoon', count: 0 },
        { id: 'evening', label: 'Evening', count: 0 },
      ],
    [checklist.data],
  );

  const selectedDateValue = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);

  // Refresh automatically once connectivity returns (FR-S-6).
  const wasOffline = useRef(!online);
  useEffect(() => {
    if (online && wasOffline.current && checklist.status === 'error') {
      void loadChecklist(selectedDate, { silent: true });
    }
    wasOffline.current = !online;
  }, [online, checklist.status, loadChecklist, selectedDate]);

  const retry = useCallback(() => {
    void loadChecklist(selectedDate);
  }, [loadChecklist, selectedDate]);

  return {
    date: selectedDate,
    dateLabel: formatDateLabel(selectedDateValue),
    dateAccessibleLabel: formatDateAccessible(selectedDateValue),
    isToday: selectedDate === toDateKey(new Date()),
    activeFilter,
    counts,
    items,
    allItems,
    completedCount: allItems.filter((item) => item.completed).length,
    totalCount: allItems.length,
    streak: checklist.data?.streak ?? null,
    status: checklist.status,
    error: checklist.error,
    isRefetching: checklist.isRefetching,
    isOffline: !online,
    setFilter,
    setDate,
    retry,
  };
}
