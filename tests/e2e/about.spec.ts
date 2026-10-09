import { STRIPE_API, expect, mockApi, test } from './support/test';

test.describe('buy me a coffee', () => {
  test('opens the payment form for the chosen amount and closes again', async ({ page }) => {
    const amounts: unknown[] = [];
    await mockApi(page, STRIPE_API, (amount) => {
      amounts.push(amount);
      return { json: { clientSecret: 'pi_test_secret' } };
    });
    await page.goto('/about');

    await page.getByText('click here').click();
    const dialog = page.locator('.dialog');
    await expect(dialog.getByRole('heading', { name: 'Buy Me a Coffee' })).toBeVisible();
    await expect(dialog.locator('#payment-form')).toHaveCount(0);

    await dialog.getByRole('button', { name: '$ 5', exact: true }).click();
    await expect(dialog.getByRole('button', { name: '$ 5', exact: true })).toHaveClass(/selected/);
    await expect(dialog.getByText('Card details (Stripe is stubbed in tests)')).toBeVisible();
    // Pay stays disabled until card details are entered
    await expect(dialog.getByRole('button', { name: 'Pay' })).toBeDisabled();
    expect(amounts).toEqual([500]);

    // picking another amount asks for a new payment intent
    await dialog.getByRole('button', { name: '$ 20', exact: true }).click();
    await expect.poll(() => amounts).toEqual([500, 2000]);

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
  });

  test('closes when clicking outside of it', async ({ page }) => {
    await page.goto('/about');

    await page.getByText('click here').click();
    const dialog = page.locator('.dialog');
    await expect(dialog).toBeVisible();

    await page.locator('.modal .mask').click({ position: { x: 10, y: 200 } });
    await expect(dialog).toBeHidden();
  });
});
