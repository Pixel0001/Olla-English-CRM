// Quiz pack pentru CSS — +5 MC per lecție pentru a ajunge la 10 probleme/lecție.

import { mc, sa } from './helpers.mjs'

const introducereCssQuiz = [
  sa('Acronim', 'Ce înseamnă CSS? (3 cuvinte separate prin spații)', 'Cascading Style Sheets', 'Stiluri în cascadă pentru HTML.', { topic: 'css-intro' }),
  mc('Sintaxă regulă', 'Sintaxa unei reguli CSS este…', ['selector { proprietate: valoare; }', 'selector(proprietate=valoare)', '{selector: proprietate}', 'selector -> valoare'], 'selector { proprietate: valoare; }', 'Acolade { } + perechi separate cu `:`, terminate cu `;`.', { topic: 'css-intro' }),
  mc('Cascada', 'Ce înseamnă „cascadă" în CSS?', ['Animație', 'Regulile mai specifice/ulterioare suprascriu pe cele anterioare', 'Stiluri verticale', 'Layout pe coloane'], 'Regulile mai specifice/ulterioare suprascriu pe cele anterioare', 'De aceea se numește „cascading".', { topic: 'css-intro', difficulty: 'MEDIUM' }),
  mc('!important', 'Ce face `!important`?', ['Comentariu', 'Forțează o regulă să aibă prioritate maximă', 'Sintaxă greșită', 'Bold'], 'Forțează o regulă să aibă prioritate maximă', 'Folosește RAR — face debug-ul greu.', { topic: 'css-intro', difficulty: 'MEDIUM' }),
  mc('Comentariu CSS', 'Cum scrii un comentariu în CSS?', ['// comentariu', '# comentariu', '/* comentariu */', '<!-- comentariu -->'], '/* comentariu */', 'CSS NU are comentarii pe o singură linie.', { topic: 'css-intro' }),
]

const selectoriQuiz = [
  mc('Universal', 'Ce face selectorul `*`?', ['Doar prima clasă', 'Selectează TOATE elementele', 'Importă fișiere', 'Eroare'], 'Selectează TOATE elementele', 'Folosit des pentru reset CSS.', { topic: 'selectori' }),
  mc('Selector descendent', 'Ce face `div p`?', ['div SAU p', 'p direct în div', 'Toți p DESCENDENȚI ai unui div', 'div și p egal'], 'Toți p DESCENDENȚI ai unui div', 'Spațiu = descendent (oriunde înăuntru).', { topic: 'selectori', difficulty: 'MEDIUM' }),
  mc('Selector copil direct', 'Ce face `div > p`?', ['Doar p copil DIRECT al div', 'Toți p în div', 'div sau p', 'p după div'], 'Doar p copil DIRECT al div', '`>` = combinator copil direct.', { topic: 'selectori', difficulty: 'MEDIUM' }),
  mc('Pseudo-clasă hover', 'Ce face `:hover`?', ['Stil când utilizatorul trece cu mouse-ul', 'Stil la click', 'Stil pentru focus', 'Stil pentru disabled'], 'Stil când utilizatorul trece cu mouse-ul', '`a:hover { color: red }`.', { topic: 'selectori' }),
  mc('Pseudo-element', 'Ce face `p::first-letter`?', ['Eroare', 'Selectează prima literă pentru stil', 'Selectează primul p', 'Capitalizează'], 'Selectează prima literă pentru stil', 'Pseudo-element — `::` cu două puncte duble.', { topic: 'selectori', difficulty: 'HARD' }),
]

