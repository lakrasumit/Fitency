import type { HeatStatus, HeatmapData } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { Card } from '../ui/Card';
import { HeatmapCell } from './HeatmapCell';

export interface HeatmapGridProps {
  data: HeatmapData;
  title: string;
  className?: string;
}

const LEGEND_ORDER: readonly HeatStatus[] = [
  'productive',
  'normal',
  'struggled',
  'missed',
  'future',
];

const LEGEND_SWATCH: Record<HeatStatus, string> = {
  productive: 'bg-heat-productive',
  normal: 'bg-heat-normal',
  struggled: 'bg-heat-struggled',
  missed: 'bg-heat-missed',
  future: 'bg-heat-future border border-line-subtle',
};

/**
 * Habit heatmap (FR-A-3).
 *
 * Implemented as a semantic `<table>`: the habit names are row headers and the
 * weekday columns are column headers, so the grid is navigable by screen reader
 * without any ARIA gymnastics.
 */
export function HeatmapGrid({ data, title, className }: HeatmapGridProps) {
  return (
    <Card as="section" className={className} aria-labelledby="heatmap-heading">
      <h2 id="heatmap-heading" className="type-card text-ink">
        {title}
      </h2>

      <table className="mt-3 w-full table-fixed [border-spacing:6px] border-separate">
        <caption className="sr-only">{COPY.analytics.heatmapCaption}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[34%] p-0">
              <span className="sr-only">Habit</span>
            </th>
            {data.dayLabels.map((label) => (
              <th
                key={label}
                scope="col"
                className="type-caption p-0 text-center font-medium text-faint"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.habitId}>
              <th
                scope="row"
                className="type-caption truncate p-0 pr-2 text-left font-medium text-muted"
              >
                {row.name}
              </th>
              {data.dayLabels.map((dayLabel, index) => {
                const status = row.cells[index] ?? 'future';
                return (
                  <td key={dayLabel} className="p-0">
                    <HeatmapCell
                      status={status}
                      label={`${row.name}, ${dayLabel}: ${COPY.analytics.legend[status]}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        aria-label={COPY.analytics.heatmapLegendLabel}
        role="group"
        className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2"
      >
        {LEGEND_ORDER.map((status) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={cn('size-3 rounded-sm', LEGEND_SWATCH[status])} />
            <span className="type-caption text-muted">{COPY.analytics.legend[status]}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
