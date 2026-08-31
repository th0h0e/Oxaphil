type PageMeta = {
  title?: string
  description?: string
  image?: string
}

type OgImageOverride
  = | { type: 'image', src: string }
    | { type: 'template', props?: Record<string, unknown> }

/**
 * Sets the HTML head meta tags from a page's title and description, plus an
 * OG image. Defaults to the Oxaphil OG-image template. Pass `ogImage` to
 * override: a static image URL or a different template with extra props.
 *
 * Reads the content `title` and `description` fields directly. The content
 * `seo` field is hidden from Studio and left empty, so it is not read here.
 */
export function usePageSeo<T extends PageMeta>(page: Ref<T | null | undefined>, ogImage?: OgImageOverride) {
  const title = computed(() => page.value?.title)
  const description = computed(() => page.value?.description)

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description
  })

  if (ogImage?.type === 'image') {
    useSeoMeta({ ogImage: ogImage.src })
  } else {
    defineOgImage('Oxaphil', { title, description, ...ogImage?.props })
  }
}
