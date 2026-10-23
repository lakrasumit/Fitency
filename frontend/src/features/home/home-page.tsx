import { format, startOfDay } from "date-fns"
import { Dumbbell, Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DateStrip } from "@/features/home/date-strip"
import { ExerciseCard } from "@/features/home/exercise-card"
import { ExerciseDetailSheet } from "@/features/home/exercise-detail-sheet"
import { ExerciseForm } from "@/features/home/exercise-form"
import { GreetingHeader } from "@/features/home/greeting-header"
import { StreakBadge } from "@/features/home/streak-badge"
import { TemplatePicker } from "@/features/home/template-picker"
import {
  WorkoutProgressCard,
  type OverallRange,
} from "@/features/home/workout-progress-card"
import { WorkoutSummary } from "@/features/home/workout-summary"
import {
  createRestWorkout,
  createWorkoutFromTemplate,
  getWorkoutTemplate,
} from "@/lib/data/workout-templates"
import type {
  ExerciseInput,
  ExerciseStatus,
  WorkoutExercise,
  WorkoutRecord,
} from "@/lib/types"
import { buildRange, isDateKey, parseDateKey, toDateKey } from "@/lib/utils/date"
import {
  aggregateStats,
  clampReps,
  currentStreak,
  hasSavedWorkout,
  resolveWorkout,
  workoutStats,
} from "@/lib/utils/workouts"
import { useAuthStore } from "@/store/auth-store"
import { useWorkoutsStore } from "@/store/workouts-store"

function initialDate(dateParam: string | null): Date {
  return dateParam && isDateKey(dateParam)
    ? parseDateKey(dateParam)
    : startOfDay(new Date())
}

const SAVE_ERROR_TOAST_ID = "workout-save-error"

