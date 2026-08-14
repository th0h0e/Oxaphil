---
name: nuxt-content
description: Author, query, and render content with Nuxt Content v3 (@nuxt/content) — the git-based CMS for Nuxt. Use when adding or editing files in ./content, defining collections/schemas in ./content.config.ts, writing MDC markdown, building Vue components usable from markdown, or querying content with queryCollection / queryCollectionNavigation / ContentRenderer.
---

# Nuxt Content

Nuxt Content turns files in `./content` into a queryable SQL-backed database. Content is authored as Markdown/YAML/JSON, described by a schema in `./content.config.ts`, queried with `queryCollection()`, and rendered with `<ContentRenderer>`.

## Where things live

Always work in these directories. Do not invent alternatives.

| Path | Purpose |
| --- | --- |
| `./content/` | All content files (`.md`, `.yml`, `.json`). Directory structure maps to URL paths. |
| `./content.config.ts` | Project root. Defines collections + schemas. **Single source of truth for frontmatter fields.** |
| `./public/` | Images and static assets referenced from content. Referenced as root-absolute paths (`/image.png`), never `../public/image.png`. |
| `./components/content/` | Vue components usable from MDC markdown (auto-registered as global for content). |
| `./pages/` | Route files that query and render content (e.g. `pages/[...slug].vue`). |
| `./nuxt.config.ts` | Module-level options under the `content` key. |

Before editing anything, **read `./content.config.ts` first** — it determines which files are picked up, which frontmatter fields are valid, and what types exist.

## The rule that breaks things most often

> A frontmatter field that is not in the collection schema is **not queryable**. It lands in `meta` instead of on the document.

So whenever you add a new frontmatter key to a content file, add it to the collection's `schema` in `content.config.ts` in the same change. And when you add a schema field, make sure every existing file in that collection satisfies it (or mark it `.optional()`).

Second most common breakage: **once `content.config.ts` exists, only files matching a collection's `source` glob are imported.** A new file in a directory no collection covers is silently invisible.

Third: a file should belong to **exactly one** collection. Overlapping globs break live reload — use `exclude` to disambiguate.

---

## 1. Collections (`content.config.ts`)

```ts [content.config.ts]
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        date: z.date(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
      }),
    }),
    authors: defineCollection({
      type: 'data',
      source: 'authors/**.yml',
      schema: z.object({
        name: z.string(),
        avatar: z.string(),
        url: z.string(),
      }),
    }),
  },
})
```

### Choosing `type`

- **`page`** — one content file = one page on the site. Gets a generated `path` and an auto-applied schema: `path`, `title`, `description`, `seo`, `body` (AST), `navigation`. Query with `.path()`, render with `<ContentRenderer>`.
- **`data`** — structured data with no page of its own (authors, products, settings). You control the whole schema. Query with `.where()`, usually on `stem`.

File extension does not determine the type: a `page` collection can be YAML, a `data` collection can be Markdown.

Every collection also gets built-in fields: `id`, `stem` (path without extension), `extension`, `meta`.

### `source`

String glob, relative to `./content`:

- `'**'` — everything
- `'**/*.md'` — all markdown, recursively
- `'blog/*.md'` — markdown directly in `content/blog`
- `'**/*.{json,yml}'` — multiple extensions

Or an object for more control:

```ts
source: {
  include: 'en/**',
  exclude: ['en/index.md'],
  prefix: '/',              // route prefix; must start with '/'. Auto-derived from the static part of `include` otherwise
  cwd: path.resolve('packages/my-pkg/docs'), // pull content from outside ./content
}
```

Remote git sources are supported via `repository` (with optional `branch`/`tag` and `auth`). Never hardcode tokens — use env vars. See `Sources.md`.

### Schema validators

Zod v3 (`import { z } from 'zod'`), Zod v4 (`'zod/v4'`), or Valibot all work. Match whatever the project already imports. Do **not** import `z` from `@nuxt/content` — that re-export is deprecated.

Dates serialize as ISO strings. Mark a field `.optional()` or give it `.default()` unless every existing file has it.

Add `indexes` for fields used heavily in `where()`/`order()`:

```ts
indexes: [
  { columns: ['category'] },
  { columns: ['category', 'price'] },
  { columns: ['sku'], unique: true },
]
```

---

## 2. Authoring content in `./content`

