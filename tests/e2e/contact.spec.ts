import type { Page } from '@playwright/test';
import { CONTACT_API, expect, mockApi, test } from './support/test';

const message = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  subject: 'A new project',
  message: 'Could you build a website for me?',
};

async function fillIn(page: Page, fields: Partial<typeof message>) {
  const form = page.locator('#contact');
  const labels: Record<keyof typeof message, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    subject: 'Message Subject',
    message: 'Drop your message here...',
  };
  for (const [field, value] of Object.entries(fields)) {
    await form.getByLabel(labels[field as keyof typeof message], { exact: true }).fill(value);
  }
}

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sends the message, confirms it and clears the form', async ({ page }) => {
    const sent: unknown[] = [];
    await mockApi(page, CONTACT_API, (body) => {
      sent.push(body);
      return { json: { message: 'sent' } };
    });

    await fillIn(page, message);
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.locator('#contact .checkmark:not(.error)')).toBeVisible();
    expect(sent).toEqual([message]);

    // after a moment the form is ready for the next message
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
    await expect(page.locator('#contact').getByLabel('First Name')).toHaveValue('');
    await expect(page.locator('#contact').getByLabel('Drop your message here...')).toHaveValue('');
  });

  test('only sends once the required fields are filled in correctly', async ({ page }) => {
    let requests = 0;
    await mockApi(page, CONTACT_API, () => {
      requests++;
      return { json: { message: 'sent' } };
    });
    const send = page.getByRole('button', { name: 'Send' });

    await send.click();
    const firstName = page.locator('#contact').getByLabel('First Name');
    expect(await firstName.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);

    await fillIn(page, { ...message, email: 'not-an-email' });
    await send.click();
    const email = page.locator('#contact').getByLabel('Email');
    expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);

    // the last name is the only optional field
    await fillIn(page, { email: message.email, lastName: '' });
    await send.click();
    await expect(page.locator('#contact .checkmark:not(.error)')).toBeVisible();
    expect(requests).toBe(1);
  });

  test.describe('when sending fails', () => {
    // the form logs the failed request
    test.use({ expectedIssues: /console\.error: .*status code 500/ });

    test('shows an error and keeps what was typed', async ({ page }) => {
      await mockApi(page, CONTACT_API, () => ({ status: 500, json: { message: 'failed' } }));

      await fillIn(page, message);
      await page.getByRole('button', { name: 'Send' }).click();

      await expect(page.locator('#contact .checkmark.error')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
      await expect(page.locator('#contact').getByLabel('Message Subject')).toHaveValue(message.subject);
    });
  });
});
