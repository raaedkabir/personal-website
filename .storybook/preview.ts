import type { Preview } from '@storybook-vue/nuxt';

import { axeTags } from '../tests/axe';

const preview: Preview = {
  parameters: {
    a11y: {
      // fail a story's test on any violation: in the sidebar's test widget, pnpm test:stories and CI
      test: 'error',
      // check the same rules as the page scans
      options: { runOnly: { type: 'tag', values: axeTags } },
    },
    // the site's background (--clr-dark), which its components are drawn for. The global styles already
    // set it on the page, but the docs pages draw their stories on white.
    backgrounds: {
      options: { site: { name: 'Site', value: '#1e1e20' } },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'site' },
  },
  // a docs page for every component, with its props, events and slots
  tags: ['autodocs'],
};

export default preview;
