import type { Meta, StoryObj } from '@storybook-vue/nuxt';
import { expect, fn } from 'storybook/test';

import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';

const meta = {
  component: AppModal,
  args: {
    open: true,
    title: 'Buy Me a Coffee',
    default: 'Pick a size and pay by card. All prices in CAD.',
    onClose: fn(),
  },
  argTypes: {
    default: { control: 'text', description: 'The dialog body' },
  },
  // the dialog is fixed to the middle of the viewport, so docs pages show it in a frame of its own
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '420px' } } },
} satisfies Meta<typeof AppModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// AppModal doesn't close itself: Escape, the Close button and the mask emit close, and the parent sets open
export const Open: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // it takes focus when it opens, so Escape reaches it
    await expect(canvas.getByRole('dialog', { name: 'Buy Me a Coffee' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledOnce();

    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  },
};

// the header and actions slots replace the title and the Close button
export const CustomSlots: Story = {
  render: (args) => ({
    components: { AppButton, AppModal },
    setup: () => ({ args }),
    template: `
      <AppModal v-bind="args">
        <template #header><h1 class="heading__section">Thank <span>you</span>!</h1></template>
        <p>Your payment went through. Enjoy the coffee!</p>
        <template #actions><AppButton flat @click="args.onClose">Done</AppButton></template>
      </AppModal>`,
  }),
};
