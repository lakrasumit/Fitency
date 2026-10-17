import { Compass } from 'lucide-react';
import { Link } from 'react-router';

import { COPY } from '../../lib/copy';

/** 404 (FR-S-5). Rendered outside the tab layouts — no dead-end navigation. */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-page px-6 text-center">
      <Compass aria-hidden="true" className="size-7 text-brand-strong" />
      <h1 className="type-h1 text-ink">{COPY.notFound.title}</h1>
      <p className="type-body max-w-sm text-muted">{COPY.notFound.body}</p>

      <Link
        to="/"
        className="type-card mt-2 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 text-on-brand shadow-cta"
      >
        {COPY.common.goHome}
      </Link>
    </div>
  );
}
