<template>
  <div class="fyp-app">
    <aside class="demo-bar" aria-label="About this demo">
      <p>
        A demo of the admin dashboard from my <NuxtLink to="/works/fyp">final year project</NuxtLink>. Its data stays in this
        browser.
      </p>
      <button type="button" @click="reset">Reset demo data</button>
    </aside>
    <slot />
  </div>
</template>

<script setup>
// the dashboard's own look (light, cyan and plum, from the original's SCSS) inside the dark portfolio site
import { resetDemo } from '~/utils/fyp/db';

const reset = async () => {
  if (!confirm('Reset the demo? This removes your face photo, the employees you added and new check-ins.')) return;
  resetDemo();
  await navigateTo('/works/fyp/login');
  // reload so every page reads the fresh data
  window.location.reload();
};
</script>

<style lang="scss" scoped>
.fyp-app {
  --spacer: 1.8rem;
  --clr-primary-200: hsl(195, 61%, 72%);
  --clr-primary-400: hsl(190, 77%, 46%);
  // darker shades than the original's, so white text on them passes WCAG AA
  --clr-primary-600: hsl(191, 85%, 28%);
  --clr-primary-800: hsl(191, 85%, 20%);
  --clr-secondary-400: hsl(332, 25%, 27%);
  --clr-secondary-700: hsl(330, 15%, 22%);
  --clr-light-400: hsl(45, 18%, 82%);
  --clr-neutral-100: hsl(0, 0%, 100%);
  --clr-neutral-200: hsl(0, 0%, 95%);
  --clr-neutral-300: hsl(0, 0%, 80%);
  --clr-neutral-500: hsl(0, 0%, 36%);
  --clr-neutral-600: hsl(0, 0%, 15%);
  --clr-neutral-700: hsl(0, 0%, 0%);
  --clr-danger: hsl(348, 83%, 38%);
  --clr-success: hsl(145, 63%, 26%);
  --clr-focus: hsl(191, 85%, 28%);

  min-height: 100vh;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--clr-neutral-700);
  background: var(--clr-light-400);

  :deep(a:focus-visible),
  :deep(button:focus-visible),
  :deep(select:focus-visible) {
    outline: 3px solid var(--clr-focus);
    outline-offset: 2px;
  }

  :deep(.visually-hidden) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}

.demo-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.4rem;
  text-align: center;
  color: #fff;
  background: var(--clr-secondary-700);

  a {
    color: inherit;
    font-weight: 600;
  }

  button {
    padding: 0.2rem 1rem;
    border: 1px solid currentColor;
    border-radius: 3px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover {
      background: rgb(255 255 255 / 15%);
    }
  }

  :deep(a:focus-visible),
  button:focus-visible {
    outline-color: #fff;
  }
}
</style>
