<script setup lang="ts">
const { data: page } = await useAsyncData('neuigkeiten', () => {
  return queryCollection('neuigkeiten').first()
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const firstItems = computed(() => page.value?.items.slice(0, 3) ?? [])
const laterItems = computed(() => page.value?.items.slice(3) ?? [])
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
      <div class="flex flex-col gap-6">
        <Motion
          v-for="(item, index) in firstItems"
          :key="item.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.2 * index }"
          :in-view-options="{ once: true }"
        >
          <UPageCard
            :title="item.title"
            :description="item.description"
            :to="item.to"
          >
            <template #leading>
              <span class="text-sm text-muted">
                {{ formatDate(item.date) }}
              </span>
            </template>
            <div class="flex flex-wrap gap-4 mt-4">
              <img
                v-for="(image, imageIndex) in item.images"
                :key="imageIndex"
                :src="image.src"
                :alt="image.alt"
                class="rounded-lg h-48 object-cover"
              >
            </div>
          </UPageCard>
        </Motion>

        <UPageCard
          :title="page.about.title"
          variant="subtle"
          orientation="horizontal"
        >
          <MDC
            :value="page.about.content"
            unwrap="p"
          />
          <template #leading>
            <img
              :src="page.about.logo.src"
              :alt="page.about.logo.alt"
              class="h-12 w-auto object-contain"
            >
          </template>
        </UPageCard>

        <Motion
          v-for="(item, index) in laterItems"
          :key="item.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.2 * index }"
          :in-view-options="{ once: true }"
        >
          <UPageCard
            :title="item.title"
            :description="item.description"
            :to="item.to"
          >
            <template #leading>
              <span class="text-sm text-muted">
                {{ formatDate(item.date) }}
              </span>
            </template>
            <div class="flex flex-wrap gap-4 mt-4">
              <img
                v-for="(image, imageIndex) in item.images"
                :key="imageIndex"
                :src="image.src"
                :alt="image.alt"
                class="rounded-lg h-48 object-cover"
              >
            </div>
          </UPageCard>
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
