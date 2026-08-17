// Quiz pack pentru HTML — +5 MC per lecție pentru a ajunge la 10 probleme/lecție.

import { mc, sa } from './helpers.mjs'

const introducereStructuraQuiz = [
  sa('Doctype', 'Care e prima linie obligatorie pentru un document HTML5?', '<!DOCTYPE html>', 'Anunță browserul că documentul folosește HTML5.', { topic: 'html-structure' }),
  mc('Tag rădăcină', 'Care tag e rădăcina documentului?', ['<body>', '<html>', '<root>', '<page>'], '<html>', '`<html>` conține `<head>` și `<body>`.', { topic: 'html-structure' }),
  mc('Container metadata', 'Unde plasezi `<title>`, `<meta>`, `<link>`?', ['<body>', '<head>', '<header>', '<main>'], '<head>', 'Tot ce nu e conținut vizibil → `<head>`.', { topic: 'html-structure' }),
  mc('Lang', 'Care atribut declară limba paginii?', ['language', 'lang', 'locale', 'tongue'], 'lang', 'Ex: `<html lang="ro">` — important pentru accesibilitate și SEO.', { topic: 'html-structure' }),
  mc('Charset', 'Cum declari encoding-ul UTF-8?', ['<meta encoding="utf-8">', '<meta charset="UTF-8">', '<charset utf-8>', '<encoding utf-8>'], '<meta charset="UTF-8">', 'Necesar pentru caractere românești (ă, ș, ț).', { topic: 'html-structure' }),
]

const tagUriBazaQuiz = [
  mc('Heading principal', 'Care tag e folosit pentru titlul principal al paginii?', ['<head>', '<h1>', '<title>', '<header>'], '<h1>', 'Există `<h1>` până la `<h6>`. Doar UN `<h1>` per pagină.', { topic: 'tags' }),
  mc('Paragraf', 'Care tag definește un paragraf?', ['<para>', '<p>', '<text>', '<span>'], '<p>', '`<p>` = paragraph.', { topic: 'tags' }),
  mc('Linie nouă', 'Cum forțezi o linie nouă?', ['<newline>', '<br>', '<lf>', '<n>'], '<br>', '`<br>` e self-closing.', { topic: 'tags' }),
  mc('Linie orizontală', 'Care tag desenează o linie orizontală?', ['<line>', '<hr>', '<separator>', '<div line>'], '<hr>', '`<hr>` = horizontal rule.', { topic: 'tags' }),
  mc('Container generic block', 'Care tag e cel mai generic container „block"?', ['<span>', '<div>', '<box>', '<block>'], '<div>', '`<div>` e block-level. `<span>` e inline.', { topic: 'tags' }),
]

const textFormattingQuiz = [
  mc('Bold semantic', 'Care tag indică text IMPORTANT (bold semantic)?', ['<b>', '<strong>', '<bold>', '<important>'], '<strong>', '`<strong>` = importanță. `<b>` = doar vizual.', { topic: 'text', difficulty: 'MEDIUM' }),
  mc('Italic semantic', 'Care tag indică text accentuat (italic semantic)?', ['<i>', '<em>', '<italic>', '<emp>'], '<em>', '`<em>` = emphasis. `<i>` = doar vizual.', { topic: 'text', difficulty: 'MEDIUM' }),
  mc('Underline', 'Care tag subliniază text?', ['<u>', '<underline>', '<line>', '<style>'], '<u>', 'Folosește cu grijă — utilizatorii pot confunda cu link-uri.', { topic: 'text' }),
  mc('Cod inline', 'Care tag formatează cod inline (font monospace)?', ['<code>', '<pre>', '<monospace>', '<terminal>'], '<code>', '`<code>` pentru fragmente. `<pre>` păstrează spațierea.', { topic: 'text' }),
  mc('Citat', 'Care tag indică un citat lung (block)?', ['<quote>', '<blockquote>', '<cite>', '<q>'], '<blockquote>', '`<q>` pentru citate INLINE scurte.', { topic: 'text' }),
]

