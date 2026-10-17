import { useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Shared keyboard behaviour for the listbox-style popovers used by the
 * undesigned dropdown interactions (O-1, O-2): arrow keys, Home and End with
 * roving focus.
 */
export function useListboxNavigation(count: number) {
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const focusItem = useCallback((index: number) => {
    itemsRef.current[index]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (count === 0) return;

      const currentIndex = itemsRef.current.findIndex(
        (element) => element === document.activeElement,
      );

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusItem((currentIndex + 1) % count);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusItem((currentIndex - 1 + count) % count);
          break;
        case 'Home':
          event.preventDefault();
          focusItem(0);
          break;
        case 'End':
          event.preventDefault();
          focusItem(count - 1);
          break;
        default:
          break;
      }
    },
    [count, focusItem],
  );

  return { itemsRef, onKeyDown, focusItem } as const;
}
