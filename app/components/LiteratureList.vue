<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface Reference {
  authors: string
  title: string
  journal?: string
  year?: number
  volume?: string
  pages?: string
  doi?: string
}

const props = defineProps<{
  /** Vollständiges `materialienLiteratur`-Dokument (Title/Description/Referenzen) */
  literature?: {
    title?: string
    description?: string
    references: Reference[]
  }
}>()

const container = useTemplateRef('container')
const getScrollElement = () => container.value

const columns: TableColumn<Reference>[] = [
  {
    accessorKey: 'authors',
    header: 'Autoren',
    meta: {
      class: {
        th: 'w-28',
        td: 'w-28 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'title',
    header: 'Titel',
    meta: {
      class: {
        th: 'w-52',
        td: 'w-52 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'journal',
    header: 'Journal',
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'year',
    header: 'Jahr',
    meta: {
      class: {
        th: 'w-12 text-right',
        td: 'w-12 text-right whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'volume',
    header: 'Band',
    meta: {
      class: {
        th: 'w-12',
        td: 'w-12 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'pages',
    header: 'Seiten',
    meta: {
      class: {
        th: 'w-16',
        td: 'w-16 whitespace-normal break-words'
      }
    }
  }
]
</script>

<template>
  <UPageSection
    v-if="props.literature?.references?.length"
    id="literatur"
    :title="props.literature.title"
    :description="props.literature.description"
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
        :data="props.literature.references"
        :columns="columns"
        :virtualize="{ getScrollElement }"
        :ui="{ base: 'min-w-[100%] table-fixed', th: 'whitespace-normal break-words' }"
      />
    </div>
  </UPageSection>
</template>
