<script setup lang="ts">
const { data: page } = await useAsyncData('kontakt', () => {
  return queryCollection('kontakt').first()
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
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
      />
      <div
        v-if="page.email"
        class="mt-6"
      >
        <UButton
          :label="page.email"
          icon="i-lucide-mail"
          variant="outline"
          color="neutral"
          :to="`mailto:${page.email}`"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
