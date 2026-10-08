<script setup lang="ts">
const { data: page } = await useAsyncData('materialien', () => {
  return queryCollection('materialien').first()
})
const { data: sections } = await useAsyncData('materialien-sections', () => {
  return queryCollection('materialienSections').all()
})
const { data: literature } = await useAsyncData('materialien-literatur', () => {
  return queryCollection('materialienLiteratur').first()
})
const { data: cards } = await useAsyncData('materialien-cards', () => {
  return queryCollection('materialienCards').first()
})
const { data: faqs } = await useAsyncData('materialien-faq', () => {
  return queryCollection('materialienFaq').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page)

definePageMeta({
  pageTransition: { name: 'page', mode: 'out-in' },
  layoutTransition: { name: 'layout', mode: 'out-in' }
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left'
      }"
    />
    <template
      v-for="(section, index) in sections"
      :key="section.id"
    >
      <PageFeatureSection
        :id="section.id"
        :title="section.title"
        :description="section.description"
        :icon="section.icon"
        :image="section.image"
        :features="section.features"
        :reverse="index % 2 === 1"
      />
      <USeparator />
    </template>
    <LiteratureList
      v-if="literature"
      :literature="literature"
    />
    <CardGrid
      v-if="cards"
      :cards="cards"
    />
    <FAQKatalog
      v-if="faqs"
      :faq="faqs"
    />
  </UPage>
</template>
