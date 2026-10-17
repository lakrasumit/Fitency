import type { HabitCategory } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { CATEGORY_EMOJI } from './categoryOptions';

export interface CategoryPillProps {
  category: HabitCategory;
  selected: boolean;
  onSelect: (category: HabitCategory) => void;
  /** Radio group name; the fieldset legend carries the visible label. */
  name: string;
}

/** Single-select category pill (FR-N-3). */
export function CategoryPill({ category, selected, onSelect, name }: CategoryPillProps) {
  const label = COPY.newHabit.categoryOptions[category];

  return (
    <label
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-pill border px-3.5',
        'text-[11px] font-bold transition-colors',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-strong',
        selected
          ? 'border-cat-active-line bg-cat-active-bg text-cat-active-fg'
          : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink',
      )}
    >
      <input
        type="radio"
        name={name}
        value={category}
        checked={selected}
        onChange={() => onSelect(category)}
        className="sr-only"
      />
      <span aria-hidden="true">{CATEGORY_EMOJI[category]}</span>
      <span>{label}</span>
    </label>
  );
}
