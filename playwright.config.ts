import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, defineConfig, devices } from '@playwright/test';

// https://playwright.dev/docs/test-configuration
const port = 4173;
const isCI = !!process.env.CI;

// Claude Code cloud sessions come with one Chromium build pre-installed. @playwright/test is pinned to the
// version that matches it; if the two drift apart, launch the pre-installed build rather than failing
// (functional tests still work, but screenshots may then differ slightly from the committed baselines).
const preinstalledChromium = '/opt/pw-browsers/chromium';
const executablePath =
  !fs.existsSync(chromium.executablePath()) && fs.existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

// Hosts configure font rendering (hinting, antialiasing) and system fonts differently, which changes every glyph in a
// screenshot. The browser gets its own font configuration instead, so the pixels are the same everywhere.
const fontconfigFile = fileURLToPath(new URL('./tests/e2e/fonts/fonts.conf', import.meta.url));

export default defineConfig({
  testDir: 'tests',
  // screenshots, one per test, project and name, next to the spec that takes them
  snapshotPathTemplate: '{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // a missing screenshot fails in CI instead of being written there
  updateSnapshots: isCI ? 'none' : 'missing',
  reporter: isCI ? [['list'], ['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    baseURL: `http://localhost:${port}`,
    // a trace per failed screenshot test adds up to hundreds of MB in CI, where a failure is retried once anyway
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'en-CA',
    timezoneId: 'America/Toronto',
    // the PWA service worker would answer requests before the network stubs in tests/e2e/support/test.ts see them
    serviceWorkers: 'block',
    // Screenshots are compared pixel for pixel, but Skia picks its drawing code by CPU (AVX-512 in cloud sessions, AVX2
    // on GitHub's runners), which shifts antialiasing. The full Chromium build (not the default headless shell) can
    // be told to use the same code on every CPU, and without the GPU everything goes through that code.
    channel: 'chromium',
    launchOptions: {
      executablePath,
      args: ['--disable-skia-runtime-opts', '--disable-gpu'],
      env: { ...process.env, FONTCONFIG_FILE: fontconfigFile },
    },
  },

  // the phone layout swaps in the toggle-only header, so both viewports are tested
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  // serve the prerendered site (pnpm test:e2e and pnpm test:a11y run nuxt generate first)
  webServer: {
    command: `pnpm exec sirv .output/public --port ${port} --quiet`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !isCI,
  },
});
