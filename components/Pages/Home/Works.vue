<template>
  <section class="home__works">
    <div class="container">
      <h2 class="heading__section">My Works <span>_</span></h2>

      <div class="projects-container">
        <AppWorkPreview
          to="/blog/fourier-series"
          img-src="/blog/fourier-series/heading.png"
          img-alt="preview of fourier series visualization"
        >
          <h2 class="heading__secondary">Fourier Series Visualization</h2>
          <AppButton>write-up</AppButton>
        </AppWorkPreview>

        <AppWorkPreview
          to="/blog/video-game-data-exploration"
          img-src="/blog/video-game-data-exploration/heading.png"
          img-alt="cover art"
        >
          <h2 class="heading__secondary">Data Exploration</h2>
          <AppButton>write-up</AppButton>
        </AppWorkPreview>

        <AppWorkPreview
          to="/blog/development-process"
          img-src="/blog/development-process/hero.jpg"
          img-alt="cover art"
        >
          <h2 class="heading__secondary">My Development Process</h2>
          <AppButton>write-up</AppButton>
        </AppWorkPreview>

        <AppWorkPreview
          to="/blog/generative-art"
          img-src="/blog/generativeArt/heading.png"
          img-alt="computer generated art"
        >
          <h2 class="heading__secondary">Generative Art</h2>
          <AppButton>write-up</AppButton>
        </AppWorkPreview>

        <AppWorkPreview
          outside
          to="https://comecommune.netlify.app/"
          img-src="/works/ComeCommune.png"
          img-alt="website hero area"
        >
          <h2 class="heading__secondary">ComeCommune Blog Site</h2>
          <AppButton>project</AppButton>
        </AppWorkPreview>

        <AppWorkPreview
          outside
          to="https://raaedkabir-assets.s3.amazonaws.com/Motor+Dashboard+Demo.mp4"
          img-src="/works/motor_dashboard.png"
          img-alt="motor dashboard made with vue"
        >
          <h2 class="heading__secondary">Motor Dashboard</h2>
          <AppButton>project</AppButton>
        </AppWorkPreview>
      </div>

      <div style="text-align: center">
        <AppButton link to="/works">See All Works</AppButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.projects-container {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  margin: 2rem auto 5rem;

  button {
    margin-left: 5%;
    cursor: pointer;
  }

  > * {
    flex: 0 50%;
    padding-top: 3rem;
    transition: all 0.2s ease;

    &:hover {
      background: var(--clr-dark-2);
      transform: scale(1.02);

      > h2 {
        color: var(--clr-primary);
      }
    }

    @include respond(phone) {
      flex: 0 100%;
    }

    &:nth-child(n + 3) {
      margin-top: 3rem;
    }
  }
}
</style>
