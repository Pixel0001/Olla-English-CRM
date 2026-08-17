// Patch suplimentar pentru modulul JavaScript — Metodicile 2-6, 10-18
// Aplicat de index.mjs DUPĂ javascriptMetodicaPatch.

import { code, sa } from './helpers.mjs'

// ============================================================
// METODICA 2 — input + bug-ul cu string + comparații
// → augment lecția `input-interactiune`
// ============================================================

const inputInteractiuneTheoryAppend = `

## ⚠️ Bug-ul clasic: \`prompt()\` întoarce întotdeauna text

În JavaScript, \`prompt()\` returnează **string** (text), exact ca \`input()\` din Python. Dacă încerci să aduni două „numere” direct, JavaScript le **concatenează**:

\`\`\`javascript
const a = prompt("Primul: ");   // "3"
const b = prompt("Al doilea: ");  // "4"
console.log(a + b);              // "34" (NU 7!)
\`\`\`

🔧 **Soluția:** convertește cu \`Number(...)\` (sau \`parseInt(...)\`):

\`\`\`javascript
const a = Number(prompt("Primul: "));    // 3
const b = Number(prompt("Al doilea: "));  // 4
console.log(a + b);                       // 7 ✅
\`\`\`

> 💡 Dacă vrei doar întregi: \`parseInt(prompt(...))\`.
> Pentru zecimale: \`parseFloat(prompt(...))\`.
`

const inputInteractiuneProblems = [
  code(
    'Bug-ul cu prompt — corectează adunarea',
    'Programul ar trebui să adune două numere, dar afișează „34” în loc de 7. **Corectează-l**.\n\n```javascript\nconst a = prompt("Primul număr: ");\nconst b = prompt("Al doilea număr: ");\nconsole.log("Suma:", a + b);\n```',
    'javascript',
    'const a = prompt("Primul număr: ");\nconst b = prompt("Al doilea număr: ");\nconsole.log("Suma:", a + b);\n',
    '```javascript\nconst a = Number(prompt("Primul număr: "));\nconst b = Number(prompt("Al doilea număr: "));\nconsole.log("Suma:", a + b);\n```',
    {
      topic: 'input',
      difficulty: 'EASY',
      points: 15,
      hint: 'Înfășoară fiecare prompt în `Number(...)`.',
      correctAnswer: 'const a = Number(prompt("Primul număr: "));\nconst b = Number(prompt("Al doilea număr: "));\nconsole.log("Suma:", a + b);',
      tags: ['prompt', 'Number'],
    }
  ),
  code(
    'Aria dreptunghiului',
    'Citește lungimea și lățimea (numere întregi) și afișează aria.',
    'javascript',
    'const L = Number(prompt("Lungimea: "));\nconst l = Number(prompt("Lățimea: "));\n',
    '```javascript\nconst L = Number(prompt("Lungimea: "));\nconst l = Number(prompt("Lățimea: "));\nconsole.log("Aria:", L * l);\n```',
    {
      topic: 'input',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const L = Number(prompt("Lungimea: "));\nconst l = Number(prompt("Lățimea: "));\nconsole.log("Aria:", L * l);',
      tags: ['prompt'],
    }
  ),
  code(
    'Vârsta peste 5 ani',
    'Cere vârsta utilizatorului și afișează „Peste 5 ani vei avea X ani”.',
    'javascript',
    'const varsta = Number(prompt("Câți ani ai? "));\n',
    '```javascript\nconst varsta = Number(prompt("Câți ani ai? "));\nconsole.log("Peste 5 ani vei avea", varsta + 5, "ani");\n```',
    {
      topic: 'input',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const varsta = Number(prompt("Câți ani ai? "));\nconsole.log("Peste 5 ani vei avea", varsta + 5, "ani");',
      tags: ['prompt'],
    }
  ),
]

// ============================================================
// METODICA 4 + porțiuni M2 — operatorii logici && / || / !
// → augment `if-else-js`
// ============================================================

const ifElseJsTheoryAppend = `

## 🔗 Operatorii logici: \`&&\`, \`||\`, \`!\`

În JavaScript folosim simboluri în loc de cuvinte:

| Python | JavaScript |
|---|---|
| \`and\` | \`&&\` |
| \`or\` | \`\\|\\|\` |
| \`not\` | \`!\` |

### \`&&\` — ȘI logic
Adevărat **doar dacă AMBELE** condiții sunt adevărate.

| A | B | A && B |
|---|---|---|
| \`true\` | \`true\` | **true** |
| \`true\` | \`false\` | false |
| \`false\` | oricare | false |

### \`||\` — SAU logic
Adevărat dacă **cel puțin UNA** este adevărată.

### \`!\` — NEGAȚIE
\`!true\` → \`false\`, \`!false\` → \`true\`.

\`\`\`javascript
const varsta = 20;
if (varsta >= 18 && varsta <= 65) {
    console.log("Apt de muncă");
}

if (zi === "sâmbătă" || zi === "duminică") {
    console.log("Weekend!");
}

if (!areCard) {
    console.log("Acces refuzat");
}
\`\`\`

## 🔄 \`else if\` — verificări multiple

JavaScript folosește \`else if\` (cu spațiu, **NU** \`elif\` ca Python):

\`\`\`javascript
const zi = Number(prompt("Ziua (1-7): "));
if (zi === 1) console.log("Luni");
else if (zi === 2) console.log("Marți");
else if (zi === 3) console.log("Miercuri");
// ...
else console.log("Zi invalidă");
\`\`\`

> 💡 Folosește \`===\` (strict equal) în loc de \`==\` în JavaScript.
`

