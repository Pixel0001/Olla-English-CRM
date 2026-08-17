// HTML enriched — toate cele 20 de lecții
// Stil prietenos pentru elevi 9-10 ani

import { mc, sa } from './helpers.mjs'

export const htmlEnriched = {

  // ============ 1. introducere-structura ============
  'introducere-structura': {
    theory: `# 🌐 Bun venit în HTML!

## Ce este HTML?

**HTML** = **H**yper**T**ext **M**arkup **L**anguage. Este "**scheletul**" oricărui site web 🦴.

Imaginează-ți un site ca o casă:
- 🦴 **HTML** = scheletul (pereți, uși, ferestre)
- 🎨 **CSS** = vopseaua și mobila
- ⚡ **JavaScript** = lumina, butoanele, mecanismele

## Structura unei pagini HTML

\`\`\`html
<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8">
    <title>Pagina mea</title>
  </head>
  <body>
    <h1>Salut, lume!</h1>
    <p>Acesta e primul meu site.</p>
  </body>
</html>
\`\`\`

## 🧩 Ce înseamnă fiecare parte?

- **\`<!DOCTYPE html>\`** — "Folosesc HTML5" — întotdeauna pe prima linie
- **\`<html>\`** — Începutul și sfârșitul paginii
- **\`<head>\`** — **Informații** despre pagină (nu apar pe ecran)
- **\`<title>\`** — Numele afișat în tab-ul browserului
- **\`<meta charset>\`** — Permite litere cu diacritice (ă, î, ș)
- **\`<body>\`** — **Conținutul** vizibil

## 🏷️ Ce e un tag?

Un **tag** e o etichetă scrisă cu \`<\` și \`>\`:

\`\`\`html
<p>Paragraf</p>
\`\`\`

- \`<p>\` = tag de **deschidere**
- \`</p>\` = tag de **închidere** (cu \`/\`)
- \`Paragraf\` = conținutul

## 🎯 Ierarhie (părinți & copii)

\`\`\`html
<body>           ← părinte
  <h1>Titlu</h1>   ← copil
  <p>Text</p>     ← copil
</body>
\`\`\`

## ⚠️ Greșeli frecvente

- **\`<p>text\` (uitat închidere)** — \`<p>text</p>\`
- **\`<P>\` cu majuscule (vechi)** — \`<p>\` cu minuscule
- **Nu pui \`<!DOCTYPE html>\`** — Pune-l mereu pe prima linie

## 🎓 Ce ai învățat
- ✅ HTML = scheletul site-ului
- ✅ Structura: doctype + html + head + body
- ✅ Tag-uri cu deschidere și închidere
- ✅ Ierarhie părinte / copil
`,
    extraProblems: [
      mc('Ce înseamnă HTML',
        'Ce înseamnă acronimul "HTML"?',
        ['Hyper Tool Markup Language', 'HyperText Markup Language', 'High Text Mark Lang', 'Home Tool Modern Lang'],
        'HyperText Markup Language',
        'HTML = HyperText Markup Language — limbajul de marcare al webului.',
        { topic: 'html-basics' }),
      mc('Doctype',
        'Pe ce linie scrii `<!DOCTYPE html>`?',
        ['Ultima', 'Prima — chiar înainte de <html>', 'În head', 'În body'],
        'Prima — chiar înainte de <html>',
        '`<!DOCTYPE html>` declară versiunea HTML și trebuie să fie prima linie.',
        { topic: 'html-basics' }),
      sa('Conținut vizibil',
        'În ce tag pui conținutul **vizibil** al paginii?',
        'body',
        '`<body>` conține tot ce apare pe ecran.',
        { topic: 'html-basics' }),
      mc('Diacritice',
        'Ce permite literele cu diacritice (ă, î, ș)?',
        ['<title>', '<meta charset="UTF-8">', '<lang="ro">', '<diacritice>'],
        '<meta charset="UTF-8">',
        '`<meta charset="UTF-8">` declară codificarea care suportă toate caracterele.',
        { topic: 'html-basics' }),
    ],
  },

  // ============ 2. tag-uri-baza ============
  'tag-uri-baza': {
    theory: `# 🏷️ Tag-uri de bază

Hai să descoperim cele mai importante tag-uri pentru text 📝.

## 📌 Titluri: \`<h1>\` până \`<h6>\`

\`\`\`html
<h1>Cel mai mare titlu</h1>
<h2>Subtitlu</h2>
<h3>Sub-subtitlu</h3>
<h4>...</h4>
<h5>...</h5>
<h6>Cel mai mic</h6>
\`\`\`

> 💡 **Folosește un singur \`<h1>\` pe pagină** (titlul principal).

## 📝 Paragrafe: \`<p>\`

\`\`\`html
<p>Acesta e un paragraf de text. Browser-ul îl afișează cu un mic spațiu deasupra și dedesubt.</p>
\`\`\`

## ↩️ Linie nouă: \`<br>\`

\`\`\`html
<p>Prima linie<br>A doua linie</p>
\`\`\`

> 💡 \`<br>\` e un tag **gol** — nu are închidere!

## ➖ Linie orizontală: \`<hr>\`

\`\`\`html
<p>Înainte</p>
<hr>
<p>După</p>
\`\`\`

## 💪 Text bold și italic

\`\`\`html
<b>Bold (vizual)</b>
<strong>Bold (cu importanță semantică)</strong>
<i>Italic (vizual)</i>
<em>Italic (accentuat semantic)</em>
\`\`\`

> 💡 Preferă \`<strong>\` și \`<em>\` — au sens pentru cititoare ecran și SEO!

## 💬 Comentarii

\`\`\`html
<!-- Acesta e un comentariu, nu apare pe pagină -->
\`\`\`

## 🎯 Exemplu complet

\`\`\`html
<h1>Despre mine</h1>
<p>Mă numesc <strong>Ana</strong> și am <em>11 ani</em>.</p>
<hr>
<h2>Hobby-uri</h2>
<p>Îmi place să citesc<br>și să cânt la pian.</p>
\`\`\`

## ⚠️ Greșeli frecvente

- **Mai mulți \`<h1>\`** — Doar unul pe pagină
- **\`<br />\` (XHTML vechi)** — \`<br>\` (HTML5)
- **Folosești \`<b>\` peste tot** — Folosește \`<strong>\` pentru sens

## 🎓 Ce ai învățat
- ✅ Titluri \`<h1>\` - \`<h6>\`
- ✅ Paragrafe \`<p>\`
- ✅ \`<br>\` linie nouă, \`<hr>\` linie orizontală
- ✅ \`<strong>\` & \`<em>\` mai bune decât \`<b>\` & \`<i>\`
`,
    extraProblems: [
      mc('Cel mai mare titlu',
        'Care tag e cel mai mare titlu?',
        ['<h6>', '<h1>', '<title>', '<head>'],
        '<h1>',
        '`<h1>` e cel mai mare; `<h6>` cel mai mic.',
        { topic: 'tags' }),
      mc('Linie nouă',
        'Ce tag forțează linie nouă fără paragraf?',
        ['<p>', '<br>', '<hr>', '<new>'],
        '<br>',
        '`<br>` e tag de break (linie nouă).',
        { topic: 'tags' }),
      sa('Bold semantic',
        'Ce tag e mai bun decât `<b>` pentru bold (cu sens)?',
        'strong',
        '`<strong>` e bold semantic — recunoscut de cititoare ecran.',
        { topic: 'tags' }),
      mc('Comentariu HTML',
        'Cum scrii un comentariu HTML?',
        ['// comentariu', '/* comentariu */', '<!-- comentariu -->', '# comentariu'],
        '<!-- comentariu -->',
        'HTML folosește `<!-- ... -->` pentru comentarii.',
        { topic: 'tags' }),
    ],
  },

  // ============ 3. text-formatting ============
  'text-formatting': {
    theory: `# ✍️ Formatare text

HTML are tag-uri pentru orice fel de text 📚.

## 💪 Importanță

- **\`<strong>\`** — Foarte important (bold)
- **\`<em>\`** — Accentuat (italic)
- **\`<mark>\`** — Evidențiat (cu galben)
- **\`<small>\`** — Text mai mic
- **\`<del>\`** — Tăiat (șters)
- **\`<ins>\`** — Subliniat (adăugat)

\`\`\`html
<p>
  <strong>Important!</strong>
  <em>Accentuat</em>
  <mark>Evidențiat</mark>
  <small>Mărunt</small>
  <del>Anulat</del>
  <ins>Nou</ins>
</p>
\`\`\`

## 🔢 Sus / jos

\`\`\`html
H<sub>2</sub>O      <!-- subscript -->
2<sup>10</sup>      <!-- superscript -->
\`\`\`
**Output:** H₂O, 2¹⁰

## 💻 Cod în text

\`\`\`html
<p>Folosește <code>print()</code> pentru afișare.</p>
<pre>
def salut():
    print("Salut")
</pre>
\`\`\`

- **\`<code>\`** — Cod inline (în mijloc de propoziție)
- **\`<pre>\`** — Cod multi-linie (păstrează spațiile)
- **\`<kbd>\`** — Tastă apăsată: \`<kbd>Ctrl</kbd>\`
- **\`<samp>\`** — Exemplu output

## 💬 Citate

\`\`\`html
<blockquote>
  Acesta e un citat lung.
</blockquote>

<p>Profesorul a spus <q>să învățăm bine</q>.</p>
\`\`\`

- **\`<blockquote>\`** — Citat lung (paragraf)
- **\`<q>\`** — Citat scurt (în text) — adaugă automat ghilimele

## 🎯 Adresă

\`\`\`html
<address>
  Email: contact@scoala.ro<br>
  Tel: 0700-000-000
</address>
\`\`\`

## ⚠️ Greșeli frecvente

- **\`<b>\` peste tot** — \`<strong>\` pentru sens
- **Spații multiple în text** — \`<pre>\` păstrează spațiile

## 🎓 Ce ai învățat
- ✅ Tag-uri semantice pentru importanță
- ✅ Subscript / superscript
- ✅ Cod cu \`<code>\` și \`<pre>\`
- ✅ Citate cu \`<blockquote>\` și \`<q>\`
`,
    extraProblems: [
      mc('Evidențiere galbenă',
        'Care tag evidențiază text cu fundal galben?',
        ['<highlight>', '<mark>', '<yellow>', '<bg>'],
        '<mark>',
        '`<mark>` e tag-ul HTML5 pentru evidențiere.',
        { topic: 'text' }),
      mc('Cod multi-linie',
        'Care tag PĂSTREAZĂ spațiile și liniile noi pentru cod?',
        ['<code>', '<pre>', '<text>', '<line>'],
        '<pre>',
        '`<pre>` (preformatted) păstrează totul exact.',
        { topic: 'text', difficulty: 'MEDIUM' }),
      sa('Subscript',
        'Ce tag pentru subscript (cifră dedesubt, ca H_2_O)?',
        'sub',
        '`<sub>` afișează text mai jos. `<sup>` mai sus.',
        { topic: 'text' }),
      mc('Citat lung',
        'Care tag e pentru un citat lung (paragraf separat)?',
        ['<q>', '<blockquote>', '<cite>', '<quote>'],
        '<blockquote>',
        '`<blockquote>` pentru citate lungi; `<q>` pentru cele scurte inline.',
        { topic: 'text' }),
    ],
  },

  // ============ 4. link-uri ============
  'link-uri': {
    theory: `# 🔗 Link-uri (\`<a>\`)

Link-urile sunt **podurile** dintre pagini 🌉.

## 🎯 Sintaxa de bază

\`\`\`html
<a href="https://google.com">Mergi la Google</a>
\`\`\`

- \`<a>\` = tag-ul "anchor" (ancoră)
- \`href\` = atributul cu **adresa** (HyperReference)
- Textul dintre tag-uri = ce vede userul

## 📁 Tipuri de link-uri

### 1. Externe (alt site)
\`\`\`html
<a href="https://wikipedia.org">Wikipedia</a>
\`\`\`

### 2. Interne (alta pagină din site)
\`\`\`html
<a href="despre.html">Despre noi</a>
<a href="/contact">Contact</a>
\`\`\`

### 3. Email
\`\`\`html
<a href="mailto:contact@site.ro">Trimite email</a>
\`\`\`

### 4. Telefon
\`\`\`html
<a href="tel:+40700000000">Sună-ne</a>
\`\`\`

### 5. Ancoră (sare în pagină)
\`\`\`html
<a href="#sectiune2">Sari la secțiunea 2</a>
...
<h2 id="sectiune2">Secțiunea 2</h2>
\`\`\`

## 🎯 Atribute utile

### Deschide în tab nou: \`target="_blank"\`
\`\`\`html
<a href="https://google.com" target="_blank">Google</a>
\`\`\`

> ⚠️ Adaugă \`rel="noopener"\` pentru securitate când folosești \`target="_blank"\`:
\`\`\`html
<a href="..." target="_blank" rel="noopener">Link</a>
\`\`\`

### Descărcare: \`download\`
\`\`\`html
<a href="document.pdf" download>Descarcă PDF</a>
\`\`\`

### Titlu (tooltip): \`title\`
\`\`\`html
<a href="..." title="Pagina principală Google">Google</a>
\`\`\`

## 🎯 Link-uri în imagini

\`\`\`html
<a href="https://google.com">
  <img src="logo.png" alt="Logo Google">
</a>
\`\`\`

## ⚠️ Greșeli frecvente

- **\`<a>Click</a>\` (fără href)** — \`<a href="...">Click</a>\`
- **"Click aici" ca text** — Text descriptiv: "Vezi raportul anual"
- **Lipsă \`rel="noopener"\` la _blank** — Adaugă-l mereu

## 🎓 Ce ai învățat
- ✅ \`<a href="...">text</a>\`
- ✅ Link-uri externe, interne, email, telefon, ancoră
- ✅ \`target="_blank"\` cu \`rel="noopener"\`
- ✅ Text descriptiv, nu "click aici"
`,
    extraProblems: [
      mc('Atribut adresa',
        'Ce atribut conține adresa link-ului?',
        ['src', 'href', 'link', 'url'],
        'href',
        '`href` = HyperReference (adresa).',
        { topic: 'links' }),
      mc('Tab nou',
        'Cum deschizi link-ul în tab nou?',
        ['target="new"', 'target="_blank"', 'open="new"', 'window="new"'],
        'target="_blank"',
        '`target="_blank"` deschide într-un tab nou.',
        { topic: 'links' }),
      sa('Link email',
        'Ce prefix folosești în href pentru un link de email?',
        'mailto:',
        '`href="mailto:adresa@x.ro"` deschide aplicația de email.',
        { topic: 'links', difficulty: 'MEDIUM' }),
      mc('Link ancoră',
        'Cum sari la elementul cu `id="sus"` din aceeași pagină?',
        ['<a href="sus">', '<a href="#sus">', '<a href="@sus">', '<a id="sus">'],
        '<a href="#sus">',
        'Diezul `#` indică o ancoră în aceeași pagină.',
        { topic: 'links' }),
    ],
  },

  // ============ 5. imagini ============
  'imagini': {
    theory: `# 🖼️ Imagini

Imaginile aduc viață paginilor! 🎨

## 🎯 Tag-ul \`<img>\`

\`\`\`html
<img src="poza.jpg" alt="Descriere poză">
\`\`\`

> 💡 \`<img>\` e tag **gol** — nu are închidere!

## 🏷️ Atribute principale

- **\`src\`** — Adresa imaginii (obligatoriu!)
- **\`alt\`** — Text alternativ (foarte important!)
- **\`width\`** — Lățime (px)
- **\`height\`** — Înălțime (px)
- **\`title\`** — Tooltip la hover
- **\`loading="lazy"\`** — Încarcă doar când e nevoie

\`\`\`html
<img src="cat.jpg" alt="Pisică portocalie" width="300" loading="lazy">
\`\`\`

## ❓ De ce \`alt\` e CRUCIAL?

1. **Accesibilitate** — cititoarele de ecran citesc \`alt\` orbilor
2. **Imagine ratată** — dacă nu se încarcă, apare textul alt
3. **SEO** — Google citește alt-ul

\`\`\`html
<!-- Bun -->
<img src="dog.jpg" alt="Câine Labrador galben jucându-se cu o minge roșie">

<!-- Rău -->
<img src="dog.jpg" alt="poza">
<img src="dog.jpg" alt="">  <!-- doar pentru imagini decorative -->
\`\`\`

## 📁 Căi pentru \`src\`

\`\`\`html
<!-- URL extern -->
<img src="https://site.com/poza.jpg" alt="...">

<!-- Relativ — în același folder -->
<img src="poza.jpg" alt="...">

<!-- În subfolder -->
<img src="poze/poza.jpg" alt="...">

<!-- Cale absolută în site -->
<img src="/poze/poza.jpg" alt="...">
\`\`\`

## 📐 Dimensiuni — bună practică

\`\`\`html
<!-- Setează width ȘI height pentru a evita "săritul" paginii -->
<img src="poza.jpg" alt="..." width="800" height="600">
\`\`\`

## 🎯 Imagini responsive

\`\`\`html
<picture>
  <source media="(max-width: 600px)" srcset="mic.jpg">
  <source media="(min-width: 601px)" srcset="mare.jpg">
  <img src="default.jpg" alt="...">
</picture>
\`\`\`

## 🎯 Format-uri de imagine

- **\`.jpg\` / \`.jpeg\`** — Fotografii
- **\`.png\`** — Imagini cu transparență
- **\`.gif\`** — Animații simple
- **\`.svg\`** — Iconițe, logo-uri (vector)
- **\`.webp\`** — Modern, mai mic

## ⚠️ Greșeli frecvente

- **Fără \`alt\`** — Adaugă mereu \`alt\`
- **Imagine 5MB pentru thumbnail** — Optimizează dimensiunea
- **Setezi doar \`width\`** — Setează și \`height\` (evită layout shift)

## 🎓 Ce ai învățat
- ✅ \`<img src="..." alt="...">\`
- ✅ \`alt\` e obligatoriu
- ✅ Format-uri diferite pentru scopuri diferite
- ✅ \`loading="lazy"\` pentru performanță
`,
    extraProblems: [
      mc('Atribut imagine',
        'Care atribut conține adresa imaginii?',
        ['href', 'src', 'url', 'link'],
        'src',
        '`src` (source) = adresa imaginii.',
        { topic: 'images' }),
      mc('Importanța alt',
        'De ce e atributul `alt` important?',
        ['Decorativ', 'Pentru cititoare ecran (orbi), SEO și fallback', 'Setează lățimea', 'Nu e important'],
        'Pentru cititoare ecran (orbi), SEO și fallback',
        '`alt` e accesibilitate — esențial pentru orbi și SEO.',
        { topic: 'images', difficulty: 'MEDIUM' }),
      sa('Tag imagine',
        'Care tag HTML afișează o imagine?',
        'img',
        '`<img>` — tag gol (fără închidere).',
        { topic: 'images' }),
      mc('Lazy loading',
        'Ce face `loading="lazy"`?',
        ['Încarcă imaginea încet', 'Încarcă imaginea doar când utilizatorul ajunge aproape', 'Nu încarcă deloc', 'Încarcă în alt tab'],
        'Încarcă imaginea doar când utilizatorul ajunge aproape',
        '`loading="lazy"` amână încărcarea — economisește date.',
        { topic: 'images' }),
    ],
  },

  // ============ 6. liste ============
  'liste': {
    theory: `# 📋 Liste în HTML

HTML are 3 tipuri de liste 📑.

## 🔘 Liste neordonate: \`<ul>\` (puncte)

\`\`\`html
<ul>
  <li>Mere</li>
  <li>Banane</li>
  <li>Kiwi</li>
</ul>
\`\`\`

**Output:**
- Mere
- Banane
- Kiwi

## 🔢 Liste ordonate: \`<ol>\` (numere)

\`\`\`html
<ol>
  <li>Pune apă</li>
  <li>Adaugă cafea</li>
  <li>Pune să fiarbă</li>
</ol>
\`\`\`

**Output:**
1. Pune apă
2. Adaugă cafea
3. Pune să fiarbă

## 🎨 Atribute pentru \`<ol>\`

\`\`\`html
<ol start="5">       <!-- începe de la 5 -->
<ol type="A">        <!-- A, B, C -->
<ol type="i">        <!-- i, ii, iii -->
<ol reversed>        <!-- numărătoare inversă -->
\`\`\`

- **\`1\` (default)** — 1, 2, 3
- **\`A\`** — A, B, C
- **\`a\`** — a, b, c
- **\`I\`** — I, II, III
- **\`i\`** — i, ii, iii

## 📚 Liste de descrieri: \`<dl>\`

Pentru perechi termen-definiție:

\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>Limbaj de marcare pentru web</dd>

  <dt>CSS</dt>
  <dd>Limbaj pentru stiluri</dd>
</dl>
\`\`\`

- **\`<dl>\`** — description list
- **\`<dt>\`** — term (termen)
- **\`<dd>\`** — definition (definiție)

## 🪆 Liste imbricate

\`\`\`html
<ul>
  <li>Fructe
    <ul>
      <li>Mere</li>
      <li>Banane</li>
    </ul>
  </li>
  <li>Legume
    <ul>
      <li>Roșii</li>
      <li>Castraveți</li>
    </ul>
  </li>
</ul>
\`\`\`

## ⚠️ Greșeli frecvente

- **\`<li>\` în afara \`<ul>\` / \`<ol>\`** — Mereu în interiorul lor
- **\`<ul><li>1</li><li>2</li></ul>\` într-o linie** — OK dar mai greu de citit

## 🎓 Ce ai învățat
- ✅ \`<ul>\` neordonate (puncte)
- ✅ \`<ol>\` ordonate (numere)
- ✅ \`<dl>\` descrieri
- ✅ Liste imbricate
`,
    extraProblems: [
      mc('Listă cu numere',
        'Care tag creează listă cu **numere**?',
        ['<ul>', '<ol>', '<list>', '<num>'],
        '<ol>',
        '`<ol>` = ordered list (cu numere).',
        { topic: 'lists' }),
      mc('Element listă',
        'Care tag e pentru fiecare element din listă?',
        ['<item>', '<li>', '<element>', '<el>'],
        '<li>',
        '`<li>` = list item.',
        { topic: 'lists' }),
      sa('Type letre mari',
        'Ce valoare a atributului `type` afișează litere MARI (A, B, C)?',
        'A',
        '`<ol type="A">` afișează A, B, C; `type="a"` afișează a, b, c.',
        { topic: 'lists' }),
      mc('Imbricare',
        'Cum faci o listă în interiorul altei liste?',
        ['Pui <ul> direct lângă <li>', 'Pui <ul> înăuntrul <li>', 'Nu se poate', 'Folosești <sublist>'],
        'Pui <ul> înăuntrul <li>',
        'Lista interioară e plasată în interiorul unui `<li>` din lista exterioară.',
        { topic: 'lists', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 7. div-span ============
  'div-span': {
    theory: `# 📦 \`<div>\` și \`<span>\` — containere

Aceste 2 tag-uri NU au înțeles propriu — sunt **cutii goale** pe care le folosim ca să grupăm sau să stilizăm 🗃️.

## 🟦 \`<div>\` — bloc

- Ocupă **toată lățimea** disponibilă
- Începe pe **linie nouă**
- Folosit pentru **secțiuni mari** (header, sidebar, articole)

\`\`\`html
<div class="card">
  <h2>Titlu</h2>
  <p>Conținut...</p>
</div>
\`\`\`

## 🟩 \`<span>\` — inline

- Ia **doar cât e nevoie**
- Stă **în text**, nu pe linie nouă
- Folosit pentru a stiliza o **bucată mică** de text

\`\`\`html
<p>Acesta e text normal cu o <span class="rosu">parte colorată</span> în el.</p>
\`\`\`

## 📊 Comparație vizuală

- ****Tip**** — \`<div>\`: Bloc • \`<span>\`: Inline
- ****Lățime**** — \`<div>\`: Tot rândul • \`<span>\`: Cât e nevoie
- ****Linie nouă**** — \`<div>\`: Da • \`<span>\`: Nu
- ****Folosit pentru**** — \`<div>\`: Layout • \`<span>\`: Stilizare text

## 🎯 Exemplu

\`\`\`html
<div class="alert">
  ⚠️ Atenție! Întâlnire la <span class="ora">15:00</span>
</div>
\`\`\`

## 🎨 \`class\` și \`id\`

\`\`\`html
<div class="card" id="card-1">...</div>
<div class="card" id="card-2">...</div>
\`\`\`

- **\`class\`** — Poate fi pe **multe** elemente (e o etichetă)
- **\`id\`** — **Unic** pe pagină (un singur element)

> 💡 Ulterior CSS-ul va folosi \`.card\` (clase) sau \`#card-1\` (id).

## 🧱 Cazuri tipice de \`<div>\`

\`\`\`html
<div class="header">...</div>
<div class="sidebar">...</div>
<div class="content">
  <div class="article">...</div>
  <div class="article">...</div>
</div>
<div class="footer">...</div>
\`\`\`

> 💡 Modern: e mai bine să folosim tag-uri **semantice** (\`<header>\`, \`<aside>\`, \`<article>\`, \`<footer>\`) când au sens specific. \`<div>\` rămâne pentru grupuri "neutre".

## ⚠️ Greșeli frecvente

- **\`<div>\` în mijloc de paragraf (rupe linia)** — Folosește \`<span>\`
- **Mai multe elemente cu același \`id\`** — Fiecare \`id\` trebuie unic
- **\`<span>\` ca bloc** — Folosește \`<div>\`

## 🎓 Ce ai învățat
- ✅ \`<div>\` = bloc, ocupă tot rândul
- ✅ \`<span>\` = inline, doar text
- ✅ \`class\` (multe) vs \`id\` (unic)
- ✅ Folosite pentru stilizare cu CSS
`,
    extraProblems: [
      mc('div vs span',
        'Care e DIFERENȚA principală între `<div>` și `<span>`?',
        ['Niciuna', '`<div>` e bloc (linie nouă), `<span>` e inline (în linie)', '`<span>` e mai mare', '`<div>` e mai vechi'],
        '`<div>` e bloc (linie nouă), `<span>` e inline (în linie)',
        '`<div>` rupe linia; `<span>` curge în text.',
        { topic: 'containers' }),
      mc('id unic',
        'Câte elemente pot avea același `id` pe pagină?',
        ['Câte vrei', 'Doar unul', 'Maxim 2', 'Maxim 5'],
        'Doar unul',
        '`id` trebuie să fie UNIC pe pagină.',
        { topic: 'containers', difficulty: 'MEDIUM' }),
      sa('Pentru text mic',
        'Care tag (div sau span) folosești pentru a colora doar un cuvânt din mijlocul textului?',
        'span',
        '`<span>` e perfect — nu rupe linia.',
        { topic: 'containers' }),
      mc('class multiple',
        'Câte elemente pot avea aceeași clasă?',
        ['Doar unul', 'Maxim 10', 'Câte vrei', 'Maxim 2'],
        'Câte vrei',
        'Clasele pot fi reutilizate; id-urile NU.',
        { topic: 'containers' }),
    ],
  },

  // ============ 8. atribute ============
  'atribute': {
    theory: `# 🏷️ Atribute HTML

Un **atribut** = o **opțiune** dată unui tag, ca un buton de setări ⚙️.

## 🎯 Sintaxa

\`\`\`html
<tag atribut="valoare">conținut</tag>
\`\`\`

Exemplu real:
\`\`\`html
<a href="https://google.com" target="_blank" title="Google">Caută</a>
\`\`\`

## 🌐 Atribute globale (orice tag le poate avea)

- **\`id\`** — Identificator unic
- **\`class\`** — Etichetă (pentru CSS/JS)
- **\`style\`** — CSS direct (de evitat)
- **\`title\`** — Tooltip la hover
- **\`lang\`** — Limba ("ro", "en")
- **\`hidden\`** — Ascunde elementul
- **\`data-*\`** — Date personalizate

\`\`\`html
<p id="intro" class="big" title="Salut!" lang="ro">Bună ziua!</p>
\`\`\`

## 🎯 Atribute specifice unui tag

- **\`<a>\`** — \`href\`, \`target\`, \`download\`, \`rel\`
- **\`<img>\`** — \`src\`, \`alt\`, \`width\`, \`height\`
- **\`<input>\`** — \`type\`, \`name\`, \`value\`, \`placeholder\`
- **\`<button>\`** — \`type\`, \`disabled\`

## 🎯 Atribute booleene

Sunt fie **prezente** (true), fie absente (false). Nu au valoare:

\`\`\`html
<input type="text" required>            <!-- prezent = true -->
<button disabled>Click</button>
<input type="checkbox" checked>
\`\`\`

## 🎯 Atribute personalizate \`data-*\`

Pentru a păstra date suplimentare:

\`\`\`html
<button data-id="42" data-tip="primar">Click</button>
\`\`\`

În JavaScript:
\`\`\`javascript
btn.dataset.id    // "42"
btn.dataset.tip   // "primar"
\`\`\`

## ⚠️ Reguli importante

1. **Numele** atributului — minuscule (\`href\`, nu \`HREF\`)
2. **Valorile** — în ghilimele (\`"valoare"\`)
3. Atributele booleene **nu au valoare**

## ⚠️ Greșeli frecvente

- **\`<a href=https://...>\`** — \`<a href="https://...">\`
- **\`<input required="true">\`** — \`<input required>\`
- **\`HREF\`** — \`href\` (minuscule)

## 🎓 Ce ai învățat
- ✅ Atribute = opțiuni pentru tag-uri
- ✅ Globale vs specifice
- ✅ Atribute booleene (fără valoare)
- ✅ \`data-*\` pentru date custom
`,
    extraProblems: [
      mc('Atribut global',
        'Care atribut e disponibil pe **orice** tag?',
        ['href', 'src', 'class', 'value'],
        'class',
        '`class` e atribut global — funcționează pe orice element.',
        { topic: 'attributes' }),
      mc('Boolean',
        'Cum scrii corect un atribut boolean (ex: required)?',
        ['required="true"', 'required="false"', 'required', 'required=1'],
        'required',
        'Atributele booleene se scriu doar prin prezență.',
        { topic: 'attributes', difficulty: 'MEDIUM' }),
      sa('Custom data',
        'Care prefix folosești pentru atribute personalizate? (cu *)',
        'data-',
        '`data-orice` permite date custom accesibile prin `el.dataset`.',
        { topic: 'attributes', difficulty: 'MEDIUM' }),
      mc('Tooltip',
        'Care atribut afișează un tooltip la hover?',
        ['tooltip', 'title', 'hover', 'desc'],
        'title',
        '`title="..."` afișează un mic tooltip.',
        { topic: 'attributes' }),
    ],
  },

  // ============ 9. tabele ============
  'tabele': {
    theory: `# 📊 Tabele

Tabelele sunt pentru **date organizate în rânduri și coloane** 📋.

## 🎯 Structura de bază

\`\`\`html
<table>
  <thead>
    <tr>
      <th>Nume</th>
      <th>Vârstă</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ana</td>
      <td>11</td>
    </tr>
    <tr>
      <td>Bogdan</td>
      <td>10</td>
    </tr>
  </tbody>
</table>
\`\`\`

## 🧩 Tag-uri principale

- **\`<table>\`** — tabel întreg
- **\`<thead>\`** — secțiunea cap (titluri)
- **\`<tbody>\`** — secțiunea de date
- **\`<tfoot>\`** — secțiunea de jos (sume etc.)
- **\`<tr>\`** — rând (table row)
- **\`<th>\`** — celulă de titlu (bold, centrat)
- **\`<td>\`** — celulă de date (table data)
- **\`<caption>\`** — titlul tabelului

## 🎯 Cu \`<caption>\`

\`\`\`html
<table>
  <caption>Note la matematică</caption>
  ...
</table>
\`\`\`

## 🔀 Celule combinate

### \`colspan\` — celula se întinde pe **mai multe coloane**
\`\`\`html
<tr>
  <th colspan="2">Date personale</th>
</tr>
<tr>
  <td>Ana</td>
  <td>11 ani</td>
</tr>
\`\`\`

### \`rowspan\` — celula ocupă **mai multe rânduri**
\`\`\`html
<tr>
  <th rowspan="2">Săptămâna 1</th>
  <td>Luni</td>
</tr>
<tr>
  <td>Marți</td>
</tr>
\`\`\`

## 🎯 Exemplu complet

\`\`\`html
<table>
  <caption>Programa zilnică</caption>
  <thead>
    <tr>
      <th>Oră</th>
      <th>Activitate</th>
      <th>Loc</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>9:00</td>
      <td>Matematică</td>
      <td>Sala 12</td>
    </tr>
    <tr>
      <td>10:00</td>
      <td>Română</td>
      <td>Sala 5</td>
    </tr>
  </tbody>
</table>
\`\`\`

## ⚠️ Atenție

- **NU folosi tabele pentru layout!** (era anii '90). Folosește CSS Grid/Flexbox.
- Tabelele sunt **doar pentru date tabelare** (note, programe, statistici).

## ⚠️ Greșeli frecvente

- **\`<td>\` în afara \`<tr>\`** — Mereu în interiorul \`<tr>\`
- **Folosești tabele pentru layout** — Folosește CSS Grid
- **Uiți \`<thead>\` și \`<tbody>\`** — Bună practică

## 🎓 Ce ai învățat
- ✅ Structura: \`<table> > <tr> > <th>/<td>\`
- ✅ \`<thead>\`, \`<tbody>\`, \`<tfoot>\`
- ✅ \`colspan\` și \`rowspan\`
- ✅ Tabele = doar pentru date
`,
    extraProblems: [
      mc('Tag rând',
        'Care tag definește un rând în tabel?',
        ['<row>', '<tr>', '<line>', '<td>'],
        '<tr>',
        '`<tr>` = table row.',
        { topic: 'tables' }),
      mc('Celula titlu',
        'Care tag pentru o celulă **de titlu** (bold, centrat automat)?',
        ['<td>', '<th>', '<title>', '<head>'],
        '<th>',
        '`<th>` = table header — bold și centrat by default.',
        { topic: 'tables' }),
      sa('Mai multe coloane',
        'Ce atribut combină celule pe mai multe **coloane**?',
        'colspan',
        '`colspan="3"` întinde celula pe 3 coloane.',
        { topic: 'tables', difficulty: 'MEDIUM' }),
      mc('Tabele pentru layout',
        'E OK să folosești tabele pentru aranjarea paginii?',
        ['Da, e cea mai bună metodă', 'Nu, folosește CSS Grid sau Flexbox', 'Doar pentru meniu', 'Doar mobil'],
        'Nu, folosește CSS Grid sau Flexbox',
        'Tabelele sunt DOAR pentru date. Pentru layout există CSS modern.',
        { topic: 'tables' }),
    ],
  },

  // ============ 10. formulare-intro ============
  'formulare-intro': {
    theory: `# 📝 Formulare — introducere

Formularele permit utilizatorilor să **trimită date** (înregistrare, contact, login) ✉️.

## 🎯 Structura de bază

\`\`\`html
<form action="/submit" method="POST">
  <label for="nume">Nume:</label>
  <input type="text" id="nume" name="nume">

  <button type="submit">Trimite</button>
</form>
\`\`\`

## 🧩 Tag-uri principale

- **\`<form>\`** — container — toate input-urile
- **\`<input>\`** — câmp de date
- **\`<label>\`** — etichetă pentru un câmp
- **\`<button>\`** — buton de trimitere
- **\`<textarea>\`** — text lung
- **\`<select>\` / \`<option>\`** — dropdown

## 🎯 Atribute pe \`<form>\`

- **\`action\`** — URL unde se trimit datele
- **\`method\`** — \`GET\` (în URL) sau \`POST\` (ascuns)

## 🏷️ Atribute pe \`<input>\`

- **\`type\`** — text, email, password, number, etc.
- **\`name\`** — Numele câmpului (cum e trimis)
- **\`id\`** — Pentru \`<label for="...">\`
- **\`value\`** — Valoare implicită
- **\`placeholder\`** — Text "fantomă" în câmp
- **\`required\`** — Obligatoriu

\`\`\`html
<input type="email" name="email" id="email" placeholder="exemplu@site.ro" required>
\`\`\`

## 🎯 \`<label>\` — IMPORTANT

\`\`\`html
<label for="user">Username:</label>
<input type="text" id="user" name="user">
\`\`\`

> 💡 \`<label for="...">\` trebuie să corespundă cu \`<input id="...">\` — face câmpul **clickabil prin etichetă** și ajută la accesibilitate.

## 🎯 \`<textarea>\` pentru text lung

\`\`\`html
<label for="msg">Mesaj:</label>
<textarea id="msg" name="msg" rows="4" cols="40"></textarea>
\`\`\`

## 🎯 \`<select>\` — dropdown

\`\`\`html
<label for="culoare">Culoare:</label>
<select id="culoare" name="culoare">
  <option value="rosu">Roșu</option>
  <option value="verde">Verde</option>
  <option value="albastru" selected>Albastru</option>
</select>
\`\`\`

## 🎯 \`<button>\` — tipuri

\`\`\`html
<button type="submit">Trimite</button>
<button type="reset">Resetează</button>
<button type="button">Click</button>     <!-- nu trimite -->
\`\`\`

## ⚠️ Greșeli frecvente

- **Uiți \`name\` pe input** — Fără \`name\` valoarea NU se trimite
- **\`<label>\` fără \`for\`** — Adaugă \`for="id-input"\`
- **\`<button>\` în afara \`<form>\`** — E OK dar nu trimite formular

## 🎓 Ce ai învățat
- ✅ \`<form>\` cu \`action\` și \`method\`
- ✅ \`<input>\` cu multe tipuri
- ✅ \`<label>\` legat prin \`for\`/\`id\`
- ✅ \`<textarea>\`, \`<select>\`, \`<button>\`
`,
    extraProblems: [
      mc('Container form',
        'Care tag conține toate input-urile unui formular?',
        ['<input>', '<form>', '<container>', '<fields>'],
        '<form>',
        '`<form>` grupează toate câmpurile.',
        { topic: 'forms' }),
      mc('Etichetă',
        'Care tag etichetează un câmp (face textul clickabil)?',
        ['<text>', '<label>', '<title>', '<name>'],
        '<label>',
        '`<label for="id">` etichetează un câmp.',
        { topic: 'forms' }),
      sa('Atribut obligatoriu',
        'Ce atribut face un input obligatoriu?',
        'required',
        '`required` (boolean) — formularul nu se trimite fără el.',
        { topic: 'forms' }),
      mc('Buton trimitere',
        'Ce `type` trebuie un buton ca să trimită formularul?',
        ['button', 'send', 'submit', 'form'],
        'submit',
        '`<button type="submit">` trimite formularul.',
        { topic: 'forms' }),
    ],
  },

  // ============ 11. tipuri-input ============
  'tipuri-input': {
    theory: `# 🎛️ Tipuri de input

\`<input type="...">\` are **multe tipuri** — fiecare cu rol și aspect specific 🎨.

## 📋 Tipuri text-uri

- **\`text\`** — Text scurt
- **\`password\`** — Parolă (caracterele apar ca puncte)
- **\`email\`** — Email (validare automată)
- **\`url\`** — URL
- **\`tel\`** — Telefon
- **\`search\`** — Bară căutare

\`\`\`html
<input type="email" placeholder="exemplu@site.ro">
<input type="password" placeholder="Parola">
\`\`\`

## 🔢 Numere & date

- **\`number\`** — Număr (cu săgeți sus/jos)
- **\`range\`** — Slider
- **\`date\`** — Calendar
- **\`time\`** — Oră
- **\`datetime-local\`** — Data + oră
- **\`month\`** — Luna
- **\`week\`** — Săptămână

\`\`\`html
<input type="number" min="1" max="100" step="1">
<input type="range" min="0" max="100" value="50">
<input type="date">
\`\`\`

## 🎯 Selecție

### Checkbox (multiple)
\`\`\`html
<input type="checkbox" id="news" name="news">
<label for="news">Vreau newsletter</label>
\`\`\`

### Radio (un singur)
\`\`\`html
<input type="radio" name="gen" value="m" id="m">
<label for="m">Masculin</label>

<input type="radio" name="gen" value="f" id="f">
<label for="f">Feminin</label>
\`\`\`

> 💡 Radio-urile cu **același \`name\`** sunt în același grup → poți alege doar unul.

## 🎨 Speciale

- **\`color\`** — Selector culoare
- **\`file\`** — Upload fișier
- **\`hidden\`** — Câmp ascuns (date trimise dar invizibile)

\`\`\`html
<input type="color" value="#ff0000">
<input type="file" accept="image/*">
<input type="hidden" name="user_id" value="42">
\`\`\`

## 🎯 Atribute utile

- **\`min\` / \`max\`** — Limite (number, date, range)
- **\`step\`** — Pasul (ex: 0.5)
- **\`pattern\`** — Regex pentru validare
- **\`maxlength\`** — Maxim caractere (text)
- **\`autocomplete\`** — "off" sau "email" etc.
- **\`autofocus\`** — Focus automat
- **\`readonly\`** — Citește, nu modifică
- **\`disabled\`** — Dezactivat (gri)

## 🎯 Exemplu complet

\`\`\`html
<form>
  <label for="varsta">Vârsta (1-100):</label>
  <input type="number" id="varsta" min="1" max="100" required>

  <label for="culoare">Culoare preferată:</label>
  <input type="color" id="culoare">

  <label for="ziua">Data nașterii:</label>
  <input type="date" id="ziua">
</form>
\`\`\`

## 🎓 Ce ai învățat
- ✅ Multe \`type\`-uri specializate
- ✅ Validare automată (email, url, etc.)
- ✅ Atribute \`min\`/\`max\`/\`pattern\`
- ✅ \`checkbox\` (multiple), \`radio\` (un singur)
`,
    extraProblems: [
      mc('Email',
        'Care `type` validează automat un email?',
        ['text', 'email', 'mail', 'address'],
        'email',
        '`type="email"` validează formatul utilizator@domeniu.',
        { topic: 'inputs' }),
      mc('Slider',
        'Care `type` afișează un slider?',
        ['number', 'range', 'slider', 'bar'],
        'range',
        '`type="range"` cu min/max afișează un slider.',
        { topic: 'inputs' }),
      sa('Multiple selecții',
        'Care `type` permite multiple selecții (bifare)?',
        'checkbox',
        '`checkbox` — bifează câte vrei. `radio` — doar unul.',
        { topic: 'inputs' }),
      mc('Radio același grup',
        'Cum garantezi că radio-urile sunt în același grup?',
        ['Același id', 'Același name', 'Aceeași clasă', 'Aceeași valoare'],
        'Același name',
        'Atributul `name` identic = grup unic; selectezi doar unul din grup.',
        { topic: 'inputs', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 12. label-validare ============
  'label-validare': {
    theory: `# 🏷️ Label și validare

## 🏷️ \`<label>\` — esențial pentru accesibilitate

### Mod 1: prin \`for\` + \`id\`
\`\`\`html
<label for="email">Email:</label>
<input type="email" id="email" name="email">
\`\`\`

### Mod 2: înconjurând input-ul
\`\`\`html
<label>
  Email:
  <input type="email" name="email">
</label>
\`\`\`

## ✅ De ce \`<label>\` e important?

1. **Click pe etichetă** → focus pe câmp
2. **Cititoare ecran** știu ce înseamnă câmpul
3. **Mai ușor pe mobil** (zona clickabilă mai mare)

## 🛡️ Validare HTML5

HTML are validare automată!

### Atribute de validare

- **\`required\`** — Obligatoriu
- **\`min\` / \`max\`** — Limite numerice
- **\`minlength\` / \`maxlength\`** — Lungime text
- **\`pattern\`** — Regex personalizat
- **\`type="email/url/..."\`** — Format specific

\`\`\`html
<input type="text" required minlength="3" maxlength="20">
<input type="number" min="1" max="100">
<input type="email" required>
<input type="text" pattern="[A-Za-z]+" title="Doar litere">
\`\`\`

## 🎯 Mesaj custom de eroare

\`\`\`html
<input type="text" required title="Acest câmp e obligatoriu!">
\`\`\`

## 🎨 Stilizare CSS pentru validare

\`\`\`css
input:valid { border-color: green; }
input:invalid { border-color: red; }
input:required { background: #ffe; }
\`\`\`

## 🎯 \`<fieldset>\` și \`<legend>\` — grupare

\`\`\`html
<fieldset>
  <legend>Date personale</legend>

  <label for="nume">Nume:</label>
  <input type="text" id="nume">

  <label for="varsta">Vârsta:</label>
  <input type="number" id="varsta">
</fieldset>
\`\`\`

## 🎯 \`placeholder\` ≠ \`label\`

\`\`\`html
<!-- ❌ Doar placeholder — RĂU -->
<input placeholder="Email">

<!-- ✅ Label + placeholder -->
<label for="e">Email:</label>
<input id="e" type="email" placeholder="ex: ana@scoala.ro">
\`\`\`

> 💡 **Placeholder** e doar un **exemplu**, nu o etichetă!

## ⚠️ Greșeli frecvente

- **Doar placeholder fără label** — Folosește mereu \`<label>\`
- **\`<label for="nume">\` + \`<input>\` fără \`id="nume"\`** — Sincronizează id-urile
- **\`required="true"\`** — Doar \`required\`

## 🎓 Ce ai învățat
- ✅ \`<label>\` esențial pentru accesibilitate
- ✅ Validare HTML5: \`required\`, \`min\`, \`max\`, \`pattern\`
- ✅ \`<fieldset>\` & \`<legend>\` pentru grupare
- ✅ Placeholder ≠ label!
`,
    extraProblems: [
      mc('Conectare label-input',
        'Cum conectezi `<label>` la `<input>`?',
        ['<label name="x">', '<label for="x"> + <input id="x">', '<label input="x">', 'Nu se poate'],
        '<label for="x"> + <input id="x">',
        'Atributul `for` din label trebuie să coincidă cu `id` din input.',
        { topic: 'forms', difficulty: 'MEDIUM' }),
      mc('Validare regex',
        'Ce atribut permite validare cu regex?',
        ['regex', 'pattern', 'match', 'rule'],
        'pattern',
        '`pattern="[A-Z]+"` validează cu expresie regulată.',
        { topic: 'forms', difficulty: 'MEDIUM' }),
      sa('Grupare câmpuri',
        'Care tag grupează vizual câmpuri într-un formular?',
        'fieldset',
        '`<fieldset>` cu `<legend>` grupează câmpuri.',
        { topic: 'forms', difficulty: 'MEDIUM' }),
      mc('Placeholder',
        'Placeholder-ul înlocuiește label-ul?',
        ['Da', 'Nu — e doar exemplu, label e obligatoriu pentru accesibilitate', 'Doar pe mobil', 'Doar pentru email'],
        'Nu — e doar exemplu, label e obligatoriu pentru accesibilitate',
        'Placeholder dispare când userul scrie. Label rămâne mereu.',
        { topic: 'forms' }),
    ],
  },

  // ============ 13. semantic ============
  'semantic': {
    theory: `# 🧩 HTML Semantic

**Semantic** = "cu sens". HTML5 a adăugat tag-uri care **descriu rolul** conținutului 🎯.

## 🆚 Semantic vs non-semantic

\`\`\`html
<!-- ❌ Non-semantic (vechi) -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="article">...</div>

<!-- ✅ Semantic (modern) -->
<header>...</header>
<nav>...</nav>
<article>...</article>
\`\`\`

## 🏛️ Tag-uri semantice principale

- **\`<header>\`** — Antet (logo, titlu, navigare)
- **\`<nav>\`** — Meniu navigare
- **\`<main>\`** — Conținut principal (UNUL pe pagină)
- **\`<article>\`** — Articol independent
- **\`<section>\`** — Secțiune tematică
- **\`<aside>\`** — Lateral (sidebar)
- **\`<footer>\`** — Subsol
- **\`<figure>\`** — Imagine cu descriere
- **\`<figcaption>\`** — Descrierea pentru figure
- **\`<time>\`** — Data / ora

## 🎯 Layout tipic

\`\`\`html
<body>
  <header>
    <h1>Site-ul meu</h1>
    <nav>
      <ul>
        <li><a href="/">Acasă</a></li>
        <li><a href="/despre">Despre</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Titlu articol</h2>
      <p>Conținut...</p>

      <section>
        <h3>Subsecțiune</h3>
        <p>...</p>
      </section>
    </article>

    <aside>
      <h3>Articole similare</h3>
    </aside>
  </main>

  <footer>
    <p>© 2025</p>
  </footer>
</body>
\`\`\`

## 🎨 \`<figure>\` cu \`<figcaption>\`

\`\`\`html
<figure>
  <img src="cat.jpg" alt="Pisică portocalie">
  <figcaption>Pisica vecinilor — Mochi</figcaption>
</figure>
\`\`\`

## ⏰ \`<time>\`

\`\`\`html
<p>Articol publicat <time datetime="2025-11-21">21 noiembrie 2025</time></p>
\`\`\`

## 🤔 \`<article>\` vs \`<section>\` — care când?

- **Independent?** — \`<article>\`: ✅ Da • \`<section>\`: ❌ Parte dintr-un tot
- **Exemple** — \`<article>\`: Postare blog, news • \`<section>\`: Capitol, subsecțiune
- **Are sens singur?** — \`<article>\`: ✅ Da • \`<section>\`: ❌ Nu

## 🌟 De ce semantic?

1. **SEO** — Google înțelege structura
2. **Accesibilitate** — cititoare ecran navighează ușor
3. **Cod mai citibil**
4. **Stil uniform**

## ⚠️ Greșeli frecvente

- **\`<div>\` pentru tot** — Folosește semantic când e relevant
- **Mai multe \`<main>\`** — Doar unul pe pagină
- **\`<section>\` fără titlu** — Mereu cu \`<h2>\`/\`<h3>\`

## 🎓 Ce ai învățat
- ✅ Tag-uri semantice = cu sens
- ✅ \`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`
- ✅ \`<article>\` (independent) vs \`<section>\` (parte)
- ✅ \`<figure>\` & \`<time>\` semantice
`,
    extraProblems: [
      mc('Header semantic',
        'Care tag semantic înlocuiește `<div class="header">`?',
        ['<top>', '<header>', '<title>', '<h>'],
        '<header>',
        '`<header>` e tag semantic HTML5 pentru antet.',
        { topic: 'semantic' }),
      mc('Articol vs secțiune',
        'Care tag e pentru un **articol independent** (ex: postare blog)?',
        ['<section>', '<article>', '<aside>', '<main>'],
        '<article>',
        '`<article>` = conținut auto-suficient (poate sta singur).',
        { topic: 'semantic', difficulty: 'MEDIUM' }),
      sa('Conținut principal',
        'Care tag conține conținutul **principal** al paginii (unul pe pagină)?',
        'main',
        '`<main>` — ESTE doar UNUL pe pagină.',
        { topic: 'semantic' }),
      mc('Beneficiu semantic',
        'Care e BENEFICIUL principal al HTML semantic?',
        ['Mai mic', 'Accesibilitate + SEO + cod citibil', 'Mai rapid', 'Mai colorat'],
        'Accesibilitate + SEO + cod citibil',
        'Cititoare ecran și motoare de căutare înțeleg mai bine.',
        { topic: 'semantic' }),
    ],
  },

  // ============ 14. media ============
  'media': {
    theory: `# 🎬 Media — audio și video

HTML5 are tag-uri native pentru **muzică** și **clipuri** 🎵🎥.

## 🎬 Video

\`\`\`html
<video src="film.mp4" controls width="640">
  Browserul tău nu suportă video.
</video>
\`\`\`

## 🎵 Audio

\`\`\`html
<audio src="muzica.mp3" controls>
  Browserul tău nu suportă audio.
</audio>
\`\`\`

## 🏷️ Atribute comune

- **\`controls\`** — Afișează butoanele play/pauză
- **\`autoplay\`** — Pornește automat (de obicei mut)
- **\`muted\`** — Fără sunet
- **\`loop\`** — Repetă la sfârșit
- **\`preload\`** — "auto" / "metadata" / "none"
- **\`poster\` (video)** — Imagine afișată înainte de play

\`\`\`html
<video src="film.mp4" controls autoplay muted loop poster="thumb.jpg">
\`\`\`

## 🎯 Mai multe surse

Browser-uri diferite suportă format-uri diferite:

\`\`\`html
<video controls>
  <source src="film.mp4" type="video/mp4">
  <source src="film.webm" type="video/webm">
  Browserul tău nu suportă video.
</video>
\`\`\`

> 💡 Browser-ul alege primul format pe care îl înțelege.

## 📜 Subtitrări

\`\`\`html
<video controls>
  <source src="film.mp4" type="video/mp4">
  <track src="ro.vtt" kind="subtitles" srclang="ro" label="Română" default>
  <track src="en.vtt" kind="subtitles" srclang="en" label="English">
</video>
\`\`\`

## 🎯 Format-uri populare

### Video
- **\`.mp4\`** — Cel mai compatibil
- **\`.webm\`** — Modern, mai mic
- **\`.ogv\`** — Vechi

### Audio
- **\`.mp3\`** — Cel mai compatibil
- **\`.ogg\`** — Modern, open source
- **\`.wav\`** — Necomprimat (mare)

## 🎯 Embed YouTube

\`\`\`html
<iframe src="https://www.youtube.com/embed/VIDEO_ID"
        width="560" height="315"
        title="Titlu video"
        allowfullscreen></iframe>
\`\`\`

## ⚠️ Atenție

- **Autoplay cu sunet** = blocat de browsere moderne. Combină cu \`muted\`.
- **Video-uri mari** = încarcă lent — folosește \`preload="metadata"\`.

## 🎓 Ce ai învățat
- ✅ \`<video>\` și \`<audio>\` cu \`controls\`
- ✅ \`<source>\` pentru multiple format-uri
- ✅ \`<track>\` pentru subtitrări
- ✅ \`autoplay\` doar cu \`muted\`
`,
    extraProblems: [
      mc('Atribut play',
        'Care atribut afișează butoanele play/pauză?',
        ['play', 'controls', 'buttons', 'show'],
        'controls',
        'Fără `controls` userul nu poate da play!',
        { topic: 'media' }),
      mc('Autoplay',
        'De ce e nevoie pentru ca un video să pornească automat?',
        ['Doar autoplay', 'autoplay + muted (browser-ele blochează cu sunet)', 'autoplay + loop', 'Nimic'],
        'autoplay + muted (browser-ele blochează cu sunet)',
        'Browser-ele moderne blochează autoplay cu sunet — trebuie muted.',
        { topic: 'media', difficulty: 'MEDIUM' }),
      sa('Multiple format-uri',
        'Care tag pui în interiorul `<video>` pentru multiple format-uri?',
        'source',
        '`<source>` — browser-ul alege primul format compatibil.',
        { topic: 'media', difficulty: 'MEDIUM' }),
      mc('Imagine video',
        'Care atribut afișează o imagine înainte de play (thumbnail)?',
        ['thumbnail', 'preview', 'poster', 'cover'],
        'poster',
        '`<video poster="img.jpg">` afișează img.jpg până la play.',
        { topic: 'media' }),
    ],
  },

  // ============ 15. iframe ============
  'iframe': {
    theory: `# 🪟 \`<iframe>\` — pagini în pagini

Un **iframe** = un cadru care afișează **alt site** sau **alt conținut** în pagina ta 🖼️.

Imaginează-ți o "fereastră" care se uită la un alt site 🪟.

## 🎯 Sintaxă

\`\`\`html
<iframe src="https://example.com" width="600" height="400" title="Site exemplu"></iframe>
\`\`\`

## 🏷️ Atribute principale

- **\`src\`** — URL-ul de afișat
- **\`width\` / \`height\`** — Dimensiuni
- **\`title\`** — Descriere (accesibilitate!)
- **\`allowfullscreen\`** — Permite full-screen
- **\`loading="lazy"\`** — Încărcare amânată
- **\`sandbox\`** — Securitate (limitează ce poate face)
- **\`referrerpolicy\`** — Controlează ce date trimit

## 🎯 Exemple comune

### YouTube
\`\`\`html
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        width="560" height="315"
        title="YouTube video"
        allowfullscreen></iframe>
\`\`\`

### Google Maps
\`\`\`html
<iframe src="https://www.google.com/maps/embed?pb=!..."
        width="600" height="450"
        loading="lazy"
        title="Locație pe hartă"></iframe>
\`\`\`

### Spotify
\`\`\`html
<iframe src="https://open.spotify.com/embed/playlist/PLAYLIST_ID"
        width="300" height="380"
        title="Playlist Spotify"></iframe>
\`\`\`

## 🛡️ Securitate cu \`sandbox\`

Limitează ce poate face conținutul:

\`\`\`html
<iframe src="..." sandbox="allow-scripts allow-forms"></iframe>
\`\`\`

- **\`allow-scripts\`** — JavaScript
- **\`allow-forms\`** — Trimitere formulare
- **\`allow-same-origin\`** — Acces la cookies
- **\`allow-popups\`** — Pop-up-uri

> 💡 \`sandbox=""\` (gol) = totul **interzis** — maximă securitate.

## ⚠️ Probleme comune

### 1. Site-ul refuză să fie încărcat în iframe

Multe site-uri (Google, Facebook) blochează iframe pentru securitate (header \`X-Frame-Options: DENY\`).

### 2. Iframe-ul nu se afișează responsive

Soluție:
\`\`\`html
<div style="position:relative; padding-bottom:56.25%;">
  <iframe src="..." style="position:absolute; width:100%; height:100%;"></iframe>
</div>
\`\`\`

## ⚠️ Greșeli frecvente

- **Fără \`title\`** — Adaugă mereu \`title="..."\`
- **iframe pentru tot** — Doar pentru embed-uri (video, hărți)
- **Fără \`loading="lazy"\`** — Salvează date și încarcă mai rapid

## 🎓 Ce ai învățat
- ✅ \`<iframe>\` afișează alte pagini
- ✅ \`title\` esențial pentru accesibilitate
- ✅ \`sandbox\` pentru securitate
- ✅ Multe site-uri blochează iframe
`,
    extraProblems: [
      mc('Atribut URL',
        'Care atribut conține URL-ul iframe-ului?',
        ['href', 'src', 'url', 'page'],
        'src',
        '`src` — la fel ca la `<img>`.',
        { topic: 'iframe' }),
      mc('Securitate',
        'Care atribut limitează ce poate face conținutul din iframe?',
        ['security', 'sandbox', 'limit', 'safe'],
        'sandbox',
        '`sandbox` cu valori specifice limitează permisiunile.',
        { topic: 'iframe', difficulty: 'MEDIUM' }),
      sa('Accesibilitate',
        'Ce atribut e ESENȚIAL pentru accesibilitate la iframe?',
        'title',
        '`title="descriere"` — cititoarele de ecran îl folosesc.',
        { topic: 'iframe' }),
      mc('De ce nu merge',
        'De ce un site (ex: Google) NU se afișează în iframe-ul tău?',
        ['Bug HTML', 'Site-ul blochează prin header X-Frame-Options', 'Pentru că vrea bani', 'Doar HTTPS'],
        'Site-ul blochează prin header X-Frame-Options',
        'Pentru securitate, multe site-uri blochează încărcarea în iframe.',
        { topic: 'iframe', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 16. meta-tags ============
  'meta-tags': {
    theory: `# 🏷️ Meta tags — informații despre pagină

\`<meta>\` tag-urile dau **informații despre pagină** browserului și motoarelor de căutare. Sunt în \`<head>\` 📋.

## 🌐 Esențiale

\`\`\`html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagina mea</title>
</head>
\`\`\`

### \`charset\` — codificare
\`\`\`html
<meta charset="UTF-8">
\`\`\`
> Permite diacritice (ă, î, ș) și emojis 🎉

### \`viewport\` — pentru mobil
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`
> Fără asta, site-ul arată zoomed-out pe telefon!

## 🔍 SEO (Search Engine Optimization)

\`\`\`html
<meta name="description" content="Învață programare cu Python. Cursuri pentru copii 9-14 ani.">
<meta name="keywords" content="python, programare, copii, cursuri">
<meta name="author" content="Maria Popescu">
\`\`\`

**Description** apare în Google sub titlu — **maxim 160 caractere**!

## 🤖 Pentru motoarele de căutare

\`\`\`html
<meta name="robots" content="index, follow">          <!-- indexează -->
<meta name="robots" content="noindex, nofollow">      <!-- NU indexa -->
\`\`\`

## 📱 Open Graph (Facebook, WhatsApp)

Când partajezi link-ul, aceste meta-uri controlează preview-ul:

\`\`\`html
<meta property="og:title" content="Titlu de pe rețele">
<meta property="og:description" content="Descriere scurtă">
<meta property="og:image" content="https://site.ro/share.jpg">
<meta property="og:url" content="https://site.ro/pagina">
<meta property="og:type" content="website">
\`\`\`

## 🐦 Twitter Cards

\`\`\`html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Titlu Twitter">
<meta name="twitter:image" content="https://site.ro/twitter.jpg">
\`\`\`

## 🎨 Iconuri & temă

### Favicon (icon în tab)
\`\`\`html
<link rel="icon" href="/favicon.ico">
<link rel="icon" type="image/png" href="/icon.png">
\`\`\`

### Culoare temă (mobil)
\`\`\`html
<meta name="theme-color" content="#0066cc">
\`\`\`
> Bara de sus a Chrome-ului mobil va fi albastră!

## ⏱️ Refresh / redirect

\`\`\`html
<meta http-equiv="refresh" content="5">                      <!-- reîncarcă în 5s -->
<meta http-equiv="refresh" content="3; url=https://...">     <!-- redirect -->
\`\`\`

## 🎯 Exemplu complet pentru \`<head>\`

\`\`\`html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Cursuri Python pentru copii</title>
  <meta name="description" content="Învață Python ușor și distractiv.">

  <meta property="og:title" content="Cursuri Python">
  <meta property="og:image" content="https://site.ro/og.jpg">

  <link rel="icon" href="/favicon.ico">
  <meta name="theme-color" content="#0066cc">
</head>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`charset\`, \`viewport\` — esențiale
- ✅ \`description\` pentru Google
- ✅ Open Graph pentru Facebook/WhatsApp
- ✅ \`theme-color\` pentru bara mobil
`,
    extraProblems: [
      mc('Diacritice',
        'Care meta tag permite diacritice și emojis?',
        ['<meta lang="ro">', '<meta charset="UTF-8">', '<meta diacritice>', '<meta encoding>'],
        '<meta charset="UTF-8">',
        '`charset="UTF-8"` declară codificarea universală.',
        { topic: 'meta' }),
      mc('Mobile viewport',
        'Ce face `<meta name="viewport" content="width=device-width">`?',
        ['Decorativ', 'Face site-ul responsive pe mobil', 'Setează lățimea ecranului', 'Blochează zoom'],
        'Face site-ul responsive pe mobil',
        'Fără viewport, site-ul apare micșorat pe telefoane.',
        { topic: 'meta', difficulty: 'MEDIUM' }),
      sa('Description SEO',
        'Care meta tag conține descrierea pentru Google? (cuvânt din name="?")',
        'description',
        '`<meta name="description" content="...">` — apare în rezultate Google.',
        { topic: 'meta' }),
      mc('Preview Facebook',
        'Care prefix folosesc meta-urile pentru Facebook share?',
        ['fb:', 'og:', 'share:', 'social:'],
        'og:',
        'Open Graph — `og:title`, `og:image` etc.',
        { topic: 'meta', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ 17. html-css-intro ============
  'html-css-intro': {
    theory: `# 🎨 HTML + CSS — primul stil

CSS = **Cascading Style Sheets** — limbajul prin care **îmbraci** HTML-ul 👗.

## 3️⃣ Moduri de a adăuga CSS

### 1. **Inline** (în atribut \`style\`)
\`\`\`html
<p style="color: red; font-size: 20px;">Text roșu mare</p>
\`\`\`
> ❌ Folosește **rar** — greu de întreținut.

### 2. **Internal** (în \`<style>\` în \`<head>\`)
\`\`\`html
<head>
  <style>
    p {
      color: blue;
      font-size: 18px;
    }
  </style>
</head>
\`\`\`
> ✅ OK pentru pagini mici.

### 3. **External** (fișier .css separat) — **cea mai bună!**
\`\`\`html
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`

În \`style.css\`:
\`\`\`css
p {
  color: green;
  font-size: 16px;
}
\`\`\`

## 🎯 Anatomie regulă CSS

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
  text-align: center;
}
\`\`\`

- **\`h1\`** — **selector** (cui aplici stilul)
- **\`color\`** — **proprietate**
- **\`red\`** — **valoare**
- **\`{ }\`** — bloc cu reguli
- **\`;\`** — separă reguli

## 🎯 Selectori de bază

\`\`\`css
/* tag */
p { color: blue; }

/* clasă (.) */
.alert { color: red; }

/* id (#) */
#header { background: yellow; }

/* universal */
* { margin: 0; }
\`\`\`

## 🎨 Proprietăți populare

- **\`color\`** — \`color: red;\`
- **\`background-color\`** — \`background-color: yellow;\`
- **\`font-size\`** — \`font-size: 20px;\`
- **\`text-align\`** — \`text-align: center;\`
- **\`margin\`** — \`margin: 10px;\`
- **\`padding\`** — \`padding: 5px;\`
- **\`border\`** — \`border: 2px solid black;\`
- **\`width\` / \`height\`** — \`width: 200px;\`

## 🎯 Exemplu complet

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1 class="titlu">Salut!</h1>
  <p id="intro">Site-ul meu</p>
  <p class="alert">⚠️ Atenție</p>
</body>
</html>
\`\`\`

\`\`\`css
/* style.css */
body {
  font-family: Arial;
  background: lightblue;
}
.titlu {
  color: white;
  background: blue;
  padding: 10px;
}
#intro {
  font-size: 18px;
  color: gray;
}
.alert {
  color: red;
  font-weight: bold;
}
\`\`\`

## ⚠️ Greșeli frecvente

- **\`color: 'red'\` (cu ghilimele)** — \`color: red;\`
- **Uiți \`;\` la final** — Pune mereu \`;\`
- **Selector greșit (clasă fără \`.\`)** — \`.clasa\`, \`#id\`, \`tag\`

## 🎓 Ce ai învățat
- ✅ Inline / Internal / External CSS
- ✅ Sintaxa: \`selector { prop: val; }\`
- ✅ Selectori: tag, \`.class\`, \`#id\`
- ✅ Proprietăți de bază
`,
    extraProblems: [
      mc('Modul recomandat',
        'Care e modul recomandat de a folosi CSS?',
        ['Inline (style="...")', 'Internal (<style>)', 'External (link la .css)', 'Niciunul'],
        'External (link la .css)',
        'Fișier separat — reutilizabil, ușor de întreținut.',
        { topic: 'css' }),
      mc('Selector clasă',
        'Cum scrii un selector pentru clasa "alert"?',
        ['alert', '#alert', '.alert', '*alert'],
        '.alert',
        'Punctul `.` e prefixul pentru clase în CSS.',
        { topic: 'css' }),
      sa('Selector ID',
        'Ce simbol folosești pentru selector de ID?',
        '#',
        '`#nume` selectează elementul cu `id="nume"`.',
        { topic: 'css' }),
      mc('Tag link CSS',
        'Care tag HTML încarcă fișierul CSS extern?',
        ['<style>', '<script>', '<link>', '<css>'],
        '<link>',
        '`<link rel="stylesheet" href="style.css">` în `<head>`.',
        { topic: 'css' }),
    ],
  },

  // ============ 18. html-js-intro ============
  'html-js-intro': {
    theory: `# ⚡ HTML + JavaScript — primul script

JavaScript dă **viață** paginilor: interactivitate, animații, calcule 🎮.

## 3️⃣ Moduri de a adăuga JS

### 1. **Inline** (în atribut)
\`\`\`html
<button onclick="alert('Salut!')">Click</button>
\`\`\`
> ❌ Folosit rar.

### 2. **Internal** (în \`<script>\`)
\`\`\`html
<script>
  console.log("Bună!");
  alert("Site încărcat!");
</script>
\`\`\`

### 3. **External** (fișier .js) — **recomandat**
\`\`\`html
<script src="app.js"></script>
\`\`\`

## 📍 Unde pui \`<script>\`?

### Opțiunea 1: la sfârșit, înainte de \`</body>\` ✅

\`\`\`html
<body>
  <h1>Titlu</h1>
  <p id="text">...</p>
  <script src="app.js"></script>
</body>
\`\`\`

> 💡 HTML se încarcă întâi, apoi rulează JS-ul.

### Opțiunea 2: cu \`defer\` în \`<head>\`

\`\`\`html
<head>
  <script src="app.js" defer></script>
</head>
\`\`\`

> 💡 \`defer\` așteaptă tot HTML-ul, apoi rulează — perfect.

## 🆚 \`defer\` vs \`async\`

- **(nimic)** — Blochează parsarea HTML — RĂU
- **\`async\`** — Descarcă paralel, rulează imediat ce e gata
- **\`defer\`** — Descarcă paralel, rulează după ce HTML e gata

## 🎯 Exemplu interactiv

\`\`\`html
<!DOCTYPE html>
<html>
<body>
  <h1>Contor</h1>
  <p id="numar">0</p>
  <button id="btn">Click</button>

  <script>
    let n = 0;
    document.getElementById("btn").addEventListener("click", () => {
      n++;
      document.getElementById("numar").textContent = n;
    });
  </script>
</body>
</html>
\`\`\`

## 🎯 Atribute comune pe \`<script>\`

\`\`\`html
<script src="app.js"></script>
<script src="app.js" defer></script>
<script src="app.js" async></script>
<script src="app.js" type="module"></script>   <!-- modul ES6 -->
\`\`\`

## 🎯 Loading din CDN

\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js"></script>
\`\`\`

## ⚠️ Reguli importante

1. **Fără tag de auto-închidere**: \`<script />\` ❌, \`<script></script>\` ✅
2. Cu \`src\` → conținutul dintre tag-uri e **ignorat**
3. JS-ul rulează **în ordinea** scripturilor

## ⚠️ Greșeli frecvente

- **\`<script src="app.js" />\`** — \`<script src="app.js"></script>\`
- **JS în \`<head>\` fără \`defer\`** — Adaugă \`defer\` sau pune-l la sfârșit
- **JS care manipulează HTML neîncărcat** — Pune scriptul după elemente

## 🎓 Ce ai învățat
- ✅ Inline / Internal / External JS
- ✅ \`defer\` în head — modern și sigur
- ✅ Sau \`<script>\` la sfârșit înainte de \`</body>\`
- ✅ \`async\` vs \`defer\`
`,
    extraProblems: [
      mc('Cea mai bună poziție',
        'Unde e cel mai bine să pui `<script>`?',
        ['În <head> simplu', 'La sfârșit înainte de </body> SAU în <head> cu defer', 'În <body> la început', 'Nu contează'],
        'La sfârșit înainte de </body> SAU în <head> cu defer',
        'Ambele așteaptă încărcarea HTML-ului.',
        { topic: 'js', difficulty: 'MEDIUM' }),
      mc('defer vs async',
        'Care e diferența între `defer` și `async`?',
        ['Niciuna', '`defer` așteaptă HTML-ul, `async` rulează imediat ce-i gata', '`async` e nou', '`defer` e doar mobile'],
        '`defer` așteaptă HTML-ul, `async` rulează imediat ce-i gata',
        'Pentru ordine garantată, folosește `defer`.',
        { topic: 'js', difficulty: 'HARD' }),
      sa('Tag JS',
        'Care tag HTML adaugă JavaScript?',
        'script',
        '`<script>` — pentru cod inline sau cu `src`.',
        { topic: 'js' }),
      mc('Auto-închidere',
        'Care e CORECT pentru un script extern?',
        ['<script src="app.js" />', '<script src="app.js"></script>', '<script="app.js">', '<js src="app.js">'],
        '<script src="app.js"></script>',
        '`<script>` NU are formă scurtă — mereu cu închidere.',
        { topic: 'js' }),
    ],
  },

  // ============ 19. structura-pagina ============
  'structura-pagina': {
    theory: `# 🏗️ Structura unei pagini complete

Acum că știi tag-urile, hai să le combinăm într-o **pagină reală**! 🎯

## 📋 Layout standard

\`\`\`html
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site-ul meu</title>
  <meta name="description" content="Descriere scurtă">
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="/favicon.ico">
</head>
<body>

  <header>
    <h1>Logo / Titlu</h1>
    <nav>
      <ul>
        <li><a href="/">Acasă</a></li>
        <li><a href="/despre">Despre</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h2>Salut!</h2>
      <p>Bine ai venit pe site.</p>
    </section>

    <section class="cards">
      <article>
        <h3>Articol 1</h3>
        <p>Conținut...</p>
      </article>
      <article>
        <h3>Articol 2</h3>
        <p>Conținut...</p>
      </article>
    </section>

    <aside>
      <h3>Lateral</h3>
      <p>Anunțuri etc.</p>
    </aside>
  </main>

  <footer>
    <p>© 2025 Site-ul meu</p>
    <p>
      <a href="/termeni">Termeni</a> |
      <a href="/contact">Contact</a>
    </p>
  </footer>

  <script src="app.js" defer></script>
</body>
</html>
\`\`\`

## 🧭 Reguli de bază pentru structură

1. **Un singur \`<h1>\`** pe pagină (titlul principal)
2. **Un singur \`<main>\`** pe pagină
3. **Ierarhie titluri** corectă: h1 → h2 → h3 (nu sări nivele)
4. **Toate imaginile** au \`alt\`
5. **Toate input-urile** au \`<label>\`
6. **Limba** declarată: \`<html lang="ro">\`
7. **Viewport** pentru mobil
8. **CSS** în \`<head>\`, **JS** la sfârșit (sau cu \`defer\`)

## 📐 Tipuri de layout

### Single column
\`\`\`html
<header>...</header>
<main>...</main>
<footer>...</footer>
\`\`\`

### Header + sidebar + main + footer
\`\`\`html
<header>...</header>
<div class="container">
  <aside>...</aside>
  <main>...</main>
</div>
<footer>...</footer>
\`\`\`

### Cards grid
\`\`\`html
<section class="grid">
  <article>...</article>
  <article>...</article>
  <article>...</article>
</section>
\`\`\`

## 🎯 Exercițiu mental

Imaginează-ți **pagina ta despre tine**:
1. Header cu numele tău
2. Nav cu "Despre", "Hobby-uri", "Contact"
3. Main cu 3 secțiuni
4. Footer cu data nașterii

Poți scrie HTML-ul în minte? 💭

## ⚠️ Greșeli frecvente

- **Mai multe \`<h1>\`** — Doar unul
- **h1 → h4 (sărim h2, h3)** — h1 → h2 → h3
- **\`<div>\` peste tot** — Folosește semantic
- **Lipsă viewport** — Adaugă-l mereu

## 🎓 Ce ai învățat
- ✅ Structura completă a unei pagini
- ✅ Reguli pentru ierarhie corectă
- ✅ Tipuri de layout
- ✅ Bune practici
`,
    extraProblems: [
      mc('Câte h1',
        'Câte tag-uri `<h1>` ar trebui să aibă o pagină?',
        ['Cât vrei', 'Doar unul', 'Maxim 3', 'Niciunul'],
        'Doar unul',
        'Un singur `<h1>` pentru titlul principal — bună practică SEO.',
        { topic: 'structure' }),
      mc('Ierarhie titluri',
        'Care e ordinea CORECTĂ a titlurilor?',
        ['h1 → h2 → h3 → h4', 'h4 → h3 → h2 → h1', 'h2 → h4 → h6', 'oricum'],
        'h1 → h2 → h3 → h4',
        'Nu sări peste niveluri — păstrează ierarhia logică.',
        { topic: 'structure', difficulty: 'MEDIUM' }),
      sa('Limba paginii',
        'Care atribut declară limba paginii pe `<html>`?',
        'lang',
        '`<html lang="ro">` — pentru cititoare ecran și SEO.',
        { topic: 'structure' }),
      mc('Câte main',
        'Câte tag-uri `<main>` per pagină?',
        ['Câte vrei', 'Doar unul', 'Doar dacă e nav', 'Niciunul'],
        'Doar unul',
        '`<main>` e UNIC pe pagină — conține conținutul principal.',
        { topic: 'structure' }),
    ],
  },

  // ============ 20. mini-proiect-html ============
  'mini-proiect-html': {
    theory: `# 🎯 Mini-proiect: pagină personală

Acum aplici tot ce ai învățat! 🎉

## 📋 Specificații

Construiești o **pagină "Despre mine"** cu:
1. Header cu numele tău
2. Navigare (4 link-uri)
3. Secțiune intro cu poză
4. 3 hobby-uri în card-uri
5. Tabel cu programa zilnică
6. Formular de contact
7. Footer cu copyright

## 🛠️ Soluție pas cu pas

### 1. Schelet
\`\`\`html
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Despre Ana</title>
  <meta name="description" content="Pagina personală a Anei">
</head>
<body>
  <!-- vine conținutul -->
</body>
</html>
\`\`\`

### 2. Header + Nav
\`\`\`html
<header>
  <h1>Ana Popescu</h1>
  <nav>
    <ul>
      <li><a href="#intro">Intro</a></li>
      <li><a href="#hobby">Hobby-uri</a></li>
      <li><a href="#program">Program</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>
\`\`\`

### 3. Intro
\`\`\`html
<main>
  <section id="intro">
    <h2>Salut!</h2>
    <img src="poza.jpg" alt="Poza Anei" width="200">
    <p>Mă numesc <strong>Ana</strong> și am <em>11 ani</em>. Învăț la școala "Mihai Viteazul".</p>
  </section>
\`\`\`

### 4. Hobby-uri (cards)
\`\`\`html
  <section id="hobby">
    <h2>Hobby-uri</h2>
    <article>
      <h3>📚 Citit</h3>
      <p>Îmi place Harry Potter.</p>
    </article>
    <article>
      <h3>🎹 Pian</h3>
      <p>Cânt de 3 ani.</p>
    </article>
    <article>
      <h3>💻 Programare</h3>
      <p>Învăț Python pe ollaenglish.md.</p>
    </article>
  </section>
\`\`\`

### 5. Tabel program
\`\`\`html
  <section id="program">
    <h2>Programa zilnică</h2>
    <table>
      <thead>
        <tr>
          <th>Oră</th>
          <th>Activitate</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>8:00</td><td>Școală</td></tr>
        <tr><td>14:00</td><td>Pian</td></tr>
        <tr><td>16:00</td><td>Programare</td></tr>
      </tbody>
    </table>
  </section>
\`\`\`

### 6. Formular contact
\`\`\`html
  <section id="contact">
    <h2>Scrie-mi</h2>
    <form action="/contact" method="POST">
      <label for="nume">Nume:</label>
      <input type="text" id="nume" name="nume" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="mesaj">Mesaj:</label>
      <textarea id="mesaj" name="mesaj" rows="4" required></textarea>

      <button type="submit">Trimite</button>
    </form>
  </section>
</main>
\`\`\`

### 7. Footer
\`\`\`html
<footer>
  <p>© 2025 Ana Popescu — Toate drepturile rezervate</p>
</footer>
</body>
</html>
\`\`\`

## ✅ Checklist

- [ ] DOCTYPE și lang
- [ ] Meta charset & viewport
- [ ] Title descriptiv
- [ ] Un singur \`<h1>\`
- [ ] Toate imaginile cu \`alt\`
- [ ] Toate input-urile cu \`<label>\`
- [ ] Tag-uri semantice (header, main, footer)
- [ ] Nav cu listă de link-uri

## 🎓 Felicitări!

Acum știi să construiești pagini HTML complete! Următoarea aventură: **CSS** pentru a le face frumoase 🎨.
`,
    extraProblems: [
      mc('Ordinea în head',
        'Ce vine PRIMA în <head>?',
        ['<title>', '<meta charset>', '<link>', '<script>'],
        '<meta charset>',
        '`<meta charset="UTF-8">` ar trebui să fie în primele linii.',
        { topic: 'structure' }),
      mc('Tag pentru hobby-uri',
        'Care tag e potrivit pentru fiecare hobby (conținut independent)?',
        ['<div>', '<article>', '<section>', '<aside>'],
        '<article>',
        '`<article>` pentru conținut auto-suficient.',
        { topic: 'structure', difficulty: 'MEDIUM' }),
      sa('Tag form contact',
        'Care tag conține întregul formular?',
        'form',
        '`<form>` cuprinde toate câmpurile și butonul submit.',
        { topic: 'structure' }),
      mc('Trimitere formular',
        'Ce `type` are butonul care trimite formularul?',
        ['button', 'send', 'submit', 'post'],
        'submit',
        '`<button type="submit">` declanșează trimiterea.',
        { topic: 'structure' }),
    ],
  },

}
