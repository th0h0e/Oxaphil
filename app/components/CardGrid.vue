<script setup lang="ts">
interface Card {
  title: string
  description: string
  icon?: string
  to?: string
}

const props = defineProps<{
  /** Vollständiges `materialienCards`-Dokument (Title/Description/Cards) */
  cards?: {
    title?: string
    description?: string
    cards: Card[]
  }
}>()
</script>

<template>
  <UPageSection
    v-if="props.cards?.cards?.length"
    id="anwendungen"
    :title="props.cards.title"
    :description="props.cards.description"
    :ui="{
      title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold',
      description: 'text-left my-2 text-muted'
    }"
  >
    <UPageGrid class="sm:grid-cols-2 lg:grid-cols-2">
      <UPageCard
        v-for="(card, index) in props.cards.cards"
        :key="index"
        v-bind="card"
        variant="subtle"
        :ui="{ description: 'text-base' }"
      />
    </UPageGrid>
  </UPageSection>
</template>
