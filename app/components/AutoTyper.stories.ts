import type { Meta, StoryObj } from '@storybook-vue/nuxt';

import AutoTyper from './AutoTyper.vue';

// the greeting in the home page's hero (Pages/Home/Hero.vue)
const meta = {
  component: AutoTyper,
  args: { dataText: [' Hello Visitor', ' Hello Stranger', ' Hello Alien', ' Hello There!'] },
  render: (args) => ({
    components: { AutoTyper },
    setup: () => ({ args }),
    // AutoTyper types its texts once, starting 2.5 seconds after it mounts, so it's remounted when they change
    template: '<AutoTyper :key="args.dataText.join()" v-bind="args" />',
  }),
} satisfies Meta<typeof AutoTyper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