const culoriBackgroundQuiz = [
  mc('Sintaxă hex', 'Care e formatul HEX corect pentru roșu?', ['#FF0000', '#0000FF', '255,0,0', 'red()'], '#FF0000', '`#RRGGBB` — perechi pentru R, G, B.', { topic: 'culori' }),
  mc('rgba', 'Ce e al patrulea parametru în `rgba(255,0,0,0.5)`?', ['Saturație', 'Alpha (transparență)', 'Luminozitate', 'Hue'], 'Alpha (transparență)', '0 = transparent, 1 = opac.', { topic: 'culori' }),
  mc('background-color', 'Ce face `background-color: lightblue`?', ['Schimbă text', 'Setează culoarea fundalului', 'Adaugă imagine', 'Bordură'], 'Setează culoarea fundalului', 'Aplicat pe orice element.', { topic: 'culori' }),
  mc('background-image', 'Cum setezi o imagine de fundal?', ['background-image: "x.jpg"', 'background-image: url("x.jpg")', 'background: img(x.jpg)', 'bg-image: x.jpg'], 'background-image: url("x.jpg")', 'Funcția `url(...)`.', { topic: 'culori' }),
  mc('Gradient', 'Cum creezi un gradient liniar de la roșu la albastru?', ['gradient(red, blue)', 'linear-gradient(red, blue)', 'background: gradient(...)', 'fade(red, blue)'], 'linear-gradient(red, blue)', '`background: linear-gradient(to right, red, blue);`.', { topic: 'culori', difficulty: 'MEDIUM' }),
]

const textStylingQuiz = [
  mc('Mărime font', 'Care proprietate setează mărimea fontului?', ['font-weight', 'font-size', 'text-size', 'size'], 'font-size', 'Ex: `font-size: 16px;`.', { topic: 'text' }),
  mc('Bold', 'Care valoare face textul bold?', ['font-weight: bold', 'font-style: bold', 'text-decoration: bold', 'bold: true'], 'font-weight: bold', 'Sau valori numerice (400 = normal, 700 = bold).', { topic: 'text' }),
  mc('Italic', 'Care proprietate face textul italic?', ['font-weight: italic', 'font-style: italic', 'text-style: italic', 'italic: true'], 'font-style: italic', '`font-style` controlează italic/normal.', { topic: 'text' }),
  mc('Aliniere', 'Care proprietate aliniază textul la centru?', ['align: center', 'text-align: center', 'center: true', 'text-position: center'], 'text-align: center', 'Valori: left, right, center, justify.', { topic: 'text' }),
  mc('Subliniere', 'Care proprietate subliniază/elimină subliniere?', ['text-style', 'text-decoration', 'underline', 'text-line'], 'text-decoration', '`text-decoration: none` elimină subliniere de pe link-uri.', { topic: 'text', difficulty: 'MEDIUM' }),
]

const boxModelQuiz = [
  mc('Componente', 'Care e ordinea CORECTĂ a box model-ului din interior spre exterior?', ['margin → border → padding → content', 'content → padding → border → margin', 'padding → margin → border → content', 'content → margin → border → padding'], 'content → padding → border → margin', 'Padding e înăuntrul border-ului. Margin e în afară.', { topic: 'box-model', difficulty: 'MEDIUM' }),
  mc('padding', 'Ce e `padding`?', ['Spațiu în AFARA elementului', 'Spațiu între conținut și border', 'Bordură', 'Margine'], 'Spațiu între conținut și border', 'Padding face elementul mai mare.', { topic: 'box-model' }),
  mc('margin', 'Ce e `margin`?', ['Spațiu în interior', 'Spațiu în AFARA elementului', 'Bordură', 'Padding'], 'Spațiu în AFARA elementului', 'Margin separă elementul de cele învecinate.', { topic: 'box-model' }),
  mc('box-sizing', 'Ce face `box-sizing: border-box`?', ['Adaugă border', 'width include padding și border', 'Elimină padding', 'Centrează'], 'width include padding și border', 'Foarte util — recomandat global cu `*`.', { topic: 'box-model', difficulty: 'HARD' }),
  mc('Margin shorthand', 'Ce face `margin: 10px 20px`?', ['Toate 10px', 'Top/bottom 10px, left/right 20px', 'Top 10px, restul 20px', 'Eroare'], 'Top/bottom 10px, left/right 20px', '2 valori = vertical, orizontal.', { topic: 'box-model', difficulty: 'MEDIUM' }),
]

