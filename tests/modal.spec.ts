import { expect, test } from '@playwright/test';

// axe checks markup, not behaviour, so these drive the About page's coffee dialog (AppModal) instead

test.beforeEach(async ({ page, baseURL }) => {
  // as in a11y.spec.ts: no analytics hits or Stripe.js from test runs
  await page.route((url) => url.origin !== baseURL, (route) => route.abort());
  await page.goto('/about', { waitUntil: 'networkidle' });
});

test('the coffee dialog keeps keyboard focus inside and returns it on Escape', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'click here' });
  const dialog = page.getByRole('dialog', { name: 'Buy Me a Coffee' });
  const firstControl = dialog.getByRole('button', { name: '$ 1' });
  const lastControl = dialog.getByRole('button', { name: 'Close' });

  // opening it moves focus to the dialog
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeFocused();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');

  // Tab and Shift+Tab wrap around at either end
  await page.keyboard.press('Shift+Tab');
  await expect(lastControl).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(firstControl).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(lastControl).toBeFocused();

  // and a full lap, past the end and on round, never leaves it
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    await expect(dialog.locator(':focus')).toHaveCount(1);
  }

  // Escape closes it, and focus goes back to the button that opened it
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('the mask behind the coffee dialog covers the page, header included, and closes it on a click', async ({ page }) => {
  const dialog = page.getByRole('dialog', { name: 'Buy Me a Coffee' });

  await page.getByRole('button', { name: 'click here' }).click();
  await expect(dialog).toBeVisible();

  // a click where the menu button is lands on the mask: the dialog closes and the menu stays shut
  await page.locator('.header__toggle-nav').click({ force: true });
  await expect(dialog).toBeHidden();
  await expect(page.locator('nav.navbar')).not.toHaveClass(/active/);
});
