<template>
  <div>
    <header class="header page-content" :class="{ active: displayNav }">
      <nuxt-link to="/" class="header__logo">
        <img ref="logo" src="@/assets/images/logo.svg" alt="logo" />
      </nuxt-link>
      <div ref="toggleNav" class="header__toggle-nav" tabindex="0" @click="toggleNav" @keydown.enter="toggleNav">
        <span class="header__toggle-nav--icon">&nbsp;</span>
      </div>
    </header>
    <nav class="navbar" :class="{ active: displayNav }">
      <ul>
        <li @click.prevent="toggleNav">
          <nuxt-link class="btn--nav" to="/">Home</nuxt-link>
        </li>
        <li @click.prevent="toggleNav">
          <nuxt-link class="btn--nav" to="/about">About Me</nuxt-link>
        </li>
        <li @click.prevent="toggleNav">
          <nuxt-link class="btn--nav" to="/works">My Works</nuxt-link>
        </li>
        <li @click.prevent="toggleNav">
          <nuxt-link class="btn--nav" to="/resume">Resume</nuxt-link>
        </li>
        <li @click.prevent="scroll('.home--contact')">
          <nuxt-link class="btn--nav" to="/">Contact</nuxt-link>
        </li>
      </ul>
      <ParticlesJS />
    </nav>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import ParticlesJS from '@/components/UI/ParticlesJS.vue';

export default {
  components: {
    ParticlesJS,
  },

  computed: {
    displayNav() {
      return this.$store.state.displayNav;
    },
  },

  methods: {
    ...mapMutations(['toggleNav']),

    scroll(selector) {
      this.toggleNav();

      // scroll after one second
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    },
  },

  //   mounted() {
  //     // animate in
  //     TweenMax.from(this.$refs.logo, 2, {
  //       delay: 1.5,
  //       x: -20,
  //       opacity: 0,
  //       ease: Expo.easeInOut
  //     });
  //
  //     TweenMax.from(this.$refs.toggleNav, 1, {
  //       delay: 2.5,
  //       x: 20,
  //       opacity: 0,
  //       rotation: 90,
  //       ease: Expo.easeInOut
  //     });
  //   }
};
</script>
