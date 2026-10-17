import type { Badge } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { BadgeCard } from './BadgeCard';

export interface BadgeGridProps {
  badges: readonly Badge[];
  onViewAll?: () => void;
  className?: string;
}

/**
 * Earned badge grid (FR-R-5).
 *
 * Two columns — the kit's four-column grid truncated titles (Appendix A §A.4
 * item 7). "View all" is a static control: the badges page is out of v1 (D-10).
 */
export function BadgeGrid({ badges, onViewAll, className }: BadgeGridProps) {
  return (
    <section className={className} aria-labelledby="badges-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="badges-heading" className="type-card text-ink">
          {COPY.rewards.badgesTitle}
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          title={COPY.rewards.badgesViewAllNote}
          className="type-caption font-bold text-brand-strong hover:underline"
        >
          {COPY.rewards.badgesViewAll}
          <span className="sr-only"> ({COPY.rewards.badgesViewAllNote})</span>
        </button>
      </div>

      <ul className={cn('mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2')}>
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </ul>
    </section>
  );
}
