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
    <UPageSection
      id="pox-als-plattform"
      :title="page.platform.title"
      :description="page.platform.description"
      orientation="horizontal"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.platform.content"
        unwrap="p"
      />
      <img
        :src="page.platform.image.src"
        :alt="page.platform.image.alt"
        class="rounded-lg w-full object-cover"
      >
    </UPageSection>
    <UPageSection
      id="anwendungen"
      :title="page.anwendungen.title"
      :description="page.anwendungen.description"
      orientation="horizontal"
      reverse
    >
      <MDC
        :value="page.anwendungen.content"
        unwrap="p"
      />
      <img
        :src="page.anwendungen.image.src"
        :alt="page.anwendungen.image.alt"
        class="rounded-lg w-full object-cover"
      >
    </UPageSection>
  </UPage>
</template>
