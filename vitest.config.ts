import { defineConfig } from 'vitest/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import tsConfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ['**/*.test.ts'],
    globals: true,
  },
});