const linkUriQuiz = [
  sa('Tag link', 'Care tag creează un hyperlink? (doar tag-ul, fără paranteze unghiulare)', 'a', '`<a href="...">text</a>`.', { topic: 'links' }),
  mc('Atribut destinație', 'Care atribut conține URL-ul destinației?', ['src', 'href', 'link', 'url'], 'href', '`<a href="https://...">`.', { topic: 'links' }),
  mc('Tab nou', 'Cum deschizi link-ul într-un tab nou?', ['target="_new"', 'target="_blank"', 'newtab="true"', 'open="new"'], 'target="_blank"', 'Recomandat să adaugi și `rel="noopener"`.', { topic: 'links', difficulty: 'MEDIUM' }),
  mc('Link intern (anchor)', 'Cum legi o secțiune cu `id="contact"`?', ['href="contact"', 'href="#contact"', 'href=".contact"', 'href="@contact"'], 'href="#contact"', '`#` = id al elementului în pagina curentă.', { topic: 'links' }),
  mc('Email', 'Cum creezi un link care deschide email?', ['href="email:..."', 'href="mailto:adresa@x.ro"', 'href="@adresa@x.ro"', 'href="mail:..."'], 'href="mailto:adresa@x.ro"', 'Browserul deschide aplicația de email.', { topic: 'links' }),
]

const imaginiQuiz = [
  sa('Tag imagine', 'Ce tag inserează o imagine? (doar tag-ul, fără paranteze)', 'img', '`<img src="..." alt="...">` — self-closing.', { topic: 'images' }),
  mc('Atribut sursă', 'Care atribut conține calea fișierului imagine?', ['href', 'src', 'path', 'file'], 'src', '`src="poza.jpg"`.', { topic: 'images' }),
  mc('Atribut alt', 'De ce e important `alt`?', ['Pentru viteză', 'Pentru SEO și accesibilitate (screen readers)', 'Pentru stil', 'Nu e important'], 'Pentru SEO și accesibilitate (screen readers)', 'Și se afișează dacă imaginea nu se încarcă.', { topic: 'images', difficulty: 'MEDIUM' }),
  mc('Format modern', 'Care format e modern, cu compresie superioară?', ['BMP', 'WebP', 'TIFF', 'ICO'], 'WebP', 'WebP/AVIF — compresie mai bună decât JPG/PNG.', { topic: 'images' }),
  mc('Lazy loading', 'Cum activezi încărcarea leneșă?', ['lazy="true"', 'loading="lazy"', 'defer="image"', 'async'], 'loading="lazy"', 'Browserul încarcă imaginea doar când se apropie de viewport.', { topic: 'images', difficulty: 'MEDIUM' }),
]

const listeQuiz = [
  mc('Listă neordonată', 'Care tag e listă cu bullets?', ['<ol>', '<ul>', '<list>', '<dl>'], '<ul>', '`<ul>` = unordered list. Conține `<li>`-uri.', { topic: 'lists' }),
  mc('Listă ordonată', 'Care tag e listă numerotată?', ['<ol>', '<ul>', '<nl>', '<order>'], '<ol>', '`<ol>` = ordered list.', { topic: 'lists' }),
  mc('Element listă', 'Care tag e un element în listă?', ['<item>', '<li>', '<el>', '<entry>'], '<li>', '`<li>` = list item.', { topic: 'lists' }),
  mc('Tip numerotare', 'Cum schimbi numerotarea în litere (a, b, c)?', ['<ol type="a">', '<ol style="abc">', '<ol letters>', '<ol-letters>'], '<ol type="a">', 'Valori: `1`, `a`, `A`, `i`, `I`.', { topic: 'lists', difficulty: 'MEDIUM' }),
  mc('Listă definiții', 'Care tag e o listă de definiții (termen + descriere)?', ['<dl>', '<def>', '<glossary>', '<list-def>'], '<dl>', '`<dl>` cu `<dt>` (termen) și `<dd>` (descriere).', { topic: 'lists', difficulty: 'MEDIUM' }),
]

