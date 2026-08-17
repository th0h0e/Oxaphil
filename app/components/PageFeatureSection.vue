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

const props = defineProps<{
  id?: string
  title: string
  description?: string
  icon?: string
  image: ImageProp
  features?: Feature[]
  reverse?: boolean
}>()
</script>

<template>
  <section
    :id="id"
    class="scroll-mt-24 py-8 sm:py-12"
  >
    <UPageGrid class="lg:grid-cols-2">
      <UPageCard
        :icon="icon"
        :description="description"
        variant="subtle"
        :class="reverse ? 'sm:order-2' : 'sm:order-1'"
        :ui="{ description: 'text-base' }"
      >
        <template #title>
          <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-highlighted py-4">
            {{ title }}
          </h2>
        </template>
      </UPageCard>

      <UPageCard
        variant="naked"
        :class="reverse ? 'sm:order-1' : 'sm:order-2'"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full rounded-lg"
        >
      </UPageCard>

      <Motion
        v-for="(feature, index) in features"
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
        />
      </Motion>
    </UPageGrid>
  </section>
</template>
