import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/require-prop-types': 'off',
    'import/no-unused-modules': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
