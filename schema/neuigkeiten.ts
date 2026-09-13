import { z } from '@nuxt/content'
import { lockPageMeta, seoPageMeta } from './shared'

export const neuigkeitenSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})
