import { Clock } from 'lucide-react';
import { useId } from 'react';

import { cn } from '../../lib/utils/cn';

export interface TimeButtonProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Reminder time control (FR-N-6).
 *
 * Uses the native time input: it is keyboard accessible, localized by the
 * browser, and avoids inventing a bespoke time picker for an undesigned
 * interaction (O-1/O-2 territory).
 */
export function TimeButton({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className,
}: TimeButtonProps) {
  const inputId = useId();

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="type-caption text-muted">
        {label}
      </label>
      <div className="relative">
        <Clock
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
        <input
          id={inputId}
          type="time"
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'min-h-12 w-full rounded-md border bg-raised pl-9 pr-3 text-[13px] text-ink',
            'disabled:cursor-not-allowed disabled:opacity-55',
            error ? 'border-danger-line' : 'border-line focus:border-brand-strong',
          )}
        />
      </div>
      {error ? (
        <span id={`${inputId}-error`} className="type-caption text-danger-fg">
          {error}
        </span>
      ) : null}
    </div>
  );
}
