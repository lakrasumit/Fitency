import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/utils/cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, blocks interaction and announces `aria-busy`. */
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand shadow-cta hover:brightness-110 active:brightness-95',
  secondary: 'bg-raised text-ink border border-line hover:border-line-strong',
  ghost: 'text-muted hover:bg-subtle hover:text-ink',
  danger: 'bg-danger text-danger-fg border border-danger-line hover:brightness-110',
};

/** Padding keeps every button at or above the 44px minimum target (D-19). */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 text-[11px] font-bold',
  md: 'min-h-11 px-4 text-[13px] font-bold',
  lg: 'min-h-14 px-5 text-[15px] font-bold',
};

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  loadingLabel,
  fullWidth = false,
  leadingIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-[filter,background-color,border-color] duration-150',
        'disabled:cursor-not-allowed disabled:opacity-55',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? <Spinner /> : leadingIcon}
      <span>{children}</span>
      {loading && loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
    </button>
  );
}
