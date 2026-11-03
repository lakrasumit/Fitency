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
  chest: { label: "Chest", icon: Dumbbell, color: "var(--category-chest)" },
  back: { label: "Back", icon: Activity, color: "var(--category-back)" },
  legs: { label: "Legs", icon: Footprints, color: "var(--category-legs)" },
  shoulders: {
    label: "Shoulders",
    icon: PersonStanding,
    color: "var(--category-shoulders)",
  },
  arms: { label: "Arms", icon: BicepsFlexed, color: "var(--category-arms)" },
  core: { label: "Core", icon: Target, color: "var(--category-core)" },
  fullBody: {
    label: "Full body",
    icon: HeartPulse,
    color: "var(--category-full-body)",
  },
  rest: { label: "Rest", icon: MoonStar, color: "var(--category-rest)" },
}

export function getCategoryMeta(category: WorkoutCategory): CategoryMeta {
  return CATEGORY_META[category]
}
