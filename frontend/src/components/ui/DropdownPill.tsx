import { ChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { useListboxNavigation } from '../../hooks/useListboxNavigation';
import { usePopover } from '../../hooks/usePopover';
import { cn } from '../../lib/utils/cn';

export interface DropdownOption<T extends string> {
  id: T;
  label: string;
}

export interface DropdownPillProps<T extends string> {
  /** Accessible name for the trigger and the option list. */
  label: string;
  /** Currently selected option. */
  value: T;
  options: readonly DropdownOption<T>[];
  onChange: (id: T) => void;
  leadingIcon?: ReactNode;
  className?: string;
}

/**
 * Menu trigger + listbox panel.
 *
 * Frontend proposal for two undesigned interactions (O-1 date selection,
 * O-2 analytics range): a WAI-ARIA listbox with arrow-key navigation, Escape to
 * dismiss, outside-click dismissal and focus restoration.
 */
export function DropdownPill<T extends string>({
  label,
  value,
  options,
  onChange,
  leadingIcon,
  className,
}: DropdownPillProps<T>) {
  const { open, toggle, close, containerRef, triggerRef, panelRef, panelId, triggerId } =
    usePopover();
  const { itemsRef, onKeyDown, focusItem } = useListboxNavigation(options.length);

  const selectedIndex = options.findIndex((option) => option.id === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;
    focusItem(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex, focusItem]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={label}
        onClick={toggle}
        className={cn(
          'inline-flex min-h-11 items-center gap-1.5 rounded-pill border border-line bg-raised px-3',
          'text-[11px] font-bold text-ink transition-colors hover:border-line-strong',
        )}
      >
        {leadingIcon}
        <span>{selected?.label ?? label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn('size-4 text-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={triggerId}
          onKeyDown={onKeyDown}
          className="absolute right-0 z-40 mt-2 min-w-[11rem] rounded-lg border border-line bg-raised p-1 shadow-widget"
        >
          {options.map((option, index) => {
            const isSelected = option.id === value;

            return (
              <button
                key={option.id}
                ref={(element) => {
                  itemsRef.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.id);
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
        </div>
      ) : null}
    </div>
  );
}
