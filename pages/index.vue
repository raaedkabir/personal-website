<template>
  <main>
    <home-hero />
    <section class="home--about">
      <div class="container">
        <p>
          As a <span>web developer</span> based in <span>London, Ontario</span> I like to create engaging online experiences for
          users.
        </p>
        <AppButton link to="/about" style="margin-top: 2rem">Learn More About Me</AppButton>
      </div>
    </section>
    <home-works />
    <section class="home--contact">
      <p>Have an awesome project and need a developer?</p>
      <p>Hit me up and <a class="link">let's chat</a>!</p>
      <Contact />
    </section>
  </main>
</template>

<script>
import HomeHero from '@/components/Pages/Home/Hero.vue';
import HomeWorks from '@/components/Pages/Home/Works.vue';
import Contact from '@/components/Pages/Home/Contact.vue';

export default {
  components: {
    HomeHero,
    HomeWorks,
    Contact,
  },

  head: {
    title: 'Welcome!',
  },
};
</script>
