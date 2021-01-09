<template>
  <main class="wrapper">
    <svg class="background" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1009.8 705.5">
      <polygon points="1009.8 0 504.1 704.2 1009.8 704.2 1009.8 0" />
      <polygon fill="#fcfafa" points="0 705.5 979.6 705.5 0 23.5 0 705.5" />
    </svg>
    <div class="components">
      <my-buttons class="pt-12" />

      <my-images />

      <my-texts />

      <my-menus />

      <my-loaders />

      <my-footer />
    </div>
  </main>
</template>

<script>
import MyButtons from '@/components/Pages/Components/Buttons.vue';
import MyImages from '@/components/Pages/Components/Images.vue';
import MyTexts from '@/components/Pages/Components/Texts.vue';
import MyMenus from '@/components/Pages/Components/Menus.vue';
import MyLoaders from '@/components/Pages/Components/Loaders.vue';
import MyFooter from '@/components/Pages/Components/Footer.vue';

export default {
  components: {
    MyButtons,
    MyImages,
    MyTexts,
    MyMenus,
    MyLoaders,
    MyFooter,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .components {
    position: relative;
    padding-bottom: 300px;
  }
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  background: #eee;
}
</style>
