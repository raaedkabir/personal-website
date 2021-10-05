<template>
  <div>
    <header ref="header" class="header">
      <nuxt-link to="/" class="header__logo">
        <img ref="logo" src="@/assets/images/logo.svg" alt="logo" />
      </nuxt-link>
      <div class="contact-container">
        <ul v-if="currentRouteName !== 'index' || scrolling" class="contact">
          <li>
            <a href="https://www.linkedin.com/in/raaedkabir" target="_blank" rel="noopener noreferrer nofollow">
              <img src="@/assets/images/social_icons/linkedin.svg" alt="LinkedIn Link" />
            </a>
          </li>
          <li>
            <a href="https://github.com/raaedkabir" target="_blank" rel="noopener noreferrer nofollow">
              <img src="@/assets/images/social_icons/github.svg" alt="GitHub Link" />
            </a>
          </li>
          <li>
            <a href="https://codepen.io/raaedkabir" target="_blank" rel="noopener noreferrer nofollow">
              <img src="@/assets/images/social_icons/codepen.svg" alt="CodePen Link" />
            </a>
          </li>
        </ul>
        <div ref="toggleNav" class="header__toggle-nav" tabindex="0" @click="toggle" @keydown.enter="toggle">
          <span class="header__toggle-nav--icon" />
        </div>
      </div>
    </header>
    <div class="mask" :class="{ active: displayNav }" />
    <nav ref="navbar" class="navbar" :class="{ active: displayNav }">
      <ul>
        <li @click="closeNav">
          <AppButton link to="/" nav>Home</AppButton>
        </li>
        <li @click="closeNav">
          <AppButton link to="/about" nav>About Me</AppButton>
        </li>
        <li @click="closeNav">
          <AppButton link to="/works" nav>My Works</AppButton>
        </li>
        <li @click="closeNav">
          <AppButton link to="/resume" nav>Resume</AppButton>
        </li>
        <li @click="scroll('.home--contact')">
          <AppButton link to="/" nav>Contact</AppButton>
        </li>
      </ul>
      <ParticlesJS />
    </nav>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
// import gsap from 'gsap';

import ParticlesJS from '@/components/ParticlesJS.vue';

export default {
  components: {
    ParticlesJS,
  },

  data() {
    return {
      previouslyFocused: null,
      firstItem: null,
      lastItem: null,
      event: null,
      scrolling: false,
    };
  },

  computed: {
    displayNav() {
      return this.$store.state.displayNav;
    },
    currentRouteName() {
      return this.$route.name;
    },
  },

  watch: {
    displayNav: {
      handler() {
        if (this.displayNav) {
          // capture previously focused element and set focus to navbar
          this.previouslyFocused = document.activeElement;
          setTimeout(() => {
            if (this.event instanceof KeyboardEvent) {
              this.firstItem.focus();
            }
          }, 500);
        } else {
          setTimeout(() => {
            this.previouslyFocused.focus();
          }, 500);
        }
      },
      // immediate: true,
    },
  },

  mounted() {
    // chane style on scroll
    window.addEventListener('scroll', this.onScroll);

    // close nav when clicked outside
    document.addEventListener('click', this.close);

    // close nav when Escape key is pressed
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.displayNav) this.closeNav();
    });

    // tabtrap within navbar
    this.$refs.navbar.addEventListener('keydown', this.tabTrap);

    // get all focusable elements
    const focusableElements = [
      ...this.$refs.navbar.querySelectorAll(
        'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls], summary, [tabindex^="0"], [tabindex^="1"], [tabindex^="2"], [tabindex^="3"], [tabindex^="4"], [tabindex^="5"], [tabindex^="6"], [tabindex^="7"], [tabindex^="8"], [tabindex^="9"]'
      ),
    ];
    this.firstItem = focusableElements[0];
    this.lastItem = focusableElements[focusableElements.length - 1];
  },

  beforeDestroy() {
    // chane style on scroll
    window.removeEventListener('scroll', this.onScroll);

    // close nav when clicked outside
    document.removeEventListener('click', this.close);

    // tabtrap within navbar
    this.$refs.navbar.removeEventListener('keydown', this.tabTrap);
  },

  methods: {
    ...mapMutations(['toggleNav', 'closeNav']),

    toggle(e) {
      this.event = e;
      this.toggleNav();
    },
    scroll(selector) {
      this.toggleNav();

      // scroll after one second
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    },

    close(e) {
      if (!this.$refs.navbar.contains(e.target) && !this.$refs.toggleNav.contains(e.target)) {
        this.closeNav();
      }
    },

    tabTrap(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // move backward with Shift
          if (document.activeElement === this.firstItem) {
            e.preventDefault();
            this.lastItem.focus();
          }
        } else if (!e.shiftKey) {
          // move forwards
          if (document.activeElement === this.lastItem) {
            e.preventDefault();
            this.firstItem.focus();
          }
        }
      }
    },

    onScroll() {
      const scroll = window.scrollY;

      const scrolling = this.$refs.header.classList.contains('scrolling');
      const scrolled = this.$refs.header.classList.contains('scrolled');

      if (scroll > 200 && !scrolling) {
        this.$refs.header.classList.add('scrolling');
        this.scrolling = true;
      } else if (!(scroll > 200) && scrolling) {
        this.$refs.header.classList.remove('scrolling');
        this.scrolling = false;
      }

      if (scroll > 350 && !scrolled) {
        this.$refs.header.classList.add('scrolled');
      } else if (!(scroll > 350) && scrolled) {
        this.$refs.header.classList.remove('scrolled');
      }
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

<style lang="scss" scoped>
.contact-container {
  display: flex;
}

.contact {
  display: flex;
  justify-content: center;
  margin-right: 2rem;

  li {
    list-style: none;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    a {
      display: grid;
      align-items: center;
      justify-items: center;
      place-items: center;
      width: 5rem;
      height: 5rem;
      text-decoration: none;
      border: 1px solid #fff;
      padding: 1rem;   

      img {
        filter: invert(1);
      }

      &:hover {
        background: #fff;

        img {
          filter: invert(0);
        }
      }
    }
  }
}
</style>