const divSpanQuiz = [
  mc('Block vs inline', '`<div>` este…', ['inline', 'block', 'inline-block', 'flex'], 'block', '`<div>` ocupă toată lățimea. `<span>` e inline.', { topic: 'div-span' }),
  mc('Span pentru', 'Pentru ce e ideal `<span>`?', ['Sectiuni mari', 'Bucăți mici de text inline', 'Layout', 'Forms'], 'Bucăți mici de text inline', 'Ex: stilul unui cuvânt într-o propoziție.', { topic: 'div-span' }),
  mc('Atribut clasă', 'Cum aplici aceeași clasă mai multor elemente?', ['id="x"', 'class="x"', 'name="x"', 'tag="x"'], 'class="x"', '`class` poate fi reutilizat. `id` trebuie unic.', { topic: 'div-span' }),
  mc('Atribut ID', '`id` în HTML trebuie să fie…', ['Reutilizabil', 'UNIC pe pagină', 'Doar litere', 'Doar cifre'], 'UNIC pe pagină', 'JS și CSS se bazează pe această unicitate.', { topic: 'div-span' }),
  mc('Multiple clase', 'Cum aplici DOUĂ clase aceluiași element?', ['class="a, b"', 'class="a b"', 'classes="a, b"', 'class="a"+"b"'], 'class="a b"', 'Separate prin spațiu.', { topic: 'div-span' }),
]

const atributeQuiz = [
  mc('Sintaxă atribut', 'Sintaxa corectă pentru un atribut?', ['nume:valoare', 'nume="valoare"', 'nume=valoare;', 'nume[valoare]'], 'nume="valoare"', '`<a href="x.html">`.', { topic: 'atribute' }),
  mc('title', 'Ce face atributul `title`?', ['Setează titlul paginii', 'Afișează tooltip la hover', 'Bold-uiește text', 'Schimbă URL-ul'], 'Afișează tooltip la hover', 'Apare după ~1s de hover.', { topic: 'atribute' }),
  mc('hidden', 'Ce face atributul `hidden`?', ['Șterge elementul', 'Ascunde vizual elementul', 'Blurează', 'Mut'], 'Ascunde vizual elementul', 'Echivalent cu `display: none`.', { topic: 'atribute' }),
  mc('data-*', 'Pentru ce e atributul custom `data-x`?', ['Validare', 'Stocare date custom accesibile din JS', 'SEO', 'Securitate'], 'Stocare date custom accesibile din JS', 'Ex: `<div data-id="42">`, accesat ca `el.dataset.id`.', { topic: 'atribute', difficulty: 'MEDIUM' }),
  mc('Boolean attribute', 'Cum scrii corect un atribut boolean (ex: disabled)?', ['disabled="true"', 'disabled="1"', 'disabled', 'disabled=on'], 'disabled', 'Prezența atributului = true. Lipsa = false. (Sau `disabled=""`.)', { topic: 'atribute', difficulty: 'MEDIUM' }),
]

const tabeleQuiz = [
  mc('Tabel container', 'Care tag deschide un tabel?', ['<grid>', '<table>', '<tab>', '<rows>'], '<table>', '`<table>` conține `<tr>` (rânduri).', { topic: 'tables' }),
  mc('Rând', 'Care tag e un rând?', ['<row>', '<tr>', '<line>', '<r>'], '<tr>', '`tr` = table row.', { topic: 'tables' }),
  mc('Celulă date', 'Care tag e o celulă de date?', ['<cell>', '<td>', '<c>', '<col>'], '<td>', '`td` = table data.', { topic: 'tables' }),
  mc('Celulă header', 'Care tag e o celulă header (bold + centrată)?', ['<thead>', '<th>', '<header>', '<h>'], '<th>', '`th` = table header. De obicei în primul `<tr>`.', { topic: 'tables' }),
  mc('Merge celule orizontal', 'Care atribut face o celulă să acopere mai multe COLOANE?', ['rowspan', 'colspan', 'merge', 'span'], 'colspan', '`colspan="2"` = celula ocupă 2 coloane.', { topic: 'tables', difficulty: 'MEDIUM' }),
]

