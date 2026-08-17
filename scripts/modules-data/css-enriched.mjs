// CSS enriched — toate cele 20 de lecții
// Stil prietenos pentru elevi 9-10 ani

import { mc, sa } from './helpers.mjs'

export const cssEnriched = {

  // ============ 1. introducere-css ============
  'introducere-css': {
    theory: `# 🎨 Bun venit în CSS!

## Ce e CSS?

**CSS** = **C**ascading **S**tyle **S**heets — limbajul prin care **îmbraci** HTML-ul 👗.

Imaginează-ți:
- 🦴 **HTML** = scheletul (structura)
- 🎨 **CSS** = hainele, vopseaua, mobila
- ⚡ **JS** = mecanismele

Fără CSS, toate site-urile ar arăta ca un Word din 1995! 😱

## 🎯 Anatomia unei reguli CSS

\`\`\`css
selector {
  proprietate: valoare;
  proprietate: valoare;
}
\`\`\`

Exemplu:
\`\`\`css
h1 {
  color: red;
  font-size: 32px;
}
\`\`\`

- **\`h1\`** — **selector** — cui aplici
- **\`color\`** — **proprietate** — ce schimbi
- **\`red\`** — **valoare** — cum
- **\`{ }\`** — bloc cu reguli
- **\`;\`** — separă reguli

## 3️⃣ Moduri de a folosi CSS

### 1. Inline (în atribut \`style\`)
\`\`\`html
<p style="color: red;">Text</p>
\`\`\`
> ❌ Doar pentru cazuri speciale.

### 2. Internal (în \`<style>\`)
\`\`\`html
<head>
  <style>
    p { color: red; }
  </style>
</head>
\`\`\`

### 3. External (fișier .css) — **recomandat**
\`\`\`html
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`

\`\`\`css
/* style.css */
p { color: red; }
\`\`\`

## 💧 Ce înseamnă "Cascading"?

Când mai multe reguli se aplică același element, **ultima regulă câștigă** (în general).

\`\`\`css
p { color: red; }
p { color: blue; }   /* aceasta câștigă */
\`\`\`

## 💬 Comentarii

\`\`\`css
/* Acesta e un comentariu */
p {
  color: red;  /* roșu pentru paragrafe */
}
\`\`\`

## 🎯 Exemplu complet

HTML:
\`\`\`html
<h1>Salut</h1>
<p>Site-ul meu</p>
\`\`\`

CSS:
\`\`\`css
h1 {
  color: blue;
  text-align: center;
}
p {
  color: gray;
  font-size: 18px;
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`color: 'red';\` (cu ghilimele)** — \`color: red;\`
- **Uiți \`;\`** — Pune mereu \`;\`
- **\`color = red\`** — \`color: red;\` (cu \`:\`)
- **\`{ p color: red; }\`** — \`p { color: red; }\`

## 🎓 Ce ai învățat
- ✅ CSS = stilurile pentru HTML
- ✅ \`selector { proprietate: valoare; }\`
- ✅ Inline / Internal / External
- ✅ Cascading = ultima regulă câștigă
`,
    extraProblems: [
      mc('Scop CSS',
        'La ce folosește CSS?',
        ['Structură', 'Stil & aspect', 'Logică', 'Bază de date'],
        'Stil & aspect',
        'CSS = aspectul vizual; HTML = structura.',
        { topic: 'css-basics' }),
      mc('Sintaxă',
        'Care e SINTAXA corectă a unei reguli CSS?',
        ['selector = { prop: val }', 'selector { prop: val; }', 'selector(prop, val)', 'selector -> prop = val'],
        'selector { prop: val; }',
        '`selector { proprietate: valoare; }`.',
        { topic: 'css-basics' }),
      sa('Comentariu CSS',
        'Cum începe un comentariu CSS? (3 caractere)',
        '/*',
        '`/* ... */` — ca în C, JavaScript, Java.',
        { topic: 'css-basics' }),
      mc('Cel mai bun mod',
        'Care e modul recomandat de a folosi CSS pentru un site mare?',
        ['Inline', 'Internal', 'External (fișier .css)', 'Niciunul'],
        'External (fișier .css)',
        'Reutilizabil, ușor de întreținut, cache-uit de browser.',
        { topic: 'css-basics' }),
    ],
  },

  // ============ 2. selectori ============
  'selectori': {
    theory: `# 🎯 Selectori CSS

Selectorii spun **cui** aplici stilurile 👉.

## 1️⃣ Selectori de bază

\`\`\`css
/* tag */
p { color: red; }

/* clasă (.) */
.alert { color: red; }

/* id (#) */
#header { background: yellow; }

/* universal */
* { margin: 0; }
\`\`\`

În HTML:
\`\`\`html
<p>Paragraf</p>
<p class="alert">Atenție</p>
<div id="header">Header</div>
\`\`\`

## 🎯 Selectori combinați

### Multiple (virgula)
\`\`\`css
h1, h2, h3 { color: blue; }
\`\`\`
> Aplică la **toate** h1, h2 și h3.

### Descendent (spațiu)
\`\`\`css
article p { color: gray; }
\`\`\`
> Toate \`<p>\`-urile **din interior** \`<article>\`.

### Copil direct (\`>\`)
\`\`\`css
ul > li { color: red; }
\`\`\`
> Doar \`<li>\` care e **copil direct** al \`<ul>\` (nu nepoți).

### Adiacent (\`+\`)
\`\`\`css
h1 + p { font-weight: bold; }
\`\`\`
> Primul \`<p>\` care vine **imediat după** \`<h1>\`.

### Sibling (\`~\`)
\`\`\`css
h1 ~ p { color: gray; }
\`\`\`
> **Toate** \`<p>\` care vin după \`<h1>\` (frați).

## 🎯 Pseudo-clase (cu \`:\`)

\`\`\`css
a:hover { color: red; }              /* la hover */
a:visited { color: purple; }         /* link vizitat */
input:focus { border-color: blue; }  /* la focus */
li:first-child { font-weight: bold; }
li:last-child { color: red; }
li:nth-child(2) { color: green; }    /* al doilea */
li:nth-child(odd) { background: #eee; }
button:disabled { opacity: 0.5; }
\`\`\`

## 🎯 Pseudo-elemente (cu \`::\`)

\`\`\`css
p::first-letter { font-size: 2em; }
p::first-line { font-weight: bold; }
.box::before { content: "▶ "; }
.box::after { content: " ✓"; }
\`\`\`

## 🎯 Selectori după atribut

\`\`\`css
input[type="text"] { border: 1px solid; }
a[href^="https"] { color: green; }    /* începe cu */
a[href$=".pdf"] { color: red; }       /* termină cu */
img[alt*="cat"] { border: 2px red; }  /* conține */
\`\`\`

## ⚖️ Specificitate

Care regulă câștigă când se aplică mai multe?

- **\`*\`** — 0
- **\`tag\`** — 1
- **\`.clasa\`** — 10
- **\`#id\`** — 100
- **\`style="..."\`** — 1000

\`\`\`css
p { color: red; }              /* greutate 1 */
.alert { color: blue; }        /* greutate 10 — câștigă */
#mesaj { color: green; }       /* greutate 100 — câștigă peste tot */
\`\`\`

## ⚠️ Greșeli frecvente

- **\`.clasa\` fără punct** — Mereu cu \`.\`
- **\`#id\` fără diez** — Mereu cu \`#\`
- **Folosești \`!important\` peste tot** — Doar în cazuri excepționale

## 🎓 Ce ai învățat
- ✅ Selectori: tag, \`.class\`, \`#id\`, \`*\`
- ✅ Combinări: \`,\` (multiple), spațiu (descendent), \`>\` (copil direct)
- ✅ Pseudo-clase: \`:hover\`, \`:focus\`, \`:nth-child\`
- ✅ Specificitate: id > clasă > tag
`,
    extraProblems: [
      mc('Selector hover',
        'Care selector aplică stil **când dai hover** pe un link?',
        ['a hover', 'a:hover', 'a.hover', 'a@hover'],
        'a:hover',
        'Pseudo-clasa `:hover` — cu unul singur `:`.',
        { topic: 'selectors' }),
      mc('Specificitate',
        'Care selector are SPECIFICITATE mai mare?',
        ['p', '.alert', '#mesaj', '*'],
        '#mesaj',
        'ID > clasă > tag > universal.',
        { topic: 'selectors', difficulty: 'MEDIUM' }),
      sa('Selector multiple',
        'Ce caracter separă selectorii multipli? (ex: h1, h2)',
        ',',
        'Virgula `,` aplică stilul la TOATE selectorii.',
        { topic: 'selectors' }),
      mc('Copil direct',
        'Ce înseamnă selectorul `ul > li`?',
        ['Toate li-urile', 'Doar li copii DIRECȚI ai ul (nu nepoți)', 'Niciun li', 'li înainte de ul'],
        'Doar li copii DIRECȚI ai ul (nu nepoți)',
        '`>` selectează doar copilul direct.',
        { topic: 'selectors', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 3. culori-background ============
  'culori-background': {
    theory: `# 🎨 Culori și fundal

CSS are **multe** moduri de a specifica culori 🌈.

## 🎯 Numele culorilor

\`\`\`css
color: red;
color: blue;
color: orange;
color: purple;
color: lightgray;
color: darkblue;
\`\`\`

> ~140 nume disponibile. Bun pentru prototipuri.

## 🔢 HEX (#RRGGBB)

\`\`\`css
color: #ff0000;     /* roșu */
color: #00ff00;     /* verde */
color: #0000ff;     /* albastru */
color: #ffffff;     /* alb */
color: #000000;     /* negru */
color: #f00;        /* scurt = #ff0000 */
\`\`\`

- **\`#FF\`** — 255 (max)
- **\`#00\`** — 0 (min)
- **Primele 2** — Roșu
- **Următoarele 2** — Verde
- **Ultimele 2** — Albastru

## 🎨 RGB

\`\`\`css
color: rgb(255, 0, 0);          /* roșu */
color: rgb(0, 128, 0);          /* verde închis */
color: rgb(255, 255, 255);      /* alb */
\`\`\`

Valori 0-255.

## 🎨 RGBA (cu transparență)

\`\`\`css
background: rgba(255, 0, 0, 0.5);  /* roșu 50% transparent */
background: rgba(0, 0, 0, 0.8);    /* negru 80% opac */
\`\`\`

> A = alpha (0 = invizibil, 1 = complet vizibil)

## 🎨 HSL (mai intuitiv!)

\`\`\`css
color: hsl(0, 100%, 50%);        /* roșu */
color: hsl(120, 100%, 50%);      /* verde */
color: hsl(240, 100%, 50%);      /* albastru */
\`\`\`

- ****H**ue** — 0-360 grade (cercul culorilor)
- ****S**aturation** — 0-100% (intensitate)
- ****L**ightness** — 0-100% (luminozitate)

## 🎨 Background

\`\`\`css
.box {
  background-color: lightblue;
  background-image: url('poza.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;   /* paralax */
}
\`\`\`

### Shorthand
\`\`\`css
.box {
  background: lightblue url('poza.jpg') center/cover no-repeat;
}
\`\`\`

## 🌈 Gradients

### Linear
\`\`\`css
background: linear-gradient(to right, red, blue);
background: linear-gradient(45deg, red, yellow, green);
\`\`\`

### Radial
\`\`\`css
background: radial-gradient(circle, red, blue);
\`\`\`

## ⚠️ Contrast — important!

Asigură-te că textul e LIZIBIL:

\`\`\`css
/* ❌ Rău: */
color: yellow;
background: white;

/* ✅ Bun: */
color: black;
background: yellow;
\`\`\`

## 🎓 Ce ai învățat
- ✅ Nume, HEX, RGB, RGBA, HSL
- ✅ \`background-color\`, \`background-image\`
- ✅ Gradients linear și radial
- ✅ Contrast pentru lizibilitate
`,
    extraProblems: [
      mc('HEX roșu',
        'Care cod HEX e ROȘU pur?',
        ['#00ff00', '#ff0000', '#0000ff', '#ffffff'],
        '#ff0000',
        'Primii 2 cifre = roșu. `#ff0000` = roșu max.',
        { topic: 'colors' }),
      mc('Transparență',
        'Care funcție de culoare permite TRANSPARENȚĂ?',
        ['rgb()', 'rgba()', 'hex()', 'color()'],
        'rgba()',
        '`rgba(R, G, B, alpha)` — alpha între 0 și 1.',
        { topic: 'colors', difficulty: 'MEDIUM' }),
      sa('HEX scurt',
        'Care e forma scurtă a `#ff0000`? (3 caractere după #)',
        'f00',
        '`#f00` = `#ff0000`. Funcționează când fiecare pereche e identică.',
        { topic: 'colors' }),
      mc('Gradient',
        'Care funcție creează un gradient liniar?',
        ['gradient()', 'linear-gradient()', 'fade()', 'multi-color()'],
        'linear-gradient()',
        '`background: linear-gradient(to right, red, blue);`.',
        { topic: 'colors' }),
    ],
  },

  // ============ 4. text-styling ============
  'text-styling': {
    theory: `# ✍️ Stilizare text

CSS are **multe** proprietăți pentru text — hai să le descoperim! 📝

## 📏 Mărime: \`font-size\`

\`\`\`css
p { font-size: 16px; }     /* pixeli */
p { font-size: 1.2em; }    /* relativ la părinte */
p { font-size: 1.2rem; }   /* relativ la root */
p { font-size: 120%; }     /* procentaj */
\`\`\`

- **\`px\`** — Fix — bun pentru control precis
- **\`em\`** — Relativ la părinte
- **\`rem\`** — Relativ la \`<html>\` — preferat
- **\`%\`** — Procentaj

## 🔤 Font-family

\`\`\`css
body {
  font-family: Arial, sans-serif;
}
h1 {
  font-family: 'Times New Roman', serif;
}
code {
  font-family: 'Courier New', monospace;
}
\`\`\`

> 💡 Pune mereu un **fallback** generic la sfârșit (\`sans-serif\`, \`serif\`, \`monospace\`).

## 💪 Greutate (bold)

\`\`\`css
font-weight: normal;     /* 400 */
font-weight: bold;       /* 700 */
font-weight: 100;        /* foarte subțire */
font-weight: 900;        /* foarte gros */
\`\`\`

## ✏️ Style (italic)

\`\`\`css
font-style: normal;
font-style: italic;
\`\`\`

## ➡️ Aliniere

\`\`\`css
text-align: left;
text-align: center;
text-align: right;
text-align: justify;
\`\`\`

## 🔠 Transformare

\`\`\`css
text-transform: uppercase;     /* MAJUSCULE */
text-transform: lowercase;     /* minuscule */
text-transform: capitalize;    /* Prima Literă Mare */
\`\`\`

## 🖊️ Decorare

\`\`\`css
text-decoration: none;          /* fără */
text-decoration: underline;     /* subliniat */
text-decoration: line-through;  /* tăiat */
text-decoration: overline;
\`\`\`

> 💡 Folosit des: \`a { text-decoration: none; }\` pentru a scoate sublinierea link-urilor.

## 📐 Spațiere

\`\`\`css
line-height: 1.5;            /* înălțimea liniei */
letter-spacing: 2px;         /* între litere */
word-spacing: 5px;           /* între cuvinte */
text-indent: 30px;           /* indentare paragraf */
\`\`\`

## 🌑 Umbră

\`\`\`css
text-shadow: 2px 2px 4px gray;
text-shadow: 0 0 10px red;     /* glow */
\`\`\`

## 🎯 Shorthand \`font\`

\`\`\`css
font: italic bold 16px/1.5 Arial, sans-serif;
/* style weight size/line-height family */
\`\`\`

## 🎯 Exemplu

\`\`\`css
h1 {
  font-family: 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 1px 1px 2px gray;
}
\`\`\`

## ⚠️ Greșeli frecvente

- **Fără fallback la \`font-family\`** — Adaugă \`sans-serif\` etc.
- **\`font-size: 16\` (fără unitate)** — \`font-size: 16px;\`
- **\`text-decoration: underlined\`** — \`underline\` (fără d)

## 🎓 Ce ai învățat
- ✅ \`font-size\`, \`font-family\`, \`font-weight\`
- ✅ \`text-align\`, \`text-transform\`, \`text-decoration\`
- ✅ \`line-height\`, \`letter-spacing\`
- ✅ \`text-shadow\` pentru efecte
`,
    extraProblems: [
      mc('Bold',
        'Care proprietate face textul bold?',
        ['text-bold', 'font-weight: bold', 'font-bold', 'bold: true'],
        'font-weight: bold',
        '`font-weight` cu valoarea `bold` (sau 700).',
        { topic: 'text' }),
      mc('Scoate subliniere',
        'Cum scoți subliniera de pe un link?',
        ['underline: none', 'text-style: none', 'text-decoration: none', 'link-style: none'],
        'text-decoration: none',
        '`text-decoration: none;` scoate subliniera default.',
        { topic: 'text' }),
      sa('Centrare text',
        'Care proprietate centrează textul?',
        'text-align',
        '`text-align: center;` centrează textul.',
        { topic: 'text' }),
      mc('Unitate preferată',
        'Care unitate de font-size e PREFERATĂ pentru responsive?',
        ['px', 'rem', 'pt', 'cm'],
        'rem',
        '`rem` e relativ la `<html>` — scalează ușor.',
        { topic: 'text', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 5. box-model ============
  'box-model': {
    theory: `# 📦 Box Model — cutia magică

**Fiecare element HTML e o cutie!** 📦

\`\`\`
┌──────────────────────────────┐
│         margin               │  ← afară (spațiu între cutii)
│   ┌──────────────────┐       │
│   │     border       │       │  ← rama
│   │  ┌────────────┐  │       │
│   │  │  padding   │  │       │  ← spațiu interior
│   │  │ ┌────────┐ │  │       │
│   │  │ │CONȚINUT│ │  │       │  ← textul / imaginea
│   │  │ └────────┘ │  │       │
│   │  └────────────┘  │       │
│   └──────────────────┘       │
└──────────────────────────────┘
\`\`\`

## 4️⃣ Părțile unei cutii

- ****content**** — Conținutul (text, imagine)
- ****padding**** — Spațiu **între conținut și border**
- ****border**** — Rama
- ****margin**** — Spațiu **între cutie și alte cutii**

## 🎨 Exemplu

\`\`\`css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid black;
  margin: 30px;
  background: lightblue;
}
\`\`\`

## 📏 Lățimea **TOTALĂ** (default — \`box-sizing: content-box\`)

\`\`\`
width = 200px (doar conținut)
+ padding-left + padding-right = 40px
+ border-left + border-right = 10px
= 250px total!
\`\`\`

> 😱 Surpriză! Am setat 200px, dar ocupă 250px!

## ✅ Soluția: \`box-sizing: border-box\`

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

Acum:
\`\`\`
width = 200px (TOTAL — incluzând padding și border)
\`\`\`

> 💡 Folosește \`* { box-sizing: border-box; }\` MEREU la începutul CSS-ului.

## 🎯 Padding & Margin — sintaxe

\`\`\`css
/* toate la fel */
padding: 10px;

/* sus-jos | stânga-dreapta */
padding: 10px 20px;

/* sus | stânga-dreapta | jos */
padding: 10px 20px 30px;

/* sus | dreapta | jos | stânga */
padding: 10px 20px 30px 40px;

/* individual */
padding-top: 10px;
padding-right: 20px;
padding-bottom: 30px;
padding-left: 40px;
\`\`\`

## 🎨 Border — în detaliu

\`\`\`css
border: 2px solid red;          /* shorthand */
border-width: 2px;
border-style: solid;            /* solid, dashed, dotted, double */
border-color: red;

/* doar pe o latură */
border-top: 1px solid black;
border-bottom: 3px dashed blue;
\`\`\`

## ⚠️ Margin collapse

Marginea verticală **se "absorbește"**:

\`\`\`css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
\`\`\`

> Spațiul între ele NU e 50px, ci doar **30px** (cea mai mare).

## ⚠️ Greșeli frecvente

- **Fără \`box-sizing: border-box\`** — Adaugă-l mereu
- **\`padding\` cu valori negative** — Padding NU poate fi negativ; margin DA
- **\`border\` fără \`style\`** — \`border: 2px solid red;\` cu toate 3

## 🎓 Ce ai învățat
- ✅ Box model: content + padding + border + margin
- ✅ \`box-sizing: border-box\` simplifică totul
- ✅ Sintaxe shorthand pentru padding/margin
- ✅ Margin collapse pe vertical
`,
    extraProblems: [
      mc('Spațiu interior',
        'Care e spațiul ÎNTRE conținut și border?',
        ['margin', 'padding', 'spacing', 'gap'],
        'padding',
        '`padding` e interior; `margin` e exterior.',
        { topic: 'box-model' }),
      mc('box-sizing',
        'Ce face `box-sizing: border-box`?',
        ['Schimbă culoarea', '`width` include padding și border', 'Ascunde border', 'Adaugă margin'],
        '`width` include padding și border',
        'Mult mai intuitiv — width = totul.',
        { topic: 'box-model', difficulty: 'MEDIUM' }),
      sa('Spațiu exterior',
        'Care proprietate creează spațiu ÎNTRE elemente (în afara cutiei)?',
        'margin',
        '`margin` e spațiul exterior; `padding` e interior.',
        { topic: 'box-model' }),
      mc('Sintaxă shorthand',
        'Ce înseamnă `padding: 10px 20px;`?',
        ['10 sus, 20 jos', '10 sus-jos, 20 stânga-dreapta', '10 stânga, 20 dreapta', 'Doar 10'],
        '10 sus-jos, 20 stânga-dreapta',
        '2 valori = vertical / orizontal.',
        { topic: 'box-model', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 6. dimensiuni ============
  'dimensiuni': {
    theory: `# 📐 Dimensiuni

Cum controlăm **mărimea** elementelor? Multe unități, multe trucuri 📏.

## 📏 Width și Height

\`\`\`css
.box {
  width: 200px;
  height: 100px;
}
\`\`\`

## 🎯 Limite

\`\`\`css
.box {
  min-width: 100px;       /* minim atât */
  max-width: 500px;       /* maxim atât */
  min-height: 50px;
  max-height: 300px;
}
\`\`\`

> 💡 \`max-width: 100%\` previne ca imaginea să iasă din container!

## 📐 Unități — comparație

### Absolute (fixe)
- **\`px\`** — Pixeli — cel mai folosit
- **\`pt\`** — Puncte (din print)
- **\`cm\`, \`mm\`, \`in\`** — Lume reală (rar)

### Relative
- **\`%\`** — Părinte
- **\`em\`** — Font-size părinte
- **\`rem\`** — Font-size \`<html>\` (root)
- **\`vw\`** — 1% din lățimea viewport
- **\`vh\`** — 1% din înălțimea viewport
- **\`vmin\`** — min(vw, vh)
- **\`vmax\`** — max(vw, vh)

## 💡 Exemple practice

\`\`\`css
.full-screen {
  width: 100vw;          /* tot ecranul lat */
  height: 100vh;         /* tot ecranul înalt */
}

.responsive {
  width: 100%;           /* lățimea părintelui */
  max-width: 1200px;     /* dar nu mai mult de 1200px */
}

.button {
  padding: 1em 2em;      /* relativ la font */
}

.text {
  font-size: 1.2rem;     /* mai mare ca normal */
}
\`\`\`

## 🎯 \`auto\` — magic!

\`\`\`css
.center {
  width: 800px;
  margin: 0 auto;       /* centrează orizontal */
}

.height-auto {
  height: auto;         /* se adaptează conținutului */
}
\`\`\`

## 🎯 Aspect ratio (modern!)

\`\`\`css
.video {
  width: 100%;
  aspect-ratio: 16 / 9;  /* păstrează proporția */
}
\`\`\`

## 📊 Unități recomandate când

- **Lățimi container** — \`%\` sau \`max-width: ...px\`
- **Font-size** — \`rem\`
- **Padding/margin în text** — \`em\`
- **Imagini responsive** — \`max-width: 100%\`
- **Înălțime ecran** — \`100vh\`
- **Border, mici detalii** — \`px\`

## ⚠️ Greșeli frecvente

- **\`width: 100\` (fără unitate)** — \`width: 100px;\`
- **Toate width-urile fixe** — Folosește \`%\` și \`max-width\`
- **Fără \`max-width\` la imagini** — \`img { max-width: 100%; }\`

## 🎓 Ce ai învățat
- ✅ \`width\`, \`height\`, \`min/max-width/height\`
- ✅ Unități absolute (\`px\`) vs relative (\`%\`, \`rem\`, \`vw\`)
- ✅ \`margin: 0 auto\` centrează
- ✅ \`aspect-ratio\` modern pentru video
`,
    extraProblems: [
      mc('100% ecran lat',
        'Care unitate înseamnă 100% lățimea ecranului?',
        ['100%', '100vw', '100em', '100px'],
        '100vw',
        '`vw` = viewport width. `100vw` = tot ecranul.',
        { topic: 'dimensions' }),
      mc('Centrare orizontală',
        'Cum centrezi orizontal un element cu lățime fixă?',
        ['text-align: center', 'margin: 0 auto', 'center: true', 'align: center'],
        'margin: 0 auto',
        '`margin: 0 auto;` cu width fix centrează orizontal.',
        { topic: 'dimensions', difficulty: 'MEDIUM' }),
      sa('Imagine responsive',
        'Ce proprietate previne ca imaginea să iasă din container? (max-...)',
        'max-width',
        '`img { max-width: 100%; }` — imaginea NU depășește părintele.',
        { topic: 'dimensions' }),
      mc('rem vs em',
        'Care e DIFERENȚA între rem și em?',
        ['rem e mai mare', 'rem e relativ la <html>, em e relativ la părinte', 'Sunt identice', 'em e mai modern'],
        'rem e relativ la <html>, em e relativ la părinte',
        '`rem` = root em (constant); `em` se moștenește.',
        { topic: 'dimensions', difficulty: 'HARD' }),
    ],
  },

  // ============ 7. display ============
  'display': {
    theory: `# 📺 Display — cum apar elementele

Proprietatea \`display\` controlează **cum** elementul ocupă spațiul 📦.

## 🎯 Valori principale

- **\`block\`** — Linie nouă, ocupă tot rândul
- **\`inline\`** — În linie, ocupă cât e nevoie
- **\`inline-block\`** — În linie + dimensiuni reglabile
- **\`flex\`** — Flexbox (vezi lecția dedicată)
- **\`grid\`** — CSS Grid
- **\`none\`** — **Ascuns** complet

## 🟦 \`block\`

- Ocupă **toată lățimea**
- **Linie nouă** înainte și după
- Se pot seta \`width\`, \`height\`, \`margin\`, \`padding\`

Default pentru: \`<div>\`, \`<p>\`, \`<h1>\`-\`<h6>\`, \`<section>\`, \`<header>\`, \`<footer>\`.

\`\`\`css
.box { display: block; width: 200px; height: 100px; }
\`\`\`

## 🟩 \`inline\`

- Ocupă **doar cât e nevoie**
- Stă **pe aceeași linie**
- **NU** poți seta \`width\`/\`height\`!
- \`margin\`/\`padding\` vertical sunt parțiale

Default pentru: \`<span>\`, \`<a>\`, \`<strong>\`, \`<em>\`, \`<img>\`.

\`\`\`css
a { display: inline; }
\`\`\`

## 🟨 \`inline-block\`

- **Cel mai bun din ambele**: pe linie + cu dimensiuni
- Ideal pentru butoane, badge-uri

\`\`\`css
.button {
  display: inline-block;
  padding: 10px 20px;
  background: blue;
  color: white;
}
\`\`\`

## 🚫 \`none\` — ascundere

\`\`\`css
.ascuns { display: none; }
\`\`\`

> 💡 \`display: none\` **scoate** elementul din pagină. Spațiul dispare.
> Dacă vrei doar să-l faci invizibil dar să rămână spațiul: \`visibility: hidden\`.

## 📊 Comparație vizuală

\`\`\`html
<span>A</span><span>B</span><span>C</span>
\`\`\`

Cu \`display: inline\`:
\`\`\`
A B C   (toate pe o linie)
\`\`\`

Cu \`display: block\`:
\`\`\`
A
B
C
\`\`\`

Cu \`display: inline-block\` și \`width: 50px\`:
\`\`\`
[A   ][B   ][C   ]
\`\`\`

## 🎯 Exemplu real: meniu orizontal

\`\`\`html
<nav>
  <ul>
    <li><a href="/">Acasă</a></li>
    <li><a href="/despre">Despre</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
\`\`\`

\`\`\`css
nav ul { list-style: none; padding: 0; }
nav li { display: inline-block; margin-right: 20px; }
nav a { padding: 10px; background: #333; color: white; }
\`\`\`

## ⚠️ Greșeli frecvente

- **\`width\` pe \`inline\` element** — Schimbă la \`inline-block\` sau \`block\`
- **Confuzie \`display: none\` vs \`visibility: hidden\`** — Verifică care vrei
- **Folosești tabele pentru aranjare** — Folosește flex sau grid

## 🎓 Ce ai învățat
- ✅ \`block\` (linie nouă), \`inline\` (în linie)
- ✅ \`inline-block\` = cel mai versatil
- ✅ \`none\` ascunde complet
- ✅ Default-uri: \`<div>\` block, \`<span>\` inline
`,
    extraProblems: [
      mc('Element pe linie',
        'Care valoare `display` face elementul să stea în linie cu altele?',
        ['block', 'inline', 'flex', 'grid'],
        'inline',
        '`inline` curge în text — ca `<span>`.',
        { topic: 'display' }),
      mc('Dimensiuni pe inline',
        'Pot seta `width` pe un element `display: inline`?',
        ['Da, mereu', 'Nu, e ignorat', 'Doar pe imagini', 'Doar cu padding'],
        'Nu, e ignorat',
        '`inline` ignoră `width`/`height`. Folosește `inline-block`.',
        { topic: 'display', difficulty: 'MEDIUM' }),
      sa('Ascunde element',
        'Ce valoare `display` ascunde COMPLET un element (fără spațiu)?',
        'none',
        '`display: none` — element absent din layout.',
        { topic: 'display' }),
      mc('Cel mai versatil',
        'Care valoare combină BENEFICIILE block și inline?',
        ['flex', 'inline-block', 'grid', 'inline'],
        'inline-block',
        '`inline-block` = pe linie cu dimensiuni reglabile.',
        { topic: 'display' }),
    ],
  },

  // ============ 8. position ============
  'position': {
    theory: `# 📍 Position — poziționare exactă

Proprietatea \`position\` controlează **unde** apare elementul 🎯.

## 5️⃣ Valori

- **\`static\`** — Default — în fluxul normal
- **\`relative\`** — Mutat **față de poziția normală**
- **\`absolute\`** — Față de **primul părinte cu position**
- **\`fixed\`** — Față de **fereastra browser**
- **\`sticky\`** — **Lipit** când scroll-ezi

## 🎯 \`static\` (default)

\`\`\`css
.box { position: static; }
\`\`\`
> Niciun efect special — elementul e unde e normal.

## 📍 \`relative\`

Mută elementul **față de unde ar fi normal**, dar **păstrează spațiul**:

\`\`\`css
.box {
  position: relative;
  top: 20px;        /* mut 20px în jos */
  left: 30px;       /* mut 30px la dreapta */
}
\`\`\`

## 🎈 \`absolute\`

Scoate elementul din flux. Se poziționează față de **primul părinte cu \`position\` setat** (sau \`<html>\`):

\`\`\`html
<div class="parent">       <!-- position: relative -->
  <div class="child">      <!-- position: absolute -->
    Eu sunt aici!
  </div>
</div>
\`\`\`

\`\`\`css
.parent { position: relative; }
.child {
  position: absolute;
  top: 0;
  right: 0;        /* colțul dreapta-sus al părintelui */
}
\`\`\`

> 💡 Pattern foarte folosit: **părinte relative + copil absolute**.

## 📌 \`fixed\`

Față de **fereastra browser** — rămâne **fix** la scroll:

\`\`\`css
.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
}
\`\`\`

> Folosit pentru: meniuri sticky, butoane "back to top", popup-uri.

## 🪄 \`sticky\` — magic!

Funcționează ca **relative**, dar **devine fixed** când dai scroll dincolo de un punct:

\`\`\`css
.heading {
  position: sticky;
  top: 0;
  background: white;
}
\`\`\`

> 💡 Perfect pentru titluri de secțiuni care "rămân vizibile" la scroll.

## 🎯 Z-index — ordinea de stivuire

Când elementele se suprapun, \`z-index\` decide **cine e deasupra**:

\`\`\`css
.modal {
  position: fixed;
  z-index: 100;     /* peste tot */
}
.tooltip {
  position: absolute;
  z-index: 50;
}
\`\`\`

> Mai mare = mai sus.

## 🎯 Centrare absolută

\`\`\`css
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`

## ⚠️ Atenție

- \`absolute\` **scoate elementul din flux** — alte elemente "trec" prin el
- \`top\`/\`right\`/\`bottom\`/\`left\` funcționează **doar** cu \`position\` ≠ static
- \`z-index\` funcționează **doar** cu \`position\` ≠ static

## ⚠️ Greșeli frecvente

- **\`top: 10px\` pe element static** — Setează mai întâi \`position\`
- **\`absolute\` fără părinte cu position** — Adaugă \`relative\` pe părinte
- **\`z-index\` peste tot** — Folosește scară: 1, 10, 100

## 🎓 Ce ai învățat
- ✅ \`relative\`, \`absolute\`, \`fixed\`, \`sticky\`
- ✅ Pattern părinte relative + copil absolute
- ✅ \`fixed\` pentru meniuri rămase la scroll
- ✅ \`z-index\` pentru ordine
`,
    extraProblems: [
      mc('Fix la scroll',
        'Care `position` păstrează elementul fix la scroll?',
        ['relative', 'absolute', 'fixed', 'static'],
        'fixed',
        '`fixed` e relativ la viewport — rămâne pe ecran.',
        { topic: 'position' }),
      mc('Față de părinte',
        'Care `position` poziționează față de PRIMUL PĂRINTE cu position?',
        ['static', 'relative', 'absolute', 'fixed'],
        'absolute',
        '`absolute` caută părintele cu position ≠ static.',
        { topic: 'position', difficulty: 'MEDIUM' }),
      sa('Suprapunere',
        'Ce proprietate decide CINE e deasupra când elementele se suprapun?',
        'z-index',
        '`z-index` mai mare = mai sus. Funcționează cu position ≠ static.',
        { topic: 'position' }),
      mc('Sticky',
        'Ce face `position: sticky`?',
        ['Identic cu fixed', 'E relative, devine fixed la scroll', 'Lipit jos', 'Nu există'],
        'E relative, devine fixed la scroll',
        '`sticky` e hibrid — relative inițial, fixed după un punct de scroll.',
        { topic: 'position', difficulty: 'HARD' }),
    ],
  },

  // ============ 9. flexbox-intro ============
  'flexbox-intro': {
    theory: `# 💪 Flexbox — introducere

**Flexbox** = sistem modern pentru a aranja elemente **într-un singur rând (sau coloană)** ➡️.

Înlocuiește vechile trucuri cu \`float\` și \`inline-block\` 🎉.

## 🎯 Concepte

\`\`\`html
<div class="container">       <!-- părinte = "flex container" -->
  <div class="item">A</div>   <!-- copil = "flex item" -->
  <div class="item">B</div>
  <div class="item">C</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: flex;
}
\`\`\`

> 💡 \`display: flex\` se pune pe **PĂRINTE**, nu pe copii!

## 🎯 Direcție: \`flex-direction\`

\`\`\`css
.container { flex-direction: row; }            /* default — orizontal */
.container { flex-direction: column; }         /* vertical */
.container { flex-direction: row-reverse; }    /* invers */
.container { flex-direction: column-reverse; }
\`\`\`

\`\`\`
row:           [A][B][C]
column:        [A]
               [B]
               [C]
\`\`\`

## ➡️ Aliniere pe axa principală: \`justify-content\`

(axa principală = direcția lui \`flex-direction\`)

\`\`\`css
justify-content: flex-start;     /* default — la început */
justify-content: flex-end;       /* la sfârșit */
justify-content: center;         /* centru */
justify-content: space-between;  /* spațiu între, fără la margini */
justify-content: space-around;   /* spațiu egal în jur */
justify-content: space-evenly;   /* spațiu perfect egal */
\`\`\`

\`\`\`
flex-start:     [A][B][C]......
center:         ....[A][B][C]....
space-between:  [A]...[B]...[C]
space-evenly:   ..[A]..[B]..[C]..
\`\`\`

## ↕️ Aliniere pe axa cruce: \`align-items\`

\`\`\`css
align-items: stretch;       /* default — întind tot */
align-items: flex-start;    /* sus */
align-items: flex-end;      /* jos */
align-items: center;        /* centru */
align-items: baseline;      /* linia de bază a textului */
\`\`\`

## 🎯 CENTRARE PERFECTĂ — sfânt graal!

\`\`\`css
.container {
  display: flex;
  justify-content: center;   /* centru orizontal */
  align-items: center;       /* centru vertical */
  height: 100vh;
}
\`\`\`

> 🎉 Centrare orizontală + verticală în 3 linii — visul oricărui developer!

## 📦 Wrap

\`\`\`css
flex-wrap: nowrap;     /* default — totul pe o linie */
flex-wrap: wrap;       /* sare pe linie nouă */
\`\`\`

## 🎯 Gap (spațiu între items)

\`\`\`css
.container {
  display: flex;
  gap: 20px;            /* spațiu egal între items */
}
\`\`\`

## 🎯 Exemplu: bară de meniu

\`\`\`css
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`display: flex\` pe copil** — Pe părinte!
- **Confuzie axă principală vs cruce** — Depinde de \`flex-direction\`
- **Folosești \`text-align: center\` pentru centrare flex** — Folosește \`justify-content\`

## 🎓 Ce ai învățat
- ✅ \`display: flex\` pe părinte
- ✅ \`flex-direction\`: row / column
- ✅ \`justify-content\` pe axa principală
- ✅ \`align-items\` pe axa cruce
- ✅ Centrare = \`justify-content: center; align-items: center;\`
`,
    extraProblems: [
      mc('Unde se pune flex',
        'Pe ce element pui `display: flex`?',
        ['Pe copii', 'Pe părinte (containerul)', 'Pe ambele', 'Pe body'],
        'Pe părinte (containerul)',
        '`display: flex` pe părinte — copiii devin flex items.',
        { topic: 'flexbox' }),
      mc('Centrare orizontală',
        'Care proprietate centrează orizontal flex items?',
        ['align-items: center', 'justify-content: center', 'center: true', 'text-align: center'],
        'justify-content: center',
        '`justify-content` aliniază pe axa principală (orizontal default).',
        { topic: 'flexbox', difficulty: 'MEDIUM' }),
      sa('Direcție verticală',
        'Ce valoare a `flex-direction` aranjează items vertical?',
        'column',
        '`flex-direction: column` aranjează vertical.',
        { topic: 'flexbox' }),
      mc('Spațiu între items',
        'Care e cel mai modern mod de a adăuga spațiu între flex items?',
        ['margin pe fiecare', 'gap', 'padding', 'space-between'],
        'gap',
        '`gap: 20px;` e modern și mai curat decât margins.',
        { topic: 'flexbox', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 10. flexbox-avansat ============
  'flexbox-avansat': {
    theory: `# 💪 Flexbox — avansat

Acum stăpânim **proprietățile pentru flex items** (copii) 🎯.

## 🎯 \`flex-grow\` — cât poate crește

\`\`\`css
.item { flex-grow: 1; }   /* primește spațiul disponibil */
\`\`\`

Cu mai multe valori:
\`\`\`css
.item-a { flex-grow: 1; }   /* 1 parte */
.item-b { flex-grow: 2; }   /* 2 părți (dublu) */
.item-c { flex-grow: 1; }   /* 1 parte */
\`\`\`

## 🎯 \`flex-shrink\` — cât poate micșora

\`\`\`css
.item { flex-shrink: 0; }   /* NU se micșorează */
.item { flex-shrink: 1; }   /* default — se micșorează egal */
\`\`\`

## 🎯 \`flex-basis\` — mărime de bază

\`\`\`css
.item { flex-basis: 200px; }   /* punct de plecare */
\`\`\`

## 🎯 Shorthand: \`flex\`

\`\`\`css
.item { flex: 1 1 200px; }
/*       grow shrink basis */

/* Comune: */
.item { flex: 1; }           /* grow=1, shrink=1, basis=0 */
.item { flex: auto; }        /* grow=1, shrink=1, basis=auto */
.item { flex: none; }        /* nu se schimbă */
\`\`\`

## 🎯 \`align-self\` — aliniere INDIVIDUALĂ

Suprascrie \`align-items\` doar pentru un item:

\`\`\`css
.special {
  align-self: flex-end;    /* doar acesta jos */
}
\`\`\`

## 🎯 \`order\` — ordine

\`\`\`css
.item-a { order: 2; }   /* afișat al doilea */
.item-b { order: 1; }   /* afișat primul */
.item-c { order: 3; }
\`\`\`

> Default = 0. Mai mic = mai devreme.

## 🎯 \`align-content\` — pe mai multe linii

Doar dacă există \`flex-wrap: wrap\`:

\`\`\`css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
\`\`\`

## 🎯 Exemplu: card layout

\`\`\`html
<div class="card">
  <img src="..." alt="...">
  <div class="info">
    <h3>Titlu</h3>
    <p>Descriere...</p>
  </div>
  <button>Cumpără</button>
</div>
\`\`\`

\`\`\`css
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.info {
  flex: 1;     /* ocupă tot spațiul disponibil */
}
button {
  /* va sta jos pentru că info l-a împins */
}
\`\`\`

## 🎯 Exemplu: holy grail layout

\`\`\`html
<header>...</header>
<div class="main">
  <aside>Sidebar</aside>
  <main>Conținut</main>
  <aside>Pub</aside>
</div>
<footer>...</footer>
\`\`\`

\`\`\`css
.main {
  display: flex;
  gap: 20px;
}
.main > aside { flex: 0 0 200px; }   /* lățime fixă */
.main > main { flex: 1; }            /* restul */
\`\`\`

## 🎯 Pattern: bară de status

\`\`\`html
<div class="bar">
  <span>Logo</span>
  <span class="spacer"></span>
  <span>Setări</span>
  <span>Profil</span>
</div>
\`\`\`

\`\`\`css
.bar { display: flex; gap: 10px; }
.spacer { flex: 1; }   /* împinge totul la dreapta */
\`\`\`

## ⚠️ Greșeli frecvente

- **\`flex: 1\` pe părinte** — E pentru copii!
- **Confuzie shorthand** — \`flex: 1\` = grow:1, shrink:1, basis:0

## 🎓 Ce ai învățat
- ✅ \`flex-grow\`, \`flex-shrink\`, \`flex-basis\`
- ✅ Shorthand \`flex\`
- ✅ \`align-self\` pentru un singur item
- ✅ \`order\` pentru ordine vizuală
`,
    extraProblems: [
      mc('Item crește',
        'Care proprietate face un flex item să OCUPE spațiul disponibil?',
        ['flex-shrink: 1', 'flex-grow: 1', 'flex-basis: 100%', 'width: 100%'],
        'flex-grow: 1',
        '`flex-grow: 1` permite item-ului să crească.',
        { topic: 'flexbox' }),
      mc('Spacer trick',
        'Ce face `flex: 1` pe un element gol între alte elemente?',
        ['Le ascunde', 'Le împinge la margini (creează spațiu)', 'Le centrează', 'Nimic'],
        'Le împinge la margini (creează spațiu)',
        'Spacer-ul cu flex:1 absoarbe spațiul disponibil.',
        { topic: 'flexbox', difficulty: 'MEDIUM' }),
      sa('Aliniere individuală',
        'Care proprietate aliniază UN SINGUR item diferit?',
        'align-self',
        '`align-self` suprascrie `align-items` doar pentru acel item.',
        { topic: 'flexbox', difficulty: 'MEDIUM' }),
      mc('Reordonare',
        'Care proprietate schimbă ORDINEA vizuală a item-elor?',
        ['order', 'index', 'position', 'sort'],
        'order',
        '`order: 2;` afișează item-ul mai târziu (default 0).',
        { topic: 'flexbox', difficulty: 'HARD' }),
    ],
  },

  // ============ 11. grid-intro ============
  'grid-intro': {
    theory: `# 🔲 CSS Grid — introducere

**Grid** = sistem 2D pentru aranjare în **rânduri ȘI coloane** simultan 📐.

\`\`\`
Flexbox = 1D (linie sau coloană)
Grid    = 2D (linii ȘI coloane)
\`\`\`

## 🎯 Sintaxa de bază

\`\`\`html
<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
\`\`\`

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* 3 coloane egale */
  gap: 20px;
}
\`\`\`

Rezultat:
\`\`\`
[1][2][3]
[4][5][6]
\`\`\`

## 📏 Unitatea \`fr\` (fraction)

\`\`\`css
grid-template-columns: 1fr 1fr;       /* 2 coloane egale (50/50) */
grid-template-columns: 1fr 2fr;       /* 1/3 + 2/3 */
grid-template-columns: 200px 1fr;     /* fix + restul */
grid-template-columns: 1fr 3fr 1fr;
\`\`\`

> \`1fr\` = 1 fracțiune din spațiul **disponibil**.

## 🎯 \`repeat()\` — pentru multe coloane identice

\`\`\`css
grid-template-columns: repeat(4, 1fr);    /* 4 coloane egale */
grid-template-columns: repeat(3, 100px);  /* 3 coloane de 100px */

/* Auto-fit / auto-fill (responsive!) */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
\`\`\`

> 💡 \`auto-fit + minmax\` = grid responsive **fără media queries**!

## 🎯 Rânduri

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100px 200px;
  /* sau */
  grid-template-rows: repeat(3, 1fr);
}
\`\`\`

## 📦 \`gap\` — spațiu între celule

\`\`\`css
gap: 20px;           /* row-gap și column-gap */
gap: 20px 10px;      /* row-gap | column-gap */

/* Separat */
row-gap: 20px;
column-gap: 10px;
\`\`\`

## 🎯 Exemplu: galerie de poze

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.gallery img { width: 100%; }
\`\`\`

## 🎯 Exemplu: layout pagina

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
}
.sidebar { /* va fi în coloana 1 */ }
.content { /* va fi în coloana 2 */ }
\`\`\`

## 🎯 Aliniere

\`\`\`css
.grid {
  display: grid;
  justify-items: center;    /* aliniere orizontală în celulă */
  align-items: center;      /* aliniere verticală în celulă */
  justify-content: center;  /* aliniere grid-ului întreg orizontal */
  align-content: center;    /* aliniere grid-ului întreg vertical */
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`display: grid\` pe copii** — Pe părinte!
- **\`width\` cu px peste tot** — Folosește \`fr\` și \`minmax\`
- **Nu folosești \`gap\`** — E mai bun decât margin

## 🎓 Ce ai învățat
- ✅ \`display: grid\` pe părinte
- ✅ \`grid-template-columns\` cu \`fr\`
- ✅ \`repeat(auto-fit, minmax(...))\` = responsive
- ✅ \`gap\` pentru spațiere
`,
    extraProblems: [
      mc('Grid 1D vs 2D',
        'Care e DIFERENȚA principală între Flexbox și Grid?',
        ['Sunt identice', 'Flexbox = 1D, Grid = 2D (rânduri ȘI coloane)', 'Grid e mai vechi', 'Flexbox are gap'],
        'Flexbox = 1D, Grid = 2D (rânduri ȘI coloane)',
        'Flex e pentru o axă; Grid pentru ambele simultan.',
        { topic: 'grid', difficulty: 'MEDIUM' }),
      sa('Unitate Grid',
        'Care unitate Grid reprezintă o "fracțiune din spațiul disponibil"? (2 caractere)',
        'fr',
        '`fr` = fraction. `1fr 2fr` = 1/3 + 2/3.',
        { topic: 'grid' }),
      mc('Responsive grid',
        'Care construcție creează un grid responsive FĂRĂ media queries?',
        ['repeat(3, 1fr)', 'repeat(auto-fit, minmax(200px, 1fr))', '1fr 1fr', 'auto'],
        'repeat(auto-fit, minmax(200px, 1fr))',
        'Grid-ul își ajustează automat numărul de coloane.',
        { topic: 'grid', difficulty: 'HARD' }),
      mc('Spațiu celule',
        'Care proprietate adaugă spațiu între celulele grid?',
        ['margin', 'spacing', 'gap', 'border'],
        'gap',
        '`gap: 20px` adaugă spațiu între rânduri și coloane.',
        { topic: 'grid' }),
    ],
  },

  // ============ 12. grid-avansat ============
  'grid-avansat': {
    theory: `# 🔲 CSS Grid — avansat

Acum putem **plasa** items oriunde în grid! 🎯

## 🎯 Plasare items: \`grid-column\` și \`grid-row\`

\`\`\`css
.item {
  grid-column: 1 / 3;     /* de la coloana 1 până la 3 (ocupă 2 col) */
  grid-row: 1 / 2;        /* rândul 1 */
}

/* Cu span */
.item {
  grid-column: span 2;    /* ocupă 2 coloane */
  grid-row: span 3;       /* ocupă 3 rânduri */
}
\`\`\`

## 🎯 Liniile grid-ului

\`\`\`
       1     2     3     4
       │     │     │     │
   1 ──┼─────┼─────┼─────┼──
       │  A  │  B  │  C  │
   2 ──┼─────┼─────┼─────┼──
       │  D  │  E  │  F  │
   3 ──┼─────┼─────┼─────┼──
\`\`\`

\`\`\`css
.special {
  grid-column: 2 / 4;     /* B + C */
}
\`\`\`

## 🎯 \`grid-area\` — shorthand

\`\`\`css
.item {
  grid-area: 1 / 1 / 3 / 3;
  /* row-start | col-start | row-end | col-end */
}
\`\`\`

## 🎯 Template areas (foarte clar!)

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
\`\`\`

> 🎨 Acest layout e ASCII art real! Vezi exact cum arată!

## 🎯 \`auto-flow\` — direcția de umplere

\`\`\`css
grid-auto-flow: row;       /* default — pe rânduri */
grid-auto-flow: column;    /* pe coloane */
grid-auto-flow: dense;     /* umple spațiile goale */
\`\`\`

## 🎯 Implicit rows / columns

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;     /* rânduri create automat */
}
\`\`\`

## 🎯 Exemple practice

### Galerie cu items mai mari

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.gallery .featured {
  grid-column: span 2;
  grid-row: span 2;
}
\`\`\`

### Pinterest-style (masonry)

\`\`\`css
.pinterest {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 50px;
  grid-auto-flow: dense;
}
\`\`\`

## 🎯 Aliniere fină

\`\`\`css
.item {
  justify-self: center;   /* aliniere orizontală în celulă */
  align-self: end;        /* aliniere verticală în celulă */
}
\`\`\`

## ⚠️ Greșeli frecvente

- **Index începe de la 0** — Liniile grid încep de la **1**
- **\`grid-column: 1 / 2\` (doar 1 coloană)** — E corect — de la 1 până la 2

## 🎓 Ce ai învățat
- ✅ \`grid-column / grid-row\` pentru plasare
- ✅ \`span N\` pentru a ocupa N coloane/rânduri
- ✅ \`grid-template-areas\` cu nume
- ✅ \`auto-flow: dense\` pentru masonry
`,
    extraProblems: [
      mc('Span 2 coloane',
        'Cum faci un item să ocupe 2 coloane?',
        ['width: 200%', 'grid-column: span 2', 'colspan: 2', 'columns: 2'],
        'grid-column: span 2',
        '`grid-column: span 2` ocupă 2 coloane.',
        { topic: 'grid', difficulty: 'MEDIUM' }),
      mc('Layout cu nume',
        'Care proprietate permite layout cu **nume** vizuale (ASCII art)?',
        ['grid-named', 'grid-template-areas', 'grid-layout', 'named-grid'],
        'grid-template-areas',
        '`grid-template-areas: "header header" "sidebar main";` — vizual.',
        { topic: 'grid', difficulty: 'HARD' }),
      sa('Linii încep de la',
        'Numerotarea liniilor grid începe de la ce număr?',
        '1',
        'Liniile grid sunt numerotate începând cu 1, nu 0.',
        { topic: 'grid' }),
      mc('Masonry',
        'Care valoare `grid-auto-flow` umple spațiile goale?',
        ['fill', 'dense', 'auto', 'pack'],
        'dense',
        '`grid-auto-flow: dense` reordonează items pentru a umple golurile.',
        { topic: 'grid', difficulty: 'HARD' }),
    ],
  },

  // ============ 13. border-shadow ============
  'border-shadow': {
    theory: `# 🖼️ Borduri și umbre

Hai să facem cutiile **mai frumoase**! ✨

## 🔲 Border

\`\`\`css
.box {
  border: 2px solid black;
}
\`\`\`

### Părți

\`\`\`css
border-width: 2px;           /* grosime */
border-style: solid;         /* tip */
border-color: black;         /* culoare */
\`\`\`

### Stiluri

- **\`solid\`** — linie continuă
- **\`dashed\`** — liniuțe
- **\`dotted\`** — puncte
- **\`double\`** — două linii
- **\`groove\` / \`ridge\`** — 3D
- **\`none\` / \`hidden\`** — fără

### Doar pe o latură

\`\`\`css
border-top: 2px solid red;
border-bottom: 2px dashed blue;
border-left: 5px solid black;
border-right: none;
\`\`\`

## 🟢 Colțuri rotunjite: \`border-radius\`

\`\`\`css
border-radius: 10px;              /* toate colțurile */
border-radius: 50%;               /* CERC dintr-un pătrat! */
border-radius: 10px 20px;         /* sus | jos */
border-radius: 10px 20px 30px 40px;  /* fiecare colț */

/* Doar un colț */
border-top-left-radius: 20px;
\`\`\`

### 🎯 Truc: cerc

\`\`\`css
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: red;
}
\`\`\`

## 🌑 Box-shadow — umbră

\`\`\`css
box-shadow: x y blur color;
\`\`\`

\`\`\`css
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
\`\`\`

- **\`0\` (x)** — Offset orizontal
- **\`4px\` (y)** — Offset vertical
- **\`8px\`** — Cât de blurată
- **\`rgba(...)\`** — Culoarea

### Cu spread și inset

\`\`\`css
box-shadow: 0 4px 8px 2px gray;        /* x y blur spread */
box-shadow: inset 0 0 5px black;       /* inset = umbra ÎNĂUNTRU */
\`\`\`

### Multiple umbre

\`\`\`css
box-shadow:
  0 2px 4px rgba(0,0,0,0.1),
  0 8px 16px rgba(0,0,0,0.1);
\`\`\`

## 🎨 Exemple frumoase

### Card cu umbră subtilă
\`\`\`css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
\`\`\`

### Buton apăsat
\`\`\`css
.btn:active {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
\`\`\`

### Glow neon
\`\`\`css
.neon {
  box-shadow: 0 0 20px #0ff, 0 0 40px #0ff;
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`border: red\` (fără width și style)** — Toate 3: \`border: 2px solid red;\`
- **\`box-shadow: gray\` (incomplet)** — Cu poziție: \`0 4px 8px gray\`

## 🎓 Ce ai învățat
- ✅ \`border\` cu width, style, color
- ✅ \`border-radius\` pentru colțuri rotunjite
- ✅ \`50%\` = cerc dintr-un pătrat
- ✅ \`box-shadow\` cu offset, blur, culoare
`,
    extraProblems: [
      mc('Cerc',
        'Cum transformi un pătrat 100x100 într-un CERC?',
        ['border: round', 'border-radius: 50%', 'shape: circle', 'transform: circle'],
        'border-radius: 50%',
        '`border-radius: 50%` rotunjește jumătate — cerc.',
        { topic: 'borders' }),
      mc('Sintaxă border',
        'Care e SINTAXA corectă pentru border?',
        ['border: red 2px', 'border: 2px solid red', 'border-color: red 2px', 'border = 2px red'],
        'border: 2px solid red',
        'Ordinea: width, style, color.',
        { topic: 'borders' }),
      sa('Umbră',
        'Care proprietate adaugă umbră unei cutii?',
        'box-shadow',
        '`box-shadow: x y blur color;`.',
        { topic: 'borders', difficulty: 'MEDIUM' }),
      mc('Inset shadow',
        'Ce face cuvântul `inset` în `box-shadow`?',
        ['Umbră mai mare', 'Umbra apare ÎNĂUNTRU cutiei', 'Ascunde umbra', 'Animație'],
        'Umbra apare ÎNĂUNTRU cutiei',
        '`inset` = umbră interioară (ca o "scobitură").',
        { topic: 'borders', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 14. hover-efecte ============
  'hover-efecte': {
    theory: `# ✨ Hover și efecte

Site-urile **prind viață** când userul interacționează 🎮.

## 🎯 \`:hover\` — la trecerea mouse-ului

\`\`\`css
.btn {
  background: blue;
  color: white;
}
.btn:hover {
  background: darkblue;
}
\`\`\`

> 💡 \`:hover\` nu funcționează pe **mobil** (nu există mouse). Folosește \`:active\` sau JS.

## 🎯 Alte pseudo-clase

- **\`:hover\`** — Mouse deasupra
- **\`:focus\`** — Element focusat (tab/click)
- **\`:active\`** — Apăsat (mouse down)
- **\`:visited\`** — Link vizitat
- **\`:checked\`** — Checkbox/radio bifat
- **\`:disabled\`** — Element dezactivat

\`\`\`css
input:focus { border-color: blue; outline: none; }
button:active { transform: scale(0.95); }
input:checked + label { color: green; }
\`\`\`

## 🎯 Exemple

### Buton cu efect lift
\`\`\`css
.btn {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  transition: all 0.3s;
}
.btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
\`\`\`

### Card care se ridică
\`\`\`css
.card {
  transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
\`\`\`

### Link subliniat doar la hover
\`\`\`css
a {
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
a:hover {
  border-bottom-color: currentColor;
}
\`\`\`

## 🎯 \`:focus-visible\` — modern!

\`\`\`css
button:focus { outline: 2px solid blue; }              /* la orice focus */
button:focus-visible { outline: 2px solid blue; }      /* doar la tab (NU click) */
\`\`\`

## 🎯 Cursor

\`\`\`css
.btn { cursor: pointer; }       /* mâna */
.disabled { cursor: not-allowed; }
.busy { cursor: wait; }
.text { cursor: text; }
\`\`\`

## 🎯 Schimbări multiple la hover

\`\`\`css
.box {
  background: white;
  color: black;
  transform: scale(1) rotate(0);
  transition: all 0.3s;
}
.box:hover {
  background: black;
  color: white;
  transform: scale(1.1) rotate(5deg);
}
\`\`\`

## 🎯 Hover pe părinte → schimbă copil

\`\`\`css
.card:hover .title { color: red; }
.card:hover img { transform: scale(1.05); }
\`\`\`

## 🎯 Tooltip simplu

\`\`\`css
.tooltip {
  position: relative;
}
.tooltip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: 100%;
  background: black;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip:hover::after {
  opacity: 1;
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`:hover\` doar pe mobil** — Adaugă \`:active\` pentru touch
- **Schimbări brutal fără transition** — Adaugă \`transition: 0.3s\`
- **\`outline: none\` fără alternativă** — Înlocuiește cu \`box-shadow\` pentru focus

## 🎓 Ce ai învățat
- ✅ \`:hover\`, \`:focus\`, \`:active\`
- ✅ Schimbări multiple în hover
- ✅ Hover pe părinte schimbă copil
- ✅ \`cursor: pointer\` pentru butoane
`,
    extraProblems: [
      mc('Hover',
        'Care pseudo-clasă se activează la trecerea mouse-ului?',
        [':mouse', ':hover', ':over', ':touch'],
        ':hover',
        '`:hover` — mouse deasupra elementului.',
        { topic: 'hover' }),
      mc('Pe mobil',
        'De ce `:hover` nu prea funcționează pe mobil?',
        ['E bug', 'Pe mobil nu există mouse', 'E dezactivat', 'Doar Apple'],
        'Pe mobil nu există mouse',
        'Pe touch screens nu există hover real. Folosește `:active`.',
        { topic: 'hover', difficulty: 'MEDIUM' }),
      sa('Cursor mâna',
        'Ce valoare a `cursor` afișează mâna (pentru click)?',
        'pointer',
        '`cursor: pointer` — mâna care indică click.',
        { topic: 'hover' }),
      mc('Hover părinte',
        'Cum schimbi un copil când dai hover pe părinte?',
        ['.parent.child:hover', '.parent:hover .child', '.child:hover .parent', 'Nu se poate'],
        '.parent:hover .child',
        '`.parent:hover .child` — descendentul când părintele e hover.',
        { topic: 'hover', difficulty: 'HARD' }),
    ],
  },

  // ============ 15. transitions ============
  'transitions': {
    theory: `# 🎬 Transitions — animații line

\`transition\` face schimbările **netede** în loc de bruște 🌊.

## 🆚 Fără vs cu transition

\`\`\`css
/* ❌ Brusc */
.btn { background: blue; }
.btn:hover { background: red; }    /* clic — instant roșu */

/* ✅ Lin */
.btn { background: blue; transition: background 0.3s; }
.btn:hover { background: red; }    /* trece lin în 0.3s */
\`\`\`

## 🎯 Sintaxa

\`\`\`css
transition: proprietate durata timing delay;
\`\`\`

\`\`\`css
transition: all 0.3s ease;
transition: background 0.5s ease-in-out;
transition: transform 0.2s, opacity 0.4s;
\`\`\`

## ⏱️ Timing functions

- **\`linear\`** — Constant
- **\`ease\`** — Default — accelerare apoi decelerare
- **\`ease-in\`** — Accelerează la sfârșit
- **\`ease-out\`** — Începe rapid, încetinește
- **\`ease-in-out\`** — Lent → rapid → lent
- **\`cubic-bezier(...)\`** — Custom

## 🎯 Multiple proprietăți

\`\`\`css
.box {
  transition:
    background 0.3s ease,
    transform 0.5s ease-out,
    box-shadow 0.3s;
}
\`\`\`

> Sau pe scurt: \`transition: all 0.3s ease;\` (mai puțin performant).

## 🕒 Delay

\`\`\`css
transition: opacity 0.3s ease 0.5s;
/*                       delay ↑ */
\`\`\`

## 🎯 Exemple

### Buton frumos
\`\`\`css
.btn {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}
\`\`\`

### Imagine zoom
\`\`\`css
.gallery img {
  transition: transform 0.5s ease;
}
.gallery img:hover {
  transform: scale(1.1);
}
\`\`\`

### Toggle drawer
\`\`\`css
.drawer {
  height: 0;
  overflow: hidden;
  transition: height 0.4s ease-in-out;
}
.drawer.open {
  height: 200px;
}
\`\`\`

## 🎨 Transform — partener perfect cu transition

\`\`\`css
transform: translateX(50px);    /* mută */
transform: translateY(-10px);
transform: scale(1.5);          /* mărește */
transform: rotate(45deg);       /* rotește */
transform: skew(10deg);         /* oblic */

/* Combinate */
transform: translateY(-5px) scale(1.05) rotate(2deg);
\`\`\`

> 💡 \`transform\` e **performant** — se face pe GPU, nu re-calculează layout-ul.

## ⚠️ Ce NU se poate anima?

- \`display: none\` ↔ \`block\`
- \`height: auto\`
- \`background-image\` (URL)

> 💡 Folosește \`opacity\`, \`transform\`, sau height fix.

## ⚠️ Greșeli frecvente

- **\`transition\` pe \`:hover\`** — Pe stare normală!
- **\`all\` peste tot** — Specific = mai performant
- **Animezi \`width\` constant** — Folosește \`transform: scale()\`

## 🎓 Ce ai învățat
- ✅ \`transition: prop dur timing\`
- ✅ \`ease\`, \`linear\`, \`ease-in-out\`
- ✅ \`transform\` pentru efecte performante
- ✅ Pune \`transition\` pe stare **normală**
`,
    extraProblems: [
      mc('Transition unde',
        'Pe care stare pui `transition` (normală sau :hover)?',
        ['Pe :hover', 'Pe stare normală', 'Pe ambele', 'Niciuna'],
        'Pe stare normală',
        'Pe stare normală — afectează ambele direcții (in și out).',
        { topic: 'transitions', difficulty: 'MEDIUM' }),
      mc('Cea mai performantă',
        'Care proprietate e cea mai PERFORMANTĂ pentru animații?',
        ['width', 'transform', 'height', 'background-image'],
        'transform',
        '`transform` se rulează pe GPU — fluid.',
        { topic: 'transitions', difficulty: 'HARD' }),
      sa('Mărește 1.5x',
        'Care `transform` mărește elementul de 1.5 ori? (cu ())',
        'scale(1.5)',
        '`transform: scale(1.5)` mărește la 150%.',
        { topic: 'transitions', difficulty: 'MEDIUM' }),
      mc('Sintaxa',
        'Care e ordinea CORECTĂ?',
        ['transition: 0.3s background ease', 'transition: background 0.3s ease', 'transition: ease background 0.3s', 'oricum merge'],
        'transition: background 0.3s ease',
        'Proprietate, durată, timing.',
        { topic: 'transitions' }),
    ],
  },

  // ============ 16. responsive ============
  'responsive': {
    theory: `# 📱 Responsive Design

**Responsive** = site-ul arată bine pe **orice ecran**: telefon, tabletă, laptop, monitor mare 📱💻🖥️.

## 🎯 Începe cu \`viewport\`

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

> 🚨 Fără asta, site-ul apare zoomed-out pe telefon!

## 🎯 Media Queries

Aplică CSS **doar** pentru anumite dimensiuni de ecran:

\`\`\`css
/* Default (mobil) */
.box { width: 100%; }

/* Tabletă (768px și peste) */
@media (min-width: 768px) {
  .box { width: 50%; }
}

/* Desktop (1024px și peste) */
@media (min-width: 1024px) {
  .box { width: 33%; }
}
\`\`\`

## 📐 Breakpoints comuni

- **Mobil mic** — < 480px
- **Mobil** — 480-767px
- **Tabletă** — 768-1023px
- **Laptop** — 1024-1439px
- **Desktop mare** — ≥ 1440px

## 🎯 Mobile-first vs Desktop-first

### Mobile-first (recomandat) ✅
\`\`\`css
.btn { font-size: 14px; }                 /* mobil default */

@media (min-width: 768px) {
  .btn { font-size: 16px; }               /* tabletă+ */
}
\`\`\`

### Desktop-first
\`\`\`css
.btn { font-size: 16px; }

@media (max-width: 767px) {
  .btn { font-size: 14px; }
}
\`\`\`

## 🎯 Tipuri de media queries

\`\`\`css
@media (min-width: 768px) { ... }       /* lățime minimă */
@media (max-width: 767px) { ... }       /* lățime maximă */
@media (min-width: 768px) and (max-width: 1023px) { ... }   /* interval */

@media (orientation: landscape) { ... }
@media (orientation: portrait) { ... }

@media (prefers-color-scheme: dark) { ... }   /* mod dark */
@media (prefers-reduced-motion: reduce) { ... }  /* a11y */
\`\`\`

## 📐 Unități responsive

- **\`%\`** — Lățimi
- **\`vw\` / \`vh\`** — Hero sections
- **\`rem\`** — Font-size
- **\`clamp()\`** — Mărimi adaptabile

### \`clamp()\` magic!

\`\`\`css
font-size: clamp(16px, 4vw, 32px);
/* min, ideal, max — automat scalează */
\`\`\`

## 🎯 Imagini responsive

\`\`\`css
img {
  max-width: 100%;     /* nu depășește containerul */
  height: auto;        /* păstrează proporția */
}
\`\`\`

\`\`\`html
<picture>
  <source media="(max-width: 600px)" srcset="mic.jpg">
  <source media="(min-width: 601px)" srcset="mare.jpg">
  <img src="default.jpg" alt="...">
</picture>
\`\`\`

## 🎯 Grid responsive cu auto-fit

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`

> 🎉 Responsive **fără media queries**!

## 🎯 Exemplu complet

\`\`\`css
/* Default mobil */
.container {
  padding: 10px;
}
nav ul {
  display: flex;
  flex-direction: column;
}

/* Tabletă+ */
@media (min-width: 768px) {
  .container { padding: 20px; }
  nav ul { flex-direction: row; }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
\`\`\`

## ⚠️ Greșeli frecvente

- **Lipsă \`viewport\` meta** — Adaugă-l mereu
- **Fix \`width: 1200px\`** — \`max-width: 1200px; width: 100%\`
- **Doar mobile sau doar desktop** — Testează ambele

## 🎓 Ce ai învățat
- ✅ \`viewport\` meta — esențial
- ✅ \`@media (min-width: ...)\` queries
- ✅ Mobile-first abordare
- ✅ \`clamp()\` și grid \`auto-fit\` modern
`,
    extraProblems: [
      mc('Meta viewport',
        'Ce trebuie să aibă pagina pentru responsive?',
        ['<meta responsive>', '<meta viewport>', '<meta name="viewport" content="width=device-width">', 'Nimic'],
        '<meta name="viewport" content="width=device-width">',
        'Fără asta, site-ul apare micșorat pe telefon.',
        { topic: 'responsive' }),
      mc('Mobile-first',
        'Ce înseamnă "mobile-first"?',
        ['Doar mobile', 'Stilul DEFAULT e pentru mobil, apoi adaugi pentru ecrane mari', 'Începi cu desktop', 'Doar pentru iPhone'],
        'Stilul DEFAULT e pentru mobil, apoi adaugi pentru ecrane mari',
        'Cu `@media (min-width: ...)`.',
        { topic: 'responsive', difficulty: 'MEDIUM' }),
      sa('Media query',
        'Care e cuvântul cheie CSS pentru queries responsive? (cu @)',
        '@media',
        '`@media (min-width: 768px) { ... }`.',
        { topic: 'responsive' }),
      mc('Grid responsive',
        'Care construcție creează grid responsive FĂRĂ media queries?',
        ['grid-template-columns: 100%', 'repeat(auto-fit, minmax(250px, 1fr))', 'flex: 1', 'width: 50%'],
        'repeat(auto-fit, minmax(250px, 1fr))',
        'Grid-ul își ajustează automat numărul de coloane.',
        { topic: 'responsive', difficulty: 'HARD' }),
    ],
  },

  // ============ 17. unitati-moderne ============
  'unitati-moderne': {
    theory: `# 🆕 Unități CSS moderne

CSS 2025 are **multe** unități noi pentru responsive 🎉.

## 📐 Recap unități clasice

- **\`px\`** — Pixeli
- **\`%\`** — Procentaj din părinte
- **\`em\`** — Relativ la font-size părinte
- **\`rem\`** — Relativ la font-size root
- **\`vw\` / \`vh\`** — 1% din viewport

## 🆕 \`vmin\` și \`vmax\`

\`\`\`css
.square { width: 50vmin; height: 50vmin; }
\`\`\`

- **\`vmin\`** — Min(vw, vh)
- **\`vmax\`** — Max(vw, vh)

> Util pentru forme care trebuie să intre **întotdeauna** pe ecran.

## 🆕 \`svh\`, \`lvh\`, \`dvh\` (mobile-friendly!)

Pe mobil, bara browser-ului poate apărea/dispărea — \`100vh\` are probleme.

- **\`svh\`** — small viewport (cu bare vizibile)
- **\`lvh\`** — large viewport (fără bare)
- **\`dvh\`** — dynamic — se schimbă

\`\`\`css
.fullscreen {
  height: 100dvh;    /* perfect pe mobil */
}
\`\`\`

## 🆕 \`clamp(min, ideal, max)\` — magic!

Setezi mărimi care **se adaptează** automat:

\`\`\`css
font-size: clamp(16px, 4vw, 32px);
/*         min,  ideal, max */
\`\`\`

- Pe mobil: ~16px
- Pe ecrane mari: până la 32px
- Niciodată sub 16 sau peste 32

\`\`\`css
width: clamp(300px, 50%, 800px);
padding: clamp(10px, 3vw, 40px);
\`\`\`

## 🆕 \`min()\` și \`max()\`

\`\`\`css
width: min(100%, 800px);     /* cel mai mic dintre 100% și 800px */
font-size: max(14px, 1vw);   /* cel puțin 14px */
\`\`\`

## 🎯 \`ch\` și \`ex\` — relativ la font

- **\`ch\`** — Lățimea caracterului "0"
- **\`ex\`** — Înălțimea literei "x"

\`\`\`css
p { max-width: 65ch; }    /* cca 65 caractere — bun pentru lectură */
\`\`\`

## 🎯 \`%\` raportat la

- **\`width: 50%\`** — Lățimea părintelui
- **\`height: 50%\`** — Înălțimea părintelui
- **\`padding: 10%\`** — **Lățimea** părintelui (chiar și vertical!)
- **\`margin: 10%\`** — Lățimea părintelui

## 🎯 \`fr\` (Grid)

\`\`\`css
grid-template-columns: 1fr 2fr 1fr;
\`\`\`

\`fr\` = fracțiune din spațiul **disponibil** (după ce ai setat fix).

## 🎨 Bune practici

- **Font-size** — \`rem\` sau \`clamp()\`
- **Padding/margin** — \`rem\` sau \`em\`
- **Container max-width** — \`px\` cu \`max-width\`
- **Lățimi responsive** — \`%\`
- **Hero height** — \`100dvh\`
- **Lățime text lectură** — \`65ch\`

## ⚠️ Greșeli frecvente

- **Folosești doar \`px\`** — Combină cu \`rem\`, \`%\`, \`vw\`
- **\`100vh\` pe mobil** — Folosește \`100dvh\`
- **Lățimi text 100%** — \`max-width: 65ch\`

## 🎓 Ce ai învățat
- ✅ \`vmin\`, \`vmax\` pentru forme
- ✅ \`dvh\` pentru mobile-safe
- ✅ \`clamp()\` magic pentru responsive
- ✅ \`ch\` pentru lățime text optimă
`,
    extraProblems: [
      mc('Mobile fullscreen',
        'Care unitate e cea mai potrivită pentru `height: 100%` pe mobil?',
        ['100vh', '100dvh', '100%', '100em'],
        '100dvh',
        '`dvh` (dynamic viewport height) se ajustează la bara browser-ului.',
        { topic: 'units', difficulty: 'HARD' }),
      mc('Responsive scaling',
        'Care funcție CSS scalează automat între min, ideal, max?',
        ['scale()', 'clamp()', 'minmax()', 'between()'],
        'clamp()',
        '`clamp(16px, 4vw, 32px)` = min, preferat, max.',
        { topic: 'units', difficulty: 'MEDIUM' }),
      sa('Unitate pentru text',
        'Care unitate e bună pentru `max-width` la text de lectură? (2 caractere)',
        'ch',
        '`max-width: 65ch` = ~65 caractere, ideal pentru lectură.',
        { topic: 'units', difficulty: 'MEDIUM' }),
      mc('1fr',
        'Ce înseamnă unitatea `1fr` în Grid?',
        ['1 pixel', '1 fracțiune din spațiul disponibil', '1%', '1em'],
        '1 fracțiune din spațiul disponibil',
        '`fr` împarte spațiul **rămas** după fixed-uri.',
        { topic: 'units' }),
    ],
  },

  // ============ 18. layout-complet ============
  'layout-complet': {
    theory: `# 🏗️ Layout complet — pune totul împreună

Acum combinăm Grid + Flex + Responsive pentru un site complet 🎯.

## 🎯 Layout "Holy Grail"

\`\`\`html
<body>
  <header>Header</header>
  <div class="page">
    <aside class="left">Sidebar</aside>
    <main>Conținut</main>
    <aside class="right">Recomandări</aside>
  </div>
  <footer>Footer</footer>
</body>
\`\`\`

\`\`\`css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header, footer {
  background: #333;
  color: white;
  padding: 20px;
}

.page {
  flex: 1;
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 20px;
  padding: 20px;
}

@media (max-width: 768px) {
  .page {
    grid-template-columns: 1fr;
  }
}
\`\`\`

## 🎯 Card grid responsive

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.card .content {
  padding: 16px;
  flex: 1;       /* push button down */
  display: flex;
  flex-direction: column;
}

.card button {
  margin-top: auto;
}
\`\`\`

## 🎯 Header sticky

\`\`\`css
header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\`\`\`

## 🎯 Hamburger menu mobil

\`\`\`html
<nav class="nav">
  <button class="hamburger">☰</button>
  <ul class="menu">
    <li><a href="/">Acasă</a></li>
    <li><a href="/despre">Despre</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
\`\`\`

\`\`\`css
.hamburger { display: none; }

.menu {
  display: flex;
  gap: 20px;
  list-style: none;
}

@media (max-width: 768px) {
  .hamburger { display: block; }

  .menu {
    display: none;
    flex-direction: column;
  }
  .menu.open { display: flex; }
}
\`\`\`

(JS-ul ar adăuga clasa \`open\` la click pe hamburger.)

## 🎯 Hero section

\`\`\`css
.hero {
  min-height: 80dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: clamp(32px, 6vw, 72px);
  margin-bottom: 16px;
}

.hero p {
  font-size: clamp(16px, 2vw, 20px);
  max-width: 600px;
  margin-bottom: 24px;
}
\`\`\`

## 🎯 Footer cu coloane

\`\`\`css
footer {
  background: #1a1a1a;
  color: white;
  padding: 40px 20px;
}

footer .container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}
\`\`\`

## 🎯 Centrare absolută (modern)

\`\`\`css
.modal {
  position: fixed;
  inset: 0;          /* top: 0; right: 0; bottom: 0; left: 0; */
  display: grid;
  place-items: center;
  background: rgba(0,0,0,0.5);
}
\`\`\`

> \`place-items: center\` = \`align-items: center\` + \`justify-items: center\`

## 🎓 Ce ai învățat
- ✅ Layout complet cu Grid + Flex
- ✅ Header sticky cu z-index
- ✅ Cards grid responsive
- ✅ Mobile-first cu hamburger menu
- ✅ Hero section cu \`clamp()\`
`,
    extraProblems: [
      mc('Body fluid',
        'Cum faci ca footer-ul să stea LA FUND chiar și pe pagini scurte?',
        ['margin-top: auto pe footer', 'body cu flex-direction: column și main cu flex: 1', 'position: fixed pe footer', 'min-height: 200vh'],
        'body cu flex-direction: column și main cu flex: 1',
        '`flex: 1` pe main absoarbe spațiul disponibil.',
        { topic: 'layout', difficulty: 'HARD' }),
      mc('Centrare modernă',
        'Care e cea mai SCURTĂ centrare cu CSS Grid?',
        ['justify-content: center; align-items: center', 'place-items: center', 'center: true', 'margin: auto'],
        'place-items: center',
        '`place-items: center` = align + justify într-o linie.',
        { topic: 'layout', difficulty: 'MEDIUM' }),
      sa('Spațiu între elemente',
        'Care proprietate adaugă spațiu uniform între elemente flex/grid? (3 caractere)',
        'gap',
        '`gap: 20px` — modern, mai bun decât margins.',
        { topic: 'layout' }),
      mc('Inset',
        'Ce înseamnă `inset: 0`?',
        ['margin: 0', 'top: 0; right: 0; bottom: 0; left: 0', 'padding: 0', 'border: 0'],
        'top: 0; right: 0; bottom: 0; left: 0',
        '`inset` e shorthand pentru toate 4 poziții.',
        { topic: 'layout', difficulty: 'HARD' }),
    ],
  },

  // ============ 19. ui-components ============
  'ui-components': {
    theory: `# 🧩 UI Components

Hai să facem **componente reutilizabile** pe care le vei folosi peste tot 🛠️.

## 🔘 Butoane

\`\`\`css
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}
.btn-primary:hover { background: #0056b3; }

.btn-success { background: #28a745; color: white; }
.btn-danger { background: #dc3545; color: white; }

.btn-outline {
  background: transparent;
  border: 2px solid currentColor;
}
\`\`\`

## 🃏 Card

\`\`\`css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
.card-header { padding: 16px; border-bottom: 1px solid #eee; }
.card-body { padding: 20px; }
.card-footer { padding: 16px; background: #f9f9f9; }
\`\`\`

## 🏷️ Badge

\`\`\`css
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;       /* pill shape */
  font-size: 12px;
  font-weight: bold;
}
.badge-success { background: #d4edda; color: #155724; }
.badge-warning { background: #fff3cd; color: #856404; }
.badge-danger { background: #f8d7da; color: #721c24; }
\`\`\`

## ⚠️ Alert

\`\`\`css
.alert {
  padding: 16px 20px;
  border-radius: 8px;
  border-left: 4px solid;
  margin-bottom: 16px;
}
.alert-info {
  background: #e7f3ff;
  border-color: #007bff;
  color: #004085;
}
.alert-warning {
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}
\`\`\`

## 📝 Form input

\`\`\`css
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
}
\`\`\`

## 🪟 Modal

\`\`\`css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}
\`\`\`

## 🍞 Breadcrumbs

\`\`\`css
.breadcrumbs {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #666;
}
.breadcrumbs a { color: #007bff; }
.breadcrumbs li:not(:last-child)::after {
  content: " / ";
  color: #999;
  margin-left: 8px;
}
\`\`\`

## 📊 Progress bar

\`\`\`css
.progress {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #28a745;
  transition: width 0.3s;
}
\`\`\`

\`\`\`html
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
</div>
\`\`\`

## 🌟 Avatar

\`\`\`css
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Butoane cu variante (primary, danger, outline)
- ✅ Cards cu hover lift
- ✅ Badge-uri & alerts
- ✅ Form inputs cu focus styling
- ✅ Modal & progress bar
`,
    extraProblems: [
      mc('Pill shape',
        'Cum creezi forma de "pilulă" (rotunjit complet pe lateral)?',
        ['border-radius: 50%', 'border-radius: 999px', 'shape: pill', 'border-radius: 100'],
        'border-radius: 999px',
        'O valoare mare ca 999px sau 9999px = pilulă.',
        { topic: 'components' }),
      mc('Object-fit',
        'Ce face `object-fit: cover` pe o imagine?',
        ['Mărește imaginea', 'Imaginea umple containerul fără distorsiuni (poate tăia)', 'Centrează', 'Adaugă margin'],
        'Imaginea umple containerul fără distorsiuni (poate tăia)',
        'Perfect pentru avataruri și carduri cu poze.',
        { topic: 'components', difficulty: 'MEDIUM' }),
      sa('Avatar rotund',
        'Care valoare `border-radius` face un avatar perfect rotund? (cu %)',
        '50%',
        '`border-radius: 50%` pe un pătrat = cerc.',
        { topic: 'components' }),
      mc('Focus visible',
        'Cum stilizezi un input când e focusat?',
        ['input.focus', 'input:focus', 'input::focus', 'input.active'],
        'input:focus',
        '`:focus` — pseudo-clasă pentru element focusat.',
        { topic: 'components' }),
    ],
  },

  // ============ 20. mini-proiect-css ============
  'mini-proiect-css': {
    theory: `# 🎯 Mini-proiect: Card Profil

Aplici TOT ce ai învățat în CSS! 🎉

## 📋 Obiectiv

Construim un **card de profil** modern, responsive, cu animații.

## 🛠️ HTML

\`\`\`html
<div class="profile-card">
  <div class="cover"></div>
  <img class="avatar" src="ana.jpg" alt="Ana">
  <h2 class="name">Ana Popescu</h2>
  <p class="role">Frontend Developer</p>

  <div class="stats">
    <div>
      <span class="num">42</span>
      <span class="label">Proiecte</span>
    </div>
    <div>
      <span class="num">1.2k</span>
      <span class="label">Followers</span>
    </div>
    <div>
      <span class="num">5</span>
      <span class="label">Ani</span>
    </div>
  </div>

  <div class="actions">
    <button class="btn btn-primary">Urmărește</button>
    <button class="btn btn-outline">Mesaj</button>
  </div>

  <div class="badges">
    <span class="badge badge-success">Disponibil</span>
    <span class="badge badge-info">PRO</span>
  </div>
</div>
\`\`\`

## 🎨 CSS

\`\`\`css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 20px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 380px;
  overflow: hidden;
  text-align: center;
  position: relative;
  transition: transform 0.3s;
}
.profile-card:hover {
  transform: translateY(-5px);
}

/* Cover banner */
.cover {
  height: 100px;
  background: linear-gradient(45deg, #f093fb, #f5576c);
}

/* Avatar */
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid white;
  margin-top: -50px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Info */
.name {
  margin-top: 12px;
  font-size: 1.5rem;
  color: #333;
}
.role {
  color: #666;
  margin-bottom: 20px;
}

/* Stats */
.stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.stats > div {
  display: flex;
  flex-direction: column;
}
.num {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}
.label {
  font-size: 0.85rem;
  color: #999;
}

/* Buttons */
.actions {
  display: flex;
  gap: 10px;
  padding: 20px;
}
.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background: #667eea;
  color: white;
}
.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-1px);
}
.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}
.btn-outline:hover {
  background: #667eea;
  color: white;
}

/* Badges */
.badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
}
.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: bold;
  background: rgba(255,255,255,0.9);
}
.badge-success { color: #28a745; }
.badge-info { color: #007bff; }

/* Mobile */
@media (max-width: 480px) {
  .profile-card { max-width: 100%; }
}
\`\`\`

## ✅ Tehnici folosite

- [x] **Box model** — padding, margin, border
- [x] **Flexbox** — pentru actions și stats
- [x] **Grid** — pentru centrare body
- [x] **Border-radius** — colțuri rotunjite + cerc avatar
- [x] **Box-shadow** — adâncime
- [x] **Linear-gradient** — fundaluri colorate
- [x] **Transitions** — hover effects
- [x] **Position: absolute** — badges
- [x] **Responsive** — media query
- [x] **Modern units** — \`100dvh\`

## 🎓 Felicitări!

Ai învățat **fundația CSS-ului modern**! Acum poți construi orice site frumos 🚀.

**Următoarea aventură**: JavaScript pentru interactivitate.
`,
    extraProblems: [
      mc('Avatar suprapus',
        'Cum suprapui avatarul peste banner-ul cover (scoți avatarul în sus)?',
        ['top: -50px', 'margin-top: -50px', 'position: top', 'translate: -50px'],
        'margin-top: -50px',
        '`margin-top: -50px` ridică elementul peste cel anterior.',
        { topic: 'project', difficulty: 'MEDIUM' }),
      mc('Buton mărimi egale',
        'Cum faci 2 butoane să aibă lățimi EGALE într-un flex container?',
        ['width: 50%', 'flex: 1 pe ambele', 'margin: auto', 'display: block'],
        'flex: 1 pe ambele',
        '`flex: 1` împarte spațiul egal.',
        { topic: 'project', difficulty: 'MEDIUM' }),
      sa('Reset CSS',
        'Care 3 proprietăți pui în `* { ... }` pentru reset? (separate cu virgulă, fără valori)',
        'margin, padding, box-sizing',
        'Reset clasic: `* { margin: 0; padding: 0; box-sizing: border-box; }`',
        { topic: 'project' }),
      mc('Card hover',
        'Care e EFECTUL "lift" la hover pe carduri?',
        ['background change', 'transform: translateY(-5px) + box-shadow mai mare', 'border', 'opacity'],
        'transform: translateY(-5px) + box-shadow mai mare',
        'Cardul "se ridică" cu translateY negativ + shadow mai mare = iluzie 3D.',
        { topic: 'project', difficulty: 'MEDIUM' }),
    ],
  },

}
