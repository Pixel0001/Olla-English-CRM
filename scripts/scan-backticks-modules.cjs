// Scan for unescaped backticks inside template-literal theory blocks
const fs = require('fs');
const path = require('path');

const files = ['react.mjs', 'tailwind.mjs', 'nextjs-frontend.mjs', 'nextjs-backend.mjs'];
let issues = 0;

for (const f of files) {
  const fp = path.join('scripts/modules-data', f);
  const content = fs.readFileSync(fp, 'utf8');
  const lines = content.split(/\r?\n/);

  // Track if inside a theory: ` ... ` literal
  let inTheory = false;
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!inTheory && /theory:\s*`/.test(line)) {
      inTheory = true;
      return;
    }
    if (inTheory) {
      // End of theory: a line that is just `, or `, possibly with trailing comma
      if (/^`,?\s*$/.test(trimmed)) {
        inTheory = false;
        return;
      }
      // Skip code-fence lines starting with ``` 
      if (trimmed.startsWith('```')) return;
      // Look for unescaped backticks (not preceded by \)
      // Count unescaped backticks in line
      let unescaped = 0;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '`' && line[i - 1] !== '\\') unescaped++;
      }
      if (unescaped > 0) {
        // Inline code in markdown: needs even number AND each ` must be escaped as \`
        // Any unescaped ` is a bug here
        console.log(`${f}:${idx + 1}: ${line}`);
        issues++;
      }
    }
  });
}

console.log(`\nTotal problematic lines: ${issues}`);
