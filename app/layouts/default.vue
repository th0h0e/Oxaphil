<script setup lang="ts">
</script>

<template>
  <div>
    <UContainer>
      <AppHeader :links="navLinks" />
      <slot />
    </UContainer>
    <UContainer class="!px-0 sm:!px-0 lg:!px-0">
      <AppFooter />
    </UContainer>
  </div>
</template>