const ifElseJsProblems = [
  code(
    'Verificare parolă',
    'Cere o parolă. Dacă e `qwerty`, afișează „Parolă corectă!”. Altfel: „Parolă greșită!”.',
    'javascript',
    'const p = prompt("Parola: ");\n',
    '```javascript\nconst p = prompt("Parola: ");\nif (p === "qwerty") {\n    console.log("Parolă corectă!");\n} else {\n    console.log("Parolă greșită!");\n}\n```',
    {
      topic: 'if-else',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const p = prompt("Parola: ");\nif (p === "qwerty") {\n    console.log("Parolă corectă!");\n} else {\n    console.log("Parolă greșită!");\n}',
      tags: ['if-else'],
    }
  ),
  code(
    'Major sau minor',
    'Cere vârsta. Dacă ≥ 18 → „Ești major”, altfel „Ești minor”.',
    'javascript',
    'const varsta = Number(prompt("Vârsta: "));\n',
    '```javascript\nconst varsta = Number(prompt("Vârsta: "));\nif (varsta >= 18) {\n    console.log("Ești major");\n} else {\n    console.log("Ești minor");\n}\n```',
    {
      topic: 'if-else',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const varsta = Number(prompt("Vârsta: "));\nif (varsta >= 18) {\n    console.log("Ești major");\n} else {\n    console.log("Ești minor");\n}',
      tags: ['if-else'],
    }
  ),
  code(
    'Ziua săptămânii (else if)',
    'Cere un număr 1-7 și afișează ziua. Pentru altă valoare: „Zi invalidă”.',
    'javascript',
    'const n = Number(prompt("Ziua (1-7): "));\n',
    '```javascript\nconst n = Number(prompt("Ziua (1-7): "));\nif (n === 1) console.log("Luni");\nelse if (n === 2) console.log("Marți");\nelse if (n === 3) console.log("Miercuri");\nelse if (n === 4) console.log("Joi");\nelse if (n === 5) console.log("Vineri");\nelse if (n === 6) console.log("Sâmbătă");\nelse if (n === 7) console.log("Duminică");\nelse console.log("Zi invalidă");\n```',
    {
      topic: 'else-if',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'const n = Number(prompt("Ziua (1-7): "));\nif (n === 1) console.log("Luni");\nelse if (n === 2) console.log("Marți");\nelse if (n === 3) console.log("Miercuri");\nelse if (n === 4) console.log("Joi");\nelse if (n === 5) console.log("Vineri");\nelse if (n === 6) console.log("Sâmbătă");\nelse if (n === 7) console.log("Duminică");\nelse console.log("Zi invalidă");',
      tags: ['else-if'],
    }
  ),
  code(
    'Număr par ȘI pozitiv',
    'Cere un număr și afișează `true` dacă este par ȘI pozitiv, altfel `false`.',
    'javascript',
    'const n = Number(prompt("Număr: "));\n',
    '```javascript\nconst n = Number(prompt("Număr: "));\nconsole.log(n % 2 === 0 && n > 0);\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const n = Number(prompt("Număr: "));\nconsole.log(n % 2 === 0 && n > 0);',
      tags: ['&&', 'modulo'],
    }
  ),
  code(
    'Divizibil cu 2 SAU cu 3',
    'Cere un număr și afișează „Da” dacă e divizibil cu 2 sau cu 3, altfel „Nu”.',
    'javascript',
    'const n = Number(prompt("Număr: "));\n',
    '```javascript\nconst n = Number(prompt("Număr: "));\nif (n % 2 === 0 || n % 3 === 0) {\n    console.log("Da");\n} else {\n    console.log("Nu");\n}\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const n = Number(prompt("Număr: "));\nif (n % 2 === 0 || n % 3 === 0) {\n    console.log("Da");\n} else {\n    console.log("Nu");\n}',
      tags: ['||', 'modulo'],
    }
  ),
  code(
    'Acces gratuit la muzeu',
    'Intrarea e gratuită pentru < 7 ani sau > 65 ani. Cere vârsta și afișează „Gratuit” sau „Plătește”.',
    'javascript',
    'const varsta = Number(prompt("Vârsta: "));\n',
    '```javascript\nconst varsta = Number(prompt("Vârsta: "));\nif (varsta < 7 || varsta > 65) {\n    console.log("Gratuit");\n} else {\n    console.log("Plătește");\n}\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const varsta = Number(prompt("Vârsta: "));\nif (varsta < 7 || varsta > 65) {\n    console.log("Gratuit");\n} else {\n    console.log("Plătește");\n}',
      tags: ['||'],
    }
  ),
  code(
    'Login admin',
    'Acceptă DOAR `admin` + `1234`. Afișează „Bun venit, admin!” sau „Date incorecte”.',
    'javascript',
    'const u = prompt("Username: ");\nconst p = prompt("Parolă: ");\n',
    '```javascript\nconst u = prompt("Username: ");\nconst p = prompt("Parolă: ");\nif (u === "admin" && p === "1234") {\n    console.log("Bun venit, admin!");\n} else {\n    console.log("Date incorecte");\n}\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const u = prompt("Username: ");\nconst p = prompt("Parolă: ");\nif (u === "admin" && p === "1234") {\n    console.log("Bun venit, admin!");\n} else {\n    console.log("Date incorecte");\n}',
      tags: ['&&'],
    }
  ),
  code(
    'Cont nou — validare',
    'Username nevid ȘI parolă cu cel puțin 8 caractere. Afișează „Cont creat” sau „Date invalide”.',
    'javascript',
    'const u = prompt("Username: ");\nconst p = prompt("Parolă: ");\n',
    '```javascript\nconst u = prompt("Username: ");\nconst p = prompt("Parolă: ");\nif (u !== "" && p.length >= 8) {\n    console.log("Cont creat");\n} else {\n    console.log("Date invalide");\n}\n```',
    {
      topic: 'and-or',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Folosește `.length` pentru lungimea string-ului.',
      correctAnswer: 'const u = prompt("Username: ");\nconst p = prompt("Parolă: ");\nif (u !== "" && p.length >= 8) {\n    console.log("Cont creat");\n} else {\n    console.log("Date invalide");\n}',
      tags: ['&&', 'length'],
    }
  ),
  code(
    'An bisect',
    'Bisect = (div 4 ȘI NU div 100) SAU div 400. Cere un an și afișează „Bisect” sau „Nu este bisect”.',
    'javascript',
    'const an = Number(prompt("Anul: "));\n',
    '```javascript\nconst an = Number(prompt("Anul: "));\nif ((an % 4 === 0 && an % 100 !== 0) || an % 400 === 0) {\n    console.log("Bisect");\n} else {\n    console.log("Nu este bisect");\n}\n```',
    {
      topic: 'and-or',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Atenție la paranteze: `(div 4 && !div 100) || div 400`.',
      correctAnswer: 'const an = Number(prompt("Anul: "));\nif ((an % 4 === 0 && an % 100 !== 0) || an % 400 === 0) {\n    console.log("Bisect");\n} else {\n    console.log("Nu este bisect");\n}',
      tags: ['&&', '||', 'modulo'],
    }
  ),
  code(
    'Triunghi valid',
    'Cere `a`, `b`, `c`. Verifică `a < b+c && b < a+c && c < a+b`. Afișează „Da” sau „Nu”.',
    'javascript',
    'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\n',
    '```javascript\nconst a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\nif (a < b + c && b < a + c && c < a + b) {\n    console.log("Da");\n} else {\n    console.log("Nu");\n}\n```',
    {
      topic: 'and-or',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\nif (a < b + c && b < a + c && c < a + b) {\n    console.log("Da");\n} else {\n    console.log("Nu");\n}',
      tags: ['&&'],
    }
  ),
]

// ============================================================
// METODICA 3 — Math.floor(/) și %
// → augment `operatori-js`
// ============================================================

const operatoriJsTheoryAppend = `

## ➗ Împărțirea întreagă și restul în JavaScript

Spre deosebire de Python (care are \`//\`), JavaScript nu are operator dedicat pentru împărțirea întreagă. Folosim **\`Math.floor(a / b)\`** sau **\`Math.trunc(a / b)\`** (pentru pozitive sunt echivalente).

| Python | JavaScript |
|---|---|
| \`a // b\` | \`Math.floor(a / b)\` |
| \`a % b\` | \`a % b\` (la fel!) |

\`\`\`javascript
const cat = Math.floor(10 / 3);   // 3
const rest = 10 % 3;              // 1
\`\`\`

### 💡 Aplicație: convertire grame → kg + grame

\`\`\`javascript
const total = 2750;
const kg = Math.floor(total / 1000);  // 2
const g = total % 1000;               // 750
console.log(\`\${kg} kg și \${g} g\`);
\`\`\`

### 🔍 Detectare paritate
\`if (n % 2 === 0)\` → par. Altfel → impar.
`

const operatoriJsProblems = [
  code(
    'Câtul și restul',
    'Cere `a` și `b`. Afișează câtul (împărțirea întreagă) și restul.',
    'javascript',
    'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\n',
    '```javascript\nconst a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconsole.log("Cât:", Math.floor(a / b));\nconsole.log("Rest:", a % b);\n```',
    {
      topic: 'operatori',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconsole.log("Cât:", Math.floor(a / b));\nconsole.log("Rest:", a % b);',
      tags: ['Math.floor', '%'],
    }
  ),
  code(
    'Convertire grame în kg + grame',
    'Cere un număr de grame și afișează „X kg și Y g”.',
    'javascript',
    'const g = Number(prompt("Grame: "));\n',
    '```javascript\nconst g = Number(prompt("Grame: "));\nconst kg = Math.floor(g / 1000);\nconst rest = g % 1000;\nconsole.log(kg, "kg și", rest, "g");\n```',
    {
      topic: 'operatori',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'const g = Number(prompt("Grame: "));\nconst kg = Math.floor(g / 1000);\nconst rest = g % 1000;\nconsole.log(kg, "kg și", rest, "g");',
      tags: ['Math.floor', '%'],
    }
  ),
  code(
    'Cost telegramă (lei și bani)',
    'O telegramă costă 40 bani per caracter. Cere lungimea și afișează „X lei și Y bani”.',
    'javascript',
    'const n = Number(prompt("Numărul de caractere: "));\n',
    '```javascript\nconst n = Number(prompt("Numărul de caractere: "));\nconst totalBani = n * 40;\nconst lei = Math.floor(totalBani / 100);\nconst bani = totalBani % 100;\nconsole.log(lei, "lei și", bani, "bani");\n```',
    {
      topic: 'operatori',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'const n = Number(prompt("Numărul de caractere: "));\nconst totalBani = n * 40;\nconst lei = Math.floor(totalBani / 100);\nconst bani = totalBani % 100;\nconsole.log(lei, "lei și", bani, "bani");',
      tags: ['aplicație'],
    }
  ),
  code(
    'Par sau impar',
    'Cere un număr și afișează „Par” sau „Impar”.',
    'javascript',
    'const n = Number(prompt("Număr: "));\n',
    '```javascript\nconst n = Number(prompt("Număr: "));\nconsole.log(n % 2 === 0 ? "Par" : "Impar");\n```',
    {
      topic: 'operatori',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const n = Number(prompt("Număr: "));\nconsole.log(n % 2 === 0 ? "Par" : "Impar");',
      tags: ['ternar', '%'],
    }
  ),
]

