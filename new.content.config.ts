import { defineCollection, defineContentConfig, property, z } from '@nuxt/content'
import { defineRobotsSchema, defineSchemaOrgSchema, defineSitemapSchema } from '@nuxtjs/seo/content'

// ============================================================================
// Consolidated content configuration.
//
// This file is an in-progress copy of the current split setup:
//   - `content.config.ts`  (collections)
//   - `schema/*.ts`        (one schema module per content domain)
//   - `schema/shared.ts`   (shared page meta helpers)
//
// Keep the schema/collections structure identical to the originals — treat this
// file as a single-file alternative to replace the split setup, not as a place
// to redesign the schemas.
// ============================================================================

// ----------------------------------------------------------------------------
// Shared page meta helpers (previously schema/shared.ts)
// ----------------------------------------------------------------------------

// Locks down the fields Nuxt Content auto-adds to `page` collections (seo, navigation)
// so Studio can't expose them for editing. `seo` always falls back to title/description
// (see app/pages/*.vue), and navigation stays fixed to its default (`true`).
//
// Shared across every page collection — keep it here rather than duplicating the
// 4 lines into 10 schema files.
const lockPageMeta = () => ({
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional().default({}).editor({ hidden: true }),
  navigation: z.boolean().default(true).editor({ hidden: true })
})

// Adds the Nuxt SEO module schema fields to a `page` collection so content
// files can control sitemap + robots per entry (and optionally schema.org).
//
// Imported from `@nuxtjs/seo/content` (the meta-module) rather than the
// individual `@nuxtjs/sitemap` / `@nuxtjs/robots` packages, which are not
// resolvable standalone in this repo. Pass `{ z }` to each builder so the
// field types are built with the zod instance `@nuxt/content` exports —
// `defineSitemapSchema()` otherwise pulls in its own zod 4 copy and
// `toJSONSchema()` can't read it.
const seoPageMeta = (opts?: { schemaOrg?: boolean }) => ({
  sitemap: defineSitemapSchema({ z }),
  robots: defineRobotsSchema({ z }),
  ...(opts?.schemaOrg
    ? { schemaOrg: defineSchemaOrgSchema({ z }) }
    : {})
})

// ----------------------------------------------------------------------------
// Reusable field builders shared across multiple schemas.
// Kept as local functions, exactly as each schema file declared them.
// ----------------------------------------------------------------------------

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

const createFeatureSchema = () => z.object({
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().editor({ input: 'textarea', label: 'Beschreibung' }),
  icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' })
})

// ----------------------------------------------------------------------------
// Schemas (previously schema/*.ts)
// ----------------------------------------------------------------------------

// schema/index.ts
// Every field carries a German `label` so the Studio form matches the site's
// editing language (see `studio.i18n.defaultLocale` in nuxt.config.ts).
// Without it Studio falls back to the raw key.
const indexSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta(),
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

// schema/press.ts
const pressSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta(),
  minRead: z.number().editor({ label: 'Lesedauer', description: 'Geschätzte Lesedauer in Minuten' }),
  date: z.date().editor({ label: 'Datum' }),
  image: z.string().nonempty().editor({ input: 'media', label: 'Titelbild' }),
  author: createAuthorSchema().editor({ label: 'Autor' })
})

const pressIndexSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})

// schema/speaking.ts
const speakingSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta(),
  links: z.array(createButtonSchema()).editor({ label: 'Buttons' }),
  events: z.array(z.object({
    category: z.enum(['Live talk', 'Podcast', 'Conference']).editor({ label: 'Kategorie' }),
    title: z.string().editor({ label: 'Titel' }),
    date: z.date().editor({ label: 'Datum' }),
    location: z.string().editor({ label: 'Ort' }),
    url: z.string().optional().editor({ label: 'Link' })
  })).editor({ label: 'Veranstaltungen' })
})

// schema/neuigkeiten.ts
const neuigkeitenSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})

// schema/materialien.ts
const materialienSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})

const materialienSectionsSchema = z.object({
  id: z.string().editor({ label: 'ID', tooltip: 'Technische Kennung – nur ändern, wenn nötig' }),
  title: z.string().editor({ label: 'Titel' }),
  description: z.string().optional().editor({ input: 'textarea', label: 'Beschreibung' }),
  icon: z.string().optional().editor({ input: 'icon', label: 'Symbol' }),
  image: createImageSchema().editor({ label: 'Bild' }),
  features: z.array(createFeatureSchema()).editor({ label: 'Merkmale' })
})

