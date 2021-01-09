<template>
  <section class="home__works">
    <div class="container">
      <h2 class="heading__section">My Works <span>_</span></h2>
      <div class="wrapper">
        <div class="home__works--container one">
          <img src="@/assets/images/works/motor_dashboard.png" alt="" class="home__works--image" />
          <p class="title">Motor Dashboard</p>
          <p class="details">Made with Vue.</p>
        </div>
        <div class="home__works--container two">
          <a href="https://comecommune.netlify.app/" target="_blank" rel="noopener noreferrer">
            <img
              src="@/assets/images/works/ComeCommune.png"
              alt="ComeCommune website screenshot"
              class="home__works--image"
            />
            <p class="title">ComeCommune Blog Site</p>
            <p class="details">Designed in Photoshop and Developed in Gatsby.</p>
          </a>
        </div>
        <div class="home__works--container three">
          <img src="@/assets/images/works/lorem_image.jpg" alt="" class="home__works--image" />
          <p class="title">Lorem Ipsum</p>
          <!-- <p class="details">
            Lorem.
          </p> -->
        </div>
        <div class="home__works--container four">
          <img src="@/assets/images/works/lorem_image.jpg" alt="" class="home__works--image" />
          <p class="title">Lorem Ipsum</p>
          <!-- <p class="details">
            Lorem.
          </p> -->
        </div>
        <div class="home__works--container five">
          <img src="@/assets/images/works/project_generator_site.jpg" alt="" class="home__works--image" />
          <p class="title">HTML & CSS Website Template</p>
          <!-- <p class="details">
              Made in HTML & CSS.
            </p> -->
        </div>
        <div class="home__works--container six">
          <router-link to="/components">
            <img src="@/assets/images/works/component_library.png" alt="" class="home__works--image" />
            <p class="title">Pure CSS Components</p>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
