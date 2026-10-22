import {
  Activity,
  BicepsFlexed,
  Dumbbell,
  Footprints,
  HeartPulse,
  MoonStar,
  PersonStanding,
  Target,
  type LucideIcon,
} from "lucide-react"
import type { WorkoutCategory } from "@/lib/types"

export type CategoryMeta = {
  label: string
  icon: LucideIcon
  color: string
}

export const CATEGORY_META: Record<WorkoutCategory, CategoryMeta> = {
  chest: { label: "Chest", icon: Dumbbell, color: "#c2410c" },
  back: { label: "Back", icon: Activity, color: "#1d4ed8" },
  legs: { label: "Legs", icon: Footprints, color: "#6d28d9" },
  shoulders: { label: "Shoulders", icon: PersonStanding, color: "#a21caf" },
  arms: { label: "Arms", icon: BicepsFlexed, color: "#0e7490" },
  core: { label: "Core", icon: Target, color: "#a16207" },
  fullBody: { label: "Full body", icon: HeartPulse, color: "#334155" },
  rest: { label: "Rest", icon: MoonStar, color: "#64748b" },
}

export function getCategoryMeta(category: WorkoutCategory): CategoryMeta {
  return CATEGORY_META[category]
}
