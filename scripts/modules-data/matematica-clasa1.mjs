// MATEMATICĂ — CLASA 1 (curriculum România/Moldova, 2021)
// 70 lecții complete, ~490 probleme cu teorie detaliată, prietenoasă pentru copii 6-7 ani
// Fiecare lecție are: emoji 🐱🍎🌈, exemple vizuale, povești scurte, probleme jucăușe.

import { mc, sa } from './helpers.mjs'

// ──────────────────────────────────────────────────────────
// HELPERI specifici matematicii (generatori compacți)
// ──────────────────────────────────────────────────────────
const T = 'matematica-cl1'

// Adunare — răspuns scurt
const add = (a, b, opts = {}) => sa(
  `${a} + ${b} = ?`,
  `Calculează: **${a} + ${b}** = ?`,
  String(a + b),
  `${a} + ${b} = ${a + b}. Adunăm cele două numere și obținem ${a + b}.`,
  { topic: opts.topic || 'adunare', difficulty: opts.difficulty || 'EASY', points: opts.points || 10, hint: opts.hint || `Numără în continuare de la ${a}: ${Array.from({length:b},(_,i)=>a+i+1).join(', ')}.` }
)

// Scădere — răspuns scurt
const sub = (a, b, opts = {}) => sa(
  `${a} − ${b} = ?`,
  `Calculează: **${a} − ${b}** = ?`,
  String(a - b),
  `${a} − ${b} = ${a - b}. Scădem ${b} din ${a} și rămân ${a - b}.`,
  { topic: opts.topic || 'scadere', difficulty: opts.difficulty || 'EASY', points: opts.points || 10, hint: opts.hint || `Pornește de la ${a} și dă înapoi ${b} pași.` }
)

// Comparare — multiple choice
const cmp = (a, b) => mc(
  `Compară ${a} și ${b}`,
  `Care semn este corect între **${a}** și **${b}**?`,
  ['<', '>', '=', '≠'],
  a < b ? '<' : a > b ? '>' : '=',
  `${a} ${a<b?'<':a>b?'>':'='} ${b}. ${a===b?'Sunt egale.':a<b?`${a} este mai mic decât ${b}.`:`${a} este mai mare decât ${b}.`}`,
  { topic: 'comparare', difficulty: 'EASY' }
)

// Numărare obiecte (vizual)
const count = (n, obiect, emoji) => sa(
  `Numără ${obiect}`,
  `Câte ${obiect} sunt? ${emoji.repeat(n)}`,
  String(n),
  `Sunt **${n}** ${obiect}. Le-am numărat unul câte unul: ${Array.from({length:n},(_,i)=>i+1).join(', ')}.`,
  { topic: 'numarare', difficulty: 'EASY', points: 10 }
)

// Numărul vecin
const vecin = (n, dir) => sa(
  dir === 'urm' ? `Vecinul mai mare al lui ${n}` : `Vecinul mai mic al lui ${n}`,
  dir === 'urm' ? `Care este numărul **imediat după ${n}**?` : `Care este numărul **imediat înainte de ${n}**?`,
  String(dir === 'urm' ? n + 1 : n - 1),
  dir === 'urm' ? `După ${n} vine ${n+1}. Adăugăm 1.` : `Înainte de ${n} este ${n-1}. Scădem 1.`,
  { topic: 'vecini', difficulty: 'EASY' }
)

