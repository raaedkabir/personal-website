<template>
  <nuxt-link v-if="to" :to="to" v-bind="$attrs">
    <slot />
  </nuxt-link>
  <a v-else v-bind="$attrs">
    <slot />
  </a>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    // internal route, rendered as a NuxtLink instead of a plain anchor
    to: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  position: relative;
  text-decoration: none;
  color: inherit;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 2px #47ffff solid;
    transform: translate(5%, 0);
    transition: all 250ms ease-in-out;
  }

  &:hover::after {
    transform: translate(5%, 1px) scale(1.1);
    border-bottom: 3px #47ffff solid;
  }
}
</style>
