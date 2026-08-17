<script setup lang="ts">
const { data: page } = await useAsyncData('materialien', () => {
  return queryCollection('materialien').first()
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
    <PageFeatureSection
      id="pox-als-plattform"
      :title="page.platform.title"
      :description="page.platform.description"
      :icon="page.platform.icon"
      :image="page.platform.image"
      :content="page.platform.content"
      :features="page.platform.features"
    />
    <USeparator />
    <PageFeatureSection
      id="anwendungen"
      :title="page.anwendungen.title"
      :description="page.anwendungen.description"
      :icon="page.anwendungen.icon"
      :image="page.anwendungen.image"
      :content="page.anwendungen.content"
      :features="page.anwendungen.features"
      reverse
    />
    <USeparator />
    <UPageSection
      id="literatur"
      :title="page.literature.title"
      :description="page.literature.description"
    >
      <LiteratureList :references="page.literature.references" />
    </UPageSection>
  </UPage>
</template>
