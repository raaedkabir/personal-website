import type { Meta, StoryObj } from '@storybook-vue/nuxt';

import AppPrism from './AppPrism.vue';

const meta = {
  component: AppPrism,
  args: {
    lang: 'javascript',
    default: 'let genres = [];\ndata.forEach((d) => genres.push(d.Genre));\ngenres = [...new Set(genres)];',
  },
  argTypes: {
    default: { control: 'text', description: 'The code to highlight' },
    // the grammars AppPrism loads
    lang: { control: 'select', options: ['javascript', 'clike', 'css', 'markup'] },
  },
  render: (args) => ({
    components: { AppPrism },
    setup: () => ({ args }),
    // the blog posts wrap it in a <pre> for Prism's code block styles. AppPrism highlights its slot
    // once, when it mounts, so it's remounted whenever the code or the language changes.
    template: `
      <pre :class="'language-' + args.lang"><AppPrism :key="args.lang + args.default" :lang="args.lang">{{ args.default }}</AppPrism></pre>`,
  }),
} satisfies Meta<typeof AppPrism>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
