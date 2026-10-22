import { getCategoryMeta } from "@/features/workouts/category"
import type { WorkoutCategory, WorkoutRecord } from "@/lib/types"
import {
  exerciseActualReps,
  exercisePlannedReps,
  exerciseStatus,
  resolveWorkout,
} from "@/lib/utils/workouts"

type WorkoutBreakdownProps = {
  days: string[]
  records: readonly WorkoutRecord[]
}

type BreakdownRow = {
  category: WorkoutCategory
  planned: number
  completed: number
  partial: number
  actualReps: number
  plannedReps: number
}

export function WorkoutBreakdown({ days, records }: WorkoutBreakdownProps) {
  const rowsByCategory = new Map<WorkoutCategory, BreakdownRow>()

  for (const day of days) {
    const record = resolveWorkout(day, records)
    if (!record) continue

    for (const exercise of record.exercises) {
      const row = rowsByCategory.get(record.category) ?? {
        category: record.category,
        planned: 0,
        completed: 0,
        partial: 0,
        actualReps: 0,
        plannedReps: 0,
      }

      row.planned += 1
      row.actualReps += exerciseActualReps(exercise)
      row.plannedReps += exercisePlannedReps(exercise)

      const status = exerciseStatus(exercise)
      if (status === "completed") row.completed += 1
      if (status === "partial") row.partial += 1

      rowsByCategory.set(record.category, row)
    }
  }

  const rows = [...rowsByCategory.values()].sort(
    (a, b) => b.planned - a.planned,
  )

  return (
    <section
      aria-labelledby="breakdown-title"
      className="surface-card rounded-xl border border-border/60 p-5"
    >
      <h2 id="breakdown-title" className="font-heading text-base font-semibold">
        Workout breakdown
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Exercise completion for each workout type in the selected range.
      </p>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No exercises were planned in this period.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {rows.map((row) => {
            const meta = getCategoryMeta(row.category)
            const Icon = meta.icon
            const percent = Math.round((row.completed / row.planned) * 100)

            return (
              <li key={row.category}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-white shadow-soft ring-1 ring-black/5 dark:ring-white/10"
                      style={{ backgroundColor: meta.color }}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="truncate text-sm font-medium">
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {percent}%
                  </span>
                </div>

                <div
                  aria-hidden
                  className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border/40 ring-inset"
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {row.completed} of {row.planned} exercises ·{" "}
                  {row.actualReps} of {row.plannedReps} reps
                  {row.partial > 0 ? ` · ${row.partial} partial` : ""}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
