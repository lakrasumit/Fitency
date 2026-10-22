import { format } from "date-fns"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import type { User } from "@/lib/types"

type GreetingHeaderProps = {
  user: User
}

function greetingFor(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

export function GreetingHeader({ user }: GreetingHeaderProps) {
  const today = new Date()
  const firstName = user.name.trim().split(/\s+/)[0] || "there"

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {greetingFor(today)}, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, d MMMM")}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <span
          aria-hidden
          className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent font-heading text-sm font-semibold text-primary shadow-soft ring-1 ring-primary/20"
        >
          {initials(user.name)}
        </span>
      </div>
    </header>
  )
}
