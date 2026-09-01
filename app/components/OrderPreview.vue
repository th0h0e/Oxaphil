<script setup lang="ts">
const { data: product } = await useAsyncData('bestellung-preview-product', () =>
  queryCollection('bestellungProduct').first()
)
</script>

<template>
  <UPageSection
    v-if="product"
    :ui="{
      container: 'px-0'
    }"
  >
    <!-- Headline and product card share one frame, matching /bestellung. The
         title lives here instead of on `UPageSection` because that prop
         renders above the default slot, outside the frame. -->
    <PanelFrame>
      <div class="rounded-lg bg-(--ui-bg) px-4 py-6">
        <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-highlighted">
          {{ product.title }}
        </h2>
      </div>

      <ProductCard
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
