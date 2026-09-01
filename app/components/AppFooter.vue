<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter
    class="z-10 w-full max-w-(--ui-container) mx-auto rounded-xl bg-muted/20 backdrop-blur-sm shadow-lg shadow-neutral-950/5"
    :ui="{
      left: 'text-muted text-xs',
      top: 'px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-2 lg:pb-3',
      container: 'px-4 sm:px-6 lg:px-8 max-w-none'
    }"
  >
    <template
      v-if="footer?.logos"
      #top
    >
      <div class="flex flex-wrap items-end justify-center gap-8">
        <div
          v-for="(logo, index) of footer.logos"
          :key="index"
          class="flex flex-col items-center gap-2"
        >
          <span
            v-if="logo.label"
            class="text-xs text-muted"
          >{{ logo.label }}</span>
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-4 w-auto object-contain opacity-70 transition-opacity hover:opacity-100"
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
