import { z } from '@nuxt/content'
import { lockPageMeta, seoPageMeta } from './shared'

export const datenschutzSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})
