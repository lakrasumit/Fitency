import { cn } from "cn"
import type { ExerciseStatus } from "@/lib/types"
import { STATUS_META } from "@/features/workouts/status-meta"

export function ExerciseStatusBadge({
  status,
  className,
}: {
  status: ExerciseStatus
  className?: string
}) {
  const meta = STATUS_META[status]
  const Icon = meta.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium transition-colors duration-200",
        meta.className,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {meta.label}
    </span>
  )
}
