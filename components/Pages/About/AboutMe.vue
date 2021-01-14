<template>
  <div>
    <AppModal class="modal" :open="showDialog" title="Buy Me a Coffee" @close="(showDialog = false), (amount = null)">
      <template>
        <div class="d-flex justify-between mt-3">
          <div class="modal__item">
            <img src="@/assets/images/coffee/beans.svg" alt="coffee beans" />
            <AppButton flat :class="{ selected: amount === 100 }" @click="amount = 100">$ 1</AppButton>
          </div>
          <div class="modal__item">
            <img src="@/assets/images/coffee/paper-cup.svg" alt="coffee cup" />
            <AppButton flat :class="{ selected: amount === 500 }" @click="amount = 500">$ 5</AppButton>
          </div>
          <div class="modal__item">
            <img src="@/assets/images/coffee/machine.svg" alt="coffee machine" />
            <AppButton flat :class="{ selected: amount === 2000 }" @click="amount = 2000">$ 20</AppButton>
          </div>
          <div class="modal__item">
            <img src="@/assets/images/coffee/shop.svg" alt="coffee shop" />
            <AppButton flat :class="{ selected: amount === 5000 }" @click="amount = 5000">$ 50</AppButton>
          </div>
        </div>
        <div class="d-flex justify-center">
          <AppStripe v-if="showStripe" :amount="amount" style="margin: 3rem 0 0" />
        </div>
        <div class="attribution">
          Icons made by
          <AppLink
            href="https://www.flaticon.com/authors/srip"
            title="srip"
            target="_blank"
            rel="noopener noreferrer nofollow"
            >srip</AppLink
          >
          from
          <AppLink href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer nofollow"
            >www.flaticon.com</AppLink
          >.
        </div>
      </template>
    </AppModal>

    <div class="about-me">
      <div class="about-me--image">
        <!-- image goes here -->
      </div>
      <div class="about-me--text">
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
          If you'd like, <span class="link" @click="showDialog = true">click here</span> to buy me a cup of coffee and
          help keep me awake.
        </p>
      </div>
    </div>
  </div>
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
};
</script>

<style lang="scss" scoped>
.about-me {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  &--text {
    grid-area: 1 / 2 / 2 / 4;
    margin-left: 5rem;
  }

  &--image {
    grid-area: 1 / 1 / 2 / 2;
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

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      margin-bottom: 2rem;
    }
  }
}
</style>
