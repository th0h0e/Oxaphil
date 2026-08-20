<script setup lang="ts">
// Props here are the single source of truth for this card's content schema:
// `content.config.ts` derives it via `property(...).inherit('app/components/ContactCard.vue')`,
// so adding a prop below is enough to expose it in Studio — no schema edit needed.
withDefaults(defineProps<{
  /** Vollständiger Name der Kontaktperson */
  name: string
  /** Kurze Rolle oder Zusatzzeile unter dem Namen */
  role?: string
  /** Profilbild */
  photoSrc?: string
  /** Alternativtext des Profilbilds */
  photoAlt?: string
  /** Telefonnummer – erzeugt einen tel:-Button, wenn ausgefüllt */
  phone?: string
  /** E-Mail-Adresse – erzeugt einen mailto:-Button, wenn ausgefüllt */
  email?: string
  /** Farbe der Kontakt-Buttons */
  buttonColor?: 'primary' | 'neutral'
  /** Darstellung der Kontakt-Buttons */
  buttonVariant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
  /** Darstellung der umgebenden Karte */
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
