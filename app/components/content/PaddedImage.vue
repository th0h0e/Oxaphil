<script setup lang="ts">
/**
 * A single image with horizontal padding so it doesn't span the full
 * content width. Used as an MDC block in markdown:
 *
 * ::padded-image
 * ---
 * src: /img/a.jpg
 * alt: Description
 * ---
 * ::
 *
 * The default padding keeps the image centered and readable on wide
 * viewports. Override per-instance with the `class` prop (e.g.
 * `:class="'px-32'"`) if a different inset is needed.
 */
const props = withDefaults(defineProps<{
  src: string
  alt: string
  class?: string
}>(), {
  class: 'px-8 sm:px-16 md:px-32 lg:px-48 xl:px-64'
})
</script>

<template>
  <div
    class="my-6"
    :class="props.class"
  >
    <img
      :src="props.src"
      :alt="props.alt"
      class="rounded-lg w-full h-auto object-cover"
    >
  </div>
</template>
