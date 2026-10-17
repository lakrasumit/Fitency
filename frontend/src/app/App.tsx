import { RouterProvider } from 'react-router';

import { AppToaster } from '../components/ui/AppToaster';
import { DataProvider } from '../state/DataProvider';
import { ThemeProvider } from '../state/ThemeProvider';
import { router } from './router';

/** Provider composition + router (DESIGN.md §8.1). */
export function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <AppToaster />
      </DataProvider>
    </ThemeProvider>
  );
}
