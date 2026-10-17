import type { Badge, Habit, HeatStatus, Milestone, Weekday } from '../types';

/**
 * Seed data for the in-memory mock API (D-26).
 *
 * Content follows the accepted kit placeholders (Appendix A §A.2, D-15) while
 * staying internally consistent — see Appendix A §A.4 item 8 (the heatmap must
 * not mix future and real data).
 */

export const ALL_DAYS: readonly Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const SEED_HABITS: readonly Habit[] = [
  {
    id: 'habit-water',
    name: 'Drink Water',
    category: 'health',
    timeOfDay: 'morning',
    timeLabel: '7:00 AM',
    icon: 'water',
    realityPill: { text: 'Barely hydrated', tone: 'amber' },
    repeatDays: ALL_DAYS,
    reminderEnabled: true,
    reminderTime: '07:00',
    difficulty: 'easy',
  },
  {
    id: 'habit-meditate',
    name: 'Meditate',
    category: 'mind',
    timeOfDay: 'morning',
    timeLabel: '6:30 AM',
    icon: 'meditate',
    realityPill: { text: 'Monkey mind', tone: 'red' },
    repeatDays: ALL_DAYS,
    reminderEnabled: true,
    reminderTime: '06:30',
    difficulty: 'hard',
  },
  {
    id: 'habit-gym',
    name: 'Go to the Gym',
    category: 'health',
    timeOfDay: 'afternoon',
    timeLabel: '1:00 PM',
    icon: 'gym',
    realityPill: { text: 'Caffeine-powered', tone: 'purple' },
    repeatDays: ALL_DAYS,
    reminderEnabled: false,
    reminderTime: null,
    difficulty: 'hard',
  },
  {
    id: 'habit-eat-clean',
    name: 'Eat Clean',
    category: 'lifestyle',
    timeOfDay: 'afternoon',
    timeLabel: '3:30 PM',
    icon: 'food',
    realityPill: { text: 'Pizza counts, right?', tone: 'orange' },
    repeatDays: ALL_DAYS,
    reminderEnabled: false,
    reminderTime: null,
    difficulty: 'delusional',
  },
  {
    id: 'habit-read',
    name: 'Read 10 Pages',
    category: 'growth',
    timeOfDay: 'evening',
    timeLabel: '9:00 PM',
    icon: 'reading',
    realityPill: { text: 'One page counts', tone: 'green' },
    repeatDays: ALL_DAYS,
    reminderEnabled: true,
    reminderTime: '21:00',
    difficulty: 'easy',
  },
];

/** Habits already ticked today, matching the kit's 2-of-5 state. */
export const SEED_COMPLETED_HABIT_IDS: readonly string[] = ['habit-meditate', 'habit-read'];

/** Default reality pill for habits with no history yet. */
export const FRESH_HABIT_PILL = { text: 'Fresh start', tone: 'green' } as const;

/** Mon–Sun × habit heatmap baseline for the current week. */
export const HEATMAP_BASE: Readonly<Record<string, readonly HeatStatus[]>> = {
  'habit-gym': [
    'productive',
    'normal',
    'struggled',
    'missed',
    'normal',
    'productive',
    'productive',
  ],
  'habit-read': [
    'normal',
    'productive',
    'productive',
    'normal',
    'struggled',
    'productive',
    'normal',
  ],
  'habit-water': [
    'productive',
    'productive',
    'productive',
    'normal',
    'productive',
    'productive',
    'normal',
  ],
  'habit-eat-clean': [
    'struggled',
    'normal',
    'missed',
    'normal',
    'struggled',
    'normal',
    'productive',
  ],
  'habit-meditate': [
    'normal',
    'productive',
    'normal',
    'productive',
    'productive',
    'missed',
    'productive',
  ],
};

/** Weekly chart baseline: perceived energy vs. actual coffee (0–10). */
export const CHART_BASE: ReadonlyArray<{ energy: number; coffee: number }> = [
  { energy: 7, coffee: 6 },
  { energy: 6, coffee: 8 },
  { energy: 4, coffee: 9 },
  { energy: 7, coffee: 5 },
  { energy: 5, coffee: 8 },
  { energy: 8, coffee: 3 },
  { energy: 7, coffee: 4 },
];

export const SUMMARY_MESSAGE = 'You were 80% productive on Tuesday. Wednesday, on the other hand…';

export const SUMMARY_EMOJI = '😅';

export const MILESTONES: readonly Milestone[] = [
  { id: 'level-1', level: 1, title: 'Habit Newbie', state: 'completed' },
  { id: 'level-2', level: 2, title: 'Slightly Consistent', state: 'completed' },
  { id: 'level-3', level: 3, title: 'Functional Caffeine Machine', state: 'current' },
  { id: 'level-4', level: 4, title: 'Has Their Life Together', state: 'locked' },
];

export const BASE_XP = 120;
export const XP_TO_NEXT = 200;
export const NEXT_LEVEL_TARGET = 7;

export const SEED_BADGES: readonly Badge[] = [
  {
    id: 'badge-pretender',
    title: 'The Pretender',
    tone: 'amber',
    icon: 'mask',
    earned: true,
    earnedLabel: 'Earned 3 Sep',
  },
  {
    id: 'badge-snooze',
    title: 'Snooze Warrior',
    tone: 'rose',
    icon: 'alarm',
    earned: true,
    earnedLabel: 'Earned 7 Sep',
  },
  {
    id: 'badge-midnight',
    title: 'Midnight Muncher',
    tone: 'blue',
    icon: 'moon',
    earned: true,
    earnedLabel: 'Earned 12 Sep',
  },
  {
    id: 'badge-hydration',
    title: 'Hydration Hero',
    tone: 'amber',
    icon: 'droplet',
    earned: true,
    earnedLabel: 'Earned 16 Sep',
  },
  // Locked/unearned state is undesigned in the kit (O-3); this is the frontend
  // proposal, kept deliberately quiet (dim tone + lock glyph).
  { id: 'badge-early-bird', title: 'Early Bird', tone: 'rose', icon: 'sunrise', earned: false },
  { id: 'badge-no-excuses', title: 'No Excuses Club', tone: 'blue', icon: 'shield', earned: false },
];

/** Deterministic "tried this N times this year" values (PRD.md §10). */
export const SEED_ATTEMPTS: Readonly<Record<string, number>> = {
  'drink water': 4,
  meditate: 6,
  'go to the gym': 9,
  'eat clean': 12,
  'read 10 pages': 3,
  'read 50 pages a day': 4,
};
