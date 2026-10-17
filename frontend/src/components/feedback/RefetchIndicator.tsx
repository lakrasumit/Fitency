import { Spinner } from '../ui/Spinner';

/**
 * Non-blocking refetch indicator (DESIGN.md §7 "Refetching").
 *
 * The previous data stays on screen; this only announces the background refresh.
 */
export function RefetchIndicator({ label }: { label: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-1.5 text-muted">
      <Spinner className="size-3.5 animate-spin" />
      <span className="type-caption">{label}</span>
    </span>
  );
}
