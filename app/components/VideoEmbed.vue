<script setup lang="ts">
defineProps<{
  title: string
  provider: 'file' | 'youtube'
  src: string
  poster?: string
}>()
</script>

<template>
  <div class="aspect-video overflow-hidden rounded-lg ring ring-default bg-elevated">
    <iframe
      v-if="provider === 'youtube'"
      :src="`https://www.youtube-nocookie.com/embed/${src}`"
      :title="title"
      class="size-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
    <video
      v-else
      :src="src"
      :poster="poster"
      class="size-full object-cover"
      controls
      playsinline
    />
  </div>
</template>
