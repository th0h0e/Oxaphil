import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

const createBaseSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ label: 'Beschreibung' })
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media', label: 'Bilddatei' }),
  alt: z.string().editor({ label: 'Alternativtext', tooltip: 'Bildbeschreibung für Screenreader und Suchmaschinen' })
})

const createFeatureSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ input: 'textarea', label: 'Beschreibung' }),
  icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' })
})

export const materialienSchema = z.object({
  ...lockPageMeta()
})

export const materialienSectionsSchema = z.object({
  id: z.string().editor({ label: 'ID', tooltip: 'Technische Kennung – nur ändern, wenn nötig' }),
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().optional().editor({ input: 'textarea', label: 'Beschreibung' }),
  icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' }),
  image: createImageSchema().editor({ label: 'Bild' }),
  features: z.array(createFeatureSchema()).editor({ label: 'Merkmale' })
})

export const materialienLiteraturSchema = createBaseSchema().extend({
  references: z.array(z.object({
    authors: z.string().editor({ label: 'Autoren' }),
    title: z.string().editor({ label: 'Titel' }),
    journal: z.string().optional().editor({ label: 'Zeitschrift' }),
    year: z.number().optional().editor({ label: 'Jahr' }),
    volume: z.string().optional().editor({ label: 'Band' }),
    pages: z.string().optional().editor({ label: 'Seiten' })
  })).editor({ label: 'Quellenangaben' })
})
