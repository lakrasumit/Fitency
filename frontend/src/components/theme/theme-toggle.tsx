import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { useTheme } from "@/components/theme/theme-context"
import type { Theme } from "@/components/theme/theme-storage"
import { cn } from "cn"

const OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-border/70 bg-background/60 p-0.5 shadow-soft"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = theme === value

        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full outline-none transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary-strong",
            )}
          >
            <Icon aria-hidden className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
