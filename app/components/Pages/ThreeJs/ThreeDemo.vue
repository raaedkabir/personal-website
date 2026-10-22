<template>
  <div>
    <TheNavbar />
    <main class="demo">
      <div ref="canvas" class="demo__canvas" />
      <p class="demo__status" role="status">{{ status }}</p>
      <div v-if="gui" ref="gui" class="demo__gui" />
      <div class="demo__panel">
        <AppLink to="/works/threejs"><span aria-hidden="true">←</span> All Three.js demos</AppLink>
        <h1 class="demo__title heading__secondary">{{ title }}</h1>
        <slot />
        <p v-if="$slots.credits" class="demo__credits">
          <slot name="credits" />
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import WebGL from 'three/addons/capabilities/WebGL.js';
import TheNavbar from '@/components/Layout/TheNavbar.vue';

export default {
  components: {
    TheNavbar,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    load: {
      type: Function,
      required: true,
    },
    gui: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      status: 'Loading…',
    };
  },

  created() {
    // three.js objects are kept out of `data` so Vue doesn't make them reactive
    this.demo = null;
    this.isUnmounted = false;
  },

  beforeUnmount() {
    // stop the render loop and free the GPU, otherwise it keeps running after leaving the page
    this.isUnmounted = true;
    this.demo?.dispose();
    this.demo = null;
  },

  async mounted() {
    if (!WebGL.isWebGL2Available()) {
      this.status = '';
      this.$refs.canvas.appendChild(WebGL.getWebGL2ErrorMessage());
      return;
    }

    try {
      const { create } = await this.load();
      // the page may have been left while three.js was loading
      if (this.isUnmounted) return;

      const demo = await create({
        container: this.$refs.canvas,
        guiContainer: this.$refs.gui,
        isCancelled: () => this.isUnmounted,
      });
      if (this.isUnmounted) {
        demo?.dispose();
        return;
      }

      this.demo = demo;
      this.status = '';
    } catch (error) {
      console.error(error);
      if (!this.isUnmounted) this.status = 'Sorry, this demo failed to load.';
    }
  },
};
</script>

<style lang="scss" scoped>
.demo {
  position: fixed;
  inset: 13rem 0 0;
  min-height: 0;
  overflow: hidden;

  @include respond(tab-port) {
    top: 9rem;
  }

  @include respond(phone) {
    display: flex;
    flex-direction: column;
  }
}

.demo__canvas {
  position: absolute;
  inset: 0;

  @include respond(phone) {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  :deep(canvas) {
    display: block;
  }
}

.demo__status {
  position: absolute;
  top: 40%;
  left: 0;
  width: 100%;
  padding: 0 2rem;
  text-align: center;
  pointer-events: none;

  &:empty {
    display: none;
  }
}

.demo__gui {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.demo__panel {
  position: absolute;
  left: 3rem;
  bottom: 3rem;
  max-width: 52rem;
  padding: 2rem 2.5rem;
  font-size: 1.5rem;
  background: var(--clr-dark);

  @include respond(phone) {
    position: static;
    max-width: none;
  }
}

.demo__title {
  margin-top: 1.2rem;
  font-size: 3.6rem;
}

:slotted(p),
.demo__credits {
  margin-top: 1rem;
}

.demo__credits {
  font-size: 1.4rem;
  color: var(--clr-grey);
}
</style>
