<template>
  <section class="loader">
    <div class="container">
      <h1 class="heading__primary">Loader Effects</h1>
      <div class="showcase__loader">
        <div class="loader-effect--1">
          <span style="--i: 1"></span>
          <span style="--i: 2"></span>
          <span style="--i: 3"></span>
          <span style="--i: 4"></span>
          <span style="--i: 5"></span>
          <span style="--i: 6"></span>
          <span style="--i: 7"></span>
          <span style="--i: 8"></span>
          <span style="--i: 9"></span>
          <span style="--i: 10"></span>
          <span style="--i: 11"></span>
          <span style="--i: 12"></span>
          <span style="--i: 13"></span>
          <span style="--i: 14"></span>
          <span style="--i: 15"></span>
          <span style="--i: 16"></span>
          <span style="--i: 17"></span>
          <span style="--i: 18"></span>
          <span style="--i: 19"></span>
          <span style="--i: 20"></span>
        </div>
        <div class="loader-effect--2">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

.showcase {
  &__loader {
    display: grid;
    gap: 3rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    place-items: center;
    grid-auto-rows: 10rem;

    & > * {
      z-index: 15;
    }

    @include respond(tab-port) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @include respond(phone) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

section.loader {
  color: black;
  // background: white;
}

.loader-effect {
  &--1 {
    position: relative;
    width: 6rem;
    height: 6rem;
    animation: loader1color 10s linear infinite;

    span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotate(calc(18deg * var(--i)));

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        // 10% of container width/height
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: #00ff0a;
        box-shadow: 0 0 1rem #00ff0a, 0 0 2rem #00ff0a, 0 0 4rem #00ff0a, 0 0 6rem #00ff0a,
          0 0 8rem #00ff0a, 0 0 10rem #00ff0a;
        animation: loader1ring 2s linear infinite;
        animation-delay: calc(0.1s * var(--i));
      }
    }
  }

  &--2 {
    display: flex;

    span {
      height: 10rem;
      width: 2rem;
      margin: 0 0.5rem;
      background: #63d1f4;
      animation: loader2 2.5s ease-in-out infinite;

      // there are 8 span children in the marup
      $children: 8;
      @for $i from 0 to $children {
        &:nth-child(#{$i + 1}) {
          animation-delay: calc(0.2s * #{$i});
        }
      }
    }
  }
}

@keyframes loader2 {
  0% {
    box-shadow: 0 0 0 rgba($color: #000000, $alpha: 0.5);
    opacity: 0;
    transform: translateX(-1.5rem) scale(1);
  }
  50% {
    box-shadow: 0 0.5rem 1rem rgba($color: #000000, $alpha: 0.5);
    opacity: 1;
    transform: translateX(0) scale(1.2);
  }

  100% {
    box-shadow: 0 0 0 rgba($color: #000000, $alpha: 0.5);
    opacity: 0;
    transform: translateX(1.5rem) scale(1);
  }
}

@keyframes loader1color {
  from {
    filter: hue-rotate(0);
  }

  to {
    filter: hue-rotate(360deg);
  }
}

@keyframes loader1ring {
  0% {
    transform: scale(1);
  }

  80% {
    transform: scale(0);
  }
}
</style>
