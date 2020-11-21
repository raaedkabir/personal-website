<template>
  <div class="wrapper">
    <teleport to="body">
      <svg
        class="background"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1009.8 705.5"
      >
        <polygon points="1009.8 0 504.1 704.2 1009.8 704.2 1009.8 0" />
        <polygon fill="#fcfafa" points="0 705.5 979.6 705.5 0 23.5 0 705.5" />
      </svg>
    </teleport>
    <div class="components">
      <my-buttons />

      <my-images />

      <my-texts />

      <my-menus />

      <my-loaders />

      <my-footer class="wavy-footer" />

      <!-- footer styles to overlap the wavy footer above -->
      <the-footer class="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MyButtons from '@/components/Components/Buttons.vue';
import MyImages from '@/components/Components/Images.vue';
import MyTexts from '@/components/Components/Texts.vue';
import MyMenus from '@/components/Components/Menus.vue';
import MyLoaders from '@/components/Components/Loaders.vue';
import MyFooter from '@/components/Components/Footer.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';

@Options({
  components: {
    MyButtons,
    MyImages,
    MyTexts,
    MyMenus,
    MyLoaders,
    MyFooter,
    TheFooter
  }
})
export default class Home extends Vue {}
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

  .wavy-footer {
    margin-bottom: 2rem;
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 1000;
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
