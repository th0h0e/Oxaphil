<script setup lang="ts">
/**
 * "Über Oxaphil" card inserted into the /neuigkeiten list. Used as an MDC
 * block component inside content/neuigkeiten.md. The default slot receives
 * the about text as markdown; `mdc-unwrap="p"` strips the wrapping <p> so
 * the text flows inline within the horizontal card, matching the original
 * `<MDC :value="page.about.content" unwrap="p" />` behavior.
 */
defineProps<{
  title: string
  logo: { src: string, alt: string }
}>()
</script>

<template>
  <UPageCard
    :title="title"
    variant="subtle"
    orientation="horizontal"
  >
    <slot mdc-unwrap="p" />

    <template #leading>
      <img
        :src="logo.src"
        :alt="logo.alt"
        class="h-12 w-auto object-contain"
      >
    </template>
  </UPageCard>
</template>
