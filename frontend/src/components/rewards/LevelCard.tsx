import { Trophy } from 'lucide-react';

import { COPY } from '../../lib/copy';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export interface LevelCardProps {
  levelTitle: string;
  rankTitle: string;
  xp: number;
  xpToNext: number;
  className?: string;
}

/** Current level card (FR-R-2). */
export function LevelCard({ levelTitle, rankTitle, xp, xpToNext, className }: LevelCardProps) {
  return (
    <Card as="section" className={className} aria-labelledby="level-heading">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-md border border-purple-line bg-reward-badge-bg text-purple-fg"
        >
          <Trophy className="size-5" strokeWidth={1.9} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 id="level-heading" className="type-title text-ink">
            {levelTitle}
          </h2>
          <p className="type-caption text-muted">{rankTitle}</p>
        </div>

        <p className="type-caption shrink-0 text-right text-muted">
          <span className="text-[15px] font-bold text-ink">{xp}</span> / {xpToNext}{' '}
          <abbr title="experience points" className="no-underline">
            XP
          </abbr>
        </p>
      </div>

      <ProgressBar
        className="mt-4"
        value={xp}
        max={xpToNext}
        gradient
        label={`${COPY.rewards.xpLabel}: ${xp} of ${xpToNext}`}
      />
    </Card>
  );
}