// ──────────────────────────────────────────────────────────
// MODULUL
// ──────────────────────────────────────────────────────────
export const matematicaClasa1Module = {
  slug: 'matematica-clasa-1',
  title: 'Matematică — Clasa 1',
  description: 'Învață matematica de la zero — 70 lecții jucăușe cu povești, desene și probleme distractive pentru copii.',
  language: 'matematica',
  order: 12,
  lessons: [

    // ════════════════════════════════════════════════════════
    // CAPITOL 1: NUMERELE 0–10 (lecțiile 1–12)
    // ════════════════════════════════════════════════════════

    {
      slug: 'numarul-1',
      title: '1. Numărul 1 și cifra 1',
      isFree: true,
      theory: `# 🌟 Numărul 1

Bun venit, micule matematician! 🎉

## 🍎 Ce este numărul 1?

**Unu (1)** este cel mai mic număr natural nenul. Arată că avem **un singur** lucru.

> 🐱 *O pisică* — am 1 pisică
> 🍎 *Un măr* — am 1 măr
> 🌞 *Un soare* — văd 1 soare pe cer

## ✏️ Cum scriem cifra 1?

Cifra 1 se scrie cu o **liniuță scurtă sus** și o **liniuță dreaptă jos**:

\`\`\`
  /
  |
  |
__|__
\`\`\`

## 🎯 De ce este important?

- Cu **1** începem să numărăm
- **1** este mai mic decât toate celelalte numere (în afară de 0)
- **1 + 1 = 2** — primul calcul din viața ta!

## 🧠 Reține!

✅ Cifra 1 arată că avem **un singur** obiect.
✅ Se scrie cu o linie verticală.
`,
      problems: [
        count(1, 'mere', '🍎'),
        mc('Ce înseamnă numărul 1?',
          'Ce arată numărul **1**?',
          ['Niciun obiect', 'Un singur obiect', 'Două obiecte', 'Multe obiecte'],
          'Un singur obiect',
          'Numărul 1 înseamnă că avem **unul singur** dintr-un lucru.',
          { topic: T }),
        mc('Câte sori sunt?',
          'Câți sori sunt pe cer? ☀️',
          ['0', '1', '2', '3'],
          '1',
          'Pe cer este **1** soare. Răspunsul corect este 1.',
          { topic: T }),
        sa('Scrie cifra 1', 'Câte pisici sunt? 🐱', '1', 'O singură pisică = numărul **1**.', { topic: T }),
        mc('Care e cifra 1?',
          'Care dintre acestea este cifra unu?',
          ['7', '4', '1', '9'],
          '1',
          'Cifra **1** este cea cu o singură liniuță verticală.',
          { topic: T }),
        sa('Un măr', 'Câte mere ai dacă ții în mână 🍎 unul singur?', '1', 'Un măr = numărul 1.', { topic: T }),
      ],
    },

    {
      slug: 'numarul-2',
      title: '2. Numărul 2 și cifra 2',
      isFree: true,
      theory: `# 🌟 Numărul 2

Astăzi învățăm despre **doi**! 👯

## 🐱🐱 Ce este numărul 2?

**Doi (2)** arată că avem **două** lucruri identice sau diferite.

> 👀 Avem **2 ochi**
> 👂 Avem **2 urechi**
> 🖐️ Avem **2 mâini**
> 🐾 Câinele are **2 ochi** și **2 urechi**

## ✏️ Cum scriem cifra 2?

Cifra 2 arată ca o **lebădă** 🦢:
- Începe cu o curbă sus
- Coboară diagonal
- Se termină cu o liniuță orizontală jos

## 🎯 1 + 1 = 2

Dacă ai **1 măr** 🍎 și mai primești încă **1 măr** 🍎, vei avea **2 mere**! 🍎🍎

## 🧠 Reține!

✅ **2 = 1 + 1**
✅ 2 vine **după** 1
✅ 2 este **mai mare** decât 1
`,
      problems: [
        count(2, 'pisici', '🐱'),
        mc('Câți ochi avem?',
          'Câți ochi are un copil?',
          ['1', '2', '3', '5'],
          '2',
          'Toți avem **2 ochi**. Răspunsul corect este 2.',
          { topic: T }),
        sa('1 + 1 = ?', 'Cât face **1 + 1**?', '2', '1 + 1 = **2**. Adăugăm încă unul la cel pe care îl avem deja.', { topic: T, hint: 'Pune un deget, apoi încă unul. Câte sunt?' }),
        count(2, 'flori', '🌸'),
        mc('Care e mai mare?',
          'Care număr este **mai mare**?',
          ['1', '2', 'Sunt egale', 'Niciunul'],
          '2',
          '2 este mai mare decât 1, pentru că vine după 1 când numărăm.',
          { topic: T }),
        sa('Vecinul lui 1', 'Ce număr vine **imediat după 1**?', '2', 'După 1 vine **2**.', { topic: T }),
        mc('Două mâini',
          'Câte mâini are un om?',
          ['1', '2', '4', '10'],
          '2',
          'Avem **2 mâini** — stânga și dreapta.',
          { topic: T }),
      ],
    },

    {
      slug: 'numarul-3',
      title: '3. Numărul 3 și cifra 3',
      isFree: false,
      theory: `# 🌟 Numărul 3

Acum învățăm despre **trei**! 🎈🎈🎈

## 🍎🍎🍎 Ce este numărul 3?

**Trei (3)** arată că avem **trei** obiecte.

> 🚦 Semaforul are **3 culori**: roșu, galben, verde
> 🐷 *Cei trei purceluși* — povestea ta preferată!
> ⭐ **3 stele** strălucesc pe cer

## ✏️ Cum scriem cifra 3?

Cifra 3 arată ca **două burți** 🌙🌙:
- O curbă sus
- O curbă jos
- Se lipește la mijloc

## 🎯 Adunări cu 3

| Calcul | Rezultat |
|---|---|
| **1 + 2** | = 3 |
| **2 + 1** | = 3 |
| **3 + 0** | = 3 |

## 🧠 Reține!

✅ **3 = 2 + 1**
✅ După 2 vine **3**
✅ Avem **3 culori la semafor**: roșu 🔴, galben 🟡, verde 🟢
`,
      problems: [
        count(3, 'baloane', '🎈'),
        sa('2 + 1 = ?', 'Cât face **2 + 1**?', '3', '2 + 1 = **3**. La 2 mai adăugăm 1.', { topic: T }),
        mc('Câte culori are semaforul?',
          'Câte culori are un semafor?',
          ['1', '2', '3', '4'],
          '3',
          'Semaforul are **3 culori**: roșu, galben, verde.',
          { topic: T }),
        sa('Vecinul lui 2', 'Ce număr vine **după 2**?', '3', 'După 2 vine **3**.', { topic: T }),
        count(3, 'stele', '⭐'),
        mc('Care e cea mai mare?',
          'Care este cea mai mare cifră?',
          ['1', '2', '3', 'Sunt egale'],
          '3',
          '3 este mai mare decât 1 și 2.',
          { topic: T }),
        sa('1 + 1 + 1', 'Cât face **1 + 1 + 1**?', '3', '1 + 1 = 2, apoi 2 + 1 = **3**.', { topic: T }),
      ],
    },

    {
      slug: 'numarul-4',
      title: '4. Numărul 4 și cifra 4',
      isFree: false,
      theory: `# 🌟 Numărul 4

Astăzi: **patru**! 🐶🐱🐰🦊

## Ce este 4?

**Patru (4)** arată că avem **patru** obiecte.

> 🐶 Câinele are **4 picioare**
> 🪑 Scaunul are **4 picioare**
> 🚗 Mașina are **4 roți**
> 🍀 Trifoiul norocos are **4 frunze**

## ✏️ Cum scriem cifra 4?

Cifra 4 arată ca un **scaun întors** 🪑:
- O linie diagonală în jos
- O liniuță orizontală
- O liniuță verticală lungă

## 🎯 Cum facem 4?

| Calcul | = |
|---|---|
| **2 + 2** | 4 |
| **3 + 1** | 4 |
| **1 + 3** | 4 |
| **4 + 0** | 4 |

## 🧠 Reține!

✅ **4 = 2 + 2 = 3 + 1**
✅ După 3 vine **4**
✅ Câinele și mașina au câte **4 picioare/roți**
`,
      problems: [
        count(4, 'roți la mașină', '🛞'),
        add(2, 2),
        sa('Câte picioare are un câine?', 'Câte picioare are un cățel? 🐶', '4', 'Câinele are **4 picioare**.', { topic: T }),
        add(3, 1),
        mc('Trifoi norocos',
          'Câte frunze are un trifoi norocos?',
          ['2', '3', '4', '5'],
          '4',
          'Trifoiul norocos are **4 frunze** — de aceea aduce noroc!',
          { topic: T }),
        vecin(3, 'urm'),
        cmp(4, 3),
      ],
    },

    {
      slug: 'numarul-5',
      title: '5. Numărul 5 și cifra 5',
      isFree: false,
      theory: `# 🌟 Numărul 5

Cinci este un număr **special**! ✋

## 🖐️ Ce este numărul 5?

**Cinci (5)** este numărul **degetelor de la o mână**.

> ✋ O mână are **5 degete**
> ⭐ Steaua are **5 colțuri**
> 🌟 Sunt **5 grupuri de zile** într-o săptămână de lucru
> 🎵 Pe portativ sunt **5 linii** muzicale

## ✏️ Cum scriem cifra 5?

Cifra 5 are:
- O liniuță orizontală sus
- O linie verticală scurtă
- O burtă rotundă jos

## 🎯 Mâna magică ✋

Folosește **degetele de la o mână** pentru a număra până la 5! Asta îți va ajuta mereu la matematică.

| Calcul | = |
|---|---|
| **4 + 1** | 5 |
| **3 + 2** | 5 |
| **2 + 3** | 5 |
| **1 + 4** | 5 |

## 🧠 Reține!

✅ **5 = 4 + 1 = 3 + 2**
✅ O mână = **5 degete**
✅ Steaua are **5 colțuri**
`,
      problems: [
        count(5, 'degete', '☝️'),
        add(4, 1),
        add(3, 2),
        sa('Degete la o mână', 'Câte degete are o mână? ✋', '5', 'O mână are **5 degete**.', { topic: T }),
        mc('Stea cu colțuri',
          'Câte colțuri are o stea ⭐?',
          ['3', '4', '5', '6'],
          '5',
          'Steaua tipică are **5 colțuri**.',
          { topic: T }),
        cmp(5, 4),
        vecin(4, 'urm'),
      ],
    },

    {
      slug: 'numarul-0',
      title: '6. Numărul 0 (zero)',
      isFree: false,
      theory: `# 🌟 Numărul 0 — Zero

Zero înseamnă **niciun**! 🚫

## 🥣 Ce este numărul 0?

**Zero (0)** arată că **nu avem nimic** dintr-un lucru.

> 🥛 Paharul gol = **0 apă**
> 🍪 Borcanul gol = **0 prăjituri**
> 🐟 Acvariul fără pește = **0 pești**

## ✏️ Cum scriem cifra 0?

Cifra 0 este o **bulă rotundă**, ca un ou! 🥚

## 🎯 Trucuri cu 0

⚡ **Adunare cu 0**: orice număr + 0 = același număr!
- 5 + 0 = 5
- 3 + 0 = 3
- 0 + 7 = 7

⚡ **Scădere cu 0**: orice număr − 0 = același număr!
- 5 − 0 = 5

## 🧠 Reține!

✅ **0 = niciun obiect**
✅ Adunând **0**, numărul nu se schimbă: 8 + 0 = 8
✅ 0 este cel **mai mic** număr natural
`,
      problems: [
        mc('Ce înseamnă 0?',
          'Ce înseamnă numărul **0**?',
          ['Multe obiecte', 'Un obiect', 'Niciun obiect', 'Două obiecte'],
          'Niciun obiect',
          '0 înseamnă **niciun obiect** — paharul este gol.',
          { topic: T }),
        add(5, 0),
        add(0, 3),
        sub(7, 0),
        mc('Pahar gol',
          'În paharul gol sunt:',
          ['1 lichid', '0 lichid', '5 lichide', 'Plin'],
          '0 lichid',
          'Paharul gol are **0** lichid — nu este nimic în el.',
          { topic: T }),
        sa('5 + 0', 'Cât face **5 + 0**?', '5', 'Când adunăm 0, numărul rămâne neschimbat: 5 + 0 = **5**.', { topic: T }),
        cmp(0, 1),
      ],
    },

    {
      slug: 'numarul-6',
      title: '7. Numărul 6 și cifra 6',
      theory: `# 🌟 Numărul 6

Astăzi: **șase**! 🎲

## 🎲 Ce este numărul 6?

**Șase (6)** arată că avem **șase** obiecte.

> 🎲 Pe un zar fața maximă are **6 puncte**
> 🐝 Albina are **6 picioare**
> 📅 Săptămâna are **6 zile lucrătoare** (luni-sâmbătă)
> 🎵 O octavă muzicală are **6 note** (do-re-mi-fa-sol-la)

## ✏️ Cum scriem cifra 6?

Cifra 6 arată ca un **cârlig cu burtă** 🍒:
- O curbă lungă sus
- Coboară jos
- Se închide cu o burtă

## 🎯 Cum facem 6?

| Calcul | = |
|---|---|
| **5 + 1** | 6 |
| **4 + 2** | 6 |
| **3 + 3** | 6 |

## 🧠 Reține!

✅ **6 = 5 + 1 = 3 + 3**
✅ După 5 vine **6**
✅ Zarul are **6 fețe**
`,
      problems: [
        count(6, 'puncte pe zar', '⚫'),
        add(5, 1),
        add(3, 3),
        add(4, 2),
        mc('Zar',
          'Câte puncte are fața maximă a unui zar?',
          ['4', '5', '6', '8'],
          '6',
          'Pe zar, fața maximă are **6 puncte**.',
          { topic: T }),
        cmp(6, 5),
        vecin(5, 'urm'),
      ],
    },

    {
      slug: 'numarul-7',
      title: '8. Numărul 7 și cifra 7',
      theory: `# 🌟 Numărul 7

**Șapte** este norocos! 🌈

## 🌈 Ce este numărul 7?

**Șapte (7)** este peste tot în jurul nostru:

> 🌈 Curcubeul are **7 culori**: roșu, oranj, galben, verde, albastru, indigo, violet
> 📅 Săptămâna are **7 zile**
> 🎵 Notele muzicale: **7** (do, re, mi, fa, sol, la, si)
> 🐉 *Cei 7 pitici* — povestea Albei ca Zăpada!

## ✏️ Cum scriem cifra 7?

Cifra 7 are:
- O liniuță orizontală sus
- O linie diagonală în jos

Arată ca un **steag** 🚩 răsturnat!

## 🎯 Cum facem 7?

| Calcul | = |
|---|---|
| **6 + 1** | 7 |
| **5 + 2** | 7 |
| **4 + 3** | 7 |

## 🧠 Reține!

✅ **7 = 6 + 1 = 4 + 3**
✅ Săptămâna are **7 zile**
✅ Curcubeul are **7 culori**
`,
      problems: [
        count(7, 'zile pe săptămână', '📅'),
        add(6, 1),
        add(4, 3),
        mc('Săptămâna',
          'Câte zile are o săptămână?',
          ['5', '6', '7', '10'],
          '7',
          'O săptămână are **7 zile**: luni, marți, miercuri, joi, vineri, sâmbătă, duminică.',
          { topic: T }),
        mc('Curcubeu',
          'Câte culori are curcubeul 🌈?',
          ['3', '5', '7', '9'],
          '7',
          'Curcubeul are **7 culori**.',
          { topic: T }),
        cmp(7, 6),
        sub(7, 3),
      ],
    },

    {
      slug: 'numarul-8',
      title: '9. Numărul 8 și cifra 8',
      theory: `# 🌟 Numărul 8

**Opt** seamănă cu o **clepsidră** ⏳!

## 🕷️ Ce este numărul 8?

**Opt (8)** apare des:

> 🕷️ Păianjenul are **8 picioare**
> 🐙 Caracatița are **8 brațe**
> ♾️ Cifra 8 culcată = simbolul infinitului ∞
> 🎱 Bila magică are **8** desenat pe ea

## ✏️ Cum scriem cifra 8?

Cifra 8 are **două bule** lipite:
- O bulă mică sus
- O bulă mai mare jos
- Se desenează **într-o singură mișcare** continuă!

## 🎯 Cum facem 8?

| Calcul | = |
|---|---|
| **7 + 1** | 8 |
| **6 + 2** | 8 |
| **5 + 3** | 8 |
| **4 + 4** | 8 |

## 🧠 Reține!

✅ **8 = 4 + 4 = 5 + 3**
✅ Păianjenul are **8 picioare**
✅ Caracatița are **8 brațe**
`,
      problems: [
        count(8, 'picioare la păianjen', '🦵'),
        add(4, 4),
        add(7, 1),
        add(5, 3),
        mc('Caracatița',
          'Câte brațe are o caracatiță 🐙?',
          ['4', '6', '8', '10'],
          '8',
          'Caracatița are **8 brațe**.',
          { topic: T }),
        cmp(8, 7),
        sub(8, 4),
      ],
    },

    {
      slug: 'numarul-9',
      title: '10. Numărul 9 și cifra 9',
      theory: `# 🌟 Numărul 9

**Nouă** este ultima cifră înainte de **10**! 🎯

## 🐱 Ce este numărul 9?

**Nouă (9)** apare în multe locuri:

> 🐱 Pisicile au **9 vieți** (în legende!)
> ⚾ În baseball sunt **9 jucători** într-o echipă
> 🎼 Beethoven a scris **9 simfonii**
> 🪐 În sistemul solar erau cândva **9 planete**

## ✏️ Cum scriem cifra 9?

Cifra 9 este ca un **6 răsturnat** 🔄:
- O bulă rotundă sus
- O liniuță dreaptă în jos

## 🎯 Cum facem 9?

| Calcul | = |
|---|---|
| **8 + 1** | 9 |
| **7 + 2** | 9 |
| **6 + 3** | 9 |
| **5 + 4** | 9 |

## 🧠 Reține!

✅ **9 = 8 + 1 = 5 + 4**
✅ După 9 vine **10** — primul număr cu **două cifre**!
✅ 9 este cea **mai mare cifră** dintr-o singură poziție
`,
      problems: [
        add(8, 1),
        add(5, 4),
        add(6, 3),
        mc('Pisica',
          'Câte vieți spune legenda că are pisica?',
          ['3', '7', '9', '12'],
          '9',
          'În legende, pisica are **9 vieți**.',
          { topic: T }),
        cmp(9, 8),
        sub(9, 4),
        sa('Vecinul lui 9', 'Ce număr vine **după 9**?', '10', 'După 9 vine **10**!', { topic: T }),
      ],
    },

    {
      slug: 'numarul-10',
      title: '11. Numărul 10 — Primul număr cu două cifre!',
      theory: `# 🌟 Numărul 10 — SUPER SPECIAL! 🎉

**Zece** este un număr **uriaș**! Este primul număr scris cu **două cifre**!

## 🖐️🖐️ Ce este numărul 10?

**Zece (10)** = **două mâini** ✋✋

> 🖐️🖐️ Două mâini = **10 degete**
> 🦶🦶 Două picioare = **10 degete**
> 🎳 La popice sunt **10 popice**
> 💯 *Nota maximă* la școală = **10**!

## ✏️ Cum se scrie 10?

10 are **DOUĂ cifre**:
- **1** la stânga (înseamnă **o zece**)
- **0** la dreapta (înseamnă **zero unități**)

| Cifră | Ce înseamnă |
|---|---|
| **1** | 1 zece (10 obiecte grupate) |
| **0** | 0 unități (zero obiecte separate) |

## 🎯 Cum facem 10?

| Calcul | = |
|---|---|
| **9 + 1** | 10 |
| **8 + 2** | 10 |
| **7 + 3** | 10 |
| **6 + 4** | 10 |
| **5 + 5** | 10 |

> 💡 **Truc:** "Perechile lui 10" sunt foarte importante! Învață-le bine!

## 🧠 Reține!

✅ **10 are 2 cifre**: 1 și 0
✅ **10 = 5 + 5 = 9 + 1**
✅ Avem **10 degete** la mâini
`,
      problems: [
        add(9, 1),
        add(5, 5),
        add(7, 3),
        add(6, 4),
        sa('Câte degete avem la mâini?', 'Câte degete are un copil la **ambele mâini**?', '10', 'Două mâini × 5 degete = **10 degete**.', { topic: T }),
        mc('Câte cifre are 10?',
          'Câte cifre are numărul **10**?',
          ['1', '2', '3', '10'],
          '2',
          'Numărul 10 are **2 cifre**: cifra 1 și cifra 0.',
          { topic: T }),
        cmp(10, 9),
      ],
    },

    {
      slug: 'recapitulare-0-10',
      title: '12. Recapitulare: numerele 0–10',
      theory: `# 📚 Recapitulare 0 → 10

Astăzi recapitulăm tot ce am învățat! 🌟

## 🔢 Numerele 0–10

| Cifra | Cum arată | Exemplu |
|---|---|---|
| **0** | nimic | Pahar gol 🥛 |
| **1** | un singur | Soare ☀️ |
| **2** | doi | Ochi 👀 |
| **3** | trei | Culori semafor 🚦 |
| **4** | patru | Picioare câine 🐶 |
| **5** | cinci | Degete o mână ✋ |
| **6** | șase | Fețe zar 🎲 |
| **7** | șapte | Zile săptămână 📅 |
| **8** | opt | Picioare păianjen 🕷️ |
| **9** | nouă | Vieți pisică 🐱 |
| **10** | zece | Degete două mâini 🖐️🖐️ |

## 🎯 Numărare

**În ordine crescătoare** (de la mic la mare):
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 ⬆️

**În ordine descrescătoare** (de la mare la mic):
10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 0 ⬇️

## 🧠 Reține!

✅ Toate numerele de la 0 la 9 au **o singură cifră**
✅ **10** este primul cu **două cifre**
✅ După fiecare număr vine **vecinul mai mare** (+1)
✅ Înainte de fiecare număr este **vecinul mai mic** (−1)
`,
      problems: [
        sa('Numără', 'Numără în ordine crescătoare. Ce vine după **6**?', '7', 'După 6 vine **7**.', { topic: T }),
        sa('Numără invers', 'Numără invers. Ce vine după **5**? (mai mic)', '4', 'În numărarea descrescătoare, după 5 vine **4**.', { topic: T }),
        cmp(8, 3),
        cmp(0, 5),
        mc('Cel mai mare',
          'Care este cel **mai mare** dintre: 7, 3, 9, 5?',
          ['3', '5', '7', '9'],
          '9',
          'Dintre 7, 3, 9, 5, cel mai mare este **9**.',
          { topic: T }),
        mc('Cel mai mic',
          'Care este cel **mai mic** dintre: 4, 2, 8, 6?',
          ['2', '4', '6', '8'],
          '2',
          'Dintre 4, 2, 8, 6, cel mai mic este **2**.',
          { topic: T }),
        sa('Câte cifre?', 'Câte cifre are numărul **10**?', '2', 'Numărul 10 are **2 cifre** (1 și 0).', { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 2: COMPARARE 0–10 (lecțiile 13–16)
    // ════════════════════════════════════════════════════════

    {
      slug: 'comparare-mai-mare-mai-mic',
      title: '13. Mai mare, mai mic, egal',
      theory: `# 🔍 Compararea numerelor

Astăzi învățăm să comparăm! 🆚

## 🤔 Ce înseamnă să compari?

Să **compari** = să vezi care număr este **mai mare** sau **mai mic**.

## 📏 Cuvinte importante

- 🔺 **Mai mare** — numărul cu **mai multe** obiecte
- 🔻 **Mai mic** — numărul cu **mai puține** obiecte
- 🟰 **Egal** — au **același număr** de obiecte

## 🍎 Exemple cu mere

> 🍎🍎 (2 mere) **vs** 🍎🍎🍎🍎🍎 (5 mere)
>
> 5 este **mai mare** decât 2 ✅
> 2 este **mai mic** decât 5 ✅

> 🍎🍎🍎 (3 mere) **vs** 🍎🍎🍎 (3 mere)
>
> 3 este **egal** cu 3 ✅

## 💡 Truc

> Numărul care vine **mai târziu** când numărăm este cel **mai mare**!
> Exemplu: 7 vine după 4 → **7 > 4**

## 🧠 Reține!

✅ **Mai mare** = mai multe obiecte
✅ **Mai mic** = mai puține obiecte
✅ **Egal** = la fel de multe
`,
      problems: [
        mc('Care e mai mare?',
          'Care număr este **mai mare**: 5 sau 8?',
          ['5', '8', 'Sunt egale', 'Niciunul'],
          '8',
          '8 este mai mare decât 5.',
          { topic: T }),
        mc('Care e mai mic?',
          'Care număr este **mai mic**: 3 sau 7?',
          ['3', '7', 'Sunt egale', 'Niciunul'],
          '3',
          '3 este mai mic decât 7.',
          { topic: T }),
        mc('Mere',
          '🍎🍎 sau 🍎🍎🍎🍎? Unde sunt **mai multe** mere?',
          ['Primul grup', 'Al doilea grup', 'La fel', 'Niciunul'],
          'Al doilea grup',
          '4 mere > 2 mere — al doilea grup are mai multe.',
          { topic: T }),
        mc('Egale?',
          'Sunt egale numerele 6 și 6?',
          ['Da', 'Nu', 'Nu se poate spune', 'Doar uneori'],
          'Da',
          '6 = 6 — sunt egale.',
          { topic: T }),
        cmp(2, 9),
        cmp(7, 7),
        cmp(10, 4),
      ],
    },

    {
      slug: 'semne-comparare',
      title: '14. Semnele <, >, =',
      theory: `# 🔣 Semnele de comparație

Acum învățăm 3 **semne magice**! ✨

## 📐 Cele 3 semne

| Semn | Nume | Înseamnă |
|---|---|---|
| **<** | mai mic | "Stâng < Drept" |
| **>** | mai mare | "Stâng > Drept" |
| **=** | egal | "Stâng = Drept" |

## 🐊 Trucul crocodilului

Imaginează-ți **<** și **>** ca o **gură de crocodil** 🐊!

> Crocodilul **mereu mănâncă numărul mai mare**!

- **3 < 7** → gura deschisă spre 7 (cel mai mare) ✅
- **8 > 5** → gura deschisă spre 8 (cel mai mare) ✅

## 📝 Cum citim?

- **5 < 9** se citește: "**5 este mai mic decât 9**"
- **6 > 2** se citește: "**6 este mai mare decât 2**"
- **4 = 4** se citește: "**4 este egal cu 4**"

## 🧠 Reține!

✅ **<** = mai mic (gura crocodilului spre dreapta)
✅ **>** = mai mare (gura crocodilului spre stânga)
✅ **=** = egal (două liniuțe paralele)
✅ Crocodilul **mereu mănâncă numărul mare**!
`,
      problems: [
        cmp(3, 7),
        cmp(8, 5),
        cmp(4, 4),
        mc('Cum citim 5 < 9?',
          'Cum citim **5 < 9**?',
          ['5 este egal cu 9', '5 este mai mare decât 9', '5 este mai mic decât 9', '5 plus 9'],
          '5 este mai mic decât 9',
          'Semnul < înseamnă "mai mic decât". 5 < 9 = "5 este mai mic decât 9".',
          { topic: T }),
        mc('Care semn?',
          'Ce semn punem între **6 și 2**?',
          ['<', '>', '=', '+'],
          '>',
          '6 > 2, pentru că 6 este mai mare decât 2.',
          { topic: T }),
        cmp(0, 10),
        cmp(6, 6),
      ],
    },

    {
      slug: 'ordonare-crescator',
      title: '15. Ordonare crescătoare',
      theory: `# ⬆️ Ordonarea crescătoare

Astăzi vom **aranja numerele** de la mic la mare! 📈

## 🎢 Ce înseamnă crescător?

**Crescător** = de la **cel mai mic** până la **cel mai mare**.

> Ca **scările**: începi de jos și urci! 🪜

## 📋 Exemplu

Avem numerele: **5, 2, 8, 1, 4**

**Pași:**
1. Găsesc cel mai mic → **1** ✅
2. Apoi următorul cel mai mic → **2** ✅
3. Apoi → **4** ✅
4. Apoi → **5** ✅
5. Cel mai mare → **8** ✅

**Răspuns ordonat:** 1 → 2 → 4 → 5 → 8 ⬆️

## 🌈 Truc

Imaginează-ți numerele ca **înălțimea unor copii** 👶👦🧑:
- Cel mai scund **stă primul**
- Cel mai înalt **stă ultimul**

## 🧠 Reține!

✅ **Crescător** = de la **mic la mare**
✅ Începem cu **cel mai mic** număr
✅ Terminăm cu **cel mai mare** număr
`,
      problems: [
        mc('Cel mai mic',
          'Din 4, 2, 7, 1 — care este **cel mai mic**?',
          ['4', '2', '7', '1'],
          '1',
          'Cel mai mic este **1**.',
          { topic: T }),
        mc('Crescător',
          'Care este ordinea crescătoare a numerelor 3, 1, 5?',
          ['1, 3, 5', '5, 3, 1', '3, 1, 5', '1, 5, 3'],
          '1, 3, 5',
          'Crescător = de la mic la mare: 1, 3, 5.',
          { topic: T }),
        sa('Ordine 2, 5, 1', 'Care e cel **mai mic** dintre: 2, 5, 1?', '1', 'Cel mai mic este **1**.', { topic: T }),
        mc('Crescător 7, 2, 9, 4',
          'Ce ordine este crescătoare?',
          ['9, 7, 4, 2', '2, 4, 7, 9', '7, 2, 9, 4', '4, 2, 9, 7'],
          '2, 4, 7, 9',
          'Crescător: 2 → 4 → 7 → 9.',
          { topic: T }),
        sa('Cel mai mare', 'Care e **cel mai mare** dintre: 8, 3, 6?', '8', '**8** este cel mai mare.', { topic: T }),
        mc('Următorul după 5',
          'Dacă ordonăm crescător 5, 2, 7, ce vine **după 5**?',
          ['2', '7', 'Niciunul', 'Egal'],
          '7',
          'Crescător: 2, 5, **7**. După 5 vine 7.',
          { topic: T }),
      ],
    },

    {
      slug: 'ordonare-descrescator',
      title: '16. Ordonare descrescătoare',
      theory: `# ⬇️ Ordonarea descrescătoare

Acum invers — **de la mare la mic**! 📉

## 🛝 Ce înseamnă descrescător?

**Descrescător** = de la **cel mai mare** până la **cel mai mic**.

> Ca un **tobogan** 🛝: începi de sus și aluneci în jos!

## 📋 Exemplu

Avem numerele: **5, 2, 8, 1, 4**

**Pași:**
1. Găsesc cel mai mare → **8** ✅
2. Apoi următorul cel mai mare → **5** ✅
3. Apoi → **4** ✅
4. Apoi → **2** ✅
5. Cel mai mic → **1** ✅

**Răspuns ordonat:** 8 → 5 → 4 → 2 → 1 ⬇️

## 🚀 Numărătoare inversă

Când spui **10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0** — ai numărat **descrescător**!

## 🧠 Reține!

✅ **Descrescător** = de la **mare la mic**
✅ Începem cu **cel mai mare**
✅ Terminăm cu **cel mai mic**
`,
      problems: [
        mc('Descrescător',
          'Care este ordinea descrescătoare a numerelor 3, 7, 1?',
          ['1, 3, 7', '7, 3, 1', '3, 7, 1', '1, 7, 3'],
          '7, 3, 1',
          'Descrescător = de la mare la mic: 7, 3, 1.',
          { topic: T }),
        sa('Cel mai mare', 'Care e cel **mai mare** dintre 4, 9, 2?', '9', '**9** este cel mai mare.', { topic: T }),
        mc('Descrescător 5, 8, 3',
          'Ordine descrescătoare a numerelor 5, 8, 3?',
          ['3, 5, 8', '5, 8, 3', '8, 5, 3', '8, 3, 5'],
          '8, 5, 3',
          'Descrescător: 8 → 5 → 3.',
          { topic: T }),
        sa('După 9 (descr.)', 'Numărând invers, ce vine **după 9**?', '8', 'Descrescător: 9 → **8**.', { topic: T }),
        sa('După 5 (descr.)', 'Numărând invers de la 10, după 5 vine?', '4', '10, 9, 8, 7, 6, 5, **4**.', { topic: T }),
        mc('Numărătoare inversă',
          'Care e numărătoarea inversă corectă de la 5?',
          ['5, 6, 7, 8, 9', '5, 4, 3, 2, 1', '1, 2, 3, 4, 5', '5, 5, 5, 5, 5'],
          '5, 4, 3, 2, 1',
          'Numărătoare inversă (descrescătoare): 5, 4, 3, 2, 1.',
          { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 3: ADUNAREA 0–10 (lecțiile 17–24)
    // ════════════════════════════════════════════════════════

    {
      slug: 'ce-este-adunarea',
      title: '17. Ce este adunarea ➕',
      theory: `# ➕ Adunarea — punem împreună

Astăzi învățăm cea mai **importantă** operație! 🌟

## 🍎 Ce înseamnă să aduni?

**Adunarea** = să **pui împreună** mai multe lucruri.

> 🍎🍎 + 🍎 = 🍎🍎🍎
>
> 2 + 1 = **3**

## ✏️ Semnul "+"

**+** se numește **plus** și înseamnă "adăugăm".

## 📝 Părțile unei adunări

> 3 + 2 = 5

| Termen | Nume |
|---|---|
| **3** | termen (primul) |
| **2** | termen (al doilea) |
| **5** | sumă / total |
| **+** | semnul plus |
| **=** | egal |

## 🧮 Cum adunăm?

**Metoda 1:** Cu degetele 🖐️
- Ridici 3 degete, apoi încă 2 = **5 degete**

**Metoda 2:** Numără în continuare 🔢
- 3, apoi: 4 (+1), 5 (+2) → **5**

**Metoda 3:** Desenăm cerculețe ⭕
- ⭕⭕⭕ + ⭕⭕ = ⭕⭕⭕⭕⭕ → **5**

## 🧠 Reține!

✅ **+** = plus = "adăugăm"
✅ Rezultatul se numește **sumă** sau **total**
✅ Putem aduna cu **degetele** sau **desenând**
`,
      problems: [
        add(2, 1),
        add(3, 2),
        mc('Ce înseamnă +?',
          'Ce înseamnă semnul **+**?',
          ['Scădem', 'Adăugăm', 'Comparăm', 'Înmulțim'],
          'Adăugăm',
          'Semnul **+** (plus) înseamnă "adăugăm".',
          { topic: T }),
        sa('Mere', 'Ana are 3 mere 🍎. Ion îi mai dă 2 mere. **Câte mere are Ana acum?**', '5', 'Ana are 3 + 2 = **5 mere**.', { topic: T, difficulty: 'EASY' }),
        add(4, 3),
        mc('Cum se numește 5?',
          'În calculul **3 + 2 = 5**, cum se numește 5?',
          ['Termen', 'Sumă', 'Diferență', 'Semn'],
          'Sumă',
          'Rezultatul adunării se numește **sumă**.',
          { topic: T }),
        add(1, 4),
      ],
    },

    {
      slug: 'adunare-cu-1',
      title: '18. Adunare cu 1',
      theory: `# ➕1️⃣ Adunarea cu 1

Cea mai **simplă** adunare! 🎈

## 💡 Trucul

Când aduni **+1**, ajungi la **vecinul mai mare**!

| Calcul | Rezultat |
|---|---|
| **0 + 1** | 1 |
| **1 + 1** | 2 |
| **2 + 1** | 3 |
| **3 + 1** | 4 |
| **4 + 1** | 5 |
| **5 + 1** | 6 |
| **6 + 1** | 7 |
| **7 + 1** | 8 |
| **8 + 1** | 9 |
| **9 + 1** | 10 |

## 🌟 Truc rapid

> **+1 = numărul următor!**
> Când vezi **+1**, gândește: "Care vine **după**?"

## 🎯 Exemple cu povești

> 🐱 Ana are **4 pisici**. Mai primește **1 pisică**. Acum are: 4 + 1 = **5 pisici** ✅

> 🍪 În borcan sunt **8 fursecuri**. Mama mai pune **1**. Total: 8 + 1 = **9 fursecuri** ✅

## 🧠 Reține!

✅ **+1 = vecinul următor**
✅ Învață **toate adunările cu 1** pe de rost!
`,
      problems: [
        add(0, 1),
        add(3, 1),
        add(5, 1),
        add(7, 1),
        add(9, 1),
        sa('Mere + 1', 'Ai **6 mere** 🍎 și mai primești **1**. Câte ai acum?', '7', '6 + 1 = **7 mere**.', { topic: T }),
        mc('Truc +1',
          'Ce trebuie să faci pentru a adăuga **+1**?',
          ['Numeri vecinul anterior', 'Numeri vecinul următor', 'Scazi 1', 'Schimbi numărul'],
          'Numeri vecinul următor',
          '+1 = vecinul următor în numărare.',
          { topic: T }),
      ],
    },

    {
      slug: 'adunare-cu-2',
      title: '19. Adunare cu 2',
      theory: `# ➕2️⃣ Adunarea cu 2

Acum mai facem un pas! 🦘

## 💡 Trucul

Când aduni **+2**, **sari peste un număr**!

| Calcul | Rezultat |
|---|---|
| **0 + 2** | 2 |
| **1 + 2** | 3 |
| **2 + 2** | 4 |
| **3 + 2** | 5 |
| **4 + 2** | 6 |
| **5 + 2** | 7 |
| **6 + 2** | 8 |
| **7 + 2** | 9 |
| **8 + 2** | 10 |

## 🦘 Sărit peste un număr

> 5 + 2: pornesc de la 5, sar la 6, apoi la **7** ✅

## 🎯 Exemplu cu poveste

> 🐦 Pe sârmă sunt **4 vrăbii**. Mai vin **2 vrăbii**. Total: 4 + 2 = **6 vrăbii** ✅

## 🧠 Reține!

✅ **+2 = sari peste un număr**
✅ Adăugăm 1, apoi încă 1
`,
      problems: [
        add(0, 2),
        add(3, 2),
        add(5, 2),
        add(8, 2),
        add(2, 2),
        sa('Vrăbii', 'Pe sârmă sunt **4 vrăbii** 🐦. Mai vin **2**. Câte sunt acum?', '6', '4 + 2 = **6 vrăbii**.', { topic: T }),
        add(6, 2),
      ],
    },

    {
      slug: 'adunare-pana-la-10',
      title: '20. Adunarea numerelor până la 10',
      theory: `# ➕ Adunarea până la 10

Astăzi explorăm **toate adunările** cu rezultat până la 10! 🚀

## 🎯 Tabla adunării (rezultat ≤ 10)

| + | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| **0** | 0 | 1 | 2 | 3 | 4 | 5 |
| **1** | 1 | 2 | 3 | 4 | 5 | 6 |
| **2** | 2 | 3 | 4 | 5 | 6 | 7 |
| **3** | 3 | 4 | 5 | 6 | 7 | 8 |
| **4** | 4 | 5 | 6 | 7 | 8 | 9 |
| **5** | 5 | 6 | 7 | 8 | 9 | 10 |

## 🌈 Strategii

**1. Numărare în continuare** — pornești de la cel mai mare:
> 2 + 5: pornesc de la 5, adaug 2 → 6, **7** ✅

**2. Descompunere** — desfaci un număr:
> 4 + 3 = 4 + 2 + 1 = 6 + 1 = **7**

**3. Dublarea** — adunările cu același număr:
> 3 + 3 = **6**, 4 + 4 = **8**, 5 + 5 = **10**

## 🧠 Reține!

✅ Adună mereu pornind de la cel **mai mare** număr
✅ Învață **dublările**: 1+1, 2+2, 3+3, 4+4, 5+5
`,
      problems: [
        add(3, 4),
        add(2, 6),
        add(4, 4),
        add(5, 3),
        add(6, 4),
        add(7, 2),
        sa('Bomboane', 'Ana are **3 bomboane** 🍬, sora ei îi dă **4**. Câte are acum?', '7', '3 + 4 = **7 bomboane**.', { topic: T }),
      ],
    },

    {
      slug: 'comutativitate',
      title: '21. Comutativitatea adunării',
      theory: `# 🔄 Comutativitatea — un cuvânt mare pentru un truc simplu!

Astăzi învățăm o **regulă magică**! ✨

## 🎯 Regula

> 🌟 **Ordinea nu contează la adunare!**
>
> **a + b = b + a**

## 📝 Exemple

| Calcul 1 | Calcul 2 | Rezultat |
|---|---|---|
| **2 + 3** | **3 + 2** | 5 |
| **4 + 5** | **5 + 4** | 9 |
| **1 + 7** | **7 + 1** | 8 |

## 🍎 De ce?

Imaginează-ți **2 mere** + **3 mere**:

🍎🍎 + 🍎🍎🍎 = **5 mere**

Acum invers: **3 mere** + **2 mere**:

🍎🍎🍎 + 🍎🍎 = **5 mere**

> Vezi? **Tot 5 mere!** Numerele sunt aceleași, doar ordinea diferă.

## 💡 La ce folosește?

Când vezi **2 + 8**, este mai ușor să gândești **8 + 2** (pornești de la cel mai mare)! 🚀

## 🧠 Reține!

✅ **a + b = b + a**
✅ Pornește de la **numărul mai mare** când aduni
✅ Comutativitate = ordinea **nu contează**
`,
      problems: [
        sa('2 + 5', 'Cât face **2 + 5**?', '7', '2 + 5 = 7 (sau 5 + 2 = 7).', { topic: T }),
        sa('Schimb ordine', 'Dacă **3 + 6 = 9**, cât face **6 + 3**?', '9', 'Comutativitate: ordinea nu contează → 6 + 3 = **9**.', { topic: T }),
        mc('Comutativitate',
          'Care este corect?',
          ['4 + 3 = 3 - 4', '4 + 3 = 3 + 4', '4 + 3 ≠ 3 + 4', '4 + 3 = 4 × 3'],
          '4 + 3 = 3 + 4',
          'Comutativitatea adunării: 4 + 3 = 3 + 4 = 7.',
          { topic: T }),
        sa('1 + 8 vs 8 + 1', 'Cât face **8 + 1**?', '9', '8 + 1 = 1 + 8 = **9**.', { topic: T }),
        add(7, 3),
        sa('5 + 4', 'Cât face **5 + 4**?', '9', '5 + 4 = **9**.', { topic: T }),
      ],
    },

    {
      slug: 'adunare-cu-zero',
      title: '22. Adunarea cu zero',
      theory: `# ➕0️⃣ Adunarea cu zero

Cel mai **ușor** truc! 🎉

## 🎯 Regula

> ⭐ **Orice număr + 0 = același număr!**

| Calcul | Rezultat |
|---|---|
| **5 + 0** | 5 |
| **0 + 8** | 8 |
| **3 + 0** | 3 |
| **0 + 0** | 0 |

## 🤔 De ce?

**Zero** înseamnă **niciun obiect**. Dacă adaugi **niciun obiect**, **nimic nu se schimbă**!

> 🍎🍎🍎 + (nimic) = 🍎🍎🍎
>
> 3 + 0 = **3** ✅

## 🧠 Reține!

✅ **n + 0 = n**
✅ **0 + n = n**
✅ Adunarea cu 0 nu schimbă numărul!
`,
      problems: [
        add(4, 0),
        add(0, 7),
        add(0, 0),
        add(9, 0),
        mc('Regula',
          'Care este rezultatul lui **8 + 0**?',
          ['0', '8', '80', '88'],
          '8',
          '8 + 0 = **8**. Adăugând 0, numărul nu se schimbă.',
          { topic: T }),
        sa('Zero', '0 + 6 = ?', '6', '0 + 6 = **6**.', { topic: T }),
        sa('Pahar gol', 'Ai **0 mere** 🍎 și primești **5**. Câte ai acum?', '5', '0 + 5 = **5 mere**.', { topic: T }),
      ],
    },

    {
      slug: 'probleme-adunare',
      title: '23. Probleme cu adunare 📖',
      theory: `# 📖 Probleme cu poveste

Astăzi rezolvăm **probleme adevărate**! 🕵️

## 🔑 Cum rezolvăm?

**4 pași magici** 🪄:

1. **Citesc** problema cu atenție 👀
2. **Înțeleg** ce mi se cere
3. **Calculez** (aduno)
4. **Scriu** răspunsul cu unitatea (mere, copii, etc.)

## 📝 Exemplu

> 📖 *Maria are 3 baloane 🎈🎈🎈. Tata îi mai cumpără 4 baloane. **Câte baloane are Maria în total?***

**Rezolvare:**
- Maria are **3** baloane
- Mai primește **4** baloane
- **Adun**: 3 + 4 = **7**

> ✏️ **Răspuns:** Maria are **7 baloane** 🎈

## 🌟 Cuvinte care arată că adunăm

- "**în total**"
- "**împreună**"
- "**adaugă**"
- "**mai primește**"
- "**vine**"

## 🧠 Reține!

✅ Citește problema **de 2 ori**
✅ Subliniază **numerele**
✅ Scrie răspunsul **cu cuvintele**
`,
      problems: [
        sa('Baloane', 'Maria are **3 baloane** 🎈. Tata îi cumpără **4**. Câte are în total?', '7', '3 + 4 = **7 baloane**.', { topic: T }),
        sa('Pisici', 'În curte sunt **2 pisici** 🐱. Mai vin **3**. Câte sunt acum?', '5', '2 + 3 = **5 pisici**.', { topic: T }),
        sa('Cărți', 'Ion are **5 cărți** 📚. Mama îi dă încă **2**. Câte cărți are?', '7', '5 + 2 = **7 cărți**.', { topic: T }),
        sa('Flori', 'În vază sunt **4 flori** 🌸. Andrei pune **3**. Câte sunt în total?', '7', '4 + 3 = **7 flori**.', { topic: T }),
        sa('Copii la joacă', 'În parc sunt **6 copii** 👦. Mai vin **2**. Câți sunt acum?', '8', '6 + 2 = **8 copii**.', { topic: T }),
        mc('Cuvinte cheie',
          'Ce cuvânt îți spune că trebuie să **aduni**?',
          ['mai puțin', 'în total', 'minus', 'rămas'],
          'în total',
          'Cuvântul "**în total**" indică adunare.',
          { topic: T }),
        sa('Stele', 'Pe cer sunt **5 stele** ⭐. Mai apar **5**. Câte sunt acum?', '10', '5 + 5 = **10 stele**.', { topic: T }),
      ],
    },

    {
      slug: 'recapitulare-adunare-10',
      title: '24. Recapitulare: adunarea 0–10',
      theory: `# 📚 Recapitulare adunare 0–10

Mare felicitare! Acum știi să aduni până la 10! 🎉

## 🌟 Reguli importante

✅ **a + b = b + a** (comutativitate)
✅ **n + 0 = n** (zero nu schimbă nimic)
✅ **+1 = vecinul următor**
✅ **+2 = sari peste unul**

## 🎯 Tabla magică (perechi de 10)

> Învață pe de rost! Te va ajuta toată viața!

| Calcul | = |
|---|---|
| 0 + 10 | 10 |
| 1 + 9 | 10 |
| 2 + 8 | 10 |
| 3 + 7 | 10 |
| 4 + 6 | 10 |
| 5 + 5 | 10 |

## 🧠 Trucuri rapide

🔹 **Dublări**: 1+1=2, 2+2=4, 3+3=6, 4+4=8, 5+5=10
🔹 **Numere apropiate de 10**: 9+1=10, 8+2=10
🔹 **Pornește mereu de la numărul mai mare**!
`,
      problems: [
        add(7, 3),
        add(4, 6),
        add(8, 2),
        sa('Pereche de 10', 'Care număr adăugat la **7** dă 10?', '3', '7 + 3 = **10**. Răspunsul este 3.', { topic: T }),
        sa('Pereche de 10', 'Care număr adăugat la **6** dă 10?', '4', '6 + 4 = **10**. Răspunsul este 4.', { topic: T }),
        add(5, 5),
        add(2, 8),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 4: SCĂDEREA 0–10 (lecțiile 25–31)
    // ════════════════════════════════════════════════════════

    {
      slug: 'ce-este-scaderea',
      title: '25. Ce este scăderea ➖',
      theory: `# ➖ Scăderea — luăm dintr-un grup

Astăzi învățăm **opusul adunării**! 🔄

## 🍪 Ce înseamnă să scazi?

**Scăderea** = să **iei** ceva dintr-un grup.

> 🍪🍪🍪🍪🍪 (5 fursecuri)
> Mănânci 🍪🍪 (2 fursecuri)
> Rămân: 🍪🍪🍪 (**3 fursecuri**)
>
> 5 − 2 = **3**

## ✏️ Semnul "−"

**−** se numește **minus** și înseamnă "luăm".

## 📝 Părțile unei scăderi

> 7 − 3 = 4

| Termen | Nume |
|---|---|
| **7** | descăzut (numărul mare) |
| **3** | scăzător (cât luăm) |
| **4** | rest / diferență |
| **−** | semnul minus |

## 🧮 Cum scădem?

**Metoda 1:** Cu degetele 🖐️
- Ridici 5 degete, îndoi 2 → rămân **3**

**Metoda 2:** Numără înapoi 🔢
- 7, apoi: 6 (−1), 5 (−2), **4** (−3)

**Metoda 3:** Tai cerculețe ❌⭕
- ⭕⭕⭕⭕⭕ → ❌❌⭕⭕⭕ → **3 rămase**

## 🧠 Reține!

✅ **−** = minus = "luăm"
✅ Rezultatul se numește **rest** sau **diferență**
✅ Scădem **mereu** numărul mai mic din cel mai mare
`,
      problems: [
        sub(5, 2),
        sub(7, 3),
        mc('Ce înseamnă −?',
          'Ce înseamnă semnul **−**?',
          ['Adăugăm', 'Luăm / scădem', 'Comparăm', 'Înmulțim'],
          'Luăm / scădem',
          'Semnul **−** (minus) înseamnă "luăm" sau "scădem".',
          { topic: T }),
        sa('Fursecuri', 'Ai **8 fursecuri** 🍪 și mănânci **3**. Câte rămân?', '5', '8 − 3 = **5 fursecuri**.', { topic: T }),
        sub(6, 4),
        mc('Cum se numește 4?',
          'În calculul **7 − 3 = 4**, cum se numește 4?',
          ['Sumă', 'Rest / diferență', 'Termen', 'Semn'],
          'Rest / diferență',
          'Rezultatul scăderii se numește **rest** sau **diferență**.',
          { topic: T }),
        sub(9, 5),
      ],
    },

    {
      slug: 'scadere-cu-1',
      title: '26. Scădere cu 1',
      theory: `# ➖1️⃣ Scădere cu 1

Cea mai **simplă** scădere! 🎯

## 💡 Trucul

Când scazi **−1**, ajungi la **vecinul mai mic**!

| Calcul | Rezultat |
|---|---|
| **10 − 1** | 9 |
| **9 − 1** | 8 |
| **8 − 1** | 7 |
| **7 − 1** | 6 |
| **6 − 1** | 5 |
| **5 − 1** | 4 |
| **4 − 1** | 3 |
| **3 − 1** | 2 |
| **2 − 1** | 1 |
| **1 − 1** | 0 |

## 🌟 Truc rapid

> **−1 = numărul anterior!**
> Când vezi **−1**, gândește: "Care vine **înainte**?"

## 🎯 Exemplu cu poveste

> 🍎 Pe masă sunt **6 mere**. Tata mănâncă **1**. Rămân: 6 − 1 = **5 mere** ✅

## 🧠 Reține!

✅ **−1 = vecinul anterior**
✅ Învață scăderile cu 1 pe de rost!
`,
      problems: [
        sub(5, 1),
        sub(8, 1),
        sub(10, 1),
        sub(3, 1),
        sa('Mere', 'Pe masă sunt **6 mere** 🍎. Tata mănâncă **1**. Câte rămân?', '5', '6 − 1 = **5 mere**.', { topic: T }),
        sub(1, 1),
        mc('Truc -1',
          'Ce trebuie să faci pentru a scădea **−1**?',
          ['Numeri vecinul următor', 'Numeri vecinul anterior', 'Adaugi 1', 'Schimbi numărul'],
          'Numeri vecinul anterior',
          '−1 = vecinul anterior (mai mic cu 1).',
          { topic: T }),
      ],
    },

    {
      slug: 'scadere-cu-2',
      title: '27. Scădere cu 2',
      theory: `# ➖2️⃣ Scădere cu 2

Mai facem un pas înapoi! 🦘

## 💡 Trucul

Când scazi **−2**, **dai 2 pași înapoi**!

| Calcul | Rezultat |
|---|---|
| **10 − 2** | 8 |
| **9 − 2** | 7 |
| **8 − 2** | 6 |
| **7 − 2** | 5 |
| **6 − 2** | 4 |
| **5 − 2** | 3 |
| **4 − 2** | 2 |
| **3 − 2** | 1 |
| **2 − 2** | 0 |

## 🎯 Exemplu cu poveste

> 🐦 Pe sârmă sunt **7 vrăbii**. Zboară **2**. Rămân: 7 − 2 = **5 vrăbii** ✅

## 🧠 Reține!

✅ **−2 = 2 pași înapoi**
✅ Numărăm: număr → −1 → −2
`,
      problems: [
        sub(5, 2),
        sub(8, 2),
        sub(10, 2),
        sub(3, 2),
        sub(2, 2),
        sa('Vrăbii', 'Pe sârmă sunt **7 vrăbii** 🐦. Zboară **2**. Câte rămân?', '5', '7 − 2 = **5 vrăbii**.', { topic: T }),
        sub(6, 2),
      ],
    },

    {
      slug: 'scadere-pana-la-10',
      title: '28. Scăderea numerelor până la 10',
      theory: `# ➖ Scădere până la 10

Astăzi exersăm **toate scăderile**! 🚀

## 🎯 Regula de aur

> ⭐ **Scădem mereu numărul mai MIC din cel mai MARE!**

✅ Corect: **8 − 3 = 5**
❌ Greșit: 3 − 8 (nu se poate la clasa 1)

## 🌈 Strategii

**1. Numărare înapoi** 🔢
> 9 − 4: pornesc de la 9, dau înapoi 4 pași: 8, 7, 6, **5** ✅

**2. Adunare inversă** 🔄
> 8 − 3 = ? gândește: "**3 + ? = 8**" → 3 + **5** = 8 → răspuns **5**

**3. Cu degetele** 🖐️
> 7 − 4: ridic 7 degete, îndoi 4 → rămân **3**

## 🌟 Lege importantă

> **n − n = 0** (orice număr scăzut din el însuși = 0)
> Exemplu: 5 − 5 = 0

## 🧠 Reține!

✅ Scădem **mic din mare**
✅ Numără **înapoi** pe degete
✅ **n − n = 0**
`,
      problems: [
        sub(9, 4),
        sub(7, 5),
        sub(8, 6),
        sub(10, 4),
        sub(6, 6),
        sa('Mere', 'Ai **9 mere** 🍎 și mănânci **4**. Câte rămân?', '5', '9 − 4 = **5 mere**.', { topic: T }),
        sub(10, 7),
      ],
    },

    {
      slug: 'scadere-cu-zero',
      title: '29. Scăderea cu zero',
      theory: `# ➖0️⃣ Scăderea cu zero

Cel mai **ușor** truc! 🎉

## 🎯 Regula

> ⭐ **n − 0 = n** (orice număr − 0 = același număr!)

| Calcul | Rezultat |
|---|---|
| **5 − 0** | 5 |
| **8 − 0** | 8 |
| **10 − 0** | 10 |

## 🤔 De ce?

Dacă **nu iei nimic** dintr-un grup, grupul **rămâne neschimbat**!

> 🍎🍎🍎🍎 − (nimic) = 🍎🍎🍎🍎
>
> 4 − 0 = **4** ✅

## 🌟 O altă regulă

> **n − n = 0** — dacă iei tot, **rămâne 0**!

| Calcul | Rezultat |
|---|---|
| **5 − 5** | 0 |
| **8 − 8** | 0 |
| **10 − 10** | 0 |

## 🧠 Reține!

✅ **n − 0 = n**
✅ **n − n = 0**
✅ Scăderea cu 0 nu schimbă numărul!
`,
      problems: [
        sub(7, 0),
        sub(4, 0),
        sub(10, 0),
        sub(5, 5),
        sub(9, 9),
        mc('Regula',
          'Care este rezultatul lui **8 − 0**?',
          ['0', '8', '80', '88'],
          '8',
          '8 − 0 = **8**. Scăzând 0, numărul nu se schimbă.',
          { topic: T }),
        sa('Tot', '6 − 6 = ?', '0', 'Dacă iei tot, rămâne **0**: 6 − 6 = 0.', { topic: T }),
      ],
    },

    {
      slug: 'probleme-scadere',
      title: '30. Probleme cu scădere 📖',
      theory: `# 📖 Probleme cu scădere

Astăzi rezolvăm probleme de **scădere**! 🕵️

## 🌟 Cuvinte care arată că scădem

- "**a rămas / au rămas**"
- "**mai puțin**"
- "**a luat / au luat**"
- "**a mâncat**"
- "**a vândut**"
- "**a plecat**"
- "**a zburat**"

## 📝 Exemplu

> 📖 *Pe creangă sunt 8 păsărele 🐦. 3 zboară. **Câte păsărele au rămas?***

**Rezolvare:**
- Erau **8** păsărele
- Au plecat **3**
- **Scad**: 8 − 3 = **5**

> ✏️ **Răspuns:** Au rămas **5 păsărele** 🐦

## 🔑 4 pași

1. **Citesc** atent 👀
2. **Înțeleg** ce s-a luat / a plecat
3. **Calculez** scăderea
4. **Scriu** răspunsul cu cuvinte

## 🧠 Reține!

✅ Cuvântul "**au rămas**" = scădere
✅ Subliniază numerele
✅ Scrie răspunsul **cu unitatea** (mere, copii etc.)
`,
      problems: [
        sa('Păsări', 'Pe creangă sunt **8 păsărele** 🐦. **3** zboară. Câte rămân?', '5', '8 − 3 = **5 păsărele**.', { topic: T }),
        sa('Bomboane', 'Ai **10 bomboane** 🍬. Mănânci **4**. Câte rămân?', '6', '10 − 4 = **6 bomboane**.', { topic: T }),
        sa('Mașinuțe', 'Ion are **7 mașinuțe** 🚗. Dă **2** prietenului. Câte îi rămân?', '5', '7 − 2 = **5 mașinuțe**.', { topic: T }),
        sa('Flori', 'În vază sunt **9 flori** 🌸. Se ofilesc **4**. Câte sunt sănătoase?', '5', '9 − 4 = **5 flori**.', { topic: T }),
        sa('Copii la joacă', 'În parc erau **8 copii** 👦. **3** au plecat. Câți au rămas?', '5', '8 − 3 = **5 copii**.', { topic: T }),
        mc('Cuvinte cheie',
          'Ce cuvânt îți spune că trebuie să **scazi**?',
          ['în total', 'au rămas', 'împreună', 'mai primește'],
          'au rămas',
          'Cuvântul "**au rămas**" indică scădere.',
          { topic: T }),
        sa('Cărți', 'Ai **6 cărți** 📚. Împrumuți **2**. Câte rămân pe raft?', '4', '6 − 2 = **4 cărți**.', { topic: T }),
      ],
    },

    {
      slug: 'recapitulare-scadere-10',
      title: '31. Recapitulare: scăderea 0–10',
      theory: `# 📚 Recapitulare scădere 0–10

Felicitări! Știi acum să scazi! 🎉

## 🌟 Reguli importante

✅ Scădem **mic din mare** (la clasa 1)
✅ **n − 0 = n** (zero nu schimbă)
✅ **n − n = 0** (totul = nimic)
✅ **−1 = vecinul anterior**

## 🎯 Trucul "perechi de 10" la scădere

> Cunoști **adunările de 10**? Le poți inversa!

| Adunare | Scădere |
|---|---|
| 7 + 3 = 10 | 10 − 3 = 7 |
| 4 + 6 = 10 | 10 − 6 = 4 |
| 5 + 5 = 10 | 10 − 5 = 5 |

## 🌟 Familia de calcule

> Din **3 + 4 = 7** obținem 4 calcule!

- 3 + 4 = 7 ✅
- 4 + 3 = 7 ✅
- 7 − 3 = 4 ✅
- 7 − 4 = 3 ✅
`,
      problems: [
        sub(10, 3),
        sub(10, 6),
        sub(10, 5),
        sa('Familie de calcule', 'Dacă **3 + 4 = 7**, cât face **7 − 3**?', '4', 'Familie de calcule: 3+4=7 ⇒ 7−3=**4**.', { topic: T }),
        sub(8, 5),
        sub(9, 7),
        sub(10, 9),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 5: NUMERELE 11–20 (lecțiile 32–36)
    // ════════════════════════════════════════════════════════

    {
      slug: 'numerele-11-12',
      title: '32. Numerele 11 și 12',
      theory: `# 🔟➕ Numerele 11 și 12

Acum mergem **peste 10**! 🚀

## 🎯 Cum se formează?

Numerele de la 11 la 19 = **10 + o cifră**.

| Număr | Citim | Format |
|---|---|---|
| **11** | unsprezece | 10 + 1 |
| **12** | doisprezece | 10 + 2 |

## 🧩 Zeci și unități

> 🧱 **O zece** = 10 obiecte legate împreună
> ⚪ **Unități** = obiecte separate

| Număr | Zeci | Unități |
|---|---|---|
| **11** | 1 | 1 |
| **12** | 1 | 2 |

## 📝 Exemple vizuale

> 11 = 🟦 (zece) + 🟢 = **unsprezece**
> 12 = 🟦 (zece) + 🟢🟢 = **doisprezece**

## 🧠 Reține!

✅ **11 = 10 + 1** (unsprezece)
✅ **12 = 10 + 2** (doisprezece)
✅ Au **2 cifre**: prima arată **zeci**, a doua **unități**
`,
      problems: [
        sa('10 + 1', '10 + 1 = ?', '11', '10 + 1 = **11** (unsprezece).', { topic: T }),
        sa('10 + 2', '10 + 2 = ?', '12', '10 + 2 = **12** (doisprezece).', { topic: T }),
        mc('Cifre',
          'Câte cifre are numărul **11**?',
          ['1', '2', '3', '11'],
          '2',
          'Numărul 11 are **2 cifre** (1 și 1).',
          { topic: T }),
        vecin(11, 'urm'),
        vecin(12, 'mic'),
        cmp(11, 12),
        sa('Total', '10 + 2 + 0 = ?', '12', '10 + 2 = **12**.', { topic: T }),
      ],
    },

    {
      slug: 'numerele-13-14-15',
      title: '33. Numerele 13, 14, 15',
      theory: `# 🔢 Numerele 13, 14, 15

Continuăm să urcăm! 📈

## 🎯 Format

| Număr | Citim | Format |
|---|---|---|
| **13** | treisprezece | 10 + 3 |
| **14** | paisprezece | 10 + 4 |
| **15** | cincisprezece | 10 + 5 |

## 🧩 Zeci și unități

| Număr | Zeci | Unități |
|---|---|---|
| **13** | 1 | 3 |
| **14** | 1 | 4 |
| **15** | 1 | 5 |

## 📝 Exemple

> 13 = 🟦 + 🟢🟢🟢 = **treisprezece**
> 14 = 🟦 + 🟢🟢🟢🟢 = **paisprezece**
> 15 = 🟦 + 🟢🟢🟢🟢🟢 = **cincisprezece**

## 🧠 Reține!

✅ **13 = 10 + 3**
✅ **14 = 10 + 4**
✅ **15 = 10 + 5**
✅ "**spre-zece**" = "spre 10" 🪜
`,
      problems: [
        sa('10 + 3', '10 + 3 = ?', '13', '10 + 3 = **13**.', { topic: T }),
        sa('10 + 4', '10 + 4 = ?', '14', '10 + 4 = **14**.', { topic: T }),
        sa('10 + 5', '10 + 5 = ?', '15', '10 + 5 = **15**.', { topic: T }),
        cmp(13, 15),
        vecin(14, 'urm'),
        mc('Cum citim 13?',
          'Cum se citește numărul **13**?',
          ['Unsprezece', 'Treisprezece', 'Treizeci', 'Treizeci și unu'],
          'Treisprezece',
          '13 se citește **treisprezece** (10 + 3).',
          { topic: T }),
        sa('Unitățile lui 14', 'Câte unități are numărul **14**?', '4', '14 = 1 zece + **4 unități**.', { topic: T }),
      ],
    },

    {
      slug: 'numerele-16-17-18',
      title: '34. Numerele 16, 17, 18',
      theory: `# 🔢 Numerele 16, 17, 18

Aproape am ajuns la 20! 🎯

## 🎯 Format

| Număr | Citim | Format |
|---|---|---|
| **16** | șaisprezece | 10 + 6 |
| **17** | șaptesprezece | 10 + 7 |
| **18** | optsprezece | 10 + 8 |

## 🧩 Zeci și unități

| Număr | Zeci | Unități |
|---|---|---|
| **16** | 1 | 6 |
| **17** | 1 | 7 |
| **18** | 1 | 8 |

## 🧠 Reține!

✅ Toate **au 1 zece** și **diferite unități**
✅ "**spre-zece**" = sufix pentru 11–19
✅ Numărăm: 13, 14, 15, 16, 17, 18 ⬆️
`,
      problems: [
        sa('10 + 6', '10 + 6 = ?', '16', '10 + 6 = **16**.', { topic: T }),
        sa('10 + 7', '10 + 7 = ?', '17', '10 + 7 = **17**.', { topic: T }),
        sa('10 + 8', '10 + 8 = ?', '18', '10 + 8 = **18**.', { topic: T }),
        cmp(16, 17),
        cmp(18, 16),
        vecin(17, 'urm'),
        vecin(16, 'mic'),
      ],
    },

    {
      slug: 'numerele-19-20',
      title: '35. Numerele 19 și 20 — ZECI! 🎉',
      theory: `# 🔢 Numerele 19 și 20

**20** este SUPER SPECIAL — este **2 zeci**! 🥳

## 🎯 Format

| Număr | Citim | Format |
|---|---|---|
| **19** | nouăsprezece | 10 + 9 |
| **20** | douăzeci | **2 × 10** |

## 🧩 Zeci și unități

| Număr | Zeci | Unități |
|---|---|---|
| **19** | 1 | 9 |
| **20** | **2** | **0** |

## 🌟 De ce e special 20?

> **20 = 2 zeci** = două grupuri de 10!
>
> 🟦🟦 = douăzeci

| Calcul | = |
|---|---|
| 19 + 1 | **20** |
| 10 + 10 | **20** |
| 5 + 5 + 5 + 5 | **20** |

## 🧠 Reține!

✅ **19 = 10 + 9** (nouăsprezece)
✅ **20 = 2 zeci** (douăzeci)
✅ După 20 vine 21 (douăzeci și unu)
`,
      problems: [
        sa('10 + 9', '10 + 9 = ?', '19', '10 + 9 = **19**.', { topic: T }),
        sa('19 + 1', '19 + 1 = ?', '20', '19 + 1 = **20** (douăzeci).', { topic: T }),
        sa('10 + 10', '10 + 10 = ?', '20', '10 + 10 = **20**.', { topic: T }),
        mc('Câte zeci în 20?',
          'Câte zeci are numărul **20**?',
          ['1', '2', '3', '20'],
          '2',
          '20 = **2 zeci** = 2 × 10.',
          { topic: T }),
        cmp(19, 20),
        vecin(20, 'urm'),
        sa('Cifra unităților lui 20', 'Care este **cifra unităților** lui 20?', '0', '20 = 2 zeci + **0 unități**.', { topic: T }),
      ],
    },

    {
      slug: 'comparare-11-20',
      title: '36. Compararea numerelor 11–20',
      theory: `# 🔍 Compararea numerelor 11–20

Acum că știm numerele până la 20, le comparăm! 🆚

## 🎯 Regula

Pentru a compara două numere până la 20:

1. **Numără pe rând** — care vine **mai târziu** este **mai mare**
2. Pentru numere între 11 și 19, **toate au 1 zece**, deci **compari unitățile**!

## 📝 Exemple

> 13 vs 17: ambele au 1 zece. Comparăm 3 și 7 → **17 > 13** ✅

> 19 vs 11: ambele au 1 zece. 9 > 1 → **19 > 11** ✅

> 20 vs 15: 20 are **2 zeci**, 15 are **1 zece**. 20 are mai multe zeci → **20 > 15** ✅

## 🧠 Reține!

✅ **Mai multe zeci** = număr mai mare
✅ Aceleași zeci? Comparăm **unitățile**!
`,
      problems: [
        cmp(13, 17),
        cmp(19, 11),
        cmp(20, 15),
        cmp(14, 14),
        cmp(18, 12),
        mc('Cel mai mare',
          'Care este **cel mai mare**?',
          ['11', '15', '18', '20'],
          '20',
          '20 are 2 zeci, este cel mai mare.',
          { topic: T }),
        mc('Cel mai mic',
          'Care este **cel mai mic** dintre: 16, 12, 19, 14?',
          ['12', '14', '16', '19'],
          '12',
          'Cel mai mic este **12**.',
          { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 6: ADUNARE/SCĂDERE 11–20 fără trecere (37–42)
    // ════════════════════════════════════════════════════════

    {
      slug: 'adunare-10-plus-numar',
      title: '37. Adunare: 10 + un număr',
      theory: `# ➕ Adunare: 10 + un număr

Cea mai **simplă** adunare cu 10! 🎯

## 🎯 Trucul magic

> ⭐ **10 + n = 1n** (numărul devine "spre-zece"!)

| Calcul | Rezultat |
|---|---|
| **10 + 1** | 11 |
| **10 + 2** | 12 |
| **10 + 3** | 13 |
| **10 + 4** | 14 |
| **10 + 5** | 15 |
| **10 + 6** | 16 |
| **10 + 7** | 17 |
| **10 + 8** | 18 |
| **10 + 9** | 19 |

## 💡 De ce?

**10** este "1 zece + 0 unități". Când adăugăm o cifră, ea devine **unitatea**!

> 10 + **5** = 1 zece + **5** unități = **15** ✅

## 🧠 Reține!

✅ **10 + n = numărul spre-zece** corespunzător
✅ Asta este foarte ușor!
`,
      problems: [
        add(10, 4),
        add(10, 7),
        add(10, 9),
        add(10, 6),
        add(10, 1),
        sa('10 + 8', '10 + 8 = ?', '18', '10 + 8 = **18**.', { topic: T }),
        sa('Mere', 'Coșul are **10 mere**. Mai pun **3**. Câte sunt acum?', '13', '10 + 3 = **13 mere**.', { topic: T }),
      ],
    },

    {
      slug: 'adunare-11-20-fara-trecere',
      title: '38. Adunare 11–20 (fără trecere)',
      theory: `# ➕ Adunare 11–20 (fără trecere peste 10)

Acum adăugăm cifre la numerele "spre-zece"! 🚀

## 🎯 Trucul

> ⭐ **Adună cifra la unități, lasă zecea în pace!**

| Calcul | Cum gândim | Rezultat |
|---|---|---|
| **12 + 3** | 12 are 1 zece + 2 unități. 2+3=5 → **15** | 15 |
| **14 + 5** | 4+5=9 → **19** | 19 |
| **11 + 7** | 1+7=8 → **18** | 18 |
| **15 + 4** | 5+4=9 → **19** | 19 |

## 💡 Pas cu pas

> **13 + 4** =
> 1. Despart 13 = **10 + 3**
> 2. Adun unitățile: 3 + 4 = **7**
> 3. Adăuga zecele: 10 + 7 = **17** ✅

## ⚠️ Atenție!

> Funcționează **doar** când unitățile **nu trec peste 9**!
> Exemplu: 14 + 8 (4+8=12) — **trece peste 10**, învățăm la lecția următoare.

## 🧠 Reține!

✅ Adună **doar unitățile**
✅ Lasă **zecele neschimbat** (când nu trece)
`,
      problems: [
        add(12, 3),
        add(14, 5),
        add(11, 7),
        add(15, 4),
        add(13, 6),
        sa('Mere', 'Ai **12 mere** 🍎. Mai primești **5**. Câte ai acum?', '17', '12 + 5 = **17 mere**.', { topic: T }),
        add(16, 3),
      ],
    },

    {
      slug: 'scadere-11-20-fara-trecere',
      title: '39. Scădere 11–20 (fără împrumut)',
      theory: `# ➖ Scădere 11–20 (fără împrumut)

Scădem **doar unitățile**! 🎯

## 🎯 Trucul

> ⭐ **Scade cifra din unități, lasă zecea neschimbată!**

| Calcul | Cum gândim | Rezultat |
|---|---|---|
| **15 − 3** | 5−3=2 → **12** | 12 |
| **18 − 5** | 8−5=3 → **13** | 13 |
| **19 − 7** | 9−7=2 → **12** | 12 |
| **17 − 4** | 7−4=3 → **13** | 13 |

## 💡 Pas cu pas

> **16 − 4** =
> 1. Despart 16 = **10 + 6**
> 2. Scad din unități: 6 − 4 = **2**
> 3. Adăuga zecele: 10 + 2 = **12** ✅

## 🧠 Reține!

✅ Scade **doar unitățile**
✅ **Zecele rămâne** la fel (când nu împrumutăm)
`,
      problems: [
        sub(15, 3),
        sub(18, 5),
        sub(19, 7),
        sub(17, 4),
        sub(16, 4),
        sa('Bomboane', 'Ai **18 bomboane**. Mănânci **6**. Câte rămân?', '12', '18 − 6 = **12 bomboane**.', { topic: T }),
        sub(20, 5),
      ],
    },

    {
      slug: 'scadere-pana-la-10-din-spre-zece',
      title: '40. Scădere: 1n − unitățile = 10',
      theory: `# ➖ Scădere până la 10

Acum un truc special! 🎯

## 🎯 Trucul

> Când scădem **toate unitățile** dintr-un număr "spre-zece", rămâne **10**!

| Calcul | Rezultat |
|---|---|
| **15 − 5** | 10 |
| **17 − 7** | 10 |
| **19 − 9** | 10 |
| **12 − 2** | 10 |

## 💡 De ce?

**15** = 10 + 5. Dacă **scădem 5**, rămâne... **10**! ✅

## 🌟 Și invers

| Adunare | Scădere |
|---|---|
| 10 + 5 = 15 | 15 − 5 = 10 |
| 10 + 8 = 18 | 18 − 8 = 10 |

## 🧠 Reține!

✅ **1n − n = 10** (mereu!)
`,
      problems: [
        sub(15, 5),
        sub(17, 7),
        sub(19, 9),
        sub(12, 2),
        sub(18, 8),
        sub(14, 4),
        sa('Cât rămâne?', 'Ce trebuie să scazi din **16** ca să rămână 10?', '6', '16 − 6 = **10**. Răspunsul este 6.', { topic: T }),
      ],
    },

    {
      slug: 'probleme-pana-la-20',
      title: '41. Probleme cu poveste până la 20',
      theory: `# 📖 Probleme până la 20

Aplicăm tot ce am învățat! 🕵️

## 🌟 4 pași

1. **Citesc** atent
2. **Scriu** numerele
3. **Aleg** operația (+ sau −)
4. **Calculez** și **răspund**

## 📝 Exemplu

> 📖 *Maria are 11 stickere ⭐. Tata îi dă 5 stickere. Câte are acum?*

**Rezolvare:**
- Are **11** stickere
- Primește **5** (mai multe → adunare)
- 11 + 5 = **16**

> ✏️ Răspuns: Maria are **16 stickere** ⭐

## 🧠 Reține!

✅ "**Primește, mai vine**" → adunare
✅ "**Dă, pleacă, rămâne**" → scădere
`,
      problems: [
        sa('Stickere', 'Maria are **11 stickere** ⭐. Mai primește **5**. Câte are?', '16', '11 + 5 = **16 stickere**.', { topic: T }),
        sa('Cărți', 'Pe raft sunt **17 cărți** 📚. Iei **3**. Câte rămân?', '14', '17 − 3 = **14 cărți**.', { topic: T }),
        sa('Pisici', 'În adăpost sunt **13 pisici** 🐱. Mai vin **6**. Câte sunt acum?', '19', '13 + 6 = **19 pisici**.', { topic: T }),
        sa('Bomboane', 'Ai **20 bomboane** 🍬. Dai **8** prietenilor. Câte rămân?', '12', '20 − 8 = **12 bomboane**.', { topic: T }),
        sa('Floricele', 'În grădină sunt **14 flori** 🌸. Înflorește încă **5**. Câte sunt?', '19', '14 + 5 = **19 flori**.', { topic: T }),
        sa('Mașinuțe', 'Ion are **18 mașinuțe** 🚗. Dă **4**. Câte rămân?', '14', '18 − 4 = **14 mașinuțe**.', { topic: T }),
        sa('Total', 'În clasă sunt **12 fete** și **6 băieți**. Câți copii sunt?', '18', '12 + 6 = **18 copii**.', { topic: T }),
      ],
    },

    {
      slug: 'recapitulare-11-20',
      title: '42. Recapitulare 11–20',
      theory: `# 📚 Recapitulare 11–20

Felicitări! Stăpânești numerele până la 20! 🎉

## 🌟 Numerele 11–20

| Număr | Cum citim | Zeci | Unități |
|---|---|---|---|
| 11 | unsprezece | 1 | 1 |
| 12 | doisprezece | 1 | 2 |
| 13 | treisprezece | 1 | 3 |
| 14 | paisprezece | 1 | 4 |
| 15 | cincisprezece | 1 | 5 |
| 16 | șaisprezece | 1 | 6 |
| 17 | șaptesprezece | 1 | 7 |
| 18 | optsprezece | 1 | 8 |
| 19 | nouăsprezece | 1 | 9 |
| **20** | **douăzeci** | **2** | **0** |

## 🎯 Operații (fără trecere)

✅ **+/−** doar la unități
✅ **Zecea rămâne** neschimbată
`,
      problems: [
        add(13, 5),
        sub(18, 7),
        cmp(15, 19),
        sa('Vecini', 'Care este vecinul mai mare al lui **17**?', '18', 'Vecinul mai mare al lui 17 este **18**.', { topic: T }),
        add(11, 8),
        sub(20, 10),
        sa('Total', '12 + 7 = ?', '19', '12 + 7 = **19**.', { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 7: TRECERE PESTE 10 (lecțiile 43–47)
    // ════════════════════════════════════════════════════════

    {
      slug: 'adunare-trecere-peste-10',
      title: '43. Adunare cu trecere peste 10',
      theory: `# ➕🚀 Adunare cu trecere peste 10

Acum facem un calcul mai **interesant**! 🎯

## 🤔 Ce înseamnă "trecere peste 10"?

Când adunăm două numere și **rezultatul depășește 10**.

> 8 + 5 = ? (8 + 2 = 10, mai rămân 3 → **13**)

## 🌈 Strategia "fă 10"

> ⭐ **Pas 1:** Vezi cât îți lipsește până la 10
> ⭐ **Pas 2:** Despart al doilea număr
> ⭐ **Pas 3:** Adună mai întâi până la 10, apoi adaugă restul

## 📝 Exemplu pas cu pas

**8 + 5 = ?**

1. **8** are nevoie de **2** ca să facă 10 (8 + 2 = 10)
2. **Despart 5** = 2 + 3
3. **8 + 2** = 10
4. **10 + 3** = **13** ✅

## 📋 Tabelul "trecere peste 10"

| Calcul | Strategie | = |
|---|---|---|
| 9 + 4 | 9+1=10, +3 | 13 |
| 8 + 5 | 8+2=10, +3 | 13 |
| 7 + 6 | 7+3=10, +3 | 13 |
| 9 + 7 | 9+1=10, +6 | 16 |
| 8 + 7 | 8+2=10, +5 | 15 |

## 🧠 Reține!

✅ **Fă mai întâi 10**, apoi adaugă restul
✅ Învață **complementele lui 10**: 9+1, 8+2, 7+3, 6+4
`,
      problems: [
        add(8, 5),
        add(9, 4),
        add(7, 6),
        add(9, 7),
        add(8, 7),
        sa('Mere', 'Ai **9 mere** 🍎. Mai primești **5**. Câte ai acum?', '14', '9 + 5 = **14** (9+1=10, +4=14).', { topic: T }),
        add(6, 8),
      ],
    },

    {
      slug: 'descompunerea-numerelor',
      title: '44. Descompunerea numerelor (truc magic)',
      theory: `# 🧩 Descompunerea numerelor

Învățăm să **rupem** numerele în bucăți! ✂️

## 🎯 Ce înseamnă descompunere?

> ⭐ **Descompunere** = a scrie un număr ca **sumă de alte numere**

| Număr | Descompuneri |
|---|---|
| **5** | 1+4, 2+3, 3+2, 4+1 |
| **8** | 1+7, 2+6, 3+5, 4+4, 5+3, 6+2, 7+1 |
| **10** | 1+9, 2+8, 3+7, 4+6, 5+5 |

## 🌈 De ce e util?

> Când vrei să faci **9 + 6**, descompui **6** = 1 + 5
> Atunci: 9 + **1** = 10, apoi 10 + **5** = **15** ✅

## 🎯 Exersăm!

> **8 + 7** =
> Descompun 7 = **2 + 5**
> 8 + 2 = 10
> 10 + 5 = **15** ✅

## 🧠 Reține!

✅ Descompunerea ajută la **trecere peste 10**
✅ Caută **prietenul lui 10** pentru primul număr
`,
      problems: [
        sa('Descompune 7', '7 = 5 + ?', '2', '7 = 5 + **2**.', { topic: T }),
        sa('Descompune 8', '8 = 6 + ?', '2', '8 = 6 + **2**.', { topic: T }),
        add(9, 5),
        add(7, 8),
        sa('Pereche 10', 'Care e perechea lui **8** ca să facă 10?', '2', '8 + **2** = 10.', { topic: T }),
        sa('Pereche 10', 'Care e perechea lui **6** ca să facă 10?', '4', '6 + **4** = 10.', { topic: T }),
        add(6, 9),
      ],
    },

    {
      slug: 'scadere-cu-imprumut',
      title: '45. Scădere cu împrumut (peste 10)',
      theory: `# ➖🚀 Scădere cu împrumut

Acum scăderea complicată! 🎯

## 🤔 Ce înseamnă?

Când scădem și **trebuie să "luăm" din zece**.

> **13 − 5 = ?** (5 e mai mare decât 3, trebuie să luăm din zece)

## 🌈 Strategia "scade până la 10"

> ⭐ Pas 1: Scade până ajungi la 10
> ⭐ Pas 2: Scade restul

## 📝 Exemplu pas cu pas

**13 − 5 = ?**

1. **Scad mai întâi 3**: 13 − 3 = **10**
2. **Mai rămân de scăzut**: 5 − 3 = **2**
3. **10 − 2 = 8** ✅

> Deci: 13 − 5 = **8**

## 📋 Tabelul

| Calcul | Strategie | = |
|---|---|---|
| 12 − 5 | 12−2=10, −3 | 7 |
| 14 − 6 | 14−4=10, −2 | 8 |
| 15 − 8 | 15−5=10, −3 | 7 |
| 17 − 9 | 17−7=10, −2 | 8 |

## 🧠 Reține!

✅ **Scade mai întâi până la 10**, apoi restul
`,
      problems: [
        sub(13, 5),
        sub(12, 5),
        sub(14, 6),
        sub(15, 8),
        sub(17, 9),
        sa('Bomboane', 'Ai **13 bomboane** 🍬. Mănânci **6**. Câte rămân?', '7', '13 − 6 = **7**.', { topic: T }),
        sub(16, 7),
      ],
    },

    {
      slug: 'probleme-trecere-peste-10',
      title: '46. Probleme cu trecere peste 10',
      theory: `# 📖 Probleme cu trecere peste 10

Aplicăm trucurile! 🕵️

## 📝 Exemplu

> 📖 *În acvariu sunt 8 peștișori 🐟. Mai pun 7. Câți sunt acum?*

**Rezolvare:**
- 8 + 7 = ?
- 8 + **2** = 10, mai rămân 5
- 10 + 5 = **15** 🐟

> ✏️ Răspuns: **15 peștișori**

## 🧠 Trucuri

✅ Folosește **strategia fă 10**
✅ Pentru scădere: **scade până la 10** apoi restul
`,
      problems: [
        sa('Pești', 'În acvariu sunt **8 peștișori** 🐟. Mai pun **7**. Câți sunt?', '15', '8 + 7 = **15**.', { topic: T }),
        sa('Cărți', 'Pe raft sunt **9 cărți** 📚. Mai aduci **6**. Câte sunt?', '15', '9 + 6 = **15**.', { topic: T }),
        sa('Copii', 'În clasă erau **15 copii**. Au plecat **8**. Câți rămân?', '7', '15 − 8 = **7**.', { topic: T }),
        sa('Mașini', 'În parcare sunt **7 mașini**. Mai vin **8**. Câte sunt?', '15', '7 + 8 = **15**.', { topic: T }),
        sa('Mere', 'În coș erau **14 mere** 🍎. Ai mâncat **6**. Câte rămân?', '8', '14 − 6 = **8**.', { topic: T }),
        sa('Stele', 'Ana are **9 stele** ⭐, Maria **8**. Câte sunt în total?', '17', '9 + 8 = **17**.', { topic: T }),
        sa('Cărți', 'Erau **18 cărți** 📚. Iei **9**. Câte rămân?', '9', '18 − 9 = **9**.', { topic: T }),
      ],
    },

    {
      slug: 'recapitulare-trecere',
      title: '47. Recapitulare trecere peste 10',
      theory: `# 📚 Recapitulare trecere peste 10

Felicitări! Acesta a fost cel mai greu capitol! 💪

## 🌟 Strategii învățate

✅ **Adunare**: fă 10 mai întâi, apoi adaugă restul
✅ **Scădere**: scade până la 10, apoi restul
✅ **Descompunere**: rupe numărul în bucăți utile

## 🎯 Tabela (memorează!)

| + | 7 | 8 | 9 |
|---|---|---|---|
| **5** | 12 | 13 | 14 |
| **6** | 13 | 14 | 15 |
| **7** | 14 | 15 | 16 |
| **8** | 15 | 16 | 17 |
| **9** | 16 | 17 | 18 |
`,
      problems: [
        add(7, 8),
        add(9, 6),
        sub(13, 7),
        sub(15, 9),
        add(8, 6),
        sub(14, 8),
        add(9, 9),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 8: NUMERE 0–100 (lecțiile 48–53)
    // ════════════════════════════════════════════════════════

    {
      slug: 'zeci-intregi',
      title: '48. Zeci întregi: 10, 20, 30...',
      theory: `# 🔟🔟 Zeci întregi

Acum mergem pe **scara zecilor**! 🪜

## 🎯 Zeci întregi de la 10 la 100

| Număr | Citim | Câte zeci |
|---|---|---|
| **10** | zece | 1 |
| **20** | douăzeci | 2 |
| **30** | treizeci | 3 |
| **40** | patruzeci | 4 |
| **50** | cincizeci | 5 |
| **60** | șaizeci | 6 |
| **70** | șaptezeci | 7 |
| **80** | optzeci | 8 |
| **90** | nouăzeci | 9 |
| **100** | o sută | 10 zeci |

## 🌟 Truc

> Toate au **0** la unități și **cifra zecilor** la stânga!
>
> 30 = **3** zeci, 70 = **7** zeci

## 🧠 Reține!

✅ Numerele cu **0 la coadă** sunt zeci întregi
✅ **100** = 10 zeci = "**o sută**"
`,
      problems: [
        sa('20 + 10', '20 + 10 = ?', '30', '20 + 10 = **30** (2 zeci + 1 zece).', { topic: T }),
        sa('30 + 30', '30 + 30 = ?', '60', '30 + 30 = **60**.', { topic: T }),
        sa('Câte zeci?', 'Câte zeci are **70**?', '7', '70 = **7 zeci**.', { topic: T }),
        mc('Nume',
          'Cum se citește **50**?',
          ['Cincisprezece', 'Cincizeci', 'Cinci sute', 'Cinci'],
          'Cincizeci',
          '50 = **cincizeci** (5 zeci).',
          { topic: T }),
        cmp(40, 60),
        sa('Vecini', 'Vecinul mai mare al lui **30** (zeci întregi)?', '40', 'Următoarea zece după 30 este **40**.', { topic: T }),
        sa('100', '90 + 10 = ?', '100', '90 + 10 = **100** (o sută).', { topic: T }),
      ],
    },

    {
      slug: 'numere-pana-la-100',
      title: '49. Numerele până la 100',
      theory: `# 💯 Numerele până la 100

Acum putem număra **toate** numerele până la 100! 🎉

## 🎯 Cum se formează?

> **Zeci + unități**

| Număr | Zeci | Unități | Citim |
|---|---|---|---|
| **23** | 2 | 3 | douăzeci și trei |
| **45** | 4 | 5 | patruzeci și cinci |
| **67** | 6 | 7 | șaizeci și șapte |
| **89** | 8 | 9 | optzeci și nouă |

## 📝 Cum citim?

> **Zecile** + "și" + **unitățile**
>
> Exemplu: **34** = "**treizeci și patru**"

## ⚠️ Excepții (citire specială)

- 11–19: **un**sprezece, **doi**sprezece... (nu "zece și unu")

## 🧠 Reține!

✅ Toate numerele între 21 și 99 au **2 cifre**
✅ Stânga = **zeci**, dreapta = **unități**
✅ Folosim "**și**" între ele când citim
`,
      problems: [
        sa('Citire', 'Cum se citește **34**? (scrie cifrele răspunsului)', '34', '34 = treizeci și patru.', { topic: T }),
        mc('Cum citim 67?',
          'Cum citim **67**?',
          ['Șapte și șase', 'Șaizeci și șapte', 'Șase sute șapte', 'Șaptezeci și șase'],
          'Șaizeci și șapte',
          '67 = **șaizeci și șapte** (6 zeci + 7 unități).',
          { topic: T }),
        sa('Zeci', 'Câte zeci are **45**?', '4', '45 = **4 zeci** + 5 unități.', { topic: T }),
        sa('Unități', 'Câte unități are **78**?', '8', '78 = 7 zeci + **8 unități**.', { topic: T }),
        sa('Format', 'Numărul cu **5 zeci și 3 unități** este?', '53', '5 zeci + 3 unități = **53**.', { topic: T }),
        sa('Format', 'Numărul cu **8 zeci și 0 unități** este?', '80', '8 zeci + 0 unități = **80**.', { topic: T }),
        cmp(56, 65),
      ],
    },

    {
      slug: 'zeci-si-unitati',
      title: '50. Zeci și unități',
      theory: `# 🧩 Zeci și unități — descompunerea

Învățăm să **descompunem** orice număr! 🪄

## 🎯 Regula

> Orice număr de 2 cifre = **zeci × 10 + unități**

## 📝 Exemple

| Număr | Zeci | Unități | Descompunere |
|---|---|---|---|
| **24** | 2 | 4 | 20 + 4 |
| **57** | 5 | 7 | 50 + 7 |
| **83** | 8 | 3 | 80 + 3 |
| **40** | 4 | 0 | 40 + 0 |

## 💡 De ce e util?

> Pentru **calcule mari**! Despărțim și calculăm pe rând.
>
> Exemplu: 23 + 14 = (20+3) + (10+4) = **30 + 7 = 37** ✅

## 🧠 Reține!

✅ Orice număr = **zeci + unități**
✅ Cifra **stânga** = zeci × 10
✅ Cifra **dreapta** = unități × 1
`,
      problems: [
        sa('Descompune 36', '36 = ? + 6 (cât trebuie să adăugăm la 6 ca să dea 36?)', '30', '36 = **30** + 6.', { topic: T }),
        sa('Descompune 47', '47 = 40 + ?', '7', '47 = 40 + **7**.', { topic: T }),
        sa('Compune', '50 + 8 = ?', '58', '50 + 8 = **58**.', { topic: T }),
        sa('Compune', '70 + 3 = ?', '73', '70 + 3 = **73**.', { topic: T }),
        mc('Zecile lui 92',
          'Câte zeci are **92**?',
          ['2', '9', '20', '92'],
          '9',
          '92 = **9 zeci** + 2 unități.',
          { topic: T }),
        sa('Unități 65', 'Care este cifra unităților lui **65**?', '5', 'Cifra unităților lui 65 este **5**.', { topic: T }),
        sa('Compune', '4 zeci și 2 unități = ?', '42', '4 × 10 + 2 = **42**.', { topic: T }),
      ],
    },

    {
      slug: 'comparare-pana-la-100',
      title: '51. Compararea numerelor până la 100',
      theory: `# 🔍 Compararea numerelor până la 100

Acum comparăm numere mari! 🆚

## 🎯 Reguli

**Pasul 1**: Compară **zecile** mai întâi!
- **Mai multe zeci** = mai mare

**Pasul 2**: Dacă zecile sunt egale, compară **unitățile**.

## 📝 Exemple

> **47 vs 73**: 4 zeci vs 7 zeci → **73 > 47** ✅

> **52 vs 58**: ambele 5 zeci, comparăm 2 vs 8 → **58 > 52** ✅

> **80 vs 80**: egale → **80 = 80** ✅

## 💡 Truc rapid

> Privește mai întâi **prima cifră** (zecile)!

## 🧠 Reține!

✅ Compară **zecile întâi**
✅ Dacă sunt egale, compară **unitățile**
`,
      problems: [
        cmp(47, 73),
        cmp(52, 58),
        cmp(80, 80),
        cmp(34, 30),
        cmp(99, 100),
        mc('Cel mai mare',
          'Care este cel **mai mare**: 56, 65, 60, 50?',
          ['50', '56', '60', '65'],
          '65',
          '65 are 6 zeci și 5 unități — cel mai mare.',
          { topic: T }),
        cmp(28, 82),
      ],
    },

    {
      slug: 'ordonare-pana-la-100',
      title: '52. Ordonare până la 100',
      theory: `# 📊 Ordonare 0–100

Aranjăm numere mari! 📈📉

## 🎯 Strategia

**Pasul 1**: Privește **zecile** — cele mai mici / cele mai mari
**Pasul 2**: Pentru zeci egale, sortează după **unități**

## 📝 Exemplu

> Aranjează crescător: **45, 23, 67, 12, 56**

1. Cele mai mici zeci: 12 (1 zece) → primul
2. Apoi 23 (2 zeci) → al doilea
3. Apoi 45 (4 zeci) → al treilea
4. Apoi 56 (5 zeci) → al patrulea
5. Apoi 67 (6 zeci) → ultimul

✅ **Crescător**: 12, 23, 45, 56, 67

## 🧠 Reține!

✅ Începe de la **prima cifră** (zecile)
✅ Apoi compară **unitățile** dacă e nevoie
`,
      problems: [
        mc('Crescător',
          'Ordine crescătoare: 32, 18, 45?',
          ['18, 32, 45', '45, 32, 18', '32, 18, 45', '18, 45, 32'],
          '18, 32, 45',
          'Crescător: 18 < 32 < 45.',
          { topic: T }),
        mc('Descrescător',
          'Ordine descrescătoare: 70, 30, 50?',
          ['30, 50, 70', '70, 50, 30', '50, 70, 30', '70, 30, 50'],
          '70, 50, 30',
          'Descrescător: 70 > 50 > 30.',
          { topic: T }),
        sa('Cel mai mic', 'Cel mai mic dintre 41, 14, 44?', '14', '14 are doar 1 zece — cel mai mic.', { topic: T }),
        sa('Cel mai mare', 'Cel mai mare dintre 89, 98, 88?', '98', '98 are 9 zeci, este cel mai mare.', { topic: T }),
        cmp(41, 14),
        cmp(89, 98),
        sa('Vecin', 'Vecinul mai mare al lui **49**?', '50', 'După 49 vine **50**.', { topic: T }),
      ],
    },

    {
      slug: 'numarare-din-2-din-5-din-10',
      title: '53. Numărare din 2 în 2, din 5 în 5, din 10 în 10',
      theory: `# 🔢 Numărare cu pași

Astăzi sărim! 🦘

## 🎯 Din 2 în 2 (pare)

> 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, ...

Acestea sunt **numerele pare**! 💕

## 🎯 Din 5 în 5

> 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, ...

Foarte util pentru **ceas** și **bani**! ⏰💰

## 🎯 Din 10 în 10

> 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100

Aceștia sunt **zeci întregi** — am învățat deja!

## 🧠 Reține!

✅ Din **2 în 2** = numere pare
✅ Din **5 în 5** = ușor de memorat (terminate în 0 sau 5)
✅ Din **10 în 10** = zeci întregi
`,
      problems: [
        sa('Pare', 'După 6, ce vine numărând din 2 în 2?', '8', 'Numărare pară: 6, **8**, 10...', { topic: T }),
        sa('Din 5 în 5', 'După 15, ce vine numărând din 5 în 5?', '20', 'Numărare din 5 în 5: 15, **20**, 25...', { topic: T }),
        sa('Din 10 în 10', 'După 40, ce vine numărând din 10 în 10?', '50', '40, **50**, 60...', { topic: T }),
        mc('Pare',
          'Care este număr **par**?',
          ['7', '9', '11', '12'],
          '12',
          '12 este par (se termină în 2 — număr par).',
          { topic: T }),
        mc('Impare',
          'Care este număr **impar**?',
          ['4', '8', '15', '20'],
          '15',
          '15 este impar (se termină în 5 — nu este par).',
          { topic: T }),
        sa('Suma de pași', '5 + 5 + 5 = ?', '15', '5+5=10, 10+5=**15**.', { topic: T }),
        sa('Total', '10 + 10 + 10 = ?', '30', '10+10+10 = **30**.', { topic: T }),
      ],
    },
    // ════════════════════════════════════════════════════════
    // CAPITOL 9: ADUNARE/SCĂDERE 0–100 fără trecere (54–58)
    // ════════════════════════════════════════════════════════

    {
      slug: 'adunare-zeci-intregi',
      title: '54. Adunare zeci întregi (20 + 30)',
      theory: `# ➕ Adunare zeci întregi

Foarte simplu — **adună zecile**! 🎯

## 🎯 Trucul

> ⭐ Adună **doar cifra zecilor**, scrie **0** la unități!

| Calcul | Cum gândim | = |
|---|---|---|
| **20 + 30** | 2+3 zeci = 5 zeci | 50 |
| **40 + 50** | 4+5 zeci = 9 zeci | 90 |
| **60 + 30** | 6+3 zeci = 9 zeci | 90 |
| **20 + 80** | 2+8 zeci = 10 zeci | 100 |

## 💡 De ce?

> 20 = 2 zeci, 30 = 3 zeci → împreună **5 zeci** = **50** ✅

## 🧠 Reține!

✅ Adună zeci ca pe **cifre simple**
✅ Pune **0** la sfârșit
`,
      problems: [
        sa('20 + 30', '20 + 30 = ?', '50', '2 zeci + 3 zeci = **50**.', { topic: T }),
        sa('40 + 50', '40 + 50 = ?', '90', '**90**.', { topic: T }),
        sa('60 + 20', '60 + 20 = ?', '80', '**80**.', { topic: T }),
        sa('70 + 30', '70 + 30 = ?', '100', '7+3=10 zeci = **100**.', { topic: T }),
        sa('10 + 70', '10 + 70 = ?', '80', '**80**.', { topic: T }),
        sa('Total', '50 + 50 = ?', '100', '5+5 zeci = **100** (o sută).', { topic: T }),
        sa('Cărți', 'Pe 2 rafturi: **30 cărți** + **40 cărți**. Total?', '70', '30 + 40 = **70 cărți**.', { topic: T }),
      ],
    },

    {
      slug: 'adunare-zeci-cu-unitati',
      title: '55. Adunare: zeci + unități (40 + 5)',
      theory: `# ➕ Adunare: zeci + unități

Acum adăugăm **unități la zeci întregi**! 🎯

## 🎯 Trucul

> ⭐ **Cifra unităților** se pune **la coadă**!

| Calcul | = |
|---|---|
| **20 + 5** | 25 |
| **40 + 7** | 47 |
| **60 + 3** | 63 |
| **80 + 9** | 89 |

## 💡 Pas cu pas

> **40 + 5** =
> 40 = 4 zeci + 0 unități
> Adaug 5 unități: 4 zeci + 5 unități = **45** ✅

## 🧠 Reține!

✅ Cifra zecilor **rămâne**
✅ Unitățile **se schimbă** cu ce adaugi
`,
      problems: [
        sa('20 + 5', '20 + 5 = ?', '25', '**25**.', { topic: T }),
        sa('40 + 7', '40 + 7 = ?', '47', '**47**.', { topic: T }),
        sa('60 + 3', '60 + 3 = ?', '63', '**63**.', { topic: T }),
        sa('80 + 9', '80 + 9 = ?', '89', '**89**.', { topic: T }),
        sa('30 + 6', '30 + 6 = ?', '36', '**36**.', { topic: T }),
        sa('Mere', 'Coșul are **50 mere** 🍎. Mai pun **8**. Total?', '58', '50 + 8 = **58 mere**.', { topic: T }),
        sa('Bonus', '70 + 4 = ?', '74', '**74**.', { topic: T }),
      ],
    },

    {
      slug: 'adunare-zu-plus-u',
      title: '56. Adunare 0–100 fără trecere (32 + 5, 24 + 13)',
      theory: `# ➕ Adunare 0–100 (fără trecere)

Acum cu adevărat **adunăm numere mari**! 🚀

## 🎯 Regula

> Adună **unitățile cu unitățile**, **zecile cu zecile**!

## 📝 Exemple

| Calcul | Cum gândim | = |
|---|---|---|
| **32 + 5** | unități: 2+5=7; zeci: 3 → **37** | 37 |
| **24 + 13** | unități: 4+3=7; zeci: 2+1=3 → **37** | 37 |
| **45 + 32** | 5+2=7; 4+3=7 → **77** | 77 |
| **51 + 28** | 1+8=9; 5+2=7 → **79** | 79 |

## ⚠️ Atenție!

> Doar când unitățile **nu trec peste 9**!

## 🧠 Reține!

✅ Coloana unităților separat
✅ Coloana zecilor separat
✅ Le pun una lângă alta
`,
      problems: [
        sa('32 + 5', '32 + 5 = ?', '37', '32 + 5 = **37**.', { topic: T }),
        sa('24 + 13', '24 + 13 = ?', '37', '24 + 13 = **37**.', { topic: T }),
        sa('45 + 32', '45 + 32 = ?', '77', '45 + 32 = **77**.', { topic: T }),
        sa('51 + 28', '51 + 28 = ?', '79', '51 + 28 = **79**.', { topic: T }),
        sa('Bani', 'Ai **23 lei** 💰. Primești **15 lei**. Câți ai?', '38', '23 + 15 = **38 lei**.', { topic: T }),
        sa('Cărți', 'Pe raft sunt **40 cărți**. Mai pui **27**. Total?', '67', '40 + 27 = **67 cărți**.', { topic: T }),
        sa('Total', '63 + 14 = ?', '77', '**77**.', { topic: T }),
      ],
    },

    {
      slug: 'scadere-0-100-fara-imprumut',
      title: '57. Scădere 0–100 fără împrumut',
      theory: `# ➖ Scădere 0–100 (fără împrumut)

Scădem ca la adunare — **separat pe cifre**! 🎯

## 🎯 Regula

> Scade **unitățile din unități**, **zecile din zeci**!

## 📝 Exemple

| Calcul | Cum gândim | = |
|---|---|---|
| **47 − 5** | 7−5=2; 4 → **42** | 42 |
| **89 − 23** | 9−3=6; 8−2=6 → **66** | 66 |
| **76 − 40** | 6−0=6; 7−4=3 → **36** | 36 |
| **58 − 35** | 8−5=3; 5−3=2 → **23** | 23 |

## ⚠️ Atenție!

> Doar când unitățile **mai mici** se scad din **mai mari**!

## 🧠 Reține!

✅ Scade pe coloane: **unități**, apoi **zeci**
`,
      problems: [
        sa('47 − 5', '47 − 5 = ?', '42', '47 − 5 = **42**.', { topic: T }),
        sa('89 − 23', '89 − 23 = ?', '66', '**66**.', { topic: T }),
        sa('76 − 40', '76 − 40 = ?', '36', '**36**.', { topic: T }),
        sa('58 − 35', '58 − 35 = ?', '23', '**23**.', { topic: T }),
        sa('Mere', 'Erau **48 mere** 🍎. Mănânci **6**. Câte rămân?', '42', '48 − 6 = **42 mere**.', { topic: T }),
        sa('Bani', 'Ai **75 lei** 💰. Cheltui **34**. Câți rămân?', '41', '75 − 34 = **41 lei**.', { topic: T }),
        sa('Total', '99 − 50 = ?', '49', '**49**.', { topic: T }),
      ],
    },

    {
      slug: 'probleme-pana-la-100',
      title: '58. Probleme până la 100 📖',
      theory: `# 📖 Probleme cu numere până la 100

Aplicăm tot ce știm! 🕵️

## 🌟 Pași magici

1. **Citesc** atent
2. **Subliniez** numerele
3. **Aleg operația** (+ sau −)
4. **Calculez** și **scriu răspunsul cu cuvinte**

## 📝 Exemplu

> 📖 *La un magazin sunt 45 de prăjituri 🍰. Vând 23. Câte rămân?*

- 45 − 23 = **22** ✅

> ✏️ Răspuns: **Au rămas 22 prăjituri**

## 🧠 Reține!

✅ "**Au rămas, mai puțin**" → scădere
✅ "**În total, împreună**" → adunare
`,
      problems: [
        sa('Prăjituri', 'Sunt **45 prăjituri** 🍰. Se vând **23**. Câte rămân?', '22', '45 − 23 = **22**.', { topic: T }),
        sa('Copii', 'În școală sunt **34 fete** și **25 băieți**. Câți copii sunt în total?', '59', '34 + 25 = **59 copii**.', { topic: T }),
        sa('Bomboane', 'În borcan sunt **78 bomboane** 🍬. Iei **30**. Câte rămân?', '48', '78 − 30 = **48**.', { topic: T }),
        sa('Cărți', 'Pe 2 rafturi: **40 + 35 cărți**. Total?', '75', '40 + 35 = **75 cărți**.', { topic: T }),
        sa('Pești', 'În iaz sunt **62 pești** 🐟. Pleacă **21**. Câți rămân?', '41', '62 − 21 = **41 pești**.', { topic: T }),
        sa('Bani', 'Maria avea **50 lei** 💰. Mai primește **27**. Câți are?', '77', '50 + 27 = **77 lei**.', { topic: T }),
        sa('Total', '83 − 12 = ?', '71', '**71**.', { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 10: GEOMETRIE (lecțiile 59–63)
    // ════════════════════════════════════════════════════════

    {
      slug: 'punctul-linia',
      title: '59. Punctul și linia',
      theory: `# 📍 Punctul și linia

Astăzi începem **geometria**! 📐

## 📍 Punctul

> **Punctul** este o **picătură** mică, foarte mică. .

Se notează cu o **literă mare**: A, B, C, ...

## ➖ Linia

**Linia** se face când **unim 2 puncte**.

| Tip | Cum arată |
|---|---|
| **Linie dreaptă** | ─── (ca o riglă) |
| **Linie curbă** | ⌒ (curbată, ca o sprânceană) |
| **Linie frântă** | ⋀⋁⋀ (cu colțuri) |

## ✏️ Cum desenăm?

- **Cu rigla** — linie dreaptă 📏
- **Cu mâna liberă** — linie curbă ✋

## 🧠 Reține!

✅ **Punctul** este o picătură mică
✅ **Linia dreaptă** se face cu rigla
✅ Liniile pot fi: **drepte, curbe, frânte**
`,
      problems: [
        mc('Punct',
          'Cum arată un **punct** geometric?',
          ['O linie lungă', 'O picătură mică', 'Un cerc mare', 'Un dreptunghi'],
          'O picătură mică',
          'Punctul = o picătură mică, fără formă.',
          { topic: T }),
        mc('Linie dreaptă',
          'Cu ce desenăm o **linie dreaptă**?',
          ['Cu mâna liberă', 'Cu rigla', 'Cu radiera', 'Cu degetul'],
          'Cu rigla',
          'Linia dreaptă se face cu **rigla** 📏.',
          { topic: T }),
        mc('Tip linie',
          'Cum se numește o linie cu colțuri?',
          ['Dreaptă', 'Curbă', 'Frântă', 'Punct'],
          'Frântă',
          'Linia cu colțuri = **linie frântă**.',
          { topic: T }),
        mc('Sprânceana',
          'Sprânceana arată ca o linie:',
          ['Dreaptă', 'Frântă', 'Curbă', 'Punct'],
          'Curbă',
          'Sprânceana este o linie **curbă**.',
          { topic: T }),
        mc('Notare',
          'Cum notăm un punct?',
          ['Cu cifră', 'Cu literă mică', 'Cu literă mare', 'Cu desen'],
          'Cu literă mare',
          'Punctele se notează cu **litere mari**: A, B, C.',
          { topic: T }),
        mc('Câte puncte unim?',
          'Câte puncte trebuie să unim ca să facem o linie?',
          ['1', '2', '3', '5'],
          '2',
          'O linie se face unind **2 puncte**.',
          { topic: T }),
        mc('Riglă',
          'Cu ce instrument facem linii drepte la matematică?',
          ['Pixul', 'Rigla', 'Foarfeca', 'Caietul'],
          'Rigla',
          'Folosim **rigla** pentru linii drepte.',
          { topic: T }),
      ],
    },

    {
      slug: 'cerc-patrat',
      title: '60. Cercul și pătratul ⭕⬜',
      theory: `# ⭕⬜ Cercul și pătratul

Astăzi învățăm **2 forme prietenoase**! 🤗

## ⭕ Cercul

**Cercul** este o formă **rotundă**, fără colțuri.

> Exemple: 🌞 soare, 🍕 pizza, 🪙 monedă, ⚽ minge

**Caracteristici:**
- ❌ **Fără colțuri**
- ❌ **Fără laturi drepte**
- ✅ **Rotund peste tot**

## ⬜ Pătratul

**Pătratul** are **4 laturi egale** și **4 colțuri**.

> Exemple: 🪟 fereastră, 🎲 zar, 🍫 ciocolată

**Caracteristici:**
- ✅ **4 laturi** (toate egale)
- ✅ **4 colțuri**
- ✅ Toate colțurile **drepte** (ca litera L)

## 🧠 Reține!

✅ **Cerc** = rotund, fără colțuri
✅ **Pătrat** = 4 laturi egale + 4 colțuri
`,
      problems: [
        mc('Cerc',
          'Care obiect are formă de **cerc**?',
          ['Caiet', 'Pizza 🍕', 'Carte', 'Cutie'],
          'Pizza 🍕',
          'Pizza are formă de **cerc** (rotundă).',
          { topic: T }),
        mc('Pătrat',
          'Câte laturi are un **pătrat**?',
          ['2', '3', '4', '5'],
          '4',
          'Pătratul are **4 laturi** egale.',
          { topic: T }),
        mc('Colțuri pătrat',
          'Câte colțuri are un **pătrat**?',
          ['2', '3', '4', '8'],
          '4',
          'Pătratul are **4 colțuri**.',
          { topic: T }),
        mc('Cerc colțuri',
          'Câte colțuri are un **cerc**?',
          ['0', '2', '4', 'Multe'],
          '0',
          'Cercul are **0 colțuri** — este rotund.',
          { topic: T }),
        mc('Pătrat exemplu',
          'Care din acestea are formă de pătrat?',
          ['Pizza', 'Soarele', 'Zarul 🎲', 'Mingea'],
          'Zarul 🎲',
          'O față de zar este un **pătrat**.',
          { topic: T }),
        mc('Soare',
          'Soarele 🌞 are formă de:',
          ['Pătrat', 'Cerc', 'Triunghi', 'Linie'],
          'Cerc',
          'Soarele are formă de **cerc**.',
          { topic: T }),
        mc('Laturi egale',
          'Pătratul are toate laturile:',
          ['Diferite', 'Egale', 'Curbe', 'Întortocheate'],
          'Egale',
          'Toate laturile pătratului sunt **egale**.',
          { topic: T }),
      ],
    },

    {
      slug: 'triunghi-dreptunghi',
      title: '61. Triunghiul și dreptunghiul 🔺▭',
      theory: `# 🔺▭ Triunghiul și dreptunghiul

2 forme noi! 🎉

## 🔺 Triunghiul

**Triunghi** = "**3 unghiuri**" = **3 colțuri**.

**Caracteristici:**
- ✅ **3 laturi**
- ✅ **3 colțuri**

> Exemple: pălăria de magician 🎩, plăcuța de stop, felia de pizza 🍕

## ▭ Dreptunghiul

**Dreptunghiul** este ca un **pătrat alungit**.

**Caracteristici:**
- ✅ **4 laturi** (2 lungi + 2 scurte)
- ✅ **4 colțuri** drepte
- ⚠️ Laturile **opuse sunt egale**

> Exemple: 📺 televizor, 🚪 ușă, 📒 caiet, 📱 telefon

## 🌟 Diferența dintre pătrat și dreptunghi

| Pătrat | Dreptunghi |
|---|---|
| 4 laturi **egale** | 4 laturi (2 lungi, 2 scurte) |

## 🧠 Reține!

✅ **Triunghi** = 3 laturi + 3 colțuri
✅ **Dreptunghi** = 4 laturi (2+2 egale)
`,
      problems: [
        mc('Triunghi laturi',
          'Câte laturi are un **triunghi**?',
          ['2', '3', '4', '6'],
          '3',
          'Triunghiul are **3 laturi**.',
          { topic: T }),
        mc('Dreptunghi',
          'Câte laturi are un **dreptunghi**?',
          ['2', '3', '4', '5'],
          '4',
          'Dreptunghiul are **4 laturi**.',
          { topic: T }),
        mc('Diferența',
          'Care este diferența între pătrat și dreptunghi?',
          ['Numărul laturilor', 'Lungimea laturilor', 'Culoarea', 'Mărimea'],
          'Lungimea laturilor',
          'Pătratul are toate laturile **egale**, dreptunghiul are 2 lungi și 2 scurte.',
          { topic: T }),
        mc('Pizza felie',
          'O felie de pizza 🍕 are formă de:',
          ['Cerc', 'Triunghi', 'Dreptunghi', 'Pătrat'],
          'Triunghi',
          'Felia de pizza este un **triunghi**.',
          { topic: T }),
        mc('Ușa',
          'Ușa 🚪 are formă de:',
          ['Triunghi', 'Cerc', 'Dreptunghi', 'Pătrat'],
          'Dreptunghi',
          'Ușa are formă de **dreptunghi**.',
          { topic: T }),
        mc('Triunghi colțuri',
          'Câte colțuri are un triunghi?',
          ['2', '3', '4', '0'],
          '3',
          'Triunghi = "**3 unghiuri**" = 3 colțuri.',
          { topic: T }),
        mc('Caiet',
          'Caietul 📒 are formă de:',
          ['Cerc', 'Triunghi', 'Dreptunghi', 'Stea'],
          'Dreptunghi',
          'Caietul este un **dreptunghi**.',
          { topic: T }),
      ],
    },

    {
      slug: 'corpuri-geometrice',
      title: '62. Corpuri geometrice (cub, sferă, cilindru, con)',
      theory: `# 🧊⚽ Corpuri geometrice

Acum **3D**! Forme cu **volum** care le poți ține în mână! 🤲

## 🧊 Cubul

- ✅ **6 fețe** (toate pătrate)
- ✅ **8 colțuri**
- Exemple: 🎲 zar, cutie cadou, cub Rubik

## ⚽ Sfera

- ✅ **Fără colțuri**, fără fețe drepte
- ✅ **Rotundă peste tot**
- Exemple: ⚽ minge, 🌍 Pământul, 🍊 portocală

## 🥫 Cilindrul

- ✅ **Sus și jos** = cercuri
- ✅ **Mijloc** = drept
- Exemple: 🥫 conservă, 🕯️ lumânare

## 🍦 Conul

- ✅ **Jos** = cerc
- ✅ Se **strânge** într-un vârf
- Exemple: 🍦 cornet, 🎉 pălărie petrecere

## 🧠 Reține!

✅ **Cub** = 6 fețe pătrate
✅ **Sferă** = bilă rotundă
✅ **Cilindru** = conservă
✅ **Con** = cornet
`,
      problems: [
        mc('Cub fețe',
          'Câte fețe are un **cub**?',
          ['4', '6', '8', '12'],
          '6',
          'Cubul are **6 fețe** (toate pătrate).',
          { topic: T }),
        mc('Sferă',
          'Mingea ⚽ este de formă:',
          ['Cub', 'Sferă', 'Cilindru', 'Con'],
          'Sferă',
          'Mingea este o **sferă**.',
          { topic: T }),
        mc('Conservă',
          'Conserva 🥫 are formă de:',
          ['Cub', 'Sferă', 'Cilindru', 'Con'],
          'Cilindru',
          'Conserva este un **cilindru**.',
          { topic: T }),
        mc('Cornet',
          'Cornetul de înghețată 🍦 este:',
          ['Cub', 'Sferă', 'Cilindru', 'Con'],
          'Con',
          'Cornetul este un **con**.',
          { topic: T }),
        mc('Zar',
          'Zarul 🎲 are formă de:',
          ['Cub', 'Sferă', 'Cilindru', 'Triunghi'],
          'Cub',
          'Zarul este un **cub**.',
          { topic: T }),
        mc('Pământ',
          'Pământul 🌍 are formă de:',
          ['Cub', 'Sferă', 'Cilindru', 'Con'],
          'Sferă',
          'Pământul este aproape o **sferă**.',
          { topic: T }),
        mc('Cub colțuri',
          'Câte colțuri are un cub?',
          ['4', '6', '8', '12'],
          '8',
          'Cubul are **8 colțuri**.',
          { topic: T }),
      ],
    },

    {
      slug: 'recunoastere-forme',
      title: '63. Recunoaștere forme — joc de detectiv 🕵️',
      theory: `# 🕵️ Detectivul formelor

Recapitulăm toate formele! 🌟

## 📋 Forme plane (2D)

| Formă | Laturi | Colțuri |
|---|---|---|
| ⭕ Cerc | 0 | 0 |
| 🔺 Triunghi | 3 | 3 |
| ⬜ Pătrat | 4 (egale) | 4 |
| ▭ Dreptunghi | 4 (2+2) | 4 |

## 📋 Corpuri (3D)

| Corp | Caracteristică |
|---|---|
| 🧊 Cub | 6 fețe pătrate |
| ⚽ Sferă | Rotund peste tot |
| 🥫 Cilindru | Sus/jos cercuri |
| 🍦 Con | Vârf + bază cerc |

## 🧠 Reține!

✅ Forme **plane** = 2D
✅ Corpuri = 3D
`,
      problems: [
        mc('Triunghi',
          'Triunghiul are __ laturi.',
          ['2', '3', '4', '5'],
          '3',
          'Triunghi = **3 laturi**.',
          { topic: T }),
        mc('Cub vs sferă',
          'Care este 3D și are colțuri?',
          ['Cerc', 'Sferă', 'Cub', 'Pătrat'],
          'Cub',
          'Cubul este 3D și are **8 colțuri**.',
          { topic: T }),
        mc('Diferență',
          'Cercul este 2D sau 3D?',
          ['2D', '3D', 'Niciuna', 'Ambele'],
          '2D',
          'Cercul este o formă **plană** (2D).',
          { topic: T }),
        mc('Roată',
          'Roata mașinii are formă de:',
          ['Pătrat', 'Triunghi', 'Cerc', 'Dreptunghi'],
          'Cerc',
          'Roata este un **cerc**.',
          { topic: T }),
        mc('Acoperiș',
          'Acoperișul casei are adesea formă de:',
          ['Cerc', 'Triunghi', 'Sferă', 'Cub'],
          'Triunghi',
          'Acoperișul este un **triunghi**.',
          { topic: T }),
        mc('Lumânare',
          'O lumânare 🕯️ obișnuită este:',
          ['Cub', 'Sferă', 'Cilindru', 'Pătrat'],
          'Cilindru',
          'Lumânarea este un **cilindru**.',
          { topic: T }),
        mc('Felia tort',
          'O felie de tort 🍰 (de sus) seamănă cu:',
          ['Cerc', 'Triunghi', 'Pătrat', 'Sferă'],
          'Triunghi',
          'Felia de tort = **triunghi**.',
          { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 11: MĂSURARE (lecțiile 64–67)
    // ════════════════════════════════════════════════════════

    {
      slug: 'lungimea',
      title: '64. Lungimea: cm și m 📏',
      theory: `# 📏 Lungimea

Cât de lung este ceva? 🎯

## 🎯 Unități

| Unitate | Notare | Exemplu |
|---|---|---|
| **Centimetrul** | cm | un creion |
| **Metrul** | m | înălțimea unui copil |

## 📐 Cu ce măsurăm?

- **Cm** → cu **rigla** 📏
- **M** → cu **metrul** sau **ruleta**

## 🌟 Exemple

| Obiect | Lungime |
|---|---|
| Creion | ≈ **15 cm** |
| Carte | ≈ **25 cm** |
| Masă | ≈ **1 m** |
| Înălțimea ta | ≈ **120 cm** |

## 💡 Trucuri

> 1 m = **100 cm**

## 🧠 Reține!

✅ **cm** = mic, **m** = mare
✅ **1 m = 100 cm**
`,
      problems: [
        mc('Creion',
          'Cu ce unitate măsurăm un **creion**?',
          ['cm', 'm', 'kg', 'l'],
          'cm',
          'Creionul fiind mic se măsoară în **cm**.',
          { topic: T }),
        mc('Cameră',
          'Cu ce măsurăm lungimea unei camere?',
          ['cm', 'm', 'kg', 'l'],
          'm',
          'Camera fiind mare → în **metri**.',
          { topic: T }),
        sa('1 m', 'Câți cm sunt într-un metru?', '100', '1 m = **100 cm**.', { topic: T }),
        mc('Instrument',
          'Cu ce instrument măsurăm centimetri?',
          ['Cântar', 'Riglă', 'Termometru', 'Pahar'],
          'Riglă',
          'Cu **rigla** măsurăm cm.',
          { topic: T }),
        sa('Creioane', 'Adaugi un creion de **5 cm** la unul de **3 cm**. Lungime totală?', '8', '5 + 3 = **8 cm**.', { topic: T }),
        sa('Suma', 'Două sfori: **10 cm + 15 cm**. Total?', '25', '10 + 15 = **25 cm**.', { topic: T }),
        mc('Mai lung',
          'Care este mai lung: **10 cm** sau **1 m**?',
          ['10 cm', '1 m', 'Egale', 'Niciuna'],
          '1 m',
          '1 m = 100 cm > 10 cm. Deci **1 m** este mai lung.',
          { topic: T }),
      ],
    },

    {
      slug: 'masa-si-capacitate',
      title: '65. Masa (kg) și capacitatea (l) ⚖️🥛',
      theory: `# ⚖️🥛 Masa și capacitatea

## ⚖️ Masa

**Masa** = cât de **greu** este un obiect.

| Unitate | Exemplu |
|---|---|
| **kg** (kilogram) | un pepene 🍉 |

> Cu ce măsurăm? **Cântarul** ⚖️

## 🥛 Capacitatea

**Capacitatea** = câtă apă **încape** într-un vas.

| Unitate | Exemplu |
|---|---|
| **l** (litru) | sticla de suc |

## 🧠 Reține!

✅ **kg** = greutate (cu cântarul)
✅ **l** = lichide (cu sticla)
`,
      problems: [
        mc('Pepene',
          'Cu ce măsurăm un **pepene**?',
          ['cm', 'kg', 'l', 'm'],
          'kg',
          'Pepenele cântărește, se măsoară în **kg**.',
          { topic: T }),
        mc('Apă sticlă',
          'Cu ce măsurăm apa dintr-o sticlă?',
          ['cm', 'kg', 'l', 'm'],
          'l',
          'Apa este lichid → **litri**.',
          { topic: T }),
        mc('Cântar',
          'Cu ce instrument măsurăm masa?',
          ['Riglă', 'Cântar', 'Pahar', 'Ceas'],
          'Cântar',
          'Cu **cântarul** măsurăm masa.',
          { topic: T }),
        sa('Suma kg', 'Cumperi un sac de **3 kg** și unul de **5 kg**. Total?', '8', '3 + 5 = **8 kg**.', { topic: T }),
        sa('Suma l', 'Ai **2 sticle a câte 1 l**. Câți litri ai?', '2', '1 + 1 = **2 l**.', { topic: T }),
        mc('Mai greu',
          'Care e mai greu: **2 kg de pene** sau **2 kg de fier**?',
          ['Penele', 'Fierul', 'La fel', 'Niciuna'],
          'La fel',
          '**2 kg = 2 kg**! Indiferent de obiect.',
          { topic: T }),
        mc('Înghețată',
          'Cu ce măsurăm cât înghețată e într-un pahar?',
          ['cm', 'kg', 'l', 'm'],
          'l',
          'Înghețata topită este lichid → **litri**.',
          { topic: T }),
      ],
    },

    {
      slug: 'timpul-ceas-saptamana',
      title: '66. Timpul: ceasul, ziua, săptămâna ⏰📅',
      theory: `# ⏰ Timpul

## 📅 Săptămâna (7 zile)

| Zi | Numele |
|---|---|
| 1 | **Luni** |
| 2 | **Marți** |
| 3 | **Miercuri** |
| 4 | **Joi** |
| 5 | **Vineri** |
| 6 | **Sâmbătă** |
| 7 | **Duminică** |

## 🌅 Părțile zilei

- 🌅 Dimineața
- ☀️ Prânz
- 🌇 Seara
- 🌙 Noaptea

## ⏰ Ceasul

- **Acul mic** = ora
- **Acul mare** = minutele
- O zi are **24 ore**
- O oră are **60 minute**

## 🧠 Reține!

✅ Săptămâna = **7 zile**
✅ Ziua = **24 ore**
✅ Anul = **12 luni**
`,
      problems: [
        sa('Zile săptămână', 'Câte zile are o săptămână?', '7', 'O săptămână are **7 zile**.', { topic: T }),
        mc('Prima zi',
          'Care este prima zi a săptămânii (la noi)?',
          ['Duminică', 'Luni', 'Sâmbătă', 'Vineri'],
          'Luni',
          'Săptămâna începe cu **luni**.',
          { topic: T }),
        sa('Ore zi', 'Câte ore are o zi?', '24', 'O zi are **24 ore**.', { topic: T }),
        sa('Luni an', 'Câte luni are un an?', '12', 'Anul are **12 luni**.', { topic: T }),
        mc('Dimineața',
          'Când te trezești dimineața?',
          ['Noaptea', 'Dimineața', 'Seara', 'La prânz'],
          'Dimineața',
          'Te trezești **dimineața**.',
          { topic: T }),
        sa('Weekend', 'Câte zile au sâmbătă + duminică?', '2', '**2 zile**.', { topic: T }),
        sa('Școală', 'Câte zile sunt de luni până vineri?', '5', 'Luni–Vineri = **5 zile**.', { topic: T }),
      ],
    },

    {
      slug: 'banii-lei-bani',
      title: '67. Bani: lei și bani 💰',
      theory: `# 💰 Banii — lei și bani

În România folosim **leul** (RON)! 🇷🇴

## 💵 Unități

- **1 leu** = **100 bani**

## 🪙 Monede și bancnote

**Monede:** 1 ban, 5 bani, 10 bani, 50 bani, 1 leu

**Bancnote:** 1, 5, 10, 50, 100, 200, 500 lei

## 🛒 Exemple

> Înghețată 🍦 = **5 lei**
> Caiet 📒 = **3 lei**
> Ciocolată 🍫 = **8 lei**

## 🧠 Reține!

✅ **1 leu = 100 bani**
✅ Plătim adunând banii
`,
      problems: [
        sa('1 leu', 'Câți bani sunt într-un leu?', '100', '1 leu = **100 bani**.', { topic: T }),
        sa('Total', 'Înghețată **5 lei** + ciocolată **3 lei**. Cât plătești?', '8', '5 + 3 = **8 lei**.', { topic: T }),
        sa('Rest', 'Plătești **10 lei** pentru un caiet de **6 lei**. Cât rest?', '4', '10 − 6 = **4 lei**.', { topic: T }),
        sa('Monede', 'Ai **2 monede de 5 lei**. Cât ai?', '10', '5 + 5 = **10 lei**.', { topic: T }),
        sa('2 ciocolate', 'O ciocolată costă **4 lei**. Cât pentru 2?', '8', '4 + 4 = **8 lei**.', { topic: T }),
        mc('Bancnotă',
          'Care NU este bancnotă?',
          ['1 leu', '5 lei', '10 lei', '7 lei'],
          '7 lei',
          'Nu există bancnotă de **7 lei**.',
          { topic: T }),
        sa('Suma', '10 + 5 + 1 = ?', '16', '**16 lei**.', { topic: T }),
      ],
    },

    // ════════════════════════════════════════════════════════
    // CAPITOL 12: PROBLEME FINALE + RECAPITULARE (68–70)
    // ════════════════════════════════════════════════════════

    {
      slug: 'probleme-text-mixte-1',
      title: '68. Probleme cu text — adunare și scădere',
      theory: `# 📖 Probleme cu text

Aplicăm **tot** ce am învățat! 🕵️

## 🌟 Cuvinte cheie

| Cuvânt | Operație |
|---|---|
| în total, împreună, primește | ➕ adunare |
| au rămas, au plecat, mai puțin | ➖ scădere |

## 📝 Exemplu

> 📖 *Ana are 25 lei. Mama îi dă 30. Cât are acum?*
> 25 + 30 = **55 lei**

## 🧠 Reține!

✅ Citește **de 2 ori**
✅ Caută **cuvinte cheie**
✅ Răspunde cu **unitatea**
`,
      problems: [
        sa('Ana lei', 'Ana are **25 lei**. Mama îi dă **30**. Câți are?', '55', '25 + 30 = **55 lei**.', { topic: T }),
        sa('Ion mere', 'Ion are **18 mere** 🍎. Mănâncă **5**. Câte rămân?', '13', '18 − 5 = **13 mere**.', { topic: T }),
        sa('Pisici', 'În adăpost erau **40 pisici** 🐱. Adoptate **15**. Câte rămân?', '25', '40 − 15 = **25 pisici**.', { topic: T }),
        sa('Carte', 'Maria a citit **24 + 15 pagini**. Total?', '39', '24 + 15 = **39 pagini**.', { topic: T }),
        sa('Bicicliști', 'În parc sunt **17 bicicliști** 🚲. Mai vin **12**. Câți sunt?', '29', '17 + 12 = **29**.', { topic: T }),
        sa('Bani rest', 'Plătești **50 lei** pentru jucărie de **35**. Cât rest?', '15', '50 − 35 = **15 lei**.', { topic: T }),
        sa('Total clasă', 'În clasă: **14 fete** + **13 băieți**. Total?', '27', '14 + 13 = **27 copii**.', { topic: T }),
      ],
    },

    {
      slug: 'probleme-text-mixte-2',
      title: '69. Probleme cu text — în 2 pași 🧩',
      theory: `# 🧩 Probleme în 2 pași

Probleme **mai grele** — cu **2 calcule**! 💪

## 📝 Exemplu

> 📖 *Ana avea **30 lei**. A primit **20 lei**. Apoi a cheltuit **15 lei**. Cât mai are?*

**Pași:**
1. 30 + 20 = **50** ✅
2. 50 − 15 = **35** ✅

> ✏️ Ana mai are **35 lei**.

## 🧠 Reține!

✅ **Pas cu pas** — nu sări!
`,
      problems: [
        sa('Lei', 'Ana avea **30 lei**, primește **20** și cheltuie **15**. Câți rămân?', '35', '30+20=50, 50−15=**35**.', { topic: T }),
        sa('Mere', 'În coș **18 mere** 🍎. Pun **6**, apoi mănânc **4**. Câte rămân?', '20', '18+6=24, 24−4=**20**.', { topic: T }),
        sa('Cărți', 'Pe raft **25 cărți** 📚. Iei **10**, pui **5** noi. Câte sunt?', '20', '25−10=15, 15+5=**20**.', { topic: T }),
        sa('Stickere', 'Maria are **40 stickere** ⭐. Dă **15** și **10**. Câte rămân?', '15', '40−15=25, 25−10=**15**.', { topic: T }),
        sa('Total', 'Ana **20 bomboane** 🍬, Ion **15**. Câte au în total?', '35', '20 + 15 = **35**.', { topic: T }),
        sa('Pisici', 'Erau **30 pisici** 🐱. Vin **8**, pleacă **12**. Câte sunt?', '26', '30+8=38, 38−12=**26**.', { topic: T }),
        sa('Bani', 'Ai **50 lei**. Cumperi pâine **8** și lapte **6**. Cât rămâne?', '36', '50−8−6=**36**.', { topic: T }),
      ],
    },

    {
      slug: 'recapitulare-finala',
      title: '70. 🏆 RECAPITULARE FINALĂ — ești campion!',
      theory: `# 🏆 FELICITĂRI! Ai terminat clasa 1!

# 🎉🎊🥳

## 🌟 Ce ai învățat?

✅ **Numerele 0–100** (le citești și le scrii)
✅ **Compararea** numerelor (<, >, =)
✅ **Adunarea** până la 100
✅ **Scăderea** până la 100
✅ **Adunare/scădere cu trecere peste 10**
✅ **Forme plane**: cerc, pătrat, triunghi, dreptunghi
✅ **Corpuri**: cub, sferă, cilindru, con
✅ **Măsurare**: cm, m, kg, l
✅ **Timpul**: zile, săptămâni, ore
✅ **Banii**: lei și bani

## 🎯 Pregătit pentru clasa 2!

În clasa 2 vei învăța:
- 🔢 Numerele **până la 1000**
- ✖️ **Înmulțirea**
- ➗ **Împărțirea**
- 🕐 **Ceasul** complet
- 📐 **Geometrie** mai complicată

## 💪 Reguli de aur

⭐ **Practică zilnic** (chiar 10 minute)
⭐ **Nu te speria** de greșeli
⭐ **Citește atent**
⭐ **Verifică** răspunsurile

# 🌟 BRAVO, MICUL MATEMATICIAN! 🌟
`,
      problems: [
        add(7, 8),
        sub(15, 9),
        sa('100', '50 + 50 = ?', '100', '50 + 50 = **100**.', { topic: T }),
        cmp(67, 76),
        sa('Mere', 'Ana **34 mere** 🍎. Primește **15**, dă **9**. Câte rămân?', '40', '34+15=49, 49−9=**40**.', { topic: T }),
        mc('Pătrat',
          'Pătratul are __ laturi egale.',
          ['2', '3', '4', '5'],
          '4',
          'Pătratul are **4 laturi**.',
          { topic: T }),
        mc('Săptămâna',
          'O săptămână are __ zile.',
          ['5', '6', '7', '10'],
          '7',
          'Săptămâna = **7 zile**.',
          { topic: T }),
        sa('Lei', '1 leu = ? bani', '100', '1 leu = **100 bani**.', { topic: T }),
        add(48, 22),
      ],
    },

  ],
}