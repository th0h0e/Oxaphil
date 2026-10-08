<script setup lang="ts">
interface Feature {
  title: string
  description: string
  icon?: string
}

interface ImageProp {
  src: string
  alt: string
}

defineProps<{
  /** Vollständiges `materialienSections`-Dokument */
  section: {
    id?: string
    title: string
    description?: string
    icon?: string
    image: ImageProp
    features?: Feature[]
  }
  /** Ob die Bild-/Textspalten getauscht werden (von der Page aus dem Loop-Index abgeleitet) */
  reverse?: boolean
}>()
</script>

<template>
  <section
    :id="section.id"
    class="scroll-mt-24 py-16 sm:py-24 lg:py-32"
  >
    <UPageGrid class="lg:grid-cols-2">
      <UPageCard
        :icon="section.icon"
        :description="section.description"
        variant="subtle"
        :class="reverse ? 'sm:order-2' : 'sm:order-1'"
        :ui="{ description: 'text-base' }"
      >
        <template #title>
          <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-highlighted py-4">
            {{ section.title }}
          </h2>
        </template>
      </UPageCard>

      <UPageCard
        variant="naked"
        :class="reverse ? 'sm:order-1' : 'sm:order-2'"
      >
        <img
          :src="section.image.src"
          :alt="section.image.alt"
          class="w-full rounded-lg"
        >
      </UPageCard>

      <Motion
        v-for="(feature, index) in section.features"
        :key="index"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
        class="col-span-full sm:order-4"
      >
        <UPageCard
          v-bind="feature"
          variant="outline"
          :ui="{ description: 'text-base' }"
        />
      </Motion>
    </UPageGrid>
  </section>
</template>
