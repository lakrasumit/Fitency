import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: string
  detail?: string
}

export function StatCard({ icon: Icon, label, value, detail }: StatCardProps) {
  return (
    <div className="surface-card interactive-card rounded-xl border border-border/60 p-4">
      <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-strong ring-1 ring-primary/10"
        >
          <Icon className="size-3.5" />
        </span>
        {label}
      </dt>
      <dd className="mt-2">
        <span className="block font-heading text-3xl font-semibold tabular-nums">
          {value}
        </span>
        {detail ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            {detail}
          </span>
        ) : null}
      </dd>
    </div>
  )
}
