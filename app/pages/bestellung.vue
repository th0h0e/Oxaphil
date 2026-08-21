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

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
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
      :title="product.title"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
        class="mb-8 text-muted"
      />

      <ProductCard
        :name="product.name"
        :chemical-name="product.chemicalName"
        :specs="product.specs"
        :price="product.price"
        :image="product.image"
      />
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
