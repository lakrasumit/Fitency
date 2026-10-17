import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only controls must expose an accessible name. */
  label: string;
  children: ReactNode;
  /** 36px visual, 44px hit area (D-19). */
  size?: 'sm' | 'md';
}

export function IconButton({
  label,
  children,
  className,
  size = 'md',
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-line bg-raised text-muted',
        'transition-colors hover:border-line-strong hover:text-ink',
        'disabled:cursor-not-allowed disabled:opacity-55',
        size === 'sm' && 'text-[15px]',
        className,
      )}
    >
      {children}
    </button>
  );
}
