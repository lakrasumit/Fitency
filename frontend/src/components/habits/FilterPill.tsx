import type { CategoryCount, HabitFilterId } from '../../lib/api';
import { cn } from '../../lib/utils/cn';

export interface FilterPillProps {
  filter: CategoryCount;
  active: boolean;
  onSelect: (id: HabitFilterId) => void;
}

/** Category filter pill with count (FR-H-4). */
export function FilterPill({ filter, active, onSelect }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(filter.id)}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-pill border px-3.5',
        'text-[11px] font-bold transition-colors',
        active
          ? 'border-brand-strong bg-brand-soft text-ink'
          : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink',
      )}
    >
      <span>{filter.label}</span>
      <span
        className={cn(
          'rounded-full px-1.5 text-[11px]',
          active ? 'bg-brand text-on-brand' : 'bg-subtle text-faint',
        )}
      >
        {filter.count}
      </span>
    </button>
  );
}
