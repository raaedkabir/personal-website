<template>
  <section class="menu">
    <div class="container">
      <h2 class="heading__secondary text-center">Menu Effects</h2>

      <div class="showcase__menu">
        <ul class="menu-effect--1">
          <li>
            <a href="#">
              Home
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              About
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              Teams
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              Services
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              Contact
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
        </ul>
        <ul class="menu-effect--2">
          <li>
            <a href="#">
              Home
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              About
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              Teams
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              Services
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
          <li>
            <a href="#">
              Contact
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </li>
        </ul>
        <ul class="menu-effect--3">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Teams</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <ul class="menu-effect--4">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Teams</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div class="menu-effect--5">
          <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-google-plus" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-youtube-play" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

.showcase {
  &__menu {
    & > ul li {
      z-index: 5;
    }

    & > * {
      margin: 2rem 0;
    }
  }
}

section.menu {
  padding-top: 12rem;
  color: black;
  background: #2ec4b6;
}

.menu-effect {
  &--1 {
    display: flex;
    list-style: none;
    justify-content: center;

    & li a {
      display: block;
      width: 12rem;
      height: 4rem;
      line-height: 4rem;
      text-align: center;
      color: #262626;
      text-transform: capitalize;
      text-decoration: none;
      position: relative;
      transition: all 0.5s;

      &:hover {
        color: #fff;
      }

      &:hover span {
        transform: scaleY(1);
      }
    }

    & li a span {
      position: absolute;
      width: 25%;
      height: 100%;
      background-color: #262626;
      z-index: -1;
      left: 0;
      top: 0;
      transform: scaleY(0);
      transition: all 0.5s;
      transform-origin: top;

      &:nth-child(2) {
        left: 25%;
        transition-delay: 0.15s;
      }

      &:nth-child(3) {
        left: 50%;
        transition-delay: 0.3s;
      }

      &:nth-child(4) {
        left: 75%;
        transition-delay: 0.45s;
      }
    }
  }

  &--2 {
    display: flex;
    list-style: none;
    justify-content: center;

    & li a {
      display: block;
      width: 12rem;
      height: 4rem;
      line-height: 4rem;
      text-align: center;
      color: #262626;
      text-transform: capitalize;
      text-decoration: none;
      position: relative;
      transition: all 0.5s;

      &:hover {
        color: #fff;
      }

      &:hover span {
        transform: scaleX(1);
      }
    }

    & li a span {
      position: absolute;
      width: 100%;
      height: 25%;
      background-color: #262626;
      z-index: -1;
      left: 0;
      top: 0;
      transform: scaleX(0);
      transition: all 0.5s;
      transform-origin: left;

      &:nth-child(2) {
        top: 25%;
        transition-delay: 0.15s;
      }

      &:nth-child(3) {
        top: 50%;
        transition-delay: 0.3s;
      }

      &:nth-child(4) {
        top: 75%;
        transition-delay: 0.45s;
      }
    }
  }

  &--3 {
    display: flex;
    list-style: none;
    justify-content: center;

    & li a {
      text-decoration: none;
      color: #3d3d3d;
      font-size: 2.2rem;
      display: block;
      padding: 1rem 1.5rem;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #3d3d3d;
        transform: scaleX(0);
        transform-origin: left;
        transition: all 0.5s;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 2px;
        background-color: #3d3d3d;
        transform: scaleX(0);
        transform-origin: right;
        transition: all 0.5s;
      }

      &:hover::before,
      &:hover::after {
        transform: scaleX(1);
      }
    }
  }

  &--4 {
    display: flex;
    justify-content: center;
    list-style: none;

    & li a {
      color: #272727;
      font-size: 2rem;
      text-decoration: none;
      text-transform: uppercase;
      padding: 0.5rem 1rem;
      margin: 0 1rem;
      position: relative;
      transition: all 0.5s;

      &:hover {
        background-color: #e91e63;
        color: #fff;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 12px;
        left: 12px;
        width: 12px;
        height: 12px;
        background-color: transparent;
        border: 3px solid #e91e63;
        border-width: 0 0 3px 3px;
        opacity: 0;
        transition: all 0.3s;
      }

      &:hover::before {
        opacity: 1;
        bottom: -8px;
        left: -8px;
      }

      &::after {
        content: '';
        position: absolute;
        top: 12px;
        right: 12px;
        width: 12px;
        height: 12px;
        background-color: transparent;
        border: 3px solid #e91e63;
        border-width: 3px 3px 0 0;
        opacity: 0;
        transition: all 0.3s;
      }

      &:hover::after {
        opacity: 1;
        top: -8px;
        right: -8px;
      }
    }
  }

  &--5 {
    display: flex;
    justify-content: center;
    text-align: center;

    & a {
      width: 9rem;
      height: 9rem;
      background-color: #f1f1f1;
      margin: 1rem;
      border-radius: 30%;
      color: #10ac84;
      box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.7);
      position: relative;
      overflow: hidden;

      & i {
        line-height: 9rem;
        font-size: 25px;
        transition: all 0.2s;
      }

      &:hover i {
        transform: scale(1.3);
        color: #f1f1f1;
      }

      &::before {
        content: '';
        position: absolute;
        width: 150%;
        height: 120%;
        background-color: #10ac84;
        left: -110%;
        top: 90%;
        transform: rotate(45deg);
      }

      &:hover::before {
        animation: icons 0.7s 1 forwards;
      }
    }
  }
}

@keyframes icons {
  0% {
    left: -110%;
    top: 90%;
  }

  50% {
    left: -10%;
    top: -10%;
  }

  100% {
    left: -20%;
    top: -5%;
  }
}
</style>
