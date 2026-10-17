import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (id: T) => void;
  label: string;
  className?: string;
}

/**
 * Overview / Habits / Patterns control (FR-A-2, D-09).
 *
 * Disabled segments stay visible and are labelled "coming soon" for screen
 * readers instead of silently disappearing.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex gap-1 rounded-lg border border-line bg-surface p-1', className)}
    >
      {options.map((option) => {
        const isActive = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            disabled={option.disabled}
            onClick={() => onChange(option.id)}
            className={cn(
              'min-h-11 flex-1 rounded-md px-3 text-[11px] font-bold transition-colors',
              isActive ? 'bg-brand text-on-brand' : 'text-muted hover:text-ink',
              option.disabled && 'cursor-not-allowed text-faint hover:text-faint',
            )}
          >
            {option.label}
            {option.disabled ? <span className="sr-only"> ({COPY.common.comingSoon})</span> : null}
          </button>
        );
      })}
    </div>
  );
}
