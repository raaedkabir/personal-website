<template>
  <a v-bind="$attrs">
    <slot />
  </a>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
a {
  position: relative;
  text-decoration: none;
  color: inherit;

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
