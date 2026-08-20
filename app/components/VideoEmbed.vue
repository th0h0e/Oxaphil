<script setup lang="ts">
const props = defineProps<{
  link: string
}>()

// Extract a YouTube video ID from a full URL or raw ID
const youtubeId = computed(() => {
  const { link } = props
  if (!link) return ''

  // youtu.be/ID or youtu.be/ID?foo
  const short = link.match(/(?:https?:\/\/)?youtu\.be\/([\w-]+)/)
  if (short) return short[1]

  // youtube.com/watch?v=ID, youtube.com/embed/ID, with or without www/scheme
  const long = link.match(/[?&]v=([\w-]+)|youtube\.com\/(?:embed|shorts|live)\/([\w-]+)/)
  if (long) return long[1] ?? long[2]

  // raw ID
  if (/^[\w-]{11}$/.test(link)) return link

  return link
})
</script>

<template>
  <div class="aspect-video overflow-hidden rounded-lg ring ring-default bg-elevated">
    <iframe
      :src="`https://www.youtube-nocookie.com/embed/${youtubeId}`"
      class="size-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </div>
</template>
