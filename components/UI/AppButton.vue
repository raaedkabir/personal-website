<template>
  <nuxt-link v-if="link" :to="to" :class="{ nav: nav, flat: flat }">
    <slot />
  </nuxt-link>
  <button v-else :class="{ flat: flat }">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    link: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '',
    },
    nav: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      required: false,
    },
  },

  watch: {
    link: {
      handler(value) {
        if (value && this.to === '') {
          // eslint-disable-next-line
          console.error('Path is Required for Links');
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
a,
button {
  display: inline-block;
  padding: 1rem 2.5rem;
  font-weight: 600;
  font-size: 1.4rem;
  text-decoration: none;
  border: none;
  outline: 2px solid transparent;
  outline-offset: -10px;
  color: var(--clr-dark);
  background: var(--clr-text);
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    color: var(--clr-text);
    background: var(--clr-dark);
    outline: 2px solid var(--clr-text);
    outline-offset: 0;
  }
}

.flat {
  color: var(--clr-text);
  background: transparent;
  outline-offset: 0;
  outline: 2px solid var(--clr-text);

  &:hover,
  &:focus {
    color: var(--clr-text);
    background: var(--clr-dark);
    outline: 2px solid var(--clr-text);
    outline-offset: 0;
  }
}

.nav {
  margin: 0.5rem;
  width: 100%;
  color: var(--clr-text);
  background: transparent;

  &:hover,
  &:focus {
    color: var(--clr-secondary);
    outline: 2px solid var(--clr-secondary);
    outline-offset: -5px;
    background: #fff;
  }
}
</style>
