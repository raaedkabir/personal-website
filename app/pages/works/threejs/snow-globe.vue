<template>
  <ThreeDemo title="Procedurally Generated Snow Globe" :load="load">
    <p>
      Every visit builds a new procedurally generated island. Simplex noise sets the height of each hexagonal tile, and
      the height picks its texture: stone, dirt, grass, sand or gravel. Trees, rocks and clouds are scattered at random,
      and snow falls around a glass dome.
    </p>
    <p>Drag to look around, and scroll or pinch to zoom.</p>
    <template #credits>
      Based on a tutorial by
      <AppLink href="https://www.youtube.com/watch?v=HsCYEA_UuZA" target="_blank" rel="noopener noreferrer"
        >Irradiance</AppLink
      >
      · HDRI from
      <AppLink href="https://polyhaven.com/hdris" target="_blank" rel="noopener noreferrer">Poly Haven</AppLink>
      · Snow inspired by
      <AppLink href="https://codepen.io/tksiiii/pen/MRjWzv" target="_blank" rel="noopener noreferrer">takashi</AppLink>
    </template>
  </ThreeDemo>
</template>

<script setup>
import ThreeDemo from '~/components/Pages/ThreeJs/ThreeDemo.vue';

definePageMeta({
  layout: 'empty',
});

useHead({
  title: 'Procedurally Generated Snow Globe',
});

const load = () => import('~/utils/three/snow-globe.js');
</script>
