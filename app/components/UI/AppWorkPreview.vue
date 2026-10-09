<template>
  <nuxt-link v-if="!outside" :to="to">
    <img class="bg" :src="require('@/assets/images' + imgSrc)" :alt="imgAlt" />
    <slot />
  </nuxt-link>
  <a v-else :href="to" target="_blank" rel="noopener noreferrer">
    <img class="bg" :src="require('@/assets/images' + imgSrc)" :alt="imgAlt" />
    <slot />
  </a>
</template>

<script>
// import AppButton from '@/components/UI/AppButton.vue';

export default {
  components: {
    // AppButton,
  },

  props: {
    to: {
      type: String,
      required: true,
    },
    imgSrc: {
      type: String,
      required: true,
    },
    imgAlt: {
      type: String,
      required: true,
    },
    outside: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  padding: 0 2rem 2rem;
  text-decoration: none;
  color: inherit;

  .bg {
    margin-left: auto;
    width: 90%;
  }

  button {
    margin-left: 15%;
  }
}
</style>
