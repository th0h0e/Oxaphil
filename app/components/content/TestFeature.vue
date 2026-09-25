<script setup lang="ts">
// Props here are the single source of truth for this feature's content schema:
// `schema/testFeature.ts` derives it via `property(...).inherit(...)`, so adding
// a prop below is enough to expose it in Studio — no schema edit needed.
// `title` and `description` stay available as slots too, so the MDC usage in
// `content/datenschutzerklaerung-2.md` keeps rendering rich text.
withDefaults(defineProps<{
  /** Symbol links neben dem Text */
  icon?: string
  /** Überschrift der Feature-Zeile */
  title?: string
  /** Beschreibungstext unter der Überschrift */
  description?: string
}>(), {
  icon: 'i-lucide-cursor-click',
  title: '',
  description: ''
})
</script>

<template>
  <div class="flex items-start border border-primary gap-3">
    <div class="flex items-center justify-center border rounded-lg p-1.5">
      <UIcon :name="icon" />
    </div>
    <div class="flex flex-col">
      <h3 class="font-semibold">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <span>
        <slot name="description">{{ description }}</slot>
      </span>
    </div>
  </div>
</template>
