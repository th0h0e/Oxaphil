import { z } from '@nuxt/content'
import { lockPageMeta, seoPageMeta } from './shared'

export const impressumSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})