const dimensiuniQuiz = [
  mc('px', 'Ce înseamnă `px`?', ['Procente', 'Pixeli (unitate fixă)', 'Em', 'Rem'], 'Pixeli (unitate fixă)', 'Unitate absolută.', { topic: 'units' }),
  mc('% width', 'Ce înseamnă `width: 50%`?', ['50 pixeli', '50% din lățimea elementului PĂRINTE', '50% din ecran', 'Jumătate text'], '50% din lățimea elementului PĂRINTE', 'Procentele se raportează la părinte.', { topic: 'units', difficulty: 'MEDIUM' }),
  mc('em', 'Ce înseamnă `1em`?', ['1 pixel', '1× font-size al PĂRINTELUI', '1cm', '100%'], '1× font-size al PĂRINTELUI', '`em` se cumulează prin moștenire.', { topic: 'units', difficulty: 'MEDIUM' }),
  mc('rem', 'Ce înseamnă `1rem`?', ['1 pixel', '1× font-size al PĂRINTELUI', '1× font-size al ROOT-ului (html)', '1cm'], '1× font-size al ROOT-ului (html)', 'Spre deosebire de `em`, NU se cumulează.', { topic: 'units', difficulty: 'MEDIUM' }),
  mc('vh', 'Ce înseamnă `100vh`?', ['100 pixeli', '100% din lățimea ecranului', '100% din ÎNĂLȚIMEA viewport-ului', '100 procente'], '100% din ÎNĂLȚIMEA viewport-ului', '`vw` = lățime viewport, `vh` = înălțime.', { topic: 'units' }),
]

const displayQuiz = [
  mc('block', 'Cum se comportă un element `display: block`?', ['Stă pe o linie cu altele', 'Ocupă întreaga lățime, începe pe linie nouă', 'E ascuns', 'Flex'], 'Ocupă întreaga lățime, începe pe linie nouă', 'Ex: `<div>`, `<p>`, `<h1>`.', { topic: 'display' }),
  mc('inline', 'Cum se comportă `display: inline`?', ['Linie nouă', 'Stă pe aceeași linie, ignoră width/height', 'Bloc', 'Ascuns'], 'Stă pe aceeași linie, ignoră width/height', 'Ex: `<span>`, `<a>`. NU poate avea înălțime fixată.', { topic: 'display', difficulty: 'MEDIUM' }),
  mc('inline-block', 'Ce face `inline-block`?', ['Doar inline', 'Inline DAR acceptă width/height', 'Doar block', 'Flex'], 'Inline DAR acceptă width/height', 'Cel mai bun din ambele lumi.', { topic: 'display', difficulty: 'MEDIUM' }),
  mc('display: none', 'Ce face `display: none`?', ['Ascunde dar păstrează spațiul', 'Elimină complet din layout', 'Doar transparent', 'Mut'], 'Elimină complet din layout', 'Pentru ascundere care păstrează spațiul → `visibility: hidden`.', { topic: 'display' }),
  mc('visibility hidden vs display none', 'Care e diferența?', ['Niciuna', '`hidden` păstrează spațiul; `none` îl elimină', '`none` păstrează spațiul', 'Doar pentru imagini'], '`hidden` păstrează spațiul; `none` îl elimină', 'Important pentru layout.', { topic: 'display', difficulty: 'MEDIUM' }),
]

const positionQuiz = [
  mc('position default', 'Care e valoarea implicită a `position`?', ['absolute', 'relative', 'static', 'fixed'], 'static', 'Toate elementele sunt `static` by default.', { topic: 'position' }),
  mc('relative', 'Ce face `position: relative` cu `top: 10px`?', ['Mută față de părinte', 'Mută față de POZIȚIA INIȚIALĂ proprie', 'Fix pe ecran', 'Nu face nimic'], 'Mută față de POZIȚIA INIȚIALĂ proprie', 'Spațiul original se păstrează.', { topic: 'position', difficulty: 'MEDIUM' }),
  mc('absolute', 'Față de ce se poziționează `position: absolute`?', ['Părinte direct mereu', 'Cel mai apropiat strămoș POZIȚIONAT (non-static)', 'Ecran', 'Body mereu'], 'Cel mai apropiat strămoș POZIȚIONAT (non-static)', 'Dacă nu există → `<html>`.', { topic: 'position', difficulty: 'HARD' }),
  mc('fixed', 'Față de ce se poziționează `position: fixed`?', ['Părinte', 'Viewport (rămâne la scroll)', 'Body', 'Document'], 'Viewport (rămâne la scroll)', 'Util pentru header-e fixe.', { topic: 'position', difficulty: 'MEDIUM' }),
  mc('z-index', 'Ce face `z-index`?', ['Stack pe orizontală', 'Ordinea pe axa Z (suprapunere)', 'Sărit', 'Index în array'], 'Ordinea pe axa Z (suprapunere)', 'Mai mare = deasupra. Funcționează doar pe elemente poziționate.', { topic: 'position', difficulty: 'MEDIUM' }),
]

