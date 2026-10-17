import { useCallback, useState } from 'react';

import type { Habit, NewHabitInput } from '../lib/api';
import { COPY } from '../lib/copy';
import { notifyError, notifySuccess } from '../lib/feedback';
import { toErrorMessage } from '../lib/utils/errors';
import { useData } from '../state/data-context';

export interface UseCreateHabitResult {
  /** Returns the created habit, or `null` when the write failed. */
  readonly submit: (input: NewHabitInput) => Promise<Habit | null>;
  /** Inline error for the form (D-18: inline + toast). */
  readonly formError: string | null;
  readonly clearFormError: () => void;
}

export function useCreateHabit(): UseCreateHabitResult {
  const { createHabit } = useData();
  const [formError, setFormError] = useState<string | null>(null);

  const submit = useCallback(
    async (input: NewHabitInput) => {
      setFormError(null);

      try {
        const habit = await createHabit(input);
        notifySuccess(COPY.newHabit.successToast);
        return habit;
      } catch (error) {
        const message = toErrorMessage(error);
        setFormError(message);
        notifyError(COPY.newHabit.errorToast, message);
        return null;
      }
    },
    [createHabit],
  );

  const clearFormError = useCallback(() => setFormError(null), []);

  return { submit, formError, clearFormError };
}
