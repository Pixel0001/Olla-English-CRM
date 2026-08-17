import { mc, sa } from './helpers.mjs'

export const htmlModule = {
  slug: 'html-basics',
  title: 'HTML Basics',
  description: 'Învață HTML — structura paginilor web. 20 de lecții complete',
  language: 'html',
  order: 3,
  lessons: [
    {
      slug: 'introducere-structura',
      title: '1. Introducere + structură HTML',
      isFree: true,
      theory: `# Bun venit în HTML!

HTML (HyperText Markup Language) este **scheletul** oricărei pagini web.

## Structura de bază
\`\`\`html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Pagina mea</title>
</head>
<body>
    <h1>Salut!</h1>
    <p>Conținut.</p>
</body>
</html>
\`\`\`

## Elemente și tag-uri
- \`<tag>...</tag>\` — pereche
- \`<br>\` — self-closing

## Cum testezi?
1. Salvează fișierul ca \`pagina.html\`
2. Deschide-l în browser

## DOCTYPE
\`<!DOCTYPE html>\` spune browserului că e **HTML5** (versiunea modernă).
`,
      problems: [
        mc('Acronim',
          'Ce înseamnă HTML?',
          ['Hyper Text Markup Language', 'High Text Modern Language', 'Home Tool Markup Lang', 'Hyperlink Text Mode'],
          'Hyper Text Markup Language',
          'HyperText Markup Language — limbajul de marcare al hipertextului.',
          { topic: 'html-basics' }),
        mc('Tag rădăcină',
          'Care tag conține toată pagina HTML?',
          ['<head>', '<body>', '<html>', '<page>'],
          '<html>',
          '`<html>` este elementul rădăcină al oricărei pagini HTML.',
          { topic: 'html-basics' }),
        mc('DOCTYPE',
          'La ce servește `<!DOCTYPE html>`?',
          ['E un comentariu', 'Spune că e HTML5', 'Importă CSS', 'Definește titlul'],
          'Spune că e HTML5',
          '`<!DOCTYPE html>` declară că documentul folosește HTML5.',
          { topic: 'html-basics' }),
        mc('Body',
          'Ce conține `<body>`?',
          ['Meta-date', 'Conținutul vizibil al paginii', 'Stilurile CSS', 'Doar imagini'],
          'Conținutul vizibil al paginii',
          'Tot ce vede utilizatorul este în `<body>`.',
          { topic: 'html-basics' }),
        sa('Extensie',
          'Ce extensie au fișierele HTML?',
          '.html',
          'Extensia standard este `.html` (sau, mai vechi, `.htm`).',
          { topic: 'html-basics' }),
      ],
    },
    {
      slug: 'tag-uri-baza',
      title: '2. Tag-uri de bază (h1-h6, p, br)',
      isFree: true,
      theory: `# Tag-uri text fundamentale

## Titluri
\`\`\`html
<h1>Titlu principal</h1>
<h2>Subtitlu</h2>
<h3>Sub-sub</h3>
...
<h6>Cel mai mic</h6>
\`\`\`

## Paragrafe
\`\`\`html
<p>Acesta este un paragraf.</p>
<p>Altul.</p>
\`\`\`

## Linie nouă
\`\`\`html
Linia 1<br>Linia 2
\`\`\`

## ⚠️ HTML ignoră spațiile multiple și newline-urile din cod!
`,
      problems: [
        mc('Câte titluri',
          'Câte niveluri de titluri există în HTML?',
          ['3', '6', '8', 'nelimitate'],
          '6',
          'De la `<h1>` (cel mai mare) la `<h6>` (cel mai mic).',
          { topic: 'html-tags' }),
        mc('Cel mai mare',
          'Care este cel mai mare titlu?',
          ['<h1>', '<h6>', '<title>', '<header>'],
          '<h1>',
          '`<h1>` este cel mai mare; ar trebui să fie unic per pagină.',
          { topic: 'html-tags' }),
        mc('Linie nouă',
          'Ce tag creează o linie nouă?',
          ['<lr>', '<br>', '<n>', '<line>'],
          '<br>',
          '`<br>` (break) introduce o linie nouă, fără pereche de închidere.',
          { topic: 'html-tags' }),
        mc('Paragraf',
          'Ce tag definește un paragraf?',
          ['<para>', '<p>', '<text>', '<paragraph>'],
          '<p>',
          'Tag-ul `<p>` este standard pentru paragrafe.',
          { topic: 'html-tags' }),
        sa('Tag titlu mediu',
          'Ce tag folosești pentru un titlu de nivel 3?',
          '<h3>',
          'Niveluri 1-6 corespund la `<h1>` ... `<h6>`.',
          { topic: 'html-tags' }),
      ],
    },
    {
      slug: 'text-formatting',
      title: '3. Formatare text (b, strong, i, em, u)',
      isFree: false,
      theory: `# Formatare text

## Bold (gros)
\`\`\`html
<b>text bold</b>          ← stil vizual
<strong>important</strong> ← semantic (recomandat)
\`\`\`

## Italic
\`\`\`html
<i>italic</i>
<em>emphasis</em>
\`\`\`

## Underline
\`\`\`html
<u>subliniat</u>
\`\`\`

## Diferență b vs strong, i vs em
- \`<b>\`, \`<i>\` — doar **vizual**
- \`<strong>\`, \`<em>\` — **semantic** (cititoarele de ecran și SEO le înțeleg)

**Folosește \`<strong>\` și \`<em>\` în cod modern!**
`,
      problems: [
        mc('Bold semantic',
          'Care este preferat pentru bold?',
          ['<b>', '<strong>', '<bold>', '<thick>'],
          '<strong>',
          '`<strong>` are sens semantic (text important), nu doar stil vizual.',
          { topic: 'formatting' }),
        mc('Italic',
          'Care marchează emfază (semantic)?',
          ['<i>', '<em>', '<italic>', '<style>'],
          '<em>',
          '`<em>` (emphasis) este varianta semantică pentru italic.',
          { topic: 'formatting' }),
        mc('Underline',
          'Ce tag subliniază text?',
          ['<u>', '<line>', '<under>', '<sub>'],
          '<u>',
          '`<u>` produce text subliniat (rar folosit, poate fi confundat cu link).',
          { topic: 'formatting' }),
        mc('Diferență',
          'Care e diferența principală b vs strong?',
          ['Sunt identice', 'b e doar vizual, strong e semantic', 'b e mai gros', 'strong e doar pentru titluri'],
          'b e doar vizual, strong e semantic',
          'Cititoarele de ecran (accesibilitate) interpretează `<strong>` ca important.',
          { topic: 'formatting', difficulty: 'MEDIUM' }),
        sa('Italic semantic',
          'Ce tag folosești pentru emfază semantică?',
          '<em>',
          '`<em>` este forma semantică modernă.',
          { topic: 'formatting' }),
      ],
    },
    {
      slug: 'link-uri',
      title: '4. Link-uri (anchor)',
      isFree: false,
      theory: `# Link-uri în HTML

\`\`\`html
<a href="https://google.com">Mergi la Google</a>
\`\`\`

## Atribute importante
- \`href\` — URL destinație
- \`target="_blank"\` — deschide în tab nou
- \`rel="noopener"\` — securitate

\`\`\`html
<a href="https://google.com" target="_blank" rel="noopener">
    Google (tab nou)
</a>
\`\`\`

## Link relativ vs absolut
\`\`\`html
<a href="contact.html">Contact</a>      <!-- relativ -->
<a href="/contact">Contact</a>          <!-- absolut pe site -->
<a href="https://...">Extern</a>        <!-- complet -->
\`\`\`

## Link la secțiune (anchor)
\`\`\`html
<a href="#sectiune1">Sari la secțiune</a>
...
<h2 id="sectiune1">Secțiunea 1</h2>
\`\`\`

## Mailto / Tel
\`\`\`html
<a href="mailto:contact@x.com">Email</a>
<a href="tel:+40123456789">Sună</a>
\`\`\`
`,
      problems: [
        mc('Tag link',
          'Ce tag creează un link?',
          ['<link>', '<a>', '<href>', '<url>'],
          '<a>',
          '`<a>` (anchor) creează hyperlink-uri. `<link>` e pentru altceva (CSS extern).',
          { topic: 'links' }),
        mc('Atribut URL',
          'Care atribut conține URL-ul destinație?',
          ['url', 'src', 'href', 'link'],
          'href',
          '`href` (hypertext reference) conține destinația link-ului.',
          { topic: 'links' }),
        mc('Tab nou',
          'Cum deschizi link în tab nou?',
          ['target="new"', 'target="_blank"', 'newtab="true"', 'open="new"'],
          'target="_blank"',
          '`target="_blank"` deschide într-o filă nouă.',
          { topic: 'links', difficulty: 'MEDIUM' }),
        mc('Anchor',
          'Cum legi la o secțiune cu id="top" pe aceeași pagină?',
          ['href="top"', 'href="#top"', 'href="@top"', 'href=":top"'],
          'href="#top"',
          'Diezul `#` referențiază un ID de pe aceeași pagină.',
          { topic: 'links', difficulty: 'MEDIUM' }),
        sa('Email link',
          'Ce protocol folosești pentru un link de email?',
          'mailto:',
          '`<a href="mailto:adresa@x.com">` deschide clientul de email.',
          { topic: 'links' }),
      ],
    },
    {
      slug: 'imagini',
      title: '5. Imagini (img)',
      isFree: false,
      theory: `# Imagini

\`\`\`html
<img src="poza.jpg" alt="Descriere" width="300">
\`\`\`

## Atribute
- **src** — sursa imaginii (URL sau path)
- **alt** — text alternativ (OBLIGATORIU pentru accesibilitate!)
- **width** / **height** — dimensiuni

## ⚠️ Self-closing
\`<img>\` nu are tag de închidere.

## Imagini responsive
\`\`\`html
<img src="poza.jpg" alt="..." style="max-width: 100%; height: auto;">
\`\`\`

## SRC relativ vs absolut
\`\`\`html
<img src="img/poza.jpg">           <!-- relativ -->
<img src="/img/poza.jpg">          <!-- absolut -->
<img src="https://...">            <!-- extern -->
\`\`\`
`,
      problems: [
        mc('Tag imagine',
          'Care tag inserează o imagine?',
          ['<image>', '<img>', '<picture>', '<photo>'],
          '<img>',
          '`<img>` este tag-ul standard pentru imagini.',
          { topic: 'images' }),
        mc('alt',
          'La ce servește atributul `alt`?',
          ['Estetică', 'Text alternativ pentru accesibilitate', 'Animații', 'Mărime'],
          'Text alternativ pentru accesibilitate',
          '`alt` apare dacă imaginea nu se încarcă și e citit de cititoarele de ecran.',
          { topic: 'images', difficulty: 'MEDIUM' }),
        mc('Self-closing',
          '`<img>` are tag de închidere?',
          ['Da: </img>', 'Nu, e self-closing', 'Doar uneori', 'Doar în XHTML'],
          'Nu, e self-closing',
          '`<img>` nu are conținut, deci nu are tag de închidere.',
          { topic: 'images' }),
        sa('Atribut sursă',
          'Ce atribut specifică sursa imaginii?',
          'src',
          '`src` (source) conține URL-ul/path-ul imaginii.',
          { topic: 'images' }),
        mc('Atributul alt e',
          'Atributul `alt` este:',
          ['Opțional', 'Obligatoriu pentru accesibilitate', 'Doar pentru SEO', 'Folosit doar pentru animații'],
          'Obligatoriu pentru accesibilitate',
          'Standardele de accesibilitate (WCAG) cer `alt` pe orice imagine.',
          { topic: 'images', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'liste',
      title: '6. Liste (ul, ol, li)',
      isFree: false,
      theory: `# Liste

## Listă neordonată (ul)
\`\`\`html
<ul>
    <li>Mar</li>
    <li>Banana</li>
    <li>Para</li>
</ul>
\`\`\`

## Listă ordonată (ol)
\`\`\`html
<ol>
    <li>Pasul 1</li>
    <li>Pasul 2</li>
    <li>Pasul 3</li>
</ol>
\`\`\`

## Liste imbricate
\`\`\`html
<ul>
    <li>Fructe
        <ul>
            <li>Mar</li>
            <li>Para</li>
        </ul>
    </li>
    <li>Legume</li>
</ul>
\`\`\`

## Definition list
\`\`\`html
<dl>
    <dt>HTML</dt>
    <dd>Limbaj de marcare</dd>
</dl>
\`\`\`
`,
      problems: [
        mc('Listă cu bullet',
          'Care tag creează o listă cu **bullet-uri** (puncte)?',
          ['<ol>', '<ul>', '<list>', '<dl>'],
          '<ul>',
          '`<ul>` (unordered list) afișează cu puncte/bullet-uri.',
          { topic: 'lists' }),
        mc('Listă numerotată',
          'Care tag creează o listă **numerotată**?',
          ['<ul>', '<ol>', '<num>', '<list ordered>'],
          '<ol>',
          '`<ol>` (ordered list) numerotează automat.',
          { topic: 'lists' }),
        mc('Element listă',
          'Ce tag reprezintă un element din listă?',
          ['<list>', '<item>', '<li>', '<el>'],
          '<li>',
          '`<li>` (list item) este folosit în ambele tipuri de liste.',
          { topic: 'lists' }),
        sa('Definition list',
          'Ce tag pornește o listă de definiții?',
          '<dl>',
          '`<dl>` (definition list), cu `<dt>` (term) și `<dd>` (definition).',
          { topic: 'lists', difficulty: 'MEDIUM' }),
        mc('Liste imbricate',
          'Pot fi liste imbricate?',
          ['Nu', 'Da', 'Doar 2 niveluri', 'Doar ordonate'],
          'Da',
          'Listele pot fi imbricate la orice nivel — pui `<ul>` sau `<ol>` în interiorul unui `<li>`.',
          { topic: 'lists' }),
      ],
    },
    {
      slug: 'div-span',
      title: '7. Structurare (div, span)',
      isFree: false,
      theory: `# Containere generice

## div — block
\`\`\`html
<div>Container bloc — ocupă toată lățimea</div>
<div>Alt rând</div>
\`\`\`

## span — inline
\`\`\`html
<p>Text normal cu <span style="color:red">parte roșie</span> aici.</p>
\`\`\`

## Diferență
- **Display** — div: block • span: inline
- **Linie nouă** — div: Da • span: Nu
- **Folosit pentru** — div: grupuri mari • span: text/elemente mici

## ⚠️ Folosește elemente semantice când e posibil!
În loc de \`<div>\` pentru header, folosește \`<header>\`.
`,
      problems: [
        mc('Display div',
          'Cum se afișează `<div>` implicit?',
          ['inline', 'block', 'flex', 'none'],
          'block',
          '`<div>` ocupă toată lățimea disponibilă (block).',
          { topic: 'structure' }),
        mc('Display span',
          'Cum se afișează `<span>`?',
          ['block', 'inline', 'grid', 'table'],
          'inline',
          '`<span>` rămâne pe aceeași linie cu textul din jur.',
          { topic: 'structure' }),
        mc('Pentru text scurt',
          'Pentru a colora un cuvânt din mijlocul unui paragraf, ce folosești?',
          ['<div>', '<span>', '<p>', '<text>'],
          '<span>',
          '`<span>` este perfect pentru porțiuni mici de text inline.',
          { topic: 'structure', difficulty: 'MEDIUM' }),
        mc('Linie nouă',
          'Care produce automat o linie nouă?',
          ['<span>', '<div>', '<a>', '<em>'],
          '<div>',
          '`<div>` este block, deci începe pe linie nouă.',
          { topic: 'structure' }),
        sa('Container generic',
          'Care tag e cel mai folosit pentru a grupa elemente bloc fără sens semantic?',
          '<div>',
          '`<div>` e containerul generic block standard.',
          { topic: 'structure' }),
      ],
    },
    {
      slug: 'atribute',
      title: '8. Atribute (class, id, title)',
      isFree: false,
      theory: `# Atribute HTML

Atributele oferă **informații suplimentare** despre tag-uri.

\`\`\`html
<div class="card" id="main" title="Tooltip text">
    Conținut
</div>
\`\`\`

## class
- **Multiple** elemente pot avea același class
- Folosit pentru CSS / JS
\`\`\`html
<p class="text-rosu">Hello</p>
<p class="text-rosu">Lume</p>
\`\`\`

## id
- **Unic** pe pagină
- Folosit pentru anchors / JS
\`\`\`html
<section id="contact">...</section>
\`\`\`

## title
- Tooltip la hover

## Atribute multiple
\`\`\`html
<a href="#" class="btn" id="trimite" title="Click aici">Trimite</a>
\`\`\`
`,
      problems: [
        mc('Class unic?',
          'Pot mai multe elemente să aibă același `class`?',
          ['Nu', 'Da', 'Doar div', 'Doar span'],
          'Da',
          '`class` poate fi reutilizat. Doar `id` trebuie să fie unic.',
          { topic: 'attributes' }),
        mc('ID unic',
          'Câte elemente pot avea același `id`?',
          ['Maxim 1 (unic)', '2', 'Nelimitat', '5'],
          'Maxim 1 (unic)',
          'ID trebuie să fie **unic** pe pagină pentru a funcționa corect cu CSS/JS.',
          { topic: 'attributes', difficulty: 'MEDIUM' }),
        mc('Tooltip',
          'Ce atribut afișează un tooltip la hover?',
          ['tip', 'tooltip', 'title', 'alt'],
          'title',
          '`title` afișează un mic popup la hover.',
          { topic: 'attributes' }),
        mc('Multiple classes',
          'Cum dai mai multe clase unui element?',
          ['class="a, b"', 'class="a b"', 'class=["a","b"]', 'class="a"+"b"'],
          'class="a b"',
          'Multiple clase se separă prin **spațiu**.',
          { topic: 'attributes', difficulty: 'MEDIUM' }),
        sa('Atribut clase',
          'Ce atribut folosește CSS pentru a stila elemente?',
          'class',
          '`class` este preferat în CSS modern (selector `.nume`).',
          { topic: 'attributes' }),
      ],
    },
    {
      slug: 'tabele',
      title: '9. Tabele (table, tr, td)',
      isFree: false,
      theory: `# Tabele

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
            <td>12</td>
        </tr>
        <tr>
            <td>Ion</td>
            <td>13</td>
        </tr>
    </tbody>
</table>
\`\`\`

## Tag-uri
- **table** — tabelul
- **tr** — rând (table row)
- **th** — celulă header
- **td** — celulă data

## colspan / rowspan
\`\`\`html
<td colspan="2">Ocupă 2 coloane</td>
<td rowspan="3">Ocupă 3 rânduri</td>
\`\`\`
`,
      problems: [
        mc('Rând',
          'Ce tag e un rând în tabel?',
          ['<row>', '<tr>', '<rd>', '<td>'],
          '<tr>',
          '`<tr>` (table row) este un rând.',
          { topic: 'tables' }),
        mc('Celulă',
          'Ce tag e o celulă obișnuită?',
          ['<cell>', '<td>', '<tc>', '<col>'],
          '<td>',
          '`<td>` (table data) este o celulă obișnuită.',
          { topic: 'tables' }),
        mc('Header',
          'Ce tag e o celulă header?',
          ['<th>', '<header>', '<td-h>', '<head>'],
          '<th>',
          '`<th>` (table header) — text bold și centrat implicit.',
          { topic: 'tables' }),
        mc('colspan',
          'Ce face `colspan="3"`?',
          ['Sortează 3 coloane', 'Celula ocupă 3 coloane', 'Ascunde 3 coloane', 'Adaugă 3 rânduri'],
          'Celula ocupă 3 coloane',
          '`colspan` mărește celula peste mai multe coloane.',
          { topic: 'tables', difficulty: 'MEDIUM' }),
        sa('Tabel rădăcină',
          'Ce tag pornește un tabel?',
          '<table>',
          '`<table>` e elementul rădăcină al unui tabel.',
          { topic: 'tables' }),
      ],
    },
    {
      slug: 'formulare-intro',
      title: '10. Formulare (introducere)',
      isFree: false,
      theory: `# Formulare

\`\`\`html
<form action="/submit" method="POST">
    <input type="text" name="nume">
    <button type="submit">Trimite</button>
</form>
\`\`\`

## Atribute form
- **action** — unde se trimit datele
- **method** — GET sau POST

## input — câmp de introducere
\`\`\`html
<input type="text" name="nume" placeholder="Numele tău">
\`\`\`

## button
\`\`\`html
<button type="submit">Trimite</button>
<button type="reset">Resetează</button>
\`\`\`

## name — esențial!
Fără \`name\`, datele NU se trimit la server.
`,
      problems: [
        mc('Tag form',
          'Care tag este containerul unui formular?',
          ['<input>', '<form>', '<submit>', '<post>'],
          '<form>',
          '`<form>` grupează toate câmpurile.',
          { topic: 'forms' }),
        mc('Method',
          'Ce specifică `method` în form?',
          ['Tipul input-ului', 'GET sau POST', 'Validarea', 'Stilul'],
          'GET sau POST',
          '`method="POST"` trimite datele în corpul cererii; GET le pune în URL.',
          { topic: 'forms' }),
        mc('Buton trimitere',
          'Ce tip are butonul de submit?',
          ['type="send"', 'type="submit"', 'type="form"', 'type="button"'],
          'type="submit"',
          '`type="submit"` declanșează trimiterea formularului.',
          { topic: 'forms' }),
        mc('Atributul name',
          'De ce e important `name` pe inputuri?',
          ['Pentru CSS', 'Pentru a identifica datele la server', 'Pentru SEO', 'Pentru animații'],
          'Pentru a identifica datele la server',
          'Fără `name`, valoarea nu se trimite la server (cheie/valoare).',
          { topic: 'forms', difficulty: 'MEDIUM' }),
        sa('Action',
          'Ce atribut specifică URL-ul unde se trimit datele?',
          'action',
          '`action="/url"` definește destinația.',
          { topic: 'forms' }),
      ],
    },
    {
      slug: 'tipuri-input',
      title: '11. Tipuri de input',
      isFree: false,
      theory: `# Tipuri de input

\`\`\`html
<input type="text" name="nume">
<input type="password" name="parola">
<input type="email" name="email">
<input type="number" name="varsta" min="1" max="120">
<input type="date" name="data">
<input type="checkbox" name="agree"> Sunt de acord
<input type="radio" name="sex" value="M"> M
<input type="radio" name="sex" value="F"> F
<input type="file" name="poza">
<input type="color" name="culoare">
<input type="range" min="0" max="100">
\`\`\`

## Atribute utile
- **placeholder** — text gri
- **value** — valoare implicită
- **disabled** / **readonly**
- **required** — obligatoriu
`,
      problems: [
        mc('Parolă',
          'Ce type ascunde caracterele introduse?',
          ['hidden', 'password', 'secret', 'private'],
          'password',
          '`type="password"` afișează `••••` în loc de caractere.',
          { topic: 'inputs' }),
        mc('Email',
          'Ce type validează automat formatul email?',
          ['text', 'email', 'mail', 'address'],
          'email',
          '`type="email"` cere un format valid (cu @).',
          { topic: 'inputs' }),
        mc('Bifa',
          'Ce type creează un checkbox?',
          ['check', 'box', 'checkbox', 'tick'],
          'checkbox',
          '`type="checkbox"` permite selecție multiplă.',
          { topic: 'inputs' }),
        mc('Radio',
          'Pentru o singură alegere din mai multe variante:',
          ['checkbox', 'radio', 'select', 'option'],
          'radio',
          'Radio buttons cu același `name` permit doar o alegere.',
          { topic: 'inputs', difficulty: 'MEDIUM' }),
        mc('Număr',
          'Ce type acceptă doar numere?',
          ['text', 'numeric', 'number', 'int'],
          'number',
          '`type="number"` afișează săgeți și acceptă doar cifre.',
          { topic: 'inputs' }),
      ],
    },
    {
      slug: 'label-validare',
      title: '12. Label + validare',
      isFree: false,
      theory: `# Label și validare

## label — etichetă
\`\`\`html
<label for="email">Email:</label>
<input type="email" id="email" name="email">

<!-- sau înăuntru -->
<label>
    Email:
    <input type="email" name="email">
</label>
\`\`\`

## placeholder
\`\`\`html
<input type="text" placeholder="Introdu numele">
\`\`\`

## required
\`\`\`html
<input type="text" required>
\`\`\`

## pattern (regex)
\`\`\`html
<input type="text" pattern="[A-Za-z]+">
\`\`\`

## Validări automate
- **type="email"** — verifică @
- **min/max** pentru number
- **minlength/maxlength** pentru text
`,
      problems: [
        mc('label for',
          'Ce conectează `<label for="x">` cu un input?',
          ['ID-ul input-ului = "x"', 'name-ul input-ului', 'class', 'tip'],
          'ID-ul input-ului = "x"',
          'Atributul `for` se potrivește cu `id` al input-ului.',
          { topic: 'forms', difficulty: 'MEDIUM' }),
        mc('placeholder',
          'La ce servește `placeholder`?',
          ['Validare', 'Text gri ajutător afișat când input-ul e gol', 'Buton', 'Stil'],
          'Text gri ajutător afișat când input-ul e gol',
          '`placeholder` arată un hint care dispare la tastare.',
          { topic: 'forms' }),
        mc('Câmp obligatoriu',
          'Ce atribut face un câmp obligatoriu?',
          ['must', 'required', 'mandatory', 'force'],
          'required',
          '`required` blochează submit-ul dacă câmpul e gol.',
          { topic: 'forms' }),
        mc('Lungime max',
          'Pentru a limita un text la 50 caractere:',
          ['max="50"', 'maxlength="50"', 'limit="50"', 'size="50"'],
          'maxlength="50"',
          '`maxlength` limitează numărul de caractere în text/textarea.',
          { topic: 'forms', difficulty: 'MEDIUM' }),
        sa('Validare',
          'Ce atribut acceptă un regex pentru validare?',
          'pattern',
          '`pattern="..."` rulează regex-ul la submit.',
          { topic: 'forms', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'semantic',
      title: '13. Elemente semantice (header, footer, section)',
      isFree: false,
      theory: `# HTML semantic (IMPORTANT pentru SEO!)

În loc de \`<div>\` peste tot, folosim tag-uri cu **sens**:

\`\`\`html
<header>
    <h1>Site-ul meu</h1>
    <nav>...</nav>
</header>

<main>
    <article>
        <h2>Titlu articol</h2>
        <p>Conținut...</p>
    </article>

    <aside>
        <p>Sidebar</p>
    </aside>
</main>

<footer>
    <p>&copy; 2025</p>
</footer>
\`\`\`

## Tag-uri semantice
- **header** — antet (logo, meniu)
- **nav** — navigație
- **main** — conținut principal
- **article** — conținut independent
- **section** — grupare tematică
- **aside** — bară laterală
- **footer** — subsol

## De ce contează?
- **SEO** mai bun (Google înțelege)
- **Accesibilitate** (cititoare de ecran)
- **Cod mai clar**
`,
      problems: [
        mc('Antet',
          'Ce tag semantic e antetul paginii?',
          ['<top>', '<header>', '<head>', '<title>'],
          '<header>',
          '`<header>` reprezintă antetul (vizibil), `<head>` e meta-data (invizibilă).',
          { topic: 'semantic' }),
        mc('Navigație',
          'Ce tag e ideal pentru meniu?',
          ['<menu>', '<nav>', '<list>', '<ul>'],
          '<nav>',
          '`<nav>` indică o secțiune de navigare.',
          { topic: 'semantic' }),
        mc('Conținut principal',
          'Ce tag delimitează conținutul principal?',
          ['<content>', '<main>', '<body>', '<center>'],
          '<main>',
          '`<main>` e conținutul unic al paginii (un singur per pagină).',
          { topic: 'semantic', difficulty: 'MEDIUM' }),
        mc('Articol',
          'Pentru un blog post, ce e ideal?',
          ['<post>', '<article>', '<blog>', '<entry>'],
          '<article>',
          '`<article>` e pentru conținut independent, distribuibil.',
          { topic: 'semantic', difficulty: 'MEDIUM' }),
        sa('Subsol',
          'Ce tag semantic e subsolul?',
          '<footer>',
          '`<footer>` conține informații de jos (copyright, linkuri).',
          { topic: 'semantic' }),
      ],
    },
    {
      slug: 'media',
      title: '14. Media (audio, video)',
      isFree: false,
      theory: `# Audio și Video

## Audio
\`\`\`html
<audio controls>
    <source src="muzica.mp3" type="audio/mpeg">
    Browserul nu suportă audio.
</audio>
\`\`\`

## Video
\`\`\`html
<video width="640" controls>
    <source src="film.mp4" type="video/mp4">
</video>
\`\`\`

## Atribute
- **controls** — afișează play/pause
- **autoplay** — pornește automat
- **loop** — se repetă
- **muted** — pornește fără sunet
- **poster** — imagine inițială (video)

## Format-uri suportate
- Audio: mp3, ogg, wav
- Video: mp4, webm, ogg
`,
      problems: [
        mc('Audio',
          'Ce tag inserează un fișier audio?',
          ['<sound>', '<audio>', '<music>', '<mp3>'],
          '<audio>',
          '`<audio>` cu `<source>` interior pentru fișier.',
          { topic: 'media' }),
        mc('Video',
          'Ce tag inserează un video?',
          ['<movie>', '<video>', '<film>', '<media>'],
          '<video>',
          '`<video>` cu `<source>` similar cu audio.',
          { topic: 'media' }),
        mc('Play/pause',
          'Ce atribut afișează butoanele de control?',
          ['ui', 'controls', 'buttons', 'show'],
          'controls',
          '`controls` afișează interfața nativă a browserului.',
          { topic: 'media' }),
        mc('Format video standard',
          'Care e cel mai comun format video pe web?',
          ['avi', 'mov', 'mp4', 'wmv'],
          'mp4',
          'mp4 (H.264) e suportat de toate browserele moderne.',
          { topic: 'media' }),
        sa('Imagine inițială video',
          'Ce atribut setează imaginea afișată înainte de play?',
          'poster',
          '`poster="img.jpg"` arată o imagine până se dă play.',
          { topic: 'media', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'iframe',
      title: '15. Iframe (embed)',
      isFree: false,
      theory: `# Iframe — embed altă pagină

\`\`\`html
<iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    width="560"
    height="315"
    frameborder="0"
    allowfullscreen>
</iframe>
\`\`\`

## YouTube
\`\`\`html
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    width="560" height="315" frameborder="0" allowfullscreen></iframe>
\`\`\`

## Google Maps
\`\`\`html
<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>
\`\`\`

## ⚠️ Securitate
- Folosește \`sandbox\` pentru izolare
- Nu permite iframe pentru utilizatori (XSS!)

\`\`\`html
<iframe src="..." sandbox="allow-scripts"></iframe>
\`\`\`
`,
      problems: [
        mc('Tag embed',
          'Ce tag inserează altă pagină în pagina ta?',
          ['<embed>', '<iframe>', '<frame>', '<include>'],
          '<iframe>',
          '`<iframe>` (inline frame) embed-ează un alt URL.',
          { topic: 'iframe' }),
        mc('YouTube',
          'Pentru YouTube, ce URL folosești în src?',
          ['watch?v=ID', 'embed/ID', 'video/ID', 'player/ID'],
          'embed/ID',
          'Versiunea de embed: `youtube.com/embed/VIDEO_ID`.',
          { topic: 'iframe', difficulty: 'MEDIUM' }),
        mc('Securitate',
          'Ce atribut izolează un iframe?',
          ['secure', 'sandbox', 'safe', 'isolate'],
          'sandbox',
          '`sandbox` restricționează ce poate face iframe-ul.',
          { topic: 'iframe', difficulty: 'HARD' }),
        mc('Allow fullscreen',
          'Pentru video full-screen în iframe:',
          ['fullscreen', 'allow-fs', 'allowfullscreen', 'maximize'],
          'allowfullscreen',
          '`allowfullscreen` permite butonul de full-screen.',
          { topic: 'iframe', difficulty: 'MEDIUM' }),
        sa('Atribut URL',
          'Ce atribut conține URL-ul în iframe?',
          'src',
          '`src` (source) — același ca la `<img>`.',
          { topic: 'iframe' }),
      ],
    },
    {
      slug: 'meta-tags',
      title: '16. Meta tags (SEO)',
      isFree: false,
      theory: `# Meta tags

Se pun în \`<head>\` și nu sunt vizibile, dar **esențiale** pentru SEO și mobile.

## Charset
\`\`\`html
<meta charset="UTF-8">
\`\`\`

## Viewport (responsive)
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

## SEO
\`\`\`html
<meta name="description" content="Descrierea paginii pentru Google">
<meta name="keywords" content="cuvinte, cheie">
<meta name="author" content="Numele tău">
\`\`\`

## Open Graph (Facebook, etc.)
\`\`\`html
<meta property="og:title" content="Titlu pentru Facebook">
<meta property="og:image" content="img.jpg">
\`\`\`

## Title (afectează SEO direct)
\`\`\`html
<title>Titlul paginii — apare în tab</title>
\`\`\`
`,
      problems: [
        mc('Charset',
          'Ce charset se recomandă universal?',
          ['ASCII', 'ISO-8859-1', 'UTF-8', 'Windows-1250'],
          'UTF-8',
          'UTF-8 suportă toate caracterele (inclusiv diacritice).',
          { topic: 'meta' }),
        mc('Viewport',
          'La ce servește viewport meta?',
          ['SEO', 'Responsive design pe mobile', 'Securitate', 'Animații'],
          'Responsive design pe mobile',
          'Fără viewport, mobile-ul afișează pagina foarte mică.',
          { topic: 'meta', difficulty: 'MEDIUM' }),
        mc('SEO description',
          'Care meta apare în rezultatele Google?',
          ['title', 'description', 'keywords', 'og:image'],
          'description',
          '`<meta name="description">` apare ca text descriptiv în Google.',
          { topic: 'meta', difficulty: 'MEDIUM' }),
        mc('Tab',
          'Ce afișează `<title>`?',
          ['Antetul paginii', 'Textul din tab-ul browserului', 'Comentarii', 'Footer'],
          'Textul din tab-ul browserului',
          '`<title>` e textul din titlul tab-ului și e folosit de Google.',
          { topic: 'meta' }),
        sa('Open Graph',
          'Ce prefix au meta-tag-urile pentru Facebook share?',
          'og:',
          'Open Graph: `<meta property="og:title">`, `og:image`, etc.',
          { topic: 'meta', difficulty: 'MEDIUM' }),
      ],
    },
    {
      slug: 'html-css-intro',
      title: '17. HTML + CSS (intro)',
      isFree: false,
      theory: `# Cum legi CSS de HTML?

## 1. Inline (în atribut)
\`\`\`html
<p style="color: red;">Text roșu</p>
\`\`\`
**Evită** — greu de menținut.

## 2. Internal (în head)
\`\`\`html
<head>
    <style>
        p { color: blue; }
    </style>
</head>
\`\`\`

## 3. External (recomandat!)
\`\`\`html
<head>
    <link rel="stylesheet" href="style.css">
</head>
\`\`\`

\`style.css\`:
\`\`\`css
p { color: green; }
\`\`\`

## Prioritate (specificitate)
inline > internal > external (sau ordinea de încărcare)
`,
      problems: [
        mc('Recomandat',
          'Care metodă de adăugare CSS e recomandată?',
          ['inline', 'internal', 'external (link)', 'JavaScript'],
          'external (link)',
          'External — un singur loc, ușor de mentenanță, cache.',
          { topic: 'css-link' }),
        mc('Tag intern',
          'Ce tag conține CSS în pagină?',
          ['<css>', '<style>', '<script>', '<link>'],
          '<style>',
          '`<style>` în head conține reguli CSS.',
          { topic: 'css-link' }),
        mc('Link extern',
          'Ce tag include un fișier CSS extern?',
          ['<style>', '<link>', '<import>', '<css>'],
          '<link>',
          '`<link rel="stylesheet" href="style.css">` în head.',
          { topic: 'css-link' }),
        mc('rel pentru CSS',
          'Ce valoare are atributul `rel` pentru CSS?',
          ['css', 'style', 'stylesheet', 'link'],
          'stylesheet',
          '`rel="stylesheet"` indică că link-ul e o foaie de stil.',
          { topic: 'css-link', difficulty: 'MEDIUM' }),
        sa('Atribut HREF link',
          'Ce atribut conține path-ul fișierului CSS în `<link>`?',
          'href',
          '`<link rel="stylesheet" href="style.css">`.',
          { topic: 'css-link' }),
      ],
    },
    {
      slug: 'html-js-intro',
      title: '18. HTML + JS (intro)',
      isFree: false,
      theory: `# Cum legi JavaScript?

## 1. Inline (eveniment)
\`\`\`html
<button onclick="alert('Salut!')">Click</button>
\`\`\`
**Evită** — greu de mentenanță.

## 2. Internal
\`\`\`html
<script>
    console.log("Salut!");
</script>
\`\`\`

## 3. External (recomandat!)
\`\`\`html
<script src="script.js"></script>
\`\`\`

## Unde pui \`<script>\`?
- **La sfârșitul body-ului** — pagina se încarcă întâi
- Sau cu **defer** în head:
\`\`\`html
<script src="app.js" defer></script>
\`\`\`

## ⚠️ async vs defer
- **defer** — așteaptă HTML, apoi rulează (în ordine)
- **async** — rulează imediat ce s-a descărcat
`,
      problems: [
        mc('Tag JS',
          'Ce tag introduce JavaScript?',
          ['<js>', '<script>', '<code>', '<style>'],
          '<script>',
          '`<script>` poate avea cod inline sau să facă referință externă.',
          { topic: 'js-link' }),
        mc('Atribut sursă',
          'Ce atribut conține path-ul fișierului JS?',
          ['href', 'src', 'url', 'path'],
          'src',
          '`<script src="app.js"></script>`.',
          { topic: 'js-link' }),
        mc('Unde plasezi script?',
          'Pentru a NU bloca încărcarea paginii:',
          ['Începutul head', 'Sfârșitul body sau cu defer', 'În mijlocul body', 'În footer ascuns'],
          'Sfârșitul body sau cu defer',
          'Astfel HTML se încarcă întâi, apoi rulează scriptul.',
          { topic: 'js-link', difficulty: 'MEDIUM' }),
        mc('defer',
          'Ce face `defer`?',
          ['Rulează imediat', 'Așteaptă HTML, rulează în ordine', 'Anulează scriptul', 'Repetă scriptul'],
          'Așteaptă HTML, rulează în ordine',
          '`defer` întârzie execuția până când HTML e parsat complet.',
          { topic: 'js-link', difficulty: 'HARD' }),
        sa('Tag închidere',
          'Are `<script>` tag de închidere?',
          'Da',
          'Da, `</script>` — chiar și pentru scripturi externe.',
          { topic: 'js-link' }),
      ],
    },
    {
      slug: 'structura-pagina',
      title: '19. Structură pagină reală',
      isFree: false,
      theory: `# Anatomia unei pagini reale

\`\`\`html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Site Demo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Logo</h1>
        <nav>
            <a href="/">Acasă</a>
            <a href="/despre">Despre</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>

    <main>
        <section>
            <h2>Salut!</h2>
            <p>Bun venit pe site.</p>
        </section>

        <section>
            <h2>Servicii</h2>
            <ul>
                <li>Serviciul A</li>
                <li>Serviciul B</li>
            </ul>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Site Demo</p>
    </footer>

    <script src="app.js" defer></script>
</body>
</html>
\`\`\`
`,
      problems: [
        mc('Ordine corectă',
          'Care e ordinea standard în body?',
          ['main → header → footer', 'header → main → footer', 'footer → main → header', 'header → footer → main'],
          'header → main → footer',
          'Logic: antet sus, conținut în mijloc, subsol jos.',
          { topic: 'page-structure' }),
        mc('Lang',
          'La ce servește `<html lang="ro">`?',
          ['Schimbă fontul', 'Indică limba paginii (SEO + accesibilitate)', 'Validare', 'Stil'],
          'Indică limba paginii (SEO + accesibilitate)',
          'Cititoarele de ecran și Google folosesc `lang` pentru pronunție/traducere.',
          { topic: 'page-structure', difficulty: 'MEDIUM' }),
        mc('Charset',
          'Unde se pune `<meta charset>`?',
          ['Începutul body', 'Începutul head', 'Sfârșitul head', 'În script'],
          'Începutul head',
          'Trebuie să fie **primul** în head pentru a fi citit corect.',
          { topic: 'page-structure', difficulty: 'MEDIUM' }),
        mc('Cookie de copyright',
          'Ce caracter HTML afișează simbolul ©?',
          ['&copy;', '©;', '&copyright;', '#169;'],
          '&copy;',
          '`&copy;` este entitatea HTML pentru ©.',
          { topic: 'page-structure', difficulty: 'MEDIUM' }),
        sa('Tag-ul rădăcină',
          'Care e tag-ul rădăcină al unei pagini HTML?',
          '<html>',
          '`<html>` conține `<head>` și `<body>`.',
          { topic: 'page-structure' }),
      ],
    },
    {
      slug: 'mini-proiect-html',
      title: '20. Mini proiect — pagina personală',
      isFree: false,
      theory: `# Mini proiect: pagina personală

Construiește o pagină completă cu:
1. Header cu nume și meniu
2. Secțiune "Despre mine" cu poză
3. Secțiune "Hobby-uri" cu listă
4. Formular contact
5. Footer cu social media

\`\`\`html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Pagina mea</title>
</head>
<body>
    <header>
        <h1>Numele tău</h1>
        <nav>
            <a href="#despre">Despre</a>
            <a href="#hobby">Hobby</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <section id="despre">
            <h2>Despre mine</h2>
            <img src="foto.jpg" alt="Eu" width="200">
            <p>Salut, sunt...</p>
        </section>

        <section id="hobby">
            <h2>Hobby-uri</h2>
            <ul>
                <li>Programare</li>
                <li>Muzică</li>
            </ul>
        </section>

        <section id="contact">
            <h2>Contact</h2>
            <form>
                <label>Nume: <input type="text" required></label><br>
                <label>Email: <input type="email" required></label><br>
                <button type="submit">Trimite</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2025</p>
    </footer>
</body>
</html>
\`\`\`

Acum, încearcă să o construiești tu de la zero!
`,
      problems: [
        mc('Tag pentru poză',
          'Ce tag inserezi pentru poza ta?',
          ['<photo>', '<img>', '<picture>', '<image>'],
          '<img>',
          '`<img src="..." alt="...">` cu atribut `alt` obligatoriu.',
          { topic: 'project' }),
        mc('Listă hobby',
          'Pentru o listă cu bullet-uri:',
          ['<ol>', '<ul>', '<list>', '<menu>'],
          '<ul>',
          '`<ul>` (unordered) afișează cu puncte.',
          { topic: 'project' }),
        mc('Buton trimitere',
          'În formular, ce button trimite?',
          ['type="send"', 'type="submit"', 'type="form"', 'type="button"'],
          'type="submit"',
          '`type="submit"` declanșează submit-ul.',
          { topic: 'project' }),
        mc('Anchor',
          'Pentru a sări la #despre, link-ul are href:',
          ['"despre"', '"#despre"', '"section/despre"', '"@despre"'],
          '"#despre"',
          'Diezul `#` referențiază un id de pe aceeași pagină.',
          { topic: 'project' }),
        sa('Tag semantic conținut',
          'Ce tag delimitează conținutul principal?',
          '<main>',
          '`<main>` reprezintă conținutul unic al paginii.',
          { topic: 'project', difficulty: 'MEDIUM' }),
      ],
    },
  ],
}
