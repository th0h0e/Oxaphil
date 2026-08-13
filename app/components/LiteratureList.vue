<script setup lang="ts">
interface Reference {
  authors: string
  title: string
  journal?: string
  year?: number
  volume?: string
  pages?: string
  doi?: string
}

defineProps<{
  references: Reference[]
}>()
</script>

<template>
  <ol class="flex flex-col gap-3 list-decimal ps-5 text-sm text-muted">
    <li
      v-for="(reference, index) in references"
      :key="index"
    >
      <span>{{ reference.authors }}</span>
      <span class="text-default"> {{ reference.title }}.</span>
      <em v-if="reference.journal"> {{ reference.journal }}</em>
      <span v-if="reference.year"> {{ reference.year }}</span><span v-if="reference.volume">, <strong>{{ reference.volume }}</strong></span><span v-if="reference.pages">, {{ reference.pages }}</span>.
      <ULink
        v-if="reference.doi"
        :to="`https://doi.org/${reference.doi}`"
        target="_blank"
        class="text-primary"
      >
        doi:{{ reference.doi }}
      </ULink>
    </li>
  </ol>
</template>
