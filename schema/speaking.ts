import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

const createButtonSchema = () => z.object({
  label: z.string().editor({ label: 'Beschriftung' }),
  icon: z.string().optional().editor({ label: 'Symbol' }),
  to: z.string().optional().editor({ label: 'Link-Ziel' }),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional().editor({ label: 'Farbe' }),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional().editor({ label: 'Größe' }),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional().editor({ label: 'Variante' }),
  target: z.enum(['_blank', '_self']).optional().editor({ label: 'Öffnen in' })
})

export const speakingSchema = z.object({
  ...lockPageMeta(),
  links: z.array(createButtonSchema()).editor({ label: 'Buttons' }),
  events: z.array(z.object({
    category: z.enum(['Live talk', 'Podcast', 'Conference']).editor({ label: 'Kategorie' }),
    title: z.string().editor({ label: 'Titel' }),
    date: z.date().editor({ label: 'Datum' }),
    location: z.string().editor({ label: 'Ort' }),
    url: z.string().optional().editor({ label: 'Link' })
  })).editor({ label: 'Veranstaltungen' })
})
