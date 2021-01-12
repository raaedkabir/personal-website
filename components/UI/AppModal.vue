<template>
  <div>
    <transition name="fade">
      <div v-if="open" class="mask active" @click="$emit('close')" />
    </transition>
    <transition name="modal">
      <div v-if="open" class="dialog">
        <header>
          <slot name="header">
            <h1 class="heading__section">{{ title }}</h1>
          </slot>
        </header>
        <section>
          <slot />
        </section>
        <div class="actions">
          <slot name="actions">
            <AppButton @click.native.prevent="$emit('close')">Close</AppButton>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 50vw;
  padding: 3rem;
  background: grey;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  z-index: 100;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.5s ease-out;
}

.modal-leave-active {
  transition: all 0.5s ease-in;
}

.modal-enter {
  opacity: 0;
  transform: translate(-50%, -20%);
}

.modal-leave-to {
  opacity: 0;
  transform: translate(-50%, -80%);
}
</style>
