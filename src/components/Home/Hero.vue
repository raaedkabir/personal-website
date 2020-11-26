<template>
  <section class="home--hero">
    <div class="bg" ref="bg"></div>
    <div class="left-bar" ref="leftBar"></div>
    <div class="right-bar" ref="rightBar"></div>
    <div class="content" ref="content">
      <auto-typer />
      <h2 class="py-10">
        My name is <span>{{ firstName }}</span
        >.
      </h2>
      <p>I'm a Web Developer and Programmer.</p>
    </div>
    <ul class="contact" ref="social">
      <li>
        <a href="https://www.linkedin.com/in/raaedkabir/" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/images/social_icons/linkedin.svg" alt="LinkedIn Link" />
        </a>
      </li>
      <li>
        <a href="https://github.com/ToddLowell" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/images/social_icons/github.svg" alt="GitHub Link" />
        </a>
      </li>
      <li>
        <a href="https://codepen.io/toddlowell" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/images/social_icons/codepen.svg" alt="CodePen Link" />
        </a>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AutoTyper from '@/components/AutoTyper.vue';
import { TweenMax, Expo, Power4 } from 'gsap';

@Options({
  components: {
    AutoTyper
  }
})
export default class Home extends Vue {
  $refs!: {
    bg: HTMLElement;
    leftBar: HTMLElement;
    rightBar: HTMLElement;
    content: HTMLElement;
    social: HTMLElement;
  };

  firstName: string = process.env.VUE_APP_FIRST_NAME;

  mounted() {
    TweenMax.to(this.$refs.bg, 5, {
      opacity: 0,
      ease: Expo.easeInOut
    });

    TweenMax.from(this.$refs.leftBar, 2, {
      opacity: 0,
      width: 0,
      ease: Expo.easeInOut
    });

    TweenMax.from(this.$refs.content, 2, {
      delay: 2,
      opacity: 0,
      width: 0,
      ease: Expo.easeInOut
    });

    TweenMax.from(this.$refs.social.children, 2, {
      delay: 2,
      opacity: 0,
      x: 30,
      ease: Expo.easeInOut,
      stagger: 0.2
    });

    TweenMax.from(this.$refs.rightBar, 3, {
      delay: 1,
      opacity: 0,
      width: 0,
      left: '-100vw',
      ease: Power4.easeOut,
      onComplete() {
        this._targets[0].style.opacity = 0;
      }
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/abstracts/_mixins.scss';

.home--hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 10rem;
  overflow: hidden;

  @include respond(tab-port) {
    padding: 5rem;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #fff;
    z-index: -1;
  }

  .left-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 20rem;
    background: #000;
  }

  .right-bar {
    position: absolute;
    top: 0;
    right: -35rem;
    height: 100vh;
    width: 35rem;
    background-image: linear-gradient(45deg, var(--clr-secondary), var(--clr-secondary-2));
  }

  .content {
    position: absolute;
    top: 35%;
    width: 40%;
    background: var(--clr-mask);
    padding: 2rem;
    border-radius: 5px;
    white-space: nowrap;

    @include respond(tab-port) {
      width: 100%;
    }

    h1,
    h2 {
      span {
        color: var(--clr-primary);
      }
    }

    p {
      font-weight: 300;
      font-size: 1.8rem;
    }
  }
}

.home--hero {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -2;
    background-image: url('../../assets/images/hero.jpg');
    filter: brightness(80%) saturate(130%) sepia(10%) grayscale(40%);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .contact {
    position: absolute;
    display: flex;
    top: 35%;
    flex-direction: column;
    justify-content: center;
    right: 10.5rem;

    @include respond(tab-port) {
      top: initial;
      bottom: 100px;
      right: initial;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: row;
    }

    li {
      list-style: none;

      a {
        display: grid;
        place-items: center;
        width: 5rem;
        height: 5rem;
        text-decoration: none;
        border: 1px solid #fff;
        padding: 1rem;
        margin: 1rem 0 0;

        @include respond(tab-port) {
          margin: 0 0 0 1rem;
        }

        &:hover {
          background: #fff;
        }

        &:hover img {
          filter: invert(0);
        }

        img {
          filter: invert(1);
          // mix-blend-mode: difference;
        }
      }
    }
  }
}
</style>
