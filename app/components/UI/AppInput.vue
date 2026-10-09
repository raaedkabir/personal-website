<template>
  <div v-if="!textArea" class="group">
    <input :id="id" v-bind="$attrs" v-on="listeners" />
    <label :for="id">{{ label }}</label>
  </div>
  <div v-else class="group">
    <textarea :id="id" v-bind="$attrs" v-on="listeners" />
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    textArea: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: (event) => this.$emit('input', event.target.value),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.group {
  position: relative;

  input,
  textarea {
    resize: none;
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

  label {
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

  input:placeholder-shown + label,
  textarea:placeholder-shown + label {
    top: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(50%);
    color: #999;
  }
}
</style>
