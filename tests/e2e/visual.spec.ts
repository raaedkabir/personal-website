import { routes, type SiteRoute } from './support/routes';
import { CONTACT_API, STRIPE_API, expect, mockApi, openSettled, settle, test } from './support/test';

// Each page is compared with the screenshot committed under __snapshots__/visual.spec.ts/. When a change is
// meant to alter how a page looks, update them with `pnpm test:e2e:update` and review the new images.

// The screenshots are recorded on Linux, like CI; other systems render fonts differently and would overwrite
// them with images CI can't match.
test.skip(process.platform !== 'linux', 'screenshots are only compared on Linux');

for (const route of routes) {
  test(`${route.name} looks the same`, async ({ page }) => {
    await openSettled(page, route);
    await expect(page).toHaveScreenshot(`${route.name}.png`, {
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
  await expect(page).toHaveScreenshot('menu-open.png');
});

test('coffee dialog looks the same', async ({ page }) => {
  await mockApi(page, STRIPE_API, () => ({ json: { clientSecret: 'pi_test_secret' } }));
  await openSettled(page, routes.find((route) => route.path === '/about')!);
  await page.getByText('click here').click();
  await page.locator('.dialog').getByRole('button', { name: '$ 5', exact: true }).click();
  await expect(page.locator('#payment-form')).toBeVisible();
  await settle(page, 1000);
  await expect(page).toHaveScreenshot('coffee-dialog.png');
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
  await expect(form).toHaveScreenshot('contact-sent.png');
});

test.describe('error page', () => {
  test.use({ expectedIssues: /NUXT_E1005/ });

  test('looks the same', async ({ page }) => {
    const missing: SiteRoute = { name: 'error', path: '/404.html', title: '', heading: '' };
    await openSettled(page, missing);
    await expect(page).toHaveScreenshot('error.png', { fullPage: true });
  });
});
