<template>
  <div class="container" style="z-index: 100000000000000000">
    <form @submit.prevent="" class="form">
      <div class="form__group firstName">
        <input type="text" class="form__input" placeholder="First Name" id="firstName" required />
        <label for="firstName" class="form__label">First Name</label>
      </div>
      <div class="form__group lastName">
        <input type="text" class="form__input" placeholder="Last Name" id="lastName" required />
        <label for="lastName" class="form__label">Last Name</label>
      </div>
      <div class="form__group email">
        <input type="email" class="form__input" placeholder="Email" id="email" required />
        <label for="email" class="form__label">Email</label>
      </div>
      <div class="form__group subject">
        <input
          type="text"
          class="form__input"
          placeholder="Message Subject"
          id="subject"
          required
        />
        <label for="subject" class="form__label">Message Subject</label>
      </div>
      <div class="form__group message">
        <textarea
          type="text"
          rows="3"
          class="form__input"
          placeholder="Drop your message here..."
          id="message"
          required
        />
        <label for="message" class="form__label">Drop your message here...</label>
      </div>
      <button class="form__button send">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Home extends Vue {}
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

  // textarea + .form__label {
  //   transform: translateY(-11rem);
  // }

  &__input:placeholder-shown + &__label {
    top: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(50%);
    color: #999;
  }

  &__button {
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
  }
}
</style>
