<script setup lang="ts">
</script>

<template>
  <div>
    <UContainer>
      <AppHeader :links="navLinks" />
      <slot />
    </UContainer>
    <UContainer>
      <AppFooter />
    </UContainer>
  </div>
</template>
