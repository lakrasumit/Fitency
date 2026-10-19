import { z } from "zod"
import type { Habit } from "@/lib/types"

export const HABIT_NAME_MAX_LENGTH = 40

export const habitFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a habit name.")
    .max(
      HABIT_NAME_MAX_LENGTH,
      `Habit names must be ${HABIT_NAME_MAX_LENGTH} characters or fewer.`,
    ),
  icon: z.string().min(1, "Choose an icon."),
  color: z.string().min(1, "Choose a color."),
  weekdays: z
    .array(z.number().int().min(1).max(7))
    .min(1, "Choose at least one weekday."),
})

export function createHabitSchema(
  habits: readonly Habit[],
  editingHabitId?: string,
) {
  return habitFieldsSchema.superRefine((value, ctx) => {
    const name = value.name.toLowerCase()
    const duplicate = habits.some(
      (habit) =>
        habit.id !== editingHabitId && habit.name.trim().toLowerCase() === name,
    )

    if (duplicate) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "A habit with this name already exists.",
      })
    }
  })
}