const flexboxIntroQuiz = [
  sa('Activare', 'Ce proprietate transformă un element în container flex? (formula `display: ___`, doar valoarea)', 'flex', '`display: flex` activează flexbox pentru COPIII direcți.', { topic: 'flexbox' }),
  mc('Direcție', 'Care proprietate setează direcția flex (rând/coloană)?', ['flex-direction', 'flex-axis', 'orientation', 'direction'], 'flex-direction', 'Valori: row, column, row-reverse, column-reverse.', { topic: 'flexbox' }),
  mc('Centrare orizontală', 'Cum centrezi orizontal copiii într-un container flex (row)?', ['align-items: center', 'justify-content: center', 'text-align: center', 'margin: auto'], 'justify-content: center', '`justify-content` = axa principală (orizontală în row).', { topic: 'flexbox', difficulty: 'MEDIUM' }),
  mc('Centrare verticală', 'Cum centrezi vertical copiii (în row)?', ['justify-content: center', 'align-items: center', 'vertical-align: middle', 'top: 50%'], 'align-items: center', '`align-items` = axa transversală (verticală în row).', { topic: 'flexbox', difficulty: 'MEDIUM' }),
  mc('Wrap', 'Ce face `flex-wrap: wrap`?', ['Forțează rând nou pentru fiecare', 'Permite copiilor să treacă pe linie nouă când nu mai încap', 'Înfășoară text', 'Margin auto'], 'Permite copiilor să treacă pe linie nouă când nu mai încap', 'Default e `nowrap`.', { topic: 'flexbox' }),
]

const flexboxAvansatQuiz = [
  mc('flex-grow', 'Ce face `flex-grow: 1`?', ['Crește elementul cu 1px', 'Permite elementului să OCUPE spațiu disponibil', 'Eroare', 'Mărește font'], 'Permite elementului să OCUPE spațiu disponibil', 'Mai mare = mai mult spațiu raportat la frați.', { topic: 'flexbox', difficulty: 'MEDIUM' }),
  mc('flex shorthand', '`flex: 1` echivalează cu…', ['flex-grow: 1', 'flex: 1 1 0', 'flex-basis: 1', 'gap: 1'], 'flex: 1 1 0', '`flex-grow: 1; flex-shrink: 1; flex-basis: 0`.', { topic: 'flexbox', difficulty: 'HARD' }),
  mc('gap', 'Ce face `gap: 10px` într-un container flex?', ['Margin de 10px', 'Spațiu de 10px între copii', 'Padding interior', 'Border'], 'Spațiu de 10px între copii', 'Mai elegant decât margin pe fiecare copil.', { topic: 'flexbox' }),
  mc('order', 'Ce face `order: 2` pe un copil?', ['Mută elementul vizual fără a schimba HTML-ul', 'Setează indexul în array', 'Dimensiune', 'Eroare'], 'Mută elementul vizual fără a schimba HTML-ul', 'Default = 0. Mai mare = mai în spate.', { topic: 'flexbox', difficulty: 'HARD' }),
  mc('align-self', 'Ce face `align-self`?', ['Aliniază TOATE elementele', 'Suprascrie `align-items` pentru UN copil', 'Centrează părintele', 'Wrap'], 'Suprascrie `align-items` pentru UN copil', 'Per-element override.', { topic: 'flexbox', difficulty: 'MEDIUM' }),
]

