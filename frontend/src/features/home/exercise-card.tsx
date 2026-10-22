import { Info, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExerciseStatusBadge } from "@/features/workouts/exercise-status"
import { STATUS_META } from "@/features/workouts/status-meta"
import type { ExerciseStatus, WorkoutExercise } from "@/lib/types"
import {
  clampReps,
  exerciseActualReps,
  exercisePlannedReps,
  exerciseProgress,
  exerciseStatus,
} from "@/lib/utils/workouts"

type ExerciseCardProps = {
  exercise: WorkoutExercise
  onCommitSet: (setIndex: number, reps: number) => void
  onStatusChange: (status: ExerciseStatus | null) => void
  onShowDetails: () => void
  onEdit: () => void
  onRemove: () => void
}

export function ExerciseCard({
  exercise,
  onCommitSet,
  onStatusChange,
  onShowDetails,
  onEdit,
  onRemove,
}: ExerciseCardProps) {
  const status = exerciseStatus(exercise)
  const actualReps = exerciseActualReps(exercise)
  const plannedReps = exercisePlannedReps(exercise)
  const progress = Math.round(exerciseProgress(exercise) * 100)

  return (
    <li className="surface-card interactive-card rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onShowDetails}
            className="text-left font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {exercise.name}
          </button>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {exercise.muscle}
            {exercise.equipment ? ` · ${exercise.equipment}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {exercise.targetSets} sets × {exercise.targetReps} reps
            {exercise.targetWeight ? ` · ${exercise.targetWeight}` : ""}
          </p>
        </div>
        <ExerciseStatusBadge status={status} />
      </div>

      <fieldset className="mt-3">
        <legend className="sr-only">
          Recorded reps for {exercise.name}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: exercise.targetSets }, (_, index) => (
            <RepInput
              key={index}
              label={`Set ${index + 1}`}
              exerciseName={exercise.name}
              value={exercise.actualReps[index] ?? 0}
              target={exercise.targetReps}
              onCommit={(reps) => onCommitSet(index, reps)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="sr-only">
            Completion status for {exercise.name}
          </span>
          <select
            value={exercise.statusOverride ?? "auto"}
            onChange={(event) =>
              onStatusChange(
                event.target.value === "auto"
                  ? null
                  : (event.target.value as ExerciseStatus),
              )
            }
            className="h-9 rounded-lg border border-input bg-card px-2 text-xs font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="auto">
              Auto · {STATUS_META[status].shortLabel}
            </option>
            <option value="completed">Mark completed</option>
            <option value="partial">Mark partially completed</option>
            <option value="notCompleted">Mark not completed</option>
          </select>
        </label>

        <p className="text-xs text-muted-foreground tabular-nums">
          {actualReps} / {plannedReps} reps
        </p>
      </div>

      <div
        aria-hidden
        className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="bg-gradient-to-r from-success to-success/70 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1 border-t border-border/60 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onShowDetails}>
          <Info aria-hidden />
          Details
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Pencil aria-hidden />
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 aria-hidden />
          Remove
        </Button>
      </div>
    </li>
  )
}

type RepInputProps = {
  label: string
  exerciseName: string
  value: number
  target: number
  onCommit: (reps: number) => void
}

function RepInput({
  label,
  exerciseName,
  value,
  target,
  onCommit,
}: RepInputProps) {
  return (
    <label className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5 transition-colors duration-200 hover:bg-muted/80 focus-within:bg-muted/80 focus-within:ring-2 focus-within:ring-ring/20">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1">
        <Input
          key={value}
          type="number"
          inputMode="numeric"
          min={0}
          max={999}
          defaultValue={value}
          aria-label={`${label} actual reps for ${exerciseName}`}
          onBlur={(event) => {
            const parsed = Number.parseInt(
              event.currentTarget.value || "0",
              10,
            )
            const next = clampReps(Number.isNaN(parsed) ? 0 : parsed)
            event.currentTarget.value = String(next)
            if (next !== value) onCommit(next)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur()
            }
            if (event.key === "Escape") {
              event.currentTarget.value = String(value)
              event.currentTarget.blur()
            }
          }}
          className="h-8 w-14 bg-background px-1 text-center text-sm tabular-nums"
        />
        <span className="text-xs text-muted-foreground">/ {target}</span>
      </span>
    </label>
  )
}
