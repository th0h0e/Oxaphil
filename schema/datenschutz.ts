import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

export const datenschutzSchema = z.object({
  ...lockPageMeta()
})
