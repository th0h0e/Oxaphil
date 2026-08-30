<script setup lang="ts">
defineProps<{
  label?: string
  icon?: string
}>()
</script>

<template>
  <div class="rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-default w-full">
    <div
      v-if="label || $slots.badge"
      class="flex items-center gap-2 rounded-t-xl border-b border-tertiary/15 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-2"
    >
      <slot name="badge">
        <UBadge
          :label="label"
          :icon="icon"
          color="tertiary"
          variant="subtle"
        />
      </slot>
    </div>

    <slot />
  </div>
</template>
