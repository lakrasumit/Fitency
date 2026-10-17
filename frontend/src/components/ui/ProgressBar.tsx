import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils/cn';
import { toPercent } from '../../lib/utils/date';

export interface ProgressBarProps {
  value: number;
  max: number;
  /** Accessible name — progress bars are meaningless without one. */
  label: string;
  size?: 'sm' | 'md';
  /** Uses the XP gradient (`--reward-xp-from` → `--reward-xp-to`). */
  gradient?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  size = 'md',
  gradient = false,
  className,
}: ProgressBarProps) {
  const percent = toPercent(value, max);

  const fillStyle: CSSProperties = gradient
    ? {
        width: `${percent}%`,
        backgroundImage: 'linear-gradient(90deg, var(--reward-xp-from), var(--reward-xp-to))',
      }
    : { width: `${percent}%` };

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.min(value, max)}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        'w-full overflow-hidden rounded-pill bg-sunken',
        size === 'md' ? 'h-2' : 'h-1.5',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-pill', !gradient && 'bg-brand')}
        style={fillStyle}
        aria-hidden="true"
      />
    </div>
  );
}
