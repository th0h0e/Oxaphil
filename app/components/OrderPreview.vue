<script setup lang="ts">
const { data: page } = await useAsyncData('bestellung-preview', () =>
  queryCollection('bestellung').first()
)
const { data: product } = await useAsyncData('bestellung-preview-product', () =>
  queryCollection('bestellungProduct').first()
)
</script>

<template>
  <UPageSection
    v-if="product"
    :title="product.title"
    :ui="{
      container: 'px-0 pt-0! sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium'
    }"
  >
    <ProductCard
      :name="product.name"
      :chemical-name="product.chemicalName"
      :specs="product.specs"
      :price="product.price"
      :image="product.image"
    />
  </UPageSection>

  <UPageSection
    v-if="page?.contactCard"
    :ui="{
      container: 'px-0 pt-0!'
    }"
  >
    <ContactCard v-bind="page.contactCard" />
  </UPageSection>
</template>
