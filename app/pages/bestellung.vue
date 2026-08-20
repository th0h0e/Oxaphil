<script setup lang="ts">
const { data: page } = await useAsyncData('bestellung', () => {
  return queryCollection('bestellung').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

// Editors fill in `email` rather than hand-writing a `mailto:` URL (see the
// bestellung schema). A present-but-blank field falls back to the app-config
// address; links without the key keep their own `to`.
const links = computed(() => (page.value?.links ?? []).map(({ email, ...link }) => ({
  ...link,
  to: email === undefined ? link.to : `mailto:${email || global.email}`
})))

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    />
    <UPageSection
      :title="page.product.title"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
        class="mb-8 text-muted"
      />

      <UPageCard
        :title="page.product.name"
        :description="page.product.chemicalName"
        variant="subtle"
        orientation="horizontal"
        :ui="{ title: 'text-xl' }"
        spotlight
        spotlight-color="primary"
      >
        <template #footer>
          <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <template
              v-for="spec in page.product.specs"
              :key="spec.label"
            >
              <dt class="text-muted">
                {{ spec.label }}
              </dt>
              <dd class="text-default font-medium">
                {{ spec.value }}
              </dd>
            </template>
          </dl>

          <p class="mt-6 text-lg font-semibold text-primary">
            {{ page.product.price }}
          </p>
        </template>

        <ProductMolecule
          :aria-label="page.product.image.alt"
          class="w-full text-highlighted"
        />
      </UPageCard>
    </UPageSection>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <ContactCard
        v-if="page.contactCard"
        v-bind="page.contactCard"
      />
    </UPageSection>
  </UPage>
</template>
