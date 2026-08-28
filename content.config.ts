import { defineCollection, defineContentConfig } from '@nuxt/content'

import { indexSchema } from './schema/index'
import { pressSchema, pressIndexSchema } from './schema/press'
import { speakingSchema } from './schema/speaking'
import { neuigkeitenSchema } from './schema/neuigkeiten'
import { materialienSchema, materialienSectionsSchema, materialienLiteraturSchema } from './schema/materialien'
import { bestellungSchema, bestellungProductSchema } from './schema/bestellung'
import { impressumSchema } from './schema/impressum'
import { datenschutzSchema } from './schema/datenschutz'
import { wirSchema, wirTechnologySchema } from './schema/wir'
import { teamSchema } from './schema/team'

// Schema definitions live in `./schema/`, one file per content domain.
// `lockPageMeta()` is shared from `./schema/shared.ts`; every other helper
// is inlined where it's used.
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
      source: 'datenschutzerklaerung-2.md',
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
    })
  }
})
