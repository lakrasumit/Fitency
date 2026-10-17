import type { NextLevel } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { pluralize } from '../../lib/utils/date';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export interface NextLevelCardProps {
  nextLevel: NextLevel;
  className?: string;
}

/** Next level card (FR-R-4). */
export function NextLevelCard({ nextLevel, className }: NextLevelCardProps) {
  const { level, title, unlockCondition, current, target, unit } = nextLevel;

  return (
    <Card as="section" className={className} aria-labelledby="next-level-heading">
      <p className="type-micro uppercase tracking-[0.08em] text-purple-fg">
        {COPY.rewards.nextLevelLabel}
      </p>

      <h2 id="next-level-heading" className="type-title mt-1 text-ink">
        Level {level} · {title}
      </h2>

      <p className="type-caption mt-1 text-muted">{unlockCondition}</p>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="type-card text-ink">
          {current} / {target} {pluralize(target, unit.replace(/s$/, ''), unit)}
        </span>
        <span className="type-caption text-muted">{title}</span>
      </div>

      <ProgressBar
        className="mt-2"
        size="sm"
        value={current}
        max={target}
        label={`Level ${level} unlock progress: ${current} of ${target} ${unit}`}
      />
    </Card>
  );
}
