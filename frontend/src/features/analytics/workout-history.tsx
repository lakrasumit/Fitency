import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { ExerciseStatusBadge } from "@/features/workouts/exercise-status"
import { getCategoryMeta } from "@/features/workouts/category"
import type { WorkoutRecord } from "@/lib/types"
import { parseDateKey } from "@/lib/utils/date"
import {
  exerciseStatus,
  workoutStats,
} from "@/lib/utils/workouts"

type WorkoutHistoryProps = {
  records: readonly WorkoutRecord[]
  days: string[]
  startDate: string
}

const HISTORY_LIMIT = 10

export function WorkoutHistory({
  records,
  days,
  startDate,
}: WorkoutHistoryProps) {
  const daySet = new Set(days)
  const visible = records
    .filter(
      (record) =>
        record.date >= startDate &&
        daySet.has(record.date) &&
        record.exercises.length > 0,
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  const shown = visible.slice(0, HISTORY_LIMIT)

  return (
    <section
      aria-labelledby="history-title"
      className="surface-card rounded-xl border border-border/60 p-5"
    >
      <h2 id="history-title" className="font-heading text-base font-semibold">
        Workout history
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Saved sessions in this range, including partially completed exercises.
      </p>

      {shown.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No saved workouts in this range yet.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {shown.map((record) => {
            const meta = getCategoryMeta(record.category)
            const Icon = meta.icon
            const stats = workoutStats(record)

            return (
              <details
                key={record.date}
                className="group rounded-xl border border-border/60 bg-muted/10 transition-colors duration-200 open:bg-muted/20 hover:bg-muted/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-2 outline-none transition-colors duration-200 hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-white shadow-soft ring-1 ring-black/5 dark:ring-white/10"
                      style={{ backgroundColor: meta.color }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {format(parseDateKey(record.date), "EEE d MMM")} ·{" "}
                        {record.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {stats.completedExercises} of{" "}
                        {stats.plannedExercises} exercises ·{" "}
                        {stats.actualReps} of {stats.plannedReps} reps
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {stats.partialExercises > 0 ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary-strong">
                        Partial
                      </span>
                    ) : null}
                    <ChevronDown
                      aria-hidden
                      className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                    />
                  </span>
                </summary>

                <ul className="mt-1 space-y-2 border-t border-border/60 px-3 py-3">
                  {record.exercises.map((exercise) => (
                    <li
                      key={exercise.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          Sets: {exercise.actualReps.join(" / ")} · target{" "}
                          {exercise.targetSets} × {exercise.targetReps}
                        </p>
                      </div>
                      <ExerciseStatusBadge
                        status={exerciseStatus(exercise)}
                      />
                    </li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>
      )}

      {visible.length > HISTORY_LIMIT ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Showing the {HISTORY_LIMIT} most recent saved workouts.
        </p>
      ) : null}
    </section>
  )
}
