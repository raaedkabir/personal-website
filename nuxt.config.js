export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  generate: {
    fallback: '404.html',
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | Raaed M. Kabir` : 'Raaed M. Kabir';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Hi! My name is Raaed. I am a web developer that loves to bring awesome ideas to life. If you're in need of a website or have an idea for a project then come check out what my work and let's hook up!",
      },

      // OpenGraph tags
      {
        hid: 'og:title',
        property: 'og:title',
        content: "Raaed M. Kabir's Portfolio Site",
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: "Raaed M. Kabir's Portfolio Site",
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "Hi! My name is Raaed. I am a web developer that loves to bring awesome ideas to life. If you're in need of a website or have an idea for a project then come check out what my work and let's hook up!",
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.raaedkabir.com/',
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        itemprop: 'image',
        content: 'https://www.raaedkabir.com/og_image.png',
      },

      // Twitter tags
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: '@raaedkabir',
      },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: '@raaedkabir',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: 'https://www.raaedkabir.com/twitter_image.png',
      },

      // iOS tags
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Raaed M. Kabir',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto:wght@100;300;400;500;700;900&display=swap',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/scss/main'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/global.js'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://google-analytics.nuxtjs.org/
    '@nuxtjs/google-analytics',
  ],

  googleAnalytics: {
    id: 'G-HWHNZXBHTF',
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://www.npmjs.com/package/@nuxtjs/style-resources
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    scss: ['~/assets/scss/abstracts/_mixins.scss'],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
