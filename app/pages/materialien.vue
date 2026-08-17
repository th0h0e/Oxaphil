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
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

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
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left'
      }"
    />
    <template v-for="(section, index) in sections" :key="section.id">
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
    >
      <LiteratureList :references="literature.references" />
    </UPageSection>
  </UPage>
</template>
