<template>
  <main>
    <home-hero />
    <section class="home--about">
      <div class="container">
        <p>
          As a <span>web developer</span> based in <span>Toronto</span> I like to create engaging online experiences for
          users.
        </p>
        <a href="#">Learn More About Me</a>
      </div>
    </section>
    <home-works />
    <section class="home--contact">
      <p>Have an awesome project and need a developer?</p>
      <p>Hit me up and <a>let's chat</a>!</p>
      <contact />
    </section>
    <the-footer />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HomeHero from '@/components/Home/Hero.vue';
import HomeWorks from '@/components/Home/Works.vue';
import Contact from '@/components/Contact.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';

@Options({
  components: {
    HomeHero,
    HomeWorks,
    Contact,
    TheFooter
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/abstracts/_mixins.scss';

.home--about {
  padding-top: 10rem;
  text-align: right;
  font-size: 1.8rem;
  background: var(--clr-dark);

  span {
    color: var(--clr-primary);
  }

  a {
    display: inline-block;
    margin-top: 2rem;
    font-weight: 600;
    font-size: 1.4rem;
    text-decoration: none;
    color: var(--clr-dark);
    padding: 1rem 2.5rem;
    background: var(--clr-text);
    transition: all 0.2s;

    &:hover {
      color: var(--clr-text);
      background: var(--clr-dark);
      outline: 2px solid var(--clr-text);
    }
  }
}

.home--contact {
  padding: 5rem 0;
  text-align: center;
  background: #ef0d33;

  p:first-child {
    font-size: 4rem;
    font-weight: 100;
    margin-bottom: 2rem;
  }

  p:first-child + p {
    font-size: 2rem;
    font-weight: 300;
  }

  a {
    position: relative;
    text-decoration: none;
    color: inherit;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 2px #47ffff solid;
      transform: translate(5px, 0);
      transition: all 250ms ease-in-out;
    }

    &:hover::after {
      transform: translate(5px, 1px) scale(1.1);
      border-bottom: 3px #47ffff solid;
    }
  }
}
</style>
