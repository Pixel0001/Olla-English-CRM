// Next.js Backend — 25 lecții cu teorie îmbogățită + 10+ probleme/lecție

import { mc, sa } from './helpers.mjs'

export const nextjsBackendModule = {
  slug: 'nextjs-backend',
  title: 'Next.js Backend',
  description: 'Backend cu Next.js — Route Handlers, Server Actions, Middleware, Auth, DB, Caching. 25 de lecții.',
  language: 'javascript',
  order: 11,
  lessons: [

    // ==================== 1. INTRO BACKEND ====================
    {
      slug: 'next-backend-intro',
      title: '1. Backend în Next.js — overview',
      isFree: true,
      theory: `# 🛠️ Backend cu Next.js

## De ce Next.js pe backend?

Next.js NU e doar frontend — oferă **full-stack** capabilities:

- 🛣️ **Route Handlers** — API endpoints (\`route.js\`)
- ⚡ **Server Actions** — funcții server din JSX
- 🛡️ **Middleware** — interceptează requests
- 📦 **RSC** — Server Components fac fetch direct
- 🔐 **Auth** — built-in patterns
- 💾 **DB integration** — Prisma, Drizzle direct

## Arhitecturi posibile

### 1. Full-stack Next.js (recomandat pentru majoritate)
\`\`\`
Browser ↔ Next.js (SSR + API + DB)
\`\`\`

### 2. Next.js + backend separat
\`\`\`
Browser ↔ Next.js (UI) ↔ Backend (Express/FastAPI/Django)
\`\`\`

### 3. Next.js + serverless (Vercel)
\`\`\`
Browser ↔ Vercel Edge/Functions
\`\`\`

## Componente backend Next.js

| Feature | Folder/File | Scop |
|---|---|---|
| API endpoint | \`app/api/.../route.js\` | REST API |
| Server Action | \`'use server'\` function | Form submit, mutations |
| Middleware | \`middleware.js\` | Auth, redirects, headers |
| Server Component | \`app/.../page.js\` | Data fetching |

## Runtime opțiuni

- **Node.js** — full Node features (default)
- **Edge** — Vercel Edge / Cloudflare Workers, mai rapid, limitat

## DB-uri populare cu Next.js

- Prisma (TypeScript ORM)
- Drizzle (modern, lightweight)
- Mongoose (MongoDB)
- Supabase / Neon (Postgres serverless)

## Auth populare

- NextAuth.js / Auth.js
- Clerk
- Auth0
- Lucia
- Custom (jose + cookies)

## 🎓 Ce ai învățat
- ✅ Next.js = full-stack framework
- ✅ Route Handlers, Server Actions, Middleware
- ✅ Edge vs Node runtime
- ✅ Ecosystem bogat de DB și auth
`,
      problems: [
        mc('API în App Router', 'Fișier?', ['api.js', 'route.js', 'endpoint.js', 'page.js'], 'route.js', 'Convenție.', { topic: 'intro' }),
        mc('Server Action marker', 'Care?', ['"use server"', '"server"', '"use action"', 'export server'], '"use server"', 'Directive.', { topic: 'intro' }),
        sa('Middleware loc', 'Fișier? (middleware.js)', 'middleware.js', 'La root project.', { topic: 'intro' }),
        mc('Default runtime', 'Care?', ['edge', 'nodejs', 'browser', 'worker'], 'nodejs', 'Default Node.', { topic: 'intro' }),
        mc('Edge avantaj', 'Care?', ['Mai rapid + global', 'Mai lent', 'Mai mult RAM', 'Doar dev'], 'Mai rapid + global', 'Edge locations.', { topic: 'intro' }),
        mc('Prisma', 'Tip?', ['CSS', 'ORM', 'Auth', 'Routing'], 'ORM', 'TypeScript ORM.', { topic: 'intro' }),
        mc('NextAuth', 'Pentru?', ['Routing', 'Auth', 'CSS', 'DB'], 'Auth', 'Authentication.', { topic: 'intro' }),
        mc('Server Component fetch', 'Permis direct DB?', ['Da', 'Nu', 'Doar build', 'Doar API'], 'Da', 'Avantaj RSC.', { topic: 'intro' }),
        mc('Full-stack', 'Next.js poate fi?', ['Doar frontend', 'Doar backend', 'Full-stack', 'Doar SSR'], 'Full-stack', 'UI + API + DB.', { topic: 'intro' }),
        mc('Vercel Functions', 'Tip?', ['Serverless', 'Persistent', 'Browser', 'Container'], 'Serverless', 'Pay per request.', { topic: 'intro' }),
      ],
    },

    // ==================== 2. ROUTE HANDLERS ====================
    {
      slug: 'next-route-handlers',
      title: '2. Route Handlers (API)',
      isFree: true,
      theory: `# 🛣️ Route Handlers

## Ce sunt?

API endpoints în App Router — fișiere \`route.js\` (sau \`route.ts\`).

## Locație → URL

\`\`\`
app/api/users/route.js          → /api/users
app/api/users/[id]/route.js     → /api/users/:id
app/api/posts/[slug]/route.js   → /api/posts/:slug
\`\`\`

## HTTP methods (named exports)

\`\`\`jsx
// app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ users: [] });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ created: body }, { status: 201 });
}

export async function PUT(request) { ... }
export async function PATCH(request) { ... }
export async function DELETE(request) { ... }
\`\`\`

## Request parsing

\`\`\`jsx
export async function POST(request) {
  // JSON body
  const body = await request.json();

  // Form data
  const formData = await request.formData();
  const name = formData.get('name');

  // Text
  const text = await request.text();

  // Headers
  const auth = request.headers.get('authorization');

  // Cookies
  const token = request.cookies.get('token')?.value;
}
\`\`\`

## Response

\`\`\`jsx
// JSON
return NextResponse.json({ ok: true });

// Cu status
return NextResponse.json({ error: 'Not found' }, { status: 404 });

// Custom headers
return NextResponse.json(data, {
  headers: { 'X-Custom': 'value' },
});

// Plain text
return new Response('Hello', { status: 200 });

// Redirect
return NextResponse.redirect(new URL('/login', request.url));
\`\`\`

## Dynamic params

\`\`\`jsx
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params;   // în Next 15 e Promise
  return NextResponse.json({ id });
}
\`\`\`

## Search params

\`\`\`jsx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  return NextResponse.json({ q });
}
\`\`\`

## Error handling

\`\`\`jsx
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
\`\`\`

## CORS

\`\`\`jsx
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  });
}
\`\`\`

## OPTIONS pentru preflight

\`\`\`jsx
export async function OPTIONS() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`route.js\` cu named exports GET, POST, etc.
- ✅ \`NextResponse.json()\` pentru răspuns
- ✅ \`request.json()\`, \`request.formData()\` pentru body
- ✅ \`params\` pentru rute dinamice
`,
      problems: [
        mc('GET handler', 'Sintaxa?', ['get()', 'export async function GET()', 'GET = ()', '@get'], 'export async function GET()', 'Named export uppercase.', { topic: 'route' }),
        mc('JSON response', 'Helper?', ['NextResponse.json()', 'Response.json()', 'json()', 'JSON.send()'], 'NextResponse.json()', 'Standard.', { topic: 'route' }),
        sa('Body JSON', 'Cum primești? (await request.json())', 'await request.json()', 'Async parsing.', { topic: 'route' }),
        mc('Status 404', 'Cum?', ['{ status: 404 }', 'status=404', '404', '.status(404)'], '{ status: 404 }', 'Al 2-lea arg.', { topic: 'route' }),
        mc('FormData', 'Pentru?', ['JSON body', 'multipart/form-data', 'Cookies', 'Headers'], 'multipart/form-data', 'Forms.', { topic: 'route' }),
        mc('Search params', 'Source?', ['request.params', 'new URL(request.url)', 'request.search', 'request.query'], 'new URL(request.url)', 'Construct URL.', { topic: 'route' }),
        mc('Dynamic param', 'În handler?', ['Args 2 ca { params }', 'Global', 'request.params', 'router'], 'Args 2 ca { params }', 'Destructured.', { topic: 'route' }),
        mc('Cookies citire', 'Metodă?', ['request.cookies.get', 'cookies()', 'getCookie', 'request.cookie'], 'request.cookies.get', 'API standard.', { topic: 'route' }),
        mc('Redirect API', 'Helper?', ['NextResponse.redirect', 'redirect()', 'request.redirect', '302'], 'NextResponse.redirect', 'În route handler.', { topic: 'route' }),
        mc('Methods support', 'Care metode?', ['Doar GET/POST', 'Toate HTTP', 'Doar GET', 'CONNECT only'], 'Toate HTTP', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.', { topic: 'route' }),
      ],
    },

    // ==================== 3. SERVER ACTIONS ====================
    {
      slug: 'next-server-actions',
      title: '3. Server Actions',
      isFree: false,
      theory: `# ⚡ Server Actions

## Ce sunt?

Funcții care **rulează pe server**, dar le apelezi din componente client/forms — direct, fără API endpoint.

## Marker

\`\`\`jsx
'use server';

export async function createPost(formData) {
  await db.post.create({ data: { title: formData.get('title') } });
}
\`\`\`

> 💡 \`'use server'\` la TOP de fișier sau în interiorul unei funcții.

## Folosire în form

\`\`\`jsx
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

> 💡 \`action\` primește direct funcția — fără fetch!

## Inline (în server component)

\`\`\`jsx
export default function Page() {
  async function handleSubmit(formData) {
    'use server';
    await saveData(formData);
  }

  return <form action={handleSubmit}>...</form>;
}
\`\`\`

## Apel din client

\`\`\`jsx
'use client';
import { createPost } from './actions';
import { useTransition } from 'react';

function Btn() {
  const [isPending, startTransition] = useTransition();

  return (
    <button onClick={() => {
      startTransition(async () => {
        await createPost({ title: 'New' });
      });
    }}>
      {isPending ? '...' : 'Create'}
    </button>
  );
}
\`\`\`

## useFormState (React 19: useActionState)

\`\`\`jsx
'use client';
import { useFormState } from 'react-dom';
import { createPost } from './actions';

function Form() {
  const [state, formAction] = useFormState(createPost, { error: null });

  return (
    <form action={formAction}>
      <input name="title" />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <button>Create</button>
    </form>
  );
}
\`\`\`

\`\`\`jsx
// actions.js
'use server';
export async function createPost(prevState, formData) {
  try {
    await db.post.create({ data: { title: formData.get('title') } });
    return { success: true };
  } catch (e) {
    return { error: e.message };
  }
}
\`\`\`

## revalidatePath / revalidateTag

\`\`\`jsx
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createPost(formData) {
  await db.post.create({ data: { title: formData.get('title') } });
  revalidatePath('/posts');         // re-fetch /posts
  revalidateTag('posts');            // re-fetch tag-ul 'posts'
}
\`\`\`

## redirect

\`\`\`jsx
'use server';
import { redirect } from 'next/navigation';

export async function createPost(formData) {
  const post = await db.post.create({ data: { ... } });
  redirect(\`/posts/\${post.id}\`);
}
\`\`\`

## Pros vs API routes

| Server Actions | API Routes |
|---|---|
| Type-safe (cu TS) | Manual typing |
| Mai puțin boilerplate | Endpoints explicite |
| Auto-cache invalidation | Manual |
| Pentru mutations | Pentru REST API |

## ⚠️ Securitate

- Server Actions NU înlocuiesc validare!
- Validează cu Zod / valibot
- Verifică auth înăuntru

## 🎓 Ce ai învățat
- ✅ \`'use server'\` directive
- ✅ \`<form action={fn}>\` direct
- ✅ \`useFormState\` pentru state
- ✅ \`revalidatePath/Tag\` pentru cache
- ✅ \`redirect\` în action
`,
      problems: [
        mc('Marker', 'Care?', ['"use server"', '"use action"', '"server only"', '@server'], '"use server"', 'Standard.', { topic: 'actions' }),
        mc('Form action', 'Atribut?', ['onSubmit', 'action={fn}', 'submit', 'handler'], 'action={fn}', 'Direct funcție.', { topic: 'actions' }),
        sa('Cache invalidation path', 'Helper? (revalidatePath)', 'revalidatePath', 'Din next/cache.', { topic: 'actions' }),
        mc('Hook state', 'React?', ['useState', 'useFormState / useActionState', 'useReducer', 'useEffect'], 'useFormState / useActionState', 'Specifice forms.', { topic: 'actions' }),
        mc('Redirect din action', 'Cum?', ['router.push', 'redirect()', 'window.location', 'res.redirect'], 'redirect()', 'Din next/navigation.', { topic: 'actions' }),
        mc('Pros', 'Față de API routes?', ['Type-safe + less boilerplate', 'Mai lent', 'Mai mult cod', 'Doar dev'], 'Type-safe + less boilerplate', 'DX mai bun.', { topic: 'actions' }),
        mc('Validation', 'Securitate?', ['Skip', 'Validează cu Zod', 'Trust user', 'Doar HTML'], 'Validează cu Zod', 'Mereu valida server-side.', { topic: 'actions' }),
        mc('Param 1 cu useFormState', 'Care?', ['formData', 'prevState', 'request', 'event'], 'prevState', 'Apoi formData ca al 2-lea.', { topic: 'actions' }),
        mc('useTransition', 'Pentru?', ['Block UI', 'Pending state non-blocking', 'CSS', 'Routing'], 'Pending state non-blocking', 'Concurrent.', { topic: 'actions' }),
        mc('revalidateTag', 'Pentru?', ['Specific cache invalidation', 'Path', 'Reload page', 'Logout'], 'Specific cache invalidation', 'Pe baza tag-ului.', { topic: 'actions' }),
      ],
    },

    // ==================== 4. MIDDLEWARE BACKEND ====================
    {
      slug: 'next-middleware-backend',
      title: '4. Middleware (auth, headers)',
      isFree: false,
      theory: `# 🛡️ Middleware (Backend)

## Locație

\`middleware.js\` la **rootul proiectului**, NU în \`app/\`.

## Structură

\`\`\`jsx
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Logic
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
\`\`\`

## Pattern: Auth check

\`\`\`jsx
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
\`\`\`

## Adăugare headers la request

\`\`\`jsx
export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', '123');

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
\`\`\`

## Citire în route handler

\`\`\`jsx
// app/api/me/route.js
import { headers } from 'next/headers';

export async function GET() {
  const h = await headers();
  const userId = h.get('x-user-id');
  return Response.json({ userId });
}
\`\`\`

## Cookies set

\`\`\`jsx
export function middleware(request) {
  const response = NextResponse.next();
  response.cookies.set('visited', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });
  return response;
}
\`\`\`

## Rewrite (URL diferit afișat)

\`\`\`jsx
return NextResponse.rewrite(new URL('/maintenance', request.url));
\`\`\`

> 💡 URL-ul în browser rămâne, dar conținutul vine din \`/maintenance\`.

## Pattern: Geo-blocking

\`\`\`jsx
export function middleware(request) {
  const country = request.geo?.country;
  if (country === 'XX') {
    return NextResponse.json({ error: 'Blocked' }, { status: 403 });
  }
}
\`\`\`

## Pattern: A/B testing

\`\`\`jsx
export function middleware(request) {
  const variant = Math.random() < 0.5 ? 'a' : 'b';
  const response = NextResponse.next();
  response.cookies.set('variant', variant);
  return response;
}
\`\`\`

## Limitări (Edge Runtime)

- ❌ NU \`fs\`, \`net\`, \`child_process\`
- ❌ NU dependențe Node-only (ex: bcrypt)
- ✅ \`fetch\`, \`crypto\`, \`Web APIs\`
- ✅ \`jose\` pentru JWT

## ⚠️ Performance

Middleware rulează la **fiecare request matchat**. Păstrează-l simplu.

## 🎓 Ce ai învățat
- ✅ \`middleware.js\` la root
- ✅ Auth pattern cu JWT verify
- ✅ Headers/Cookies în request și response
- ✅ Edge Runtime — limitări
`,
      problems: [
        mc('Locație', 'Unde?', ['app/middleware.js', 'middleware.js root', 'pages/middleware', 'config'], 'middleware.js root', 'Standard.', { topic: 'mw' }),
        mc('JWT lib edge-compatible', 'Care?', ['jsonwebtoken', 'jose', 'crypto-js', 'bcrypt'], 'jose', 'Edge-compatible.', { topic: 'mw' }),
        sa('Continuă', 'Helper? (NextResponse.next)', 'NextResponse.next', 'Standard.', { topic: 'mw' }),
        mc('Headers la request', 'În middleware?', ['Doar la response', 'Și request via next({ request })', 'Imposibil', 'Doar dev'], 'Și request via next({ request })', 'Pattern.', { topic: 'mw' }),
        mc('bcrypt în middleware', 'Funcționează?', ['Da', 'Nu (Node-only)', 'Doar dev', 'Doar prod'], 'Nu (Node-only)', 'Edge runtime.', { topic: 'mw' }),
        mc('Rewrite vs redirect', 'Diferența?', ['Identice', 'Rewrite păstrează URL', 'Redirect mai rapid', 'Niciuna'], 'Rewrite păstrează URL', 'Internal routing.', { topic: 'mw' }),
        mc('Geo', 'Acces?', ['request.geo', 'request.country', 'request.location', 'IP lookup'], 'request.geo', 'Vercel feature.', { topic: 'mw' }),
        mc('Performance', 'Rulează?', ['O dată', 'La fiecare request matchat', 'Doar build', 'Random'], 'La fiecare request matchat', 'Atenție la complexitate.', { topic: 'mw' }),
        mc('Cookies set opts', 'Pentru securitate?', ['httpOnly + secure + sameSite', 'Niciuna', 'Doar httpOnly', 'Doar maxAge'], 'httpOnly + secure + sameSite', 'Best practices.', { topic: 'mw' }),
        mc('A/B testing', 'Locul ideal?', ['Page', 'Middleware', 'API', 'Layout'], 'Middleware', 'Set cookie devreme.', { topic: 'mw' }),
      ],
    },

    // ==================== 5. CACHING ====================
    {
      slug: 'next-caching',
      title: '5. Caching strategies',
      isFree: false,
      theory: `# 💾 Caching în Next.js

## Tipuri de cache

1. **Request Memoization** — același fetch în același render
2. **Data Cache** — fetch results persisted (revalidate)
3. **Full Route Cache** — HTML rendered cached
4. **Router Cache** — client-side, pentru navigare

## fetch() options

### Default (cached forever sau până la revalidate)
\`\`\`jsx
fetch(url)   // În Next 14: cached. În Next 15: NO cache (default schimbat!)
\`\`\`

### Force cache
\`\`\`jsx
fetch(url, { cache: 'force-cache' })
\`\`\`

### No cache (always fresh)
\`\`\`jsx
fetch(url, { cache: 'no-store' })
\`\`\`

### ISR (revalidate after N seconds)
\`\`\`jsx
fetch(url, { next: { revalidate: 60 } })
\`\`\`

### Tags (on-demand revalidation)
\`\`\`jsx
fetch(url, { next: { tags: ['posts'] } })
\`\`\`

## Route Segment Config

\`\`\`jsx
// app/page.js
export const dynamic = 'force-dynamic';   // mereu re-rendered
export const dynamic = 'force-static';    // SSG
export const revalidate = 60;             // ISR
export const fetchCache = 'force-no-store';
\`\`\`

## On-demand revalidation

### Path
\`\`\`jsx
import { revalidatePath } from 'next/cache';
revalidatePath('/posts');
\`\`\`

### Tag
\`\`\`jsx
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
\`\`\`

### Layout (toate sub-rutele)
\`\`\`jsx
revalidatePath('/dashboard', 'layout');
\`\`\`

## Cache cu funcții non-fetch

\`\`\`jsx
import { unstable_cache } from 'next/cache';

const getUsers = unstable_cache(
  async () => db.user.findMany(),
  ['users-list'],
  { revalidate: 60, tags: ['users'] }
);

const users = await getUsers();
\`\`\`

## Webhooks pentru revalidation

\`\`\`jsx
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const { path } = await request.json();
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
\`\`\`

## Dynamic functions (auto-disable cache)

Folosirea acestora face ruta dynamic:
- \`cookies()\`
- \`headers()\`
- \`searchParams\` în props
- \`fetch({ cache: 'no-store' })\`

## Pattern: Build dinamic

\`\`\`jsx
import { cookies } from 'next/headers';

export default async function Page() {
  const c = await cookies();
  // Auto-dynamic
}
\`\`\`

## ISR vs SSG vs SSR

| | Generate | Cache | Refresh |
|---|---|---|---|
| **SSG** | Build time | Forever | Rebuild |
| **ISR** | Build + revalidate | TTL | Auto |
| **SSR** | Per request | None | Mereu |

## 🎓 Ce ai învățat
- ✅ 4 tipuri de cache
- ✅ \`fetch\` options pentru cache
- ✅ \`revalidatePath/Tag\` on-demand
- ✅ \`unstable_cache\` pentru non-fetch
- ✅ Dynamic functions disable cache
`,
      problems: [
        mc('Force cache', 'Opțiune?', ['cache: "force-cache"', 'cache: true', 'fresh: false', 'cache: "yes"'], 'cache: "force-cache"', 'Standard.', { topic: 'cache' }),
        mc('No cache', 'Opțiune?', ['cache: "no-store"', 'cache: false', 'fresh: true', 'no-cache'], 'cache: "no-store"', 'Standard.', { topic: 'cache' }),
        sa('ISR option', 'Sintaxa? (next: { revalidate: 60 })', 'next: { revalidate: 60 }', 'TTL în secunde.', { topic: 'cache' }),
        mc('On-demand path', 'Helper?', ['revalidatePath', 'revalidate', 'invalidate', 'refresh'], 'revalidatePath', 'Din next/cache.', { topic: 'cache' }),
        mc('Tag invalidation', 'Helper?', ['revalidateTag', 'invalidateTag', 'tagRefresh', 'cacheTag'], 'revalidateTag', 'Pentru fetch cu tags.', { topic: 'cache' }),
        mc('unstable_cache', 'Pentru?', ['fetch', 'Funcții non-fetch', 'CSS', 'Routing'], 'Funcții non-fetch', 'Ex: DB queries.', { topic: 'cache' }),
        mc('Dynamic auto', 'Cu cookies()?', ['Cached', 'Dynamic', 'Static', 'ISR'], 'Dynamic', 'Auto-dynamic.', { topic: 'cache' }),
        mc('Force dynamic', 'Config?', ['dynamic = "force-dynamic"', 'static = false', 'ssr = true', 'cache = false'], 'dynamic = "force-dynamic"', 'Route segment.', { topic: 'cache' }),
        mc('SSG', 'Build când?', ['Per request', 'Build time', 'Pe demand', 'Random'], 'Build time', 'Static Generation.', { topic: 'cache' }),
        mc('ISR', 'Diferența vs SSG?', ['Identice', 'Auto-revalidate cu TTL', 'Mai lent', 'Doar prod'], 'Auto-revalidate cu TTL', 'Incremental.', { topic: 'cache' }),
      ],
    },

    // ==================== 6. DATABASE PRISMA ====================
    {
      slug: 'next-prisma',
      title: '6. Database cu Prisma',
      isFree: false,
      theory: `# 🗄️ Prisma în Next.js

## Setup

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Schema

\`\`\`prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
\`\`\`

## Migrare

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

## Generate client

\`\`\`bash
npx prisma generate
\`\`\`

## Singleton client (IMPORTANT)

\`\`\`jsx
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
\`\`\`

> 💡 Previne crearea de multiple instanțe în dev (hot reload).

## CRUD basic

\`\`\`jsx
import { prisma } from '@/lib/prisma';

// Create
const user = await prisma.user.create({
  data: { email: 'a@b.com', name: 'Ana' },
});

// Read
const all = await prisma.user.findMany();
const one = await prisma.user.findUnique({ where: { id: 1 } });
const filtered = await prisma.user.findMany({
  where: { name: { contains: 'A' } },
});

// Update
await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Ana 2' },
});

// Delete
await prisma.user.delete({ where: { id: 1 } });
\`\`\`

## Relații

\`\`\`jsx
// Include posts
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});

// Select specific fields
const u = await prisma.user.findUnique({
  where: { id: 1 },
  select: { id: true, email: true },
});

// Create cu relație
await prisma.post.create({
  data: {
    title: 'Hello',
    author: { connect: { id: 1 } },
  },
});
\`\`\`

## Folosire în Server Component

\`\`\`jsx
// app/users/page.js
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  const users = await prisma.user.findMany();
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.email}</li>)}
    </ul>
  );
}
\`\`\`

## Transactions

\`\`\`jsx
await prisma.$transaction([
  prisma.user.create({ data: { ... } }),
  prisma.post.create({ data: { ... } }),
]);

// Sau interactive
await prisma.$transaction(async (tx) => {
  const u = await tx.user.create({ ... });
  await tx.post.create({ data: { authorId: u.id, ... } });
});
\`\`\`

## Pagination

\`\`\`jsx
const posts = await prisma.post.findMany({
  skip: page * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});
\`\`\`

## 🎓 Ce ai învățat
- ✅ Schema în \`prisma/schema.prisma\`
- ✅ Singleton pattern pentru client
- ✅ CRUD: create/findMany/update/delete
- ✅ \`include\` și \`select\` pentru relații
- ✅ Transactions cu \`$transaction\`
`,
      problems: [
        mc('Init', 'Comandă?', ['npm prisma init', 'npx prisma init', 'prisma create', 'init prisma'], 'npx prisma init', 'Standard.', { topic: 'prisma' }),
        mc('Migrate', 'Comandă dev?', ['prisma migrate', 'npx prisma migrate dev', 'prisma db push', 'migrate up'], 'npx prisma migrate dev', 'Creează migrarea.', { topic: 'prisma' }),
        sa('Create', 'Metodă? (create)', 'create', 'prisma.model.create({ data }).', { topic: 'prisma' }),
        mc('Find one by unique', 'Metodă?', ['findFirst', 'findUnique', 'findOne', 'find'], 'findUnique', 'Pe unique fields.', { topic: 'prisma' }),
        mc('Include relation', 'Opțiune?', ['relations: true', 'include: { posts: true }', 'with: posts', 'join'], 'include: { posts: true }', 'Standard.', { topic: 'prisma' }),
        mc('Singleton', 'De ce?', ['Estetic', 'Previne multiple connections în dev', 'Mai lent', 'Random'], 'Previne multiple connections în dev', 'Hot reload bug.', { topic: 'prisma' }),
        mc('Transaction', 'Metodă?', ['$transaction', 'transaction()', 'beginTx', 'tx()'], '$transaction', 'Standard.', { topic: 'prisma' }),
        mc('Order by desc', 'Sintaxa?', ['orderBy: { x: "desc" }', 'sort: x desc', 'desc(x)', 'orderBy: ["x", "desc"]'], 'orderBy: { x: "desc" }', 'Object.', { topic: 'prisma' }),
        mc('Pagination skip/take', 'Echivalent?', ['offset/limit', 'page/size', 'from/to', 'where'], 'offset/limit', 'Prisma terms.', { topic: 'prisma' }),
        mc('Delete', 'Metodă?', ['remove', 'delete', 'destroy', 'drop'], 'delete', 'Standard.', { topic: 'prisma' }),
      ],
    },

    // ==================== 7. AUTH (NextAuth) ====================
    {
      slug: 'next-nextauth',
      title: '7. Authentication cu NextAuth (Auth.js)',
      isFree: false,
      theory: `# 🔐 NextAuth (Auth.js)

## Install (v5 — Auth.js)

\`\`\`bash
npm install next-auth@beta
\`\`\`

## Setup

\`\`\`jsx
// auth.js (root)
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({ clientId: process.env.GH_ID, clientSecret: process.env.GH_SECRET }),
    Google({ clientId: process.env.G_ID, clientSecret: process.env.G_SECRET }),
  ],
});
\`\`\`

## Route handler

\`\`\`jsx
// app/api/auth/[...nextauth]/route.js
export { GET, POST } from '@/auth';
// Sau dacă ai handlers:
// import { handlers } from '@/auth';
// export const { GET, POST } = handlers;
\`\`\`

## Env

\`\`\`bash
AUTH_SECRET=<random_32_chars>
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
\`\`\`

## Sign in / Sign out

\`\`\`jsx
import { signIn, signOut } from '@/auth';

<form action={async () => { 'use server'; await signIn('github'); }}>
  <button>Login GitHub</button>
</form>

<form action={async () => { 'use server'; await signOut(); }}>
  <button>Logout</button>
</form>
\`\`\`

## Get session în Server Component

\`\`\`jsx
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  if (!session) return <p>Not logged in</p>;
  return <p>Hello {session.user.name}</p>;
}
\`\`\`

## Client Component

\`\`\`jsx
'use client';
import { useSession } from 'next-auth/react';

function User() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Anonim</p>;
  return <p>Hello {session.user.name}</p>;
}
\`\`\`

## SessionProvider (pentru useSession)

\`\`\`jsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
\`\`\`

## Credentials provider

\`\`\`jsx
import Credentials from 'next-auth/providers/credentials';

Credentials({
  credentials: { email: {}, password: {} },
  async authorize({ email, password }) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return { id: user.id, email: user.email };
  },
})
\`\`\`

## Callbacks

\`\`\`jsx
NextAuth({
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
});
\`\`\`

## Protect route în middleware

\`\`\`jsx
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/dashboard/:path*'],
};
\`\`\`

## 🎓 Ce ai învățat
- ✅ Auth.js (v5) setup minimal
- ✅ Multiple providers (OAuth + Credentials)
- ✅ \`auth()\` server, \`useSession()\` client
- ✅ Callbacks pentru customizare
- ✅ Middleware-based protection
`,
      problems: [
        mc('v5 name', 'Care?', ['NextAuth', 'Auth.js', 'AmbeleSinonim', 'NextLogin'], 'AmbeleSinonim', 'V5 = Auth.js, dar pachet next-auth.', { topic: 'auth' }),
        mc('Server session', 'Helper?', ['useSession', 'auth()', 'getSession', 'session()'], 'auth()', 'În v5.', { topic: 'auth' }),
        sa('Client hook', 'Hook? (useSession)', 'useSession', 'Din next-auth/react.', { topic: 'auth' }),
        mc('SessionProvider', 'Locul?', ['Server', 'Client root layout', 'Page', 'API'], 'Client root layout', 'Wrap pentru hooks.', { topic: 'auth' }),
        mc('Credentials', 'Provider?', ['Doar OAuth', 'Și custom (email/password)', 'Doar SSO', 'Doar magic link'], 'Și custom (email/password)', 'Provider Credentials.', { topic: 'auth' }),
        mc('Authorize return', 'Falsy?', ['Returnează null', 'throw', 'Ambele OK', 'Niciuna'], 'Returnează null', 'Null = invalid.', { topic: 'auth' }),
        mc('JWT callback', 'Pentru?', ['Modificare token', 'Sign in', 'Logout', 'Routing'], 'Modificare token', 'Adăugare claims.', { topic: 'auth' }),
        mc('Middleware protect', 'Cum?', ['export auth as middleware', 'manual', 'config', 'route.js'], 'export auth as middleware', 'V5 pattern.', { topic: 'auth' }),
        mc('Env secret', 'Cheie?', ['AUTH_SECRET', 'NEXTAUTH_SECRET', 'JWT_SECRET', 'A sau B'], 'A sau B', 'V5 = AUTH_SECRET; v4 = NEXTAUTH_SECRET.', { topic: 'auth' }),
        mc('Sign in form action', 'Locul?', ['Client onClick', 'Server action with signIn', 'API endpoint', 'Toate'], 'Toate', 'Multiple opțiuni.', { topic: 'auth' }),
      ],
    },

    // ==================== 8. COOKIES & HEADERS ====================
    {
      slug: 'next-cookies-headers',
      title: '8. Cookies și Headers',
      isFree: false,
      theory: `# 🍪 Cookies și Headers

## cookies() (server)

\`\`\`jsx
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();   // în Next 15: Promise

  const token = cookieStore.get('token')?.value;
  const all = cookieStore.getAll();
  const has = cookieStore.has('token');
}
\`\`\`

## Set cookies

> ⚠️ \`cookies().set()\` funcționează DOAR în:
> - Server Actions
> - Route Handlers

\`\`\`jsx
'use server';
import { cookies } from 'next/headers';

export async function login() {
  const c = await cookies();
  c.set('token', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,   // 7 days
    path: '/',
  });
}
\`\`\`

## Delete

\`\`\`jsx
c.delete('token');
\`\`\`

## headers() (server)

\`\`\`jsx
import { headers } from 'next/headers';

export default async function Page() {
  const h = await headers();
  const ua = h.get('user-agent');
  const auth = h.get('authorization');
}
\`\`\`

## Set response headers (în route handler)

\`\`\`jsx
return NextResponse.json(data, {
  headers: {
    'X-Custom': 'value',
    'Cache-Control': 'no-store',
  },
});
\`\`\`

## Cookie security flags

| Flag | Descriere |
|---|---|
| \`httpOnly\` | Inaccesibil din JS (XSS protection) |
| \`secure\` | Doar HTTPS |
| \`sameSite\` | CSRF protection ('strict', 'lax', 'none') |
| \`maxAge\` | Lifetime în secunde |
| \`expires\` | Date object |
| \`path\` | Scope path |
| \`domain\` | Scope domain |

## Auth pattern cu cookies

\`\`\`jsx
'use server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function login(formData) {
  const user = await authenticate(formData);

  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const c = await cookies();
  c.set('token', token, { httpOnly: true, secure: true, sameSite: 'lax' });
}
\`\`\`

## Read în middleware

\`\`\`jsx
export function middleware(request) {
  const token = request.cookies.get('token')?.value;
}
\`\`\`

## Read în client (limited)

\`\`\`jsx
'use client';
// JS reading cookies NON-httpOnly:
const token = document.cookie;   // string format
\`\`\`

> ⚠️ \`httpOnly\` cookies NU sunt accesibile din JS (intenționat).

## Pattern: Get current user

\`\`\`jsx
// lib/session.js
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getCurrentUser() {
  const c = await cookies();
  const token = c.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return await db.user.findUnique({ where: { id: payload.id } });
  } catch {
    return null;
  }
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`cookies()\` și \`headers()\` din next/headers
- ✅ Set cookies doar în actions/handlers
- ✅ Security flags: httpOnly, secure, sameSite
- ✅ Pattern auth cu jose + cookies
`,
      problems: [
        mc('Cookies API', 'Import?', ['next/headers', 'next/cookies', 'react', 'next/server'], 'next/headers', 'Standard.', { topic: 'cookies' }),
        mc('Set cookies unde', 'Permis?', ['Oriunde', 'Server Actions/Route Handlers', 'Doar middleware', 'Client'], 'Server Actions/Route Handlers', 'Restricție Next.js.', { topic: 'cookies' }),
        sa('httpOnly cookie', 'Accesibil din JS? (Nu)', 'Nu', 'Securitate XSS.', { topic: 'cookies' }),
        mc('CSRF protection', 'Flag?', ['secure', 'sameSite', 'httpOnly', 'maxAge'], 'sameSite', 'Strict/Lax/None.', { topic: 'cookies' }),
        mc('HTTPS only', 'Flag?', ['secure', 'https', 'tls', 'ssl'], 'secure', 'Standard.', { topic: 'cookies' }),
        mc('Get cookie', 'Metodă?', ['get(name)', 'cookie[name]', 'fetch(name)', 'name'], 'get(name)', 'Cookie store API.', { topic: 'cookies' }),
        mc('Headers async', 'În Next 15?', ['Sync', 'Promise (await)', 'Generator', 'Random'], 'Promise (await)', 'Schimbare în 15.', { topic: 'cookies' }),
        mc('JWT lib edge-safe', 'Care?', ['jsonwebtoken', 'jose', 'bcrypt', 'crypto-js'], 'jose', 'Edge-compatible.', { topic: 'cookies' }),
        mc('Headers response', 'În route handler?', ['{ headers: {} }', 'res.set', 'header()', 'h()'], '{ headers: {} }', 'NextResponse opt.', { topic: 'cookies' }),
        mc('maxAge unit', 'În?', ['ms', 'secunde', 'minute', 'ore'], 'secunde', 'Standard cookies.', { topic: 'cookies' }),
      ],
    },

    // ==================== 9. VALIDATION ====================
    {
      slug: 'next-validation',
      title: '9. Validare cu Zod',
      isFree: false,
      theory: `# ✅ Validare cu Zod

## De ce?

- Securitate (NU trust user input!)
- Type safety
- Mesaje clare de eroare
- Runtime + compile-time

## Install

\`\`\`bash
npm install zod
\`\`\`

## Schema basic

\`\`\`jsx
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().positive(),
});
\`\`\`

## Parse vs safeParse

\`\`\`jsx
// Throws la eșec
const user = userSchema.parse(data);

// Returnează result object
const result = userSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.issues);
} else {
  console.log(result.data);
}
\`\`\`

## Folosire în Server Action

\`\`\`jsx
'use server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function login(formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = schema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid input', issues: result.error.flatten() };
  }

  // result.data e tipat corect
  await db.user.findUnique({ where: { email: result.data.email } });
}
\`\`\`

## În Route Handler

\`\`\`jsx
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
});

export async function POST(request) {
  const body = await request.json();
  const result = postSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const post = await db.post.create({ data: result.data });
  return Response.json(post, { status: 201 });
}
\`\`\`

## Validatoare comune

\`\`\`jsx
z.string().min(3).max(100)
z.string().email()
z.string().url()
z.string().uuid()
z.string().regex(/^[a-z]+$/)

z.number().int().positive()
z.number().min(0).max(100)

z.boolean()
z.date()
z.literal('admin')

z.enum(['user', 'admin'])

z.array(z.string())
z.object({ ... })

z.string().optional()
z.string().nullable()
z.string().default('')
\`\`\`

## Refinements (validări custom)

\`\`\`jsx
const schema = z.object({
  password: z.string().min(8),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords don\\'t match',
  path: ['confirm'],
});
\`\`\`

## Transform

\`\`\`jsx
const schema = z.string().transform(s => s.toLowerCase().trim());
\`\`\`

## Type inference

\`\`\`jsx
type User = z.infer<typeof userSchema>;   // TypeScript
\`\`\`

## Pattern: Server Action validation helper

\`\`\`jsx
async function validateAction(schema, formData) {
  const data = Object.fromEntries(formData);
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.flatten());
  }
  return result.data;
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Zod = runtime + type-safe validation
- ✅ \`.parse()\` throws, \`.safeParse()\` returns result
- ✅ Validatoare composable
- ✅ \`refine()\` pentru rules custom
- ✅ \`z.infer<>\` pentru types
`,
      problems: [
        mc('Throw on fail', 'Metodă?', ['parse', 'safeParse', 'check', 'verify'], 'parse', 'Standard.', { topic: 'zod' }),
        mc('Safe', 'Metodă?', ['parseSafe', 'safeParse', 'safeCheck', 'tryParse'], 'safeParse', 'Returnează result.', { topic: 'zod' }),
        sa('Email validation', 'Helper? (z.string().email())', 'z.string().email()', 'Built-in.', { topic: 'zod' }),
        mc('Type inference', 'Helper?', ['z.type', 'z.infer<>', 'z.Type', 'TypeOf<>'], 'z.infer<>', 'TypeScript.', { topic: 'zod' }),
        mc('Optional field', 'Metodă?', ['z.optional', '.optional()', '?', 'maybe'], '.optional()', 'Chained.', { topic: 'zod' }),
        mc('Default value', 'Metodă?', ['.default(x)', '.value(x)', '.fallback(x)', '.init(x)'], '.default(x)', 'Standard.', { topic: 'zod' }),
        mc('Custom validation', 'Metodă?', ['.refine', '.custom', '.validate', '.check'], '.refine', 'Cu predicate.', { topic: 'zod' }),
        mc('Transform value', 'Metodă?', ['.transform', '.map', '.convert', '.parse'], '.transform', 'Standard.', { topic: 'zod' }),
        mc('Form data extract', 'Helper?', ['Object.fromEntries(formData)', 'formData.toObject', 'JSON.parse', 'eval'], 'Object.fromEntries(formData)', 'JS standard.', { topic: 'zod' }),
        mc('Min length string', 'Metodă?', ['.min(3)', '.length(3)', '.size(3)', '.gte(3)'], '.min(3)', 'Standard.', { topic: 'zod' }),
      ],
    },

    // ==================== 10. RATE LIMITING ====================
    {
      slug: 'next-rate-limiting',
      title: '10. Rate limiting',
      isFree: false,
      theory: `# 🚦 Rate Limiting

## De ce?

- 🛡️ Prevenire abuse
- 💰 Reducere costuri (API external)
- ⚡ Stabilitate
- 🔐 Anti brute-force (login)

## Pattern simplu (in-memory)

\`\`\`jsx
const requests = new Map();

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60_000;     // 1 min
  const maxRequests = 10;

  const userReqs = requests.get(ip) || [];
  const recent = userReqs.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return Response.json({ error: 'Rate limit' }, { status: 429 });
  }

  requests.set(ip, [...recent, now]);
  // ... logic
}
\`\`\`

> ⚠️ In-memory NU funcționează în serverless (multiple instance).

## Upstash Redis (recomandat)

\`\`\`bash
npm install @upstash/redis @upstash/ratelimit
\`\`\`

\`\`\`jsx
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'),
});

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  }

  // ... logic
}
\`\`\`

## Rate limit per user

\`\`\`jsx
const session = await auth();
const key = session?.user?.id || ip;
await ratelimit.limit(key);
\`\`\`

## Algoritmi disponibili (Upstash)

| Algoritm | Descriere |
|---|---|
| \`fixedWindow(n, '60 s')\` | N requests/window fix |
| \`slidingWindow(n, '60 s')\` | N requests în ultima fereastră |
| \`tokenBucket(n, '60 s', cap)\` | Token bucket |

## Headers standard

\`\`\`
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1635789012
Retry-After: 60
\`\`\`

## În Middleware

\`\`\`jsx
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s'),
});

export async function middleware(request) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
}
\`\`\`

## Pattern: login brute-force

\`\`\`jsx
const loginLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, '15 m'),   // 5/15min
});

export async function login(formData) {
  const ip = headers().get('x-forwarded-for');
  const { success } = await loginLimiter.limit(\`login:\${ip}\`);
  if (!success) return { error: 'Too many attempts' };
  // ...
}
\`\`\`

## Vercel Edge Functions

Vercel oferă \`@vercel/firewall\` pentru rate limiting integrat.

## 🎓 Ce ai învățat
- ✅ Rate limiting esențial pentru securitate
- ✅ In-memory NU pentru serverless
- ✅ Upstash Redis = soluție comună
- ✅ Sliding window > fixed window
- ✅ Per IP sau per user (auth)
`,
      problems: [
        mc('Status 429', 'Înseamnă?', ['Not found', 'Too many requests', 'Server error', 'Forbidden'], 'Too many requests', 'Standard HTTP.', { topic: 'rate' }),
        mc('In-memory în serverless', 'Funcționează?', ['Da', 'Nu — multiple instance', 'Doar dev', 'Doar prod'], 'Nu — multiple instance', 'Necesită shared store.', { topic: 'rate' }),
        sa('Recomandat backend', '? (Redis / Upstash)', 'Redis', 'Shared store.', { topic: 'rate' }),
        mc('Sliding window', 'Avantaj?', ['Simplu', 'Distribuție mai uniformă', 'Mai rapid', 'Mai mic'], 'Distribuție mai uniformă', 'Vs fixed window burst.', { topic: 'rate' }),
        mc('Login limit', 'Pentru?', ['UX', 'Anti brute-force', 'CSS', 'SEO'], 'Anti brute-force', 'Securitate.', { topic: 'rate' }),
        mc('Per user key', 'Cum?', ['IP only', 'User ID dacă logat, IP altfel', 'Random', 'Cookie'], 'User ID dacă logat, IP altfel', 'Mai precis.', { topic: 'rate' }),
        mc('IP source', 'Header?', ['x-forwarded-for', 'x-real-ip', 'request.ip (Vercel)', 'Toate'], 'Toate', 'Multiple opțiuni.', { topic: 'rate' }),
        mc('Headers feedback', 'Standard?', ['X-RateLimit-Remaining', 'X-Rate-Left', 'Limit-Remaining', 'Toate'], 'X-RateLimit-Remaining', 'Convenție.', { topic: 'rate' }),
        mc('Retry-After', 'Header pentru?', ['Cât să aștepte client', 'Token', 'CSS', 'Routing'], 'Cât să aștepte client', 'Cooperative.', { topic: 'rate' }),
        mc('Edge funcs', 'Compatible Upstash?', ['Da', 'Nu', 'Doar Node', 'Random'], 'Da', 'Edge-friendly.', { topic: 'rate' }),
      ],
    },

    // ==================== 11. FILE UPLOAD ====================
    {
      slug: 'next-file-upload',
      title: '11. File Upload',
      isFree: false,
      theory: `# 📤 File Upload

## Form HTML

\`\`\`jsx
<form action="/api/upload" method="POST" encType="multipart/form-data">
  <input type="file" name="file" />
  <button>Upload</button>
</form>
\`\`\`

## Route Handler — primire

\`\`\`jsx
// app/api/upload/route.js
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return Response.json({ error: 'No file' }, { status: 400 });
  }

  // Convert la Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save în public/uploads
  const filePath = path.join(process.cwd(), 'public/uploads', file.name);
  await writeFile(filePath, buffer);

  return Response.json({ url: \`/uploads/\${file.name}\` });
}
\`\`\`

## Server Action — upload

\`\`\`jsx
'use server';
import { writeFile } from 'fs/promises';

export async function uploadFile(formData) {
  const file = formData.get('file');
  if (!file) throw new Error('No file');

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(\`./public/uploads/\${file.name}\`, buffer);

  return { success: true };
}
\`\`\`

## Validare

\`\`\`jsx
const MAX_SIZE = 5 * 1024 * 1024;   // 5MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

if (file.size > MAX_SIZE) {
  return Response.json({ error: 'Too large' }, { status: 400 });
}

if (!ALLOWED.includes(file.type)) {
  return Response.json({ error: 'Invalid type' }, { status: 400 });
}
\`\`\`

## Cloud storage (S3, Cloudinary, UploadThing)

### UploadThing (recomandat pentru Next.js)

\`\`\`bash
npm install uploadthing @uploadthing/react
\`\`\`

\`\`\`jsx
// app/api/uploadthing/core.js
import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new Error('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Uploaded:', file.url);
    }),
};
\`\`\`

### Vercel Blob

\`\`\`jsx
import { put } from '@vercel/blob';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  const blob = await put(file.name, file, { access: 'public' });
  return Response.json(blob);
}
\`\`\`

## ⚠️ NU folosi public/ în production!

În serverless (Vercel), \`public/\` e read-only. Folosește cloud storage.

## Pattern: image cu preview

\`\`\`jsx
'use client';
import { useState } from 'react';

function Upload() {
  const [preview, setPreview] = useState(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <div>
      <input type="file" onChange={handleChange} />
      {preview && <img src={preview} className="w-32 h-32" />}
    </div>
  );
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`formData.get('file')\` în server action / route
- ✅ \`arrayBuffer()\` → \`Buffer\` → \`writeFile\`
- ✅ Validare size + MIME type
- ✅ Cloud storage pentru production
- ✅ \`URL.createObjectURL\` pentru preview client
`,
      problems: [
        mc('Form encType', 'Pentru file?', ['application/json', 'multipart/form-data', 'text/html', 'urlencoded'], 'multipart/form-data', 'Standard.', { topic: 'upload' }),
        mc('FormData get file', 'Tip return?', ['String', 'File object', 'Buffer', 'Blob string'], 'File object', 'Web API File.', { topic: 'upload' }),
        sa('Convert to Buffer', 'Method? (Buffer.from(arrayBuffer))', 'Buffer.from', 'Node Buffer.', { topic: 'upload' }),
        mc('Public în serverless', 'Read-write?', ['Da', 'Nu — read-only', 'Doar dev', 'Doar build'], 'Nu — read-only', 'Vercel restricție.', { topic: 'upload' }),
        mc('Cloud storage Next', 'Recomandat?', ['UploadThing', 'S3', 'Vercel Blob', 'Toate valid'], 'Toate valid', 'Multiple opțiuni.', { topic: 'upload' }),
        mc('Validare MIME', 'De ce?', ['UX', 'Securitate', 'Speed', 'Random'], 'Securitate', 'Restricționează tipuri.', { topic: 'upload' }),
        mc('Preview client', 'Helper?', ['URL.createObjectURL', 'FileReader', 'Toate', 'JSON.parse'], 'Toate', 'Multiple metode.', { topic: 'upload' }),
        mc('Max size check', 'Cu ce?', ['file.size', 'file.length', 'sizeof', 'file.bytes'], 'file.size', 'Standard.', { topic: 'upload' }),
        mc('writeFile', 'Din?', ['fs', 'fs/promises', 'node:fs', 'A sau B'], 'A sau B', 'Promise version recomandat.', { topic: 'upload' }),
        mc('Auth în upload', 'Necesar?', ['Niciodată', 'Adesea — cine poate', 'Doar dev', 'Doar privat'], 'Adesea — cine poate', 'Restricționezi acces.', { topic: 'upload' }),
      ],
    },

    // ==================== 12. EMAIL ====================
    {
      slug: 'next-email',
      title: '12. Trimitere email',
      isFree: false,
      theory: `# 📧 Email cu Next.js

## Librării populare

- **Resend** (recomandat — modern, simplu)
- **Nodemailer** (clasic, SMTP)
- **SendGrid**, **Postmark**, **AWS SES**

## Resend

\`\`\`bash
npm install resend
\`\`\`

\`\`\`jsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@example.com',
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<h1>Hello!</h1>',
});
\`\`\`

## Cu React Email (templates)

\`\`\`bash
npm install @react-email/components
\`\`\`

\`\`\`jsx
// emails/welcome.jsx
import { Html, Body, Heading, Text, Button } from '@react-email/components';

export default function WelcomeEmail({ name }) {
  return (
    <Html>
      <Body>
        <Heading>Welcome, {name}!</Heading>
        <Text>Thanks for signing up.</Text>
        <Button href="https://app.com/dashboard">Go to dashboard</Button>
      </Body>
    </Html>
  );
}
\`\`\`

\`\`\`jsx
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/welcome';

const html = await render(<WelcomeEmail name="Ana" />);

await resend.emails.send({
  from: 'noreply@example.com',
  to: 'ana@example.com',
  subject: 'Welcome',
  html,
});

// Sau direct cu react: prop:
await resend.emails.send({
  from: 'noreply@example.com',
  to: 'ana@example.com',
  subject: 'Welcome',
  react: <WelcomeEmail name="Ana" />,
});
\`\`\`

## Nodemailer (SMTP)

\`\`\`bash
npm install nodemailer
\`\`\`

\`\`\`jsx
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await transporter.sendMail({
  from: 'noreply@example.com',
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Test</p>',
});
\`\`\`

> ⚠️ Nodemailer NU funcționează în Edge Runtime!

## Pattern: confirm email signup

\`\`\`jsx
'use server';
import { Resend } from 'resend';
import { createToken } from '@/lib/tokens';

const resend = new Resend(process.env.RESEND_KEY);

export async function signup(formData) {
  const email = formData.get('email');
  const user = await db.user.create({ data: { email } });

  const token = await createToken({ userId: user.id });
  const url = \`https://app.com/verify?token=\${token}\`;

  await resend.emails.send({
    from: 'noreply@app.com',
    to: email,
    subject: 'Verify your email',
    html: \`<a href="\${url}">Verify</a>\`,
  });
}
\`\`\`

## Templating cu variabile

\`\`\`jsx
const html = template
  .replace('{{name}}', user.name)
  .replace('{{link}}', resetLink);
\`\`\`

## ⚠️ Best practices

- 🛡️ NU expune API key client-side
- 📝 Folosește SPF/DKIM pentru deliverability
- 🚫 Rate limit (anti spam)
- ✅ Confirmation flows

## 🎓 Ce ai învățat
- ✅ Resend = modern, simplu
- ✅ React Email pentru templates
- ✅ Nodemailer pentru SMTP (Node only)
- ✅ Pattern confirm email cu token
`,
      problems: [
        mc('Resend', 'Tip?', ['Auth', 'Email API', 'DB', 'Routing'], 'Email API', 'Modern email.', { topic: 'email' }),
        mc('Nodemailer edge', 'Funcționează?', ['Da', 'Nu', 'Doar dev', 'Random'], 'Nu', 'Node-only.', { topic: 'email' }),
        sa('React Email', 'Pentru? (templates)', 'templates', 'JSX-based.', { topic: 'email' }),
        mc('Resend send', 'Metodă?', ['emails.send', 'send.email', 'sendMail', 'mail.send'], 'emails.send', 'API.', { topic: 'email' }),
        mc('Nodemailer transport', 'Tip?', ['SMTP', 'API', 'Ambele', 'Doar SMTP common'], 'Ambele', 'SMTP comun.', { topic: 'email' }),
        mc('SPF/DKIM', 'Pentru?', ['Speed', 'Deliverability', 'Encryption', 'Routing'], 'Deliverability', 'Anti-spam.', { topic: 'email' }),
        mc('From verified', 'Necesar?', ['Da, domain verified', 'Nu', 'Doar dev', 'Random'], 'Da, domain verified', 'Resend cere.', { topic: 'email' }),
        mc('Render React email', 'Helper?', ['render()', 'toHtml()', 'serialize', 'jsx2html'], 'render()', 'Din @react-email/render.', { topic: 'email' }),
        mc('Confirm pattern', 'Cu?', ['Token în URL', 'Cookie', 'localStorage', 'IP'], 'Token în URL', 'Standard.', { topic: 'email' }),
        mc('API key', 'Locul?', ['NEXT_PUBLIC env', 'Server-only env', 'Hardcodat', 'Cookie'], 'Server-only env', 'NU expune client.', { topic: 'email' }),
      ],
    },

    // ==================== 13. WEBHOOKS ====================
    {
      slug: 'next-webhooks',
      title: '13. Webhooks',
      isFree: false,
      theory: `# 🪝 Webhooks

## Ce e?

Endpoint care primește **POST requests** de la servicii externe (Stripe, GitHub, Telegram, etc.) când se întâmplă evenimente.

## Pattern basic

\`\`\`jsx
// app/api/webhooks/stripe/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.text();   // raw text!
  const signature = request.headers.get('stripe-signature');

  // Verifică semnătura...
  const event = verifyStripeSignature(body, signature);

  switch (event.type) {
    case 'payment.succeeded':
      await handlePayment(event.data);
      break;
  }

  return NextResponse.json({ received: true });
}
\`\`\`

## ⚠️ IMPORTANT: Verificare semnătură

NU trust webhook fără verificare! Atacatori pot trimite fake events.

## Stripe webhook complet

\`\`\`jsx
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await db.user.update({
        where: { id: session.metadata.userId },
        data: { plan: 'pro' },
      });
      break;
    case 'customer.subscription.deleted':
      // Handle cancellation
      break;
  }

  return NextResponse.json({ received: true });
}
\`\`\`

## GitHub webhook

\`\`\`jsx
import crypto from 'crypto';

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('x-hub-signature-256');

  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.GH_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== expected) {
    return new Response('Invalid', { status: 401 });
  }

  const event = JSON.parse(body);
  // Handle event...

  return new Response('OK');
}
\`\`\`

## Telegram bot webhook

\`\`\`jsx
export async function POST(request) {
  const update = await request.json();

  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    await fetch(\`https://api.telegram.org/bot\${process.env.BOT_TOKEN}/sendMessage\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: \`Echo: \${text}\` }),
    });
  }

  return Response.json({ ok: true });
}
\`\`\`

## ⚠️ Body raw

Pentru verificare semnătură, MUST folosești \`request.text()\` (nu \`json()\`):

\`\`\`jsx
const body = await request.text();
// Verify signature pe text
const event = JSON.parse(body);
\`\`\`

## Idempotency

Webhooks pot fi trimise de mai multe ori. Folosește unique IDs:

\`\`\`jsx
const exists = await db.webhookEvent.findUnique({ where: { id: event.id } });
if (exists) return Response.json({ skipped: true });

await db.webhookEvent.create({ data: { id: event.id } });
// Process...
\`\`\`

## Quick response

Răspunde rapid (< 5s), apoi process async:

\`\`\`jsx
export async function POST(request) {
  const event = await request.json();

  // Trigger background job
  await queue.add('process-webhook', event);

  return Response.json({ received: true });
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Webhooks = endpoints pentru events externe
- ✅ MEREU verifică semnătura
- ✅ Folosește \`request.text()\` pentru raw body
- ✅ Idempotency cu unique IDs
- ✅ Răspunde rapid, process async
`,
      problems: [
        mc('Webhook tip', 'HTTP method?', ['GET', 'POST', 'PUT', 'OPTIONS'], 'POST', 'Standard.', { topic: 'webhook' }),
        mc('Verificare', 'Semnătură?', ['Skip', 'Mereu verifică', 'Doar dev', 'Random'], 'Mereu verifică', 'Securitate.', { topic: 'webhook' }),
        sa('Raw body', 'Metodă? (request.text())', 'request.text()', 'NU json() pentru semnătură.', { topic: 'webhook' }),
        mc('Stripe verify', 'Helper?', ['stripe.webhooks.constructEvent', 'stripe.verify', 'stripe.check', 'stripe.parse'], 'stripe.webhooks.constructEvent', 'Built-in.', { topic: 'webhook' }),
        mc('GitHub HMAC', 'Algorithm?', ['md5', 'sha256', 'sha1', 'bcrypt'], 'sha256', 'X-Hub-Signature-256.', { topic: 'webhook' }),
        mc('Idempotency', 'Pentru?', ['Speed', 'Duplicate webhooks safe', 'CSS', 'Routing'], 'Duplicate webhooks safe', 'Pot veni duplicate.', { topic: 'webhook' }),
        mc('Response time', 'Trebuie?', ['Lent', 'Rapid (< 5s)', 'Niciun timp', 'Random'], 'Rapid (< 5s)', 'Altfel retry.', { topic: 'webhook' }),
        mc('Telegram bot', 'Setare webhook?', ['UI', 'API setWebhook', 'config', 'manual'], 'API setWebhook', 'Telegram API.', { topic: 'webhook' }),
        mc('Body parse', 'După verify?', ['JSON.parse(body)', 'request.json()', 'eval', 'A correct'], 'A correct', 'Body deja text.', { topic: 'webhook' }),
        mc('Background job', 'Pentru?', ['Sync work', 'Process lung după response', 'Routing', 'CSS'], 'Process lung după response', 'Quick ack + queue.', { topic: 'webhook' }),
      ],
    },

    // ==================== 14. SEARCH PARAMS / DYNAMIC ====================
    {
      slug: 'next-dynamic-segments',
      title: '14. Dynamic Segments și generateStaticParams',
      isFree: false,
      theory: `# 🛣️ Dynamic Routes Backend

## Dynamic segments

\`\`\`
app/blog/[slug]/page.js          → /blog/:slug
app/api/posts/[id]/route.js      → /api/posts/:id
\`\`\`

## Catch-all

\`\`\`
app/docs/[...slug]/page.js       → /docs/a/b/c
\`\`\`

\`\`\`jsx
// params.slug = ['a', 'b', 'c']
\`\`\`

## generateStaticParams (SSG)

Pre-renderizează la build time:

\`\`\`jsx
// app/blog/[slug]/page.js
export async function generateStaticParams() {
  const posts = await db.post.findMany();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.title}</article>;
}
\`\`\`

## dynamicParams

\`\`\`jsx
// În page sau layout
export const dynamicParams = false;   // 404 pentru params nestaticate
export const dynamicParams = true;    // default — generate on-demand
\`\`\`

## Hybrid: pre-build top + on-demand

\`\`\`jsx
export async function generateStaticParams() {
  // Pre-build doar top 100 popular
  const posts = await db.post.findMany({ orderBy: { views: 'desc' }, take: 100 });
  return posts.map(p => ({ slug: p.slug }));
}

export const dynamicParams = true;   // Restul — on-demand
export const revalidate = 3600;      // ISR cu TTL 1h
\`\`\`

## Multiple dynamic params

\`\`\`
app/shop/[category]/[id]/page.js
\`\`\`

\`\`\`jsx
export async function generateStaticParams() {
  const products = await db.product.findMany();
  return products.map(p => ({
    category: p.category,
    id: p.id.toString(),
  }));
}
\`\`\`

## Generate pentru părinte

Pentru \`app/[lang]/[slug]/page.js\`:

\`\`\`jsx
// app/[lang]/layout.js — generează pentru lang
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ro' }];
}

// app/[lang]/[slug]/page.js — generează pentru slug în fiecare lang
export async function generateStaticParams({ params: { lang } }) {
  const posts = await getPosts(lang);
  return posts.map(p => ({ slug: p.slug }));
}
\`\`\`

## Build output

\`\`\`
Route (app)                     Size     Type
○ /blog/[slug]                  2 kB     SSG
\`\`\`

- ○ Static
- ● Dynamic
- ƒ Functional (server function)

## On-demand revalidation pentru dynamic routes

\`\`\`jsx
'use server';
import { revalidatePath } from 'next/cache';

export async function updatePost(id) {
  await db.post.update({ where: { id }, data: { ... } });
  revalidatePath(\`/blog/\${id}\`);
}
\`\`\`

## API dynamic

\`\`\`jsx
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params;
  const user = await db.user.findUnique({ where: { id: Number(id) } });
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(user);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.user.delete({ where: { id: Number(id) } });
  return Response.json({ deleted: true });
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`generateStaticParams\` pentru SSG
- ✅ \`dynamicParams\` controlează fallback
- ✅ Hybrid: pre-build + on-demand
- ✅ Same pattern pentru pages și API routes
`,
      problems: [
        mc('SSG pentru dynamic', 'Funcție?', ['getStaticPaths', 'generateStaticParams', 'staticPaths', 'preGenerate'], 'generateStaticParams', 'App Router.', { topic: 'dynamic' }),
        mc('dynamicParams false', 'Înseamnă?', ['Generate on-demand', '404 pentru ne-listate', 'Random', 'Crash'], '404 pentru ne-listate', 'Restrictiv.', { topic: 'dynamic' }),
        sa('Catch-all', 'Sintaxa? ([...slug])', '[...slug]', 'Spread.', { topic: 'dynamic' }),
        mc('params async', 'Next 15?', ['Object', 'Promise', 'Array', 'String'], 'Promise', 'await params.', { topic: 'dynamic' }),
        mc('Hybrid SSG', 'Cu?', ['generateStaticParams + dynamicParams=true', 'Doar SSG', 'Doar SSR', 'Doar ISR'], 'generateStaticParams + dynamicParams=true', 'Top + on-demand.', { topic: 'dynamic' }),
        mc('Build symbol static', 'Care?', ['●', '○', 'ƒ', '★'], '○', 'Convenție Next.', { topic: 'dynamic' }),
        mc('API dynamic param', 'În arg 2?', ['{ params }', 'request.params', 'global', 'router'], '{ params }', 'Destructured.', { topic: 'dynamic' }),
        mc('revalidatePath dynamic', 'Trimite?', ['Path full /blog/123', '/blog/[slug]', 'Random', 'Imposibil'], 'Path full /blog/123', 'Cu valoare reală.', { topic: 'dynamic' }),
        mc('Multiple params SSG', 'Returnează?', ['Array de obiecte cu toate', 'Array string', 'Object', 'Map'], 'Array de obiecte cu toate', 'Toate combinations.', { topic: 'dynamic' }),
        mc('catch-all params type', 'Care?', ['String', 'Array', 'Object', 'Number'], 'Array', 'Splits by /.', { topic: 'dynamic' }),
      ],
    },

    // ==================== 15. SECURITY ====================
    {
      slug: 'next-security',
      title: '15. Security best practices',
      isFree: false,
      theory: `# 🔒 Security în Next.js

## 1. Validare input (Zod)

NU trust user input. Validează SERVER-side mereu.

\`\`\`jsx
const schema = z.object({ email: z.string().email() });
const result = schema.safeParse(input);
if (!result.success) return error;
\`\`\`

## 2. SQL Injection — folosește ORM

\`\`\`jsx
// ❌ NU
const q = \`SELECT * FROM users WHERE email = '\${email}'\`;

// ✅ Prisma (parametrizat automat)
prisma.user.findFirst({ where: { email } });
\`\`\`

## 3. XSS — React escape implicit

✅ React escape automat
❌ \`dangerouslySetInnerHTML\` cu user content fără sanitize

\`\`\`jsx
// ❌ Periculos
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitize cu DOMPurify
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput);
\`\`\`

## 4. CSRF — Server Actions au protecție built-in

În Next.js 15+, Server Actions verifică Origin header automatic.

## 5. Cookies sigure

\`\`\`jsx
cookies.set('token', value, {
  httpOnly: true,    // No JS access
  secure: true,      // HTTPS only
  sameSite: 'lax',   // CSRF protection
});
\`\`\`

## 6. Password hashing — bcrypt

\`\`\`jsx
import bcrypt from 'bcryptjs';

// Hash
const hash = await bcrypt.hash(password, 12);

// Verify
const valid = await bcrypt.compare(password, hash);
\`\`\`

## 7. JWT — jose (edge-safe)

\`\`\`jsx
import { SignJWT, jwtVerify } from 'jose';

// Sign
const jwt = await new SignJWT({ userId: 1 })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('1h')
  .sign(secret);

// Verify
const { payload } = await jwtVerify(jwt, secret);
\`\`\`

## 8. Rate limiting

(vezi lecția 10)

## 9. Authorization checks

\`\`\`jsx
'use server';
export async function deletePost(id) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const post = await db.post.findUnique({ where: { id } });
  if (post.authorId !== session.user.id) {
    throw new Error('Forbidden');
  }

  await db.post.delete({ where: { id } });
}
\`\`\`

## 10. Environment variables

✅ Server-only secrets (no \`NEXT_PUBLIC_\`)
✅ \`.env.local\` în \`.gitignore\`

## 11. Headers de securitate (next.config.js)

\`\`\`js
module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
      ],
    }];
  },
};
\`\`\`

## 12. CSP (Content Security Policy)

\`\`\`js
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
}
\`\`\`

## 13. CORS

\`\`\`jsx
return NextResponse.json(data, {
  headers: {
    'Access-Control-Allow-Origin': 'https://trusted.com',
    'Access-Control-Allow-Methods': 'GET, POST',
  },
});
\`\`\`

## 14. Logging

NU loga: passwords, tokens, PII (Personally Identifiable Info).

## 🎓 Ce ai învățat
- ✅ Validare server-side cu Zod
- ✅ ORM previne SQL injection
- ✅ bcrypt pentru passwords
- ✅ jose pentru JWT (edge)
- ✅ Cookies cu httpOnly + secure + sameSite
- ✅ Authorization (NU doar auth)
`,
      problems: [
        mc('Validare', 'Unde?', ['Doar client', 'Server (mereu)', 'Doar dev', 'Random'], 'Server (mereu)', 'Client poate fi bypass.', { topic: 'sec' }),
        mc('SQL injection', 'Prevenire?', ['Concat strings', 'ORM/parametrizat', 'eval', 'JSON'], 'ORM/parametrizat', 'Auto-escape.', { topic: 'sec' }),
        sa('Hashing', 'Lib? (bcrypt)', 'bcrypt', 'Standard.', { topic: 'sec' }),
        mc('XSS protection', 'React?', ['Auto escape', 'No protection', 'Manual', 'Doar dev'], 'Auto escape', 'JSX safe by default.', { topic: 'sec' }),
        mc('Sanitize HTML', 'Lib?', ['DOMPurify', 'sanitize', 'cleanHTML', 'escape'], 'DOMPurify', 'Standard.', { topic: 'sec' }),
        mc('JWT edge', 'Lib?', ['jsonwebtoken', 'jose', 'jwt', 'crypto'], 'jose', 'Edge-compatible.', { topic: 'sec' }),
        mc('Cookie httpOnly', 'Pentru?', ['Speed', 'Anti-XSS (no JS access)', 'CSS', 'Routing'], 'Anti-XSS (no JS access)', 'Securitate.', { topic: 'sec' }),
        mc('Authorization', 'Diferit de auth?', ['Identice', 'Auth = cine; Authz = ce poate face', 'Doar dev', 'Random'], 'Auth = cine; Authz = ce poate face', 'Două concepte.', { topic: 'sec' }),
        mc('CSRF Server Actions', 'Protejat?', ['Manual', 'Built-in (Origin check)', 'Niciun', 'Doar dev'], 'Built-in (Origin check)', 'Next 15.', { topic: 'sec' }),
        mc('Headers security', 'În?', ['next.config.js headers()', 'middleware', 'A sau B', 'Doar config'], 'A sau B', 'Multiple opțiuni.', { topic: 'sec' }),
      ],
    },

    // ==================== 16. CRON & BACKGROUND JOBS ====================
    {
      slug: 'next-cron-jobs',
      title: '16. Cron jobs și background tasks',
      isFree: false,
      theory: `# ⏰ Cron Jobs

## Vercel Cron (recomandat pe Vercel)

\`\`\`json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/notifications",
      "schedule": "*/5 * * * *"
    }
  ]
}
\`\`\`

## Cron syntax

\`\`\`
* * * * *
| | | | └─ day of week (0-7)
| | | └─── month (1-12)
| | └───── day of month (1-31)
| └─────── hour (0-23)
└───────── minute (0-59)
\`\`\`

Exemple:
- \`0 * * * *\` — la fiecare oră
- \`0 0 * * *\` — zilnic la miezul nopții
- \`*/15 * * * *\` — la fiecare 15 minute
- \`0 9 * * 1\` — luni la 9 dimineața

## Endpoint cron

\`\`\`jsx
// app/api/cron/cleanup/route.js
export async function GET(request) {
  // Verifică secret pentru securitate
  const auth = request.headers.get('authorization');
  if (auth !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Cleanup logic
  const oldRecords = await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return Response.json({ deleted: oldRecords.count });
}
\`\`\`

## Vercel auto-trimite header

\`\`\`
authorization: Bearer <CRON_SECRET>
\`\`\`

\`CRON_SECRET\` în env vars.

## Alternative non-Vercel

### Upstash QStash
\`\`\`bash
npm install @upstash/qstash
\`\`\`

\`\`\`jsx
import { Client } from '@upstash/qstash';

const client = new Client({ token: process.env.QSTASH_TOKEN });

await client.publishJSON({
  url: 'https://app.com/api/cron/task',
  cron: '0 * * * *',
});
\`\`\`

### GitHub Actions
\`\`\`yaml
# .github/workflows/cron.yml
on:
  schedule:
    - cron: '0 * * * *'
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST -H "Authorization: Bearer \${{ secrets.CRON_SECRET }}" https://app.com/api/cron/task
\`\`\`

## Background jobs (non-cron)

### Inngest
\`\`\`bash
npm install inngest
\`\`\`

\`\`\`jsx
import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'app' });

// Define function
export const sendWelcome = inngest.createFunction(
  { id: 'send-welcome' },
  { event: 'user.signup' },
  async ({ event, step }) => {
    await step.run('send-email', async () => {
      await sendEmail(event.data.email);
    });
  }
);

// Trigger
await inngest.send({ name: 'user.signup', data: { email: 'a@b.com' } });
\`\`\`

### BullMQ (cu Redis)

Pentru aplicații full-Node.

## Pattern: cleanup expired sessions

\`\`\`jsx
// app/api/cron/cleanup/route.js
export async function GET(request) {
  // Auth check...

  const result = await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return Response.json({ deleted: result.count });
}
\`\`\`

## Pattern: send daily emails

\`\`\`jsx
export async function GET() {
  const users = await db.user.findMany({
    where: { dailyDigestEnabled: true },
  });

  await Promise.all(
    users.map(u => resend.emails.send({
      from: 'noreply@app.com',
      to: u.email,
      subject: 'Daily Digest',
      html: '...',
    }))
  );

  return Response.json({ sent: users.length });
}
\`\`\`

## Limitări Vercel

- Hobby: max 2 cron jobs
- Pro: more crons
- Max 10s execution (Hobby), 60s (Pro)

## 🎓 Ce ai învățat
- ✅ Vercel Cron via \`vercel.json\`
- ✅ Cron syntax (5 fielduri)
- ✅ Verifică \`CRON_SECRET\` pentru securitate
- ✅ Alternatives: QStash, GitHub Actions
- ✅ Background jobs: Inngest, BullMQ
`,
      problems: [
        mc('Vercel cron config', 'Fișier?', ['cron.json', 'vercel.json', 'next.config', '.cron'], 'vercel.json', 'Standard Vercel.', { topic: 'cron' }),
        mc('Field count', 'Cron syntax?', ['3', '4', '5', '6'], '5', 'min/hour/dom/month/dow.', { topic: 'cron' }),
        sa('Daily midnight', 'Sintaxa? (0 0 * * *)', '0 0 * * *', 'Standard.', { topic: 'cron' }),
        mc('Securitate cron', 'Verificare?', ['Skip', 'Bearer secret', 'Cookie', 'IP'], 'Bearer secret', 'CRON_SECRET env.', { topic: 'cron' }),
        mc('Vercel header', 'Trimis?', ['authorization Bearer', 'cron-token', 'x-cron', 'cookie'], 'authorization Bearer', 'Standard.', { topic: 'cron' }),
        mc('QStash', 'Tip?', ['DB', 'Cron + queue serverless', 'Auth', 'Routing'], 'Cron + queue serverless', 'Upstash.', { topic: 'cron' }),
        mc('Inngest', 'Pentru?', ['DB', 'Background jobs + workflows', 'Auth', 'CSS'], 'Background jobs + workflows', 'Modern.', { topic: 'cron' }),
        mc('Hobby cron limit', 'Câte?', ['2', '5', '10', 'Unlimited'], '2', 'Vercel Hobby.', { topic: 'cron' }),
        mc('Endpoint method', 'Cron?', ['POST', 'GET', 'PUT', 'PATCH'], 'GET', 'Vercel cron uses GET.', { topic: 'cron' }),
        mc('GitHub Actions', 'Pentru cron?', ['Da', 'Nu', 'Doar dev', 'Doar build'], 'Da', 'Schedule events.', { topic: 'cron' }),
      ],
    },

    // ==================== 17. STREAMING RESPONSES ====================
    {
      slug: 'next-streaming-responses',
      title: '17. Streaming responses',
      isFree: false,
      theory: `# 🌊 Streaming HTTP Responses

## De ce?

- Trimite date pe măsură ce sunt gata
- Útil pentru AI (LLM tokens), large files, SSE

## ReadableStream basic

\`\`\`jsx
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue('Hello ');
      await new Promise(r => setTimeout(r, 1000));
      controller.enqueue('World!');
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
\`\`\`

## Server-Sent Events (SSE)

\`\`\`jsx
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 5; i++) {
        const data = \`data: \${JSON.stringify({ count: i })}\\n\\n\`;
        controller.enqueue(encoder.encode(data));
        await new Promise(r => setTimeout(r, 1000));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
\`\`\`

## Client SSE

\`\`\`jsx
'use client';
import { useEffect, useState } from 'react';

function Live() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const es = new EventSource('/api/sse');
    es.onmessage = (e) => {
      setData(prev => [...prev, JSON.parse(e.data)]);
    };
    return () => es.close();
  }, []);

  return <ul>{data.map((d, i) => <li key={i}>{d.count}</li>)}</ul>;
}
\`\`\`

## OpenAI streaming pattern

\`\`\`jsx
import OpenAI from 'openai';

export async function POST(request) {
  const { prompt } = await request.json();
  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream);
}
\`\`\`

## Vercel AI SDK (recomandat pentru AI)

\`\`\`bash
npm install ai @ai-sdk/openai
\`\`\`

\`\`\`jsx
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4'),
    messages,
  });

  return result.toDataStreamResponse();
}
\`\`\`

## Client cu Vercel AI

\`\`\`jsx
'use client';
import { useChat } from 'ai/react';

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => <div key={m.id}>{m.role}: {m.content}</div>)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button>Send</button>
      </form>
    </div>
  );
}
\`\`\`

## Edge runtime pentru streaming

\`\`\`jsx
export const runtime = 'edge';
\`\`\`

> 💡 Edge = mai rapid pentru streaming.

## 🎓 Ce ai învățat
- ✅ \`ReadableStream\` pentru chunked responses
- ✅ SSE = format \`data: ...\\n\\n\`
- ✅ OpenAI streaming cu chunks
- ✅ Vercel AI SDK = abstraction utilă
- ✅ \`runtime = 'edge'\` pentru speed
`,
      problems: [
        mc('Stream class', 'Care?', ['ReadableStream', 'StreamReader', 'WriteStream', 'Stream'], 'ReadableStream', 'Web Stream API.', { topic: 'stream-resp' }),
        mc('SSE format', 'Sintaxa?', ['JSON', 'data: {}\\n\\n', 'XML', '<event>'], 'data: {}\\n\\n', 'Standard SSE.', { topic: 'stream-resp' }),
        sa('Client SSE', 'Constructor? (EventSource)', 'EventSource', 'Browser API.', { topic: 'stream-resp' }),
        mc('Content-Type SSE', 'Care?', ['application/json', 'text/event-stream', 'text/plain', 'stream'], 'text/event-stream', 'Standard.', { topic: 'stream-resp' }),
        mc('AI SDK', 'Vercel?', ['ai package', 'next-ai', 'openai-next', 'ai-sdk'], 'ai package', 'Standard.', { topic: 'stream-resp' }),
        mc('useChat hook', 'Din?', ['react', 'ai/react', 'next/ai', 'next-chat'], 'ai/react', 'Vercel AI SDK.', { topic: 'stream-resp' }),
        mc('Edge benefit stream', 'Care?', ['Mai lent', 'Mai rapid TTFB', 'Mai mare', 'Random'], 'Mai rapid TTFB', 'Edge proximity.', { topic: 'stream-resp' }),
        mc('Encoder pentru bytes', 'Care?', ['TextEncoder', 'TextDecoder', 'Buffer', 'String'], 'TextEncoder', 'String → Uint8Array.', { topic: 'stream-resp' }),
        mc('controller', 'Methods?', ['enqueue, close', 'add, end', 'push, finish', 'send, done'], 'enqueue, close', 'ReadableStream API.', { topic: 'stream-resp' }),
        mc('OpenAI stream', 'Opțiune?', ['stream: true', 'streaming: true', 'mode: stream', 'live: true'], 'stream: true', 'API option.', { topic: 'stream-resp' }),
      ],
    },

    // ==================== 18. ERROR HANDLING BACKEND ====================
    {
      slug: 'next-backend-errors',
      title: '18. Error Handling Backend',
      isFree: false,
      theory: `# ⚠️ Error Handling Backend

## try/catch în route handlers

\`\`\`jsx
export async function POST(request) {
  try {
    const data = await request.json();
    const result = await db.user.create({ data });
    return Response.json(result, { status: 201 });
  } catch (e) {
    if (e.code === 'P2002') {   // Prisma unique violation
      return Response.json({ error: 'Email exists' }, { status: 409 });
    }
    console.error(e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
\`\`\`

## Custom Error class

\`\`\`jsx
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized', 401, 'UNAUTHORIZED');
  }
}
\`\`\`

## Helper: handleError

\`\`\`jsx
export function handleApiError(error) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  if (error instanceof z.ZodError) {
    return Response.json(
      { error: 'Validation failed', issues: error.flatten() },
      { status: 400 }
    );
  }
  console.error('Unexpected:', error);
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
\`\`\`

## Folosire

\`\`\`jsx
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await db.user.findUnique({ where: { id: Number(id) } });
    if (!user) throw new NotFoundError('User');
    return Response.json(user);
  } catch (e) {
    return handleApiError(e);
  }
}
\`\`\`

## Server Action errors

\`\`\`jsx
'use server';
export async function createPost(prevState, formData) {
  try {
    const data = schema.parse(Object.fromEntries(formData));
    await db.post.create({ data });
    return { success: true };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { error: 'Invalid input', fields: e.flatten().fieldErrors };
    }
    return { error: 'Server error' };
  }
}
\`\`\`

## Logging

### Dev: console
\`\`\`jsx
console.error('[API]', error);
\`\`\`

### Production: Sentry
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

\`\`\`jsx
import * as Sentry from '@sentry/nextjs';
Sentry.captureException(error);
\`\`\`

## Pattern: response standardizat

\`\`\`jsx
export function ok(data) {
  return Response.json({ ok: true, data });
}

export function fail(message, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}
\`\`\`

\`\`\`jsx
return ok(user);
return fail('Not found', 404);
\`\`\`

## Status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## ⚠️ NU expune detalii sensibile

\`\`\`jsx
// ❌
return Response.json({ error: e.stack });

// ✅
console.error(e);
return Response.json({ error: 'Something went wrong' });
\`\`\`

## 🎓 Ce ai învățat
- ✅ try/catch în handlers
- ✅ Custom error classes
- ✅ Helper handleApiError centralizat
- ✅ Sentry pentru production
- ✅ Status codes standard
- ✅ NU expune stack/internal details
`,
      problems: [
        mc('Status created', 'Care?', ['200', '201', '204', '301'], '201', 'POST → resource creat.', { topic: 'errors' }),
        mc('Conflict', 'Care?', ['400', '409', '422', '500'], '409', 'Ex: email duplicate.', { topic: 'errors' }),
        sa('Validation error', 'Status? (400 sau 422)', '400', 'Bad request sau unprocessable.', { topic: 'errors' }),
        mc('Unauthorized', 'Care?', ['400', '401', '403', '404'], '401', 'Nu autentificat.', { topic: 'errors' }),
        mc('Forbidden', 'Care?', ['401', '403', '404', '500'], '403', 'Autenticat dar fără permisiune.', { topic: 'errors' }),
        mc('Sentry', 'Pentru?', ['Routing', 'Error monitoring', 'Auth', 'CSS'], 'Error monitoring', 'Production.', { topic: 'errors' }),
        mc('Stack expose', 'OK în production?', ['Da', 'Nu — info leak', 'Doar staging', 'Random'], 'Nu — info leak', 'Securitate.', { topic: 'errors' }),
        mc('ZodError', 'Helper?', ['.flatten()', '.format()', 'Ambele', '.errors'], 'Ambele', 'Multiple opțiuni.', { topic: 'errors' }),
        mc('Prisma unique', 'Code?', ['P1001', 'P2002', 'P3003', 'E001'], 'P2002', 'Unique constraint violation.', { topic: 'errors' }),
        mc('Custom error class', 'Extends?', ['Object', 'Error', 'Exception', 'Throwable'], 'Error', 'Native JavaScript.', { topic: 'errors' }),
      ],
    },

    // ==================== 19. TESTING ====================
    {
      slug: 'next-testing',
      title: '19. Testing Backend',
      isFree: false,
      theory: `# 🧪 Testing

## Tools

- **Vitest** (recomandat — rapid, modern)
- **Jest** (clasic)
- **Playwright** (E2E)
- **MSW** (mock fetch/HTTP)

## Setup Vitest

\`\`\`bash
npm install -D vitest @vitejs/plugin-react jsdom
\`\`\`

\`\`\`js
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom' },
});
\`\`\`

## Test basic

\`\`\`jsx
// math.test.js
import { describe, it, expect } from 'vitest';

describe('add', () => {
  it('adds 2 numbers', () => {
    expect(2 + 3).toBe(5);
  });
});
\`\`\`

## Test API route

\`\`\`jsx
// app/api/users/route.test.js
import { GET } from './route';
import { describe, it, expect, vi } from 'vitest';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn().mockResolvedValue([{ id: 1, email: 'a@b.com' }]),
    },
  },
}));

describe('GET /api/users', () => {
  it('returns users', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].email).toBe('a@b.com');
  });
});
\`\`\`

## Test Server Action

\`\`\`jsx
import { createPost } from './actions';

it('creates post', async () => {
  const formData = new FormData();
  formData.append('title', 'Test');
  const result = await createPost(null, formData);
  expect(result.success).toBe(true);
});
\`\`\`

## Test cu DB (real, test DB)

\`\`\`jsx
import { beforeEach, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.\$disconnect();
});

it('creates user', async () => {
  const user = await prisma.user.create({ data: { email: 'test@b.com' } });
  expect(user.id).toBeDefined();
});
\`\`\`

## Mock fetch

\`\`\`jsx
import { vi } from 'vitest';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked' }),
  })
);
\`\`\`

## MSW (Mock Service Worker)

\`\`\`jsx
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1 }]);
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
\`\`\`

## Component test (RTL)

\`\`\`bash
npm install -D @testing-library/react @testing-library/jest-dom
\`\`\`

\`\`\`jsx
import { render, screen } from '@testing-library/react';
import Counter from './Counter';

it('renders count', () => {
  render(<Counter />);
  expect(screen.getByText(/0/)).toBeInTheDocument();
});
\`\`\`

## E2E cu Playwright

\`\`\`bash
npm init playwright@latest
\`\`\`

\`\`\`jsx
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name=email]', 'a@b.com');
  await page.fill('input[name=password]', 'pw');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
\`\`\`

## Coverage

\`\`\`bash
vitest run --coverage
\`\`\`

## CI/CD (GitHub Actions)

\`\`\`yaml
- run: npm test
- run: npm run test:e2e
\`\`\`

## 🎓 Ce ai învățat
- ✅ Vitest = modern, rapid
- ✅ Mock cu \`vi.mock()\`
- ✅ Test API routes apelând handlers direct
- ✅ MSW pentru mock HTTP
- ✅ Playwright pentru E2E
`,
      problems: [
        mc('Test runner modern', 'Care?', ['Mocha', 'Vitest', 'Tape', 'AVA'], 'Vitest', 'Vite-based.', { topic: 'test' }),
        mc('Mock module', 'Vitest?', ['vi.mock', 'jest.mock', 'mock()', 'fake()'], 'vi.mock', 'API.', { topic: 'test' }),
        sa('E2E tool', 'Modern? (Playwright)', 'Playwright', 'Cross-browser.', { topic: 'test' }),
        mc('MSW', 'Pentru?', ['Mock HTTP', 'DB', 'Routing', 'CSS'], 'Mock HTTP', 'Service Worker.', { topic: 'test' }),
        mc('RTL', 'Pentru?', ['API', 'Component testing', 'E2E', 'Performance'], 'Component testing', 'React.', { topic: 'test' }),
        mc('Test API route', 'Cum?', ['HTTP request real', 'Apel direct GET()', 'Postman', 'Browser'], 'Apel direct GET()', 'Import handler.', { topic: 'test' }),
        mc('Coverage', 'Flag?', ['--cov', '--coverage', '--report', '--c'], '--coverage', 'Standard.', { topic: 'test' }),
        mc('beforeEach', 'Pentru?', ['După fiecare test', 'Înainte de fiecare test', 'O singură dată', 'Random'], 'Înainte de fiecare test', 'Setup.', { topic: 'test' }),
        mc('Test DB', 'Recomandat?', ['Production DB', 'Test DB separat', 'Mock', 'A sau C'], 'A sau C', 'Test DB sau mock.', { topic: 'test' }),
        mc('Playwright assert', 'Helper?', ['expect(page).to', 'assert', 'should', 'verify'], 'expect(page).to', 'Built-in.', { topic: 'test' }),
      ],
    },

    // ==================== 20. CACHING & ISR ====================
    {
      slug: 'next-isr-advanced',
      title: '20. ISR avansat',
      isFree: false,
      theory: `# 🔄 ISR (Incremental Static Regeneration)

## Concept

- Pagini statice (rapid)
- Re-build automat după TTL
- Sau on-demand cu \`revalidatePath\`

## Time-based revalidation

\`\`\`jsx
// app/blog/[slug]/page.js
export const revalidate = 60;   // Re-fetch după 60s

export default async function Page({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.title}</article>;
}
\`\`\`

## Per-fetch revalidation

\`\`\`jsx
const data = await fetch(url, { next: { revalidate: 60 } });
\`\`\`

> 💡 Cele mai apropiate revalidate câștigă (cel mai mic).

## On-demand: revalidatePath

\`\`\`jsx
'use server';
import { revalidatePath } from 'next/cache';

export async function updatePost(id) {
  await db.post.update({ where: { id }, data: { ... } });
  revalidatePath(\`/blog/\${id}\`);
  revalidatePath('/blog');   // Și lista
}
\`\`\`

## On-demand: revalidateTag

\`\`\`jsx
// Marchează fetch cu tag
const data = await fetch(url, { next: { tags: ['posts'] } });

// Invalidate când vrei
'use server';
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
\`\`\`

## Webhook pentru revalidation

\`\`\`jsx
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const auth = request.headers.get('authorization');
  if (auth !== \`Bearer \${process.env.REVALIDATE_SECRET}\`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path, tag } = await request.json();
  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);

  return Response.json({ revalidated: true });
}
\`\`\`

## CMS integration pattern

CMS publică → trimite webhook → Next.js revalidează:

\`\`\`
Sanity/Contentful → POST /api/revalidate { path: '/blog/...' }
\`\`\`

## Layout-level revalidation

\`\`\`jsx
revalidatePath('/dashboard', 'layout');
// Re-build toate sub-rute /dashboard/*
\`\`\`

## SSG complet pentru toate paginile

\`\`\`jsx
export async function generateStaticParams() {
  const posts = await db.post.findMany();
  return posts.map(p => ({ slug: p.slug }));
}

export const dynamicParams = false;   // 404 pentru ne-listate
\`\`\`

## Hibrid: SSG + ISR pentru noi pages

\`\`\`jsx
export async function generateStaticParams() {
  const popular = await db.post.findMany({ orderBy: { views: 'desc' }, take: 100 });
  return popular.map(p => ({ slug: p.slug }));
}

export const dynamicParams = true;   // Generate on-demand
export const revalidate = 3600;       // Refresh hourly
\`\`\`

## ⚠️ Comportament în Next 15

În Next 15, defaultul cache-ului \`fetch\` e **no-store** (schimbat din 14). Trebuie explicit:

\`\`\`jsx
fetch(url, { cache: 'force-cache' });
fetch(url, { next: { revalidate: 60 } });
\`\`\`

## Vezi cache status

\`\`\`bash
npm run build
\`\`\`

Output afișează ce e static, ce e dynamic, ce e ISR.

## 🎓 Ce ai învățat
- ✅ \`revalidate\` time-based
- ✅ \`revalidatePath\` și \`revalidateTag\` on-demand
- ✅ Webhook pattern din CMS
- ✅ Hibrid SSG + ISR
- ✅ Next 15 default schimbat la no-store
`,
      problems: [
        mc('ISR', 'Înseamnă?', ['Internal SSR', 'Incremental Static Regeneration', 'Instant SR', 'Index SR'], 'Incremental Static Regeneration', 'Standard.', { topic: 'isr' }),
        mc('Revalidate config', 'În page?', ['export const revalidate = 60', 'config.revalidate = 60', 'isr = 60', 'ttl = 60'], 'export const revalidate = 60', 'Route segment.', { topic: 'isr' }),
        sa('On-demand path', 'Helper? (revalidatePath)', 'revalidatePath', 'Din next/cache.', { topic: 'isr' }),
        mc('Tag revalidate', 'Helper?', ['revalidateTag', 'invalidateTag', 'tagBust', 'cacheTag'], 'revalidateTag', 'Standard.', { topic: 'isr' }),
        mc('Webhook revalidation', 'Pattern?', ['CMS → Next API', 'Manual', 'Cron', 'Toate posibile'], 'Toate posibile', 'Multiple opțiuni.', { topic: 'isr' }),
        mc('Layout revalidate', 'Argument?', ['"layout"', '"page"', '"all"', 'true'], '"layout"', 'Al 2-lea arg.', { topic: 'isr' }),
        mc('Default Next 15', 'fetch?', ['Cached', 'No-store', 'Mixed', 'User config'], 'No-store', 'Schimbat din 14.', { topic: 'isr' }),
        mc('Force cache', 'Opțiune?', ['cache: "force-cache"', 'cache: true', 'static: true', 'cached: true'], 'cache: "force-cache"', 'Standard.', { topic: 'isr' }),
        mc('Securitate webhook', 'Header?', ['Bearer secret', 'Cookie', 'IP', 'Niciun'], 'Bearer secret', 'Best practice.', { topic: 'isr' }),
        mc('Cel mai mic TTL', 'Câștigă?', ['Da', 'Nu', 'Ultimul setat', 'Random'], 'Da', 'Cel mai mic.', { topic: 'isr' }),
      ],
    },

    // ==================== 21. SESSIONS ====================
    {
      slug: 'next-sessions',
      title: '21. Sessions custom (fără NextAuth)',
      isFree: false,
      theory: `# 🎫 Custom Sessions

## De ce custom?

- Control total
- Fără overhead
- Învăți cum funcționează auth

## Pattern: JWT în cookie

### lib/session.js

\`\`\`jsx
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const c = await cookies();
  c.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function getSession() {
  const c = await cookies();
  const token = c.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const c = await cookies();
  c.delete('session');
}
\`\`\`

## Login action

\`\`\`jsx
'use server';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid' };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: 'Invalid' };

  await createSession({ userId: user.id, email: user.email });
  redirect('/dashboard');
}
\`\`\`

## Logout action

\`\`\`jsx
'use server';
import { destroySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function logout() {
  await destroySession();
  redirect('/login');
}
\`\`\`

## Get current user în server component

\`\`\`jsx
import { getSession } from '@/lib/session';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/login');

  return <p>Hello {session.email}</p>;
}
\`\`\`

## Middleware-based protection

\`\`\`jsx
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(request) {
  const token = request.cookies.get('session')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = { matcher: ['/dashboard/:path*'] };
\`\`\`

## Database sessions (alternative)

În loc de JWT, stochezi sessionId în cookie + record în DB:

\`\`\`jsx
// Login
const session = await db.session.create({
  data: { userId: user.id, expires: addDays(new Date(), 7) },
});
cookies.set('sid', session.id, { httpOnly: true });

// Get user
const sessionId = cookies.get('sid')?.value;
const session = await db.session.findUnique({
  where: { id: sessionId },
  include: { user: true },
});
\`\`\`

> 💡 Database sessions = poți "kick" user instant.

## Refresh tokens

\`\`\`jsx
async function refreshSession() {
  const current = await getSession();
  if (!current) return null;
  await createSession(current);   // Re-issue cu new exp
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ JWT în cookie (\`jose\`)
- ✅ Cookies httpOnly + secure + sameSite
- ✅ Server actions pentru login/logout
- ✅ Middleware pentru protect rute
- ✅ DB sessions ca alternativă
`,
      problems: [
        mc('JWT lib edge', 'Care?', ['jsonwebtoken', 'jose', 'crypto-js', 'bcrypt'], 'jose', 'Edge-compatible.', { topic: 'session' }),
        mc('Cookie security', 'Trei flag-uri?', ['httpOnly + secure + sameSite', 'lax + strict + none', 'Toate', 'maxAge + path'], 'httpOnly + secure + sameSite', 'Pentru securitate.', { topic: 'session' }),
        sa('Hash password', 'Lib? (bcrypt)', 'bcrypt', 'Standard.', { topic: 'session' }),
        mc('Compare password', 'Metodă?', ['bcrypt.equal', 'bcrypt.compare', 'compare()', 'verify'], 'bcrypt.compare', 'Standard.', { topic: 'session' }),
        mc('DB sessions vs JWT', 'Avantaj DB?', ['Mai rapid', 'Pot revoca instant', 'Mai mic', 'CSS'], 'Pot revoca instant', 'Stateful control.', { topic: 'session' }),
        mc('Middleware verify', 'Per request?', ['Da', 'Nu, doar la login', 'Random', 'Doar prod'], 'Da', 'Pe rute protejate.', { topic: 'session' }),
        mc('Set cookie locație', 'Permis?', ['Server actions', 'Route handlers', 'Middleware (response)', 'Toate'], 'Toate', 'Multiple opțiuni.', { topic: 'session' }),
        mc('Refresh token', 'Pentru?', ['Logout', 'Extend session lifetime', 'CSS', 'Routing'], 'Extend session lifetime', 'Re-issue.', { topic: 'session' }),
        mc('Session expire', 'Set cu?', ['setExpirationTime', 'expire()', 'ttl', 'maxAge JWT'], 'setExpirationTime', 'jose API.', { topic: 'session' }),
        mc('SessionId în cookie', 'Pattern?', ['DB sessions', 'JWT only', 'Local storage', 'IP'], 'DB sessions', 'Stateful.', { topic: 'session' }),
      ],
    },

    // ==================== 22. RBAC ====================
    {
      slug: 'next-rbac',
      title: '22. Role-Based Access Control (RBAC)',
      isFree: false,
      theory: `# 👥 RBAC

## Concept

- Roles: \`USER\`, \`ADMIN\`, \`MODERATOR\`
- Permissions: \`posts.create\`, \`posts.delete\`, \`users.manage\`
- Map: rol → permissions

## Schema Prisma

\`\`\`prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id    Int   @id
  email String @unique
  role  Role  @default(USER)
}
\`\`\`

## Permissions map

\`\`\`jsx
// lib/permissions.js
export const PERMISSIONS = {
  USER: ['posts.read', 'posts.create'],
  MODERATOR: ['posts.read', 'posts.create', 'posts.delete', 'comments.moderate'],
  ADMIN: ['*'],   // All
};

export function hasPermission(role, permission) {
  const perms = PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}
\`\`\`

## Helper auth + check

\`\`\`jsx
// lib/auth-helpers.js
import { getSession } from './session';
import { hasPermission } from './permissions';

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function requireRole(role) {
  const session = await requireUser();
  if (session.role !== role) throw new Error('Forbidden');
  return session;
}

export async function requirePermission(permission) {
  const session = await requireUser();
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!hasPermission(user.role, permission)) {
    throw new Error('Forbidden');
  }
  return user;
}
\`\`\`

## În Server Action

\`\`\`jsx
'use server';
export async function deletePost(id) {
  await requirePermission('posts.delete');
  await db.post.delete({ where: { id } });
}
\`\`\`

## În Route Handler

\`\`\`jsx
export async function DELETE(request, { params }) {
  try {
    await requirePermission('posts.delete');
    await db.post.delete({ where: { id: Number(params.id) } });
    return Response.json({ deleted: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 403 });
  }
}
\`\`\`

## În Middleware

\`\`\`jsx
export async function middleware(request) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.redirect(new URL('/login', request.url));

  // Doar admin pe /admin/*
  if (request.nextUrl.pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }
}
\`\`\`

## UI conditional rendering

\`\`\`jsx
// Server component
import { getSession } from '@/lib/session';

export default async function Page() {
  const session = await getSession();
  return (
    <div>
      <h1>Posts</h1>
      {session?.role === 'ADMIN' && <DeleteButton />}
    </div>
  );
}
\`\`\`

## Resource-based check (ownership)

\`\`\`jsx
async function canEditPost(userId, postId) {
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) return false;
  if (post.authorId === userId) return true;

  const user = await db.user.findUnique({ where: { id: userId } });
  return user.role === 'ADMIN' || user.role === 'MODERATOR';
}
\`\`\`

## Patterns avansate (CASL, Oso)

Pentru aplicații complexe:
- **CASL** — declarative permissions
- **Oso** — policy engine

## ⚠️ Reguli

1. **NU trust client** — verifică pe server
2. **NU UI-only check** — securitatea trebuie pe API
3. **Loghează** încercările failed (audit)

## 🎓 Ce ai învățat
- ✅ Roles + Permissions map
- ✅ Helper \`requirePermission\`
- ✅ Check în action / handler / middleware
- ✅ Resource-based (ownership)
- ✅ Securitate ALWAYS pe server
`,
      problems: [
        mc('RBAC', 'Înseamnă?', ['Real-Based Access', 'Role-Based Access Control', 'Random Based Auth', 'Real Build AC'], 'Role-Based Access Control', 'Standard.', { topic: 'rbac' }),
        mc('Securitate', 'Unde verifici?', ['Doar UI', 'Doar API/server', 'Ambele recomandat', 'Ambele dar critical e server'], 'Ambele dar critical e server', 'Server e ce contează.', { topic: 'rbac' }),
        sa('Role enum', 'În Prisma? (enum Role)', 'enum Role', 'Type safe.', { topic: 'rbac' }),
        mc('hasPermission', 'Tip?', ['Async', 'Sync', 'Both', 'Generator'], 'Sync', 'Map lookup simplu.', { topic: 'rbac' }),
        mc('Wildcard permission', 'Convenție?', ['"all"', '"*"', '"any"', '"super"'], '"*"', 'Standard.', { topic: 'rbac' }),
        mc('Ownership check', 'Pentru?', ['Resource owner poate edita', 'Random', 'Speed', 'CSS'], 'Resource owner poate edita', 'Pattern uzual.', { topic: 'rbac' }),
        mc('UI-only check', 'Suficient?', ['Da', 'Nu — easy bypass', 'Doar dev', 'Doar prod'], 'Nu — easy bypass', 'Server-side mereu.', { topic: 'rbac' }),
        mc('CASL', 'Tip?', ['CSS', 'Authorization library', 'Auth', 'Routing'], 'Authorization library', 'Declarative.', { topic: 'rbac' }),
        mc('Status forbidden', 'Care?', ['401', '403', '404', '500'], '403', 'Authenticated dar fără permisiune.', { topic: 'rbac' }),
        mc('Audit log', 'Pentru?', ['UI', 'Track failed access attempts', 'Speed', 'CSS'], 'Track failed access attempts', 'Securitate.', { topic: 'rbac' }),
      ],
    },

    // ==================== 23. PAYMENTS (STRIPE) ====================
    {
      slug: 'next-stripe',
      title: '23. Plăți cu Stripe',
      isFree: false,
      theory: `# 💳 Stripe

## Setup

\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

\`\`\`bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

## Server: Checkout Session

\`\`\`jsx
// app/api/checkout/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { priceId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.URL}/cancel\`,
    customer_email: 'user@example.com',
  });

  return Response.json({ url: session.url });
}
\`\`\`

## Client: trigger checkout

\`\`\`jsx
'use client';
async function checkout(priceId) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ priceId }),
  });
  const { url } = await res.json();
  window.location.href = url;
}
\`\`\`

## One-time payment

\`\`\`jsx
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: { name: 'Coffee' },
      unit_amount: 500,   // 5 EUR în cents
    },
    quantity: 1,
  }],
  success_url: '...',
  cancel_url: '...',
});
\`\`\`

## Webhook handler

\`\`\`jsx
// app/api/webhooks/stripe/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await db.user.update({
        where: { email: session.customer_email },
        data: { plan: 'pro', stripeCustomerId: session.customer },
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await db.user.update({
        where: { stripeCustomerId: sub.customer },
        data: { plan: 'free' },
      });
      break;
    }
  }

  return Response.json({ received: true });
}
\`\`\`

## Customer Portal

\`\`\`jsx
const session = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: \`\${process.env.URL}/dashboard\`,
});
return Response.json({ url: session.url });
\`\`\`

## Local testing webhooks

\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

## Pattern: Pricing page

\`\`\`jsx
const PLANS = [
  { name: 'Free', price: 0, priceId: null },
  { name: 'Pro', price: 10, priceId: 'price_xxx' },
];

export default function Pricing() {
  return PLANS.map(p => (
    <div key={p.name}>
      <h3>{p.name}</h3>
      <p>\${p.price}/mo</p>
      {p.priceId && <button onClick={() => checkout(p.priceId)}>Subscribe</button>}
    </div>
  ));
}
\`\`\`

## ⚠️ Best practices

- 🔐 NU expune \`secret_key\` client
- ✅ Verifică webhook signature MEREU
- 💾 Salvează \`stripeCustomerId\` în DB
- 🔄 Idempotency keys pentru retry-uri

## 🎓 Ce ai învățat
- ✅ Checkout Sessions pentru plăți
- ✅ Webhooks pentru events asincrone
- ✅ Customer Portal pentru self-service
- ✅ Local testing cu \`stripe listen\`
- ✅ MEREU verifică signature
`,
      problems: [
        mc('Mode subscription', 'Pentru?', ['One-time', 'Recurring', 'Refund', 'Tax'], 'Recurring', 'Subscriptions.', { topic: 'stripe' }),
        mc('Mode payment', 'Pentru?', ['Recurring', 'One-time', 'Demo', 'Test'], 'One-time', 'Single charge.', { topic: 'stripe' }),
        sa('Webhook verify', 'Helper? (constructEvent)', 'constructEvent', 'Stripe SDK.', { topic: 'stripe' }),
        mc('Body raw', 'Pentru webhook?', ['JSON', 'Text raw', 'FormData', 'Binary'], 'Text raw', 'Pentru semnătură.', { topic: 'stripe' }),
        mc('Customer Portal', 'Pentru?', ['Pricing', 'Self-service subscription', 'Auth', 'Routing'], 'Self-service subscription', 'Stripe-hosted.', { topic: 'stripe' }),
        mc('Test webhook local', 'CLI?', ['stripe listen', 'stripe forward', 'stripe-test', 'stripe local'], 'stripe listen', 'Forward la local.', { topic: 'stripe' }),
        mc('Amount unit', 'Pentru EUR/USD?', ['euro', 'cents', 'dollars', 'units'], 'cents', 'Smallest unit.', { topic: 'stripe' }),
        mc('Secret key', 'Locul?', ['NEXT_PUBLIC_', 'Server-only env', 'Cookie', 'Hardcodat'], 'Server-only env', 'NU expune.', { topic: 'stripe' }),
        mc('Customer ID save', 'Recomandat?', ['Da în DB', 'Nu', 'Doar dev', 'Random'], 'Da în DB', 'Pentru lookup ulterior.', { topic: 'stripe' }),
        mc('Subscription cancel event', 'Care?', ['subscription.cancelled', 'customer.subscription.deleted', 'customer.cancelled', 'subscription.deleted'], 'customer.subscription.deleted', 'Stripe convenție.', { topic: 'stripe' }),
      ],
    },

    // ==================== 24. INTEGRATIONS ====================
    {
      slug: 'next-integrations',
      title: '24. External APIs și Integrations',
      isFree: false,
      theory: `# 🔌 Integrations

## Pattern: API client wrapper

\`\`\`jsx
// lib/openai-client.js
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateText(prompt) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });
  return completion.choices[0].message.content;
}
\`\`\`

## fetch wrapper cu retry

\`\`\`jsx
export async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
}
\`\`\`

## Cu cache

\`\`\`jsx
import { unstable_cache } from 'next/cache';

export const getWeather = unstable_cache(
  async (city) => {
    const res = await fetch(\`https://api.weather.com/?q=\${city}\`);
    return res.json();
  },
  ['weather'],
  { revalidate: 600, tags: ['weather'] }
);
\`\`\`

## Telegram bot

\`\`\`jsx
async function sendTelegram(chatId, text) {
  await fetch(
    \`https://api.telegram.org/bot\${process.env.BOT_TOKEN}/sendMessage\`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );
}
\`\`\`

## Discord webhook

\`\`\`jsx
await fetch(process.env.DISCORD_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'Hello from Next.js!' }),
});
\`\`\`

## SendGrid email

\`\`\`jsx
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@app.com',
  subject: 'Hello',
  text: 'Body',
  html: '<p>Body</p>',
});
\`\`\`

## OpenAI cu Vercel AI SDK

\`\`\`jsx
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4'),
  prompt: 'Hello',
});
\`\`\`

## Google Sheets

\`\`\`jsx
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

await sheets.spreadsheets.values.append({
  spreadsheetId: 'xxx',
  range: 'Sheet1!A:B',
  valueInputOption: 'USER_ENTERED',
  requestBody: { values: [['Name', 'Email']] },
});
\`\`\`

## Pattern: API client class

\`\`\`jsx
class GitHubAPI {
  constructor(token) {
    this.token = token;
    this.base = 'https://api.github.com';
  }

  async request(path, options = {}) {
    const res = await fetch(\`\${this.base}\${path}\`, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${this.token}\`,
        'Accept': 'application/vnd.github+json',
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error(\`GH API \${res.status}\`);
    return res.json();
  }

  getUser(username) {
    return this.request(\`/users/\${username}\`);
  }

  getRepos(username) {
    return this.request(\`/users/\${username}/repos\`);
  }
}

export const github = new GitHubAPI(process.env.GH_TOKEN);
\`\`\`

## Best practices

- 🔐 API keys în env vars, server-only
- 🔄 Retry cu exponential backoff
- 💾 Cache când posibil
- ⚠️ Handle erori (timeout, rate limit, 5xx)
- 📊 Log requests pentru debugging

## 🎓 Ce ai învățat
- ✅ Wrapper pattern pentru API clients
- ✅ Retry cu exponential backoff
- ✅ Cache extern API-uri cu \`unstable_cache\`
- ✅ Telegram, Discord, SendGrid integrations
- ✅ API class cu Bearer auth
`,
      problems: [
        mc('API keys', 'Locul?', ['NEXT_PUBLIC_', 'Server-only env', 'Cookie', 'Localstorage'], 'Server-only env', 'NU expune.', { topic: 'integ' }),
        mc('Retry pattern', 'Backoff?', ['Linear', 'Exponential', 'Random', 'Niciun'], 'Exponential', '2^i * 1000ms.', { topic: 'integ' }),
        sa('Cache extern', 'Helper? (unstable_cache)', 'unstable_cache', 'Pentru non-fetch.', { topic: 'integ' }),
        mc('Vercel AI SDK', 'Package?', ['ai', 'next-ai', 'vercel-ai', 'ai-sdk'], 'ai', 'Standard.', { topic: 'integ' }),
        mc('GitHub auth', 'Header?', ['Bearer', 'Basic', 'Cookie', 'Token'], 'Bearer', 'OAuth standard.', { topic: 'integ' }),
        mc('Discord notify', 'Method?', ['Webhook URL', 'OAuth', 'API key', 'Toate'], 'Webhook URL', 'Cea mai simplă.', { topic: 'integ' }),
        mc('Telegram bot', 'Token în?', ['URL', 'Header', 'Body', 'Cookie'], 'URL', 'În URL bot path.', { topic: 'integ' }),
        mc('Wrapper', 'De ce?', ['Mai mult cod', 'Reuse + abstract', 'Random', 'CSS'], 'Reuse + abstract', 'DRY.', { topic: 'integ' }),
        mc('Class API', 'Pentru?', ['Doar funcții', 'Stateful client (token, base URL)', 'Random', 'CSS'], 'Stateful client (token, base URL)', 'Pattern OOP.', { topic: 'integ' }),
        mc('Timeout handle', 'Pentru?', ['Speed', 'Robust handling', 'CSS', 'Routing'], 'Robust handling', 'Important pentru externe.', { topic: 'integ' }),
      ],
    },

    // ==================== 25. PRODUCTION ====================
    {
      slug: 'next-production',
      title: '25. Production checklist și monitoring',
      isFree: false,
      theory: `# 🚀 Production Checklist

## Pre-deploy checklist

### 🔐 Security
- [ ] \`.env.local\` în \`.gitignore\`
- [ ] Cookies cu \`httpOnly + secure + sameSite\`
- [ ] CSRF protection (Server Actions auto)
- [ ] Rate limiting (auth + sensitive endpoints)
- [ ] Input validation server-side (Zod)
- [ ] Headers de securitate (CSP, X-Frame-Options)
- [ ] Auth secrets ≥ 32 chars
- [ ] HTTPS only
- [ ] Webhook signatures verified

### ⚡ Performance
- [ ] Images optimizate (next/image)
- [ ] Fonts via next/font
- [ ] Lighthouse score ≥ 90
- [ ] Cache strategically
- [ ] Bundle size verificat
- [ ] Code splitting auto (dynamic imports)
- [ ] SSG/ISR unde posibil

### 🛠️ Reliability
- [ ] Error boundaries (\`error.js\`)
- [ ] Loading states (\`loading.js\`)
- [ ] DB connection singleton
- [ ] Try/catch în handlers
- [ ] Sentry / error monitoring
- [ ] Logs structurate

### 📊 Monitoring
- [ ] Vercel Analytics / Speed Insights
- [ ] Real User Monitoring (Sentry)
- [ ] Uptime monitoring (UptimeRobot, BetterUptime)
- [ ] Logs centralizate (Datadog, LogTail)
- [ ] Alerts pentru downtime

### 🔄 CI/CD
- [ ] Tests în CI (npm test)
- [ ] Type check (tsc)
- [ ] Lint (eslint)
- [ ] Preview deployments (Vercel auto)
- [ ] Database migrations automatice (cu grijă!)

### 🌐 SEO / SMM
- [ ] Metadata pentru fiecare page
- [ ] OpenGraph + Twitter Card
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] Structured data (JSON-LD)

### 📱 PWA / Mobile
- [ ] Manifest.json
- [ ] Mobile responsive
- [ ] Touch targets ≥ 44px
- [ ] Viewport meta

## Sentry setup

\`\`\`bash
npx @sentry/wizard@latest -i nextjs
\`\`\`

\`\`\`jsx
// sentry.client.config.js / sentry.server.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
\`\`\`

## Vercel Analytics

\`\`\`bash
npm install @vercel/analytics @vercel/speed-insights
\`\`\`

\`\`\`jsx
// app/layout.js
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

<body>
  {children}
  <Analytics />
  <SpeedInsights />
</body>
\`\`\`

## Logging structurat

\`\`\`jsx
// lib/logger.js
export const logger = {
  info(message, data) {
    console.log(JSON.stringify({ level: 'info', message, ...data, ts: Date.now() }));
  },
  error(message, error) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      ts: Date.now(),
    }));
  },
};
\`\`\`

## Database migrations production

\`\`\`bash
# DEV: cu reset
npx prisma migrate dev

# PROD: doar apply
npx prisma migrate deploy
\`\`\`

## Environment per stage

\`\`\`
.env                  → defaults
.env.development      → local dev
.env.production       → production
.env.local            → personal overrides (gitignore!)
\`\`\`

## Backup database

- Postgres: \`pg_dump\`, automatice pe Neon/Supabase
- Cron job pentru backup

## Health check endpoint

\`\`\`jsx
// app/api/health/route.js
export async function GET() {
  try {
    await prisma.\$queryRaw\`SELECT 1\`;
    return Response.json({ status: 'ok' });
  } catch {
    return Response.json({ status: 'error' }, { status: 503 });
  }
}
\`\`\`

## Graceful shutdown

În production (Vercel): nu e nevoie. Pe self-host: handle SIGTERM.

## Feature flags

\`\`\`jsx
const FLAGS = {
  newDashboard: process.env.FLAG_NEW_DASHBOARD === 'true',
};

if (FLAGS.newDashboard) return <NewUI />;
\`\`\`

## Pattern: Maintenance mode

\`\`\`jsx
// middleware.js
export function middleware(request) {
  if (process.env.MAINTENANCE === 'true') {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
}
\`\`\`

## 🎓 Ce ai învățat
- ✅ Checklist complet pre-deploy
- ✅ Sentry pentru error tracking
- ✅ Vercel Analytics + Speed Insights
- ✅ Logging structurat (JSON)
- ✅ Health check endpoint
- ✅ Feature flags pattern
- ✅ \`prisma migrate deploy\` în prod
`,
      problems: [
        mc('Sentry', 'Pentru?', ['CSS', 'Error monitoring', 'Routing', 'DB'], 'Error monitoring', 'Production logging.', { topic: 'prod' }),
        mc('Migrate deploy', 'În prod?', ['migrate dev', 'migrate deploy', 'db push', 'reset'], 'migrate deploy', 'Apply only.', { topic: 'prod' }),
        sa('Health endpoint', 'Status code OK? (200)', '200', 'Standard.', { topic: 'prod' }),
        mc('Feature flag', 'Pentru?', ['Speed', 'Toggle features fără deploy', 'CSS', 'Random'], 'Toggle features fără deploy', 'A/B + safe rollout.', { topic: 'prod' }),
        mc('Maintenance mode', 'Cu?', ['Manual page', 'Middleware rewrite', 'Config', 'Toate'], 'Middleware rewrite', 'Pattern recomandat.', { topic: 'prod' }),
        mc('Vercel Speed Insights', 'Pentru?', ['Auth', 'Real performance metrics', 'CSS', 'Routing'], 'Real performance metrics', 'RUM.', { topic: 'prod' }),
        mc('Logging format', 'Recomandat?', ['Plain text', 'JSON structured', 'XML', 'CSV'], 'JSON structured', 'Parsable.', { topic: 'prod' }),
        mc('CI', 'Tests în?', ['Skip', 'Pipeline pre-merge', 'Doar local', 'Random'], 'Pipeline pre-merge', 'GitHub Actions.', { topic: 'prod' }),
        mc('Analytics', 'Vercel?', ['@vercel/analytics', 'next-analytics', 'analytics', 'vercel-stats'], '@vercel/analytics', 'Standard.', { topic: 'prod' }),
        mc('Webhook signature', 'În production?', ['Skip', 'Mereu verifică', 'Doar dev', 'Random'], 'Mereu verifică', 'Securitate.', { topic: 'prod' }),
      ],
    },

  ],
}
