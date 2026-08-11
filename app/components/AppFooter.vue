<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter
    class="z-10 bg-default"
    :ui="{ left: 'text-muted text-xs' }"
  >
    <template
      v-if="footer?.logos"
      #top
    >
      <div class="flex flex-wrap items-center justify-center gap-8">
        <div
          v-for="(logo, index) of footer.logos"
          :key="index"
          class="flex items-center gap-2"
        >
          <span
            v-if="logo.label"
            class="text-xs text-muted"
          >{{ logo.label }}</span>
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-10 w-auto object-contain"
          >
        </div>
      </div>
    </template>

    <template #left>
      {{ footer.credits }}
    </template>

    <template #right>
      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
