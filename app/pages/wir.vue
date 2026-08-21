<script setup lang="ts">
const { data: page } = await useAsyncData('wir', () => {
  return queryCollection('wir').first()
})
const { data: members } = await useAsyncData('team', () => {
  return queryCollection('team').all()
})
const { data: technology } = await useAsyncData('wir-technology', () => {
  return queryCollection('wirTechnology').first()
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
    <TechnologySection
      v-if="technology"
      :title="technology.title"
      :description="technology.description"
      :content="technology.content"
    />
    <USeparator />
    <UPageSection
      :title="page.team.title"
      :description="page.team.description"
      :ui="{
        headline: 'justify-start',
        title: 'text-left',
        description: 'text-left'
      }"
    >
      <UPageColumns>
        <UPageCard
          v-for="member in members"
          :id="member.id"
          :key="member.id"
          :title="member.name"
          :description="member.role"
          variant="subtle"
          orientation="vertical"
          reverse
          class="scroll-mt-24"
          :ui="{
            root: 'overflow-hidden',
            container: 'p-0 sm:p-0 gap-y-4',
            wrapper: 'px-4 sm:px-6 pb-4 sm:pb-6'
          }"
        >
          <img
            v-if="member.avatar"
            :src="member.avatar.src"
            :alt="member.avatar.alt"
            class="w-full aspect-4/5 object-cover"
          >

          <template #footer>
            <div
              v-if="member.tags?.length"
              class="flex flex-wrap gap-2"
            >
              <UBadge
                v-for="tag in member.tags"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>
  </UPage>
</template>