const gridIntroQuiz = [
  sa('Activare', 'Ce valoare pentru `display` activează grid? (doar valoarea)', 'grid', '`display: grid`.', { topic: 'grid' }),
  mc('Coloane', 'Cum definești 3 coloane egale?', ['grid-cols: 3', 'grid-template-columns: 1fr 1fr 1fr', 'columns: 3', 'grid: 3'], 'grid-template-columns: 1fr 1fr 1fr', 'Sau prescurtat: `repeat(3, 1fr)`.', { topic: 'grid', difficulty: 'MEDIUM' }),
  mc('repeat', 'Ce face `repeat(3, 100px)`?', ['Eroare', '3 coloane de 100px', '300 coloane', '100 coloane'], '3 coloane de 100px', 'Echivalent cu `100px 100px 100px`.', { topic: 'grid' }),
  mc('Unitate fr', 'Ce înseamnă `1fr`?', ['1 frame', '1 fracțiune din spațiul disponibil', '1 pixel', '1 procent'], '1 fracțiune din spațiul disponibil', 'Util pentru distribuție proporțională.', { topic: 'grid', difficulty: 'MEDIUM' }),
  mc('gap', 'Ce face `gap: 20px` în grid?', ['Margin', 'Spațiu între celule (rânduri și coloane)', 'Padding', 'Border'], 'Spațiu între celule (rânduri și coloane)', '`row-gap` și `column-gap` separat.', { topic: 'grid' }),
]

const gridAvansatQuiz = [
  mc('grid-column span', 'Ce face `grid-column: span 2`?', ['Sare 2 coloane', 'Elementul ocupă 2 coloane', 'Padding 2', '2 rânduri'], 'Elementul ocupă 2 coloane', 'Pentru rânduri: `grid-row: span 2`.', { topic: 'grid', difficulty: 'MEDIUM' }),
  mc('auto-fit', 'Ce face `repeat(auto-fit, minmax(200px, 1fr))`?', ['Coloane fixe', 'Coloane responsive: cât mai multe de minim 200px', 'O singură coloană', 'Eroare'], 'Coloane responsive: cât mai multe de minim 200px', 'Foarte util pentru grids responsive.', { topic: 'grid', difficulty: 'HARD' }),
  mc('grid-area', 'Ce face proprietatea `grid-area`?', ['Setează aria în pixeli', 'Plasează elementul într-o zonă numită', 'Padding', 'Sortează'], 'Plasează elementul într-o zonă numită', 'Folosit cu `grid-template-areas`.', { topic: 'grid', difficulty: 'HARD' }),
  mc('justify-items', 'Ce face `justify-items: center`?', ['Centrează grid-ul', 'Centrează conținutul fiecărei celule pe orizontală', 'Margin auto', 'Border'], 'Centrează conținutul fiecărei celule pe orizontală', 'Per celulă.', { topic: 'grid', difficulty: 'MEDIUM' }),
  mc('place-items', '`place-items: center` echivalează cu…', ['justify-items + align-items center', 'doar align-items', 'doar justify-items', 'gap'], 'justify-items + align-items center', 'Shorthand pentru centrare 2D.', { topic: 'grid', difficulty: 'MEDIUM' }),
]

const borderShadowQuiz = [
  mc('Border shorthand', 'Care e ordinea în `border: 1px solid red`?', ['culoare stil grosime', 'grosime stil culoare', 'stil grosime culoare', 'orice ordine'], 'grosime stil culoare', '`border: <width> <style> <color>`.', { topic: 'border' }),
  mc('Stiluri border', 'Care NU e o valoare validă pentru `border-style`?', ['solid', 'dashed', 'dotted', 'wavy'], 'wavy', '`wavy` e doar pentru `text-decoration-style`.', { topic: 'border', difficulty: 'MEDIUM' }),
  mc('border-radius', 'Ce face `border-radius: 50%`?', ['Pătrat', 'Cerc (dacă elementul e pătrat)', 'Triunghi', 'Eroare'], 'Cerc (dacă elementul e pătrat)', 'Util pentru poze de profil rotunde.', { topic: 'border' }),
  mc('box-shadow', 'Care e ordinea valorilor în `box-shadow: 2px 4px 6px gray`?', ['blur, x, y, color', 'x, y, blur, color', 'color, x, y, blur', 'x, blur, y, color'], 'x, y, blur, color', 'Offset orizontal, offset vertical, blur, culoare.', { topic: 'shadow', difficulty: 'MEDIUM' }),
  mc('Inset shadow', 'Cum faci umbra ÎN INTERIORUL elementului?', ['box-shadow: inner ...', 'box-shadow: inset ...', 'inner-shadow', 'box-shadow: -1'], 'box-shadow: inset ...', 'Cuvântul cheie `inset` la început.', { topic: 'shadow', difficulty: 'HARD' }),
]

