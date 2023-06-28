import { defineConfig } from 'vitest/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.test.ts'],
    globals: true,
  },
});
