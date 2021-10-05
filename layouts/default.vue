<template>
  <div>
    <TheNavbar />
    <Nuxt />
    <TheFooter />
    <a class="top-of-site-link" :class="{ show: displayScrollToTop }" @click="scrollToTop">
      <span class="screen-reader-text">Back to Top</span>
      <svg width="32" height="32" viewBox="0 0 100 100">
        <path fill="white" d="m50 0c-13.262 0-25.98 5.2695-35.355 14.645s-14.645 22.094-14.645 35.355 5.2695 25.98 14.645 35.355 22.094 14.645 35.355 14.645 25.98-5.2695 35.355-14.645 14.645-22.094 14.645-35.355-5.2695-25.98-14.645-35.355-22.094-14.645-35.355-14.645zm20.832 62.5-20.832-22.457-20.625 22.457c-1.207 0.74219-2.7656 0.57812-3.7891-0.39844-1.0273-0.98047-1.2695-2.5273-0.58594-3.7695l22.918-25c0.60156-0.61328 1.4297-0.96094 2.2891-0.96094 0.86328 0 1.6914 0.34766 2.293 0.96094l22.918 25c0.88672 1.2891 0.6875 3.0352-0.47266 4.0898-1.1562 1.0508-2.9141 1.0859-4.1133 0.078125z"></path>
      </svg>
    </a>
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
  data() {
    return {
      displayScrollToTop: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    scrollToTop() {
      window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
    },
    onScroll() {
      if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
        this.displayScrollToTop = true;
      } else {
        this.displayScrollToTop = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.show {
  visibility: visible !important;
  opacity: 1 !important;
}

.top-of-site-link {
  cursor: pointer;
  visibility: hidden;
  opacity: 0;
  transition: .2s;
  position: fixed;
  bottom: 1.2rem;
  right: 1.5rem;
  z-index: 100;

  svg {
    filter: drop-shadow(0 2px 5px rgba(0,0,0,.3));
  }
}

.screen-reader-text {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    word-wrap: normal !important;
}
</style>