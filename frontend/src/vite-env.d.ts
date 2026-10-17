/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Reserved for the backend integration (PRD.md §10). Not wired yet. */
  readonly VITE_API_BASE_URL?: string;
  /** Comma-separated mock operations to force-fail, e.g. "checklist,create". */
  readonly VITE_API_MOCK_FAIL?: string;
  /** Simulated mock latency in milliseconds. */
  readonly VITE_API_MOCK_LATENCY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
