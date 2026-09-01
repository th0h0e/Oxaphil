<script setup lang="ts">
/**
 * Two images side by side. Used as an MDC block in markdown:
 *
 * ::image-pair
 * ---
 * left:
 *   src: /img/a.jpg
 *   alt: Left image
 * right:
 *   src: /img/b.jpg
 *   alt: Right image
 * ---
 * ::
 *
 * Stacks to one column below the `sm` breakpoint. Each image keeps its
 * aspect ratio via `object-cover` within a fixed height, matching the
 * rounded style of inline prose images on the site.
 */
const props = defineProps<{
  left: { src: string, alt: string }
  right: { src: string, alt: string }
}>()
</script>

<template>
  <div class="grid gap-4 my-6 sm:grid-cols-2">
    <img
      :src="props.left.src"
      :alt="props.left.alt"
      class="rounded-lg w-full h-full max-h-[32rem] object-cover"
    >
    <img
      :src="props.right.src"
      :alt="props.right.alt"
      class="rounded-lg w-full h-full max-h-[32rem] object-cover"
    >
  </div>
</template>
