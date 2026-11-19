import type { Meta, StoryObj } from '@storybook-vue/nuxt';

import AppButton from './AppButton.vue';

const meta = {
  component: AppButton,
  args: { default: 'Get in touch' },
  argTypes: {
    default: { control: 'text', description: 'The button text' },
  },
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Flat: Story = {
  args: { flat: true },
};

// a NuxtLink styled as a button
export const Link: Story = {
  args: { link: true, to: '/works', default: 'See All Works' },
};

// a link in the navigation menu, drawn in the menu itself
export const Nav: Story = {
  args: { link: true, to: '/about', nav: true, default: 'About Me' },
  decorators: [() => ({ template: '<nav class="navbar active"><ul><li><story /></li></ul></nav>' })],
  // the menu is fixed to the right edge of the viewport, so docs pages show it in a frame of its own
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '320px' } } },
};
