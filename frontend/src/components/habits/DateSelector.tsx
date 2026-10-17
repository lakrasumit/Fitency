import { CalendarDays } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { useListboxNavigation } from '../../hooks/useListboxNavigation';
import { usePopover } from '../../hooks/usePopover';
import { COPY } from '../../lib/copy';
import { cn } from '../../lib/utils/cn';
import { formatDateLabel, toDateKey } from '../../lib/utils/date';
import { IconButton } from '../ui/IconButton';

export interface DateSelectorProps {
  /** Selected date, ISO `yyyy-MM-dd`. */
  value: string;
  onChange: (date: string) => void;
  /** Display label for the active date, e.g. "Fri, 17 Oct". */
  dateLabel: string;
  /** Full accessible form of the active date. */
  accessibleLabel: string;
}

const RECENT_DAYS = 7;

function dateOptionLabel(date: Date, todayKey: string): string {
  return toDateKey(date) === todayKey ? `Today · ${formatDateLabel(date)}` : formatDateLabel(date);
}

/**
 * Date selector (FR-H-1/FR-H-2) — the frontend proposal for open item O-1.
 *
 * The kit left this interaction undesigned. Proposal: a pill + calendar button
 * that opens a listbox of the last seven days (logging is a today-and-back
 * activity; future days are excluded because there is nothing to log yet), with
 * a listbox pattern reusing the same keyboard behaviour as the other dropdowns.
 */
export function DateSelector({ value, onChange, dateLabel, accessibleLabel }: DateSelectorProps) {
  const { open, toggle, close, containerRef, triggerRef, panelId, triggerId } = usePopover();
  const { itemsRef, onKeyDown, focusItem } = useListboxNavigation(RECENT_DAYS + 1);

  const todayKey = toDateKey(new Date());

  const options = useMemo(
    () =>
      Array.from({ length: RECENT_DAYS }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return { key: toDateKey(date), label: dateOptionLabel(date, todayKey) };
      }),
    [todayKey],
  );

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.key === value),
  );

  useEffect(() => {
    if (!open) return;
    focusItem(selectedIndex);
  }, [open, selectedIndex, focusItem]);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`${dateLabel}. ${COPY.home.datePickerLabel}`}
        onClick={toggle}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line bg-raised px-3 text-ink transition-colors hover:border-line-strong"
      >
        <span className="type-caption font-bold">{dateLabel}</span>
        <span className="sr-only">({accessibleLabel})</span>
      </button>

      <IconButton
        label={COPY.home.datePickerLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggle}
      >
        <CalendarDays aria-hidden="true" className="size-4" />
      </IconButton>

      {open ? (
        <div
          id={panelId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={triggerId}
          onKeyDown={onKeyDown}
          className="absolute left-0 top-[calc(100%+8px)] z-40 min-w-[13rem] rounded-lg border border-line bg-raised p-1 shadow-widget"
        >
          {options.map((option, index) => {
            const isSelected = option.key === value;

            return (
              <button
                key={option.key}
                ref={(element) => {
                  itemsRef.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.key);
                  close({ restoreFocus: true });
                }}
                className={cn(
                  'flex min-h-11 w-full items-center rounded-md px-3 text-left text-[13px] font-medium transition-colors',
                  isSelected
                    ? 'bg-brand-soft text-ink'
                    : 'text-muted hover:bg-subtle hover:text-ink',
                )}
              >
                {option.label}
              </button>
            );
          })}

          {value === todayKey ? null : (
            <button
              ref={(element) => {
                itemsRef.current[RECENT_DAYS] = element;
              }}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => {
                onChange(todayKey);
                close({ restoreFocus: true });
              }}
              className="mt-1 flex min-h-11 w-full items-center rounded-md px-3 text-left text-[13px] font-bold text-brand-strong transition-colors hover:bg-subtle"
            >
              Jump to today
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
