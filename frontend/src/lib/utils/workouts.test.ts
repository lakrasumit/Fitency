import { describe, expect, it } from "vitest"
import {
  createRestWorkout,
  createWorkoutExercise,
  createWorkoutFromTemplate,
  getWorkoutTemplate,
} from "@/lib/data/workout-templates"
import type { ExerciseStatus, WorkoutRecord } from "@/lib/types"
import {
  aggregateStats,
  bestStreak,
  currentStreak,
  exerciseProgress,
  exerciseStatus,
  resolveWorkout,
  sortWorkoutRecords,
  workoutStats,
} from "@/lib/utils/workouts"

const MONDAY = "2026-10-19"
const TUESDAY = "2026-10-20"
const WEDNESDAY = "2026-10-21"

function templateRecord(
  templateId: string,
  date: string,
): WorkoutRecord {
  const template = getWorkoutTemplate(templateId)
  if (!template) throw new Error(`Missing template: ${templateId}`)
  return createWorkoutFromTemplate(template, date)
}

function completeRecord(templateId: string, date: string): WorkoutRecord {
  const record = templateRecord(templateId, date)
  return {
    ...record,
    exercises: record.exercises.map((exercise) => ({
      ...exercise,
      actualReps: Array.from(
        { length: exercise.targetSets },
        () => exercise.targetReps,
      ),
    })),
  }
}

describe("exerciseStatus", () => {
  it("derives status from recorded reps", () => {
    const template = getWorkoutTemplate("chest")
    if (!template) throw new Error("Missing chest template")
    const exercise = createWorkoutExercise(template.exercises[0])

    expect(exerciseStatus(exercise)).toBe("notCompleted")

    exercise.actualReps = [12, 0, 0]
    expect(exerciseStatus(exercise)).toBe("partial")

    exercise.actualReps = [12, 12, 12]
    expect(exerciseStatus(exercise)).toBe("completed")
  })

  it("lets a manual override win", () => {
    const template = getWorkoutTemplate("chest")
    if (!template) throw new Error("Missing chest template")
    const exercise = createWorkoutExercise(template.exercises[0])
    exercise.actualReps = [12, 12, 12]
    exercise.statusOverride = "partial"

    expect(exerciseStatus(exercise)).toBe("partial")
  })

  it("counts reps beyond the target as completed", () => {
    const template = getWorkoutTemplate("chest")
    if (!template) throw new Error("Missing chest template")
    const exercise = createWorkoutExercise(template.exercises[0])
    exercise.actualReps = [15, 15, 15]

    expect(exerciseStatus(exercise)).toBe("completed")
    expect(exerciseProgress(exercise)).toBe(1)
  })
})

describe("workoutStats", () => {
  it("summarises planned and recorded work", () => {
    const record = templateRecord("chest", MONDAY)
    record.exercises[0] = {
      ...record.exercises[0],
      actualReps: [12, 12, 12],
    }
    record.exercises[1] = {
      ...record.exercises[1],
      actualReps: [5, 0, 0],
    }

    const stats = workoutStats(record)

    expect(stats.hasPlan).toBe(true)
    expect(stats.completedExercises).toBe(1)
    expect(stats.partialExercises).toBe(1)
    expect(stats.notCompletedExercises).toBe(2)
    expect(stats.plannedReps).toBe(144)
    expect(stats.actualReps).toBe(41)
    expect(stats.percent).toBe(25)
    expect(stats.repsPercent).toBe(28)
    expect(stats.isComplete).toBe(false)
  })

  it("reports no plan for a rest day", () => {
    const stats = workoutStats(createRestWorkout(MONDAY))

    expect(stats.hasPlan).toBe(false)
    expect(stats.percent).toBeNull()
    expect(stats.repsPercent).toBeNull()
  })

  it("recounts each exercise under its current status as it changes", () => {
    const record = templateRecord("chest", MONDAY)
    const counts = (): [number, number, number] => {
      const stats = workoutStats(record)
      expect(
        stats.completedExercises +
          stats.partialExercises +
          stats.notCompletedExercises,
      ).toBe(stats.plannedExercises)
      return [
        stats.completedExercises,
        stats.partialExercises,
        stats.notCompletedExercises,
      ]
    }
    const override = (index: number, status: ExerciseStatus | null) => {
      record.exercises[index] = {
        ...record.exercises[index],
        statusOverride: status,
      }
    }

    expect(counts()).toEqual([0, 0, 4])

    override(0, "completed")
    expect(counts()).toEqual([1, 0, 3])

    override(1, "partial")
    expect(counts()).toEqual([1, 1, 2])

    // Switching an exercise moves it between counts instead of adding to both.
    override(0, "notCompleted")
    expect(counts()).toEqual([0, 1, 3])

    override(1, "completed")
    expect(counts()).toEqual([1, 0, 3])

    // Returning to automatic status derives counts from the recorded reps.
    override(0, null)
    override(1, null)
    record.exercises[0] = {
      ...record.exercises[0],
      actualReps: [12, 12, 12],
    }
    record.exercises[1] = {
      ...record.exercises[1],
      actualReps: [12, 0, 0],
    }
    expect(counts()).toEqual([1, 1, 2])
  })
})

