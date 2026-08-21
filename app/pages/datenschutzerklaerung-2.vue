<script setup lang="ts">
const { data: page } = await useAsyncData('datenschutzerklaerung-2', () => {
  return queryCollection('datenschutz').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page)
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
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />
    </UPageSection>
  </UPage>
</template>