const formulareIntroQuiz = [
  sa('Tag form', 'Ce tag deschide un formular? (doar tag-ul, fără paranteze)', 'form', '`<form action="..." method="post">`.', { topic: 'forms' }),
  mc('action', 'Ce conține atributul `action`?', ['Numele formularului', 'URL-ul unde se trimit datele', 'Mesajul de succes', 'Method-ul HTTP'], 'URL-ul unde se trimit datele', 'Ex: `action="/submit"`.', { topic: 'forms' }),
  mc('method', 'Care e diferența între `GET` și `POST`?', ['Niciuna', 'GET trimite date în URL; POST în body', 'POST e mai rapid', 'GET e doar pentru imagini'], 'GET trimite date în URL; POST în body', 'POST recomandat pentru parole sau date sensibile.', { topic: 'forms', difficulty: 'MEDIUM' }),
  mc('Trimitere', 'Care input trimite formularul?', ['<input type="send">', '<input type="submit">', '<button type="post">', '<send>'], '<input type="submit">', 'Sau `<button type="submit">Trimite</button>`.', { topic: 'forms' }),
  mc('Reset', 'Cum resetezi câmpurile formularului?', ['<input type="reset">', '<button reset>', '<clear>', '<cancel>'], '<input type="reset">', 'Sau `<button type="reset">`.', { topic: 'forms' }),
]

const tipuriInputQuiz = [
  mc('Email', 'Care tip oferă validare automată email?', ['type="text"', 'type="email"', 'type="mail"', 'type="@"'], 'type="email"', 'Browserul refuză submit dacă nu e format email valid.', { topic: 'inputs' }),
  mc('Parolă', 'Care tip ascunde caracterele introduse?', ['type="hidden"', 'type="password"', 'type="secret"', 'type="text"'], 'type="password"', 'Afișează `•••`.', { topic: 'inputs' }),
  mc('Număr', 'Care tip permite doar numere (cu săgețile +/-)?', ['type="num"', 'type="number"', 'type="int"', 'type="digit"'], 'type="number"', 'Acceptă atribute `min`, `max`, `step`.', { topic: 'inputs' }),
  mc('Dată', 'Care tip afișează un date picker?', ['type="time"', 'type="date"', 'type="datepicker"', 'type="calendar"'], 'type="date"', 'Există și `datetime-local`, `time`, `month`.', { topic: 'inputs' }),
  mc('Checkbox', 'Care tip permite selectare multiplă (bifare)?', ['radio', 'checkbox', 'select', 'toggle'], 'checkbox', 'Pentru o singură alegere din mai multe → `radio`.', { topic: 'inputs' }),
]

const labelValidareQuiz = [
  mc('Atribut for', 'În `<label for="x">`, valoarea `x` trebuie să fie…', ['name al input-ului', 'id al input-ului', 'class', 'placeholder'], 'id al input-ului', 'Click pe label focusează input-ul cu acel id.', { topic: 'forms', difficulty: 'MEDIUM' }),
  mc('required', 'Cum marchezi un input ca obligatoriu?', ['mandatory', 'required', 'must', 'needed'], 'required', '`<input required>` — boolean attribute.', { topic: 'forms' }),
  mc('placeholder', 'Ce face `placeholder="..."`?', ['Validează input', 'Afișează text gri (sugestie) când input e gol', 'Setează valoarea default', 'Bold text'], 'Afișează text gri (sugestie) când input e gol', 'Dispare la tastare. NU e o valoare reală.', { topic: 'forms' }),
  mc('pattern', 'Ce face atributul `pattern`?', ['Stylează input', 'Validare cu regex', 'Înlocuiește text', 'Animație'], 'Validare cu regex', 'Ex: `pattern="[0-9]{4}"` = exact 4 cifre.', { topic: 'forms', difficulty: 'MEDIUM' }),
  mc('minlength', 'Ce face `minlength="5"`?', ['Maxim 5 caractere', 'Minim 5 caractere', 'Exact 5', 'Ignoră spații'], 'Minim 5 caractere', 'Pereche cu `maxlength`.', { topic: 'forms' }),
]

