import { SegmentedControl } from "@/components/segmented-control"
import type { AggregateStats } from "@/lib/utils/workouts"

export type OverallRange = "week" | "month" | "all"

type WorkoutProgressCardProps = {
  stats: AggregateStats
  range: OverallRange
  onRangeChange: (range: OverallRange) => void
}

const RANGES: { value: OverallRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "all", label: "All" },
]

export function WorkoutProgressCard({
  stats,
  range,
  onRangeChange,
}: WorkoutProgressCardProps) {
  const completedPercent = stats.workoutPercent ?? 0
  const partialPercent = stats.plannedDays
    ? Math.round((stats.partialDays / stats.plannedDays) * 100)
    : 0
  const leftPercent = Math.max(0, 100 - completedPercent - partialPercent)

  return (
    <section
      aria-labelledby="workout-progress-title"
      className="surface-card rounded-xl border border-border/60 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="workout-progress-title"
          className="font-heading text-base font-semibold"
        >
          Training progress
        </h2>
        <SegmentedControl
          label="Training progress range"
          options={RANGES}
          value={range}
          onChange={onRangeChange}
        />
      </div>

      {stats.plannedDays === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No workouts planned in this period.
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-muted-foreground">
            Totals up to today, not the day selected above.
          </p>
          <div
            role="img"
            aria-label={`${completedPercent}% of workouts completed, ${partialPercent}% partially completed, ${leftPercent}% not started`}
            className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border/50 ring-inset"
          >
            <div
              className="bg-gradient-to-r from-success to-success/70 transition-[width] duration-700 ease-out"
              style={{ width: `${completedPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-primary to-primary/70 transition-[width] duration-700 ease-out"
              style={{ width: `${partialPercent}%` }}
            />
            <div
              className="bg-muted-foreground/20 transition-[width] duration-700 ease-out"
              style={{ width: `${leftPercent}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-full bg-success" />
              {stats.completedDays} of {stats.plannedDays} workouts complete
            </span>
            <span className="text-muted-foreground">
              {stats.actualReps} of {stats.plannedReps} reps
            </span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {stats.completedExercises} of {stats.plannedExercises} exercises
            completed
            {stats.partialExercises > 0
              ? ` · ${stats.partialExercises} partially completed`
              : ""}
          </p>
        </>
      )}
    </section>
  )
}
