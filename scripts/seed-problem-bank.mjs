// Probleme standalone (NU sunt legate de o lecție) — pentru banca de probleme
// folosită de generatorul de seturi și problemele random.
// Rulează: node scripts/seed-problem-bank.mjs

import { PrismaClient } from '@prisma/client'
import { mc, sa, io } from './modules-data/helpers.mjs'

const prisma = new PrismaClient()

// ===== PYTHON =====
const pythonBank = [
  mc('Tip rezultat', 'Care e tipul rezultatului `7 / 2` în Python 3?',
    ['int', 'float', 'string', 'bool'], 'float',
    'Operatorul `/` returnează **mereu** float în Python 3 (chiar și 4/2 = 2.0).',
    { topic: 'operators', difficulty: 'EASY', language: 'python' }),
  mc('Indexare listă', 'Ce returnează `[10,20,30][-1]`?',
    ['10', '20', '30', 'eroare'], '30',
    'Index negativ = de la coadă. -1 = ultimul.',
    { topic: 'lists', difficulty: 'EASY', language: 'python' }),
  mc('Slicing', 'Ce returnează `"abcdef"[1:4]`?',
    ['abc', 'bcd', 'bcde', 'cd'], 'bcd',
    'Slice [start:end] — end exclusiv. Indexii 1, 2, 3 → "bcd".',
    { topic: 'strings', difficulty: 'MEDIUM', language: 'python' }),
  sa('Lungime listă', 'Ce funcție returnează numărul de elemente dintr-o listă?', 'len',
    '`len(lista)` — funcție built-in pentru lungime.',
    { topic: 'lists', difficulty: 'EASY', language: 'python' }),
  io('Sumă pătrate', 'Calculează suma pătratelor numerelor 1, 2, 3, 4, 5 și afișează rezultatul.',
    '55', '1²+2²+3²+4²+5² = 1+4+9+16+25 = 55. `sum(i*i for i in range(1,6))`.',
    { topic: 'loops', difficulty: 'MEDIUM', language: 'python', starterCode: '# scrie aici' }),
  mc('Mutabil', 'Care **nu** e mutabil în Python?',
    ['list', 'dict', 'set', 'tuple'], 'tuple',
    'Tuple e imutabil — odată creat nu-l mai modifici.',
    { topic: 'types', difficulty: 'MEDIUM', language: 'python' }),
  mc('range(5)', 'Câte elemente generează `range(5)`?',
    ['4', '5', '6', '0'], '5',
    'range(n) generează 0, 1, 2, 3, 4 — n elemente.',
    { topic: 'loops', difficulty: 'EASY', language: 'python' }),
  mc('and', 'Ce afișează: `print(True and False or True)`?',
    ['True', 'False', 'eroare', 'None'], 'True',
    '`and` are prioritate mai mare → `(True and False) or True` = `False or True` = `True`.',
    { topic: 'boolean', difficulty: 'HARD', language: 'python' }),
  sa('Conversie int', 'Cum convertești string `"42"` la întreg?', 'int("42")',
    'Funcția built-in `int()` convertește string la număr.',
    { topic: 'types', difficulty: 'EASY', language: 'python' }),
  mc('dict access', 'Ce returnează `{"a": 1}.get("b", 0)`?',
    ['1', '0', 'None', 'eroare'], '0',
    '`.get(key, default)` returnează default dacă cheia lipsește.',
    { topic: 'dicts', difficulty: 'MEDIUM', language: 'python' }),
  mc('Strip', 'Ce face `"  ana  ".strip()`?',
    ['"ana"', '"  ana  "', '"ana  "', '"  ana"'], '"ana"',
    '`.strip()` elimină spațiile de la ambele capete.',
    { topic: 'strings', difficulty: 'EASY', language: 'python' }),
  io('FizzBuzz mini', 'Afișează numerele 1-5, dar înlocuiește multiplii de 3 cu "Fizz". Pe linii separate.',
    '1\n2\nFizz\n4\n5', 'Pentru i de la 1 la 5: dacă i%3==0 → "Fizz", altfel i.',
    { topic: 'loops', difficulty: 'MEDIUM', language: 'python', starterCode: 'for i in range(1, 6):\n    pass' }),
  mc('is vs ==', 'Care e diferența între `is` și `==`?',
    [
      'Identice',
      '`is` compară identitatea, `==` compară valoarea',
      '`==` e doar pentru numere',
      '`is` e doar pentru string-uri',
    ],
    '`is` compară identitatea, `==` compară valoarea',
    '`is` verifică dacă sunt **același obiect** în memorie. `==` verifică dacă valorile sunt egale.',
    { topic: 'operators', difficulty: 'HARD', language: 'python' }),
  sa('Lambda', 'Cum scrii o funcție lambda care dublează x?', 'lambda x: x*2',
    '`lambda <param>: <expresie>` — funcție anonimă pe o singură linie.',
    { topic: 'functions', difficulty: 'MEDIUM', language: 'python' }),
  mc('List comprehension', 'Ce produce `[x*2 for x in range(3)]`?',
    ['[0, 2, 4]', '[2, 4, 6]', '[0, 1, 2]', '[1, 2, 3]'], '[0, 2, 4]',
    'range(3) = 0,1,2; fiecare *2 → [0, 2, 4].',
    { topic: 'lists', difficulty: 'MEDIUM', language: 'python' }),
]

