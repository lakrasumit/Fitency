import type { ApiClient } from '../client';
import type { ApiOperation } from '../types';
import { createMockApiClient } from './client';

const VALID_OPERATIONS: readonly ApiOperation[] = [
  'checklist',
  'completion',
  'create',
  'analytics',
  'progress',
  'attempts',
];

function parseFailures(raw: string | undefined): Set<ApiOperation> {
  if (!raw) return new Set();

  return new Set(
    raw
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter((value): value is ApiOperation =>
        (VALID_OPERATIONS as readonly string[]).includes(value),
      ),
  );
}

function parseLatency(raw: string | undefined): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 450;
}

/**
 * The app's live API client while the backend contract is pending (D-26).
 *
 * Failure injection is opt-in through `VITE_API_MOCK_FAIL` so error, retry and
 * empty states can be reviewed without touching component code.
 */
export const mockApiClient: ApiClient = createMockApiClient({
  latencyMs: parseLatency(import.meta.env.VITE_API_MOCK_LATENCY_MS),
  failOn: parseFailures(import.meta.env.VITE_API_MOCK_FAIL),
});

export { createMockApiClient } from './client';
export type { MockClientOptions } from './client';
