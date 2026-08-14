<script setup lang="ts">
const { data: page } = await useAsyncData('landing', () => {
  return queryCollection('landing').first()
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
      :links="page.links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    />
    <UPageSection
      :title="page.video.title"
      :description="page.video.description"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <VideoEmbed
        :title="page.video.title"
        :provider="page.video.provider"
        :src="page.video.src"
        :poster="page.video.poster"
      />
    </UPageSection>
    <UPageSection
      v-if="page.valueProps"
      :title="page.valueProps.title"
      :description="page.valueProps.description"
      :features="page.valueProps.items"
    />
  </UPage>
</template>
