import { format, getDay, isBefore, parseISO, startOfDay } from 'date-fns';

import type { HabitCategory, TimeOfDay, Weekday } from '../api/types';
import { COPY } from '../copy';
import type { AnalyticsRangeCopyKey } from '../copy';

/** ISO `yyyy-MM-dd` key used by the API seam and mock store. */
export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** "Mon, 16 Sep" — the date-selector label used by the kit. */
export function formatDateLabel(date: Date): string {
  return format(date, 'EEE, d MMM');
}

/** Full date for screen readers and tooltips. */
export function formatDateAccessible(date: Date): string {
  return format(date, 'EEEE, d MMMM yyyy');
}

export function formatTimeLabel(time: string): string {
  const [hours = '0', minutes = '00'] = time.split(':');
  const parsed = new Date();
  parsed.setHours(Number(hours), Number(minutes), 0, 0);
  return format(parsed, 'h:mm a');
}

export function isDateInFuture(date: Date): boolean {
  return isBefore(startOfDay(new Date()), startOfDay(date));
}

export function parseDateKey(key: string): Date {
  return parseISO(key);
}

/** Weekday keys in display order (Mon–Sun). */
export const WEEKDAYS: ReadonlyArray<{ id: Weekday; short: string; label: string }> = [
  { id: 'mon', short: 'Mon', label: 'Monday' },
  { id: 'tue', short: 'Tue', label: 'Tuesday' },
  { id: 'wed', short: 'Wed', label: 'Wednesday' },
  { id: 'thu', short: 'Thu', label: 'Thursday' },
  { id: 'fri', short: 'Fri', label: 'Friday' },
  { id: 'sat', short: 'Sat', label: 'Saturday' },
  { id: 'sun', short: 'Sun', label: 'Sunday' },
];

export function weekdayForDate(date: Date): Weekday {
  // date-fns: 0 = Sunday
  const keys: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[getDay(date)] ?? 'mon';
}

export function categoryLabel(category: HabitCategory): string {
  return COPY.newHabit.categoryOptions[category];
}

export function timeOfDayLabel(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':
      return 'Morning';
    case 'afternoon':
      return 'Afternoon';
    case 'evening':
      return 'Evening';
  }
}

export function analyticsRangeLabel(range: AnalyticsRangeCopyKey): string {
  return COPY.analytics.rangeOptions[range];
}

/** Percentage clamped to 0–100, guarding against a zero target. */
export function toPercent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}
