<template>
  <!-- Display a payment form -->
  <form id="payment-form">
    <div id="card-element"><!--Stripe.js injects the Card Element--></div>
    <button id="submit" :disabled="disableBtn">
      <div id="spinner" class="spinner hidden"></div>
      <span id="button-text">Pay</span>
    </button>
    <p id="card-error" role="alert"></p>
    <p class="result-message hidden">Payment succeeded, thank you for the caffeine!</p>
  </form>
</template>

<script>
export default {
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      // Disable the button until we have Stripe set up on the page
      disableBtn: true,
      // Stripe object
      stripe: null,
    };
  },

  mounted() {
    // Initialize Stripe.js
    // eslint-disable-next-line
    this.stripe = Stripe(
      'pk_live_51I86YoE1Dvd9XZOw2p2mvVy7eNb9C186HwmFDq0f0N0WGd6NreEofjo56qdfD4doRgEg2wRnqa6QNcVzVDD4OYll00EpRPLBGF'
    );

    // Fetch a PaymentIntent
    this.fetchPaymentIntent();
  },

  methods: {
    // make a request to the server to create a new PaymentIntent
    fetchPaymentIntent() {
      fetch('https://ntksvk74p6.execute-api.ap-southeast-1.amazonaws.com/dev/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.amount),
      })
        .then((result) => result.json())
        .then((data) => {
          const elements = this.stripe.elements();
          const style = {
            base: {
              color: '#1e1e20',
              fontFamily: 'Roboto, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#1e1e20',
              },
            },
            invalid: {
              fontFamily: 'Roboto, sans-serif',
              color: '#ef0d33',
              iconColor: '#ef0d33',
            },
          };
          const card = elements.create('card', { style });

          // Stripe injects an iframe into the DOM
          card.mount('#card-element');
          card.on('change', (event) => {
            // Disable the Pay button if there are no card details in the Element
            this.disableBtn = event.empty;
            document.querySelector('#card-error').textContent = event.error ? event.error.message : '';
          });

          // Submit Event
          const form = document.getElementById('payment-form');
          form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Complete payment when the submit button is clicked
            this.payWithCard(this.stripe, card, data.clientSecret);
          });
        });
    },

    // Calls stripe.confirmCardPayment
    // If the card requires authentication Stripe shows a pop-up modal to
    // prompt the user to enter authentication details without leaving your page.
    payWithCard(stripe, card, clientSecret) {
      this.loading(true);
      stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card,
          },
        })
        .then((result) => {
          if (result.error) {
            // Show error to your customer
            this.showError(result.error.message);
          } else {
            // The payment succeeded!
            this.orderComplete(result.paymentIntent.id);
          }
        });
    },

    /* ------- UI helpers ------- */
    // Shows a success message when the payment is complete
    orderComplete(paymentIntentId) {
      this.loading(false);
      document.querySelector('.result-message').classList.remove('hidden');
      this.disableBtn = true;
    },

    // Show the customer the error from Stripe if their card fails to charge
    showError(errorMsgText) {
      this.loading(false);
      const errorMsg = document.querySelector('#card-error');
      errorMsg.textContent = errorMsgText;
      setTimeout(() => {
        errorMsg.textContent = '';
      }, 4000);
    },

    // Show a spinner on payment submission
    loading(isLoading) {
      if (isLoading) {
        // Disable the button and show a spinner
        this.disableBtn = true;
        document.querySelector('#spinner').classList.remove('hidden');
        document.querySelector('#button-text').classList.add('hidden');
      } else {
        this.disableBtn = false;
        document.querySelector('#spinner').classList.add('hidden');
        document.querySelector('#button-text').classList.remove('hidden');
      }
    },
  },
};
</script>

<style scoped>
form {
  width: 100%;
  align-self: center;
}

input {
  border-radius: 6px;
  margin-bottom: 6px;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  height: 44px;
  font-size: 16px;
  width: 100%;
  background: white;
}

.result-message {
  line-height: 22px;
  font-size: 16px;
}

.result-message a {
  color: rgb(89, 111, 214);
  font-weight: 600;
  text-decoration: none;
}

.hidden {
  display: none;
}

#card-error {
  color: var(--clr-text);
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}

#card-element {
  border-radius: 4px 4px 0 0;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  height: 44px;
  width: 100%;
  background: white;
}

#payment-request-button {
  margin-bottom: 32px;
}

/* Buttons and links */
button {
  background: #5469d4;
  color: #ffffff;
  font-family: Arial, sans-serif;
  border-radius: 0 0 4px 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}

button:hover {
  filter: contrast(115%);
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}

.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}

.spinner:before,
.spinner:after {
  position: absolute;
  content: '';
}

.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: #5469d4;
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}

.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: #5469d4;
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}

@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
