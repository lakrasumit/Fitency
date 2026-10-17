import type { ReactNode } from 'react';

import { cn } from '../../lib/utils/cn';

export interface EmptyStateProps {
  title: string;
  body?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, body, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-surface/40 px-6 py-10 text-center',
        className,
      )}
    >
      {icon ? <span className="text-muted">{icon}</span> : null}
      <h2 className="type-card text-ink">{title}</h2>
      {body ? <p className="type-body max-w-sm text-muted">{body}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
