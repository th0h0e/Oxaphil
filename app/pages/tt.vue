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

<!-- <UApp>
  <NuxtLayout>
    <UContainer>
      <AppHeader :links="navLinks" />
        <UMain class="relative">
          <NuxtPage />
      <AppFooter /> -->

<template>
  <UPage>
    <UPageBody class="border border-secondary-400">
      <UPageHero
        class="border border-secondary-400"
        title="Ultimate Vue UI library"
        description="A Nuxt/Vue-integrated UI library providing a rich set of fully-styled, accessible and highly customizable components for building modern web applications."
      />
      <UPageSection class="py-0! border border-secondary-400">
        <div class="w-full h-screen border border-default" />
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
