<script setup lang="ts">
definePageMeta({
  pageTransition: { name: 'page', mode: 'out-in' },
  layoutTransition: { name: 'layout', mode: 'out-in' }
})
</script>

<template>
  <UPage>
    <KatalogImport class="w-full" />
  </UPage>
</template>
