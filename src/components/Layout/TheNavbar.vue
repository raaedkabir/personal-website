<template>
  <header class="header page-content" :class="{ active: displayNav }">
    <router-link to="/" class="header__logo">
      <img src="@/assets/images/logo.svg" alt="logo" ref="logo" />
    </router-link>
    <div class="header__toggle-nav" @click="toggleNav" @keydown.enter="toggleNav" ref="toggleNav" tabindex="0">
      <span class="header__toggle-nav--icon">&nbsp;</span>
    </div>
  </header>
  <nav class="navbar" :class="{ active: displayNav }">
    <particles-js />
    <ul>
      <li @click.prevent="toggleNav">
        <router-link class="btn--nav" to="/">Home</router-link>
      </li>
      <li><a class="btn--nav" href="#">About Me</a></li>
      <li><a class="btn--nav" href="#">My Works</a></li>
      <li><a class="btn--nav" href="#">Portfolio</a></li>
      <li
        @click.prevent="
          scroll();
          toggleNav();
        "
      >
        <router-link class="btn--nav" to="/">Contact</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ParticlesJs from '../ParticlesJS.vue';
import { TweenMax, Expo } from 'gsap';

@Options({
  emits: ['togglenav'],
  components: {
    ParticlesJs
  },
  watch: {
    focus: {
      handler: 'checkFocus',
      immediate: true
    }
  }
})
export default class Home extends Vue {
  $refs!: {
    logo: HTMLElement;
    toggleNav: HTMLElement;
  };

  displayNav = false;
  focus: EventTarget | null = null;

  toggleNav() {
    this.displayNav = !this.displayNav;
    this.$emit('togglenav', this.displayNav);
  }

  scroll() {
    const el = document.getElementById('contact');

    // scroll after one second
    setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

  checkFocus(e: Element | null) {
    const navLinks = [...document.querySelectorAll('.btn--nav')];
    // check if active
    if (!e) {
      this.displayNav = false;
      this.$emit('togglenav', this.displayNav);
    } else if (navLinks.indexOf(e) !== -1 && e !== null) {
      this.displayNav = true;
      this.$emit('togglenav', this.displayNav);
    } else {
      this.displayNav = false;
      this.$emit('togglenav', this.displayNav);
    }
  }

  mounted() {
    document.addEventListener(
      'focusin',
      () => {
        this.checkFocus(document.activeElement);
      },
      true
    );

    // animate in
    TweenMax.from(this.$refs.logo, 2, {
      delay: 1.5,
      x: -20,
      opacity: 0,
      ease: Expo.easeInOut
    });

    TweenMax.from(this.$refs.toggleNav, 1, {
      delay: 2.5,
      x: 20,
      opacity: 0,
      rotation: 90,
      ease: Expo.easeInOut
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/abstracts/_mixins.scss';

// putting the whole page in a div so it can translate with the nav
.page-content {
  transition: all 0.5s ease;

  &.active {
    transform: translateX(calc(-1 * var(--navbar-size)));

    @include respond(phone) {
      transform: translateX(calc(-1 * var(--navbar-size-small)));
    }
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

.header {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 4rem 10rem;

  @include respond(tab-port) {
    padding: 2rem 5rem;
  }

  &__logo {
    font-weight: 700;
    color: #fff;
    font-size: 2em;
    text-transform: uppercase;
    letter-spacing: 2px;
    width: 5rem;
    height: 5rem;
    filter: contrast(200%) saturate(200%) sepia(100%) invert(100%);
  }

  &__toggle-nav {
    width: 5rem;
    height: 5rem;
    background: transparent;
    cursor: pointer;

    &--icon {
      position: relative;
      margin-top: 2.5rem;
      margin-left: 1rem;

      &,
      &::before,
      &::after {
        width: 3rem;
        height: 2px;
        background: #fff;
        display: inline-block;
        transition: all 0.2s;
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
      }

      &::before {
        top: -1rem;
      }

      &::after {
        top: 1rem;
      }
    }

    &:hover &--icon::before,
    &:focus &--icon::before {
      top: -1.2rem;
    }

    &:hover &--icon::after,
    &:focus &--icon::after {
      top: 1.2rem;
    }

    .page-content.active &--icon {
      background: transparent;

      &::before {
        top: 0;
        transform: rotate(45deg);
      }

      &::after {
        top: 0;
        transform: rotate(-45deg);
      }
    }
  }
}

.navbar {
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(var(--navbar-size));
  width: var(--navbar-size);
  height: 100vh;
  background-image: linear-gradient(45deg, var(--clr-secondary), var(--clr-secondary-2));
  display: grid;
  place-items: center;
  transition: all 0.5s ease;
  z-index: -1;

  @include respond(phone) {
    transform: translateX(var(--navbar-size-small));
    width: var(--navbar-size-small);
  }

  &.active {
    transform: translateX(0);
    z-index: initial;
  }

  ul {
    z-index: 101;

    li {
      list-style: none;

      a {
        color: var(--clr-text);
        text-decoration: none;
        display: inline-block;
        font-size: 2em;
        font-weight: 600;
        text-transform: uppercase;
      }
    }
  }
}
</style>
