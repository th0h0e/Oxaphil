<script setup lang="ts">
</script>

<template>
  <div>
    <UContainer>
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter class="pb-6" />
    </UContainer>
  </div>
</template>
