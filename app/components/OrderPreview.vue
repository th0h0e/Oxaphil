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
    :ui="{
      container: 'px-0 pt-0! sm:gap-6 lg:gap-8'
    }"
  >
    <!-- Headline and product card share one frame, matching /bestellung. The
         title lives here instead of on `UPageSection` because that prop
         renders above the default slot, outside the frame. -->
    <PanelFrame>
      <div class="rounded-lg bg-(--ui-bg) p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-highlighted">
          {{ product.title }}
        </h2>
      </div>

      <ProductCard
        class="mt-2"
        :name="product.name"
        :chemical-name="product.chemicalName"
        :specs="product.specs"
        :price="product.price"
        :image="product.image"
      />

      <div class="mt-2 rounded-lg bg-(--ui-bg) p-4 flex flex-col sm:flex-row gap-2">
        <UButton
          to="/bestellung"
          label="Bestellen"
          icon="i-lucide-shopping-cart"
          size="md"
          color="primary"
          variant="soft"
          block
          class="sm:w-auto"
        />
        <UButton
          to="/materialien"
          label="Materialien"
          icon="i-lucide-layers"
          color="neutral"
          variant="soft"
          size="md"
          block
          class="sm:w-auto"
        />
      </div>
    </PanelFrame>
  </UPageSection>
</template>
