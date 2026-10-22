<template>
  <footer>
    <p class="text-left">Made with a lot of coffee.</p>
    <p class="text-right">© {{ year }} by Raaed Kabir. All rights reserved.</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
