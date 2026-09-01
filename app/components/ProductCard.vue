<script setup lang="ts">
interface Spec {
  label: string
  value: string
}

interface ImageProp {
  src: string
  alt: string
}

defineProps<{
  name: string
  chemicalName: string
  specs?: Spec[]
  price?: string
  image: ImageProp
}>()
</script>

<template>
  <UPageCard
    :title="name"
    :description="chemicalName"
    variant="subtle"
    orientation="horizontal"
    class="bg-(--ui-bg)"
    :ui="{ title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold' }"
    spotlight
    spotlight-color="primary"
  >
    <template #footer>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
        <template
          v-for="spec in specs"
          :key="spec.label"
        >
          <dt class="text-muted">
            {{ spec.label }}
          </dt>
          <dd class="text-default font-medium">
            {{ spec.value }}
          </dd>
        </template>
      </dl>

      <p
        v-if="price"
        class="mt-6 text-lg font-semibold text-primary"
      >
        {{ price }}
      </p>
    </template>

    <ProductMolecule
      :aria-label="image.alt"
      class="w-full text-highlighted"
    />
  </UPageCard>
</template>
