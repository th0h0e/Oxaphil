<script setup lang="ts">
const { data: page } = await useAsyncData('wir', () => {
  return queryCollection('wir').first()
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
      :title="page.technology.title"
      :description="page.technology.description"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.technology.content"
        unwrap="p"
      />
    </UPageSection>
    <UPageSection
      :title="page.team.title"
      :description="page.team.description"
    >
      <UPageColumns>
        <UPageCard
          v-for="(member, index) in page.members"
          :id="member.id"
          :key="index"
          :title="member.name"
          :description="member.role"
          variant="subtle"
          orientation="vertical"
          reverse
          class="scroll-mt-24"
        >
          <img
            v-if="member.avatar"
            :src="member.avatar.src"
            :alt="member.avatar.alt"
            class="w-full rounded-lg aspect-square object-cover"
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
