import { useState } from "react"
import { toast } from "sonner"
import { CalendarCheck, Check, Trash2 } from "lucide-react"
import { BottomSheet } from "@/components/bottom-sheet"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EmptyState } from "@/components/empty-state"
import { ProgressRing } from "@/components/progress-ring"
import { useTheme } from "@/components/theme/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { Theme } from "@/components/theme/theme-storage"

/** Temporary developer-only preview of the design system. Remove in Phase 8. */
export function StylePreview() {
  const { theme, setTheme } = useTheme()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const swatches = [
    ["background", "var(--background)"],
    ["card", "var(--card)"],
    ["muted", "var(--muted)"],
    ["primary", "var(--primary)"],
    ["success", "var(--success)"],
    ["destructive", "var(--destructive)"],
    ["chart-1", "var(--chart-1)"],
    ["chart-2", "var(--chart-2)"],
    ["chart-3", "var(--chart-3)"],
    ["chart-4", "var(--chart-4)"],
    ["chart-5", "var(--chart-5)"],
  ] as const

  const themes: Theme[] = ["light", "dark", "system"]

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-4 pb-16">
      <header className="space-y-1">
        <h1 className="font-heading text-3xl font-bold">Style preview</h1>
        <p className="text-sm text-muted-foreground">
          Dev-only page for checking components at 375px and 1280px.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="theme-heading">
        <h2 id="theme-heading" className="font-heading text-xl font-semibold">
          Theme
        </h2>
        <div className="flex gap-2">
          {themes.map((option) => (
            <Button
              key={option}
              variant={theme === option ? "default" : "outline"}
              onClick={() => setTheme(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="colors-heading">
        <h2 id="colors-heading" className="font-heading text-xl font-semibold">
          Colors
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map(([name, value]) => (
            <li key={name} className="space-y-1">
              <div
                className="h-12 rounded-lg border border-border"
                style={{ background: value }}
              />
              <p className="text-xs text-muted-foreground">{name}</p>
            </li>
          ))}
        </ul>
        <p className="text-success">Completed text uses the success token.</p>
      </section>

      <section className="space-y-3" aria-labelledby="type-heading">
        <h2 id="type-heading" className="font-heading text-xl font-semibold">
          Typography
        </h2>
        <p className="font-heading text-4xl font-bold">Roboto Condensed 700</p>
        <p className="font-heading text-2xl font-semibold">
          Roboto Condensed 600
        </p>
        <p>
          Body text in Roboto. Checking a habit moves it from Pending to
          Completed.
        </p>
        <p className="font-heading text-3xl">
          <span className="tabular-nums">12 / 15</span>{" "}
          <span className="text-muted-foreground">80%</span>
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className="font-heading text-xl font-semibold">
          Buttons
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="icon" aria-label="Check in">
            <Check />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="font-heading text-xl font-semibold">
          Inputs
        </h2>
        <div className="max-w-sm space-y-1">
          <label htmlFor="preview-name" className="text-sm font-medium">
            Habit name
          </label>
          <Input id="preview-name" placeholder="Morning run" />
        </div>
        <div className="max-w-sm space-y-1">
          <label htmlFor="preview-invalid" className="text-sm font-medium">
            Invalid example
          </label>
          <Input id="preview-invalid" aria-invalid defaultValue="A" />
          <p className="text-sm text-destructive">
            Name must be at least 2 characters.
          </p>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="ring-heading">
        <h2 id="ring-heading" className="font-heading text-xl font-semibold">
          Progress ring
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          {[0, 0.4, 1].map((value) => (
            <ProgressRing
              key={value}
              value={value}
              label={`Example progress ${Math.round(value * 100)} percent`}
              size={120}
              strokeWidth={10}
            >
              <p className="font-heading text-2xl font-bold tabular-nums">
                {Math.round(value * 100)}%
              </p>
            </ProgressRing>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="surfaces-heading">
        <h2
          id="surfaces-heading"
          className="font-heading text-xl font-semibold"
        >
          Surfaces
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <p className="font-heading font-semibold">Card with shadow-soft</p>
            <p className="text-sm text-muted-foreground">Rounded and soft.</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-float">
            <p className="font-heading font-semibold">Card with shadow-float</p>
            <p className="text-sm text-muted-foreground">
              Used for floating layers.
            </p>
          </div>
        </div>
        <div className="space-y-2" aria-hidden="true">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="states-heading">
        <h2 id="states-heading" className="font-heading text-xl font-semibold">
          Empty state, sheet, confirm, toast
        </h2>
        <div className="rounded-2xl border border-border">
          <EmptyState
            icon={CalendarCheck}
            title="No habits yet"
            description="Create your first habit to start tracking."
            action={<Button>Add your first habit</Button>}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            Open bottom sheet / modal
          </Button>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            Open confirm dialog
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Habit saved")}
          >
            Show toast
          </Button>
        </div>
      </section>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Day detail"
        description="Read-only example of the responsive sheet."
        footer={<Button onClick={() => setSheetOpen(false)}>Close</Button>}
      >
        <p className="text-sm">
          Content inside the sheet. On mobile this slides up from the bottom; at
          768px and up it is a centered modal.
        </p>
      </BottomSheet>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this habit?"
        description="This removes the habit and its completion history."
        confirmLabel="Delete"
        onConfirm={() => {
          setConfirmOpen(false)
          toast.success("Habit deleted")
        }}
      />
    </main>
  )
}
