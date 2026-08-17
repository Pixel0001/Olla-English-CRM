// React — 25 lecții cu teorie îmbogățită + 10+ probleme/lecție
// Stil prietenos pentru elevi 9-14 ani

import { mc, sa } from './helpers.mjs'

export const reactModule = {
  slug: 'react-fundamentals',
  title: 'React',
  description: 'Învață React — biblioteca pentru interfețe moderne. 25 de lecții cu hooks, JSX, props, state și multe altele.',
  language: 'javascript',
  order: 8,
  lessons: [

    // ==================== 1. INTRODUCERE ====================
    {
      slug: 'react-introducere',
      title: '1. Introducere în React',
      isFree: true,
      theory: `# ⚛️ Bun venit în React!

## Ce este React?

**React** este o **bibliotecă JavaScript** pentru construit interfețe (UI). Inventată de Facebook (Meta) în 2013. 🌐

> 💡 Cu React faci aplicații rapide ca: **Facebook, Instagram, Netflix, Discord**.

## De ce React?

- 🧱 **Componente** — împarți UI în piese mici reutilizabile
- ⚡ **Rapid** — actualizează doar ce s-a schimbat (Virtual DOM)
- 🔁 **Reactiv** — UI-ul se re-randează automat când date se schimbă
- 🌍 **Comunitate uriașă** — milioane de developeri îl folosesc

## Ce e o componentă?

O **componentă** = o funcție care returnează HTML (de fapt **JSX**).

\`\`\`jsx
function Salut() {
  return <h1>Salut, lume!</h1>;
}
\`\`\`

## Cum o folosești?

\`\`\`jsx
<Salut />
\`\`\`

> 💡 Numele componentelor încep mereu cu **literă MARE**: \`Salut\`, NU \`salut\`.

## React vs HTML pur

| HTML pur | React |
|---|---|
| Scrii pagină statică | Scrii componente |
| Refresh la fiecare click | Actualizare instant |
| Greu de reutilizat | Componente reutilizabile |

## 🎓 Ce ai învățat
- ✅ React = bibliotecă pentru UI
- ✅ O componentă e o funcție care returnează JSX
- ✅ Numele componentelor încep cu literă mare
`,
      problems: [
        mc('Ce e React?', 'React este...', ['Un browser', 'O bibliotecă JS pentru UI', 'Un limbaj nou', 'Un editor de cod'], 'O bibliotecă JS pentru UI', 'React e o bibliotecă JavaScript pentru construit interfețe.', { topic: 'intro' }),
        mc('Cine a creat React?', 'Cine a inventat React?', ['Google', 'Microsoft', 'Facebook (Meta)', 'Apple'], 'Facebook (Meta)', 'Facebook a creat React în 2013.', { topic: 'intro' }),
        mc('Numele componentelor', 'Cum trebuie să înceapă numele unei componente?', ['Cu literă mică', 'Cu literă MARE', 'Cu cifră', 'Cu underscore'], 'Cu literă MARE', '`<Salut />` ✅, `<salut />` ❌ — React tratează lowercase ca element HTML.', { topic: 'intro' }),
        mc('Ce returnează o componentă?', 'O componentă React returnează...', ['CSS', 'JSON', 'JSX (HTML-like)', 'SQL'], 'JSX (HTML-like)', 'Componentele returnează JSX care arată ca HTML.', { topic: 'intro' }),
        mc('Virtual DOM', 'Virtual DOM înseamnă...', ['Un browser virtual', 'O reprezentare în memorie a UI-ului', 'O bază de date', 'Un server'], 'O reprezentare în memorie a UI-ului', 'React folosește Virtual DOM pentru a actualiza eficient doar ce s-a schimbat.', { topic: 'intro' }),
        sa('Componentă simplă', 'Scrie o componentă numită `Buna` care returnează `<h1>Buna</h1>`. Scrie doar prima linie de declarare a funcției (function Buna() {).', 'function Buna() {', 'Componenta începe cu `function NumeMare() {`.', { topic: 'intro' }),
        mc('Avantaj React', 'Care e un avantaj important al React?', ['E mai lent', 'Refresh la fiecare click', 'Componente reutilizabile', 'Nu se folosește JS'], 'Componente reutilizabile', 'Cu componente, scrii o piesă o dată și o folosești de multe ori.', { topic: 'intro' }),
        mc('Aplicații cu React', 'Care din aceste aplicații folosesc React?', ['Doar Facebook', 'Facebook, Instagram, Netflix, Discord', 'Doar Microsoft Word', 'Doar Excel'], 'Facebook, Instagram, Netflix, Discord', 'Multe aplicații mari folosesc React.', { topic: 'intro' }),
        mc('Cum apelezi componenta', 'Cum folosești o componentă numită `Card`?', ['<card />', '<Card />', 'Card()', 'call Card'], '<Card />', 'Componentele se folosesc ca tag-uri JSX: `<Card />`.', { topic: 'intro' }),
        sa('Tip fișier React', 'Ce extensie are de obicei un fișier React modern?', '.jsx', 'Fișierele React au extensia `.jsx` sau `.js`.', { topic: 'intro' }),
      ],
    },

    // ==================== 2. JSX BASICS ====================
    {
      slug: 'react-jsx-basics',
      title: '2. JSX — sintaxă de bază',
      isFree: true,
      theory: `# 📝 JSX — sintaxa React

## Ce este JSX?

**JSX** = **JavaScript XML**. Este o sintaxă specială care îți permite să scrii **HTML în JavaScript**.

\`\`\`jsx
const element = <h1>Salut!</h1>;
\`\`\`

> 💡 Sub capotă, JSX se transformă în apeluri \`React.createElement()\`.

## Reguli importante JSX

### 1. **Un singur element rădăcină**
\`\`\`jsx
// ❌ GREȘIT — două elemente la rădăcină
return (
  <h1>Titlu</h1>
  <p>Paragraf</p>
);

// ✅ CORECT — wrapper
return (
  <div>
    <h1>Titlu</h1>
    <p>Paragraf</p>
  </div>
);

// ✅ Sau Fragment (gol)
return (
  <>
    <h1>Titlu</h1>
    <p>Paragraf</p>
  </>
);
\`\`\`

### 2. **Tag-uri auto-închise**
\`\`\`jsx
<img src="poza.jpg" />     // ✅
<br />                      // ✅
<input />                   // ✅
\`\`\`

### 3. **\`className\` în loc de \`class\`**
\`\`\`jsx
<div className="cutie">     // ✅
<div class="cutie">         // ❌ — class e cuvânt rezervat în JS
\`\`\`

### 4. **camelCase pentru atribute**
\`\`\`jsx
<button onClick={...}>      // ✅
<button onclick={...}>      // ❌
\`\`\`

## 🎓 Ce ai învățat
- ✅ JSX = HTML scris în JavaScript
- ✅ Un singur element la rădăcină (sau Fragment \`<>\`)
- ✅ \`className\` în loc de \`class\`
- ✅ Tag-uri se auto-închid: \`<img />\`
`,
      problems: [
        mc('Ce înseamnă JSX?', 'JSX vine de la...', ['Java Syntax eXtension', 'JavaScript XML', 'JSON eXtended', 'JS X-tra'], 'JavaScript XML', 'JSX = JavaScript XML — sintaxa care îți permite HTML în JS.', { topic: 'jsx' }),
        mc('Element rădăcină', 'Câte elemente poți avea la rădăcina unei componente?', ['Oricâte', 'Doar unul', 'Maxim 3', 'Niciunul'], 'Doar unul', 'O componentă returnează **un singur** element rădăcină. Folosește un wrapper sau Fragment.', { topic: 'jsx' }),
        mc('Class vs className', 'Cum se scrie clasa CSS în JSX?', ['class', 'className', 'cssClass', 'styleClass'], 'className', '`class` e rezervat în JavaScript, deci JSX folosește `className`.', { topic: 'jsx' }),
        mc('Fragment', 'Care e sintaxa scurtă pentru Fragment?', ['<Fragment>...</Fragment>', '<>...</>', '<div>...</div>', '<frag>...</frag>'], '<>...</>', '`<>...</>` e Fragment-ul gol — nu adaugă element în DOM.', { topic: 'jsx' }),
        mc('Tag-uri închise', 'Cum scrii corect un img în JSX?', ['<img>', '<img />', '<img></img>', 'Toate'], '<img />', 'În JSX toate tag-urile trebuie închise. `<img />` e self-closing.', { topic: 'jsx' }),
        sa('Atribut click', 'Care e atributul corect JSX pentru click?', 'onClick', 'JSX folosește camelCase: `onClick`, nu `onclick`.', { topic: 'jsx' }),
        mc('camelCase', 'Care atribut JSX e corect?', ['tabindex', 'tab-index', 'tabIndex', 'TabIndex'], 'tabIndex', 'Atributele HTML cu cratimă devin camelCase în JSX.', { topic: 'jsx' }),
        sa('Replace class', 'Transformă `<div class="box">` în JSX. Scrie doar atributul (className="box")', 'className="box"', '`class` → `className` în JSX.', { topic: 'jsx' }),
        mc('Self-close', 'Care e GREȘIT în JSX?', ['<br />', '<input />', '<hr />', '<br>'], '<br>', 'În JSX tag-urile trebuie închise: `<br />` ✅.', { topic: 'jsx' }),
        mc('JSX se transformă în', 'JSX se compilează în...', ['HTML pur', 'CSS', 'React.createElement()', 'JSON'], 'React.createElement()', 'JSX e doar zahăr sintactic peste `React.createElement()`.', { topic: 'jsx' }),
      ],
    },

    // ==================== 3. JSX EXPRESII ====================
    {
      slug: 'react-jsx-expresii',
      title: '3. JSX — expresii și atribute',
      isFree: false,
      theory: `# 🔢 Expresii în JSX

## Acolade \`{}\` = JS în JSX

În JSX, **\`{}\`** îți permit să bagi **orice expresie JavaScript**.

\`\`\`jsx
const nume = "Ana";
const varsta = 11;

return (
  <div>
    <h1>Salut, {nume}!</h1>
    <p>Ai {varsta} ani</p>
    <p>Anul nașterii: {2026 - varsta}</p>
  </div>
);
\`\`\`

## Ce poți pune în \`{}\`?

✅ **Variabile**: \`{nume}\`
✅ **Calcule**: \`{2 + 3}\`
✅ **Apeluri funcții**: \`{getNume()}\`
✅ **Operator ternar**: \`{varsta >= 18 ? "Adult" : "Copil"}\`
✅ **String template**: \`{\\\`Salut \${nume}\\\`}\`

❌ **NU poți pune \`if\` sau \`for\`** — folosește operator ternar / map.

## Atribute dinamice

\`\`\`jsx
const url = "https://exemplu.ro/img.png";
const inaltime = 200;

<img src={url} height={inaltime} alt="Poză" />
\`\`\`

> 💡 **Atenție**: \`{}\` nu folosesc ghilimele!
> ❌ \`<img src="{url}" />\` (asta e text "{url}")
> ✅ \`<img src={url} />\`

## Style inline (obiect!)

\`\`\`jsx
<div style={{ color: 'red', fontSize: 20 }}>Roșu mare</div>
\`\`\`

> 💡 \`{{ }}\` — primul \`{}\` e JSX expression, al doilea e obiect JS!

## 🎓 Ce ai învățat
- ✅ \`{...}\` bagă JS în JSX
- ✅ Atribute dinamice fără ghilimele: \`src={url}\`
- ✅ Style inline e **obiect**: \`{{ color: 'red' }}\`
`,
      problems: [
        mc('Sintaxa expresie', 'Cum bagi o variabilă `nume` în JSX?', ['(nume)', '[nume]', '{nume}', '<nume>'], '{nume}', 'Acoladele `{}` permit JS în JSX.', { topic: 'jsx-exp' }),
        mc('Atribut dinamic', 'Cum setezi `src` cu o variabilă `url`?', ['src="{url}"', 'src={url}', 'src=url', 'src=(url)'], 'src={url}', 'Atribute dinamice nu folosesc ghilimele când au `{}`.', { topic: 'jsx-exp' }),
        mc('Style inline', 'Care e corect pentru style inline?', ['style="color: red"', 'style={color: red}', 'style={{ color: "red" }}', 'css={{ color: "red" }}'], 'style={{ color: "red" }}', 'Style e obiect JS — `{{ ... }}` (un `{}` JSX, unul obiect).', { topic: 'jsx-exp' }),
        sa('Calcul în JSX', 'Cum afișezi rezultatul lui 5+3 în JSX? Scrie doar expresia (cu acolade).', '{5+3}', 'Calculele se pun direct în `{}`.', { topic: 'jsx-exp' }),
        mc('Ce nu poți pune în {}', 'Care din astea NU se poate pune direct în {}?', ['Variabilă', 'Calcul matematic', 'Statement if', 'Operator ternar'], 'Statement if', '`if` e statement, nu expresie. Folosește operator ternar.', { topic: 'jsx-exp' }),
        mc('Operator ternar', 'Cum afișezi "Da" dacă x>0, altfel "Nu"?', ['{if(x>0) "Da" else "Nu"}', '{x>0 ? "Da" : "Nu"}', '{x>0 && "Da"}', '{x>0 || "Nu"}'], '{x>0 ? "Da" : "Nu"}', 'Operator ternar funcționează în JSX.', { topic: 'jsx-exp' }),
        mc('Comentariu în JSX', 'Cum scrii un comentariu în JSX?', ['// comentariu', '<!-- comentariu -->', '{/* comentariu */}', '# comentariu'], '{/* comentariu */}', 'Comentariile JSX sunt `{/* ... */}`.', { topic: 'jsx-exp' }),
        mc('Numerele în atribute', 'Cum setezi `width=200` corect?', ['width="200"', 'width={200}', 'Ambele', 'Niciuna'], 'Ambele', 'Funcționează ambele, dar `{200}` e număr real, `"200"` e string.', { topic: 'jsx-exp' }),
        sa('Boolean', 'Cum setezi `disabled` true pe un buton? Scrie doar atributul (disabled={true}).', 'disabled={true}', 'Boolean-ul în atribut: `disabled={true}`. Sau scurt: `disabled`.', { topic: 'jsx-exp' }),
        mc('Și logic &&', 'Ce face `{logat && <p>Bun venit</p>}`?', ['Mereu afișează p', 'Afișează p doar dacă logat e true', 'Eroare', 'Afișează "logat"'], 'Afișează p doar dacă logat e true', 'Operatorul `&&` e foarte util pentru randare condiționată.', { topic: 'jsx-exp' }),
      ],
    },

    // ==================== 4. COMPONENTE ====================
    {
      slug: 'react-componente',
      title: '4. Componente funcționale',
      isFree: false,
      theory: `# 🧩 Componente funcționale

## Ce e o componentă?

**Componenta** = **funcție** care returnează JSX.

\`\`\`jsx
function Buton() {
  return <button>Apasă</button>;
}
\`\`\`

## Cum o folosești?

\`\`\`jsx
function App() {
  return (
    <div>
      <Buton />
      <Buton />
      <Buton />
    </div>
  );
}
\`\`\`

> 💡 O scrii **o dată**, o folosești de **oricâte ori**!

## Sintaxa modernă: arrow function

\`\`\`jsx
const Buton = () => {
  return <button>Apasă</button>;
};
\`\`\`

## Cu return scurt (fără {})

\`\`\`jsx
const Buton = () => <button>Apasă</button>;
\`\`\`

## Reguli importante

### 1. **Numele cu literă MARE**
\`\`\`jsx
function Card() {...}      // ✅
function card() {...}      // ❌ — React crede că e tag HTML
\`\`\`

### 2. **Un fișier = o componentă (de obicei)**
\`\`\`
src/
  components/
    Buton.jsx        // export default function Buton() {...}
    Card.jsx
    Header.jsx
\`\`\`

### 3. **Export / import**
\`\`\`jsx
// Buton.jsx
export default function Buton() {
  return <button>Click</button>;
}

// App.jsx
import Buton from './Buton';
\`\`\`

## 🎓 Ce ai învățat
- ✅ Componenta = funcție care returnează JSX
- ✅ Reutilizezi de oricâte ori
- ✅ Nume cu literă mare
- ✅ Export default + import
`,
      problems: [
        mc('Ce e o componentă?', 'O componentă React e...', ['Un fișier CSS', 'O funcție care returnează JSX', 'Un obiect JSON', 'O bază de date'], 'O funcție care returnează JSX', 'Componentele sunt funcții care produc UI (JSX).', { topic: 'componente' }),
        mc('Litera componentei', 'Care e GREȘIT?', ['function Card() {}', 'const Buton = () => {...}', 'function card() {}', 'function Header() {}'], 'function card() {}', 'Numele componentei TREBUIE să înceapă cu literă MARE.', { topic: 'componente' }),
        mc('Folosire componentă', 'Cum folosești componenta `Card`?', ['Card()', '<Card />', '{Card}', 'call(Card)'], '<Card />', 'Componentele se folosesc ca tag-uri JSX.', { topic: 'componente' }),
        sa('Arrow function', 'Scrie semnătura unei componente Buton ca arrow function (const Buton = () => {).', 'const Buton = () => {', 'Arrow functions sunt sintaxa modernă.', { topic: 'componente' }),
        mc('Reutilizare', 'Câte ori poți folosi o componentă?', ['O singură dată', 'Maxim 5', 'Oricâte', 'Depinde de browser'], 'Oricâte', 'Asta e marele avantaj — o componentă = oricâte instanțe.', { topic: 'componente' }),
        mc('Export default', 'Cum exporți o componentă pentru a fi importată?', ['module.exports = Buton', 'export default Buton', 'public Buton', 'global Buton'], 'export default Buton', 'În React modern: `export default Buton`.', { topic: 'componente' }),
        mc('Import componentă', 'Cum imporți o componentă din `./Buton`?', ['require Buton', 'import Buton from "./Buton"', 'include "./Buton"', 'load Buton'], 'import Buton from "./Buton"', 'Sintaxa ES6 pentru import.', { topic: 'componente' }),
        mc('Return scurt', 'Care arrow function e validă?', ['const A = () => <p>x</p>', 'const A = () => { return <p>x</p>; }', 'Ambele', 'Niciuna'], 'Ambele', 'Cu `()` e implicit return; cu `{}` ai nevoie de `return`.', { topic: 'componente' }),
        sa('Componentă goală', 'Scrie o componentă Header care returnează un h1 gol. Scrie semnătura (function Header() {).', 'function Header() {', 'O componentă obișnuită începe cu `function NumeMare() {`.', { topic: 'componente' }),
        mc('De ce literă mare?', 'De ce numele cu literă mare?', ['React e snob', 'Pentru a distinge de tag-uri HTML', 'Convenție din Java', 'Performanță'], 'Pentru a distinge de tag-uri HTML', '`<div>` = HTML, `<Div>` = componentă.', { topic: 'componente' }),
      ],
    },

    // ==================== 5. PROPS ====================
    {
      slug: 'react-props',
      title: '5. Props (propietăți)',
      isFree: false,
      theory: `# 📦 Props — date pentru componente

## Ce sunt props?

**Props** (properties) = **datele** pe care le primește o componentă, **din afară**.

> 💡 Sunt ca **argumentele unei funcții**.

## Trimiți props

\`\`\`jsx
<Salut nume="Ana" varsta={11} />
\`\`\`

## Primești props

\`\`\`jsx
function Salut(props) {
  return <h1>Salut, {props.nume}! Ai {props.varsta} ani.</h1>;
}
\`\`\`

## Destructurare (modern)

\`\`\`jsx
function Salut({ nume, varsta }) {
  return <h1>Salut, {nume}! Ai {varsta} ani.</h1>;
}
\`\`\`

> 💡 Mai curat — extragi direct ce-ți trebuie!

## Tipuri de props

\`\`\`jsx
<Card
  titlu="Vacanță"           // string
  pret={199}                 // number
  reducere={true}            // boolean
  taguri={['vară','plajă']}  // array
  user={{ nume: 'Ana' }}     // obiect
  onClick={handleClick}      // funcție
/>
\`\`\`

## Default props

\`\`\`jsx
function Salut({ nume = "Anonim" }) {
  return <h1>Bună, {nume}!</h1>;
}

<Salut />              // → "Bună, Anonim!"
<Salut nume="Ion" />   // → "Bună, Ion!"
\`\`\`

## ⚠️ Props sunt **read-only**!

\`\`\`jsx
function Salut({ nume }) {
  nume = "altul";          // ❌ NU modifica props!
  return <h1>{nume}</h1>;
}
\`\`\`

> Props vin de "sus" și nu se modifică în componenta copil.

## 🎓 Ce ai învățat
- ✅ Props = date trimise de la părinte la copil
- ✅ Destructurare \`{ nume }\` mai curat
- ✅ Default props cu \`=\`
- ✅ NU modifici props
`,
      problems: [
        mc('Ce sunt props?', 'Props în React sunt...', ['Variabile globale', 'Date trimise componentei', 'CSS', 'Funcții speciale'], 'Date trimise componentei', 'Props = date pe care le primește o componentă din afară.', { topic: 'props' }),
        mc('Trimitere props', 'Cum trimiți `nume="Ana"` la `<Card>`?', ['<Card props.nume="Ana" />', '<Card nume="Ana" />', '<Card>nume=Ana</Card>', 'Card({nume:"Ana"})'], '<Card nume="Ana" />', 'Props sunt atribute JSX.', { topic: 'props' }),
        mc('Primire props', 'Cum primești props într-o componentă?', ['Le iei automat', 'Ca primul argument al funcției', 'Cu useState', 'Cu fetch'], 'Ca primul argument al funcției', '`function Card(props) {...}` — primul parametru.', { topic: 'props' }),
        sa('Destructurare', 'Cum primești destructurat un prop `titlu`? Scrie semnătura (function Card({ titlu }) {).', 'function Card({ titlu }) {', 'Destructurare: `function Card({ titlu }) {...}`.', { topic: 'props' }),
        mc('Number prop', 'Cum trimiți numărul 18?', ['varsta="18"', 'varsta={18}', 'varsta=18', 'Toate'], 'varsta={18}', '`{18}` e număr real; `"18"` ar fi string.', { topic: 'props' }),
        mc('Default prop', 'Cum setezi default pentru `nume` la "Anonim"?', ['nume = "Anonim"', '{ nume = "Anonim" }', '{ nume: "Anonim" }', 'nume?.="Anonim"'], '{ nume = "Anonim" }', 'În destructurare: `{ nume = "Anonim" }`.', { topic: 'props' }),
        mc('Props read-only', 'Pot modifica props în copil?', ['Da, mereu', 'NU — sunt read-only', 'Doar string-urile', 'Doar cu useState'], 'NU — sunt read-only', 'Props vin de sus și NU se modifică.', { topic: 'props' }),
        mc('Pass funcție', 'Cum trimiți o funcție `salut` ca prop?', ['onAction="salut"', 'onAction={salut}', 'onAction={salut()}', 'salut(true)'], 'onAction={salut}', '`onAction={salut}` — fără `()` (altfel ai apela-o instant).', { topic: 'props' }),
        mc('Obiect prop', 'Cum trimiți un obiect `{ nume: "Ana" }`?', ['user="{ nume: \'Ana\' }"', 'user={{ nume: "Ana" }}', 'user=({ nume: "Ana" })', 'user.nume="Ana"'], 'user={{ nume: "Ana" }}', 'Dublu `{{}}`: primul JSX, al doilea obiect.', { topic: 'props' }),
        mc('Spread props', 'Ce face `<Card {...user} />`?', ['Eroare', 'Pasează toate proprietățile lui user ca props', 'Apelează spread', 'Doar nume'], 'Pasează toate proprietățile lui user ca props', 'Spread `...obj` pasează toate proprietățile.', { topic: 'props' }),
      ],
    },

    // ==================== 6. CHILDREN ====================
    {
      slug: 'react-children',
      title: '6. Children și Composition',
      isFree: false,
      theory: `# 👶 props.children

## Ce este children?

**\`children\`** = ce e **între** tag-urile de deschidere și închidere ale unei componente.

\`\`\`jsx
<Cutie>
  <h1>Acesta e children!</h1>
  <p>Și asta tot.</p>
</Cutie>
\`\`\`

## Folosirea children

\`\`\`jsx
function Cutie({ children }) {
  return <div className="cutie">{children}</div>;
}
\`\`\`

> 💡 \`{children}\` zice React-ului: "pune aici ce mi-a dat părintele între tag-uri".

## Exemplu: Card reutilizabil

\`\`\`jsx
function Card({ titlu, children }) {
  return (
    <div className="card">
      <h2>{titlu}</h2>
      <div className="continut">{children}</div>
    </div>
  );
}

// Folosire:
<Card titlu="Despre mine">
  <p>Sunt programator.</p>
  <button>Contact</button>
</Card>
\`\`\`

## De ce e util?

- 🧩 **Composition** > Inheritance
- 🎨 Faci wrapper-e (Layout, Modal, Card)
- 🔄 Reutilizezi structura, schimbi conținutul

## 🎓 Ce ai învățat
- ✅ \`children\` = ce e între \`<X>...</X>\`
- ✅ Folosești \`{children}\` pentru a-l afișa
- ✅ Excelent pentru wrapper-e și layout-uri
`,
      problems: [
        mc('Ce e children?', '`children` în React e...', ['O variabilă globală', 'Conținutul dintre tag-uri', 'Un hook', 'CSS'], 'Conținutul dintre tag-uri', '`children` = ce e între `<X>...</X>`.', { topic: 'children' }),
        mc('Acces children', 'Cum afișezi children în JSX?', ['{props.children}', '<children />', 'props["children"]()', 'render(children)'], '{props.children}', '`{props.children}` sau cu destructurare `{children}`.', { topic: 'children' }),
        sa('Destructurare children', 'Scrie semnătura unei componente Card care primește children destructurat. (function Card({ children }) {)', 'function Card({ children }) {', 'Destructurare: `{ children }`.', { topic: 'children' }),
        mc('Auto-close', 'Poate o componentă care folosește children să fie auto-close?', ['Mereu', 'NU dacă vrei să dai children', 'Niciodată', 'Doar cu props'], 'NU dacă vrei să dai children', '`<X />` nu poate avea children. Folosește `<X>...</X>`.', { topic: 'children' }),
        mc('Composition', 'Composition în React înseamnă...', ['Heredity de clase', 'Combinarea componentelor', 'CSS', 'Algoritm de sortare'], 'Combinarea componentelor', 'React preferă composition (children + props).', { topic: 'children' }),
        mc('Wrapper layout', 'Pentru un Layout cu header/footer + conținut, ce primești?', ['un prop `header`', 'children', 'props.body', 'nimic'], 'children', 'Layout-urile primesc children pentru a wrap-a conținutul.', { topic: 'children' }),
        mc('Multiple props + children', 'Poți avea și props ȘI children?', ['Nu, doar unul', 'Da', 'Doar string', 'Doar dacă e Fragment'], 'Da', 'Children e doar un alt prop special.', { topic: 'children' }),
        mc('children e prop?', '`children` e un...', ['hook', 'prop special', 'tip de date', 'eveniment'], 'prop special', '`children` e un prop ca oricare altul, doar că e umplut cu JSX dintre tag-uri.', { topic: 'children' }),
        mc('Card cu children', 'Pentru `<Card>Salut</Card>`, ce e children?', ['Card', '"Salut"', 'undefined', 'children'], '"Salut"', 'Text-ul dintre tag-uri devine children.', { topic: 'children' }),
        mc('Children null', 'Dacă `<Card />` (fără copii), children e...', ['"empty"', 'undefined', '[]', 'null'], 'undefined', 'Fără copii, `children` e `undefined`.', { topic: 'children' }),
      ],
    },

    // ==================== 7. CONDITIONAL RENDERING ====================
    {
      slug: 'react-conditional',
      title: '7. Conditional Rendering',
      isFree: false,
      theory: `# 🔀 Randare condiționată

## Operator ternar \`? :\`

Cel mai folosit pentru "if/else" în JSX:

\`\`\`jsx
function Salut({ logat }) {
  return (
    <div>
      {logat ? <p>Bun venit!</p> : <p>Te rog logează-te</p>}
    </div>
  );
}
\`\`\`

## Operator \`&&\` (afișează dacă)

Pentru "afișează doar dacă":

\`\`\`jsx
{erori.length > 0 && <p>Ai {erori.length} erori</p>}
\`\`\`

> ⚠️ **Atenție**: \`{0 && <p>...</p>}\` afișează **0** (nu nimic)!
> Folosește \`{count > 0 && <p>...</p>}\` în loc.

## If clasic (în afara JSX)

\`\`\`jsx
function Status({ user }) {
  if (!user) return <p>Loading...</p>;
  if (user.banned) return <p>Banat</p>;
  return <p>Bun venit, {user.nume}!</p>;
}
\`\`\`

## Switch (mai rar, dar util)

\`\`\`jsx
function Iconita({ tip }) {
  switch (tip) {
    case 'success': return <span>✅</span>;
    case 'error': return <span>❌</span>;
    case 'warn': return <span>⚠️</span>;
    default: return null;
  }
}
\`\`\`

## Returnează \`null\` = nimic

\`\`\`jsx
if (!afiseaza) return null;
\`\`\`

> Componenta nu va randa nimic.

## 🎓 Ce ai învățat
- ✅ \`a ? b : c\` — ternar pentru if/else
- ✅ \`a && b\` — afișează b dacă a e adevărat
- ✅ \`if\` clasic în afara JSX
- ✅ \`return null\` = nimic
`,
      problems: [
        mc('Ternar', 'Care e sintaxa ternarului?', ['if a then b else c', 'a ? b : c', 'a => b ; c', 'a && b || c'], 'a ? b : c', '`condiție ? dacăDa : dacăNu`.', { topic: 'condiționat' }),
        mc('Operator &&', '`{logat && <p>Hi</p>}` afișează p când...', ['Mereu', 'logat e adevărat', 'logat e fals', 'Niciodată'], 'logat e adevărat', '`&&` afișează al doilea operand doar dacă primul e truthy.', { topic: 'condiționat' }),
        mc('Capcană 0', '`{0 && <p>X</p>}` afișează...', ['Nimic', '"0"', 'p', 'Eroare'], '"0"', '0 e falsy, dar React îl randează ca text! Folosește `{count > 0 && ...}`.', { topic: 'condiționat' }),
        mc('Nimic afișat', 'Cum spui componentei să nu randeze nimic?', ['return false', 'return ""', 'return null', 'return undefined'], 'return null', '`return null` = nu randează nimic.', { topic: 'condiționat' }),
        sa('If else în JSX', 'Scrie ternar pentru: dacă x>0 afișează "+" altfel "-". Scrie expresia (x>0 ? "+" : "-").', 'x>0 ? "+" : "-"', 'Ternar pentru if/else.', { topic: 'condiționat' }),
        mc('If clasic', 'Unde poți folosi `if` clasic?', ['În JSX', 'În afara JSX, în corpul funcției', 'În atribute', 'În children'], 'În afara JSX, în corpul funcției', '`if` e statement, merge înainte de return.', { topic: 'condiționat' }),
        mc('Switch return', 'Switch poate fi folosit pentru randare condiționată?', ['Nu', 'Da, în corpul funcției', 'Doar în JSX', 'Doar cu use'], 'Da, în corpul funcției', 'Switch funcționează ca în JS normal.', { topic: 'condiționat' }),
        mc('Multiple return', 'Poți avea mai multe `return` într-o componentă?', ['Nu', 'Da, dar nu recomandat', 'Da, des folosit pentru early return', 'Doar 2'], 'Da, des folosit pentru early return', 'Early return e pattern uzual: `if (loading) return ...`.', { topic: 'condiționat' }),
        mc('IIFE în JSX', 'Cum bagi if/else complex în JSX?', ['Nu se poate', 'Cu IIFE: {(() => { if (...) return ... })()}', 'Cu await', 'Cu try'], 'Cu IIFE: {(() => { if (...) return ... })()}', 'IIFE e o opțiune, dar e mai curat să extragi într-o funcție.', { topic: 'condiționat' }),
        mc('Boolean false', '{false} în JSX afișează...', ['"false"', 'Nimic', 'Eroare', '0'], 'Nimic', 'React ignoră `false`, `null`, `undefined`, `true` la randare.', { topic: 'condiționat' }),
      ],
    },

    // ==================== 8. LISTS - .map() ====================
    {
      slug: 'react-lists-map',
      title: '8. Liste — .map() pentru randare',
      isFree: false,
      theory: `# 📋 Randare liste cu .map()

## Problema

Ai un array și vrei să afișezi un element pentru fiecare. Cum?

## Soluția: \`.map()\`

\`\`\`jsx
const fructe = ['mar', 'banana', 'cireasă'];

function Lista() {
  return (
    <ul>
      {fructe.map(f => <li>{f}</li>)}
    </ul>
  );
}
\`\`\`

> 💡 \`.map()\` transformă fiecare element din array într-un element JSX.

## ⚠️ \`key\` — OBLIGATORIU!

\`\`\`jsx
{fructe.map(f => <li key={f}>{f}</li>)}
\`\`\`

> 💡 React are nevoie de **key unic** pentru fiecare element.
> 🚨 Fără \`key\`, primești warning în consolă.

## Cu obiecte (cazul real)

\`\`\`jsx
const useri = [
  { id: 1, nume: 'Ana' },
  { id: 2, nume: 'Bogdan' },
];

<ul>
  {useri.map(u => (
    <li key={u.id}>{u.nume}</li>
  ))}
</ul>
\`\`\`

> 💡 \`key={u.id}\` — folosește mereu un id stabil.

## NU folosi index ca key (dacă lista se schimbă)

\`\`\`jsx
{useri.map((u, i) => <li key={i}>{u.nume}</li>)}  // ⚠️ doar dacă lista e statică
\`\`\`

> Dacă ștergi/sortezi, index-ul devine "alunecos" — bug-uri vizuale.

## Componentă pentru fiecare item

\`\`\`jsx
function User({ u }) {
  return <li>{u.nume} ({u.varsta})</li>;
}

<ul>
  {useri.map(u => <User key={u.id} u={u} />)}
</ul>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`.map()\` pentru a randa array → JSX
- ✅ Mereu folosește \`key\` unic
- ✅ Preferă \`id\`-uri stabile, nu index
`,
      problems: [
        mc('Metoda pentru liste', 'Care metodă transformă array → JSX?', ['.forEach()', '.map()', '.filter()', '.find()'], '.map()', '`.map()` returnează un array nou — perfect pentru JSX.', { topic: 'liste' }),
        mc('Key obligatoriu?', 'Trebuie key pe elementele dintr-o listă?', ['Nu', 'DA — obligatoriu', 'Doar la 100+ elemente', 'Doar pentru obiecte'], 'DA — obligatoriu', 'React are nevoie de key pentru tracking.', { topic: 'liste' }),
        mc('Best key', 'Cea mai bună key e...', ['index', 'Math.random()', 'id stabil al obiectului', 'numele'], 'id stabil al obiectului', 'ID-ul stabil (DB id, UUID) e ideal.', { topic: 'liste' }),
        mc('Key pe ce element?', 'Pe ce element pui key?', ['Pe elementul interior', 'Pe elementul returnat de .map()', 'Pe părinte', 'Oriunde'], 'Pe elementul returnat de .map()', '`{arr.map(x => <Li key={x.id}>...</Li>)}` — key pe `<Li>`.', { topic: 'liste' }),
        sa('Sintaxa map', 'Scrie: dintr-un array `nume`, randează `<li>` pentru fiecare. Începe cu {nume.map(', '{nume.map(', 'Sintaxa: `{nume.map(n => <li key={n}>{n}</li>)}`.', { topic: 'liste' }),
        mc('Index ca key', 'Index ca key e OK?', ['Mereu', 'Niciodată', 'Doar dacă lista nu se modifică', 'Doar dacă există 1 element'], 'Doar dacă lista nu se modifică', 'Pentru liste statice e OK; pentru dinamice cauzează bug-uri.', { topic: 'liste' }),
        mc('forEach în JSX', 'Pot folosi `.forEach()` în JSX?', ['Da, oricând', 'NU — nu returnează nimic', 'Doar pentru obiecte', 'Doar cu return'], 'NU — nu returnează nimic', '`.forEach()` nu returnează nimic — folosește `.map()`.', { topic: 'liste' }),
        mc('Liste goale', 'Ce face `[].map(...)` în JSX?', ['Eroare', 'Afișează nimic', '"empty"', 'undefined'], 'Afișează nimic', 'Array gol → nimic randat.', { topic: 'liste' }),
        mc('Ce returnează map', '`[1,2,3].map(x => x*2)` returnează...', ['[2,4,6]', '[1,2,3]', '6', 'undefined'], '[2,4,6]', '`.map()` aplică funcția pe fiecare element și returnează array nou.', { topic: 'liste' }),
        mc('Componenta în map', 'Pot randa o componentă proprie în map?', ['Nu', 'Da: `{arr.map(x => <Card key={x.id} x={x} />)}`', 'Doar tag HTML', 'Doar string'], 'Da: `{arr.map(x => <Card key={x.id} x={x} />)}`', 'Componentele proprii merg perfect cu .map().', { topic: 'liste' }),
      ],
    },

    // ==================== 9. EVENT HANDLERS ====================
    {
      slug: 'react-events',
      title: '9. Event Handlers (onClick, onChange...)',
      isFree: false,
      theory: `# 🖱️ Evenimente în React

## onClick

\`\`\`jsx
function Buton() {
  const handleClick = () => {
    alert('Apăsat!');
  };
  return <button onClick={handleClick}>Apasă</button>;
}
\`\`\`

> 💡 **camelCase**: \`onClick\`, NU \`onclick\`.
> 💡 Pasezi **referința** la funcție: \`onClick={handleClick}\` (fără \`()\`).

## ⚠️ Greșeli frecvente

\`\`\`jsx
<button onClick={handleClick} />     // ✅ pasezi funcția
<button onClick={handleClick()} />   // ❌ o APELEZI imediat la randare
<button onclick={handleClick} />     // ❌ camelCase greșit
\`\`\`

## Inline handler

\`\`\`jsx
<button onClick={() => alert('Hi')}>Apasă</button>
\`\`\`

> 💡 Folosește arrow function inline pentru lucruri scurte.

## Pasezi argumente

\`\`\`jsx
<button onClick={() => stergeUser(u.id)}>Șterge</button>
\`\`\`

## Event object

\`\`\`jsx
function handleChange(e) {
  console.log(e.target.value);   // valoarea inputului
}

<input onChange={handleChange} />
\`\`\`

## Evenimente comune

| Eveniment | Folosit pentru |
|---|---|
| \`onClick\` | Click |
| \`onChange\` | Input modificat |
| \`onSubmit\` | Form trimis |
| \`onMouseEnter\` | Mouse intră |
| \`onMouseLeave\` | Mouse iese |
| \`onKeyDown\` | Tastă apăsată |
| \`onFocus\` | Element primește focus |
| \`onBlur\` | Element pierde focus |

## preventDefault()

\`\`\`jsx
function handleSubmit(e) {
  e.preventDefault();    // oprește submit-ul default (refresh pagină)
  // logica ta
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ camelCase: \`onClick\`, \`onChange\`
- ✅ Pasezi funcția (fără \`()\`)
- ✅ \`e.target.value\` pentru input
- ✅ \`e.preventDefault()\` în submit
`,
      problems: [
        mc('Sintaxa click', 'Care e corect?', ['onclick={fn}', 'onClick={fn}', 'on-click={fn}', 'click={fn}'], 'onClick={fn}', 'JSX folosește camelCase: `onClick`.', { topic: 'events' }),
        mc('Pasare funcție', 'Care e corect?', ['onClick={fn()}', 'onClick={fn}', 'onClick=fn', 'onClick="fn"'], 'onClick={fn}', '`onClick={fn}` pasează referința; `fn()` o apelează imediat.', { topic: 'events' }),
        mc('Inline handler', 'Cum scrii inline o funcție?', ['onClick=alert("hi")', 'onClick={() => alert("hi")}', 'onClick={alert("hi")}', 'onClick(alert)'], 'onClick={() => alert("hi")}', 'Arrow function inline previne apelarea imediată.', { topic: 'events' }),
        sa('Valoare input', 'Cum iei valoarea unui input din event `e`? (e.target.value)', 'e.target.value', '`e.target.value` e standardul.', { topic: 'events' }),
        mc('Submit form', 'Cum oprești refresh-ul când dai submit?', ['return false', 'e.preventDefault()', 'e.stop()', 'e.cancel()'], 'e.preventDefault()', '`e.preventDefault()` oprește comportamentul default.', { topic: 'events' }),
        mc('Pasare argument', 'Cum pasezi `id` la handler?', ['onClick={handleClick(id)}', 'onClick={() => handleClick(id)}', 'onClick=handleClick(id)', 'onClick(id)'], 'onClick={() => handleClick(id)}', 'Wrap în arrow function.', { topic: 'events' }),
        mc('Eveniment input', 'Care e folosit la input?', ['onClick', 'onChange', 'onSubmit', 'onLoad'], 'onChange', '`onChange` se declanșează la modificare.', { topic: 'events' }),
        mc('Mouse enter', 'Care e numele evenimentului pentru mouse intră?', ['onHover', 'onMouseEnter', 'onMouseOver', 'Ambele B și C'], 'Ambele B și C', '`onMouseEnter` (nu se propagă) și `onMouseOver` (se propagă).', { topic: 'events' }),
        mc('Tastă apăsată', 'Care eveniment pentru tastă?', ['onKeyDown', 'onKeyPress', 'onKeyUp', 'Toate'], 'Toate', 'Există toate trei: down/press(deprecated)/up.', { topic: 'events' }),
        mc('Focus pierdut', 'Când pierde focus un input?', ['onFocus', 'onBlur', 'onLost', 'onLeave'], 'onBlur', '`onBlur` = pierdere focus.', { topic: 'events' }),
      ],
    },

    // ==================== 10. useState BASIC ====================
    {
      slug: 'react-usestate-basic',
      title: '10. useState — state de bază',
      isFree: false,
      theory: `# 🔄 useState — state-ul componentei

## Ce este state?

**State** = **memoria** unei componente. Date care se schimbă în timp și fac UI-ul să se re-randeze.

## Sintaxa useState

\`\`\`jsx
import { useState } from 'react';

function Contor() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Numărul: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

## Anatomie

\`\`\`jsx
const [count, setCount] = useState(0);
//     ↑       ↑                   ↑
//  valoare  setter      valoare inițială
\`\`\`

- \`count\` — valoarea curentă
- \`setCount\` — funcția care o schimbă
- \`0\` — valoarea inițială

## Reguli importante

### 1. **Hook-urile sunt apelate la TOP-LEVEL**
\`\`\`jsx
function App() {
  const [x, setX] = useState(0);     // ✅ top-level

  if (cond) {
    const [y, setY] = useState(0);   // ❌ în if!
  }
}
\`\`\`

### 2. **Setter declanșează re-randare**
\`\`\`jsx
setCount(5);   // componenta se re-randează cu count=5
\`\`\`

### 3. **NU modifici direct state-ul**
\`\`\`jsx
count = 5;     // ❌ nu funcționează
setCount(5);   // ✅ corect
\`\`\`

## Multiple state-uri

\`\`\`jsx
function Form() {
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [varsta, setVarsta] = useState(0);
  // ...
}
\`\`\`

## Functional update (recomandat când depinzi de cel anterior)

\`\`\`jsx
setCount(prev => prev + 1);
\`\`\`

> 💡 Folosește când noul state depinde de cel vechi — evită bug-uri.

## 🎓 Ce ai învățat
- ✅ \`const [val, setVal] = useState(initial)\`
- ✅ Setter-ul declanșează re-render
- ✅ NU modifici state direct
- ✅ \`setX(prev => prev + 1)\` pentru update bazat pe vechi
`,
      problems: [
        mc('Import useState', 'Cum imporți useState?', ['import useState', 'import { useState } from "react"', 'require("useState")', 'use { State }'], 'import { useState } from "react"', 'Named import din "react".', { topic: 'usestate' }),
        mc('Sintaxa', 'Care e corect?', ['const count = useState(0)', 'const [count, setCount] = useState(0)', 'const {count, setCount} = useState(0)', 'let count = 0'], 'const [count, setCount] = useState(0)', 'Destructurare array: `[valoare, setter]`.', { topic: 'usestate' }),
        mc('Setter', 'Ce face `setCount(5)`?', ['Modifică direct count', 'Programează re-render cu count=5', 'Eroare', 'Returnează 5'], 'Programează re-render cu count=5', 'Setter-ul nu modifică imediat — programează re-randare.', { topic: 'usestate' }),
        mc('Modificare directă', '`count = 5` funcționează?', ['Da', 'NU — folosește setCount', 'Doar pentru numere', 'Doar prima dată'], 'NU — folosește setCount', 'NICIODATĂ nu modifici state direct.', { topic: 'usestate' }),
        sa('Inițializare', 'Cum declari un state `name` cu valoare inițială "Ana"? (const [name, setName] = useState("Ana"))', 'const [name, setName] = useState("Ana")', 'Standard: `const [name, setName] = useState("Ana")`.', { topic: 'usestate' }),
        mc('Hooks în if', 'Pot apela `useState` într-un `if`?', ['Da', 'NU — doar la top-level', 'Doar prima dată', 'Doar în componente clasice'], 'NU — doar la top-level', 'Hooks trebuie apelate la top-level, mereu în aceeași ordine.', { topic: 'usestate' }),
        mc('Functional update', 'Care e mai sigur?', ['setCount(count+1)', 'setCount(prev => prev+1)', 'setCount(++count)', 'count++'], 'setCount(prev => prev+1)', 'Functional update e sigur când multiple update-uri rapide.', { topic: 'usestate' }),
        mc('Re-render', 'Când se re-randează componenta?', ['Mereu', 'Când dai setState', 'Când refresh-ezi pagina', 'La click'], 'Când dai setState', 'Setter-ul declanșează re-render.', { topic: 'usestate' }),
        mc('Multiple state', 'Pot avea mai multe useState într-o componentă?', ['Nu, doar 1', 'Maxim 3', 'Oricâte', 'Doar 5'], 'Oricâte', 'Poți avea oricâte useState; sunt diferențiate prin ordine.', { topic: 'usestate' }),
        mc('Tip valoare', 'Ce tip de valoare poate ține useState?', ['Doar number', 'Doar string', 'Orice', 'Doar boolean'], 'Orice', 'String, number, boolean, array, obiect — orice.', { topic: 'usestate' }),
      ],
    },

    // ==================== 11. useState OBJECTS/ARRAYS ====================
    {
      slug: 'react-usestate-advanced',
      title: '11. useState — array și obiecte',
      isFree: false,
      theory: `# 📚 useState cu array și obiecte

## ⚠️ Imutabilitate

În React, **NU modifici** direct array sau obiect — creezi unul **nou**.

\`\`\`jsx
const [user, setUser] = useState({ nume: 'Ana', varsta: 11 });

user.varsta = 12;          // ❌ NU funcționează
setUser({ nume: 'Ana', varsta: 12 });   // ❌ uiți alte câmpuri
setUser({ ...user, varsta: 12 });        // ✅ spread + override
\`\`\`

## Spread \`...\` pentru obiecte

\`\`\`jsx
setUser({ ...user, varsta: 12 });
//        ↑ copie tot, schimbă doar varsta
\`\`\`

## Array — adăugare

\`\`\`jsx
const [todos, setTodos] = useState([]);

// ❌ greșit:
todos.push('cumpără pâine');
setTodos(todos);

// ✅ corect:
setTodos([...todos, 'cumpără pâine']);
\`\`\`

## Array — ștergere

\`\`\`jsx
setTodos(todos.filter(t => t !== 'cumpără pâine'));
\`\`\`

## Array — modificare element

\`\`\`jsx
setTodos(todos.map(t => t.id === id ? { ...t, done: true } : t));
\`\`\`

## Array — ștergere după index

\`\`\`jsx
setTodos(todos.filter((_, i) => i !== idx));
\`\`\`

## State complex — split sau combine?

**Split** când câmpurile sunt independente:
\`\`\`jsx
const [nume, setNume] = useState('');
const [email, setEmail] = useState('');
\`\`\`

**Combine** când se schimbă împreună:
\`\`\`jsx
const [form, setForm] = useState({ nume: '', email: '' });
setForm({ ...form, nume: 'Ana' });
\`\`\`

## 🎓 Ce ai învățat
- ✅ Imutabilitate: creezi obiect/array NOU
- ✅ Spread \`{ ...obj }\` și \`[...arr]\`
- ✅ \`.filter()\` pentru ștergere
- ✅ \`.map()\` pentru modificare
`,
      problems: [
        mc('Modificare obiect', 'Care e corect pentru a modifica `user.varsta`?', ['user.varsta = 12', 'setUser({...user, varsta: 12})', 'setUser(user.varsta = 12)', 'user["varsta"] = 12'], 'setUser({...user, varsta: 12})', 'Spread + override câmpuri.', { topic: 'usestate-adv' }),
        mc('Adăugare array', 'Cum adaugi "x" la array `arr`?', ['arr.push("x")', 'setArr([...arr, "x"])', 'setArr(arr + "x")', 'setArr.push("x")'], 'setArr([...arr, "x"])', 'Spread + element nou la final.', { topic: 'usestate-adv' }),
        mc('Ștergere array', 'Cum ștergi "x" din array?', ['arr.splice(...)', 'setArr(arr.filter(x => x !== "x"))', 'arr.delete("x")', 'arr.remove("x")'], 'setArr(arr.filter(x => x !== "x"))', '`.filter()` returnează array nou fără elementul.', { topic: 'usestate-adv' }),
        sa('Spread obiect', 'Scrie: `setUser` pentru a păstra tot și schimba `email` la "x@x". (setUser({...user, email: "x@x"}))', 'setUser({...user, email: "x@x"})', 'Spread + override.', { topic: 'usestate-adv' }),
        mc('De ce imutabilitate?', 'De ce nu modifici direct?', ['Nu se vede schimbarea', 'React nu detectează schimbarea', 'Crash', 'Performance'], 'React nu detectează schimbarea', 'React compară referințe — același obiect = aceeași referință.', { topic: 'usestate-adv' }),
        mc('Map pentru update', 'Cum actualizezi un item într-un array?', ['arr[i] = newVal', 'setArr(arr.map(x => x.id===id ? newVal : x))', 'arr.update(...)', 'arr[i].set(...)'], 'setArr(arr.map(x => x.id===id ? newVal : x))', '`.map()` cu condiție.', { topic: 'usestate-adv' }),
        mc('Push merge?', '`arr.push(x)` urmat de `setArr(arr)` funcționează?', ['Da', 'NU — modifică în loc, React nu vede schimbarea', 'Doar uneori', 'Doar pentru string'], 'NU — modifică în loc, React nu vede schimbarea', 'Push mută array-ul existent — referința rămâne aceeași.', { topic: 'usestate-adv' }),
        mc('Ștergere prin index', 'Cum ștergi elementul de la index 2?', ['arr.splice(2,1)', 'setArr(arr.filter((_,i) => i !== 2))', 'arr.delete(2)', 'arr[2] = null'], 'setArr(arr.filter((_,i) => i !== 2))', 'Filter cu index.', { topic: 'usestate-adv' }),
        mc('Spread nested', 'Pentru `{user: {profil: {nume: ""}}}`, schimbi profil.nume cum?', ['user.profil.nume = "x"', 'setObj({...obj, user: {...obj.user, profil: {...obj.user.profil, nume: "x"}}})', 'setObj.user.profil.nume = "x"', 'obj["user.profil.nume"] = "x"'], 'setObj({...obj, user: {...obj.user, profil: {...obj.user.profil, nume: "x"}}})', 'Pentru nested, trebuie spread la fiecare nivel.', { topic: 'usestate-adv' }),
        mc('Lazy initial', 'Cum inițiezi state cu calcul scump?', ['useState(scump())', 'useState(() => scump())', 'useState({calc: scump})', 'lazyState(scump)'], 'useState(() => scump())', 'Lazy initial: pasezi funcție, se apelează doar prima dată.', { topic: 'usestate-adv' }),
      ],
    },

    // ==================== 12. FORMS ====================
    {
      slug: 'react-forms',
      title: '12. Forms și controlled inputs',
      isFree: false,
      theory: `# 📝 Forms în React

## Controlled Input

Un input "controlat" = state-ul React e **sursa de adevăr**.

\`\`\`jsx
function FormNume() {
  const [nume, setNume] = useState('');

  return (
    <input
      value={nume}
      onChange={e => setNume(e.target.value)}
    />
  );
}
\`\`\`

> 💡 \`value\` + \`onChange\` = controlled.

## Form complet

\`\`\`jsx
function Login() {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, parola });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={parola}
        onChange={e => setParola(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\`

## Diferite tipuri de input

### Checkbox
\`\`\`jsx
const [accept, setAccept] = useState(false);

<input
  type="checkbox"
  checked={accept}
  onChange={e => setAccept(e.target.checked)}
/>
\`\`\`

### Select
\`\`\`jsx
const [oras, setOras] = useState('cluj');

<select value={oras} onChange={e => setOras(e.target.value)}>
  <option value="cluj">Cluj</option>
  <option value="bucuresti">București</option>
</select>
\`\`\`

### Textarea
\`\`\`jsx
<textarea value={text} onChange={e => setText(e.target.value)} />
\`\`\`

## Pattern: un singur handler pentru tot form-ul

\`\`\`jsx
const [form, setForm] = useState({ nume: '', email: '' });

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

<input name="nume" value={form.nume} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />
\`\`\`

## 🎓 Ce ai învățat
- ✅ Controlled = \`value\` + \`onChange\`
- ✅ \`e.preventDefault()\` în submit
- ✅ Checkbox folosește \`checked\` + \`e.target.checked\`
- ✅ \`[e.target.name]\` pentru handler universal
`,
      problems: [
        mc('Controlled input', 'Ce face un input "controlled"?', ['Are background colorat', 'State React e sursa adevărată', 'Are ID', 'E protejat'], 'State React e sursa adevărată', 'Controlled = state-ul React controlează valoarea.', { topic: 'forms' }),
        mc('Atribute controlled', 'Care 2 atribute trebuie pe input controlled?', ['value + onChange', 'name + id', 'value + name', 'onClick + value'], 'value + onChange', 'value (afișează din state) + onChange (actualizează state).', { topic: 'forms' }),
        sa('Submit handler', 'Ce metodă oprești default submit-ul? (e.preventDefault())', 'e.preventDefault()', 'Standard pentru a preveni refresh la submit.', { topic: 'forms' }),
        mc('Checkbox', 'Care e diferit la checkbox față de text input?', ['Folosește `checked` în loc de `value`', 'Nu are onChange', 'Nu are state', 'Nimic'], 'Folosește `checked` în loc de `value`', '`checked={accept}` și `e.target.checked`.', { topic: 'forms' }),
        mc('Select value', 'Cum setezi valoarea selectată într-un `<select>`?', ['default="x" pe option', 'value="x" pe select', 'selected pe option', 'choose'], 'value="x" pe select', 'În React: `<select value={x}>`.', { topic: 'forms' }),
        mc('Universal handler', 'Pentru a face un handler universal, ce folosești pe input?', ['id', 'name', 'data-*', 'class'], 'name', '`name` permite `[e.target.name]: e.target.value`.', { topic: 'forms' }),
        mc('Form onSubmit', 'Pe ce element pui `onSubmit`?', ['button', 'form', 'input', 'div'], 'form', '`<form onSubmit={...}>` — declanșat la submit.', { topic: 'forms' }),
        mc('Textarea', 'Cum setezi valoarea unui textarea în React?', ['Conținut între tag-uri', 'value={text}', 'innerText', 'placeholder'], 'value={text}', 'În React, textarea folosește `value={x}` ca input.', { topic: 'forms' }),
        mc('Tip input', 'Ce tip de input e pentru parolă?', ['type="password"', 'type="hidden"', 'type="secret"', 'type="lock"'], 'type="password"', 'Standard HTML.', { topic: 'forms' }),
        mc('Spread + name', 'În handler universal: `setForm({...form, [e.target.name]: e.target.value})` ce e `[e.target.name]`?', ['Bug', 'Nume dinamic de proprietate', 'Array', 'Eroare'], 'Nume dinamic de proprietate', 'Computed property name în ES6.', { topic: 'forms' }),
      ],
    },

    // ==================== 13. useEffect MOUNT ====================
    {
      slug: 'react-useeffect-basic',
      title: '13. useEffect — efecte la mount/update',
      isFree: false,
      theory: `# ⚡ useEffect — efecte secundare

## Ce e useEffect?

**\`useEffect\`** rulează **cod după** ce componenta s-a randat. Folosit pentru:
- 🌐 Fetch date
- 📋 Subscriptii
- ⏱️ Timer-e
- 📝 Logging

## Sintaxa

\`\`\`jsx
import { useEffect } from 'react';

useEffect(() => {
  console.log('Componentă randată');
});
\`\`\`

## Forme de useEffect

### 1. **Rulează după FIECARE render** (rar!)
\`\`\`jsx
useEffect(() => {
  console.log('orice render');
});
\`\`\`

### 2. **Rulează DOAR la MOUNT** (\`[]\`)
\`\`\`jsx
useEffect(() => {
  console.log('o singură dată');
}, []);
\`\`\`

> 💡 Array gol = "fără dependențe" = doar la prima randare.

### 3. **Rulează când o variabilă se schimbă**
\`\`\`jsx
useEffect(() => {
  console.log('count s-a schimbat:', count);
}, [count]);
\`\`\`

## Exemplu: titlu pagină

\`\`\`jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Click: \${count}\`;
  }, [count]);

  return <button onClick={() => setCount(count+1)}>+1</button>;
}
\`\`\`

## Exemplu: fetch data la mount

\`\`\`jsx
function Lista() {
  const [date, setDate] = useState([]);

  useEffect(() => {
    fetch('/api/items')
      .then(r => r.json())
      .then(setDate);
  }, []);

  return <ul>{date.map(d => <li key={d.id}>{d.nume}</li>)}</ul>;
}
\`\`\`

## ⚠️ NU pune useEffect în if!

\`\`\`jsx
if (cond) useEffect(...)   // ❌
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`useEffect(fn)\` — după fiecare render
- ✅ \`useEffect(fn, [])\` — doar la mount
- ✅ \`useEffect(fn, [x])\` — când x se schimbă
- ✅ Pentru fetch, subscriptii, timer, side effects
`,
      problems: [
        mc('Ce face useEffect?', '`useEffect` rulează cod...', ['Înainte de randare', 'După randare', 'În timpul randării', 'Niciodată'], 'După randare', 'Efectul rulează după ce DOM-ul e actualizat.', { topic: 'useeffect' }),
        mc('La mount', 'Cum rulezi efectul DOAR la prima randare?', ['useEffect(fn)', 'useEffect(fn, [])', 'useEffect(fn, null)', 'useEffectOnce(fn)'], 'useEffect(fn, [])', 'Array gol `[]` = doar la mount.', { topic: 'useeffect' }),
        mc('Pe schimbarea x', 'Cum rulezi efect când `x` se schimbă?', ['useEffect(fn, "x")', 'useEffect(fn, [x])', 'useEffect(fn, x)', 'useEffectOn(x, fn)'], 'useEffect(fn, [x])', 'Array de dependențe.', { topic: 'useeffect' }),
        sa('Import useEffect', 'Cum imporți useEffect din react? (import { useEffect } from "react")', 'import { useEffect } from "react"', 'Named import.', { topic: 'useeffect' }),
        mc('Fără dependențe', '`useEffect(fn)` (fără al doilea arg) rulează...', ['O singură dată', 'După FIECARE render', 'Niciodată', 'La unmount'], 'După FIECARE render', 'Fără array, rulează la fiecare randare — periculos!', { topic: 'useeffect' }),
        mc('Pentru ce?', 'useEffect e pentru...', ['UI direct', 'Side effects (fetch, timer, etc)', 'CSS', 'Routing'], 'Side effects (fetch, timer, etc)', 'Side effects = cod care interacționează cu lumea exterioară.', { topic: 'useeffect' }),
        mc('In if?', 'Pot pune useEffect în if?', ['Da', 'NU — top-level only', 'Doar primul render', 'Doar în componente clasice'], 'NU — top-level only', 'Hook-urile trebuie la top-level mereu.', { topic: 'useeffect' }),
        mc('Document.title', 'Setarea `document.title` ar trebui în...', ['JSX', 'useEffect', 'render direct', 'window.onload'], 'useEffect', 'Modificare DOM externă = side effect → useEffect.', { topic: 'useeffect' }),
        mc('Multiple useEffect', 'Pot avea mai multe useEffect?', ['Nu, doar 1', 'Da', 'Doar 2', 'Doar cu hook custom'], 'Da', 'Poți avea oricâte useEffect cu dependențe diferite.', { topic: 'useeffect' }),
        mc('Stale closure', 'De ce dependențele sunt importante?', ['Estetic', 'Pentru că funcția captează valori vechi (stale)', 'Performance', 'Securitate'], 'Pentru că funcția captează valori vechi (stale)', 'Fără dependențe corecte, ai stale closures = bug-uri.', { topic: 'useeffect' }),
      ],
    },

    // ==================== 14. useEffect CLEANUP ====================
    {
      slug: 'react-useeffect-cleanup',
      title: '14. useEffect — cleanup și dependențe',
      isFree: false,
      theory: `# 🧹 Cleanup în useEffect

## Ce e cleanup?

Când efectul "lasă urme" (timer, subscription), trebuie să le **cureți** când componenta se demontează (unmount) sau înainte de re-rulare.

## Sintaxa cleanup

\`\`\`jsx
useEffect(() => {
  // efect
  console.log('mount');

  return () => {
    // cleanup
    console.log('unmount sau înainte de re-run');
  };
}, []);
\`\`\`

> 💡 Funcția returnată = cleanup.

## Exemplu: Timer

\`\`\`jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(id);   // 🧹 oprește timer-ul
}, []);
\`\`\`

## Exemplu: Event Listener

\`\`\`jsx
useEffect(() => {
  const handler = (e) => console.log(e.key);
  window.addEventListener('keydown', handler);

  return () => window.removeEventListener('keydown', handler);
}, []);
\`\`\`

## Exemplu: Fetch cu cancel

\`\`\`jsx
useEffect(() => {
  let cancel = false;

  fetch('/api/data')
    .then(r => r.json())
    .then(d => { if (!cancel) setData(d); });

  return () => { cancel = true; };
}, []);
\`\`\`

> 💡 Previne update pe componenta unmount-ată.

## Când rulează cleanup?

1. **Înainte de re-rularea efectului** (când se schimbă deps)
2. **La unmount** (componenta dispare)

## ⚠️ React 18 strict mode

În dev, useEffect rulează de **2 ori** la mount (test pentru bug-uri).
Cleanup-ul corect previne probleme.

## 🎓 Ce ai învățat
- ✅ \`return () => {...}\` = cleanup
- ✅ Curăță timer, listener, subscription
- ✅ Rulează la unmount + înainte de re-run
- ✅ Strict mode = test bun pentru cleanup
`,
      problems: [
        mc('Cleanup', 'Cum returnezi cleanup în useEffect?', ['return cleanup', 'return () => {...}', 'cleanup({...})', 'useCleanup(...)'], 'return () => {...}', 'Funcție returnată din callback = cleanup.', { topic: 'cleanup' }),
        mc('Când rulează cleanup?', 'Cleanup-ul rulează...', ['La fiecare render', 'La unmount și înainte de re-run', 'Niciodată în dev', 'Doar la unmount'], 'La unmount și înainte de re-run', 'Înainte de re-rulare + la unmount.', { topic: 'cleanup' }),
        mc('setInterval cleanup', 'Cum cureți un interval?', ['stopInterval(id)', 'clearInterval(id)', 'killInterval(id)', 'remove(id)'], 'clearInterval(id)', '`clearInterval(id)` oprește.', { topic: 'cleanup' }),
        mc('Listener cleanup', 'Cum cureți un event listener?', ['removeEventListener', 'detachEventListener', 'killEvent', 'unsubscribe'], 'removeEventListener', '`removeEventListener` cu același handler și tip.', { topic: 'cleanup' }),
        sa('Cleanup corect', 'Scrie cleanup pentru un timer cu id = 5. (() => clearInterval(5))', '() => clearInterval(5)', 'Sintaxa: `() => clearInterval(id)`.', { topic: 'cleanup' }),
        mc('Memory leak', 'Fără cleanup, ce poate apărea?', ['Site mai rapid', 'Memory leak', 'Stiluri stricate', 'Nimic'], 'Memory leak', 'Listener-i / timer-e neoprite consumă memorie.', { topic: 'cleanup' }),
        mc('Strict mode', 'În React 18 dev mode, useEffect rulează de...', ['1 dată', '2 ori la mount', 'Infinit', 'Doar dacă ai cleanup'], '2 ori la mount', 'Strict mode rulează de 2 ori pentru a detecta bug-uri.', { topic: 'cleanup' }),
        mc('Cancel fetch', 'Cum previi update după unmount?', ['stopFetch()', 'Flag boolean în cleanup', 'AbortController', 'Ambele B și C'], 'Ambele B și C', 'Fie flag, fie AbortController.', { topic: 'cleanup' }),
        mc('Re-run', 'Când deps se schimbă, ce se întâmplă?', ['Doar efectul rulează din nou', 'Cleanup vechi → efect nou', 'Crash', 'Nimic'], 'Cleanup vechi → efect nou', 'Cleanup-ul vechi rulează ÎNAINTE de noul efect.', { topic: 'cleanup' }),
        mc('Unmount', 'Componenta se demontează când...', ['Are eroare', 'Părinte o scoate din JSX', 'Faci F5', 'Toate'], 'Toate', 'Eroare cu ErrorBoundary, scoasă, refresh — toate.', { topic: 'cleanup' }),
      ],
    },

    // ==================== 15. useContext ====================
    {
      slug: 'react-usecontext',
      title: '15. useContext — date globale',
      isFree: false,
      theory: `# 🌍 useContext — date partajate

## Problema: prop drilling

Când treci props prin multe niveluri:
\`\`\`
App → Layout → Sidebar → Menu → UserAvatar (are nevoie de user)
\`\`\`

E enervant. **Context** rezolvă asta.

## 1. Creezi context

\`\`\`jsx
import { createContext } from 'react';

export const UserContext = createContext(null);
\`\`\`

## 2. Provider în părinte

\`\`\`jsx
function App() {
  const user = { nume: 'Ana' };

  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}
\`\`\`

## 3. useContext în orice copil

\`\`\`jsx
import { useContext } from 'react';

function Avatar() {
  const user = useContext(UserContext);
  return <p>{user.nume}</p>;
}
\`\`\`

## Exemplu complet: tema

\`\`\`jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Buton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>{theme}</button>;
}
\`\`\`

## Când folosești context?

✅ User curent / autentificare
✅ Tema (light/dark)
✅ Limba (i18n)
✅ Settings globale

❌ NU pentru orice — overuse = re-randări inutile.

## ⚠️ Re-randare

Toți consumatorii se re-randează când \`value\` se schimbă.

## 🎓 Ce ai învățat
- ✅ \`createContext(default)\`
- ✅ \`<Context.Provider value={...}>\`
- ✅ \`useContext(Context)\` în copii
- ✅ Pentru date globale (user, tema, etc)
`,
      problems: [
        mc('Ce rezolvă context?', 'useContext rezolvă...', ['Animații', 'Prop drilling', 'CSS', 'Routing'], 'Prop drilling', 'Context evită pasarea prin multe niveluri.', { topic: 'usecontext' }),
        mc('Creare context', 'Cum creezi context?', ['useContext()', 'createContext()', 'newContext()', 'Context.create()'], 'createContext()', '`createContext(default)` returnează un context.', { topic: 'usecontext' }),
        mc('Provider', 'Cum oferi valoarea?', ['Context.Provider value={x}', 'Context.set(x)', 'Provide(x)', 'Context.give(x)'], 'Context.Provider value={x}', '`<Context.Provider value={x}>`.', { topic: 'usecontext' }),
        sa('Citire valoare', 'Cum citești valoarea unui context Theme? (useContext(Theme))', 'useContext(Theme)', '`useContext(Context)` returnează valoarea curentă.', { topic: 'usecontext' }),
        mc('Default value', 'Default value în `createContext("light")` se folosește când...', ['Mereu', 'Nu există Provider deasupra', 'Provider e null', 'Niciodată'], 'Nu există Provider deasupra', 'Default e fallback.', { topic: 'usecontext' }),
        mc('Re-randare', 'Când se re-randează consumatorii?', ['Niciodată', 'La fiecare render', 'Când value se schimbă', 'Doar la mount'], 'Când value se schimbă', 'Toți consumers se re-randează când Provider value e diferit.', { topic: 'usecontext' }),
        mc('Cazuri bune pentru context', 'Pentru ce e ideal?', ['Form validation', 'User auth, tema, limba', 'Animații', 'Routing'], 'User auth, tema, limba', 'Date care se folosesc în multe locuri.', { topic: 'usecontext' }),
        mc('Multiple context', 'Pot avea mai multe context-uri?', ['Nu', 'Da, oricâte', 'Maxim 3', 'Doar 1 Provider per app'], 'Da, oricâte', 'Poți avea oricâte: ThemeContext, AuthContext, etc.', { topic: 'usecontext' }),
        mc('Provider obiect', 'De ce să nu trimiți obiect inline?', ['E ilegal', 'Creează re-randări — referință nouă la fiecare render', 'Lent', 'Eroare'], 'Creează re-randări — referință nouă la fiecare render', 'Folosește useMemo dacă e nevoie.', { topic: 'usecontext' }),
        mc('Best practice', 'Pentru auth, ce e mai bun?', ['Prop drilling', 'Context cu user + funcții login/logout', 'Variabile globale', 'localStorage doar'], 'Context cu user + funcții login/logout', 'Pattern uzual: AuthContext.', { topic: 'usecontext' }),
      ],
    },

    // ==================== 16. useReducer ====================
    {
      slug: 'react-usereducer',
      title: '16. useReducer — state complex',
      isFree: false,
      theory: `# 🎛️ useReducer — alternativă la useState

## Când folosești useReducer?

Când:
- 🧩 State-ul e **complex** (multe câmpuri legate)
- 🔄 Multe **acțiuni** diferite (add, remove, toggle, etc)
- 🧪 Vrei logică **previzibilă** și testabilă

## Sintaxa

\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

## Reducer = funcție pură

\`\`\`jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}
\`\`\`

## Folosire

\`\`\`jsx
function Contor() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
\`\`\`

## Exemplu: Todo

\`\`\`jsx
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'delete':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  // ...
  dispatch({ type: 'add', text: 'cumpără pâine' });
  dispatch({ type: 'toggle', id: 5 });
  dispatch({ type: 'delete', id: 5 });
}
\`\`\`

## useReducer vs useState

| useState | useReducer |
|---|---|
| State simplu | State complex |
| 1-2 câmpuri | Multe câmpuri legate |
| Update direct | Acțiuni descrise |

## 🎓 Ce ai învățat
- ✅ \`[state, dispatch] = useReducer(reducer, init)\`
- ✅ Reducer = \`(state, action) => newState\`
- ✅ \`dispatch({ type, ... })\` declanșează update
- ✅ Pentru state complex/multiple acțiuni
`,
      problems: [
        mc('Sintaxa', 'Care e corect?', ['useReducer()', 'const [state, dispatch] = useReducer(reducer, init)', 'useReducer(state, action)', 'reducer(useReducer)'], 'const [state, dispatch] = useReducer(reducer, init)', 'Destructurare: state + dispatch.', { topic: 'usereducer' }),
        mc('Reducer return', 'Ce trebuie să returneze reducer-ul?', ['undefined', 'Noul state', 'O acțiune', 'true'], 'Noul state', 'Reducer-ul returnează MEREU noul state.', { topic: 'usereducer' }),
        mc('Acțiune format', 'Convențional, acțiunea e...', ['un string', 'un obiect cu type', 'o funcție', 'un array'], 'un obiect cu type', '`{ type: "..." }` e convenția standard.', { topic: 'usereducer' }),
        sa('Dispatch', 'Cum trimiți acțiunea "add" cu text "x"? (dispatch({ type: "add", text: "x" }))', 'dispatch({ type: "add", text: "x" })', 'Standard: dispatch cu obiect acțiune.', { topic: 'usereducer' }),
        mc('Reducer pur', 'Reducer-ul trebuie să fie...', ['Async', 'Pură (fără side effects)', 'Cu fetch', 'Cu setState'], 'Pură (fără side effects)', 'Reducer-ul e funcție pură: same input → same output.', { topic: 'usereducer' }),
        mc('When useReducer?', 'Când useReducer > useState?', ['Mereu', 'State complex cu multe acțiuni', 'Niciodată', 'Doar pentru animații'], 'State complex cu multe acțiuni', 'State complex e cazul ideal.', { topic: 'usereducer' }),
        mc('Switch în reducer', 'Convențional, ce structură folosești?', ['if/else', 'switch case', 'while', 'try'], 'switch case', 'Switch după `action.type`.', { topic: 'usereducer' }),
        mc('Default', 'În switch, ce returnezi default?', ['undefined', 'state (neschimbat)', '{}', 'null'], 'state (neschimbat)', 'Default păstrează state-ul.', { topic: 'usereducer' }),
        mc('Mutație directă', 'Pot modifica state direct în reducer?', ['Da', 'NU — returnezi obiect/array NOU', 'Doar primitives', 'Doar dacă cloned'], 'NU — returnezi obiect/array NOU', 'Reducer e pur — nu mută.', { topic: 'usereducer' }),
        mc('Dispatch sincron?', 'dispatch e sincron?', ['Da, mereu', 'NU — programează update', 'Depinde', 'Doar în callbacks'], 'NU — programează update', 'Ca setState, dispatch programează re-render.', { topic: 'usereducer' }),
      ],
    },

    // ==================== 17. useRef ====================
    {
      slug: 'react-useref',
      title: '17. useRef — referințe și DOM',
      isFree: false,
      theory: `# 🎯 useRef — referințe persistente

## 2 utilizări principale

1. **Acces la DOM** (input focus, scroll, dimensiuni)
2. **Valori persistente** care NU declanșează re-render

## 1. DOM access

\`\`\`jsx
import { useRef, useEffect } from 'react';

function FormAutoFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();   // pune focus la mount
  }, []);

  return <input ref={inputRef} />;
}
\`\`\`

> 💡 \`ref={inputRef}\` leagă referința de elementul DOM.
> 💡 Accesezi prin \`inputRef.current\`.

## 2. Valori persistente (NU declanșează render)

\`\`\`jsx
function Timer() {
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => console.log('tick'), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
\`\`\`

> 💡 Modificarea \`.current\` NU declanșează re-render.

## useRef vs useState

| useRef | useState |
|---|---|
| Modificare = NU re-render | Modificare = re-render |
| Pentru DOM, valori "în spate" | Pentru date care apar în UI |
| \`ref.current\` | \`[val, setVal]\` |

## Exemplu: număr de render-uri

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  const renderRef = useRef(0);

  renderRef.current++;

  return (
    <div>
      <p>Count: {count} (renders: {renderRef.current})</p>
      <button onClick={() => setCount(c => c+1)}>+</button>
    </div>
  );
}
\`\`\`

## Forwarding refs (avansat)

Pentru a primi ref pe componenta proprie:
\`\`\`jsx
const Buton = forwardRef((props, ref) => <button ref={ref}>...</button>);
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`useRef(initial)\` — referință persistentă
- ✅ \`ref={...}\` pe element → DOM
- ✅ \`.current\` = valoarea
- ✅ Modificare NU declanșează re-render
`,
      problems: [
        mc('Sintaxa', 'Care e corect?', ['const x = useRef(0)', 'const [x, setX] = useRef(0)', 'useRef.create(0)', 'ref(0)'], 'const x = useRef(0)', '`useRef(initial)` returnează un obiect `{current}`.', { topic: 'useref' }),
        mc('Valoarea ref', 'Cum accesezi valoarea?', ['ref()', 'ref.value', 'ref.current', 'ref.get()'], 'ref.current', '`.current` e proprietatea care ține valoarea.', { topic: 'useref' }),
        mc('Re-render?', 'Modificarea `.current` declanșează re-render?', ['Da', 'NU', 'Doar pentru DOM', 'Doar uneori'], 'NU', 'Asta e diferența cheie de useState.', { topic: 'useref' }),
        sa('DOM ref', 'Cum legi ref `inputRef` de un input? (ref={inputRef})', 'ref={inputRef}', 'Atributul `ref` leagă elementul.', { topic: 'useref' }),
        mc('Focus input', 'Cum dai focus pe input cu ref?', ['inputRef.focus()', 'inputRef.current.focus()', 'inputRef.value.focus()', 'focus(inputRef)'], 'inputRef.current.focus()', 'Întâi `.current` (DOM-ul), apoi `.focus()`.', { topic: 'useref' }),
        mc('useState vs useRef', 'Pentru valoare care apare în UI, folosești...', ['useRef', 'useState', 'useContext', 'useEffect'], 'useState', 'useState declanșează re-render — UI se actualizează.', { topic: 'useref' }),
        mc('Persistent', 'Ce e persistent între render-uri?', ['Variabile locale în funcție', 'useRef.current', 'console.log', 'props'], 'useRef.current', 'Variabilele locale se re-creează; ref persistă.', { topic: 'useref' }),
        mc('Init valoare', 'Care e valoarea inițială a ref?', ['null', 'undefined', 'Argumentul useRef(x)', 'Mereu null'], 'Argumentul useRef(x)', '`useRef(0)` → `.current = 0` inițial.', { topic: 'useref' }),
        mc('forwardRef', 'forwardRef e pentru...', ['Routing', 'A primi ref pe componenta proprie', 'Animații', 'CSS'], 'A primi ref pe componenta proprie', 'Componentele funcționale nu primesc ref direct — forwardRef rezolvă asta.', { topic: 'useref' }),
        mc('Timer cleanup', 'De ce stochezi ID timer într-un ref?', ['Pentru afișare', 'Pentru a-l opri din alt handler', 'Estetic', 'Pentru CSS'], 'Pentru a-l opri din alt handler', 'Ref permite acces persistent la ID-ul timer-ului.', { topic: 'useref' }),
      ],
    },

    // ==================== 18. useMemo ====================
    {
      slug: 'react-usememo',
      title: '18. useMemo — memorare valori',
      isFree: false,
      theory: `# 💾 useMemo — optimizare calcule

## Problema

La fiecare re-render, calculele se refac. Dacă sunt scumpe, încetinești app-ul.

\`\`\`jsx
function Lista({ items }) {
  const sortate = items.sort(...);   // rulează la FIECARE render!
  return <ul>{sortate.map(...)}</ul>;
}
\`\`\`

## Soluția: useMemo

**Memorează** (cache-uiește) o valoare. Recalculează **doar** când dependențele se schimbă.

\`\`\`jsx
import { useMemo } from 'react';

const sortate = useMemo(() => {
  return items.sort(...);
}, [items]);
\`\`\`

> 💡 \`sortate\` se recalculează **doar** când \`items\` se schimbă.

## Sintaxa

\`\`\`jsx
const valoare = useMemo(() => calcul(), [deps]);
\`\`\`

## Exemplu: filtrare mare

\`\`\`jsx
function Search({ items, query }) {
  const filtered = useMemo(() => {
    return items.filter(i => i.nume.includes(query));
  }, [items, query]);

  return <ul>{filtered.map(i => <li key={i.id}>{i.nume}</li>)}</ul>;
}
\`\`\`

## ⚠️ NU folosi mereu useMemo!

- 💸 Are propriul **cost** (memorie + comparație deps)
- ✅ Util doar pentru calcule **scumpe**
- ❌ Pentru \`x + y\` simplu, e overkill

## Memorare REFERINȚE

\`\`\`jsx
const config = useMemo(() => ({ min: 0, max: 100 }), []);
\`\`\`

> 💡 Util când pasezi obiecte la componente memo-ate.

## 🎓 Ce ai învățat
- ✅ \`useMemo(() => calc, [deps])\` — memo valoare
- ✅ Recalculează doar la schimbare deps
- ✅ Folosește pentru calcule SCUMPE
- ✅ Overuse = anti-pattern
`,
      problems: [
        mc('Ce face useMemo?', 'useMemo...', ['Memorează componente', 'Memorează valori calculate', 'Memorează DOM', 'Memorează stiluri'], 'Memorează valori calculate', 'Cache pentru rezultatul unei funcții.', { topic: 'usememo' }),
        mc('Sintaxa', 'Care e corect?', ['useMemo(calc, [deps])', 'useMemo(() => calc(), [deps])', 'useMemo([deps], calc)', 'memo(calc, deps)'], 'useMemo(() => calc(), [deps])', 'Funcție + array deps.', { topic: 'usememo' }),
        mc('Re-calcul', 'Când se recalculează valoarea?', ['Mereu', 'Niciodată', 'Când deps se schimbă', 'La click'], 'Când deps se schimbă', 'Comparația deps cu cea anterioară.', { topic: 'usememo' }),
        sa('Import', 'Cum imporți useMemo? (import { useMemo } from "react")', 'import { useMemo } from "react"', 'Named import.', { topic: 'usememo' }),
        mc('Calcul scump', 'Pentru ce e ideal useMemo?', ['x + 1', 'sortare 10000 elemente', 'console.log', 'div className'], 'sortare 10000 elemente', 'Calcule scumpe = candidat.', { topic: 'usememo' }),
        mc('Overuse', 'E bine să pui useMemo peste tot?', ['Da', 'NU — are cost propriu', 'Doar pe components', 'Doar pe array'], 'NU — are cost propriu', 'Memorarea în sine consumă memorie + comparație.', { topic: 'usememo' }),
        mc('[] vs [x]', '`useMemo(fn, [])` recalculează...', ['Niciodată după mount', 'La fiecare render', 'Când x se schimbă', 'Mereu'], 'Niciodată după mount', 'Array gol = doar prima dată.', { topic: 'usememo' }),
        mc('Returnează', 'useMemo returnează...', ['O funcție', 'Valoarea calculată', 'undefined', 'Promise'], 'Valoarea calculată', 'Direct rezultatul `fn()`.', { topic: 'usememo' }),
        mc('Memorare referință', 'Pentru ce e util `useMemo(() => ({...}), [deps])`?', ['UI', 'Stabilizare referință obiect pentru memo deeper', 'CSS', 'Routing'], 'Stabilizare referință obiect pentru memo deeper', 'Obiectele inline creează referință nouă la fiecare render.', { topic: 'usememo' }),
        mc('vs useState', 'useMemo vs useState?', ['Ambele țin valoare', 'useMemo derivă, useState are', 'Identice', 'useMemo declanșează render'], 'useMemo derivă, useState are', 'useMemo derivă din alte valori; useState ține valoare proprie.', { topic: 'usememo' }),
      ],
    },

    // ==================== 19. useCallback ====================
    {
      slug: 'react-usecallback',
      title: '19. useCallback — memorare funcții',
      isFree: false,
      theory: `# 🎣 useCallback — funcții stabile

## Problema

La fiecare render, **funcțiile se re-creează**. Asta strică memo-ul componentelor copil.

\`\`\`jsx
function Parent() {
  const handleClick = () => {...};   // funcție NOUĂ la fiecare render
  return <Child onClick={handleClick} />;
}
\`\`\`

> Chiar dacă \`Child\` e \`memo\`, primește prop NOU (referință nouă) → re-randează inutil.

## Soluția: useCallback

\`\`\`jsx
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  console.log('click');
}, []);
\`\`\`

> 💡 Returnează **aceeași referință** până se schimbă deps.

## Sintaxa

\`\`\`jsx
const fn = useCallback((args) => { ... }, [deps]);
\`\`\`

## Exemplu

\`\`\`jsx
const handleAdd = useCallback((id) => {
  setItems(prev => [...prev, id]);
}, []);

return <Lista onAdd={handleAdd} />;
\`\`\`

## useCallback vs useMemo

\`useCallback(fn, deps)\` ≡ \`useMemo(() => fn, deps)\`

- **useMemo** — memo VALOARE
- **useCallback** — memo FUNCȚIE (specializare)

## Când să folosești?

✅ Pasezi callback la componente \`React.memo\`
✅ Callback e dep al unui \`useEffect\`
✅ Callback e dep al unui alt \`useMemo\`/\`useCallback\`

❌ NU pentru orice handler — overuse e anti-pattern.

## 🎓 Ce ai învățat
- ✅ \`useCallback(fn, [deps])\` — funcție stabilă
- ✅ Util cu \`React.memo\`, useEffect deps
- ✅ Echivalent cu \`useMemo(() => fn)\`
`,
      problems: [
        mc('Ce face useCallback?', 'useCallback memorează...', ['valori', 'componente', 'funcții', 'state'], 'funcții', 'Pentru a păstra aceeași referință.', { topic: 'usecallback' }),
        mc('Sintaxa', 'Care e corect?', ['useCallback(fn)', 'useCallback(fn, [deps])', 'useCallback([deps], fn)', 'useCallback({fn, deps})'], 'useCallback(fn, [deps])', 'Funcție + deps.', { topic: 'usecallback' }),
        mc('Vs useMemo', 'useCallback(fn, deps) ≡', ['useMemo(fn, deps)', 'useMemo(() => fn, deps)', 'useState(fn)', 'memo(fn)'], 'useMemo(() => fn, deps)', 'useCallback e specializare a useMemo.', { topic: 'usecallback' }),
        mc('Când folosești?', 'Util când...', ['Mereu', 'Pasezi callback la React.memo', 'Pentru CSS', 'Pentru routing'], 'Pasezi callback la React.memo', 'Memo are nevoie de referințe stabile.', { topic: 'usecallback' }),
        sa('Import', 'Import useCallback din react. (import { useCallback } from "react")', 'import { useCallback } from "react"', 'Named import.', { topic: 'usecallback' }),
        mc('Overuse', 'E bine peste tot?', ['Da', 'NU — overhead', 'Mai bine decât useMemo', 'Doar pentru forms'], 'NU — overhead', 'Are cost — folosește când chiar e nevoie.', { topic: 'usecallback' }),
        mc('Stale closure', 'Dacă uiți deps, ce se poate întâmpla?', ['Performance perfect', 'Stale closure (valori vechi)', 'CSS broken', 'Eroare TypeScript'], 'Stale closure (valori vechi)', 'Funcția captează valori la momentul cache-ului.', { topic: 'usecallback' }),
        mc('Empty deps', '`useCallback(fn, [])` e stabilă pentru...', ['Mereu', 'Întreg ciclul de viață', 'Doar până la unmount', 'Doar 1 render'], 'Întreg ciclul de viață', 'Niciodată nu se recreează.', { topic: 'usecallback' }),
        mc('useEffect dep', 'Dacă o funcție e dep în useEffect, ce faci?', ['Nimic', 'O wrap în useCallback', 'O scoți din deps', 'O faci globală'], 'O wrap în useCallback', 'Altfel useEffect rulează la fiecare render.', { topic: 'usecallback' }),
        mc('Returnează', 'useCallback returnează...', ['Valoare calculată', 'Funcția memo-ată', 'Promise', 'state'], 'Funcția memo-ată', 'Aceeași referință până se schimbă deps.', { topic: 'usecallback' }),
      ],
    },

    // ==================== 20. CUSTOM HOOKS ====================
    {
      slug: 'react-custom-hooks',
      title: '20. Custom Hooks',
      isFree: false,
      theory: `# 🪝 Custom Hooks

## Ce sunt?

**Custom hooks** = funcții care **folosesc** alte hooks. Le scrii **tu**, pentru a reutiliza logică.

> 💡 Convenție: numele începe cu \`use\` (\`useToggle\`, \`useFetch\`).

## Exemplu: useToggle

\`\`\`jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}

// Folosire:
function App() {
  const [open, toggleOpen] = useToggle();
  return <button onClick={toggleOpen}>{open ? 'Open' : 'Closed'}</button>;
}
\`\`\`

## Exemplu: useLocalStorage

\`\`\`jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Folosire:
const [theme, setTheme] = useLocalStorage('theme', 'light');
\`\`\`

## Exemplu: useFetch

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [url]);

  return { data, loading };
}

// Folosire:
const { data, loading } = useFetch('/api/items');
\`\`\`

## Reguli

- Numele începe cu \`use\`
- Apelat la top-level (ca celelalte hooks)
- Poți combina mai multe hooks în interior

## De ce?

- 🔄 **Reutilizare** logică
- 🧹 Componente mai **curate**
- 🧪 Mai ușor de testat

## 🎓 Ce ai învățat
- ✅ Custom hook = funcție care folosește alte hooks
- ✅ Convenție: începe cu \`use\`
- ✅ Pentru reutilizare logică
`,
      problems: [
        mc('Custom hook nume', 'Cu ce trebuie să înceapă numele?', ['get', 'use', 'do', 'with'], 'use', 'Convenția React: prefix `use`.', { topic: 'custom-hooks' }),
        mc('Ce conține?', 'Un custom hook conține...', ['Doar JSX', 'Alte hooks + logică', 'Doar componente', 'Doar CSS'], 'Alte hooks + logică', 'Combini useState, useEffect etc + logică ta.', { topic: 'custom-hooks' }),
        mc('Returnează ce?', 'Custom hook poate returna...', ['Doar JSX', 'Orice (array, obiect, primitive)', 'Doar string', 'Doar număr'], 'Orice (array, obiect, primitive)', 'Convențional: array sau obiect cu valori + funcții.', { topic: 'custom-hooks' }),
        sa('useToggle', 'Scrie semnătura unui custom hook useToggle. (function useToggle() {)', 'function useToggle() {', 'Standard: `function useToggle() {...}`.', { topic: 'custom-hooks' }),
        mc('Apelare', 'Custom hook trebuie apelat...', ['În if', 'La top-level', 'În for', 'Oriunde'], 'La top-level', 'Reguli hooks: top-level mereu.', { topic: 'custom-hooks' }),
        mc('De ce useFetch?', 'Custom hook util pentru fetch e pentru a...', ['Decora UI', 'Reutiliza logica fetch în multe componente', 'Cripta date', 'Routing'], 'Reutiliza logica fetch în multe componente', 'Reutilizare logica.', { topic: 'custom-hooks' }),
        mc('Combinare', 'Pot folosi useState + useEffect într-un custom hook?', ['Da', 'Doar useState', 'Doar useEffect', 'Nu'], 'Da', 'Combini orice hooks ai nevoie.', { topic: 'custom-hooks' }),
        mc('Stare partajată?', 'Două componente cu același custom hook au...', ['State partajat', 'State separat', 'Crash', 'Doar una din ele state'], 'State separat', 'Fiecare apel = state propriu.', { topic: 'custom-hooks' }),
        mc('useLocalStorage', 'Pentru a sincroniza state cu localStorage, ce hook combinatie?', ['useState + useEffect', 'useReducer', 'useContext + useRef', 'useMemo'], 'useState + useEffect', 'State + side effect (write la storage).', { topic: 'custom-hooks' }),
        mc('Prefix', 'De ce prefix `use`?', ['Estetic', 'React detectează hooks după prefix', 'Convenția Java', 'Random'], 'React detectează hooks după prefix', 'Linter-ele și React verifică reguli pentru funcții `use*`.', { topic: 'custom-hooks' }),
      ],
    },

    // ==================== 21. ARRAY METHODS ====================
    {
      slug: 'react-array-methods',
      title: '21. Array methods în React (map, filter, reduce, find)',
      isFree: false,
      theory: `# 🔧 Array Methods în React

Aceste metode JS sunt **fundament** pentru React.

## .map() — transformare

\`\`\`jsx
const dublu = [1,2,3].map(n => n * 2);   // [2, 4, 6]

// În JSX:
<ul>{nume.map(n => <li key={n}>{n}</li>)}</ul>
\`\`\`

## .filter() — filtrare

\`\`\`jsx
const adulti = useri.filter(u => u.varsta >= 18);

// State update — ștergere:
setTodos(todos.filter(t => t.id !== idToDelete));
\`\`\`

## .reduce() — agregare

\`\`\`jsx
const total = preturi.reduce((sum, p) => sum + p, 0);

// Grupare:
const grupat = items.reduce((acc, item) => {
  acc[item.categorie] = acc[item.categorie] || [];
  acc[item.categorie].push(item);
  return acc;
}, {});
\`\`\`

## .find() — primul match

\`\`\`jsx
const user = useri.find(u => u.id === 5);
\`\`\`

## .some() / .every()

\`\`\`jsx
const areAdult = useri.some(u => u.varsta >= 18);    // boolean
const totiAdulti = useri.every(u => u.varsta >= 18); // boolean
\`\`\`

## .includes() / .indexOf()

\`\`\`jsx
const are = nume.includes('Ana');     // true/false
const idx = nume.indexOf('Ana');       // -1 sau index
\`\`\`

## .sort()

\`\`\`jsx
// ⚠️ Sort modifică array-ul!
// În React: clonează întâi
const sortat = [...items].sort((a, b) => a.varsta - b.varsta);
\`\`\`

## Lanț (chaining)

\`\`\`jsx
const total = items
  .filter(i => i.activ)
  .map(i => i.pret)
  .reduce((s, p) => s + p, 0);
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`.map()\` → transformă
- ✅ \`.filter()\` → filtrează
- ✅ \`.reduce()\` → agregă
- ✅ \`.find()\` → primul match
- ✅ Lanț pentru pipeline-uri
`,
      problems: [
        mc('.map()', 'Ce face?', ['Filtrează', 'Transformă', 'Sortează', 'Caută'], 'Transformă', '.map() returnează array nou cu fiecare element transformat.', { topic: 'array' }),
        mc('.filter()', '`[1,2,3,4].filter(n => n%2)`', ['[1,3]', '[2,4]', '[1,2,3,4]', '[]'], '[1,3]', 'Returnează doar impare (n%2 e truthy).', { topic: 'array' }),
        mc('.reduce()', 'Ce face?', ['Filtrează', 'Mărimea', 'Reduce array la o singură valoare', 'Sort'], 'Reduce array la o singură valoare', 'Acumulează prin parcurgere.', { topic: 'array' }),
        sa('Sumă', 'Cum aduni `[1,2,3]` cu reduce? (.reduce((s,n) => s+n, 0))', '.reduce((s,n) => s+n, 0)', 'Acumulator inițial 0.', { topic: 'array' }),
        mc('.find()', 'Ce returnează `[1,2,3].find(n => n > 1)`?', ['[2,3]', '2', '[2]', 'true'], '2', 'Primul element care îndeplinește condiția.', { topic: 'array' }),
        mc('.some()', '`[1,2,3].some(n => n > 5)`', ['true', 'false', '[]', '5'], 'false', 'Nu e niciun element > 5.', { topic: 'array' }),
        mc('.every()', '`[2,4,6].every(n => n%2 === 0)`', ['true', 'false', '0', '6'], 'true', 'Toate sunt pare.', { topic: 'array' }),
        mc('.includes()', '`["a","b"].includes("b")`', ['true', '1', 'false', '"b"'], 'true', '.includes returnează boolean.', { topic: 'array' }),
        mc('.sort() side effect', 'Sort modifică array-ul original?', ['Nu', 'Da — folosește spread întâi', 'Doar string', 'Doar number'], 'Da — folosește spread întâi', '`[...arr].sort()` previne mutația.', { topic: 'array' }),
        mc('Chain', 'Care e corect?', ['arr.filter().map()', 'arr.map().filter()', 'Ambele', 'Niciuna'], 'Ambele', 'Chain-ul depinde de logică, dar ambele sintactic OK.', { topic: 'array' }),
      ],
    },

    // ==================== 22. LIFTING STATE UP ====================
    {
      slug: 'react-lifting-state',
      title: '22. Lifting State Up',
      isFree: false,
      theory: `# ⬆️ Lifting State Up

## Problema

Două componente surori trebuie să **partajeze** state.

\`\`\`
App
 ├─ InputCelsius
 └─ InputFahrenheit
\`\`\`

Cum sincronizezi?

## Soluția: ridici state-ul în părintele comun

\`\`\`jsx
function App() {
  const [temp, setTemp] = useState(0);

  return (
    <>
      <InputCelsius temp={temp} onChange={setTemp} />
      <InputFahrenheit temp={temp} onChange={setTemp} />
    </>
  );
}

function InputCelsius({ temp, onChange }) {
  return <input value={temp} onChange={e => onChange(+e.target.value)} />;
}
\`\`\`

## Pattern: data DOWN, events UP

- **Date** → trec prin **props** de la părinte la copil
- **Schimbări** → urcă prin **callbacks**

\`\`\`
Parent ──props──→ Child
       ←──callback── Child
\`\`\`

## Exemplu: ToDo

\`\`\`jsx
function App() {
  const [todos, setTodos] = useState([]);

  const add = (text) => setTodos([...todos, { id: Date.now(), text }]);
  const remove = (id) => setTodos(todos.filter(t => t.id !== id));

  return (
    <>
      <AddForm onAdd={add} />
      <List items={todos} onRemove={remove} />
    </>
  );
}
\`\`\`

## Când să ridici state?

✅ Două componente au nevoie de aceeași informație
✅ Una afectează pe cealaltă

## Alternativă: Context (pentru "global" foarte distribuit)

## 🎓 Ce ai învățat
- ✅ State trăiește în părintele comun
- ✅ Data DOWN prin props, events UP prin callbacks
- ✅ Fundație pentru "single source of truth"
`,
      problems: [
        mc('Lifting state up', 'Ce înseamnă?', ['Mut state în CSS', 'Mut state în părintele comun', 'Șterg state', 'Folosesc Redux'], 'Mut state în părintele comun', 'Pentru a-l partaja între copii.', { topic: 'lift' }),
        mc('Pattern data DOWN', 'Cum trec date la copil?', ['useContext', 'props', 'global', 'localStorage'], 'props', 'Props sunt mecanismul standard.', { topic: 'lift' }),
        mc('Events UP', 'Cum semnalezi schimbare către părinte?', ['Modific props', 'Apelez callback primit ca prop', 'Hack', 'Imposibil'], 'Apelez callback primit ca prop', 'Părinte oferă funcție prop, copil o apelează.', { topic: 'lift' }),
        mc('Single source of truth', 'Înseamnă...', ['Un singur browser', 'O sursă unică pentru o informație', 'Un singur server', 'O singură componentă'], 'O sursă unică pentru o informație', 'State trăiește într-un singur loc.', { topic: 'lift' }),
        mc('Alternative la lifting', 'Pentru date globale, alternativă e...', ['Props peste tot', 'Context', 'CSS', 'localStorage'], 'Context', 'Context evită prop drilling pentru date globale.', { topic: 'lift' }),
        sa('Callback ca prop', 'Cum trimiți funcția `add` ca prop la `<Form>`? (<Form onAdd={add} />)', '<Form onAdd={add} />', 'Pasezi referința fără ()', { topic: 'lift' }),
        mc('Două inputs sincronizate', 'Cum faci 2 inputs să arate aceeași valoare?', ['Variabile globale', 'State în părinte + props la copii', 'CSS', 'localStorage'], 'State în părinte + props la copii', 'Lifting state up.', { topic: 'lift' }),
        mc('Onde state?', 'Unde trăiește state-ul după lift?', ['În browser', 'În părinte', 'În copil', 'În localStorage'], 'În părinte', 'În cel mai apropiat părinte comun.', { topic: 'lift' }),
        mc('Inverse data flow', 'Înseamnă...', ['Date jos→sus', 'Date sus→jos', 'Date orizontal', 'Stop randare'], 'Date jos→sus', 'Cum copilul "trimite" date înapoi prin callback.', { topic: 'lift' }),
        mc('Cost lifting', 'Dezavantaj?', ['Imposibil', 'Părintele se re-randează des', 'CSS broken', 'Crash'], 'Părintele se re-randează des', 'Schimbarea state cauzează re-render părinte + toți copiii.', { topic: 'lift' }),
      ],
    },

    // ==================== 23. ROUTING ====================
    {
      slug: 'react-router',
      title: '23. React Router — navigare',
      isFree: false,
      theory: `# 🗺️ React Router (basics)

## Ce e?

**React Router** = bibliotecă pentru a face SPA-uri cu **multe pagini** (rute).

## Instalare

\`\`\`bash
npm install react-router-dom
\`\`\`

## Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Acasă</Link>
        <Link to="/despre">Despre</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/despre" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Link — navigare fără refresh

\`\`\`jsx
<Link to="/despre">Despre</Link>
\`\`\`

> 💡 \`<Link>\`, NU \`<a>\` — \`<a>\` face refresh complet!

## useNavigate — programatic

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const onLogin = () => {
    // ... logica
    navigate('/dashboard');
  };
}
\`\`\`

## Parametri în URL

\`\`\`jsx
<Route path="/user/:id" element={<UserPage />} />

import { useParams } from 'react-router-dom';
function UserPage() {
  const { id } = useParams();
  return <p>User {id}</p>;
}
\`\`\`

## Query params

\`\`\`jsx
import { useSearchParams } from 'react-router-dom';
const [params] = useSearchParams();
const q = params.get('q');     // /?q=test → "test"
\`\`\`

## 404 — Not Found

\`\`\`jsx
<Route path="*" element={<NotFound />} />
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`BrowserRouter\` + \`Routes\` + \`Route\`
- ✅ \`<Link to>\` în loc de \`<a>\`
- ✅ \`useNavigate()\` programatic
- ✅ \`useParams()\` pentru \`/:id\`
`,
      problems: [
        mc('Pachet', 'Ce instalezi pentru routing?', ['react-router', 'react-router-dom', 'react-routes', 'router-react'], 'react-router-dom', 'Pentru web: `react-router-dom`.', { topic: 'router' }),
        mc('Wrapper', 'Care componentă wrap-ează aplicația?', ['Router', 'BrowserRouter', 'AppRouter', 'Routes'], 'BrowserRouter', '`BrowserRouter` folosește History API.', { topic: 'router' }),
        mc('Link vs a', 'De ce Link, nu a?', ['Estetic', '`<a>` face refresh complet — pierzi state', 'Niciun motiv', 'Link e SEO mai bun'], '`<a>` face refresh complet — pierzi state', 'Link face navigare client-side.', { topic: 'router' }),
        sa('Definire rută', 'Cum definești ruta /home cu componentă Home? (<Route path="/home" element={<Home />} />)', '<Route path="/home" element={<Home />} />', 'În v6: `path` + `element`.', { topic: 'router' }),
        mc('Parametru URL', 'Pentru `/user/:id`, cum citești id?', ['useId()', 'useParams()', 'useSearchParams()', 'props.id'], 'useParams()', '`useParams()` returnează obiect cu params.', { topic: 'router' }),
        mc('Programatic', 'Cum navighezi programatic?', ['window.location', 'useNavigate()', 'router.push()', 'goTo()'], 'useNavigate()', '`navigate("/x")`.', { topic: 'router' }),
        mc('Query params', '`?q=test` se citește cu...', ['useParams', 'useSearchParams', 'useQuery', 'useLocation.query'], 'useSearchParams', '`const [p] = useSearchParams(); p.get("q")`.', { topic: 'router' }),
        mc('404', 'Cum prinzi orice rută necunoscută?', ['<Route path="404">', '<Route path="*">', '<NotFound />', '<Default />'], '<Route path="*">', 'Wildcard `*` matches everything.', { topic: 'router' }),
        mc('Active link', 'Pentru a marca link-ul activ?', ['<Link active>', '<NavLink>', '<ActiveLink>', '<Link className="active">'], '<NavLink>', '`NavLink` are state activ automat.', { topic: 'router' }),
        mc('Nested routes', 'Pentru subrute (în Layout), folosești...', ['Children', '<Outlet />', 'props', 'window'], '<Outlet />', '`<Outlet />` randează ruta copil.', { topic: 'router' }),
      ],
    },

    // ==================== 24. FETCHING ====================
    {
      slug: 'react-fetching',
      title: '24. Fetch data în React',
      isFree: false,
      theory: `# 🌐 Fetch data în React

## Pattern de bază

\`\`\`jsx
function Lista() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/items')
      .then(r => {
        if (!r.ok) throw new Error('Eșec');
        return r.json();
      })
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Se încarcă...</p>;
  if (error) return <p>Eroare: {error}</p>;
  return <ul>{items.map(i => <li key={i.id}>{i.nume}</li>)}</ul>;
}
\`\`\`

## Cu async/await

\`\`\`jsx
useEffect(() => {
  async function load() {
    try {
      const r = await fetch('/api/items');
      const d = await r.json();
      setItems(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
\`\`\`

> 💡 Nu poți face \`useEffect(async () => {})\` direct — useEffect așteaptă funcție sincronă.

## POST request

\`\`\`jsx
const handleAdd = async () => {
  await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nume: 'nou' }),
  });
  // refresh lista
};
\`\`\`

## Cancel cu AbortController

\`\`\`jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch('/api/items', { signal: ctrl.signal })
    .then(r => r.json())
    .then(setItems);

  return () => ctrl.abort();
}, []);
\`\`\`

## Biblioteci moderne (mai bune)

- **React Query** / **SWR** — caching, refetch automat, etc.

## 🎓 Ce ai învățat
- ✅ State pentru loading/error/data
- ✅ \`useEffect(() => {fetch...}, [])\`
- ✅ \`async/await\` cu funcție internă
- ✅ Cleanup cu AbortController
`,
      problems: [
        mc('Câte states tipic?', 'Câte state-uri tipic pentru fetch?', ['1', '3 (data, loading, error)', '5', 'Niciunul'], '3 (data, loading, error)', 'data, loading, error e pattern uzual.', { topic: 'fetch' }),
        mc('Unde declanșezi fetch?', 'Unde faci fetch la mount?', ['În JSX', 'useEffect cu []', 'render', 'useState'], 'useEffect cu []', 'useEffect mount.', { topic: 'fetch' }),
        mc('async în useEffect', 'Pot face useEffect async direct?', ['Da', 'NU — wrap într-o funcție internă', 'Doar cu await', 'Doar pentru POST'], 'NU — wrap într-o funcție internă', 'useEffect așteaptă funcție sincronă (sau cleanup).', { topic: 'fetch' }),
        sa('JSON', 'Cum parsezi response în JSON? (await r.json())', 'await r.json()', '`r.json()` returnează promise.', { topic: 'fetch' }),
        mc('Cancel fetch', 'Cu ce previi update după unmount?', ['flag boolean', 'AbortController', 'cancelFetch()', 'Ambele primele 2'], 'Ambele primele 2', 'Fie flag, fie AbortController.', { topic: 'fetch' }),
        mc('POST headers', 'Pentru POST JSON, ce header?', ['text/plain', 'application/json', 'multipart/form-data', 'application/xml'], 'application/json', 'Standard pentru JSON body.', { topic: 'fetch' }),
        mc('Loading inițial', 'loading inițial e...', ['false', 'true', 'null', 'undefined'], 'true', 'Pornești cu loading=true (încă nu ai date).', { topic: 'fetch' }),
        mc('!r.ok', 'fetch detectează erori HTTP 404/500?', ['Da, mereu', 'NU — verifici manual r.ok', 'Doar 500', 'Doar 404'], 'NU — verifici manual r.ok', 'fetch nu rejectează la HTTP errors — verifici `r.ok`.', { topic: 'fetch' }),
        mc('SWR/React Query', 'De ce le folosești?', ['Sunt mai vechi', 'Caching, refetch automat, dedupe', 'Mai puțin cod', 'Toate'], 'Toate', 'Caching, refetch, mai puțin boilerplate.', { topic: 'fetch' }),
        mc('Refetch on focus', 'Refetch când utilizatorul revine pe tab — natural în...', ['fetch pur', 'React Query / SWR', 'useEffect', 'Niciuna'], 'React Query / SWR', 'Built-in în SWR/React Query.', { topic: 'fetch' }),
      ],
    },

    // ==================== 25. BEST PRACTICES ====================
    {
      slug: 'react-best-practices',
      title: '25. Best Practices și Performance',
      isFree: false,
      theory: `# 🏆 Best Practices în React

## 1. Componente mici, focalizate

❌ Componentă cu 500 linii care face totul.
✅ Componente mici, fiecare cu o responsabilitate.

## 2. Naming clar

\`\`\`jsx
<Button />          // ✅
<Btn />             // ❌ neclar
<X />               // ❌
\`\`\`

## 3. Evită prop drilling adânc

Folosește **Context** sau **lifting state up cu wisdom**.

## 4. \`React.memo\` pentru optimizare

\`\`\`jsx
const Card = React.memo(function Card({ user }) {
  return <div>{user.nume}</div>;
});
\`\`\`

> Re-randează doar dacă props se schimbă (shallow compare).

## 5. \`useMemo\` și \`useCallback\` cu măsură

NU peste tot — doar unde chiar e nevoie (calcule scumpe, props la memo).

## 6. Key bună în liste

\`\`\`jsx
{items.map(i => <Item key={i.id} {...i} />)}     // ✅ id stabil
{items.map((i, idx) => <Item key={idx} {...i} />)}  // ⚠️ doar dacă lista nu se modifică
\`\`\`

## 7. Cleanup în useEffect

Mereu curăță timer-e, listener-i, subscription-uri.

## 8. Reguli hooks

- ✅ Top-level only
- ✅ Doar în componente sau alte hooks
- ❌ Nu în if/for/while

## 9. Code splitting

\`\`\`jsx
const HeavyPage = React.lazy(() => import('./HeavyPage'));

<Suspense fallback={<Loading />}>
  <HeavyPage />
</Suspense>
\`\`\`

## 10. Folosește TypeScript (recomandat)

Tipurile prind bug-uri devreme.

## 11. ErrorBoundary pentru a prinde erori

\`\`\`jsx
<ErrorBoundary fallback={<Error />}>
  <App />
</ErrorBoundary>
\`\`\`

## 12. Folosește unelte

- **React DevTools** (extensie browser)
- **Profiler** (vezi unde sunt bottleneck)
- **ESLint plugin react-hooks**

## 🎓 Ce ai învățat
- ✅ Componente mici + naming clar
- ✅ \`memo\` / \`useMemo\` / \`useCallback\` cu măsură
- ✅ Code splitting cu \`lazy\` + \`Suspense\`
- ✅ ErrorBoundary
- ✅ Folosește devtools
`,
      problems: [
        mc('Componente', 'Mai bine?', ['Una mare', 'Multe mici, focalizate', 'Două medii', 'Depinde'], 'Multe mici, focalizate', 'Single responsibility.', { topic: 'best' }),
        mc('React.memo', 'Ce face?', ['Memorează state', 'Re-randare doar la prop change (shallow)', 'CSS', 'Caching fetch'], 'Re-randare doar la prop change (shallow)', 'Wrap componentă pentru optimizare.', { topic: 'best' }),
        mc('Key', 'Care e cea mai bună?', ['index', 'Math.random()', 'id stabil', 'numele'], 'id stabil', 'ID-ul stabil din date.', { topic: 'best' }),
        mc('Code splitting', 'Cu ce împarți bundle-ul?', ['React.split', 'React.lazy + Suspense', 'split()', 'Webpack manual'], 'React.lazy + Suspense', 'Lazy loading cu Suspense.', { topic: 'best' }),
        mc('ErrorBoundary', 'Ce face?', ['Sare blocuri', 'Prinde erori în copii', 'CSS', 'Routing'], 'Prinde erori în copii', 'Class component sau bibliotecă.', { topic: 'best' }),
        mc('useMemo abuse', 'Folosirea peste tot e...', ['Bună', 'Anti-pattern', 'Recomandată', 'Standard'], 'Anti-pattern', 'Are cost, folosește când e nevoie.', { topic: 'best' }),
        mc('DevTools', 'React DevTools e...', ['IDE', 'Extensie browser pentru debug', 'Linter', 'Server'], 'Extensie browser pentru debug', 'Vezi tree, props, state, hooks.', { topic: 'best' }),
        mc('TypeScript', 'TS în React e...', ['Inutil', 'Recomandat — tipuri prind bugs', 'Doar pentru biblioteci', 'Lent'], 'Recomandat — tipuri prind bugs', 'TS oferă safety + autocomplete.', { topic: 'best' }),
        mc('Cleanup', 'Cleanup în useEffect e...', ['Optional', 'Critic pentru memory leaks', 'Doar dev', 'Inutil'], 'Critic pentru memory leaks', 'Mereu curăță side effects.', { topic: 'best' }),
        mc('Profiler', 'Profiler React e pentru...', ['Bug-uri', 'Performance — măsură render-uri', 'Networking', 'Animații'], 'Performance — măsură render-uri', 'Vezi care componente sunt scumpe.', { topic: 'best' }),
      ],
    },

  ],
}
