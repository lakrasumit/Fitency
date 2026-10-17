import type { Weekday } from '../../lib/api';
import { cn } from '../../lib/utils/cn';

export interface DayChipProps {
  day: Weekday;
  short: string;
  full: string;
  selected: boolean;
  onToggle: (day: Weekday) => void;
}

/**
 * Repeat-day chip (FR-N-7) — multi-select.
 *
 * Rendered at 44px tall in a 7-column grid, which keeps every target above the
 * WCAG 2.5.8 (24×24) minimum even at 320px viewport width.
 */
export function DayChip({ day, short, full, selected, onToggle }: DayChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(day)}
      className={cn(
        'flex h-11 items-center justify-center rounded-md border text-[11px] font-bold transition-colors',
        selected
          ? 'border-brand-strong bg-brand-soft text-ink'
          : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink',
      )}
    >
      <span aria-hidden="true">{short}</span>
      <span className="sr-only">
        {full}
        {selected ? ', selected' : ', not selected'}
      </span>
    </button>
  );
}
