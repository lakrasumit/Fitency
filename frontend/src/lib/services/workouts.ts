import type {
  ExerciseStatus,
  WorkoutCategory,
  WorkoutExercise,
  WorkoutRecord,
  WorkoutSettings,
} from "@/lib/types"
import { isDateKey, toDateKey } from "@/lib/utils/date"
import { requireSessionUserId } from "./auth"
import { ServiceError } from "./errors"
import {
  isRecord,
  readJson,
  simulateDelay,
  userCollectionKey,
  writeJson,
} from "./storage"

const WORKOUT_CATEGORIES: WorkoutCategory[] = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "fullBody",
  "rest",
]

const EXERCISE_STATUSES: ExerciseStatus[] = [
  "completed",
  "partial",
  "notCompleted",
]

let writeQueue: Promise<void> = Promise.resolve()

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string")
  )
}

function isFiniteIntegerInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  )
}

function isWorkoutCategory(value: unknown): value is WorkoutCategory {
  return (
    typeof value === "string" &&
    WORKOUT_CATEGORIES.includes(value as WorkoutCategory)
  )
}

function isExerciseStatus(value: unknown): value is ExerciseStatus {
  return (
    typeof value === "string" &&
    EXERCISE_STATUSES.includes(value as ExerciseStatus)
  )
}

function isWorkoutExercise(value: unknown): value is WorkoutExercise {
  if (!isRecord(value)) return false

  const {
    id,
    name,
    muscle,
    equipment,
    targetSets,
    targetReps,
    targetWeight,
    difficulty,
    secondary,
    instructions,
    breathing,
    mistakes,
    safety,
    actualReps,
    statusOverride,
  } = value

  return (
    typeof id === "string" &&
    id.length > 0 &&
    typeof name === "string" &&
    name.length > 0 &&
    typeof muscle === "string" &&
    typeof equipment === "string" &&
    isFiniteIntegerInRange(targetSets, 1, 10) &&
    isFiniteIntegerInRange(targetReps, 1, 100) &&
    typeof targetWeight === "string" &&
    typeof difficulty === "string" &&
    typeof secondary === "string" &&
    isStringArray(instructions) &&
    isStringArray(breathing) &&
    isStringArray(mistakes) &&
    isStringArray(safety) &&
    Array.isArray(actualReps) &&
    actualReps.length === targetSets &&
    actualReps.every((reps) => isFiniteIntegerInRange(reps, 0, 999)) &&
    (statusOverride === null || isExerciseStatus(statusOverride))
  )
}

function isWorkoutRecord(value: unknown): value is WorkoutRecord {
  if (!isRecord(value)) return false

  const {
    date,
    templateId,
    name,
    category,
    focus,
    description,
    exercises,
    updatedAt,
  } = value

  return (
    typeof date === "string" &&
    isDateKey(date) &&
    (templateId === null || typeof templateId === "string") &&
    typeof name === "string" &&
    isWorkoutCategory(category) &&
    typeof focus === "string" &&
    typeof description === "string" &&
    Array.isArray(exercises) &&
    exercises.every(isWorkoutExercise) &&
    typeof updatedAt === "string" &&
    !Number.isNaN(new Date(updatedAt).getTime())
  )
}

function isWorkoutRecordArray(value: unknown): value is WorkoutRecord[] {
  return Array.isArray(value) && value.every(isWorkoutRecord)
}

function isWorkoutSettings(value: unknown): value is WorkoutSettings {
  return (
    isRecord(value) &&
    typeof value.startDate === "string" &&
    isDateKey(value.startDate)
  )
}

function readWorkouts(userId: string): WorkoutRecord[] {
  return (
    readJson(userCollectionKey(userId, "workouts"), isWorkoutRecordArray) ?? []
  )
}

function sortRecords(records: WorkoutRecord[]): WorkoutRecord[] {
  return [...records].sort((a, b) => a.date.localeCompare(b.date))
}

export type WorkoutData = {
  records: WorkoutRecord[]
  startDate: string
}

/**
 * Loads saved workouts and the first day the tracker was used. Settings are
 * created on first load, using the earliest record when one already exists.
 */
export async function getWorkoutData(): Promise<WorkoutData> {
  await writeQueue
  await simulateDelay()

  const userId = requireSessionUserId()
  const records = sortRecords(readWorkouts(userId))
  const settings = readJson(
    userCollectionKey(userId, "workout-settings"),
    isWorkoutSettings,
  )

  if (settings) {
    return { records, startDate: settings.startDate }
  }

  const startDate =
    records.length > 0 ? records[0].date : toDateKey(new Date())
  writeJson(userCollectionKey(userId, "workout-settings"), { startDate })

  return { records, startDate }
}

/**
 * Saves one day's workout. Writes are queued so rapid edits cannot overwrite
 * each other in local storage out of order.
 */
export function saveWorkoutRecord(record: WorkoutRecord): Promise<void> {
  assertWorkoutRecord(record)

  const task = writeQueue.then(async () => {
    await simulateDelay()

    const userId = requireSessionUserId()
    const records = readWorkouts(userId)
    const exists = records.some((saved) => saved.date === record.date)
    const next = exists
      ? records.map((saved) => (saved.date === record.date ? record : saved))
      : [...records, record]

    writeJson(userCollectionKey(userId, "workouts"), sortRecords(next))
  })

  writeQueue = task.catch(() => undefined)
  return task
}

export function assertWorkoutRecord(record: WorkoutRecord): void {
  if (!isWorkoutRecord(record)) {
    throw new ServiceError(
      "validation",
      "This workout could not be saved because its data is incomplete.",
    )
  }
}
