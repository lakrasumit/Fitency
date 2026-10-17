import { useCallback, useEffect } from 'react';

import type { AnalyticsOverview, AnalyticsRange } from '../lib/api';
import { analyticsRangeLabel } from '../lib/utils/date';
import { useData } from '../state/data-context';

export interface UseAnalyticsResult {
  readonly overview: AnalyticsOverview | null;
  readonly range: AnalyticsRange;
  readonly rangeLabel: string;
  readonly rangeOptions: readonly { id: AnalyticsRange; label: string }[];
  readonly status: 'idle' | 'loading' | 'error' | 'ready';
  readonly error: string | null;
  readonly isRefetching: boolean;
  readonly setRange: (range: AnalyticsRange) => void;
  readonly retry: () => void;
}

export function useAnalytics(): UseAnalyticsResult {
  const { state, ensureAnalytics, setAnalyticsRange } = useData();
  const { analytics, analyticsRange } = state;

  useEffect(() => {
    void ensureAnalytics(analyticsRange);
  }, [ensureAnalytics, analyticsRange]);

  const retry = useCallback(() => {
    void ensureAnalytics(analyticsRange);
  }, [ensureAnalytics, analyticsRange]);

  return {
    overview: analytics.data,
    range: analyticsRange,
    rangeLabel: analyticsRangeLabel(analyticsRange),
    rangeOptions: [
      { id: 'this-week', label: analyticsRangeLabel('this-week') },
      { id: 'last-week', label: analyticsRangeLabel('last-week') },
    ],
    status: analytics.status,
    error: analytics.error,
    isRefetching: analytics.isRefetching,
    setRange: setAnalyticsRange,
    retry,
  };
}
