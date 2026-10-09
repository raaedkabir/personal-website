<template>
  <section class="text">
    <div class="container">
      <h2 class="heading__secondary text-center">Text Effects</h2>

      <div class="showcase__text">
        <ul class="text-effect--1">
          <li>S</li>
          <li>M</li>
          <li>O</li>
          <li>K</li>
          <li>E</li>
        </ul>
        <p class="text-effect--2">Text</p>
        <p class="text-effect--3"><span aria-hidden="true">Glitch</span>Glitch<span aria-hidden="true">Glitch</span></p>
        <div class="text-effect--4">
          <p>Shining</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

.showcase {
  &__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

section.text {
  background: #e71d36;
  padding-bottom: 12rem;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10rem), 0 100%);
  margin-bottom: -10rem;
}

.text-effect {
  &--1 {
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: #777;

    & li {
      list-style: none;
      color: #fff;
      font-size: 10rem;
      font-weight: 700;
      letter-spacing: 10px;
      transition: all 2s;
    }

    &:hover li {
      transform: rotate(45deg) translateY(-200px);
      opacity: 0;
      filter: blur(20px);
    }

    & li:nth-child(2) {
      transition-delay: 0.2s;
    }

    & li:nth-child(3) {
      transition-delay: 0.4s;
    }

    & li:nth-child(4) {
      transition-delay: 0.6s;
    }

    & li:nth-child(5) {
      transition-delay: 0.8s;
    }
  }

  &--2 {
    font-size: 10rem;
    font-weight: 700;
    color: #ccc;
    text-transform: uppercase;
    position: relative;

    &::before {
      content: 'Text';
      position: absolute;
      top: 0;
      left: 0;
      color: #262626;
      width: 0%;
      overflow: hidden;
      transition: all 0.5s;
    }

    &:hover::before {
      width: 100%;
    }
  }

  &--3 {
    position: relative;
    font-size: 10rem;
    font-weight: 700;
    text-transform: uppercase;

    text-shadow: 0.05em 0 0 rgba($color: #f00, $alpha: 0.75), -0.025em -0.05em 0 rgba($color: #0f0, $alpha: 0.75),
      0.025em 0.05em 0 rgba($color: #00f, $alpha: 0.75);

    animation: glitchText 750ms infinite;

    span {
      position: absolute;
      top: 0;
      left: 0;
      user-select: none;

      &:first-child {
        animation: glitchText 1000ms infinite;
        clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
        transform: translate(-0.015em, -0.025em);
        opacity: 0.8;
      }

      &:last-child {
        animation: glitchText 600ms infinite;
        clip-path: polygon(0 70%, 100% 20%, 100% 100%, 0 100%);
        transform: translate(0.0125em, 0.025em);
        opacity: 0.8;
      }
    }
  }

  &--4 {
    width: 100%;
    text-align: center;
    font-size: 10rem;
    font-weight: 700;
    background: #333;
    text-transform: uppercase;
    position: relative;

    p {
      letter-spacing: 3px;
      color: #fff;
      overflow: hidden;
      background: linear-gradient(to right, #000, #fff 25%, #fff 75%, #000);
      background-repeat: no-repeat;
      background-size: 80%;
      animation: shineText 5s linear infinite;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

@keyframes shineText {
  from {
    background-position-x: -600%;
  }

  to {
    background-position-x: 600%;
  }
}

@keyframes glitchText {
  0% {
    text-shadow: 0.05em 0 0 rgba($color: #f00, $alpha: 0.75), -0.025em -0.05em 0 rgba($color: #0f0, $alpha: 0.75),
      0.025em 0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
  14% {
    text-shadow: 0.05em 0 0 rgba($color: #f00, $alpha: 0.75), -0.025em -0.05em 0 rgba($color: #0f0, $alpha: 0.75),
      0.025em 0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
  15% {
    text-shadow: -0.05em -0.025em 0 rgba($color: #f00, $alpha: 0.75), 0.025em 0.025em 0 rgba($color: #0f0, $alpha: 0.75),
      -0.05em -0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
  49% {
    text-shadow: -0.05em -0.025em 0 rgba($color: #f00, $alpha: 0.75), 0.025em 0.025em 0 rgba($color: #0f0, $alpha: 0.75),
      -0.05em -0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
  50% {
    text-shadow: 0.025em 0.05em 0 rgba($color: #f00, $alpha: 0.75), 0.05em 0 0 rgba($color: #0f0, $alpha: 0.75),
      0 -0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
  99% {
    text-shadow: 0.025em 0.05em 0 rgba($color: #f00, $alpha: 0.75), 0.05em 0 0 rgba($color: #0f0, $alpha: 0.75),
      0 -0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
  100% {
    text-shadow: -0.025em 0 0 rgba($color: #f00, $alpha: 0.75), -0.025em -0.025em 0 rgba($color: #0f0, $alpha: 0.75),
      -0.025em -0.05em 0 rgba($color: #00f, $alpha: 0.75);
  }
}
</style>
