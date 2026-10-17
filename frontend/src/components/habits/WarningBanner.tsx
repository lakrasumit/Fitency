import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils/cn';

export interface WarningBannerProps {
  children: ReactNode;
  className?: string;
}

/** Reality-check banner (FR-N-5): amber tinted notice. */
export function WarningBanner({ children, className }: WarningBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-banner-line bg-banner-bg p-3 text-banner-fg',
        className,
      )}
    >
      <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p className="type-caption">{children}</p>
    </div>
  );
}