const semanticQuiz = [
  mc('Header pagină', 'Care tag e antetul site-ului (logo, nav)?', ['<top>', '<header>', '<head>', '<banner>'], '<header>', 'NU confunda cu `<head>`!', { topic: 'semantic' }),
  mc('Navigare', 'Care tag conține meniul principal?', ['<menu>', '<nav>', '<links>', '<navigation>'], '<nav>', 'Conține de obicei un `<ul>` cu link-uri.', { topic: 'semantic' }),
  mc('Conținut principal', 'Care tag înconjoară conținutul UNIC al paginii?', ['<content>', '<main>', '<body>', '<page>'], '<main>', 'Doar UN `<main>` per pagină.', { topic: 'semantic' }),
  mc('Articol', 'Care tag reprezintă o piesă de conținut independentă?', ['<post>', '<article>', '<story>', '<news>'], '<article>', 'Ex: post de blog, comentariu, știre — reutilizabil de sine stătător.', { topic: 'semantic', difficulty: 'MEDIUM' }),
  mc('Subsol', 'Care tag e subsolul?', ['<bottom>', '<footer>', '<end>', '<foot>'], '<footer>', 'De obicei copyright, link-uri secundare, contact.', { topic: 'semantic' }),
]

const mediaQuiz = [
  mc('Audio', 'Care tag inserează un fișier audio?', ['<sound>', '<audio>', '<music>', '<mp3>'], '<audio>', '`<audio src="..." controls>`.', { topic: 'media' }),
  mc('Video', 'Care tag inserează video?', ['<media>', '<video>', '<film>', '<mp4>'], '<video>', '`<video src="..." controls>`.', { topic: 'media' }),
  mc('controls', 'Ce face atributul `controls` la `<video>`?', ['Auto-play', 'Afișează butoanele play/pause/volum', 'Loop', 'Mut'], 'Afișează butoanele play/pause/volum', 'Fără `controls`, video-ul nu are interfață.', { topic: 'media' }),
  mc('autoplay', 'Pentru autoplay fără sunet, ce atribute pui?', ['autoplay', 'autoplay muted', 'play silent', 'autostart'], 'autoplay muted', 'Browserele moderne BLOCHEAZĂ autoplay cu sunet.', { topic: 'media', difficulty: 'MEDIUM' }),
  mc('Source', 'Care tag oferă mai multe formate alternative?', ['<format>', '<source>', '<alt>', '<file>'], '<source>', '`<video><source src="x.mp4"><source src="x.webm"></video>`.', { topic: 'media', difficulty: 'MEDIUM' }),
]

const iframeQuiz = [
  sa('Tag iframe', 'Ce tag inserează altă pagină în pagina curentă? (doar tag-ul, fără paranteze)', 'iframe', '`<iframe src="..."></iframe>`.', { topic: 'iframe' }),
  mc('Atribut sursă iframe', 'Care atribut e URL-ul iframe-ului?', ['href', 'src', 'url', 'link'], 'src', 'La fel ca la `<img>`.', { topic: 'iframe' }),
  mc('Securitate', 'Care atribut restricționează ce poate face iframe-ul?', ['secure', 'sandbox', 'safe', 'protect'], 'sandbox', '`sandbox` blochează scripturi, formulare, etc.', { topic: 'iframe', difficulty: 'MEDIUM' }),
  mc('YouTube', 'Pentru a încorpora YouTube, folosești de obicei…', ['<video>', '<iframe>', '<embed>', '<youtube>'], '<iframe>', 'YouTube oferă cod iframe gata făcut.', { topic: 'iframe' }),
  mc('Lazy iframe', 'Cum activezi încărcarea leneșă pentru iframe?', ['lazy', 'loading="lazy"', 'defer', 'async'], 'loading="lazy"', 'La fel ca la imagini.', { topic: 'iframe' }),
]

