import { useCallback, useEffect } from 'react';

import type { Progress } from '../lib/api';
import { useData } from '../state/data-context';

export interface UseProgressResult {
  readonly progress: Progress | null;
  readonly status: 'idle' | 'loading' | 'error' | 'ready';
  readonly error: string | null;
  readonly isRefetching: boolean;
  readonly retry: () => void;
}

export function useProgress(): UseProgressResult {
  const { state, ensureProgress } = useData();
  const { progress } = state;

  useEffect(() => {
    void ensureProgress();
  }, [ensureProgress]);

  const retry = useCallback(() => {
    void ensureProgress();
  }, [ensureProgress]);

  return {
    progress: progress.data,
    status: progress.status,
    error: progress.error,
    isRefetching: progress.isRefetching,
    retry,
  };
}
