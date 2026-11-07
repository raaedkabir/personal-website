<template>
  <div v-if="loading" class="loading" role="status">
    <span class="visually-hidden">Loading</span>
    <div class="ring" />
  </div>
</template>

<script setup>
// the original Loading overlay
defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.loading {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.6);
}

.ring::after {
  content: '';
  display: block;
  width: 150px;
  height: 150px;
  border: 8px solid;
  border-color: var(--clr-primary-400) transparent;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ring::after {
    animation-duration: 4s;
  }
}
</style>
