<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const open = ref(false)
const route = useRoute()

// The slideover stays mounted across navigations, so close it manually on route change
watch(() => route.path, () => {
  open.value = false
})

const pillClass = 'pointer-events-auto bg-muted/80 backdrop-blur-sm rounded-full border border-muted/50 shadow-lg shadow-neutral-950/5'
</script>

<template>
  <div class="fixed inset-x-0 top-2 sm:top-4 z-10 w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
    <UNavigationMenu
      :class="[pillClass, 'hidden sm:flex px-4']"
      :items="links"
      variant="link"
      color="neutral"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>

    <div :class="[pillClass, 'sm:hidden w-full flex items-center justify-between px-2 py-1']">
      <ColorModeButton />
      <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        size="sm"
        class="rounded-full"
        aria-label="Menü öffnen"
        @click="open = true"
      />
    </div>

    <USlideover
      v-model:open="open"
      side="top"
      inset
      :ui="{
        content: 'bg-muted/80 backdrop-blur-md border border-muted/50 divide-none shadow-lg shadow-neutral-950/5',
        header: 'p-2 min-h-0',
        body: 'p-2 pt-0'
      }"
    >
      <template #body>
        <UNavigationMenu
          :items="links"
          orientation="vertical"
          variant="link"
          color="neutral"
          :ui="{
            link: 'px-3 py-2',
            linkLeadingIcon: 'hidden'
          }"
        />
      </template>
    </USlideover>
  </div>
</template>
