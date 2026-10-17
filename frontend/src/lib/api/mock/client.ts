import { ApiError } from '../../utils/errors';
import type { ApiClient, RequestOptions } from '../client';
import { newHabitSchema } from '../../validation/habit';
import { toDateKey } from '../../utils/date';
import type {
  AnalyticsOverview,
  AnalyticsRange,
  ApiOperation,
  Badge,
  Habit,
  HabitAttempts,
  HabitChecklist,
  HabitCategory,
  HabitCompletion,
  HabitIconKey,
  NewHabitInput,
  Progress,
  TimeOfDay,
  Weekday,
} from '../types';
import {
  BASE_XP,
  CHART_BASE,
  DAY_LABELS,
  FRESH_HABIT_PILL,
  HEATMAP_BASE,
  MILESTONES,
  NEXT_LEVEL_TARGET,
  SEED_ATTEMPTS,
  SEED_BADGES,
  SEED_COMPLETED_HABIT_IDS,
  SEED_HABITS,
  SUMMARY_EMOJI,
  SUMMARY_MESSAGE,
  XP_TO_NEXT,
} from './data';

/**
 * In-memory implementation of the `ApiClient` seam (D-26).
 *
 * Behaviour is intentionally close to a real backend: simulated latency,
 * abortable requests, validation on write, and injectable failures so every
 * error state can be reviewed without a server.
 */

export interface MockClientOptions {
  /** Simulated round-trip time in milliseconds. */
  readonly latencyMs?: number;
  /** Operations that should fail, for previewing error states. */
  readonly failOn?: ReadonlySet<ApiOperation>;
}

const FAILURE_MESSAGES: Record<ApiOperation, string> = {
  checklist: "We couldn't load today's habits.",
  completion: "We couldn't save that habit.",
  create: "We couldn't save your habit.",
  analytics: "We couldn't load your analytics.",
  progress: "We couldn't load your progress.",
  attempts: "We couldn't check your history.",
};

const CATEGORY_ICONS: Record<HabitCategory, HabitIconKey> = {
  health: 'water',
  mind: 'meditate',
  growth: 'reading',
  lifestyle: 'food',
};

const WEEKDAY_BY_INDEX: readonly Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function weekdayOfDate(date: Date): Weekday {
  return WEEKDAY_BY_INDEX[date.getDay()] ?? 'mon';
}

function timeOfDayFor(hour: number): TimeOfDay {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function formatTimeLabel(time: string): string {
  const [hours = '0', minutes = '00'] = time.split(':');
  const hour = Number(hours);
  const suffix = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

/** Stable pseudo-random value from a string, so mock content never flickers. */
function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000;
  }
  return hash;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'habit'
  );
}

