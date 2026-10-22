import {
  ChartColumn,
  Dumbbell,
  House,
  UserRound,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/library", label: "Library", icon: Dumbbell },
  { to: "/account", label: "Account", icon: UserRound },
]
