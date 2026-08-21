# SEO, OG image, and page title setup

How the head tags, social share images, and browser tab titles get produced on this site. Written for someone who did not build this and needs to change one piece without breaking the others.

## The pieces

Five things touch the HTML `<head>`:

1. **Nuxt Site Config** (`nuxt.config.ts` `site` block). Sets the site URL and name. The URL is `https://oxaphil.com`. Other modules read it to build absolute links, including OG image URLs.
2. **`app/app.vue`**. Sets `titleTemplate: '%s · Oxaphil'` and `twitterCard: 'summary_large_image'`. Does not set a title itself. Every page title gets "· Oxaphil" appended here.
3. **`app/composables/usePageSeo.ts`**. The composable each page calls. Reads `page.title` and `page.description` from the content collection and hands them to `useSeoMeta`. Also calls `defineOgImage` to produce the social share image.
4. **`app/components/OgImage/Portfolio.takumi.vue`**. The OG image template. A Vue component rendered to a PNG by the Takumi renderer at build time. Receives `title`, `description`, and optional `headline` as props.
5. **`content.config.ts` `lockPageMeta()`**. Hides the built-in `seo` and `navigation` fields from every `page` collection so Studio editors never see them.

## The flow, start to finish

An editor types a title and description into a content file (say `content/wir.yml`). They save. Nuxt Content parses the file and stores `title` and `description` in the SQLite DB.

A visitor requests `/wir`. `app/pages/wir.vue` runs `queryCollection('wir').first()` and gets the page object. Then it calls `usePageSeo(page)`.

The composable reads `page.title` ("Wir") and `page.description`. It calls `useSeoMeta` with those values for `title`, `ogTitle`, `description`, `ogDescription`. It also calls `defineOgImage('Portfolio', { title, description })`.

`useSeoMeta` sets the `<title>` tag to "Wir". The `titleTemplate` in `app.vue` turns that into "Wir · Oxaphil" in the browser tab.

`defineOgImage` tells the OG Image module to render `Portfolio.takumi.vue` with those props. Because `ogImage.zeroRuntime: true` is set in `nuxt.config.ts` and `nitro.prerender.crawlLinks: true` crawls every page from `/`, the module renders the PNG at build time. No server renders images in production. The module writes the `og:image` meta tag pointing at the generated PNG.

The template receives `title` and `description` as props and lays them out on a light background with the green brand color, "oxaphil.com" in the footer. That PNG is what shows when someone shares the link on social platforms.

## Why the editor never sees `seo` or `navigation` in Studio

Nuxt Content adds two built-in fields to every `page` collection: `seo` (an object with `title`, `description`, `meta`, `link`) and `navigation` (a boolean or object). You cannot delete them. You can only override them and mark them hidden.

`lockPageMeta()` does that in `content.config.ts`:

```ts
const lockPageMeta = () => ({
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional().default({}).editor({ hidden: true }),
  navigation: z.boolean().default(true).editor({ hidden: true })
})
```

Every `page` collection spreads `...lockPageMeta()` into its schema. Studio reads the `.editor({ hidden: true })` flag and does not render the field. The `seo` column exists in the DB but is always `{}`. Nothing reads it.

This is deliberate. The site title and description live in the top-level `title` and `description` fields, which Studio shows. The `seo` field would be a second, redundant title and description that shadows the real ones. Hiding it keeps Studio simple.

## Why we use a composable instead of letting Studio edit SEO

The built-in `seo` field exposes `title`, `description`, `meta`, and `link` arrays. That is too much for a non-technical editor. They would see two title fields and two description fields on every page, with no clear indication of which one actually renders. If they fill in `seo.title` and leave the top-level `title` blank, the page hero goes empty. If they fill in both with different values, the head and the hero disagree.

The `navigation` field is worse. Setting it to `false` removes the page from the content navigation tree, which feeds the search overlay. An editor toggling it by accident breaks search with no visible feedback.

We chose to hide both fields and derive every head tag from the two fields the editor already fills in: `title` and `description`. The composable reads those and calls `useSeoMeta`. One source of truth per page. The editor writes each value once, and both the page hero and the head tags pick it up.

This also keeps the head tags consistent across pages. Before the composable, each page hand-wrote its own `useSeoMeta` block. One page drifted and skipped the optional chain on `seo`, which caused a typecheck error that went unnoticed because the other seven pages had it. The composable removed that drift. There is one place to change how head tags are built, not ten.

## Why links and nav labels cannot break from a Studio edit

Page paths come from filenames, not titles. `content/wir.yml` becomes `/wir`. `content/press/pox-in-lipid-nanopartikeln.md` becomes `/press/pox-in-lipid-nanopartikeln`. An editor renaming the title in Studio changes `title`, never `path`.

