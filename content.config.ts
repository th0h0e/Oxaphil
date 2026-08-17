import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

const createTestimonialSchema = () => z.object({
  quote: z.string(),
  author: createAuthorSchema()
})

const createFeatureSchema = () => z.object({
  title: z.string(),
  description: z.string().editor({ input: 'textarea' }),
  icon: z.string().optional().editor({ input: 'icon' })
})

// Locks down the fields Nuxt Content auto-adds to `page` collections (seo, navigation)
// so Studio can't expose them for editing. `seo` always falls back to title/description
// (see app/pages/*.vue), and navigation stays fixed to its default (`true`).
const lockPageMeta = () => ({
  seo: z.object({}).optional().default({}).editor({ hidden: true }),
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
          links: z.array(createButtonSchema()),
          images: z.array(createImageSchema()).optional()
        }),
        video: z.object({
          title: z.string(),
          description: z.string().optional(),
          provider: z.enum(['file', 'youtube']),
          src: z.string(),
          poster: z.string().optional()
        }).optional(),
        valueProps: createBaseSchema().extend({
          items: z.array(createBaseSchema().extend({
            icon: z.string().optional().editor({ input: 'icon' })
          }))
        }).optional(),
        testimonials: z.array(createTestimonialSchema()),
        blog: createBaseSchema(),
        faq: createBaseSchema().extend({
          categories: z.array(
            z.object({
              title: z.string().nonempty(),
              questions: z.array(
                z.object({
                  label: z.string().nonempty(),
                  content: z.string().nonempty()
                })
              )
            }))
        })
      })
    }),
    press: defineCollection({
      type: 'page',
      source: 'press/*.md',
      schema: z.object({
        ...lockPageMeta(),
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }),
        author: createAuthorSchema()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'press.yml' }
      ],
      schema: z.object({
        ...lockPageMeta(),
        links: z.array(createButtonSchema())
      })
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: z.object({
        ...lockPageMeta(),
        links: z.array(createButtonSchema()),
        events: z.array(z.object({
          category: z.enum(['Live talk', 'Podcast', 'Conference']),
          title: z.string(),
          date: z.date(),
          location: z.string(),
          url: z.string().optional()
        }))
      })
    }),
    neuigkeiten: defineCollection({
      type: 'page',
      source: 'neuigkeiten.yml',
      schema: z.object({
        ...lockPageMeta(),
        about: z.object({
          title: z.string(),
          logo: createImageSchema(),
          content: z.string()
        }),
        items: z.array(z.object({
          title: z.string(),
          date: z.date(),
          location: z.string().optional(),
          description: z.string(),
          content: z.string().optional(),
          images: z.array(createImageSchema()),
          to: z.string().optional()
        }))
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
        content: z.object({}),
        product: z.object({
          title: z.string(),
          name: z.string(),
          chemicalName: z.string(),
          specs: z.array(z.object({
            label: z.string(),
            value: z.string()
          })),
          price: z.string(),
          image: createImageSchema()
        }),
        contact: z.object({
          title: z.string().optional(),
          name: z.string(),
          role: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          photo: createImageSchema()
        }),
        links: z.array(createButtonSchema())
      })
    }),
    impressum: defineCollection({
      type: 'page',
      source: 'impressum-de.yml',
      schema: z.object({
        ...lockPageMeta(),
        content: z.object({})
      })
    }),
    datenschutz: defineCollection({
      type: 'page',
      source: 'datenschutzerklaerung-2.yml',
      schema: z.object({
        ...lockPageMeta(),
        content: z.object({})
      })
    }),
    wir: defineCollection({
      type: 'page',
      source: 'wir.yml',
      schema: z.object({
        ...lockPageMeta(),
        technology: createBaseSchema().extend({
          content: z.object({})
        }),
        team: createBaseSchema()
      })
    }),
    team: defineCollection({
      type: 'data',
      source: 'team/*.yml',
      schema: z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        avatar: createImageSchema().optional()
      })
    }),
    materialienSections: defineCollection({
      type: 'data',
      source: { include: 'materialien/*.yml', exclude: ['materialien/literatur.yml'] },
      schema: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional().editor({ input: 'textarea' }),
        icon: z.string().optional().editor({ input: 'icon' }),
        image: createImageSchema(),
        features: z.array(createFeatureSchema())
      })
    }),
    materialienLiteratur: defineCollection({
      type: 'data',
      source: 'materialien/literatur.yml',
      schema: createBaseSchema().extend({
        references: z.array(z.object({
          authors: z.string(),
          title: z.string(),
          journal: z.string().optional(),
          year: z.number().optional(),
          volume: z.string().optional(),
          pages: z.string().optional()
        }))
      })
    })
  }
})
