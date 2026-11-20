import { defineConfig, devices } from '@playwright/test';

// Takes the screenshots that pnpm visual-diff compares (tests/visual/). It serves the prerendered site in
// VISUAL_SITE and saves a screenshot of each page in VISUAL_OUT. tests/visual/diff.sh sets both, once for
// each of the two builds it compares.
// https://playwright.dev/docs/test-configuration
const port = 4174;
const site = process.env.VISUAL_SITE ?? '.output/public';

export default defineConfig({
  testDir: 'tests/visual',
  outputDir: 'test-results/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',

  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },

  // the same viewports as the accessibility scans (playwright.config.ts)
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: `pnpm exec sirv "${site}" --port ${port} --quiet`,
    url: `http://localhost:${port}`,
    // a server that is already running may be serving the other build
    reuseExistingServer: false,
  },
});
