import type { OgImageComponents } from '#og-image/components'

type RequestPage = {
  title?: string
  description?: string
  image?: string
}

type OgImageOverride
  = | { type: 'image', src: string }
    | { type: 'template', component?: keyof OgImageComponents, props?: Record<string, unknown> }

export function usePageSeo<T extends RequestPage>(
  page: Ref<T | null | undefined>,
  ogImage?: OgImageOverride
) {
  const title = computed(() => page.value?.title)
  const description = computed(() => page.value?.description)

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description
  })

  if (ogImage?.type === 'image') {
    // Rare one-off: emit a plain og:image without a template.
    useSeoMeta({ ogImage: ogImage.src })
  } else {
    // Default: shared template, thumbnail = frontmatter `image`.
    defineOgImage(ogImage?.component || 'Article', {
      title,
      thumbnail: page.value?.image,
      ...ogImage?.props
    })
  }
}
