import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme/theme-toggle"

type PageHeaderProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="relative isolate mb-6 flex flex-wrap items-start justify-between gap-3">
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-3 -top-4 -bottom-4 -z-10 rounded-3xl bg-[radial-gradient(70%_120%_at_0%_0%,var(--page-glow-1),transparent_70%)]"
      />
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  )
}
