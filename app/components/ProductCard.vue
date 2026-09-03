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
    reverse
    orientation="horizontal"
    class="bg-(--ui-bg)"
    :ui="{
      title: 'pl-0 lg:pl-20 text-left text-xl sm:text-xl lg:text-2xl text-pretty font-bold',
      description: 'pl-0 lg:pl-20 mb-4'
    }"
    spotlight
    spotlight-color="primary"
  >
    <template #footer>
      <dl class="pl-0 lg:pl-20 grid grid-cols-2 gap-x-6 gap-y-1">
        <template
          v-for="spec in specs"
          :key="spec.label"
        >
          <dt class="text-muted">
            {{ spec.label }}
          </dt>
          <dd class="text-default">
            {{ spec.value }}
          </dd>
        </template>
      </dl>

      <p
        v-if="price"
        class="mt-12 pl-0 lg:pl-20 text-lg font-bold text-primary"
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
