<template>
  <ThreeDemo title="Material Sphere" :load="load" gui>
    <p>
      A sphere for trying out three.js materials. Switch between an unlit basic material and a physically based
      standard material, then change its roughness, metalness and color in the controls panel.
    </p>
    <p>Drag to look around, and scroll or pinch to zoom.</p>
    <template #credits>
      HDRI from
      <AppLink href="https://polyhaven.com/hdris" target="_blank" rel="noopener noreferrer">Poly Haven</AppLink>
    </template>
  </ThreeDemo>
</template>

<script setup>
import ThreeDemo from '~/components/Pages/ThreeJs/ThreeDemo.vue';

definePageMeta({
  layout: 'empty',
});

useHead({
  title: 'Material Sphere',
});

const load = () => import('~/utils/three/material-sphere.js');
</script>
