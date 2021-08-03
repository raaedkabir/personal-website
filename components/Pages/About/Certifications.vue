<template>
  <div>
    <h2 class="heading__secondary text-center">Certifications</h2>

    <div class="badges">
      <div 
        data-iframe-width="150" 
        data-iframe-height="250" 
        data-share-badge-id="52eab62f-8692-4a9c-96e5-511f98ec5972" 
        data-share-badge-host="https://www.credly.com">
      </div>
      <script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
      <div 
        data-iframe-width="150" 
        data-iframe-height="250" 
        data-share-badge-id="2b14b75d-3595-4729-90ff-1b0bd9db059d" 
        data-share-badge-host="https://www.credly.com">
      </div>
      <script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
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
