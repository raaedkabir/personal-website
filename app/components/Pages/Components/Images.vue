<template>
  <section class="image">
    <div class="container">
      <h2 class="heading__secondary text-center">Image Captions</h2>

      <div class="showcase__image">
        <div class="image-effect--1">
          <img src="@/assets/images/components/image-1.png" alt="" />
          <div class="image-effect--1__caption">
            <h1>Caption</h1>
            <p>Sub-text</p>
          </div>
        </div>
        <div class="image-effect--2">
          <img src="@/assets/images/components/image-2.jpg" alt="" />
          <div class="image-effect--2__caption">
            <h1>Caption</h1>
            <p>Sub-text</p>
          </div>
        </div>
        <div class="image-effect--3">
          <img src="@/assets/images/components/image-3.png" alt="" />
          <div class="image-effect--3__caption">
            <h1>Caption</h1>
            <p>Sub-text</p>
          </div>
        </div>
        <div class="image-effect--4">
          <img src="@/assets/images/components/image-4.jpg" alt="" />
          <div class="image-effect--4__caption">
            <h1>Caption</h1>
            <p>Sub-text</p>
          </div>
        </div>
        <div class="image-effect--5">
          <img src="@/assets/images/components/image-5.png" alt="" />
          <div class="image-effect--5__caption">
            <h1>Caption</h1>
            <p>Sub-text</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/abstracts/_mixins.scss';

.showcase {
  &__image {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__image {
    & > ul li {
      z-index: 5;
    }

    & > * {
      margin: 2rem 0;
    }
  }
}

section.image {
  background: #ff9f1c;
  padding-top: 5rem;
}

.image-effect {
  &--1 {
    width: 30rem;
    height: 53rem;
    position: relative;
    overflow: hidden;

    & img {
      width: 100%;
      // height: 100%;
      transition: all 0.5s;
    }

    &__caption {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 30%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      transition: all 0.5s;
      background-color: black;
      transform: translateY(100%);

      & h1 {
        text-transform: uppercase;
      }

      & p {
        font-size: 1.8rem;
        text-transform: capitalize;
      }
    }

    &:hover &__caption {
      transform: translateY(0);
    }

    &:hover img {
      transform: translateY(-30%);
    }
  }

  &--2 {
    width: 50rem;
    height: 50rem;
    position: relative;
    overflow: hidden;

    & img {
      width: 100%;
      transition: all 0.5s;
    }

    &__caption {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
      opacity: 0;
      transition: all 0.5s;

      & h1 {
        text-transform: uppercase;
      }

      & p {
        font-size: 1.8rem;
        text-transform: capitalize;
      }
    }

    &:hover &__caption {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.5);
    }

    &:hover img {
      transform: scale(1.3);
    }
  }

  &--3 {
    width: 50rem;
    height: 50rem;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
      // width: 100%;
      height: 100%;
      transition: all 0.5s;
    }

    &__caption {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
      opacity: 0;
      transform: translateX(-100%);
      transition: all 0.5s;

      & h1 {
        text-transform: uppercase;
      }

      & p {
        font-size: 1.8rem;
        text-transform: capitalize;
      }
    }

    &:hover &__caption {
      opacity: 1;
      transform: translateX(0);
      background-color: rgba(0, 0, 0, 0.5);
    }

    &:hover img {
      transform: scale(1.3) rotate(-2deg);
    }
  }

  &--4 {
    width: 50rem;
    height: 50rem;
    position: relative;
    overflow: hidden;

    & img {
      // width: 100%;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      transition: all 0.5s;
    }

    &__caption {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: #333;
      color: #fff;
      transition: all 0.5s;
      transform: translateX(-100%);

      & h1 {
        text-transform: uppercase;
      }

      & p {
        font-size: 1.8rem;
        text-transform: capitalize;
      }
    }

    &:hover &__caption {
      transform: translateX(0);
    }

    &:hover img {
      transform: translateX(100%);
    }
  }

  &--5 {
    width: 50rem;
    height: 50rem;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #006266;
      opacity: 0.5;
      transition: all 0.3s;
      transition-delay: 0.3s;
      transform: translateY(100%);
      z-index: 1;
    }

    &:hover::before {
      transform: translateY(0);
      transition-delay: 0s;
    }

    &:hover &__caption {
      transform: translateY(0);
      opacity: 1;
      transition-delay: 0.3s;
    }

    & img {
      // width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    &__caption {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transform: translateY(-10%);
      transition: all 0.5s;
      transition-delay: 0s;
      z-index: 2;

      & h1 {
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      & p {
        text-transform: capitalize;
        background-color: #ae895d;
        padding: 3px 5px;
      }
    }
  }
}
</style>
