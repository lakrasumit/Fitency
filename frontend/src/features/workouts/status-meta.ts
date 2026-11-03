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
      "text-status-done-strong bg-status-done/10 ring-1 ring-status-done/20 ring-inset",
  },
  partial: {
    label: "Partially completed",
    shortLabel: "Partial",
    icon: MinusCircle,
    className:
      "text-status-partial-strong bg-status-partial/10 ring-1 ring-status-partial/20 ring-inset",
  },
  notCompleted: {
    label: "Not completed",
    shortLabel: "Not done",
    icon: Circle,
    className:
      "text-status-not-done-strong bg-status-not-done/10 ring-1 ring-status-not-done/20 ring-inset",
  },
}
