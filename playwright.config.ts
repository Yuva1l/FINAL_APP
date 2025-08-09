import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:3000', headless: true },
  reporter: [['list'], ['html', { outputFolder: 'test-results/html' }]],
  timeout: 60000
});
