import type { Meta, StoryObj } from '@storybook-vue/nuxt';
import { expect, fn, waitFor } from 'storybook/test';

import AppInput from './AppInput.vue';

// the fields of the home page's contact form (Pages/Home/Contact.vue)
const meta = {
  component: AppInput,
  // type, placeholder and rows aren't props: AppInput passes them through to the field
  args: { id: 'email', label: 'Email', type: 'email', placeholder: 'Email', 'onUpdate:modelValue': fn() },
  // room for the label, which floats above the field
  decorators: [() => ({ template: '<div style="padding-top: 4rem; max-width: 40rem"><story /></div>' })],
} satisfies Meta<typeof AppInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// the label stays hidden while the placeholder shows
export const Empty: Story = {};

export const Filled: Story = {
  args: { id: 'first-name', label: 'First Name', type: 'text', placeholder: 'First Name', modelValue: 'Raaed' },
};

export const TextArea: Story = {
  args: {
    id: 'message',
    label: 'Drop your message here...',
    placeholder: 'Drop your message here...',
    type: undefined,
    textArea: true,
    rows: 3,
  },
};

// typing emits the value for v-model and floats the label above the field
export const Typing: Story = {
  args: { id: 'subject', label: 'Message Subject', type: 'text', placeholder: 'Message Subject' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('textbox'), 'Hello');

    await expect(args['onUpdate:modelValue']).toHaveBeenLastCalledWith('Hello');
    await waitFor(() => expect(canvas.getByText('Message Subject', { selector: 'label' })).toBeVisible());
  },
};
