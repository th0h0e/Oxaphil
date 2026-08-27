<script setup lang="ts">
/**
 * News card for the /neuigkeiten page. Used as an MDC block component
 * inside content/neuigkeiten.md. The default slot receives the item's
 * markdown body (rendered by MDC), replacing the former YAML `content`
 * string that was passed to `<MDC :value="...">`.
 *
 * The Motion fade matches the press/index.vue `entry` convention.
 * Per-item stagger delay was dropped when moving to a flat markdown list
 * (no array index available); timing is now uniform.
 */
const props = defineProps<{
  title: string
  date: string
  location?: string
  description?: string
  to?: string
  images?: { src: string, alt: string }[]
}>()

const entry = {
  initial: { opacity: 0, transform: 'translateY(10px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  inViewOptions: { once: true }
}

const meta = computed(() =>
  [formatDate(props.date), props.location]
    .filter(Boolean)
    .join(' · ')
)

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <Motion v-bind="entry">
    <UPageCard
      :title="props.title"
      :description="props.description"
      :to="props.to"
      :ui="{ title: 'text-xl' }"
    >
      <template #leading>
        <span class="text-sm text-muted">{{ meta }}</span>
      </template>

      <slot />

      <div
        v-if="props.images?.length"
        class="grid gap-4 mt-4"
        :class="props.images.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'"
      >
        <img
          v-for="(image, imageIndex) in props.images"
          :key="imageIndex"
          :src="image.src"
          :alt="image.alt"
          class="rounded-lg w-full max-h-[32rem] object-cover"
        >
      </div>
    </UPageCard>
  </Motion>
</template>
