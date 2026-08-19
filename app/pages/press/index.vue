<script setup lang="ts">
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/press').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('press').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
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

const entry = {
  initial: { opacity: 0, transform: 'translateY(10px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  inViewOptions: { once: true }
}

const imageVariants = {
  hovered: {
    outlineColor: 'var(--ui-primary)',
    transition: { ease: 'easeOut', duration: 1 }
  }
}

const imageClass = 'rounded-lg outline-3 -outline-offset-3 outline-muted group-hover/blog-post:scale-100'
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
          while-hover="hovered"
        >
          <UBlogPost
            variant="subtle"
            orientation="horizontal"
            :to="post.path"
            v-bind="post"
            :ui="{
              root: 'md:grid md:grid-cols-2 overflow-visible',
              header: 'overflow-visible'
            }"
          >
            <template #header="{ ui }">
              <Motion
                as="img"
                :src="post.image"
                :alt="post.title"
                :class="ui.image({ to: true, class: imageClass })"
                :variants="imageVariants"
              />
            </template>
          </UBlogPost>
        </Motion>
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
