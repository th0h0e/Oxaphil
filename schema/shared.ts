import { z } from '@nuxt/content'

// Locks down the fields Nuxt Content auto-adds to `page` collections (seo, navigation)
// so Studio can't expose them for editing. `seo` always falls back to title/description
// (see app/pages/*.vue), and navigation stays fixed to its default (`true`).
//
// Shared across every page collection — keep it here rather than duplicating the
// 4 lines into 10 schema files.
export const lockPageMeta = () => ({
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional().default({}).editor({ hidden: true }),
  navigation: z.boolean().default(true).editor({ hidden: true })
})
