<script setup lang="ts">
interface Card {
  title: string
  description: string
  icon?: string
  to?: string
}

const props = defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <UPageGrid class="sm:grid-cols-2 lg:grid-cols-2">
    <UPageCard
      v-for="(card, index) in props.cards"
      :key="index"
      v-bind="card"
      variant="subtle"
      :ui="{ description: 'text-base' }"
    />
  </UPageGrid>
</template>
