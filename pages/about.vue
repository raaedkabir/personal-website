<template>
  <main>
    <AppModal class="modal" :open="showDialog" title="Buy Me a Coffee" @close="(showDialog = false), (amount = null)">
      <template>
        <div class="d-flex justify-between mt-3">
          <div class="item">
            <img src="@/assets/images/coffee/beans.svg" alt="coffee beans" />
            <AppButton flat :class="{ selected: amount === 100 }" @click="amount = 100">$ 1</AppButton>
          </div>
          <div class="item">
            <img src="@/assets/images/coffee/paper-cup.svg" alt="coffee cup" />
            <AppButton flat :class="{ selected: amount === 500 }" @click="amount = 500">$ 5</AppButton>
          </div>
          <div class="item">
            <img src="@/assets/images/coffee/machine.svg" alt="coffee machine" />
            <AppButton flat :class="{ selected: amount === 2000 }" @click="amount = 2000">$ 20</AppButton>
          </div>
          <div class="item">
            <img src="@/assets/images/coffee/shop.svg" alt="coffee shop" />
            <AppButton flat :class="{ selected: amount === 5000 }" @click="amount = 5000">$ 50</AppButton>
          </div>
        </div>
        <div class="d-flex justify-center">
          <AppCard v-if="showStripe" :amount="amount" style="margin: 3rem 0 0" />
        </div>
        <div class="attribution">
          Icons made by <AppLink href="https://www.flaticon.com/authors/srip" title="srip">srip</AppLink> from
          <AppLink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</AppLink>.
        </div>
      </template>
    </AppModal>
    <section>
      <div class="container pt-12 pb-6">
        <h1 class="heading__primary">About Me <span>_</span></h1>

        <div class="content">
          <div class="content--text">
            <p>
              I'm a self-taught programmer currently studying Electrical Engineering at
              <span class="upm-color">UPM</span>.
            </p>
            <br />
            <p>
              I started out with Python but accidentally stumbled into the world of JavaScript and Front-End Development
              where I found my home. I discovered that creating Web Apps fulfilled my two biggest passions of creating
              things and programming.
            </p>
            <br />
            <p>
              If you'd like, <span class="link" @click="showDialog = true">click here</span> to buy me a cup of coffee
              and help keep me awake.
            </p>
          </div>
          <div class="content--image">
            <!-- image goes here -->
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      showStripe: false,
      amount: null,
    };
  },

  watch: {
    amount(val, oldVal) {
      if (val) this.showStripe = true;
      else this.showStripe = false;

      if (val && oldVal !== null) {
        this.showStripe = false;
        this.$nextTick(() => {
          this.showStripe = true;
        });
      }
    },
  },

  head() {
    return {
      title: 'About Me',
      script: [{ src: 'https://js.stripe.com/v3/' }],
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  &--text {
    grid-area: 1 / 1 / 2 / 3;
    margin-right: 5rem;
  }

  &--image {
    grid-area: 1 / 3 / 2 / 4;
  }

  p {
    font-size: 2rem;

    .upm-color {
      font-weight: 700;
      color: #c8234a;
    }
  }
}

.modal {
  img {
    height: 8rem;
  }

  .attribution {
    text-align: right;
    margin-top: 1em;
    font-size: 1.4rem;
    font-weight: 300;
  }

  .selected {
    background: var(--clr-dark);
  }
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-bottom: 2rem;
  }
}
</style>
