import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

/** Analytics skeleton matching the heatmap/summary/chart stack (DESIGN.md §7). */
export function AnalyticsSkeleton() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading analytics</span>

      <Card>
        <Skeleton className="h-4 w-32" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              <Skeleton className="h-5 w-1/4" />
              {Array.from({ length: 7 }).map((__, cellIndex) => (
                <Skeleton key={cellIndex} className="size-6 flex-1 rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-3 h-3.5 w-full" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-md" />
          ))}
        </div>
      </Card>

      <Card>
        <Skeleton className="h-4 w-56" />
        <Skeleton className="mt-4 h-32 w-full rounded-lg" />
      </Card>
    </div>
  );
}
