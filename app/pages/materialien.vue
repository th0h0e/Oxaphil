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
    <UPageSection
      v-if="literature"
      id="literatur"
      :title="literature.title"
      :description="literature.description"
      :ui="{
        title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold',
        description: 'text-left my-2 text-muted'
      }"
    >
      <LiteratureList :references="literature.references" />
    </UPageSection>
    <UPageSection
      v-if="cards"
      id="anwendungen"
      :title="cards.title"
      :description="cards.description"
      :ui="{
        title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold',
        description: 'text-left my-2 text-muted'
      }"
    >
      <CardGrid :cards="cards.cards ?? []" />
    </UPageSection>
    <UPageSection
      v-if="faqs"
      id="faq"
      title="Häufige Fragen zu den Materialien"
      :ui="{
        title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold'
      }"
    >
      <FAQKatalog :items="faqs?.faqs ?? []" />
    </UPageSection>
  </UPage>
</template>
