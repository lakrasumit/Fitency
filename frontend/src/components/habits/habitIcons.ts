import { Apple, BookOpen, Dumbbell, Droplets, Flower2, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { HabitIconKey } from '../../lib/api';

interface HabitIconDefinition {
  Icon: LucideIcon;
  /** Tile background, border and glyph colour come from tokens (DESIGN.md §2.1). */
  tileClasses: string;
}

/**
 * Habit icon tiles — 44px, radius 12 (DESIGN.md §2.1, §5).
 *
 * The kit's mixed iconography (body A.4 item 10) is unified onto lucide.
 */
export const HABIT_ICONS: Record<HabitIconKey, HabitIconDefinition> = {
  water: {
    Icon: Droplets,
    tileClasses: 'bg-tile-water-bg border-tile-water-line text-tile-water-fg',
  },
  meditate: {
    Icon: Flower2,
    tileClasses: 'bg-tile-meditate-bg border-tile-meditate-line text-tile-meditate-fg',
  },
  gym: {
    Icon: Dumbbell,
    tileClasses: 'bg-tile-gym-bg border-tile-gym-line text-tile-gym-fg',
  },
  food: {
    Icon: Apple,
    tileClasses: 'bg-tile-food-bg border-tile-food-line text-tile-food-fg',
  },
  reading: {
    Icon: BookOpen,
    tileClasses: 'bg-tile-reading-bg border-tile-reading-line text-tile-reading-fg',
  },
  default: {
    Icon: Sparkles,
    tileClasses: 'bg-tile-default-bg border-tile-default-line text-tile-default-fg',
  },
};
