import { PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router';

import { RefetchIndicator } from '../../components/feedback/RefetchIndicator';
import { DateSelector } from '../../components/habits/DateSelector';
import { FilterPill } from '../../components/habits/FilterPill';
import { HabitCard } from '../../components/habits/HabitCard';
import { HabitListSkeleton } from '../../components/habits/HabitListSkeleton';
import { StreakCallout } from '../../components/habits/StreakCallout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useHabits } from '../../hooks/useHabits';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useToggleHabit } from '../../hooks/useToggleHabit';
import { COPY } from '../../lib/copy';
import { toPercent } from '../../lib/utils/date';

/**
 * Home — daily checklist (FR-H-1 … FR-H-8).
 *
 * Mobile: header, title, filters, checklist, streak callout.
 * `lg`: checklist on the left, streak + summary on the right (DESIGN.md §4.1).
 */
export default function HomePage() {
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const { toggle, isPending } = useToggleHabit();

  const {
    date,
    dateLabel,
    dateAccessibleLabel,
    activeFilter,
    counts,
    items,
    allItems,
    completedCount,
    totalCount,
    streak,
    status,
    error,
    isRefetching,
    setFilter,
    setDate,
    retry,
  } = useHabits();

  const isOffline = !online;
  const hasHabits = allItems.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <DateSelector
          value={date}
          onChange={setDate}
          dateLabel={dateLabel}
          accessibleLabel={dateAccessibleLabel}
        />
        {isRefetching ? <RefetchIndicator label={COPY.common.refreshInProgress} /> : null}
      </div>

      <div>
        <h1 className="type-h1 text-ink">{COPY.home.title}</h1>
        <p className="type-body mt-1 text-muted">{COPY.home.tagline}</p>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div
            role="group"
            aria-label={COPY.home.filtersLabel}
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0"
          >
            {counts.map((filter) => (
              <FilterPill
                key={filter.id}
                filter={filter}
                active={filter.id === activeFilter}
                onSelect={setFilter}
              />
            ))}
          </div>

          {status === 'loading' ? <HabitListSkeleton /> : null}

          {status === 'error' ? <ErrorState message={error} onRetry={retry} /> : null}

          {status === 'ready' && !hasHabits ? (
            <EmptyState
              icon={<PartyPopper aria-hidden="true" className="size-6" />}
              title={COPY.home.emptyTitle}
              body={COPY.home.emptyBody}
              action={
                <Button size="md" onClick={() => void navigate('/habits/new')}>
                  {COPY.home.emptyCta}
                </Button>
              }
            />
          ) : null}

          {status === 'ready' && hasHabits && items.length === 0 ? (
            <EmptyState title={COPY.home.filteredEmptyTitle} body={COPY.home.filteredEmptyBody} />
          ) : null}

          {status === 'ready' && items.length > 0 ? (
            <ul aria-label={COPY.home.listLabel} className="flex flex-col gap-3">
              {items.map((item) => (
                <HabitCard
                  key={item.habit.id}
                  item={item}
                  onToggle={(habitId) => void toggle(habitId)}
                  pending={isPending(item.habit.id)}
                  disabled={isOffline}
                />
              ))}
            </ul>
          ) : null}
        </div>

        <aside className="flex flex-col gap-4">
          <StreakCallout
            days={streak?.days ?? 0}
            message={streak?.message ?? COPY.home.streakIdle}
          />

          {/* Desktop-only summary (DESIGN.md §4.1 proposal, O-5). */}
          <Card className="hidden lg:block">
            <h2 className="type-card text-ink">{COPY.home.summaryTitle}</h2>
            <p className="type-caption mt-1 text-muted">
              <span className="text-[18px] font-bold text-ink">{completedCount}</span> /{' '}
              {totalCount} {COPY.home.summaryDone}
            </p>
            <ProgressBar
              className="mt-3"
              size="sm"
              value={completedCount}
              max={Math.max(totalCount, 1)}
              label={`${toPercent(completedCount, totalCount)}% of today's habits logged`}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}
