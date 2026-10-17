import { WifiOff } from 'lucide-react';

import { COPY } from '../../lib/copy';
import { useJustReconnected, useOnlineStatus } from '../../hooks/useOnlineStatus';
import { cn } from '../../lib/utils/cn';

/**
 * Offline notice (FR-S-6, DESIGN.md §7).
 *
 * Offline sync is out of scope (D-21), so the app explains the situation and
 * pauses writes rather than pretending they were queued.
 */
export function OfflineBanner() {
  const online = useOnlineStatus();
  const justReconnected = useJustReconnected(online);

  if (online && !justReconnected) return null;

  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 text-center',
        online ? 'bg-success text-success-fg' : 'bg-warning text-warning-fg',
      )}
    >
      <WifiOff aria-hidden="true" className={cn('size-4 shrink-0', online && 'hidden')} />
      <p className="type-caption">
        <span className="font-bold">{online ? COPY.common.online : COPY.states.offlineTitle}</span>
        {' — '}
        {online ? 'changes will save again.' : COPY.states.offlineBody}
      </p>
    </div>
  );
}