// ===== JAVASCRIPT =====
const jsBank = [
  mc('typeof null', 'Ce returnează `typeof null` în JS?',
    ['"null"', '"object"', '"undefined"', '"number"'],
    '"object"',
    'Faimoasa "bug" istorică din JS — `typeof null === "object"`.',
    { topic: 'types', difficulty: 'HARD', language: 'javascript' }),
  mc('== vs ===', 'Ce returnează `0 == "0"`?',
    ['true', 'false', 'eroare', 'NaN'], 'true',
    '`==` face conversie de tip. Folosește `===` pentru comparație strictă.',
    { topic: 'operators', difficulty: 'MEDIUM', language: 'javascript' }),
  mc('Array length', 'Ce afișează `[1,2,3].length`?',
    ['2', '3', '4', 'undefined'], '3',
    '`.length` returnează numărul de elemente.',
    { topic: 'arrays', difficulty: 'EASY', language: 'javascript' }),
  sa('Array push', 'Care metodă adaugă un element la finalul array-ului?', 'push',
    '`array.push(element)` adaugă la coadă și returnează noua lungime.',
    { topic: 'arrays', difficulty: 'EASY', language: 'javascript' }),
  mc('let scope', 'Care e scope-ul lui `let`?',
    ['function', 'block', 'global', 'module'], 'block',
    '`let` și `const` au block scope (între `{}`). `var` are function scope.',
    { topic: 'variables', difficulty: 'MEDIUM', language: 'javascript' }),
  mc('Spread', 'Ce face `[...arr1, ...arr2]`?',
    ['Concatenează', 'Sortează', 'Șterge duplicate', 'Eroare'], 'Concatenează',
    'Spread operator (`...`) "împrăștie" elementele — combină arrays.',
    { topic: 'arrays', difficulty: 'MEDIUM', language: 'javascript' }),
  mc('Arrow this', 'Arrow functions au propriul `this`?',
    ['Da', 'Nu', 'Doar în clase', 'Depinde'], 'Nu',
    'Arrow functions moștenesc `this` din scope-ul exterior — mare diferență față de funcțiile clasice.',
    { topic: 'functions', difficulty: 'HARD', language: 'javascript' }),
  sa('JSON parse', 'Care metodă convertește string JSON la obiect?', 'JSON.parse',
    '`JSON.parse(string)` returnează obiectul corespunzător.',
    { topic: 'json', difficulty: 'EASY', language: 'javascript' }),
  mc('map vs forEach', 'Diferența principală map vs forEach?',
    [
      'Niciuna',
      '`map` returnează un nou array, `forEach` nu returnează nimic',
      '`forEach` e mai rapid',
      '`map` modifică originalul',
    ],
    '`map` returnează un nou array, `forEach` nu returnează nimic',
    '`map` e pentru transformare; `forEach` doar iterează.',
    { topic: 'arrays', difficulty: 'MEDIUM', language: 'javascript' }),
  mc('Promise states', 'Câte stări are un Promise?',
    ['1', '2', '3', '4'], '3',
    'pending, fulfilled, rejected.',
    { topic: 'async', difficulty: 'MEDIUM', language: 'javascript' }),
  mc('NaN check', 'Cum verifici corect dacă valoarea e NaN?',
    ['x == NaN', 'x === NaN', 'isNaN(x)', 'Number.isNaN(x)'],
    'Number.isNaN(x)',
    '`NaN !== NaN`. `Number.isNaN()` e cel mai sigur (vs `isNaN` care face coerce).',
    { topic: 'types', difficulty: 'HARD', language: 'javascript' }),
  sa('querySelector', 'Care metodă DOM selectează primul element care match-uiește un selector CSS?', 'querySelector',
    '`document.querySelector(".btn")` returnează primul element.',
    { topic: 'dom', difficulty: 'MEDIUM', language: 'javascript' }),
]

