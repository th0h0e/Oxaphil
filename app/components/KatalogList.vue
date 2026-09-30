<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

/** Preisstufe: 'bulk' (unfunktionalisiert, in kg) oder 'func' (funktionalisiert, in g) */
type Preisstufe = 'bulk' | 'func'

interface Reference {
  /** Artikelnummer, z. B. "OX-HE-040-OH" */
  artikelnummer: string
  /** Produktname, z. B. "HydroPOx40-OH" */
  produkt: string
  /** Serie, z. B. "HydroPOx", "DuoPOx" */
  serie: string
  /** Polymer-Rückgrat, z. B. "Poly(2-ethyl-2-oxazolin)" */
  rueckgrat: string
  /** Architektur, z. B. "monofunktionell", "telechelisch (α,ω)" */
  architektur: string
  /** Zahlenmittlere Molmasse in kg/mol — als String, weil "1,0" (Komma als Dezimaltrenner) */
  mnKgMol: string
  /** Polymerisationsgrad (ganzzahlig) */
  pn: number
  /** Endgruppe, z. B. "Hydroxy", "Carbonsäure" (SCII: Endgruppe) */
  endgruppe: string
  /** Dispersität Mw/Mn — String, weil Format "≤ 1,20" (≤-Zeichen + Komma) */
  dispersitaet: string
  /** Liefermenge-Spanne, z. B. "1 g – 10 kg" */
  liefermenge: string
  /** Referenzeinheit, z. B. "1 g" oder "1 kg" */
  referenzeinheit: string
  /** Listenpreis inkl. Währung/Locale, z. B. "105 €" */
  preis: string
  /** Preis pro Gramm — String, weil "0,137" bzw. "153" (Komma-Dezimal, variierende Nachkommastellen) */
  eurProG: string
  /** Staffelpreise-Beschreibung, z. B. "100 mg / 1 g / 5 g / 25 g" */
  staffel: string
  /** Preisstufe: 'bulk' (unfunktionalisiert, in kg) oder 'func' (funktionalisiert, in g) */
  preisstufe: Preisstufe
}

const props = defineProps<{
  references: Reference[]
}>()

const container = useTemplateRef('container')
const getScrollElement = () => container.value

const columns: TableColumn<Reference>[] = [
  {
    accessorKey: 'artikelnummer',
    header: 'Artikelnr.',
    meta: {
      class: {
        th: 'w-20 whitespace-normal break-words',
        td: 'w-20 whitespace-normal break-words'
      }
    }
  },
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
    accessorKey: 'serie',
    header: 'Serie',
    meta: {
      class: {
        th: 'w-16 whitespace-normal break-words',
        td: 'w-16 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'rueckgrat',
    header: 'Rückgrat',
    meta: {
      class: {
        th: 'w-32 whitespace-normal break-words',
        td: 'w-32 whitespace-normal break-words'
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
    accessorKey: 'dispersitaet',
    header: 'Dispersität (Mw/Mn)',
    meta: {
      class: {
        th: 'w-14 text-right',
        td: 'w-14 text-right whitespace-normal break-words'
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
    accessorKey: 'referenzeinheit',
    header: 'Referenzeinheit',
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
  },
  {
    accessorKey: 'eurProG',
    header: '€/g',
    meta: {
      class: {
        th: 'w-14 text-right',
        td: 'w-14 text-right whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'staffel',
    header: 'Staffel',
    meta: {
      class: {
        th: 'w-40 whitespace-normal break-words',
        td: 'w-40 whitespace-normal break-words'
      }
    }
  },
  {
    accessorKey: 'preisstufe',
    header: 'Preisstufe',
    meta: {
      class: {
        th: 'w-16 whitespace-normal break-words',
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
