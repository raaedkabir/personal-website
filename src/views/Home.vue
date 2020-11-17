<template>
  <main>
    <home-hero />
    <section class="home--about">
      <div class="container">
        <p>
          As a <span>web developer</span> based in <span>Toronto</span> I like to create engaging
          online experiences for users.
        </p>
        <a href="#">Learn More About Me</a>
      </div>
    </section>
    <section class="home__works">
      <div class="container">
        <h2 class="heading__secondary">My Works <span>_</span></h2>
        <div class="home__works--container one">
          <img src="@/assets/images/works/motor_dashboard.png" alt="" class="home__works--image" />
          <p class="title">Motor Dashboard</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
        <div class="home__works--container two">
          <img
            src="https://source.unsplash.com/featured/?computer"
            alt=""
            class="home__works--image"
          />
          <p class="title">Lorem Ipsum</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
        <div class="home__works--container three">
          <img
            src="https://source.unsplash.com/featured/?project"
            alt=""
            class="home__works--image"
          />
          <p class="title">Lorem Ipsum</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
        <div class="home__works--container four">
          <img
            src="https://source.unsplash.com/featured/?internet"
            alt=""
            class="home__works--image"
          />
          <p class="title">Lorem Ipsum</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
        <div class="home__works--container five">
          <img src="https://source.unsplash.com/featured/?tech" alt="" class="home__works--image" />
          <p class="title">Lorem Ipsum</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
        <div class="home__works--container six">
          <img src="https://source.unsplash.com/featured/?wifi" alt="" class="home__works--image" />
          <p class="title">Lorem Ipsum</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
        <div class="home__works--container seven">
          <img
            src="https://source.unsplash.com/featured/?laptop"
            alt=""
            class="home__works--image"
          />
          <p class="title">Lorem Ipsum</p>
          <p class="details">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam laborum sint, dolor
            numquam nam in error minus. Distinctio tempore vero maxime veniam voluptates deserunt,
            quod magni cupiditate officiis incidunt.
          </p>
        </div>
      </div>
    </section>
    <section class="home--contact">
      <p>Have an awesome project and need a developer?</p>
      <p>Hit me up and <a href="contact.html">let's chat</a>!</p>
    </section>
    <the-footer />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HomeHero from '@/components/Home/Hero.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';

@Options({
  components: {
    HomeHero,
    TheFooter
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/abstracts/_mixins.scss';

.home--about {
  padding: 10rem 0;
}

.home__works {
  padding-bottom: 10rem;
  background: var(--clr-dark);

  &--container > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  & .container {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(5, 1fr);

    & h2 {
      grid-column: 1 / -1;
    }

    & .one {
      grid-row: 2;
      grid-column: 1 / -1;
    }

    & .two {
      grid-row: 3;
      grid-column: 1 / 3;
      height: 30rem;
    }

    & .three {
      grid-row: 3 / 4;
      grid-column: 3 / 6;
    }

    & .four {
      grid-row: 4 / 5;
      grid-column: 1 / 3;
    }

    & .five {
      grid-row: 4;
      grid-column: 3 / 4;
    }

    & .six {
      grid-row: 4 / 6;
      grid-column: 4 / 6;
    }

    & .seven {
      grid-row: 5;
      grid-column: 1 / 4;
    }
  }
}

.home--contact {
  padding: 5rem 0;
}

// page
.home--about {
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

.home__works {
  &--container {
    position: relative;
    cursor: pointer;
  }
  &--image {
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
      top: 3rem;
      left: 3rem;
      opacity: 0;
      font-size: 2.5rem;
      font-weight: 300;
      pointer-events: none;
      transition: all 0.5s;

      & + p.details {
        position: absolute;
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
}

.home--contact {
  text-align: center;
  background: #ef0d33;

  p:first-child {
    font-size: 4rem;
    font-weight: 100;
    margin-bottom: 2rem;
  }

  p:last-child {
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
      transform: translate(5px, 1px) scaleX(1.1);
      border-bottom: 3px #47ffff solid;
    }
  }
}
</style>