### Path generation (`page` type)

| File | Path |
| --- | --- |
| `content/index.md` | `/` |
| `content/about.md` | `/about` |
| `content/blog/index.md` | `/blog` |
| `content/blog/hello.md` | `/blog/hello` |
| `content/1.guide/2.installation.md` | `/guide/installation` |

### Ordering

Prefix files and directories with a number and a **`.`** separator (no other separator works). Sorting is alphabetical, so zero-pad past 9:

```text
content/
  1.frameworks/
    1.vue.md
    2.nuxt.md
  2.examples/
    01.nuxthub.md
    02.vercel.md
    10.cloudflare.md
    index.md
```

### Frontmatter

```md [content/blog/hello.md]
---
title: 'Title of the page'
description: 'meta description'
date: 2024-12-12
navigation: true
---

Page content here.
```

`title` defaults to the first `<h1>`, `description` to the first `<p>`, `navigation: false` hides the page from `queryCollectionNavigation`. Everything else must be declared in the schema.

### Images

Put the file in `./public`, reference it root-absolute:

```md
![my image](/image.png)
```

### Excerpt

`<!--more-->` splits an excerpt from the body. To use it, declare it in the schema:

```ts
schema: z.object({
  excerpt: z.object({ type: z.string(), children: z.any() }),
})
```

### Directory navigation metadata

Add a `.navigation.yml` inside a content directory. Custom fields go under `navigation:`:

```yml [content/docs/.navigation.yml]
title: Getting Started
navigation:
  icon: i-lucide-square-play
  section: true
  badge: New
```

These surface on the `ContentNavigationItem` returned by `queryCollectionNavigation`. The same nesting rule applies in page frontmatter — put `section`/`group`/`badge` under `navigation:`.

### YAML / data files

```yaml [content/authors/larbish.yml]
name: Baptiste Leproux
avatar: https://avatars.githubusercontent.com/u/7290030?v=4
url: https://github.com/larbish
```

Query by `stem`: `queryCollection('authors').where('stem', '=', 'authors/larbish').first()`.

---

## 3. MDC — Vue components inside Markdown

MDC is Markdown plus component syntax. Components are invoked with `::` and **kebab-case**, matching the PascalCase component filename.

### Block component with a slot

```mdc [content/index.md]
::card
The content of the card
::
```

```vue [components/content/Card.vue]
<template>
  <div class="p-2 border rounded">
    <slot />
  </div>
</template>
```

Inline (no children): `::component-name` on one line still needs the closing `::`, or use `:component-name{prop="x"}` for a truly inline one.

### Props — inline `{}` syntax

```mdc
::alert{type="warning" icon="exclamation-circle"}
The **alert** component.
::
```

Bind to frontmatter with the `:` shorthand, and pass arrays/objects as single-quoted JSON prefixed with `:`:

```mdc
::alert{:type="type"}
Bound from frontmatter `type`.
::

::dropdown{:items='["Nuxt", "Vue", "React"]'}
::

::chart{:options='{"responsive": true}'}
::
```

### Props — YAML syntax (preferred for 3+ props)

```mdc
::icon-card
---
icon: IconNuxt
title: Nuxt Architecture.
description: Harness the full power of Nuxt.
---
::
```

### Named slots

`#slotname` inside the block:

```mdc
::callout
#title
Please be careful!
#default
Using MDC & Vue components is addictive.
::
```

```vue [components/content/Callout.vue]
<template>
  <div class="callout">
    <h2 v-if="$slots.title">
      <slot name="title" mdc-unwrap="p" />
    </h2>
    <slot />
  </div>
</template>
```

### `mdc-unwrap` — the detail people miss

Markdown wraps slot text in `<p>`. When the slot content belongs inside a heading or other inline context, strip the wrapper with `mdc-unwrap`:

```vue
<slot mdc-unwrap="p" />        <!-- removes the <p> -->
<slot mdc-unwrap="ul li" />    <!-- removes multiple tags -->
```

### Inline attributes

Works on spans, images, links, inline code, bold and italic. Named attributes, `.class`, `#id`:

```md
Hello [World]{style="color: green;" .custom-class #custom-id}!
- [Attributes](#a){style="background: green;"}, `code`{style="color: cyan;"}
```

### Data binding in markdown

