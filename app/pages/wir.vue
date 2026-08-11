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
          :key="index"
          variant="subtle"
        >
          <UUser
            :name="member.name"
            :description="[member.role, member.description].filter(Boolean).join(' — ')"
            :avatar="member.avatar"
            size="xl"
          />
        </UPageCard>
      </UPageColumns>
    </UPageSection>
  </UPage>
</template>
