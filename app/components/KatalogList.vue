<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface Reference {
  artikelnummer: string
  produkt: string
  rueckgrat: string
  architektur: string
  mnKgMol: string
  /** Polymerisationsgrad (ganzzahlig) */
  pn: number
  /** Endgruppe, z. B. "Hydroxy", "Carbonsäure" */
  endgroup: string
  /** Dispersität Mw/Mn — String, weil Format "≤ 1,20" (≤-Zeichen + Komma) */
  liefermenge: string
  /** Referenzeinheit, z. B. "1 g" oder "1 kg" */
  preis: string
  /** Preis pro Gramm — String, weil "0,137" bzw. "153" (Komma-Dezimal, variierende Nachkommastellen) */
}

const props = defineProps<{
  /** Vollständiges `bestellungKatalog`-Dokument */
  katalog?: {
    items: Reference[]
  }
}>()

const container = useTemplateRef('container')
const getScrollElement = () => container.value

const columns: TableColumn<Reference>[] = [
  {
    accessorKey: 'produkt',
    header: 'Produkt',
    meta: {
      class: {
        th: 'w-40 whitespace-normal break-words',
        td: 'w-40 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'architektur',
    header: 'Architektur',
    meta: {
      class: {
        th: 'w-24 whitespace-normal break-words',
        td: 'w-24 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'mnKgMol',
    header: 'Mₙ (kg/mol)',
    meta: {
      class: {
        th: 'w-14 text-right',
        td: 'w-14 text-right whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'pn',
    header: 'Pₙ',
    meta: {
      class: {
        th: 'w-12 text-right',
        td: 'w-12 text-right whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'endgroup',
    header: 'Endgruppe',
    meta: {
      class: {
        th: 'w-16 whitespace-normal break-words',
        td: 'w-16 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'liefermenge',
    header: 'Liefermenge',
    meta: {
      class: {
        th: 'w-24 whitespace-normal break-words',
        td: 'w-24 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'preis',
    header: 'Preis',
    meta: {
      class: {
        th: 'w-16 text-right',
        td: 'w-16 text-right whitespace-normal break-words'
      }
    }
  }
]
</script>

<template>
  <UPageSection
    v-if="props.katalog?.items?.length"
    id="katalog"
    :ui="{
      title: 'text-left text-2xl sm:text-2xl lg:text-3xl text-pretty font-bold',
      description: 'text-left my-2 text-muted'
    }"
  >
    <div
      ref="container"
      class="w-full max-h-125 overflow-auto ring ring-default"
    >
      <UTable
        sticky
        :data="props.katalog.items"
        :columns="columns"
        :virtualize="{ getScrollElement }"
        :ui="{ base: 'min-w-[100%] table-fixed', th: 'whitespace-normal break-words' }"
      />
    </div>
  </UPageSection>
</template>