// ============================================================
// METODICA 5 — Probleme de matematică
// → augment `probleme-conditii-js`
// ============================================================

const problemeConditiiJsProblems = [
  code(
    'Aria și perimetrul dreptunghiului',
    'Cere `L` și `l`. Afișează aria (`L*l`) și perimetrul (`2*(L+l)`).',
    'javascript',
    'const L = Number(prompt("Lungimea: "));\nconst l = Number(prompt("Lățimea: "));\n',
    '```javascript\nconst L = Number(prompt("Lungimea: "));\nconst l = Number(prompt("Lățimea: "));\nconsole.log("Aria:", L * l);\nconsole.log("Perimetrul:", 2 * (L + l));\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const L = Number(prompt("Lungimea: "));\nconst l = Number(prompt("Lățimea: "));\nconsole.log("Aria:", L * l);\nconsole.log("Perimetrul:", 2 * (L + l));',
      tags: ['geometrie'],
    }
  ),
  code(
    'Celsius → Fahrenheit',
    'Cere o temperatură în Celsius și convertește la Fahrenheit (`C * 9/5 + 32`).',
    'javascript',
    'const C = Number(prompt("Celsius: "));\n',
    '```javascript\nconst C = Number(prompt("Celsius: "));\nconst F = C * 9 / 5 + 32;\nconsole.log("Fahrenheit:", F);\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const C = Number(prompt("Celsius: "));\nconst F = C * 9 / 5 + 32;\nconsole.log("Fahrenheit:", F);',
      tags: ['conversie'],
    }
  ),
  code(
    'Media a două numere',
    'Cere două numere și afișează media.',
    'javascript',
    'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\n',
    '```javascript\nconst a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconsole.log("Media:", (a + b) / 2);\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconsole.log("Media:", (a + b) / 2);',
      tags: ['medie'],
    }
  ),
  code(
    'Aria și circumferința cercului',
    'Cere raza și afișează aria (`π * r²`) și circumferința (`2 * π * r`). Folosește `Math.PI`.',
    'javascript',
    'const r = Number(prompt("Raza: "));\n',
    '```javascript\nconst r = Number(prompt("Raza: "));\nconsole.log("Aria:", Math.PI * r ** 2);\nconsole.log("Circumferința:", 2 * Math.PI * r);\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 20,
      hint: 'JavaScript are `Math.PI` predefinit.',
      correctAnswer: 'const r = Number(prompt("Raza: "));\nconsole.log("Aria:", Math.PI * r ** 2);\nconsole.log("Circumferința:", 2 * Math.PI * r);',
      tags: ['Math.PI'],
    }
  ),
  code(
    'Ipotenuza (Pitagora)',
    'Cere catetele `a` și `b`. Afișează `Math.sqrt(a² + b²)`.',
    'javascript',
    'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\n',
    '```javascript\nconst a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst ip = Math.sqrt(a ** 2 + b ** 2);\nconsole.log("Ipotenuza:", ip);\n```',
    {
      topic: 'matematica',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst ip = Math.sqrt(a ** 2 + b ** 2);\nconsole.log("Ipotenuza:", ip);',
      tags: ['Math.sqrt'],
    }
  ),
  code(
    'Ecuația liniară ax + b = c',
    'Citește `a`, `b`, `c`. Tratează:\n- `a === 0 && b === c` → „Soluții infinite”\n- `a === 0 && b !== c` → „Fără soluții”\n- altfel → `x = (c - b) / a`',
    'javascript',
    'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\n',
    '```javascript\nconst a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\nif (a === 0) {\n    if (b === c) console.log("Soluții infinite");\n    else console.log("Fără soluții");\n} else {\n    console.log("x =", (c - b) / a);\n}\n```',
    {
      topic: 'matematica',
      difficulty: 'HARD',
      points: 30,
      correctAnswer: 'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\nif (a === 0) {\n    if (b === c) console.log("Soluții infinite");\n    else console.log("Fără soluții");\n} else {\n    console.log("x =", (c - b) / a);\n}',
      tags: ['ecuatie'],
    }
  ),
  code(
    'Ecuația de gradul II',
    'Citește `a`, `b`, `c`. Calculează `Δ = b² - 4ac` și tratează: > 0 (2 soluții), == 0 (1 soluție), < 0 („Fără soluții reale”).',
    'javascript',
    'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\n',
    '```javascript\nconst a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\nconst D = b ** 2 - 4 * a * c;\nif (D > 0) {\n    const x1 = (-b + Math.sqrt(D)) / (2 * a);\n    const x2 = (-b - Math.sqrt(D)) / (2 * a);\n    console.log("x1 =", x1, "x2 =", x2);\n} else if (D === 0) {\n    console.log("x =", -b / (2 * a));\n} else {\n    console.log("Fără soluții reale");\n}\n```',
    {
      topic: 'matematica',
      difficulty: 'HARD',
      points: 30,
      correctAnswer: 'const a = Number(prompt("a: "));\nconst b = Number(prompt("b: "));\nconst c = Number(prompt("c: "));\nconst D = b ** 2 - 4 * a * c;\nif (D > 0) {\n    const x1 = (-b + Math.sqrt(D)) / (2 * a);\n    const x2 = (-b - Math.sqrt(D)) / (2 * a);\n    console.log("x1 =", x1, "x2 =", x2);\n} else if (D === 0) {\n    console.log("x =", -b / (2 * a));\n} else {\n    console.log("Fără soluții reale");\n}',
      tags: ['discriminant', 'Math.sqrt'],
    }
  ),
]

// ============================================================
// METODICA 6 + M14 — string-uri: includes/length/regex
// → augment `string-uri-js`
// ============================================================

const stringUriJsTheoryAppend = `

## 🔍 \`includes()\` — verifică apartenența

Echivalentul Python \`in\` pentru string-uri în JavaScript este metoda \`.includes()\`:

\`\`\`javascript
"salut".includes("a")          // true
"abcdef".includes("xyz")       // false
"user@mail.com".includes("@")  // true
\`\`\`

Pentru **negație** (\`not in\`), folosim \`!\`:

\`\`\`javascript
!"salut".includes(" ")  // true (nu conține spațiu)
\`\`\`

## ✏️ \`.length\` — lungimea

\`\`\`javascript
"salut".length    // 5
"".length         // 0
"a b c".length    // 5
\`\`\`

## 🔡 Verificare doar litere / doar cifre

JavaScript NU are \`.isalpha()\` sau \`.isdigit()\` ca Python. Avem două variante:

### Variantă cu **regex** (recomandat)
\`\`\`javascript
/^[a-zA-Z]+$/.test("abc")   // true (doar litere ASCII)
/^[0-9]+$/.test("123")      // true (doar cifre)
\`\`\`

### Variantă pe un singur caracter
\`\`\`javascript
function esteCifra(c) {
    return c >= "0" && c <= "9";
}
function esteLitera(c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}
\`\`\`

## ➕ String-urile sunt „aproape ca array-uri”

| Operație | JavaScript |
|---|---|
| Acces caracter | \`s[0]\`, \`s.charAt(0)\` |
| Ultimul caracter | \`s[s.length - 1]\` |
| Lungime | \`s.length\` |
| Iterare | \`for (const c of s)\` |
| Concatenare | \`s + "x"\` |
| Slicing | \`s.slice(1, 4)\` |
| Inversare | \`s.split("").reverse().join("")\` |

⚠️ String-urile sunt **imutabile** în JS la fel ca în Python.
`

