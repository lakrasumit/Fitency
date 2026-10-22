import { addDays } from "date-fns"
import {
  createWorkoutFromTemplate,
  getTemplateForWeekday,
} from "@/lib/data/workout-templates"
import type {
  ExerciseStatus,
  WorkoutExercise,
  WorkoutRecord,
} from "@/lib/types"
import { getWeekdayNumberFromKey, parseDateKey, toDateKey } from "@/lib/utils/date"

export type WorkoutStats = {
  plannedExercises: number
  completedExercises: number
  partialExercises: number
  notCompletedExercises: number
  plannedSets: number
  plannedReps: number
  actualReps: number
  /** Completed exercises as a percentage of planned exercises. */
  percent: number | null
  /** Recorded reps as a percentage of planned reps. */
  repsPercent: number | null
  isComplete: boolean
  hasPlan: boolean
}

export type AggregateStats = {
  plannedDays: number
  completedDays: number
  partialDays: number
  plannedExercises: number
  completedExercises: number
  partialExercises: number
  plannedReps: number
  actualReps: number
  /** Fully completed workout days as a percentage of planned days. */
  workoutPercent: number | null
  /** Completed exercises as a percentage of planned exercises. */
  exercisePercent: number | null
  /** Recorded reps as a percentage of planned reps. */
  repsPercent: number | null
}

export function exerciseStatus(exercise: WorkoutExercise): ExerciseStatus {
  if (exercise.statusOverride) return exercise.statusOverride

  const recorded = exercise.actualReps.reduce((total, reps) => total + reps, 0)
  if (recorded <= 0) return "notCompleted"

  const allSetsDone =
    exercise.targetSets > 0 &&
    exercise.actualReps
      .slice(0, exercise.targetSets)
      .every((reps) => reps >= exercise.targetReps)

  return allSetsDone ? "completed" : "partial"
}

export function exerciseActualReps(exercise: WorkoutExercise): number {
  return exercise.actualReps.reduce((total, reps) => total + reps, 0)
}

export function exercisePlannedReps(exercise: WorkoutExercise): number {
  return exercise.targetSets * exercise.targetReps
}

export function exerciseProgress(exercise: WorkoutExercise): number {
  const planned = exercisePlannedReps(exercise)
  if (planned <= 0) return 0
  return Math.min(1, exerciseActualReps(exercise) / planned)
}

export function workoutStats(record: WorkoutRecord | null): WorkoutStats {
  const exercises = record?.exercises ?? []
  const plannedExercises = exercises.length
  const statuses = exercises.map(exerciseStatus)
  const completedExercises = statuses.filter(
    (status) => status === "completed",
  ).length
  const partialExercises = statuses.filter(
    (status) => status === "partial",
  ).length
  const plannedSets = exercises.reduce(
    (total, exercise) => total + exercise.targetSets,
    0,
  )
  const plannedReps = exercises.reduce(
    (total, exercise) => total + exercisePlannedReps(exercise),
    0,
  )
  const actualReps = exercises.reduce(
    (total, exercise) => total + exerciseActualReps(exercise),
    0,
  )

  return {
    plannedExercises,
    completedExercises,
    partialExercises,
    notCompletedExercises:
      plannedExercises - completedExercises - partialExercises,
    plannedSets,
    plannedReps,
    actualReps,
    percent: plannedExercises
      ? Math.round((completedExercises / plannedExercises) * 100)
      : null,
    repsPercent: plannedReps
      ? Math.round((actualReps / plannedReps) * 100)
      : null,
    isComplete: plannedExercises > 0 && completedExercises === plannedExercises,
    hasPlan: plannedExercises > 0,
  }
}

/**
 * Resolves the workout shown for a date: the saved record when one exists,
 * otherwise a fresh copy of that weekday's template.
 */
export function resolveWorkout(
  dateKey: string,
  records: readonly WorkoutRecord[],
): WorkoutRecord | null {
  const saved = records.find((record) => record.date === dateKey)
  if (saved) return saved

  const template = getTemplateForWeekday(getWeekdayNumberFromKey(dateKey))
  return template ? createWorkoutFromTemplate(template, dateKey) : null
}

export function hasSavedWorkout(
  dateKey: string,
  records: readonly WorkoutRecord[],
): boolean {
  return records.some((record) => record.date === dateKey)
}

export function sortWorkoutRecords(
  records: readonly WorkoutRecord[],
): WorkoutRecord[] {
  return [...records].sort((a, b) => a.date.localeCompare(b.date))
}

export function aggregateStats(
  days: readonly string[],
  records: readonly WorkoutRecord[],
): AggregateStats {
  let plannedDays = 0
  let completedDays = 0
  let partialDays = 0
  let plannedExercises = 0
  let completedExercises = 0
  let partialExercises = 0
  let plannedReps = 0
  let actualReps = 0

  for (const day of days) {
    const stats = workoutStats(resolveWorkout(day, records))
    if (!stats.hasPlan) continue

    plannedDays += 1
    if (stats.isComplete) completedDays += 1
    else if (
      stats.completedExercises > 0 ||
      stats.partialExercises > 0 ||
      stats.actualReps > 0
    ) {
      partialDays += 1
    }

    plannedExercises += stats.plannedExercises
    completedExercises += stats.completedExercises
    partialExercises += stats.partialExercises
    plannedReps += stats.plannedReps
    actualReps += stats.actualReps
  }

  return {
    plannedDays,
    completedDays,
    partialDays,
    plannedExercises,
    completedExercises,
    partialExercises,
    plannedReps,
    actualReps,
    workoutPercent: plannedDays
      ? Math.round((completedDays / plannedDays) * 100)
      : null,
    exercisePercent: plannedExercises
      ? Math.round((completedExercises / plannedExercises) * 100)
      : null,
    repsPercent: plannedReps ? Math.round((actualReps / plannedReps) * 100) : null,
  }
}

/**
 * Consecutive fully completed workout days ending today. An incomplete today
 * does not break the streak, and rest days are skipped.
 */
export function currentStreak(
  records: readonly WorkoutRecord[],
  todayKey: string,
  startDate: string,
): number {
  const stopKey = startDate <= todayKey ? startDate : todayKey
  let cursor = parseDateKey(todayKey)
  let streak = 0

  while (toDateKey(cursor) >= stopKey) {
    const key = toDateKey(cursor)
    const stats = workoutStats(resolveWorkout(key, records))

    if (stats.hasPlan) {
      if (stats.isComplete) streak += 1
      else if (key !== todayKey) break
    }

    cursor = addDays(cursor, -1)
  }

  return streak
}

/** Longest run of fully completed workout days in the inclusive range. */
export function bestStreak(
  startDate: string,
  endDate: string,
  records: readonly WorkoutRecord[],
): number {
  if (startDate > endDate) return 0

  let cursor = parseDateKey(startDate)
  let run = 0
  let best = 0

  while (toDateKey(cursor) <= endDate) {
    const key = toDateKey(cursor)
    const stats = workoutStats(resolveWorkout(key, records))

    if (stats.hasPlan) {
      if (stats.isComplete) {
        run += 1
        best = Math.max(best, run)
      } else {
        run = 0
      }
    }

    cursor = addDays(cursor, 1)
  }

  return best
}

export function clampReps(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(999, Math.max(0, Math.round(value)))
}
