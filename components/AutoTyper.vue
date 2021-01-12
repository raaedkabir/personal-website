<template>
  <h2 ref="text" class="no-padding">&nbsp;</h2>
</template>

<script>
export default {
  props: {
    // array with texts to type in typewriter
    dataText: {
      type: Array,
      required: true,
    },
  },

  mounted() {
    // start the text animation
    setTimeout(() => {
      this.StartTextAnimation(0);
    }, 2500);
  },

  methods: {
    // type one text in the typwriter
    // keeps calling itself until the text is finished
    typeWriter(text, i, fnCallback) {
      // check if text isn't finished yet
      if (i < text.length) {
        try {
          // add next character
          this.$refs.text.innerHTML =
            text.substring(0, i + 1) + '<span class="auto-type--cursor" aria-hidden="true" />';
        } catch {}

        // wait for a while and call this function again for next character
        setTimeout(() => {
          this.typeWriter(text, i + 1, fnCallback);
        }, 100);
      }
      // text finished, call callback if there is a callback function
      else if (typeof fnCallback === 'function') {
        // call callback after timeout
        setTimeout(fnCallback, 700);
      }
    },

    // start a typewriter animation for a text in the dataText array
    StartTextAnimation(i) {
      if (i === this.dataText.length) return;

      // check if dataText[i] exists
      if (i < this.dataText[i].length) {
        this.typeWriter(this.dataText[i], 0, () => {
          // after callback (and whole text has been animated), start next text
          this.StartTextAnimation(i + 1);
        });
      }
    },
  },
};
</script>

<style lang="scss">
.auto-type--cursor {
  padding-right: 2px;
  border-right: 0.05em solid;
  animation: blink-cursor 1s steps(1) infinite;
}

@keyframes blink-cursor {
  50% {
    border-color: transparent;
  }
}
</style>
