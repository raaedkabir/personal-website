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
  text-align: center;

  .credit {
    margin-top: -3rem;
  }

  * {
    padding-top: 2rem;
  }

  h2 {
    padding-top: 4rem;
  }

  h2 + p {
    padding-top: 0;
    margin-top: -3rem;
  }

  img {
    max-width: 60%;
    margin-left: auto;
    margin-right: auto;
  }

  canvas {
    max-width: 60%;
  }
}
</style>
