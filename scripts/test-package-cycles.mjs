// Verifică pachetele de lecții: se reiau doar când s-au ținut toate lecțiile,
// nu la început de lună, iar absențele nu contează.
//
//   node scripts/test-package-cycles.mjs

import {
  packageCycles, packageSize, parsePackageLessons, parsePackageNumber, payablePackageNumber, packagePayment,
} from '../lib/package-cycles.js'

let failed = 0
const eq = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) failed++
  console.log((ok ? 'OK   ' : 'GRESIT') + ' ' + name + ' = ' + JSON.stringify(got) +
    (ok ? '' : '  (asteptat ' + JSON.stringify(want) + ')'))
}

// n lecții, câte una la 3 zile, începând cu 1 septembrie 2026
const lessons = (n, from = '2026-09-01') =>
  Array.from({ length: n }, (_, i) => ({
    id: `s${String(i + 1).padStart(3, '0')}`,
    date: new Date(new Date(from).getTime() + i * 3 * 86400000).toISOString(),
  }))

const summary = (r) => ({
  n: r.cycles.length,
  current: r.current.number,
  held: r.current.held,
  remaining: r.current.remaining,
  complete: r.current.complete,
})

// Fără nicio lecție: pachetul 1, gol
eq('zero lectii', summary(packageCycles([], 8)), { n: 1, current: 1, held: 0, remaining: 8, complete: false })

// În pachet
eq('3 din 8', summary(packageCycles(lessons(3), 8)), { n: 1, current: 1, held: 3, remaining: 5, complete: false })

// Pachetul s-a terminat: rămâne 8 din 8, nu se golește până nu vine lecția următoare
eq('8 din 8 = pachet plin', summary(packageCycles(lessons(8), 8)), { n: 1, current: 1, held: 8, remaining: 0, complete: true })

// A noua lecție deschide pachetul 2
eq('a 9-a lectie = pachetul 2', summary(packageCycles(lessons(9), 8)), { n: 2, current: 2, held: 1, remaining: 7, complete: false })

// Se reia de abia la capăt, indiferent de luni: 20 de lecții pe 8 → 2 pachete pline + 4
eq('20 pe 8', summary(packageCycles(lessons(20), 8)), { n: 3, current: 3, held: 4, remaining: 4, complete: false })
eq('pachetele 1 si 2 pline', packageCycles(lessons(20), 8).cycles.map((c) => c.complete), [true, true, false])

// Lecțiile din pachetul 2 sunt cele de după a 8-a, în ordinea datei
const r = packageCycles(lessons(12), 8)
eq('pachetul 2 incepe cu lectia 9', r.cycles[1].sessions.map((s) => s.id), ['s009', 's010', 's011', 's012'])

// Ordinea datei, nu ordinea în care vin din bază
const shuffled = lessons(10).reverse()
eq('ordinea datei', packageCycles(shuffled, 4).cycles[2].sessions.map((s) => s.id), ['s009', 's010'])

// Luna nu are legătură: lecții peste 3 luni, pachet de 8 → tot un singur pachet până la a 8-a
const spread = Array.from({ length: 6 }, (_, i) => ({ id: `m${i}`, date: new Date(2026, 8 + i, 15).toISOString() }))
eq('6 lectii pe 6 luni = tot pachetul 1', summary(packageCycles(spread, 8)), { n: 1, current: 1, held: 6, remaining: 2, complete: false })

// Lecțiile dinainte de data de start nu se numără
eq('start de la lectia 5', summary(packageCycles(lessons(12), 8, lessons(12)[4].date)), { n: 1, current: 1, held: 8, remaining: 0, complete: true })

// Dimensiunea pachetului
eq('implicit 8', packageSize({}), 8)
eq('din grupa', packageSize({ packageLessons: 12 }), 12)
eq('valoare invalida cade pe 8', packageSize({ packageLessons: 0 }), 8)
eq('prea mare', parsePackageLessons('500'), null)
eq('text', parsePackageLessons('abc'), null)
eq('valid ca text', parsePackageLessons('10'), 10)

// ── Plățile pe pachet
const pay = (forPackage, amount, day, debt = null) => ({ forPackage, amount, debt, paymentDate: new Date(2026, 9, day).toISOString() })

eq('fara plati = neachitat', packagePayment([], 1), null)
eq('plata pentru alt pachet nu conteaza', packagePayment([pay(2, 500, 3)], 1), null)
eq('o plata', packagePayment([pay(1, 500, 3)], 1), { amount: 500, count: 1, lastDate: new Date(2026, 9, 3).toISOString(), debt: 0 })
eq('doua transe se aduna', packagePayment([pay(1, 300, 3), pay(1, 200, 9, 100)], 1).amount, 500)
eq('datoria e din ultima plata', packagePayment([pay(1, 300, 3, 400), pay(1, 200, 9, 200)], 1).debt, 200)
eq('plata veche, fara pachet, nu se potriveste', packagePayment([{ forPackage: null, amount: 500, paymentDate: new Date().toISOString() }], 1), null)

// Cine plătește acum: pachetul în curs, sau următorul dacă cel curent e plin
eq('pachet in curs', payablePackageNumber(packageCycles(lessons(3), 8).current), 1)
eq('pachet plin = urmatorul', payablePackageNumber(packageCycles(lessons(8), 8).current), 2)
eq('pachet gol', payablePackageNumber(packageCycles([], 8).current), 1)
eq('nr pachet valid', parsePackageNumber('3'), 3)
eq('nr pachet gol', parsePackageNumber(''), null)
eq('nr pachet zero', parsePackageNumber('0'), null)

console.log(failed ? `\n${failed} VERIFICARI ESUATE` : '\nTOATE VERIFICARILE AU TRECUT')
process.exit(failed ? 1 : 0)
