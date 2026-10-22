import { Dumbbell } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TemplateCard } from "@/features/library/template-card"
import { TemplateDetailSheet } from "@/features/library/template-detail-sheet"
import { createWorkoutFromTemplate, WORKOUT_TEMPLATES } from "@/lib/data/workout-templates"
import type { WorkoutTemplate } from "@/lib/types"
import { toDateKey } from "@/lib/utils/date"
import { hasSavedWorkout } from "@/lib/utils/workouts"
import { useWorkoutsStore } from "@/store/workouts-store"

export function LibraryPage() {
  const navigate = useNavigate()
  const records = useWorkoutsStore((state) => state.records)
  const loading = useWorkoutsStore((state) => state.loading)
  const initialized = useWorkoutsStore((state) => state.initialized)
  const error = useWorkoutsStore((state) => state.error)
  const loadWorkouts = useWorkoutsStore((state) => state.loadWorkouts)
  const saveWorkout = useWorkoutsStore((state) => state.saveWorkout)

  const [activeTemplate, setActiveTemplate] =
    useState<WorkoutTemplate | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [addDate, setAddDate] = useState(toDateKey(new Date()))

  useEffect(() => {
    if (!initialized) void loadWorkouts()
  }, [initialized, loadWorkouts])

  function openTemplate(template: WorkoutTemplate) {
    setAddDate(toDateKey(new Date()))
    setActiveTemplate(template)
    setSheetOpen(true)
  }

  async function addWorkout(template: WorkoutTemplate, dateKey: string) {
    setSheetOpen(false)

    const next = createWorkoutFromTemplate(template, dateKey)
    navigate(`/?date=${dateKey}`)

    const saved = await saveWorkout(next)
    if (saved) {
      toast.success(`${template.name} added.`)
    } else {
      toast.error("The workout could not be saved. Try again from Home.")
    }
  }

  return (
    <>
      <PageHeader
        title="Workout library"
        description="Pre-filled sessions you can add to any date."
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Dumbbell className="size-4" />
        </span>
        <p className="text-sm text-muted-foreground">
          Each weekday starts with a suggested session. Adding a template
          creates a copy for that date, so editing a day never changes the
          template or other days.
        </p>
      </div>

      {loading && !initialized ? (
        <div
          className="grid gap-3 sm:grid-cols-2"
          aria-busy="true"
          aria-label="Loading your workout library"
        >
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void loadWorkouts()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {WORKOUT_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onOpen={openTemplate}
            />
          ))}
        </div>
      )}

      <TemplateDetailSheet
        template={activeTemplate}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        dateKey={addDate}
        onDateChange={setAddDate}
        hasSavedWorkout={(dateKey) =>
          hasSavedWorkout(dateKey, records)
        }
        onAdd={(template, dateKey) => void addWorkout(template, dateKey)}
      />
    </>
  )
}
