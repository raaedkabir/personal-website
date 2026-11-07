<template>
  <div class="form-input" :class="{ focused, 'has-input': model?.length }">
    <label :for="id">{{ label }}</label>
    <div class="underline">
      <input :id="id" v-model="model" v-bind="$attrs" @focus="focused = true" @blur="focused = false" />
    </div>
  </div>
</template>

<script setup>
// the original FormInput, with a floating label
defineOptions({ inheritAttrs: false });

defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const model = defineModel({ type: String, default: '' });
const focused = ref(false);
</script>

<style lang="scss" scoped>
.form-input {
  position: relative;
  margin-top: var(--spacer);

  label {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--clr-neutral-500);
    font-size: 1.4rem;
    line-height: 1.42857;
    transform: translate(0, 24px);
    transform-origin: top left;
    transition:
      color 200ms cubic-bezier(0, 0, 0.2, 1),
      transform 200ms cubic-bezier(0, 0, 0.2, 1);
    pointer-events: none;
  }

  input {
    display: block;
    width: 100%;
    height: 1.1876em;
    padding: 6px 0 7px;
    box-sizing: content-box;
    border: none;
    background: none;
    color: currentColor;
    font: inherit;

    // the animated underline is the focus indicator
    &:focus {
      outline: none;
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--clr-neutral-500);
    }
  }

  .underline {
    position: relative;
    margin-top: 19px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    &::before {
      border-bottom: 1px solid var(--clr-neutral-500);
    }

    &::after {
      border-bottom: 2px solid var(--clr-primary-600);
      transform: scaleX(0);
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }
  }

  &.focused .underline::after {
    transform: scaleX(1);
  }

  &.focused label,
  &.has-input label {
    transform: translate(0, 1.5px) scale(0.9);
  }

  &.focused label {
    color: var(--clr-primary-600);
  }
}
</style>
