<template>
  <section class="home--hero">
    <div ref="bg" class="bg"></div>
    <div ref="leftBar" class="left-bar"></div>
    <div ref="rightBar" class="right-bar"></div>
    <div ref="content" class="content">
      <AutoTyper
        :data-text="[' Hello Visitor', ' Hello Stranger', ' Hello Alien', ' Hello There!']"
        style="padding: 0"
      />
      <h2 style="padding: 1rem 0">My name is <span>Raaed Kabir</span>.</h2>
      <p>I'm a Web Developer and Programmer.</p>
    </div>
    <ul ref="social" class="contact">
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
  </section>
</template>

<script>
import AutoTyper from '@/components/AutoTyper.vue';
import { TweenMax, Expo, Power4 } from 'gsap';

export default {
  components: {
    AutoTyper,
  },

  mounted() {
    TweenMax.to(this.$refs.bg, 5, {
      opacity: 0,
      zIndex: -1,
      ease: Expo.easeInOut,
    });

    TweenMax.from(this.$refs.leftBar, 2, {
      opacity: 0,
      width: 0,
      ease: Expo.easeInOut,
    });

    TweenMax.from(this.$refs.content, 2, {
      delay: 2,
      opacity: 0,
      width: 0,
      ease: Expo.easeInOut,
    });

    TweenMax.from(this.$refs.social.children, 2, {
      delay: 2,
      opacity: 0,
      x: 30,
      ease: Expo.easeInOut,
      stagger: 0.2,
    });

    TweenMax.from(this.$refs.rightBar, 3, {
      delay: 1,
      opacity: 0,
      width: 0,
      left: '-100vw',
      ease: Power4.easeOut,
      onComplete() {
        this._targets[0].style.opacity = 0;
      },
    });
  },
};
</script>
