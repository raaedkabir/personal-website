<template>
  <the-navbar @togglenav="toggleNav" />
  <!-- <router-view v-slot="slot" class="page-content" :class="{ active: displayNav }"> -->
  <!-- <transition mode="out-in" :css="false" @enter="enter" @leave="leave"> -->
  <!-- <component :is="slot.Component" :key="$route.fullPath" /> -->
  <!-- </transition> -->
  <!-- </router-view> -->
  <router-view :class="['page-content', { active: displayNav }]" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TheNavbar from '@/components/Layout/TheNavbar.vue';

@Options({
  components: {
    TheNavbar
  }
})
export default class Home extends Vue {
  displayNav = false;

  toggleNav(e: boolean) {
    this.displayNav = e;
  }

  mounted() {
    // eslint-disable-next-line
    console.log('I wonder what under /secret 🤔.');
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/abstracts/_mixins.scss';

@import '@/assets/scss/vendors/_normalize.scss';

@import '@/assets/scss/base/_animations';
@import '@/assets/scss/base/_reset';
@import '@/assets/scss/base/_typography';

// container
.container {
  width: 100%;
  max-width: 960px;
  padding: 0 2rem;
  margin: 0 auto;

  @include respond(big-desktop) {
    max-width: 1140px;
  }
}

.btn--nav {
  display: inline-block;
  padding: 1rem;
  margin: 0.5rem;
  width: 100%;
  border-radius: 5px;
  transition: all 0.2s;

  &:hover {
    color: var(--clr-secondary);
    background: #fff;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
