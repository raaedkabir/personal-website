// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    // Playwright's report and test output
    ignores: ['playwright-report/', 'test-results/', 'blob-report/'],
  },
  {
    rules: {
      // section components under components/Pages are named after what they render (Hero, Works, ...)
      'vue/multi-word-component-names': 'off',
      // template formatting is left to the editor, as before
      'vue/html-self-closing': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['**/*.vue', '**/*.ts'],
    rules: {
      // unused callback arguments (d3 accessors etc.) are fine
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
    },
  },
);
