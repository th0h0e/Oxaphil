// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
// custom flat configs go here
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
})
