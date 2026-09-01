<script setup lang="ts">
const { data: page } = await useAsyncData('bestellung', () => {
  return queryCollection('bestellung').first()
})
const { data: product } = await useAsyncData('bestellung-product', () => {
  return queryCollection('bestellungProduct').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

// Editors fill in `email` rather than hand-writing a `mailto:` URL (see the
// bestellung schema). A present-but-blank field falls back to the app-config
// address; links without the key keep their own `to`.
const links = computed(() => (page.value?.links ?? []).map(({ email, ...link }) => ({
  ...link,
  to: email === undefined ? link.to : `mailto:${email || global.email}`
})))

usePageSeo(page)
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    />
    <UPageSection
      v-if="product"
    >
      <!-- Headline, intro copy and product card share one frame, so the
           section reads as a single panel rather than three stacked blocks.
           The title lives here instead of on `UPageSection` because that prop
           renders above the default slot, outside the frame. -->
      <PanelFrame>
        <div class="rounded-lg bg-(--ui-bg) px-4 py-6">
          <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-highlighted">
            {{ product.title }}
          </h2>

          <MDC
            :value="page.content"
            unwrap="p"
            class="mt-4 text-muted"
          />
        </div>

        <ProductCard
          class="mt-2"
          :name="product.name"
          :chemical-name="product.chemicalName"
          :specs="product.specs"
          :price="product.price"
          :image="product.image"
        />
      </PanelFrame>
    </UPageSection>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <ContactCard
        v-if="page.contactCard"
        v-bind="page.contactCard"
      />
    </UPageSection>
  </UPage>
</template>
