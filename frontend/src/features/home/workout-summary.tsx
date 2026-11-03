import { Dumbbell, Sparkles } from "lucide-react"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { getCategoryMeta } from "@/features/workouts/category"
import { STATUS_META } from "@/features/workouts/status-meta"
import type { WorkoutRecord } from "@/lib/types"
import type { WorkoutStats } from "@/lib/utils/workouts"

type WorkoutSummaryProps = {
  record: WorkoutRecord
  stats: WorkoutStats
  suggested: boolean
  onChangeWorkout: () => void
}

export function WorkoutSummary({
  record,
  stats,
  suggested,
  onChangeWorkout,
}: WorkoutSummaryProps) {
  const meta = getCategoryMeta(record.category)
  const Icon = meta.icon
  const percent = stats.repsPercent ?? 0

  return (
    <section
      aria-labelledby="workout-summary-title"
      className="surface-card rounded-xl border border-border/60 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-category-foreground shadow-soft ring-1 ring-black/5 dark:ring-white/10"
            style={{ backgroundColor: meta.color }}
          >
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="workout-summary-title"
                className="font-heading text-xl font-semibold"
              >
                {record.name}
              </h2>
              {suggested ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-status-info/10 px-2 py-0.5 text-[0.65rem] font-medium text-status-info-strong ring-1 ring-status-info/20">
                  <Sparkles aria-hidden className="size-3" />
                  Suggested
                </span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{record.focus}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onChangeWorkout}
        >
          <Dumbbell aria-hidden />
          Change
        </Button>
      </div>

      {stats.hasPlan ? (
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <ProgressRing
            value={percent / 100}
            label={`${record.name}: ${percent}% of planned reps recorded`}
            size={132}
            strokeWidth={12}
            className="shrink-0"
          >
            <span className="font-heading text-2xl font-semibold">
              {percent}%
            </span>
            <span className="text-xs text-muted-foreground">
              {stats.actualReps} / {stats.plannedReps} reps
            </span>
          </ProgressRing>

          <dl className="grid w-full grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-status-done/10 px-2 py-3 ring-1 ring-status-done/20 ring-inset">
              <dt className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase lg:text-xs">
                {STATUS_META.completed.shortLabel}
              </dt>
              <dd className="mt-1 font-heading text-xl font-semibold text-status-done-strong tabular-nums lg:text-2xl">
                {stats.completedExercises}
              </dd>
            </div>
            <div className="rounded-lg bg-status-partial/10 px-2 py-3 ring-1 ring-status-partial/20 ring-inset">
              <dt className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase lg:text-xs">
                {STATUS_META.partial.shortLabel}
              </dt>
              <dd className="mt-1 font-heading text-xl font-semibold text-status-partial-strong tabular-nums lg:text-2xl">
                {stats.partialExercises}
              </dd>
            </div>
            <div className="rounded-lg bg-status-not-done/10 px-2 py-3 ring-1 ring-status-not-done/20 ring-inset">
              <dt className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase lg:text-xs">
                {STATUS_META.notCompleted.shortLabel}
              </dt>
              <dd className="mt-1 font-heading text-xl font-semibold text-status-not-done-strong tabular-nums lg:text-2xl">
                {stats.notCompletedExercises}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {record.category === "rest"
            ? "Rest day. No workout planned — recovery is part of the plan."
            : "No exercises planned for this day. Choose a workout or rest day."}
        </p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {stats.plannedExercises} exercises · {stats.plannedSets} sets ·{" "}
        {stats.plannedReps} target reps
      </p>
    </section>
  )
}
