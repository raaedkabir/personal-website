<template>
  <section class="home__works">
    <div class="container">
      <h2 class="heading__section">My Works <span>_</span></h2>
      <div class="wrapper">
        <div class="home__works--container one">
          <img src="@/assets/images/works/motor_dashboard.png" alt="" class="home__works--image" />
          <p class="title">Motor Dashboard</p>
          <p class="details">
            Made with Vue.
          </p>
        </div>
        <div class="home__works--container two">
          <img src="@/assets/images/works/tech_site.png" alt="" class="home__works--image" />
          <p class="title">Tech Website Design</p>
          <p class="details">
            Designed in Photoshop.
          </p>
        </div>
        <div class="home__works--container three">
          <img src="@/assets/images/works/lorem_image.jpg" alt="" class="home__works--image" />
          <p class="title">Lorem Ipsum</p>
          <!-- <p class="details">
            Lorem.
          </p> -->
        </div>
        <div class="home__works--container four">
          <img src="@/assets/images/works/lorem_image.jpg" alt="" class="home__works--image" />
          <p class="title">Lorem Ipsum</p>
          <!-- <p class="details">
            Lorem.
          </p> -->
        </div>
        <div class="home__works--container five">
          <a href="/project_generator_site/index.html">
            <img
              src="@/assets/images/works/project_generator_site.jpg"
              alt=""
              class="home__works--image"
            />
            <p class="title">HTML & CSS Website</p>
            <!-- <p class="details">
              Made in HTML & CSS.
            </p> -->
          </a>
        </div>
        <div class="home__works--container six">
          <router-link to="/components">
            <img
              src="@/assets/images/works/component_library.png"
              alt=""
              class="home__works--image"
            />
            <p class="title">Pure CSS Components</p>
          </router-link>
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
.home__works {
  padding-top: 5rem;
  padding-bottom: 10rem;
  background: var(--clr-dark);

  &--container {
    position: relative;
    cursor: pointer;
  }

  &--image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: all 0.5s;

    &:hover {
      opacity: 0.5;
    }

    &:hover + p.title,
    &:hover + p.title + p.details {
      opacity: 1;
      transition: all 1s;
    }

    & + p.title {
      position: absolute;
      color: white;
      top: 3rem;
      left: 3rem;
      opacity: 0;
      font-size: 2.5rem;
      font-weight: 300;
      pointer-events: none;
      transition: all 0.5s;

      & + p.details {
        position: absolute;
        color: white;
        top: 10rem;
        left: 3rem;
        right: 3rem;
        opacity: 0;
        font-size: 2rem;
        font-weight: 400;
        pointer-events: none;
        transition: all 0.5s;
      }
    }
  }

  & .wrapper {
    display: grid;
    overflow: hidden;
    width: 100%;
    gap: 2rem;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      'one   one  one  one'
      'two   two  five six'
      'three four five six';

    & h2 {
      grid-column: 1 / -1;
    }

    & .one {
      grid-area: one;
    }

    & .two {
      grid-area: two;
    }

    & .three {
      grid-area: three;
    }

    & .four {
      grid-area: four;
    }

    & .five {
      grid-area: five;
    }

    & .six {
      grid-area: six;
    }
  }
}
</style>
