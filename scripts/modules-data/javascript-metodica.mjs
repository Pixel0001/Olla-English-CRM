// Patch pentru modulul JavaScript — completări din metodicile profesorului
// Aplicat de index.mjs peste javascriptModule (din javascript.mjs).

import { mc, sa, io, code } from './helpers.mjs'

// ============================================================
// METODICA 7 — While loop (augment lecția existentă `while-js`)
// ============================================================

const whileLoopTheoryAppend = `

## ✏️ Acolade vs. Indentare în JavaScript

Spre deosebire de Python, JavaScript folosește **acolade** \`{ ... }\` pentru a delimita blocurile de cod. Indentarea e doar pentru lizibilitate (recomandat **2 sau 4 spații**), nu obligatorie pentru sintaxă.

\`\`\`javascript
while (i <= 5) {
    console.log(i);   // ← în corpul buclei
    i = i + 1;        // ← în corpul buclei
}
console.log("Gata"); // ← afară din buclă
\`\`\`

🔹 **Regula:** tot ce e între \`{\` și \`}\` aparține buclei.
🔹 **Atenție** la \`;\` la sfârșitul instrucțiunilor.
🔹 Codul \`while (i <= 5) console.log(i);\` rulează doar **prima linie** ca corp — fără acolade, doar 1 instrucțiune intră în buclă.

## ➕ Incrementare

**Incrementare** = a mări o variabilă cu o valoare. JavaScript are operatori dedicați:

\`\`\`javascript
let i = 0;
i = i + 1;   // clasic (i devine 1)
i += 1;      // scurt (i devine 2)
i++;         // ⚡ și mai scurt — post-increment (i devine 3)
i += 5;      // adună 5 (i devine 8)
\`\`\`

## ➖ Decrementare

**Decrementare** = a micșora o variabilă cu o valoare.

\`\`\`javascript
let i = 10;
i = i - 1;   // i devine 9
i -= 1;      // scurt (i devine 8)
i--;         // ⚡ post-decrement (i devine 7)
\`\`\`

## 🔁 Operatori de atribuire combinată

| Operator | Ce face | Exemplu |
|---|---|---|
| \`+=\` | adună | \`a += 5\` ⇔ \`a = a + 5\` |
| \`-=\` | scade | \`a -= 5\` ⇔ \`a = a - 5\` |
| \`*=\` | înmulțește | \`a *= 2\` ⇔ \`a = a * 2\` |
| \`/=\` | împarte | \`a /= 2\` ⇔ \`a = a / 2\` |
| \`%=\` | modulo | \`a %= 2\` |
| \`**=\` | ridicare la putere | \`a **= 2\` ⇔ \`a = a ** 2\` |

## 📜 Trace pas cu pas — \`while (i <= 5)\`

| Iterație | Verifică \`i <= 5\` | console.log(i) | După \`i++\` |
|---|---|---|---|
| 1 | \`1 <= 5\` ✅ | 1 | i = 2 |
| 2 | \`2 <= 5\` ✅ | 2 | i = 3 |
| 3 | \`3 <= 5\` ✅ | 3 | i = 4 |
| 4 | \`4 <= 5\` ✅ | 4 | i = 5 |
| 5 | \`5 <= 5\` ✅ | 5 | i = 6 |
| 6 | \`6 <= 5\` ❌ | — | STOP |
`

