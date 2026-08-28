import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

const createBaseSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ label: 'Beschreibung' })
})

export const wirSchema = z.object({
  ...lockPageMeta(),
  team: createBaseSchema().editor({ label: 'Team' })
})

export const wirTechnologySchema = createBaseSchema().extend({
  content: z.string().editor({ input: 'textarea', label: 'Inhalt' })
})
