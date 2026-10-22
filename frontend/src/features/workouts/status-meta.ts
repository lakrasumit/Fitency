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
    className: "text-success",
  },
  partial: {
    label: "Partially completed",
    shortLabel: "Partial",
    icon: MinusCircle,
    className: "text-primary",
  },
  notCompleted: {
    label: "Not completed",
    shortLabel: "Not done",
    icon: Circle,
    className: "text-muted-foreground",
  },
}
