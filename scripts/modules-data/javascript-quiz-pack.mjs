// Quiz pack pentru JavaScript — completează fiecare lecție la min 10 probleme.

import { mc, sa } from './helpers.mjs'

// ============================================================
// 1. introducere-console-log  (5 → +5)
// ============================================================
const introducereJsQuiz = [
  sa(
    'Funcția pentru afișare',
    'Care e instrucțiunea standard pentru a afișa text în consolă în JavaScript? (sintaxa completă cu paranteze și un argument string `"hi"`, fără punct și virgulă)',
    'console.log("hi")',
    '`console.log()` e funcția standard de afișare în JavaScript.',
    { topic: 'console' }
  ),
  mc(
    'Punct și virgulă',
    'Punctul și virgula `;` la sfârșitul unei instrucțiuni JS este…',
    ['Obligatoriu întotdeauna', 'Opțional, recomandat', 'Interzis', 'Doar pentru funcții'],
    'Opțional, recomandat',
    'JavaScript are ASI (Automatic Semicolon Insertion). Recomandat să-l pui pentru claritate.',
    { topic: 'sintaxa', difficulty: 'MEDIUM' }
  ),
  mc(
    'Comentariu o linie',
    'Cum scrii un comentariu pe o singură linie în JS?',
    ['# comentariu', '// comentariu', '/* comentariu */', '<!-- comentariu -->'],
    '// comentariu',
    'JS folosește `//` pentru o linie și `/* ... */` pentru mai multe.',
    { topic: 'comentarii' }
  ),
  mc(
    'Comentariu multi-linie',
    'Care variantă deschide un comentariu pe mai multe linii?',
    ['#', '//', '/*', '<!--'],
    '/*',
    'Comentariile multi-linie încep cu `/*` și se închid cu `*/`.',
    { topic: 'comentarii' }
  ),
  mc(
    'Case sensitive',
    'JavaScript este case-sensitive (face diferența între majuscule și minuscule)?',
    ['Da', 'Nu', 'Doar pentru variabile', 'Doar pentru funcții'],
    'Da',
    '`mesaj` și `Mesaj` sunt variabile DIFERITE în JavaScript.',
    { topic: 'sintaxa' }
  ),
]

// ============================================================
// 2. variabile  (5 → +5)
// ============================================================
const variabileJsQuiz = [
  mc(
    'Cuvinte cheie',
    'Care 3 cuvinte cheie pot declara o variabilă în JS modern?',
    ['var, let, const', 'int, float, string', 'def, var, let', 'declare, set, fix'],
    'var, let, const',
    'Modern (ES6+): preferă `let` și `const`. `var` e legacy.',
    { topic: 'variabile' }
  ),
  mc(
    'const',
    'Ce face `const PI = 3.14;`?',
    ['Variabilă care se poate modifica', 'Constantă — nu poate fi reasignată', 'Doar număr întreg', 'Variabilă globală'],
    'Constantă — nu poate fi reasignată',
    '`const` blochează **reasignarea** referinței.',
    { topic: 'variabile' }
  ),
  mc(
    'let scope',
    'Variabilele declarate cu `let` au scope…',
    ['global', 'de funcție', 'de bloc { }', 'de fișier'],
    'de bloc { }',
    '`let` și `const` sunt block-scoped. `var` e function-scoped.',
    { topic: 'variabile', difficulty: 'MEDIUM' }
  ),
  mc(
    'Reasignare const',
    'Ce se întâmplă cu `const x = 5; x = 10;`?',
    ['x devine 10', 'TypeError', 'Avertisment', 'Niciun efect'],
    'TypeError',
    'Reasignarea unei constante aruncă `TypeError`.',
    { topic: 'variabile' }
  ),
  mc(
    'Hoisting',
    'Care declarație este „hoisted" și inițializată cu `undefined`?',
    ['let', 'const', 'var', 'class'],
    'var',
    '`var` e hoisted la începutul scope-ului cu valoarea `undefined`. `let`/`const` sunt hoisted dar în „temporal dead zone".',
    { topic: 'variabile', difficulty: 'HARD' }
  ),
]

