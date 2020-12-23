<template>
  <div class="error404">
    <div class="center">
      <h1 class="heading__secondary">Error 404</h1>
      <p>You've wandered off the path stranger.<br />The button will help guide your way. Don't resist the button.</p>
      <router-link to="/" class="btn">
        Go to Home Page
      </router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

.error404 {
  background-image: url('../assets/images/bg-error404.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;

  & .center {
    @include absCenter;

    text-align: center;

    & .btn {
      cursor: pointer;
      display: block;
      text-decoration: none;
      color: var(--clr-primary-2);
      background: var(--clr-primary);
      padding: 0.5em 1.5em;
      border-radius: 5px;
      margin-top: 0.5em;
      float: right;
      transition: all 0.2s;

      &:hover {
        background: var(--clr-primary-1);
      }

      &:active {
        transform: translateY(2px);
      }
    }
  }
}
</style>
