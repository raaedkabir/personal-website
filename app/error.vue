<template>
  <div>
    <TheNavbar />
    <main>
      <div class="container center-center">
        <h1>Welp, looks like this page doesn't exist.</h1>
        <p>If you're lost the button will help guide your way. Don't resist the button.</p>
        <AppButton link to="/">Go to Home Page</AppButton>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from '@/components/Layout/TheNavbar.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';

defineProps({
  error: {
    type: Object,
    default: null,
  },
});

useHead({
  title: 'Missing Page',
});
</script>

<style lang="scss" scoped>
main {
  display: grid;
  align-items: center;
}

h1 {
  font: inherit;
}

.center-center {
  height: 100%;
  font-size: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  a {
    align-self: flex-end;
    margin-top: 2rem;
  }
}
</style>
