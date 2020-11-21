<template>
  <section class="loader">
    <div class="container">
      <h2 class="heading__secondary">Loader Effects</h2>
      <div class="showcase__loader">
        <div class="loader-effect--1">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
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

h2 {
  color: #000;
}

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

    $elements: 20;
    @for $i from 0 to $elements {
      span:nth-child(#{$i + 1}) {
        transform: rotate(calc(18deg * #{$i}));

        &::before {
          animation-delay: calc(0.1s * #{$i});
        }
      }
    }

    span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

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
