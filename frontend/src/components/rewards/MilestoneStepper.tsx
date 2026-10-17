import { Fragment } from 'react';

import type { Milestone } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { Card } from '../ui/Card';
import { StepNode } from './StepNode';

export interface MilestoneStepperProps {
  milestones: readonly Milestone[];
  className?: string;
}

const STATE_COPY: Record<Milestone['state'], string> = {
  completed: 'completed',
  current: 'current level',
  locked: 'locked',
};

/**
 * Milestone stepper (FR-R-3).
 *
 * Four nodes — completed, current, locked. The full set of titles is exposed to
 * screen readers as a list (the kit truncated them at 4 columns; see Appendix A
 * §A.4 item 7), while only the current title is shown visually.
 */
export function MilestoneStepper({ milestones, className }: MilestoneStepperProps) {
  const current = milestones.find((milestone) => milestone.state === 'current');

  return (
    <Card as="section" className={className} aria-labelledby="milestones-heading">
      <h2 id="milestones-heading" className="sr-only">
        {COPY.rewards.milestoneLabel}
      </h2>

      <div className={cn('flex items-center')} aria-hidden="true">
        {milestones.map((milestone, index) => (
          <Fragment key={milestone.id}>
            <StepNode
              state={milestone.state}
              level={milestone.level}
              accessibleLabel={`${milestone.title}: ${STATE_COPY[milestone.state]}`}
            />
            {index < milestones.length - 1 ? (
              <span
                className={cn(
                  'h-0.5 flex-1 rounded-pill',
                  milestone.state === 'locked' ? 'bg-line-strong' : 'bg-brand',
                )}
              />
            ) : null}
          </Fragment>
        ))}
      </div>

      <ol className="sr-only">
        {milestones.map((milestone) => (
          <li key={milestone.id}>
            Level {milestone.level}, {milestone.title}: {STATE_COPY[milestone.state]}
          </li>
        ))}
      </ol>

      {current ? (
        <p className="type-caption mt-3 text-center text-muted">
          You are at <span className="font-bold text-ink">{current.title}</span>
        </p>
      ) : null}
    </Card>
  );
}
