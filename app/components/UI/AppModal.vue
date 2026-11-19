<template>
  <div>
    <transition name="fade">
      <div v-if="open" class="mask active" @click="$emit('close')" />
    </transition>
    <transition name="modal" @enter="moveFocusIn" @before-leave="returnFocus">
      <div
        v-if="open"
        ref="dialog"
        class="dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown.esc="$emit('close')"
        @keydown.tab="trapFocus"
      >
        <header :id="titleId">
          <slot name="header">
            <h1 class="heading__section">{{ title }}</h1>
          </slot>
        </header>
        <section>
          <slot />
        </section>
        <div class="actions">
          <slot name="actions">
            <AppButton @click="$emit('close')">Close</AppButton>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useId } from 'vue';

// the elements Tab can stop at, once disabled, hidden and tabindex="-1" ones are filtered out
const focusable = 'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable]';
const isTabbable = (el) => el.tabIndex >= 0 && !el.disabled && el.getClientRects().length > 0;

// Not a native <dialog> opened with showModal(): that puts it in the top layer and makes the rest of the
// page inert, and the 3D Secure check that Stripe's confirmCardPayment() appends to <body> would open
// behind it, unclickable.
// The parent owns open: the Close button, a click on the mask and Escape only emit close.
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

  emits: ['close'],

  setup() {
    // the dialog is named by its header, whatever the header slot puts there
    return { titleId: useId() };
  },

  mounted() {
    // the enter hook only runs when open changes, so a modal that mounts open takes focus here
    if (this.open) this.moveFocusIn(this.$refs.dialog);
  },

  methods: {
    // Focus the dialog rather than its first control, which would look selected, so screen readers
    // start at its name. Remember what had focus to return it there.
    moveFocusIn(dialog) {
      this.opener = document.activeElement;
      dialog.focus();
    },

    returnFocus() {
      this.opener?.focus();
    },

    // Tab and Shift+Tab wrap around inside the dialog, so focus can't reach the page behind the mask
    trapFocus(event) {
      const dialog = event.currentTarget;
      const tabbable = [...dialog.querySelectorAll(focusable)].filter(isTabbable);
      if (!tabbable.length) {
        event.preventDefault();
        return;
      }

      const first = tabbable[0];
      const last = tabbable.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// above the header (1001) and the navigation menu (1002), so the mask covers the whole page
.mask {
  z-index: 1003;
}

.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 50vw;
  padding: 3rem;
  background: grey;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  z-index: 1004;

  @include respond(tab-port) {
    width: 80vw;
  }
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

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.5s ease-out;
}

.modal-leave-active {
  transition: all 0.5s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: translate(-50%, -20%);
}

.modal-leave-to {
  opacity: 0;
  transform: translate(-50%, -80%);
}
</style>
