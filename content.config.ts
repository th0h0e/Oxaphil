import { defineCollection, defineContentConfig, property, z } from '@nuxt/content'

// Every field carries a German `label` so the Studio form matches the site's
// editing language (see `studio.i18n.defaultLocale` in nuxt.config.ts).
// Without it Studio falls back to the raw key, e.g. "chemicalName".

const createBaseSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ label: 'Beschreibung' })
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

const createFeatureSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ input: 'textarea', label: 'Beschreibung' }),
  icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' })
})

// Locks down the fields Nuxt Content auto-adds to `page` collections (seo, navigation)
// so Studio can't expose them for editing. `seo` always falls back to title/description
// (see app/pages/*.vue), and navigation stays fixed to its default (`true`).
const lockPageMeta = () => ({
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional().default({}).editor({ hidden: true }),
  navigation: z.boolean().default(true).editor({ hidden: true })
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
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
    }),
    press: defineCollection({
      type: 'page',
      source: 'press/*.md',
      schema: z.object({
        ...lockPageMeta(),
        minRead: z.number().editor({ label: 'Lesedauer', description: 'Geschätzte Lesedauer in Minuten' }),
        date: z.date().editor({ label: 'Datum' }),
        image: z.string().nonempty().editor({ input: 'media', label: 'Titelbild' }),
        author: createAuthorSchema().editor({ label: 'Autor' })
      })
    }),
    pressIndex: defineCollection({
      type: 'page',
      source: 'press.yml',
      schema: z.object({
        ...lockPageMeta()
      })
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: z.object({
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
    }),
    neuigkeiten: defineCollection({
      type: 'page',
      source: 'neuigkeiten.yml',
      schema: z.object({
        ...lockPageMeta(),
        about: z.object({
          title: z.string().editor({ label: 'Titel' }),
          logo: createImageSchema().editor({ label: 'Logo' }),
          content: z.string().editor({ input: 'textarea', label: 'Inhalt' })
        }).editor({ label: 'Über Oxaphil' }),
        items: z.array(z.object({
          title: z.string().editor({ label: 'Titel' }),
          date: z.date().editor({ label: 'Datum' }),
          location: z.string().optional().editor({ label: 'Ort' }),
          description: z.string().editor({ input: 'textarea', label: 'Beschreibung' }),
          content: z.string().optional().editor({ input: 'textarea', label: 'Inhalt' }),
          images: z.array(createImageSchema()).editor({ label: 'Bilder' }),
          to: z.string().optional().editor({ label: 'Link' })
        })).editor({ label: 'Einträge' })
      })
    }),
    materialien: defineCollection({
      type: 'page',
      source: 'materialien.yml',
      schema: z.object({
        ...lockPageMeta()
      })
    }),
    bestellung: defineCollection({
      type: 'page',
      source: 'bestellung.yml',
      schema: z.object({
        ...lockPageMeta(),
        content: z.string().editor({ input: 'textarea', label: 'Einleitungstext' }),
        // `email` renders the button as a mailto: link (falling back to the
        // app-config address when blank), mirroring the hero link on index.yml.
        links: z.array(createButtonSchema().extend({
          email: z.string().optional().editor({ label: 'E-Mail-Adresse', description: 'Statt eines Link-Ziels: erzeugt einen mailto:-Link' })
        })).editor({ label: 'Buttons' }),
        // Shape is read from ContactCard.vue's props rather than declared here, so
        // adding a prop to that component is enough to expose it in Studio.
        // `.inherit()` replaces the field's editor options, so this one field's
        // label stays auto-generated; its German sub-labels come from the JSDoc
        // comments on ContactCard.vue's props.
        contactCard: property(z.object({})).inherit('app/components/ContactCard.vue')
      })
    }),
    bestellungProduct: defineCollection({
      type: 'data',
      source: 'bestellung/produkt.yml',
      schema: z.object({
        title: z.string().editor({ label: 'Abschnittstitel' }),
        name: z.string().editor({ label: 'Produktname' }),
        chemicalName: z.string().editor({ label: 'Chemische Bezeichnung' }),
        specs: z.array(z.object({
          label: z.string().editor({ label: 'Bezeichnung' }),
          value: z.string().editor({ label: 'Wert' })
        })).editor({ label: 'Technische Daten' }),
        price: z.string().editor({ label: 'Preis' }),
        image: createImageSchema().editor({ label: 'Produktbild' })
      })
    }),
    impressum: defineCollection({
      type: 'page',
      source: 'impressum-de.md',
      schema: z.object({
        ...lockPageMeta()
      })
    }),
    datenschutz: defineCollection({
      type: 'page',
      source: 'datenschutzerklaerung-2.md',
      schema: z.object({
        ...lockPageMeta()
      })
    }),
    wir: defineCollection({
      type: 'page',
      source: 'wir.yml',
      schema: z.object({
        ...lockPageMeta(),
        team: createBaseSchema().editor({ label: 'Team' })
      })
    }),
    wirTechnology: defineCollection({
      type: 'data',
      source: 'wir/technologie.yml',
      schema: createBaseSchema().extend({
        content: z.string().editor({ input: 'textarea', label: 'Inhalt' })
      })
    }),
    team: defineCollection({
      type: 'data',
      source: 'team/*.yml',
      schema: z.object({
        id: z.string().editor({ label: 'ID', tooltip: 'Technische Kennung – nur ändern, wenn nötig' }),
        name: z.string().editor({ label: 'Name' }),
        role: z.string().editor({ label: 'Rolle' }),
        description: z.string().optional().editor({ input: 'textarea', label: 'Beschreibung' }),
        tags: z.array(z.string()).optional().editor({ label: 'Schlagworte' }),
        avatar: createImageSchema().optional().editor({ label: 'Profilbild' })
      })
    }),
    materialienSections: defineCollection({
      type: 'data',
      source: { include: 'materialien/*.yml', exclude: ['materialien/literatur.yml'] },
      schema: z.object({
        id: z.string().editor({ label: 'ID', tooltip: 'Technische Kennung – nur ändern, wenn nötig' }),
        title: z.string().editor({ label: 'Titel' }),
        description: z.string().optional().editor({ input: 'textarea', label: 'Beschreibung' }),
        icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' }),
        image: createImageSchema().editor({ label: 'Bild' }),
        features: z.array(createFeatureSchema()).editor({ label: 'Merkmale' })
      })
    }),
    materialienLiteratur: defineCollection({
      type: 'data',
      source: 'materialien/literatur.yml',
      schema: createBaseSchema().extend({
        references: z.array(z.object({
          authors: z.string().editor({ label: 'Autoren' }),
          title: z.string().editor({ label: 'Titel' }),
          journal: z.string().optional().editor({ label: 'Zeitschrift' }),
          year: z.number().optional().editor({ label: 'Jahr' }),
          volume: z.string().optional().editor({ label: 'Band' }),
          pages: z.string().optional().editor({ label: 'Seiten' })
        })).editor({ label: 'Quellenangaben' })
      })
    })
  }
})
