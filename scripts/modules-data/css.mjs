import { mc, sa } from './helpers.mjs'

export const cssModule = {
  slug: 'css-basics',
  title: 'CSS Basics',
  description: 'Învață CSS — designul paginilor web. 20 de lecții complete',
  language: 'css',
  order: 4,
  lessons: [
    {
      slug: 'introducere-css',
      title: '1. Introducere + cum legi CSS',
      isFree: true,
      theory: `# CSS — Designul paginii web

CSS = **Cascading Style Sheets**. Schimbă aspectul HTML.

## 3 moduri de a aplica CSS

### Inline
\`\`\`html
<p style="color: red;">Roșu</p>
\`\`\`

### Internal
\`\`\`html
<style>
    p { color: blue; }
</style>
\`\`\`

### External (recomandat!)
\`\`\`html
<link rel="stylesheet" href="style.css">
\`\`\`

## Sintaxă CSS
\`\`\`css
selector {
    proprietate: valoare;
    proprietate: valoare;
}
\`\`\`

Exemplu:
\`\`\`css
h1 {
    color: blue;
    font-size: 24px;
}
\`\`\`
`,
      problems: [
        mc('Acronim',
          'Ce înseamnă CSS?',
          ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Sheets'],
          'Cascading Style Sheets',
          'CSS = **Cascading** — pentru că regulile se "cascadează" și se moștenesc.',
          { topic: 'css-intro' }),
        mc('Sintaxă',
          'Care e sintaxa corectă?',
          ['p: color = red;', 'p { color: red; }', 'p [color: red]', 'p (color: red)'],
          'p { color: red; }',
          'Selector { proprietate: valoare; }.',
          { topic: 'css-intro' }),
        mc('Recomandat',
          'Care metodă e cea mai recomandată?',
          ['inline', 'internal', 'external', 'JavaScript'],
          'external',
          'External (cu `<link>`) e cel mai mentenabil și performant.',
          { topic: 'css-intro' }),
        mc('Separator',
          'Ce caracter separă proprietatea de valoare?',
          ['=', ':', ';', '.'],
          ':',
          'În CSS, `proprietate: valoare;`.',
          { topic: 'css-intro' }),
        sa('Sfârșit declarație',
          'Cu ce caracter se termină o declarație CSS?',
          ';',
          'Punct și virgulă `;` separă declarațiile.',
          { topic: 'css-intro' }),
      ],
    },
    {
      slug: 'selectori',
      title: '2. Selectori (tag, class, id)',
      isFree: true,
      theory: `# Selectori CSS

## Tag selector
\`\`\`css
p { color: blue; }
h1 { font-size: 30px; }
\`\`\`

## Class selector (.)
\`\`\`html
<p class="rosu">Text</p>
\`\`\`
\`\`\`css
.rosu { color: red; }
\`\`\`

## ID selector (#)
\`\`\`html
<div id="main">...</div>
\`\`\`
\`\`\`css
#main { background: yellow; }
\`\`\`

## Selector universal (*)
\`\`\`css
* { margin: 0; }
\`\`\`

## Multiple
\`\`\`css
h1, h2, h3 { color: black; }
\`\`\`

## Descendent
\`\`\`css
div p { ... }   /* p în div */
div > p { ... } /* p direct copil */
\`\`\`

## Specificitate
inline > id > class > tag
`,
      problems: [
        mc('Class',
          'Cum scrii selectorul pentru class="btn"?',
          ['btn', '.btn', '#btn', '@btn'],
          '.btn',
          'Punctul `.` denotă class.',
          { topic: 'selectors' }),
        mc('ID',
          'Cum scrii selectorul pentru id="main"?',
          ['main', '.main', '#main', '$main'],
          '#main',
          'Diezul `#` denotă ID.',
          { topic: 'selectors' }),
        mc('Universal',
          'Ce selector vizează **toate** elementele?',
          ['all', '*', '#all', '.everything'],
          '*',
          'Asteriscul `*` selectează tot.',
          { topic: 'selectors' }),
        mc('Specificitate',
          'Care are prioritate mai mare?',
          ['tag', 'class', 'id', 'universal'],
          'id',
          'Ordinea: id > class > tag > universal (inline > toate).',
          { topic: 'selectors', difficulty: 'MEDIUM' }),
        sa('Descendent',
          'Cum selectezi `<p>` aflate în `<div>`?',
          'div p',
          'Spațiul `div p` selectează p-uri descendente la orice nivel.',
          { topic: 'selectors', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'culori-background',
      title: '3. Culori + background',
      isFree: false,
      theory: `# Culori în CSS

## color (textul)
\`\`\`css
p { color: red; }
\`\`\`

## background-color
\`\`\`css
div { background-color: yellow; }
\`\`\`

## Format-uri
\`\`\`css
color: red;                /* nume */
color: #ff0000;            /* hex */
color: #f00;               /* hex scurt */
color: rgb(255, 0, 0);     /* RGB */
color: rgba(255,0,0,0.5);  /* cu transparență */
color: hsl(0, 100%, 50%);  /* HSL */
\`\`\`

## Background imagine
\`\`\`css
body {
    background-image: url("bg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
\`\`\`

## Shorthand
\`\`\`css
background: #f00 url("bg.jpg") no-repeat center / cover;
\`\`\`
`,
      problems: [
        mc('Culoare text',
          'Ce proprietate setează culoarea textului?',
          ['text-color', 'color', 'font-color', 'fg-color'],
          'color',
          '`color` se referă la text. `background-color` la fundal.',
          { topic: 'colors' }),
        mc('Hex roșu',
          'Care cod hex e roșu pur?',
          ['#0000ff', '#ff0000', '#00ff00', '#000000'],
          '#ff0000',
          'Format `#RRGGBB`. ff = max roșu, 00 = fără verde, 00 = fără albastru.',
          { topic: 'colors' }),
        mc('RGBA',
          'Ce permite RGBA în plus față de RGB?',
          ['Mai multe culori', 'Transparență (alpha)', 'Animații', 'Nimic'],
          'Transparență (alpha)',
          'Al patrulea parametru (0-1) e opacitatea.',
          { topic: 'colors', difficulty: 'MEDIUM' }),
        mc('Imagine fundal',
          'Ce proprietate setează imagine de fundal?',
          ['background-img', 'background-image', 'bg-image', 'image'],
          'background-image',
          '`background-image: url("...")`.',
          { topic: 'colors' }),
        sa('Hex scurt verde',
          'Cum scrii verde pur în hex scurt (3 caractere)?',
          '#0f0',
          '`#0f0` = `#00ff00` = verde pur.',
          { topic: 'colors', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'text-styling',
      title: '4. Text styling',
      isFree: false,
      theory: `# Stilizare text

## Font
\`\`\`css
p {
    font-family: "Arial", sans-serif;
    font-size: 16px;
    font-weight: bold;        /* normal, bold, 100-900 */
    font-style: italic;
    line-height: 1.5;
}
\`\`\`

## Aliniere
\`\`\`css
text-align: left;     /* center, right, justify */
\`\`\`

## Decorare
\`\`\`css
text-decoration: underline;   /* none, line-through */
text-transform: uppercase;    /* lowercase, capitalize */
letter-spacing: 2px;
word-spacing: 5px;
\`\`\`

## Font web (Google Fonts)
\`\`\`html
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
\`\`\`
\`\`\`css
body { font-family: 'Roboto', sans-serif; }
\`\`\`
`,
      problems: [
        mc('Mărime font',
          'Ce proprietate schimbă mărimea fontului?',
          ['size', 'font-size', 'text-size', 'height'],
          'font-size',
          '`font-size: 16px;` (sau rem, em).',
          { topic: 'text' }),
        mc('Aldin',
          'Pentru text bold:',
          ['font-bold: yes', 'font-weight: bold', 'text-weight: bold', 'bold: true'],
          'font-weight: bold',
          '`font-weight: bold;` (sau 700).',
          { topic: 'text' }),
        mc('Centrat',
          'Cum centrezi text orizontal?',
          ['text-align: center', 'align: center', 'text-center: true', 'center: yes'],
          'text-align: center',
          '`text-align: center;` aliniază textul în interiorul elementului.',
          { topic: 'text' }),
        mc('Underline',
          'Pentru a sublinia text:',
          ['text-style: underline', 'text-decoration: underline', 'underline: true', 'font-decoration: underline'],
          'text-decoration: underline',
          '`text-decoration: underline;`. (`none` o elimină — util pe link-uri.)',
          { topic: 'text', difficulty: 'MEDIUM' }),
        sa('Familie font',
          'Ce proprietate setează tipul de font?',
          'font-family',
          '`font-family: Arial, sans-serif;` — pune mai multe ca fallback.',
          { topic: 'text' }),
      ],
    },
    {
      slug: 'box-model',
      title: '5. Box Model (IMPORTANT!)',
      isFree: false,
      theory: `# Box Model

Fiecare element HTML e un **box** cu 4 zone:

\`\`\`
┌──────────── margin ────────────┐
│  ┌────────── border ──────────┐  │
│  │  ┌──────── padding ──────┐  │  │
│  │  │      content         │  │  │
│  │  └──────────────────────┘  │  │
│  └──────────────────────────────┘  │
└──────────────────────────────────┘
\`\`\`

## Proprietăți
\`\`\`css
.box {
    margin: 20px;       /* spațiu exterior */
    border: 2px solid red;
    padding: 10px;      /* spațiu interior */
    width: 200px;       /* lățimea content */
}
\`\`\`

## Shorthand
\`\`\`css
margin: 10px 20px 30px 40px;  /* sus drepta jos stânga */
margin: 10px 20px;            /* sus/jos = 10, st/dr = 20 */
margin: 10px;                 /* toate */
\`\`\`

## box-sizing (important!)
\`\`\`css
* { box-sizing: border-box; }
\`\`\`
Cu **border-box**, width/height includ padding și border.
`,
      problems: [
        mc('Spațiu exterior',
          'Care proprietate creează spațiu **în afara** elementului?',
          ['padding', 'margin', 'border', 'spacing'],
          'margin',
          '`margin` = spațiu exterior. `padding` = spațiu interior.',
          { topic: 'box-model' }),
        mc('Spațiu interior',
          'Care proprietate creează spațiu **între conținut și border**?',
          ['margin', 'padding', 'gap', 'spacing'],
          'padding',
          '`padding` adaugă spațiu **înăuntrul** chenarului.',
          { topic: 'box-model' }),
        mc('4 valori',
          'Ce înseamnă `margin: 10px 20px 30px 40px`?',
          ['Toate 10px', 'Sus drepta jos stânga', 'Stânga sus dreapta jos', 'Aleator'],
          'Sus drepta jos stânga',
          'Ordinea: top, right, bottom, left (în sens orar).',
          { topic: 'box-model', difficulty: 'MEDIUM' }),
        mc('border-box',
          'Cu `box-sizing: border-box`, ce include `width`?',
          ['Doar content', 'Content + padding + border', 'Content + margin', 'Tot'],
          'Content + padding + border',
          'Mai intuitiv — width-ul total e exact cât scrii.',
          { topic: 'box-model', difficulty: 'HARD' }),
        sa('Border simplu',
          'Cum scrii un border roșu de 2px solid? (proprietate completă)',
          'border: 2px solid red',
          '`border: <lățime> <stil> <culoare>`.',
          { topic: 'box-model', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'dimensiuni',
      title: '6. Dimensiuni (width, height, %)',
      isFree: false,
      theory: `# Dimensiuni

## Unități
- **px** — pixeli (fix)
- **%** — procentual din părinte
- **em** — relativ la font-size
- **rem** — relativ la rădăcină (html)
- **vw** / **vh** — viewport (1vw = 1% din lățimea ecranului)

\`\`\`css
.box {
    width: 200px;     /* fix */
    width: 50%;       /* jumătate din părinte */
    width: 100vw;     /* tot ecranul */
    height: 100vh;    /* înălțimea ecranului */
}
\`\`\`

## min / max
\`\`\`css
.responsive {
    width: 100%;
    max-width: 800px;
    min-width: 200px;
}
\`\`\`

## Auto
\`\`\`css
.center {
    width: 80%;
    margin: 0 auto;   /* centrare orizontală */
}
\`\`\`
`,
      problems: [
        mc('Pixeli',
          'Care unitate e absolută?',
          ['%', 'em', 'rem', 'px'],
          'px',
          '`px` are mărime fixă; restul sunt relative.',
          { topic: 'dimensions' }),
        mc('vh',
          'Ce înseamnă `100vh`?',
          ['100% lățime', '100% înălțime ecran', '100 pixeli', '100 procente părinte'],
          '100% înălțime ecran',
          '`vh` = viewport height. 100vh = înălțimea completă a ecranului.',
          { topic: 'dimensions', difficulty: 'MEDIUM' }),
        mc('rem',
          '`rem` e relativ la:',
          ['Părinte', 'html (rădăcină)', 'body', 'Element curent'],
          'html (rădăcină)',
          '`rem` = root em = relativ la font-size din `<html>`.',
          { topic: 'dimensions', difficulty: 'MEDIUM' }),
        mc('Centrare',
          'Cum centrezi orizontal un element cu lățime fixă?',
          ['text-align: center', 'margin: 0 auto', 'center: true', 'align: center'],
          'margin: 0 auto',
          '`margin: 0 auto` — auto pe stânga și dreapta egalizează spațiul.',
          { topic: 'dimensions', difficulty: 'HARD' }),
        sa('max width',
          'Ce proprietate limitează lățimea maximă?',
          'max-width',
          '`max-width: 800px;` — element nu va depăși 800px.',
          { topic: 'dimensions' }),
      ],
    },
    {
      slug: 'display',
      title: '7. Display (block, inline, inline-block)',
      isFree: false,
      theory: `# display — cum se afișează un element

## block
- Ocupă toată lățimea
- Începe pe linie nouă
- Acceptă width/height
- Ex: \`<div>\`, \`<p>\`, \`<h1>\`

## inline
- Ocupă cât textul
- Stă pe aceeași linie
- **Nu** acceptă width/height
- Ex: \`<span>\`, \`<a>\`, \`<em>\`

## inline-block
- Pe aceeași linie ca inline
- Acceptă width/height (ca block)

## none
- Ascunde elementul complet (nu ocupă spațiu)

\`\`\`css
.ascuns { display: none; }
.invizibil { visibility: hidden; }   /* păstrează spațiul */
\`\`\`

## Schimbarea display-ului
\`\`\`css
span { display: block; }   /* span ocupă toată lățimea */
\`\`\`
`,
      problems: [
        mc('Implicit div',
          'Care e display-ul implicit pentru `<div>`?',
          ['inline', 'block', 'inline-block', 'flex'],
          'block',
          '`<div>` e block — linie nouă, lățime totală.',
          { topic: 'display' }),
        mc('Implicit span',
          'Pentru `<span>`?',
          ['block', 'inline', 'flex', 'grid'],
          'inline',
          '`<span>` e inline — pe aceeași linie cu textul.',
          { topic: 'display' }),
        mc('Ascunde',
          'Pentru a ascunde complet (fără spațiu):',
          ['visibility: hidden', 'display: none', 'opacity: 0', 'hidden: true'],
          'display: none',
          '`display: none` elimină elementul din layout. `visibility: hidden` păstrează spațiul.',
          { topic: 'display', difficulty: 'MEDIUM' }),
        mc('Width pe inline',
          'Inline acceptă width/height?',
          ['Da', 'Nu', 'Doar width', 'Doar height'],
          'Nu',
          'Doar block și inline-block acceptă width/height.',
          { topic: 'display', difficulty: 'MEDIUM' }),
        sa('Vizibil dar fără spațiu',
          'Display ce face elementul invizibil ȘI fără spațiu?',
          'none',
          '`display: none` îl scoate complet din layout.',
          { topic: 'display' }),
      ],
    },
    {
      slug: 'position',
      title: '8. Position (static, relative, absolute, fixed)',
      isFree: false,
      theory: `# position

## static (default)
Normal, în fluxul paginii.

## relative
Față de poziția normală — păstrează spațiul.
\`\`\`css
.box {
    position: relative;
    top: 10px;
    left: 20px;
}
\`\`\`

## absolute
Față de cel mai apropiat părinte cu \`position: relative\`. Iese din flux.
\`\`\`css
.parent { position: relative; }
.child {
    position: absolute;
    top: 0;
    right: 0;
}
\`\`\`

## fixed
Față de **viewport** — rămâne pe ecran la scroll.
\`\`\`css
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
}
\`\`\`

## sticky
Devine fixed când ajunge la limită.
\`\`\`css
.header {
    position: sticky;
    top: 0;
}
\`\`\`

## z-index
Ordinea pe axa Z (cine deasupra cui).
`,
      problems: [
        mc('Default',
          'Care e position implicit?',
          ['relative', 'absolute', 'static', 'fixed'],
          'static',
          'Toate elementele au `position: static` implicit.',
          { topic: 'position' }),
        mc('Iese din flux',
          'Care **iese** din fluxul normal?',
          ['relative', 'absolute', 'static', 'sticky'],
          'absolute',
          '`absolute` și `fixed` ies — celelalte ocupă spațiu normal.',
          { topic: 'position', difficulty: 'MEDIUM' }),
        mc('Rămâne la scroll',
          'Care rămâne pe ecran la scroll?',
          ['relative', 'absolute', 'fixed', 'static'],
          'fixed',
          '`fixed` se ancorează de viewport, indiferent de scroll.',
          { topic: 'position', difficulty: 'MEDIUM' }),
        mc('Părinte absolute',
          'Față de ce se poziționează `absolute`?',
          ['Body mereu', 'Cel mai apropiat părinte non-static', 'html', 'Părintele direct mereu'],
          'Cel mai apropiat părinte non-static',
          'Caută în sus în arbore primul părinte cu position: relative/absolute/fixed.',
          { topic: 'position', difficulty: 'HARD' }),
        sa('Stratificare',
          'Care proprietate controlează ordinea pe axa Z?',
          'z-index',
          '`z-index: 10;` — mai mare = deasupra.',
          { topic: 'position', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'flexbox-intro',
      title: '9. Flexbox (intro)',
      isFree: false,
      theory: `# Flexbox — layout modern

\`\`\`css
.container {
    display: flex;
}
\`\`\`

Toți copiii devin **flex items**, aliniate orizontal.

## justify-content (axa principală)
- \`flex-start\` (default)
- \`center\`
- \`flex-end\`
- \`space-between\` — spațiu între
- \`space-around\` — spațiu egal
- \`space-evenly\`

## align-items (axa secundară)
- \`stretch\` (default)
- \`center\`
- \`flex-start\` / \`flex-end\`

\`\`\`css
.container {
    display: flex;
    justify-content: center;   /* centrează orizontal */
    align-items: center;       /* centrează vertical */
    height: 100vh;
}
\`\`\`

**🎉 Truc**: Cu Flexbox, **centrare verticală + orizontală** se face în 3 linii!
`,
      problems: [
        mc('Activează flex',
          'Cum activezi flexbox pe un container?',
          ['flex: true', 'display: flex', 'layout: flex', 'use-flex: yes'],
          'display: flex',
          '`display: flex` face elementul flex container.',
          { topic: 'flexbox' }),
        mc('Centrare orizontală',
          'Pe axa principală (orizontală implicit), ce centrează?',
          ['align-items: center', 'justify-content: center', 'text-align: center', 'center: true'],
          'justify-content: center',
          '`justify-content` controlează axa principală.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
        mc('Centrare verticală',
          'Pe axa secundară (verticală implicit):',
          ['justify-content', 'align-items', 'vertical-align', 'align-self'],
          'align-items',
          '`align-items` controlează axa perpendiculară pe principala.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
        mc('Spațiu între',
          'Pentru spațiu **egal între** elemente:',
          ['space-between', 'space-around', 'space-equal', 'gap-between'],
          'space-between',
          '`space-between` distribuie tot spațiul disponibil între elemente.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
        sa('Centrare totală',
          'Care e a doua proprietate (după justify-content: center) pentru centrare totală?',
          'align-items: center',
          'Combinația `justify-content: center` + `align-items: center` centrează pe ambele axe.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'flexbox-avansat',
      title: '10. Flexbox (avansat)',
      isFree: false,
      theory: `# Flexbox avansat

## flex-direction
\`\`\`css
.c {
    display: flex;
    flex-direction: row;            /* default - orizontal */
    flex-direction: column;         /* vertical */
    flex-direction: row-reverse;
    flex-direction: column-reverse;
}
\`\`\`

⚠️ Cu \`column\`, axele se inversează — \`justify-content\` devine vertical!

## flex-wrap
\`\`\`css
flex-wrap: wrap;    /* trece pe rând nou când nu mai încape */
\`\`\`

## gap
\`\`\`css
gap: 20px;   /* spațiu între flex items */
\`\`\`

## flex (pe item)
\`\`\`css
.item {
    flex: 1;          /* ocupă spațiu egal */
    flex: 2;          /* ocupă dublu */
    flex: 0 0 200px;  /* fix 200px */
}
\`\`\`

## order
\`\`\`css
.item { order: 1; }   /* schimbă ordinea vizuală */
\`\`\`
`,
      problems: [
        mc('Vertical',
          'Pentru a aranja items pe verticală:',
          ['flex-direction: vertical', 'flex-direction: column', 'flex: vertical', 'orient: vertical'],
          'flex-direction: column',
          '`column` aranjează vertical (axa principală e verticală).',
          { topic: 'flexbox' }),
        mc('Wrap',
          'Pentru a permite trecerea pe rând nou:',
          ['flex-wrap: wrap', 'flex-overflow: wrap', 'wrap: true', 'multiline: yes'],
          'flex-wrap: wrap',
          'Implicit `nowrap` — totul rămâne pe un singur rând.',
          { topic: 'flexbox' }),
        mc('Spațiu',
          'Cea mai modernă proprietate pentru spațiu între items:',
          ['margin', 'padding', 'gap', 'spacing'],
          'gap',
          '`gap: 20px` — mai curat decât marginile.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
        mc('Egal',
          'Pentru ca toate items să ocupe spațiu egal:',
          ['width: 100%', 'flex: 1', 'equal: true', 'auto: true'],
          'flex: 1',
          'Toate items cu `flex: 1` împart spațiul egal.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
        sa('Direcție inversă',
          'Pentru a inversa ordinea pe orizontală:',
          'row-reverse',
          '`flex-direction: row-reverse;` inversează ordinea elementelor.',
          { topic: 'flexbox', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'grid-intro',
      title: '11. Grid (intro)',
      isFree: false,
      theory: `# CSS Grid — layout 2D

\`\`\`css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;   /* 3 coloane egale */
    grid-template-rows: auto;
    gap: 20px;
}
\`\`\`

## fr (fraction)
\`1fr\` = 1 fracție din spațiul disponibil.

\`\`\`css
grid-template-columns: 1fr 2fr 1fr;   /* 25%, 50%, 25% */
\`\`\`

## repeat()
\`\`\`css
grid-template-columns: repeat(4, 1fr);   /* 4 coloane egale */
\`\`\`

## auto-fit / auto-fill
\`\`\`css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
\`\`\`
**Magic**: layout responsive automat!

## Plasare items
\`\`\`css
.item {
    grid-column: 1 / 3;   /* de la coloana 1 la 3 */
    grid-row: 2 / 4;
}
\`\`\`
`,
      problems: [
        mc('Activare grid',
          'Cum activezi grid?',
          ['display: grid', 'grid: true', 'layout: grid', 'use-grid: yes'],
          'display: grid',
          '`display: grid` activează CSS Grid.',
          { topic: 'grid' }),
        mc('fr',
          'Ce înseamnă `1fr`?',
          ['1 frame', '1 fracție din spațiul disponibil', '1 pixel', '1 procent'],
          '1 fracție din spațiul disponibil',
          '`fr` = fraction. Spațiul disponibil se împarte în fracții.',
          { topic: 'grid' }),
        mc('3 coloane egale',
          'Cum creezi 3 coloane egale?',
          [
            'grid-template-columns: 33% 33% 33%',
            'grid-template-columns: repeat(3, 1fr)',
            'columns: 3',
            'col-count: 3',
          ],
          'grid-template-columns: repeat(3, 1fr)',
          '`repeat(n, 1fr)` e modul curat de a defini coloane egale.',
          { topic: 'grid', difficulty: 'MEDIUM' }),
        mc('Spațiu',
          'Pentru spațiu între celule:',
          ['margin', 'gap', 'spacing', 'cell-gap'],
          'gap',
          '`gap` (sau `grid-gap`) controlează spațiul între celule.',
          { topic: 'grid' }),
        sa('Responsive',
          'Care funcție permite layout responsive automat (auto-...)?',
          'auto-fit',
          '`repeat(auto-fit, minmax(200px, 1fr))` adaptează numărul de coloane.',
          { topic: 'grid', difficulty: 'HARD' }),
      ],
    },
    {
      slug: 'grid-avansat',
      title: '12. Grid (avansat)',
      isFree: false,
      theory: `# Grid avansat

## grid-template-areas
\`\`\`css
.layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

## span
\`\`\`css
.big-cell {
    grid-column: span 2;   /* ocupă 2 coloane */
    grid-row: span 3;
}
\`\`\`

## Explicit positioning
\`\`\`css
.item {
    grid-column-start: 2;
    grid-column-end: 4;
    /* sau scurtat: */
    grid-column: 2 / 4;
}
\`\`\`

## Aliniere
\`\`\`css
.container {
    justify-items: center;   /* axa orizontală */
    align-items: center;     /* axa verticală */
}
\`\`\`
`,
      problems: [
        mc('grid-area',
          'La ce servește `grid-template-areas`?',
          ['Numește celule', 'Definește layout vizual cu nume', 'Setează gap', 'Sortează grid-ul'],
          'Definește layout vizual cu nume',
          'Permite o "hartă" vizuală a layoutului folosind nume.',
          { topic: 'grid', difficulty: 'HARD' }),
        mc('span',
          'Ce face `grid-column: span 3`?',
          ['Sare 3 coloane', 'Ocupă 3 coloane', 'Pornește de la coloana 3', 'Mergi la coloana 3'],
          'Ocupă 3 coloane',
          '`span N` extinde celula peste N coloane.',
          { topic: 'grid', difficulty: 'MEDIUM' }),
        mc('column 2/4',
          'Ce face `grid-column: 2 / 4`?',
          ['Coloana 2 și 4', 'De la linia 2 la 4 (ocupă 2 coloane)', 'Coloana 2/4', 'Eroare'],
          'De la linia 2 la 4 (ocupă 2 coloane)',
          'Liniile grid-ului se numără; 2 → 4 înseamnă 2 coloane.',
          { topic: 'grid', difficulty: 'HARD' }),
        mc('Centrare items',
          'Pentru a centra fiecare item în celula sa:',
          ['justify-content', 'justify-items', 'text-align', 'center: true'],
          'justify-items',
          '`justify-items` aliniază items în interiorul celulelor (axa orizontală).',
          { topic: 'grid', difficulty: 'HARD' }),
        sa('Atribuire zonă',
          'Pe item, ce proprietate îl atribuie unei zone numite?',
          'grid-area',
          '`grid-area: header;` plasează item-ul în zona "header".',
          { topic: 'grid', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'border-shadow',
      title: '13. Border + shadow',
      isFree: false,
      theory: `# Border și Shadow

## border
\`\`\`css
.box {
    border: 2px solid red;
    border-top: 1px dashed blue;
    border-radius: 10px;       /* colțuri rotunjite */
    border-radius: 50%;        /* cerc */
}
\`\`\`

## Stiluri border
- \`solid\`, \`dashed\`, \`dotted\`, \`double\`, \`none\`

## box-shadow
\`\`\`css
box-shadow: 5px 5px 10px rgba(0,0,0,0.3);
/*          x   y   blur  culoare        */
\`\`\`

## Multiple shadows
\`\`\`css
box-shadow:
    0 4px 6px rgba(0,0,0,0.1),
    0 1px 3px rgba(0,0,0,0.08);
\`\`\`

## text-shadow
\`\`\`css
text-shadow: 2px 2px 4px black;
\`\`\`

## Cerc perfect
\`\`\`css
.cerc {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: red;
}
\`\`\`
`,
      problems: [
        mc('Colțuri rotunjite',
          'Ce proprietate face colțurile rotunjite?',
          ['corner-radius', 'border-radius', 'corner', 'edge'],
          'border-radius',
          '`border-radius: 10px` rotunjește colțurile.',
          { topic: 'border' }),
        mc('Cerc',
          'Pentru a face un cerc dintr-un pătrat:',
          ['border-radius: 100%', 'border-radius: 50%', 'shape: circle', 'circle: true'],
          'border-radius: 50%',
          '`50%` produce cerc perfect (când lățimea = înălțimea).',
          { topic: 'border', difficulty: 'MEDIUM' }),
        mc('Shadow',
          'Care proprietate adaugă umbră unui element?',
          ['shadow', 'box-shadow', 'element-shadow', 'drop-shadow'],
          'box-shadow',
          '`box-shadow: x y blur culoare;`.',
          { topic: 'border' }),
        mc('Border stil',
          'Care valoare creează linie întreruptă?',
          ['solid', 'dashed', 'broken', 'gap'],
          'dashed',
          '`dashed` produce linie cu liniuțe; `dotted` cu puncte.',
          { topic: 'border', difficulty: 'MEDIUM' }),
        sa('Umbră text',
          'Care proprietate adaugă umbră textului?',
          'text-shadow',
          '`text-shadow: 2px 2px 4px black;` adaugă umbră textului.',
          { topic: 'border', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'hover-efecte',
      title: '14. Hover + efecte',
      isFree: false,
      theory: `# Pseudo-classes (:hover etc.)

## :hover
\`\`\`css
button:hover {
    background-color: blue;
    color: white;
}
\`\`\`

## Alte pseudo-classes
- \`:hover\` — la mouse over
- \`:active\` — la apăsare
- \`:focus\` — când e focusat (input)
- \`:visited\` — link vizitat
- \`:first-child\` / \`:last-child\`
- \`:nth-child(2)\` / \`:nth-child(odd)\`

\`\`\`css
li:nth-child(odd) { background: #eee; }
\`\`\`

## Cursor
\`\`\`css
button {
    cursor: pointer;   /* mâna */
}
\`\`\`

## Disabled state
\`\`\`css
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
\`\`\`
`,
      problems: [
        mc('La mouse over',
          'Ce pseudo-class se activează la mouse over?',
          [':mouseover', ':hover', ':over', ':enter'],
          ':hover',
          '`:hover` se aplică când mouse-ul e deasupra elementului.',
          { topic: 'pseudo' }),
        mc('Focus',
          'Pentru un input focused:',
          [':focused', ':focus', ':active', ':select'],
          ':focus',
          '`:focus` — când input/buton are focus (Tab sau click).',
          { topic: 'pseudo' }),
        mc('Cursor pointer',
          'Pentru a arăta mâna de click:',
          ['cursor: hand', 'cursor: pointer', 'cursor: click', 'mouse: hand'],
          'cursor: pointer',
          '`cursor: pointer` afișează mâna (clasic la link-uri/butoane).',
          { topic: 'pseudo' }),
        mc('Linii alternante',
          'Pentru rânduri impare colorate:',
          [':odd', ':nth-child(odd)', ':alternate', ':even'],
          ':nth-child(odd)',
          '`:nth-child(odd)` selectează 1, 3, 5...',
          { topic: 'pseudo', difficulty: 'HARD' }),
        sa('Activ',
          'Pseudo-class pentru când butonul e apăsat:',
          ':active',
          '`:active` — pe durata apăsării (mouse down).',
          { topic: 'pseudo', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'transitions',
      title: '15. Transitions (animații simple)',
      isFree: false,
      theory: `# Transitions — animații lin

\`\`\`css
.btn {
    background: blue;
    transition: background 0.3s ease;
}

.btn:hover {
    background: red;   /* tranziția se face lin */
}
\`\`\`

## Sintaxă
\`transition: <property> <duration> <timing-function> <delay>\`

## Exemple
\`\`\`css
transition: all 0.3s ease;
transition: opacity 0.5s linear;
transition: transform 0.2s ease-in-out 0.1s;
\`\`\`

## Timing functions
- \`linear\`
- \`ease\` (default)
- \`ease-in\`, \`ease-out\`, \`ease-in-out\`
- \`cubic-bezier(...)\`

## Multiple proprietăți
\`\`\`css
transition: background 0.3s ease, transform 0.2s linear;
\`\`\`

## Transform (rotire, scalare)
\`\`\`css
.card:hover {
    transform: scale(1.1) rotate(5deg);
}
\`\`\`
`,
      problems: [
        mc('Transition',
          'Ce face `transition`?',
          ['Schimbă instant', 'Animă schimbarea unei proprietăți', 'Mută elementul', 'Sortează'],
          'Animă schimbarea unei proprietăți',
          'Tranzițiile fac trecerea între stări să fie lină.',
          { topic: 'transitions' }),
        mc('Toate',
          'Pentru a anima toate proprietățile:',
          ['transition: all 0.3s', 'transition: any 0.3s', 'transition: every', 'transition: full'],
          'transition: all 0.3s',
          '`all` afectează toate proprietățile care se schimbă.',
          { topic: 'transitions', difficulty: 'MEDIUM' }),
        mc('Scalare',
          'Care transform mărește un element la 110%?',
          ['scale(1.1)', 'zoom(1.1)', 'size(1.1)', 'expand(1.1)'],
          'scale(1.1)',
          '`transform: scale(1.1)` mărește 10%.',
          { topic: 'transitions', difficulty: 'MEDIUM' }),
        mc('Rotire',
          'Pentru rotire 45 grade:',
          ['rotate(45)', 'rotate(45deg)', 'spin(45)', 'turn(45)'],
          'rotate(45deg)',
          '`transform: rotate(45deg)` rotește 45°.',
          { topic: 'transitions', difficulty: 'MEDIUM' }),
        sa('Timing default',
          'Care e timing-function implicit?',
          'ease',
          '`ease` e default — pornire lentă, accelerare, încetinire.',
          { topic: 'transitions' }),
      ],
    },
    {
      slug: 'responsive',
      title: '16. Responsive design (@media)',
      isFree: false,
      theory: `# Responsive design

## Media queries
\`\`\`css
/* Stil normal (desktop) */
.container { padding: 40px; }

/* Mobile */
@media (max-width: 768px) {
    .container { padding: 10px; }
}
\`\`\`

## Breakpoints comune
\`\`\`css
/* Mobile */
@media (max-width: 600px) { ... }

/* Tablet */
@media (min-width: 601px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
\`\`\`

## Mobile-first approach
Începe cu mobile, apoi adaugă pentru desktop:
\`\`\`css
.text { font-size: 14px; }

@media (min-width: 768px) {
    .text { font-size: 18px; }
}
\`\`\`

## Viewport meta (HTML!)
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`
**Fără asta**, pe mobile pagina apare zoomed-out.
`,
      problems: [
        mc('Sub 600px',
          'Cum scrii media query pentru ecrane sub 600px?',
          [
            '@media max-width: 600px { ... }',
            '@media (max-width: 600px) { ... }',
            '@if (width < 600px) { ... }',
            '@responsive 600px { ... }',
          ],
          '@media (max-width: 600px) { ... }',
          'Sintaxa: `@media (max-width: 600px) { ... }`.',
          { topic: 'responsive', difficulty: 'MEDIUM' }),
        mc('Mobile-first',
          'Mobile-first înseamnă:',
          ['Doar pentru mobile', 'CSS de bază pt mobile, apoi adaugi pt desktop', 'Începe cu desktop', 'Folosești doar telefon'],
          'CSS de bază pt mobile, apoi adaugi pt desktop',
          'E o abordare modernă — pornești de la cel mai mic ecran și adaugi pentru cele mari.',
          { topic: 'responsive', difficulty: 'MEDIUM' }),
        mc('Viewport meta',
          'Fără `<meta name="viewport">`:',
          ['Nimic', 'Pagina apare zoomed-out pe mobile', 'CSS nu funcționează', 'Eroare 404'],
          'Pagina apare zoomed-out pe mobile',
          'Browserul mobile va afișa pagina la dimensiune desktop scalată.',
          { topic: 'responsive', difficulty: 'MEDIUM' }),
        mc('Tablet range',
          'Pentru tablet (601-1024px):',
          [
            '@media (601-1024px)',
            '@media (min-width: 601px) and (max-width: 1024px)',
            '@media tablet',
            '@between 601 1024',
          ],
          '@media (min-width: 601px) and (max-width: 1024px)',
          'Combinăm `min-width` și `max-width` cu `and`.',
          { topic: 'responsive', difficulty: 'HARD' }),
        sa('At-rule',
          'Cu ce simbol începe o regulă media?',
          '@',
          '`@media`, `@import`, `@keyframes` — toate sunt at-rules.',
          { topic: 'responsive' }),
      ],
    },
    {
      slug: 'unitati-moderne',
      title: '17. Unități moderne (rem, vw, vh)',
      isFree: false,
      theory: `# Unități moderne

## rem (root em)
Relativ la \`<html>\` font-size (default 16px).
\`\`\`css
html { font-size: 16px; }
.text { font-size: 1.5rem; }   /* 24px */
.box  { padding: 2rem; }       /* 32px */
\`\`\`

**De ce rem?** Schimbi 1 valoare în html și **tot site-ul** scalează.

## em
Relativ la **părinte**. Atenție — se înmulțește cascade!

## vw / vh
\`\`\`css
.hero {
    height: 100vh;     /* tot ecranul */
    font-size: 5vw;    /* 5% din lățime */
}
\`\`\`

## clamp() (modern!)
\`\`\`css
font-size: clamp(16px, 4vw, 32px);
/* min, ideal, max */
\`\`\`

## % (procent)
\`\`\`css
.col { width: 50%; }   /* relativ la părinte */
\`\`\`
`,
      problems: [
        mc('rem relativ',
          '`rem` e relativ la:',
          ['Părinte', 'html (rădăcină)', 'body', 'Element curent'],
          'html (rădăcină)',
          'r din "rem" = root → relativ la html.',
          { topic: 'units' }),
        mc('em relativ',
          '`em` e relativ la:',
          ['html', 'Părinte', 'Element curent', 'Viewport'],
          'Părinte',
          '`em` e relativ la font-size-ul părintelui — poate cascada problematic.',
          { topic: 'units', difficulty: 'MEDIUM' }),
        mc('Înălțime ecran',
          'Pentru o secțiune care ocupă tot ecranul:',
          ['100%', '100vh', 'screen', 'full'],
          '100vh',
          '`100vh` = 100% din viewport height.',
          { topic: 'units', difficulty: 'MEDIUM' }),
        mc('clamp()',
          'Ce face `clamp(16px, 4vw, 32px)`?',
          ['Întotdeauna 4vw', 'Min 16, ideal 4vw, max 32', 'Maxim 16px', 'Doar pentru fonts'],
          'Min 16, ideal 4vw, max 32',
          '`clamp` ține valoarea între limite — perfect pentru responsive.',
          { topic: 'units', difficulty: 'HARD' }),
        sa('Procent ecran lățime',
          'Care unitate e 1% din lățimea ecranului?',
          'vw',
          '`1vw` = 1% din viewport width. `vh` pentru height.',
          { topic: 'units' }),
      ],
    },
    {
      slug: 'layout-complet',
      title: '18. Layout complet (flex + grid)',
      isFree: false,
      theory: `# Layout combinat

## Strategie practică
- **Grid** pentru layout principal (coloane, regiuni)
- **Flex** pentru aliniere internă (butoane, navbar)

\`\`\`html
<div class="page">
    <header class="navbar">
        <div class="logo">Logo</div>
        <nav>
            <a>Acasă</a>
            <a>Despre</a>
        </nav>
    </header>
    <main class="grid">
        <article>...</article>
        <aside>...</aside>
    </main>
</div>
\`\`\`

\`\`\`css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.grid {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 2rem;
    padding: 2rem;
}

@media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
}
\`\`\`

## Sticky footer
\`\`\`css
.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.main { flex: 1; }
\`\`\`
`,
      problems: [
        mc('Layout principal',
          'Pentru layout 2D principal (coloane + rânduri):',
          ['Flex', 'Grid', 'Float', 'Tabel'],
          'Grid',
          'Grid e ideal pentru 2D. Flex pentru 1D.',
          { topic: 'layout', difficulty: 'MEDIUM' }),
        mc('Aliniere navbar',
          'Pentru un navbar cu logo stânga și meniu dreapta:',
          ['display: grid; columns: 2', 'display: flex; justify-content: space-between', 'display: block', 'float: left/right'],
          'display: flex; justify-content: space-between',
          'Flex e perfect pentru distribuirea pe 1 axă.',
          { topic: 'layout', difficulty: 'MEDIUM' }),
        mc('Sticky footer',
          'Pentru footer mereu jos pe ecran (chiar dacă conținut puțin):',
          ['position: fixed', 'flex column + flex:1 pe main', 'margin-top: auto', 'absolute bottom'],
          'flex column + flex:1 pe main',
          'Pagina flex column + main flex:1 împinge footer-ul jos.',
          { topic: 'layout', difficulty: 'HARD' }),
        mc('Combinare',
          'Cea mai bună abordare modernă:',
          ['Doar grid', 'Doar flex', 'Grid pentru layout, flex pentru aliniere', 'Float'],
          'Grid pentru layout, flex pentru aliniere',
          'Combinația oferă maximă flexibilitate.',
          { topic: 'layout', difficulty: 'MEDIUM' }),
        sa('1fr',
          'Pentru 4 coloane egale cu grid:',
          'repeat(4, 1fr)',
          '`grid-template-columns: repeat(4, 1fr)`.',
          { topic: 'layout', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'ui-components',
      title: '19. UI components (buton, card, navbar)',
      isFree: false,
      theory: `# Componente UI clasice

## Buton modern
\`\`\`css
.btn {
    background: #3b82f6;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.btn:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
\`\`\`

## Card
\`\`\`css
.card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: box-shadow 0.2s;
}

.card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
\`\`\`

## Navbar
\`\`\`css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.navbar a {
    color: #333;
    text-decoration: none;
    margin-left: 1.5rem;
    font-weight: 500;
}

.navbar a:hover { color: #3b82f6; }
\`\`\`
`,
      problems: [
        mc('Cursor pe buton',
          'Pentru a arăta mâna pe buton:',
          ['cursor: hand', 'cursor: pointer', 'cursor: button', 'cursor: click'],
          'cursor: pointer',
          '`cursor: pointer` afișează mâna.',
          { topic: 'ui' }),
        mc('Eliminare bord buton',
          'Pentru a elimina bordura implicită a butoanelor:',
          ['border: none', 'border: 0', 'no-border: true', 'a și b'],
          'a și b',
          'Atât `border: none` cât și `border: 0` funcționează (toate sunt 0).',
          { topic: 'ui', difficulty: 'MEDIUM' }),
        mc('Translate hover',
          'Pentru efect "lift" la hover:',
          ['transform: translateY(-2px)', 'margin-top: -2px', 'top: -2px', 'lift: true'],
          'transform: translateY(-2px)',
          '`translateY(-2px)` ridică elementul cu 2px (cu transition pentru animație).',
          { topic: 'ui', difficulty: 'HARD' }),
        mc('Card subtle shadow',
          'Pentru o umbră subtilă pe card:',
          ['box-shadow: 10px 10px 50px black', 'box-shadow: 0 1px 3px rgba(0,0,0,0.1)', 'shadow: small', 'border: 1px gray'],
          'box-shadow: 0 1px 3px rgba(0,0,0,0.1)',
          'Umbră modernă: offset mic, blur mic, opacitate redusă.',
          { topic: 'ui', difficulty: 'MEDIUM' }),
        sa('Eliminare underline link',
          'Cum elimini sublinierea de pe link?',
          'text-decoration: none',
          '`text-decoration: none;` elimină underline-ul implicit.',
          { topic: 'ui' }),
      ],
    },
    {
      slug: 'mini-proiect-css',
      title: '20. Mini proiect — pagină stilizată',
      isFree: false,
      theory: `# Mini proiect: pagină completă

Construiește o pagină landing cu:
1. **Navbar** sticky (flex)
2. **Hero section** centrat (flex, vh)
3. **3 cards** în grid responsive
4. **Footer** cu social

\`\`\`html
<header class="navbar">
    <div>Logo</div>
    <nav>
        <a>Acasă</a> <a>Despre</a> <a>Contact</a>
    </nav>
</header>

<section class="hero">
    <h1>Titlu mare</h1>
    <p>Subtitlu</p>
    <button class="btn">Începe!</button>
</section>

<section class="cards">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</section>

<footer>...</footer>
\`\`\`

\`\`\`css
* { box-sizing: border-box; margin: 0; padding: 0; }

.navbar {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: white;
}

.hero {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 4rem 2rem;
}

.card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
    .navbar { padding: 0.5rem 1rem; }
    .hero { height: 60vh; }
}
\`\`\`

Acum construiește-o tu de la zero!
`,
      problems: [
        mc('Sticky navbar',
          'Pentru navbar care rămâne sus la scroll:',
          ['position: fixed', 'position: sticky; top: 0', 'position: absolute', 'fixed: top'],
          'position: sticky; top: 0',
          'Sticky e mai modern — devine fixed când ajunge la limită.',
          { topic: 'project', difficulty: 'MEDIUM' }),
        mc('Centrare hero',
          'Pentru a centra conținutul vertical + orizontal:',
          [
            'text-align: center',
            'display: flex; justify-content: center; align-items: center',
            'margin: auto',
            'position: center',
          ],
          'display: flex; justify-content: center; align-items: center',
          'Combinația flexbox e perfectă pentru centrare totală.',
          { topic: 'project', difficulty: 'MEDIUM' }),
        mc('Cards responsive',
          'Pentru cards care se adaptează automat:',
          [
            'grid-template-columns: 1fr 1fr 1fr',
            'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
            'flex-wrap: wrap',
            'columns: auto',
          ],
          'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
          '`auto-fit` schimbă numărul de coloane automat în funcție de spațiu.',
          { topic: 'project', difficulty: 'HARD' }),
        mc('Reset CSS',
          'Pentru a elimina marginile/padding-ul implicit al browserului:',
          ['* { margin: 0; padding: 0; }', '* { reset: true; }', 'reset();', 'normalize: true;'],
          '* { margin: 0; padding: 0; }',
          'Reset CSS — folosit în mai toate proiectele moderne (sau Normalize.css).',
          { topic: 'project' }),
        sa('Gradient',
          'Care funcție creează un gradient de fundal?',
          'linear-gradient',
          '`background: linear-gradient(135deg, #667eea, #764ba2);`.',
          { topic: 'project', difficulty: 'MEDIUM' }),
      ],
    },
  ],
}
