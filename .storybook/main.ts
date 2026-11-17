import type { StorybookConfig } from '@storybook-vue/nuxt';

// https://storybook.js.org/docs/configure
const config: StorybookConfig = {
  // stories sit next to their components and are titled by folder, e.g. UI/AppButton
  stories: [{ directory: '../app/components', files: '**/*.stories.ts' }],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  // Builds the stories with the Vite config from nuxt.config.ts: auto-imports, global styles and Nuxt plugins.
  // Docs pages and controls get props, events and slots from the default docgen, vue-docgen-api. Storybook
  // warns that it's deprecated, but its replacements don't work with this framework yet: the vue-component-meta
  // plugin breaks hot reloading of stories, and experimentalDocgenServer finds no props.
  framework: '@storybook-vue/nuxt',
  viteFinal(config, { configType }) {
    // The framework builds Nuxt's Vite config as for production, which leaves Vue's hot reload runtime out,
    // so component edits wouldn't show in storybook dev until the page was reloaded
    if (configType === 'DEVELOPMENT') {
      config.define = { ...config.define, 'process.env.NODE_ENV': JSON.stringify('development') };
    }

    // The framework turns off Vite's dependency discovery, so CommonJS packages that the stories' components
    // import aren't converted to ES modules unless they're listed here (AppPrism's imports fail to load otherwise)
    config.optimizeDeps ??= {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      'prismjs',
      'prismjs/components/prism-javascript',
      'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace',
    ];
    return config;
  },
};

export default config;
