import { BottomSheet } from "@/components/bottom-sheet"
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
        <dl className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-4 text-sm">
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

        <DetailSection title="How to perform" items={exercise.instructions} ordered />
        <DetailSection title="Breathing" items={exercise.breathing} />
        <DetailSection title="Common mistakes" items={exercise.mistakes} />
        <DetailSection title="Safety notes" items={exercise.safety} />
      </div>
    </BottomSheet>
  )
}

function DetailSection({
  title,
  items,
  ordered = false,
}: {
  title: string
  items: string[]
  ordered?: boolean
}) {
  if (items.length === 0) return null

  const List = ordered ? "ol" : "ul"

  return (
    <section>
      <h3 className="font-heading text-sm font-semibold">{title}</h3>
      <List
        className={
          ordered
            ? "mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground"
            : "mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground"
        }
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </section>
  )
}