`{{ $doc.variable || 'fallback' }}` reads from frontmatter, from the component's own YAML props, or from the `data` prop of `<ContentRenderer>`:

```mdc
# The title is {{ $doc.title }} and custom is {{ $doc.customVariable || 'default' }}
```

---

## 4. Writing components for content — checklist

When asked to build a component usable from `.md`:

1. **Create it in `./components/content/`.** Components elsewhere must be explicitly marked `global` to be reachable from MDC — prefer `components/content/`.
2. **Name it PascalCase** (`IconCard.vue`) and use it as kebab-case (`::icon-card`).
3. **`defineProps` with types and sensible defaults** — MDC passes everything as strings unless the prop key is `:`-prefixed, so defaults matter.
4. **Include at least one `<slot />`** if the component should accept markdown body content; otherwise the block content is dropped.
5. **Add `mdc-unwrap="p"`** on any slot whose content is rendered inline (headings, buttons, table cells).
6. **Guard optional named slots** with `v-if="$slots.name"` so empty markup isn't emitted.
7. **Show a usage snippet** in the answer, in real MDC syntax, so the author knows how to call it.

Template to start from:

```vue [components/content/Alert.vue]
<script setup lang="ts">
const props = defineProps<{
  type?: 'info' | 'warning' | 'success'
}>()

const alertClass = computed(() => ({
  info: 'bg-blue-100 border-blue-200',
  warning: 'bg-orange-100 border-orange-200',
  success: 'bg-green-100 border-green-200',
}[props.type ?? 'info']))
</script>

<template>
  <div class="p-2 border rounded" :class="alertClass">
    <slot mdc-unwrap="p" />
  </div>
</template>
```

### Prose components

Every markdown-generated HTML tag renders through a Vue component: `<p>` → `ProseP`, `<a>` → `ProseA`, `<img>` → `ProseImg`, `<pre>` → `ProsePre`, `<h1>`–`<h6>` → `ProseH1`–`ProseH6`, plus `ProseUl/Ol/Li/Table/Thead/Tbody/Tr/Th/Td/Blockquote/Code/Strong/Em/Hr`.

To override one: create a file with the **exact same name** in `./components/content/`, keep the **exact same props**, then restyle. Do not change the prop contract — the renderer passes fixed props.

Alternatively alias a tag to your own component globally:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: { renderer: { alias: { p: 'MyCustomParagraph' } } },
})
```

---

## 5. Querying

`queryCollection` is auto-imported in Vue and Nitro. **Always wrap it in `useAsyncData`** in components/pages, with a stable, unique key.

```vue [pages/blog/[slug].vue]
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
  <div v-else>Page not found</div>
