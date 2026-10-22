<template>
  <div>
    <h2 class="heading__secondary text-center">Certifications</h2>

    <div class="badges">
      <iframe
        id="embedded-badge-5311ff53-a6a2-492a-a85e-afd53162c1ad"
        name="acclaim-badge"
        allowtransparency="true"
        scrolling="no"
        src="//www.credly.com/embedded_badge/5311ff53-a6a2-492a-a85e-afd53162c1ad"
        style="width: 150px; height: 245px"
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
