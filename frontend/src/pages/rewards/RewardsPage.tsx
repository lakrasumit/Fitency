import { Share2 } from 'lucide-react';

import { RefetchIndicator } from '../../components/feedback/RefetchIndicator';
import { PageHeader } from '../../components/nav/PageHeader';
import { BadgeGrid } from '../../components/rewards/BadgeGrid';
import { LevelCard } from '../../components/rewards/LevelCard';
import { MilestoneStepper } from '../../components/rewards/MilestoneStepper';
import { NextLevelCard } from '../../components/rewards/NextLevelCard';
import { RewardsSkeleton } from '../../components/rewards/RewardsSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { IconButton } from '../../components/ui/IconButton';
import { useProgress } from '../../hooks/useProgress';
import { COPY } from '../../lib/copy';
import { notifyInfo } from '../../lib/feedback';

/**
 * Rewards — gamified leveling (FR-R-1 … FR-R-6).
 *
 * `lg`: level/stepper/next-level on the left, badges on the right (DESIGN.md §4.4).
 */
export default function RewardsPage() {
  const { progress, status, error, isRefetching, retry } = useProgress();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={COPY.rewards.title}
        subtitle={COPY.rewards.subtitle}
        back
        backLabel={COPY.rewards.backLabel}
        action={
          <IconButton
            label={COPY.rewards.shareLabel}
            onClick={() => notifyInfo(COPY.rewards.shareToast, COPY.rewards.shareToastBody)}
          >
            <Share2 aria-hidden="true" className="size-4" />
          </IconButton>
        }
      />

      {isRefetching ? <RefetchIndicator label={COPY.common.refreshInProgress} /> : null}

      {status === 'loading' || status === 'idle' ? <RewardsSkeleton /> : null}

      {status === 'error' ? <ErrorState message={error} onRetry={retry} /> : null}

      {status === 'ready' && progress ? (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <LevelCard
              levelTitle={progress.levelTitle}
              rankTitle={progress.rankTitle}
              xp={progress.xp}
              xpToNext={progress.xpToNext}
            />
            <MilestoneStepper milestones={progress.milestones} />
            <NextLevelCard nextLevel={progress.nextLevel} />
          </div>

          <div className="lg:col-span-1">
            {progress.badges.length === 0 ? (
              <EmptyState title={COPY.rewards.emptyTitle} body={COPY.rewards.emptyBody} />
            ) : (
              <BadgeGrid
                badges={progress.badges}
                onViewAll={() => notifyInfo(COPY.rewards.badgesViewAllNote)}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
