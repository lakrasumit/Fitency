import { Spinner } from '../components/ui/Spinner';

/** Generic Suspense fallback used while a lazy route chunk downloads (FR-S-3). */
export function RouteFallback() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center gap-2 text-muted">
      <Spinner className="size-4 animate-spin" />
      <span className="type-caption">Loading…</span>
    </div>
  );
}
