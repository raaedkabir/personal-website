<template>
  <div>
    <TheNavbar />
    <main class="container pt-12">
      <div class="top">
        <p class="date">{{ date }}</p>
        <h1 class="title heading__secondary text-center">{{ title }}</h1>
      </div>
      <img :src="coverImage" alt="cover image" />
      <div class="write-up">
        <div>
          <slot name="content" />
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from '@/components/Layout/TheNavbar.vue';
import TheFooter from '@/components/Layout/TheFooter.vue';
import { imageUrl } from '~/utils/images';

const props = defineProps({
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
});

const coverImage = computed(() => imageUrl('/blog' + props.img));

useHead({
  title: () => props.title,
  meta: [
    {
      property: 'og:title',
      content: () => props.title,
    },
    {
      property: 'og:image',
      itemprop: 'image',
      content: coverImage,
    },
    {
      name: 'twitter:image',
      content: coverImage,
    },
  ],
});
</script>

<style lang="scss" scoped>
img {
  margin-left: auto;
  margin-right: auto;
}

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

  // the post comes in through the content slot, which scoped styles only reach via :slotted()
  :slotted(blockquote) {
    border-left: 2px solid var(--clr-primary);
  }

  :slotted(blockquote > *) {
    margin-left: 9px;
  }

  // the tweet and CodePen embeds show their fallback links until their scripts replace them,
  // and the browser's default link blue is unreadable on the dark background
  :slotted(.twitter-tweet a),
  :slotted(.codepen a) {
    color: var(--clr-primary);
  }

  :slotted(.credit) {
    margin-top: -1.5rem;
    text-align: center;
  }

  :slotted(button.center) {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  :slotted(ul) {
    margin-left: 2.5rem;
  }

  :slotted(ul li) {
    list-style-image: url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle fill='%2366fcf1' cx='4' cy='4' r='4'/%3E%3C/svg%3E");

    // &::before {
    //   content: '\2022'; /* Add content: \2022 is the CSS Code/unicode for a bullet */
    //   // transform: scale(1.5);
    //   font-size: 28px;
    //   color: var(--clr-primary); /* Change the color */
    //   font-weight: bold; /* If you want it to be bold */
    //   display: inline-block; /* Needed to add space between the bullet and the text */
    //   width: 10px; /* Also needed for space (tweak if needed) */
    // }
  }

  > div,
  :slotted(*) {
    margin-top: 2rem;
  }

  :slotted(h2) {
    margin-top: 4rem;
  }

  :slotted(h2 + p) {
    margin-top: -1.5rem;

    @include respond(tab-land) {
      margin-top: -0.5rem;
    }
  }

  :slotted(img),
  :slotted(canvas),
  :slotted(svg) {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  @include respond(tab-port) {
    :slotted(.vega) {
      overflow-x: scroll;
    }
  }
}
</style>

<style lang="scss">
.write-up {
  canvas {
    height: auto !important;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
