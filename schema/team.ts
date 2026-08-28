import { z } from '@nuxt/content'

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media', label: 'Bilddatei' }),
  alt: z.string().editor({ label: 'Alternativtext', tooltip: 'Bildbeschreibung für Screenreader und Suchmaschinen' })
})

export const teamSchema = z.object({
  id: z.string().editor({ label: 'ID', tooltip: 'Technische Kennung – nur ändern, wenn nötig' }),
  name: z.string().editor({ label: 'Name' }),
  role: z.string().editor({ label: 'Rolle' }),
  description: z.string().optional().editor({ input: 'textarea', label: 'Beschreibung' }),
  tags: z.array(z.string()).optional().editor({ label: 'Schlagworte' }),
  avatar: createImageSchema().optional().editor({ label: 'Profilbild' })
})