const whileLoopProblems = [
  code(
    'Numărare până la N',
    'Citește un număr **N** (cu `prompt`) și afișează toate numerele de la 1 până la N (fiecare pe o linie).\n\n**Exemplu:**\n```\nN: 5\n1\n2\n3\n4\n5\n```',
    'javascript',
    'const N = Number(prompt("N: "));\n// scrie bucla while aici\n',
    '```javascript\nconst N = Number(prompt("N: "));\nlet x = 1;\nwhile (x <= N) {\n    console.log(x);\n    x++;\n}\n```\n\n`Number()` convertește string-ul de la `prompt()` în număr. Fără conversie, `<=` ar face comparație lexicografică.',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `let x = 1`, `while (x <= N) { ... x++; }`.',
      correctAnswer: 'const N = Number(prompt("N: "));\nlet x = 1;\nwhile (x <= N) {\n    console.log(x);\n    x++;\n}',
      tags: ['while', 'incrementare'],
    }
  ),
  code(
    'Numărare descrescătoare de la N la 1',
    'Citește un număr **N** și afișează toate numerele de la N până la 1 (descrescător).\n\n**Exemplu:**\n```\nN: 5\n5\n4\n3\n2\n1\n```',
    'javascript',
    'let N = Number(prompt("N: "));\n// folosește decrementarea\n',
    '```javascript\nlet N = Number(prompt("N: "));\nwhile (N >= 1) {\n    console.log(N);\n    N--;\n}\n```\n\n`N--` e echivalent cu `N -= 1`. Atenție: aici am folosit `let` (nu `const`) pentru că variabila se modifică.',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `N--` și condiția `N >= 1`.',
      correctAnswer: 'let N = Number(prompt("N: "));\nwhile (N >= 1) {\n    console.log(N);\n    N--;\n}',
      tags: ['while', 'decrementare'],
    }
  ),
  code(
    'Suma numerelor pozitive (oprește la negativ)',
    'Cere utilizatorului să introducă numere. Când introduce un număr **negativ**, programul afișează suma celor pozitive introduse.\n\n**Exemplu:**\n```\nNr: 4\nNr: 7\nNr: 2\nNr: -1\nSuma: 13\n```',
    'javascript',
    'let suma = 0;\n// citește numere până la unul negativ\n',
    '```javascript\nlet suma = 0;\nlet numar = Number(prompt("Nr: "));\nwhile (numar >= 0) {\n    suma += numar;\n    numar = Number(prompt("Nr: "));\n}\nconsole.log("Suma:", suma);\n```\n\nObservă: citim un număr **înainte** de buclă, apoi în buclă citim următorul.',
    {
      topic: 'while',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Citește primul număr înainte de while; în buclă: adună apoi recitește.',
      correctAnswer: 'let suma = 0;\nlet numar = Number(prompt("Nr: "));\nwhile (numar >= 0) {\n    suma += numar;\n    numar = Number(prompt("Nr: "));\n}\nconsole.log("Suma:", suma);',
      tags: ['while', 'suma'],
    }
  ),
  code(
    'Numere pare până la N',
    'Citește un număr **N** și afișează doar numerele **pare** de la 1 la N.\n\n**Exemplu:**\n```\nN: 10\n2\n4\n6\n8\n10\n```',
    'javascript',
    'const N = Number(prompt("N: "));\nlet x = 1;\n// pare = divizibile cu 2\n',
    '```javascript\nconst N = Number(prompt("N: "));\nlet x = 1;\nwhile (x <= N) {\n    if (x % 2 === 0) {\n        console.log(x);\n    }\n    x++;\n}\n```\n\nÎn JavaScript folosim `===` (strict equality) — preferat lui `==` care face conversii implicite.',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: '`if (x % 2 === 0) console.log(x);` în interiorul buclei.',
      correctAnswer: 'const N = Number(prompt("N: "));\nlet x = 1;\nwhile (x <= N) {\n    if (x % 2 === 0) {\n        console.log(x);\n    }\n    x++;\n}',
      tags: ['while', 'modulo'],
    }
  ),
  code(
    'Validare număr în interval [1, 15]',
    'Cere utilizatorului să introducă numere. Pentru fiecare:\n- dacă e între **1** și **15** → „Numărul este bun.”\n- altfel → „Intrare nevalidă.”\n\nProgramul se oprește la **0** și afișează „Programul s-a finisat!”.\n\n**Exemplu:**\n```\nNr: 100500\nIntrare nevalidă.\nNr: 13\nNumărul este bun.\nNr: 0\nProgramul s-a finisat!\n```',
    'javascript',
    'let numar = Number(prompt("Nr: "));\nwhile (numar !== 0) {\n    // ...\n}\n',
    '```javascript\nlet numar = Number(prompt("Nr: "));\nwhile (numar !== 0) {\n    if (numar >= 1 && numar <= 15) {\n        console.log("Numărul este bun.");\n    } else {\n        console.log("Intrare nevalidă.");\n    }\n    numar = Number(prompt("Nr: "));\n}\nconsole.log("Programul s-a finisat!");\n```\n\n⚠️ JavaScript **nu** are comparație în lanț — trebuie scris explicit: `numar >= 1 && numar <= 15` (cu `&&`, nu `and`).',
    {
      topic: 'while',
      difficulty: 'MEDIUM',
      points: 25,
      hint: '`numar >= 1 && numar <= 15` — folosește `&&` (NU `and`).',
      correctAnswer: 'let numar = Number(prompt("Nr: "));\nwhile (numar !== 0) {\n    if (numar >= 1 && numar <= 15) {\n        console.log("Numărul este bun.");\n    } else {\n        console.log("Intrare nevalidă.");\n    }\n    numar = Number(prompt("Nr: "));\n}\nconsole.log("Programul s-a finisat!");',
      tags: ['while', '&&', 'interval'],
    }
  ),
]

// ============================================================
// METODICA 7 — While loop part 2 (lecție nouă)
// ============================================================

const whileLoopPart2Theory = `# Bucla while — exersare avansată

În prima parte ai învățat:
- ce e o iterație
- incrementare/decrementare
- \`break\` și \`continue\`

Acum aplicăm \`while\` la **probleme reale** — joc, verificare numere prime, par/impar, sume.

## 💡 Pattern frecvent: contor + condiție compusă

\`\`\`javascript
let i = 1;
let divizori = 0;
while (i <= numar) {
    if (numar % i === 0) {
        divizori++;
    }
    i++;
}
\`\`\`

## 💡 Pattern frecvent: stop pe semnal

\`\`\`javascript
let x = prompt();
while (x !== "stop") {
    // procesează x
    x = prompt();
}
\`\`\`

Sfat: în problemele complexe, **scrie întâi pe foaie** trace-ul pentru câteva iterații.
`

