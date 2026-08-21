# Codex: Documentation & example search

The Motion Codex finds the official Motion API documentation and working code examples.

Call it **before** implementing any non-trivial animation. Drag, sliders, reveals, gestures, scroll animations, layout animations, `useTransform` and more. It is at least worth checking whether an example already exists. Then build from the result rather than writing from memory.

## Server

The plugin registers the **Motion** MCP server. It is always available,
needs no account, and carries `search-motion-docs` and `generate-css-easing`.

## 1. Search

```
search-motion-docs({ platform, searchTerm })
```

-   **platform** (required) — exactly one of `"js"`, `"react"`, `"vue"`. There is no `ts`, `html`, `svelte`, etc.
-   **searchTerm** (required) — the component or concept to find, e.g. `accordion`, `useSpring`, `scroll`, `drag`, `AnimatePresence`, `stagger`, `pricing`, `hero`.

### Search by concept, not by the word "animation"

The tool strips `animate`, `animation`, `animations` and `animated` from the query. A search of only those words returns "too generic". Search the _thing_ being animated or the _API_ needed:

-   ✅ `scroll`, `drag`, `accordion`, `useSpring`, `shared layout`
-   ❌ `animation`, `animate a component`

Matching is fuzzy and typo-tolerant, so close terms still hit. Minimum 2 characters.

## 2. Return type

A short set of adaptation rules, followed by MCP **resource links**.

-   Up to **3 docs** first, for API and option lookups — `motion://docs/{platform}/{id}`.
-   Up to **5 examples** — `motion://examples/{platform}/{id}`.

**You must read each relevant resource link to get the actual doc or example.** Docs come first because they answer API questions; examples give working implementations to adapt.

If nothing matches, broaden the term and search again — results are capped and fuzzy, not exhaustive.

## 3. Implement

The response embeds adaptation rules. Follow them:

-   Adapt colours, fonts and styling to the host project; match its conventions (use Tailwind classes in a Tailwind project, and so on).
-   Install any referenced packages.
