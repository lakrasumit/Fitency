import { format } from "date-fns"
import { Check, MoonStar } from "lucide-react"
import { BottomSheet } from "@/components/bottom-sheet"
import { Button } from "@/components/ui/button"
import { getCategoryMeta } from "@/features/workouts/category"
import { WORKOUT_TEMPLATES } from "@/lib/data/workout-templates"
import { parseDateKey } from "@/lib/utils/date"

type TemplatePickerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  dateKey: string
  selectedTemplateId: string | null
  isRestDay: boolean
  onSelect: (templateId: string | null) => void
}

export function TemplatePicker({
  open,
  onOpenChange,
  dateKey,
  selectedTemplateId,
  isRestDay,
  onSelect,
}: TemplatePickerProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Choose a workout"
      description={`Pick a pre-filled session for ${format(parseDateKey(dateKey), "EEEE d MMMM")}. Any recorded reps on this day will be replaced.`}
      footer={
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      }
    >
      <ul className="space-y-2">
        {WORKOUT_TEMPLATES.map((template) => {
          const meta = getCategoryMeta(template.category)
          const Icon = meta.icon
          const selected = !isRestDay && selectedTemplateId === template.id

          return (
            <li key={template.id}>
              <button
                type="button"
                onClick={() => onSelect(template.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-medium">
                    {template.name}
                    {selected ? (
                      <Check aria-hidden className="size-4 text-success" />
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {template.focus} · {template.exercises.length} exercises
                  </span>
                </span>
              </button>
            </li>
          )
        })}

        <li>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border p-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MoonStar aria-hidden className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-medium">
                Rest day
                {isRestDay ? (
                  <Check aria-hidden className="size-4 text-success" />
                ) : null}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Clear this day and plan recovery instead.
              </span>
            </span>
          </button>
        </li>
      </ul>
    </BottomSheet>
  )
}
