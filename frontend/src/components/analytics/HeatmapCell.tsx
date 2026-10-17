import type { HeatStatus } from '../../lib/api';
import { cn } from '../../lib/utils/cn';

const CELL_CLASSES: Record<HeatStatus, string> = {
  productive: 'bg-heat-productive',
  normal: 'bg-heat-normal',
  struggled: 'bg-heat-struggled',
  missed: 'bg-heat-missed',
  future: 'bg-heat-future border border-line-subtle',
};

/** Single heatmap cell — radius 6 (DESIGN.md §5). */
export function HeatmapCell({ status, label }: { status: HeatStatus; label: string }) {
  return (
    <span className={cn('block h-6 w-full rounded-sm', CELL_CLASSES[status])}>
      <span className="sr-only">{label}</span>
    </span>
  );
}
