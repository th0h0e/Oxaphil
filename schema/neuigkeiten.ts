import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

export const neuigkeitenSchema = z.object({
  ...lockPageMeta()
})
