import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    // 360px Small Mobile
    {
      name: 'Mobile-Small-360',
      use: {
        viewport: { width: 360, height: 640 },
      },
    },
    // 390px Standard Mobile (iPhone 14/15)
    {
      name: 'Mobile-Standard-390',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
      },
    },
    // 768px Tablet (iPad Mini / Portrait)
    {
      name: 'Tablet-768',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },
    // 1024px Laptop
    {
      name: 'Desktop-1024',
      use: {
        viewport: { width: 1024, height: 768 },
      },
    },
    // 1440px Wide Desktop
    {
      name: 'Desktop-Wide-1440',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
