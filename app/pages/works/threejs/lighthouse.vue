<template>
  <ThreeDemo title="Blender Lighthouse" :load="load">
    <p>A lighthouse and a few cottages on a rocky island, modelled in Blender and loaded as a glTF file.</p>
    <p>Drag to look around, and scroll or pinch to zoom.</p>
  </ThreeDemo>
</template>

<script setup>
import ThreeDemo from '~/components/Pages/ThreeJs/ThreeDemo.vue';

definePageMeta({
  layout: 'empty',
});

useHead({
  title: 'Blender Lighthouse',
});

const load = () => import('~/utils/three/lighthouse.js');
</script>