const materialienLiteraturSchema = createBaseSchema().extend({
  references: z.array(z.object({
    authors: z.string().editor({ label: 'Autoren' }),
    title: z.string().editor({ label: 'Titel' }),
    journal: z.string().optional().editor({ label: 'Zeitschrift' }),
    year: z.number().optional().editor({ label: 'Jahr' }),
    volume: z.string().optional().editor({ label: 'Band' }),
    pages: z.string().optional().editor({ label: 'Seiten' })
  })).editor({ label: 'Quellenangaben' })
})

// schema/bestellung.ts
const bestellungSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta(),
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

const bestellungProductSchema = z.object({
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

// schema/impressum.ts
const impressumSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})

// schema/datenschutz.ts
const datenschutzSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta()
})

// schema/wir.ts
const wirSchema = z.object({
  ...lockPageMeta(),
  ...seoPageMeta(),
  team: createBaseSchema().editor({ label: 'Team' })
})

const wirTechnologySchema = createBaseSchema().extend({
  content: z.string().editor({ input: 'textarea', label: 'Inhalt' })
})

// schema/team.ts
const teamSchema = z.object({
  id: z.string().editor({ label: 'ID', tooltip: 'Technische Kennung – nur ändern, wenn nötig' }),
  name: z.string().editor({ label: 'Name' }),
  role: z.string().editor({ label: 'Rolle' }),
  description: z.string().optional().editor({ input: 'textarea', label: 'Beschreibung' }),
  tags: z.array(z.string()).optional().editor({ label: 'Schlagworte' }),
  avatar: createImageSchema().optional().editor({ label: 'Profilbild' })
})

// schema/testFeature.ts
// Shape is read from TestFeature.vue's props rather than declared here, so
// adding a prop to that component is enough to expose it in Studio.
// `.inherit()` expects an object field and replaces its editor options, so the
// sub-labels come from the JSDoc comments on TestFeature.vue's props.
const testFeatureSchema = z.object({
  testFeature: property(z.object({})).inherit('app/components/content/TestFeature.vue')
})

// ----------------------------------------------------------------------------
// Collections (previously content.config.ts)
// ----------------------------------------------------------------------------

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: indexSchema
    }),
    press: defineCollection({
      type: 'page',
      source: 'press/*.md',
      schema: pressSchema
    }),
    pressIndex: defineCollection({
      type: 'page',
      source: 'press.yml',
      schema: pressIndexSchema
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: speakingSchema
    }),
    neuigkeiten: defineCollection({
      type: 'page',
      source: 'neuigkeiten.md',
      schema: neuigkeitenSchema
    }),
    materialien: defineCollection({
      type: 'page',
      source: 'materialien.yml',
      schema: materialienSchema
    }),
    bestellung: defineCollection({
      type: 'page',
      source: 'bestellung.yml',
      schema: bestellungSchema
    }),
    bestellungProduct: defineCollection({
      type: 'data',
      source: 'bestellung/produkt.yml',
      schema: bestellungProductSchema
    }),
    impressum: defineCollection({
      type: 'page',
      source: 'impressum-de.md',
      schema: impressumSchema
    }),
    datenschutz: defineCollection({
      type: 'page',
      source: 'datenschutzerklaerung.md',
      schema: datenschutzSchema
    }),
    wir: defineCollection({
      type: 'page',
      source: 'wir.yml',
      schema: wirSchema
    }),
    wirTechnology: defineCollection({
      type: 'data',
      source: 'wir/technologie.yml',
      schema: wirTechnologySchema
    }),
    team: defineCollection({
      type: 'data',
      source: 'team/*.yml',
      schema: teamSchema
    }),
    materialienSections: defineCollection({
      type: 'data',
      source: { include: 'materialien/*.yml', exclude: ['materialien/literatur.yml'] },
      schema: materialienSectionsSchema
    }),
    materialienLiteratur: defineCollection({
      type: 'data',
      source: 'materialien/literatur.yml',
      schema: materialienLiteraturSchema
    }),
    testFeature: defineCollection({
      type: 'data',
      source: 'testFeature.yml',
      schema: testFeatureSchema
    })
  }
})
