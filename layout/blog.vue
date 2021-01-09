<template>
  <div>
    <TheNavbar />
    <main class="container pt-12">
      <div class="top">
        <p class="date">{{ date }}</p>
        <h1 class="title heading__secondary text-center">{{ title }}</h1>
      </div>
      <img :src="require('@/assets/images/works' + img)" alt="cover image" />
      <div class="write-up">
        <div class="write-up__container">
          <slot name="content" />
        </div>
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
  padding-top: 4rem;
  padding-bottom: 8rem;
  font-size: 1.8rem;
  text-align: center;
  display: flex;
  justify-content: center;

  // &__container {
  //   width: 85%;
  // }
}

canvas {
  max-width: 60%;
  margin: 3rem 0;
}
</style>
