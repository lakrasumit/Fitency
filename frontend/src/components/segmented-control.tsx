import { cn } from "@/lib/utils"

export type SegmentedOption<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  label: string
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** "md" stretches across small screens; "sm" keeps compact buttons inline. */
  size?: "sm" | "md"
  fullWidthOnMobile?: boolean
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = "sm",
  fullWidthOnMobile = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex gap-1 rounded-full bg-muted/80 p-1 ring-1 ring-border/50 ring-inset",
        fullWidthOnMobile && "w-full sm:w-fit",
      )}
    >
      {options.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex min-h-10 items-center justify-center rounded-full font-medium outline-none transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/50",
              size === "md"
                ? "flex-1 px-4 text-sm sm:flex-none"
                : "min-w-10 px-3 text-xs",
              selected
                ? "bg-background text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
