<template>
  <the-navbar @togglenav="toggleNav" />
  <!-- <router-view v-slot="slot" class="page-content" :class="{ active: displayNav }"> -->
  <!-- <transition mode="out-in" :css="false" @enter="enter" @leave="leave"> -->
  <!-- <component :is="slot.Component" :key="$route.fullPath" /> -->
  <!-- </transition> -->
  <!-- </router-view> -->
  <router-view :class="['page-content', { active: displayNav }]" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TheNavbar from '@/components/Layout/TheNavbar.vue';

@Options({
  components: {
    TheNavbar
  }
})
export default class Home extends Vue {
  displayNav = false;

  toggleNav(e: boolean) {
    this.displayNav = e;
  }

  mounted() {
    // eslint-disable-next-line
    console.log('I wonder what under /secret 🤔.');
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/abstracts/_mixins.scss';

@import '@/assets/scss/vendors/_normalize.scss';

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

:root {
  --clr-dark: #1e1e20;
  --clr-grey: #c5c6c7;

  --clr-text: #fff;
  --clr-text-dark: #000;

  --clr-primary: #66fcf1;
  --clr-primary-1: #45a29e;
  --clr-primary-2: #1f2833;
  --clr-secondary: #59b1fe;
  --clr-secondary-2: #50c7e6;

  --navbar-size: 350px;
  --navbar-size-small: 300px;
}

::selection {
  background-color: #c3cfe2;
}

*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// setting 1rem to 10px
html {
  font-size: 62.5%;

  @include respond(tab-land) {
    font-size: 56.25%; // 1rem = 9px
  }

  @include respond(tab-port) {
    font-size: 50%; // 1rem = 8px
  }

  @include respond(big-desktop) {
    font-size: 75%; // 1rem = 12px
  }
}

body {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 1.6;
  min-height: 100vh;
  color: var(--clr-text);
}

img {
  max-width: 100%;
  display: block;
}

// container
.container {
  width: 100%;
  max-width: 960px;
  padding: 0 2rem;
  margin: 0 auto;

  @include respond(big-desktop) {
    max-width: 1140px;
  }
}

.heading__primary {
  font-size: 5rem;
  font-weight: 400;
  text-align: center;

  span {
    color: var(--clr-primary);
  }
}

.heading__secondary {
  padding: 0.5em;
  font-size: 3.8rem;
  font-weight: 100;
  text-align: center;
}

.heading__section {
  font-size: 3.8rem;
  font-weight: 400;

  & span {
    color: var(--clr-primary);
  }
}

.btn--nav {
  display: inline-block;
  padding: 1rem;
  margin: 0.5rem;
  width: 100%;
  border-radius: 5px;
  transition: all 0.2s;

  &:hover {
    color: var(--clr-secondary);
    background: #fff;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

// if someone disabled animations on their device
// https://web.dev/prefers-reduced-motion/
// on Windows:
// Show animations in Windows: Disabled
// in Ease of Access Display Settings
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
}
</style>
