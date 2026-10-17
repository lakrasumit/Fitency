import { useId } from 'react';

import { cn } from '../../lib/utils/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label text; the control itself is the switch. */
  label: string;
  description?: string;
  disabled?: boolean;
  /** Hides the visible label when the surrounding row already renders it. */
  hideLabel?: boolean;
  className?: string;
}

/** 44×24 switch with `role="switch"` (DESIGN.md §5). */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  hideLabel = false,
  className,
}: ToggleProps) {
  const descriptionId = useId();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {hideLabel ? null : (
        <span className="flex-1">
          <span className="type-card block text-ink">{label}</span>
          {description ? (
            <span id={descriptionId} className="type-caption mt-0.5 block text-muted">
              {description}
            </span>
          ) : null}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        aria-describedby={description && !hideLabel ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill border transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-55',
          checked ? 'border-brand bg-brand' : 'border-line-strong bg-sunken',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'size-4 rounded-full bg-white shadow-card transition-transform',
            checked ? 'translate-x-[26px]' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}
