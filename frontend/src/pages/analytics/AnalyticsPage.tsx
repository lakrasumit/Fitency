import { useState } from 'react';

import { AnalyticsSkeleton } from '../../components/analytics/AnalyticsSkeleton';
import { HeatmapGrid } from '../../components/analytics/HeatmapGrid';
import { LineChart } from '../../components/analytics/LineChart';
import { WeeklySummaryCard } from '../../components/analytics/WeeklySummaryCard';
import { RefetchIndicator } from '../../components/feedback/RefetchIndicator';
import { DropdownPill } from '../../components/ui/DropdownPill';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useAnalytics } from '../../hooks/useAnalytics';
import { COPY } from '../../lib/copy';

type AnalyticsSegment = 'overview' | 'habits' | 'patterns';

const SEGMENTS: readonly { id: AnalyticsSegment; label: string; disabled?: boolean }[] = [
  { id: 'overview', label: COPY.analytics.tabOverview },
  { id: 'habits', label: COPY.analytics.tabHabits, disabled: true },
  { id: 'patterns', label: COPY.analytics.tabPatterns, disabled: true },
];

/**
 * Analytics — Overview only (FR-A-1 … FR-A-6, D-09).
 *
 * Habits and Patterns stay visible but disabled, clearly labelled "coming soon".
 */
export default function AnalyticsPage() {
  const {
    overview,
    range,
    rangeLabel,
    rangeOptions,
    status,
    error,
    isRefetching,
    setRange,
    retry,
  } = useAnalytics();
  const [segment, setSegment] = useState<AnalyticsSegment>('overview');

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="type-h1 text-ink">{COPY.analytics.title}</h1>
          <p className="type-body mt-1 text-muted">{COPY.analytics.subtitle}</p>
        </div>
        <DropdownPill
          label={COPY.analytics.rangeLabel}
          value={range}
          options={rangeOptions}
          onChange={setRange}
        />
      </header>

      <SegmentedControl
        label={COPY.analytics.tabsLabel}
        value={segment}
        options={SEGMENTS}
        // Only Overview is designed (D-09); the other segments are disabled, so
        // this callback can never fire for them.
        onChange={(next) => setSegment(next)}
      />

      {isRefetching ? (
        <RefetchIndicator label={`${COPY.common.refreshInProgress} ${rangeLabel}`} />
      ) : null}

      {status === 'loading' || status === 'idle' ? <AnalyticsSkeleton /> : null}

      {status === 'error' ? <ErrorState message={error} onRetry={retry} /> : null}

      {status === 'ready' && overview ? (
        overview.heatmap.rows.length === 0 ? (
          <EmptyState title={COPY.analytics.emptyTitle} body={COPY.analytics.emptyBody} />
        ) : (
          <div className="flex flex-col gap-4">
            <HeatmapGrid data={overview.heatmap} title={COPY.analytics.heatmapTitle} />

            {/* Desktop: summary and chart side by side (DESIGN.md §4.2, O-5). */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
              <WeeklySummaryCard summary={overview.summary} title={COPY.analytics.summaryTitle} />
              <LineChart chart={overview.chart} />
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}
