# Olla English — Mobile App

Aplicație Expo (React Native) pentru elevii Olla English.
Folosește backend-ul existent de pe https://ollaenglish.md (zero modificări de server).

## 🚀 Setup

```powershell
cd mobile
npm install
```

## 📱 Dezvoltare locală

```powershell
# Pornește Metro + scannează QR cu Expo Go pe telefon
npm start

# Sau direct pe Android (emulator/USB)
npm run android

# Sau în browser
npm run web
```

## 📦 Build APK (pentru distribuție directă)

Necesită cont Expo (gratis): https://expo.dev/signup

```powershell
# Instalează EAS CLI o singură dată
npm install -g eas-cli

# Login
eas login

# Configurează proiectul (prima dată)
eas build:configure

# Generează APK descărcabil
npm run build:apk
```

După build EAS îți dă un link de unde descarci `.apk` — îl trimiți elevilor pe Telegram.

## 🏪 Google Play (.aab)

```powershell
npm run build:aab
eas submit -p android   # necesită cont Google Play ($25 one-time)
```

## 🍎 iOS / App Store

Necesită Mac + cont Apple Developer ($99/an).

```powershell
eas build -p ios
```

## 🖥️ Versiune Desktop (Electron)

Vezi `desktop/` (creat separat) — Electron încarcă https://ollaenglish.md ca PWA nativ.

## 🎨 Design

- Tailwind via NativeWind v4
- Culori brand: `brand-900` (#1e3a8a), `accent-400` (#fbbf24)
- Identic cu site-ul `/learn/[token]`

## 📂 Structura

```
mobile/
  app/
    _layout.js              ← root navigator
    index.js                ← redirect (token → dashboard, no token → login)
    login.js                ← autentificare cu email/parolă
    (learn)/
      _layout.js
      [token]/
        index.js            ← dashboard cu module + XP + clasament
        leaderboard.js      ← top elevi
        lesson/
          [lessonId].js     ← teorie + probleme
  lib/
    api.js                  ← fetch wrapper + token storage
    levels.js               ← sistemul de nivele (sincronizat cu web)
```

## 🔐 Autentificare

- Login cu email/telefon/nume + parolă
- Token salvat în SecureStore (criptat)
- Auto-login la deschidere

## ⚠️ API Endpoint

Default: `https://ollaenglish.md`

Schimbă în [app.json](app.json) `extra.apiBaseUrl` dacă rulezi backend local.
