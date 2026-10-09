<template>
  <section class="buttons">
    <!-- <svg viewBox="0 0 560 259" class="headerSVG">
      <text transform="matrix(1 0 0 1 -0.00007 116.14385)">
        <tspan x="0" y="0" font-family="'Montserrat'" font-size="157px">STARS</tspan>
        <tspan x="0" y="139" font-family="'Montserrat'" font-size="181px">DEAD</tspan>
      </text>
      <circle fill="#FFFFFF" cx="128.50781" cy="126.5" r="34.5" />
      <text transform="matrix(1 0 0 1 114.62256 123)">
        <tspan x="0" y="0" font-family="'Montserrat'" font-size="19px">OF</tspan>
        <tspan x="-6.28906" y="17" font-family="'Montserrat'" font-size="19px">THE</tspan>
      </text>
    </svg> -->
    <div class="container">
      <h1 class="heading__primary text-center">Pure CSS Component Library</h1>
      <h2 class="heading__secondary text-center">Buttons</h2>

      <div class="showcase__btn">
        <a href="#" class="btn--1">Hover</a>
        <a href="#" class="btn--2">Hover</a>
        <a href="#" class="btn--3">Hover</a>
        <div class="btn--4__wrapper">
          <a href="#" class="btn--4">Hover</a>
        </div>
        <a href="#" class="btn--5">Hover</a>
        <a href="#" class="btn--6">Hover</a>
        <a href="#" class="btn--7">Hover</a>
        <a href="#" class="btn--8">Hover</a>
        <button class="btn--9">Hover</button>
        <a href="#" class="btn--10">Hover</a>
        <a href="#" class="btn--11">Hover</a>
        <a href="#" class="btn--12">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Hover
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

.headerSVG {
  width: 50vw;
}

