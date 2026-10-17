import { z } from 'zod';

import type { Weekday } from '../api/types';

/**
 * New Habit validation (PRD.md §5.2).
 *
 * Shared with the API seam so the same rules guard the form and the payload
 * (D-07). `Habit` name limits: required, trimmed, 2–80 characters.
 */

export const habitCategorySchema = z.enum(['health', 'mind', 'growth', 'lifestyle']);

export const difficultySchema = z.enum(['easy', 'hard', 'delusional']);

export const weekdaySchema = z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const newHabitSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Give it a name of at least 2 characters.')
      .max(80, 'Keep it under 80 characters.'),
    category: habitCategorySchema,
    difficulty: difficultySchema,
    reminderEnabled: z.boolean(),
    reminderTime: z.string().nullable(),
    repeatDays: z.array(weekdaySchema).min(1, 'Pick at least one day.'),
  })
  .superRefine((value, ctx) => {
    if (!value.reminderEnabled) return;

    if (!value.reminderTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reminderTime'],
        message: 'Pick a reminder time.',
      });
      return;
    }

    if (!timePattern.test(value.reminderTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reminderTime'],
        message: 'Use a valid time (HH:mm).',
      });
    }
  });

/** Input and output types stay identical so the resolver maps 1:1 onto the form. */
export type NewHabitFormValues = z.infer<typeof newHabitSchema>;

export const DEFAULT_REMINDER_TIME = '08:00';

export const DEFAULT_CATEGORY = 'health' as const;

/** The kit ships with "Delusional" pre-selected (Appendix A §A.2). */
export const DEFAULT_DIFFICULTY = 'delusional' as const;

export const DEFAULT_REPEAT_DAYS: readonly Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const HABIT_NAME_MAX_LENGTH = 80;
