<template>
  <div class="container" style="z-index: 100000000000000000">
    <form @submit.prevent="submit" class="form">
      <div class="form__group firstName">
        <input
          v-model.trim="firstName"
          type="text"
          class="form__input"
          placeholder="First Name"
          id="firstName"
          required
        />
        <label for="firstName" class="form__label">First Name</label>
      </div>
      <div class="form__group lastName">
        <input
          v-model.trim="lastName"
          type="text"
          class="form__input"
          placeholder="Last Name"
          id="lastName"
        />
        <label for="lastName" class="form__label">Last Name</label>
      </div>
      <div class="form__group email">
        <input
          v-model.trim="email"
          type="email"
          class="form__input"
          placeholder="Email"
          id="email"
          required
        />
        <label for="email" class="form__label">Email</label>
      </div>
      <div class="form__group subject">
        <input
          v-model.trim="subject"
          type="text"
          class="form__input"
          placeholder="Message Subject"
          id="subject"
        />
        <label for="subject" class="form__label">Message Subject</label>
      </div>
      <div class="form__group message">
        <textarea
          v-model.trim="message"
          rows="3"
          class="form__input"
          placeholder="Drop your message here..."
          id="message"
          required
        />
        <label for="message" class="form__label">Drop your message here...</label>
      </div>
      <button v-if="!loading && !success" class="form__button send">Send</button>
      <button v-else-if="loading && !success" class="form__button send" @click.prevent="">
        <div class="loader"></div>
      </button>
      <button v-else-if="success && loading" class="form__button send">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </button>
      <button v-else class="form__button send">
        <svg class="checkmark error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M13 13 L39 39" />
          <path class="checkmark__check" fill="none" d="M39 13 L13 39" />
        </svg>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import axios from 'axios';

export default class Home extends Vue {
  loading = false;
  success = false;
  firstName = '';
  lastName = '';
  email = '';
  subject = '';
  message = '';

  submit() {
    this.loading = true;

    axios
      .post('https://rx65fhl4h1.execute-api.ap-southeast-1.amazonaws.com/dev/contact', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        subject: this.subject || 'No Title',
        message: this.message
      })
      .then(response => {
        if (response.status == 200) this.success = true;

        setTimeout(() => {
          // reset fields
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.subject = '';
          this.message = '';

          // remove loader
          this.loading = false;
          this.success = false;
        }, 2000);
      })
      .catch(error => {
        console.log(error);

        this.success = true;
        this.loading = false;

        setTimeout(() => {
          // remove loader
          this.loading = false;
          this.success = false;
        }, 2000);
      });
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 4rem;
  text-align: left;
  display: grid;
  gap: 2.5rem;
  grid-template-areas:
    'firstName lastName'
    'email email'
    'subject subject'
    'message message'
    'send send';

  $areas: firstName, lastName, email, subject, message, send;

  @each $area in $areas {
    .#{$area} {
      grid-area: $area;
    }
  }

  &__group {
    position: relative;
  }

  &__input {
    font-family: inherit;
    color: black;
    padding: 1.5rem 2rem;
    background: rgba(white, 0.8);
    border: none;
    border-bottom: solid 3px transparent;
    width: 100%;
    display: block;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-bottom: solid 3px var(--clr-primary);
      box-shadow: 0 0.5rem 0.5rem rgba(black, 0.6);

      &:invalid {
        border-bottom: solid 3px red;
      }
    }

    &:hover {
      background: rgba(#eee, 0.8);
    }

    &::placeholder {
      color: #999;
    }
  }

  &__label {
    position: absolute;
    font-weight: 700;
    margin-left: 2rem;
    margin-bottom: 0.7rem;
    display: block;
    transform: translateY(-100%);
    top: 0;
    transition: all 0.2s;
    color: var(--clr-primary);
  }

  &__input:placeholder-shown + &__label {
    top: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(50%);
    color: #999;
  }

  &__button {
    position: relative;
    background: rgba(white, 0.8);
    color: var(--clr-secondary);
    font-size: 26px;
    text-transform: uppercase;
    font-weight: 700;
    text-align: center;
    padding: 0 60px;
    height: 60px;
    border: none;
    width: 100%;

    &:hover,
    &:focus {
      background: rgba(#eee, 0.8);
    }

    & .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 10px;
      border: 1.1em solid rgba(0, 0, 0, 0.2);
      border-left: 1.1em solid var(--clr-secondary);
      animation: load8 1.1s infinite linear;
    }
  }

  @keyframes load8 {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .checkmark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px var(--clr-secondary);
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;

    &__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: var(--clr-secondary);
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    &__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    &.error {
      box-shadow: inset 0px 0px 0px #f00;
      animation: fill-error 0.4s ease-in-out 0.4s forwards;
    }

    &.error .checkmark__circle {
      stroke: #f00;
    }
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: translate(-50%, -50%) none;
    }
    50% {
      transform: translate(-50%, -50%) scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px var(--clr-secondary);
    }
  }

  @keyframes fill-error {
    100% {
      box-shadow: inset 0px 0px 0px 30px #f00;
    }
  }
}
</style>
