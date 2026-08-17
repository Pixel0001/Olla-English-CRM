// Convert markdown tables (| col | col |) into bullet lists across all modules-data files.
// Markdown tables look confusing in lessons → replace with cleaner "- **key** — value" bullet lists.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DIR = path.join(__dirname, 'modules-data')

const FILES = [
  'python.mjs',
  'python-enriched.mjs',
  'python-enriched-part2.mjs',
  'javascript.mjs',
  'javascript-enriched.mjs',
  'html.mjs',
  'html-enriched.mjs',
  'css.mjs',
  'css-enriched.mjs',
]

// Split a `| a | b | c |` line into cells (trims leading/trailing |).
function splitRow(line) {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((c) => c.trim())
}

function isTableLine(line) {
  const t = line.trim()
  if (!t.startsWith('|')) return false
  // need at least two `|`
  return (t.match(/\|/g) || []).length >= 2
}

function isSeparatorRow(line) {
  const cells = splitRow(line)
  if (cells.length === 0) return false
  return cells.every((c) => /^:?-{2,}:?$/.test(c))
}

// Convert a parsed table (array of rows = arrays of cells) into bullet list lines.
function tableToList(rows) {
  if (rows.length === 0) return []
  const header = rows[0]
  const dataRows = rows.slice(1)
  const ncol = header.length
  const out = []

  for (const row of dataRows) {
    // pad / trim
    const cells = row.slice(0, ncol)
    while (cells.length < ncol) cells.push('')

    if (ncol === 1) {
      out.push(`- ${cells[0]}`)
      continue
    }

    if (ncol === 2) {
      const [a, b] = cells
      out.push(`- **${a}** — ${b}`)
      continue
    }

    // 3+ columns: bold first cell, then "header: value" for the rest
    const first = cells[0]
    const rest = cells
      .slice(1)
      .map((v, i) => `${header[i + 1]}: ${v}`)
      .join(' • ')
    out.push(`- **${first}** — ${rest}`)
  }

  return out
}

function processContent(text) {
  const lines = text.split(/\r?\n/)
  const out = []
  let i = 0
  let tablesConverted = 0

  while (i < lines.length) {
    const line = lines[i]

    if (isTableLine(line)) {
      // Collect contiguous table block
      const block = []
      let j = i
      while (j < lines.length && isTableLine(lines[j])) {
        block.push(lines[j])
        j++
      }

      // A real table needs at least 2 rows (header + at least one data) or header+separator+data
      if (block.length >= 2) {
        // Detect separator row (markdown spec: header, separator, data...)
        const rows = []
        for (const bl of block) {
          if (isSeparatorRow(bl)) continue
          rows.push(splitRow(bl))
        }
        if (rows.length >= 2) {
          // Preserve leading whitespace of the header line
          const indentMatch = block[0].match(/^(\s*)/)
          const indent = indentMatch ? indentMatch[1] : ''
          const listLines = tableToList(rows).map((l) => indent + l)
          out.push(...listLines)
          tablesConverted++
          i = j
          continue
        }
      }

      // Not a real multi-row table — keep as-is
      out.push(...block)
      i = j
      continue
    }

    out.push(line)
    i++
  }

  return { text: out.join('\n'), tablesConverted }
}

let totalTables = 0
let totalFiles = 0
for (const file of FILES) {
  const fp = path.join(DIR, file)
  if (!fs.existsSync(fp)) {
    console.log(`⏭  skip (not found): ${file}`)
    continue
  }
  const original = fs.readFileSync(fp, 'utf8')
  const { text, tablesConverted } = processContent(original)
  if (tablesConverted > 0 && text !== original) {
    fs.writeFileSync(fp, text, 'utf8')
    console.log(`✅ ${file}: ${tablesConverted} table(s) converted`)
    totalTables += tablesConverted
    totalFiles++
  } else {
    console.log(`—  ${file}: no tables`)
  }
}

console.log(`\nDone. ${totalTables} tables across ${totalFiles} files.`)
