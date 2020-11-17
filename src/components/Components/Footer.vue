<template>
  <section class="wavy-footer showcase__footer">
    <div class="footer-effect--1"></div>
  </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

// grid alignment of components imported
.showcase {
  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-top: 250px;
  }
}

section.wavy-footer {
  // background: white;
}

.footer-effect {
  &--1 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    // according to image size
    height: 198px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3E%3Cstop stop-color='%2357BBC1' stop-opacity='.25' offset='0%25'/%3E%3Cstop stop-color='%23015871' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z' transform='matrix(-1 0 0 1 1600 0)'/%3E%3C/svg%3E%0A");
    background-size: 1600px 198px;
    opacity: 0.8;
    z-index: 10;

    animation: wavyFooter 10s linear infinite;

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      // bottom: 20px;
      bottom: 0;
      left: 0;
      background-image: inherit;
      background-size: inherit;
      filter: hue-rotate(70deg) saturate(5);
      opacity: 0.2;
      z-index: 9;
      animation: wavyFooter 10s linear infinite;
      animation-delay: -2s;
      animation-direction: reverse;
    }

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      // bottom: 15px;
      bottom: 0;
      left: 0;
      background-image: inherit;
      background-size: inherit;
      filter: hue-rotate(180deg);
      opacity: 0.5;
      z-index: 8;
      animation: wavyFooter 10s linear infinite;
      animation-delay: -5s;
      // animation-direction: reverse;
    }

    // &::before {
    //   content: '';
    //   width: 100%;
    //   height: 100%;
    //   background: url(../images/wave.png);
    //   filter: contrast(132%) brightness(136%) saturate(105%) hue-rotate(255deg);
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   opacity: 0.4;
    //   animation: wavyFooter 10s linear infinite;
    //   animation-direction: reverse;
    //   z-index: 1;
    // }

    // &::after {
    //   content: '';
    //   width: 100%;
    //   height: 100%;
    //   background: url(../images/wave.png);
    //   filter: contrast(125%) brightness(132%) saturate(130%) hue-rotate(137deg);
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   opacity: 0.4;
    //   animation: wavyFooter 25s linear infinite;
    //   z-index: 1;
    //   // animation-direction: reverse;
    // }
  }
}

@keyframes wavyFooter {
  from {
    background-position-x: 0;
  }

  to {
    background-position-x: -1600px;
  }
}
</style>
