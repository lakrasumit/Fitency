import { AlertTriangle } from 'lucide-react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

import { Button } from '../components/ui/Button';
import { COPY } from '../lib/copy';

/**
 * Route-level error boundary (FR-S-5).
 *
 * Wired as `errorElement` on each layout route, so a render or loader failure
 * degrades to a readable page instead of a blank screen.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  const reference =
    isRouteErrorResponse(error) && error.status === 404
      ? COPY.notFound.body
      : import.meta.env.DEV && error instanceof Error
        ? error.message
        : COPY.errorBoundary.body;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-page px-6 text-center">
      <AlertTriangle aria-hidden="true" className="size-7 text-danger-fg" />
      <h1 className="type-h1 text-ink">
        {isRouteErrorResponse(error) && error.status === 404
          ? COPY.notFound.title
          : COPY.errorBoundary.title}
      </h1>
      <p className="type-body max-w-md text-muted">{reference}</p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button variant="primary" size="md" onClick={() => window.location.reload()}>
          {COPY.errorBoundary.reload}
        </Button>
        <Link
          to="/"
          className="type-caption rounded-md border border-line px-4 py-3 font-bold text-muted hover:border-line-strong hover:text-ink"
        >
          {COPY.common.goHome}
        </Link>
      </div>
    </div>
  );
}
