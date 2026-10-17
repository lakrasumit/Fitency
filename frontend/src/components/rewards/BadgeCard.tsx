import { Lock } from 'lucide-react';

import type { Badge, BadgeTone } from '../../lib/api';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { BADGE_ICONS } from './badgeIcons';

const TONE_CLASSES: Record<BadgeTone, string> = {
  amber: 'bg-badge-amber-bg text-badge-amber-fg border-badge-amber-bg',
  rose: 'bg-badge-rose-bg text-badge-rose-fg border-badge-rose-bg',
  blue: 'bg-badge-blue-bg text-badge-blue-fg border-badge-blue-bg',
};

/**
 * Achievement badge (FR-R-5).
 *
 * The kit only designs the earned state. The locked state is the frontend
 * proposal for open item O-3: same footprint, drained to `--bg-sunken` with a
 * lock glyph and an explicit "Locked" label — no colour-only signalling.
 */
export function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = BADGE_ICONS[badge.icon];

  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3',
        badge.earned ? TONE_CLASSES[badge.tone] : 'border-line bg-sunken text-faint',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md border',
          badge.earned ? 'border-line bg-subtle' : 'border-line bg-surface',
        )}
      >
        {badge.earned ? <Icon className="size-4" strokeWidth={1.9} /> : <Lock className="size-4" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className={cn('type-card block truncate', badge.earned ? 'text-ink' : 'text-muted')}>
          {badge.title}
        </span>
        <span className="type-caption block text-muted">
          {badge.earned
            ? (badge.earnedLabel ?? COPY.rewards.badgeEarned)
            : COPY.rewards.badgeLocked}
        </span>
      </span>
    </li>
  );
}
