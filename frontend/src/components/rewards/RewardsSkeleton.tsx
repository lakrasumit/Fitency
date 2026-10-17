import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

/** Rewards skeleton matching the level/stepper/next-level/badges stack. */
export function RewardsSkeleton() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading rewards</span>

      <Card>
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-3 w-40" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mt-4 h-2 w-full rounded-pill" />
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="size-8 rounded-full" />
          ))}
        </div>
      </Card>

      <Card>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-4 w-48" />
        <Skeleton className="mt-2 h-3 w-36" />
        <Skeleton className="mt-4 h-1.5 w-full rounded-pill" />
      </Card>

      <div>
        <Skeleton className="h-4 w-40" />
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
