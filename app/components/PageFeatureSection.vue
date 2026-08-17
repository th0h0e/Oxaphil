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
  content?: string
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
          <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-highlighted">
            {{ title }}
          </h2>
        </template>
      </UPageCard>

      <UPageCard
        variant="naked"
        :class="reverse ? 'sm:order-1' : 'sm:order-2'"
        :ui="{ container: 'justify-center' }"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full rounded-lg"
        >
      </UPageCard>

      <UPageCard
        v-if="content"
        variant="naked"
        class="col-span-full sm:order-3"
      >
        <MDC
          :value="content"
          class="prose prose-primary dark:prose-invert max-w-none"
        />
      </UPageCard>

      <UPageCard
        v-for="(feature, index) in features"
        :key="index"
        v-bind="feature"
        variant="soft"
        class="col-span-full sm:order-4"
      />
    </UPageGrid>
  </section>
</template>
