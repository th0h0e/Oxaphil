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
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description,
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
        :title="page.video.title"
        :provider="page.video.provider"
        :src="page.video.src"
        :poster="page.video.poster"
      />
    </UPageSection>
    <LandingFAQ :page />
    <LandingTestimonials :page />
    <LandingBlog :page />
  </UPage>
</template>