const metaTagsQuiz = [
  mc('Description', 'Care meta apare în rezultatele Google?', ['<meta name="title">', '<meta name="description">', '<meta name="page">', '<meta name="info">'], '<meta name="description">', 'Recomandat ~155 caractere.', { topic: 'meta', difficulty: 'MEDIUM' }),
  mc('Viewport', 'Pentru responsive design, ce meta e esențial?', ['<meta name="responsive">', '<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="mobile">', '<meta name="screen">'], '<meta name="viewport" content="width=device-width, initial-scale=1">', 'Fără el, mobile rendează zoomed-out.', { topic: 'meta', difficulty: 'MEDIUM' }),
  mc('Open Graph', 'Pentru preview Facebook/LinkedIn, folosești meta cu prefix…', ['fb:', 'og:', 'social:', 'preview:'], 'og:', '`<meta property="og:title" content="...">`.', { topic: 'meta', difficulty: 'HARD' }),
  mc('Author', 'Cum specifici autorul?', ['<meta name="creator">', '<meta name="author" content="...">', '<author>X</author>', '<meta by="...">'], '<meta name="author" content="...">', 'Util pentru articole.', { topic: 'meta' }),
  mc('Keywords', 'Meta `keywords` mai are impact SEO?', ['Da, foarte mult', 'Nu, e ignorat de Google', 'Doar pe Bing', 'Doar dacă e vizibil'], 'Nu, e ignorat de Google', 'Google îl ignoră de mulți ani.', { topic: 'meta', difficulty: 'MEDIUM' }),
]

const htmlCssIntroQuiz = [
  mc('Inline CSS', 'Cum aplici stil DIRECT pe un element?', ['css="..."', 'style="..."', 'design="..."', 'look="..."'], 'style="..."', '`<p style="color: red">`.', { topic: 'css' }),
  mc('Internal CSS', 'Unde plasezi `<style>` intern?', ['<body>', '<head>', '<footer>', '<main>'], '<head>', 'În `<head>`, înaintea conținutului.', { topic: 'css' }),
  mc('External CSS', 'Cum legi un fișier CSS extern?', ['<css src="x.css">', '<link rel="stylesheet" href="x.css">', '<style src="x.css">', '<import x.css>'], '<link rel="stylesheet" href="x.css">', 'Modul recomandat — CSS separat de HTML.', { topic: 'css' }),
  mc('Selector clasă', 'Cum selectezi clasa `.btn` în CSS?', ['btn', '.btn', '#btn', '@btn'], '.btn', '`.` pentru clase, `#` pentru id-uri.', { topic: 'css' }),
  mc('Specificity', 'Care selector are prioritate mai mare?', ['Tag', 'Clasă', 'ID', 'Universal *'], 'ID', 'Specificity: inline > id > class > tag > *.', { topic: 'css', difficulty: 'MEDIUM' }),
]

const htmlJsIntroQuiz = [
  mc('Tag script', 'Care tag rulează JavaScript?', ['<js>', '<script>', '<javascript>', '<code>'], '<script>', '`<script src="app.js"></script>` sau inline.', { topic: 'js' }),
  mc('Locație recomandată', 'Unde plasezi `<script>` pentru încărcare optimă?', ['<head>', 'Înainte de </body>', 'În <title>', 'Oriunde'], 'Înainte de </body>', 'Sau în `<head>` cu `defer`.', { topic: 'js', difficulty: 'MEDIUM' }),
  mc('defer', 'Ce face atributul `defer`?', ['Sare scriptul', 'Așteaptă HTML-ul, apoi rulează', 'Rulează imediat', 'Loop'], 'Așteaptă HTML-ul, apoi rulează', 'Recomandat pentru scripturi în `<head>`.', { topic: 'js', difficulty: 'MEDIUM' }),
  mc('async', 'Diferența între `async` și `defer`?', ['Niciuna', '`async` rulează imediat ce s-a descărcat; `defer` așteaptă HTML', 'async e mai rapid', 'defer e doar pentru CSS'], '`async` rulează imediat ce s-a descărcat; `defer` așteaptă HTML', 'Pentru scripturi independente → `async`. Pentru cele care au nevoie de DOM → `defer`.', { topic: 'js', difficulty: 'HARD' }),
  mc('Inline event', 'Cum atașezi click inline (legacy)?', ['onclick="..."', 'click="..."', '@click="..."', 'on:click="..."'], 'onclick="..."', 'Modul vechi. Modern: `addEventListener`.', { topic: 'js' }),
]

