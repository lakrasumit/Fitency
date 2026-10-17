import type { WeeklySummary } from '../../lib/api';
import { cn } from '../../lib/utils/cn';
import { Card } from '../ui/Card';
import { MetricTile } from './MetricTile';

export interface WeeklySummaryCardProps {
  summary: WeeklySummary;
  title: string;
  className?: string;
}

/** Weekly summary: honest message + emoji + three metric tiles (FR-A-4). */
export function WeeklySummaryCard({ summary, title, className }: WeeklySummaryCardProps) {
  return (
    <Card as="section" className={className} aria-labelledby="weekly-summary-heading">
      <h2 id="weekly-summary-heading" className="type-card text-ink">
        {title}
      </h2>

      <p className="type-body mt-2 text-muted">
        {summary.message}{' '}
        <span aria-hidden="true" className="text-[15px]">
          {summary.emoji}
        </span>
      </p>

      <div className={cn('mt-3 grid grid-cols-3 gap-2')}>
        {summary.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>
    </Card>
  );
}
