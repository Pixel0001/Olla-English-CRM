// Tailwind CSS — 25 lecții cu teorie îmbogățită + 10+ probleme/lecție

import { mc, sa } from './helpers.mjs'

export const tailwindModule = {
  slug: 'tailwind-fundamentals',
  title: 'Tailwind CSS',
  description: 'Învață Tailwind CSS — utility-first CSS framework. 25 de lecții pentru design rapid și consistent.',
  language: 'css',
  order: 9,
  lessons: [

    // ==================== 1. INTRODUCERE ====================
    {
      slug: 'tailwind-introducere',
      title: '1. Introducere în Tailwind CSS',
      isFree: true,
      theory: `# 🎨 Bun venit în Tailwind CSS!

## Ce este Tailwind?

**Tailwind CSS** = un framework CSS **utility-first**. Asta înseamnă că în loc să scrii CSS, folosești **clase mici** care fac un singur lucru.

## CSS clasic vs Tailwind

### CSS clasic
\`\`\`html
<button class="btn">Click</button>

<style>
.btn {
  background: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
\`\`\`

### Tailwind
\`\`\`html
<button class="bg-blue-500 text-white px-5 py-2 rounded">Click</button>
\`\`\`

> 💡 **Fără CSS scris** — totul în clase!

## De ce Tailwind?

- ⚡ **Rapid** — nu mai sari între HTML și CSS
- 🎨 **Consistent** — design tokens (culori, spațieri)
- 📦 **Mic în production** — purge automat clase neutilizate
- 📱 **Responsive ușor** — \`md:\`, \`lg:\` prefix
- 🌙 **Dark mode** built-in

## Filosofia "Utility-First"

În loc de "componente" CSS gata făcute, ai **mii de utilitare** mici:
- \`text-center\` — \`text-align: center\`
- \`p-4\` — \`padding: 1rem\`
- \`bg-red-500\` — \`background: roșu\`
- \`flex\` — \`display: flex\`

## ⚠️ Frica de "HTML aglomerat"

Da, HTML-ul devine mai lung. Dar:
- Compensezi prin **componente React/Vue/etc**
- Nu mai ai "naming hell" pentru clase
- Refactor mai ușor (modifici 1 loc, nu cauți selector în CSS)

## 🎓 Ce ai învățat
- ✅ Tailwind = CSS utility-first
- ✅ Folosești clase pentru fiecare proprietate
- ✅ Rapid, consistent, responsive built-in
`,
      problems: [
        mc('Ce e Tailwind?', 'Tailwind este...', ['Un browser', 'Un framework CSS utility-first', 'Un IDE', 'Un limbaj'], 'Un framework CSS utility-first', 'Tailwind oferă mii de clase utilitare.', { topic: 'intro' }),
        mc('Utility-first', 'Înseamnă...', ['Un singur fișier CSS', 'Clase mici care fac un lucru', 'Componente predefinite', 'Mai puține clase'], 'Clase mici care fac un lucru', 'Ex: `p-4` doar padding.', { topic: 'intro' }),
        mc('text-center', 'Ce face?', ['background', 'text-align: center', 'border', 'margin'], 'text-align: center', 'Clasa utilitară pentru aliniere text.', { topic: 'intro' }),
        mc('Avantaj', 'Care e un avantaj?', ['Mai puțin HTML', 'Refactor mai ușor', 'Niciun CSS scris', 'Ambele B și C'], 'Ambele B și C', 'Ambele sunt avantaje reale.', { topic: 'intro' }),
        sa('Padding 4', 'Ce clasă Tailwind dă padding 1rem? (p-4)', 'p-4', '`p-4` = `padding: 1rem`.', { topic: 'intro' }),
        mc('Mărime production', 'În production, fișierul CSS e...', ['Mare', 'Mic — purge automat', 'Dublu', 'Niciun fișier'], 'Mic — purge automat', 'Tailwind elimină clasele nefolosite.', { topic: 'intro' }),
        mc('Responsive', 'Cum faci responsive?', ['Media queries manual', 'Prefix `md:`, `lg:`', '@media în component', 'JavaScript'], 'Prefix `md:`, `lg:`', 'Prefix-uri pentru breakpoints.', { topic: 'intro' }),
        mc('Dark mode', 'Dark mode în Tailwind e...', ['Greu', 'Built-in cu `dark:`', 'Doar plugin', 'Imposibil'], 'Built-in cu `dark:`', '`dark:bg-gray-900`.', { topic: 'intro' }),
        mc('bg-blue-500', 'Ce face?', ['background albastru mediu', 'border albastru', 'text albastru', 'flex'], 'background albastru mediu', '`bg-` = background, 500 = nuanță medie.', { topic: 'intro' }),
        mc('Tailwind vs Bootstrap', 'Diferența principală?', ['Tailwind = utility, Bootstrap = componente', 'Bootstrap mai rapid', 'Tailwind mai vechi', 'Identice'], 'Tailwind = utility, Bootstrap = componente', 'Bootstrap dă "Card", Tailwind dă "p-4 rounded shadow".', { topic: 'intro' }),
      ],
    },

    // ==================== 2. SETUP ====================
    {
      slug: 'tailwind-setup',
      title: '2. Setup și instalare',
      isFree: true,
      theory: `# 🛠️ Setup Tailwind

## CDN (cel mai rapid pentru testat)

\`\`\`html
<script src="https://cdn.tailwindcss.com"></script>
\`\`\`

> 💡 NU folosește în production — fișier mare.

## Cu Vite

\`\`\`bash
npm create vite@latest my-app
cd my-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Cu Next.js (deja inclus în template)

\`\`\`bash
npx create-next-app@latest my-app  # alegi Tailwind
\`\`\`

## tailwind.config.js

\`\`\`js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
\`\`\`

> 💡 \`content\` spune Tailwind unde să caute clase.

## globals.css

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Pornire

\`\`\`bash
npm run dev
\`\`\`

## VS Code Extension

Instalează **Tailwind CSS IntelliSense** — autocomplete + preview culori.

## 🎓 Ce ai învățat
- ✅ Setup cu Vite/Next.js
- ✅ \`tailwind.config.js\` cu \`content\`
- ✅ \`@tailwind\` în CSS
- ✅ Extensia VS Code e must-have
`,
      problems: [
        mc('CDN', 'CDN e bun pentru...', ['Production', 'Testare rapidă', 'Mobile', 'Toate'], 'Testare rapidă', 'CDN e mare, doar pentru demo.', { topic: 'setup' }),
        mc('Init config', 'Ce comandă creează tailwind.config.js?', ['npm tailwind init', 'npx tailwindcss init', 'tailwind create', 'init tailwind'], 'npx tailwindcss init', 'Standard.', { topic: 'setup' }),
        mc('Content', '`content` în config e pentru...', ['Stiluri', 'Unde caută Tailwind clase', 'Plugin-uri', 'Theme'], 'Unde caută Tailwind clase', 'Pentru a putge clase nefolosite.', { topic: 'setup' }),
        sa('Directive', 'Ce directivă bagă utilitățile? (@tailwind utilities)', '@tailwind utilities', 'În CSS principal.', { topic: 'setup' }),
        mc('Cele 3 layers', 'Care sunt cele 3 layers @tailwind?', ['base, components, utilities', 'init, main, end', 'reset, theme, custom', 'top, mid, bot'], 'base, components, utilities', 'Standard în Tailwind.', { topic: 'setup' }),
        mc('Extensie VS Code', 'Care e extensia recomandată?', ['Tailwind Snippets', 'Tailwind CSS IntelliSense', 'TW Helper', 'CSS Tailwind'], 'Tailwind CSS IntelliSense', 'Oficială Tailwind Labs.', { topic: 'setup' }),
        mc('Postcss', 'Tailwind folosește...', ['Sass', 'PostCSS', 'Less', 'Plain CSS'], 'PostCSS', 'PostCSS pentru transformări.', { topic: 'setup' }),
        mc('Production purge', 'Production: clasele nefolosite se...', ['Păstrează', 'Șterg automat', 'Comprimă', 'Mute'], 'Șterg automat', 'JIT/purge elimină nefolosite.', { topic: 'setup' }),
        mc('Next.js', 'Next.js are Tailwind...', ['Imposibil', 'Opțional la create-next-app', 'Deja gata', 'Doar manual'], 'Opțional la create-next-app', 'Creator-ul te întreabă.', { topic: 'setup' }),
        mc('Theme extend', '`theme.extend` permite...', ['Suprascrie tot', 'Adaugă custom fără a pierde defaults', 'Șterge teme', 'Plugin'], 'Adaugă custom fără a pierde defaults', '`extend` păstrează defaults.', { topic: 'setup' }),
      ],
    },

    // ==================== 3. COLORS ====================
    {
      slug: 'tailwind-colors',
      title: '3. Colors și Background',
      isFree: false,
      theory: `# 🎨 Culori în Tailwind

## Sistemul de culori

Tailwind are **palete** cu nuanțe de la **50** (foarte deschis) la **950** (foarte închis).

\`\`\`
gray-50, gray-100, gray-200, ..., gray-900, gray-950
red-50, red-100, ..., red-900, red-950
blue, green, yellow, purple, pink, orange, indigo, teal, etc.
\`\`\`

## Background

\`\`\`html
<div class="bg-blue-500">Albastru mediu</div>
<div class="bg-red-100">Roșu foarte deschis</div>
<div class="bg-gray-900">Gri închis</div>
\`\`\`

## Text color

\`\`\`html
<p class="text-blue-500">Text albastru</p>
<p class="text-white">Text alb</p>
<p class="text-gray-700">Text gri închis</p>
\`\`\`

## Border color

\`\`\`html
<div class="border border-gray-300">Bordură gri</div>
\`\`\`

## Opacity (transparență)

\`\`\`html
<div class="bg-blue-500/50">50% opacitate</div>
<div class="bg-red-500/25">25% opacitate</div>
\`\`\`

## Culori speciale

- \`white\` / \`black\`
- \`transparent\`
- \`current\` (currentColor)
- \`inherit\`

## Nuanțe utile

- **50-200** → background-uri delicate
- **400-600** → text/buton primary
- **700-900** → text închis, fundal dark mode

## Gradient

\`\`\`html
<div class="bg-gradient-to-r from-blue-500 to-purple-500">Gradient</div>
\`\`\`

Direcții: \`bg-gradient-to-r/l/t/b/tr/tl/br/bl\`

## 🎓 Ce ai învățat
- ✅ Culori cu nuanțe 50-950
- ✅ \`bg-\`, \`text-\`, \`border-\`
- ✅ Opacity cu \`/50\`, \`/25\`
- ✅ Gradients cu \`from-\` și \`to-\`
`,
      problems: [
        mc('Background albastru', 'Care clasă?', ['blue-bg', 'bg-blue-500', 'background-blue', 'color-bg-blue'], 'bg-blue-500', '`bg-{color}-{nuanță}`.', { topic: 'colors' }),
        mc('Text alb', 'Care clasă?', ['text-white', 'color-white', 'tx-white', 'fg-white'], 'text-white', '`text-{color}`.', { topic: 'colors' }),
        mc('Cea mai închisă', 'Care e cea mai închisă nuanță?', ['100', '500', '900', '950'], '950', 'Nuanțele 50→950, 950 = cea mai închisă.', { topic: 'colors' }),
        sa('Opacity 50%', 'Cum dai 50% opacitate la bg-red-500? (bg-red-500/50)', 'bg-red-500/50', 'Suffix `/50`.', { topic: 'colors' }),
        mc('Nuanță deschisă', 'Pentru background subtil, ce nuanță?', ['50-200', '500', '900', '950'], '50-200', 'Nuanțele mici sunt foarte deschise.', { topic: 'colors' }),
        mc('Border culoare', 'Cum dai border roșu?', ['border-red', 'border-color-red', 'border-red-500', 'red-border'], 'border-red-500', '`border-{color}-{nuanță}`.', { topic: 'colors' }),
        mc('Transparent', 'Cum faci background transparent?', ['bg-clear', 'bg-transparent', 'bg-none', 'bg-0'], 'bg-transparent', 'Clasa specială.', { topic: 'colors' }),
        mc('Gradient direcție', 'Stânga → dreapta?', ['bg-gradient-l', 'bg-gradient-to-r', 'bg-gradient-right', 'gradient-r'], 'bg-gradient-to-r', '`bg-gradient-to-{direcție}`.', { topic: 'colors' }),
        mc('Gradient', 'Unde setezi culorile?', ['from-X to-Y', 'gradient(X, Y)', 'colors(X, Y)', 'X-Y'], 'from-X to-Y', '`from-blue-500 to-purple-500`.', { topic: 'colors' }),
        mc('CurrentColor', 'Pentru a moșteni culoarea părinte?', ['inherit', 'parent', 'current', 'auto'], 'current', '`text-current` sau `border-current`.', { topic: 'colors' }),
      ],
    },

    // ==================== 4. SPACING ====================
    {
      slug: 'tailwind-spacing',
      title: '4. Spacing — padding și margin',
      isFree: false,
      theory: `# 📏 Spacing în Tailwind

## Scala spațierii

Tailwind folosește o scală **4px-based** (1 = 0.25rem = 4px):

| Clasă | Pixeli |
|---|---|
| 0 | 0 |
| 1 | 4px |
| 2 | 8px |
| 4 | 16px |
| 8 | 32px |
| 16 | 64px |
| 32 | 128px |

## Padding

\`\`\`html
<div class="p-4">padding pe toate părțile (16px)</div>
<div class="px-4">padding orizontal (left+right)</div>
<div class="py-2">padding vertical (top+bottom)</div>
<div class="pt-4">padding top</div>
<div class="pr-4">padding right</div>
<div class="pb-4">padding bottom</div>
<div class="pl-4">padding left</div>
\`\`\`

## Margin

\`\`\`html
<div class="m-4">margin toate părțile</div>
<div class="mx-auto">margin orizontal auto (centrare!)</div>
<div class="my-4">margin vertical</div>
<div class="mt-2 mb-4">top 8px, bottom 16px</div>
\`\`\`

## Margin negativ

\`\`\`html
<div class="-mt-4">margin-top: -16px</div>
<div class="-mx-2">margin orizontal negativ</div>
\`\`\`

## Space between (între copii)

\`\`\`html
<div class="space-y-4">
  <div>Element 1</div>
  <div>Element 2</div>   <!-- 16px deasupra -->
  <div>Element 3</div>
</div>

<div class="space-x-2">
  <span>A</span>
  <span>B</span>          <!-- 8px stânga -->
</div>
\`\`\`

## Gap (în flex/grid)

\`\`\`html
<div class="flex gap-4">...</div>
<div class="grid grid-cols-3 gap-2">...</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ Scala 4px (1 = 4px, 4 = 16px)
- ✅ \`p-{n}\`, \`m-{n}\` toate părțile
- ✅ \`px-\`, \`py-\`, \`pt-\`, etc.
- ✅ \`mx-auto\` pentru centrare
- ✅ \`gap-\` în flex/grid
`,
      problems: [
        mc('p-4', 'p-4 = ?', ['4px padding', '16px padding', '40px padding', '4rem padding'], '16px padding', '4 × 4px = 16px = 1rem.', { topic: 'spacing' }),
        mc('Padding orizontal', 'Care?', ['p-4', 'px-4', 'py-4', 'pl-4'], 'px-4', 'x = horizontal (left + right).', { topic: 'spacing' }),
        sa('Margin top 8', 'Margin-top: 8px? (mt-2)', 'mt-2', '2 × 4px = 8px.', { topic: 'spacing' }),
        mc('Centrare orizontală', 'Cea mai folosită?', ['mx-auto', 'm-center', 'mh-auto', 'center'], 'mx-auto', '`mx-auto` cu `width` setată = centrare.', { topic: 'spacing' }),
        mc('Negativ', 'Margin-top -16px?', ['mt--4', '-mt-4', 'mt-neg-4', 'mt-(-4)'], '-mt-4', 'Prefix `-`.', { topic: 'spacing' }),
        mc('Space between', 'Spațiere între copii Y?', ['gap-4', 'space-y-4', 'between-4', 'p-4'], 'space-y-4', '`space-y-` adaugă margin între copii.', { topic: 'spacing' }),
        mc('Gap', 'Gap în flex?', ['p-4', 'gap-4', 'space-4', 'flex-gap-4'], 'gap-4', 'Funcționează în flex/grid.', { topic: 'spacing' }),
        mc('p-2', 'p-2 = ?', ['2px', '8px', '16px', '0.2rem'], '8px', '2 × 4px.', { topic: 'spacing' }),
        mc('m-0', 'm-0 = ?', ['margin: 0', 'margin: auto', 'no margin', 'Ambele A și C'], 'Ambele A și C', '`m-0` setează margin: 0.', { topic: 'spacing' }),
        mc('Padding bottom', 'pb-8 = ?', ['padding-bottom: 8px', 'padding-bottom: 32px', 'padding-bottom: 8rem', 'padding-block: 8'], 'padding-bottom: 32px', '8 × 4px = 32px.', { topic: 'spacing' }),
      ],
    },

    // ==================== 5. SIZING ====================
    {
      slug: 'tailwind-sizing',
      title: '5. Sizing — width și height',
      isFree: false,
      theory: `# 📐 Sizing — dimensiuni

## Width

\`\`\`html
<div class="w-4">16px</div>
<div class="w-32">128px</div>
<div class="w-1/2">50% lățime părinte</div>
<div class="w-full">100% lățime</div>
<div class="w-screen">100vw</div>
<div class="w-auto">auto</div>
<div class="w-fit">fit-content</div>
<div class="w-min">min-content</div>
<div class="w-max">max-content</div>
\`\`\`

## Height

\`\`\`html
<div class="h-32">128px</div>
<div class="h-full">100% înălțime părinte</div>
<div class="h-screen">100vh (toată fereastra)</div>
\`\`\`

## Min / Max

\`\`\`html
<div class="min-w-0">min-width: 0</div>
<div class="min-w-full">min-width: 100%</div>
<div class="max-w-md">max-width: 28rem (medium)</div>
<div class="max-w-lg">max-width: 32rem</div>
<div class="max-w-xl">max-width: 36rem</div>
<div class="max-w-2xl">max-width: 42rem</div>
<div class="min-h-screen">min-height: 100vh</div>
\`\`\`

## Fracții utile

\`\`\`html
w-1/2  w-1/3  w-2/3  w-1/4  w-3/4  w-1/5  w-1/6  w-1/12
\`\`\`

## Container

\`\`\`html
<div class="container mx-auto px-4">
  Conținut centrat cu max-width responsive
</div>
\`\`\`

## Aspect ratio

\`\`\`html
<div class="aspect-video">16:9</div>
<div class="aspect-square">1:1</div>
<div class="aspect-[4/3]">4:3</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`w-\`, \`h-\` cu scala 4px
- ✅ Fracții (\`w-1/2\`)
- ✅ \`full\`, \`screen\`, \`auto\`, \`fit\`
- ✅ \`min-w-\`, \`max-w-\`
- ✅ \`aspect-\` pentru ratio
`,
      problems: [
        mc('Width 100%', 'Cum?', ['w-100', 'w-full', 'w-100%', 'width-full'], 'w-full', '`w-full` = 100%.', { topic: 'sizing' }),
        mc('Width jumătate', 'Cum?', ['w-50', 'w-half', 'w-1/2', 'w-50%'], 'w-1/2', 'Fracții suportate.', { topic: 'sizing' }),
        mc('Înălțime ecran', 'Cum?', ['h-screen', 'h-100vh', 'h-window', 'h-vh'], 'h-screen', '`h-screen` = 100vh.', { topic: 'sizing' }),
        sa('Max width md', 'Max-width medium? (max-w-md)', 'max-w-md', '`max-w-md` = 28rem.', { topic: 'sizing' }),
        mc('Aspect 16:9', 'Cum?', ['ratio-16/9', 'aspect-video', 'aspect-16-9', '16-9'], 'aspect-video', '`aspect-video` = 16:9 standard.', { topic: 'sizing' }),
        mc('Container', 'Container cu centrare:', ['container', 'container mx-auto', '<div class="centered">', 'centered'], 'container mx-auto', '`container` setează max-width-uri responsive.', { topic: 'sizing' }),
        mc('w-fit', 'Ce înseamnă?', ['100%', 'fit-content', 'auto', 'min-content'], 'fit-content', '`w-fit` = fit-content.', { topic: 'sizing' }),
        mc('Min height full', 'Cum forțezi cel puțin 100vh?', ['h-screen', 'min-h-screen', 'h-min-100', 'h-100vh'], 'min-h-screen', 'Permite să crească peste 100vh.', { topic: 'sizing' }),
        mc('w-1/3', 'Înseamnă?', ['33.33%', '13%', '1.3rem', '33px'], '33.33%', '1/3 = 33.33%.', { topic: 'sizing' }),
        mc('Aspect square', 'Aspect 1:1?', ['aspect-1/1', 'aspect-square', 'aspect-equal', 'square'], 'aspect-square', '`aspect-square` standard.', { topic: 'sizing' }),
      ],
    },

    // ==================== 6. TYPOGRAPHY ====================
    {
      slug: 'tailwind-typography',
      title: '6. Typography (text)',
      isFree: false,
      theory: `# ✍️ Typography în Tailwind

## Font size

\`\`\`html
<p class="text-xs">Extra small (12px)</p>
<p class="text-sm">Small (14px)</p>
<p class="text-base">Base (16px) — default</p>
<p class="text-lg">Large (18px)</p>
<p class="text-xl">XL (20px)</p>
<p class="text-2xl">2XL (24px)</p>
<p class="text-3xl">3XL (30px)</p>
<p class="text-4xl">4XL (36px)</p>
<p class="text-5xl">5XL (48px)</p>
<p class="text-6xl">6XL (60px)</p>
\`\`\`

## Font weight

\`\`\`html
<p class="font-thin">100</p>
<p class="font-light">300</p>
<p class="font-normal">400 — default</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>
<p class="font-extrabold">800</p>
<p class="font-black">900</p>
\`\`\`

## Font family

\`\`\`html
<p class="font-sans">Sans-serif (default)</p>
<p class="font-serif">Serif</p>
<p class="font-mono">Monospace</p>
\`\`\`

## Aliniere

\`\`\`html
<p class="text-left">Stânga</p>
<p class="text-center">Centru</p>
<p class="text-right">Dreapta</p>
<p class="text-justify">Justify</p>
\`\`\`

## Stiluri

\`\`\`html
<p class="italic">Italic</p>
<p class="not-italic">Normal</p>
<p class="underline">Subliniat</p>
<p class="line-through">Tăiat</p>
<p class="no-underline">Fără subliniere</p>
<p class="uppercase">MARE</p>
<p class="lowercase">mic</p>
<p class="capitalize">Primă Literă</p>
\`\`\`

## Line height

\`\`\`html
<p class="leading-none">1</p>
<p class="leading-tight">1.25</p>
<p class="leading-normal">1.5</p>
<p class="leading-relaxed">1.625</p>
<p class="leading-loose">2</p>
\`\`\`

## Letter spacing

\`\`\`html
<p class="tracking-tight">-0.025em</p>
<p class="tracking-normal">0</p>
<p class="tracking-wide">0.025em</p>
<p class="tracking-wider">0.05em</p>
<p class="tracking-widest">0.1em</p>
\`\`\`

## Truncate (text lung)

\`\`\`html
<p class="truncate">Text foarte lung care va fi tăiat...</p>
<p class="line-clamp-3">Maxim 3 linii, după "..."</p>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`text-{xs..6xl}\` pentru mărime
- ✅ \`font-{weight}\` pentru greutate
- ✅ \`text-{align}\` pentru aliniere
- ✅ \`italic\`, \`underline\`, \`uppercase\`
- ✅ \`leading-\`, \`tracking-\` pentru spațiere
`,
      problems: [
        mc('Bold', 'Cum bold?', ['text-bold', 'font-bold', 'fb', 'bold'], 'font-bold', '`font-bold` = 700.', { topic: 'typo' }),
        mc('Centrat', 'Text aliniat centru?', ['text-center', 'align-center', 'center', 'text-c'], 'text-center', 'Standard.', { topic: 'typo' }),
        mc('Mărime mare', 'text-xl = ?', ['12px', '20px', '24px', '32px'], '20px', 'XL = 1.25rem = 20px.', { topic: 'typo' }),
        sa('Italic', 'Cum italic? (italic)', 'italic', 'Direct `italic`.', { topic: 'typo' }),
        mc('Uppercase', 'Cum?', ['text-upper', 'uppercase', 'caps', 'text-uppercase'], 'uppercase', 'Direct `uppercase`.', { topic: 'typo' }),
        mc('Truncate', 'Truncate ce face?', ['Tăiere text cu "..."', 'Subliniere', 'Centrare', 'Bold'], 'Tăiere text cu "..."', '`truncate` = overflow-ellipsis.', { topic: 'typo' }),
        mc('Mono font', 'Cum mono?', ['font-mono', 'mono', 'text-mono', 'family-mono'], 'font-mono', 'Standard.', { topic: 'typo' }),
        mc('Leading', 'leading- e pentru?', ['letter-spacing', 'line-height', 'word-spacing', 'font-size'], 'line-height', 'Leading = line-height.', { topic: 'typo' }),
        mc('Tracking', 'tracking- e pentru?', ['line-height', 'letter-spacing', 'word-spacing', 'kerning'], 'letter-spacing', 'Tracking = letter-spacing.', { topic: 'typo' }),
        mc('text-base', 'text-base = ?', ['12px', '16px', '20px', '14px'], '16px', '1rem = 16px (default).', { topic: 'typo' }),
      ],
    },

    // ==================== 7. FLEXBOX BASIC ====================
    {
      slug: 'tailwind-flexbox',
      title: '7. Flexbox basics',
      isFree: false,
      theory: `# 📦 Flexbox în Tailwind

## Activare

\`\`\`html
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
\`\`\`

## Direcție

\`\`\`html
<div class="flex flex-row">orizontal (default)</div>
<div class="flex flex-col">vertical</div>
<div class="flex flex-row-reverse">orizontal invers</div>
<div class="flex flex-col-reverse">vertical invers</div>
\`\`\`

## Wrap

\`\`\`html
<div class="flex flex-wrap">se înfășoară pe rânduri</div>
<div class="flex flex-nowrap">o singură linie (default)</div>
\`\`\`

## Aliniere pe AXA PRINCIPALĂ — justify

\`\`\`html
<div class="flex justify-start">stânga (default)</div>
<div class="flex justify-center">centru</div>
<div class="flex justify-end">dreapta</div>
<div class="flex justify-between">primul-stânga, ultimul-dreapta</div>
<div class="flex justify-around">spațiu egal cu jumătate la margini</div>
<div class="flex justify-evenly">spațiu perfect egal</div>
\`\`\`

## Aliniere pe AXA TRANSVERSALĂ — items

\`\`\`html
<div class="flex items-start">sus</div>
<div class="flex items-center">centrat</div>
<div class="flex items-end">jos</div>
<div class="flex items-stretch">se întind (default)</div>
<div class="flex items-baseline">aliniere pe baseline</div>
\`\`\`

## ⭐ Centrare PERFECTĂ

\`\`\`html
<div class="flex justify-center items-center h-screen">
  <p>Centrat orizontal ȘI vertical</p>
</div>
\`\`\`

## Gap

\`\`\`html
<div class="flex gap-4">spațiu 16px între</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`flex\` activează flexbox
- ✅ \`flex-row\` / \`flex-col\` direcția
- ✅ \`justify-\` axa principală
- ✅ \`items-\` axa transversală
- ✅ \`gap-\` spațiere
`,
      problems: [
        mc('Activare flex', 'Cum?', ['display-flex', 'flex', 'd-flex', 'fb'], 'flex', '`flex` = display: flex.', { topic: 'flex' }),
        mc('Coloană', 'Direcție coloană?', ['flex-vertical', 'flex-col', 'flex-y', 'col'], 'flex-col', '`flex-col` = flex-direction: column.', { topic: 'flex' }),
        sa('Centrare orizontală', 'Centrare pe axa principală? (justify-center)', 'justify-center', '`justify-center`.', { topic: 'flex' }),
        mc('Centrare verticală flex', 'În flex-row, centrare vertical?', ['justify-center', 'items-center', 'align-middle', 'v-center'], 'items-center', 'Axa transversală = items.', { topic: 'flex' }),
        mc('Spațiu între', 'Spațiu egal între items?', ['justify-between', 'gap-between', 'space-between', 'between'], 'justify-between', '`justify-between` standard.', { topic: 'flex' }),
        mc('Wrap', 'Permite înfășurare?', ['flex-wrap', 'wrap', 'flex-multi', 'flex-w'], 'flex-wrap', '`flex-wrap` = flex-wrap: wrap.', { topic: 'flex' }),
        mc('Centrare totală', 'Centrare perfectă în flex-row?', ['justify-center items-center', 'center', 'm-auto', 'flex-center'], 'justify-center items-center', 'Combinație clasică.', { topic: 'flex' }),
        mc('Gap flex', 'Spațiu 16px?', ['p-4', 'gap-4', 'm-4', 'space-4'], 'gap-4', '`gap-4`.', { topic: 'flex' }),
        mc('justify-evenly', 'Înseamnă?', ['Toate la stânga', 'Spațiu perfect egal incl. margini', 'Sus-jos', 'Random'], 'Spațiu perfect egal incl. margini', 'Diferit de around (jumătate margini).', { topic: 'flex' }),
        mc('Direction default', 'Default flex-direction?', ['column', 'row', 'row-reverse', 'wrap'], 'row', 'Default = row.', { topic: 'flex' }),
      ],
    },

    // ==================== 8. FLEXBOX ADVANCED ====================
    {
      slug: 'tailwind-flexbox-advanced',
      title: '8. Flexbox avansat',
      isFree: false,
      theory: `# 📦 Flexbox avansat

## Flex grow/shrink/basis

\`\`\`html
<div class="flex">
  <div class="flex-1">crește pentru a umple</div>
  <div class="flex-1">crește pentru a umple</div>
</div>
\`\`\`

| Clasă | flex |
|---|---|
| \`flex-1\` | 1 1 0% |
| \`flex-auto\` | 1 1 auto |
| \`flex-initial\` | 0 1 auto |
| \`flex-none\` | none |

## Grow / Shrink individual

\`\`\`html
<div class="grow">poate crește</div>
<div class="grow-0">nu crește</div>
<div class="shrink">poate să scadă</div>
<div class="shrink-0">nu se micșorează</div>
\`\`\`

## Self alignment (suprascrie items-)

\`\`\`html
<div class="flex items-center">
  <div>centrat</div>
  <div class="self-start">la sus, deși părintele zice center</div>
</div>
\`\`\`

## Order

\`\`\`html
<div class="flex">
  <div class="order-2">apare al doilea</div>
  <div class="order-1">apare primul</div>
  <div class="order-3">al treilea</div>
</div>
\`\`\`

## Aliniere pe rânduri (cu wrap)

\`\`\`html
<div class="flex flex-wrap content-between">
  ...
</div>
\`\`\`

## Pattern uzual: header

\`\`\`html
<header class="flex justify-between items-center p-4">
  <div>Logo</div>
  <nav class="flex gap-4">
    <a>Acasă</a>
    <a>Despre</a>
  </nav>
</header>
\`\`\`

## Pattern uzual: card actions

\`\`\`html
<div class="flex flex-col">
  <h3>Titlu</h3>
  <p class="flex-1">Conținut care umple spațiul</p>
  <div class="flex justify-end gap-2">
    <button>Cancel</button>
    <button>OK</button>
  </div>
</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`flex-1\` umple spațiu egal
- ✅ \`grow\`, \`shrink\` individual
- ✅ \`self-\` suprascrie aliniere
- ✅ \`order-\` reordonează
`,
      problems: [
        mc('flex-1', 'Ce face?', ['Mărime fixă', 'Crește 1 unitate', 'Umple spațiul disponibil', 'Nimic'], 'Umple spațiul disponibil', 'flex: 1 1 0%.', { topic: 'flex-adv' }),
        mc('Nu crește', 'Care clasă?', ['no-grow', 'grow-0', 'flex-none', 'shrink'], 'grow-0', '`grow-0` = nu crește.', { topic: 'flex-adv' }),
        sa('Self end', 'Self la dreapta? (self-end)', 'self-end', '`self-end` suprascrie items.', { topic: 'flex-adv' }),
        mc('Order', 'Cum primul în vizual deși al treilea în HTML?', ['order-1 (alții fără order)', 'first', 'top', 'priority-1'], 'order-1 (alții fără order)', 'Default order = 0.', { topic: 'flex-adv' }),
        mc('Pattern header', 'Logo stânga, nav dreapta?', ['flex justify-between', 'flex justify-around', 'flex flex-col', 'grid'], 'flex justify-between', 'Standard pattern.', { topic: 'flex-adv' }),
        mc('Card sticky bottom', 'Buton mereu jos?', ['flex-col + flex-1 pe content', 'absolute', 'fixed', 'bottom-0'], 'flex-col + flex-1 pe content', '`flex-1` pe content împinge butonul jos.', { topic: 'flex-adv' }),
        mc('flex-none', 'Înseamnă?', ['flex: 0 0 auto', 'flex: 1 1 0', 'flex: auto', 'display: none'], 'flex: 0 0 auto', 'Fix size, nu crește/scade.', { topic: 'flex-adv' }),
        mc('Shrink-0', 'Util pentru?', ['Imagini care nu trebuie comprimate', 'Border', 'Text', 'Toate'], 'Imagini care nu trebuie comprimate', 'Imagini care păstrează lățimea.', { topic: 'flex-adv' }),
        mc('content-between', 'Pe ce axă?', ['Principală', 'Transversală — pentru rânduri în wrap', 'Verticală', 'Diagonală'], 'Transversală — pentru rânduri în wrap', 'Aliniere rânduri în flex-wrap.', { topic: 'flex-adv' }),
        mc('Egal împărțit 3', '3 coloane egale flex?', ['Toate flex-1', 'flex-3', '3-cols', 'split-3'], 'Toate flex-1', '3 elemente cu `flex-1` = egale.', { topic: 'flex-adv' }),
      ],
    },

    // ==================== 9. GRID ====================
    {
      slug: 'tailwind-grid',
      title: '9. CSS Grid basics',
      isFree: false,
      theory: `# 🔲 CSS Grid în Tailwind

## Activare

\`\`\`html
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
\`\`\`

## Coloane

\`\`\`html
<div class="grid grid-cols-1">1 coloană</div>
<div class="grid grid-cols-2">2 coloane</div>
<div class="grid grid-cols-3">3 coloane</div>
<div class="grid grid-cols-4">4 coloane</div>
<!-- până la 12 -->
\`\`\`

## Rânduri

\`\`\`html
<div class="grid grid-rows-3 gap-2">3 rânduri</div>
\`\`\`

## Span (cât ocupă un element)

\`\`\`html
<div class="grid grid-cols-4">
  <div class="col-span-2">ocupă 2 coloane</div>
  <div>1</div>
  <div>1</div>
</div>
\`\`\`

## Span complet

\`\`\`html
<div class="col-span-full">toate coloanele</div>
\`\`\`

## Row span

\`\`\`html
<div class="row-span-2">ocupă 2 rânduri</div>
\`\`\`

## Auto-fit / auto-fill

\`\`\`html
<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  ... cards care se adaptează
</div>
\`\`\`

## Pattern: galerie

\`\`\`html
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <img />
  <img />
  ...
</div>
\`\`\`

## Pattern: layout app

\`\`\`html
<div class="grid grid-cols-[200px_1fr] h-screen">
  <aside>Sidebar</aside>
  <main>Conținut</main>
</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`grid grid-cols-N\` activare
- ✅ \`col-span-N\`, \`row-span-N\`
- ✅ \`gap-\` între celule
- ✅ Responsive cu prefix \`md:\`
`,
      problems: [
        mc('Activare grid', 'Cum?', ['display-grid', 'grid', 'd-grid', 'gd'], 'grid', '`grid` = display: grid.', { topic: 'grid' }),
        mc('3 coloane', 'Cum?', ['grid-3', 'cols-3', 'grid-cols-3', '3-cols'], 'grid-cols-3', '`grid-cols-N`.', { topic: 'grid' }),
        sa('Span 2', 'Element ocupă 2 coloane? (col-span-2)', 'col-span-2', '`col-span-N`.', { topic: 'grid' }),
        mc('Toate coloanele', 'Span all?', ['col-span-all', 'col-span-full', 'col-100', 'col-everything'], 'col-span-full', 'Specifică `full`.', { topic: 'grid' }),
        mc('Gap', 'Spațiu între celule?', ['cell-gap-4', 'gap-4', 'space-4', 'p-4'], 'gap-4', '`gap-N` standard.', { topic: 'grid' }),
        mc('Responsive grid', 'Desktop 4 coloane, mobile 2?', ['grid-cols-2 lg:grid-cols-4', 'grid-cols-4 lg:grid-cols-2', 'cols-2-4', 'auto'], 'grid-cols-2 lg:grid-cols-4', 'Mobile-first: bază mobile, override desktop.', { topic: 'grid' }),
        mc('Custom template', 'Sidebar 200px + content fluid?', ['grid-cols-2', 'grid-cols-[200px_1fr]', 'grid-cols-200/1', 'flex'], 'grid-cols-[200px_1fr]', 'Bracket pentru valori custom.', { topic: 'grid' }),
        mc('Row span', 'Ocupă 2 rânduri?', ['row-2', 'row-span-2', 'rspan-2', 'r-2'], 'row-span-2', '`row-span-N`.', { topic: 'grid' }),
        mc('grid-cols-1', 'Câte coloane?', ['1', '0', 'auto', '12'], '1', '`grid-cols-1` = 1 coloană.', { topic: 'grid' }),
        mc('Galerie responsive', 'Mai bun pentru galerie?', ['flex', 'grid', 'block', 'inline'], 'grid', 'Grid e ideal pentru galerii (rânduri uniforme).', { topic: 'grid' }),
      ],
    },

    // ==================== 10. GRID ADVANCED ====================
    {
      slug: 'tailwind-grid-advanced',
      title: '10. Grid avansat (placement, span)',
      isFree: false,
      theory: `# 🔲 Grid avansat

## col-start și col-end

\`\`\`html
<div class="grid grid-cols-6 gap-4">
  <div class="col-start-2 col-end-5">Începe la 2, termină la 5</div>
</div>
\`\`\`

## Echivalent cu span

\`\`\`html
<div class="col-start-2 col-span-3">la fel</div>
\`\`\`

## Row placement

\`\`\`html
<div class="row-start-1 row-end-3">2 rânduri</div>
\`\`\`

## Auto rows

\`\`\`html
<div class="grid grid-cols-3 auto-rows-min">
  <!-- înălțimi minime -->
</div>

<div class="grid grid-cols-3 auto-rows-fr">
  <!-- înălțimi egale -->
</div>
\`\`\`

## Justify items / content

\`\`\`html
<div class="grid justify-items-center">conținut centrat în celule</div>
<div class="grid justify-center">grid-ul în sine centrat</div>
\`\`\`

## Place items (shorthand)

\`\`\`html
<div class="grid place-items-center">centrat orizontal+vertical</div>
\`\`\`

## ⭐ Centrare instant

\`\`\`html
<div class="grid place-items-center h-screen">
  <p>Perfect centrat</p>
</div>
\`\`\`

## Dense pack

\`\`\`html
<div class="grid grid-flow-dense">
  <!-- umple gap-uri automat -->
</div>
\`\`\`

## Pattern: layout aplicație

\`\`\`html
<div class="grid grid-cols-[200px_1fr] grid-rows-[60px_1fr] h-screen">
  <header class="col-span-2">Header</header>
  <aside>Sidebar</aside>
  <main>Content</main>
</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`col-start-\`, \`col-end-\`
- ✅ \`auto-rows-\`
- ✅ \`place-items-center\` pentru centrare instant
- ✅ Layout-uri complete cu grid
`,
      problems: [
        mc('Centrare instant', 'Care e cea mai scurtă?', ['flex justify-center items-center', 'grid place-items-center', 'm-auto', 'center'], 'grid place-items-center', '`place-items-center` în grid.', { topic: 'grid-adv' }),
        mc('col-start-2', 'Înseamnă?', ['Începe la coloana 2', 'A 2-a celulă', 'Span 2', '2 coloane'], 'Începe la coloana 2', 'Position absolută în grid.', { topic: 'grid-adv' }),
        sa('Auto rows fr', 'Înălțimi egale automat? (auto-rows-fr)', 'auto-rows-fr', '`fr` = fracție egală.', { topic: 'grid-adv' }),
        mc('Justify items', 'Centrarea CONȚINUTULUI fiecărei celule?', ['justify-items-center', 'justify-center', 'items-center', 'place-items-center'], 'justify-items-center', 'Pentru conținutul din celule.', { topic: 'grid-adv' }),
        mc('Justify content', 'Centrarea ÎNSĂȘI a grid-ului?', ['justify-items', 'justify-content', 'justify-center', 'place-content'], 'justify-center', 'Pentru tot grid-ul.', { topic: 'grid-adv' }),
        mc('Dense pack', 'Umple gap-uri automat?', ['auto-fill', 'grid-flow-dense', 'pack', 'compact'], 'grid-flow-dense', 'Algoritm dense.', { topic: 'grid-adv' }),
        mc('Header full', 'Header span toată lățimea?', ['col-span-full', 'full-width', 'col-all', 'w-full'], 'col-span-full', 'În grid, `col-span-full`.', { topic: 'grid-adv' }),
        mc('Custom rows', 'Înălțimi 60px + restul?', ['grid-rows-2', 'grid-rows-[60px_1fr]', 'rows-60', '60_auto'], 'grid-rows-[60px_1fr]', 'Bracket sintaxă.', { topic: 'grid-adv' }),
        mc('place-items', 'place-items-center face?', ['Doar orizontal', 'Doar vertical', 'Ambele', 'Niciuna'], 'Ambele', 'Combinație justify+items.', { topic: 'grid-adv' }),
        mc('Negative line', 'col-end-(-1) e?', ['Eroare', 'Ultima linie din dreapta', 'Prima linie', 'Mijloc'], 'Ultima linie din dreapta', 'Linii negative numără de la final.', { topic: 'grid-adv' }),
      ],
    },

    // ==================== 11. POSITION & Z-INDEX ====================
    {
      slug: 'tailwind-position',
      title: '11. Position și Z-index',
      isFree: false,
      theory: `# 📍 Position în Tailwind

## Position values

\`\`\`html
<div class="static">default — în flow normal</div>
<div class="relative">relativ — poate fi referință</div>
<div class="absolute">absolut — față de cel mai apropiat părinte relative</div>
<div class="fixed">fix față de viewport</div>
<div class="sticky">se "lipește" la scroll</div>
\`\`\`

## Top/Right/Bottom/Left

\`\`\`html
<div class="absolute top-0 left-0">colț stânga sus</div>
<div class="absolute top-4 right-4">stânga sus offset</div>
<div class="absolute bottom-0 left-0 right-0">jos pe toată lățimea</div>
\`\`\`

## Inset (shortcut)

\`\`\`html
<div class="absolute inset-0">top:0, right:0, bottom:0, left:0</div>
<div class="absolute inset-x-0">left:0, right:0</div>
<div class="absolute inset-y-0">top:0, bottom:0</div>
<div class="absolute inset-4">toate 16px</div>
\`\`\`

## Pattern: badge

\`\`\`html
<div class="relative">
  <img src="..." />
  <span class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2">3</span>
</div>
\`\`\`

## Pattern: overlay

\`\`\`html
<div class="relative">
  <img src="..." />
  <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
    <p class="text-white">Overlay</p>
  </div>
</div>
\`\`\`

## Sticky header

\`\`\`html
<header class="sticky top-0 bg-white shadow z-10">
  Header sticky
</header>
\`\`\`

## Z-index

\`\`\`html
<div class="z-0">z-index: 0</div>
<div class="z-10">10</div>
<div class="z-20">20</div>
<div class="z-30">30</div>
<div class="z-40">40</div>
<div class="z-50">50</div>
<div class="z-auto">auto</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`relative\`, \`absolute\`, \`fixed\`, \`sticky\`
- ✅ \`top-\`, \`bottom-\`, \`left-\`, \`right-\`, \`inset-\`
- ✅ \`z-{0..50}\` pentru stivuire
`,
      problems: [
        mc('Default position', 'Care e default?', ['static', 'relative', 'absolute', 'fixed'], 'static', '`static` e default.', { topic: 'position' }),
        mc('Sticky header', 'Cum faci?', ['fixed top-0', 'sticky top-0', 'absolute top-0', 'header'], 'sticky top-0', '`sticky` se lipește când ajungi la el.', { topic: 'position' }),
        sa('Inset 0', 'Top/right/bottom/left = 0? (inset-0)', 'inset-0', '`inset-0` = toate 0.', { topic: 'position' }),
        mc('Overlay full', 'Overlay peste tot?', ['absolute inset-0', 'fixed all', 'cover', 'overlay'], 'absolute inset-0', '`absolute` + `inset-0`.', { topic: 'position' }),
        mc('Z-index', 'Cea mai înaltă valoare standard?', ['z-50', 'z-100', 'z-max', 'z-top'], 'z-50', '0, 10, 20, 30, 40, 50.', { topic: 'position' }),
        mc('Părinte relative', 'Pentru ca absolute să se raporteze la părinte?', ['Părinte = absolute', 'Părinte = relative', 'Părinte = fixed', 'Nimic'], 'Părinte = relative', 'Pattern uzual.', { topic: 'position' }),
        mc('Badge', 'Badge cu offset negativ:', ['top-2 right-2', '-top-2 -right-2', 'top--2 right--2', 'offset-2'], '-top-2 -right-2', 'Negative cu prefix `-`.', { topic: 'position' }),
        mc('Fixed', 'Fixed se raportează la?', ['Părinte', 'Viewport', 'Document', 'Cel mai apropiat relative'], 'Viewport', '`fixed` = viewport.', { topic: 'position' }),
        mc('Sticky requires', 'Sticky are nevoie de?', ['z-index', 'top/bottom value', 'overflow', 'parent fixed'], 'top/bottom value', 'Trebuie poziție: `sticky top-0`.', { topic: 'position' }),
        mc('z-auto', 'z-auto?', ['Crash', 'z-index: auto (default browser)', '0', '50'], 'z-index: auto (default browser)', 'Reset la default.', { topic: 'position' }),
      ],
    },

    // ==================== 12. BORDERS ====================
    {
      slug: 'tailwind-borders',
      title: '12. Borders și Border Radius',
      isFree: false,
      theory: `# 🔲 Borders

## Activare border

\`\`\`html
<div class="border">1px gri</div>
<div class="border-2">2px</div>
<div class="border-4">4px</div>
<div class="border-8">8px</div>
\`\`\`

## Pe părți specifice

\`\`\`html
<div class="border-t">top</div>
<div class="border-r">right</div>
<div class="border-b">bottom</div>
<div class="border-l">left</div>
<div class="border-x">left + right</div>
<div class="border-y">top + bottom</div>
\`\`\`

## Culoare border

\`\`\`html
<div class="border border-red-500">roșu</div>
<div class="border border-blue-300">albastru deschis</div>
\`\`\`

## Stil

\`\`\`html
<div class="border border-solid">solid (default)</div>
<div class="border border-dashed">linie întreruptă</div>
<div class="border border-dotted">puncte</div>
<div class="border border-double">dublă</div>
<div class="border border-none">fără</div>
\`\`\`

## Border Radius

\`\`\`html
<div class="rounded-none">0</div>
<div class="rounded-sm">2px</div>
<div class="rounded">4px (default)</div>
<div class="rounded-md">6px</div>
<div class="rounded-lg">8px</div>
<div class="rounded-xl">12px</div>
<div class="rounded-2xl">16px</div>
<div class="rounded-3xl">24px</div>
<div class="rounded-full">cerc complet</div>
\`\`\`

## Radius pe colțuri

\`\`\`html
<div class="rounded-t-lg">colțuri sus</div>
<div class="rounded-b-lg">colțuri jos</div>
<div class="rounded-l-lg">colțuri stânga</div>
<div class="rounded-r-lg">colțuri dreapta</div>
<div class="rounded-tl-lg">top-left</div>
<div class="rounded-tr-lg">top-right</div>
<div class="rounded-bl-lg">bottom-left</div>
<div class="rounded-br-lg">bottom-right</div>
\`\`\`

## Avatar cerc

\`\`\`html
<img src="..." class="w-12 h-12 rounded-full" />
\`\`\`

## Divide (între copii)

\`\`\`html
<div class="divide-y">
  <div>1</div>
  <div>2</div>   <!-- linie deasupra -->
  <div>3</div>
</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`border\`, \`border-{n}\` lățime
- ✅ Pe părți: \`border-t/r/b/l\`
- ✅ \`rounded-{size}\` pentru radius
- ✅ \`rounded-full\` = cerc
`,
      problems: [
        mc('Border 1px', 'Default?', ['border-1', 'border', 'border-default', 'border-px'], 'border', '`border` = 1px.', { topic: 'borders' }),
        mc('Cerc', 'Cum?', ['rounded-circle', 'rounded-full', 'rounded-100', 'circle'], 'rounded-full', '`rounded-full` = 50%.', { topic: 'borders' }),
        sa('Border roșu 2px', 'Cum? (border-2 border-red-500)', 'border-2 border-red-500', 'Combinație: lățime + culoare.', { topic: 'borders' }),
        mc('Radius mediu', 'rounded-md = ?', ['4px', '6px', '8px', '12px'], '6px', 'md = 6px.', { topic: 'borders' }),
        mc('Doar top', 'Border doar sus?', ['border-top', 'border-t', 'b-top', 't-border'], 'border-t', 'Standard short.', { topic: 'borders' }),
        mc('Dashed', 'Linie întreruptă?', ['border-dashed', 'border-dot', 'border-line', 'dash'], 'border-dashed', 'Standard.', { topic: 'borders' }),
        mc('Radius colț TR', 'Top-right?', ['rounded-tr-lg', 'rounded-rt-lg', 'rounded-corner-tr', 'rt-lg'], 'rounded-tr-lg', '`tr` = top-right.', { topic: 'borders' }),
        mc('Divide', 'Linie între copii?', ['border-between', 'divide-y', 'between-y', 'split'], 'divide-y', '`divide-y` adaugă border între.', { topic: 'borders' }),
        mc('Border none', 'Fără border?', ['no-border', 'border-none', 'border-0', 'Ambele B și C'], 'Ambele B și C', 'Ambele dezactivează.', { topic: 'borders' }),
        mc('Avatar', 'Avatar 48px circular?', ['w-12 h-12 rounded-full', 'w-48 h-48 circle', 'w-12 h-12 round', 'avatar'], 'w-12 h-12 rounded-full', '12 × 4px = 48px + cerc.', { topic: 'borders' }),
      ],
    },

    // ==================== 13. SHADOWS ====================
    {
      slug: 'tailwind-shadows',
      title: '13. Shadows (umbre)',
      isFree: false,
      theory: `# 🌑 Shadows

## Box Shadow

\`\`\`html
<div class="shadow-sm">subtilă</div>
<div class="shadow">default</div>
<div class="shadow-md">medie</div>
<div class="shadow-lg">mare</div>
<div class="shadow-xl">XL</div>
<div class="shadow-2xl">foarte mare</div>
<div class="shadow-inner">interioară</div>
<div class="shadow-none">fără</div>
\`\`\`

## Culoare shadow (Tailwind 3+)

\`\`\`html
<div class="shadow-lg shadow-red-500/50">umbra roșie 50%</div>
<div class="shadow-xl shadow-blue-500/30">albastră 30%</div>
\`\`\`

## Drop shadow (filter)

\`\`\`html
<img class="drop-shadow-lg" />
<svg class="drop-shadow-md" />
\`\`\`

> 💡 \`drop-shadow\` urmează forma elementului (util la SVG/PNG transparent).

## Text shadow (în Tailwind 4)

În versiuni vechi: folosește \`text-shadow\` custom în \`globals.css\`.

## Card cu shadow

\`\`\`html
<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  Card cu hover
</div>
\`\`\`

## Combinare cu border

\`\`\`html
<div class="bg-white border border-gray-200 rounded-lg shadow-sm">
  Subtle UI
</div>
\`\`\`

## Inner shadow

\`\`\`html
<input class="shadow-inner bg-gray-50 px-3 py-2" />
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`shadow-{sm..2xl}\` pentru intensitate
- ✅ \`shadow-{color}/{opacity}\` pentru colored shadows
- ✅ \`drop-shadow\` pentru SVG/PNG
- ✅ Combinare cu \`hover:\` pentru efect dinamic
`,
      problems: [
        mc('Default shadow', 'Care?', ['shadow', 'shadow-default', 'sh', 'box-shadow'], 'shadow', '`shadow` = default md-ish.', { topic: 'shadows' }),
        mc('Cea mai mare', 'Care e cea mai mare?', ['shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-max'], 'shadow-2xl', 'Standard scale: sm, md, lg, xl, 2xl.', { topic: 'shadows' }),
        sa('Fără shadow', 'Cum? (shadow-none)', 'shadow-none', 'Reset.', { topic: 'shadows' }),
        mc('Drop shadow', 'Pentru SVG transparent?', ['shadow-lg', 'drop-shadow-lg', 'svg-shadow', 'filter-shadow'], 'drop-shadow-lg', 'Filter, urmează forma.', { topic: 'shadows' }),
        mc('Inner', 'Umbră interioară?', ['shadow-in', 'shadow-inset', 'shadow-inner', 'inner-shadow'], 'shadow-inner', 'Standard.', { topic: 'shadows' }),
        mc('Colored shadow', 'Roșie 50%?', ['shadow-red-500-50', 'shadow-red-500/50', 'shadow-red/50', 'red-shadow-50'], 'shadow-red-500/50', 'Sintaxa cu `/`.', { topic: 'shadows' }),
        mc('Hover effect', 'Hover crește shadow?', ['shadow-lg hover:shadow-xl', 'hover-shadow', 'shadow:hover-xl', 'on-hover'], 'shadow-lg hover:shadow-xl', 'Pattern uzual.', { topic: 'shadows' }),
        mc('Card', 'Pentru cards moderne?', ['shadow-md', 'border', 'background', 'Toate'], 'shadow-md', 'Shadow dă elevation.', { topic: 'shadows' }),
        mc('Smooth transition', 'Pentru shadow change smooth?', ['transition', 'transition-shadow', 'animate', 'smooth'], 'transition-shadow', 'Tranziție specifică shadow.', { topic: 'shadows' }),
        mc('Sm vs lg', 'Mai subtil?', ['sm', 'lg', 'xl', '2xl'], 'sm', 'sm = small/subtle.', { topic: 'shadows' }),
      ],
    },

    // ==================== 14. HOVER FOCUS ACTIVE ====================
    {
      slug: 'tailwind-states',
      title: '14. Hover, Focus, Active states',
      isFree: false,
      theory: `# 🎬 Pseudo-classes (states)

## Sintaxa: prefix \`state:\`

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700">
  Hover schimbă culoarea
</button>
\`\`\`

## States principale

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-900">
  hover + active
</button>

<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

<button class="opacity-100 disabled:opacity-50">
  Buton
</button>
\`\`\`

## Focus visible (doar la tab)

\`\`\`html
<button class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
  Doar la tab arată ring
</button>
\`\`\`

## Group hover

\`\`\`html
<div class="group">
  <h3 class="group-hover:text-blue-500">Titlu</h3>
  <p>Hover pe părinte schimbă titlu</p>
</div>
\`\`\`

## Peer (pentru frați)

\`\`\`html
<input type="checkbox" class="peer" />
<label class="peer-checked:text-green-500">
  Schimbă culoare când e bifat
</label>
\`\`\`

## Combinări

\`\`\`html
<button class="text-gray-700 hover:text-blue-500 focus:text-blue-700 active:text-blue-900 disabled:text-gray-400">
  Multiple states
</button>
\`\`\`

## States comune

| Prefix | Înseamnă |
|---|---|
| \`hover:\` | Mouse deasupra |
| \`focus:\` | Element are focus |
| \`active:\` | Click apăsat |
| \`disabled:\` | Atribut disabled |
| \`checked:\` | Checkbox/radio bifat |
| \`focus-visible:\` | Focus prin keyboard |
| \`focus-within:\` | Copil are focus |
| \`first:\` | Primul copil |
| \`last:\` | Ultimul copil |
| \`odd:\` | Index impar |
| \`even:\` | Index par |

## 🎓 Ce ai învățat
- ✅ \`hover:\`, \`focus:\`, \`active:\`, \`disabled:\`
- ✅ \`group\` + \`group-hover:\`
- ✅ \`peer\` + \`peer-checked:\`
- ✅ \`focus-visible:\` pentru a11y
`,
      problems: [
        mc('Hover bg', 'Cum schimbi bg la hover?', ['hover-bg-red', 'hover:bg-red-500', 'on-hover bg', 'bg:hover-red'], 'hover:bg-red-500', 'Prefix `hover:`.', { topic: 'states' }),
        mc('Focus ring', 'Ring 2px albastru la focus?', ['focus:ring-2 focus:ring-blue-500', 'focus-ring', 'ring-blue', 'focus:outline-blue'], 'focus:ring-2 focus:ring-blue-500', 'Combinație ring + culoare.', { topic: 'states' }),
        sa('Disabled opacity', 'Cum opacity 50% când disabled? (disabled:opacity-50)', 'disabled:opacity-50', 'Prefix `disabled:`.', { topic: 'states' }),
        mc('Group hover', 'Pentru a reacționa la hover pe părinte?', ['group + group-hover:', 'parent-hover', 'inherit-hover', 'global-hover'], 'group + group-hover:', 'Setezi `group` pe părinte.', { topic: 'states' }),
        mc('Peer', 'Pentru fraţi?', ['peer + peer-state:', 'sibling', 'next-state', 'frate'], 'peer + peer-state:', '`peer` pe frate, `peer-checked:` etc pe alt frate.', { topic: 'states' }),
        mc('Focus visible', 'Focus doar prin tab?', ['focus:', 'focus-visible:', 'tab-focus:', 'kb-focus:'], 'focus-visible:', 'A11y: nu apare la click.', { topic: 'states' }),
        mc('Active', 'Când buton e apăsat?', ['hover:', 'active:', 'pressed:', 'down:'], 'active:', '`active:` pentru :active.', { topic: 'states' }),
        mc('Checked', 'Când checkbox e bifat?', ['active:', 'checked:', 'on:', 'selected:'], 'checked:', '`checked:` pentru :checked.', { topic: 'states' }),
        mc('First child', 'Primul copil?', ['first:', 'first-child:', 'index-0:', '0:'], 'first:', 'Tailwind prescurtat.', { topic: 'states' }),
        mc('Even rows', 'Rânduri pare?', ['odd:', 'even:', 'pair:', 'row-even:'], 'even:', 'Pentru zebra striping.', { topic: 'states' }),
      ],
    },

    // ==================== 15. TRANSITIONS ====================
    {
      slug: 'tailwind-transitions',
      title: '15. Transitions și Animations',
      isFree: false,
      theory: `# ✨ Transitions și Animations

## Transition base

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 transition">
  Tranziție smooth
</button>
\`\`\`

## Ce proprietăți

\`\`\`html
<button class="transition-all">tot</button>
<button class="transition-colors">doar culori</button>
<button class="transition-opacity">doar opacity</button>
<button class="transition-shadow">doar shadow</button>
<button class="transition-transform">doar transform</button>
<button class="transition-none">fără</button>
\`\`\`

## Durată

\`\`\`html
<div class="duration-75">75ms</div>
<div class="duration-100">100ms</div>
<div class="duration-150">150ms (default)</div>
<div class="duration-200">200ms</div>
<div class="duration-300">300ms</div>
<div class="duration-500">500ms</div>
<div class="duration-700">700ms</div>
<div class="duration-1000">1s</div>
\`\`\`

## Easing

\`\`\`html
<div class="ease-linear">liniar</div>
<div class="ease-in">accelerează</div>
<div class="ease-out">decelerează</div>
<div class="ease-in-out">ambele (default)</div>
\`\`\`

## Delay

\`\`\`html
<div class="delay-200">200ms delay</div>
\`\`\`

## Animations built-in

\`\`\`html
<div class="animate-spin">rotire (loading)</div>
<div class="animate-ping">puls</div>
<div class="animate-pulse">opacity oscilație</div>
<div class="animate-bounce">săltăreț</div>
<div class="animate-none">stop</div>
\`\`\`

## Exemple

### Loading spinner
\`\`\`html
<svg class="animate-spin h-5 w-5 text-blue-500">...</svg>
\`\`\`

### Skeleton
\`\`\`html
<div class="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
\`\`\`

### Buton elegant
\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 hover:scale-105 transition-all duration-300">
  Elegant
</button>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`transition\` activează tranziția
- ✅ \`duration-{ms}\` lungime
- ✅ \`ease-\` curba
- ✅ \`animate-{spin|ping|pulse|bounce}\` ready-made
`,
      problems: [
        mc('Activare transition', 'Cum?', ['anim', 'transition', 'tween', 'smooth'], 'transition', '`transition` activează.', { topic: 'transitions' }),
        mc('300ms', 'Cum?', ['duration-300', 'time-300', 'delay-300', 'speed-300'], 'duration-300', '`duration-{ms}`.', { topic: 'transitions' }),
        sa('Spin animation', 'Pentru loading spinner? (animate-spin)', 'animate-spin', 'Built-in.', { topic: 'transitions' }),
        mc('Pulse', 'Pentru skeleton loading?', ['animate-pulse', 'animate-blink', 'fade', 'pulse'], 'animate-pulse', 'Standard.', { topic: 'transitions' }),
        mc('Doar culori', 'Tranziție doar pentru culori?', ['transition', 'transition-colors', 'transition-bg', 'colors-transition'], 'transition-colors', 'Mai eficient decât `all`.', { topic: 'transitions' }),
        mc('Easing', 'Default easing Tailwind?', ['linear', 'ease-in', 'ease-in-out', 'ease-out'], 'ease-in-out', 'Default e ease-in-out.', { topic: 'transitions' }),
        mc('Bounce', 'animate-bounce?', ['Sare în sus-jos', 'Roate', 'Pulsează', 'Fade'], 'Sare în sus-jos', 'Vizibil ca o săritură.', { topic: 'transitions' }),
        mc('Delay', '500ms delay?', ['delay-500', 'wait-500', 'pause-500', 'timeout-500'], 'delay-500', '`delay-{ms}`.', { topic: 'transitions' }),
        mc('Hover scale', 'Mărire 5% la hover?', ['hover:scale-105', 'hover:size-105', 'hover:big', 'hover:zoom'], 'hover:scale-105', 'Combinație cu transform.', { topic: 'transitions' }),
        mc('Stop animation', 'Cum oprești?', ['animate-stop', 'animate-none', 'no-anim', 'pause'], 'animate-none', 'Reset.', { topic: 'transitions' }),
      ],
    },

    // ==================== 16. TRANSFORM ====================
    {
      slug: 'tailwind-transform',
      title: '16. Transform (scale, rotate, translate)',
      isFree: false,
      theory: `# 🔄 Transform

## Scale

\`\`\`html
<div class="scale-50">50%</div>
<div class="scale-75">75%</div>
<div class="scale-100">100% (default)</div>
<div class="scale-110">110%</div>
<div class="scale-125">125%</div>
<div class="scale-150">150%</div>

<div class="scale-x-50">doar X</div>
<div class="scale-y-50">doar Y</div>
\`\`\`

## Rotate

\`\`\`html
<div class="rotate-45">45°</div>
<div class="rotate-90">90°</div>
<div class="rotate-180">180°</div>
<div class="-rotate-45">-45°</div>
\`\`\`

## Translate

\`\`\`html
<div class="translate-x-4">+16px X</div>
<div class="translate-y-2">+8px Y</div>
<div class="-translate-x-4">-16px X</div>

<div class="translate-x-1/2">+50% X</div>
<div class="-translate-x-1/2 -translate-y-1/2">centrare absolută</div>
\`\`\`

## Skew

\`\`\`html
<div class="skew-x-12">înclinat orizontal</div>
<div class="skew-y-6">înclinat vertical</div>
\`\`\`

## Origin (centru transformare)

\`\`\`html
<div class="origin-center">centru (default)</div>
<div class="origin-top-left">colț stânga sus</div>
<div class="origin-bottom">jos</div>
\`\`\`

## Combinări (multiple transforms)

\`\`\`html
<div class="rotate-45 scale-110 translate-x-4">
  Rotire + scale + translate
</div>
\`\`\`

## ⭐ Centrare absolută cu transform

\`\`\`html
<div class="relative h-screen">
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    Perfect centrat
  </div>
</div>
\`\`\`

## Hover transform

\`\`\`html
<button class="hover:scale-105 transition-transform duration-200">
  Crește la hover
</button>

<img class="hover:rotate-3 transition-transform" />
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`scale-{n}\`, \`rotate-{n}\`, \`translate-{xy}-{n}\`
- ✅ Negative cu prefix \`-\`
- ✅ Combinare multiple transforms
- ✅ Centrare cu \`-translate-{xy}-1/2\`
`,
      problems: [
        mc('Scale 110%', 'Cum?', ['scale-110', 'size-110', 'big-110', 'zoom-1.1'], 'scale-110', '`scale-{n}` unde n este procent.', { topic: 'transform' }),
        mc('Rotate 45', 'Cum?', ['rot-45', 'rotate-45', 'angle-45', 'r-45'], 'rotate-45', 'Standard.', { topic: 'transform' }),
        sa('Negative rotate', 'Rotire -45°? (-rotate-45)', '-rotate-45', 'Prefix `-`.', { topic: 'transform' }),
        mc('Translate X', '+16px X?', ['x-4', 'translate-x-4', 'mx-4', 'tx-4'], 'translate-x-4', 'Standard.', { topic: 'transform' }),
        mc('Centrare absolută', 'Top/left 50% + translate?', ['top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', 'place-center', 'center', 'm-auto'], 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', 'Pattern clasic.', { topic: 'transform' }),
        mc('Skew', 'Înclinat orizontal 12°?', ['rotate-12', 'skew-12', 'skew-x-12', 'tilt-12'], 'skew-x-12', '`skew-x-{n}`.', { topic: 'transform' }),
        mc('Origin TL', 'Origin top-left?', ['origin-top-left', 'origin-tl', 'tl-origin', 'origin-corner'], 'origin-top-left', 'Standard.', { topic: 'transform' }),
        mc('Combinare', 'Pot combina mai multe transform-uri?', ['Doar 1', 'Da, oricâte', 'Maxim 2', 'Doar scale + rotate'], 'Da, oricâte', 'Tailwind le combină automat.', { topic: 'transform' }),
        mc('Hover smooth', 'Pentru transform smooth la hover?', ['transition', 'transition-transform', 'animate', 'smooth'], 'transition-transform', 'Mai eficient decât `all`.', { topic: 'transform' }),
        mc('Translate %', '+50% Y?', ['translate-y-50', 'translate-y-1/2', 'y-half', 'mt-1/2'], 'translate-y-1/2', 'Fracții suportate.', { topic: 'transform' }),
      ],
    },

    // ==================== 17. RESPONSIVE ====================
    {
      slug: 'tailwind-responsive',
      title: '17. Responsive Design (sm, md, lg)',
      isFree: false,
      theory: `# 📱 Responsive în Tailwind

## Breakpoints

| Prefix | Min width | Device |
|---|---|---|
| (none) | 0+ | Mobile |
| \`sm:\` | 640px+ | Telefon mare |
| \`md:\` | 768px+ | Tabletă |
| \`lg:\` | 1024px+ | Laptop |
| \`xl:\` | 1280px+ | Desktop |
| \`2xl:\` | 1536px+ | TV mare |

## Sintaxa

\`\`\`html
<div class="text-base md:text-lg lg:text-xl">
  Mobile small, tabletă mai mare, desktop mai mare
</div>
\`\`\`

## Mobile-First!

⚠️ Tailwind e **mobile-first**: clasa fără prefix = TOATE.
Prefixele se aplică **începând cu** acel breakpoint.

\`\`\`html
<!-- ❌ greșit (gândire desktop-first) -->
<div class="lg:p-4 md:p-2 sm:p-1">

<!-- ✅ corect (mobile-first) -->
<div class="p-1 md:p-2 lg:p-4">
\`\`\`

## Exemple comune

### Grid responsive
\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  ...
</div>
\`\`\`

### Hide on mobile
\`\`\`html
<div class="hidden md:block">Desktop only</div>
<div class="md:hidden">Mobile only</div>
\`\`\`

### Sidebar responsive
\`\`\`html
<aside class="hidden lg:block">Sidebar pe lg+</aside>
\`\`\`

### Text size
\`\`\`html
<h1 class="text-2xl md:text-4xl lg:text-6xl">
  Titlu adaptiv
</h1>
\`\`\`

### Padding scalat
\`\`\`html
<section class="p-4 md:p-8 lg:p-16">
  ...
</section>
\`\`\`

### Direcție flex
\`\`\`html
<div class="flex flex-col md:flex-row gap-4">
  Mobile: vertical, Desktop: orizontal
</div>
\`\`\`

## Range (combinat cu max-)

\`\`\`html
<div class="md:max-lg:bg-red-500">Doar între md și lg</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ Breakpoints: sm/md/lg/xl/2xl
- ✅ **Mobile-first** — bază mobile, adaugă pentru mai mare
- ✅ \`hidden md:block\` pentru desktop-only
- ✅ Combinație clase pe niveluri
`,
      problems: [
        mc('md:', 'Înseamnă min-width...', ['480px', '640px', '768px', '1024px'], '768px', 'md = 768px (tabletă).', { topic: 'responsive' }),
        mc('Mobile-first', 'Tailwind e...', ['Desktop-first', 'Mobile-first', 'Tablet-first', 'Random'], 'Mobile-first', 'Bază = mobile, prefix = mai mare.', { topic: 'responsive' }),
        sa('Hide pe mobile', 'Cum ascunzi sub md? (hidden md:block)', 'hidden md:block', 'Pattern uzual.', { topic: 'responsive' }),
        mc('lg:', 'Min-width pentru lg?', ['768px', '1024px', '1280px', '1536px'], '1024px', 'lg = laptop.', { topic: 'responsive' }),
        mc('Grid responsive', 'Mobile 1 col, desktop 3?', ['grid-cols-1 lg:grid-cols-3', 'grid-cols-3 lg:grid-cols-1', 'grid-cols-mobile', 'auto'], 'grid-cols-1 lg:grid-cols-3', 'Mobile-first.', { topic: 'responsive' }),
        mc('Padding adaptiv', 'p-4 pe mobile, p-8 pe desktop?', ['p-4 md:p-8', 'p-8 md:p-4', 'p-mobile-4 desktop-8', 'p-4-8'], 'p-4 md:p-8', 'Mai mare pe ecrane mai mari.', { topic: 'responsive' }),
        mc('Flex direction switch', 'Coloană pe mobile, rând pe desktop?', ['flex-col md:flex-row', 'flex-row md:flex-col', 'flex-switch', 'auto'], 'flex-col md:flex-row', 'Pattern uzual.', { topic: 'responsive' }),
        mc('Cel mai mare', 'Cel mai mare breakpoint default?', ['xl', '2xl', '3xl', 'lg'], '2xl', '2xl = 1536px+.', { topic: 'responsive' }),
        mc('No prefix', 'Clasa `p-4` se aplică pe...', ['Doar mobile', 'Toate', 'Doar desktop', 'Doar tabletă'], 'Toate', 'Fără prefix = bază pentru toate.', { topic: 'responsive' }),
        mc('Mobile only', 'Vizibil doar pe mobile?', ['mobile:block', 'block md:hidden', 'sm:hidden', 'show-mobile'], 'block md:hidden', 'Vizibil bază, ascuns pe md+.', { topic: 'responsive' }),
      ],
    },

    // ==================== 18. MOBILE FIRST ====================
    {
      slug: 'tailwind-mobile-first',
      title: '18. Mobile-First în detaliu',
      isFree: false,
      theory: `# 📲 Mobile-First Approach

## Filosofia

> Începe cu **mobile** și adaugă rules pentru ecrane MAI MARI.

## De ce?

- 📱 Majoritatea utilizatorilor sunt pe mobile
- 🚀 Mai puțin CSS pe mobile (rapid)
- 🎨 Design progresiv enhancement

## Pattern: Layout

\`\`\`html
<!-- Container -->
<div class="container mx-auto px-4 md:px-8">
  <!-- Card grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    ...
  </div>
</div>
\`\`\`

## Pattern: Header

\`\`\`html
<header class="flex items-center justify-between p-4 md:p-6">
  <div class="text-xl md:text-2xl font-bold">Logo</div>

  <!-- Mobile: hamburger -->
  <button class="md:hidden">
    <Menu />
  </button>

  <!-- Desktop: nav -->
  <nav class="hidden md:flex gap-6">
    <a>Acasă</a>
    <a>Despre</a>
    <a>Contact</a>
  </nav>
</header>
\`\`\`

## Pattern: Sidebar collapsibilă

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
  <aside class="md:block hidden">Sidebar</aside>
  <main>Conținut</main>
</div>
\`\`\`

## Pattern: text scalat

\`\`\`html
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
  Titlu Hero
</h1>

<p class="text-base md:text-lg text-gray-600">
  Subtitlu adaptat
</p>
\`\`\`

## Pattern: imagini responsive

\`\`\`html
<img class="w-full h-48 md:h-64 lg:h-96 object-cover" />
\`\`\`

## ⚠️ Greșeli frecvente

❌ \`lg:p-4 md:p-2\` — desktop-first gandire
✅ \`p-2 md:p-4 lg:p-8\` — mobile-first

❌ \`hidden lg:block md:hidden\` — confuz
✅ \`hidden md:block\` — clar

## 🎓 Ce ai învățat
- ✅ Mobile = bază, breakpoints = upgrade
- ✅ Hamburger pe mobile, nav inline pe desktop
- ✅ Text și spacing scale pe ecrane mai mari
`,
      problems: [
        mc('De ce mobile-first?', 'Avantaj?', ['Mai mult CSS', 'Mai puțin CSS pe mobile + progresiv', 'Mai greu', 'Estetic'], 'Mai puțin CSS pe mobile + progresiv', 'Important pentru perf.', { topic: 'mobile-first' }),
        mc('Hamburger mobile', 'Vizibil doar pe mobile?', ['hidden md:block', 'block md:hidden', 'mobile-only', 'hidden lg'], 'block md:hidden', 'Bază vizibil, ascuns md+.', { topic: 'mobile-first' }),
        sa('Container', 'Centrare cu padding adaptiv? (container mx-auto px-4)', 'container mx-auto px-4', 'Pattern standard.', { topic: 'mobile-first' }),
        mc('Title scaled', 'Mai bun?', ['text-6xl text-3xl', 'text-3xl md:text-6xl', 'text-6xl md:text-3xl', 'text-large'], 'text-3xl md:text-6xl', 'Mobile-first: bază mică.', { topic: 'mobile-first' }),
        mc('Greșeală desktop-first', 'Anti-pattern?', ['p-2 md:p-4', 'lg:p-2 md:p-4 p-8', 'p-4 lg:p-8', 'gap-4'], 'lg:p-2 md:p-4 p-8', 'Cobori — gândire greșită.', { topic: 'mobile-first' }),
        mc('Sidebar', 'Sidebar afișat doar pe lg+?', ['hidden lg:block', 'lg:block hidden', 'show-lg', 'lg-only'], 'hidden lg:block', 'Bază hidden, lg+ block.', { topic: 'mobile-first' }),
        mc('1 → 4 columns', 'Grid 1→2→4 pe sm/lg?', ['grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', 'grid-cols-4 lg:grid-cols-1', 'auto', 'grid-1-4'], 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', 'Mobile-first sequence.', { topic: 'mobile-first' }),
        mc('Image height', 'Imagine 200px mobile, 400px desktop?', ['h-48 lg:h-96', 'h-96 lg:h-48', 'h-200-400', 'h-mobile'], 'h-48 lg:h-96', '48 = 192px (~200), 96 = 384px (~400).', { topic: 'mobile-first' }),
        mc('Touch targets', 'Pe mobile, butoanele trebuie...', ['Mai mici', 'Mai mari (min 44px)', 'La fel', 'Niciuna'], 'Mai mari (min 44px)', 'Touch targets recomandate min 44x44px.', { topic: 'mobile-first' }),
        mc('px-4 md:px-8', 'Înseamnă?', ['Ambele 4', 'Mobile 4, desktop 8', 'Doar desktop 8', 'Random'], 'Mobile 4, desktop 8', 'Mobile = bază, md = scale up.', { topic: 'mobile-first' }),
      ],
    },

    // ==================== 19. DARK MODE ====================
    {
      slug: 'tailwind-dark-mode',
      title: '19. Dark Mode',
      isFree: false,
      theory: `# 🌙 Dark Mode în Tailwind

## Activare în config

\`\`\`js
// tailwind.config.js
module.exports = {
  darkMode: 'class',   // sau 'media'
  ...
}
\`\`\`

- \`'media'\` — folosește \`prefers-color-scheme\` (sistemul OS)
- \`'class'\` — manual prin clasa \`dark\` pe \`<html>\`

## Sintaxa

\`\`\`html
<div class="bg-white text-black dark:bg-gray-900 dark:text-white">
  Light → Dark
</div>
\`\`\`

## Toggle JavaScript

\`\`\`js
function toggleDark() {
  document.documentElement.classList.toggle('dark');
}
\`\`\`

## Persistă cu localStorage

\`\`\`js
// La pornire:
if (localStorage.theme === 'dark') {
  document.documentElement.classList.add('dark');
}

// La toggle:
function toggle() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.theme = isDark ? 'dark' : 'light';
}
\`\`\`

## Pattern card dark-aware

\`\`\`html
<div class="
  bg-white text-gray-900 border-gray-200
  dark:bg-gray-800 dark:text-white dark:border-gray-700
  p-6 rounded-lg border
">
  Card adaptiv
</div>
\`\`\`

## Combinare cu states

\`\`\`html
<button class="
  bg-blue-500 hover:bg-blue-700 text-white
  dark:bg-blue-700 dark:hover:bg-blue-900
">
  Buton
</button>
\`\`\`

## Inversiune subtilă

\`\`\`
Light             Dark
gray-50      ↔    gray-900
gray-100     ↔    gray-800
gray-200     ↔    gray-700
gray-700     ↔    gray-200
gray-900     ↔    gray-50
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`darkMode: 'class'\` în config
- ✅ Prefix \`dark:\` pe orice clasă
- ✅ Toggle prin \`classList.toggle('dark')\`
- ✅ Persistă cu localStorage
`,
      problems: [
        mc('Activare dark', 'Sintaxa pe element?', ['theme:dark', 'dark:bg-gray-900', 'mode-dark', 'night:'], 'dark:bg-gray-900', 'Prefix `dark:`.', { topic: 'dark' }),
        mc('Config', 'Pentru control manual?', ['darkMode: "media"', 'darkMode: "class"', 'darkMode: "manual"', 'darkMode: true'], 'darkMode: "class"', '`class` = manual prin classList.', { topic: 'dark' }),
        sa('Toggle JS', 'Toggle clasa dark? (document.documentElement.classList.toggle("dark"))', 'document.documentElement.classList.toggle("dark")', 'Pe `<html>`.', { topic: 'dark' }),
        mc('Persist', 'Cum salvezi alegerea?', ['localStorage', 'cookies', 'memorie', 'URL'], 'localStorage', 'Persistent în browser.', { topic: 'dark' }),
        mc('Media vs class', 'Diferența?', ['Identice', 'media = OS, class = manual', 'media e nou', 'class e nou'], 'media = OS, class = manual', 'Media folosește prefers-color-scheme.', { topic: 'dark' }),
        mc('Dark text', 'Light text negru, dark text alb?', ['text-black dark:text-white', 'text-auto', 'text-theme', 'inverse'], 'text-black dark:text-white', 'Combinație.', { topic: 'dark' }),
        mc('Dark bg', 'Pentru fundal dark?', ['bg-black', 'dark:bg-gray-900', 'bg-night', 'dark-bg'], 'dark:bg-gray-900', 'Standard pentru dark mode.', { topic: 'dark' }),
        mc('Border dark', 'Border vizibil în dark?', ['border-black', 'border-gray-700 dark:border-gray-300', 'border + dark:border', 'auto'], 'border + dark:border', 'Inversezi nuanțele.', { topic: 'dark' }),
        mc('Inversiune', 'gray-100 ↔ ?', ['gray-100', 'gray-200', 'gray-800', 'gray-900'], 'gray-800', 'Numerele se inversează (100↔800).', { topic: 'dark' }),
        mc('Hover dark', 'Hover diferit în dark?', ['hover:bg-blue + dark:hover:bg-X', 'doar hover', 'imposibil', 'hover-dark'], 'hover:bg-blue + dark:hover:bg-X', 'Combini prefixele.', { topic: 'dark' }),
      ],
    },

    // ==================== 20. CONFIG ====================
    {
      slug: 'tailwind-config',
      title: '20. Custom config (tailwind.config.js)',
      isFree: false,
      theory: `# ⚙️ tailwind.config.js

## Structura

\`\`\`js
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // adaugă fără a pierde defaults
    },
  },
  plugins: [],
};
\`\`\`

## extend vs override

\`\`\`js
theme: {
  colors: { ... }       // ❌ ÎNLOCUIEȘTE toate culorile
}

theme: {
  extend: {
    colors: { ... }      // ✅ ADAUGĂ noi culori
  }
}
\`\`\`

## Culori custom

\`\`\`js
extend: {
  colors: {
    brand: '#FF5733',
    'brand-dark': '#C13E1F',
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
  },
}
\`\`\`

Folosire:
\`\`\`html
<div class="bg-brand text-primary-500">...</div>
\`\`\`

## Spacing custom

\`\`\`js
extend: {
  spacing: {
    '18': '4.5rem',
    'huge': '20rem',
  },
}
\`\`\`

\`\`\`html
<div class="p-18 mt-huge">...</div>
\`\`\`

## Font family custom

\`\`\`js
extend: {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    display: ['"Playfair Display"', 'serif'],
  },
}
\`\`\`

\`\`\`html
<h1 class="font-display">Titlu elegant</h1>
\`\`\`

## Breakpoints custom

\`\`\`js
extend: {
  screens: {
    '3xl': '1920px',
    'phone': { max: '480px' },
  },
}
\`\`\`

## Border radius custom

\`\`\`js
extend: {
  borderRadius: {
    'xl-plus': '1rem',
    '4xl': '2rem',
  },
}
\`\`\`

## CSS Variables (Tailwind 3+)

\`\`\`js
extend: {
  colors: {
    primary: 'var(--color-primary)',
  },
}
\`\`\`

\`\`\`css
:root { --color-primary: #3b82f6; }
.dark { --color-primary: #60a5fa; }
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`extend\` păstrează defaults
- ✅ \`colors\`, \`spacing\`, \`fontFamily\`, \`screens\`
- ✅ CSS variables pentru theming dinamic
`,
      problems: [
        mc('extend vs override', 'Pentru a adăuga fără a pierde?', ['theme.colors', 'theme.extend.colors', 'theme.add.colors', 'theme.merge'], 'theme.extend.colors', '`extend` păstrează defaults.', { topic: 'config' }),
        mc('Content', '`content` declară?', ['Stiluri', 'Plugin-uri', 'Unde caută clase', 'Themes'], 'Unde caută clase', 'Pentru purge.', { topic: 'config' }),
        sa('Brand color', 'Culoare custom "brand"? (folosire: bg-brand)', 'bg-brand', 'După ce o definești în config.', { topic: 'config' }),
        mc('Font display', 'Folosire font custom "display"?', ['font-display', 'family-display', 'fd', 'display-font'], 'font-display', 'După `fontFamily.display`.', { topic: 'config' }),
        mc('CSS variables', 'Pentru theming dinamic?', ['colors.var', 'CSS variables', 'plugins', 'config'], 'CSS variables', 'Lichid + dark.', { topic: 'config' }),
        mc('Spacing custom', 'Spacing 4.5rem la "18"?', ['extend.spacing.18', 'extend.padding.18', 'spacing[18]', 'theme.18'], 'extend.spacing.18', 'Adaugi în extend.spacing.', { topic: 'config' }),
        mc('Plugin', '`plugins:` e pentru?', ['Pagini', 'Adaugă funcționalități extra', 'Themes', 'Stiluri'], 'Adaugă funcționalități extra', 'Forms, typography, etc.', { topic: 'config' }),
        mc('Default Tailwind', 'Default folosește?', ['root colors only', 'palete complete', 'doar gri', 'roșu/albastru'], 'palete complete', 'Vine cu palete pentru toate culorile.', { topic: 'config' }),
        mc('Folosire brand', 'După ce definești "brand", folosirea?', ['bg-brand', 'brand-bg', 'background.brand', 'use(brand)'], 'bg-brand', 'Tailwind generează utilities.', { topic: 'config' }),
        mc('Override fără defaults', 'Dacă scrii direct theme.colors?', ['Adaugă', 'Pierzi toate defaults', 'Crash', 'Niciun efect'], 'Pierzi toate defaults', 'Trebuie extend pentru păstrare.', { topic: 'config' }),
      ],
    },

    // ==================== 21. APPLY COMPONENTS ====================
    {
      slug: 'tailwind-apply',
      title: '21. @apply și componentizare',
      isFree: false,
      theory: `# 🧩 @apply — extragere clase

## Problema

Clase repetate peste tot:
\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">A</button>
<button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">B</button>
\`\`\`

## Soluția 1: @apply în CSS

\`\`\`css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded;
  }
}
\`\`\`

\`\`\`html
<button class="btn-primary">A</button>
<button class="btn-primary">B</button>
\`\`\`

## Soluția 2: Componente (RECOMANDAT)

În React/Vue:

\`\`\`jsx
function ButonPrimary({ children, ...props }) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
      {...props}
    >
      {children}
    </button>
  );
}

// Folosire:
<ButonPrimary>Click</ButonPrimary>
\`\`\`

## ⚠️ Când să folosești @apply?

✅ Dacă nu folosești React/Vue (vanilla HTML)
✅ Pentru clase CSS care vin din content (ex: Markdown)
❌ Anti-pattern dacă ai componente — diluați filosofia utility-first

## Layers

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn { @apply ... }
}

@layer utilities {
  .text-shadow { text-shadow: 1px 1px black; }
}
\`\`\`

> 💡 \`@layer\` decide prioritatea și ce poate fi purge-uit.

## Custom utilities

\`\`\`css
@layer utilities {
  .text-balance { text-wrap: balance; }
}
\`\`\`

## clsx / cn pentru combinare condițională

\`\`\`jsx
import clsx from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded',
  primary ? 'bg-blue-500' : 'bg-gray-500',
  disabled && 'opacity-50'
)}>...</button>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`@apply\` extrage clase în CSS
- ✅ \`@layer\` pentru organizare
- ✅ Componentele React sunt **mai bune** decât @apply
- ✅ \`clsx\` pentru clase condiționale
`,
      problems: [
        mc('@apply', 'Ce face?', ['Aplică clasele Tailwind în CSS custom', 'Plugin', 'Animație', 'Fetch'], 'Aplică clasele Tailwind în CSS custom', 'Extrage utilități în clase proprii.', { topic: 'apply' }),
        mc('Mai bună soluție', 'În React, mai bună?', ['@apply', 'Componentă', 'CSS modules', 'Inline'], 'Componentă', 'Componenta = soluția idiomatic.', { topic: 'apply' }),
        sa('Layer components', 'Layer pentru @apply? (@layer components)', '@layer components', 'În layer components.', { topic: 'apply' }),
        mc('clsx', 'Pentru ce?', ['Animații', 'Clase condiționale', 'Routing', 'Forms'], 'Clase condiționale', 'Combină clase după condiții.', { topic: 'apply' }),
        mc('@layer utilities', 'Pentru?', ['Componente', 'Utility custom', 'Plugin', 'CSS'], 'Utility custom', 'Adăugare utilities proprii.', { topic: 'apply' }),
        mc('Anti-pattern', '@apply peste tot e?', ['Bun', 'Anti-pattern dacă ai componente', 'Recomandat', 'Default'], 'Anti-pattern dacă ai componente', 'Componentele sunt mai bune.', { topic: 'apply' }),
        mc('Markdown content', 'Pentru styling content extern?', ['@apply OK', 'Componente nu merg', 'Plugin typography', 'Toate'], 'Toate', 'Toate sunt opțiuni; typography plugin e popular.', { topic: 'apply' }),
        mc('cn', 'cn / clsx returnează?', ['Obiect', 'String cu clase', 'Array', 'JSX'], 'String cu clase', 'String cu clase combinate.', { topic: 'apply' }),
        mc('@tailwind components', 'Locația ideal?', ['După utilities', 'Înainte utilities', 'Dispar', 'Random'], 'Înainte utilities', 'Pentru ca utilities să poată suprascrie.', { topic: 'apply' }),
        mc('Custom utility', 'Adaugi utility nou prin?', ['@layer utilities', '@apply', 'plugin', 'Ambele A și C'], 'Ambele A și C', 'Layer sau plugin.', { topic: 'apply' }),
      ],
    },

    // ==================== 22. PLUGINS ====================
    {
      slug: 'tailwind-plugins',
      title: '22. Plugin-uri (forms, typography)',
      isFree: false,
      theory: `# 🔌 Plugin-uri Tailwind

## @tailwindcss/forms

Stiluri normale pentru \`<input>\`, \`<select>\`, \`<textarea>\`, \`<checkbox>\`.

### Instalare
\`\`\`bash
npm install -D @tailwindcss/forms
\`\`\`

### Activare
\`\`\`js
plugins: [require('@tailwindcss/forms')],
\`\`\`

### Folosire (auto)
\`\`\`html
<input type="checkbox" class="text-blue-500 rounded" />
<input type="text" class="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200" />
<select>...</select>
\`\`\`

## @tailwindcss/typography

Pentru content **markdown** sau HTML rich.

### Instalare
\`\`\`bash
npm install -D @tailwindcss/typography
\`\`\`

### Folosire
\`\`\`html
<article class="prose lg:prose-xl">
  <h1>Titlu</h1>
  <p>Paragraf cu link-uri, <strong>bold</strong>, <em>italic</em>...</p>
  <ul>
    <li>...</li>
  </ul>
</article>
\`\`\`

\`prose\` aplică stiluri "magazine-quality" automat la tot HTML-ul interior.

### Variante
\`prose-sm\`, \`prose-lg\`, \`prose-xl\`, \`prose-2xl\`

### Customize culori
\`\`\`html
<article class="prose prose-blue">...</article>
<article class="prose prose-invert">...</article>   <!-- dark mode -->
\`\`\`

## @tailwindcss/aspect-ratio

(deprecated în Tailwind 3.0+, deja built-in cu \`aspect-*\`)

## @tailwindcss/container-queries

Container queries (CSS modern):
\`\`\`html
<div class="@container">
  <div class="@md:flex">Layout schimbat dacă PĂRINTELE e md</div>
</div>
\`\`\`

## Pluginuri 3rd party populare

- **daisyUI** — componente prebuilt
- **shadcn/ui** — pattern (nu plugin, copy-paste components)
- **Headless UI** — componente unstyled accesibile
- **Tailwind Variants** — pentru variants tip CVA

## Plugin custom

\`\`\`js
plugins: [
  function({ addUtilities }) {
    addUtilities({
      '.text-shadow': { textShadow: '1px 1px 2px black' },
    });
  },
],
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`@tailwindcss/forms\` pentru forms standardizate
- ✅ \`@tailwindcss/typography\` pentru \`.prose\`
- ✅ Container queries cu plugin
- ✅ Plugin-uri custom pentru utilități proprii
`,
      problems: [
        mc('Forms plugin', 'Pentru?', ['Stiluri inputs frumoase', 'Validare', 'Submit', 'Toate'], 'Stiluri inputs frumoase', 'Resetare + îmbunătățiri vizuale.', { topic: 'plugins' }),
        mc('Typography', 'Pentru?', ['Forms', 'Content rich (markdown)', 'Animații', 'Routing'], 'Content rich (markdown)', '`prose` aplică stil la HTML interior.', { topic: 'plugins' }),
        sa('prose mare', 'Variantă XL? (prose-xl)', 'prose-xl', 'Variante: sm/lg/xl/2xl.', { topic: 'plugins' }),
        mc('Dark prose', 'Pentru dark mode?', ['prose-dark', 'prose-invert', 'dark:prose', 'prose-night'], 'prose-invert', '`prose-invert` pentru dark.', { topic: 'plugins' }),
        mc('Container queries', 'Built-in sau plugin?', ['Built-in', 'Plugin @tailwindcss/container-queries', 'Niciodată', 'Doar Vite'], 'Plugin @tailwindcss/container-queries', 'Plugin separat.', { topic: 'plugins' }),
        mc('daisyUI', 'Ce oferă?', ['Componente prebuilt', 'Plugin forms', 'Validare', 'Routing'], 'Componente prebuilt', 'btn, card, modal etc.', { topic: 'plugins' }),
        mc('Headless UI', 'Ce e?', ['Stilizat', 'Componente accesibile fără stil', 'Plugin nou', 'Bibliotecă veche'], 'Componente accesibile fără stil', 'Stiluiești tu cu Tailwind.', { topic: 'plugins' }),
        mc('shadcn/ui', 'Cum funcționează?', ['npm install', 'Copy-paste componente în proiect', 'CDN', 'Plugin'], 'Copy-paste componente în proiect', 'Pattern: tu deții componentele.', { topic: 'plugins' }),
        mc('Plugin custom', 'Adăugare în config?', ['plugins: []', 'addons: []', 'extras: []', 'use: []'], 'plugins: []', 'Array `plugins` în config.', { topic: 'plugins' }),
        mc('Aspect ratio plugin', 'Mai e nevoie?', ['Da', 'NU — built-in din 3.0', 'Doar dev', 'Doar prod'], 'NU — built-in din 3.0', 'Acum `aspect-*` e built-in.', { topic: 'plugins' }),
      ],
    },

    // ==================== 23. GROUP/PEER ====================
    {
      slug: 'tailwind-group-peer',
      title: '23. Group și Peer',
      isFree: false,
      theory: `# 👥 Group și Peer

## Group (relație părinte → copil)

Vrei copilul să reacționeze când **părintele** e în stare:

\`\`\`html
<a href="#" class="group p-4 hover:bg-gray-100">
  <h3 class="text-gray-700 group-hover:text-blue-500">Titlu</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Descriere</p>
</a>
\`\`\`

> 💡 Hover pe \`<a>\` → schimbă culoarea h3 și p (chiar dacă mouse e pe titlu).

## Group named (multiple grupuri)

\`\`\`html
<div class="group/card">
  <div class="group/header">
    <h3 class="group-hover/header:text-red-500 group-hover/card:underline">Titlu</h3>
  </div>
</div>
\`\`\`

## Peer (relație frate → frate)

\`\`\`html
<input type="checkbox" class="peer" />
<label class="peer-checked:text-green-500 peer-checked:font-bold">
  Schimbă când checkbox e bifat
</label>
\`\`\`

> 💡 \`peer\` pe primul element, \`peer-state:\` pe următorul.

## Pattern: floating label

\`\`\`html
<input class="peer placeholder-transparent" placeholder="Email" />
<label class="
  absolute left-2 top-2 text-gray-400 transition-all
  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base
  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
">
  Email
</label>
\`\`\`

## States cu group/peer

| Sintaxa |
|---|
| \`group-hover:\` |
| \`group-focus:\` |
| \`group-active:\` |
| \`peer-checked:\` |
| \`peer-focus:\` |
| \`peer-disabled:\` |
| \`peer-placeholder-shown:\` |

## ⚠️ Ordinea contează la peer

\`\`\`html
<input class="peer" />
<label class="peer-checked:...">  <!-- ✅ după peer -->
\`\`\`

\`\`\`html
<label class="peer-checked:...">  <!-- ❌ înainte -->
<input class="peer" />
\`\`\`

> CSS sibling selector merge doar înainte (+, ~).

## 🎓 Ce ai învățat
- ✅ \`group\` + \`group-hover:\` pentru părinte → copil
- ✅ \`peer\` + \`peer-checked:\` pentru frați
- ✅ \`group/name\` pentru grupuri named
- ✅ Ordinea contează la peer
`,
      problems: [
        mc('Group', 'Pentru?', ['Relație părinte→copil', 'Frați', 'CSS', 'Animații'], 'Relație părinte→copil', 'Hover pe părinte → copilul reacționează.', { topic: 'group-peer' }),
        mc('Peer', 'Pentru?', ['Părinte→copil', 'Frați', 'CSS', 'Animații'], 'Frați', 'Sibling selector.', { topic: 'group-peer' }),
        sa('Group hover text', 'Schimbă text la hover părinte? (group-hover:text-X)', 'group-hover:text-X', 'Pe copil.', { topic: 'group-peer' }),
        mc('Peer checked', 'Pentru checkbox bifat?', ['peer-checked:', 'peer-on:', 'check:', 'on:'], 'peer-checked:', 'Standard.', { topic: 'group-peer' }),
        mc('Ordinea peer', 'peer trebuie...', ['După elementul care reacționează', 'Înainte de elementul care reacționează', 'Oriunde', 'Părinte'], 'Înainte de elementul care reacționează', 'CSS ~ selector.', { topic: 'group-peer' }),
        mc('Group named', 'Pentru grupuri multiple?', ['group/name', 'group-name', 'named-group', 'group(name)'], 'group/name', 'Sintaxa cu `/`.', { topic: 'group-peer' }),
        mc('Floating label', 'Ce folosești?', ['group', 'peer', 'JavaScript', 'context'], 'peer', 'Label reacționează la input (frate).', { topic: 'group-peer' }),
        mc('group-focus', 'Pentru?', ['Tot grupul focus', 'Părinte are focus, copil reacționează', 'Doar children', 'Random'], 'Părinte are focus, copil reacționează', 'Standard.', { topic: 'group-peer' }),
        mc('Card hover', 'Întreg cardul reacționează la hover?', ['hover pe fiecare', 'group + group-hover pe interior', 'JavaScript', 'imposibil'], 'group + group-hover pe interior', 'Pattern uzual.', { topic: 'group-peer' }),
        mc('peer-disabled', 'Util pentru?', ['Form unde label e schimbat când input disabled', 'Animații', 'Routing', 'CSS'], 'Form unde label e schimbat când input disabled', 'Pattern frecvent.', { topic: 'group-peer' }),
      ],
    },

    // ==================== 24. ARBITRARY ====================
    {
      slug: 'tailwind-arbitrary',
      title: '24. Arbitrary values [...]',
      isFree: false,
      theory: `# 🔧 Arbitrary values

## Sintaxa: \`[valoare]\`

Când Tailwind nu are clasa exactă, folosești \`[...]\` pentru valoare custom.

## Exemple

\`\`\`html
<!-- Mărimi -->
<div class="w-[342px] h-[100px]">dimensiuni exacte</div>
<div class="text-[19px]">font-size 19px</div>

<!-- Culori -->
<div class="bg-[#ff5733] text-[rgba(255,87,51,0.5)]">colors hex/rgba</div>

<!-- Padding -->
<div class="p-[2.5rem]">padding 2.5rem</div>

<!-- Grid template -->
<div class="grid grid-cols-[200px_1fr_100px]">
  layout custom
</div>
\`\`\`

## Cu CSS variables

\`\`\`html
<div class="text-[var(--my-color)]">CSS variable</div>
\`\`\`

## Modifier cu arbitrary

\`\`\`html
<div class="bg-blue-500/[.18]">opacity .18</div>
\`\`\`

## Arbitrary group/peer states

\`\`\`html
<div class="group-[.is-active]:bg-blue-500">Reactionează la grup cu clasa .is-active</div>
\`\`\`

## Arbitrary media queries

\`\`\`html
<div class="max-[600px]:hidden">Ascuns sub 600px</div>
<div class="min-[800px]:flex">Flex peste 800px</div>
\`\`\`

## ⚠️ Folosește cu măsură

✅ Pentru cazuri rare, valori specifice (e.g. înălțimi exacte din design)
❌ Nu peste tot — pierzi consistența design tokens

## 🎓 Ce ai învățat
- ✅ \`[valoare]\` pentru custom
- ✅ Funcționează cu w, h, bg, text, p, grid, etc.
- ✅ Cu CSS variables, media queries arbitrary
- ✅ Folosește când Tailwind nu are valoarea exactă
`,
      problems: [
        mc('Arbitrary syntax', 'Pentru valoare custom?', ['(valoare)', '[valoare]', '<valoare>', '"valoare"'], '[valoare]', 'Brackets pătrate.', { topic: 'arbitrary' }),
        mc('Width 342px', 'Cum?', ['w-342', 'w-[342px]', 'w-342px', 'width-342'], 'w-[342px]', 'Brackets cu unitate.', { topic: 'arbitrary' }),
        sa('Hex color bg', 'Bg #ff5733? (bg-[#ff5733])', 'bg-[#ff5733]', 'Funcționează cu hex.', { topic: 'arbitrary' }),
        mc('Grid custom', 'Coloane 200px + flex?', ['grid-cols-[200px_1fr]', 'grid-cols-2', 'grid-cols-200px', 'grid-200-1fr'], 'grid-cols-[200px_1fr]', 'Underscore = spațiu.', { topic: 'arbitrary' }),
        mc('Underscore', 'În arbitrary, _ înseamnă?', ['nimic', 'spațiu', 'tab', 'enter'], 'spațiu', 'CSS folosește spațiu, dar HTML class nu permite.', { topic: 'arbitrary' }),
        mc('Media query custom', 'Sub 600px?', ['max-[600px]:', 'mobile:', 'sm-:', '<600:'], 'max-[600px]:', 'Arbitrary media query.', { topic: 'arbitrary' }),
        mc('CSS variable', 'În arbitrary?', ['var(--x)', '[var(--x)]', '$x', '@x'], '[var(--x)]', 'În brackets.', { topic: 'arbitrary' }),
        mc('Overuse', 'Anti-pattern?', ['Folosit rar', 'Folosit peste tot', 'Folosit cu CSS vars', 'În config'], 'Folosit peste tot', 'Pierzi consistență tokens.', { topic: 'arbitrary' }),
        mc('Opacity arbitrary', 'Opacity 18%?', ['/18', '/[.18]', '/[18%]', 'Toate'], 'Toate', 'Mai multe forme funcționează.', { topic: 'arbitrary' }),
        mc('Min query', 'Peste 800px?', ['min-[800px]:', '800+:', 'lg:', 'big-800:'], 'min-[800px]:', 'Arbitrary min-width.', { topic: 'arbitrary' }),
      ],
    },

    // ==================== 25. BEST PRACTICES ====================
    {
      slug: 'tailwind-best-practices',
      title: '25. Best Practices și Optimization',
      isFree: false,
      theory: `# 🏆 Best Practices Tailwind

## 1. Componente > Repetare

❌ Aceeași combinație de clase peste tot
✅ Componentă React/Vue cu clasele

## 2. Folosește design tokens

❌ \`text-[#3b82f6]\` (random)
✅ \`text-blue-500\` (din paletă)

## 3. Mobile-first

❌ \`lg:p-4 md:p-2 p-8\` (gândire greșită)
✅ \`p-2 md:p-4 lg:p-8\`

## 4. clsx pentru clase condiționale

\`\`\`jsx
import clsx from 'clsx';

<div className={clsx(
  'base-classes',
  active && 'bg-blue-500',
  size === 'lg' && 'p-8'
)}>
\`\`\`

## 5. Variants library (cva, tv)

Pentru componente complexe cu variants:

\`\`\`js
import { cva } from 'class-variance-authority';

const button = cva('rounded font-medium', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      lg: 'px-4 py-2 text-lg',
    },
  },
  defaultVariants: { intent: 'primary', size: 'sm' },
});

<button className={button({ intent: 'secondary', size: 'lg' })}>
  Click
</button>
\`\`\`

## 6. Optimize bundle

- ✅ \`content\` corect în config
- ✅ Production build (\`npm run build\`)
- ✅ Tree-shaking activ

## 7. Accessibility

- ✅ \`focus-visible:\` pentru focus
- ✅ \`sr-only\` pentru screen reader only
- ✅ Touch targets min 44px (\`min-w-[44px] min-h-[44px]\`)

## 8. Semantic HTML

\`\`\`html
<!-- ✅ corect -->
<nav class="flex gap-4">
  <a class="hover:underline">Acasă</a>
</nav>

<!-- ❌ greșit -->
<div class="flex gap-4">
  <div class="hover:underline">Acasă</div>
</div>
\`\`\`

## 9. Reading order

Convenție pentru ordonarea claselor (eslint-plugin-tailwindcss):
\`\`\`
[layout] [box-model] [typography] [visual] [misc]
flex p-4 text-sm font-bold bg-white shadow rounded
\`\`\`

## 10. Folosește Prettier plugin

\`\`\`bash
npm install -D prettier-plugin-tailwindcss
\`\`\`

Sortează automat clasele!

## 🎓 Ce ai învățat
- ✅ Componente > repetare
- ✅ Design tokens > arbitrary
- ✅ Mobile-first ordering
- ✅ \`clsx\` / \`cva\` pentru complexitate
- ✅ Prettier plugin pentru sortare
`,
      problems: [
        mc('Repetare clase', 'Soluția?', ['@apply mereu', 'Componentă reutilizabilă', 'Copy-paste', 'CSS'], 'Componentă reutilizabilă', 'Idiomatic React/Vue.', { topic: 'best' }),
        mc('Tokens', 'Mai bun?', ['text-[#3b82f6]', 'text-blue-500', 'color-blue', 'rgb(...)'], 'text-blue-500', 'Token din paletă = consistență.', { topic: 'best' }),
        mc('clsx', 'Pentru?', ['Animații', 'Clase condiționale', 'Routing', 'Forms'], 'Clase condiționale', 'Combină clase pe condiții.', { topic: 'best' }),
        sa('Prettier plugin', 'Plugin pentru sortare? (prettier-plugin-tailwindcss)', 'prettier-plugin-tailwindcss', 'Auto-sortare la save.', { topic: 'best' }),
        mc('cva', 'Pentru?', ['Animații', 'Variants components', 'CSS', 'Routing'], 'Variants components', 'class-variance-authority.', { topic: 'best' }),
        mc('Touch targets', 'Min recomandat?', ['16px', '32px', '44px', '60px'], '44px', 'A11y standard.', { topic: 'best' }),
        mc('Production', 'În prod, CSS-ul e?', ['Mai mare', 'Tree-shaken (mic)', 'Identic', 'Random'], 'Tree-shaken (mic)', 'Tailwind elimină nefolosite.', { topic: 'best' }),
        mc('sr-only', 'Pentru?', ['Print', 'Screen readers', 'Mobile', 'Dark mode'], 'Screen readers', 'Vizibil doar pentru a11y.', { topic: 'best' }),
        mc('Semantic HTML', 'În loc de div?', ['span peste tot', 'Semantic tags (nav, article, section)', 'p mereu', 'div mereu'], 'Semantic tags (nav, article, section)', 'A11y și SEO.', { topic: 'best' }),
        mc('Focus visible', 'Pentru a11y?', ['focus:', 'focus-visible:', 'tab-focus:', 'keyboard:'], 'focus-visible:', 'Focus doar prin keyboard.', { topic: 'best' }),
      ],
    },

  ],
}
