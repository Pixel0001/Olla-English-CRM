// Next.js Frontend — 25 lecții cu teorie îmbogățită + 10+ probleme/lecție

import { mc, sa } from './helpers.mjs'

export const nextjsFrontendModule = {
  slug: 'nextjs-frontend',
  title: 'Next.js Frontend',
  description: 'Învață Next.js 15 — App Router, layouts, components, rutare, optimizări frontend. 25 de lecții.',
  language: 'javascript',
  order: 10,
  lessons: [

    // ==================== 1. INTRO ====================
    {
      slug: 'next-introducere',
      title: '1. Introducere în Next.js',
      isFree: true,
      theory: `# ⚡ Bun venit în Next.js!

## Ce este Next.js?

**Next.js** = framework React de la **Vercel** care adaugă:
- 🚀 **SSR** (Server-Side Rendering)
- 📦 **SSG** (Static Site Generation)
- 🛣️ **Routing** automat (file-based)
- 🖼️ **Image optimization**
- ⚡ **API routes** (backend integrat)
- 📱 **App Router** (React Server Components)

## React vs Next.js

| React | Next.js |
|---|---|
| Bibliotecă UI | Framework complet |
| SPA by default | SSR, SSG, ISR, CSR |
| Routing manual | File-based routing |
| Bundler manual | Webpack/Turbopack inclus |
| API separat | API routes integrate |

## Versiuni

- **Pages Router** — vechi (\`pages/\` folder)
- **App Router** — modern (din v13+, \`app/\` folder) ⭐ FOLOSIM!

## De ce Next.js?

- 🌐 **SEO** — pre-renderizare HTML
- ⚡ **Performance** — caching, prefetching
- 📐 **DX** — convenții clare, hot reload
- 🚀 **Production-ready** — Vercel deployment 1 click

## Concepte cheie (App Router)

- **Server Components** — rulează pe server (default)
- **Client Components** — \`'use client'\` directive
- **Layouts** — UI shared între pagini
- **Loading & Error** — UI pentru stări
- **Route Handlers** — API routes (\`route.js\`)

## Setup

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

Acces la: \`http://localhost:3000\`

## 🎓 Ce ai învățat
- ✅ Next.js = React + SSR + Routing
- ✅ App Router e modul modern
- ✅ Server Components by default
- ✅ \`npm run dev\` pornește
`,
      problems: [
        mc('Ce e Next.js?', 'Tipul?', ['Bibliotecă CSS', 'Framework React', 'Backend pur', 'Bundler'], 'Framework React', 'Framework full-stack peste React.', { topic: 'intro' }),
        mc('SSR', 'Înseamnă?', ['Server-Side Rendering', 'Single Sided React', 'Static Site Render', 'Style Sheet React'], 'Server-Side Rendering', 'HTML generat pe server.', { topic: 'intro' }),
        mc('App Router folder', 'Care folder?', ['pages/', 'app/', 'src/', 'router/'], 'app/', 'App Router folosește `app/`.', { topic: 'intro' }),
        sa('Comandă create', 'Comandă pentru proiect nou? (npx create-next-app@latest)', 'npx create-next-app@latest', 'Generator oficial.', { topic: 'intro' }),
        mc('Server Component default?', 'În App Router?', ['Da', 'Nu', 'Doar dacă spui', 'Random'], 'Da', 'Default = server, opt-in pentru client.', { topic: 'intro' }),
        mc('Use client', 'Pentru?', ['Marchează component server', 'Marchează component client', 'API', 'Loading'], 'Marchează component client', '"use client" directive.', { topic: 'intro' }),
        mc('Pages Router', 'Versiunea?', ['Modernă', 'Veche, încă suportată', 'Disparută', 'Doar dev'], 'Veche, încă suportată', 'Coexistă cu App Router.', { topic: 'intro' }),
        mc('SEO benefit', 'Datorită?', ['JavaScript', 'HTML pre-renderizat', 'CSS', 'JSON'], 'HTML pre-renderizat', 'Crawlerele văd HTML complet.', { topic: 'intro' }),
        mc('Port default', 'Pe ce port?', ['3000', '8080', '5173', '4200'], '3000', 'Default Next.js.', { topic: 'intro' }),
        mc('Cine face?', 'Compania?', ['Meta', 'Google', 'Vercel', 'Microsoft'], 'Vercel', 'Vercel (founders Next.js).', { topic: 'intro' }),
      ],
    },

    // ==================== 2. APP ROUTER STRUCTURE ====================
    {
      slug: 'next-app-router-structure',
      title: '2. App Router — structură fișiere',
      isFree: true,
      theory: `# 📁 App Router Structure

## Structura standard

\`\`\`
app/
  layout.js         ← Layout root (REQUIRED)
  page.js           ← Pagina /
  loading.js        ← UI încărcare
  error.js          ← UI eroare
  not-found.js      ← 404
  globals.css       ← Stiluri globale

  about/
    page.js         ← Pagina /about

  blog/
    page.js         ← Pagina /blog
    [slug]/
      page.js       ← Pagina /blog/:slug

  (auth)/           ← Route group (nu apare în URL)
    login/
      page.js       ← Pagina /login
    register/
      page.js       ← Pagina /register
\`\`\`

## File conventions

| Fișier | Rol |
|---|---|
| \`page.js\` | UI pentru rută |
| \`layout.js\` | UI persistent între copii |
| \`loading.js\` | UI Suspense fallback |
| \`error.js\` | UI Error Boundary |
| \`not-found.js\` | UI pentru 404 |
| \`route.js\` | API endpoint |
| \`template.js\` | Layout NEpersistent |
| \`default.js\` | Fallback parallel routes |

## page.js (REQUIRED pentru rute)

\`\`\`jsx
// app/about/page.js
export default function About() {
  return <h1>Despre noi</h1>;
}
\`\`\`

## layout.js (root REQUIRED)

\`\`\`jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        {children}
      </body>
    </html>
  );
}
\`\`\`

## Rute dinamice

- \`[slug]\` — single dynamic
- \`[...slug]\` — catch-all
- \`[[...slug]]\` — optional catch-all

\`\`\`
app/blog/[slug]/page.js  → /blog/:slug
app/shop/[...path]/page.js → /shop/a/b/c
\`\`\`

## Route groups

Folosești \`(name)\` pentru a grupa fără a afecta URL:
\`\`\`
app/(marketing)/about/page.js  → /about
app/(marketing)/contact/page.js → /contact
app/(app)/dashboard/page.js   → /dashboard
\`\`\`

## Private folders

\`_components\` — folder cu prefix \`_\` nu generează rute.

## 🎓 Ce ai învățat
- ✅ \`page.js\` = pagina, \`layout.js\` = layout
- ✅ Folder = segment URL
- ✅ \`[param]\` = rute dinamice
- ✅ \`(group)\` = grupare fără URL
`,
      problems: [
        mc('Pagina /', 'Ce fișier?', ['app/index.js', 'app/page.js', 'app/home.js', 'pages/index.js'], 'app/page.js', '`page.js` standard.', { topic: 'router' }),
        mc('Layout root', 'Required?', ['No', 'Da, în app/layout.js', 'Doar opțional', 'În pages'], 'Da, în app/layout.js', 'REQUIRED root layout.', { topic: 'router' }),
        sa('Rută dinamică', 'Folder pentru /blog/:slug? ([slug])', '[slug]', 'Brackets în nume folder.', { topic: 'router' }),
        mc('Catch-all', '/shop/a/b/c?', ['[slug]', '[...slug]', '[*]', '[**]'], '[...slug]', 'Spread.', { topic: 'router' }),
        mc('Route group', '/about fără folder vizibil?', ['(marketing)/about', '_about', '#about', '@about'], '(marketing)/about', 'Paranteze rotunde.', { topic: 'router' }),
        mc('Private folder', 'Componente fără rută?', ['_components', '(components)', '[components]', '@components'], '_components', 'Prefix `_`.', { topic: 'router' }),
        mc('Loading', 'Pentru Suspense?', ['suspense.js', 'loading.js', 'wait.js', 'spinner.js'], 'loading.js', 'Convenție Next.js.', { topic: 'router' }),
        mc('404', 'Pentru not-found?', ['404.js', 'not-found.js', 'notfound.js', 'error.js'], 'not-found.js', 'Standard.', { topic: 'router' }),
        mc('API endpoint', 'În App Router?', ['api.js', 'route.js', 'endpoint.js', 'page.js'], 'route.js', '`route.js` în App Router.', { topic: 'router' }),
        mc('Optional catch-all', 'Sintaxa?', ['[slug?]', '[?slug]', '[[...slug]]', '[*slug]'], '[[...slug]]', 'Double brackets.', { topic: 'router' }),
      ],
    },

    // ==================== 3. PAGES & ROUTES ====================
    {
      slug: 'next-pages-routes',
      title: '3. Pagini și Rute',
      isFree: false,
      theory: `# 🛣️ Pagini și Rute

## File-based routing

Folder = segment URL, \`page.js\` = component pagină.

## Exemple

\`\`\`
app/page.js                → /
app/about/page.js          → /about
app/blog/page.js           → /blog
app/blog/[slug]/page.js    → /blog/oricetip
app/shop/[id]/page.js      → /shop/123
\`\`\`

## Async page components

În App Router, page poate fi \`async\`:

\`\`\`jsx
// app/blog/page.js
export default async function BlogPage() {
  const posts = await fetch('https://api/posts').then(r => r.json());
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
\`\`\`

> 💡 Server Components pot fi async — fetch direct!

## Params (rute dinamice)

\`\`\`jsx
// app/blog/[slug]/page.js
export default function Post({ params }) {
  return <h1>Post: {params.slug}</h1>;
}
\`\`\`

> ⚠️ În Next.js 15, \`params\` e Promise: \`const { slug } = await params;\`

## Search params

\`\`\`jsx
export default function Page({ searchParams }) {
  const { q } = searchParams;
  return <p>Cauți: {q}</p>;
}
\`\`\`

> URL: \`/page?q=text\`

## Multiple dynamic segments

\`\`\`
app/shop/[category]/[id]/page.js → /shop/electronics/123
\`\`\`

\`\`\`jsx
export default function Product({ params }) {
  return <p>{params.category} - {params.id}</p>;
}
\`\`\`

## Catch-all

\`\`\`
app/docs/[...slug]/page.js → /docs/a/b/c
\`\`\`

\`\`\`jsx
// params.slug = ['a', 'b', 'c']
\`\`\`

## Metadata

\`\`\`jsx
export const metadata = {
  title: 'Despre noi',
  description: 'Pagina despre',
};
\`\`\`

## 🎓 Ce ai învățat
- ✅ Folder = URL segment
- ✅ \`page.js\` exportă default componenta
- ✅ \`params\` și \`searchParams\` în props
- ✅ Pages pot fi async (RSC)
`,
      problems: [
        mc('about page', 'Care fișier?', ['app/about.js', 'app/about/page.js', 'pages/about.js', 'app/about/index.js'], 'app/about/page.js', 'Convenție.', { topic: 'pages' }),
        mc('Async page', 'Permis?', ['Doar în client', 'Da, server components', 'Niciodată', 'Doar API'], 'Da, server components', 'RSC permit async.', { topic: 'pages' }),
        sa('Params', 'Cum accesezi params? (props.params sau { params })', 'props.params', 'Primit ca prop.', { topic: 'pages' }),
        mc('Search params', 'Pentru ?q=...?', ['params', 'searchParams', 'query', 'router'], 'searchParams', 'Separat de params.', { topic: 'pages' }),
        mc('Catch-all', 'Catch all params?', ['String', 'Array de strings', 'Object', 'Number'], 'Array de strings', '`[...slug]` → array.', { topic: 'pages' }),
        mc('Metadata export', 'Cum?', ['export const metadata', 'metadata = {}', 'export metadata', 'Head'], 'export const metadata', 'Named export.', { topic: 'pages' }),
        mc('Default export', 'Page.js export?', ['Named', 'Default', 'Both', 'No export'], 'Default', 'Default obligatoriu.', { topic: 'pages' }),
        mc('Next 15 params', '`params` e?', ['Object', 'Promise', 'String', 'Array'], 'Promise', 'Async în 15+.', { topic: 'pages' }),
        mc('Multiple dynamic', '/shop/cat/id?', ['[cat-id]', '[cat]/[id]', '[cat]+[id]', '(cat)/(id)'], '[cat]/[id]', 'Foldere separate.', { topic: 'pages' }),
        mc('Title set via', 'Pentru title pagină?', ['<head>', 'metadata.title', 'document.title', 'config'], 'metadata.title', 'Best practice.', { topic: 'pages' }),
      ],
    },

    // ==================== 4. LAYOUTS ====================
    {
      slug: 'next-layouts',
      title: '4. Layouts',
      isFree: false,
      theory: `# 🧱 Layouts

## Ce e un layout?

UI **persistent** care înconjoară mai multe pagini. NU se re-renderează la navigare între copii.

## Root layout (REQUIRED)

\`\`\`jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <header>Logo</header>
        {children}
        <footer>© 2025</footer>
      </body>
    </html>
  );
}
\`\`\`

## Nested layouts

\`\`\`
app/
  layout.js              ← Root
  page.js
  dashboard/
    layout.js            ← Layout doar pentru /dashboard/*
    page.js
    settings/
      page.js
\`\`\`

\`\`\`jsx
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
\`\`\`

## Comportament

- Navigare între \`/dashboard\` și \`/dashboard/settings\` → layout-ul **nu** se re-renderează
- State-ul din layout e **păstrat**
- Doar \`children\` se schimbă

## Metadata în layout

\`\`\`jsx
export const metadata = {
  title: { template: '%s | Site', default: 'Site' },
};
\`\`\`

## Layout vs Template

- \`layout.js\` — persistent (default)
- \`template.js\` — re-creează la fiecare navigare

\`\`\`jsx
// app/template.js
export default function Template({ children }) {
  // Re-mount la fiecare schimbare de rută
  return <div>{children}</div>;
}
\`\`\`

## Pattern: dashboard

\`\`\`jsx
// app/(app)/layout.js
export default function AppLayout({ children }) {
  return (
    <div className="grid grid-cols-[200px_1fr] h-screen">
      <Sidebar />
      <main className="p-6">{children}</main>
    </div>
  );
}
\`\`\`

## Async layout

\`\`\`jsx
export default async function Layout({ children }) {
  const user = await getUser();
  return (
    <div>
      <Header user={user} />
      {children}
    </div>
  );
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Layout = UI persistent
- ✅ Root layout = REQUIRED, conține \`<html>\` și \`<body>\`
- ✅ Nested layouts pentru segmente
- ✅ Template = re-mount, layout = persistent
`,
      problems: [
        mc('Layout root', 'Conține?', ['Doar children', 'html și body', 'Doar header', 'Niciun tag'], 'html și body', 'Root layout = HTML scaffold.', { topic: 'layouts' }),
        mc('Re-render', 'Layout se re-renderează la navigare între copii?', ['Da', 'Nu', 'Uneori', 'Doar root'], 'Nu', 'Layouts sunt persistente.', { topic: 'layouts' }),
        sa('Children prop', 'Ce primește layout? (children)', 'children', 'Standard React.', { topic: 'layouts' }),
        mc('Template', 'Diferența?', ['Identic', 'Re-mount la navigare', 'Doar root', 'Mai rapid'], 'Re-mount la navigare', 'Template ≠ layout persistent.', { topic: 'layouts' }),
        mc('Nested', 'Layout în /dashboard/?', ['Imposibil', 'app/dashboard/layout.js', 'configure', 'pages.config'], 'app/dashboard/layout.js', 'Layout-uri nested.', { topic: 'layouts' }),
        mc('Async layout', 'Permis?', ['Da', 'Nu', 'Doar client', 'Doar Pages'], 'Da', 'Server components → async.', { topic: 'layouts' }),
        mc('Required layout', 'Care e required?', ['Niciun', 'Root layout', 'Toate', 'Dashboard'], 'Root layout', 'app/layout.js obligatoriu.', { topic: 'layouts' }),
        mc('State păstrat', 'Avantaj layout vs template?', ['State păstrat', 'Mai rapid', 'Mai mic', 'SEO'], 'State păstrat', 'Persistă între navigări.', { topic: 'layouts' }),
        mc('Metadata template', 'Pentru titluri?', ['title plain', 'metadata.title.template', 'config', 'meta'], 'metadata.title.template', 'Template cu %s.', { topic: 'layouts' }),
        mc('Sidebar pattern', 'Unde pui sidebar comun?', ['Fiecare page', 'Layout dashboard', 'config', 'router'], 'Layout dashboard', 'Layout = UI shared.', { topic: 'layouts' }),
      ],
    },

    // ==================== 5. SERVER VS CLIENT ====================
    {
      slug: 'next-server-client',
      title: '5. Server vs Client Components',
      isFree: false,
      theory: `# 🖥️ Server vs Client Components

## Default: SERVER Components

În App Router, **toate componentele sunt server-side by default**.

## Server Components

✅ Rulează pe **server**
✅ Pot fi **async**
✅ Pot accesa **DB direct**, **fs**, **secrets**
✅ Bundle size **mai mic** (nu se trimite JS la client)
❌ NU pot folosi \`useState\`, \`useEffect\`, hooks
❌ NU pot folosi event handlers (\`onClick\`)
❌ NU pot accesa \`window\`, \`document\`

\`\`\`jsx
// app/blog/page.js (server)
async function BlogPage() {
  const posts = await db.posts.findMany();
  return posts.map(p => <h2 key={p.id}>{p.title}</h2>);
}
\`\`\`

## Client Components

Marcate cu directive \`'use client'\` la TOP:

\`\`\`jsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

✅ Hooks (useState, useEffect, etc.)
✅ Event handlers
✅ Browser APIs (window, localStorage)
❌ NU pot fi async (TLD)
❌ Bundle JS trimis la client

## Când folosești fiecare?

### Server Component
- Fetching de date
- Acces la DB
- Secret keys
- Conținut static

### Client Component
- Interactivitate (clicks, forms)
- State local
- useEffect, useState
- Browser APIs

## ⚠️ Reguli

1. \`'use client'\` se aplică la **toate componentele importate** după el
2. Server components NU pot fi importate într-un client component, DAR pot fi pasate ca \`children\`

\`\`\`jsx
// ✅ OK — server pasat ca children
'use client';
export default function ClientWrapper({ children }) {
  return <div>{children}</div>;
}

// În alt fișier (server):
<ClientWrapper>
  <ServerComponent />  {/* ✅ ok ca children */}
</ClientWrapper>
\`\`\`

## Pattern bun

Server component (date) → Client component (interactivitate)

\`\`\`jsx
// page.js (server)
async function Page() {
  const data = await fetchData();
  return <ClientChart data={data} />;
}

// ClientChart.jsx ('use client')
'use client';
export default function ClientChart({ data }) {
  // interacțiune cu chart
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Server = default, async, no state
- ✅ Client = \`'use client'\`, hooks, events
- ✅ Server poate trece prin \`children\` în client
- ✅ Pattern: fetch în server, interacție în client
`,
      problems: [
        mc('Default', 'În App Router?', ['Client', 'Server', 'SSR', 'CSR'], 'Server', 'Server by default.', { topic: 'server-client' }),
        mc('Use client', 'Marchează?', ['Server component', 'Client component', 'Layout', 'Page'], 'Client component', 'Directive la top.', { topic: 'server-client' }),
        sa('useState', 'În ce fel de component? (client)', 'client', 'Doar client poate hooks.', { topic: 'server-client' }),
        mc('async permis în', 'Care?', ['Server', 'Client', 'Ambele', 'Niciunul'], 'Server', 'Doar server poate async.', { topic: 'server-client' }),
        mc('DB access', 'În care?', ['Client', 'Server', 'Ambele', 'Imposibil'], 'Server', 'DB doar server-side.', { topic: 'server-client' }),
        mc('Bundle JS client', 'Server component trimite JS la client?', ['Da, mult', 'Nu, doar HTML', 'Doar CSS', 'Random'], 'Nu, doar HTML', 'Server = doar HTML.', { topic: 'server-client' }),
        mc('Server în client', 'Direct importat?', ['Da', 'Nu — doar prin children', 'Doar dev', 'Doar build'], 'Nu — doar prin children', 'Pattern children.', { topic: 'server-client' }),
        mc('onClick', 'În ce?', ['Server', 'Client', 'Ambele', 'Layout'], 'Client', 'Event handlers = client.', { topic: 'server-client' }),
        mc('window', 'În ce?', ['Server', 'Client', 'Ambele', 'Niciunul'], 'Client', 'Browser API = client.', { topic: 'server-client' }),
        mc('use client position', 'Unde scrii?', ['Oriunde', 'Prima linie a fișierului', 'În export', 'În function'], 'Prima linie a fișierului', 'Top of file.', { topic: 'server-client' }),
      ],
    },

    // ==================== 6. LINK ====================
    {
      slug: 'next-link',
      title: '6. Navigare cu <Link>',
      isFree: false,
      theory: `# 🔗 Componenta <Link>

## Import

\`\`\`jsx
import Link from 'next/link';
\`\`\`

## Folosire de bază

\`\`\`jsx
<Link href="/about">Despre</Link>
<Link href="/blog/123">Citește postare</Link>
\`\`\`

## De ce NU \`<a href>\`?

- \`<a>\` cauzează **full page reload** (lent)
- \`<Link>\` face **client-side navigation** (instant)
- \`<Link>\` face **prefetch** automat când e vizibil în viewport

## Props utile

\`\`\`jsx
<Link
  href="/about"
  prefetch={false}      // dezactivează prefetch
  scroll={false}        // nu scroll-uie sus
  replace               // history.replace în loc de push
>
  Link
</Link>
\`\`\`

## Cu obiect href

\`\`\`jsx
<Link href={{
  pathname: '/blog',
  query: { page: 1, sort: 'desc' },
}}>
  Pagina 1
</Link>
\`\`\`

## Stilare activă (current page)

\`\`\`jsx
'use client';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={isActive ? 'font-bold' : ''}>
      {children}
    </Link>
  );
}
\`\`\`

## Programatic navigation (router)

\`\`\`jsx
'use client';
import { useRouter } from 'next/navigation';

function MyButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.push('/dashboard')}>
      Mergi
    </button>
  );
}
\`\`\`

## router metode

- \`router.push(url)\` — navigare nouă în history
- \`router.replace(url)\` — înlocuiește în history
- \`router.back()\` — înapoi
- \`router.forward()\` — înainte
- \`router.refresh()\` — re-fetch RSC

## ⚠️ \`useRouter\` din \`next/navigation\` (NU \`next/router\`)

\`next/router\` e pentru Pages Router (vechi).

## 🎓 Ce ai învățat
- ✅ \`<Link href="/">\` pentru navigare client-side
- ✅ Prefetch automat
- ✅ \`useRouter()\` pentru programatic
- ✅ \`usePathname()\` pentru current path
`,
      problems: [
        mc('Import Link', 'De unde?', ['react', 'next/link', 'next-link', 'next/navigation'], 'next/link', 'Default import.', { topic: 'link' }),
        mc('Avantaj Link', 'Față de a?', ['Client navigation + prefetch', 'Mai mic', 'CSS', 'SEO'], 'Client navigation + prefetch', 'Mai rapid.', { topic: 'link' }),
        sa('useRouter import', 'Din ce package? (next/navigation)', 'next/navigation', 'App Router import.', { topic: 'link' }),
        mc('Prefetch off', 'Cum?', ['no-prefetch', 'prefetch={false}', 'prefetch=no', 'noprefetch'], 'prefetch={false}', 'Prop boolean.', { topic: 'link' }),
        mc('Current path', 'Hook?', ['useLocation', 'usePathname', 'usePath', 'useURL'], 'usePathname', 'Din next/navigation.', { topic: 'link' }),
        mc('Push history', 'Metodă?', ['router.go', 'router.push', 'router.navigate', 'router.url'], 'router.push', 'Standard.', { topic: 'link' }),
        mc('Înapoi', 'Metodă?', ['router.prev', 'router.back', 'history.back', 'router.minus'], 'router.back', 'Pe router.', { topic: 'link' }),
        mc('Refresh RSC', 'Metodă?', ['router.refresh', 'router.reload', 'window.reload', 'router.update'], 'router.refresh', 'Re-fetch fără full reload.', { topic: 'link' }),
        mc('Replace history', 'Cum?', ['<Link replace>', '<Link mode="replace">', 'Toate', 'Niciuna'], '<Link replace>', 'Boolean prop.', { topic: 'link' }),
        mc('Wrong import', 'NU folosi în App Router?', ['next/link', 'next/router', 'next/navigation', 'react-router'], 'next/router', 'Pages Router only.', { topic: 'link' }),
      ],
    },

    // ==================== 7. IMAGE ====================
    {
      slug: 'next-image',
      title: '7. <Image> optimization',
      isFree: false,
      theory: `# 🖼️ Componenta <Image>

## De ce?

- ⚡ **Lazy loading** automat
- 📐 **Resize** automat (multiple resoluții)
- 🎨 **Format optimizat** (WebP, AVIF)
- 🛡️ **Layout shift** prevenit (CLS)

## Import

\`\`\`jsx
import Image from 'next/image';
\`\`\`

## Folosire — imagine locală

\`\`\`jsx
import logo from '@/public/logo.png';

<Image src={logo} alt="Logo" />
\`\`\`

> 💡 Dimensiunile sunt detectate automat.

## Imagine remote

\`\`\`jsx
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
/>
\`\`\`

> ⚠️ Trebuie \`width\` și \`height\` (sau \`fill\`).

## Config remote (next.config.js)

\`\`\`js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' },
    ],
  },
};
\`\`\`

## Fill (umple containerul)

\`\`\`jsx
<div className="relative h-64">
  <Image src="/photo.jpg" alt="" fill className="object-cover" />
</div>
\`\`\`

## Sizes (responsive)

\`\`\`jsx
<Image
  src="/photo.jpg"
  alt=""
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
\`\`\`

## Priority (LCP)

Pentru imagini above-the-fold:

\`\`\`jsx
<Image src="/hero.jpg" priority alt="Hero" width={1200} height={600} />
\`\`\`

> 💡 \`priority\` dezactivează lazy loading.

## Placeholder

\`\`\`jsx
<Image
  src="/photo.jpg"
  alt=""
  width={500}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
\`\`\`

## Quality

\`\`\`jsx
<Image src="/photo.jpg" quality={75} alt="" width={500} height={300} />
\`\`\`

## Pattern: avatar

\`\`\`jsx
<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={48}
  height={48}
  className="rounded-full"
/>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`next/image\` pentru optimizare
- ✅ \`width\`/\`height\` sau \`fill\` obligatorii
- ✅ \`priority\` pentru LCP
- ✅ Config \`remotePatterns\` pentru externe
`,
      problems: [
        mc('Avantaj Image', 'Față de img?', ['Lazy + format optim + no CLS', 'Mai mic', 'SEO', 'Doar HTML'], 'Lazy + format optim + no CLS', 'Toate beneficii.', { topic: 'image' }),
        mc('Import', 'De unde?', ['next/image', 'react', 'next-image', 'image'], 'next/image', 'Default.', { topic: 'image' }),
        sa('Width/height required?', 'Pentru imagini remote? (Da)', 'Da', 'Obligatoriu (sau fill).', { topic: 'image' }),
        mc('Fill', 'Pentru?', ['Mărime fixă', 'Umple container', 'Lazy', 'Format'], 'Umple container', 'Cu position relative pe părinte.', { topic: 'image' }),
        mc('Priority', 'Pentru?', ['LCP image (above-fold)', 'Background', 'Footer', 'Modal'], 'LCP image (above-fold)', 'Dezactivează lazy.', { topic: 'image' }),
        mc('Remote config', 'În?', ['next.config.js', 'package.json', 'images.config', 'global.css'], 'next.config.js', 'remotePatterns array.', { topic: 'image' }),
        mc('Format auto', 'Tailored?', ['JPG', 'PNG', 'WebP/AVIF auto', 'GIF'], 'WebP/AVIF auto', 'Format modern.', { topic: 'image' }),
        mc('Placeholder', 'Tip?', ['fade', 'blur', 'skeleton', 'spinner'], 'blur', '`placeholder="blur"`.', { topic: 'image' }),
        mc('Quality default', 'Default?', ['100', '75', '50', '60'], '75', 'Default 75 — bun balans.', { topic: 'image' }),
        mc('Sizes', 'Pentru?', ['Format', 'Responsive widths', 'Quality', 'Lazy'], 'Responsive widths', 'Hint pentru srcset.', { topic: 'image' }),
      ],
    },

    // ==================== 8. METADATA SEO ====================
    {
      slug: 'next-metadata',
      title: '8. Metadata și SEO',
      isFree: false,
      theory: `# 🏷️ Metadata și SEO

## Static metadata

\`\`\`jsx
// app/about/page.js
export const metadata = {
  title: 'Despre noi',
  description: 'Pagina despre',
};
\`\`\`

## Dynamic metadata

\`\`\`jsx
// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
\`\`\`

## Title template

\`\`\`jsx
// app/layout.js
export const metadata = {
  title: {
    template: '%s | Site',
    default: 'Site',
  },
};

// app/about/page.js
export const metadata = { title: 'Despre' };
// → "Despre | Site"
\`\`\`

## Open Graph

\`\`\`jsx
export const metadata = {
  openGraph: {
    title: 'Titlu',
    description: 'Descriere',
    images: ['/og.jpg'],
    url: 'https://site.com/page',
    type: 'website',
  },
};
\`\`\`

## Twitter Card

\`\`\`jsx
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Titlu',
    images: ['/twitter.jpg'],
  },
};
\`\`\`

## Robots

\`\`\`jsx
export const metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};
\`\`\`

## Icons / Favicon

\`\`\`jsx
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};
\`\`\`

Sau pune fișierul direct în \`app/\`:
- \`app/icon.png\`
- \`app/apple-icon.png\`
- \`app/favicon.ico\`

## Manifest

\`\`\`jsx
// app/manifest.js
export default function manifest() {
  return {
    name: 'My App',
    short_name: 'App',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  };
}
\`\`\`

## Sitemap

\`\`\`jsx
// app/sitemap.js
export default async function sitemap() {
  const posts = await getPosts();
  return [
    { url: 'https://site.com', lastModified: new Date() },
    ...posts.map(p => ({ url: \`https://site.com/blog/\${p.slug}\` })),
  ];
}
\`\`\`

## Robots.txt

\`\`\`jsx
// app/robots.js
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://site.com/sitemap.xml',
  };
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`metadata\` static sau \`generateMetadata\` dynamic
- ✅ Title template pentru consistență
- ✅ OpenGraph și Twitter Card
- ✅ \`sitemap.js\`, \`robots.js\` în \`app/\`
`,
      problems: [
        mc('Static metadata', 'Cum?', ['<head>', 'export const metadata', 'metadata.json', '<meta>'], 'export const metadata', 'Convenție.', { topic: 'metadata' }),
        mc('Dynamic metadata', 'Funcția?', ['getMetadata', 'generateMetadata', 'dynamicMetadata', 'metadata()'], 'generateMetadata', 'Async permisă.', { topic: 'metadata' }),
        sa('Title template', 'Variabilă în template? (%s)', '%s', 'Placeholder pentru title.', { topic: 'metadata' }),
        mc('OpenGraph', 'Pentru?', ['SEO', 'Social media share', 'PWA', 'Routing'], 'Social media share', 'Facebook, LinkedIn, etc.', { topic: 'metadata' }),
        mc('Sitemap location', 'Unde?', ['public/sitemap.xml', 'app/sitemap.js', 'sitemap.config', 'next.config'], 'app/sitemap.js', 'Convenție.', { topic: 'metadata' }),
        mc('Robots', 'Unde?', ['robots.txt manual', 'app/robots.js', 'config', 'next-robots'], 'app/robots.js', 'Generat automat.', { topic: 'metadata' }),
        mc('Manifest', 'Pentru?', ['Routing', 'PWA', 'SEO', 'Auth'], 'PWA', 'Progressive Web App.', { topic: 'metadata' }),
        mc('Icon convention', 'Fișier auto-detectat?', ['app/icon.png', 'public/favicon.ico', 'Ambele', 'Nimic'], 'Ambele', 'App router prinde ambele.', { topic: 'metadata' }),
        mc('Robots index false', 'Înseamnă?', ['Apare în Google', 'Nu apare în Google', 'Doar Bing', 'Random'], 'Nu apare în Google', 'Search engines ignoră.', { topic: 'metadata' }),
        mc('OG image', 'Pentru?', ['Avatar', 'Imagine la share social', 'Logo', 'Icon'], 'Imagine la share social', 'Apare în preview.', { topic: 'metadata' }),
      ],
    },

    // ==================== 9. LOADING & ERROR ====================
    {
      slug: 'next-loading-error',
      title: '9. Loading și Error UI',
      isFree: false,
      theory: `# ⏳ Loading și Error UI

## loading.js (Suspense)

UI care apare automat în timpul fetch-ului:

\`\`\`jsx
// app/blog/loading.js
export default function Loading() {
  return <p>Se încarcă...</p>;
}
\`\`\`

> 💡 Activat automat când \`page.js\` e async.

## Skeleton loader

\`\`\`jsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
    </div>
  );
}
\`\`\`

## error.js (Error Boundary)

UI la erori:

\`\`\`jsx
// app/blog/error.js
'use client';   // OBLIGATORIU client

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>A apărut o eroare!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Reîncearcă</button>
    </div>
  );
}
\`\`\`

> ⚠️ Error.js trebuie să fie **client component**.

## global-error.js

Pentru erori în root layout:

\`\`\`jsx
// app/global-error.js
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Eroare critică!</h2>
        <button onClick={reset}>Reîncearcă</button>
      </body>
    </html>
  );
}
\`\`\`

## not-found.js

Pentru 404:

\`\`\`jsx
// app/not-found.js
export default function NotFound() {
  return (
    <div>
      <h2>Pagina nu a fost găsită</h2>
      <Link href="/">Acasă</Link>
    </div>
  );
}
\`\`\`

## notFound() function

Triggerizezi 404 manual:

\`\`\`jsx
import { notFound } from 'next/navigation';

async function Page({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return <h1>{post.title}</h1>;
}
\`\`\`

## redirect()

\`\`\`jsx
import { redirect } from 'next/navigation';

async function Page() {
  const user = await getUser();
  if (!user) redirect('/login');
  return <Dashboard />;
}
\`\`\`

## Suspense manual

\`\`\`jsx
import { Suspense } from 'react';

<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
\`\`\`

## Streaming

Cu Suspense, partea statică se trimite imediat, restul streaming:

\`\`\`jsx
<div>
  <Header />
  <Suspense fallback={<Loading />}>
    <SlowFetch />
  </Suspense>
  <Footer />
</div>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`loading.js\` = Suspense fallback
- ✅ \`error.js\` = Error Boundary (client)
- ✅ \`not-found.js\` + \`notFound()\` pentru 404
- ✅ \`redirect()\` pentru redirecționare
- ✅ Streaming cu Suspense
`,
      problems: [
        mc('Loading.js', 'Trigger?', ['Manual', 'Automat când page e async', 'router', 'config'], 'Automat când page e async', 'Suspense automat.', { topic: 'loading' }),
        mc('Error.js', 'Trebuie?', ['Server', 'Client', 'Ambele', 'Niciun'], 'Client', '"use client" obligatoriu.', { topic: 'loading' }),
        sa('Reset prop', 'Funcția pentru retry? (reset)', 'reset', 'Primită ca prop.', { topic: 'loading' }),
        mc('notFound()', 'Din?', ['next/router', 'next/navigation', 'next/link', 'react'], 'next/navigation', 'Helper.', { topic: 'loading' }),
        mc('redirect()', 'Din?', ['react', 'next/navigation', 'next/router', 'next/link'], 'next/navigation', 'App Router.', { topic: 'loading' }),
        mc('Global error', 'Pentru?', ['Erori în root layout', 'Toate erorile', 'CSS', 'API'], 'Erori în root layout', 'Cele mai grave.', { topic: 'loading' }),
        mc('Streaming', 'Cu?', ['Suspense', 'fetch', 'router', 'CSS'], 'Suspense', 'Permite streaming HTML.', { topic: 'loading' }),
        mc('Not found custom', 'Fișier?', ['404.js', 'not-found.js', 'notfound.js', '_404.js'], 'not-found.js', 'Convenție.', { topic: 'loading' }),
        mc('Redirect type', 'redirect("/login")?', ['Returnează', 'Throw + execută redirect', 'Lent', 'Niciun efect'], 'Throw + execută redirect', 'Throws special.', { topic: 'loading' }),
        mc('Skeleton', 'Pentru?', ['Animație', 'UI placeholder durante load', 'Routing', 'Forms'], 'UI placeholder durante load', 'UX best practice.', { topic: 'loading' }),
      ],
    },

    // ==================== 10. DATA FETCHING ====================
    {
      slug: 'next-data-fetching',
      title: '10. Data Fetching',
      isFree: false,
      theory: `# 📡 Data Fetching

## Fetch în Server Components

\`\`\`jsx
// app/blog/page.js
async function BlogPage() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

> 💡 Fetch e extins cu caching automat în Next.js.

## Caching strategies

### Static (default)
\`\`\`jsx
fetch(url)   // cached forever (sau până la revalidate)
\`\`\`

### No cache (mereu fresh)
\`\`\`jsx
fetch(url, { cache: 'no-store' })
\`\`\`

### Revalidate every X seconds
\`\`\`jsx
fetch(url, { next: { revalidate: 60 } })  // re-fetch după 60s
\`\`\`

### Tags pentru revalidare manuală
\`\`\`jsx
fetch(url, { next: { tags: ['posts'] } })

// În altă parte:
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
\`\`\`

## Fetch direct la DB

\`\`\`jsx
import { prisma } from '@/lib/prisma';

async function Page() {
  const users = await prisma.user.findMany();
  return <UserList users={users} />;
}
\`\`\`

## Parallel fetching

\`\`\`jsx
async function Page() {
  // Pornesc în paralel
  const postsPromise = getPosts();
  const usersPromise = getUsers();

  const [posts, users] = await Promise.all([postsPromise, usersPromise]);
}
\`\`\`

## Sequential (când datele depind)

\`\`\`jsx
const post = await getPost(id);
const author = await getUser(post.authorId);
\`\`\`

## Suspense pentru loading parțial

\`\`\`jsx
<Suspense fallback={<Loading />}>
  <SlowComponent />
</Suspense>

<Suspense fallback={<Loading />}>
  <AnotherSlowComponent />
</Suspense>
\`\`\`

## ⚠️ NU face fetch în client component dacă poți

Folosește server components pentru date — sunt mai eficiente.

## Fetch în client component (când e necesar)

\`\`\`jsx
'use client';
import { useEffect, useState } from 'react';

function ClientFetch() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return data ? <div>{JSON.stringify(data)}</div> : <p>Loading...</p>;
}
\`\`\`

## Mai bine: SWR / TanStack Query

\`\`\`jsx
'use client';
import useSWR from 'swr';

function ClientData() {
  const { data, isLoading } = useSWR('/api/data', fetcher);
  if (isLoading) return <p>Loading...</p>;
  return <div>{data.name}</div>;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Fetch direct în Server Components
- ✅ Caching default; \`{ cache: 'no-store' }\` pentru fresh
- ✅ \`revalidate\` pentru ISR
- ✅ \`revalidateTag\` pentru on-demand
- ✅ \`Promise.all\` pentru parallel
`,
      problems: [
        mc('Server fetch', 'Cum?', ['useEffect', 'await fetch direct în async component', 'getServerSideProps', 'getStatic'], 'await fetch direct în async component', 'Cel mai simplu.', { topic: 'data' }),
        mc('No cache', 'Opțiune?', ['cache: no-store', 'fresh: true', 'cache: false', 'noCache'], 'cache: no-store', 'Standard.', { topic: 'data' }),
        sa('Revalidate 60s', 'Opțiune? (next: { revalidate: 60 })', 'next: { revalidate: 60 }', 'ISR option.', { topic: 'data' }),
        mc('Parallel', 'Pentru?', ['Faster fetch', 'Slower', 'Random', 'Caching'], 'Faster fetch', 'Pornesc simultan.', { topic: 'data' }),
        mc('Tag', 'Pentru on-demand revalidation?', ['next.tags', 'next: { tags: [] }', 'cacheTag', 'invalidateTag'], 'next: { tags: [] }', 'În opțiuni fetch.', { topic: 'data' }),
        mc('Direct DB', 'În server component?', ['Da', 'Nu', 'Doar build', 'Doar API'], 'Da', 'Fără API intermediar.', { topic: 'data' }),
        mc('Client fetch lib', 'Recomandat?', ['Axios', 'SWR/TanStack', 'fetch raw', 'XMLHttpRequest'], 'SWR/TanStack', 'Cu caching/revalidation.', { topic: 'data' }),
        mc('Promise.all', 'Pentru?', ['Sequential', 'Parallel', 'Caching', 'Routing'], 'Parallel', 'Toate pornesc, await final.', { topic: 'data' }),
        mc('Default cache', 'În Next 15?', ['Cache', 'No cache', 'Mixed', 'User decides'], 'No cache', 'În Next 15 default e no-store (schimbat din 14).', { topic: 'data' }),
        mc('useEffect fetch', 'Loc?', ['Server', 'Client', 'Layout', 'Page server'], 'Client', 'Doar client poate hooks.', { topic: 'data' }),
      ],
    },

    // ==================== 11. NAVIGATION HOOKS ====================
    {
      slug: 'next-navigation-hooks',
      title: '11. Hooks navigation (usePathname, useSearchParams)',
      isFree: false,
      theory: `# 🎣 Navigation Hooks

> Toate din \`'next/navigation'\` (App Router).
> ⚠️ Doar în client components!

## useRouter

\`\`\`jsx
'use client';
import { useRouter } from 'next/navigation';

function Btn() {
  const router = useRouter();
  return <button onClick={() => router.push('/about')}>Go</button>;
}
\`\`\`

Metode:
- \`push(url)\`
- \`replace(url)\`
- \`back()\`
- \`forward()\`
- \`refresh()\`
- \`prefetch(url)\`

## usePathname

URL-ul curent (fără query/hash):

\`\`\`jsx
'use client';
import { usePathname } from 'next/navigation';

function Component() {
  const pathname = usePathname();   // ex: '/blog/123'
  return <p>Sunt pe: {pathname}</p>;
}
\`\`\`

## useSearchParams

Pentru \`?key=value\`:

\`\`\`jsx
'use client';
import { useSearchParams } from 'next/navigation';

function Search() {
  const sp = useSearchParams();
  const q = sp.get('q');           // string sau null
  const page = sp.get('page') ?? '1';

  return <p>Cauți: {q}</p>;
}
\`\`\`

## Modificare search params

\`\`\`jsx
'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function setSort(value) {
    const params = new URLSearchParams(sp);
    params.set('sort', value);
    router.push(\`\${pathname}?\${params.toString()}\`);
  }

  return (
    <select onChange={e => setSort(e.target.value)}>
      <option value="asc">Asc</option>
      <option value="desc">Desc</option>
    </select>
  );
}
\`\`\`

## useParams

Pentru rute dinamice:

\`\`\`jsx
// app/blog/[slug]/comments/[commentId]/page.js
'use client';
import { useParams } from 'next/navigation';

function Component() {
  const params = useParams();   // { slug: '...', commentId: '...' }
}
\`\`\`

## useSelectedLayoutSegment / Segments

\`\`\`jsx
import { useSelectedLayoutSegment } from 'next/navigation';

function Nav() {
  const segment = useSelectedLayoutSegment();
  // ex: dacă URL e /dashboard/settings, segment = 'settings'
}
\`\`\`

## Pattern: NavLink active

\`\`\`jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={active ? 'text-blue-500 font-bold' : 'text-gray-600'}
    >
      {children}
    </Link>
  );
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`useRouter\` pentru programatic navigation
- ✅ \`usePathname\` pentru URL curent
- ✅ \`useSearchParams\` pentru query string
- ✅ \`useParams\` pentru rute dinamice
- ✅ Toate doar în CLIENT components
`,
      problems: [
        mc('Hooks din', 'Package?', ['next/router', 'next/navigation', 'react-router', 'next-hooks'], 'next/navigation', 'App Router.', { topic: 'nav-hooks' }),
        mc('Numai în', 'Server sau client?', ['Server', 'Client', 'Ambele', 'Layout'], 'Client', 'Hooks = client only.', { topic: 'nav-hooks' }),
        sa('URL curent hook', '? (usePathname)', 'usePathname', 'Returns string path.', { topic: 'nav-hooks' }),
        mc('Get search param', 'Cum?', ['searchParams.q', 'sp.get("q")', 'sp["q"]', 'sp.q'], 'sp.get("q")', '`URLSearchParams` API.', { topic: 'nav-hooks' }),
        mc('useParams', 'Pentru?', ['Search', 'Rute dinamice', 'Pathname', 'Cookies'], 'Rute dinamice', 'Pentru [slug] etc.', { topic: 'nav-hooks' }),
        mc('Push URL', 'Metodă?', ['router.go', 'router.push', 'router.set', 'navigate'], 'router.push', 'Standard.', { topic: 'nav-hooks' }),
        mc('Refresh', 'Re-fetch RSC fără full reload?', ['router.reload', 'router.refresh', 'window.reload', 'router.update'], 'router.refresh', 'Soft refresh.', { topic: 'nav-hooks' }),
        mc('Active link', 'Pentru "active" class?', ['useState', 'usePathname comparat', 'router.is', 'config'], 'usePathname comparat', 'Pattern uzual.', { topic: 'nav-hooks' }),
        mc('Selected segment', 'Hook?', ['useSegment', 'useSelectedLayoutSegment', 'useRoute', 'usePath'], 'useSelectedLayoutSegment', 'Specific App Router.', { topic: 'nav-hooks' }),
        mc('Get all params', 'sp = useSearchParams. Care return?', ['Object', 'URLSearchParams instance', 'Array', 'Map'], 'URLSearchParams instance', 'Cu .get(), .entries(), etc.', { topic: 'nav-hooks' }),
      ],
    },

    // ==================== 12. CSS / STYLING ====================
    {
      slug: 'next-styling',
      title: '12. CSS și Styling în Next.js',
      isFree: false,
      theory: `# 🎨 CSS în Next.js

## Global CSS

\`\`\`css
/* app/globals.css */
body { font-family: sans-serif; }
\`\`\`

\`\`\`jsx
// app/layout.js
import './globals.css';
\`\`\`

> ⚠️ Global CSS doar în root layout!

## CSS Modules

\`\`\`css
/* app/about/page.module.css */
.title { color: red; }
\`\`\`

\`\`\`jsx
// app/about/page.js
import styles from './page.module.css';

export default function About() {
  return <h1 className={styles.title}>Despre</h1>;
}
\`\`\`

> 💡 Scope local — fără conflicte de nume.

## Tailwind CSS

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

\`\`\`css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

\`\`\`jsx
<div className="bg-blue-500 text-white p-4 rounded">Hello</div>
\`\`\`

## CSS-in-JS (cu cuvenire)

⚠️ În App Router (RSC), majoritatea librăriilor CSS-in-JS NU funcționează direct în server components. Folosește cu \`'use client'\`.

Compatible: \`styled-components\`, \`emotion\` cu setup special.

## CSS Variables

\`\`\`css
:root {
  --primary: #3b82f6;
  --secondary: #f59e0b;
}

.btn {
  background: var(--primary);
}
\`\`\`

## Sass/SCSS

\`\`\`bash
npm install sass
\`\`\`

Apoi importi \`.scss\` direct.

## clsx pentru clase condiționale

\`\`\`jsx
import clsx from 'clsx';

<div className={clsx('base', active && 'bg-blue-500')}>
\`\`\`

## Theme/Dark mode

Cu Tailwind:
\`\`\`html
<html className="dark">
  <body className="bg-white dark:bg-gray-900">...</body>
</html>
\`\`\`

## next/font (custom fonts)

\`\`\`jsx
// app/layout.js
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Local fonts

\`\`\`jsx
import localFont from 'next/font/local';

const myFont = localFont({ src: './my-font.woff2' });
\`\`\`

## 🎓 Ce ai învățat
- ✅ Global CSS doar în root layout
- ✅ CSS Modules pentru scope local
- ✅ Tailwind = recomandat
- ✅ \`next/font\` pentru fonts optimizate
`,
      problems: [
        mc('Global CSS', 'Unde import?', ['Orice page', 'Doar root layout', 'config', 'public'], 'Doar root layout', 'Restricție Next.js.', { topic: 'styling' }),
        mc('CSS Module', 'Extensie?', ['.css', '.module.css', '.scss', '.css.module'], '.module.css', 'Convenție.', { topic: 'styling' }),
        sa('Tailwind init', 'Comandă? (npx tailwindcss init -p)', 'npx tailwindcss init -p', 'Cu PostCSS.', { topic: 'styling' }),
        mc('Font Google', 'Import?', ['next/font/google', 'google-fonts', 'next-font', 'next/google'], 'next/font/google', 'Standard.', { topic: 'styling' }),
        mc('CSS-in-JS în RSC', 'Compatibil?', ['Toate', 'Majoritatea NU direct', 'Doar styled', 'Doar emotion'], 'Majoritatea NU direct', 'Necesită setup special.', { topic: 'styling' }),
        mc('clsx', 'Pentru?', ['Animații', 'Clase condiționale', 'Routing', 'Forms'], 'Clase condiționale', 'Combinare.', { topic: 'styling' }),
        mc('SCSS', 'Cum?', ['Inclus', 'npm install sass', 'config', 'plugin'], 'npm install sass', 'Doar install.', { topic: 'styling' }),
        mc('Tailwind dark', 'Cum?', ['dark: prefix', 'darkMode prop', '@dark', 'Toate'], 'dark: prefix', 'Cu darkMode "class" în config.', { topic: 'styling' }),
        mc('Local font', 'Import?', ['next/font/local', 'next-local-font', 'fs', 'public'], 'next/font/local', 'Standard.', { topic: 'styling' }),
        mc('Module class', 'Folosire?', ['styles.title', 'styles["title"]', '.title', 'Ambele A și B'], 'Ambele A și B', 'Object access.', { topic: 'styling' }),
      ],
    },

    // ==================== 13. CLIENT INTERACTIVITY ====================
    {
      slug: 'next-client-interactivity',
      title: '13. Interactivitate Client (Forms, State)',
      isFree: false,
      theory: `# 🖱️ Interactivitate

## Component cu state

\`\`\`jsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return (
    <button onClick={() => setN(n + 1)}>
      {n}
    </button>
  );
}
\`\`\`

## Form simplu

\`\`\`jsx
'use client';
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert(\`Hello \${name}\`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button>Send</button>
    </form>
  );
}
\`\`\`

## Form cu fetch

\`\`\`jsx
'use client';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={loading}>{loading ? '...' : 'Login'}</button>
    </form>
  );
}
\`\`\`

## Server Actions (preferate!)

\`\`\`jsx
// app/actions.js
'use server';

export async function createPost(formData) {
  const title = formData.get('title');
  await db.post.create({ data: { title } });
}

// app/page.js
import { createPost } from './actions';

export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button>Create</button>
    </form>
  );
}
\`\`\`

> 💡 Server Actions = funcții ce rulează pe server, apelate direct din JSX.

## useFormStatus (React 19)

\`\`\`jsx
'use client';
import { useFormStatus } from 'react-dom';

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? '...' : 'Send'}</button>;
}
\`\`\`

## useTransition

\`\`\`jsx
'use client';
import { useTransition } from 'react';

function Component() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await someServerAction();
    });
  }
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ State + onClick = interactivitate basic
- ✅ Forms cu \`onSubmit\` și \`preventDefault\`
- ✅ Server Actions = nu mai ai nevoie de API routes
- ✅ \`useFormStatus\` pentru pending state
`,
      problems: [
        mc('Use client', 'Pentru?', ['Server', 'State + events', 'Routing', 'CSS'], 'State + events', 'Hooks + interactivity.', { topic: 'interact' }),
        mc('Server Actions', 'Marcare?', ['"use server"', '"use action"', 'export async', 'Niciuna'], '"use server"', 'Directive.', { topic: 'interact' }),
        sa('Form action', 'Atribut form pentru server action? (action)', 'action', 'În loc de onSubmit.', { topic: 'interact' }),
        mc('useFormStatus', 'Din?', ['react', 'react-dom', 'next', 'next/form'], 'react-dom', 'Specific la forms.', { topic: 'interact' }),
        mc('Pending state', 'Hook?', ['useFormStatus', 'useStatus', 'useFormState', 'usePending'], 'useFormStatus', 'Standard.', { topic: 'interact' }),
        mc('PreventDefault', 'În form classic?', ['Întotdeauna', 'Niciodată', 'Doar la submit', 'Doar la button'], 'Doar la submit', 'Pentru a evita reload.', { topic: 'interact' }),
        mc('useTransition', 'Pentru?', ['CSS', 'Async fără block UI', 'Routing', 'Forms'], 'Async fără block UI', 'Concurrent rendering.', { topic: 'interact' }),
        mc('FormData', 'Constructor?', ['new FormData(form)', 'FormData()', 'getFormData', 'form.data'], 'new FormData(form)', 'Standard browser API.', { topic: 'interact' }),
        mc('Server actions vantaj', 'Față de fetch?', ['Mai lent', 'Type-safe + integrare directă', 'CSS', 'Niciun'], 'Type-safe + integrare directă', 'Fără API endpoint.', { topic: 'interact' }),
        mc('Form API', 'Server action poate primi?', ['Doar string', 'FormData', 'Doar JSON', 'Promise'], 'FormData', 'Standard browser.', { topic: 'interact' }),
      ],
    },

    // ==================== 14. NESTED ROUTES ====================
    {
      slug: 'next-nested-routes',
      title: '14. Nested routes și Route Groups',
      isFree: false,
      theory: `# 📂 Nested Routes & Route Groups

## Nested routes

\`\`\`
app/
  dashboard/
    layout.js
    page.js                  → /dashboard
    settings/
      page.js                → /dashboard/settings
      profile/
        page.js              → /dashboard/settings/profile
\`\`\`

Layout-urile se compun:
- \`app/layout.js\` (root) wraps everything
- \`app/dashboard/layout.js\` wraps /dashboard/*

## Route Groups (paranteze)

Folosești \`(name)\` pentru a grupa fără a afecta URL:

\`\`\`
app/
  (marketing)/
    layout.js
    about/page.js     → /about
    contact/page.js   → /contact
  (app)/
    layout.js
    dashboard/page.js → /dashboard
    settings/page.js  → /settings
\`\`\`

> 💡 Două layout-uri diferite, niciun \`/marketing\` sau \`/app\` în URL.

## Pattern: marketing vs app

\`\`\`
app/
  (marketing)/
    layout.js          ← Header public, footer
    page.js            → /
    pricing/page.js    → /pricing
  (app)/
    layout.js          ← Sidebar dashboard
    dashboard/page.js  → /dashboard
\`\`\`

## Multiple root layouts

Pentru layout-uri **complet diferite** (chiar și \`<html>\`):

\`\`\`
app/
  (marketing)/
    layout.js          ← <html><body>...
    page.js
  (app)/
    layout.js          ← <html><body>... (DIFERIT)
    dashboard/page.js
\`\`\`

> ⚠️ Roor app/layout.js NU poate exista în acest caz.

## Parallel routes (@slot)

\`\`\`
app/
  layout.js
  @analytics/
    page.js
  @team/
    page.js
\`\`\`

\`\`\`jsx
// app/layout.js
export default function Layout({ children, analytics, team }) {
  return (
    <>
      {children}
      <div className="grid grid-cols-2">
        {analytics}
        {team}
      </div>
    </>
  );
}
\`\`\`

## Intercepting routes

\`(.)\`, \`(..)\`, \`(...)\` pentru intercepție:

\`\`\`
app/feed/page.js              → /feed
app/photo/[id]/page.js        → /photo/123
app/feed/(..)photo/[id]/page.js → modal când navighezi de la /feed
\`\`\`

Pattern util pentru: modale, sidebar pop-ups.

## Default.js

Pentru parallel routes când slot-ul nu are match:

\`\`\`jsx
// app/@analytics/default.js
export default function Default() {
  return null;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Nested routes prin foldere
- ✅ Route groups \`(name)\` — nu apar în URL
- ✅ Parallel routes \`@slot\`
- ✅ Intercepting routes pentru modale
`,
      problems: [
        mc('Route group sintaxa', 'Care?', ['[name]', '(name)', '{name}', '@name'], '(name)', 'Paranteze rotunde.', { topic: 'nested' }),
        mc('Affect URL?', '(marketing)/about?', ['/marketing/about', '/about', 'Crash', 'Random'], '/about', 'Group nu afectează URL.', { topic: 'nested' }),
        sa('Parallel slot', 'Sintaxa? (@slot)', '@slot', 'Prefix @.', { topic: 'nested' }),
        mc('Intercepting', 'Sintaxa?', ['(.)', '[.]', '..', 'all'], '(.)', 'Convenție Next.js.', { topic: 'nested' }),
        mc('Pattern modal', 'Cu ce?', ['layout', 'parallel routes', 'intercepting routes', 'router.push'], 'intercepting routes', 'Pattern modal Instagram-like.', { topic: 'nested' }),
        mc('Default.js', 'Pentru?', ['Pagini lipsă', 'Parallel routes fallback', 'Erori', '404'], 'Parallel routes fallback', 'Slot fără match.', { topic: 'nested' }),
        mc('Multiple roots', 'Două (group)/layout cu html?', ['Imposibil', 'Posibil — dacă nu există root layout', 'Doar dev', 'Doar production'], 'Posibil — dacă nu există root layout', 'Pattern.', { topic: 'nested' }),
        mc('Layout compose', 'Layout-uri se compun?', ['Da', 'Nu', 'Doar root', 'Doar leaf'], 'Da', 'Înlănțuit.', { topic: 'nested' }),
        mc('Catch up', '(...)?', ['Catch all', 'Intercept de la root', 'Group', 'Slot'], 'Intercept de la root', 'Convenție.', { topic: 'nested' }),
        mc('@slot prop', 'Layout primește?', ['Doar children', 'children + slot ca prop', 'Nimic', 'Slot ca string'], 'children + slot ca prop', 'Auto-injected.', { topic: 'nested' }),
      ],
    },

    // ==================== 15-25 ====================

    {
      slug: 'next-context-providers',
      title: '15. Context Providers în App Router',
      isFree: false,
      theory: `# 🌐 Context Providers

## Provider trebuie să fie CLIENT

\`\`\`jsx
// app/providers.js
'use client';
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
\`\`\`

## Folosire în root layout

\`\`\`jsx
// app/layout.js (server)
import { ThemeProvider } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
\`\`\`

## Multiple providers

\`\`\`jsx
'use client';
export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
\`\`\`

## Folosire în client component

\`\`\`jsx
'use client';
import { useTheme } from '@/app/providers';

function Toggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme}
    </button>
  );
}
\`\`\`

## ⚠️ Server components NU pot useContext

Trebuie să faci wrap în client component sau primești date prin props.

## Library populare

- **Zustand** — state management simplu
- **Jotai** — atomic state
- **Redux Toolkit** — pentru aplicații complexe
- **TanStack Query** — server state caching

## Zustand exemplu

\`\`\`jsx
'use client';
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}));

function Counter() {
  const { count, inc } = useStore();
  return <button onClick={inc}>{count}</button>;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Provider = client component
- ✅ Wrap în root layout cu \`{ children }\`
- ✅ Server components nu pot useContext
- ✅ Alternative: Zustand, Jotai pentru global state
`,
      problems: [
        mc('Provider', 'Tip?', ['Server', 'Client', 'Layout', 'Page'], 'Client', '"use client" obligatoriu.', { topic: 'context' }),
        mc('createContext', 'Din?', ['next', 'react', 'next-context', 'context-api'], 'react', 'React API.', { topic: 'context' }),
        sa('Hook context', '? (useContext)', 'useContext', 'React standard.', { topic: 'context' }),
        mc('Server component cu context', 'Permis?', ['Da', 'Nu', 'Doar read', 'Doar write'], 'Nu', 'Doar client poate hooks.', { topic: 'context' }),
        mc('Zustand', 'Tip?', ['CSS', 'State management', 'Routing', 'Auth'], 'State management', 'Alternativă context.', { topic: 'context' }),
        mc('Wrap layout', 'Provider în?', ['page', 'layout', 'config', 'middleware'], 'layout', 'Pentru a wrap copiii.', { topic: 'context' }),
        mc('Multiple providers', 'Cum?', ['Nested', 'Array', 'Combine', 'Imposibil'], 'Nested', 'Wrap unul în altul.', { topic: 'context' }),
        mc('Server props', 'Cum trimiți date la client?', ['context', 'props', 'localStorage', 'cookie'], 'props', 'Pasezi din server.', { topic: 'context' }),
        mc('TanStack Query', 'Pentru?', ['Routing', 'Server state caching', 'Forms', 'Auth'], 'Server state caching', 'Cache + revalidation.', { topic: 'context' }),
        mc('Jotai', 'Tip?', ['Atomic state', 'Routing', 'CSS', 'Auth'], 'Atomic state', 'Atom-based state.', { topic: 'context' }),
      ],
    },

    {
      slug: 'next-middleware',
      title: '16. Middleware (frontend perspective)',
      isFree: false,
      theory: `# 🛡️ Middleware

## Ce e?

Cod care rulează **înainte** de orice request — pentru:
- Auth checks
- Redirects
- Rewrite URL
- Cookies / headers

## Locație

\`\`\`
middleware.js   ← root, NU în app/
\`\`\`

## Exemplu basic

\`\`\`jsx
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAuth = request.cookies.get('token');

  if (!isAuth && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
\`\`\`

## NextResponse metode

\`\`\`jsx
NextResponse.next()                              // continuă
NextResponse.redirect(url)                       // redirect
NextResponse.rewrite(url)                        // rewrite (URL diferit)
NextResponse.json({ ok: false }, { status: 401 }) // răspuns direct
\`\`\`

## Headers

\`\`\`jsx
const response = NextResponse.next();
response.headers.set('x-custom', 'value');
return response;
\`\`\`

## Cookies

\`\`\`jsx
// Citește
const token = request.cookies.get('token')?.value;

// Setează
response.cookies.set('user', 'john', { httpOnly: true });

// Șterge
response.cookies.delete('user');
\`\`\`

## Matcher (ce URL-uri)

\`\`\`jsx
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',  // exclude
  ],
};
\`\`\`

## Pattern: locale detection

\`\`\`jsx
export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/en') || pathname.startsWith('/ro')) return;

  const locale = request.headers.get('accept-language')?.includes('ro') ? 'ro' : 'en';
  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}
\`\`\`

## Pattern: rate limiting (simplu)

\`\`\`jsx
const ipMap = new Map();

export function middleware(request) {
  const ip = request.ip || 'unknown';
  const count = ipMap.get(ip) || 0;
  if (count > 100) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }
  ipMap.set(ip, count + 1);
  return NextResponse.next();
}
\`\`\`

## ⚠️ Middleware rulează pe Edge Runtime

Limitat: NU \`fs\`, NU dependențe Node-only.

## 🎓 Ce ai învățat
- ✅ \`middleware.js\` la root
- ✅ \`NextResponse\` pentru control
- ✅ \`config.matcher\` pentru filter URL
- ✅ Rulează pe Edge — limitări runtime
`,
      problems: [
        mc('Locație', 'Unde?', ['app/middleware.js', 'middleware.js root', 'pages/middleware', 'config'], 'middleware.js root', 'Root project.', { topic: 'mw' }),
        mc('Continuă', 'Metodă?', ['NextResponse.go()', 'NextResponse.next()', 'continue', 'NextResponse.continue()'], 'NextResponse.next()', 'Standard.', { topic: 'mw' }),
        sa('Redirect', 'Metodă? (NextResponse.redirect)', 'NextResponse.redirect', 'Cu URL.', { topic: 'mw' }),
        mc('Matcher', 'Pentru?', ['Toate URLs', 'Filter URL-uri', 'Auth', 'Cache'], 'Filter URL-uri', 'Pattern matching.', { topic: 'mw' }),
        mc('Runtime', 'Pe?', ['Node', 'Edge', 'Browser', 'Worker'], 'Edge', 'Edge Runtime.', { topic: 'mw' }),
        mc('Cookies citire', 'Metodă?', ['cookies.read', 'cookies.get', 'getCookie', 'request.cookie'], 'cookies.get', 'Standard API.', { topic: 'mw' }),
        mc('Cookies set pe', 'Unde?', ['Request', 'Response', 'Ambele', 'Niciun'], 'Response', 'Set pe response, citește din request.', { topic: 'mw' }),
        mc('Rewrite', 'Diferit de redirect?', ['Identice', 'Rewrite păstrează URL afișat', 'Nu există', 'Doar status'], 'Rewrite păstrează URL afișat', 'Internal routing.', { topic: 'mw' }),
        mc('Auth check', 'Pattern uzual?', ['Page-by-page', 'Middleware', 'config', 'Layout'], 'Middleware', 'Mai eficient.', { topic: 'mw' }),
        mc('Locale', 'Util pentru?', ['CSS', 'i18n redirects', 'Auth', 'Forms'], 'i18n redirects', 'Pattern internaționalizare.', { topic: 'mw' }),
      ],
    },

    {
      slug: 'next-streaming',
      title: '17. Streaming și Suspense',
      isFree: false,
      theory: `# 🌊 Streaming

## Ce e?

În loc să aștepți tot HTML-ul, **trimiți pe părți** pe măsură ce sunt gata.

## Beneficii

- ⚡ TTFB rapid (Time To First Byte)
- 📊 Conținut critic apare primul
- 🎨 Loading UI pentru părți lente

## Exemplu basic

\`\`\`jsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />          {/* Apare imediat */}
      <Suspense fallback={<Loading />}>
        <SlowSection />   {/* Streaming */}
      </Suspense>
      <Footer />          {/* Apare imediat */}
    </div>
  );
}

async function SlowSection() {
  const data = await slowFetch();   // 2 secunde
  return <Section data={data} />;
}
\`\`\`

## Multiple Suspense (parallel)

\`\`\`jsx
<div>
  <Suspense fallback={<Skeleton1 />}>
    <SlowComponent1 />
  </Suspense>
  <Suspense fallback={<Skeleton2 />}>
    <SlowComponent2 />
  </Suspense>
</div>
\`\`\`

> 💡 Ambele se streaming în paralel.

## loading.js (Suspense automat)

\`\`\`jsx
// app/blog/loading.js
export default function Loading() {
  return <Skeleton />;
}
\`\`\`

## Skeleton elaborat

\`\`\`jsx
export default function Loading() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
\`\`\`

## Anti-pattern: nu folosi await unnecessar

❌ Așteptarea în component părinte
\`\`\`jsx
async function Page() {
  const a = await slowFetch();   // blochează tot
  return <SlowList data={a} />;
}
\`\`\`

✅ Streaming
\`\`\`jsx
function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowList />
    </Suspense>
  );
}
\`\`\`

## Streaming + cu API external lent

\`\`\`jsx
async function Comments() {
  const c = await fetch('https://slow.api/comments');
  return <CommentList data={await c.json()} />;
}

// În page:
<Suspense fallback={<p>Loading comments...</p>}>
  <Comments />
</Suspense>
\`\`\`

## 🎓 Ce ai învățat
- ✅ Streaming = HTML pe părți
- ✅ Suspense = boundary pentru loading
- ✅ TTFB rapid + UX mai bun
- ✅ \`loading.js\` = Suspense automat la nivel page
`,
      problems: [
        mc('Streaming benefit', 'Care?', ['Mai mult HTML', 'TTFB rapid + parțial', 'CSS', 'Routing'], 'TTFB rapid + parțial', 'Apare progresiv.', { topic: 'stream' }),
        mc('Suspense fallback', 'Pentru?', ['Eroare', 'Loading UI', 'Routing', 'CSS'], 'Loading UI', 'Vizual durante load.', { topic: 'stream' }),
        sa('Suspense din', 'Package? (react)', 'react', 'React API.', { topic: 'stream' }),
        mc('Multiple Suspense', 'În paralel?', ['Da', 'Nu', 'Sequential', 'Random'], 'Da', 'Independente.', { topic: 'stream' }),
        mc('loading.js', 'Echivalent?', ['Manual Suspense', 'Auto Suspense', 'Error', 'Layout'], 'Auto Suspense', 'Wrapping automat.', { topic: 'stream' }),
        mc('Block întreg', 'Cum?', ['Suspense', 'await în page direct', 'Streaming', 'Skeleton'], 'await în page direct', 'Așteaptă tot.', { topic: 'stream' }),
        mc('Skeleton', 'Pentru UX?', ['Mai bun decât gol', 'Crash', 'Mai lent', 'CSS only'], 'Mai bun decât gol', 'Vizual percepție.', { topic: 'stream' }),
        mc('Server side stream', 'Necesită?', ['SSR + Suspense', 'CSR', 'JSON', 'Webpack'], 'SSR + Suspense', 'React 18+.', { topic: 'stream' }),
        mc('Pattern slow API', 'Recomandat?', ['Block tot', 'Wrap în Suspense', 'Skip', 'Cache'], 'Wrap în Suspense', 'UX optim.', { topic: 'stream' }),
        mc('TTFB', 'Înseamnă?', ['Time To First Byte', 'Total Time For Build', 'TopToBottom Function', 'Time Tracking'], 'Time To First Byte', 'Performance metric.', { topic: 'stream' }),
      ],
    },

    {
      slug: 'next-fonts-icons',
      title: '18. Fonts și Icons',
      isFree: false,
      theory: `# 🔤 Fonts și Icons

## Google Fonts (next/font/google)

\`\`\`jsx
// app/layout.js
import { Inter, Roboto, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export default function Layout({ children }) {
  return (
    <html className={\`\${inter.className} \${playfair.variable}\`}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Avantaje

- ⚡ Auto-host (no external request)
- 🎨 Variable fonts
- 📦 Subset only — bundle mic
- 🛡️ Zero CLS (fontul corect imediat)

## Local fonts

\`\`\`jsx
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    { path: './my-font.woff2', weight: '400', style: 'normal' },
    { path: './my-font-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-custom',
});
\`\`\`

## Folosire

\`\`\`html
<h1 className={inter.className}>Inter</h1>
<h1 style={{ fontFamily: 'var(--font-playfair)' }}>Playfair</h1>
\`\`\`

## Cu Tailwind

\`\`\`js
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)'],
      display: ['var(--font-playfair)'],
    },
  },
},
\`\`\`

\`\`\`html
<h1 class="font-display">Cool Title</h1>
\`\`\`

## Icons — librării populare

### Lucide React (recomandat)
\`\`\`bash
npm install lucide-react
\`\`\`

\`\`\`jsx
import { Search, Menu, X } from 'lucide-react';

<Search className="w-5 h-5" />
\`\`\`

### React Icons
\`\`\`jsx
import { FaGithub, FaTwitter } from 'react-icons/fa';

<FaGithub size={24} />
\`\`\`

### Heroicons
\`\`\`jsx
import { HomeIcon } from '@heroicons/react/24/outline';

<HomeIcon className="w-6 h-6" />
\`\`\`

## SVG inline

\`\`\`jsx
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path d="..." />
</svg>
\`\`\`

## SVG ca componentă

\`\`\`jsx
// app/icons/logo.js
export default function Logo({ className }) {
  return <svg className={className}>...</svg>;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`next/font/google\` pentru fonts optimizate
- ✅ \`next/font/local\` pentru fonts custom
- ✅ Variable fonts cu CSS variables
- ✅ Lucide / Heroicons pentru icons
`,
      problems: [
        mc('Google fonts', 'Import?', ['next/font/google', 'next/google', 'google-fonts', 'next-google'], 'next/font/google', 'Standard.', { topic: 'fonts' }),
        mc('Auto host', 'Avantaj fonts?', ['Mai lent', 'Auto-host (no external)', 'CSS', 'Doar dev'], 'Auto-host (no external)', 'Privacy + speed.', { topic: 'fonts' }),
        sa('Local font', 'Import? (next/font/local)', 'next/font/local', 'Pentru fonts proprii.', { topic: 'fonts' }),
        mc('Variable', 'CSS variable?', ['variable: "--name"', 'css: name', 'var: name', 'name'], 'variable: "--name"', 'În config.', { topic: 'fonts' }),
        mc('Lucide', 'Tip?', ['CSS', 'Icon library', 'Routing', 'Forms'], 'Icon library', 'Modern, lightweight.', { topic: 'fonts' }),
        mc('Heroicons import', 'Pattern?', ['@heroicons/react/24/outline', 'heroicons', 'icons/heroicons', 'react-heroicons'], '@heroicons/react/24/outline', 'Standard.', { topic: 'fonts' }),
        mc('SVG currentColor', 'Pentru?', ['Color hardcodat', 'Moștenește din CSS', 'Random', 'Default'], 'Moștenește din CSS', 'Util pentru Tailwind text-color.', { topic: 'fonts' }),
        mc('CLS', 'Cu next/font?', ['Mare', 'Zero', 'Random', 'Doar dev'], 'Zero', 'Font preload corect.', { topic: 'fonts' }),
        mc('Subset', 'Pentru?', ['Bundle mai mic', 'Mai mare', 'CSS', 'Routing'], 'Bundle mai mic', 'Doar caractere necesare.', { topic: 'fonts' }),
        mc('Display swap', 'Pentru?', ['CSS', 'Show fallback până font-ul se încarcă', 'Routing', 'Animation'], 'Show fallback până font-ul se încarcă', 'No invisible text.', { topic: 'fonts' }),
      ],
    },

    {
      slug: 'next-environment',
      title: '19. Environment Variables',
      isFree: false,
      theory: `# 🔐 Environment Variables

## Fișiere

| Fișier | Folosit pentru |
|---|---|
| \`.env\` | toate environments |
| \`.env.local\` | local (NU commit!) |
| \`.env.development\` | dev only |
| \`.env.production\` | prod only |

## Sintaxa

\`\`\`bash
# .env.local
DATABASE_URL=postgres://localhost/db
API_SECRET=super_secret_key
\`\`\`

## Acces în SERVER

\`\`\`jsx
// Server component, route handler, server action
const url = process.env.DATABASE_URL;
\`\`\`

## Acces în CLIENT (prefix \`NEXT_PUBLIC_\`)

\`\`\`bash
NEXT_PUBLIC_API_URL=https://api.example.com
\`\`\`

\`\`\`jsx
'use client';
const url = process.env.NEXT_PUBLIC_API_URL;   // ✅ funcționează
\`\`\`

## ⚠️ NU expune secrets

\`\`\`bash
# ❌ GREȘIT — apare în bundle client
NEXT_PUBLIC_API_SECRET=secret_123

# ✅ CORECT — server only
API_SECRET=secret_123
\`\`\`

## Cum verifici?

În production build, Next afișează ce variabile sunt **inlined** (NEXT_PUBLIC).

## .gitignore

\`\`\`
.env*.local
\`\`\`

## env în Vercel

Settings → Environment Variables (Dev/Preview/Production).

## Validare cu zod (recomandat)

\`\`\`js
// env.js
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
\`\`\`

\`\`\`jsx
import { env } from '@/env';
const url = env.DATABASE_URL;   // type-safe!
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`.env.local\` pentru secrets local
- ✅ \`NEXT_PUBLIC_\` prefix = client visible
- ✅ Server-only fără prefix = secret
- ✅ Validare cu zod = type-safe
`,
      problems: [
        mc('Client visible prefix', 'Care?', ['NEXT_PUBLIC_', 'CLIENT_', 'PUBLIC_', 'NEXT_CLIENT_'], 'NEXT_PUBLIC_', 'Convenție Next.js.', { topic: 'env' }),
        mc('Local file', 'Care?', ['.env', '.env.local', '.env.dev', 'env.json'], '.env.local', 'Pentru secrete locale.', { topic: 'env' }),
        sa('Acces variabilă', 'În cod? (process.env.NUME)', 'process.env.NUME', 'Standard Node.', { topic: 'env' }),
        mc('Secret expunere', 'Greșeală?', ['NEXT_PUBLIC_SECRET', 'API_SECRET', 'DATABASE_URL', 'B și C'], 'NEXT_PUBLIC_SECRET', 'Apare în client bundle.', { topic: 'env' }),
        mc('Server only', 'Fără prefix?', ['Vizibil client', 'Doar server', 'Random', 'Crash'], 'Doar server', 'Sigur.', { topic: 'env' }),
        mc('Gitignore', 'Care?', ['.env', '.env.local', 'Toate', 'Niciun'], '.env.local', '.env public OK uneori, local NU.', { topic: 'env' }),
        mc('Validare', 'Lib?', ['zod', 'yup', 'joi', 'Toate'], 'Toate', 'Toate funcționează; zod popular.', { topic: 'env' }),
        mc('Vercel env', 'Locul?', ['File', 'Settings dashboard', 'CLI', 'B și C'], 'B și C', 'Dashboard sau vercel CLI.', { topic: 'env' }),
        mc('Type-safe', 'Cu?', ['process.env direct', 'Schema validation', 'console.log', 'String'], 'Schema validation', 'TypeScript + zod.', { topic: 'env' }),
        mc('Build time', 'NEXT_PUBLIC se inlinează când?', ['Build time', 'Runtime', 'Niciodată', 'Prima request'], 'Build time', 'Inlined în bundle.', { topic: 'env' }),
      ],
    },

    {
      slug: 'next-public-static',
      title: '20. Public assets și fișiere statice',
      isFree: false,
      theory: `# 📂 Public folder

## Folder public/

Tot ce e în \`public/\` e accesibil direct la URL:

\`\`\`
public/
  logo.png         → /logo.png
  favicon.ico      → /favicon.ico
  fonts/
    custom.woff2   → /fonts/custom.woff2
\`\`\`

## Folosire

\`\`\`jsx
<img src="/logo.png" alt="Logo" />
<Image src="/logo.png" width={100} height={50} />
\`\`\`

> ⚠️ Calea începe cu \`/\` (root URL).

## Static assets în alte foldere?

NU — doar \`public/\` e auto-served.

## Convenții speciale în app/

| Fișier | Auto-detectat |
|---|---|
| \`app/favicon.ico\` | Favicon |
| \`app/icon.png\` | Icon (multiple sizes) |
| \`app/apple-icon.png\` | Apple touch icon |
| \`app/opengraph-image.png\` | OG image default |
| \`app/twitter-image.png\` | Twitter image |
| \`app/sitemap.xml\` | Sitemap |
| \`app/robots.txt\` | Robots |

## Generate Open Graph dinamic

\`\`\`jsx
// app/og/route.js
import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', fontSize: 60, color: 'white', background: 'blue' }}>
        Hello!
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
\`\`\`

## Robots și Sitemap dinamic

\`\`\`jsx
// app/robots.js
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://site.com/sitemap.xml',
  };
}

// app/sitemap.js
export default async function sitemap() {
  const posts = await getPosts();
  return [
    { url: 'https://site.com', lastModified: new Date() },
    ...posts.map(p => ({ url: \`https://site.com/blog/\${p.slug}\` })),
  ];
}
\`\`\`

## Limite

- Public files NU sunt procesate de bundler
- Pentru imagini, mai bun \`next/image\` cu import (din \`@/\` chiar și)

## Cache headers

Next.js setează automat cache pentru \`public/\` files.

## 🎓 Ce ai învățat
- ✅ \`public/\` = auto-served la URL
- ✅ Cale absolută cu \`/\`
- ✅ Convenții app/ pentru favicon, OG
- ✅ \`ImageResponse\` pentru OG dinamic
`,
      problems: [
        mc('Public access', 'public/logo.png →?', ['/public/logo.png', '/logo.png', 'logo.png', '/static/logo.png'], '/logo.png', 'Direct.', { topic: 'public' }),
        mc('Favicon', 'Locație?', ['app/favicon.ico', 'public/favicon.ico', 'Ambele OK', 'config'], 'Ambele OK', 'Next detectează ambele.', { topic: 'public' }),
        sa('Sitemap dinamic', 'Fișier? (app/sitemap.js)', 'app/sitemap.js', 'Convenție.', { topic: 'public' }),
        mc('Open Graph', 'Auto-detect fișier?', ['app/opengraph-image.png', 'public/og.png', 'app/og.png', 'config'], 'app/opengraph-image.png', 'Convenție.', { topic: 'public' }),
        mc('OG dinamic', 'Lib?', ['next/og', 'sharp', 'jimp', 'canvas'], 'next/og', 'Vercel built-in.', { topic: 'public' }),
        mc('Robots dinamic', 'Fișier?', ['robots.txt', 'app/robots.js', 'public/robots', 'next.config'], 'app/robots.js', 'Generat dinamic.', { topic: 'public' }),
        mc('Path absolut', 'În Image src?', ['./logo.png', '/logo.png', 'logo.png', 'public/logo.png'], '/logo.png', 'Cu slash.', { topic: 'public' }),
        mc('Bundler', 'Public files trec prin bundler?', ['Da', 'Nu', 'Doar dev', 'Doar prod'], 'Nu', 'Direct served.', { topic: 'public' }),
        mc('Cache', 'Auto?', ['Da', 'Nu', 'Trebuie config', 'Doar prod'], 'Da', 'Headers automat.', { topic: 'public' }),
        mc('Subfolder', 'public/fonts/x.woff2 →?', ['/x.woff2', '/fonts/x.woff2', '/public/fonts/x', 'Crash'], '/fonts/x.woff2', 'Păstrează structura.', { topic: 'public' }),
      ],
    },

    {
      slug: 'next-scripts',
      title: '21. <Script> component',
      isFree: false,
      theory: `# 📜 Componenta <Script>

## De ce nu \`<script>\` direct?

\`<Script>\` Next.js oferă:
- 🚀 Loading strategies (\`afterInteractive\`, \`lazyOnload\`, \`beforeInteractive\`, \`worker\`)
- 📦 Auto-deduplication
- 🛡️ Async safe

## Import

\`\`\`jsx
import Script from 'next/script';
\`\`\`

## Strategy: afterInteractive (default)

\`\`\`jsx
<Script src="https://example.com/analytics.js" />
\`\`\`

## Strategy: lazyOnload

Pentru scripturi non-critical:

\`\`\`jsx
<Script
  src="https://chat.com/widget.js"
  strategy="lazyOnload"
/>
\`\`\`

## Strategy: beforeInteractive

Pentru scripts critical (rar):

\`\`\`jsx
<Script
  src="https://polyfill.com/v3.js"
  strategy="beforeInteractive"
/>
\`\`\`

## Strategy: worker (experimental)

\`\`\`jsx
<Script src="..." strategy="worker" />
\`\`\`

## Inline scripts

\`\`\`jsx
<Script id="ga" strategy="afterInteractive">
  {\`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
  \`}
</Script>
\`\`\`

## Event handlers

\`\`\`jsx
<Script
  src="https://stripe.com/v3"
  onLoad={() => console.log('Stripe loaded')}
  onError={(e) => console.error('Failed', e)}
  onReady={() => console.log('Ready')}
/>
\`\`\`

## Google Analytics

\`\`\`jsx
// app/layout.js
import Script from 'next/script';

<>
  <Script
    src={\`https://www.googletagmanager.com/gtag/js?id=G-XXXX\`}
    strategy="afterInteractive"
  />
  <Script id="ga" strategy="afterInteractive">
    {\`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXX');
    \`}
  </Script>
</>
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`<Script>\` din next/script
- ✅ Strategy: afterInteractive (default), lazyOnload, beforeInteractive
- ✅ Inline cu \`{\`...\`}\`
- ✅ Event handlers pentru lifecycle
`,
      problems: [
        mc('Import', 'De unde?', ['next/script', 'react', 'next', 'next-script'], 'next/script', 'Standard.', { topic: 'script' }),
        mc('Default strategy', 'Care?', ['beforeInteractive', 'afterInteractive', 'lazyOnload', 'worker'], 'afterInteractive', 'Default.', { topic: 'script' }),
        sa('Lazy strategy', 'Pentru widgets non-critical? (lazyOnload)', 'lazyOnload', 'Lazy load.', { topic: 'script' }),
        mc('Inline cu', 'Sintaxa?', ['{ \\`code\\` }', '{ "code" }', '"code"', 'innerHTML'], '{ \\`code\\` }', 'Template literal.', { topic: 'script' }),
        mc('onLoad', 'Pentru?', ['Init după load', 'Error', 'Click', 'Cleanup'], 'Init după load', 'Lifecycle event.', { topic: 'script' }),
        mc('Critical script', 'Strategy?', ['afterInteractive', 'beforeInteractive', 'lazyOnload', 'worker'], 'beforeInteractive', 'Înainte de hydration.', { topic: 'script' }),
        mc('id required', 'Pentru inline?', ['Da', 'Nu', 'Doar critical', 'Doar lazy'], 'Da', '`id` obligatoriu inline.', { topic: 'script' }),
        mc('Worker', 'Status?', ['Stable', 'Experimental', 'Deprecated', 'Removed'], 'Experimental', 'Beta.', { topic: 'script' }),
        mc('Avantaj <Script>', 'Față de <script>?', ['Strategies + dedup', 'Mai mic', 'CSS', 'Routing'], 'Strategies + dedup', 'Performance & UX.', { topic: 'script' }),
        mc('GA pattern', 'Câte <Script> pentru GA?', ['1', '2 (lib + config)', '3', 'Niciun'], '2 (lib + config)', 'Lib URL + inline init.', { topic: 'script' }),
      ],
    },

    {
      slug: 'next-internationalization',
      title: '22. Internaționalizare (i18n)',
      isFree: false,
      theory: `# 🌍 i18n în App Router

## App Router NU are i18n built-in (ca Pages Router)

Trebuie să implementezi manual sau cu librarie (ex: \`next-intl\`).

## Pattern de bază

\`\`\`
app/
  [lang]/
    layout.js
    page.js
    about/page.js
\`\`\`

## middleware.js — detectare locale

\`\`\`jsx
import { NextResponse } from 'next/server';

const locales = ['en', 'ro', 'fr'];
const defaultLocale = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Already has locale
  if (locales.some(l => pathname.startsWith(\`/\${l}\`))) return;

  // Detect from header
  const accept = request.headers.get('accept-language') || '';
  const locale = locales.find(l => accept.includes(l)) || defaultLocale;

  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}

export const config = { matcher: ['/((?!api|_next|.*\\\\..*).*)'] };
\`\`\`

## Layout cu lang param

\`\`\`jsx
// app/[lang]/layout.js
export default function Layout({ children, params: { lang } }) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Dictionary

\`\`\`jsx
// dictionaries/en.json
{ "title": "Hello", "about": "About us" }

// dictionaries/ro.json
{ "title": "Salut", "about": "Despre noi" }
\`\`\`

\`\`\`jsx
// app/[lang]/dictionary.js
const dictionaries = {
  en: () => import('./en.json').then(m => m.default),
  ro: () => import('./ro.json').then(m => m.default),
};

export const getDictionary = async (lang) => dictionaries[lang]();
\`\`\`

## Folosire în page

\`\`\`jsx
import { getDictionary } from './dictionary';

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang);
  return <h1>{dict.title}</h1>;
}
\`\`\`

## next-intl (recomandat)

\`\`\`bash
npm install next-intl
\`\`\`

\`\`\`jsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations();
  return <h1>{t('title')}</h1>;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ App Router nu are i18n built-in
- ✅ Pattern: \`app/[lang]/...\`
- ✅ Middleware pentru detectare/redirect
- ✅ \`next-intl\` simplifică tot
`,
      problems: [
        mc('App Router i18n', 'Built-in?', ['Da', 'Nu, manual', 'Doar enterprise', 'Doar Pages'], 'Nu, manual', 'Sau cu librarie.', { topic: 'i18n' }),
        mc('Pattern', 'Folder?', ['app/i18n/[lang]', 'app/[lang]', 'app/locale', 'config'], 'app/[lang]', 'Param dinamic.', { topic: 'i18n' }),
        sa('Middleware redirect', 'Pentru? (locale detection)', 'locale detection', 'Detect + redirect.', { topic: 'i18n' }),
        mc('Library', 'Recomandată?', ['react-i18n', 'next-intl', 'i18next', 'react-intl'], 'next-intl', 'Specifică pentru Next App Router.', { topic: 'i18n' }),
        mc('lang prop', 'În layout?', ['<html lang="...">', '<body lang>', 'meta', 'config'], '<html lang="...">', 'Standard HTML.', { topic: 'i18n' }),
        mc('Dictionary', 'Format?', ['JSON', 'XML', 'YAML', 'CSV'], 'JSON', 'Cel mai uzual.', { topic: 'i18n' }),
        mc('useTranslations', 'next-intl hook?', ['Server only', 'Client component', 'Ambele', 'Layout'], 'Ambele', 'Suport în ambele.', { topic: 'i18n' }),
        mc('Detectare', 'Header?', ['accept-language', 'lang', 'language', 'locale'], 'accept-language', 'Standard HTTP.', { topic: 'i18n' }),
        mc('Default locale', 'Setezi?', ['Hardcodat în config', 'Auto', 'Random', 'User pref'], 'Hardcodat în config', 'Fallback.', { topic: 'i18n' }),
        mc('SEO i18n', 'Important?', ['hreflang', 'lang attr', 'meta', 'Toate'], 'Toate', 'Bună practică SEO.', { topic: 'i18n' }),
      ],
    },

    {
      slug: 'next-error-handling',
      title: '23. Error Handling avansat',
      isFree: false,
      theory: `# ⚠️ Error Handling

## error.js — Error Boundary

\`\`\`jsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-red-600">Ceva nu a mers</h2>
      <p className="text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Încearcă din nou
      </button>
    </div>
  );
}
\`\`\`

## global-error.js (catch tot, inclusiv root layout)

\`\`\`jsx
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Eroare critică!</h2>
        <button onClick={reset}>Reîncearcă</button>
      </body>
    </html>
  );
}
\`\`\`

## try/catch în server components

\`\`\`jsx
async function Page() {
  try {
    const data = await fetchSomething();
    return <View data={data} />;
  } catch (e) {
    return <p>Failed to load</p>;
  }
}
\`\`\`

## throw notFound()

\`\`\`jsx
import { notFound } from 'next/navigation';

async function Page({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();   // → not-found.js
  return <Article post={post} />;
}
\`\`\`

## Custom error

\`\`\`jsx
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

throw new AppError('Not allowed', 'PERMISSION_DENIED');
\`\`\`

## Logging errors

\`\`\`jsx
// error.js
'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to Sentry / LogRocket
    console.error(error);
  }, [error]);

  return <ErrorUI reset={reset} />;
}
\`\`\`

## Error.digest (production)

În production, error message e ascuns. Folosești \`error.digest\` pentru identificare.

## Sentry integration

\`\`\`bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
\`\`\`

## Pattern: degradare graceful

\`\`\`jsx
async function Page() {
  let data;
  try {
    data = await fetchData();
  } catch {
    data = { items: [] };   // fallback gol
  }
  return <List data={data} />;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`error.js\` (client only) pentru Error Boundary
- ✅ \`global-error.js\` pentru root errors
- ✅ \`notFound()\` pentru 404 trigger
- ✅ Sentry pentru production logging
`,
      problems: [
        mc('error.js', 'Tip?', ['Server', 'Client', 'Layout', 'Page'], 'Client', '"use client" obligatoriu.', { topic: 'error' }),
        mc('Reset prop', 'Pentru?', ['Refresh page', 'Re-render Error Boundary', 'Logout', 'Crash'], 'Re-render Error Boundary', 'Retry logic.', { topic: 'error' }),
        sa('Trigger 404', 'Function? (notFound)', 'notFound', 'Din next/navigation.', { topic: 'error' }),
        mc('Global error', 'Acoperă?', ['Doar app/page', 'Tot inclusiv root layout', 'Doar API', 'Doar middleware'], 'Tot inclusiv root layout', 'Catch-all.', { topic: 'error' }),
        mc('Production messages', 'În production?', ['Vizibile detail', 'Ascunse, doar digest', 'Crash', 'Random'], 'Ascunse, doar digest', 'Securitate.', { topic: 'error' }),
        mc('Sentry', 'Tip?', ['CSS', 'Error tracking', 'Routing', 'Auth'], 'Error tracking', 'Production logging.', { topic: 'error' }),
        mc('Try-catch în server', 'Permis?', ['Da', 'Nu', 'Doar build', 'Doar dev'], 'Da', 'Standard JavaScript.', { topic: 'error' }),
        mc('useEffect log', 'Locul?', ['Server', 'Client (error.js)', 'Layout', 'API'], 'Client (error.js)', 'Hook = client.', { topic: 'error' }),
        mc('not-found.js trigger', 'Cum?', ['notFound() function sau no match URL', 'manual', 'config', 'router'], 'notFound() function sau no match URL', 'Două moduri.', { topic: 'error' }),
        mc('Graceful degradation', 'Înseamnă?', ['Crash app', 'Fallback când eroare', 'Deny request', 'Random'], 'Fallback când eroare', 'UX best practice.', { topic: 'error' }),
      ],
    },

    {
      slug: 'next-deployment',
      title: '24. Deployment (Vercel + alternative)',
      isFree: false,
      theory: `# 🚀 Deployment

## Vercel (recomandat — făcut de creators)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Sau via GitHub: conectezi repo → deploy automat la fiecare push.

## Build local

\`\`\`bash
npm run build       # build production
npm start           # start server production (port 3000)
\`\`\`

## Output directory

\`.next/\` — generat automat.

## Static export

Pentru hosting static (Netlify, GitHub Pages):

\`\`\`js
// next.config.js
module.exports = {
  output: 'export',
};
\`\`\`

\`\`\`bash
npm run build  → folder out/
\`\`\`

> ⚠️ Limitare: NU API routes, server actions, dynamic functions.

## Docker

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Standalone output

\`\`\`js
// next.config.js
module.exports = { output: 'standalone' };
\`\`\`

→ \`.next/standalone\` cu doar dependențele necesare.

## Environment variables în Vercel

Settings → Environment Variables:
- Development
- Preview (PR-uri)
- Production

## Custom domain

Vercel: Settings → Domains.

## Performance pre-deployment

\`\`\`bash
npm run build
\`\`\`

Output afișează:
- Page sizes
- Bundle sizes
- Static vs Dynamic

## Analize cu Lighthouse

\`\`\`bash
npm install -g lighthouse
lighthouse https://your-site.com
\`\`\`

## Self-host

\`\`\`bash
npm run build
npm start
\`\`\`

Sau cu PM2:
\`\`\`bash
pm2 start npm --name app -- start
\`\`\`

## Edge vs Node runtime

\`\`\`jsx
// route.js sau page.js
export const runtime = 'edge';     // Edge — rapid, limitat
export const runtime = 'nodejs';   // Node — full features (default)
\`\`\`

## 🎓 Ce ai învățat
- ✅ Vercel = simplest
- ✅ \`output: 'export'\` pentru static
- ✅ Docker pentru self-host
- ✅ Edge vs Node runtime
`,
      problems: [
        mc('Recomandat host', 'Care?', ['AWS', 'Vercel', 'Heroku', 'Netlify'], 'Vercel', 'Făcut de creators Next.', { topic: 'deploy' }),
        mc('Build comandă', 'Standard?', ['npm run build', 'next compile', 'next make', 'build'], 'npm run build', 'Standard.', { topic: 'deploy' }),
        sa('Static export config', 'Opțiune? (output: "export")', 'output: "export"', 'Pentru SSG only.', { topic: 'deploy' }),
        mc('Static limitare', 'Ce nu funcționează?', ['CSS', 'API routes / server actions', 'JS', 'Imagini'], 'API routes / server actions', 'Static = doar HTML/CSS/JS.', { topic: 'deploy' }),
        mc('Standalone', 'Pentru?', ['Static', 'Self-host minimal', 'Vercel', 'Docker'], 'Self-host minimal', 'Bundle + minimal node_modules.', { topic: 'deploy' }),
        mc('Edge runtime', 'Caracteristică?', ['Mai rapid, limitat', 'Mai lent, full', 'Doar dev', 'Doar Vercel'], 'Mai rapid, limitat', 'Edge cu restricții.', { topic: 'deploy' }),
        mc('Node default', 'Runtime default?', ['edge', 'nodejs', 'browser', 'worker'], 'nodejs', 'Default Node.', { topic: 'deploy' }),
        mc('PM2', 'Pentru?', ['Build', 'Process manager production', 'Auth', 'Routing'], 'Process manager production', 'Self-host.', { topic: 'deploy' }),
        mc('Output folder', 'Default?', ['dist/', 'build/', '.next/', 'out/'], '.next/', 'Standard Next.', { topic: 'deploy' }),
        mc('Lighthouse', 'Pentru?', ['Auth', 'Performance audit', 'Build', 'Routing'], 'Performance audit', 'Google tool.', { topic: 'deploy' }),
      ],
    },

    {
      slug: 'next-best-practices',
      title: '25. Best Practices Frontend',
      isFree: false,
      theory: `# 🏆 Best Practices Next.js

## 1. Server Components by default

❌ Nu pune \`'use client'\` peste tot
✅ Server pentru date, client doar unde ai nevoie de interacțiune

## 2. Push interactivity la nivelul cel mai mic

\`\`\`jsx
// ✅ doar butonul e client
function Page() {
  return (
    <article>
      <h1>Server content</h1>
      <ClientButton />   {/* doar acesta e client */}
    </article>
  );
}
\`\`\`

## 3. Folosește Suspense

\`\`\`jsx
<Suspense fallback={<Skeleton />}>
  <SlowList />
</Suspense>
\`\`\`

## 4. Image cu \`priority\` pentru hero

\`\`\`jsx
<Image src="/hero.jpg" priority width={1200} height={600} alt="" />
\`\`\`

## 5. \`<Link>\` peste \`<a>\`

✅ Mereu \`<Link>\`
❌ \`<a href>\` (full reload)

## 6. Metadata pentru fiecare pagină

\`\`\`jsx
export const metadata = { title: 'Page', description: '...' };
\`\`\`

## 7. Folosește loading.js

Pentru UX percepție mai bună.

## 8. Server Actions pentru forms

\`\`\`jsx
'use server';
export async function action(formData) { ... }
\`\`\`

## 9. Folosește layout pentru shared UI

Nu copia header/footer în fiecare pagină.

## 10. ENV: \`NEXT_PUBLIC_\` doar dacă chiar trebuie client

## 11. clsx pentru clase condiționale

\`\`\`jsx
className={clsx('base', active && 'bg-blue-500')}
\`\`\`

## 12. Folosește \`next/font\`

\`\`\`jsx
const inter = Inter({ subsets: ['latin'] });
\`\`\`

## 13. Cache strategically

- Static: default (cached)
- Dynamic: \`{ cache: 'no-store' }\`
- ISR: \`{ next: { revalidate: 60 } }\`

## 14. Folder organization

\`\`\`
app/
  (marketing)/    ← Public
  (app)/          ← Authenticated
  api/            ← Endpoints
components/       ← Reusable UI
lib/              ← Utils, prisma, auth
hooks/            ← Custom hooks
\`\`\`

## 15. \`middleware.js\` pentru auth global

Mai eficient decât check în fiecare page.

## 16. \`generateStaticParams\` pentru SSG

\`\`\`jsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
\`\`\`

## 17. Type safety cu TypeScript

Recomandat pentru proiecte serioase.

## 18. Don't fetch în client dacă poți server

Server fetch = mai eficient, mai sigur, mai rapid.

## 19. Optimize images

- next/image
- Format: WebP/AVIF auto
- Sizes corect

## 20. Monitor Performance

- Lighthouse
- Vercel Analytics
- Real User Monitoring (Sentry, LogRocket)

## 🎓 Ce ai învățat
- ✅ Server-first mindset
- ✅ Push 'use client' la nivel cel mai mic
- ✅ Convenții foldere (\`(group)\`)
- ✅ Cache strategically
- ✅ Use \`next/image\`, \`next/font\`, \`<Link>\` mereu
`,
      problems: [
        mc('Use client', 'Rule?', ['Peste tot', 'La nivel cel mai mic', 'Niciodată', 'Doar root'], 'La nivel cel mai mic', 'Doar unde necesar.', { topic: 'best' }),
        mc('Image hero', 'Prop?', ['lazy', 'priority', 'eager', 'first'], 'priority', 'Pentru LCP.', { topic: 'best' }),
        sa('Link', 'În loc de? (a)', 'a', 'Niciodată full reload în SPA.', { topic: 'best' }),
        mc('Static params', 'Func?', ['getStatic', 'generateStaticParams', 'staticParams', 'preGenerate'], 'generateStaticParams', 'SSG paths.', { topic: 'best' }),
        mc('Cache static', 'Default fetch?', ['No cache', 'Cached', 'Fresh', 'ISR'], 'Cached', 'În Next 14; Next 15 default no-store.', { topic: 'best' }),
        mc('Folder organization', 'Componente UI?', ['app/', 'components/', 'lib/', 'hooks/'], 'components/', 'Reusable.', { topic: 'best' }),
        mc('Middleware auth', 'Avantaj?', ['Per page check', 'O singură locație', 'CSS', 'Routing'], 'O singură locație', 'DRY.', { topic: 'best' }),
        mc('Forms preferred', 'Cu?', ['fetch + state', 'Server Actions', 'Redux', 'jQuery'], 'Server Actions', 'Modern Next.', { topic: 'best' }),
        mc('Loading UX', 'Cu?', ['Spinner', 'Skeleton', 'Empty', 'Toate'], 'Toate', 'Skeleton recomandat.', { topic: 'best' }),
        mc('TypeScript', 'Recomandat?', ['Da', 'Nu', 'Doar dev', 'Doar API'], 'Da', 'Best practice modern.', { topic: 'best' }),
      ],
    },

  ],
}
