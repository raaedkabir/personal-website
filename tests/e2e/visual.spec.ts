import fs from 'node:fs';
import type { Locator, Page } from '@playwright/test';
import { readBaseline, recordingBaseline } from './support/baseline';
import { routes, type SiteRoute } from './support/routes';
import { CONTACT_API, STRIPE_API, expect, mockApi, openSettled, settle, test } from './support/test';

// Each screenshot is compared with the same screenshot of the commit this branch is based on, which
// `pnpm test:e2e` (tests/e2e/run.sh) takes first. A difference doesn't fail the test: it is listed at the end of
// the run, and the report shows the base's image (expected), this branch's (actual) and the changed pixels (diff).

// the base's own console errors and unstubbed requests aren't under test, only how it looks
if (recordingBaseline) test.use({ expectedIssues: /./ });

/** The line of a failed screenshot comparison that says how the images differ, if that is why it failed. */
function describeDifference(error: unknown) {
  // the call log after the message repeats intermediate comparisons, including those of a page that never settles
  const [message = ''] = String(error instanceof Error ? error.message : error).split('\nCall log:');
  return message
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('Expected an image') || / pixels \(ratio [\d.]+ of all image pixels\) are different/.test(line));
}

async function compareWithBase(target: Page | Locator, name: string, options: { fullPage?: boolean; mask?: Locator[] } = {}) {
  const testInfo = test.info();

  if (!recordingBaseline && !fs.existsSync(testInfo.snapshotPath(name, { kind: 'screenshot' }))) {
    const baseline = readBaseline();
    testInfo.annotations.push({
      type: 'no baseline',
      description: !baseline
        ? `${name}: the base commit hasn't been screenshotted; run pnpm test:e2e`
        : baseline.status === 'unavailable'
          ? `${name}: the base commit couldn't be screenshotted (${baseline.reason})`
          : `${name}: new on this branch, or it didn't render on the base commit`,
    });
    const image = await target.screenshot({ ...options, animations: 'disabled', caret: 'hide' });
    await testInfo.attach(name, { body: image, contentType: 'image/png' });
    return;
  }

  try {
    // while recording, this writes the base's screenshot
    await expect(target).toHaveScreenshot(name, options);
  } catch (error) {
    const difference = recordingBaseline ? undefined : describeDifference(error);
    // anything else, such as a page that never stops moving, is a real failure
    if (!difference) throw error;
    testInfo.annotations.push({ type: 'visual change', description: `${name}: ${difference}` });
  }
}

for (const route of routes) {
  test(`${route.name} looks the same`, async ({ page }) => {
    await openSettled(page, route);
    await compareWithBase(page, `${route.name}.png`, {
      fullPage: true,
      mask: (route.mask ?? []).map((selector) => page.locator(selector)),
    });
  });
}

const resume = routes.find((route) => route.path === '/resume')!;

test('open menu looks the same', async ({ page }) => {
  await openSettled(page, resume);
  await page.locator('.header__toggle-nav').click();
  await settle(page, 1000);
  // a few of the background particles don't land in the same place on every run; the links and gradient still count
  await page.addStyleTag({ content: '#particles-js canvas { visibility: hidden; }' });
  await compareWithBase(page, 'menu-open.png');
});

test('coffee dialog looks the same', async ({ page }) => {
  await mockApi(page, STRIPE_API, () => ({ json: { clientSecret: 'pi_test_secret' } }));
  await openSettled(page, routes.find((route) => route.path === '/about')!);
  await page.getByText('click here').click();
  await page.locator('.dialog').getByRole('button', { name: '$ 5', exact: true }).click();
  await expect(page.locator('#payment-form')).toBeVisible();
  await settle(page, 1000);
  await compareWithBase(page, 'coffee-dialog.png');
});

test('sent contact form looks the same', async ({ page }) => {
  await mockApi(page, CONTACT_API, () => ({ json: { message: 'sent' } }));
  await openSettled(page, routes.find((route) => route.path === '/')!);
  const form = page.locator('#contact');
  await form.getByLabel('First Name').fill('Ada');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByLabel('Message Subject').fill('A new project');
  await form.getByLabel('Drop your message here...').fill('Could you build a website for me?');
  await form.getByRole('button', { name: 'Send' }).click();
  await expect(form.locator('.checkmark')).toBeVisible();
  // the form resets two seconds after sending; stay short of that
  await settle(page, 1000);
  await compareWithBase(form, 'contact-sent.png');
});

test.describe('error page', () => {
  test.use({ expectedIssues: recordingBaseline ? /./ : /NUXT_E1005/ });

  test('looks the same', async ({ page }) => {
    const missing: SiteRoute = { name: 'error', path: '/404.html', title: '', heading: '' };
    await openSettled(page, missing);
    await compareWithBase(page, 'error.png', { fullPage: true });
  });
});
