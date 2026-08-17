# Olla English — CRM

CRM intern pentru școala de limba engleză **Olla English**: elevi, grupe, orar, prezențe, plăți, recuperări, plus un portal de învățare pentru elevi.

Nu există site public — rădăcina `/` redirecționează direct către ecranul de autentificare.

## Portaluri

| Rută            | Cine intră        | Ce face                                                                              |
| --------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `/login`        | admin / profesor  | Autentificare (parolă + opțional 2FA, CAPTCHA la eșecuri repetate)                     |
| `/admin`        | ADMIN, SUPERADMIN | Elevi, grupe, filiale, orar, sesiuni, plăți, recuperări, module, securitate, audit     |
| `/teacher`      | TEACHER           | Grupele proprii, prezențe, recuperări, elevi, submisii                                 |
| `/learn/[token]`| elev              | Module și lecții interactive, exerciții, gamification (acces pe bază de token)          |
| `/learn/guest`  | oricine           | Mod demo, fără salvarea progresului                                                    |

## Stack

Next.js 16 (App Router) · React 19 · Prisma 5 + MongoDB · NextAuth · Tailwind 4 · Argon2id · TOTP 2FA

## Instalare

```bash
npm install
cp .env.example .env      # completează valorile (vezi mai jos)
npm run env:check         # verifică dacă .env e complet și corect
npm run db:push           # creează colecțiile și indexurile în MongoDB
npm run db:seed           # opțional: 1 admin, 1 profesor, 1 grupă, 3 elevi demo
npm run dev
```

Aplicația pornește pe [http://localhost:3000](http://localhost:3000) și te duce la `/login`.

## Variabile de mediu

### Obligatorii

| Variabilă           | Descriere                                                                        |
| ------------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`      | Connection string MongoDB. **Numele bazei trebuie inclus în URL** (Prisma îl cere) |
| `NEXTAUTH_URL`      | URL-ul aplicației (`http://localhost:3000` local, domeniul real în producție)       |
| `NEXTAUTH_SECRET`   | Secret JWT — `openssl rand -base64 32`                                             |
| `ENCRYPTION_KEY`    | Cheie AES-256-GCM pentru secretele 2FA — exact 64 caractere hex                     |
| `NEXT_PUBLIC_APP_URL` | Folosit la linkurile de reset parolă și la verificarea originii                  |

Generarea cheilor:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"  # NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"     # ENCRYPTION_KEY
```

### Recomandate

| Variabilă        | Descriere                                            |
| ---------------- | ---------------------------------------------------- |
| `CRON_SECRET`    | Protejează `/api/cron/*` (rulate de Vercel Cron)      |
| `TOTP_APP_NAME`  | Numele afișat în Google Authenticator (`Olla English`) |

### Opționale

Fără ele aplicația funcționează, dar cu funcționalitatea respectivă dezactivată:

- **CAPTCHA la login**: `CAPTCHA_PROVIDER`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- **Rate limiting distribuit**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (fallback automat pe MongoDB)
- **Upload imagini**: `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
- **Notificări Telegram**: `TELEGRAM_*` (boți, chat-uri, thread-uri)
- **Corectare AI (Mr. Olla)**: `OPENAI_API_KEY`, `OPENAI_MODEL`, `AI_*`
- **Tuning**: `SESSION_EXPIRATION_HOURS`, `ARGON2_*`, `AUDIT_LOG_RETENTION_DAYS`, `STEP_UP_TOKEN_EXPIRATION`

Lista completă, cu comentarii, este în [.env.example](.env.example).

## Notificări Telegram

Un singur bot acoperă toate notificările (lecții, plăți, contact, securitate), într-un grup cu **Topics** activate.

Configurare, o singură dată:

1. Adaugă botul în grup și fă-l **administrator** cu dreptul **Manage topics**
2. Creează topic-urile și scrie ID-urile în `.env`:
   ```bash
   npm run telegram:topics
   ```
   *Alternativ*, dacă nu vrei botul admin: creează topic-urile manual, scrie un mesaj
   în fiecare, apoi rulează `npm run telegram:discover` — găsește ID-urile și le scrie în `.env`.
3. După deploy, activează butoanele de status din notificări:
   ```bash
   npm run telegram:webhook https://domeniul-tau.md
   ```

Fără topic-uri configurate aplicația funcționează normal — toate notificările ajung în topicul „General".

## Comenzi

| Comandă                    | Ce face                                             |
| -------------------------- | --------------------------------------------------- |
| `npm run dev`              | Server de development                               |
| `npm run build`            | `prisma generate` + build de producție              |
| `npm start`                | Server de producție                                 |
| `npm run lint`             | ESLint                                              |
| `npm run env:check`        | Verifică `.env`: ce lipsește, ce funcții sunt active |
| `npm run db:push`          | Sincronizează schema Prisma cu MongoDB              |
| `npm run db:seed`          | Populează baza cu date demo                         |
| `npm run db:studio`        | Prisma Studio                                       |
| `npm run telegram:topics`  | Creează topic-urile Telegram și le scrie în `.env`  |
| `npm run telegram:discover`| Găsește ID-urile topic-urilor create manual         |
| `npm run telegram:webhook` | Înregistrează webhook-ul Telegram (după deploy)     |
| `npm run brand:icons`      | Regenerează favicon-urile și icoanele PWA           |

Logo-ul folosit în interfață este `public/olla-english.png` — înlocuiește fișierul și se schimbă peste tot.

## Model de date (esențial)

- **User** — staff (SUPERADMIN / ADMIN / TEACHER), cu permisiuni granulare per modul
- **Student** — elev; are opțional `accessToken` pentru portalul `/learn`
- **Group** — grupă cu `level` (A1…C2, Kids, IELTS…), profesor, filială, orar
- **GroupStudent** — pivot elev↔grupă cu lecții rămase, absențe, status
- **LessonSession / Attendance / LessonTransaction** — lecții ținute și prezențe
- **Payment** — plăți, cu snapshot de nume elev / grupă / nivel pentru istoric
- **MakeupLesson** — recuperări
- **LearningModule / Lesson / Problem / ProblemSubmission** — conținutul portalului elevului

Nivelurile de engleză se editează într-un singur loc: [lib/english-levels.js](lib/english-levels.js).

## Deployment (Vercel)

1. Importă repo-ul în Vercel
2. Adaugă variabilele de mediu (cele obligatorii + `CRON_SECRET`)
3. Setează `NEXTAUTH_URL` și `NEXT_PUBLIC_APP_URL` pe domeniul de producție
4. Whitelist IP în MongoDB Atlas (`0.0.0.0/0` pentru Vercel, sau IP-urile dedicate)
5. Deploy — cron-urile din [vercel.json](vercel.json) pornesc automat

## Checklist producție

- [ ] `NEXTAUTH_SECRET` și `ENCRYPTION_KEY` noi, diferite de cele din development
- [ ] `NEXTAUTH_URL` + `NEXT_PUBLIC_APP_URL` pe domeniul real
- [ ] Parolele conturilor de seed schimbate după primul login
- [ ] 2FA activat pentru conturile SUPERADMIN
- [ ] Backup automat activat în MongoDB Atlas
- [ ] `/api/health` răspunde
