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
  Teleport the whole dvh frame to <body> so the nav lives in the root
  stacking context. Previously the header sat inside the layout's UContainer,
  whose own stacking context capped the header's z-10 below the teleported
  backdrop (z-5 at root). Teleporting the frame (not just its children) keeps
  the blur layer, backdrop, nav bar, and dropdown content in one context so
  all z-indices compare directly:
    blur z-0 < backdrop z-5 < nav bar z-10 < dropdown content z-50.
  The fixed inset-0 h-dvh frame tracks the mobile URL-bar edge; teleporting
  it to <body> (whose only ancestors are html/body) means no layout ancestor
  can reorder these layers.
-->
<template>
  <Teleport to="body">
    <!-- pointer-events-none: the frame spans the whole viewport at z-5 above the
         page, so without it every click on the page lands here. Children that
         should be clickable (pill, backdrop) set pointer-events-auto. -->
    <div class="fixed inset-0 h-dvh z-5 pointer-events-none">
      <!-- Full-screen blur/dim below the custom backdrop. Lives in the same
         dvh frame so it blurs the page behind the backdrop (including the
         exposed side/bottom gaps) and tracks the URL-bar edge. z-0 keeps it
         below the backdrop (z-5). Clicks here bubble to Reka's document-level
         outside-click listener, so clicking the blurred gaps closes the menu. -->
      <div
        v-if="open"
        class="sm:hidden fixed inset-0 z-0 bg-elevated/75 backdrop-blur-md"
      />
      <!-- Backdrop/overlay for the open mobile menu.
         Sits above the blur layer (z-0) and below the nav bar (z-10). Clicking
         it bubbles to Reka's document-level outside-click listener, closing
         the menu. -->
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
      <div
        class="fixed inset-x-0 top-6 sm:top-4 z-10 w-full max-w-(--ui-container) mx-auto flex justify-center pointer-events-none transition-[padding] duration-200 ease-out"
        :class="open ? 'px-6 sm:px-6 lg:px-8' : 'px-4 sm:px-6 lg:px-8'"
      >
        <UNavigationMenu
          :class="[pillClass, 'hidden sm:flex px-4 flex-1 justify-center']"
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
    </div>
  </Teleport>
</template>
