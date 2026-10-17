import type { RealityPill as RealityPillData, RealityTone } from '../../lib/api';
import { cn } from '../../lib/utils/cn';

const TONE_CLASSES: Record<RealityTone, string> = {
  amber: 'bg-warning border-warning-line text-warning-fg',
  red: 'bg-danger border-danger-line text-danger-fg',
  purple: 'bg-purple border-purple-line text-purple-fg',
  orange: 'bg-orange border-orange-line text-orange-fg',
  green: 'bg-success border-success-line text-success-fg',
};

export interface RealityPillProps {
  pill: RealityPillData;
  className?: string;
}

/** Honest-feedback pill: radius 6, 11px, tinted background (DESIGN.md §2.1/§5). */
export function RealityPill({ pill, className }: RealityPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold leading-[15px]',
        TONE_CLASSES[pill.tone],
        className,
      )}
    >
      {pill.text}
    </span>
  );
}
