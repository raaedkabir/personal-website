<template>
  <div>
    <h2 class="heading__secondary text-center">Certifications</h2>

    <div class="badges">
      <iframe
        id="embedded-badge-52eab62f-8692-4a9c-96e5-511f98ec5972"
        name="acclaim-badge"
        allowtransparency="true"
        scrolling="no"
        src="//www.credly.com/embedded_badge/52eab62f-8692-4a9c-96e5-511f98ec5972"
        style="width: 150px; height: 240px"
        title="View my verified achievement on Credly."
        frameborder="0"
      ></iframe>
      <iframe
        id="embedded-badge-2b14b75d-3595-4729-90ff-1b0bd9db059d"
        name="acclaim-badge"
        allowtransparency="true"
        scrolling="no"
        src="//www.credly.com/embedded_badge/2b14b75d-3595-4729-90ff-1b0bd9db059d"
        style="width: 150px; height: 240px"
        title="View my verified achievement on Credly."
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  > * {
    margin-top: 2rem;
  }

  iframe {
    background: #fff;
  }
}
</style>
