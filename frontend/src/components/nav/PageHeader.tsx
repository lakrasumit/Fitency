import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { IconButton } from '../ui/IconButton';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Shows a back control. Falls back to history when no `onBack` is given. */
  back?: boolean;
  onBack?: () => void;
  backLabel?: string;
  /** Right-aligned actions (e.g. the Rewards share button). */
  action?: ReactNode;
  className?: string;
}

/** Shared page header: back button + title/subtitle + optional right action. */
export function PageHeader({
  title,
  subtitle,
  back = false,
  onBack,
  backLabel = COPY.newHabit.backLabel,
  action,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    if (window.history.length > 1) {
      void navigate(-1);
      return;
    }

    void navigate('/');
  }

  return (
    <header className={cn('flex items-center gap-3', className)}>
      {back ? (
        <IconButton label={backLabel} onClick={handleBack}>
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
        </IconButton>
      ) : null}

      <div className="min-w-0 flex-1">
        <h1 className="type-title truncate text-ink">{title}</h1>
        {subtitle ? <p className="type-caption mt-0.5 text-muted">{subtitle}</p> : null}
      </div>

      {action}
    </header>
  );
}
