const description =
  "Hi! My name is Raaed. I am a web developer that loves to bring awesome ideas to life. If you're in need of a website or have an idea for a project then come check out what my work and let's hook up!";

export default defineNuxtConfig({
  compatibilityDate: '2026-10-08',

  // Global page headers (https://nuxt.com/docs/api/nuxt-config#head)
  // The titleTemplate lives in app/plugins/title-template.js since it is a function.
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: description },

        // OpenGraph tags
        { property: 'og:title', content: "Raaed Kabir's Portfolio Site" },
        { property: 'og:site_name', content: "Raaed Kabir's Portfolio Site" },
        { property: 'og:description', content: description },
        { property: 'og:url', content: 'https://www.raaedkabir.com/' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', itemprop: 'image', content: 'https://www.raaedkabir.com/og_image.png' },

        // Twitter tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@raaedkabir' },
        { name: 'twitter:creator', content: '@raaedkabir' },
        { name: 'twitter:image', content: 'https://www.raaedkabir.com/twitter_image.png' },

        // iOS tags
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'apple-mobile-web-app-title', content: 'Raaed Kabir' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto:wght@100;300;400;500;700;900&display=swap',
        },
      ],
    },
  },

  // Global CSS (https://nuxt.com/docs/api/nuxt-config#css)
  css: ['~/assets/scss/main.scss'],

  // Only the App* UI components are registered globally; everything else is imported explicitly
  components: ['~/components/UI'],

  modules: [
    // https://eslint.nuxt.com/packages/module
    '@nuxt/eslint',
    // https://vite-pwa-org.netlify.app/frameworks/nuxt
    '@vite-pwa/nuxt',
    // https://github.com/johannschopplich/nuxt-gtag
    'nuxt-gtag',
  ],

  gtag: {
    id: 'G-HWHNZXBHTF',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Raaed Kabir',
      short_name: 'Raaed Kabir',
      description,
      lang: 'en',
      display: 'standalone',
      theme_color: '#1e1e20',
      background_color: '#1e1e20',
      icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
    },
    workbox: {
      // every page is prerendered, so there is no SPA shell to fall back to
      navigateFallback: null,
      // precache the hashed app assets (@vite-pwa/nuxt adds the page payloads); pages are left out because
      // the module rewrites them to extension-less URLs (e.g. /404) that a plain static host doesn't serve
      globPatterns: ['**/*.{js,css}'],
      runtimeCaching: [
        // pages come from the network when online and from the cache when offline
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
          },
        },
        // the blog images are too big to precache, so cache them as they are viewed
        {
          urlPattern: /\/_nuxt\/.+\.(?:png|jpe?g|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 60 },
          },
        },
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // make the mixins available in every stylesheet and <style> block
          additionalData: '@import "~/assets/scss/abstracts/_mixins.scss";',
          // the stylesheets are built on @import; moving them to @use is a separate change
          silenceDeprecations: ['import'],
        },
      },
    },
  },
});
