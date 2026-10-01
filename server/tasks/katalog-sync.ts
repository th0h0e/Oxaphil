/**
 * Katalog-Sync Task
 * =================
 * Reimplements the whole content/bestellung/katalog.csv → katalog-items.yml
 * conversion, self-contained (no shared scripts/modules).
 *
 * The CSV is the source of truth owned by marketing (a Google-Sheets /
 * semicolon-delimited export). They never touch YAML: this task regenerates
 * `content/bestellung/katalog-items.yml` from the CSV on demand, so the site's
 * `bestellungKatalog` content collection always reflects the spreadsheet.
 *
 * Run (while the dev server is up):
 *   - Command line:    `nitro task run katalog-sync`
 *   - HTTP:            POST /_nitro/tasks/katalog-sync
 *                      body: { "payload": { "force": true } }
 *
 * NOTE on the import: the Nitro docs show `import { defineTask } from
 * "nitro/task"`, but this project ships Nitro as the `nitropack` package and
 * neither `nitro` nor `nitropack` is resolvable as a bare import from project
 * code. Nuxt auto-imports `defineTask`/`runTask` in server files, so no import
 * statement is needed here.
 */

import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface KatalogItem {
  artikelnummer: string
  produkt: string
  serie: string
  rueckgrat: string
  architektur: string
  mnKgMol: string
  pn: number
  endgruppe: string
  dispersitaet: string
  liefermenge: string
  referenzeinheit: string
  preis: string
  eurProG: string
  staffel: string
  preisstufe: 'bulk' | 'func'
}

/** Column order/keys of `katalog-items.yml` and the CSV header. */
const KEYS: (keyof KatalogItem)[] = [
  'artikelnummer', 'produkt', 'serie', 'rueckgrat', 'architektur',
  'mnKgMol', 'pn', 'endgroup', 'dispersitaet', 'liefermenge',
  'referenzeinheit', 'preis', 'eurProG', 'staffel', 'preisstufe'
]

/** RFC-4180 CSV row parser; cells honor `"..."` quoting. */
function parseCsv(text: string, delimiter = ';'): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else if (c === '"') {
      inQuotes = true
    } else if (c === delimiter) {
      row.push(field); field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      rows.push(row); row = []
    } else field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
    .filter((r) => r.length > 1 || (r[0] && r[0].trim() !== ''))
    .map((r) => r.map((cell) => cell.trim()))
}

/** Emit a YAML double-quoted scalar (always quoted → guarantees string type). */
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

function itemsToYaml(items: KatalogItem[]): string {
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

/** Parse CVS rows into `KatalogItem[]`. Throws on missing/unknown columns. */
function rowsToItems(rows: string[][]): KatalogItem[] {
  if (rows.length < 2) throw new Error('Katalog-CSV ist leer oder hat keine Datenzeilen')

  const header = rows[0]
  const idx: Record<string, number> = {}
  header.forEach((h, i) => { idx[h] = i })

  const missing = KEYS.filter((k) => idx[k] === undefined)
  if (missing.length) {
    throw new Error(`Katalog-CSV-Spalten fehlen oder heißen anders: ${missing.join(', ')}`)
  }

  const items: KatalogItem[] = []
  const seen = new Set<string>()
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (row.every((c) => c === '')) continue // skip blank rows
    const id = row[idx.artikelnummer] ?? ''
    if (!id) {
      console.warn(`[katalog] row ${r}: leere Artikelnummer übersprungen`)
      continue
    }
    const item = {} as KatalogItem
    for (const k of KEYS) {
      const raw = row[idx[k]] ?? ''
      ;(item as unknown as Record<string, unknown>)[k] = k === 'pn'
        ? Math.round(Number(raw.replace(',', '.')))
        : raw
    }
    if (!Number.isFinite(item.pn)) {
      throw new Error(`[katalog] row ${r} (${id}): ungültiger Pₙ-Wert "${row[idx.pn]}"`)
    }
    items.push(item)
    seen.add(id)
  }
  return items
}

export default defineTask({
  meta: {
    name: 'katalog-sync',
    description: 'Regeneriere content/bestellung/katalog-items.yml aus content/bestellung/katalog.csv'
  },
  run({ payload }) {
    const started = Date.now()
    const p = (payload ?? {}) as Record<string, unknown>
    const cwd = typeof p.cwd === 'string' ? p.cwd : process.cwd()
    const csvPath = (p.csvPath as string | undefined) ?? resolve(cwd, 'content/bestellung/katalog.csv')
    const ymlPath = (p.ymlPath as string | undefined) ?? resolve(cwd, 'content/bestellung/katalog-items.yml')
    const force = p.force === true

    // Tracks the current phase so a failure names the step that broke.
    let stage = 'setup'
    const log = (msg: string) => console.log(`[katalog-sync] ${stage}: ${msg}`)

    try {
      log(`payload force=${force} csv=${csvPath} yml=${ymlPath}`)

      stage = 'csv-check'
      if (!existsSync(csvPath)) {
        log('abort: csv nicht gefunden')
        return { result: `Keine CSV gefunden (${csvPath}) – nichts zu tun` }
      }
      const csvIsNewer = !existsSync(ymlPath) || statSync(csvPath).mtimeMs > statSync(ymlPath).mtimeMs
      if (!force && !csvIsNewer) {
        log('skip: csv ist nicht neuer als das vorhandene yaml')
        return { result: 'Keine Aktion – CSV ist nicht neuer als das vorhandene YAML' }
      }

      stage = 'parse'
      log('lese und parse csv')
      const rows = parseCsv(readFileSync(csvPath, 'utf8'))
      log(`datenzeilen=${Math.max(rows.length - 1, 0)}`)

      stage = 'convert'
      log('konvertiere zeilen zu items')
      const items = rowsToItems(rows)
      log(`einträge=${items.length}`)

      stage = 'write'
      log('schreibe yaml')
      writeFileSync(ymlPath, itemsToYaml(items), 'utf8')

      const ms = Date.now() - started
      log(`fertig in ${ms}ms: ${items.length} einträge → ${ymlPath}`)
      return { result: `Katalog aktualisiert: ${items.length} Einträge → ${ymlPath} (${ms}ms)` }
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err)
      console.error(`[katalog-sync] FEHLER in Phase "${stage}": ${detail}`)
      // Rethrow so the caller (HTTP endpoint / cron) also sees the failure.
      throw err
    }
  }
})
