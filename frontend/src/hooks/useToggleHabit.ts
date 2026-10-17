import { useCallback, useState } from 'react';

import { COPY } from '../lib/copy';
import { notifyError } from '../lib/feedback';
import { useData } from '../state/data-context';
import type { ToggleResult } from '../state/data-context';

export interface UseToggleHabitResult {
  toggle: (habitId: string) => Promise<ToggleResult>;
  /** Habit ids with an in-flight write, for a subtle row-level indicator. */
  isPending: (habitId: string) => boolean;
}

/**
 * Optimistic habit toggle (PRD.md §5.3).
 *
 * The row flips instantly, then reconciles; a failed write rolls the row back
 * and surfaces inline + toast feedback (D-18).
 */
export function useToggleHabit(): UseToggleHabitResult {
  const { toggleHabit } = useData();
  const [pendingIds, setPendingIds] = useState<readonly string[]>([]);

  const toggle = useCallback(
    async (habitId: string) => {
      setPendingIds((ids) => (ids.includes(habitId) ? ids : [...ids, habitId]));

      try {
        const result = await toggleHabit(habitId);

        if (!result.ok) {
          notifyError(COPY.home.toggleError, result.error);
        }

        return result;
      } finally {
        setPendingIds((ids) => ids.filter((id) => id !== habitId));
      }
    },
    [toggleHabit],
  );

  const isPending = useCallback((habitId: string) => pendingIds.includes(habitId), [pendingIds]);

  return { toggle, isPending };
}
