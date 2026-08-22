<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  headline?: string
  title?: string
  description?: string
}>()
</script>

<template>
  <div
    class="w-full h-full flex bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden"
    data-theme="light"
  >
    <div class="absolute top-0 left-0 w-1.5 h-full bg-primary-400" />

    <div class="flex flex-col justify-between flex-1 px-20 py-16">
      <div />

      <div class="flex flex-col gap-5">
        <span
          v-if="headline"
          class="text-2xl font-medium text-primary-600 dark:text-primary-400"
          style="font-family: 'Public Sans', sans-serif"
        >
          {{ headline }}
        </span>

        <h1
          v-if="title"
          class="text-6xl font-bold text-primary-700 dark:text-primary-300"
          style="font-family: 'Public Sans', sans-serif"
        >
          {{ title }}
        </h1>

        <p
          v-if="description"
          class="text-3xl/11 text-neutral-700 dark:text-neutral-200"
          style="font-family: 'Public Sans', sans-serif; lineClamp: 2; textOverflow: 'ellipsis'"
        >
          {{ description }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <div class="h-px flex-1 bg-neutral-200 dark:bg-border" />
        <span
          class="text-xl text-neutral-500 dark:text-neutral-400"
          style="font-family: 'Public Sans', sans-serif"
        >
          oxaphil.com
        </span>
      </div>
    </div>
  </div>
</template>
