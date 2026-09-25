// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['**/*.md', '.agent/**', '.agents/**', 'docs/**', 'content/**', '.claude/**']
})
