<template>
  <main>
    <div class="container pt-12 pb-6">
      <h1 class="heading__primary">Resume <span>_</span></h1>
      <h2 class="heading__secondary">
        Or view it
        <a
          class="link"
          href="https://app.rezi.io/s/vVbqEtaIHbkPfjNxUKJT"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          here</a
        >
        if you like.
      </h2>

      <div class="category">
        <h3 class="subtitile">Education</h3>
        <h4 class="detail upm-color">Universiti Putra Malaysia</h4>
        <p>Bachelor of Electrical and Electronics Engineering · Est. July 2021</p>
        <br />
        <p>Major in Control Systems, CGPA 3.293</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Experience</h3>
        <h4 class="detail myone-corp-color">MyOne Corporation Sdn. Bhd.</h4>
        <p>Front-End Developer Intern · August 2020 to November 2020</p>
        <br />
        <p>
          Designed and Developed a Single Page Application Dashboard using Vue to display sensor data of over 10 motors
          at once or dig deep to the details of a single motor.
        </p>
      </div>
      <div class="category">
        <h4 class="detail clearoute-color">Clearoute Inc.</h4>
        <p>Digital Marketing Intern · July 2019 to August 2019</p>
        <br />
        <p>Monitored Facebook Ad Analytics to gauge performance and produced assets in Photoshop for A/B Testing.</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Projects</h3>
        <p>See My Works Page for Full List</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Skills</h3>
        <p>Front-End: HTML, SCSS, JS, Vue, Nuxt, Gatsby, GSAP</p>
        <p>Back-End: Node, EC2, Lambda</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Interests</h3>
        <p>Ice-Cream, Making Stuff, Super Smash Bros. Ultimate</p>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.category {
  margin-top: 4rem;

  p {
    font-size: 2rem;
  }

  .subtitile {
    margin-bottom: 1em;
    padding-left: 2em;
    text-transform: uppercase;
    color: var(--clr-primary);
  }

  .detail {
    margin-bottom: 0.2em;
    font-size: 2em;

    &.upm-color {
      color: #c8234a;
    }

    &.myone-corp-color {
      color: #542e91;
    }

    &.clearoute-color {
      color: #01bbea;
    }
  }
}
</style>