describe("resolveWorkout", () => {
  it("falls back to the weekday template", () => {
    const record = resolveWorkout(MONDAY, [])

    expect(record?.templateId).toBe("chest")
    expect(record?.exercises).toHaveLength(4)
    expect(record?.exercises[0].actualReps.every((reps) => reps === 0)).toBe(
      true,
    )
  })

  it("prefers a saved record over the weekday template", () => {
    const saved = createRestWorkout(MONDAY)
    const record = resolveWorkout(MONDAY, [saved])

    expect(record).toBe(saved)
    expect(record?.name).toBe("Rest Day")
  })

  it("keeps daily copies separate from the template", () => {
    const first = templateRecord("legs", MONDAY)
    const second = templateRecord("legs", TUESDAY)
    first.exercises[0].name = "Edited name"

    expect(second.exercises[0].name).toBe("Squat")
    expect(getWorkoutTemplate("legs")?.exercises[0].name).toBe("Squat")
  })
})

describe("aggregateStats", () => {
  it("includes suggested days and counts fully completed workouts", () => {
    const completedMonday = completeRecord("chest", MONDAY)
    const stats = aggregateStats([MONDAY, TUESDAY], [completedMonday])

    expect(stats.plannedDays).toBe(2)
    expect(stats.completedDays).toBe(1)
    expect(stats.partialDays).toBe(0)
    expect(stats.plannedExercises).toBe(8)
    expect(stats.completedExercises).toBe(4)
    expect(stats.exercisePercent).toBe(50)
    expect(stats.workoutPercent).toBe(50)
  })

  it("counts a day with some completed exercises as partial", () => {
    const monday = templateRecord("chest", MONDAY)
    monday.exercises[0] = {
      ...monday.exercises[0],
      statusOverride: "completed",
    }

    const stats = aggregateStats([MONDAY], [monday])

    expect(stats.completedDays).toBe(0)
    expect(stats.partialDays).toBe(1)
    expect(stats.completedExercises).toBe(1)
  })
})

describe("streaks", () => {
  it("keeps an incomplete today from breaking the streak", () => {
    const records = [
      completeRecord("chest", MONDAY),
      completeRecord("back", TUESDAY),
    ]

    expect(currentStreak(records, WEDNESDAY, MONDAY)).toBe(2)
    expect(bestStreak(MONDAY, WEDNESDAY, records)).toBe(2)
  })

  it("counts a completed today and skips rest days", () => {
    const records = [
      completeRecord("chest", MONDAY),
      createRestWorkout(TUESDAY),
      completeRecord("legs", WEDNESDAY),
    ]

    expect(currentStreak(records, WEDNESDAY, MONDAY)).toBe(2)
    expect(bestStreak(MONDAY, WEDNESDAY, records)).toBe(2)
  })
})

describe("sortWorkoutRecords", () => {
  it("sorts by date without mutating the input", () => {
    const first = createRestWorkout(TUESDAY)
    const second = createRestWorkout(MONDAY)
    const input = [first, second]
    const sorted = sortWorkoutRecords(input)

    expect(sorted.map((record) => record.date)).toEqual([
      MONDAY,
      TUESDAY,
    ])
    expect(input[0].date).toBe(TUESDAY)
  })
})
