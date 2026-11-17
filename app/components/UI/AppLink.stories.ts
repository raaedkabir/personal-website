import type { Meta, StoryObj } from '@storybook-vue/nuxt';

import AppLink from './AppLink.vue';

const meta = {
  component: AppLink,
  args: { default: 'All Three.js demos' },
  argTypes: {
    default: { control: 'text', description: 'The link text' },
  },
} satisfies Meta<typeof AppLink>;

export default meta;
type Story = StoryObj<typeof meta>;

// a route on the site, rendered as a NuxtLink
export const Internal: Story = {
  args: { to: '/works/threejs' },
};

// anything else is a plain anchor, which gets every attribute passed to AppLink
export const External: Story = {
  args: { href: 'https://blog.datawrapper.de/', target: '_blank', rel: 'noopener noreferrer', default: 'Datawrapper' },
};

// as the blog posts use it, in a sentence
export const InText: Story = {
  args: { href: 'https://pudding.cool/', target: '_blank', rel: 'noopener noreferrer', default: 'The Pudding' },
  decorators: [() => ({ template: '<p>My favourite data stories come from <story /> and its visual essays.</p>' })],
};
