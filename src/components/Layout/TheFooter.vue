<template>
  <footer class="footer">
    <p>Made with a lot of coffee.</p>
    <p class="legal">© 2020 by {{ fullName }}. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      fullName: process.env.VUE_APP_NAME
    };
  }
};
</script>

<style>
.footer {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
}
</style>
