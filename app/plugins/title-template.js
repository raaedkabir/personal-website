// set here rather than in app.vue so the error page, which replaces app.vue, gets it too
export default defineNuxtPlugin(() => {
  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | Raaed Kabir` : 'Raaed Kabir';
    },
  });
});
