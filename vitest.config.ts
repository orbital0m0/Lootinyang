import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
