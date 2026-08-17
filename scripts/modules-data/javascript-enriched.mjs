// JavaScript enriched — toate cele 20 de lecții
// Stil prietenos pentru elevi 9-10 ani

import { mc, sa } from './helpers.mjs'

export const jsEnriched = {

  // ============ 1. introducere-console-log ============
  'introducere-console-log': {
    theory: `# 🟨 Bun venit în JavaScript!

## Ce este JavaScript?

JavaScript (JS) este **limbajul site-urilor web**. Aproape **fiecare** site pe care îl vizitezi rulează cod JavaScript! 🌐

> 💡 **Atenție**: JavaScript NU are nicio legătură cu Java! E ca "ham" și "hamster" 🐹

## La ce e folosit?

- 🎨 **Animații** pe site-uri
- 🎮 **Jocuri** în browser
- 📱 **Aplicații** (TikTok, Discord folosesc JS)
- 🤖 **Inteligență artificială** în browser

## Prima ta comandă: \`console.log()\`

\`console.log()\` este **microfonul** lui JavaScript — afișează ceva în "Consolă" (locul unde dezvoltatorii văd mesajele).

\`\`\`javascript
console.log("Salut, lume!");
\`\`\`

## 🎯 Reguli cheie

### 1. Ghilimele pentru text
\`\`\`javascript
console.log("Bună");      // ✅
console.log('Bună');      // ✅ și simple merg
console.log(\`Bună\`);      // ✅ "template literal"
console.log(Bună);        // ❌ EROARE — JS crede că e variabilă
\`\`\`

### 2. Punct și virgulă \`;\` la final
\`\`\`javascript
console.log("a");
console.log("b");
\`\`\`
> 💡 Nu e mereu obligatoriu, dar e o practică bună.

### 3. Numerele NU au ghilimele
\`\`\`javascript
console.log(42);          // afișează: 42
console.log("42");        // afișează: 42 (dar e text!)
\`\`\`

## 🎨 Mai multe valori

\`\`\`javascript
console.log("Vârsta:", 12, "ani");
\`\`\`
**Output:** \`Vârsta: 12 ani\`

## ⚠️ Greșeli frecvente

- **\`Console.log("hi")\`** — \`console.log("hi")\` (case-sensitive!)
- **\`console.log(hi)\`** — \`console.log("hi")\`
- **\`console.log("hi)\`** — \`console.log("hi")\`

## 🎓 Ce ai învățat
- ✅ JavaScript e limbajul webului
- ✅ \`console.log()\` afișează în consolă
- ✅ Text are ghilimele, numerele nu
- ✅ JS e case-sensitive
`,
    extraProblems: [
      mc('Cum scriem corect',
        'Care e sintaxa corectă pentru a afișa "Hello"?',
        ['Console.log("Hello")', 'console.log("Hello")', 'print("Hello")', 'log("Hello")'],
        'console.log("Hello")',
        '`console.log` (cu c mic) e sintaxa standard în JavaScript.',
        { topic: 'console' }),
      mc('Java vs JavaScript',
        'Ce relație există între Java și JavaScript?',
        ['Sunt același limbaj', 'JavaScript e o versiune nouă a Java', 'Sunt limbaje complet diferite', 'JavaScript a fost inventat de Java'],
        'Sunt limbaje complet diferite',
        'Doar numele se aseamănă. Sunt total separate, ca "ham" și "hamster".',
        { topic: 'console' }),
      sa('Comanda corectă',
        'Scrie comanda care afișează cuvântul **Salut** în consolă.',
        'console.log("Salut")',
        '`console.log("Salut")` — funcția standard pentru afișare.',
        { topic: 'console' }),
      mc('Tip de ghilimele',
        'Care din variantele de mai jos NU este validă în JS?',
        ['"text"', "'text'", '`text`', '<text>'],
        '<text>',
        'JS acceptă ghilimele duble, simple și backticks (template literals).',
        { topic: 'console' }),
    ],
  },

  // ============ 2. variabile ============
  'variabile': {
    theory: `# 📦 Variabile în JavaScript

O **variabilă** = o cutiuță cu etichetă unde păstrezi o valoare 📦.

## 🎯 Cele 3 cuvinte cheie

- **\`let\`** — Ce înseamnă: "lasă să fie" — poate fi schimbată • Când îl folosești: **Modern, recomandat**
- **\`const\`** — Ce înseamnă: "constantă" — NU poate fi schimbată • Când îl folosești: Pentru valori fixe
- **\`var\`** — Ce înseamnă: Vechi, are reguli ciudate • Când îl folosești: **Evită** în cod nou

\`\`\`javascript
let nume = "Ana";
const PI = 3.14;
nume = "Bogdan";    // ✅ ok
PI = 3;             // ❌ EROARE! const nu se schimbă
\`\`\`

## 🎯 Tipuri de date principale

\`\`\`javascript
let varsta = 11;             // number
let nume = "Ana";            // string
let majora = false;          // boolean (true/false)
let nimic = null;            // null (gol intenționat)
let nedefinit;               // undefined (nu i-am dat valoare)
\`\`\`

## 🔍 Verifică tipul: \`typeof\`

\`\`\`javascript
console.log(typeof 42);       // "number"
console.log(typeof "hi");     // "string"
console.log(typeof true);     // "boolean"
\`\`\`

## 📝 Reguli pentru nume

✅ **Permis**: \`nume\`, \`varsta_mea\`, \`scor1\`, \`primulNume\` (camelCase)
❌ **Interzis**: \`1nume\` (începe cu cifră), \`nume!\` (caractere speciale), \`let\` (cuvânt rezervat)

> 💡 Convenția JS: **camelCase** — \`primulNume\`, \`numarStudenti\`

## 🔄 Operații

\`\`\`javascript
let a = 5;
let b = 3;
console.log(a + b);    // 8
console.log(a - b);    // 2
console.log(a * b);    // 15
console.log(a / b);    // 1.666...
console.log(a % b);    // 2 (rest)
\`\`\`

## ⚠️ Greșeli frecvente

- **\`let 1nume = "x"\`** — \`let nume1 = "x"\`
- **\`const x; x = 5;\`** — \`const x = 5;\` (const cere valoare imediat)
- **\`Let nume = ...\`** — \`let nume = ...\` (case-sensitive)

## 🎓 Ce ai învățat
- ✅ \`let\` (variabile) și \`const\` (constante)
- ✅ Tipurile: number, string, boolean
- ✅ \`typeof\` arată tipul
- ✅ camelCase pentru nume
`,
    extraProblems: [
      mc('let vs const',
        'Care declarație merge dacă vrem să schimbăm valoarea ulterior?',
        ['const', 'let', 'final', 'var (mereu)'],
        'let',
        '`let` permite reasignare; `const` blochează.',
        { topic: 'variables' }),
      mc('Tip implicit',
        'Ce întoarce `typeof "42"`?',
        ['"number"', '"string"', '"text"', '"int"'],
        '"string"',
        'Cu ghilimele = string, fără = number.',
        { topic: 'variables' }),
      sa('Operatorul rest',
        'Ce simbol folosești pentru restul împărțirii (modulo)?',
        '%',
        '`a % b` întoarce restul împărțirii.',
        { topic: 'variables' }),
      mc('Convenția nume',
        'Care e convenția standard JS pentru nume cu mai multe cuvinte?',
        ['snake_case (nume_meu)', 'camelCase (numeMeu)', 'kebab-case (nume-meu)', 'PascalCase (NumeMeu)'],
        'camelCase (numeMeu)',
        'În JS folosim camelCase: prima literă mică, restul cuvintelor încep cu majusculă.',
        { topic: 'variables' }),
    ],
  },

  // ============ 3. input-interactiune ============
  'input-interactiune': {
    theory: `# 💬 Interacțiune cu utilizatorul

În browser putem cere date utilizatorului prin **3 ferestre**:

## 1️⃣ \`alert()\` — afișează un mesaj

\`\`\`javascript
alert("Salut!");
\`\`\`
👉 Apare o fereastră cu butonul "OK".

## 2️⃣ \`prompt()\` — cere text de la user

\`\`\`javascript
let nume = prompt("Cum te cheamă?");
console.log("Salut,", nume);
\`\`\`
👉 Apare o fereastră cu un câmp de scris.

## 3️⃣ \`confirm()\` — întreabă da/nu

\`\`\`javascript
let raspuns = confirm("Ești sigur?");
if (raspuns) {
    console.log("DA");
} else {
    console.log("NU");
}
\`\`\`

## 🔢 Atenție: \`prompt\` întoarce ÎNTOTDEAUNA text!

\`\`\`javascript
let varsta = prompt("Vârsta?");   // dacă scrii 11 → "11" (text!)
console.log(varsta + 1);          // "111" — concatenare! ❌
console.log(Number(varsta) + 1);  // 12 ✅
\`\`\`

## 🔄 Conversii utile

- **\`Number(x)\`** — text → număr
- **\`String(x)\`** — număr → text
- **\`parseInt(x)\`** — text → număr întreg
- **\`parseFloat(x)\`** — text → număr cu zecimale

\`\`\`javascript
Number("42")       // 42
Number("3.14")     // 3.14
Number("abc")      // NaN (Not a Number)
parseInt("12.7")   // 12
\`\`\`

## 🎯 Exemplu complet

\`\`\`javascript
let numeUser = prompt("Numele tău?");
let varsta = Number(prompt("Vârsta?"));
alert("Salut, " + numeUser + "! Anul viitor vei avea " + (varsta + 1) + " ani.");
\`\`\`

## ⚠️ Greșeli frecvente

- **\`prompt + 1\` direct** — Convertește cu \`Number()\` mai întâi
- **Uiți să salvezi rezultatul** — \`let x = prompt(...)\`

## 🎓 Ce ai învățat
- ✅ \`alert\`, \`prompt\`, \`confirm\`
- ✅ \`prompt\` întoarce mereu **text**
- ✅ \`Number()\` pentru conversie
`,
    extraProblems: [
      mc('Tipul de la prompt',
        'Ce tip întoarce `prompt("...")`?',
        ['number', 'string', 'boolean', 'depinde ce scrie userul'],
        'string',
        'Întoarce mereu string, chiar dacă userul scrie cifre.',
        { topic: 'input' }),
      mc('Conversie',
        'Cum convertești "42" în număr?',
        ['Number("42")', 'int("42")', 'parse("42")', 'toNumber("42")'],
        'Number("42")',
        '`Number()` sau `parseInt()` convertesc text în număr.',
        { topic: 'input' }),
      sa('Funcția da/nu',
        'Ce funcție afișează o fereastră cu OK / Cancel?',
        'confirm',
        '`confirm()` întoarce `true` (OK) sau `false` (Cancel).',
        { topic: 'input' }),
      mc('Concatenare neplăcută',
        'Ce afișează `"5" + 1`?',
        ['6', '"51"', 'Eroare', 'NaN'],
        '"51"',
        'Cu un string, `+` concatenează (lipește), nu adună!',
        { topic: 'input', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 4. operatori-js ============
  'operatori-js': {
    theory: `# ➕➖ Operatori în JavaScript

Operatorii sunt **simbolurile cu care faci calcule și comparații** ⚡.

## 🧮 Aritmetici

- **\`+\`** — Nume: Adunare • Exemplu: \`5 + 3\` • Rezultat: 8
- **\`-\`** — Nume: Scădere • Exemplu: \`5 - 3\` • Rezultat: 2
- **\`*\`** — Nume: Înmulțire • Exemplu: \`5 * 3\` • Rezultat: 15
- **\`/\`** — Nume: Împărțire • Exemplu: \`10 / 4\` • Rezultat: 2.5
- **\`%\`** — Nume: Rest (modulo) • Exemplu: \`10 % 3\` • Rezultat: 1
- **\`**\`** — Nume: Putere • Exemplu: \`2 ** 3\` • Rezultat: 8

## 📊 Comparare (returnează true/false)

- **\`==\`** — Înseamnă: Egal (cu conversie) • Exemplu: \`5 == "5"\` → true
- **\`===\`** — Înseamnă: **Strict** egal • Exemplu: \`5 === "5"\` → false
- **\`!=\`** — Înseamnă: Diferit • Exemplu: \`5 != 6\` → true
- **\`!==\`** — Înseamnă: Strict diferit • Exemplu: \`5 !== "5"\` → true
- **\`>\`** — Înseamnă: Mai mare • Exemplu: \`5 > 3\` → true
- **\`<\`** — Înseamnă: Mai mic • Exemplu: \`5 < 3\` → false
- **\`>=\`** — Înseamnă: Mai mare sau egal • Exemplu: \`5 >= 5\` → true
- **\`<=\`** — Înseamnă: Mai mic sau egal • Exemplu: \`4 <= 5\` → true

> 💡 **Important**: folosește mereu \`===\` și \`!==\` (strict). Sunt mai sigure.

## 🔗 Logici

- **\`&&\`** — Nume: ȘI (and) • Exemplu: \`true && false\` → false
- **\`\\** — Nume: \\ • Exemplu: \`
- **\`!\`** — Nume: NU (not) • Exemplu: \`!true\` → false

## 🎯 Atribuire scurtă

\`\`\`javascript
let x = 10;
x += 5;    // x = x + 5  → 15
x -= 3;    // x = x - 3  → 12
x *= 2;    // x = x * 2  → 24
x++;       // x = x + 1  → 25
x--;       // x = x - 1  → 24
\`\`\`

## ⚠️ Capcana lui \`+\`

\`\`\`javascript
console.log(5 + 3);       // 8
console.log("5" + 3);     // "53" (concatenare!)
console.log("5" - 3);     // 2 (JS convertește "5" în număr)
\`\`\`

## ⚠️ \`==\` vs \`===\`

\`\`\`javascript
0 == false       // true  ❗ ciudat
0 === false      // false ✅ corect
"5" == 5         // true  ❗
"5" === 5        // false ✅
\`\`\`

## 🎓 Ce ai învățat
- ✅ Operatori aritmetici, de comparare, logici
- ✅ Folosește \`===\` în loc de \`==\`
- ✅ \`+\` cu string = concatenare
`,
    extraProblems: [
      mc('Strict equal',
        'Care e diferența între `==` și `===`?',
        ['Niciuna', '`===` verifică și tipul, `==` doar valoarea (cu conversie)', '`==` e nou, `===` e vechi', '`===` doar pentru numere'],
        '`===` verifică și tipul, `==` doar valoarea (cu conversie)',
        'Folosește mereu `===` pentru a evita conversii surprinzătoare.',
        { topic: 'operators', difficulty: 'MEDIUM' }),
      mc('Modulo',
        'Cât este `17 % 5`?',
        ['3', '2', '3.4', '12'],
        '2',
        '17 împărțit la 5 = 3, rest 2.',
        { topic: 'operators' }),
      sa('Operator AND',
        'Ce simbol JS reprezintă "AND" logic?',
        '&&',
        '`&&` e ȘI logic. `||` e SAU.',
        { topic: 'operators' }),
      mc('Concatenare',
        'Ce afișează `"3" + 4`?',
        ['7', '"34"', 'NaN', 'Eroare'],
        '"34"',
        'Când unul e string, `+` concatenează.',
        { topic: 'operators' }),
    ],
  },

  // ============ 5. if-else-js ============
  'if-else-js': {
    theory: `# 🔀 \`if / else\` — decizii

Programul ia **decizii** în funcție de condiții. Ca un semafor 🚦.

## 🎯 Forma de bază

\`\`\`javascript
let varsta = 11;

if (varsta >= 18) {
    console.log("Major");
} else {
    console.log("Minor");
}
\`\`\`

> 💡 Condiția e între **paranteze rotunde** \`()\`, blocul între **acolade** \`{}\`.

## 🎯 Mai multe ramuri: \`else if\`

\`\`\`javascript
let nota = 8;

if (nota >= 9) {
    console.log("Excelent");
} else if (nota >= 7) {
    console.log("Bine");
} else if (nota >= 5) {
    console.log("Suficient");
} else {
    console.log("Insuficient");
}
\`\`\`

## 🔗 Combinații cu \`&&\`, \`||\`

\`\`\`javascript
let varsta = 12;
let stieSaInoate = true;

if (varsta >= 10 && stieSaInoate) {
    console.log("Poți merge la piscină");
}

if (varsta < 6 || varsta > 80) {
    console.log("Bilet gratuit");
}
\`\`\`

## 🎯 Operator ternar (scurt)

Pentru if/else simple:

\`\`\`javascript
let x = 5;
let mesaj = (x > 0) ? "pozitiv" : "negativ sau zero";
\`\`\`

Echivalent cu:

\`\`\`javascript
let mesaj;
if (x > 0) {
    mesaj = "pozitiv";
} else {
    mesaj = "negativ sau zero";
}
\`\`\`

## 🎯 Valori "truthy" și "falsy"

În JavaScript, aceste valori sunt **falsy** (considerate \`false\` în if):
- \`false\`
- \`0\`
- \`""\` (string gol)
- \`null\`
- \`undefined\`
- \`NaN\`

**Toate celelalte** sunt **truthy** (considerate \`true\`).

\`\`\`javascript
if ("salut") {
    console.log("Da, merge!");   // Se execută
}
if (0) {
    console.log("Nu...");         // NU se execută
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`if x > 5 {\`** — \`if (x > 5) {\` (parantezele!)
- **\`if (x = 5)\` (atribuire)** — \`if (x === 5)\` (comparare)
- **\`else if\` lipit \`elseif\`** — \`else if\` cu spațiu

## 🎓 Ce ai învățat
- ✅ \`if / else / else if\`
- ✅ Combinații cu \`&&\`, \`||\`
- ✅ Operatorul ternar \`? :\`
- ✅ Truthy / falsy
`,
    extraProblems: [
      mc('Sintaxa if',
        'Care e sintaxa CORECTĂ?',
        ['if x > 5 then print(x)', 'if (x > 5) { console.log(x) }', 'if x > 5: console.log(x)', 'if [x > 5] { console.log(x) }'],
        'if (x > 5) { console.log(x) }',
        'Condiția în paranteze rotunde, codul în acolade.',
        { topic: 'conditions' }),
      mc('Falsy',
        'Care din valorile de mai jos NU este "falsy"?',
        ['0', '""', '"false"', 'null'],
        '"false"',
        'String-ul "false" e un text ne-vid → truthy! Doar `false` (boolean) e falsy.',
        { topic: 'conditions', difficulty: 'MEDIUM' }),
      sa('Operator ternar',
        'Ce simbol înlocuiește `if/else` într-o linie? (3 caractere)',
        '? :',
        '`condiție ? valoareDacăTrue : valoareDacăFalse`',
        { topic: 'conditions' }),
      mc('Capcana clasică',
        'Care e GREȘELA în `if (x = 5)`?',
        ['Niciuna', 'E atribuire (=), nu comparare (===)', 'Lipsesc paranteze', 'x trebuie cu majusculă'],
        'E atribuire (=), nu comparare (===)',
        '`=` setează valoarea! Folosește `===` pentru comparare.',
        { topic: 'conditions', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 6. probleme-conditii-js ============
  'probleme-conditii-js': {
    theory: `# 🧩 Probleme cu condiții — exersăm!

Acum că știi \`if / else\`, hai să rezolvăm probleme reale 💪.

## 🎯 Problema 1: Par sau impar?

\`\`\`javascript
let n = 7;
if (n % 2 === 0) {
    console.log("Par");
} else {
    console.log("Impar");
}
\`\`\`

## 🎯 Problema 2: Maximul dintre 3 numere

\`\`\`javascript
let a = 5, b = 12, c = 8;
let max;
if (a >= b && a >= c) {
    max = a;
} else if (b >= c) {
    max = b;
} else {
    max = c;
}
console.log("Max:", max);
\`\`\`

> 💡 Mai scurt: \`Math.max(a, b, c)\`

## 🎯 Problema 3: Notă în literă

\`\`\`javascript
let nota = 8;
let litera;
if (nota === 10) litera = "A+";
else if (nota >= 9) litera = "A";
else if (nota >= 7) litera = "B";
else if (nota >= 5) litera = "C";
else litera = "F";
console.log(litera);
\`\`\`

## 🎯 Problema 4: Categorie după vârstă

- **0-2** — bebeluș
- **3-12** — copil
- **13-19** — adolescent
- **20-64** — adult
- **65+** — senior

\`\`\`javascript
let varsta = 11;
let cat;
if (varsta <= 2) cat = "bebeluș";
else if (varsta <= 12) cat = "copil";
else if (varsta <= 19) cat = "adolescent";
else if (varsta <= 64) cat = "adult";
else cat = "senior";
\`\`\`

## 🎯 Problema 5: An bisect

Un an e bisect dacă:
- e divizibil cu **4** ȘI nu cu **100**
- SAU e divizibil cu **400**

\`\`\`javascript
let an = 2024;
let bisect = (an % 4 === 0 && an % 100 !== 0) || (an % 400 === 0);
console.log(bisect);   // true
\`\`\`

## 🎯 Sfaturi pentru rezolvare

1. **Citește atent** condițiile
2. **Desenează** cazurile pe hârtie
3. **Începe cu cazul cel mai specific** (ex: 15 înaintea lui 3)
4. **Testează** cu valori extreme: 0, negative, foarte mari

## 🎓 Ce ai învățat
- ✅ Combinații complexe cu \`&&\`, \`||\`
- ✅ Ordinea condițiilor contează
- ✅ \`Math.max\` și alte ajutoare
`,
    extraProblems: [
      mc('Par/impar',
        'Cum verifici dacă `n` e par?',
        ['n / 2 === 0', 'n % 2 === 0', 'n === par', 'n.par'],
        'n % 2 === 0',
        'Restul împărțirii la 2 e 0 când numărul e par.',
        { topic: 'conditions' }),
      mc('An bisect',
        'Ce condiție corectă pentru an bisect?',
        ['an % 4 === 0', '(an % 4 === 0 && an % 100 !== 0) || an % 400 === 0', 'an % 400 === 0', 'an > 2000'],
        '(an % 4 === 0 && an % 100 !== 0) || an % 400 === 0',
        'Regula completă: divizibil cu 4 dar nu cu 100, SAU divizibil cu 400.',
        { topic: 'conditions', difficulty: 'MEDIUM' }),
      sa('Math.max',
        'Ce funcție Math returnează cea mai mare valoare?',
        'max',
        '`Math.max(a, b, c)` întoarce cea mai mare valoare.',
        { topic: 'conditions' }),
      mc('Ordinea condițiilor',
        'De ce e important să verifici cazul cel mai SPECIFIC primul?',
        ['Nu e important', 'Pentru că un caz general "fură" condițiile mai specifice', 'Pentru viteză', 'Așa e moda'],
        'Pentru că un caz general "fură" condițiile mai specifice',
        'Ex: dacă verifici `>= 5` înaintea `=== 10`, niciodată nu vei ajunge la `=== 10`.',
        { topic: 'conditions', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 7. while-js ============
  'while-js': {
    theory: `# 🔁 Bucla \`while\`

\`while\` repetă cod **cât timp** o condiție e adevărată ⏳.

## 🎯 Sintaxa

\`\`\`javascript
while (condiție) {
    // cod care se repetă
}
\`\`\`

## 🎯 Exemplu — numărăm până la 5

\`\`\`javascript
let i = 1;
while (i <= 5) {
    console.log(i);
    i++;            // FOARTE important — altfel buclă infinită!
}
\`\`\`

**Output:** \`1 2 3 4 5\`

## 🎯 Exemplu — așteptăm răspuns corect

\`\`\`javascript
let raspuns = "";
while (raspuns !== "secret") {
    raspuns = prompt("Parola?");
}
alert("Bravo!");
\`\`\`

## 🎯 \`do...while\` — execută o dată, apoi verifică

\`\`\`javascript
let n;
do {
    n = Number(prompt("Număr pozitiv:"));
} while (n <= 0);
\`\`\`

> 💡 Diferența: \`do...while\` rulează **cel puțin o dată**.

## 🚪 \`break\` și \`continue\`

\`\`\`javascript
let i = 0;
while (true) {
    i++;
    if (i === 5) break;        // ieșim
    if (i % 2 === 0) continue; // sărim peste, mergem la următoarea iterație
    console.log(i);
}
// Afișează: 1, 3
\`\`\`

## ⚠️ Buclă infinită — pericol!

\`\`\`javascript
let i = 0;
while (i < 10) {
    console.log(i);
    // 🔴 Am uitat i++ — se blochează browserul!
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`while (condiție)\` repetă
- ✅ Trebuie să **schimbi** ceva pentru a opri
- ✅ \`do...while\` rulează măcar o dată
- ✅ \`break\` ieșire, \`continue\` salt
`,
    extraProblems: [
      mc('Pericolul while',
        'Care e cel mai mare pericol la `while`?',
        ['E lent', 'Buclă infinită', 'Nu poate avea condiții', 'Doar 100 repetări'],
        'Buclă infinită',
        'Dacă uiți să schimbi variabila condiției, programul nu se oprește.',
        { topic: 'loops' }),
      mc('do-while diferență',
        'Diferența cheie între `while` și `do...while`?',
        ['Nu e diferență', '`do...while` rulează cel puțin o dată indiferent de condiție', '`while` e mai rapid', '`do` e nou'],
        '`do...while` rulează cel puțin o dată indiferent de condiție',
        'La `do...while`, condiția e verificată DUPĂ prima execuție.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      sa('Cuvântul cheie ieșire',
        'Ce cuvânt cheie iese imediat din buclă?',
        'break',
        '`break` oprește bucla complet.',
        { topic: 'loops' }),
      mc('continue',
        'Ce face `continue` într-o buclă?',
        ['Oprește bucla', 'Sare la iterația următoare', 'Repetă infinit', 'Eroare'],
        'Sare la iterația următoare',
        '`continue` ignoră restul iterației curente și trece la următoarea.',
        { topic: 'loops' }),
    ],
  },

  // ============ 8. for-js ============
  'for-js': {
    theory: `# 🔁 Bucla \`for\`

\`for\` e regele buclelor când **știi de câte ori** trebuie să repeți 👑.

## 🎯 Sintaxa

\`\`\`javascript
for (start; condiție; pas) {
    // cod
}
\`\`\`

## 🎯 Cele 3 părți

\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log(i);
}
\`\`\`

- **\`let i = 0\`** — Ce face: inițializare • Când rulează: **O dată**, la început
- **\`i < 5\`** — Ce face: condiție • Când rulează: înainte de fiecare iterație
- **\`i++\`** — Ce face: pas • Când rulează: după fiecare iterație

**Output:** \`0 1 2 3 4\`

## 🎯 Variante de pas

\`\`\`javascript
for (let i = 0; i <= 10; i += 2) console.log(i);  // 0,2,4,6,8,10
for (let i = 10; i >= 1; i--) console.log(i);     // numărătoare inversă
for (let i = 1; i <= 100; i *= 2) console.log(i); // 1,2,4,8,16,32,64
\`\`\`

## 🎯 Parcurgere array (listă)

\`\`\`javascript
let fructe = ["mar", "banana", "kiwi"];
for (let i = 0; i < fructe.length; i++) {
    console.log(i, fructe[i]);
}
\`\`\`

## 🎯 \`for...of\` (modern, mai simplu)

\`\`\`javascript
for (let f of fructe) {
    console.log(f);
}
\`\`\`

## 🎯 \`for...in\` (pentru chei de obiect)

\`\`\`javascript
let elev = { nume: "Ana", varsta: 11 };
for (let cheie in elev) {
    console.log(cheie, "=", elev[cheie]);
}
\`\`\`

## 🧮 Sumă cu for

\`\`\`javascript
let suma = 0;
for (let i = 1; i <= 100; i++) {
    suma += i;
}
console.log(suma);   // 5050
\`\`\`

## ⚠️ Greșeli frecvente

- **\`for (i = 0; ...)\` (uiți \`let\`)** — \`for (let i = 0; ...)\`
- **\`i <= fructe.length\`** — \`i < fructe.length\` (off-by-one!)

## 🎓 Ce ai învățat
- ✅ \`for (init; condiție; pas)\`
- ✅ \`for...of\` pentru array
- ✅ \`for...in\` pentru obiecte
- ✅ Atenție la off-by-one
`,
    extraProblems: [
      mc('Părțile for',
        'Câte părți are sintaxa `for` clasică?',
        ['1', '2', '3', '4'],
        '3',
        'Inițializare; condiție; pas — toate separate cu `;`.',
        { topic: 'loops' }),
      mc('for...of vs for...in',
        'Care construcție e potrivită pentru parcurgerea **valorilor** unui array?',
        ['for...in', 'for...of', 'foreach', 'while'],
        'for...of',
        '`for...in` parcurge cheile (indici), `for...of` parcurge valorile.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      sa('Off-by-one',
        'Pentru un array cu 5 elemente, condiția corectă e `i < ?`',
        '5',
        'Indecșii sunt 0,1,2,3,4 → `i < 5` e corect (5 NU e index valid).',
        { topic: 'loops' }),
      mc('Numărătoare inversă',
        'Cum scrii numărătoare de la 10 la 1?',
        ['for (let i=10; i>=1; i--)', 'for (let i=10; i<=1; i++)', 'for (let i=1; i<=10; i--)', 'for (10; 1; -1)'],
        'for (let i=10; i>=1; i--)',
        'Pornești de la 10, mergi cât timp `>= 1`, scazi cu 1.',
        { topic: 'loops' }),
    ],
  },

  // ============ 9. for-vs-while-js ============
  'for-vs-while-js': {
    theory: `# 🔁 \`for\` vs \`while\` — care când?

- **Știi de **câte ori** repeți?** — \`for\`
- **Repeți până se **întâmplă ceva**?** — \`while\`
- **Parcurgi un array?** — \`for...of\` sau \`forEach\`
- **Aștepți input valid?** — \`while\`

## 🎯 Aceeași problemă — ambele variante

### Cu \`for\`:
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
\`\`\`

### Cu \`while\`:
\`\`\`javascript
let i = 1;
while (i <= 5) {
    console.log(i);
    i++;
}
\`\`\`

> 💡 \`for\` e mai compact — totul într-o linie de antet.

## 🎯 Când e mai natural \`while\`

Aștepți input corect:

\`\`\`javascript
let raspuns;
while (raspuns !== "DA") {
    raspuns = prompt("Confirmă cu DA");
}
\`\`\`

## 🎯 Când e mai natural \`for\`

Numeri ceva sau parcurgi:

\`\`\`javascript
let suma = 0;
for (let i = 1; i <= 100; i++) suma += i;
\`\`\`

## 📋 Reguli generale

1. **Cunoști numărul** → \`for\`
2. **Necunoscut** → \`while\`
3. **Lucrezi cu array** → \`for...of\` sau metode (\`forEach\`, \`map\`)

## ⚠️ Capcane

- **\`while\` fără actualizare → infinit** — Verifică mereu schimbarea
- **\`for\` cu \`<=\` în loc de \`<\`** — Atenție la dimensiuni

## 🎓 Ce ai învățat
- ✅ Diferența principală: cunoscut vs necunoscut
- ✅ \`for\` mai sigur și compact
- ✅ \`while\` mai flexibil pentru așteptare
`,
    extraProblems: [
      mc('Bucla pentru număr cunoscut',
        'Vrei să repeți de 50 de ori. Ce alegi?',
        ['for', 'while', 'do...while', 'switch'],
        'for',
        'Când știi numărul, `for` e cel mai natural.',
        { topic: 'loops' }),
      mc('Bucla pentru așteptare',
        'Aștepți userul să introducă "DA". Ce buclă?',
        ['for', 'while', 'foreach', 'if'],
        'while',
        'Numărul de încercări e necunoscut — `while` e potrivit.',
        { topic: 'loops' }),
      sa('Echivalent for→while',
        'Pentru a converti `for (let i=0; i<10; i++)` în while, ce variabilă declari ÎNAINTE de while?',
        'i',
        'Inițializezi `let i = 0;` înainte, apoi `while (i < 10) { ...; i++; }`.',
        { topic: 'loops' }),
      mc('Ce e mai compact',
        'Care variantă scrie mai puțin cod pentru număr cunoscut?',
        ['for', 'while', 'la fel', 'depinde'],
        'for',
        '`for` strânge totul în antet (init, condiție, pas).',
        { topic: 'loops' }),
    ],
  },

  // ============ 10. nested-loops-js ============
  'nested-loops-js': {
    theory: `# 🔁🔁 Bucle imbricate (nested) în JS

O buclă **în interiorul** alteia. Bună pentru **tabele**, **grile**, **combinații** 🧮.

## 🎯 Exemplu de bază

\`\`\`javascript
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        console.log(\`(\${i},\${j})\`);
    }
}
\`\`\`

**Output:**
\`\`\`
(1,1) (1,2) (1,3)
(2,1) (2,2) (2,3)
(3,1) (3,2) (3,3)
\`\`\`

## 🧮 Câte iterații?

Înmulțești: 3 × 3 = **9** iterații.

## 🎯 Tabla înmulțirii

\`\`\`javascript
for (let i = 1; i <= 5; i++) {
    let linie = "";
    for (let j = 1; j <= 5; j++) {
        linie += (i * j) + "\\t";
    }
    console.log(linie);
}
\`\`\`

## 🎯 Triunghi de stele

\`\`\`javascript
for (let i = 1; i <= 5; i++) {
    let rand = "";
    for (let j = 0; j < i; j++) {
        rand += "⭐";
    }
    console.log(rand);
}
\`\`\`

**Output:**
\`\`\`
⭐
⭐⭐
⭐⭐⭐
⭐⭐⭐⭐
⭐⭐⭐⭐⭐
\`\`\`

## 🎯 Matrice (array 2D)

\`\`\`javascript
let grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        console.log(grid[i][j]);
    }
}
\`\`\`

## ⚠️ Greșeli frecvente

- **Folosești \`i\` în ambele bucle** — Folosește \`i\` și \`j\` (variabile diferite)
- **Acolade greșit** — Atenție la închiderea fiecărei bucle

## 🎓 Ce ai învățat
- ✅ Bucle în interiorul altora
- ✅ Total iterații = înmulțire
- ✅ Excelente pentru grile și matrici
`,
    extraProblems: [
      mc('Total iterații',
        'Câte iterații în: 4 bucle exterioare × 6 interioare?',
        ['10', '24', '4', '6'],
        '24',
        '4 × 6 = 24 iterații totale.',
        { topic: 'loops' }),
      mc('Variabile diferite',
        'De ce folosim `i` și `j` în bucle imbricate?',
        ['Doar pentru frumusețe', 'Ca să nu se suprascrie contoarele', 'Ca să fie mai rapid', 'Așa cere JS'],
        'Ca să nu se suprascrie contoarele',
        'Dacă ai folosi același nume, bucla interioară ar strica pe cea exterioară.',
        { topic: 'loops' }),
      sa('Acces matrice',
        'Cum accesezi elementul de pe rândul 2, coloana 1 din `grid` (0-indexat)?',
        'grid[2][1]',
        'Primul `[]` selectează rândul, al doilea coloana.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      mc('Bucla externă',
        'Bucla externă rulează mai rar sau mai des decât cea internă?',
        ['Mai des', 'Mai rar', 'La fel', 'Depinde'],
        'Mai rar',
        'Pentru fiecare iterație externă, cea internă rulează tot ciclul ei.',
        { topic: 'loops' }),
    ],
  },

  // ============ 11. arrays-introducere ============
  'arrays-introducere': {
    theory: `# 📋 Array-uri (Liste) în JavaScript

Un **array** = listă ordonată de valori într-o singură variabilă 🗂️.

## 🎯 Creare

\`\`\`javascript
let fructe = ["mar", "banana", "kiwi"];
let numere = [1, 2, 3, 4, 5];
let mixt = ["text", 42, true, null];
let gol = [];
\`\`\`

## 🔢 Acces prin index (de la 0!)

\`\`\`javascript
let f = ["mar", "banana", "kiwi"];
console.log(f[0]);   // "mar"
console.log(f[1]);   // "banana"
console.log(f[2]);   // "kiwi"
console.log(f[3]);   // undefined (nu există)
\`\`\`

> 💡 Index începe de la **0**, NU de la 1!

## 📏 Lungimea: \`.length\`

\`\`\`javascript
console.log(f.length);   // 3
\`\`\`

## ➕ Modificare

\`\`\`javascript
f[0] = "ananas";        // schimbă primul
f[3] = "portocală";     // adaugă al patrulea
\`\`\`

## 🔚 Ultimul element

\`\`\`javascript
let ultim = f[f.length - 1];   // "kiwi" (înainte de modificări)
\`\`\`

## 🔁 Parcurgere

\`\`\`javascript
// 1. for clasic
for (let i = 0; i < f.length; i++) {
    console.log(f[i]);
}

// 2. for...of (modern)
for (let fruct of f) {
    console.log(fruct);
}

// 3. forEach (metoda array-ului)
f.forEach(fruct => console.log(fruct));
\`\`\`

## 🆚 Array vs variabilă obișnuită

- **Conține **o** valoare** — Conține **multe** valori
- **\`let x = 5\`** — \`let x = [5, 6, 7]\`
- **\`x\`** — \`x[0]\`, \`x[1]\`, \`x[2]\`

## ⚠️ Greșeli frecvente

- **\`f(0)\`** — \`f[0]\` (paranteze pătrate!)
- **\`f.length()\`** — \`f.length\` (fără paranteze)
- **Index începe de la 1** — Index începe de la 0

## 🎓 Ce ai învățat
- ✅ Array = listă ordonată
- ✅ Index de la 0
- ✅ \`.length\` pentru număr de elemente
- ✅ Parcurgere cu for / for...of / forEach
`,
    extraProblems: [
      mc('Primul index',
        'Care e primul index într-un array JavaScript?',
        ['0', '1', '-1', 'depinde'],
        '0',
        'Toate array-urile JS încep de la index 0.',
        { topic: 'arrays' }),
      mc('Ultimul element',
        'Cum accesezi ultimul element dintr-un array `a`?',
        ['a[last]', 'a[a.length - 1]', 'a.last', 'a[-1]'],
        'a[a.length - 1]',
        'Indexul ultimului = lungime - 1 (pentru că începem de la 0).',
        { topic: 'arrays' }),
      sa('Lungimea',
        'Ce proprietate îți spune câte elemente are un array?',
        'length',
        '`a.length` (fără paranteze!) — număr de elemente.',
        { topic: 'arrays' }),
      mc('Acces invalid',
        'Ce întoarce `[1,2,3][10]`?',
        ['null', 'undefined', '0', 'Eroare'],
        'undefined',
        'JavaScript întoarce `undefined` pentru indexuri inexistente, fără eroare.',
        { topic: 'arrays', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 12. arrays-operatii ============
  'arrays-operatii': {
    theory: `# 🛠️ Operații cu array-uri

Acum învățăm să **adăugăm**, **ștergem** și **transformăm** array-uri 🧰.

## ➕ Adăugare

- **\`push(x)\`** — la **sfârșit**
- **\`unshift(x)\`** — la **început**

\`\`\`javascript
let a = [2, 3];
a.push(4);       // [2, 3, 4]
a.unshift(1);    // [1, 2, 3, 4]
\`\`\`

## ➖ Ștergere

- **\`pop()\`** — Șterge de unde: de la **sfârșit** • Întoarce: elementul șters
- **\`shift()\`** — Șterge de unde: de la **început** • Întoarce: elementul șters

\`\`\`javascript
let a = [1, 2, 3, 4];
a.pop();       // [1, 2, 3], întoarce 4
a.shift();     // [2, 3], întoarce 1
\`\`\`

## ✂️ \`splice\` — şterge / adaugă oriunde

\`\`\`javascript
let a = [1, 2, 3, 4, 5];
a.splice(1, 2);            // de la index 1, șterge 2 elemente → [1, 4, 5]
a.splice(1, 0, "x", "y");  // de la index 1, șterge 0, adaugă x,y → [1, "x", "y", 4, 5]
\`\`\`

## 🔪 \`slice\` — copie o porțiune (NU modifică originalul)

\`\`\`javascript
let a = [1, 2, 3, 4, 5];
let parte = a.slice(1, 4);   // [2, 3, 4]
\`\`\`

## 🔍 Căutare

\`\`\`javascript
let a = [10, 20, 30, 20];
a.indexOf(20);          // 1 (prima apariție)
a.lastIndexOf(20);      // 3
a.includes(30);         // true
\`\`\`

## 🔗 Combinare

\`\`\`javascript
let a = [1, 2];
let b = [3, 4];
let c = a.concat(b);          // [1, 2, 3, 4]
let d = [...a, ...b];         // [1, 2, 3, 4] (spread modern)
\`\`\`

## 🔃 \`reverse\` și \`sort\`

\`\`\`javascript
[3, 1, 2].reverse();    // [2, 1, 3]
[3, 1, 2].sort();       // [1, 2, 3]
[10, 2, 30].sort();     // [10, 2, 30] sortează ca STRING!
[10, 2, 30].sort((a,b) => a - b);  // [2, 10, 30] corect numeric
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`push/pop\` (sfârșit), \`unshift/shift\` (început)
- ✅ \`splice\` (mijloc) și \`slice\` (copiere)
- ✅ \`indexOf\`, \`includes\`
- ✅ \`sort\` numeric cu funcție comparare
`,
    extraProblems: [
      mc('Adaugă la sfârșit',
        'Care metodă adaugă la sfârșitul array-ului?',
        ['shift()', 'unshift()', 'push()', 'pop()'],
        'push()',
        '`push` adaugă la sfârșit, `pop` scoate de la sfârșit.',
        { topic: 'arrays' }),
      mc('slice vs splice',
        'Care metodă **NU** modifică array-ul original?',
        ['splice', 'slice', 'push', 'pop'],
        'slice',
        '`slice` copiază. `splice` modifică originalul.',
        { topic: 'arrays', difficulty: 'MEDIUM' }),
      sa('Verificare existență',
        'Ce metodă verifică dacă un array conține o valoare? (returnează true/false)',
        'includes',
        '`a.includes(x)` întoarce true sau false.',
        { topic: 'arrays' }),
      mc('Sort numeric',
        'De ce `[10, 2, 30].sort()` întoarce `[10, 2, 30]` în loc de `[2, 10, 30]`?',
        ['Bug JS', 'Sortează ca string-uri (lexicografic)', 'E corect așa', 'Numerele se sortează doar cu sortNum'],
        'Sortează ca string-uri (lexicografic)',
        'Default `sort` compară string-uri. Folosește `(a,b) => a - b` pentru sort numeric.',
        { topic: 'arrays', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 13. arrays-loop ============
  'arrays-loop': {
    theory: `# 🔁 Parcurgere array-uri & metode moderne

JavaScript are **metode magice** pentru array-uri — ascund bucla pentru tine ✨.

## 🎯 \`forEach\` — face ceva cu fiecare

\`\`\`javascript
let nume = ["Ana", "Bogdan", "Calin"];
nume.forEach(n => console.log("Salut", n));
\`\`\`

## 🎨 \`map\` — transformă fiecare → array nou

\`\`\`javascript
let n = [1, 2, 3, 4];
let dublu = n.map(x => x * 2);    // [2, 4, 6, 8]
\`\`\`

## 🔍 \`filter\` — păstrează doar unele

\`\`\`javascript
let n = [1, 2, 3, 4, 5, 6];
let pare = n.filter(x => x % 2 === 0);    // [2, 4, 6]
\`\`\`

## ➕ \`reduce\` — combină totul într-o valoare

\`\`\`javascript
let n = [1, 2, 3, 4];
let suma = n.reduce((acc, x) => acc + x, 0);    // 10
\`\`\`

> 💡 \`acc\` = "acumulator", \`0\` = valoarea inițială.

## 🎯 \`find\` — primul element care corespunde

\`\`\`javascript
let users = [{nume: "Ana", varsta: 11}, {nume: "Bogdan", varsta: 10}];
let ana = users.find(u => u.nume === "Ana");
\`\`\`

## ✅ \`some\` și \`every\`

\`\`\`javascript
[1, 2, 3].some(x => x > 2);     // true (există >2)
[1, 2, 3].every(x => x > 0);    // true (toți >0)
[1, 2, 3].every(x => x > 1);    // false (1 nu e >1)
\`\`\`

## 🎯 Tabel rapid

- **\`forEach\`** — Ce face: acționează • Întoarce: nimic
- **\`map\`** — Ce face: transformă • Întoarce: array nou
- **\`filter\`** — Ce face: filtrează • Întoarce: array nou
- **\`reduce\`** — Ce face: combină • Întoarce: o valoare
- **\`find\`** — Ce face: caută primul • Întoarce: element sau undefined
- **\`some\`** — Ce face: există unul? • Întoarce: true/false
- **\`every\`** — Ce face: toți? • Întoarce: true/false

## 🎯 Combo modern

\`\`\`javascript
let varste = [9, 15, 11, 20, 8];
let copiiPlus10 = varste
    .filter(v => v < 18)        // doar copii
    .map(v => v + 1)            // anul viitor
    .filter(v => v >= 10);      // peste 10 ani
console.log(copiiPlus10);   // [10, 16, 12]
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`forEach\`, \`map\`, \`filter\`, \`reduce\`
- ✅ \`find\`, \`some\`, \`every\`
- ✅ Pot fi înlănțuite (chaining)
`,
    extraProblems: [
      mc('map vs forEach',
        'Care e diferența între `map` și `forEach`?',
        ['Niciuna', '`map` întoarce array nou, `forEach` nu întoarce nimic', '`forEach` e mai rapid', '`map` e nou'],
        '`map` întoarce array nou, `forEach` nu întoarce nimic',
        '`forEach` doar iterează; `map` creează un nou array transformat.',
        { topic: 'arrays', difficulty: 'MEDIUM' }),
      mc('Filtrare numere pare',
        'Cum păstrezi doar numerele pare din `[1,2,3,4]`?',
        ['n.map(x => x%2===0)', 'n.filter(x => x%2===0)', 'n.reduce(...)', 'n.find(x => x%2===0)'],
        'n.filter(x => x%2===0)',
        '`filter` păstrează elementele care îndeplinesc condiția.',
        { topic: 'arrays' }),
      sa('Suma elementelor',
        'Ce metodă combină array-ul într-o valoare unică (ex: suma)?',
        'reduce',
        '`a.reduce((acc, x) => acc + x, 0)` returnează suma.',
        { topic: 'arrays' }),
      mc('every',
        'Ce întoarce `[2, 4, 6].every(x => x % 2 === 0)`?',
        ['true', 'false', 'array', 'undefined'],
        'true',
        'Toate sunt pare → `every` returnează true.',
        { topic: 'arrays' }),
    ],
  },

  // ============ 14. algoritmi-js ============
  'algoritmi-js': {
    theory: `# 🧠 Algoritmi simpli în JavaScript

Algoritmii sunt **rețete** clare. Hai să facem câteva clasice 👨‍🍳.

## 1️⃣ Maximul

\`\`\`javascript
let nums = [3, 1, 9, 4, 7];
let max = nums[0];
for (let n of nums) {
    if (n > max) max = n;
}
console.log(max);   // 9
\`\`\`

> 💡 Mai scurt: \`Math.max(...nums)\`

## 2️⃣ Suma & media

\`\`\`javascript
let suma = nums.reduce((a, b) => a + b, 0);
let medie = suma / nums.length;
\`\`\`

## 3️⃣ Numărarea

Câte numere mai mari ca 5?

\`\`\`javascript
let count = nums.filter(n => n > 5).length;
\`\`\`

## 4️⃣ Inversare

\`\`\`javascript
let inv = nums.slice().reverse();   // copie + inversare
let s = "abc".split("").reverse().join("");   // "cba"
\`\`\`

## 5️⃣ Palindrom

\`\`\`javascript
function estePalindrom(s) {
    return s === s.split("").reverse().join("");
}
console.log(estePalindrom("anna"));    // true
\`\`\`

## 6️⃣ FizzBuzz

\`\`\`javascript
for (let i = 1; i <= 15; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
}
\`\`\`

## 7️⃣ Numărarea vocalelor

\`\`\`javascript
function numaraVocale(s) {
    let count = 0;
    for (let c of s.toLowerCase()) {
        if ("aeiou".includes(c)) count++;
    }
    return count;
}
\`\`\`

## 8️⃣ Factorial

\`\`\`javascript
function factorial(n) {
    let rez = 1;
    for (let i = 2; i <= n; i++) rez *= i;
    return rez;
}
console.log(factorial(5));   // 120
\`\`\`

## 🎓 Ce ai învățat
- ✅ Min/max, sumă, medie
- ✅ Filtrare & numărare
- ✅ Inversare cu split/reverse/join
- ✅ Palindrom & FizzBuzz
`,
    extraProblems: [
      mc('Math.max',
        'Cum aplici `Math.max` pe un array `nums`?',
        ['Math.max(nums)', 'Math.max(...nums)', 'nums.max()', 'max(nums)'],
        'Math.max(...nums)',
        '`...` (spread) "împrăștie" array-ul ca argumente individuale.',
        { topic: 'algorithms', difficulty: 'MEDIUM' }),
      sa('Inversare string',
        'Trei metode înlănțuite pentru a inversa "abc". Răspuns: split("").reverse().?',
        'join("")',
        'Lipsește `join("")` care lipește caracterele înapoi într-un string.',
        { topic: 'algorithms', difficulty: 'MEDIUM' }),
      mc('Factorial 4',
        'Cât e 4! (factorial de 4)?',
        ['4', '16', '24', '120'],
        '24',
        '4! = 4×3×2×1 = 24.',
        { topic: 'algorithms' }),
      mc('Palindrom test',
        'Care din cuvintele de mai jos e palindrom?',
        ['salut', 'anna', 'banana', 'masina'],
        'anna',
        'Citit invers e tot "anna" — palindrom.',
        { topic: 'algorithms' }),
    ],
  },

  // ============ 15. string-uri-js ============
  'string-uri-js': {
    theory: `# 📝 String-uri în JavaScript

String = un șir de caractere (text) 🔤.

## 🎯 Creare

\`\`\`javascript
let a = "Salut";
let b = 'Salut';
let c = \`Salut\`;       // template literal — special!
\`\`\`

## 📏 Lungime

\`\`\`javascript
"Salut".length;   // 5
\`\`\`

## 🔢 Acces caracter

\`\`\`javascript
let s = "Python";
s[0];          // "P"
s.charAt(0);   // "P"
s[s.length-1]; // "n"
\`\`\`

## 🔗 Concatenare

\`\`\`javascript
"Salut " + "lume"            // "Salut lume"
\`Salut \${nume}!\`             // template literal — mult mai bun!
\`\`\`

## 🛠️ Metode utile

- **\`toUpperCase()\`** — Ce face: MAJUSCULE • Exemplu: "ana".toUpperCase() → "ANA"
- **\`toLowerCase()\`** — Ce face: minuscule • Exemplu: "ANA".toLowerCase() → "ana"
- **\`trim()\`** — Ce face: șterge spații margini • Exemplu: "  hi  ".trim() → "hi"
- **\`split(x)\`** — Ce face: string → array • Exemplu: "a,b,c".split(",") → ["a","b","c"]
- **\`replace(a, b)\`** — Ce face: înlocuiește • Exemplu: "salut".replace("s", "S") → "Salut"
- **\`includes(x)\`** — Ce face: conține? • Exemplu: "salut".includes("alu") → true
- **\`indexOf(x)\`** — Ce face: poziția • Exemplu: "salut".indexOf("u") → 3
- **\`slice(a, b)\`** — Ce face: porțiune • Exemplu: "salut".slice(1, 4) → "alu"
- **\`repeat(n)\`** — Ce face: repetă • Exemplu: "ha".repeat(3) → "hahaha"
- **\`startsWith(x)\`** — Ce face: începe cu? • Exemplu: "salut".startsWith("sa") → true
- **\`endsWith(x)\`** — Ce face: se termină cu? • Exemplu: "salut".endsWith("ut") → true

## 🎯 Template literals (backticks)

\`\`\`javascript
let nume = "Ana";
let varsta = 11;

// Vechi (urât)
let mesaj = "Salut, " + nume + "! Ai " + varsta + " ani.";

// Modern (frumos!)
let mesajModern = \`Salut, \${nume}! Ai \${varsta} ani.\`;
\`\`\`

## 🎯 Multi-linie cu backticks

\`\`\`javascript
let poezie = \`Trandafiri roșii,
Violete albastre,
JavaScript e drăguț,
La fel și tu!\`;
\`\`\`

## ⚠️ Important: string-urile sunt **imutabile**

\`\`\`javascript
let s = "salut";
s[0] = "S";          // NU modifică nimic!
s = s.replace("s", "S");   // ✅ creezi unul nou
\`\`\`

## 🎓 Ce ai învățat
- ✅ Trei tipuri de ghilimele
- ✅ Multe metode utile
- ✅ Template literals \`\${...}\`
- ✅ String-urile sunt imutabile
`,
    extraProblems: [
      mc('Template literal',
        'Ce ghilimele folosești pentru template literals (cu ${})?',
        ['"', "'", '`', '<>'],
        '`',
        'Backticks ` ` ` permit interpolarea cu ${expresie}.',
        { topic: 'strings' }),
      mc('Imutabilitate',
        'Ce face `s[0] = "X"` pe un string `s = "abc"`?',
        ['Schimbă primul caracter', 'Nimic — string-urile sunt imutabile', 'Eroare', 'Șterge primul caracter'],
        'Nimic — string-urile sunt imutabile',
        'Trebuie să creezi un string nou cu metode (replace, slice etc.).',
        { topic: 'strings', difficulty: 'MEDIUM' }),
      sa('Lungime',
        'Cum afli lungimea string-ului `s` (proprietate, fără paranteze)?',
        's.length',
        '`s.length` — același ca la array-uri.',
        { topic: 'strings' }),
      mc('Split',
        'Ce întoarce `"a,b,c".split(",")`?',
        ['"abc"', '["a", "b", "c"]', '"a-b-c"', 'Eroare'],
        '["a", "b", "c"]',
        '`split` împarte string-ul într-un array după separator.',
        { topic: 'strings' }),
    ],
  },

  // ============ 16. obiecte-js ============
  'obiecte-js': {
    theory: `# 🎁 Obiecte în JavaScript

Un **obiect** = colecție de **chei + valori**, ca un dicționar 📖. Excelent pentru a descrie "lucruri".

## 🎯 Creare

\`\`\`javascript
let elev = {
    nume: "Ana",
    varsta: 11,
    clasa: "5B",
    note: [9, 10, 8]
};
\`\`\`

## 🔑 Acces la valori

### Notație punct (\`.\`)
\`\`\`javascript
elev.nume;        // "Ana"
elev.varsta;      // 11
\`\`\`

### Notație paranteze (\`[]\`)
\`\`\`javascript
elev["nume"];     // "Ana"
let cheie = "varsta";
elev[cheie];      // 11
\`\`\`

> 💡 \`[]\` e util când cheia e într-o variabilă.

## ➕ Adăugare / modificare

\`\`\`javascript
elev.scoala = "Mihai Viteazul";   // adaugă
elev.varsta = 12;                  // modifică
\`\`\`

## ➖ Ștergere

\`\`\`javascript
delete elev.clasa;
\`\`\`

## 🔍 Verificare existență

\`\`\`javascript
"nume" in elev;        // true
elev.telefon;          // undefined
\`\`\`

## 🔁 Parcurgere

\`\`\`javascript
for (let cheie in elev) {
    console.log(cheie, "=", elev[cheie]);
}

// sau:
Object.keys(elev);     // ["nume", "varsta", ...]
Object.values(elev);   // ["Ana", 11, ...]
Object.entries(elev);  // [["nume", "Ana"], ...]
\`\`\`

## 🎯 Metode (funcții în obiect)

\`\`\`javascript
let calculator = {
    a: 10,
    b: 5,
    aduna() {
        return this.a + this.b;
    }
};
console.log(calculator.aduna());   // 15
\`\`\`

> 💡 \`this\` = "obiectul curent" (asemenea \`self\` în Python).

## 🎯 Obiecte imbricate

\`\`\`javascript
let elev = {
    nume: "Ana",
    adresa: {
        strada: "Florilor",
        numar: 12
    }
};
elev.adresa.strada;    // "Florilor"
\`\`\`

## ⚠️ Greșeli frecvente

- **\`elev.numele\` (când e \`nume\`)** — Atenție la nume
- **\`elev[nume]\` (variabilă) când vrei cheia "nume"** — \`elev["nume"]\`
- **\`elev = {nume: ...}\` în loc de adăugare** — \`elev.nume = ...\`

## 🎓 Ce ai învățat
- ✅ \`{ cheie: valoare }\`
- ✅ Acces cu \`.\` sau \`[]\`
- ✅ \`Object.keys/values/entries\`
- ✅ Metode și \`this\`
`,
    extraProblems: [
      mc('Sintaxă obiect',
        'Care e sintaxa CORECTĂ pentru un obiect?',
        ['{nume = "Ana"}', '{nume: "Ana"}', '[nume: "Ana"]', '(nume: "Ana")'],
        '{nume: "Ana"}',
        'Acolade `{}`, două puncte între cheie și valoare.',
        { topic: 'objects' }),
      mc('Acces dinamic',
        'Ai variabila `let k = "nume"`. Cum accesezi `elev.nume` folosind k?',
        ['elev.k', 'elev[k]', 'elev["k"]', 'elev->k'],
        'elev[k]',
        'Notația `[]` permite cheie dintr-o variabilă.',
        { topic: 'objects', difficulty: 'MEDIUM' }),
      sa('Ștergere proprietate',
        'Ce cuvânt cheie șterge o proprietate dintr-un obiect?',
        'delete',
        '`delete elev.nume` elimină proprietatea.',
        { topic: 'objects' }),
      mc('this în metodă',
        'Ce reprezintă `this` într-o metodă a unui obiect?',
        ['Obiectul curent', 'O variabilă globală', 'Funcția însăși', 'undefined'],
        'Obiectul curent',
        '`this` se referă la obiectul pe care a fost apelată metoda.',
        { topic: 'objects', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 17. functii-basic-js ============
  'functii-basic-js': {
    theory: `# 🔧 Funcții — bază

O **funcție** = bucățică de cod cu nume, pe care o poți **rula** când vrei 🎵.

## 🎯 Declarare clasică

\`\`\`javascript
function saluta(nume) {
    console.log("Salut, " + nume);
}

saluta("Ana");        // Salut, Ana
saluta("Bogdan");     // Salut, Bogdan
\`\`\`

## 🎯 Funcție cu return

\`\`\`javascript
function patrat(n) {
    return n * n;
}
let x = patrat(5);    // 25
\`\`\`

## 🎯 Mai mulți parametri

\`\`\`javascript
function aduna(a, b) {
    return a + b;
}
aduna(3, 4);   // 7
\`\`\`

## 🎯 Funcție fără parametri

\`\`\`javascript
function buna() {
    return "Salutare!";
}
\`\`\`

## 🆕 Arrow functions (modern)

\`\`\`javascript
// Clasică
function dublu(n) { return n * 2; }

// Arrow
const dublu = (n) => n * 2;
const dublu2 = n => n * 2;          // o singură variabilă, parantezele opționale
const aduna = (a, b) => a + b;
const buna = () => "Salutare!";     // fără parametri
\`\`\`

## 🎯 Function expression

\`\`\`javascript
const inmultire = function(a, b) {
    return a * b;
};
\`\`\`

## 📊 Diferențe rapide

- **Declarație** — Sintaxă: \`function f() {}\` • Hoisting?: ✅ Da
- **Expression** — Sintaxă: \`const f = function() {}\` • Hoisting?: ❌ Nu
- **Arrow** — Sintaxă: \`const f = () => {}\` • Hoisting?: ❌ Nu

## 🎯 Parametri impliciți

\`\`\`javascript
function saluta(nume = "prieten") {
    console.log("Salut, " + nume);
}
saluta();        // Salut, prieten
saluta("Ana");   // Salut, Ana
\`\`\`

## ⚠️ Greșeli frecvente

- **Apelezi fără paranteze: \`saluta\`** — \`saluta()\`
- **Uiți \`return\` și aștepți valoare** — Adaugă \`return\`
- **Confunzi \`console.log\` cu \`return\`** — \`console.log\` afișează, \`return\` întoarce

## 🎓 Ce ai învățat
- ✅ \`function nume(params) { ... }\`
- ✅ Arrow functions \`() => ...\`
- ✅ \`return\` întoarce o valoare
- ✅ Parametri impliciți
`,
    extraProblems: [
      mc('Apel funcție',
        'Cum apelezi funcția `saluta`?',
        ['saluta', 'saluta()', 'call saluta', 'run saluta'],
        'saluta()',
        'Numele + paranteze rotunde.',
        { topic: 'functions' }),
      mc('Arrow function',
        'Care e arrow function pentru `function dublu(n) { return n*2; }`?',
        ['function n => n*2', 'const dublu = n => n*2', 'arrow dublu(n) => n*2', '(n) => return n*2'],
        'const dublu = n => n*2',
        'Sintaxa: parametru → corp. Pentru o singură expresie, return e implicit.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      sa('Cuvânt cheie return',
        'Ce cuvânt cheie întoarce o valoare dintr-o funcție?',
        'return',
        '`return x` întoarce x și oprește execuția funcției.',
        { topic: 'functions' }),
      mc('console.log vs return',
        'Diferența între `console.log` și `return`?',
        ['Sunt la fel', '`console.log` afișează, `return` întoarce o valoare folosibilă', '`return` afișează', 'Niciuna nu există'],
        '`console.log` afișează, `return` întoarce o valoare folosibilă',
        '`return` produce o valoare pe care o poți pune într-o variabilă.',
        { topic: 'functions' }),
    ],
  },

  // ============ 18. functii-avansat-js ============
  'functii-avansat-js': {
    theory: `# 🚀 Funcții — nivel avansat

## 🎯 1. Funcții ca valori

În JS, funcțiile sunt **valori** — pot fi puse în variabile, transmise ca argumente, returnate.

\`\`\`javascript
const a = function() { return 5; };
const b = a;     // b e ACUM funcția
console.log(b());  // 5
\`\`\`

## 🎯 2. Callback — funcție ca argument

\`\`\`javascript
function executa(f) {
    return f(10);
}
executa(x => x * 2);    // 20
\`\`\`

## 🎯 3. Closure — "memorie" în funcții

\`\`\`javascript
function contor() {
    let n = 0;
    return function() {
        n++;
        return n;
    };
}
const c = contor();
c();   // 1
c();   // 2
c();   // 3
\`\`\`

> 💡 Funcția returnată își amintește variabila \`n\` din afară!

## 🎯 4. Rest parameters \`...args\`

\`\`\`javascript
function suma(...nums) {
    return nums.reduce((a, b) => a + b, 0);
}
suma(1, 2, 3, 4, 5);   // 15
\`\`\`

## 🎯 5. Spread operator \`...\`

\`\`\`javascript
const a = [1, 2, 3];
const b = [...a, 4, 5];   // [1, 2, 3, 4, 5]

function f(x, y, z) { return x + y + z; }
f(...a);   // f(1, 2, 3) = 6
\`\`\`

## 🎯 6. Destructuring

\`\`\`javascript
function info({nume, varsta}) {
    return \`\${nume} are \${varsta} ani\`;
}
info({nume: "Ana", varsta: 11});
\`\`\`

## 🎯 7. Funcție recursivă

Se apelează pe sine!

\`\`\`javascript
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
factorial(5);    // 120
\`\`\`

## ⚠️ Recursie — atenție!

Trebuie un **caz de bază** care oprește, altfel **stack overflow** 💥.

## 🎓 Ce ai învățat
- ✅ Funcții ca valori
- ✅ Callbacks
- ✅ Closures
- ✅ Rest & spread \`...\`
- ✅ Recursie
`,
    extraProblems: [
      mc('Callback',
        'Ce este un "callback"?',
        ['O funcție apelată mai târziu, transmisă ca argument', 'Un return rapid', 'Un loop', 'Un tip de variabilă'],
        'O funcție apelată mai târziu, transmisă ca argument',
        'Callback = funcție pasată altei funcții, pentru a fi apelată "în spate".',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      sa('Spread',
        'Ce simbol JS "împrăștie" un array în argumente individuale? (3 caractere)',
        '...',
        '`...arr` transformă array-ul în argumente separate.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      mc('Recursie',
        'Ce e ESENȚIAL într-o funcție recursivă?',
        ['Să nu aibă parametri', 'Un caz de bază care oprește recursia', 'Multe variabile', 'Un loop'],
        'Un caz de bază care oprește recursia',
        'Fără caz de bază → recursie infinită → stack overflow.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      mc('Closure',
        'Ce e un closure?',
        ['O funcție închisă', 'O funcție care își amintește variabilele din scopul în care a fost creată', 'O eroare', 'Un loop'],
        'O funcție care își amintește variabilele din scopul în care a fost creată',
        'Closures permit funcției să acceseze variabile "din afară" chiar și după ce funcția exterioară a terminat.',
        { topic: 'functions', difficulty: 'HARD' }),
    ],
  },

  // ============ 19. erori-js ============
  'erori-js': {
    theory: `# 🛡️ Erori și \`try / catch\` în JS

Erorile sunt **normale** în programare. Le **prindem** ca să nu strice tot 🥅.

## 🐛 Tipuri comune de erori

- **\`SyntaxError\`** — Cod scris greșit
- **\`ReferenceError\`** — Variabilă neexistentă
- **\`TypeError\`** — Tip greșit (\`null.f()\`)
- **\`RangeError\`** — Valoare în afara intervalului

## 🎯 Sintaxa \`try / catch\`

\`\`\`javascript
try {
    let x = JSON.parse("nu e json");
} catch (err) {
    console.log("Eroare:", err.message);
}
console.log("Programul continuă!");
\`\`\`

## 🎯 \`finally\` — rulează întotdeauna

\`\`\`javascript
try {
    // cod riscant
} catch (err) {
    console.log("Eroare:", err);
} finally {
    console.log("Curățenie!");
}
\`\`\`

## 🎯 Aruncarea propriilor erori — \`throw\`

\`\`\`javascript
function imparte(a, b) {
    if (b === 0) {
        throw new Error("Nu pot împărți la 0!");
    }
    return a / b;
}

try {
    console.log(imparte(10, 0));
} catch (e) {
    console.log("Atenție:", e.message);
}
\`\`\`

## 🎯 Obiectul Error

\`\`\`javascript
err.name      // "Error"
err.message   // mesajul
err.stack     // unde s-a întâmplat
\`\`\`

## ⚠️ Greșeli frecvente

- **Pui mult cod în \`try\`** — Doar codul **riscant**
- **Înghiți eroarea: \`catch (e) {}\`** — Loghează măcar: \`console.log(e)\`
- **\`throw "text"\`** — \`throw new Error("text")\` (mai bun)

## 🎓 Ce ai învățat
- ✅ Tipuri de erori comune
- ✅ \`try / catch / finally\`
- ✅ \`throw new Error\`
- ✅ Proprietățile obiectului Error
`,
    extraProblems: [
      mc('Variabilă inexistentă',
        'Ce eroare apare la `console.log(x)` când x nu există?',
        ['SyntaxError', 'ReferenceError', 'TypeError', 'NameError'],
        'ReferenceError',
        'JavaScript nu cunoaște variabila → ReferenceError.',
        { topic: 'errors' }),
      sa('Cuvânt cheie capturare',
        'Ce cuvânt cheie prinde erorile dintr-un block try?',
        'catch',
        '`catch (err) { ... }` prinde erorile din try.',
        { topic: 'errors' }),
      mc('finally',
        'Când rulează finally?',
        ['Doar dacă e eroare', 'Doar dacă NU e eroare', 'Întotdeauna', 'Niciodată'],
        'Întotdeauna',
        '`finally` rulează indiferent dacă a fost eroare sau nu — perfect pentru curățare.',
        { topic: 'errors' }),
      mc('throw',
        'Care e cea mai bună practică pentru a arunca o eroare?',
        ['throw "ceva"', 'throw new Error("ceva")', 'throw 42', 'return error'],
        'throw new Error("ceva")',
        'Obiectele Error au proprietăți utile (message, stack).',
        { topic: 'errors', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 20. dom ============
  'dom': {
    theory: `# 🌐 DOM — JavaScript și pagina web

**DOM** = Document Object Model = pagina HTML văzută ca obiecte pe care JS le poate **schimba** 🪄.

Imaginează-ți pagina ca un copac de elemente, iar JS poate **crea**, **modifica**, **șterge** crengi 🌳.

## 🔍 Selectarea elementelor

\`\`\`javascript
// Prin ID (cel mai rapid)
let titlu = document.getElementById("titlu");

// Prin clasă
let butoane = document.getElementsByClassName("btn");

// Prin tag
let toateP = document.getElementsByTagName("p");

// Modern — selector CSS (recomandat)
let h = document.querySelector("h1");
let toateH = document.querySelectorAll(".titlu");
\`\`\`

## ✏️ Modificarea conținutului

\`\`\`javascript
let el = document.querySelector("#titlu");
el.textContent = "Titlu nou";       // doar text
el.innerHTML = "<b>Bold</b>";       // text + HTML (atenție!)
el.value = "ceva";                   // pentru input
\`\`\`

## 🎨 Modificarea stilului

\`\`\`javascript
el.style.color = "red";
el.style.fontSize = "24px";
el.style.backgroundColor = "yellow";
\`\`\`

## 🏷️ Adăugare / ștergere clase

\`\`\`javascript
el.classList.add("activ");
el.classList.remove("ascuns");
el.classList.toggle("dark");
el.classList.contains("activ");   // true/false
\`\`\`

## 🖱️ Event listeners

\`\`\`javascript
let btn = document.querySelector("#buton");
btn.addEventListener("click", () => {
    alert("Salut!");
});
\`\`\`

- **\`click\`** — clic mouse
- **\`mouseover\`** — mouse deasupra
- **\`keydown\`** — apasă tastă
- **\`submit\`** — trimitere formular
- **\`change\`** — input se schimbă

## ➕ Creare elemente noi

\`\`\`javascript
let nou = document.createElement("p");
nou.textContent = "Salut!";
document.body.appendChild(nou);
\`\`\`

## ➖ Ștergere

\`\`\`javascript
el.remove();
\`\`\`

## 🎯 Exemplu complet: contor

\`\`\`html
<button id="btn">Click</button>
<p id="cnt">0</p>
\`\`\`

\`\`\`javascript
let n = 0;
document.querySelector("#btn").addEventListener("click", () => {
    n++;
    document.querySelector("#cnt").textContent = n;
});
\`\`\`

## 🎓 Ce ai învățat
- ✅ Selectare cu \`querySelector\`
- ✅ Modificare text, HTML, stil
- ✅ \`classList\` pentru clase
- ✅ \`addEventListener\` pentru evenimente
- ✅ Creare/ștergere elemente
`,
    extraProblems: [
      mc('Selector modern',
        'Care e metoda modernă recomandată pentru selectare?',
        ['getElementById', 'querySelector', 'getById', 'select'],
        'querySelector',
        '`querySelector` acceptă orice selector CSS și e standard modern.',
        { topic: 'dom' }),
      mc('Schimbă text',
        'Ce proprietate e SIGURĂ pentru schimbarea textului unui element?',
        ['innerHTML', 'textContent', 'value', 'innerText'],
        'textContent',
        '`textContent` doar text, fără interpretare HTML — sigur împotriva XSS.',
        { topic: 'dom', difficulty: 'MEDIUM' }),
      sa('Eveniment click',
        'Ce metodă atașează un eveniment click pe un element?',
        'addEventListener',
        '`el.addEventListener("click", function)` — modern și flexibil.',
        { topic: 'dom' }),
      mc('Creare element',
        'Care e funcția pentru a crea un element nou?',
        ['document.create', 'document.createElement', 'new Element', 'document.add'],
        'document.createElement',
        '`document.createElement("div")` creează elementul, apoi `appendChild` îl atașează.',
        { topic: 'dom' }),
    ],
  },

}
