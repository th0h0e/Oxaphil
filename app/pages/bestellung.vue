<script setup lang="ts">
const { data: page } = await useAsyncData('bestellung', () => {
  return queryCollection('bestellung').first()
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
      :title="page.product.title"
      orientation="horizontal"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
      />
      <img
        :src="page.product.image.src"
        :alt="page.product.image.alt"
        class="rounded-lg w-full object-cover"
      >
    </UPageSection>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <UPageCard variant="subtle">
        <UUser
          :name="page.contact.name"
          :description="page.contact.role"
          :avatar="{ src: page.contact.photo.src, alt: page.contact.photo.alt }"
          size="xl"
        />
      </UPageCard>
    </UPageSection>
  </UPage>
</template>