const structuraPaginaQuiz = [
  mc('Layout tipic', 'Ordinea uzuală a sectiunilor într-o pagină?', ['main, header, footer', 'header, main, footer', 'footer, main, header', 'header, footer, main'], 'header, main, footer', 'Top → conținut → jos.', { topic: 'layout' }),
  mc('Sidebar', 'Care tag semantic e pentru bara laterală?', ['<sidebar>', '<aside>', '<side>', '<col>'], '<aside>', '`<aside>` = conținut tangențial.', { topic: 'layout' }),
  mc('Section vs Article', 'Care e diferența?', ['Niciuna', '`section` grupează conținut tematic; `article` = unitate independentă reutilizabilă', '`article` doar pentru știri', '`section` nu e standard'], '`section` grupează conținut tematic; `article` = unitate independentă reutilizabilă', 'Un `<article>` poate conține mai multe `<section>`.', { topic: 'layout', difficulty: 'HARD' }),
  mc('Heading în section', 'Fiecare `<section>` ar trebui să aibă…', ['Un id', 'Un heading (h1-h6)', 'Un footer', 'O imagine'], 'Un heading (h1-h6)', 'Pentru structură semantică și accesibilitate.', { topic: 'layout', difficulty: 'MEDIUM' }),
  mc('Skip link', 'Pentru accesibilitate, în top adaugi…', ['<skip>', 'Un link „Sari la conținut"', 'Un h1 invizibil', 'Nimic'], 'Un link „Sari la conținut"', 'Permite utilizatorilor de tastatură să sară meniul.', { topic: 'layout', difficulty: 'MEDIUM' }),
]

const miniProiectHtmlQuiz = [
  mc('Validare HTML', 'Unde validezi că HTML-ul tău e corect?', ['Google', 'validator.w3.org', 'html.com', 'HTMLfix'], 'validator.w3.org', 'Validatorul oficial W3C.', { topic: 'project' }),
  mc('Favicon', 'Cum setezi pictograma din tab?', ['<icon>x.ico</icon>', '<link rel="icon" href="x.ico">', '<favicon src="x.ico">', '<meta favicon="...">'], '<link rel="icon" href="x.ico">', 'În `<head>`.', { topic: 'project' }),
  mc('Accesibilitate', 'Care e cel mai important atribut pentru accesibilitate la imagini?', ['title', 'alt', 'role', 'aria-label'], 'alt', 'Screen reader-ele citesc `alt`.', { topic: 'project' }),
  mc('Responsive imagine', 'Cum faci imaginile să se redimensioneze cu containerul?', ['width="100%" în HTML', 'CSS: max-width: 100%', 'resize="auto"', 'flex img'], 'CSS: max-width: 100%', 'Combinat cu `height: auto`.', { topic: 'project', difficulty: 'MEDIUM' }),
  mc('Indentare', 'De ce indentăm HTML-ul corect?', ['Funcționează altfel altfel', 'Lizibilitate pentru programatori', 'SEO', 'Performanță'], 'Lizibilitate pentru programatori', 'Browserul ignoră whitespace; oamenii nu.', { topic: 'project' }),
]

export const htmlQuizPack = {
  appendProblems: {
    'introducere-structura': introducereStructuraQuiz,
    'tag-uri-baza': tagUriBazaQuiz,
    'text-formatting': textFormattingQuiz,
    'link-uri': linkUriQuiz,
    'imagini': imaginiQuiz,
    'liste': listeQuiz,
    'div-span': divSpanQuiz,
    'atribute': atributeQuiz,
    'tabele': tabeleQuiz,
    'formulare-intro': formulareIntroQuiz,
    'tipuri-input': tipuriInputQuiz,
    'label-validare': labelValidareQuiz,
    'semantic': semanticQuiz,
    'media': mediaQuiz,
    'iframe': iframeQuiz,
    'meta-tags': metaTagsQuiz,
    'html-css-intro': htmlCssIntroQuiz,
    'html-js-intro': htmlJsIntroQuiz,
    'structura-pagina': structuraPaginaQuiz,
    'mini-proiect-html': miniProiectHtmlQuiz,
  },
}
