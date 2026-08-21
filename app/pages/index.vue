<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
  ogImage: '/img/news-oxaphil-logo.png'
})
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      v-if="page.video"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <VideoEmbed
        :link="page.video.link"
      />
    </UPageSection>
    <UPageSection
      v-if="page.valueProps"
      :title="page.valueProps.title"
      :description="page.valueProps.description"
      :features="page.valueProps.items"
    />
    <LandingFAQ :page />
    <LandingTestimonials :page />
    <LandingPress :page />
  </UPage>
</template>
