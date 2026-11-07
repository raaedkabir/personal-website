<template>
  <button :type="type" :class="variant">
    <slot />
  </button>
</template>

<script setup>
// the original FormButton
defineProps({
  type: {
    type: String,
    default: 'submit',
  },
  // primary (cyan) or secondary (plum), the two button colours the original used
  variant: {
    type: String,
    default: 'primary',
  },
});
</script>

<style lang="scss" scoped>
button {
  margin-top: var(--spacer);
  padding: 0.5em 1.5em;
  border: none;
  border-radius: 3px;
  color: #fff;
  font: inherit;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 2px 2px 0 rgb(156 39 176 / 14%),
    0 3px 1px -2px rgb(156 39 176 / 20%),
    0 1px 5px 0 rgb(156 39 176 / 12%);
  transition:
    all 0.2s cubic-bezier(0.4, 0, 1, 1),
    background 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow:
      0 14px 26px -12px rgb(156 39 176 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%),
      0 8px 10px -5px rgb(156 39 176 / 20%);
  }

  &:active {
    transform: translateY(2px);
  }

  &:focus-visible {
    outline: 3px solid var(--clr-focus);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.primary {
  background: var(--clr-primary-600);

  &:hover {
    background: var(--clr-primary-800);
  }
}

.secondary {
  background: var(--clr-secondary-400);

  &:hover {
    background: var(--clr-secondary-700);
  }
}
</style>