const whileLoopPart2Problems = [
  code(
    'Piatră – Hârtie – Foarfecă',
    'Implementează jocul **piatră-hârtie-foarfecă** pentru 2 jucători. Programul rulează în buclă până când unul scrie „stop”. La final → „game over”.\n\n**Exemplu:**\n```\nJucător 1: piatra\nJucător 2: foarfeca\nprimul a castigat\nJucător 1: stop\ngame over\n```',
    'javascript',
    'let x = prompt("Jucător 1: ");\nlet y = prompt("Jucător 2: ");\n// while ...\n',
    '```javascript\nlet x = prompt("Jucător 1: ");\nlet y = prompt("Jucător 2: ");\nwhile (x !== "stop" && y !== "stop") {\n    if (x === y) {\n        console.log("egalitate");\n    } else if (\n        (x === "piatra" && y === "foarfeca") ||\n        (x === "foarfeca" && y === "hartie") ||\n        (x === "hartie" && y === "piatra")\n    ) {\n        console.log("primul a castigat");\n    } else {\n        console.log("al doilea a castigat");\n    }\n    x = prompt("Jucător 1: ");\n    y = prompt("Jucător 2: ");\n}\nconsole.log("game over");\n```\n\nAtenție la **paranteze** în jurul fiecărei perechi `&&` în condiția cu `||`.',
    {
      topic: 'while',
      difficulty: 'HARD',
      points: 30,
      hint: 'Listează cele 3 cazuri de câștig al primului, separate prin `||`.',
      correctAnswer: 'let x = prompt("Jucător 1: ");\nlet y = prompt("Jucător 2: ");\nwhile (x !== "stop" && y !== "stop") {\n    if (x === y) {\n        console.log("egalitate");\n    } else if ((x === "piatra" && y === "foarfeca") || (x === "foarfeca" && y === "hartie") || (x === "hartie" && y === "piatra")) {\n        console.log("primul a castigat");\n    } else {\n        console.log("al doilea a castigat");\n    }\n    x = prompt("Jucător 1: ");\n    y = prompt("Jucător 2: ");\n}\nconsole.log("game over");',
      tags: ['while', '&&', '||'],
    }
  ),
  code(
    'Verifică dacă un număr este prim',
    'Citește un număr și afișează:\n- „Numărul este prim!” dacă are exact 2 divizori\n- „Numărul nu este prim!” altfel',
    'javascript',
    'const numar = Number(prompt("Nr: "));\nlet i = 1;\nlet divizori = 0;\n',
    '```javascript\nconst numar = Number(prompt("Nr: "));\nlet i = 1;\nlet divizori = 0;\nwhile (i <= numar) {\n    if (numar % i === 0) divizori++;\n    i++;\n}\nif (divizori === 2) {\n    console.log("Numărul este prim!");\n} else {\n    console.log("Numărul nu este prim!");\n}\n```\n\nUn număr **prim** are exact 2 divizori (1 și el însuși).',
    {
      topic: 'while',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Numără divizorii cu `numar % i === 0` și verifică dacă sunt exact 2.',
      correctAnswer: 'const numar = Number(prompt("Nr: "));\nlet i = 1;\nlet divizori = 0;\nwhile (i <= numar) {\n    if (numar % i === 0) divizori++;\n    i++;\n}\nif (divizori === 2) {\n    console.log("Numărul este prim!");\n} else {\n    console.log("Numărul nu este prim!");\n}',
      tags: ['while', 'prim'],
    }
  ),
  code(
    'Par / Impar până la 0',
    'Citește numere până la 0. Pentru fiecare → „X este par!” / „X este impar!”. La 0 → „Programul s-a finisat!”.',
    'javascript',
    'let numar = Number(prompt("Nr: "));\nwhile (numar !== 0) {\n    // ...\n}\n',
    '```javascript\nlet numar = Number(prompt("Nr: "));\nwhile (numar !== 0) {\n    if (numar % 2 === 0) {\n        console.log(numar, "este par!");\n    } else {\n        console.log(numar, "este impar!");\n    }\n    numar = Number(prompt("Nr: "));\n}\nconsole.log("Programul s-a finisat!");\n```',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Verifică `numar % 2 === 0` în buclă, recitește la final.',
      correctAnswer: 'let numar = Number(prompt("Nr: "));\nwhile (numar !== 0) {\n    if (numar % 2 === 0) {\n        console.log(numar, "este par!");\n    } else {\n        console.log(numar, "este impar!");\n    }\n    numar = Number(prompt("Nr: "));\n}\nconsole.log("Programul s-a finisat!");',
      tags: ['while', 'par', 'impar'],
    }
  ),
  code(
    'Suma de la 0 la 100',
    'Calculează suma numerelor de la 0 la 100 cu `while`.\n\n**Output:**\n```\nSuma de la 0 la 100 este: 5050\n```',
    'javascript',
    'let suma = 0;\nlet i = 0;\n',
    '```javascript\nlet suma = 0;\nlet i = 0;\nwhile (i <= 100) {\n    suma += i;\n    i++;\n}\nconsole.log("Suma de la 0 la 100 este:", suma);\n```\n\nVerificare: `n*(n+1)/2 = 100*101/2 = 5050`.',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Acumulator: `suma += i; i++;` în buclă.',
      correctAnswer: 'let suma = 0;\nlet i = 0;\nwhile (i <= 100) {\n    suma += i;\n    i++;\n}\nconsole.log("Suma de la 0 la 100 este:", suma);',
      tags: ['while', 'suma'],
    }
  ),
]

