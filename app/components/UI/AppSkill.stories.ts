import type { Meta, StoryObj } from '@storybook-vue/nuxt';

import AppSkill from './AppSkill.vue';

// a bar in the About page's list of skills (Pages/About/Skills.vue)
const meta = {
  component: AppSkill,
  args: { name: 'JavaScript', proficiency: '80%' },
} satisfies Meta<typeof AppSkill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
