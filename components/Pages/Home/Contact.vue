<template>
  <div class="container">
    <form id="contact" class="form" @submit.prevent="submit">
      <AppInput
        id="firstName"
        v-model.trim="firstName"
        class="firstName"
        label="First Name"
        type="text"
        placeholder="First Name"
        required
      />
      <AppInput
        id="lastName"
        v-model.trim="lastName"
        class="lastName"
        label="Last Name"
        type="text"
        placeholder="Last Name"
      />
      <AppInput id="email" v-model.trim="email" class="email" label="Email" type="email" placeholder="Email" required />
      <AppInput
        id="subject"
        v-model.trim="subject"
        class="subject"
        label="Message Subject"
        type="text"
        placeholder="Message Subject"
        required
      />
      <AppInput
        id="message"
        v-model.trim="message"
        text-area
        class="message"
        rows="3"
        label="Drop your message here..."
        type="text"
        placeholder="Drop your message here..."
        required
      />
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

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      success: false,
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    };
  },

  methods: {
    submit() {
      this.loading = true;

      axios
        .post('https://rx65fhl4h1.execute-api.ap-southeast-1.amazonaws.com/dev/contact', {
          firstName: this.firstName,
          lastName: this.lastName || '',
          email: this.email,
          subject: this.subject,
          message: this.message,
        })
        .then((response) => {
          if (response.status === 200) this.success = true;

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
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);

          this.success = true;
          this.loading = false;

          setTimeout(() => {
            // remove loader
            this.loading = false;
            this.success = false;
          }, 2000);
        });
    },
  },
};
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
