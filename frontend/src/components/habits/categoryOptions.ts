import type { HabitCategory } from '../../lib/api';

/** Display order for the category pills (FR-N-3). */
export const CATEGORY_ORDER: readonly HabitCategory[] = ['health', 'mind', 'growth', 'lifestyle'];

/** Decorative emoji from the kit (Appendix A §A.2) — hidden from assistive tech. */
export const CATEGORY_EMOJI: Record<HabitCategory, string> = {
  health: '💜',
  mind: '💬',
  growth: '📊',
  lifestyle: '✨',
};
