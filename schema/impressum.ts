import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

export const impressumSchema = z.object({
  ...lockPageMeta()
})
