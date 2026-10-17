import { Check } from 'lucide-react';

import { cn } from '../../lib/utils/cn';

/**
 * Presentational checkbox (24px visual).
 *
 * The interactive element is the real `<input type="checkbox">` owned by
 * `HabitCard`, which keeps the row semantic and keyboard-operable.
 * The hit area around it stays ≥44px.
 */
export function Checkbox({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
        checked ? 'border-brand bg-brand text-on-brand' : 'border-line-strong bg-transparent',
        className,
      )}
    >
      {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
    </span>
  );
}
