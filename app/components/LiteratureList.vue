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
  references: Reference[]
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
  <div
    ref="container"
    class="w-full max-h-125 overflow-auto ring ring-default"
  >
    <UTable
      sticky
      :data="props.references"
      :columns="columns"
      :virtualize="{ getScrollElement }"
      :ui="{ base: 'min-w-[100%] table-fixed', th: 'whitespace-normal break-words' }"
    />
  </div>
</template>
