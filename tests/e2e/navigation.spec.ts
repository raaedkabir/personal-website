import type { Page } from '@playwright/test';
import { expect, test } from './support/test';

const menu = (page: Page) => page.locator('nav.navbar');
const menuToggle = (page: Page) => page.locator('.header__toggle-nav');

test.describe('menu', () => {
  // the open menu covers the toggle, so it closes with Escape, a click outside or one of its links
  test('opens from the toggle and closes with Escape or a click outside', async ({ page }) => {
    await page.goto('/resume');
    await expect(menu(page)).toBeHidden();

    await menuToggle(page).click();
    await expect(menu(page)).toBeVisible();
    await expect(menu(page).getByRole('link', { name: 'About Me' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu(page)).toBeHidden();

    await menuToggle(page).click();
    await expect(menu(page)).toBeVisible();
    await page.mouse.click(10, 300);
    await expect(menu(page)).toBeHidden();
  });

  test('works from the keyboard and keeps focus inside while open', async ({ page }) => {
    await page.goto('/resume');

    await menuToggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(menu(page)).toBeVisible();

    // the first link gets focus once the menu has slid in, and Tab wraps around inside the menu
    const first = menu(page).getByRole('link', { name: 'Home' });
    const last = menu(page).getByRole('link', { name: 'Contact' });
    await expect(first).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(last).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();

    // closing hands focus back to the toggle
    await page.keyboard.press('Escape');
    await expect(menu(page)).toBeHidden();
    await expect(menuToggle(page)).toBeFocused();
  });

  const links = [
    { name: 'Home', path: '/', title: 'Welcome! | Raaed Kabir' },
    { name: 'About Me', path: '/about', title: 'About Me | Raaed Kabir' },
    { name: 'My Works', path: '/works', title: 'My Works | Raaed Kabir' },
    { name: 'Resume', path: '/resume', title: 'Resume | Raaed Kabir' },
  ];

  for (const link of links) {
    test(`"${link.name}" goes to ${link.path}`, async ({ page }) => {
      await page.goto(link.path === '/resume' ? '/works' : '/resume');

      await menuToggle(page).click();
      await menu(page).getByRole('link', { name: link.name }).click();

      await expect(page).toHaveURL(link.path);
      await expect(page).toHaveTitle(link.title);
      await expect(menu(page)).toBeHidden();
    });
  }

  test('"Contact" goes to the contact form on the home page', async ({ page }) => {
    await page.goto('/resume');

    await menuToggle(page).click();
    await menu(page).getByRole('link', { name: 'Contact' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('#contact')).toBeInViewport();
  });
});

test('the logo goes to the home page', async ({ page }) => {
  await page.goto('/works');
  await page.getByRole('link', { name: 'logo' }).click();
  await expect(page).toHaveURL('/');
});

test('social links open the profiles in a new tab', async ({ page }) => {
  const profiles = [
    { name: 'LinkedIn Link', href: 'https://www.linkedin.com/in/raaedkabir' },
    { name: 'GitHub Link', href: 'https://github.com/raaedkabir' },
    { name: 'CodePen Link', href: 'https://codepen.io/raaedkabir' },
  ];

  // in the header on most pages, in the hero on the home page
  for (const { path, container } of [
    { path: '/resume', container: 'header' },
    { path: '/', container: '.home--hero' },
  ]) {
    await page.goto(path);
    for (const profile of profiles) {
      const link = page.locator(container).getByRole('link', { name: profile.name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', profile.href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  }
});

test('the back-to-top button shows up after scrolling down and scrolls back up', async ({ page }) => {
  // it is part of the default layout, which the blog posts don't use
  await page.goto('/');
  const button = page.locator('.top-of-site-link');
  await expect(button).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(button).toBeVisible();

  await button.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(button).toBeHidden();
});

test.describe('home page', () => {
  test('links to the about and works pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Learn More About Me' }).click();
    await expect(page).toHaveURL('/about');
    // let the page finish loading its data before leaving, or Nuxt logs the cancelled request as an error
    await expect(page.getByRole('heading', { name: /About Me/, level: 1 })).toBeVisible();

    await page.goto('/');
    await page.getByRole('link', { name: 'See All Works' }).click();
    await expect(page).toHaveURL('/works');
    await expect(page.getByRole('heading', { name: /My Works/, level: 1 })).toBeVisible();
  });
});

test.describe('works page', () => {
  const projects = [
    { name: 'Fourier Series Visualization', path: '/blog/fourier-series' },
    { name: 'Data Exploration', path: '/blog/video-game-data-exploration' },
    { name: 'My Development Process', path: '/blog/development-process' },
    { name: 'Generative Art', path: '/blog/generative-art' },
    { name: 'Pure CSS Components', path: '/works/components' },
  ];

  for (const project of projects) {
    test(`"${project.name}" opens ${project.path}`, async ({ page }) => {
      await page.goto('/works');
      await page.getByRole('link', { name: project.name }).click();
      await expect(page).toHaveURL(project.path);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    });
  }

  test('external projects open in a new tab', async ({ page }) => {
    await page.goto('/works');
    for (const { name, href } of [
      { name: 'ComeCommune Blog Site', href: 'https://comecommune.netlify.app/' },
      { name: 'Motor Dashboard', href: 'https://raaedkabir-assets.s3.amazonaws.com/Motor+Dashboard+Demo.mp4' },
    ]) {
      const link = page.getByRole('link', { name });
      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });
});