const stringUriJsProblems = [
  code(
    'Verifică litera în cuvânt',
    'Cere un cuvânt și o literă. Afișează „Da” dacă litera apare în cuvânt, altfel „Nu”.',
    'javascript',
    'const cuvant = prompt("Cuvânt: ");\nconst litera = prompt("Literă: ");\n',
    '```javascript\nconst cuvant = prompt("Cuvânt: ");\nconst litera = prompt("Literă: ");\nif (cuvant.includes(litera)) {\n    console.log("Da");\n} else {\n    console.log("Nu");\n}\n```',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const cuvant = prompt("Cuvânt: ");\nconst litera = prompt("Literă: ");\nif (cuvant.includes(litera)) {\n    console.log("Da");\n} else {\n    console.log("Nu");\n}',
      tags: ['includes'],
    }
  ),
  code(
    'Email valid (conține @)',
    'Cere un email și verifică dacă conține `@`. „Valid” / „Invalid”.',
    'javascript',
    'const email = prompt("Email: ");\n',
    '```javascript\nconst email = prompt("Email: ");\nconsole.log(email.includes("@") ? "Valid" : "Invalid");\n```',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const email = prompt("Email: ");\nconsole.log(email.includes("@") ? "Valid" : "Invalid");',
      tags: ['includes'],
    }
  ),
  code(
    'Username fără spații',
    'Cere un username. „Valid” dacă nu conține spațiu și are ≥ 3 caractere.',
    'javascript',
    'const u = prompt("Username: ");\n',
    '```javascript\nconst u = prompt("Username: ");\nif (!u.includes(" ") && u.length >= 3) {\n    console.log("Valid");\n} else {\n    console.log("Invalid");\n}\n```',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'const u = prompt("Username: ");\nif (!u.includes(" ") && u.length >= 3) {\n    console.log("Valid");\n} else {\n    console.log("Invalid");\n}',
      tags: ['!includes', 'length'],
    }
  ),
  code(
    'Verifică doar litere',
    'Cere un text și afișează `true` dacă e format doar din litere (folosește regex).',
    'javascript',
    'const x = prompt("Text: ");\n',
    '```javascript\nconst x = prompt("Text: ");\nconsole.log(/^[a-zA-Z]+$/.test(x));\n```',
    {
      topic: 'regex',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const x = prompt("Text: ");\nconsole.log(/^[a-zA-Z]+$/.test(x));',
      tags: ['regex'],
    }
  ),
  code(
    'Numără litere, cifre și semne',
    'Cere o propoziție. Numără separat **litere** (a-z/A-Z), **cifre** (0-9) și **alte semne** (excluzând spațiul).',
    'javascript',
    'const x = prompt("Propoziția: ");\nlet litere = 0, cifre = 0, semne = 0;\n',
    '```javascript\nconst x = prompt("Propoziția: ");\nlet litere = 0, cifre = 0, semne = 0;\nfor (const c of x) {\n    if (/[a-zA-Z]/.test(c)) litere++;\n    else if (/[0-9]/.test(c)) cifre++;\n    else if (c !== " ") semne++;\n}\nconsole.log("Litere:", litere, "Cifre:", cifre, "Semne:", semne);\n```',
    {
      topic: 'regex',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const x = prompt("Propoziția: ");\nlet litere = 0, cifre = 0, semne = 0;\nfor (const c of x) {\n    if (/[a-zA-Z]/.test(c)) litere++;\n    else if (/[0-9]/.test(c)) cifre++;\n    else if (c !== " ") semne++;\n}\nconsole.log("Litere:", litere, "Cifre:", cifre, "Semne:", semne);',
      tags: ['for-of', 'regex'],
    }
  ),
  code(
    'Inversează șirul',
    'Cere un text și afișează-l invers.',
    'javascript',
    'const x = prompt("Text: ");\n',
    '```javascript\nconst x = prompt("Text: ");\nconsole.log(x.split("").reverse().join(""));\n```',
    {
      topic: 'string',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'JavaScript: `.split("").reverse().join("")`.',
      correctAnswer: 'const x = prompt("Text: ");\nconsole.log(x.split("").reverse().join(""));',
      tags: ['reverse'],
    }
  ),
  code(
    'Prima și ultima literă',
    'Cere un cuvânt și afișează prima și ultima literă, separate prin spațiu.',
    'javascript',
    'const x = prompt("Cuvânt: ");\n',
    '```javascript\nconst x = prompt("Cuvânt: ");\nconsole.log(x[0], x[x.length - 1]);\n```',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'const x = prompt("Cuvânt: ");\nconsole.log(x[0], x[x.length - 1]);',
      tags: ['index'],
    }
  ),
  code(
    'Înlocuiește / cu .',
    'Cere o dată în formatul `ZZ/LL/AAAA` și afișează `ZZ.LL.AAAA`.',
    'javascript',
    'const x = prompt("Data: ");\n',
    '```javascript\nconst x = prompt("Data: ");\nlet y = "";\nfor (const c of x) {\n    y += (c === "/" ? "." : c);\n}\nconsole.log(y);\n```\n\n💡 Variantă scurtă: `x.replaceAll("/", ".")`.',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const x = prompt("Data: ");\nconsole.log(x.replaceAll("/", "."));',
      tags: ['replace'],
    }
  ),
]

// ============================================================
// METODICA 10 — Array-uri de bază
// → augment `arrays-introducere`
// ============================================================

const arraysIntroducereProblems = [
  code(
    'Pușculița (3 monede)',
    'Cere de 3 ori valoarea unei monede și salvează-le într-un array. Afișează array-ul la final.',
    'javascript',
    'const pusculita = [];\n',
    '```javascript\nconst pusculita = [];\nfor (let i = 0; i < 3; i++) {\n    const valoare = Number(prompt("Monedă: "));\n    pusculita.push(valoare);\n}\nconsole.log("În pușculiță:", pusculita);\n```',
    {
      topic: 'arrays',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `pusculita.push(valoare)` în interiorul unui for.',
      correctAnswer: 'const pusculita = [];\nfor (let i = 0; i < 3; i++) {\n    const valoare = Number(prompt("Monedă: "));\n    pusculita.push(valoare);\n}\nconsole.log("În pușculiță:", pusculita);',
      tags: ['push', 'for'],
    }
  ),
  code(
    'Pușculița (până la 0)',
    'Modificare: utilizatorul introduce monede până când introduce 0.',
    'javascript',
    'const pusculita = [];\n',
    '```javascript\nconst pusculita = [];\nwhile (true) {\n    const v = Number(prompt("Monedă: "));\n    if (v === 0) break;\n    pusculita.push(v);\n}\nconsole.log("În pușculiță:", pusculita);\n```',
    {
      topic: 'arrays',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'const pusculita = [];\nwhile (true) {\n    const v = Number(prompt("Monedă: "));\n    if (v === 0) break;\n    pusculita.push(v);\n}\nconsole.log("În pușculiță:", pusculita);',
      tags: ['push', 'break'],
    }
  ),
  code(
    'Suma monedelor mici / mari',
    'După ce ai citit array-ul, afișează suma monedelor ≤ 100 și suma celor > 100.',
    'javascript',
    'const pusculita = [];\n',
    '```javascript\nconst pusculita = [];\nwhile (true) {\n    const v = Number(prompt("Monedă: "));\n    if (v === 0) break;\n    pusculita.push(v);\n}\nlet mici = 0, mari = 0;\nfor (const m of pusculita) {\n    if (m <= 100) mici += m;\n    else mari += m;\n}\nconsole.log("Mici:", mici, "Mari:", mari);\n```',
    {
      topic: 'arrays',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const pusculita = [];\nwhile (true) {\n    const v = Number(prompt("Monedă: "));\n    if (v === 0) break;\n    pusculita.push(v);\n}\nlet mici = 0, mari = 0;\nfor (const m of pusculita) {\n    if (m <= 100) mici += m;\n    else mari += m;\n}\nconsole.log("Mici:", mici, "Mari:", mari);',
      tags: ['for-of'],
    }
  ),
  code(
    'Listă de la 1 la 30',
    'Generează un array cu numerele de la 1 la 30.',
    'javascript',
    'const numere = [];\n',
    '```javascript\nconst numere = [];\nfor (let i = 1; i <= 30; i++) {\n    numere.push(i);\n}\nconsole.log(numere);\n```',
    {
      topic: 'arrays',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const numere = [];\nfor (let i = 1; i <= 30; i++) {\n    numere.push(i);\n}\nconsole.log(numere);',
      tags: ['push'],
    }
  ),
  code(
    'Numere pare descrescător',
    'Generează un array cu numerele pare de la 30 la 2.',
    'javascript',
    'const lista = [];\n',
    '```javascript\nconst lista = [];\nfor (let i = 30; i >= 2; i -= 2) {\n    lista.push(i);\n}\nconsole.log(lista);\n```',
    {
      topic: 'arrays',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const lista = [];\nfor (let i = 30; i >= 2; i -= 2) {\n    lista.push(i);\n}\nconsole.log(lista);',
      tags: ['push'],
    }
  ),
  code(
    'Modifică al doilea element',
    'Pornind de la `["salut", "carte", "Ion"]`, modifică elementul de la indexul 1 în `"JavaScript"`.',
    'javascript',
    'const lista = ["salut", "carte", "Ion"];\n',
    '```javascript\nconst lista = ["salut", "carte", "Ion"];\nlista[1] = "JavaScript";\nconsole.log(lista);\n```',
    {
      topic: 'arrays',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'const lista = ["salut", "carte", "Ion"];\nlista[1] = "JavaScript";\nconsole.log(lista);',
      tags: ['index'],
    }
  ),
]

