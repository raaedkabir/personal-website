<template>
  <main>
    <section>
      <div class="container pt-12 pb-6">
        <h1 class="heading__primary">About Me <span>_</span></h1>

        <AboutMe class="mt-4" />

        <Skills class="mt-6" />

        <Certifications class="mt-6" />

        <div class="mt-6">
          <h2 class="heading__secondary text-center">Timeline</h2>
          <p class="text-center">Coming Soon</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import AboutMe from '@/components/Pages/About/AboutMe.vue';
import Certifications from '@/components/Pages/About/Certifications.vue';
import Skills from '@/components/Pages/About/Skills.vue';

export default {
  components: {
    AboutMe,
    Certifications,
    Skills,
  },

  head() {
    return {
      title: 'About Me',
      script: [{ src: 'https://js.stripe.com/v3/' }],
    };
  },
};
</script>
