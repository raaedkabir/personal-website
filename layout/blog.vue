<template>
  <div>
    <TheNavbar />
    <main class="container pt-12">
      <div class="top">
        <p class="date">{{ date }}</p>
        <h1 class="title heading__secondary text-center">{{ title }}</h1>
      </div>
      <img :src="require('@/assets/images/blog' + img)" alt="cover image" />
      <div class="write-up">
        <slot name="content" />
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/Layout/TheNavbar.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';

export default {
  components: {
    TheNavbar,
    TheFooter,
  },

  props: {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },

  head() {
    return {
      title: this.title,
    };
  },
};
</script>

<style lang="scss" scoped>
.top {
  padding-bottom: 2rem;
  text-align: center;

  .date {
    display: inline-block;
    text-transform: uppercase;
  }

  .title {
    margin-top: 2rem;
  }
}

.write-up {
  padding-bottom: 8rem;
  font-size: 1.8rem;
  max-width: 700px;
  margin: 0 auto;

  code {
    background: #4d4d4d;
    outline: 1px solid #4d4d4d;
  }

  blockquote {
    > * {
      margin-left: 9px;
    }

    border-left: 2px solid var(--clr-primary);
  }

  .credit {
    margin-top: -1.5rem;
    text-align: center;
  }

  button.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  * {
    margin-top: 2rem;
  }

  h2 {
    margin-top: 4rem;
  }

  h2 + p {
    margin-top: -1.5rem;

    @include respond(tab-land) {
      margin-top: -0.5rem;
    }
  }

  img {
    max-width: 100%;
  }

  canvas {
    max-width: 100%;
  }
}
</style>
