<script setup lang="ts">
import type { ProgressGroupItem } from '@nuxt/ui'

const items = ref<ProgressGroupItem[]>([
  {
    label: 'neutral',
    value: 24,
    color: 'neutral',
    icon: 'i-lucide-cog'
  },
  {
    label: 'info',
    value: 20,
    color: 'info',
    icon: 'i-lucide-app-window'
  },
  {
    label: 'error',
    value: 15,
    color: 'error',
    icon: 'i-lucide-app-window'
  },
  {
    label: 'warning',
    value: 12,
    color: 'warning',
    icon: 'i-lucide-file'
  },
  {
    label: 'success',
    value: 42,
    color: 'success',
    icon: 'i-lucide-film'
  }
])
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 justify-center p-24 "
  >
    <UCard
      title="Card with description"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      class="w-full"
      variant="subtle"
    >
      <template #footer>
        <UProgressGroup
          size="lg"
          :max="128"
          :items="items"
          class="w-full"
        />
      </template>
    </UCard>

    <UBadge
      color="neutral"
      size="xl"
    >
      neutral
    </UBadge>
    <UBadge
      color="primary"
      size="xl"
      variant="outline"
    >
      primary
    </UBadge>
    <UBadge
      color="info"
      size="xl"
    >
      info
    </UBadge>
    <UBadge
      color="error"
      size="xl"
    >
      error
    </UBadge>
  </div>
</template>
