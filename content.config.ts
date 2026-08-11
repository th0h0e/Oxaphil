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

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        hero: z.object({
          links: z.array(createButtonSchema()),
          images: z.array(createImageSchema())
        }),
        about: createBaseSchema(),
        experience: createBaseSchema().extend({
          items: z.array(z.object({
            date: z.date(),
            position: z.string(),
            company: z.object({
              name: z.string(),
              url: z.string(),
              logo: z.string().editor({ input: 'icon' }),
              color: z.string()
            })
          }))
        }),
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
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        image: z.string().nonempty().editor({ input: 'media' }),
        url: z.string().nonempty(),
        tags: z.array(z.string()),
        date: z.date()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }),
        author: createAuthorSchema()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'projects.yml' },
        { include: 'blog.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: z.object({
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
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        content: z.object({}),
        images: z.array(createImageSchema())
      })
    }),
    landing: defineCollection({
      type: 'page',
      source: 'landing.yml',
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
    neuigkeiten: defineCollection({
      type: 'page',
      source: 'neuigkeiten.yml',
      schema: z.object({
        about: z.object({
          title: z.string(),
          logo: createImageSchema(),
          content: z.string()
        }),
        items: z.array(z.object({
          title: z.string(),
          date: z.date(),
          description: z.string(),
          images: z.array(createImageSchema()),
          to: z.string().optional()
        }))
      })
    }),
    materialien: defineCollection({
      type: 'page',
      source: 'materialien.yml',
      schema: z.object({
        platform: createBaseSchema().extend({
          content: z.object({}),
          image: createImageSchema()
        }),
        anwendungen: createBaseSchema().extend({
          content: z.object({}),
          image: createImageSchema()
        })
      })
    }),
    bestellung: defineCollection({
      type: 'page',
      source: 'bestellung.yml',
      schema: z.object({
        content: z.object({}),
        product: z.object({
          title: z.string(),
          image: createImageSchema()
        }),
        contact: z.object({
          name: z.string(),
          role: z.string().optional(),
          photo: createImageSchema()
        }),
        links: z.array(createButtonSchema())
      })
    }),
    impressum: defineCollection({
      type: 'page',
      source: 'impressum-de.yml',
      schema: z.object({
        content: z.object({})
      })
    }),
    datenschutz: defineCollection({
      type: 'page',
      source: 'datenschutzerklaerung-2.yml',
      schema: z.object({
        content: z.object({})
      })
    }),
    kontakt: defineCollection({
      type: 'page',
      source: 'kontakt.yml',
      schema: z.object({
        content: z.object({}),
        email: z.string().optional(),
        phone: z.string().optional()
      })
    }),
    wir: defineCollection({
      type: 'page',
      source: 'wir.yml',
      schema: z.object({
        technology: createBaseSchema().extend({
          content: z.object({})
        }),
        team: createBaseSchema(),
        members: z.array(z.object({
          name: z.string(),
          role: z.string(),
          description: z.string().optional(),
          avatar: createImageSchema().optional()
        }))
      })
    })
  }
})
