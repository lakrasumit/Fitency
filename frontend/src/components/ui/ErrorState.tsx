import { AlertTriangle, RefreshCw } from 'lucide-react';

import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = COPY.states.errorTitle,
  message,
  onRetry,
  retryLabel = COPY.common.retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-danger-line bg-danger px-6 py-8 text-center',
        className,
      )}
    >
      <AlertTriangle aria-hidden="true" className="size-6 text-danger-fg" />
      <h2 className="type-card text-ink">{title}</h2>
      <p className="type-body max-w-sm text-muted">{message ?? COPY.states.errorBody}</p>
      {onRetry ? (
        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          leadingIcon={<RefreshCw aria-hidden="true" className="size-4" />}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
