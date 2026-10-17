import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Disclosure behaviour for the undesigned dropdown/date interactions
 * (open items O-1 and O-2).
 *
 * Handles outside-click dismissal, Escape, and returns the wiring for a
 * combined trigger + panel (WAI-ARIA "menu button"/popover pattern).
 */
export function usePopover() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const baseId = useRef(`popover-${Math.random().toString(36).slice(2, 9)}`);

  const close = useCallback((options?: { restoreFocus?: boolean }) => {
    setOpen(false);
    if (options?.restoreFocus) triggerRef.current?.focus();
  }, []);

  const toggle = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return {
    open,
    setOpen,
    toggle,
    close,
    containerRef,
    triggerRef,
    panelRef,
    panelId: `${baseId.current}-panel`,
    triggerId: `${baseId.current}-trigger`,
  } as const;
}
