/**
 * The app-wide API entry point. **Import data only through this module.**
 *
 * ```ts
 * import { api } from '../lib/api';
 * ```
 *
 * Swapping the mock for the real backend means implementing `ApiClient` in
 * `lib/api/http/` and changing the single binding below — no page or hook
 * changes (D-26, DESIGN.md §8.2).
 *
 * BLOCKED: `HttpApiClient` cannot be written yet. PRD.md §10 / D-27 list the
 * auth model, endpoint shapes, error format, base URL(s), pagination semantics
 * and CORS setup the frontend is still waiting on. `VITE_API_BASE_URL` is
 * reserved for that integration and intentionally unused today.
 */

import type { ApiClient } from './client';
import { mockApiClient } from './mock';

export const api: ApiClient = mockApiClient;

export type { ApiClient, RequestOptions } from './client';
export * from './types';
