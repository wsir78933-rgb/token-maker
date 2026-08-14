import { defineConfig, devices } from '@playwright/test';

const isContinuousIntegration = Boolean(process.env.CI);

export default defineConfig({
  forbidOnly: isContinuousIntegration,
  retries: isContinuousIntegration ? 2 : 0,
  reporter: isContinuousIntegration ? [['github'], ['html', { open: 'never' }]] : 'list',
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm exec next start --hostname 127.0.0.1 --port 3000',
    reuseExistingServer: !isContinuousIntegration,
    timeout: 120_000,
    url: 'http://127.0.0.1:3000',
  },
  workers: isContinuousIntegration ? 1 : undefined,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
