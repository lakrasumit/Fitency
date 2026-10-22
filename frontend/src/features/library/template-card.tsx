import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategoryMeta } from "@/features/workouts/category"
import type { WorkoutTemplate } from "@/lib/types"

type TemplateCardProps = {
  template: WorkoutTemplate
  onOpen: (template: WorkoutTemplate) => void
}

export function TemplateCard({ template, onOpen }: TemplateCardProps) {
  const meta = getCategoryMeta(template.category)
  const Icon = meta.icon
  const sets = template.exercises.reduce(
    (total, exercise) => total + exercise.targetSets,
    0,
  )

  return (
    <article className="surface-card interactive-card flex flex-col rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-soft ring-1 ring-black/5 dark:ring-white/10"
          style={{ backgroundColor: meta.color }}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-semibold">{template.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {template.focus}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {template.description}
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        {template.exercises.length} exercises · {sets} sets
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="group/cta mt-4 self-start"
        onClick={() => onOpen(template)}
      >
        View &amp; add
        <ArrowRight
          aria-hidden
          className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
        />
      </Button>
    </article>
  )
}