export function HomePage() {
  const user = useAuthStore((state) => state.user)
  const records = useWorkoutsStore((state) => state.records)
  const startDate = useWorkoutsStore((state) => state.startDate)
  const loading = useWorkoutsStore((state) => state.loading)
  const initialized = useWorkoutsStore((state) => state.initialized)
  const error = useWorkoutsStore((state) => state.error)
  const loadWorkouts = useWorkoutsStore((state) => state.loadWorkouts)
  const saveWorkout = useWorkoutsStore((state) => state.saveWorkout)

  const [searchParams, setSearchParams] = useSearchParams()
  const dateParam = searchParams.get("date")
  const selectedDate = useMemo(() => initialDate(dateParam), [dateParam])
  const [range, setRange] = useState<OverallRange>("week")
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<{
    templateId: string | null
  } | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingExercise, setEditingExercise] =
    useState<WorkoutExercise | null>(null)
  const [detailsExercise, setDetailsExercise] =
    useState<WorkoutExercise | null>(null)
  const [removeTarget, setRemoveTarget] = useState<WorkoutExercise | null>(
    null,
  )
  const focusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!initialized) void loadWorkouts()
  }, [initialized, loadWorkouts])

  const todayKey = toDateKey(new Date())
  const dateKey = toDateKey(selectedDate)
  const record = resolveWorkout(dateKey, records)
  const stats = workoutStats(record)
  const isSaved = hasSavedWorkout(dateKey, records)
  const streak = startDate
    ? currentStreak(records, todayKey, startDate)
    : 0
  const rangeDays = startDate
    ? buildRange(range, new Date(), startDate).elapsedDays.filter(
        (day) => day >= startDate,
      )
    : []
  const rangeStats = aggregateStats(rangeDays, records)

  function rememberFocus() {
    focusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
  }

  function restoreFocus(event: Event) {
    event.preventDefault()
    if (focusRef.current?.isConnected) focusRef.current.focus()
  }

  function selectDate(date: Date) {
    const next = new URLSearchParams(searchParams)
    next.set("date", toDateKey(date))
    setSearchParams(next, { replace: true })
  }

  function latestRecord(): WorkoutRecord | null {
    return resolveWorkout(
      dateKey,
      useWorkoutsStore.getState().records,
    )
  }

  function showSaveError(failed: WorkoutRecord) {
    const message =
      useWorkoutsStore.getState().saveError ??
      "Your workout changes could not be saved."

    toast.error(message, {
      id: SAVE_ERROR_TOAST_ID,
      description: "Your workout is still on screen. Retry to save these changes.",
      duration: 10_000,
      action: {
        label: "Retry",
        onClick: () => void retrySave(failed),
      },
    })
  }

  async function retrySave(failed: WorkoutRecord) {
    const current = latestRecord()

    // A newer edit has already replaced this snapshot, so replaying it would
    // overwrite fresher data.
    if (current && current.updatedAt > failed.updatedAt) return

    if (await saveWorkout(failed)) {
      toast.success("Changes saved.")
      toast.dismiss(SAVE_ERROR_TOAST_ID)
      return
    }

    showSaveError(failed)
  }

  async function persist(next: WorkoutRecord): Promise<boolean> {
    const record = { ...next, updatedAt: new Date().toISOString() }
    if (await saveWorkout(record)) {
      toast.dismiss(SAVE_ERROR_TOAST_ID)
      return true
    }

    showSaveError(record)
    return false
  }

  async function applyTemplate(templateId: string | null) {
    const template = templateId ? getWorkoutTemplate(templateId) : null
    const next = template
      ? createWorkoutFromTemplate(template, dateKey)
      : createRestWorkout(dateKey)

    if (!(await persist(next))) return

    toast.success(
      template
        ? `${template.name} added to ${format(selectedDate, "d MMM")}.`
        : "Rest day set.",
    )
  }

  function requestTemplate(templateId: string | null) {
    setTemplatePickerOpen(false)

    if (!isSaved) {
      void applyTemplate(templateId)
      return
    }

    setPendingTemplate({ templateId })
  }

  function commitSet(exerciseId: string, setIndex: number, reps: number) {
    const current = latestRecord()
    if (!current) return

    void persist({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              actualReps: exercise.actualReps.map((saved, index) =>
                index === setIndex ? clampReps(reps) : saved,
              ),
            }
          : exercise,
      ),
    })
  }

  function changeStatus(
    exerciseId: string,
    status: ExerciseStatus | null,
  ) {
    const current = latestRecord()
    if (!current) return

    void persist({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, statusOverride: status }
          : exercise,
      ),
    })
  }

  function openAddExercise() {
    rememberFocus()
    setEditingExercise(null)
    setFormOpen(true)
  }

  function openEditExercise(exercise: WorkoutExercise) {
    rememberFocus()
    setEditingExercise(exercise)
    setFormOpen(true)
  }

  function openDetails(exercise: WorkoutExercise) {
    rememberFocus()
    setDetailsExercise(exercise)
  }

  async function saveExercise(input: ExerciseInput): Promise<boolean> {
    const current = latestRecord()
    if (!current) return false

    if (editingExercise) {
      const saved = await persist({
        ...current,
        exercises: current.exercises.map((exercise) =>
          exercise.id === editingExercise.id
            ? {
                ...exercise,
                ...input,
                actualReps: Array.from(
                  { length: input.targetSets },
                  (_, index) => exercise.actualReps[index] ?? 0,
                ),
              }
            : exercise,
        ),
      })
      if (saved) toast.success("Exercise updated.")
      return saved
    }

    const exercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      ...input,
      difficulty: "Custom",
      secondary: "",
      instructions: [],
      breathing: [],
      mistakes: [],
      safety: [],
      actualReps: Array.from({ length: input.targetSets }, () => 0),
      statusOverride: null,
    }

    // Adding the first exercise to a rest day turns it into a custom session.
    const base =
      current.exercises.length === 0 && current.category === "rest"
        ? {
            ...current,
            name: "Custom Workout",
            category: "fullBody" as const,
            focus: "Custom session",
            templateId: null,
          }
        : current

    const saved = await persist({
      ...base,
      exercises: [...base.exercises, exercise],
    })
    if (saved) toast.success("Exercise added.")
    return saved
  }

  async function confirmRemove() {
    const target = removeTarget
    if (!target) return

    const current = latestRecord()
    if (current) {
      const saved = await persist({
        ...current,
        exercises: current.exercises.filter(
          (exercise) => exercise.id !== target.id,
        ),
      })
      if (saved) toast.success(`${target.name} removed.`)
    }

    setRemoveTarget(null)
  }

  if (!user) return null

  const busy = loading || !initialized

  return (
    <div className="space-y-6">
      <GreetingHeader user={user} />

      {busy ? (
        <div
          className="space-y-6"
          aria-busy="true"
          aria-label="Loading your workout"
        >
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
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
        <>
          <DateStrip
            selectedDate={selectedDate}
            records={records}
            onSelect={selectDate}
          />

          {record ? (
            <>
              <WorkoutSummary
                record={record}
                stats={stats}
                suggested={!isSaved}
                onChangeWorkout={() => {
                  rememberFocus()
                  setTemplatePickerOpen(true)
                }}
              />

              <StreakBadge streak={streak} />

              <section
                aria-labelledby="exercise-list-title"
                className="space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    id="exercise-list-title"
                    className="font-heading text-base font-semibold"
                  >
                    Exercises
                    {stats.plannedExercises > 0 ? (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {stats.completedExercises}/{stats.plannedExercises} done
                      </span>
                    ) : null}
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openAddExercise}
                  >
                    <Plus aria-hidden />
                    Add exercise
                  </Button>
                </div>

                {record.exercises.length > 0 ? (
                  <ul className="stagger-children space-y-3">
                    {record.exercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onCommitSet={(setIndex, reps) =>
                          commitSet(exercise.id, setIndex, reps)
                        }
                        onStatusChange={(status) =>
                          changeStatus(exercise.id, status)
                        }
                        onShowDetails={() => openDetails(exercise)}
                        onEdit={() => openEditExercise(exercise)}
                        onRemove={() => {
                          rememberFocus()
                          setRemoveTarget(exercise)
                        }}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No exercises for this day yet. Choose a workout or add
                      your own.
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          rememberFocus()
                          setTemplatePickerOpen(true)
                        }}
                      >
                        Choose workout
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openAddExercise}
                      >
                        <Plus aria-hidden />
                        Add exercise
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              <WorkoutProgressCard
                stats={rangeStats}
                range={range}
                onRangeChange={setRange}
              />
            </>
          ) : (
            <EmptyState
              icon={Dumbbell}
              title="No workout planned"
              description="Choose a pre-filled workout or build this day yourself."
              action={
                <Button
                  type="button"
                  onClick={() => {
                    rememberFocus()
                    setTemplatePickerOpen(true)
                  }}
                >
                  Choose workout
                </Button>
              }
            />
          )}
        </>
      )}

      <TemplatePicker
        open={templatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
        dateKey={dateKey}
        selectedTemplateId={record?.templateId ?? null}
        isRestDay={
          !record ||
          (record.category === "rest" && record.exercises.length === 0)
        }
        onSelect={requestTemplate}
      />

      <ConfirmDialog
        open={pendingTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setPendingTemplate(null)
        }}
        title="Replace this workout?"
        description={`This clears the recorded reps and exercise changes for ${format(selectedDate, "EEEE d MMMM")}.`}
        confirmLabel="Replace workout"
        onConfirm={() => {
          if (pendingTemplate) void applyTemplate(pendingTemplate.templateId)
          setPendingTemplate(null)
        }}
        onCloseAutoFocus={restoreFocus}
      />

      <ExerciseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        exercise={editingExercise}
        exercises={record?.exercises ?? []}
        onSave={saveExercise}
        onCloseAutoFocus={restoreFocus}
      />

      <ExerciseDetailSheet
        exercise={detailsExercise}
        open={detailsExercise !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsExercise(null)
        }}
        onCloseAutoFocus={restoreFocus}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
        title="Remove exercise?"
        description={`Remove ${removeTarget?.name ?? "this exercise"} from ${format(selectedDate, "EEEE d MMMM")}? Its recorded reps will be deleted.`}
        confirmLabel="Remove exercise"
        onConfirm={confirmRemove}
        onCloseAutoFocus={restoreFocus}
      />
    </div>
  )
}
