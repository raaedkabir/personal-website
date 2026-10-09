<template>
  <div class="skill">
    <h3 class="mb-2 heading__sub-section">{{ name }}</h3>
    <div class="progress">
      <div class="progress-bar" :style="`width: ${proficiency}`" />
      <span>{{ proficiency }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    proficiency: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.skill {
  width: 100%;

  .progress {
    position: relative;
    height: 20px;
    width: 100%;
    background: gray;
  }

  .progress-bar {
    height: 100%;
    background: var(--clr-primary);
  }

  span {
    position: absolute;
    bottom: 100%;
    right: 0;
    font-size: 1.8rem;
  }
}
</style>
