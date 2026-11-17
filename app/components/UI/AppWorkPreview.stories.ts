import type { Meta, StoryObj } from '@storybook-vue/nuxt';

import AppButton from './AppButton.vue';
import AppWorkPreview from './AppWorkPreview.vue';

// a card in the home page's list of works (Pages/Home/Works.vue), which lays them out in a flex row
const meta = {
  component: AppWorkPreview,
  args: {
    to: '/blog/fourier-series',
    imgSrc: '/blog/fourier-series/heading.png',
    imgAlt: 'preview of fourier series visualization',
  },
  argTypes: {
    imgSrc: { description: 'A path under assets/images/blog or assets/images/works' },
  },
  decorators: [() => ({ template: '<div style="display: flex; max-width: 48rem"><story /></div>' })],
} satisfies Meta<typeof AppWorkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// the card's title and button go in its slot
const renderCard =
  (title: string, button: string): Story['render'] =>
  (args) => ({
    components: { AppButton, AppWorkPreview },
    setup: () => ({ args, title, button }),
    template: `
      <AppWorkPreview v-bind="args">
        <h2 class="heading__secondary">{{ title }}</h2>
        <AppButton>{{ button }}</AppButton>
      </AppWorkPreview>`,
  });

// a page on the site
export const Internal: Story = {
  render: renderCard('Fourier Series Visualization', 'write-up'),
};

// another site, opened in a new tab
export const Outside: Story = {
  args: { outside: true, to: 'https://comecommune.netlify.app/', imgSrc: '/works/ComeCommune.png', imgAlt: 'website hero area' },
  render: renderCard('ComeCommune Blog Site', 'project'),
};
