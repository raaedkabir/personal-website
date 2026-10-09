import fs from 'node:fs';
import { chromium, defineConfig, devices } from '@playwright/test';

// https://playwright.dev/docs/test-configuration
const port = 4173;
const isCI = !!process.env.CI;

// tests/e2e/run.sh (pnpm test:e2e) first screenshots the base commit's build, served from E2E_SITE_DIR, so that
// visual.spec.ts can compare this branch's pages with it
const recordingBaseline = !!process.env.VISUAL_BASELINE;
const siteDir = process.env.E2E_SITE_DIR ?? '.output/public';

// Claude Code cloud sessions come with one Chromium build pre-installed. @playwright/test is pinned to the
// version that matches it; if the two drift apart, launch the pre-installed build rather than failing.
const preinstalledChromium = '/opt/pw-browsers/chromium';
const executablePath =
  !fs.existsSync(chromium.executablePath()) && fs.existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

export default defineConfig({
  testDir: 'tests',
  // only the screenshots are taken of the base commit
  testMatch: recordingBaseline ? '**/e2e/visual.spec.ts' : undefined,
  // the base commit's screenshots, one per test, project and name, in a git-ignored folder next to the spec
  snapshotPathTemplate: '{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // write screenshots while recording the base commit, and never otherwise
  updateSnapshots: recordingBaseline ? 'all' : 'none',
  reporter: recordingBaseline
    ? [['list']]
    : [
        ['list'],
        ...(isCI ? [['github'] as const] : []),
        ['html', { open: 'never' }],
        ['./tests/e2e/support/visual-reporter.ts'],
      ],

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    baseURL: `http://localhost:${port}`,
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'en-CA',
    timezoneId: 'America/Toronto',
    // the PWA service worker would answer requests before the network stubs in tests/e2e/support/test.ts see them
    serviceWorkers: 'block',
    launchOptions: { executablePath },
  },

  // the phone layout swaps in the toggle-only header, so both viewports are tested
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  // serve the prerendered site (pnpm test:e2e and pnpm test:a11y run nuxt generate first)
  webServer: {
    command: `pnpm exec sirv "${siteDir}" --port ${port} --quiet`,
    url: `http://localhost:${port}`,
    // a server left running from another build would be tested instead of this one, so fail if the port is taken
    reuseExistingServer: false,
  },
});