</template>
```

Builder methods, chainable:

- `.path(path)` — page collections only, matches the generated route
- `.select('title', 'path', 'description')` — narrow the payload; do this for list views
- `.where(field, operator, value)` — operators: `=`, `>`, `<`, `<>`, `IN`, `BETWEEN`, `NOT BETWEEN`, `IS NULL`, `IS NOT NULL`, `LIKE`, `NOT LIKE`
- `.andWhere(q => …)` / `.orWhere(q => …)` — grouped conditions
- `.order(field, 'ASC' | 'DESC')`
- `.limit(n)` / `.skip(n)`
- Terminals: `.all()`, `.first()`, `.count()`

```ts
const { data: docs } = await useAsyncData('documents-list', () =>
  queryCollection('docs')
    .where('published', '=', true)
    .orWhere(q => q.where('featured', '=', true).where('priority', '>', 5))
    .order('date', 'DESC')
    .select('title', 'path', 'description')
    .all(),
)
```

Server-side, pass `event` first:

```ts [server/api/[slug].ts]
export default eventHandler(async (event) => {
  const { slug } = getRouterParams(event)
  return await queryCollection(event, 'docs').path(slug).first()
})
```

Server usage needs `server/tsconfig.json` with `{ "extends": "../.nuxt/tsconfig.server.json" }` to avoid type errors.

### Navigation

```ts
const { data: nav } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('docs', ['description', 'badge'])
    .where('draft', '=', false)
    .order('title', 'ASC'),
)
```

The tree follows directory structure and file ordering. Helpers from `@nuxt/content/utils`: `findPageHeadline`, `findPageBreadcrumb`, `findPageChildren`, `findPageSiblings` — each takes `(navigation, path, options?)`.

---

## 6. Rendering

`<ContentRenderer>` renders a Markdown document's AST. It only works with Markdown.

```vue
<ContentRenderer :value="page" :data="{ name: 'Maxime' }" />
```

Props: `value` (the document), `tag` (default `'div'`), `excerpt` (render excerpt only), `components` (component override map), `data` (variables for `{{ $doc.x }}`), `prose` (use Prose components vs plain HTML), `class`, `unwrap` (space-separated tags to strip, e.g. `'ul li'`).

Always guard with `v-if="page"` and provide a fallback — `.first()` returns `null` for missing content.

---

## 7. `nuxt.config.ts` options worth knowing

```ts
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        toc: { depth: 2, searchDepth: 2 },   // heading depth in body.toc
        remarkPlugins: {},
        rehypePlugins: {},
        highlight: { /* Shiki theme/langs */ },
      },
      pathMeta: { forceLeadingSlash: true, slugifyOptions: {} },
      transformers: [],
    },
    renderer: {
      anchorLinks: { h2: true, h3: true, h4: true },
      alias: {},
    },
    database: { /* sqlite (default), d1, postgres, libsql, pglite */ },
    watch: { enabled: true },   // content hot reload in dev
  },
})
```

Code highlighting uses Shiki and works in `ProsePre` and inline `ProseCode`.

---

## This project's database setup

This repo splits the `database` adapter by environment in `nuxt.config.ts`, mirroring the existing `hub.db` pattern (`@nuxthub/core` also switches sqlite → D1 between `$development`/`$production`):

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  content: {
    experimental: { sqliteConnector: 'native' },
  },
  $development: {
    content: {
      database: {
        type: 'libsql',
        url: process.env.DATABASE_URL,          // existing Turso project, shared with app data
        authToken: process.env.NUXT_TURSO_AUTH_TOKEN,
      },
    },
  },
  $production: {
    content: {
      database: { type: 'd1', bindingName: 'DB' }, // same D1 binding wrangler.jsonc already declares for hub.db
    },
  },
})
```

Key points, since these are easy to get wrong:

- **`database` (dev/prod split above) and `experimental.sqliteConnector` are two different concerns.** `database` is where content is queried from at runtime. Regardless of that setting, `nuxt dev`/build always needs a **local** SQLite connector to parse and stage `.md` files — that's what `sqliteConnector` controls. Without it, `nuxt dev` fails with `Nuxt Content requires better-sqlite3 module to operate` even though `database.type` is `libsql`/`d1`. Since this project's Node is ≥22.5, `sqliteConnector: 'native'` avoids adding `better-sqlite3` as a dependency.
- **No separate content database was provisioned.** Local dev reuses the existing Turso/libsql database (`DATABASE_URL` / `NUXT_TURSO_AUTH_TOKEN` in `.env`) that the app's own Drizzle/auth tables live in. Production reuses the existing `DB` D1 binding from `wrangler.jsonc`. Content creates its own internally-namespaced tables, so this is safe — a deliberate choice to avoid standing up a second database, not a default Nuxt Content behavior.
- If `nuxt dev` grabs an unexpected port, an old dev server is probably still running (`pkill -f "nuxt dev"` before restarting) — unrelated to Content, just easy to mistake for a config problem when checking routes right after a config change.

---

## Workflow when making a change

1. Read `./content.config.ts` — learn the collections, globs, and schemas.
2. Confirm the target file's glob is covered by exactly one collection.
3. Edit content in `./content`, assets in `./public`, components in `./components/content`.
4. If frontmatter keys changed, update the schema in the same change and check the other files in that collection still validate.
5. If a new MDC component was introduced, verify a `components/content/*.vue` exists with a matching PascalCase name and the slots/props the markdown uses.
6. Restart the dev server after touching `content.config.ts` — schema changes regenerate the database and types.

## Reference files

Deeper detail lives alongside this skill: `DefineCollections.md`, `Types.md`, `Sources.md`, `SchemaValidators.md`, `Markdownfiles.md`, `YAMLFiles.md`, `SlotComponent.md`, `PoseComponent.md`, `ContentRenderer.md`, `queryCollection.md`, `queryCollectionNavigation.md`, `NuxtContentConfig.md`. Read the relevant one when you need exhaustive prop tables or config options.
