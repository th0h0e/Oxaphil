<script setup lang="ts">
</script>

<template>
  <div>
    <UContainer class="sm:border-x border-mist-300 dark:border-mist-700 pt-10">
      <AppHeader :links="navLinks" />
      <slot />
    </UContainer>
    <UContainer class="sm:border-x border-mist-300 dark:border-mist-700 !px-0 sm:!px-0 lg:!px-0">
      <AppFooter />
    </UContainer>
  </div>
</template>