// ===== HTML =====
const htmlBank = [
  mc('Doctype', 'Ce declarație începe orice document HTML5?',
    ['<html5>', '<!DOCTYPE html>', '<head>', '<doctype html5>'],
    '<!DOCTYPE html>',
    'Spune browserului că e HTML5.',
    { topic: 'structure', difficulty: 'EASY', language: 'html' }),
  mc('Atribut alt', 'La ce folosește atributul `alt` pe `<img>`?',
    ['Stil', 'Text alternativ pentru accesibilitate', 'URL alternativ', 'Animație'],
    'Text alternativ pentru accesibilitate',
    'Esențial pentru cititoare de ecran și SEO; afișat dacă imaginea nu se încarcă.',
    { topic: 'images', difficulty: 'EASY', language: 'html' }),
  sa('Link extern', 'Care atribut deschide link-ul în tab nou?', 'target="_blank"',
    '`<a href="..." target="_blank">` deschide în tab nou.',
    { topic: 'links', difficulty: 'EASY', language: 'html' }),
  mc('Listă numerotată', 'Care tag creează listă numerotată?',
    ['<ul>', '<ol>', '<list>', '<dl>'], '<ol>',
    '`<ol>` = ordered list (numerotată). `<ul>` = unordered (cu bullet).',
    { topic: 'lists', difficulty: 'EASY', language: 'html' }),
  mc('Form method', 'Pentru a trimite parolă, ce metodă HTTP folosești?',
    ['GET', 'POST', 'PUT', 'OPTIONS'], 'POST',
    '`GET` pune datele în URL — periculos pentru parole. `POST` le trimite în body.',
    { topic: 'forms', difficulty: 'MEDIUM', language: 'html' }),
  sa('Tag nav', 'Care tag semantic e pentru meniu de navigare?', 'nav',
    '`<nav>` e tag-ul semantic pentru navigare.',
    { topic: 'semantic', difficulty: 'EASY', language: 'html' }),
  mc('Required input', 'Cum faci un input obligatoriu?',
    ['mandatory', 'required', 'must', 'needed'], 'required',
    'Atributul `required` previne submit dacă e gol.',
    { topic: 'forms', difficulty: 'EASY', language: 'html' }),
  mc('Meta charset', 'Ce face `<meta charset="UTF-8">`?',
    [
      'Setează limba',
      'Setează codarea caracterelor',
      'Setează stilul',
      'Activează responsive',
    ],
    'Setează codarea caracterelor',
    'UTF-8 permite afișarea corectă a caracterelor speciale (ăîșțâ etc.).',
    { topic: 'meta', difficulty: 'MEDIUM', language: 'html' }),
]

