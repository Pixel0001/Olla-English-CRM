// Scan for unescaped backticks inside theory template literals
import fs from 'node:fs'

const files = ['python', 'javascript', 'html', 'css']
let problems = 0

for (const f of files) {
  const content = fs.readFileSync(`scripts/modules-data/${f}.mjs`, 'utf8')
  const lines = content.split('\n')
  let inTpl = false
  let lessonHint = ''
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i]
    // Track lesson titles for context
    const titleMatch = L.match(/title:\s*['"](.*?)['"]/)
    if (titleMatch) lessonHint = titleMatch[1]

    if (!inTpl) {
      if (/theory:\s*`/.test(L)) inTpl = true
      continue
    }
    // We are inside a theory template literal
    // Count unescaped backticks on this line
    let count = 0
    let j = 0
    while (j < L.length) {
      const ch = L[j]
      if (ch === '\\') { j += 2; continue }
      if (ch === '`') count++
      j++
    }

    if (count % 2 === 1) {
      // Closing backtick on this line — template ends
      inTpl = false
      // But if there are MORE backticks on the line beyond the closing one, problem.
      if (count > 1) {
        console.log(`${f}.mjs:${i + 1}  [${lessonHint}]  count=${count}`)
        console.log(`  > ${L}`)
        problems++
      }
      continue
    }

    if (count > 0) {
      // Even number of unescaped backticks INSIDE the theory string.
      // These are real inline-code markdown backticks that will break the template literal.
      console.log(`${f}.mjs:${i + 1}  [${lessonHint}]  count=${count}`)
      console.log(`  > ${L}`)
      problems++
    }
  }
}

console.log(`\nTotal problematic lines: ${problems}`)
