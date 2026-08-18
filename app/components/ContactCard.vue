<script setup lang="ts">
// Props here are the single source of truth for this card's content schema:
// `content.config.ts` derives it via `property(...).inherit('app/components/ContactCard.vue')`,
// so adding a prop below is enough to expose it in Studio — no schema edit needed.
withDefaults(defineProps<{
  /** Contact person's full name */
  name: string
  /** Short role or context line shown under the name */
  role?: string
  /** Avatar image source */
  photoSrc?: string
  /** Avatar alt text */
  photoAlt?: string
  /** Phone number, rendered as a tel: button when set */
  phone?: string
  /** Email address, rendered as a mailto: button when set */
  email?: string
  /** Color of the contact buttons */
  buttonColor?: 'primary' | 'neutral'
  /** Visual style of the contact buttons */
  buttonVariant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
  /** Visual style of the surrounding card */
  cardVariant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'naked'
}>(), {
  buttonColor: 'neutral',
  buttonVariant: 'subtle',
  cardVariant: 'subtle'
})
</script>

<template>
  <UPageCard :variant="cardVariant">
    <UUser
      :name="name"
      :description="role"
      :avatar="photoSrc ? { src: photoSrc, alt: photoAlt } : undefined"
      size="xl"
    />
    <div class="flex flex-wrap gap-3 mt-4">
      <UButton
        v-if="phone"
        :label="phone"
        :to="`tel:${phone.replace(/\s/g, '')}`"
        icon="i-lucide-phone"
        :color="buttonColor"
        :variant="buttonVariant"
        size="sm"
      />
      <UButton
        v-if="email"
        :label="email"
        :to="`mailto:${email}`"
        icon="i-lucide-mail"
        :color="buttonColor"
        :variant="buttonVariant"
        size="sm"
      />
    </div>
  </UPageCard>
</template>
