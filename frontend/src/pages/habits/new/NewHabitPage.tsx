import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { CategoryPill } from '../../../components/habits/CategoryPill';
import { CATEGORY_ORDER } from '../../../components/habits/categoryOptions';
import { DifficultyCard } from '../../../components/habits/DifficultyCard';
import { DIFFICULTY_ORDER } from '../../../components/habits/difficultyOptions';
import { DayChip } from '../../../components/habits/DayChip';
import { TimeButton } from '../../../components/habits/TimeButton';
import { WarningBanner } from '../../../components/habits/WarningBanner';
import { PageHeader } from '../../../components/nav/PageHeader';
import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Toggle } from '../../../components/ui/Toggle';
import { useCreateHabit } from '../../../hooks/useCreateHabit';
import { useHabitAttempts } from '../../../hooks/useHabitAttempts';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import type { HabitCategory, Difficulty, Weekday } from '../../../lib/api';
import { COPY } from '../../../lib/copy';
import { WEEKDAYS } from '../../../lib/utils/date';
import { fieldErrorMessage } from '../../../lib/utils/errors';
import {
  DEFAULT_CATEGORY,
  DEFAULT_DIFFICULTY,
  DEFAULT_REMINDER_TIME,
  DEFAULT_REPEAT_DAYS,
  HABIT_NAME_MAX_LENGTH,
  newHabitSchema,
} from '../../../lib/validation/habit';
import type { NewHabitFormValues } from '../../../lib/validation/habit';

/**
 * New Habit (FR-N-1 … FR-N-9).
 *
 * Validation is declared once in `lib/validation/habit.ts` and shared with the
 * API payload (D-07). Success navigates home; failure surfaces inline *and* as a
 * toast (D-18).
 */
export default function NewHabitPage() {
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const { submit, formError } = useCreateHabit();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<NewHabitFormValues>({
    resolver: zodResolver(newHabitSchema),
    defaultValues: {
      name: '',
      category: DEFAULT_CATEGORY,
      difficulty: DEFAULT_DIFFICULTY,
      reminderEnabled: true,
      reminderTime: DEFAULT_REMINDER_TIME,
      repeatDays: [...DEFAULT_REPEAT_DAYS],
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const name = watch('name');
  const category = watch('category');
  const difficulty = watch('difficulty');
  const reminderEnabled = watch('reminderEnabled');
  const reminderTime = watch('reminderTime');
  const repeatDays = watch('repeatDays');

  const attempts = useHabitAttempts(name);

  // Revalidate on change only after the first submit attempt, so errors do not
  // appear before the user has tried to continue.
  const setValueOptions = { shouldDirty: true, shouldValidate: isSubmitted };

  function setCategory(value: HabitCategory) {
    setValue('category', value, setValueOptions);
  }

  function setDifficulty(value: Difficulty) {
    setValue('difficulty', value, setValueOptions);
  }

  function toggleReminder(value: boolean) {
    setValue('reminderEnabled', value, setValueOptions);
  }

  function setTime(value: string) {
    setValue('reminderTime', value, setValueOptions);
  }

  function toggleDay(day: Weekday) {
    const next = repeatDays.includes(day)
      ? repeatDays.filter((value) => value !== day)
      : [...repeatDays, day];
    setValue('repeatDays', next, setValueOptions);
  }

  const repeatDaysError = fieldErrorMessage(errors.repeatDays);

  const onSubmit = handleSubmit(async (values) => {
    const created = await submit({
      name: values.name,
      category: values.category,
      difficulty: values.difficulty,
      reminderEnabled: values.reminderEnabled,
      reminderTime: values.reminderEnabled ? values.reminderTime : null,
      repeatDays: values.repeatDays,
    });

    if (created) {
      void navigate('/', { replace: true });
    }
  });

  function bannerContent() {
    if (attempts.count !== null && attempts.count > 0) {
      return (
        <>
          {COPY.newHabit.banner.triedPrefix}{' '}
          <strong className="font-bold">
            {attempts.count} {COPY.newHabit.banner.triedEmphasis}
          </strong>{' '}
          {COPY.newHabit.banner.triedSuffix}
        </>
      );
    }

    if (attempts.status === 'loading') return COPY.newHabit.banner.loading;
    if (attempts.count === 0) return COPY.newHabit.banner.none;
    return COPY.newHabit.banner.idle;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader back title={COPY.newHabit.title} subtitle={COPY.newHabit.subtitle} />

      <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        <TextInput
          label={COPY.newHabit.nameLabel}
          placeholder={COPY.newHabit.namePlaceholder}
          hint={COPY.newHabit.nameHint}
          error={errors.name?.message}
          maxLength={HABIT_NAME_MAX_LENGTH}
          autoComplete="off"
          enterKeyHint="done"
          {...register('name')}
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="type-caption mb-1 text-muted">{COPY.newHabit.categoryLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((value) => (
              <CategoryPill
                key={value}
                category={value}
                selected={category === value}
                onSelect={setCategory}
                name="habit-category"
              />
            ))}
          </div>
          {errors.category?.message ? (
            <p role="alert" className="type-caption text-danger-fg">
              {errors.category.message}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="type-caption mb-1 text-muted">{COPY.newHabit.difficultyLabel}</legend>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_ORDER.map((value) => (
              <DifficultyCard
                key={value}
                difficulty={value}
                selected={difficulty === value}
                onSelect={setDifficulty}
                name="habit-difficulty"
              />
            ))}
          </div>
          <p className="type-caption text-faint">{COPY.newHabit.difficultyHint}</p>
        </fieldset>

        <WarningBanner>{bannerContent()}</WarningBanner>

        <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
          <Toggle
            label={COPY.newHabit.remindLabel}
            description={COPY.newHabit.remindHint}
            checked={reminderEnabled}
            onChange={toggleReminder}
          />

          {/* v1: the time row is hidden while the reminder is off (FR-N-6). */}
          {reminderEnabled ? (
            <TimeButton
              label={COPY.newHabit.timeLabel}
              value={reminderTime ?? DEFAULT_REMINDER_TIME}
              onChange={setTime}
              error={errors.reminderTime?.message}
            />
          ) : null}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="type-caption mb-1 text-muted">{COPY.newHabit.repeatLabel}</legend>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((day) => (
              <DayChip
                key={day.id}
                day={day.id}
                short={day.short}
                full={day.label}
                selected={repeatDays.includes(day.id)}
                onToggle={toggleDay}
              />
            ))}
          </div>
          {repeatDaysError ? (
            <p role="alert" className="type-caption text-danger-fg">
              {repeatDaysError}
            </p>
          ) : null}
        </fieldset>

        {formError ? (
          <p role="alert" className="type-caption flex items-center gap-1.5 text-danger-fg">
            <AlertTriangle aria-hidden="true" className="size-4 shrink-0" />
            {formError}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            loadingLabel={COPY.newHabit.submitting}
            disabled={!online}
          >
            {COPY.newHabit.submit}
          </Button>
          {!online ? (
            <p className="type-caption text-center text-warning-fg">{COPY.states.offlineBody}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
