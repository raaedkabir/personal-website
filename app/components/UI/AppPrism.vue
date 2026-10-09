<template>
  <!-- eslint-disable-next-line -->
  <code :class="`language-${lang}`" v-html="html"></code>
</template>

<script>
import * as Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import Normalizer from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

// Create a new Normalizer object
const nw = new Normalizer({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
  // 'break-lines': 80,
  // indent: 2,
  // 'remove-initial-line-feed': false,
  // 'tabs-to-spaces': 4,
  // 'spaces-to-tabs': 4
});

export default {
  props: {
    lang: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      html: null,
    };
  },

  mounted() {
    const code = nw.normalize(this.$slots.default[0].text);

    this.html = Prism.highlight(code, Prism.languages[this.lang]);
  },
};
</script>
