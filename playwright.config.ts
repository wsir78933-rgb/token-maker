import { defineConfig, devices } from '@playwright/test';

const isContinuousIntegration = Boolean(process.env.CI);

export default defineConfig({
  forbidOnly: isContinuousIntegration,
  retries: isContinuousIntegration ? 2 : 0,
  reporter: isContinuousIntegration ? [['github'], ['html', { open: 'never' }]] : 'list',
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:40001',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm exec next start --hostname 127.0.0.1 --port 40001',
    reuseExistingServer: !isContinuousIntegration,
    timeout: 120_000,
    url: 'http://127.0.0.1:40001',
  },
  workers: isContinuousIntegration ? 1 : undefined,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
