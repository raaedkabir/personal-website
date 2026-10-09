import { routes } from './support/routes';
import { expect, test } from './support/test';

// Pages known to scroll sideways on phones. Their test is expected to fail until the page is fixed;
// once it passes, Playwright reports it as an error so the entry gets removed.
const knownMobileOverflow: Record<string, string> = {
  about: 'the ring chart around the photo (#chart) is 1.5x the photo width and sticks out on the right',
  components: 'the menu demos from components/Pages/Components/Menus.vue are wider than a phone screen',
};

for (const route of routes) {
  test.describe(route.name, () => {
    test('loads without errors and shows its content', async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);
      await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible();
      for (const selector of route.ready ?? []) {
        await expect(page.locator(selector).first()).toBeAttached();
      }

      // the navbar and footer come from the layout and should be on every page
      await expect(page.getByRole('link', { name: 'logo' })).toBeVisible();
      await expect(page.getByText('Made with a lot of coffee.')).toBeVisible();

      // the page fixture fails the test if anything logged an error while it loaded
      await page.waitForLoadState('networkidle');
    });

    test('has no broken images', async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const broken = await page
        .locator('img')
        .evaluateAll((images: HTMLImageElement[]) =>
          images.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src')),
        );
      expect(broken).toEqual([]);
    });

    test('fits the viewport width', async ({ page, isMobile }) => {
      test.fail(isMobile && route.name in knownMobileOverflow, knownMobileOverflow[route.name]);

      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'the page scrolls sideways').toBeLessThanOrEqual(0);
    });
  });
}

test.describe('error page', () => {
  // Nuxt reports the missing route when the error page starts up
  test.use({ expectedIssues: /NUXT_E1005/ });

  // the hosting serves 404.html for unknown URLs; the local server doesn't, so it is opened directly
  test('shows the error page with a way back home', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page).toHaveTitle('Missing Page | Raaed Kabir');
    await expect(page.getByText("Welp, looks like this page doesn't exist.")).toBeVisible();

    await page.getByRole('link', { name: 'Go to Home Page' }).click();
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle('Welcome! | Raaed Kabir');
  });
});
