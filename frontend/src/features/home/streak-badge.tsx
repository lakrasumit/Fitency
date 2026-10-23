import { Flame } from "lucide-react"

type StreakBadgeProps = {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 px-3 py-1.5 text-sm font-medium text-primary-strong shadow-soft ring-1 ring-primary/15 ring-inset">
      <Flame className="size-4" aria-hidden />
      {streak === 0
        ? "No streak yet"
        : `${streak} day${streak === 1 ? "" : "s"} streak`}
      <span className="font-normal"> · as of today</span>
    </p>
  )
}
