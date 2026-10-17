import { Toaster } from 'sonner';

/**
 * Global toast layer (FR-S-4, D-18/D-25).
 *
 * Positioned at the top so it never collides with the bottom navigation, and
 * styled with design tokens rather than a library palette.
 */
export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      closeButton
      gap={10}
      offset={16}
      toastOptions={{
        duration: 4500,
        style: {
          background: 'var(--bg-surface-raised)',
          border: '1px solid var(--border)',
          color: 'var(--text-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-widget)',
          fontFamily: 'var(--font-sans)',
        },
        classNames: {
          title: 'text-[13px]! font-bold!',
          description: 'text-[11px]! text-muted!',
        },
      }}
    />
  );
}
