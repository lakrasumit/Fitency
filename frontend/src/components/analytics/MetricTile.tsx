import type { MetricTone, SummaryMetric } from '../../lib/api';
import { cn } from '../../lib/utils/cn';

const TONE_CLASSES: Record<MetricTone, string> = {
  green: 'bg-success text-success-fg',
  purple: 'bg-purple text-purple-fg',
  red: 'bg-danger text-danger-fg',
};

/** Weekly summary metric tile (FR-A-4, DESIGN.md §2.1). */
export function MetricTile({ metric, className }: { metric: SummaryMetric; className?: string }) {
  return (
    <div className={cn('rounded-md p-3 text-center', TONE_CLASSES[metric.tone], className)}>
      <p className="text-[18px] font-bold leading-[22.5px]">{metric.value}</p>
      <p className="type-caption mt-0.5 text-muted">{metric.label}</p>
    </div>
  );
}
