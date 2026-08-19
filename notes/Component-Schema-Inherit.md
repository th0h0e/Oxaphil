# Deriving a content schema from a component's props

How to turn a hand-built block inside a page template into a reusable component whose
**props are the schema** — so Nuxt Studio gets an editing form without anything being
declared in `content.config.ts`.

Reference implementation: `app/components/ContactCard.vue` + the `contactCard` field on
the `bestellung` collection.

## When to use this

Good fit:

- A block of markup that repeats, or that a content editor should be able to restyle.
- Props that are **plain strings, numbers, booleans, or string-literal unions**.

Not a good fit — keep writing the schema by hand in `content.config.ts`:

- Fields needing Studio's **media picker** (`.editor({ input: 'media' })`) or **icon
  picker** (`.editor({ input: 'icon' })`). `inherit()` only sees `src: string`, so you
  get a plain text input instead of the picker. See `createImageSchema()` /
  `createFeatureSchema()` for the hand-written approach.
- Fields needing validation beyond a type (`.nonempty()`, `z.date()`, min/max).

Mixing is allowed: inherit the component, then layer `.editor(...)` onto specific fields.

## Steps

### 1. Write the component with fully typed props

The prop types *are* the schema, so they have to be precise. Use string-literal unions
(not `string`) anywhere you want a Studio dropdown, and give every prop a JSDoc comment —
those comments become field descriptions in the generated types and in Studio.

```vue
<!-- app/components/ContactCard.vue -->
<script setup lang="ts">
withDefaults(defineProps<{
  /** Contact person's full name */
  name: string
  /** Short role or context line shown under the name */
  role?: string
  /** Color of the contact buttons */
  buttonColor?: 'primary' | 'neutral'
  /** Visual style of the surrounding card */
  cardVariant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'naked'
}>(), {
  buttonColor: 'neutral',
  cardVariant: 'subtle'
})
</script>
```

Notes:

- Optional (`?`) props become optional schema fields; required props become required.
- `withDefaults` keeps the component sane when a YAML field is missing.
- Prefer **flat props** (`photoSrc`, `photoAlt`) over nested objects. Nested works, but
  flat keeps the Studio form from nesting an accordion for two strings.
- Keep style unions to the values actually wanted — narrowing `buttonColor` to
  `'primary' | 'neutral'` yields a two-option dropdown, not all six Nuxt UI colors.

### 2. Point the collection field at the component

```ts
// content.config.ts
import { defineCollection, defineContentConfig, property, z } from '@nuxt/content'

bestellung: defineCollection({
  type: 'page',
  source: 'bestellung.yml',
  schema: z.object({
    ...lockPageMeta(),
    // Shape is read from ContactCard.vue's props rather than declared here.
    contactCard: property(z.object({})).inherit('app/components/ContactCard.vue')
  })
})
```

- `property()` comes from `@nuxt/content` — add it to the existing import.
- The path is resolved from the **project root** (so `app/components/...`, not `~/` or a
  relative path). Package paths work too: `'@nuxt/ui/components/Button.vue'`.
- `.inherit()` must wrap an object field: `property(z.object({}))`.
- Add `.optional()` only if the page should render without the field.

> **Careful with library components.** Inheriting straight from `@nuxt/ui/components/Button.vue`
> pulls in that component's *entire* prop surface (`loading`, `disabled`, `ui`, …), which
> makes a messy Studio form. Write a small local wrapper exposing only the wanted props
> and inherit from that instead.

### 3. Add the content

```yaml
# content/bestellung.yml
contactCard:
  name: Dr. Erik Wegener
  role: Kontaktieren sie uns für …
  buttonColor: primary
  cardVariant: subtle
```

### 4. Render it

`v-bind` the whole object — prop names and YAML keys match by construction:

```vue
<ContactCard
  v-if="page.contactCard"
  v-bind="page.contactCard"
/>
```

### 5. Restart and verify the inherit resolved

**Restart the dev server** — schema changes regenerate the DB and types.

If the component path can't be resolved, `inherit()` **silently falls back** to the
original empty object — no error is thrown. So always confirm the props actually made it
through, by checking the generated types:

```bash
grep -n "contactCard" -A 20 .nuxt/content/types.d.ts
```

Expect the real prop shape, with unions preserved:

```ts
contactCard?: {
  /** Contact person's full name */
  name: string
  buttonColor?: ("neutral" | "primary")
  cardVariant?: ("subtle" | "solid" | "outline" | "soft" | "ghost" | "naked")
}
```

If it shows `contactCard?: {}` instead, the path is wrong.

Then check the route still renders:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/bestellung
```

Finally, open the page in Studio and confirm the form looks right — dropdowns for the
unions, text inputs for the strings. This can't be verified from the CLI.

## Changing it later

Add, remove, or retype a prop in the `.vue` file and restart the dev server. The schema,
the generated types, and the Studio form all follow. `content.config.ts` stays untouched —
that's the whole point of the pattern.

## Migrating an existing hand-written schema

The order that avoids a broken intermediate state:

1. Build the new component and add the inherited field **alongside** the old one.
2. Add the new YAML block alongside the old data, and render both to compare.
3. Once it looks right: delete the old template markup, the old schema field, and the old
   YAML block.
4. Check for stale references before restarting: `grep -rn "page\.oldField" app/`

## Dependencies

`property()` / `.inherit()` need `@nuxt/content` ≥ 3.15 and read props via
`nuxt-component-meta`, which ships as a dependency of `@nuxt/content` — nothing to install.
