import { COPY } from '../copy';

/** Error type thrown by the mock (and, later, the HTTP) API client. */
export class ApiError extends Error {
  readonly status?: number;
  readonly operation?: string;

  constructor(message: string, options?: { status?: number; operation?: string; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = 'ApiError';
    this.status = options?.status;
    this.operation = options?.operation;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Maps any thrown value onto a message safe to render in the UI (D-18). */
export function toErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return COPY.states.errorBody;
}

/** Cancellation-aware helper so aborted requests never surface as errors. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * Reads a validation message from a value whose shape is only known at runtime.
 *
 * react-hook-form types array-field errors as a merge of `FieldError` and
 * `FieldError[]`, so this keeps the call sites type-safe without casting.
 */
export function fieldErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || Array.isArray(error)) return undefined;

  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}