// ============================================================
// METODICA 12 — `includes` cu array-uri
// → augment `arrays-operatii`
// ============================================================

const arraysOperatiiProblems = [
  code(
    'Mâncare preferată',
    'Pornind de la `["pizza","sushi","burger","salată"]`, cere un fel. Afișează „Gustos!” / „Nu îmi place”.',
    'javascript',
    'const meniu = ["pizza", "sushi", "burger", "salată"];\n',
    '```javascript\nconst meniu = ["pizza", "sushi", "burger", "salată"];\nconst f = prompt("Fel: ");\nconsole.log(meniu.includes(f) ? "Gustos!" : "Nu îmi place");\n```',
    {
      topic: 'arrays',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const meniu = ["pizza", "sushi", "burger", "salată"];\nconst f = prompt("Fel: ");\nconsole.log(meniu.includes(f) ? "Gustos!" : "Nu îmi place");',
      tags: ['includes'],
    }
  ),
  code(
    'Suma și produsul',
    'Cere `N`, apoi `N` numere. Salvează-le într-un array. Afișează suma și produsul.',
    'javascript',
    'const n = Number(prompt("Câte numere: "));\nconst lista = [];\n',
    '```javascript\nconst n = Number(prompt("Câte numere: "));\nconst lista = [];\nfor (let i = 0; i < n; i++) {\n    lista.push(Number(prompt("Număr: ")));\n}\nlet suma = 0, produs = 1;\nfor (const x of lista) {\n    suma += x;\n    produs *= x;\n}\nconsole.log("Suma:", suma, "Produs:", produs);\n```',
    {
      topic: 'arrays',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Inițializează `produs = 1` (NU 0!).',
      correctAnswer: 'const n = Number(prompt("Câte numere: "));\nconst lista = [];\nfor (let i = 0; i < n; i++) {\n    lista.push(Number(prompt("Număr: ")));\n}\nlet suma = 0, produs = 1;\nfor (const x of lista) {\n    suma += x;\n    produs *= x;\n}\nconsole.log("Suma:", suma, "Produs:", produs);',
      tags: ['for-of', 'agregare'],
    }
  ),
  code(
    'Acces blacklist',
    'Există un blacklist `["Gigel", "Marcel", "Admin"]`. Cere nume și „da”/„nu” pentru card. Acces permis dacă numele NU e în blacklist ȘI are card.',
    'javascript',
    'const blacklist = ["Gigel", "Marcel", "Admin"];\nconst nume = prompt("Nume: ");\nconst card = prompt("Card? (da/nu): ");\n',
    '```javascript\nconst blacklist = ["Gigel", "Marcel", "Admin"];\nconst nume = prompt("Nume: ");\nconst card = prompt("Card? (da/nu): ");\nif (!blacklist.includes(nume) && card === "da") {\n    console.log("Acces permis, bun venit", nume);\n} else {\n    console.log("Acces refuzat");\n}\n```',
    {
      topic: 'arrays',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'const blacklist = ["Gigel", "Marcel", "Admin"];\nconst nume = prompt("Nume: ");\nconst card = prompt("Card? (da/nu): ");\nif (!blacklist.includes(nume) && card === "da") {\n    console.log("Acces permis, bun venit", nume);\n} else {\n    console.log("Acces refuzat");\n}',
      tags: ['!includes'],
    }
  ),
  code(
    'Filtrare spam',
    'Cuvinte interzise: `["spam", "ofertă", "gratis"]`. Cere un mesaj. „Suspect” dacă conține oricare, altfel „Curat”.',
    'javascript',
    'const interzise = ["spam", "ofertă", "gratis"];\nconst mesaj = prompt("Mesaj: ");\n',
    '```javascript\nconst interzise = ["spam", "ofertă", "gratis"];\nconst mesaj = prompt("Mesaj: ");\nlet suspect = false;\nfor (const cuv of interzise) {\n    if (mesaj.includes(cuv)) {\n        suspect = true;\n        break;\n    }\n}\nconsole.log(suspect ? "Suspect" : "Curat");\n```\n\n💡 Variantă funcțională: `interzise.some(c => mesaj.includes(c))`.',
    {
      topic: 'arrays',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const interzise = ["spam", "ofertă", "gratis"];\nconst mesaj = prompt("Mesaj: ");\nconst suspect = interzise.some(c => mesaj.includes(c));\nconsole.log(suspect ? "Suspect" : "Curat");',
      tags: ['some', 'includes'],
    }
  ),
]

// ============================================================
// METODICA 16 — for pe stringuri
// → augment `for-vs-while-js`
// ============================================================

const forVsWhileJsProblems = [
  code(
    'Litere în coloană (for-of)',
    'Cere un cuvânt și afișează fiecare literă pe o linie nouă, folosind `for...of`.',
    'javascript',
    'const x = prompt("Cuvânt: ");\n',
    '```javascript\nconst x = prompt("Cuvânt: ");\nfor (const c of x) {\n    console.log(c);\n}\n```',
    {
      topic: 'for',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'const x = prompt("Cuvânt: ");\nfor (const c of x) {\n    console.log(c);\n}',
      tags: ['for-of'],
    }
  ),
  code(
    'Email cu un singur @',
    'Cere un email și verifică folosind `for...of` că conține EXACT un singur `@`.',
    'javascript',
    'const x = prompt("Email: ");\nlet q = 0;\n',
    '```javascript\nconst x = prompt("Email: ");\nlet q = 0;\nfor (const c of x) {\n    if (c === "@") q++;\n}\nconsole.log(q === 1);\n```',
    {
      topic: 'for',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const x = prompt("Email: ");\nlet q = 0;\nfor (const c of x) {\n    if (c === "@") q++;\n}\nconsole.log(q === 1);',
      tags: ['for-of', 'contor'],
    }
  ),
  code(
    'Numără caracterele fără spațiu',
    'Cere o frază și afișează numărul de caractere excluzând spațiile.',
    'javascript',
    'const x = prompt("Fraza: ");\n',
    '```javascript\nconst x = prompt("Fraza: ");\nlet n = 0;\nfor (const c of x) {\n    if (c !== " ") n++;\n}\nconsole.log(n);\n```',
    {
      topic: 'for',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const x = prompt("Fraza: ");\nlet n = 0;\nfor (const c of x) {\n    if (c !== " ") n++;\n}\nconsole.log(n);',
      tags: ['for-of'],
    }
  ),
  code(
    'Înlocuiește primele 2 a → j',
    'Cere o propoziție și înlocuiește doar **primele 2** apariții ale literei `a` cu `j`. Restul rămân neschimbate.',
    'javascript',
    'const x = prompt("Propoziție: ");\n',
    '```javascript\nconst x = prompt("Propoziție: ");\nlet z = 0;\nlet rez = "";\nfor (const c of x) {\n    if (c === "a" && z < 2) {\n        rez += "j";\n        z++;\n    } else {\n        rez += c;\n    }\n}\nconsole.log(rez);\n```',
    {
      topic: 'for',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const x = prompt("Propoziție: ");\nlet z = 0;\nlet rez = "";\nfor (const c of x) {\n    if (c === "a" && z < 2) {\n        rez += "j";\n        z++;\n    } else {\n        rez += c;\n    }\n}\nconsole.log(rez);',
      tags: ['for-of', 'contor'],
    }
  ),
]

