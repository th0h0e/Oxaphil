<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const props = defineProps<{ items?: AccordionItem[] }>()
</script>

<template>
  <UAccordion
    v-if="props.items?.length"
    :items="props.items"
  />
</template>
