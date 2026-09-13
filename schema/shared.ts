import { z } from '@nuxt/content'
import { defineRobotsSchema, defineSchemaOrgSchema, defineSitemapSchema } from '@nuxtjs/seo/content'

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

/**
 * Adds the Nuxt SEO module schema fields to a `page` collection so content
 * files can control sitemap + robots per entry (and optionally schema.org).
 *
 * Imported from `@nuxtjs/seo/content` (the meta-module) rather than the
 * individual `@nuxtjs/sitemap` / `@nuxtjs/robots` packages, which are not
 * resolvable standalone in this repo. Pass `{ z }` to each builder so the
 * field types are built with the zod instance `@nuxt/content` exports —
 * `defineSitemapSchema()` otherwise pulls in its own zod 4 copy and
 * `toJSONSchema()` can't read it (same fix as `schema/index.ts`).
 *
 * - `sitemap`: enables/excludes a page from the sitemap; e.g. `sitemap: false`
 *   opts out, or set `priority`/`lastmod`/`changefreq`.
 * - `robots`: per-page robots value; e.g. `robots: noindex, nofollow`.
 * - `schemaOrg` (opt-in): per-entry JSON-LD authored in frontmatter, rendered
 *   via `useSchemaOrg()` in the page template.
 */
export const seoPageMeta = (opts?: { schemaOrg?: boolean }) => ({
  sitemap: defineSitemapSchema({ z }),
  robots: defineRobotsSchema({ z }),
  ...(opts?.schemaOrg
    ? { schemaOrg: defineSchemaOrgSchema({ z }) }
    : {})
})