The header navigation is hardcoded in `app/utils/links.ts` as `navLinks`. It does not read from content collections. Renaming a page title in Studio cannot change a header label or break a link.

`app.vue` does call `queryCollectionNavigation('press')`, but only to feed the search overlay (`UContentSearch`), not the header.

## The two OG image overrides

Most pages take the default Portfolio template. Two pages override it, both through the second argument to `usePageSeo`:

**`app/pages/index.vue`** passes `{ type: 'image', src: '/img/news-oxaphil-logo.png' }`. The composable skips the template and sets `ogImage` directly to that static file.

**`app/pages/press/[...slug].vue`** passes the article's own image when the frontmatter has one, otherwise falls back to the Portfolio template with `headline: 'Blog'`:

```ts
usePageSeo(page, page.value?.image
  ? { type: 'image', src: page.value.image }
  : { type: 'template', props: { headline: 'Blog' } })
```

The composable handles both branches. See `usePageSeo.ts` lines 30-34.

## Color mode and the OG image

`nuxt.config.ts` sets `colorMode: { preference: 'system', fallback: 'light' }`. The OG Image module reads this to decide which mode to render. Because `fallback` is `light`, the generated PNG is always the light variant. The template has `data-theme="light"` on its root and uses `dark:` Tailwind classes for the case where a dark variant is requested, but the current config does not request one.

If you want dark OG images, change `fallback: 'light'` to `fallback: 'dark'` and the template's `data-theme` to `"dark"`. The `dark:` classes in the template handle the rest.

## Fonts in the OG image

The template sets `font-family: 'Public Sans', sans-serif` inline on each text element. `@nuxt/fonts` is auto-registered by Nuxt UI and resolves the family. If the font fails to load in the renderer, it falls back to the default sans-serif. We removed the explicit `fonts.families` registration from `nuxt.config.ts` because the fallback looked fine and the registered font did not render correctly. If you want to try again, the OG Image docs require `global: true` on the family entry. See https://nuxtseo.com/docs/og-image/guides/custom-fonts.

## The localhost warning

Running `pnpm postinstall` (which calls `nuxt prepare`) prints:

```
[nuxt-site-config] WARN url "http://localhost:3000" from buildEnv should not be localhost
```

This comes from `NUXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env`, which overrides `site.url` at build time. It is a warning, not an error. The production build uses `site.url: 'https://oxaphil.com'` from `nuxt.config.ts` once the env var is removed or changed. We left it for now because it only affects local dev.

## Common mistakes to avoid

**Do not add `seo` reads back to page files.** Earlier versions had `page.value?.seo?.title || page.value?.title` in every page. Because `seo` is hidden and always `{}`, that fallback always resolved to `page.title`. It caused 26 typecheck errors and drift across files. The composable reads `page.title` directly. Do not reintroduce the `seo` read.

**Do not type a markdown content field as `z.object({})`.** Nuxt Content validates against the schema. A string field typed as object gets coerced to `{}` on query, so `<MDC :value="page.content">` renders nothing and Studio cannot edit it. For standalone prose pages (impressum, datenschutz), use `.md` files and `<ContentRenderer>`. For embedded prose strings in composite pages (bestellung intro, wirTechnology, neuigkeiten items), use `z.string().editor({ input: 'textarea' })` and render with `<MDC>`. See `notes/Component-Schema-Inherit.md` for the related `.inherit()` rule.

**Do not call `defineOgImage` from a page file.** The composable owns it. Calling it twice on the same page produces duplicate tags or a conflict.

**Do not set a static `title` in `app.vue`.** It overrides the per-page title from `usePageSeo`. The `titleTemplate` is fine. A static `title` is not. We removed it. If the browser tab shows "Oxaphil" instead of "Page Title · Oxaphil", check that `app.vue` does not have `title: 'Oxaphil'` in its `useSeoMeta` call.

## File map

| File | Role |
| --- | --- |
| `nuxt.config.ts` `site` block | Site URL and name |
| `nuxt.config.ts` `colorMode` block | OG image render mode |
| `nuxt.config.ts` `ogImage` block | `zeroRuntime: true`, `buildCache: true` |
| `nuxt.config.ts` `nitro.prerender` | Crawls pages from `/` so OG images generate at build time |
| `app/app.vue` | `titleTemplate`, `twitterCard`, charset, favicon, lang |
| `app/composables/usePageSeo.ts` | Sets title, description, OG image per page |
| `app/components/OgImage/Portfolio.takumi.vue` | The OG image template |
| `app/utils/links.ts` | Hardcoded header nav |
| `content.config.ts` `lockPageMeta()` | Hides `seo` and `navigation` from Studio |
| `content.config.ts` collection schemas | Define the `title` and `description` fields Studio shows |
