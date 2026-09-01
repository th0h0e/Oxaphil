<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  content: string
  links?: Array<{
    label: string
    to: string
    icon?: string
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
    variant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
  }>
}>()
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    :ui="{
      title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold',
      description: 'text-left my-2 text-muted'
    }"
  >
    <MDC
      :value="content"
      class="prose prose-primary dark:prose-invert max-w-none"
    />

    <div
      v-if="links?.length"
      class="flex flex-wrap gap-3"
    >
      <UButton
        v-for="(link, index) in links"
        :key="index"
        :label="link.label"
        :to="link.to"
        :icon="link.icon"
        :color="link.color || 'primary'"
        :variant="link.variant || 'soft'"
      />
    </div>
  </UPageSection>
</template>