// ============================================================
// METODICA 18 — Obiecte + JSON
// → augment `obiecte-js`
// ============================================================

const obiecteJsTheoryAppend = `

## 📦 JSON — formatul universal

**JSON** (JavaScript Object Notation) provine chiar din JavaScript. Spre deosebire de Python, în JS putem converti foarte ușor între obiecte și JSON.

### 🔄 \`JSON.stringify()\` — obiect → text JSON

\`\`\`javascript
const persoana = { nume: "Maria", varsta: 20, activ: true };
const text = JSON.stringify(persoana);
console.log(text);
// '{"nume":"Maria","varsta":20,"activ":true}'
\`\`\`

### 🔄 \`JSON.parse()\` — text JSON → obiect

\`\`\`javascript
const text = '{"nume":"Maria","varsta":20}';
const obj = JSON.parse(text);
console.log(obj.nume);   // "Maria"
\`\`\`

### 📂 În Node.js: citire fișier JSON

\`\`\`javascript
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("date.json", "utf8"));
\`\`\`

### 📝 Scriere fișier JSON

\`\`\`javascript
fs.writeFileSync("date.json", JSON.stringify(persoana, null, 2));
\`\`\`

> 💡 Al treilea argument \`2\` din \`JSON.stringify\` indentează JSON-ul frumos cu 2 spații.

## ⚖️ Diferențe față de obiectele JS

| JSON | JavaScript |
|---|---|
| chei în ghilimele duble | chei pot fi fără ghilimele |
| \`true\`, \`false\`, \`null\` | la fel |
| **NU permite funcții** sau \`undefined\` | da |
`