// ===== CSS =====
const cssBank = [
  mc('Centrare flex', 'Cu flexbox, pentru centrare orizontală + verticală:',
    [
      'text-align: center',
      'justify-content: center; align-items: center',
      'margin: auto',
      'position: center',
    ],
    'justify-content: center; align-items: center',
    'Combinația e standardul pentru centrare în flexbox.',
    { topic: 'flexbox', difficulty: 'MEDIUM', language: 'css' }),
  mc('Z-index',
    'Care proprietate stabilește ordinea elementelor pe axa Z?',
    ['order', 'z-index', 'depth', 'layer'], 'z-index',
    '`z-index` controlează ce element e deasupra (mai mare = mai sus).',
    { topic: 'position', difficulty: 'EASY', language: 'css' }),
  sa('Cerc', 'Ce valoare de border-radius transformă un pătrat în cerc?', '50%',
    '`border-radius: 50%` produce cerc perfect.',
    { topic: 'border', difficulty: 'EASY', language: 'css' }),
  mc('Box-sizing',
    'Cu `box-sizing: border-box`, ce **nu** e inclus în `width`?',
    ['Padding', 'Border', 'Margin', 'Content'], 'Margin',
    'Border-box include content + padding + border. Margin nu intră niciodată în width.',
    { topic: 'box-model', difficulty: 'HARD', language: 'css' }),
  mc('Specificitate',
    'Care selector are cea mai mare specificitate?',
    ['.btn', '#submit', 'button', 'button.btn'], '#submit',
    'ID > class > tag. `#submit` câștigă.',
    { topic: 'selectors', difficulty: 'HARD', language: 'css' }),
  mc('Media query',
    'Pentru ecrane sub 768px:',
    [
      '@media (max-width: 768px)',
      '@media max-width: 768px',
      '@media screen < 768px',
      '@responsive 768px',
    ],
    '@media (max-width: 768px)',
    'Sintaxa standard a media queries.',
    { topic: 'responsive', difficulty: 'MEDIUM', language: 'css' }),
  sa('Scoatere underline', 'Cum elimini underline-ul de pe link-uri?', 'text-decoration: none',
    '`text-decoration: none;` elimină decorarea implicită.',
    { topic: 'text', difficulty: 'EASY', language: 'css' }),
  mc('vh',
    'Ce înseamnă `100vh`?',
    ['100% lățime', '100% înălțime ecran', '100 pixeli', '100% părinte'],
    '100% înălțime ecran',
    'vh = viewport height.',
    { topic: 'units', difficulty: 'MEDIUM', language: 'css' }),
]

const allStandalone = [
  ...pythonBank,
  ...jsBank,
  ...htmlBank,
  ...cssBank,
]

async function main() {
  console.log(`🚀 Seed: Problem Bank (standalone)`)
  console.log(`   Total: ${allStandalone.length} probleme`)

  // Curățăm DOAR problemele standalone existente cu același title (idempotent)
  // pentru a evita duplicate la rerulare
  const titles = allStandalone.map((p) => p.title)
  const deleted = await prisma.problem.deleteMany({
    where: {
      lessonId: null,
      title: { in: titles },
    },
  })
  console.log(`   Șterse anterior: ${deleted.count}`)

  await prisma.problem.createMany({
    data: allStandalone.map((p) => ({
      title: p.title,
      description: p.description,
      difficulty: p.difficulty || 'EASY',
      topic: p.topic || 'general',
      type: p.type || 'MULTIPLE_CHOICE',
      options: p.options || [],
      correctAnswer: p.correctAnswer ?? null,
      starterCode: p.starterCode ?? null,
      explanation: p.explanation || '',
      hint: p.hint ?? null,
      tags: p.tags || [],
      estimatedTime: p.estimatedTime || 5,
      points: p.points || 10,
      language: p.language ?? null,
      active: true,
    })),
  })

  // Stats per language
  const stats = await prisma.problem.groupBy({
    by: ['language'],
    where: { lessonId: null, active: true },
    _count: true,
  })
  console.log(`\n✅ DONE`)
  for (const s of stats) {
    console.log(`   ${s.language || '(no lang)'}: ${s._count}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Eroare:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
