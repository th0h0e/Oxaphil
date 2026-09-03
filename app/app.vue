<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#22292b' : '#f2f3f3') // mist-800 / mist-100

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'de'
  }
})

useSeoMeta({
  titleTemplate: '%s · Oxaphil',
  twitterCard: 'summary_large_image'
})

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([
      queryCollectionNavigation('press')
    ])
  }, {
    server: false,
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([
      queryCollectionSearchSections('press')
    ])
  }, {
    server: false,
    transform: data => data.flat()
  })
])
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage class="pt-20 md:pt-24" />
      </UMain>
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
