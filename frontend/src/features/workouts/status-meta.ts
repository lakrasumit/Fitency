import {
  CheckCircle2,
  Circle,
  MinusCircle,
  type LucideIcon,
} from "lucide-react"
import type { ExerciseStatus } from "@/lib/types"

export const STATUS_META: Record<
  ExerciseStatus,
  { label: string; shortLabel: string; icon: LucideIcon; className: string }
> = {
  completed: {
    label: "Completed",
    shortLabel: "Done",
    icon: CheckCircle2,
    className:
      "text-success bg-success/10 ring-1 ring-success/15 ring-inset",
  },
  partial: {
    label: "Partially completed",
    shortLabel: "Partial",
    icon: MinusCircle,
    className:
      "text-primary bg-primary/10 ring-1 ring-primary/15 ring-inset",
  },
  notCompleted: {
    label: "Not completed",
    shortLabel: "Not done",
    icon: Circle,
    className:
      "text-muted-foreground bg-muted ring-1 ring-border/60 ring-inset",
  },
}
