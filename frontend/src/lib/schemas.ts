import { z } from "zod"
import type { WorkoutExercise } from "@/lib/types"

export const EXERCISE_NAME_MAX_LENGTH = 60

export const MIN_PASSWORD_LENGTH = 8

const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .pipe(z.email("Enter a valid email address."))

const passwordField = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  )

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: emailField,
  password: passwordField,
})

export const accountNameSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
})

export const exerciseFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter an exercise name.")
    .max(
      EXERCISE_NAME_MAX_LENGTH,
      `Exercise names must be ${EXERCISE_NAME_MAX_LENGTH} characters or fewer.`,
    ),
  muscle: z
    .string()
    .trim()
    .min(1, "Enter the muscles worked.")
    .max(60, "Keep this under 60 characters."),
  equipment: z
    .string()
    .trim()
    .min(1, "Enter the equipment used.")
    .max(60, "Keep this under 60 characters."),
  targetSets: z
    .number()
    .int("Enter a whole number of sets.")
    .min(1, "Use at least one set.")
    .max(10, "Use 10 sets or fewer."),
  targetReps: z
    .number()
    .int("Enter a whole number of reps.")
    .min(1, "Use at least one rep.")
    .max(100, "Use 100 reps or fewer."),
  targetWeight: z
    .string()
    .trim()
    .max(30, "Keep this under 30 characters."),
})

export function createExerciseSchema(
  exercises: readonly WorkoutExercise[],
  editingExerciseId?: string,
) {
  return exerciseFieldsSchema.superRefine((value, ctx) => {
    const name = value.name.toLowerCase()
    const duplicate = exercises.some(
      (exercise) =>
        exercise.id !== editingExerciseId &&
        exercise.name.trim().toLowerCase() === name,
    )

    if (duplicate) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "This exercise is already in the workout.",
      })
    }
  })
}
