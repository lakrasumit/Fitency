import { BottomSheet } from "@/components/bottom-sheet"
import { DetailList } from "@/components/detail-list"
import { Button } from "@/components/ui/button"
import type { WorkoutExercise } from "@/lib/types"

type ExerciseDetailSheetProps = {
  exercise: WorkoutExercise | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
}

export function ExerciseDetailSheet({
  exercise,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: ExerciseDetailSheetProps) {
  if (!exercise) return null

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={exercise.name}
      description={`${exercise.muscle} · ${exercise.equipment}`}
      onCloseAutoFocus={onCloseAutoFocus}
      footer={
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      }
    >
      <div className="space-y-5">
        <dl className="surface-inset grid grid-cols-2 gap-3 rounded-lg p-4 text-sm ring-1 ring-border/40 ring-inset">
          <div>
            <dt className="text-xs text-muted-foreground">Target</dt>
            <dd className="mt-0.5 font-medium">
              {exercise.targetSets} sets × {exercise.targetReps} reps
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Weight</dt>
            <dd className="mt-0.5 font-medium">
              {exercise.targetWeight || "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Difficulty</dt>
            <dd className="mt-0.5 font-medium">
              {exercise.difficulty || "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Also works</dt>
            <dd className="mt-0.5 font-medium">
              {exercise.secondary || "Not specified"}
            </dd>
          </div>
        </dl>

        <DetailList title="How to perform" items={exercise.instructions} ordered />
        <DetailList title="Breathing" items={exercise.breathing} />
        <DetailList title="Common mistakes" items={exercise.mistakes} />
        <DetailList title="Safety notes" items={exercise.safety} />
      </div>
    </BottomSheet>
  )
}
