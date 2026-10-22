import { Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"
import { useTheme } from "@/components/theme/theme-context"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

const DARK_QUERY = "(prefers-color-scheme: dark)"

function subscribeToSystemTheme(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function getSystemPrefersDark() {
  return window.matchMedia(DARK_QUERY).matches
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersDark,
    () => false,
  )
  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark)
  const label = isDark ? "Switch to light theme" : "Switch to dark theme"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden rounded-full border border-border/70 bg-background/60 text-muted-foreground shadow-soft hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
    >
      <Sun
        aria-hidden
        className={cn(
          "absolute inset-0 m-auto size-4 transition-[transform,opacity] duration-300",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "absolute inset-0 m-auto size-4 transition-[transform,opacity] duration-300",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
      />
    </Button>
  )
}
