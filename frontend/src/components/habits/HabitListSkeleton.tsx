import { Skeleton } from '../ui/Skeleton';

/** Checklist skeleton matching the final row layout (DESIGN.md §7). */
export function HabitListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-3">
      <span className="sr-only">Loading habits</span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-16 items-center gap-3 rounded-lg border border-line bg-surface p-4"
        >
          <Skeleton className="size-11 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </div>
          <Skeleton className="size-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}
