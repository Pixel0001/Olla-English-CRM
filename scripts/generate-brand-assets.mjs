/**
 * Generează toate icoanele de brand Olla English (favicon, PWA, apple-touch)
 * direct din cod — fără dependențe externe (doar `zlib` din Node).
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Marca: cartea navy cu semn de carte coral — varianta pătrată a logo-ului
 * din public/olla-english.png (lockup-ul complet, folosit în UI).
 */
import zlib from 'node:zlib'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')

// ── Paleta brandului ──────────────────────────────────────────────────────
const NAVY = [20, 39, 107]   // #14276B — cartea / textul „OLLA"
const CORAL = [244, 117, 107] // #F4756B — semnul de carte / „ENGLISH"
const PAPER = [255, 255, 255] // paginile

// ── Encoder PNG minimal (RGBA, 8 biți) ────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  // 10-12: compression, filter, interlace = 0

  // Fiecare scanline e prefixată de un byte de filtru (0 = None)
  const raw = Buffer.alloc(height * (width * 4 + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Desenarea mărcii (supersampling 4x pentru anti-aliasing) ──────────────
const SS = 4

function inRoundedRect(u, v, x0, y0, x1, y1, r) {
  if (u < x0 || u > x1 || v < y0 || v > y1) return false
  const dx = Math.max(x0 + r - u, u - (x1 - r), 0)
  const dy = Math.max(y0 + r - v, v - (y1 - r), 0)
  return dx * dx + dy * dy <= r * r
}

function sampleMark(x, y, size, padded) {
  // Coordonate normalizate 0..1
  const u = x / size
  const v = y / size

  // Cartea — pătrat rotunjit. Pe apple-touch icon umplem tot (iOS taie singur colțurile).
  const r = padded ? 0.0001 : 0.21
  if (!inRoundedRect(u, v, 0, 0, 1, 1, r)) return null

  // Semnul de carte (coral), sus-dreapta, cu crestătură în V jos
  if (u >= 0.53 && u <= 0.87 && v <= 0.34) {
    const notchTop = 0.24
    if (v <= notchTop) return CORAL
    const spread = ((v - notchTop) / (0.34 - notchTop)) * 0.17
    if (Math.abs(u - 0.7) > spread) return CORAL
  }

  // Paginile (alb)
  if (inRoundedRect(u, v, 0.17, 0.5, 0.62, 0.585, 0.0425)) return PAPER
  if (inRoundedRect(u, v, 0.17, 0.66, 0.49, 0.745, 0.0425)) return PAPER

  return NAVY
}

function renderIcon(size, { padded = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const c = sampleMark(x + (sx + 0.5) / SS, y + (sy + 0.5) / SS, size, padded)
          if (c) {
            r += c[0]; g += c[1]; b += c[2]; a += 255
          }
        }
      }
      const n = SS * SS
      const i = (y * size + x) * 4
      if (a === 0) continue
      // Premultiplicat pe suprafața acoperită, ca marginile să nu fie „murdare"
      rgba[i] = Math.round(r / (a / 255))
      rgba[i + 1] = Math.round(g / (a / 255))
      rgba[i + 2] = Math.round(b / (a / 255))
      rgba[i + 3] = Math.round(a / n)
    }
  }
  return encodePng(size, size, rgba)
}

// ── ICO (container peste PNG-uri — suportat de toate browserele moderne) ──
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  const entries = []
  let offset = 6 + pngs.length * 16
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16)
    e[0] = size >= 256 ? 0 : size
    e[1] = size >= 256 ? 0 : size
    e[2] = 0 // paletă
    e[3] = 0 // reserved
    e.writeUInt16LE(1, 4) // color planes
    e.writeUInt16LE(32, 6) // bits per pixel
    e.writeUInt32BE(0, 8)
    e.writeUInt32LE(buf.length, 8)
    e.writeUInt32LE(offset, 12)
    entries.push(e)
    offset += buf.length
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)])
}

// ── Generare ──────────────────────────────────────────────────────────────
const targets = [
  { file: 'favicon-16.png', size: 16 },
  { file: 'favicon-32.png', size: 32 },
  { file: 'favicon-48.png', size: 48 },
  { file: 'favicon.png', size: 64 },
  { file: 'apple-icon.png', size: 180, padded: true },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-256.png', size: 256 },
  { file: 'icon-512.png', size: 512 },
]

for (const { file, size, padded } of targets) {
  fs.writeFileSync(path.join(pub, file), renderIcon(size, { padded }))
  console.log(`  ✅ public/${file} (${size}x${size})`)
}

const ico = buildIco([16, 32, 48].map((size) => ({ size, buf: renderIcon(size) })))
fs.writeFileSync(path.join(pub, 'favicon.ico'), ico)
console.log('  ✅ public/favicon.ico (16/32/48)')

// App Router preia app/favicon.ico și app/icon.png înaintea metadata.icons
fs.writeFileSync(path.join(root, 'app', 'favicon.ico'), ico)
fs.writeFileSync(path.join(root, 'app', 'icon.png'), renderIcon(512))
console.log('  ✅ app/favicon.ico + app/icon.png')

console.log('\n🎨 Icoane Olla English generate.')
