<template>
  <main>
    <section>
      <div class="container pt-12">
        <h1 class="heading__primary text-center">My Works <span>_</span></h1>

        <div class="projects-container">
          <AppWorkPreview
            to="/blog/generative-art"
            img-src="/generativeArt/heading.png"
            img-alt="computer generated art"
          >
            <h2 class="heading__secondary">Generative Art with HTML5 Canvas</h2>
            <AppButton>write-up</AppButton>
          </AppWorkPreview>

          <AppWorkPreview
            outside
            to="https://comecommune.netlify.app/"
            img-src="/website/ComeCommune.png"
            img-alt="website hero area"
          >
            <h2 class="heading__secondary">ComeCommune Blog Site</h2>
            <AppButton>project</AppButton>
          </AppWorkPreview>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  head() {
    return {
      title: 'My Works',
    };
  },
};
</script>

<style lang="scss" scoped>
.projects-container {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  margin: 5rem auto 5rem;

  button {
    margin-left: 5%;
    cursor: pointer;
  }

  > * {
    flex: 0 50%;

    @include respond(phone) {
      flex: 0 100%;
    }
  }
}
</style>
