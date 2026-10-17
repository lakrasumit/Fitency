import { useMemo } from 'react';

import type { AnalyticsChart } from '../../lib/api';
import { Card } from '../ui/Card';

export interface LineChartProps {
  chart: AnalyticsChart;
  className?: string;
}

// Viewbox geometry (DESIGN.md §4.2 the kit chart is ~314×113; extra height here
// carries the axis labels and legend).
const VIEW_WIDTH = 314;
const VIEW_HEIGHT = 148;
const PLOT_LEFT = 24;
const PLOT_RIGHT = 306;
const PLOT_TOP = 10;
const PLOT_BOTTOM = 110;

function xForIndex(index: number, count: number): number {
  if (count <= 1) return (PLOT_LEFT + PLOT_RIGHT) / 2;
  return PLOT_LEFT + (index / (count - 1)) * (PLOT_RIGHT - PLOT_LEFT);
}

function yForValue(value: number, max: number): number {
  const ratio = Math.max(0, Math.min(1, value / max));
  return PLOT_BOTTOM - ratio * (PLOT_BOTTOM - PLOT_TOP);
}

/**
 * "Perceived Energy vs. Actual Coffee" (FR-A-5, D-17).
 *
 * Hand-rolled SVG: two series, y-gridlines, points, an area fill on the energy
 * series, a legend, and a visually hidden data table so the numbers are
 * available to assistive technology. The component is only imported by the
 * lazy `/analytics` route, so no chart code reaches the other bundles (§8.5).
 */
export function LineChart({ chart, className }: LineChartProps) {
  const { points, energyLabel, coffeeLabel, yMax, yTicks, title } = chart;

  const geometry = useMemo(() => {
    const energyLine = points
      .map((point, index) => `${xForIndex(index, points.length)},${yForValue(point.energy, yMax)}`)
      .join(' ');
    const coffeeLine = points
      .map((point, index) => `${xForIndex(index, points.length)},${yForValue(point.coffee, yMax)}`)
      .join(' ');

    const areaPath =
      points.length > 1
        ? `M ${xForIndex(0, points.length)},${PLOT_BOTTOM} L ${energyLine.replaceAll(' ', ' L ')} L ${xForIndex(points.length - 1, points.length)},${PLOT_BOTTOM} Z`
        : null;

    return { energyLine, coffeeLine, areaPath };
  }, [points, yMax]);

  return (
    <Card as="section" className={className} aria-labelledby="chart-heading">
      <h2 id="chart-heading" className="type-card text-ink">
        {title}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-chart-energy" />
          <span className="type-caption text-muted">{energyLabel}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-chart-coffee" />
          <span className="type-caption text-muted">{coffeeLabel}</span>
        </span>
      </div>

      <svg
        role="img"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="mt-3 h-auto w-full"
        aria-label={`${title}: ${energyLabel} and ${coffeeLabel} for ${points.map((point) => point.label).join(', ')}.`}
      >
        {/* y gridlines + tick labels */}
        {yTicks.map((tick) => {
          const y = yForValue(tick, yMax);
          return (
            <g key={tick}>
              <line
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x={PLOT_LEFT - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                fill="var(--text-faint)"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {geometry.areaPath ? (
          <path d={geometry.areaPath} fill="var(--chart-energy)" fillOpacity="0.14" />
        ) : null}

        {points.length > 1 ? (
          <>
            <polyline
              points={geometry.energyLine}
              fill="none"
              stroke="var(--chart-energy)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={geometry.coffeeLine}
              fill="none"
              stroke="var(--chart-coffee)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 3"
            />
          </>
        ) : null}

        {points.map((point, index) => {
          const x = xForIndex(index, points.length);
          return (
            <g key={point.label}>
              <circle
                cx={x}
                cy={yForValue(point.energy, yMax)}
                r="2.8"
                fill="var(--chart-energy)"
              />
              <circle
                cx={x}
                cy={yForValue(point.coffee, yMax)}
                r="2.8"
                fill="var(--chart-coffee)"
              />
              <text
                x={x}
                y={PLOT_BOTTOM + 14}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-faint)"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Same data as a table for screen readers. */}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">{energyLabel}</th>
            <th scope="col">{coffeeLabel}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{point.energy}</td>
              <td>{point.coffee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
