import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media', label: 'Bilddatei' }),
  alt: z.string().editor({ label: 'Alternativtext', tooltip: 'Bildbeschreibung für Screenreader und Suchmaschinen' })
})

const createAuthorSchema = () => z.object({
  name: z.string().editor({ label: 'Name' }),
  description: z.string().optional().editor({ label: 'Beschreibung' }),
  username: z.string().optional().editor({ label: 'Benutzername' }),
  twitter: z.string().optional().editor({ label: 'Twitter' }),
  to: z.string().optional().editor({ label: 'Profil-Link' }),
  avatar: createImageSchema().optional().editor({ label: 'Profilbild' })
})

export const pressSchema = z.object({
  ...lockPageMeta(),
  minRead: z.number().editor({ label: 'Lesedauer', description: 'Geschätzte Lesedauer in Minuten' }),
  date: z.date().editor({ label: 'Datum' }),
  image: z.string().nonempty().editor({ input: 'media', label: 'Titelbild' }),
  author: createAuthorSchema().editor({ label: 'Autor' })
})

export const pressIndexSchema = z.object({
  ...lockPageMeta()
})
