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

usePageSeo(page, { type: 'image', src: '/img/news-oxaphil-logo.png' })
</script>

<template>
  <UPage v-if="page">
    <Hero :page />
    <TestingColors />
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
    <FAQ :page />
    <Testimonials :page />
    <Press :page />
  </UPage>
</template>
