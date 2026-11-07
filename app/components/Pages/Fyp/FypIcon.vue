<template>
  <svg class="fyp-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<script setup>
// a Material Design Icon from @mdi/js, which the original dashboard used through mdi-vue
defineProps({
  path: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.fyp-icon {
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