// ============================================================
// METODICA 8 — While True + break/continue (lecție nouă)
// ============================================================

const whileTrueTheory = `# Bucla \`while (true)\` — bucle infinite cu \`break\`

## 🔁 Ce este o buclă infinită?

O buclă este **infinită** atunci când condiția ei e **mereu adevărată**:

\`\`\`javascript
while (0 < 5) {       // mereu true → niciodată nu se oprește
    console.log("la nesfârșit");
}
\`\`\`

În loc să scriem o condiție artificială, putem scrie direct \`true\`:

\`\`\`javascript
while (true) {
    // cod care se repetă... pentru totdeauna
}
\`\`\`

## 🛑 Cum oprim o buclă \`while (true)\`?

| Instrucțiune | Ce face |
|---|---|
| \`break\` | iese imediat din buclă |
| \`continue\` | sare restul iterației și începe alta |

\`\`\`javascript
while (true) {
    const n = Number(prompt("Număr (0 = stop): "));
    if (n === 0) break;          // gata, ieșim
    if (n < 0) continue;         // negativele le ignorăm
    console.log(n * 2);
}
\`\`\`

## 🎯 Pattern „validare input"

\`\`\`javascript
let parola;
while (true) {
    parola = prompt("Parola: ");
    if (parola.length >= 8) break;
    console.log("Prea scurtă, mai încearcă!");
}
console.log("Parolă acceptată!");
\`\`\`

⚠️ **Niciodată** nu scrie \`while (true)\` fără un \`break\` — programul tău nu se va opri.
`

