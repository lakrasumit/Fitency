import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router';

import { TabLayout } from '../layouts/TabLayout';
import { SubPageLayout } from '../layouts/SubPageLayout';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { RouteFallback } from './RouteFallback';

// Route-level code splitting (FR-S-3, DESIGN.md §8.5). The chart only ships in
// the analytics chunk because it is imported exclusively from that page.
const HomePage = lazy(() => import('../pages/home/HomePage'));
const AnalyticsPage = lazy(() => import('../pages/analytics/AnalyticsPage'));
const RewardsPage = lazy(() => import('../pages/rewards/RewardsPage'));
const NewHabitPage = lazy(() => import('../pages/habits/new/NewHabitPage'));
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'));

function withSuspense(node: ReactNode, fallback: ReactNode = <RouteFallback />) {
  return <Suspense fallback={fallback}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TabLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'analytics', element: withSuspense(<AnalyticsPage />) },
      { path: 'rewards', element: withSuspense(<RewardsPage />) },
    ],
  },
  {
    path: '/habits/new',
    element: <SubPageLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [{ index: true, element: withSuspense(<NewHabitPage />) }],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
]);
