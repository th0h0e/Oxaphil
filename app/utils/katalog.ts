/**
 * Browser-safe CSV → YAML converter for the catalog.
 *
 * Mirrors the conversion in `server/tasks/katalog-sync.ts`, but runs entirely
 * client-side (no node:fs / node:path) so a user can drop a `.csv` and copy
 * the formatted `.yml` — no file write, works on Cloudflare Pages.
 *
 * Keep the `KEYS` array and field names in sync with `server/tasks/katalog-sync.ts`
 * and with the `bestellungKatalog` schema in `content.config.ts`.
 */

export interface KatalogItem {
  artikelnummer: string
  produkt: string
  serie: string
  rueckgrat: string
  architektur: string
  mnKgMol: string
  pn: number
  endgroup: string
  dispersitaet: string
  liefermenge: string
  referenzeinheit: string
  preis: string
  eurProG: string
  staffel: string
  preisstufe: 'bulk' | 'func'
}

/** Column order/keys of `katalog-items.yml` and the CSV header. */
export const KEYS: (keyof KatalogItem)[] = [
  'artikelnummer', 'produkt', 'serie', 'rueckgrat', 'architektur',
  'mnKgMol', 'pn', 'endgroup', 'dispersitaet', 'liefermenge',
  'referenzeinheit', 'preis', 'eurProG', 'staffel', 'preisstufe'
]

/** RFC-4180 CSV row parser; cells honor `"..."` quoting. */
export function parseCsv(text: string, delimiter = ';'): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === delimiter) {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') {
        i++
      }
      row.push(field)
      field = ''
      rows.push(row)
      row = []
    } else {
      field += c
    }
  }
  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
    .filter(r => r.length > 1 || (r[0] && r[0].trim() !== ''))
    .map(r => r.map(cell => cell.trim()))
}

function yamlScalar(value: string): string {
  let out = '"'
  for (const ch of value) {
    if (ch === '\\') out += '\\\\'
    else if (ch === '"') out += '\\"'
    else if (ch === '\n') out += '\\n'
    else if (ch === '\r') out += '\\r'
    else if (ch === '\t') out += '\\t'
    else if (ch.charCodeAt(0) < 0x20) out += `\\x${ch.charCodeAt(0).toString(16).padStart(2, '0')}`
    else out += ch
  }
  return `${out}"`
}

export function itemsToYaml(items: KatalogItem[]): string {
  const lines = ['items:']
  for (const it of items) {
    lines.push(`  - artikelnummer: ${yamlScalar(it.artikelnummer)}`)
    for (const k of KEYS) {
      if (k === 'artikelnummer') continue
      lines.push(`    ${k}: ${k === 'pn' ? String(it.pn) : yamlScalar(String(it[k]))}`)
    }
  }
  return `${lines.join('\n')}\n`
}

function rowsToItems(rows: string[][]): KatalogItem[] {
  if (rows.length < 2) throw new Error('Katalog-CSV ist leer oder hat keine Datenzeilen')

  const header = rows[0]
  const idx: Record<string, number> = {}
  for (let i = 0; i < header.length; i++) {
    idx[header[i]] = i
  }

  const missing = KEYS.filter(k => idx[k] === undefined)
  if (missing.length) {
    throw new Error(`Katalog-CSV-Spalten fehlen oder heißen anders: ${missing.join(', ')}`)
  }

  const items: KatalogItem[] = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (row.every(c => c === '')) continue // skip blank rows
    const id = row[idx.artikelnummer] ?? ''
    if (!id) continue // skip rows without an article number
    const item = {} as KatalogItem
    for (const k of KEYS) {
      const raw = row[idx[k]] ?? ''
      ;(item as unknown as Record<string, unknown>)[k] = k === 'pn'
        ? Math.round(Number(raw.replace(',', '.')))
        : raw
    }
    if (!Number.isFinite(item.pn)) {
      throw new Error(`Zeile ${r} (${id}): ungültiger Pₙ-Wert "${row[idx.pn]}"`)
    }
    items.push(item)
  }
  return items
}

export interface CsvToYamlResult {
  ok: boolean
  yaml?: string
  error?: string
  count?: number
}

/** Convert a raw CSV string to the formatted YAML. Never throws. */
export function csvToYaml(csv: string): CsvToYamlResult {
  try {
    const items = rowsToItems(parseCsv(csv))
    return { ok: true, yaml: itemsToYaml(items), count: items.length }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