function rotate<T>(values: readonly T[], by: number): T[] {
  if (values.length === 0) return [];
  const offset = ((by % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

/** Monday-based index (0 = Monday … 6 = Sunday). */
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function createMockApiClient(options: MockClientOptions = {}): ApiClient {
  const latencyMs = options.latencyMs ?? 450;
  const failOn = options.failOn ?? new Set<ApiOperation>();

  const habits: Habit[] = [...SEED_HABITS];
  /** date key → completed habit ids */
  const completions = new Map<string, Set<string>>();
  let createdCount = 0;

  const todayKey = toDateKey(new Date());
  completions.set(todayKey, new Set(SEED_COMPLETED_HABIT_IDS));

  function wait(signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Request aborted', 'AbortError'));
        return;
      }

      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', handleAbort);
        resolve();
      }, latencyMs);

      function handleAbort() {
        clearTimeout(timer);
        reject(new DOMException('Request aborted', 'AbortError'));
      }

      signal?.addEventListener('abort', handleAbort, { once: true });
    });
  }

  function guard(operation: ApiOperation) {
    if (failOn.has(operation)) {
      throw new ApiError(FAILURE_MESSAGES[operation], { operation, status: 503 });
    }
  }

  function completedFor(dateKey: string): Set<string> {
    const existing = completions.get(dateKey);
    if (existing) return existing;
    const created = new Set<string>();
    completions.set(dateKey, created);
    return created;
  }

  function scheduledHabits(dateKey: string): Habit[] {
    const weekday = weekdayOfDate(new Date(`${dateKey}T00:00:00`));
    return habits.filter((habit) => habit.repeatDays.includes(weekday));
  }

  function buildChecklist(dateKey: string): HabitChecklist {
    const done = completedFor(dateKey);
    const scheduled = scheduledHabits(dateKey);

    const items = scheduled.map((habit) => ({
      habit,
      completed: done.has(habit.id),
    }));

    const categoryCounts = [
      { id: 'all' as const, label: 'All', count: items.length },
      {
        id: 'morning' as const,
        label: 'Morning',
        count: items.filter((item) => item.habit.timeOfDay === 'morning').length,
      },
      {
        id: 'afternoon' as const,
        label: 'Afternoon',
        count: items.filter((item) => item.habit.timeOfDay === 'afternoon').length,
      },
      {
        id: 'evening' as const,
        label: 'Evening',
        count: items.filter((item) => item.habit.timeOfDay === 'evening').length,
      },
    ];

    return { date: dateKey, items, categoryCounts, streak: buildStreak(done.size) };
  }

  function buildStreak(completedToday: number): { days: number; message: string } {
    if (completedToday === 0) {
      return { days: 0, message: 'Back to Square One, Champ.' };
    }

    const days = Math.min(completedToday, 3);
    return {
      days,
      message:
        days >= 3 ? 'Suspiciously consistent lately.' : 'Careful, this could become a habit.',
    };
  }

  function buildAnalytics(range: AnalyticsRange): AnalyticsOverview {
    const now = new Date();
    const isCurrentWeek = range === 'this-week';
    const elapsed = isCurrentWeek ? mondayIndex(now) + 1 : DAY_LABELS.length;
    const shift = isCurrentWeek ? 0 : 3;

    const heatmap = {
      dayLabels: [...DAY_LABELS],
      rows: SEED_HABITS.map((habit) => {
        const base = HEATMAP_BASE[habit.id] ?? [];
        const shifted = rotate(base, shift);
        return {
          habitId: habit.id,
          name: habit.name,
          cells: DAY_LABELS.map((_, index) => {
            if (isCurrentWeek && index >= elapsed) return 'future' as const;
            return shifted[index] ?? 'future';
          }),
        };
      }),
    };

    const done = completedFor(todayKey).size;
    const scheduledCount = scheduledHabits(todayKey).length || habits.length;

    const summary = {
      message: SUMMARY_MESSAGE,
      emoji: SUMMARY_EMOJI,
      metrics: [
        {
          id: 'logged',
          value: `${done}/${scheduledCount}`,
          label: 'habits logged',
          tone: 'green' as const,
        },
        { id: 'best-day', value: 'Tue', label: 'best day', tone: 'purple' as const },
        {
          id: 'streak',
          value: String(done >= 5 ? 1 : 0),
          label: 'day streak',
          tone: 'red' as const,
        },
      ],
    };

    const values = isCurrentWeek ? CHART_BASE : rotate(CHART_BASE, shift);
    const pointCount = isCurrentWeek ? Math.max(1, elapsed) : DAY_LABELS.length;

    const chart = {
      title: 'Perceived Energy vs. Actual Coffee',
      energyLabel: 'Perceived Energy',
      coffeeLabel: 'Actual Coffee',
      yMax: 10,
      yTicks: [0, 5, 10],
      points: values.slice(0, pointCount).map((value, index) => ({
        label: DAY_LABELS[index] ?? `D${index + 1}`,
        energy: value.energy,
        coffee: value.coffee,
      })),
    };

    return {
      range,
      rangeLabel: range === 'this-week' ? 'This Week' : 'Last Week',
      heatmap,
      summary,
      chart,
    };
  }

  function buildProgress(): Progress {
    const done = completedFor(todayKey).size;

    const badges: Badge[] = SEED_BADGES.map((badge) =>
      badge.id === 'badge-early-bird' && done >= 3
        ? { ...badge, earned: true, earnedLabel: 'Earned today' }
        : badge,
    );

    return {
      level: 3,
      levelTitle: 'Level 3',
      rankTitle: 'Functional Caffeine Machine',
      xp: Math.min(XP_TO_NEXT - 1, BASE_XP + done * 5),
      xpToNext: XP_TO_NEXT,
      milestones: [...MILESTONES],
      nextLevel: {
        level: 4,
        title: 'Has Their Life Together',
        unlockCondition: 'Unlock at 7-day streak',
        current: Math.min(NEXT_LEVEL_TARGET, done),
        target: NEXT_LEVEL_TARGET,
        unit: 'days',
      },
      badges,
    };
  }

  return {
    async getChecklist(date: string, requestOptions?: RequestOptions) {
      guard('checklist');
      await wait(requestOptions?.signal);
      return buildChecklist(date);
    },

    async setHabitCompletion(
      input: { habitId: string; date: string; completed: boolean },
      requestOptions?: RequestOptions,
    ): Promise<HabitCompletion> {
      guard('completion');
      await wait(requestOptions?.signal);

      if (!habits.some((habit) => habit.id === input.habitId)) {
        throw new ApiError("That habit doesn't exist any more.", {
          operation: 'completion',
          status: 404,
        });
      }

      const done = completedFor(input.date);
      if (input.completed) done.add(input.habitId);
      else done.delete(input.habitId);

      return { habitId: input.habitId, date: input.date, completed: input.completed };
    },

    async createHabit(input: NewHabitInput, requestOptions?: RequestOptions): Promise<Habit> {
      guard('create');
      await wait(requestOptions?.signal);

      const parsed = newHabitSchema.safeParse(input);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        throw new ApiError(firstIssue?.message ?? 'That habit could not be saved.', {
          operation: 'create',
          status: 422,
        });
      }

      const values = parsed.data;
      createdCount += 1;

      const reminderTime = values.reminderEnabled ? values.reminderTime : null;
      const hour = reminderTime ? Number(reminderTime.split(':')[0]) : new Date().getHours();

      const habit: Habit = {
        id: `habit-${slugify(values.name)}-${createdCount}`,
        name: values.name,
        category: values.category,
        timeOfDay: timeOfDayFor(hour),
        timeLabel: reminderTime ? formatTimeLabel(reminderTime) : 'Anytime',
        icon: CATEGORY_ICONS[values.category],
        realityPill: { ...FRESH_HABIT_PILL },
        repeatDays: [...values.repeatDays],
        reminderEnabled: values.reminderEnabled,
        reminderTime,
        difficulty: values.difficulty,
      };

      habits.push(habit);
      return habit;
    },

    async getAnalyticsOverview(range: AnalyticsRange, requestOptions?: RequestOptions) {
      guard('analytics');
      await wait(requestOptions?.signal);
      return buildAnalytics(range);
    },

    async getProgress(requestOptions?: RequestOptions) {
      guard('progress');
      await wait(requestOptions?.signal);
      return buildProgress();
    },

    async getHabitAttempts(name: string, requestOptions?: RequestOptions): Promise<HabitAttempts> {
      guard('attempts');
      await wait(requestOptions?.signal);

      const normalized = name.trim().toLowerCase();
      if (normalized.length < 2) return { count: 0 };

      const seeded = SEED_ATTEMPTS[normalized];
      if (seeded !== undefined) return { count: seeded };

      return { count: 3 + (hashString(normalized) % 6) };
    },
  };
}
