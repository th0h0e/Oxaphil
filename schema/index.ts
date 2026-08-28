import { z } from '@nuxt/content'
import { lockPageMeta } from './shared'

// Every field carries a German `label` so the Studio form matches the site's
// editing language (see `studio.i18n.defaultLocale` in nuxt.config.ts).
// Without it Studio falls back to the raw key.

const createBaseSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ label: 'Beschreibung' })
})

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

const createTestimonialSchema = () => z.object({
  quote: z.string().editor({ input: 'textarea', label: 'Zitat' }),
  author: createAuthorSchema().editor({ label: 'Person' })
})

const createButtonSchema = () => z.object({
  label: z.string().editor({ label: 'Beschriftung' }),
  icon: z.string().optional().editor({ label: 'Symbol' }),
  to: z.string().optional().editor({ label: 'Link-Ziel' }),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional().editor({ label: 'Farbe' }),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional().editor({ label: 'Größe' }),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional().editor({ label: 'Variante' }),
  target: z.enum(['_blank', '_self']).optional().editor({ label: 'Öffnen in' })
})

export const indexSchema = z.object({
  ...lockPageMeta(),
  hero: z.object({
    links: createButtonSchema()
      .omit({ target: true })
      .extend({ email: z.string().optional().editor({ label: 'E-Mail-Adresse' }) })
      .editor({ label: 'Button' })
  }).editor({ label: 'Hero-Bereich' }),
  video: z.object({
    link: z.string().url().editor({ label: 'Video-Link' })
  }).optional().editor({ label: 'Video' }),
  valueProps: createBaseSchema().extend({
    items: z.array(createBaseSchema().extend({
      icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' })
    })).editor({ label: 'Vorteile' })
  }).optional().editor({ label: 'Value Proposition' }),
  faq: createBaseSchema().extend({
    categories: z.array(
      z.object({
        title: z.string().nonempty().editor({ label: 'Kategorie' }),
        questions: z.array(
          z.object({
            label: z.string().nonempty().editor({ label: 'Frage' }),
            content: z.string().nonempty().editor({ input: 'textarea', label: 'Antwort' })
          })
        ).editor({ label: 'Fragen' })
      })).editor({ label: 'Kategorien' })
  }).editor({ label: 'Häufige Fragen' }),
  testimonials: z.array(createTestimonialSchema()).editor({ label: 'Referenzen' }),
  press: createBaseSchema().editor({ label: 'Fachbeiträge' })
})
