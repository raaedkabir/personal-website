import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Turns every Storybook story into a test that renders it in Chromium, runs its play function
// and checks it with axe (the Accessibility addon, set up in .storybook/preview.ts).
// https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: fileURLToPath(new URL('.storybook', import.meta.url)),
            // Storybook's 1280px wide desktop viewport, as wide as the page scans' desktop one. Without it
            // stories are tested at 1200px, which is in the site's tablet breakpoint.
            initialGlobals: { viewport: { value: 'desktop' } },
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
