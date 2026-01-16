import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // For WebGL testing, we might need jsdom or happy-dom later
    // environment: 'jsdom',
  },
});