const hoverEfecteQuiz = [
  mc('Sintaxă hover', 'Sintaxa pentru stil la hover?', ['button.hover { ... }', 'button:hover { ... }', 'button[hover] { ... }', '@hover button { ... }'], 'button:hover { ... }', '`:hover` e o pseudo-clasă.', { topic: 'hover' }),
  mc('cursor', 'Care valoare pentru `cursor` arată o mână?', ['hand', 'pointer', 'click', 'finger'], 'pointer', '`cursor: pointer` — standard pentru link-uri/butoane.', { topic: 'hover' }),
  mc('Schimbare culoare', 'Cum schimbi culoarea la hover?', ['a:hover { color: red }', 'a:hover -> red', 'a.hover = red', 'a hover red'], 'a:hover { color: red }', 'Reguli normale CSS.', { topic: 'hover' }),
  mc('opacity', 'Ce face `opacity: 0.5`?', ['Ascunde', 'Face elementul 50% transparent', 'Mărimea 50%', 'Bold'], 'Face elementul 50% transparent', '0 = invizibil, 1 = opac.', { topic: 'hover' }),
  mc('transform scale', 'Ce face `transform: scale(1.1)` la hover?', ['Mută', 'Mărește cu 10%', 'Rotește', 'Bold'], 'Mărește cu 10%', 'Efect popular la card-uri.', { topic: 'hover', difficulty: 'MEDIUM' }),
]

const transitionsQuiz = [
  mc('transition', 'Ce face `transition: all 0.3s`?', ['Animație instant', 'Tranziție lină de 0.3s pentru orice schimbare', 'Așteaptă 0.3s', 'Eroare'], 'Tranziție lină de 0.3s pentru orice schimbare', 'Funcționează între stările elementului.', { topic: 'transitions' }),
  mc('Proprietate specifică', 'Cum tranziționezi DOAR `background-color` în 0.5s?', ['transition: 0.5s background-color', 'transition: background-color 0.5s', 'animate: bg 0.5s', '@transition bg 0.5s'], 'transition: background-color 0.5s', 'Ordinea: proprietate, durată.', { topic: 'transitions' }),
  mc('ease-in-out', 'Ce e `ease-in-out`?', ['Linear', 'Funcție de timp: pornire lentă, accelerare, oprire lentă', 'Bouncy', 'Spring'], 'Funcție de timp: pornire lentă, accelerare, oprire lentă', 'Cea mai naturală curbă.', { topic: 'transitions', difficulty: 'MEDIUM' }),
  mc('Delay', 'Ce face `transition: 1s 0.5s`?', ['1.5s total', 'Durată 1s, delay 0.5s înainte de pornire', '0.5s total', 'Eroare'], 'Durată 1s, delay 0.5s înainte de pornire', 'A doua valoare e delay-ul.', { topic: 'transitions', difficulty: 'HARD' }),
  mc('@keyframes', 'Pentru animații complexe folosim…', ['transition', '@keyframes + animation', '@media', 'transform'], '@keyframes + animation', '`@keyframes` definește etape; `animation` aplică.', { topic: 'transitions', difficulty: 'MEDIUM' }),
]

const responsiveQuiz = [
  sa('Sintaxă media query', 'Completează: `___ (max-width: 768px) { ... }` (cuvântul lipsă, cu @)', '@media', 'Sintaxa: `@media (condiție) { reguli }`.', { topic: 'responsive' }),
  mc('max-width', 'Ce înseamnă `@media (max-width: 768px)`?', ['Aplică pentru ecrane mai LATE de 768px', 'Aplică pentru ecrane MAI ÎNGUSTE sau egale cu 768px', 'Doar 768px exact', 'Eroare'], 'Aplică pentru ecrane MAI ÎNGUSTE sau egale cu 768px', 'Mobile-first folosește `min-width`.', { topic: 'responsive', difficulty: 'MEDIUM' }),
  mc('Mobile first', 'În abordarea mobile-first folosim de obicei…', ['max-width', 'min-width', 'orientation', 'aspect-ratio'], 'min-width', 'Stiluri de bază pentru mobile, suprascrise pentru ecrane mai mari.', { topic: 'responsive', difficulty: 'MEDIUM' }),
  mc('Imagini responsive', 'Care CSS face imaginea să nu depășească containerul?', ['width: 100%', 'max-width: 100%; height: auto', 'overflow: hidden', 'resize: auto'], 'max-width: 100%; height: auto', 'Păstrează raportul.', { topic: 'responsive' }),
  mc('Breakpoints', 'Care e un breakpoint comun pentru tablete?', ['320px', '768px', '1920px', '5000px'], '768px', 'Aproximativ iPad portrait.', { topic: 'responsive' }),
]

