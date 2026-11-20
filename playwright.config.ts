import { defineConfig, devices } from '@playwright/test';

// https://playwright.dev/docs/test-configuration
const port = 4173;

export default defineConfig({
  testDir: 'tests',
  // the visual diff's screenshots, which have their own config (playwright.visual.config.ts)
  testIgnore: '**/visual/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },

  // the phone layout swaps in the toggle-only header, so both viewports are scanned
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  // serve the prerendered site (pnpm test:a11y runs nuxt generate first)
  webServer: {
    command: `pnpm exec sirv .output/public --port ${port} --quiet`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
