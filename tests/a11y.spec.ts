import { existsSync, readdirSync } from 'node:fs';
import { join, sep } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type TestInfo } from '@playwright/test';

const outputDir = join(import.meta.dirname, '../.output/public');

if (!existsSync(outputDir)) {
  throw new Error(`${outputDir} is missing. Run pnpm generate first, or use pnpm test:a11y, which does.`);
}

// every page nuxt generate prerendered (about/index.html is served at /about), plus the 404 page
const routes = [
  ...readdirSync(outputDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.split(sep).at(-1) === 'index.html')
    .map((file) => `/${file.split(sep).slice(0, -1).join('/')}`)
    .sort(),
  '/404.html',
];

// pages whose content fades in, and how long that takes (the home hero's GSAP intro)
const introDurations: Record<string, number> = { '/': 5_000 };

// WCAG 2.2 A and AA, plus axe's best practices
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function expectNoViolations(axe: AxeBuilder, testInfo: TestInfo) {
  const results = await axe.withTags(tags).analyze();
  await testInfo.attach('axe-results.json', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });

  // a short summary diffs better than the full results, which are attached to the report
  const violations = results.violations.map(({ id, impact, help, nodes }) => ({
    id,
    impact,
    help,
    targets: nodes.map(({ target }) => target.join(' ')),
  }));
  expect(violations).toEqual([]);
}

test.beforeEach(async ({ page, baseURL }) => {
  // keep the scans offline: no analytics hits, Stripe PaymentIntents or third-party embeds from test runs
  await page.route((url) => url.origin !== baseURL, (route) => route.abort());
});

for (const route of routes) {
  test(`${route} has no axe violations`, async ({ page }, testInfo) => {
    const intro = introDurations[route];
    if (intro) await page.clock.install();
    await page.goto(route, { waitUntil: 'networkidle' });
    // fast-forward through the intro, so axe checks the settled page instead of skipping
    // text that is still invisible or misjudging the contrast of half-faded text
    if (intro) await page.clock.runFor(intro);

    await expectNoViolations(new AxeBuilder({ page }), testInfo);
  });
}

test('the open navigation menu has no axe violations', async ({ page }, testInfo) => {
  await page.goto('/works', { waitUntil: 'networkidle' });
  await page.locator('.header__toggle-nav').click();
  // wait for the menu to finish sliding in
  await expect(page.locator('nav.navbar')).toBeInViewport({ ratio: 1 });

  // only the menu, since the page behind it is dimmed by the mask
  await expectNoViolations(new AxeBuilder({ page }).include('nav.navbar'), testInfo);
});
