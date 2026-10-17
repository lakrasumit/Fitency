import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    // Route-level code splitting is handled by React.lazy in src/app/router.tsx (D-01, §8.5).
    // The chart is isolated inside the lazy-loaded /analytics route chunk (D-17).
    chunkSizeWarningLimit: 700,
    sourcemap: false,
  },
});
