<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const open = ref(false)
const route = useRoute()

// DropdownMenu auto-closes on item select, but close on route change too —
// covers browser back/forward and programmatic navigation.
watch(() => route.path, () => {
  open.value = false
})

// Map nav links to dropdown items. label/icon/to are shared, but the types
// differ (NavigationMenuItem vs DropdownMenuItem), so map for type safety.
const items = computed<DropdownMenuItem[]>(() =>
  props.links.map(({ label, icon, to }) => ({ label, icon, to }))
)

const pillClass = 'pointer-events-auto bg-muted/80 backdrop-blur-sm rounded-lg sm:rounded-full border border-muted/50 shadow-lg shadow-neutral-950/5'
</script>

<!--
  Teleport the whole nav bar to <body> so it lives in the root stacking
  context. Previously the header sat inside the layout's UContainer, whose
  own stacking context capped the header's z-10 below the teleported backdrop
  (z-5 at root). Now both share the root context and z-index compares
  directly: backdrop z-5 < nav bar z-10 < dropdown content z-50.
-->
<template>
  <div class="fixed inset-0 h-dvh z-5">
    <div
      v-if="open"
      class="sm:hidden fixed inset-0 z-0 bg-elevated/75 backdrop-blur-md"
    />
    <Teleport to="body">
      <!-- Backdrop/overlay for the open mobile menu.
         Reka's modal outside-click handling closes the menu on backdrop click. -->
      <Transition
        enter-active-class="transition-opacity duration-150 ease-out"
        leave-active-class="transition-opacity duration-100 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          class="sm:hidden fixed inset-4 z-5 pointer-events-auto bg-slate-100 dark:bg-slate-800 border border-accented rounded-md"
        />
      </Transition>

      <!-- Nav bar: pill + dropdown. Above the backdrop.
         Dropdown content is portaled separately by Reka with z-50, so it
         stacks above both the pill and the backdrop. -->
      <div class="fixed inset-x-0 top-6 sm:top-4 z-10 w-full max-w-(--ui-container) mx-auto px-6 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
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

        <UDropdownMenu
          v-model:open="open"
          :items="items"
          color="neutral"
          :content="{ align: 'center', side: 'bottom', sideOffset: 8 }"
          :ui="{
            // Stretch content to the trigger's width — Reka sets
            // --reka-popper-anchor-width on the content; matching the Figma
            // where the panel spans the full pill width (332px in the design).
            // z-50 lifts the portaled content above the backdrop (z-5) and the
            // pill (z-10); Reka reads the computed z-index and sets it inline.
            content: 'z-50 w-(--reka-dropdown-menu-trigger-width) drop-shadow-lg rounded-md',
            itemLeadingIcon: 'hidden'
          }"
        >
          <!-- The pill div is the trigger (DropdownMenuTrigger uses as-child),
             so the content anchors to the pill width, not the button. -->
          <div :class="[pillClass, 'sm:hidden w-full flex items-center justify-between px-2 py-1']">
            <!-- Stop propagation so toggling the color mode doesn't open the menu. -->
            <ColorModeButton @click.stop />
            <UButton
              :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
              color="neutral"
              variant="ghost"
              size="sm"
              class="rounded-full"
              :aria-label="open ? 'Menü schließen' : 'Menü öffnen'"
            />
          </div>
        </UDropdownMenu>
      </div>
    </Teleport>
  </div>
</template>