const whileTrueProblems = [
  code(
    'Setare parolă cu confirmare',
    'Cere o parolă și o reintroducere. Dacă coincid → „Parolă setată!”. Dacă nu → „Parolele nu sunt egale. Încercați din nou.”. Parolă goală nu este permisă.',
    'javascript',
    'while (true) {\n    const parola1 = prompt("Parola: ");\n    // ...\n}\n',
    '```javascript\nwhile (true) {\n    const parola1 = prompt("Parola: ");\n    if (parola1 === "") {\n        console.log("Parola nu poate fi goală.");\n        continue;\n    }\n    const parola2 = prompt("Reintrodu parola: ");\n    if (parola1 === parola2) {\n        console.log("Parolă setată!");\n        break;\n    } else {\n        console.log("Parolele nu sunt egale. Încercați din nou.");\n    }\n}\n```',
    {
      topic: 'while-true',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Buclă `while (true)`. Dacă goală → `continue`. Dacă coincid → `break`.',
      correctAnswer: 'while (true) {\n    const parola1 = prompt("Parola: ");\n    if (parola1 === "") {\n        console.log("Parola nu poate fi goală.");\n        continue;\n    }\n    const parola2 = prompt("Reintrodu parola: ");\n    if (parola1 === parola2) {\n        console.log("Parolă setată!");\n        break;\n    } else {\n        console.log("Parolele nu sunt egale. Încercați din nou.");\n    }\n}',
      tags: ['while-true', 'break', 'continue'],
    }
  ),
  code(
    'Parolă cu lungime minimă (8 caractere)',
    'Modifică programul: parola trebuie să aibă cel puțin **8 caractere**, altfel „Parola este prea scurtă. Reintroduceți!” și se cere din nou.',
    'javascript',
    'while (true) {\n    const parola1 = prompt("Parola: ");\n    // ...\n}\n',
    '```javascript\nwhile (true) {\n    const parola1 = prompt("Parola: ");\n    if (parola1 === "") {\n        console.log("Parola nu poate fi goală.");\n        continue;\n    }\n    if (parola1.length < 8) {\n        console.log("Parola este prea scurtă. Reintroduceți!");\n        continue;\n    }\n    const parola2 = prompt("Reintrodu parola: ");\n    if (parola1 === parola2) {\n        console.log("Parolă setată!");\n        break;\n    } else {\n        console.log("Parolele nu sunt egale. Încercați din nou.");\n    }\n}\n```\n\nFolosim `.length` (nu `len()` ca în Python).',
    {
      topic: 'while-true',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Adaugă `if (parola1.length < 8) { ...; continue; }` între goală și reintroducere.',
      correctAnswer: 'while (true) {\n    const parola1 = prompt("Parola: ");\n    if (parola1 === "") {\n        console.log("Parola nu poate fi goală.");\n        continue;\n    }\n    if (parola1.length < 8) {\n        console.log("Parola este prea scurtă. Reintroduceți!");\n        continue;\n    }\n    const parola2 = prompt("Reintrodu parola: ");\n    if (parola1 === parola2) {\n        console.log("Parolă setată!");\n        break;\n    } else {\n        console.log("Parolele nu sunt egale. Încercați din nou.");\n    }\n}',
      tags: ['while-true', 'length', 'validare'],
    }
  ),
  code(
    'Sandwich din 3 ingrediente',
    'Cere 3 ingrediente și afișează la final lista lor.\n\n**Exemplu:**\n```\nIngredient 1: Pâine\nIngredient 2: Piept de pui\nIngredient 3: Brânză\nAți creat un sandwich din: Pâine Piept de pui Brânză\n```',
    'javascript',
    '// 3 prompt-uri\n',
    '```javascript\nconst ing1 = prompt("Ingredient 1: ");\nconst ing2 = prompt("Ingredient 2: ");\nconst ing3 = prompt("Ingredient 3: ");\nconsole.log("Ați creat un sandwich din:", ing1, ing2, ing3);\n```',
    {
      topic: 'while-true',
      difficulty: 'EASY',
      points: 15,
      hint: '3 × prompt() + un console.log cu virgule între argumente.',
      correctAnswer: 'const ing1 = prompt("Ingredient 1: ");\nconst ing2 = prompt("Ingredient 2: ");\nconst ing3 = prompt("Ingredient 3: ");\nconsole.log("Ați creat un sandwich din:", ing1, ing2, ing3);',
      tags: ['prompt', 'console.log'],
    }
  ),
  code(
    'Sandwich 3 ingrediente cu preț',
    'Calculează prețul sandwich-ului din 3 ingrediente:\n\n| Ingredient | Preț |\n|---|---|\n| Pâine | 20 |\n| Piept de pui | 80 |\n| Brânză | 35 |\n| Sos | 15 |\n\nDacă scrie altceva → „Ingredient invalid: X”.',
    'javascript',
    'const ing1 = prompt("Ingredient 1: ");\nconst ing2 = prompt("Ingredient 2: ");\nconst ing3 = prompt("Ingredient 3: ");\nlet pret = 0;\n',
    '```javascript\nconst ing1 = prompt("Ingredient 1: ");\nconst ing2 = prompt("Ingredient 2: ");\nconst ing3 = prompt("Ingredient 3: ");\nlet pret = 0;\nfor (const ing of [ing1, ing2, ing3]) {\n    if (ing === "Pâine") pret += 20;\n    else if (ing === "Piept de pui") pret += 80;\n    else if (ing === "Brânză") pret += 35;\n    else if (ing === "Sos") pret += 15;\n    else console.log("Ingredient invalid:", ing);\n}\nconsole.log("Ați creat un sandwich din:", ing1, ing2, ing3);\nconsole.log("Prețul:", pret, "lei");\n```',
    {
      topic: 'while-true',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Pune ingredientele într-un array și folosește `for...of` cu `if/else if/else`.',
      correctAnswer: 'const ing1 = prompt("Ingredient 1: ");\nconst ing2 = prompt("Ingredient 2: ");\nconst ing3 = prompt("Ingredient 3: ");\nlet pret = 0;\nfor (const ing of [ing1, ing2, ing3]) {\n    if (ing === "Pâine") pret += 20;\n    else if (ing === "Piept de pui") pret += 80;\n    else if (ing === "Brânză") pret += 35;\n    else if (ing === "Sos") pret += 15;\n    else console.log("Ingredient invalid:", ing);\n}\nconsole.log("Ați creat un sandwich din:", ing1, ing2, ing3);\nconsole.log("Prețul:", pret, "lei");',
      tags: ['if-else', 'for-of'],
    }
  ),
  code(
    'Sandwich cu oricâte ingrediente (până la „stop")',
    'Generalizează: utilizatorul poate adăuga oricâte ingrediente, până când scrie **„stop”**. La final afișează lista și prețul total.',
    'javascript',
    'let suma = 0;\nlet produse = "";\nlet n = 1;\nwhile (true) {\n    // ...\n}\n',
    '```javascript\nlet suma = 0;\nlet produse = "";\nlet n = 1;\nwhile (true) {\n    const x = prompt("Ingredient " + n + ": ");\n    if (x === "stop") break;\n    if (x === "Pâine") suma += 20;\n    else if (x === "Piept de pui") suma += 80;\n    else if (x === "Brânză") suma += 35;\n    else if (x === "Sos") suma += 15;\n    produse += x + " ";\n    n++;\n}\nconsole.log("Ați creat un sandwich din:", produse);\nconsole.log("Prețul:", suma, "lei");\n```',
    {
      topic: 'while-true',
      difficulty: 'HARD',
      points: 30,
      hint: '`while (true)` + `if (x === "stop") break;`. Acumulator pentru text și sumă.',
      correctAnswer: 'let suma = 0;\nlet produse = "";\nlet n = 1;\nwhile (true) {\n    const x = prompt("Ingredient " + n + ": ");\n    if (x === "stop") break;\n    if (x === "Pâine") suma += 20;\n    else if (x === "Piept de pui") suma += 80;\n    else if (x === "Brânză") suma += 35;\n    else if (x === "Sos") suma += 15;\n    produse += x + " ";\n    n++;\n}\nconsole.log("Ați creat un sandwich din:", produse);\nconsole.log("Prețul:", suma, "lei");',
      tags: ['while-true', 'break', 'acumulator'],
    }
  ),
]

