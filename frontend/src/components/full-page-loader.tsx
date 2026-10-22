type FullPageLoaderProps = {
  label?: string
}

export function FullPageLoader({
  label = "Loading Fitency…",
}: FullPageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-svh place-items-center px-4"
    >
      <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span
          aria-hidden
          className="animate-soft-pulse size-2 rounded-full bg-primary"
        />
        {label}
      </p>
    </div>
  )
}
