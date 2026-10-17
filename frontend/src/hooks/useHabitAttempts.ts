import { useEffect, useState } from 'react';

import { api } from '../lib/api';
import { isAbortError } from '../lib/utils/errors';

export interface UseHabitAttemptsResult {
  /** `null` until a name long enough to check has been entered. */
  readonly count: number | null;
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
}

const DEBOUNCE_MS = 450;

/**
 * Powers the "you've tried this N times this year" banner (FR-N-5).
 *
 * The count is backend-owned data (PRD.md §10); the frontend only renders it.
 */
export function useHabitAttempts(name: string): UseHabitAttemptsResult {
  const [state, setState] = useState<UseHabitAttemptsResult>({ count: null, status: 'idle' });

  useEffect(() => {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setState({ count: null, status: 'idle' });
      return undefined;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      setState((previous) => ({ count: previous.count, status: 'loading' }));

      void (async () => {
        try {
          const result = await api.getHabitAttempts(trimmed, { signal: controller.signal });
          if (controller.signal.aborted) return;
          setState({ count: result.count, status: 'ready' });
        } catch (error) {
          if (isAbortError(error) || controller.signal.aborted) return;
          setState({ count: null, status: 'error' });
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [name]);

  return state;
}
