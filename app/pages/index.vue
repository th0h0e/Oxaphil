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
    <HeroFrame
      label="Poly(2-oxazolin)"
      icon="i-lucide-sparkles"
    >
      <IndexHero :page />
    </HeroFrame>

    <UPageSection
      v-if="page.valueProps"
      :title="page.valueProps.title"
      :description="page.valueProps.description"
      :features="page.valueProps.items"
    />
    <FAQ :page />
    <OrderPreview />
    <Testimonials :page />
    <Press :page />
  </UPage>
</template>
