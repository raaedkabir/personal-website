<template>
  <main>
    <section>
      <div class="container pt-12">
        <h1 class="heading__primary">About Me <span>_</span></h1>

        <div class="content">
          <div class="content--text">
            <p>
              I'm a self-taught programmer currently studying Electrical Engineering at
              <span class="upm-color">UPM</span>.
            </p>
            <br />
            <p>
              I started out with Python but accidentally stumbled into the world of JavaScript and Front-End Development
              where I found my home. I discovered that creating Web Apps fulfilled my two biggest passions of creating
              things and programming.
            </p>
            <br />
            <p>If you'd like, click here to buy me a cup of coffee and help keep me awake.</p>
          </div>
          <div class="content--image">
            <!-- image goes here -->
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.content {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  &--text {
    grid-area: 1 / 1 / 2 / 3;
    margin-right: 5rem;
  }

  &--image {
    grid-area: 1 / 3 / 2 / 4;
  }

  p {
    font-size: 2rem;

    .upm-color {
      font-weight: 700;
      color: #c8234a;
    }
  }
}
</style>
