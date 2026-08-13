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
          variant="subtle"
          class="scroll-mt-24"
        >
          <UUser
            :name="member.name"
            :description="member.role"
            :avatar="member.avatar"
            size="xl"
          />
          <div
            v-if="member.tags?.length"
            class="flex flex-wrap gap-2 mt-4"
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
        </UPageCard>
      </UPageColumns>
    </UPageSection>
  </UPage>
</template>
