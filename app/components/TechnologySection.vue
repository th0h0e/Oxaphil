<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  content: string
}>()
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    :ui="{
      container: 'pt-0!',
      headline: 'justify-start',
      title: 'text-left',
      description: 'text-left'
    }"
  >
    <USeparator />
    <MDC
      :value="content"
      class="prose prose-primary dark:prose-invert max-w-none"
    />
  </UPageSection>
</template>
