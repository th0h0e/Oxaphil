<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { data: posts } = await useAsyncData('index-press', () =>
  queryCollection('press').order('date', 'DESC').limit(3).all()
)
if (!posts.value) {
  throw createError({ statusCode: 404, statusMessage: 'press posts not found', fatal: true })
}
</script>

<template>
  <UPageSection
    :title="page.press.title"
    :description="page.press.description"
    :ui="{
      container: 'px-0 pt-0! sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <UBlogPosts
      orientation="vertical"
      class="gap-4 lg:gap-y-4"
    >
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        orientation="horizontal"
        variant="naked"
        v-bind="post"
        :to="post.path"
        :ui="{
          root: 'group relative lg:items-start lg:flex ring-0 hover:ring-0 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-white',
          body: 'px-4!',
          header: 'hidden'
        }"
      >
        <template #footer>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="absolute top-4 right-4 size-3 text-muted transition-colors group-hover:text-primary"
          />
        </template>
      </UBlogPost>
    </UBlogPosts>
  </UPageSection>
</template>
