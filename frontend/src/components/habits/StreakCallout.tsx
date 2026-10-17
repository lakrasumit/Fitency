import { Flame } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils/cn';

export interface StreakCalloutProps {
  days: number;
  message: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Streak callout (FR-H-7).
 *
 * The kit renders it as tappable, but the destination is undesigned (D-10), so
 * v1 keeps it a static card rather than a dead link.
 */
export function StreakCallout({ days, message, className, children }: StreakCalloutProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3.5 rounded-xl border p-4',
        'border-[var(--streak-bd)] shadow-card',
        className,
      )}
      style={{
        backgroundImage: 'linear-gradient(135deg, var(--streak-from) 0%, var(--streak-to) 100%)',
      }}
    >
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[var(--streak-bd)] bg-[var(--orange-bg)] text-[var(--orange-fg)]"
      >
        <Flame className="size-5" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="type-card text-ink">{days === 1 ? '1 Day' : `${days} Days`}</p>
        <p className="type-caption mt-0.5 text-[var(--streak-subtitle)]">{message}</p>
      </div>

      {children}
    </div>
  );
}