const unitatiModerneQuiz = [
  mc('clamp', 'Ce face `font-size: clamp(1rem, 2vw, 2rem)`?', ['Doar 2vw', 'Min 1rem, preferat 2vw, max 2rem', 'Toate trei suprapuse', 'Eroare'], 'Min 1rem, preferat 2vw, max 2rem', 'Util pentru tipografie fluidă.', { topic: 'units', difficulty: 'HARD' }),
  mc('min/max', 'Ce face `width: min(50%, 600px)`?', ['Min 50%', 'Cea mai MICĂ dintre 50% și 600px', 'Max 600px', 'Suma'], 'Cea mai MICĂ dintre 50% și 600px', 'Util pentru containere care nu cresc prea mult.', { topic: 'units', difficulty: 'HARD' }),
  mc('vw', 'Ce înseamnă `1vw`?', ['1 pixel', '1% din lățimea viewport-ului', '1% din înălțime', '1cm'], '1% din lățimea viewport-ului', 'Responsive natural.', { topic: 'units' }),
  mc('ch', 'Ce înseamnă `1ch`?', ['1 caracter (lățimea cifrei „0")', '1 cm', '1 pixel', '1% character'], '1 caracter (lățimea cifrei „0")', 'Util pentru lățimi optime de citit (~60-70ch).', { topic: 'units', difficulty: 'HARD' }),
  mc('Variabile CSS', 'Cum definești o variabilă CSS?', ['$culoare: red', '@culoare: red', '--culoare: red', 'var culoare = red'], '--culoare: red', 'Folosită cu `var(--culoare)`.', { topic: 'units', difficulty: 'MEDIUM' }),
]

const layoutCompletQuiz = [
  mc('Holy grail', 'Pentru un layout cu header, sidebar, main, footer, cea mai modernă alegere e…', ['table', 'float', 'CSS Grid', 'flexbox 1D'], 'CSS Grid', 'Grid e 2D — perfect pentru layout-uri complexe.', { topic: 'layout' }),
  mc('Sticky', 'Cum faci un header să rămână în top la scroll dar doar până la o secțiune?', ['position: fixed', 'position: sticky', 'position: top', 'position: scroll'], 'position: sticky', '`sticky` se comportă ca `relative` până trece pragul.', { topic: 'layout', difficulty: 'MEDIUM' }),
  mc('Centrare div', 'Cea mai concisă cale modernă de a centra un div?', ['margin: auto', 'flex + justify/align center', 'text-align: center', 'transform'], 'flex + justify/align center', '`display: flex; justify-content: center; align-items: center;`.', { topic: 'layout' }),
  mc('Min height pentru footer jos', 'Cum forțezi footer-ul să fie la baza paginii pe ecrane goale?', ['margin-top: auto', 'min-height: 100vh + flex column', 'position: bottom', 'height: 100%'], 'min-height: 100vh + flex column', 'Sticky footer pattern.', { topic: 'layout', difficulty: 'HARD' }),
  mc('Container max-width', 'De ce limităm container-ele la `max-width: 1200px`?', ['Performanță', 'Lizibilitate pe ecrane mari', 'SEO', 'Securitate'], 'Lizibilitate pe ecrane mari', 'Linii prea late = greu de citit.', { topic: 'layout' }),
]

