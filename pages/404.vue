<template>
  <main>
    <div class="container center-center">
      <p>Welp, looks like this page doesn't exist.</p>
      <p>If you're lost the button will help guide your way. Don't resist the button.</p>
      <AppButton link to="/">Go to Home Page</AppButton>
    </div>
  </main>
</template>

<script>
export default {
  head() {
    return {
      title: 'Error 404',
    };
  },
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  align-items: center;
}

.center-center {
  height: 100%;
  font-size: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  a {
    align-self: flex-end;
    margin-top: 2rem;
  }
}
</style>
