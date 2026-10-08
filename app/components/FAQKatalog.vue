<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const props = defineProps<{ items?: AccordionItem[] }>()
</script>

<template>
  <UAccordion
    v-if="props.items?.length"
    :items="props.items"
    :ui="{
      trigger: 'text-base py-4',
      body: 'text-base py-1 text-muted',
      leadingIcon: 'size-6',
      trailingIcon: 'size-6'
    }"
  />
</template>
