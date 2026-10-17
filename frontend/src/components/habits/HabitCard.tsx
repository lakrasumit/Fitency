import { Clock } from 'lucide-react';

import type { ChecklistItem } from '../../lib/api';
import { cn } from '../../lib/utils/cn';
import { Checkbox } from '../ui/Checkbox';
import { Spinner } from '../ui/Spinner';
import { HabitIcon } from './HabitIcon';
import { RealityPill } from './RealityPill';

export interface HabitCardProps {
  item: ChecklistItem;
  onToggle: (habitId: string) => void;
  /** Write in flight — the row shows a subtle spinner instead of the checkbox. */
  pending?: boolean;
  /** Offline (or otherwise unavailable) — toggling is paused (DESIGN.md §7). */
  disabled?: boolean;
}

/**
 * One checklist row (FR-H-5).
 *
 * The whole row is a `<label>` bound to a real checkbox, so it is tappable
 * anywhere, keyboard operable, and needs no ARIA role overrides (D-19).
 */
export function HabitCard({ item, onToggle, pending = false, disabled = false }: HabitCardProps) {
  const { habit, completed } = item;

  return (
    <li>
      <label
        className={cn(
          'flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface p-4 shadow-card transition-colors',
          'hover:border-line-strong',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-strong',
          disabled && 'cursor-not-allowed opacity-70',
        )}
      >
        <HabitIcon icon={habit.icon} />

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span
            className={cn(
              'type-habit truncate',
              completed ? 'text-muted line-through decoration-2' : 'text-ink',
            )}
          >
            {habit.name}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            <span className="type-caption inline-flex items-center gap-1 text-muted">
              <Clock aria-hidden="true" className="size-3.5" />
              {habit.timeLabel}
            </span>
            <RealityPill pill={habit.realityPill} />
          </span>
        </span>

        <input
          type="checkbox"
          className="sr-only"
          checked={completed}
          disabled={disabled || pending}
          onChange={() => onToggle(habit.id)}
        />

        {pending ? (
          <span className="flex size-6 shrink-0 items-center justify-center text-brand-strong">
            <Spinner className="size-4 animate-spin" />
            <span className="sr-only">Saving</span>
          </span>
        ) : (
          <Checkbox checked={completed} />
        )}
      </label>
    </li>
  );
}