const uiComponentsQuiz = [
  mc('Buton frumos', 'Ce proprietate elimină border-ul default al butonului?', ['border: none', 'outline: none', 'border: 0', 'Toate de mai sus'], 'Toate de mai sus', 'Combinăm `border: none; outline: none;` pentru styling complet.', { topic: 'ui', difficulty: 'MEDIUM' }),
  mc('Card', 'Care combinație e tipică pentru un „card"?', ['border-radius + box-shadow + padding', 'doar border', 'doar background', 'doar margin'], 'border-radius + box-shadow + padding', 'Look modern de card.', { topic: 'ui' }),
  mc('Form input style', 'Pentru a uniformiza inputs, ce proprietate copiezi de la body?', ['color', 'font-family', 'margin', 'display'], 'font-family', 'Inputs au font default — trebuie suprascris.', { topic: 'ui', difficulty: 'MEDIUM' }),
  mc('Focus ring', 'De ce NU eliminăm `outline` pe :focus fără înlocuitor?', ['Pentru viteză', 'Accesibilitate — utilizatorii de tastatură au nevoie de feedback vizual', 'SEO', 'Nu contează'], 'Accesibilitate — utilizatorii de tastatură au nevoie de feedback vizual', 'Înlocuiește cu un `box-shadow` sau border vizibil.', { topic: 'ui', difficulty: 'HARD' }),
  mc('Tooltip CSS', 'Cum faci un tooltip pe hover doar cu CSS?', ['JavaScript obligatoriu', 'Pseudo-element ::after + display la :hover', 'iframe', 'animation'], 'Pseudo-element ::after + display la :hover', 'Cu `data-tooltip` pe HTML și `content: attr(data-tooltip)`.', { topic: 'ui', difficulty: 'HARD' }),
]

const miniProiectCssQuiz = [
  mc('Reset CSS', 'De ce folosim un reset CSS la începutul proiectului?', ['Pentru viteză', 'Pentru a elimina diferențele între browsere', 'Pentru SEO', 'Pentru securitate'], 'Pentru a elimina diferențele între browsere', 'Browserele au stiluri default diferite.', { topic: 'project' }),
  mc('Font Google', 'Cum incluzi fonturi Google?', ['<google-font>', '<link href="fonts.googleapis.com/...">', '@import url(google)', 'Toate de mai sus'], '<link href="fonts.googleapis.com/...">', '`<link>` e mai rapid decât `@import`.', { topic: 'project' }),
  mc('Mobile first', 'Care e avantajul abordării mobile-first?', ['Mai rapid', 'Forțează simplitate; CSS-ul de bază funcționează pe orice', 'SEO', 'Mai puțin cod'], 'Forțează simplitate; CSS-ul de bază funcționează pe orice', 'Apoi adăugăm complexitate pentru ecrane mari.', { topic: 'project', difficulty: 'MEDIUM' }),
  mc('Performanță', 'Care proprietate ar trebui evitată pentru animații (afectează layout)?', ['transform', 'opacity', 'top/left', 'color'], 'top/left', 'Animăm `transform: translate()` în loc — folosește GPU.', { topic: 'project', difficulty: 'HARD' }),
  mc('DevTools', 'Care e cea mai utilă unealtă pentru debug CSS?', ['Notepad', 'DevTools (F12) → Elements + Computed', 'Photoshop', 'Console.log'], 'DevTools (F12) → Elements + Computed', 'Vezi în timp real ce reguli se aplică.', { topic: 'project' }),
]

export const cssQuizPack = {
  appendProblems: {
    'introducere-css': introducereCssQuiz,
    'selectori': selectoriQuiz,
    'culori-background': culoriBackgroundQuiz,
    'text-styling': textStylingQuiz,
    'box-model': boxModelQuiz,
    'dimensiuni': dimensiuniQuiz,
    'display': displayQuiz,
    'position': positionQuiz,
    'flexbox-intro': flexboxIntroQuiz,
    'flexbox-avansat': flexboxAvansatQuiz,
    'grid-intro': gridIntroQuiz,
    'grid-avansat': gridAvansatQuiz,
    'border-shadow': borderShadowQuiz,
    'hover-efecte': hoverEfecteQuiz,
    'transitions': transitionsQuiz,
    'responsive': responsiveQuiz,
    'unitati-moderne': unitatiModerneQuiz,
    'layout-complet': layoutCompletQuiz,
    'ui-components': uiComponentsQuiz,
    'mini-proiect-css': miniProiectCssQuiz,
  },
}
