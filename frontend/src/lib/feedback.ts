import { toast } from 'sonner';

/**
 * Single seam for transient action feedback (D-18).
 *
 * Components and hooks never import `sonner` directly, so the toast library
 * stays swappable.
 */

export function notifySuccess(message: string, description?: string): void {
  toast.success(message, { description });
}

export function notifyError(message: string, description?: string): void {
  toast.error(message, { description });
}

export function notifyInfo(message: string, description?: string): void {
  toast.info(message, { description });
}
