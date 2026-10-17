import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils/cn';

export interface TextInputProps extends ComponentPropsWithRef<'input'> {
  label: string;
  /** Validation message; also announced through `aria-describedby`. */
  error?: string;
  hint?: string;
}

export function TextInput({ label, error, hint, className, id, ...rest }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? `field-${generatedId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const showError = Boolean(error);

  const describedBy = [hint && !showError ? hintId : null, showError ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="type-caption text-muted">
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        aria-invalid={showError || undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'min-h-12 w-full rounded-md border bg-raised px-3 py-2 text-ink placeholder:text-faint',
          'text-[13px] leading-[19.5px] transition-colors',
          showError ? 'border-danger-line' : 'border-line focus:border-brand-strong',
        )}
      />
      {hint && !showError ? (
        <span id={hintId} className="type-caption text-faint">
          {hint}
        </span>
      ) : null}
      {showError ? (
        <span id={errorId} className="type-caption text-danger-fg">
          {error}
        </span>
      ) : null}
    </div>
  );
}
