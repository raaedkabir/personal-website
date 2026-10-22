<template>
  <main>
    <section>
      <div class="container pt-12">
        <p class="date text-center">August 2023</p>
        <h1 class="heading__primary text-center">Three.js Demos <span>_</span></h1>

        <div class="projects-container">
          <AppWorkPreview
            to="/works/threejs/snow-globe"
            img-src="/works/threejs/snow-globe.jpg"
            img-alt="low-poly island of procedurally generated hexagonal tiles inside a glass snow globe"
          >
            <h2 class="heading__secondary">Procedurally Generated Snow Globe</h2>
            <AppButton>demo</AppButton>
          </AppWorkPreview>

          <AppWorkPreview
            to="/works/threejs/lighthouse"
            img-src="/works/threejs/lighthouse.jpg"
            img-alt="red and white lighthouse on a small rocky island"
          >
            <h2 class="heading__secondary">Blender Lighthouse</h2>
            <AppButton>demo</AppButton>
          </AppWorkPreview>

          <AppWorkPreview
            to="/works/threejs/material-sphere"
            img-src="/works/threejs/material-sphere.jpg"
            img-alt="mirror-like metal sphere reflecting a rocky forest"
          >
            <h2 class="heading__secondary">Material Sphere</h2>
            <AppButton>demo</AppButton>
          </AppWorkPreview>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
useHead({
  title: 'Three.js Demos',
});
</script>

<style lang="scss" scoped>
.date {
  margin-bottom: 2rem;
  text-transform: uppercase;
}

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