// ============================================================
// METODICA 9 — While True practică (lecție nouă)
// ============================================================

const whileTruePracticaTheory = `# \`while (true)\` — exersare practică

În această lecție aplicăm **\`while (true)\` + \`break\`** la probleme reale:
- selecția candidaților după criterii
- contoare (câți au îndeplinit condiția)
- agregare în text (lista celor selectați)
- mecanisme de seif și automate de plată

## 🧠 Trace pe foaie

\`\`\`javascript
let x = 1;
while (true) {
    x++;
    if (x === 2) continue;
    else if (x > 3) break;
    x *= 2;
}
console.log(x);
\`\`\`

| Iter. | x după \`x++\` | Verificare | x după \`*=2\` |
|---|---|---|---|
| 1 | 2 | \`x===2\` → continue | — |
| 2 | 3 | nici 2, nici >3 | 6 |
| 3 | 7 | \`7 > 3\` → **break** | — |

Rezultat: **7**

## 🎯 Pattern „colecționar de valori"

\`\`\`javascript
let total = 0, contor = 0, selectati = "";
while (true) {
    const val = Number(prompt());
    if (val === 0) break;
    if (valOk(val)) {
        total += val;
        contor++;
        selectati += val + " ";
    }
}
console.log(total, contor, selectati);
\`\`\`
`