.showcase {
  &__btn {
    display: grid;
    gap: 3rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    place-items: center;
    grid-auto-rows: 10rem;

    & > * {
      z-index: 15;
    }

    @include respond(tab-port) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @include respond(phone) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

section.buttons {
  background: #2ec4b6;
  padding-bottom: 3rem;
  position: relative;

  &::after,
  &::before {
    position: absolute;
    content: '';
    width: 15rem;
    height: 5rem;
    background: #2ec4b6;
    bottom: -1.5rem;
    z-index: 10;
  }

  &::before {
    right: 50%;
    transform: skew(0, 20deg);
  }

  &::after {
    left: 50%;
    transform: skew(0, -20deg);
  }
}

.btn {
  &--1 {
    text-decoration: none;
    color: #272727;
    font-family: sans-serif;
    font-size: 2rem;
    border: 0.5rem solid #272727;
    padding: 2rem 4rem;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background-color: #fff200;
      height: 100%;
      width: 100%;
      z-index: -1;
      transform-origin: bottom left;
      transform: rotate(-90deg);
      transition: all 1s;
    }

    &:hover::before {
      transform: rotate(0);
    }
  }

  &--2 {
    text-decoration: none;
    color: #351435;
    font-family: sans-serif;
    font-size: 2rem;
    border: 3px solid #351435;
    padding: 2rem 4rem;
    position: relative;
    transition: all 1s;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background-color: #351435;
      height: 100%;
      width: 100%;
      z-index: -1;
      transform: translateX(-100%);
      transition: all 1s;
    }

    &:hover::before {
      transform: translateX(0);
    }

    &:hover {
      color: #fff;
    }
  }

  &--3 {
    text-decoration: none;
    color: #262626;
    font-family: sans-serif;
    font-size: 2rem;
    letter-spacing: 2px;
    border: 0.5rem solid #262626;
    padding: 2rem 4rem;
    position: relative;
    overflow: hidden;
    transition: all 1s;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background-color: #262626;
      height: 100%;
      width: 100%;
      z-index: -1;
      transform: rotateX(90deg);
      transition: all 1s;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background-color: #262626;
      height: 100%;
      width: 100%;
      z-index: -1;
      transform: rotateY(90deg);
      transition: all 1s;
    }

    &:hover::after {
      transform: rotateY(0);
    }

    &:hover::before {
      transform: rotateX(0);
    }

    &:hover {
      color: #fff;
    }
  }

  &--4 {
    @include absCenter;
    text-decoration: none;
    padding: 2rem 4rem;
    color: #e1332d;
    border: 3px solid #e1332d;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: -1px;
    transition: all 0.5s;

    &:hover {
      font-weight: 700;
      letter-spacing: 8px;
      border: 7px solid #e1332d;
    }

    &__wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  &--5 {
    text-decoration: none;
    color: #351435;
    font-family: sans-serif;
    font-size: 2rem;
    border: 3px solid #351435;
    padding: 2rem 4rem;
    position: relative;
    transition: all 1s;
    overflow: hidden;

    &::before {
      content: 'Good Job!';
      color: #fff;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #f44336;
      height: 100%;
      width: 100%;
      transform: translateY(-100%);
      transition: all 1s;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover::before {
      transform: translateY(0);
    }

    &:hover {
      color: #fff;
    }
  }

  &--6 {
    text-decoration: none;
    color: #351435;
    font-family: sans-serif;
    font-size: 2rem;
    padding: 2rem 4rem;
    border: 3px solid #351435;
    transition: all 1s;
    position: relative;
    overflow: hidden;

    &:hover {
      background-color: #f44336;
    }

    &:hover::before {
      transform: translateX(100%) rotate(45deg);
    }

    &::before {
      content: '';
      background-color: #fff;
      top: 0;
      left: 0;
      width: 150%;
      height: 50px;
      position: absolute;
      transform: translateX(-100%) rotate(45deg);
      transition: all 1s;
    }
  }

  &--7 {
    text-decoration: none;
    background-color: #262626;
    font-family: sans-serif;
    font-size: 2rem;
    border: 4px solid #262626;
    padding: 2rem 4rem;
    position: relative;
    color: transparent;
    overflow: hidden;

    &::before {
      content: 'Hover';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: #fffa65;
      color: #262626;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s;
    }

    &::after {
      content: 'Well Done!';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: #fffa65;
      color: #262626;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s;
      transform: translate(-100%, 100%);
    }

    &:hover::before {
      transform: translate(100%, -100%);
    }

    &:hover::after {
      transform: translate(0, 0);
    }
  }

  &--8 {
    text-decoration: none;
    color: #262626;
    font-family: sans-serif;
    font-size: 2rem;
    border: 3px solid #262626;
    padding: 2rem 4rem;
    transition: all 0.5s;
    position: relative;
    overflow: hidden;

    &::before {
      content: 'Hover me';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: #262626;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(5);
      opacity: 0;
      transition: all 0.5s;
    }

    &:hover::before {
      transform: scale(1);
      opacity: 1;
    }
  }

  &--9 {
    border: 2px solid tomato;
    background: none;
    color: tomato;
    padding: 2rem 4rem;
    font-size: 2rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.5s;
    position: relative;
    color: tomato;
    overflow: hidden;

    &:focus {
      outline: none;
    }

    &:hover {
      color: white;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: tomato;
      z-index: -1;
      border-radius: 0% 0% 50% 50%;
      height: 0%;
      transition: all 0.5s;
    }

    &:hover::before {
      height: 190%;
    }
  }

  &--10 {
    padding: 2rem 4rem;
    text-transform: uppercase;
    text-decoration: none;
    background-color: #f1c40f;
    color: white;
    font-size: 2rem;
    letter-spacing: 2px;
    position: relative;

    // // second folding card
    // &::before {
    //     content: "BUTTON";
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     background-color: #2ecc71;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     transform: rotateX(270deg);
    //     transform-origin: top;
    //     transition: all 0.5s;
    // }

    &::after {
      content: 'Well Done!';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: red;
      display: flex;
      justify-content: center;
      align-items: center;
      transform-origin: top;
      transform: rotateX(270deg);
      transition: all 0.5s;
      // transition-delay: 0.25s;
    }

    // &:hover::before,
    &:hover::after {
      transform: rotateX(0deg);
    }
  }

  &--11 {
    padding: 2rem 4rem;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 4px;
    color: transparent;
    border: 3px solid #ff0;
    font-size: 2rem;
    position: relative;

    &::before {
      content: 'hover';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #363636;
      color: #ff0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s;
    }

    &:hover::before {
      left: 100%;
      transform: scale(0) rotateY(180deg);
      opacity: 0;
    }

    &::after {
      content: 'button';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background-color: #363636;
      color: #ff0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s;
      transform: scale(0) rotateY(180deg);
      opacity: 0;
    }

    &:hover::after {
      left: 0;
      transform: scale(1) rotateY(360deg);
      opacity: 1;
    }
  }

  &--12 {
    text-decoration: none;
    display: inline-block;
    color: #2196f3;
    font-size: 2rem;
    letter-spacing: 4px;
    padding: 2rem 4rem;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;

    &:hover {
      color: #fff;
      background: #2196f3;
      box-shadow: 0 0 1rem #2196f3, 0 0 2rem #2196f3, 0 0 4rem #2196f3;
      transition-delay: 1s;
    }

    span {
      position: absolute;
      display: block;

      &:nth-child(1) {
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, transparent, #2196f3);
      }
      &:nth-child(2) {
        top: -100%;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, #2196f3);
      }
      &:nth-child(3) {
        bottom: 0;
        right: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(to left, transparent, #2196f3);
      }
      &:nth-child(4) {
        bottom: -100%;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(to top, transparent, #2196f3);
      }
    }

    &:hover span {
      &:nth-child(1) {
        left: 100%;
        transition: all 1s;
      }
      &:nth-child(2) {
        top: 100%;
        transition: all 1s;
        transition-delay: 0.25s;
      }
      &:nth-child(3) {
        right: 100%;
        transition: all 1s;
        transition-delay: 0.5s;
      }
      &:nth-child(4) {
        bottom: 100%;
        transition: all 1s;
        transition-delay: 0.75s;
      }
    }
  }
}
</style>
