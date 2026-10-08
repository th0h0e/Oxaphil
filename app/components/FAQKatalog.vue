<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

// Renders the plain FAQ accordion section used on /materialien and /bestellung.
// Accepts the whole `materialienFaq`/`bestellungFaq` content document so the
// page doesn't bind the items prop or wrap this in a UPageSection.
defineProps<{
  faq?: {
    title?: string
    description?: string
    faqs: AccordionItem[]
  }
}>()
</script>

<template>
  <UPageSection
    v-if="faq?.faqs?.length"
    id="faq"
    :title="faq.title"
    :description="faq.description"
    :ui="{
      title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold',
      description: 'text-left my-2 text-muted'
    }"
  >
    <UAccordion
      :items="faq.faqs"
      :ui="{
        trigger: 'text-base py-4',
        body: 'text-base py-1 text-muted',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }"
    />
  </UPageSection>
</template>
