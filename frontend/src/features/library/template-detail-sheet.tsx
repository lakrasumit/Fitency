import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { BottomSheet } from "@/components/bottom-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCategoryMeta } from "@/features/workouts/category"
import type { WorkoutTemplate } from "@/lib/types"
import { isDateKey, parseDateKey } from "@/lib/utils/date"

type TemplateDetailSheetProps = {
  template: WorkoutTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  dateKey: string
  onDateChange: (dateKey: string) => void
  hasSavedWorkout: (dateKey: string) => boolean
  onAdd: (template: WorkoutTemplate, dateKey: string) => void
}

export function TemplateDetailSheet({
  template,
  open,
  onOpenChange,
  dateKey,
  onDateChange,
  hasSavedWorkout,
  onAdd,
}: TemplateDetailSheetProps) {
  if (!template) return null

  const meta = getCategoryMeta(template.category)
  const Icon = meta.icon
  const totalSets = template.exercises.reduce(
    (total, exercise) => total + exercise.targetSets,
    0,
  )
  const totalReps = template.exercises.reduce(
    (total, exercise) => total + exercise.targetSets * exercise.targetReps,
    0,
  )
  const replaces = hasSavedWorkout(dateKey)

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={template.name}
      description={template.focus}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => onAdd(template, dateKey)}
          >
            {replaces ? "Replace workout" : "Add workout"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="surface-inset flex items-start gap-3 rounded-lg p-4 ring-1 ring-border/40 ring-inset">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-soft ring-1 ring-black/5 dark:ring-white/10"
            style={{ backgroundColor: meta.color }}
          >
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm">{template.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {template.exercises.length} exercises · {totalSets} sets ·{" "}
              {totalReps} target reps
            </p>
          </div>
        </div>

        <section aria-labelledby="template-exercises-title">
          <h3
            id="template-exercises-title"
            className="font-heading text-sm font-semibold"
          >
            Exercises
          </h3>
          <ol className="mt-2 space-y-2">
            {template.exercises.map((exercise, index) => (
              <li
                key={exercise.id}
                className="rounded-lg border border-border/60"
              >
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-3 py-2 transition-colors duration-200 outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 gap-2">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {index + 1}.
                      </span>
                      <span>
                        <span className="block text-sm font-medium">
                          {exercise.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {exercise.muscle}
                          {exercise.equipment ? ` · ${exercise.equipment}` : ""}
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground tabular-nums">
                      {exercise.targetSets} × {exercise.targetReps}
                      <ChevronDown
                        aria-hidden
                        className="size-3.5 transition-transform group-open:rotate-180"
                      />
                    </span>
                  </summary>

                  <div className="space-y-3 border-t border-border/60 px-3 py-3">
                    <p className="text-xs text-muted-foreground">
                      {exercise.difficulty || "Difficulty not specified"} ·
                      Weight: {exercise.targetWeight || "not specified"}
                      {exercise.secondary
                        ? ` · Also works: ${exercise.secondary}`
                        : ""}
                    </p>
                    <DetailList
                      title="How to perform"
                      items={exercise.instructions}
                      ordered
                    />
                    <DetailList title="Breathing" items={exercise.breathing} />
                    <DetailList
                      title="Common mistakes"
                      items={exercise.mistakes}
                    />
                    <DetailList title="Safety notes" items={exercise.safety} />
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-2">
          <label htmlFor="template-date" className="text-sm font-medium">
            Add to date
          </label>
          <Input
            id="template-date"
            type="date"
            value={dateKey}
            onChange={(event) => {
              if (isDateKey(event.target.value)) onDateChange(event.target.value)
            }}
            className="h-10 w-full sm:w-48"
          />
          {replaces ? (
            <p role="status" className="text-xs text-primary">
              A saved workout already exists on{" "}
              {format(parseDateKey(dateKey), "d MMMM")}. Adding this template
              will replace it.
            </p>
          ) : null}
        </div>
      </div>
    </BottomSheet>
  )
}

function DetailList({
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
    <div>
      <p className="text-xs font-medium">{title}</p>
      <List
        className={
          ordered
            ? "mt-1 list-decimal space-y-1 pl-4 text-xs text-muted-foreground"
            : "mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground"
        }
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </div>
  )
}
