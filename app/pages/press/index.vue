<script setup lang="ts">
const { data: page } = await useAsyncData('press-index', () => {
  return queryCollection('pressIndex').path('/press').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: posts } = await useAsyncData('press-posts', () =>
  queryCollection('press').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'press posts not found',
    fatal: true
  })
}

usePageSeo(page)

const entry = {
  initial: { opacity: 0, transform: 'translateY(10px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  inViewOptions: { once: true }
}

const imageClass = 'rounded-lg group-hover/blog-post:scale-100'
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
      <UBlogPosts orientation="vertical">
        <Motion
          v-for="(post, index) in posts"
          :key="post.path"
          v-bind="entry"
          :transition="{ delay: 0.2 * index }"
        >
          <UBlogPost
            variant="subtle"
            orientation="horizontal"
            :to="post.path"
            v-bind="post"
            :ui="{
              root: 'md:grid md:grid-cols-2 overflow-visible rounded-xl bg-muted/20 dark:bg-slate-800/50 border border-white ring-0',
              header: 'overflow-visible'
            }"
          >
            <template #header="{ ui }">
              <Motion
                as="img"
                :src="post.image"
                :alt="post.title"
                :class="ui.image({ to: true, class: imageClass })"
              />
            </template>
          </UBlogPost>
        </Motion>
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
