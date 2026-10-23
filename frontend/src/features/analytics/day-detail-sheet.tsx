import { format } from "date-fns"
import { Link } from "react-router"
import { BottomSheet } from "@/components/bottom-sheet"
import { Button } from "@/components/ui/button"
import { ExerciseStatusBadge } from "@/features/workouts/exercise-status"
import { getCategoryMeta } from "@/features/workouts/category"
import type { WorkoutRecord } from "@/lib/types"
import { parseDateKey } from "@/lib/utils/date"
import {
  exerciseActualReps,
  exercisePlannedReps,
  exerciseStatus,
  resolveWorkout,
  workoutStats,
} from "@/lib/utils/workouts"

type DayDetailSheetProps = {
  date: string | null
  records: readonly WorkoutRecord[]
  onClose: () => void
  onCloseAutoFocus?: (event: Event) => void
}

export function DayDetailSheet({
  date,
  records,
  onClose,
  onCloseAutoFocus,
}: DayDetailSheetProps) {
  const record = date ? resolveWorkout(date, records) : null
  const stats = workoutStats(record)
  const isRest = record?.category === "rest"
  const meta = record ? getCategoryMeta(record.category) : null
  const Icon = meta?.icon

  return (
    <BottomSheet
      open={date !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={date ? format(parseDateKey(date), "EEEE d MMMM") : "Day details"}
      description={
        record
          ? isRest
            ? "Rest day · recovery"
            : `${record.name} · ${stats.completedExercises} of ${stats.plannedExercises} exercises completed`
          : undefined
      }
      onCloseAutoFocus={onCloseAutoFocus}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Close
          </Button>
          {date && record?.exercises.length ? (
            <Button asChild className="w-full sm:w-auto">
              <Link to={`/?date=${date}`} onClick={onClose}>
                Open this day
              </Link>
            </Button>
          ) : null}
        </>
      }
    >
      {!record || !stats.hasPlan ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {isRest
            ? "Rest day. No workout planned — recovery is part of the plan."
            : "No workout planned for this day."}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="surface-inset flex items-start gap-3 rounded-lg p-4 ring-1 ring-border/40 ring-inset">
            {Icon && meta ? (
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-soft ring-1 ring-black/5 dark:ring-white/10"
                style={{ backgroundColor: meta.color }}
              >
                <Icon className="size-5" />
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="font-medium">{record.name}</p>
              <p className="text-xs text-muted-foreground">{record.focus}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.actualReps} of {stats.plannedReps} reps ·{" "}
                {stats.plannedSets} sets
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {record.exercises.map((exercise) => (
              <li
                key={exercise.id}
                className="rounded-lg border border-border/60 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{exercise.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Target {exercise.targetSets} × {exercise.targetReps} reps
                    </p>
                  </div>
                  <ExerciseStatusBadge status={exerciseStatus(exercise)} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                  {exerciseActualReps(exercise) > 0
                    ? `Sets: ${exercise.actualReps.join(" / ")}`
                    : "No reps recorded"}{" "}
                  · {exerciseActualReps(exercise)} /{" "}
                  {exercisePlannedReps(exercise)} reps
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </BottomSheet>
  )
}