// ============================================================
// 3. input-interactiune  (8 → +2)
// ============================================================
const inputJsQuiz = [
  mc(
    'prompt() returnează…',
    'Ce tip returnează `prompt(...)` în browser?',
    ['number', 'string', 'boolean', 'object'],
    'string',
    '`prompt()` returnează ÎNTOTDEAUNA string (sau `null` dacă userul anulează).',
    { topic: 'input' }
  ),
  mc(
    'Diferența alert vs prompt',
    'Care e diferența între `alert()` și `prompt()`?',
    ['Niciuna', '`alert` doar afișează, `prompt` cere input', 'Sintaxa diferă', '`prompt` e mai rapid'],
    '`alert` doar afișează, `prompt` cere input',
    '`alert` = mesaj. `prompt` = mesaj + input box.',
    { topic: 'input' }
  ),
]

// ============================================================
// 4. operatori-js  (9 → +1)
// ============================================================
const operatoriJsQuiz = [
  mc(
    '=== vs ==',
    'Care e diferența între `===` și `==` în JS?',
    ['Niciuna', '`===` verifică valoare ȘI tip; `==` doar valoare cu coerciție', '`==` e mai sigur', '`===` e doar pentru numere'],
    '`===` verifică valoare ȘI tip; `==` doar valoare cu coerciție',
    'Recomandat: folosește mereu `===` (strict equality) ca să eviți surprize.',
    { topic: 'operatori', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 8. while-js-part2  (4 → +6)
// ============================================================
const whileJsPart2Quiz = [
  mc(
    'break în while',
    'Ce face `break` într-un `while`?',
    ['Sare iterația', 'Iese din buclă imediat', 'Restartează bucla', 'Pune pe pauză'],
    'Iese din buclă imediat',
    '`break` oprește bucla. `continue` sare doar iterația curentă.',
    { topic: 'while', tags: ['break'] }
  ),
  mc(
    'continue',
    'Ce face `continue` într-un `while`?',
    ['Iese din buclă', 'Sare la următoarea iterație', 'Repornește programul', 'Termină funcția'],
    'Sare la următoarea iterație',
    'Restul codului din iterație e sărit; condiția se re-evaluează.',
    { topic: 'while', tags: ['continue'] }
  ),
  mc(
    'Buclă infinită',
    'Care declarație creează o buclă infinită neintenționată?',
    ['`let i=0; while (i<5) { console.log(i); }`', '`while (false) {}`', '`for (let i=0; i<5; i++) {}`', '`do { i++; } while (i<5);`'],
    '`let i=0; while (i<5) { console.log(i); }`',
    'Lipsește `i++` → `i` rămâne 0, condiția mereu adevărată.',
    { topic: 'while', difficulty: 'MEDIUM' }
  ),
  sa(
    'Operator combinat',
    'Cum scrii prescurtat `i = i + 1` în JS? (cea mai scurtă variantă, doar operatorul aplicat lui `i`)',
    'i++',
    '`i++` e cel mai scurt — increment unitar.',
    { topic: 'while' }
  ),
  mc(
    'do...while',
    'Ce diferență are `do { ... } while (cond)` față de `while (cond) { ... }`?',
    ['Niciuna', 'do...while rulează MĂCAR o dată', 'do...while e mai rapid', 'do...while doar pentru numere'],
    'do...while rulează MĂCAR o dată',
    '`do...while` verifică condiția DUPĂ corp, deci execută cel puțin o dată.',
    { topic: 'while', difficulty: 'MEDIUM' }
  ),
  mc(
    'Câte iterații?',
    'Câte numere afișează:\n```javascript\nlet i = 1;\nwhile (i <= 5) {\n  console.log(i);\n  i++;\n}\n```',
    ['4', '5', '6', 'Buclă infinită'],
    '5',
    'Afișează 1, 2, 3, 4, 5.',
    { topic: 'while' }
  ),
]

// ============================================================
// 9. while-true-js  (5 → +5)
// ============================================================
const whileTrueJsQuiz = [
  mc(
    'Cum oprești while(true)',
    'Cum ieși dintr-o buclă `while (true) { ... }`?',
    ['stop', 'exit', 'break', 'return false'],
    'break',
    '`break` e standard pentru ieșire din buclă infinită.',
    { topic: 'while-true' }
  ),
  mc(
    'Truthy values',
    'Care valoare NU e „truthy" (nu intră în `if (val)`)?',
    ['1', '"text"', '0', '[1]'],
    '0',
    '`0`, `""`, `null`, `undefined`, `NaN`, `false` sunt „falsy". Restul sunt truthy.',
    { topic: 'bool', difficulty: 'MEDIUM' }
  ),
  mc(
    'while(1)',
    'În JS, `while (1) { ... }` este…',
    ['Eroare de sintaxă', 'Buclă infinită (1 e truthy)', 'Rulează o singură dată', 'Echivalent cu while(0)'],
    'Buclă infinită (1 e truthy)',
    'Numărul 1 e truthy → bucla rulează la nesfârșit.',
    { topic: 'while-true' }
  ),
  sa(
    'Validare input',
    'Ce cuvânt cheie sare la următoarea iterație într-un `while (true)` (ex: input greșit)?',
    'continue',
    '`continue` repornește bucla de la condiție.',
    { topic: 'while-true' }
  ),
  mc(
    'Risk de break uitat',
    'Ce se întâmplă dacă uiți `break` într-un `while (true)`?',
    ['JS adaugă break automat', 'Programul rulează la nesfârșit', 'Eroare de sintaxă', 'Programul se închide'],
    'Programul rulează la nesfârșit',
    'Browserul poate îngheța — programul nu se va opri singur.',
    { topic: 'while-true' }
  ),
]

// ============================================================
// 10. while-true-practica-js  (9 → +1)
// ============================================================
const whileTruePracticaJsQuiz = [
  mc(
    '3 încercări',
    'Pentru exact 3 încercări de parolă, ce structură folosești?',
    ['for (let i=0; i<3; i++)', 'while(true) fără contor', 'if(i==3) break', 'do...while infinit'],
    'for (let i=0; i<3; i++)',
    'Pentru număr FIX → `for`. Pentru necunoscut → `while`.',
    { topic: 'while-true', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 11. for-js  (5 → +5)
// ============================================================
const forJsQuiz = [
  mc(
    'Sintaxa for clasică',
    'Care e sintaxa corectă pentru un for în JS?',
    ['for i in range(5):', 'for (let i = 0; i < 5; i++) {}', 'for i=0 to 5 {}', 'foreach i (0..5) {}'],
    'for (let i = 0; i < 5; i++) {}',
    'Trei părți: inițializare, condiție, increment, separate cu `;`.',
    { topic: 'for' }
  ),
  mc(
    'Câte iterații?',
    'Câte ori se execută corpul:\n```javascript\nfor (let i = 0; i < 5; i++) { /* ... */ }\n```',
    ['4', '5', '6', '0'],
    '5',
    'Iterăm pentru i = 0, 1, 2, 3, 4 → 5 iterații.',
    { topic: 'for' }
  ),
  mc(
    'for...of',
    'Ce face `for (const x of arr)` pentru `arr = [10, 20, 30]`?',
    ['Iterează indici 0,1,2', 'Iterează valori 10, 20, 30', 'Eroare', 'Returnează un nou array'],
    'Iterează valori 10, 20, 30',
    '`for...of` parcurge VALORILE iterabilului (array, string, etc.).',
    { topic: 'for', difficulty: 'MEDIUM' }
  ),
  mc(
    'for...in',
    'Pentru un OBIECT `obj = {a:1, b:2}`, ce face `for (const k in obj)`?',
    ['Iterează valorile', 'Iterează cheile', 'Eroare', 'Iterează perechi'],
    'Iterează cheile',
    '`for...in` enumeră CHEILE proprietăților unui obiect.',
    { topic: 'for', difficulty: 'MEDIUM' }
  ),
  mc(
    'Decrement în for',
    'Cum scrii un for care numără invers de la 5 la 1?',
    [
      'for (let i=5; i>=1; i--)',
      'for (let i=1; i<=5; i++)',
      'for (let i=5; i--)',
      'for (let i=5; i>0; i+=)',
    ],
    'for (let i=5; i>=1; i--)',
    'Pornim de la 5, oprim când e mai mic decât 1, decrementăm.',
    { topic: 'for' }
  ),
]

// ============================================================
// 12. for-vs-while-js  (9 → +1)
// ============================================================
const forVsWhileJsQuiz = [
  mc(
    'Necunoscut iterații',
    'Citește numere până la 0. Folosești…',
    ['for', 'while', 'if', 'switch'],
    'while',
    'Necunoscut → `while`. Cunoscut → `for`.',
    { topic: 'for-vs-while' }
  ),
]

// ============================================================
// 13. nested-loops-js  (5 → +5)
// ============================================================
const nestedJsQuiz = [
  mc(
    'Câte iterații totale?',
    'Câte ori rulează `console.log(...)` în:\n```javascript\nfor (let i=0; i<3; i++)\n  for (let j=0; j<4; j++)\n    console.log(i, j);\n```',
    ['7', '12', '3', '4'],
    '12',
    '3 × 4 = 12.',
    { topic: 'nested', difficulty: 'MEDIUM' }
  ),
  mc(
    'Tabla 3×3',
    'Care variantă afișează tabla de înmulțire 3×3?',
    [
      'for(i=1;i<=3;i++) console.log(i*i)',
      'for(i=1;i<=3;i++) for(j=1;j<=3;j++) console.log(i*j)',
      'for(i,j of [1,2,3]) console.log(i*j)',
      'while(i<3) console.log(i)',
    ],
    'for(i=1;i<=3;i++) for(j=1;j<=3;j++) console.log(i*j)',
    'Două for-uri imbricate.',
    { topic: 'nested', difficulty: 'MEDIUM' }
  ),
  mc(
    'break în nested',
    'Un `break` într-un for intern oprește…',
    ['Tot programul', 'Doar bucla internă', 'Ambele bucle', 'Funcția'],
    'Doar bucla internă',
    'Pentru a sări din ambele, ai nevoie de `label` sau `return`.',
    { topic: 'nested', difficulty: 'MEDIUM' }
  ),
  mc(
    'Matrice 2D',
    'Pentru a parcurge o matrice (array de array-uri) folosim…',
    ['Un singur for', 'Două for-uri imbricate', 'while infinit', 'Recursie'],
    'Două for-uri imbricate',
    'Una pentru rânduri, una pentru coloane.',
    { topic: 'nested' }
  ),
  sa(
    'Variabilă exterioară',
    'Convențional, ce literă folosim pentru variabila buclei EXTERIOARE? (o literă)',
    'i',
    'Convenția `i, j, k` pentru bucle imbricate.',
    { topic: 'nested' }
  ),
]

// ============================================================
// 15. arrays-operatii  (9 → +1)
// ============================================================
const arraysOpQuiz = [
  mc(
    'Lungime',
    'Cum afli lungimea array-ului `[1,2,3]`?',
    ['len([1,2,3])', '[1,2,3].size', '[1,2,3].length', 'count([1,2,3])'],
    '[1,2,3].length',
    '`.length` e proprietate a array-urilor.',
    { topic: 'arrays' }
  ),
]

// ============================================================
// 16. arrays-random  (5 → +5)
// ============================================================
const arraysRandomQuiz = [
  mc(
    'Math.random()',
    'Ce returnează `Math.random()`?',
    ['Întreg între 0 și 100', 'Float în [0, 1)', 'Float în [0, 100)', 'NaN'],
    'Float în [0, 1)',
    'Returnează un float între 0 (inclusiv) și 1 (exclusiv).',
    { topic: 'random' }
  ),
  sa(
    'Întreg în interval',
    'Completează: pentru un întreg între 1 și 10 inclusiv, folosim `Math.____(Math.random() * 10) + 1`.',
    'floor',
    '`Math.floor` rotunjește în jos.',
    { topic: 'random' }
  ),
  mc(
    'Selecție din array',
    'Cum alegi aleator un element din `arr = [1,2,3]`?',
    [
      'arr.random()',
      'arr[Math.floor(Math.random() * arr.length)]',
      'Math.choice(arr)',
      'arr.pick()',
    ],
    'arr[Math.floor(Math.random() * arr.length)]',
    'JS nu are funcție built-in pentru asta — combinăm `random` + `floor` + `length`.',
    { topic: 'random', difficulty: 'MEDIUM' }
  ),
  mc(
    'Math.round',
    'Ce face `Math.round(2.5)`?',
    ['2', '3', '2.5', 'NaN'],
    '3',
    '`round` rotunjește la cel mai apropiat întreg (la jumătate, în sus).',
    { topic: 'random' }
  ),
  mc(
    'Math.ceil',
    'Ce face `Math.ceil(2.1)`?',
    ['2', '3', '2.1', '0'],
    '3',
    '`ceil` rotunjește mereu în SUS.',
    { topic: 'random' }
  ),
]

// ============================================================
// 17. arrays-loop  (5 → +5)
// ============================================================
const arraysLoopQuiz = [
  mc(
    'forEach',
    'Ce face `arr.forEach(x => console.log(x))`?',
    ['Returnează array nou', 'Iterează și aplică funcția pe fiecare element', 'Sortează', 'Filtrează'],
    'Iterează și aplică funcția pe fiecare element',
    '`forEach` doar iterează — NU returnează nimic.',
    { topic: 'arrays-loop' }
  ),
  mc(
    'map',
    'Ce returnează `[1,2,3].map(x => x*2)`?',
    ['[1,2,3]', '[2,4,6]', '6', 'undefined'],
    '[2,4,6]',
    '`map` returnează un array NOU cu rezultatele aplicării funcției.',
    { topic: 'arrays-loop', difficulty: 'MEDIUM' }
  ),
  mc(
    'filter',
    'Ce returnează `[1,2,3,4].filter(x => x > 2)`?',
    ['[1,2]', '[3,4]', '[2,3,4]', '[1,2,3,4]'],
    '[3,4]',
    '`filter` păstrează DOAR elementele pentru care funcția returnează `true`.',
    { topic: 'arrays-loop', difficulty: 'MEDIUM' }
  ),
  mc(
    'reduce',
    'Ce returnează `[1,2,3].reduce((a,b) => a+b, 0)`?',
    ['1', '6', '[1,2,3]', '0'],
    '6',
    '`reduce` acumulează: 0+1=1, 1+2=3, 3+3=6.',
    { topic: 'arrays-loop', difficulty: 'HARD' }
  ),
  mc(
    'includes',
    'Ce returnează `[1,2,3].includes(2)`?',
    ['true', 'false', '1', '2'],
    'true',
    '`includes` returnează un bool.',
    { topic: 'arrays-loop' }
  ),
]

// ============================================================
// 18. algoritmi-js  (5 → +5)
// ============================================================
const algoritmiJsQuiz = [
  mc(
    'Maximum',
    'Cum afli max-ul unui array `arr`?',
    ['arr.max()', 'Math.max(...arr)', 'max(arr)', 'arr.maximum'],
    'Math.max(...arr)',
    '`...arr` (spread) desfășoară array-ul în argumente individuale.',
    { topic: 'algoritmi', difficulty: 'MEDIUM' }
  ),
  mc(
    'Sortare',
    'Cum sortezi crescător `arr` (numere)?',
    ['arr.sort()', 'arr.sort((a,b) => a-b)', 'arr.order()', 'arr.asc()'],
    'arr.sort((a,b) => a-b)',
    '`sort()` fără comparator sortează ca string-uri! Pentru numere e nevoie de comparator.',
    { topic: 'algoritmi', difficulty: 'MEDIUM' }
  ),
  mc(
    'Inversare',
    'Cum inversezi un array `arr` în loc?',
    ['arr.reverse()', 'reverse(arr)', 'arr.flip()', 'arr[::-1]'],
    'arr.reverse()',
    '`reverse()` modifică array-ul direct.',
    { topic: 'algoritmi' }
  ),
  mc(
    'Find',
    'Ce returnează `[1,2,3,4].find(x => x > 2)`?',
    ['[3,4]', '3', '2', 'true'],
    '3',
    '`find` returnează PRIMUL element care satisface condiția.',
    { topic: 'algoritmi', difficulty: 'MEDIUM' }
  ),
  mc(
    'every / some',
    'Ce returnează `[2,4,6].every(x => x % 2 === 0)`?',
    ['true', 'false', '[2,4,6]', '0'],
    'true',
    '`every` = TOATE satisfac. `some` = CEL PUȚIN UNUL.',
    { topic: 'algoritmi', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 20. text-validare-js  (4 → +6)
// ============================================================
const textValidareJsQuiz = [
  mc(
    'Conversie la lowercase',
    'Cum convertești `"ABC"` la lowercase?',
    ['"ABC".lower()', '"ABC".toLowerCase()', '"ABC".lowercase()', 'lower("ABC")'],
    '"ABC".toLowerCase()',
    'JS folosește `toLowerCase()` (camelCase).',
    { topic: 'string' }
  ),
  mc(
    'Lungime',
    'Cum afli lungimea string-ului `"hello"`?',
    ['len("hello")', '"hello".length', '"hello".size', '"hello".count'],
    '"hello".length',
    '`.length` e proprietate.',
    { topic: 'string' }
  ),
  mc(
    'Verifică doar cifre',
    'Cea mai concisă cale de a verifica că `s` conține doar cifre?',
    ['s.isdigit()', '/^[0-9]+$/.test(s)', 's.match("0-9")', 'isNumber(s)'],
    '/^[0-9]+$/.test(s)',
    'Regex e standardul JS pentru asemenea validări.',
    { topic: 'regex', difficulty: 'MEDIUM' }
  ),
  mc(
    'startsWith',
    'Ce returnează `"abcdef".startsWith("abc")`?',
    ['true', 'false', '0', '"abc"'],
    'true',
    '`startsWith` returnează un bool.',
    { topic: 'string' }
  ),
  mc(
    'endsWith',
    'Ce returnează `"file.txt".endsWith(".txt")`?',
    ['true', 'false', '4', '".txt"'],
    'true',
    'Util pentru verificare extensii fișiere.',
    { topic: 'string' }
  ),
  mc(
    'replaceAll',
    'Ce returnează `"a-b-c".replaceAll("-", "_")`?',
    ['"a-b-c"', '"a_b-c"', '"a_b_c"', 'Eroare'],
    '"a_b_c"',
    '`replaceAll` înlocuiește TOATE aparițiile. `replace` doar prima.',
    { topic: 'string', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 21. pizzeria-exersare-js  (3 → +7)
// ============================================================
const pizzeriaJsQuiz = [
  mc(
    'switch vs else if',
    'Pentru codurile A-H, ce alternativă curată la lanțul de else if există?',
    ['if/else infinit', 'switch (cod) { case "A": ... }', 'while', 'for'],
    'switch (cod) { case "A": ... }',
    '`switch` e ideal când compari aceeași valoare cu mai multe constante.',
    { topic: 'pizzerie', difficulty: 'MEDIUM' }
  ),
  sa(
    'Cuvânt cheie',
    'În switch, ce cuvânt cheie marchează cazul implicit (când niciun case nu se potrivește)?',
    'default',
    '`default:` la final, ca `else`.',
    { topic: 'pizzerie' }
  ),
  mc(
    'break în switch',
    'De ce e nevoie de `break;` la sfârșitul fiecărui case?',
    ['Pentru frumusețe', 'Altfel cazurile următoare se execută (fall-through)', 'Pentru viteză', 'Nu e nevoie'],
    'Altfel cazurile următoare se execută (fall-through)',
    'Fără `break`, JS continuă cu case-ul următor — comportament periculos.',
    { topic: 'pizzerie', difficulty: 'MEDIUM' }
  ),
  mc(
    'Iterare comandă',
    'Cum parcurgi fiecare caracter din `comanda = "ABC"`?',
    ['for (const c of comanda)', 'for (const c in comanda)', 'comanda.each(c => ...)', 'while(comanda)'],
    'for (const c of comanda)',
    '`for...of` iterează valorile. `for...in` ar da indicii.',
    { topic: 'pizzerie' }
  ),
  mc(
    'Fără duplicate',
    'Pentru a păstra doar prima apariție a fiecărui cod, ce verificare folosim?',
    ['if (lista.has(cod))', 'if (!lista.includes(cod))', 'if (lista == cod)', 'if (lista.find(cod))'],
    'if (!lista.includes(cod))',
    '`.includes()` returnează bool. Negăm pentru „dacă NU există".',
    { topic: 'pizzerie' }
  ),
  mc(
    'Set pentru unicitate',
    'Care structură garantează automat valori UNICE?',
    ['Array', 'Object', 'Set', 'Map'],
    'Set',
    '`new Set([1,1,2,3])` → Set cu 3 elemente: 1, 2, 3.',
    { topic: 'pizzerie', difficulty: 'MEDIUM' }
  ),
  sa(
    'Lookup în obiect',
    'Cum obții valoarea pentru cheia `"A"` din `meniu = {A: "pizza"}`?',
    'meniu["A"]',
    'Sau `meniu.A` (dot notation).',
    { topic: 'pizzerie' }
  ),
]

// ============================================================
// 23. functii-basic-js  (5 → +5)
// ============================================================
const functiiBasicJsQuiz = [
  sa(
    'Cuvântul cheie',
    'Cu ce cuvânt cheie definești o funcție clasică în JS?',
    'function',
    '`function nume(...) { ... }` — declarație clasică.',
    { topic: 'functii' }
  ),
  mc(
    'Sintaxă declarație',
    'Care variantă declară corect funcția `salut(nume)`?',
    ['def salut(nume) {}', 'function salut(nume) {}', 'fn salut(nume) =>', 'salut(nume) = {}'],
    'function salut(nume) {}',
    'JS: `function nume(parametri) { corp }`.',
    { topic: 'functii' }
  ),
  mc(
    'Returnare',
    'Cum returnezi o valoare dintr-o funcție?',
    ['print x', 'return x', 'give x', 'yield x'],
    'return x',
    '`return` întoarce valoarea către apelator.',
    { topic: 'functii' }
  ),
  mc(
    'Funcție fără return',
    'Ce returnează implicit o funcție fără `return`?',
    ['null', '0', 'undefined', '""'],
    'undefined',
    'Spre deosebire de Python (`None`), JS folosește `undefined`.',
    { topic: 'functii' }
  ),
  mc(
    'Apel funcție',
    'Cum APELEZI funcția `salut(nume)` cu `"Ana"`?',
    ['salut Ana', 'call salut("Ana")', 'salut("Ana")', 'salut[Ana]'],
    'salut("Ana")',
    'Paranteze + argumente.',
    { topic: 'functii' }
  ),
]

// ============================================================
// 24. functii-avansat-js  (5 → +5)
// ============================================================
const functiiAvansatJsQuiz = [
  mc(
    'Arrow function',
    'Care variantă creează o arrow function ce dublează argumentul?',
    ['x => x*2', 'function (x) x*2', 'lambda x: x*2', '(x) -> x*2'],
    'x => x*2',
    'Sintaxă concisă pentru funcții simple.',
    { topic: 'functii-avansat' }
  ),
  mc(
    'Default parameter',
    'Care variantă are parametru cu valoare implicită 10?',
    ['function f(x = 10) {}', 'function f(x: 10) {}', 'function f(x | 10) {}', 'function f(x default 10) {}'],
    'function f(x = 10) {}',
    'Sintaxă identică cu Python: `nume = valoare`.',
    { topic: 'functii-avansat' }
  ),
  mc(
    'Rest parameters',
    'Ce face `function f(...args)`?',
    ['Eroare', 'Colectează toate argumentele într-un array', 'Forțează un singur argument', 'Spread'],
    'Colectează toate argumentele într-un array',
    '`...args` = rest pattern. În interiorul funcției, `args` e un array.',
    { topic: 'functii-avansat', difficulty: 'MEDIUM' }
  ),
  mc(
    'Callback',
    'Ce este o funcție callback?',
    ['Funcție care returnează callback', 'Funcție pasată ca argument la altă funcție', 'Funcție async', 'Funcție recursivă'],
    'Funcție pasată ca argument la altă funcție',
    'Ex: `arr.map(callback)`, `setTimeout(callback, 1000)`.',
    { topic: 'functii-avansat', difficulty: 'MEDIUM' }
  ),
  mc(
    'this în arrow',
    'Cum se comportă `this` într-o arrow function?',
    ['Întotdeauna `window`', 'Moștenit din scope-ul exterior', '`undefined`', 'Reasignabil'],
    'Moștenit din scope-ul exterior',
    'Arrow functions NU au propriul `this` — îl iau din contextul în care au fost create.',
    { topic: 'functii-avansat', difficulty: 'HARD' }
  ),
]

// ============================================================
// 25. erori-js  (5 → +5)
// ============================================================
const eroriJsQuiz = [
  mc(
    'Cuvinte cheie',
    'Care pereche de cuvinte cheie folosește JS pentru tratarea erorilor?',
    ['try / except', 'try / catch', 'try / handle', 'attempt / rescue'],
    'try / catch',
    'JS folosește `try { ... } catch (err) { ... }`.',
    { topic: 'erori' }
  ),
  mc(
    'Aruncă o eroare',
    'Cum arunci manual o eroare?',
    ['raise Error()', 'throw new Error("msg")', 'error("msg")', 'fail("msg")'],
    'throw new Error("msg")',
    'Cuvântul cheie `throw` + un obiect Error.',
    { topic: 'erori' }
  ),
  mc(
    'finally',
    'Când rulează blocul `finally`?',
    ['Doar dacă nu e eroare', 'ÎNTOTDEAUNA, eroare sau nu', 'Doar dacă există catch', 'Niciodată'],
    'ÎNTOTDEAUNA, eroare sau nu',
    '`finally` rulează garantat — pentru cleanup.',
    { topic: 'erori' }
  ),
  mc(
    'TypeError',
    'Ce situație generează `TypeError`?',
    ['Variabilă nedefinită', 'Apel pe `undefined`/`null`', 'Sintaxă greșită', 'Bucla infinită'],
    'Apel pe `undefined`/`null`',
    'Ex: `null.length` → `TypeError: Cannot read properties of null`.',
    { topic: 'erori', difficulty: 'MEDIUM' }
  ),
  mc(
    'JSON.parse pe text invalid',
    'Ce eroare aruncă `JSON.parse("nu-i json")`?',
    ['TypeError', 'SyntaxError', 'ValueError', 'JSONError'],
    'SyntaxError',
    'JSON invalid → `SyntaxError`.',
    { topic: 'erori', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 26. dom  (5 → +5)
// ============================================================
const domQuiz = [
  sa(
    'Acronim',
    'Ce înseamnă acronimul DOM? (3 cuvinte, separate prin spații)',
    'Document Object Model',
    'Reprezentarea în memorie a unei pagini HTML, accesibilă din JS.',
    { topic: 'dom' }
  ),
  mc(
    'Selectează după ID',
    'Cum selectezi elementul cu `id="titlu"`?',
    ['document.id("titlu")', 'document.getElementById("titlu")', 'document.querySelector(".titlu")', 'getElement("titlu")'],
    'document.getElementById("titlu")',
    'Sau `document.querySelector("#titlu")`.',
    { topic: 'dom' }
  ),
  mc(
    'querySelector',
    'Cum selectezi PRIMUL element cu clasa `btn`?',
    ['document.getClass("btn")', 'document.querySelector(".btn")', 'document.find("btn")', 'document.byClass("btn")'],
    'document.querySelector(".btn")',
    'Sintaxă similară CSS: `.` pentru clase, `#` pentru id.',
    { topic: 'dom' }
  ),
  mc(
    'Schimbă text',
    'Cum schimbi textul unui element `el`?',
    ['el.text = "..."', 'el.innerHTML = "..."', 'el.textContent = "..."', 'el.value = "..."'],
    'el.textContent = "..."',
    '`textContent` e modul recomandat (mai sigur decât `innerHTML`).',
    { topic: 'dom' }
  ),
  mc(
    'Event listener',
    'Cum atașezi un click pe `buton`?',
    ['buton.onClick(...)', 'buton.addEventListener("click", fn)', 'buton.click = fn', 'on(buton, "click", fn)'],
    'buton.addEventListener("click", fn)',
    'Standardul modern. Mai multe listenere posibile.',
    { topic: 'dom' }
  ),
]

// ============================================================
// EXPORT
// ============================================================
export const javascriptQuizPack = {
  appendProblems: {
    'introducere-console-log': introducereJsQuiz,
    'variabile': variabileJsQuiz,
    'input-interactiune': inputJsQuiz,
    'operatori-js': operatoriJsQuiz,
    'while-js-part2': whileJsPart2Quiz,
    'while-true-js': whileTrueJsQuiz,
    'while-true-practica-js': whileTruePracticaJsQuiz,
    'for-js': forJsQuiz,
    'for-vs-while-js': forVsWhileJsQuiz,
    'nested-loops-js': nestedJsQuiz,
    'arrays-operatii': arraysOpQuiz,
    'arrays-random': arraysRandomQuiz,
    'arrays-loop': arraysLoopQuiz,
    'algoritmi-js': algoritmiJsQuiz,
    'text-validare-js': textValidareJsQuiz,
    'pizzeria-exersare-js': pizzeriaJsQuiz,
    'functii-basic-js': functiiBasicJsQuiz,
    'functii-avansat-js': functiiAvansatJsQuiz,
    'erori-js': eroriJsQuiz,
    'dom': domQuiz,
  },
}
