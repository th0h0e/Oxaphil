<script setup lang="ts">
import { csvToYaml } from '~/utils/katalog'

const file = ref<File | null>(null)
const reading = ref(false)
const yaml = ref('')
const error = ref('')
const fileName = ref('')
const itemCount = ref(0)
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const statusLine = computed(() =>
  fileName.value
    ? itemCount.value
      ? `${fileName.value} · ${itemCount.value} Einträge`
      : fileName.value
    : 'Semikolon-getrennten Google-Sheets-Export (.csv) in YAML für den Katalog umwandeln'
)

watchEffect(() => {
  const f = file.value
  if (!f) return
  if (!(f.name.endsWith('.csv') || f.type === 'text/csv')) {
    error.value = `"${f.name}" ist keine CSV-Datei.`
    yaml.value = ''
    itemCount.value = 0
    file.value = null
    return
  }
  reading.value = true
  f.text()
    .then(text => consume(text, f.name))
    .catch((err) => {
      error.value = err instanceof Error ? err.message : 'Datei konnte nicht gelesen werden.'
      yaml.value = ''
      itemCount.value = 0
    })
    .finally(() => {
      reading.value = false
      file.value = null // allow re-selecting the same file
    })
})

function consume(text: string, name: string) {
  fileName.value = name
  const result = csvToYaml(text)
  if (result.ok) {
    yaml.value = result.yaml ?? ''
    error.value = ''
    itemCount.value = result.count ?? 0
  } else {
    yaml.value = ''
    error.value = result.error ?? 'Unbekannter Fehler'
    itemCount.value = 0
  }
}

async function copyYaml() {
  if (!yaml.value) return
  await navigator.clipboard.writeText(yaml.value)
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <UCard
    class="w-full"
    :ui="{
      root: 'rounded-2xl h-[calc(100dvh-14rem)] flex flex-col',
      header: 'px-4 py-3 shrink-0',
      body: 'flex-1 min-h-0 px-4 py-3'
    }"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-2.5">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated">
            <UIcon
              name="i-lucide-file-spreadsheet"
              class="size-5 text-default"
            />
          </div>
          <div class="min-w-0">
            <div class="font-medium text-default">
              Katalog CSV → YAML
            </div>
            <div class="truncate text-sm text-muted">
              {{ statusLine }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UBadge
            v-if="reading"
            color="neutral"
            icon="i-lucide-loader-circle"
            label="Liest…"
          />
          <UBadge
            v-else-if="itemCount"
            color="success"
            :icon="copied ? 'i-lucide-check' : 'i-lucide-file-check-2'"
            :label="`${itemCount} Einträge`"
          />
          <UButton
            v-if="yaml"
            color="primary"
            variant="solid"
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            :label="copied ? 'Kopiert' : 'YAML kopieren'"
            class="shrink-0"
            @click="copyYaml"
          />
        </div>
      </div>
    </template>

    <div class="flex h-full flex-col gap-3">
      <UFileUpload
        v-model="file"
        color="neutral"
        variant="area"
        accept=".csv,text/csv"
        :file-image="false"
        highlight
        label="Katalog-CSV hierher ziehen"
        description="Google-Sheets-Export, semikolon-getrennt"
        class="w-full shrink-0"
      >
        <template #actions="{ open }">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-upload"
            label="CSV auswählen"
            @click="open()"
          />
        </template>
      </UFileUpload>

      <UAlert
        v-if="error"
        color="error"
        icon="i-lucide-circle-alert"
        :title="error"
        class="shrink-0"
      />

      <UTextarea
        :model-value="yaml"
        readonly
        placeholder="Ziehe eine .csv in das Feld oben, um hier das formatierte YAML zu sehen."
        class="min-h-0 flex-1"
        :ui="{ base: 'h-full w-full font-mono text-xs' }"
      />
    </div>
  </UCard>
</template>