const whileTruePracticaProblems = [
  code(
    'Selecție atletism (un atlet)',
    'Citește înălțimea (cm). Dacă e între 150 și 190 → „Selectat pentru competiție.”, altfel „Nu sunteți eligibil.”',
    'javascript',
    'const inaltime = Number(prompt("Înălțime: "));\n',
    '```javascript\nconst inaltime = Number(prompt("Înălțime: "));\nif (inaltime >= 150 && inaltime <= 190) {\n    console.log("Selectat pentru competiție.");\n} else {\n    console.log("Nu sunteți eligibil.");\n}\n```',
    {
      topic: 'while-practica',
      difficulty: 'EASY',
      points: 15,
      hint: '`inaltime >= 150 && inaltime <= 190`.',
      correctAnswer: 'const inaltime = Number(prompt("Înălțime: "));\nif (inaltime >= 150 && inaltime <= 190) {\n    console.log("Selectat pentru competiție.");\n} else {\n    console.log("Nu sunteți eligibil.");\n}',
      tags: ['if', 'interval'],
    }
  ),
  code(
    'Selecție atletism (mai mulți atleți)',
    'Repetă verificarea pentru mai mulți candidați, până când utilizatorul introduce **0** (atunci „STOP”).',
    'javascript',
    'while (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    // ...\n}\n',
    '```javascript\nwhile (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    if (inaltime === 0) {\n        console.log("STOP");\n        break;\n    } else if (inaltime >= 150 && inaltime <= 190) {\n        console.log("Selectat");\n    } else {\n        console.log("Nu sunteți eligibil");\n    }\n}\n```',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Verifică `=== 0` întâi, apoi intervalul.',
      correctAnswer: 'while (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    if (inaltime === 0) {\n        console.log("STOP");\n        break;\n    } else if (inaltime >= 150 && inaltime <= 190) {\n        console.log("Selectat");\n    } else {\n        console.log("Nu sunteți eligibil");\n    }\n}',
      tags: ['while-true', 'break'],
    }
  ),
  code(
    'Selecție atletism + contor',
    'Adaugă un contor pentru cei selectați. La final → „Total candidați: X”.',
    'javascript',
    'let selectati = 0;\nwhile (true) {\n    // ...\n}\n',
    '```javascript\nlet selectati = 0;\nwhile (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    if (inaltime === 0) {\n        console.log("STOP");\n        break;\n    } else if (inaltime >= 150 && inaltime <= 190) {\n        console.log("Selectat");\n        selectati++;\n    } else {\n        console.log("Nu sunteți eligibil");\n    }\n}\nconsole.log("Total candidați:", selectati);\n```',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Incrementează `selectati` doar la branch-ul de selecție.',
      correctAnswer: 'let selectati = 0;\nwhile (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    if (inaltime === 0) {\n        console.log("STOP");\n        break;\n    } else if (inaltime >= 150 && inaltime <= 190) {\n        console.log("Selectat");\n        selectati++;\n    } else {\n        console.log("Nu sunteți eligibil");\n    }\n}\nconsole.log("Total candidați:", selectati);',
      tags: ['contor', 'while-true'],
    }
  ),
  code(
    'Selecție atletism + listă înălțimi',
    'Pe lângă contor, păstrează și **lista înălțimilor** selectaților, separate prin spațiu.\n\n**La final:**\n```\nTotal candidați: 3\nÎnălțimile selectate: 160 170 180\n```',
    'javascript',
    'let selectati = 0;\nlet inaltimi = "";\nwhile (true) {\n    // ...\n}\n',
    '```javascript\nlet selectati = 0;\nlet inaltimi = "";\nwhile (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    if (inaltime === 0) {\n        console.log("STOP");\n        break;\n    } else if (inaltime >= 150 && inaltime <= 190) {\n        console.log("Selectat");\n        selectati++;\n        inaltimi += inaltime + " ";\n    } else {\n        console.log("Nu sunteți eligibil");\n    }\n}\nconsole.log("Total candidați:", selectati);\nconsole.log("Înălțimile selectate:", inaltimi);\n```\n\nObservă: în JS `inaltime + " "` convertește numărul la string automat (concatenare).',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: '`inaltimi += inaltime + " "` — JS convertește singur la string.',
      correctAnswer: 'let selectati = 0;\nlet inaltimi = "";\nwhile (true) {\n    const inaltime = Number(prompt("Înălțime: "));\n    if (inaltime === 0) {\n        console.log("STOP");\n        break;\n    } else if (inaltime >= 150 && inaltime <= 190) {\n        console.log("Selectat");\n        selectati++;\n        inaltimi += inaltime + " ";\n    } else {\n        console.log("Nu sunteți eligibil");\n    }\n}\nconsole.log("Total candidați:", selectati);\nconsole.log("Înălțimile selectate:", inaltimi);',
      tags: ['while-true', 'concat'],
    }
  ),
  code(
    'Numărarea notelor excelente',
    'Citește note până la 0. Câte sunt excelente (9 sau 10)?',
    'javascript',
    'let excelente = 0;\nwhile (true) {\n    const nota = Number(prompt("Notă: "));\n    // ...\n}\n',
    '```javascript\nlet excelente = 0;\nwhile (true) {\n    const nota = Number(prompt("Notă: "));\n    if (nota === 0) break;\n    if (nota === 9 || nota === 10) excelente++;\n}\nconsole.log("Note excelente:", excelente);\n```\n\nVariantă echivalentă: `if ([9, 10].includes(nota)) excelente++;`',
    {
      topic: 'while-practica',
      difficulty: 'EASY',
      points: 20,
      hint: '`if (nota === 9 || nota === 10) excelente++;`',
      correctAnswer: 'let excelente = 0;\nwhile (true) {\n    const nota = Number(prompt("Notă: "));\n    if (nota === 0) break;\n    if (nota === 9 || nota === 10) excelente++;\n}\nconsole.log("Note excelente:", excelente);',
      tags: ['while-true', '||'],
    }
  ),
  code(
    'Seif electronic — sumă totală',
    'Utilizatorul depune sume succesive. La 0 → afișează totalul.',
    'javascript',
    'let total = 0;\nwhile (true) {\n    const suma = Number(prompt("Sumă: "));\n    // ...\n}\n',
    '```javascript\nlet total = 0;\nwhile (true) {\n    const suma = Number(prompt("Sumă: "));\n    if (suma === 0) {\n        console.log("Total economisit:", total, "lei");\n        break;\n    }\n    total += suma;\n}\n```',
    {
      topic: 'while-practica',
      difficulty: 'EASY',
      points: 15,
      hint: 'Acumulator `total += suma`. La 0 → afișează și break.',
      correctAnswer: 'let total = 0;\nwhile (true) {\n    const suma = Number(prompt("Sumă: "));\n    if (suma === 0) {\n        console.log("Total economisit:", total, "lei");\n        break;\n    }\n    total += suma;\n}',
      tags: ['acumulator', 'while-true'],
    }
  ),
  code(
    'Seif cu bancnote acceptate (100/500/1000)',
    'Acceptă doar 100, 500, 1000 lei. Altceva → „Nominalul nu este acceptat. Reintroduceți.” La 0 → afișează totalul.',
    'javascript',
    'let total = 0;\nwhile (true) {\n    const suma = Number(prompt("Sumă: "));\n    // ...\n}\n',
    '```javascript\nlet total = 0;\nconst valide = [100, 500, 1000];\nwhile (true) {\n    const suma = Number(prompt("Sumă: "));\n    if (suma === 0) {\n        console.log("Total economisit:", total, "lei");\n        break;\n    }\n    if (valide.includes(suma)) {\n        total += suma;\n    } else {\n        console.log("Nominalul nu este acceptat. Reintroduceți.");\n    }\n}\n```\n\n`array.includes(x)` e echivalentul Python-esc `x in array`.',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește `[100, 500, 1000].includes(suma)` pentru validare.',
      correctAnswer: 'let total = 0;\nconst valide = [100, 500, 1000];\nwhile (true) {\n    const suma = Number(prompt("Sumă: "));\n    if (suma === 0) {\n        console.log("Total economisit:", total, "lei");\n        break;\n    }\n    if (valide.includes(suma)) {\n        total += suma;\n    } else {\n        console.log("Nominalul nu este acceptat. Reintroduceți.");\n    }\n}',
      tags: ['includes', 'while-true'],
    }
  ),
  code(
    'Automat de băuturi calde (40 lei)',
    'O băutură costă 40 lei. Utilizatorul introduce monede. La >= 40 → „Băutura este pregătită. Savurați!”. Dacă > 40 → afișează și „Restul dvs. este de X lei”.',
    'javascript',
    'const pret = 40;\nlet suma = 0;\n',
    '```javascript\nconst pret = 40;\nlet suma = 0;\nwhile (suma < pret) {\n    const moneda = Number(prompt("Monedă: "));\n    suma += moneda;\n}\nconsole.log("Băutura este pregătită. Savurați!");\nif (suma > pret) {\n    console.log("Restul dvs. este de", suma - pret, "lei");\n}\n```\n\n💡 Aici condiția `while (suma < pret)` face același lucru ca `while(true) + break`.',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Condiția `while (suma < pret)` — fără break necesar.',
      correctAnswer: 'const pret = 40;\nlet suma = 0;\nwhile (suma < pret) {\n    const moneda = Number(prompt("Monedă: "));\n    suma += moneda;\n}\nconsole.log("Băutura este pregătită. Savurați!");\nif (suma > pret) {\n    console.log("Restul dvs. este de", suma - pret, "lei");\n}',
      tags: ['while', 'acumulator'],
    }
  ),
  code(
    'Automat — număr de monede introduse',
    'Suplimentează automatul cu numărul de monede introduse.',
    'javascript',
    'const pret = 40;\nlet suma = 0;\nlet nr = 0;\n',
    '```javascript\nconst pret = 40;\nlet suma = 0;\nlet nr = 0;\nwhile (suma < pret) {\n    const moneda = Number(prompt("Monedă: "));\n    suma += moneda;\n    nr++;\n}\nconsole.log("Băutura este pregătită. Savurați!");\nif (suma > pret) {\n    console.log("Restul dvs. este de", suma - pret, "lei");\n}\nconsole.log("Numărul de monede introduse:", nr);\n```',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Adaugă `nr++` în interiorul buclei.',
      correctAnswer: 'const pret = 40;\nlet suma = 0;\nlet nr = 0;\nwhile (suma < pret) {\n    const moneda = Number(prompt("Monedă: "));\n    suma += moneda;\n    nr++;\n}\nconsole.log("Băutura este pregătită. Savurați!");\nif (suma > pret) {\n    console.log("Restul dvs. este de", suma - pret, "lei");\n}\nconsole.log("Numărul de monede introduse:", nr);',
      tags: ['contor', 'while'],
    }
  ),
]

// ============================================================
// EXPORT
// ============================================================

export const javascriptMetodicaPatch = {
  appendTheory: {
    'while-js': whileLoopTheoryAppend,
  },
  appendProblems: {
    'while-js': whileLoopProblems,
  },
  newLessons: [
    {
      afterSlug: 'while-js',
      slug: 'while-js-part2',
      title: '7b. While loop — Exersare avansată',
      isFree: false,
      theory: whileLoopPart2Theory,
      problems: whileLoopPart2Problems,
    },
    {
      afterSlug: 'while-js-part2',
      slug: 'while-true-js',
      title: '7c. While (true) + break / continue',
      isFree: false,
      theory: whileTrueTheory,
      problems: whileTrueProblems,
    },
    {
      afterSlug: 'while-true-js',
      slug: 'while-true-practica-js',
      title: '7d. While (true) — Probleme practice',
      isFree: false,
      theory: whileTruePracticaTheory,
      problems: whileTruePracticaProblems,
    },
  ],
}
