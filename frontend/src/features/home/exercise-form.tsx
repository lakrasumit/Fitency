import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createExerciseSchema } from "@/lib/schemas"
import type { ExerciseInput, WorkoutExercise } from "@/lib/types"

type ExerciseFormValues = z.input<ReturnType<typeof createExerciseSchema>>

type ExerciseFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise: WorkoutExercise | null
  exercises: readonly WorkoutExercise[]
  onSave: (input: ExerciseInput) => Promise<boolean>
  onCloseAutoFocus?: (event: Event) => void
}

function defaultValues(exercise: WorkoutExercise | null): ExerciseFormValues {
  if (exercise) {
    return {
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      targetWeight: exercise.targetWeight,
    }
  }

  return {
    name: "",
    muscle: "",
    equipment: "",
    targetSets: 3,
    targetReps: 12,
    targetWeight: "",
  }
}

export function ExerciseForm({
  open,
  onOpenChange,
  exercise,
  exercises,
  onSave,
  onCloseAutoFocus,
}: ExerciseFormProps) {
  const schema = useMemo(
    () => createExerciseSchema(exercises, exercise?.id),
    [exercises, exercise?.id],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(exercise),
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    reset(defaultValues(exercise))
  }, [open, exercise, reset])

  async function onSubmit(values: ExerciseFormValues) {
    setSaving(true)
    try {
      const saved = await onSave({
        name: values.name.trim(),
        muscle: values.muscle.trim(),
        equipment: values.equipment.trim(),
        targetSets: values.targetSets,
        targetReps: values.targetReps,
        targetWeight: values.targetWeight.trim(),
      })

      if (saved) onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="top-0 left-0 h-svh max-w-none translate-x-0 translate-y-0 gap-0 rounded-none p-0 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl"
      >
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="space-y-1 border-b bg-gradient-to-r from-primary/5 via-transparent to-transparent px-4 py-4 sm:px-6">
            <DialogTitle className="text-lg">
              {exercise ? "Edit exercise" : "Add exercise"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Set the exercise name, muscles worked, equipment, target sets,
              target reps and optional weight.
            </DialogDescription>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="space-y-2">
              <label htmlFor="exercise-name" className="text-sm font-medium">
                Exercise name
              </label>
              <Input
                id="exercise-name"
                placeholder="e.g. Incline press"
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "exercise-name-error" : undefined
                }
                {...register("name")}
              />
              <FieldError
                id="exercise-name-error"
                message={errors.name?.message}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="exercise-muscle" className="text-sm font-medium">
                Muscles worked
              </label>
              <Input
                id="exercise-muscle"
                placeholder="e.g. Chest and triceps"
                aria-invalid={Boolean(errors.muscle)}
                aria-describedby={
                  errors.muscle ? "exercise-muscle-error" : undefined
                }
                {...register("muscle")}
              />
              <FieldError
                id="exercise-muscle-error"
                message={errors.muscle?.message}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="exercise-equipment"
                className="text-sm font-medium"
              >
                Equipment
              </label>
              <Input
                id="exercise-equipment"
                placeholder="e.g. Dumbbells"
                aria-invalid={Boolean(errors.equipment)}
                aria-describedby={
                  errors.equipment ? "exercise-equipment-error" : undefined
                }
                {...register("equipment")}
              />
              <FieldError
                id="exercise-equipment-error"
                message={errors.equipment?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label
                  htmlFor="exercise-sets"
                  className="text-sm font-medium"
                >
                  Target sets
                </label>
                <Input
                  id="exercise-sets"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  aria-invalid={Boolean(errors.targetSets)}
                  aria-describedby={
                    errors.targetSets ? "exercise-sets-error" : undefined
                  }
                  {...register("targetSets", { valueAsNumber: true })}
                />
                <FieldError
                  id="exercise-sets-error"
                  message={errors.targetSets?.message}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="exercise-reps"
                  className="text-sm font-medium"
                >
                  Target reps
                </label>
                <Input
                  id="exercise-reps"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={100}
                  aria-invalid={Boolean(errors.targetReps)}
                  aria-describedby={
                    errors.targetReps ? "exercise-reps-error" : undefined
                  }
                  {...register("targetReps", { valueAsNumber: true })}
                />
                <FieldError
                  id="exercise-reps-error"
                  message={errors.targetReps?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="exercise-weight" className="text-sm font-medium">
                Weight <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="exercise-weight"
                placeholder="e.g. 20 kg or body weight"
                aria-invalid={Boolean(errors.targetWeight)}
                aria-describedby={
                  errors.targetWeight ? "exercise-weight-error" : undefined
                }
                {...register("targetWeight")}
              />
              <FieldError
                id="exercise-weight-error"
                message={errors.targetWeight?.message}
              />
            </div>
          </div>

          <div className="flex gap-2 border-t bg-gradient-to-t from-muted/60 to-muted/20 px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving…" : exercise ? "Save changes" : "Add exercise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null

  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  )
}
