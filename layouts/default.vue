<template>
  <div>
    <TheNavbar />
    <Nuxt />
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/Layout/TheNavbar.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';

export default {
  components: {
    TheNavbar,
    TheFooter,
  },
};
</script>
