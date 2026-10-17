import type { HabitIconKey } from '../../lib/api';
import { cn } from '../../lib/utils/cn';
import { HABIT_ICONS } from './habitIcons';

export interface HabitIconProps {
  icon: HabitIconKey;
  /** The tile is always decorative: the habit name carries the meaning. */
  size?: 'sm' | 'md';
  className?: string;
}

export function HabitIcon({ icon, size = 'md', className }: HabitIconProps) {
  const { Icon, tileClasses } = HABIT_ICONS[icon] ?? HABIT_ICONS.default;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md border',
        size === 'md' ? 'size-11' : 'size-9',
        tileClasses,
        className,
      )}
    >
      <Icon className={size === 'md' ? 'size-5' : 'size-4'} strokeWidth={1.9} />
    </span>
  );
}
