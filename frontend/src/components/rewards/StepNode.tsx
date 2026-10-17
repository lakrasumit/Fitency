import { Check, Lock } from 'lucide-react';

import type { MilestoneState } from '../../lib/api';
import { cn } from '../../lib/utils/cn';

export interface StepNodeProps {
  state: MilestoneState;
  level: number;
  /** Announced to assistive tech: "Level 2, Slightly Consistent: completed". */
  accessibleLabel: string;
}

/** 32px milestone node (DESIGN.md §5, §A.4 item 6 uses a checkmark, not a number). */
export function StepNode({ state, level, accessibleLabel }: StepNodeProps) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold',
        state === 'completed' && 'border-brand bg-brand text-on-brand',
        state === 'current' &&
          'border-brand-strong bg-brand-soft text-brand-strong ring-4 ring-reward-step-ring',
        state === 'locked' && 'border-line bg-sunken text-faint',
      )}
    >
      {state === 'completed' ? (
        <Check aria-hidden="true" strokeWidth={3} className="size-3.5" />
      ) : state === 'locked' ? (
        <Lock aria-hidden="true" className="size-3.5" />
      ) : (
        <span aria-hidden="true">{level}</span>
      )}
      <span className="sr-only">{accessibleLabel}</span>
    </span>
  );
}
