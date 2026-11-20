import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test, type Locator, type Page, type PageScreenshotOptions, type TestInfo } from '@playwright/test';
import { isWebGLDemo, prerenderedRoutes } from '../pages';
import { screenshotName } from './names';

// Screenshots every page of a prerendered site, for pnpm visual-diff (diff.sh) to compare two builds. Unchanged
// pages have to come out pixel for pixel the same in both, so each page runs on a paused clock with seeded
// randomness, and canvases and embeds, which can't be made repeatable, are greyed out.

const siteDir = resolve(process.env.VISUAL_SITE ?? '.output/public');
const outDir = resolve(process.env.VISUAL_OUT ?? 'visual-diff/current');

if (!existsSync(siteDir)) {
  throw new Error(`${siteDir} is missing. Run pnpm generate first, or use pnpm visual-diff, which does.`);
}

// the page's clock starts here and stays paused while the page loads
const startTime = new Date('2026-01-01T00:00:00Z').getTime();
// then jumps forward this far, longer than any intro animation (the home hero's takes 5s)
const settleTime = 10_000;
// in steps this long. Each step runs due timers and animation frames once, so a canvas sketch draws 40
// frames rather than the 600 that page.clock.runFor() would (too slow on the phone's denser canvas). Steps stay
// under 500ms, beyond which GSAP's lag smoothing would count a step as 33ms and stall the home hero's intro.
const settleStep = 250;

const isWebFont = (url: URL) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

test.beforeEach(async ({ page, baseURL }) => {
  // as in the accessibility scans, no analytics hits, Stripe PaymentIntents or embeds from test runs.
  // Google Fonts can load, since the pages look different without them.
  await page.route((url) => url.origin !== baseURL && !isWebFont(url), (route) => route.abort());

  await page.clock.install({ time: startTime });
  await page.clock.pauseAt(startTime + 1_000);

  // seed Math.random, so that random layouts (the About page's chart) come out the same every time
  await page.addInitScript(() => {
    // mulberry32
    let state = 0x9e3779b9;
    Math.random = () => {
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
});

async function load(page: Page, route: string) {
  if (isWebGLDemo(route)) {
    await page.addInitScript(() => {
      window.requestAnimationFrame = () => 0;
    });
  }
  await page.goto(route, { waitUntil: 'networkidle' });
  await settle(page);
}

// run the page's timers and animation frames forward, then wait for anything still loading
async function settle(page: Page) {
  for (let elapsed = 0; elapsed < settleTime; elapsed += settleStep) {
    await page.clock.fastForward(settleStep);
  }
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => [...document.images].every((image) => image.complete))).toBe(true);
}

// CSS animations and transitions run in real time, not on the page's clock, so stop them for good: finite ones
// jump to their end, infinite ones (the loaders on /works/components) pause at their start. The screenshot option
// animations: 'disabled' does the same but restarts them after each screenshot, and the loaders' glowing, rotated
// dots then come out slightly different from run to run.
async function stopAnimations(page: Page) {
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getTiming().iterations === Infinity) {
        animation.pause();
        animation.currentTime = 0;
      } else {
        animation.finish();
      }
    }
  });
}

async function screenshot(page: Page, testInfo: TestInfo, name: string, options: PageScreenshotOptions = {}) {
  await stopAnimations(page);
  const screenshotOptions: PageScreenshotOptions = {
    fullPage: true,
    // the phone's screenshots in CSS pixels, not at the Pixel 7's 2.625 device pixels per CSS pixel
    scale: 'css',
    // drawn by scripts every frame (particles.js, p5, three.js, vega) or loaded from other sites
    mask: [page.locator('canvas, iframe')],
    maskColor: '#808080',
    ...options,
  };

  // in case something is still moving, take screenshots until two in a row match
  let previous = await page.screenshot(screenshotOptions);
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await page.screenshot(screenshotOptions);
    if (current.equals(previous)) {
      const file = join(outDir, testInfo.project.name, `${name}.png`);
      mkdirSync(join(outDir, testInfo.project.name), { recursive: true });
      writeFileSync(file, current);
      return;
    }
    previous = current;
  }
  throw new Error(`${name} kept changing between screenshots`);
}

for (const route of prerenderedRoutes(siteDir)) {
  test(route, async ({ page }, testInfo) => {
    await load(page, route);
    await screenshot(page, testInfo, screenshotName(route));
  });
}

// Pages in a state that takes a click. The open menu and dialog sit over the page, so these take the viewport
// rather than the full page. A build without the control (the base may predate it) gets no screenshot, and the
// report shows the screenshot as new or removed.
async function clickIfPresent(control: Locator) {
  test.skip(!(await control.isVisible()), 'this build has no such control');
  await control.click();
}

test('/works with the menu open', async ({ page }, testInfo) => {
  await load(page, '/works');
  await clickIfPresent(page.locator('.header__toggle-nav'));
  await settle(page);
  await screenshot(page, testInfo, screenshotName('/works', 'menu-open'), { fullPage: false });
});

test('/about with the coffee dialog open', async ({ page }, testInfo) => {
  await load(page, '/about');
  await clickIfPresent(page.getByRole('button', { name: 'click here' }));
  await settle(page);
  await screenshot(page, testInfo, screenshotName('/about', 'coffee-dialog-open'), { fullPage: false });
});
