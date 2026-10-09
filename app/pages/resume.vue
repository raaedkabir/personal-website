<template>
  <main>
    <div class="container pt-12 pb-6">
      <h1 class="heading__primary">Resume <span>_</span></h1>
      <h2 class="heading__secondary">
        Or view it
        <a
          class="link"
          href="https://raaedkabir-assets.s3.amazonaws.com/Raaed+Kabir+-+Resume.pdf"
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
        <p>Bachelor of Electrical and Electronics Engineering with Honours</p>
        <br />
        <p>Major in Control Systems</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Experience</h3>
        <h4 class="detail telus-color">TELUS Digital</h4>
        <p>Full Stack Developer · February 2022 to Present</p>
      </div>
      <div class="category">
        <h4 class="detail myone-corp-color">MyOne Corporation Sdn. Bhd.</h4>
        <p>Full Stack Developer (Contract) · June 2021 to November 2021</p>
      </div>
      <div class="category">
        <h4 class="detail upm-color">Freelance</h4>
        <p>Web Developer (Contract) · January 2021</p>
      </div>
      <div class="category">
        <h4 class="detail myone-corp-color">MyOne Corporation Sdn. Bhd.</h4>
        <p>Frontend Developer Intern · August 2020 to November 2020</p>
      </div>
      <div class="category">
        <h4 class="detail clearoute-color">Clearoute Inc.</h4>
        <p>Digital Marketing Intern · July 2019 to August 2019</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Projects</h3>
        <p>See <AppLink><nuxt-link to="/works">My Works page</nuxt-link></AppLink> for full list.</p>        
      </div>
      <div class="category">
        <h3 class="subtitile">Skills</h3>
        <p>Front End: HTML, CSS, SCSS, Vue.js, React.js, D3.js, GSAP, TypeScript</p>
        <p>Back End: Node.js, Linux, AWS, Netlify, Serverless Framework</p>
        <p>Tools: Git, VS Code, Travis CI</p>
        <p>Soft Skills: Teamwork, Leadership, Communication, Problem Analysis</p>
      </div>
      <div class="category">
        <h3 class="subtitile">Interests</h3>
        <p>Ice-Cream, Making Stuff, Super Smash Bros. Ultimate</p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  head() {
    return {
      title: 'Resume',
    };
  },
};
</script>

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

    &.telus-color {
      color: #66CC00;
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