const obiecteJsProblems = [
  code(
    'Obiect persoană',
    'Creează un obiect cu cheile `nume`, `varsta`, `oras`. Afișează numele și orașul.',
    'javascript',
    'const persoana = {};\n',
    '```javascript\nconst persoana = {\n    nume: "Ana",\n    varsta: 25,\n    oras: "București"\n};\nconsole.log("Nume:", persoana.nume);\nconsole.log("Oraș:", persoana.oras);\n```',
    {
      topic: 'obiecte',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const persoana = {\n    nume: "Ana",\n    varsta: 25,\n    oras: "București"\n};\nconsole.log("Nume:", persoana.nume);\nconsole.log("Oraș:", persoana.oras);',
      tags: ['obiecte'],
    }
  ),
  code(
    'Adaugă și modifică',
    'Pornind de la persoană, adaugă cheia `email` cu `"ana@example.com"` și schimbă `oras` în `"Cluj"`. Afișează obiectul.',
    'javascript',
    'const persoana = { nume: "Ana", varsta: 25, oras: "București" };\n',
    '```javascript\nconst persoana = { nume: "Ana", varsta: 25, oras: "București" };\npersoana.email = "ana@example.com";\npersoana.oras = "Cluj";\nconsole.log(persoana);\n```',
    {
      topic: 'obiecte',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const persoana = { nume: "Ana", varsta: 25, oras: "București" };\npersoana.email = "ana@example.com";\npersoana.oras = "Cluj";\nconsole.log(persoana);',
      tags: ['obiecte'],
    }
  ),
  code(
    'Șterge dintr-un obiect',
    'Pornind de la `birou = { pixuri: 10, caiete: 5, radiera: 2, creioane: 7 }`, șterge cheia `radiera` (folosește `delete`) și afișează obiectul.',
    'javascript',
    'const birou = { pixuri: 10, caiete: 5, radiera: 2, creioane: 7 };\n',
    '```javascript\nconst birou = { pixuri: 10, caiete: 5, radiera: 2, creioane: 7 };\ndelete birou.radiera;\nconsole.log(birou);\n```',
    {
      topic: 'obiecte',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'const birou = { pixuri: 10, caiete: 5, radiera: 2, creioane: 7 };\ndelete birou.radiera;\nconsole.log(birou);',
      tags: ['delete'],
    }
  ),
  code(
    'Caută nota la materie',
    'Ai `note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 }`. Cere o materie, afișează nota dacă există, altfel „Materia nu există”.',
    'javascript',
    'const note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 };\n',
    '```javascript\nconst note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 };\nconst m = prompt("Materia: ").toLowerCase();\nif (m in note) {\n    console.log(`Nota la ${m} este ${note[m]}`);\n} else {\n    console.log("Materia nu există");\n}\n```',
    {
      topic: 'obiecte',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Verifică `m in note` (operatorul `in` funcționează și la obiecte JS).',
      correctAnswer: 'const note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 };\nconst m = prompt("Materia: ").toLowerCase();\nif (m in note) {\n    console.log(`Nota la ${m} este ${note[m]}`);\n} else {\n    console.log("Materia nu există");\n}',
      tags: ['in', 'template'],
    }
  ),
  code(
    'Media notelor (obiect)',
    'Pornind de la `note`, calculează media notelor și afișeaz-o cu 2 zecimale (folosește `Object.values`).',
    'javascript',
    'const note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 };\n',
    '```javascript\nconst note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 };\nconst valori = Object.values(note);\nlet suma = 0;\nfor (const v of valori) suma += v;\nconst media = suma / valori.length;\nconsole.log(media.toFixed(2));\n```',
    {
      topic: 'obiecte',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește `Object.values(note)` pentru a obține un array cu notele.',
      correctAnswer: 'const note = { matematica: 9, romana: 8, biologie: 7, istorie: 10 };\nconst valori = Object.values(note);\nlet suma = 0;\nfor (const v of valori) suma += v;\nconst media = suma / valori.length;\nconsole.log(media.toFixed(2));',
      tags: ['Object.values', 'toFixed'],
    }
  ),
  code(
    'JSON.stringify și parse',
    'Pornind de la `persoana = { nume: "Ion", varsta: 30 }`:\n1. Convertește la JSON cu `JSON.stringify`\n2. Convertește înapoi cu `JSON.parse` într-o variabilă nouă\n3. Afișează ambele',
    'javascript',
    'const persoana = { nume: "Ion", varsta: 30 };\n',
    '```javascript\nconst persoana = { nume: "Ion", varsta: 30 };\nconst text = JSON.stringify(persoana);\nconst inapoi = JSON.parse(text);\nconsole.log("Text JSON:", text);\nconsole.log("Obiect:", inapoi);\n```',
    {
      topic: 'json',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'const persoana = { nume: "Ion", varsta: 30 };\nconst text = JSON.stringify(persoana);\nconst inapoi = JSON.parse(text);\nconsole.log("Text JSON:", text);\nconsole.log("Obiect:", inapoi);',
      tags: ['JSON.stringify', 'JSON.parse'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Arrays + Math.random
// (după `arrays-operatii`)
// ============================================================

const arraysRandomTheory = `# 🎲 Math.random și array-uri

## 📚 Ce este \`Math.random()\`?

Funcția \`Math.random()\` din JavaScript returnează un număr **zecimal** între 0 (inclusiv) și 1 (exclusiv).

\`\`\`javascript
Math.random()       // ex: 0.7384...
\`\`\`

## 🎯 Numere întregi între limite

Pentru a genera un întreg între \`min\` și \`max\` (inclusiv):

\`\`\`javascript
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

randomInt(1, 100);   // un întreg între 1 și 100
\`\`\`

## 🎁 Aplicație: cadouri aleatorii

\`\`\`javascript
const cadouri = [];
for (let i = 0; i < 10; i++) {
    cadouri.push(randomInt(2, 10));
}
console.log(cadouri);
\`\`\`

## 🔁 Trucuri utile

### Numere unice (fără duplicate)
\`\`\`javascript
const unice = [];
while (unice.length < 5) {
    const n = randomInt(1, 30);
    if (!unice.includes(n)) {
        unice.push(n);
    }
}
\`\`\`

### Sortare descrescătoare
\`\`\`javascript
[5, 3, 8, 1].sort((a, b) => b - a);   // [8, 5, 3, 1]
\`\`\`
`

const arraysRandomProblems = [
  code(
    '3 numere aleatorii',
    'Generează 3 numere întregi aleatorii între 1 și 100 și afișează-le pe o singură linie.',
    'javascript',
    'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\n',
    '```javascript\nfunction randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst a = randomInt(1, 100);\nconst b = randomInt(1, 100);\nconst c = randomInt(1, 100);\nconsole.log(a, b, c);\n```',
    {
      topic: 'random',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconsole.log(randomInt(1, 100), randomInt(1, 100), randomInt(1, 100));',
      tags: ['Math.random'],
    }
  ),
  code(
    'Lista cadourilor',
    'Generează un array cu 10 cadouri (numere între 2 și 10).',
    'javascript',
    'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst cadouri = [];\n',
    '```javascript\nfunction randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst cadouri = [];\nfor (let i = 0; i < 10; i++) {\n    cadouri.push(randomInt(2, 10));\n}\nconsole.log(cadouri);\n```',
    {
      topic: 'random',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst cadouri = [];\nfor (let i = 0; i < 10; i++) {\n    cadouri.push(randomInt(2, 10));\n}\nconsole.log(cadouri);',
      tags: ['Math.random', 'push'],
    }
  ),
  code(
    'Loto — 5 butoaie unice',
    'Extrage 5 numere **unice** între 1 și 30. Fără duplicate!',
    'javascript',
    'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst butoaie = [];\n',
    '```javascript\nfunction randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst butoaie = [];\nwhile (butoaie.length < 5) {\n    const n = randomInt(1, 30);\n    if (!butoaie.includes(n)) {\n        butoaie.push(n);\n    }\n}\nconsole.log(butoaie);\n```',
    {
      topic: 'random',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește `while (butoaie.length < 5)` și verifică `!butoaie.includes(n)`.',
      correctAnswer: 'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst butoaie = [];\nwhile (butoaie.length < 5) {\n    const n = randomInt(1, 30);\n    if (!butoaie.includes(n)) {\n        butoaie.push(n);\n    }\n}\nconsole.log(butoaie);',
      tags: ['unique', 'while'],
    }
  ),
  code(
    'Butoaiele rămase',
    'După ce ai extras 5 butoaie unice, afișează și array-ul cu cele 25 de butoaie rămase (1-30 fără cele extrase).',
    'javascript',
    'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst butoaie = [];\n',
    '```javascript\nfunction randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst butoaie = [];\nwhile (butoaie.length < 5) {\n    const n = randomInt(1, 30);\n    if (!butoaie.includes(n)) butoaie.push(n);\n}\nconsole.log(butoaie);\nconst ramase = [];\nfor (let i = 1; i <= 30; i++) {\n    if (!butoaie.includes(i)) ramase.push(i);\n}\nconsole.log(ramase);\n```',
    {
      topic: 'random',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst butoaie = [];\nwhile (butoaie.length < 5) {\n    const n = randomInt(1, 30);\n    if (!butoaie.includes(n)) butoaie.push(n);\n}\nconsole.log(butoaie);\nconst ramase = [];\nfor (let i = 1; i <= 30; i++) {\n    if (!butoaie.includes(i)) ramase.push(i);\n}\nconsole.log(ramase);',
      tags: ['!includes'],
    }
  ),
  code(
    'Frunze: Ana vs Ion',
    'Ana și Ion strâng frunze. La fiecare „zi” introduci câte au strâns. Programul se oprește când AMBII introduc 0. Afișează totalurile și câștigătorul.',
    'javascript',
    'let frunzeIon = 0, frunzeAna = 0;\n',
    '```javascript\nlet frunzeIon = 0, frunzeAna = 0;\nlet zi = 1;\nwhile (true) {\n    console.log("Ziua", zi);\n    const ion = Number(prompt("Ion: "));\n    const ana = Number(prompt("Ana: "));\n    if (ion === 0 && ana === 0) break;\n    frunzeIon += ion;\n    frunzeAna += ana;\n    zi++;\n}\nconsole.log("Ion:", frunzeIon, "Ana:", frunzeAna);\nif (frunzeIon > frunzeAna) console.log("Câștigător: Ion");\nelse if (frunzeAna > frunzeIon) console.log("Câștigător: Ana");\nelse console.log("Egalitate");\n```',
    {
      topic: 'random',
      difficulty: 'MEDIUM',
      points: 30,
      correctAnswer: 'let frunzeIon = 0, frunzeAna = 0;\nlet zi = 1;\nwhile (true) {\n    console.log("Ziua", zi);\n    const ion = Number(prompt("Ion: "));\n    const ana = Number(prompt("Ana: "));\n    if (ion === 0 && ana === 0) break;\n    frunzeIon += ion;\n    frunzeAna += ana;\n    zi++;\n}\nconsole.log("Ion:", frunzeIon, "Ana:", frunzeAna);\nif (frunzeIon > frunzeAna) console.log("Câștigător: Ion");\nelse if (frunzeAna > frunzeIon) console.log("Câștigător: Ana");\nelse console.log("Egalitate");',
      tags: ['while', 'acumulare'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Validare text — regex avansat
// (după `string-uri-js`)
// ============================================================

const textValidareJsTheory = `# 🔡 Validare text avansată cu regex

În lecția anterioară am văzut bazele regex. Aici învățăm să **filtrăm** și **transformăm** șiruri.

## 🎯 Filtrare cu \`for...of\` + condiție

\`\`\`javascript
const text = "Am 5 mere";
let rezultat = "";
for (const c of text) {
    if (!/[0-9]/.test(c)) {   // păstrăm tot ce NU e cifră
        rezultat += c;
    }
}
console.log(rezultat);   // "Am  mere"
\`\`\`

## 🔄 Transformare în loc de eliminare

\`\`\`javascript
const text = "De 7 ori";
let rez = "";
for (const c of text) {
    if (/[0-9]/.test(c)) {
        rez += String(Number(c) + 1);
    } else {
        rez += c;
    }
}
console.log(rez);   // "De 8 ori"
\`\`\`

## ✅ Validări tipice

| Validare | Cod |
|---|---|
| Doar litere | \`/^[a-zA-Z]+$/.test(text)\` |
| Doar cifre | \`/^[0-9]+$/.test(text)\` |
| Începe cu literă | \`/^[a-zA-Z]/.test(text)\` |
| Lungime ≥ 3 | \`text.length >= 3\` |
| Fără spațiu la capete | \`text[0] !== " " && text.at(-1) !== " "\` |
`

const textValidareJsProblems = [
  code(
    'Verifică doar litere',
    'Cere un text și afișează `true` dacă e format doar din litere.',
    'javascript',
    'const x = prompt("Text: ");\n',
    '```javascript\nconst x = prompt("Text: ");\nconsole.log(/^[a-zA-Z]+$/.test(x));\n```',
    {
      topic: 'regex',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'const x = prompt("Text: ");\nconsole.log(/^[a-zA-Z]+$/.test(x));',
      tags: ['regex'],
    }
  ),
  code(
    'Șterge cifrele',
    'Cere o frază și afișează aceeași frază **fără cifre**.',
    'javascript',
    'const x = prompt("Frază: ");\n',
    '```javascript\nconst x = prompt("Frază: ");\nlet rez = "";\nfor (const c of x) {\n    if (!/[0-9]/.test(c)) rez += c;\n}\nconsole.log(rez);\n```\n\n💡 Variantă scurtă: `x.replace(/[0-9]/g, "")`.',
    {
      topic: 'regex',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'const x = prompt("Frază: ");\nconsole.log(x.replace(/[0-9]/g, ""));',
      tags: ['regex', 'replace'],
    }
  ),
  code(
    'Mărește cifrele cu 1',
    'Cere o frază. Înlocuiește **fiecare cifră** cu cifra + 1.\n\nExemplu: `"De 7 ori"` → `"De 8 ori"`',
    'javascript',
    'const x = prompt("Frază: ");\n',
    '```javascript\nconst x = prompt("Frază: ");\nlet rez = "";\nfor (const c of x) {\n    if (/[0-9]/.test(c)) {\n        rez += String(Number(c) + 1);\n    } else {\n        rez += c;\n    }\n}\nconsole.log(rez);\n```',
    {
      topic: 'regex',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Convertește cu `Number(c)`, adună 1, transformă înapoi cu `String(...)`.',
      correctAnswer: 'const x = prompt("Frază: ");\nlet rez = "";\nfor (const c of x) {\n    if (/[0-9]/.test(c)) {\n        rez += String(Number(c) + 1);\n    } else {\n        rez += c;\n    }\n}\nconsole.log(rez);',
      tags: ['regex', 'transformare'],
    }
  ),
  code(
    'Username valid',
    'Valid dacă: lungime ≥ 3, începe cu literă, NU începe sau se termină cu spațiu.',
    'javascript',
    'const u = prompt("Username: ");\n',
    '```javascript\nconst u = prompt("Username: ");\nif (u.length >= 3 && /^[a-zA-Z]/.test(u) && u[0] !== " " && u[u.length - 1] !== " ") {\n    console.log(true);\n} else {\n    console.log(false);\n}\n```',
    {
      topic: 'regex',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const u = prompt("Username: ");\nif (u.length >= 3 && /^[a-zA-Z]/.test(u) && u[0] !== " " && u[u.length - 1] !== " ") {\n    console.log(true);\n} else {\n    console.log(false);\n}',
      tags: ['&&', 'regex', 'length'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Pizzeria — exersare if/else if
// ============================================================

const pizzeriaJsTheory = `# 🍕 Exersare: Sistemul pizzeriei

Pune cap la cap tot ce ai învățat: \`if\`/\`else if\`, \`while\`, array-uri, \`includes\`. Vei construi un mic „terminal de comenzi” pentru o pizzerie.

## 📋 Codurile produselor

| Cod | Produs |
|---|---|
| A | Pizza 4 anotimpuri |
| B | Pizza Pepperoni |
| C | Pizza cu legume și ciuperci |
| D | Pizza Cheeseburger |
| E | Cola |
| F | Morse |
| G | Cacao |
| H | Cartofi |

## 💡 Strategie

- Citește un cod (sau un șir de coduri).
- Pentru fiecare cod, folosește \`if/else if\` ca să afișezi numele produsului.
- Pentru cod necunoscut: \`else\` cu mesaj de eroare.
- Pentru produse fără duplicate: ține un array auxiliar și folosește \`.includes()\`.
`

const pizzeriaJsProblems = [
  code(
    'Comandă 1 produs',
    'Cere un cod (literă A-H). Afișează numele. Pentru cod necunoscut: „Nu este în meniu”.',
    'javascript',
    'const cod = prompt("Codul produsului: ");\n',
    '```javascript\nconst cod = prompt("Codul produsului: ");\nif (cod === "A") console.log("Pizza 4 anotimpuri");\nelse if (cod === "B") console.log("Pizza Pepperoni");\nelse if (cod === "C") console.log("Pizza cu legume și ciuperci");\nelse if (cod === "D") console.log("Pizza Cheeseburger");\nelse if (cod === "E") console.log("Cola");\nelse if (cod === "F") console.log("Morse");\nelse if (cod === "G") console.log("Cacao");\nelse if (cod === "H") console.log("Cartofi");\nelse console.log("Nu este în meniu");\n```',
    {
      topic: 'pizzerie',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'const cod = prompt("Codul produsului: ");\nif (cod === "A") console.log("Pizza 4 anotimpuri");\nelse if (cod === "B") console.log("Pizza Pepperoni");\nelse if (cod === "C") console.log("Pizza cu legume și ciuperci");\nelse if (cod === "D") console.log("Pizza Cheeseburger");\nelse if (cod === "E") console.log("Cola");\nelse if (cod === "F") console.log("Morse");\nelse if (cod === "G") console.log("Cacao");\nelse if (cod === "H") console.log("Cartofi");\nelse console.log("Nu este în meniu");',
      tags: ['else-if'],
    }
  ),
  code(
    'Comandă mai multe produse',
    'Cere o comandă (șir de litere, ex: `"BEGF"`). Afișează numărul de produse, apoi pentru fiecare literă afișează `Produs <i>: <nume>`.',
    'javascript',
    'const comanda = prompt("Introdu comanda: ");\n',
    '```javascript\nconst comanda = prompt("Introdu comanda: ");\nconst meniu = {\n    A: "Pizza 4 anotimpuri", B: "Pizza Pepperoni", C: "Pizza cu legume și ciuperci",\n    D: "Pizza Cheeseburger", E: "Cola", F: "Morse", G: "Cacao", H: "Cartofi"\n};\nconsole.log("Produse comandate:", comanda.length);\nlet i = 0;\nfor (const cod of comanda) {\n    console.log(`Produs ${i}: ${meniu[cod] || "?"}`);\n    i++;\n}\n```\n\n💡 Folosim un obiect ca dicționar de produse → mult mai compact!',
    {
      topic: 'pizzerie',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește un obiect `meniu = { A: "...", B: "..." }` pentru a evita lanțul de else-if.',
      correctAnswer: 'const comanda = prompt("Introdu comanda: ");\nconst meniu = { A: "Pizza 4 anotimpuri", B: "Pizza Pepperoni", C: "Pizza cu legume și ciuperci", D: "Pizza Cheeseburger", E: "Cola", F: "Morse", G: "Cacao", H: "Cartofi" };\nconsole.log("Produse comandate:", comanda.length);\nlet i = 0;\nfor (const cod of comanda) {\n    console.log(`Produs ${i}: ${meniu[cod] || "?"}`);\n    i++;\n}',
      tags: ['for-of', 'obiecte'],
    }
  ),
  code(
    'Comandă fără duplicate',
    'Cere o comandă, dar ignoră produsele care apar de mai multe ori (păstrează doar prima apariție).\n\nExemplu: `"BEBEE"` → afișează doar `B` și `E`.',
    'javascript',
    'const comanda = prompt("Introdu comanda: ");\n',
    '```javascript\nconst comanda = prompt("Introdu comanda: ");\nconst unice = [];\nfor (const cod of comanda) {\n    if (!unice.includes(cod)) unice.push(cod);\n}\nconsole.log("Produse comandate:", unice.length);\nfor (let i = 0; i < unice.length; i++) {\n    console.log(`Produs ${i}: ${unice[i]}`);\n}\n```',
    {
      topic: 'pizzerie',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'const comanda = prompt("Introdu comanda: ");\nconst unice = [];\nfor (const cod of comanda) {\n    if (!unice.includes(cod)) unice.push(cod);\n}\nconsole.log("Produse comandate:", unice.length);\nfor (let i = 0; i < unice.length; i++) {\n    console.log(`Produs ${i}: ${unice[i]}`);\n}',
      tags: ['!includes', 'push'],
    }
  ),
]

// ============================================================
// EXPORT
// ============================================================

export const javascriptMetodicaExtraPatch = {
  appendTheory: {
    'input-interactiune': inputInteractiuneTheoryAppend,
    'if-else-js': ifElseJsTheoryAppend,
    'operatori-js': operatoriJsTheoryAppend,
    'string-uri-js': stringUriJsTheoryAppend,
    'obiecte-js': obiecteJsTheoryAppend,
  },
  appendProblems: {
    'input-interactiune': inputInteractiuneProblems,
    'if-else-js': ifElseJsProblems,
    'operatori-js': operatoriJsProblems,
    'probleme-conditii-js': problemeConditiiJsProblems,
    'string-uri-js': stringUriJsProblems,
    'arrays-introducere': arraysIntroducereProblems,
    'arrays-operatii': arraysOperatiiProblems,
    'for-vs-while-js': forVsWhileJsProblems,
    'obiecte-js': obiecteJsProblems,
  },
  newLessons: [
    {
      afterSlug: 'arrays-operatii',
      slug: 'arrays-random',
      title: '11b. Array-uri + Math.random',
      isFree: false,
      theory: arraysRandomTheory,
      problems: arraysRandomProblems,
    },
    {
      afterSlug: 'string-uri-js',
      slug: 'text-validare-js',
      title: '15b. Validare text — regex avansat',
      isFree: false,
      theory: textValidareJsTheory,
      problems: textValidareJsProblems,
    },
    {
      afterSlug: 'text-validare-js',
      slug: 'pizzeria-exersare-js',
      title: '15c. Exersare — Sistemul pizzeriei',
      isFree: false,
      theory: pizzeriaJsTheory,
      problems: pizzeriaJsProblems,
    },
  ],
}
