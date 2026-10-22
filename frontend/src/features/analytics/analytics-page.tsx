import {
  ChartColumn,
  Dumbbell,
  Flame,
  ListChecks,
  Target,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DayDetailSheet } from "@/features/analytics/day-detail-sheet"
import { Heatmap } from "@/features/analytics/heatmap"
import {
  RangeSwitcher,
  type AnalyticsRange,
} from "@/features/analytics/range-switcher"
import { StatCard } from "@/features/analytics/stat-card"
import { TrendChart } from "@/features/analytics/trend-chart"
import { WorkoutBreakdown } from "@/features/analytics/workout-breakdown"
import { WorkoutHistory } from "@/features/analytics/workout-history"
import { buildRange, toDateKey } from "@/lib/utils/date"
import {
  aggregateStats,
  bestStreak,
  currentStreak,
} from "@/lib/utils/workouts"
import { useWorkoutsStore } from "@/store/workouts-store"

export function AnalyticsPage() {
  const records = useWorkoutsStore((state) => state.records)
  const startDate = useWorkoutsStore((state) => state.startDate)
  const loading = useWorkoutsStore((state) => state.loading)
  const initialized = useWorkoutsStore((state) => state.initialized)
  const error = useWorkoutsStore((state) => state.error)
  const loadWorkouts = useWorkoutsStore((state) => state.loadWorkouts)

  const [range, setRange] = useState<AnalyticsRange>("month")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const dayTriggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!initialized) void loadWorkouts()
  }, [initialized, loadWorkouts])

  function openDayDetail(date: string) {
    dayTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setSelectedDate(date)
  }

  // Radix only restores focus to a DialogTrigger; remember the heatmap cell.
  function restoreDayTrigger(event: Event) {
    event.preventDefault()
    if (dayTriggerRef.current?.isConnected) dayTriggerRef.current.focus()
  }

  const now = new Date()
  const todayKey = toDateKey(now)
  const trackingStart = startDate ?? todayKey
  const dateRange = buildRange(range, now, trackingStart)
  const days = dateRange.elapsedDays.filter((day) => day >= trackingStart)
  const stats = aggregateStats(days, records)
  const current = currentStreak(records, todayKey, trackingStart)
  const best = bestStreak(trackingStart, todayKey, records)
  const hasRecordedData = records.some((record) =>
    record.exercises.some(
      (exercise) =>
        exercise.actualReps.some((reps) => reps > 0) ||
        exercise.statusOverride !== null,
    ),
  )
  const busy = loading || !initialized
  const rangeLabel =
    range === "week" ? "this week" : range === "month" ? "this month" : "this year"

  return (
    <>
      <PageHeader title="Analytics" description="Your progress over time." />

      {busy ? (
        <div
          className="space-y-6"
          aria-busy="true"
          aria-label="Loading your analytics"
        >
          <Skeleton className="h-10 w-full rounded-full sm:w-64" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[104px] rounded-xl" />
            <Skeleton className="h-[104px] rounded-xl" />
            <Skeleton className="h-[104px] rounded-xl" />
            <Skeleton className="h-[104px] rounded-xl" />
          </div>
          <Skeleton className="h-[360px] rounded-xl" />
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[260px] rounded-xl" />
        </div>
      ) : error || !startDate ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p role="alert" className="text-sm text-destructive">
            {error ?? "Could not load your workout data."}
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
      ) : !hasRecordedData ? (
        <EmptyState
          icon={ChartColumn}
          title="No workout data yet"
          description="Record reps or mark exercises on Home and your progress will show up here."
          action={
            <Button asChild variant="outline">
              <Link to="/">Go to Home</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <RangeSwitcher range={range} onRangeChange={setRange} />

          <section aria-labelledby="analytics-summary-title">
            <h2 id="analytics-summary-title" className="sr-only">
              Summary
            </h2>
            <dl className="stagger-children grid grid-cols-2 gap-3">
              <StatCard
                icon={Target}
                label="Workout completion"
                value={
                  stats.workoutPercent === null
                    ? "—"
                    : `${stats.workoutPercent}%`
                }
                detail={
                  stats.plannedDays === 0
                    ? "Nothing planned"
                    : `${stats.completedDays} of ${stats.plannedDays} days`
                }
              />
              <StatCard
                icon={ListChecks}
                label="Exercises completed"
                value={String(stats.completedExercises)}
                detail={
                  stats.plannedExercises === 0
                    ? "Nothing planned"
                    : `${stats.exercisePercent ?? 0}% of ${stats.plannedExercises} planned${
                        stats.partialExercises > 0
                          ? ` · ${stats.partialExercises} partial`
                          : ""
                      }`
                }
              />
              <StatCard
                icon={Dumbbell}
                label="Reps completed"
                value={String(stats.actualReps)}
                detail={`of ${stats.plannedReps} planned`}
              />
              <StatCard
                icon={Flame}
                label="Current streak"
                value={`${current} ${current === 1 ? "day" : "days"}`}
                detail={`Best: ${best} ${best === 1 ? "day" : "days"}`}
              />
            </dl>
          </section>

          <Heatmap
            range={range}
            days={dateRange.days}
            todayKey={todayKey}
            startDate={trackingStart}
            records={records}
            onSelectDay={openDayDetail}
          />

          <TrendChart range={range} days={days} records={records} />

          <WorkoutBreakdown days={days} records={records} />

          <WorkoutHistory
            records={records}
            days={days}
            startDate={trackingStart}
          />

          <p className="text-xs text-muted-foreground">
            Showing {rangeLabel}. All figures are calculated from your recorded
            reps and statuses.
          </p>
        </div>
      )}

      <DayDetailSheet
        date={selectedDate}
        records={records}
        onClose={() => setSelectedDate(null)}
        onCloseAutoFocus={restoreDayTrigger}
      />
    </>
  )
}
