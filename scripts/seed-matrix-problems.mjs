// Probleme standalone — Matrice (tablouri bidimensionale)
// 16 variante × 4 limbaje (C++, C, JavaScript, Python) = 64 probleme CODING
// Rulează: node scripts/seed-matrix-problems.mjs

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const T = 'matrice'

function code(title, description, language, starter, explanation, opts = {}) {
  return {
    title: `[${language.toUpperCase()}] ${title}`,
    type: 'CODING',
    difficulty: opts.difficulty || 'MEDIUM',
    description,
    options: [],
    correctAnswer: opts.correctAnswer || null,
    hint: opts.hint || null,
    explanation,
    points: opts.points || 25,
    topic: T,
    tags: ['matrice', 'tablou', '2D', language],
    estimatedTime: opts.estimatedTime || 15,
    starterCode: starter,
    language,
    active: true,
    lessonId: null,
  }
}

// ─── VARIANTA 1 ──────────────────────────────────────────────────────────────
// Schimbă primul rând cu coloana a doua

const v1cpp = code(
  'Varianta 1 — Schimbă rândul 1 cu coloana 2',
  `Citește o matrice **N×M** (N rânduri, M coloane). Schimbă cu locul elementele **primului rând** cu elementele din **coloana a doua** (index 1). Afișează matricea rezultată.

**Restricții:** N ≤ N și M ≥ 2; consideră că N = M pentru simplitate.

**Exemplu intrare:**
\`\`\`
3 3
1 2 3
4 5 6
7 8 9
\`\`\`
**Exemplu ieșire:**
\`\`\`
2 1 3
4 2 6
7 8 9
\`\`\`
> Rândul 0 devine \`2 1 3\` (a[0][1] se schimbă cu a[0][0] etc.), iar coloana 1 preia valorile fostului rând 0.`,
  'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> a[i][j];

    // TODO: schimbă elementele rândului 0 cu elementele coloanei 1

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++)
            cout << a[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'Iterează de la i=0 la n-1 și schimbă `a[0][i]` cu `a[i][1]` folosind o variabilă temporară `tmp`.',
  { difficulty: 'MEDIUM', points: 25 },
)

const v1c = code(
  'Varianta 1 — Schimbă rândul 1 cu coloana 2',
  v1cpp.description,
  'c',
  `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &a[i][j]);

    // TODO: schimbă elementele rândului 0 cu elementele coloanei 1

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  v1cpp.explanation,
  { difficulty: 'MEDIUM', points: 25 },
)

const v1js = code(
  'Varianta 1 — Schimbă rândul 1 cu coloana 2',
  v1cpp.description,
  'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const [n, m] = lines[idx++].split(' ').map(Number);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

// TODO: schimbă elementele rândului 0 cu elementele coloanei 1

for (let i = 0; i < n; i++)
    console.log(a[i].join(' '));`,
  v1cpp.explanation,
  { difficulty: 'MEDIUM', points: 25 },
)

const v1py = code(
  'Varianta 1 — Schimbă rândul 1 cu coloana 2',
  v1cpp.description,
  'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n, m = int(data[idx]), int(data[idx+1]); idx += 2
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(m)]
    idx += m
    a.append(row)

# TODO: schimbă elementele rândului 0 cu elementele coloanei 1

for row in a:
    print(*row)`,
  v1cpp.explanation,
  { difficulty: 'MEDIUM', points: 25 },
)

// ─── VARIANTA 2 ──────────────────────────────────────────────────────────────
// Suma și produsul elementelor pare din rândul 2

const desc2 = `Citește o matrice **N×M**. Calculează **suma** și **produsul** elementelor **pare** (divizibile cu 2) din **rândul cu indexul 1** (al doilea rând). Afișează suma și produsul pe câte o linie.

**Exemplu intrare:**
\`\`\`
3 4
1 3 5 7
2 4 6 8
9 11 13 15
\`\`\`
**Exemplu ieșire:**
\`\`\`
Suma: 20
Produs: 384
\`\`\``

const v2cpp = code('Varianta 2 — Suma și produsul elementelor pare din rândul 2', desc2, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> a[i][j];

    long long suma = 0, produs = 1;
    // TODO: parcurge rândul 1 și acumulează suma și produsul elementelor pare

    cout << "Suma: " << suma << "\n";
    cout << "Produs: " << produs << "\n";
    return 0;
}`,
  'Parcurge `a[1][j]` pentru j=0..m-1; dacă `a[1][j] % 2 == 0` adaugă la sumă și înmulțește cu produsul.',
  { difficulty: 'EASY', points: 20 })

const v2c = code('Varianta 2 — Suma și produsul elementelor pare din rândul 2', desc2, 'c',
  `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &a[i][j]);

    long long suma = 0, produs = 1;
    // TODO: parcurge rândul 1 și acumulează suma și produsul elementelor pare

    printf("Suma: %lld\\n", suma);
    printf("Produs: %lld\\n", produs);
    return 0;
}`,
  v2cpp.explanation, { difficulty: 'EASY', points: 20 })

const v2js = code('Varianta 2 — Suma și produsul elementelor pare din rândul 2', desc2, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const [n, m] = lines[idx++].split(' ').map(Number);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

let suma = 0, produs = 1;
// TODO: parcurge a[1] și calculează suma și produsul elementelor pare

console.log('Suma: ' + suma);
console.log('Produs: ' + produs);`,
  v2cpp.explanation, { difficulty: 'EASY', points: 20 })

const v2py = code('Varianta 2 — Suma și produsul elementelor pare din rândul 2', desc2, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n, m = int(data[idx]), int(data[idx+1]); idx += 2
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(m)]
    idx += m
    a.append(row)

suma = 0
produs = 1
# TODO: parcurge a[1] și calculează suma și produsul elementelor pare

print(f"Suma: {suma}")
print(f"Produs: {produs}")`,
  v2cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 3 ──────────────────────────────────────────────────────────────
// Numarul de elemente divizibile la 2 dintr-o coloana indicată

const desc3 = `Citește o matrice **N×N** și un indice de coloană **k** (0-based). Afișează **numărul de elemente divizibile cu 2** din coloana k.

**Exemplu intrare:**
\`\`\`
3
1 2 3
4 5 6
7 8 9
1
\`\`\`
**Exemplu ieșire:**
\`\`\`
2
\`\`\`
*(Coloana 1: 2, 5, 8 → 2 și 8 sunt pare)*`

const v3cpp = code('Varianta 3 — Elemente divizibile cu 2 dintr-o coloană', desc3, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];
    int k;
    cin >> k;

    int count = 0;
    // TODO: numără elementele pare din coloana k

    cout << count << "\n";
    return 0;
}`,
  'Parcurge `a[i][k]` pentru i=0..n-1 și incrementează `count` dacă `a[i][k] % 2 == 0`.',
  { difficulty: 'EASY', points: 20 })

const v3c = code('Varianta 3 — Elemente divizibile cu 2 dintr-o coloană', desc3, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);
    int k;
    scanf("%d", &k);

    int count = 0;
    // TODO: numără elementele pare din coloana k

    printf("%d\\n", count);
    return 0;
}`,
  v3cpp.explanation, { difficulty: 'EASY', points: 20 })

const v3js = code('Varianta 3 — Elemente divizibile cu 2 dintr-o coloană', desc3, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));
const k = Number(lines[idx++]);

let count = 0;
// TODO: numără elementele pare din coloana k

console.log(count);`,
  v3cpp.explanation, { difficulty: 'EASY', points: 20 })

const v3py = code('Varianta 3 — Elemente divizibile cu 2 dintr-o coloană', desc3, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)
k = int(data[idx]); idx += 1

count = 0
# TODO: numără elementele pare din coloana k

print(count)`,
  v3cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 4 ──────────────────────────────────────────────────────────────
// Suma și produsul elementelor pozitive impare dintr-o coloana

const desc4 = `Citește o matrice **N×N** și un indice de coloană **k**. Calculează **suma** și **produsul** elementelor **pozitive și impare** din coloana k. Afișează rezultatele.

**Exemplu intrare:**
\`\`\`
3
-1 2 3
4 5 6
7 -8 9
1
\`\`\`
**Exemplu ieșire:**
\`\`\`
Suma: 5
Produs: 5
\`\`\`
*(Coloana 1: 2, 5, -8 → doar 5 e pozitiv și impar)*`

const v4cpp = code('Varianta 4 — Suma și produsul pozitivelor impare dintr-o coloană', desc4, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];
    int k;
    cin >> k;

    long long suma = 0, produs = 1;
    // TODO: suma și produsul elementelor pozitive impare din coloana k

    cout << "Suma: " << suma << "\n";
    cout << "Produs: " << produs << "\n";
    return 0;
}`,
  'Condiție: `a[i][k] > 0 && a[i][k] % 2 != 0`. Dacă e îndeplinită, adaugă la sumă și înmulțește produsul.',
  { difficulty: 'MEDIUM', points: 25 })

const v4c = code('Varianta 4 — Suma și produsul pozitivelor impare dintr-o coloană', desc4, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);
    int k;
    scanf("%d", &k);

    long long suma = 0, produs = 1;
    // TODO: suma și produsul elementelor pozitive impare din coloana k

    printf("Suma: %lld\\n", suma);
    printf("Produs: %lld\\n", produs);
    return 0;
}`,
  v4cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v4js = code('Varianta 4 — Suma și produsul pozitivelor impare dintr-o coloană', desc4, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));
const k = Number(lines[idx++]);

let suma = 0, produs = 1;
// TODO: suma și produsul elementelor pozitive impare din coloana k

console.log('Suma: ' + suma);
console.log('Produs: ' + produs);`,
  v4cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v4py = code('Varianta 4 — Suma și produsul pozitivelor impare dintr-o coloană', desc4, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)
k = int(data[idx]); idx += 1

suma = 0
produs = 1
# TODO: suma și produsul elementelor pozitive impare din coloana k

print(f"Suma: {suma}")
print(f"Produs: {produs}")`,
  v4cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

// ─── VARIANTA 5 ──────────────────────────────────────────────────────────────
// Înlocuiește elementele negative cu zerouri

const desc5 = `Citește o matrice **N×N**. Înlocuiește toate elementele **negative** cu **0** și afișează matricea obținută.

**Exemplu intrare:**
\`\`\`
3
1 -2 3
-4 5 -6
7 8 -9
\`\`\`
**Exemplu ieșire:**
\`\`\`
1 0 3
0 5 0
7 8 0
\`\`\``

const v5cpp = code('Varianta 5 — Înlocuiește negativele cu zerouri', desc5, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // TODO: înlocuiește elementele negative cu 0

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << a[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'Parcurge toată matricea; dacă `a[i][j] < 0` setează `a[i][j] = 0`.',
  { difficulty: 'EASY', points: 20 })

const v5c = code('Varianta 5 — Înlocuiește negativele cu zerouri', desc5, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    // TODO: înlocuiește elementele negative cu 0

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  v5cpp.explanation, { difficulty: 'EASY', points: 20 })

const v5js = code('Varianta 5 — Înlocuiește negativele cu zerouri', desc5, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

// TODO: înlocuiește elementele negative cu 0

for (let i = 0; i < n; i++)
    console.log(a[i].join(' '));`,
  v5cpp.explanation, { difficulty: 'EASY', points: 20 })

const v5py = code('Varianta 5 — Înlocuiește negativele cu zerouri', desc5, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

# TODO: înlocuiește elementele negative cu 0

for row in a:
    print(*row)`,
  v5cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 6 ──────────────────────────────────────────────────────────────
// Schimbă maximul cu minimul

const desc6 = `Citește o matrice **N×N**. Găsește elementul **maximal** și cel **minimal** din toată matricea și schimbă-le locurile. Afișează matricea rezultată.

**Exemplu intrare:**
\`\`\`
3
3 7 2
1 9 4
6 5 8
\`\`\`
**Exemplu ieșire:**
\`\`\`
3 7 2
9 1 4
6 5 8
\`\`\`
*(min=1 la [1][0], max=9 la [1][1] — se schimbă)*`

const v6cpp = code('Varianta 6 — Schimbă maximul cu minimul', desc6, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // TODO: găsește pozițiile min și max, apoi schimbă-le

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << a[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'Reține pozițiile (iMin, jMin) și (iMax, jMax) pe parcursul parcurgerii. La final schimbă `a[iMin][jMin]` cu `a[iMax][jMax]` printr-un `tmp`.',
  { difficulty: 'MEDIUM', points: 25 })

const v6c = code('Varianta 6 — Schimbă maximul cu minimul', desc6, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    // TODO: găsește pozițiile min și max, apoi schimbă-le

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  v6cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v6js = code('Varianta 6 — Schimbă maximul cu minimul', desc6, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

// TODO: găsește pozițiile min și max, apoi schimbă-le

for (let i = 0; i < n; i++)
    console.log(a[i].join(' '));`,
  v6cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v6py = code('Varianta 6 — Schimbă maximul cu minimul', desc6, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

# TODO: găsește pozițiile min și max, apoi schimbă-le

for row in a:
    print(*row)`,
  v6cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

// ─── VARIANTA 7 ──────────────────────────────────────────────────────────────
// Media aritmetică a primului și ultimului rând

const desc7 = `Citește o matrice **N×M**. Calculează **media aritmetică** a elementelor din **primul rând** (index 0) și din **ultimul rând** (index N-1). Afișează cu 2 zecimale.

**Exemplu intrare:**
\`\`\`
3 4
2 4 6 8
1 1 1 1
3 5 7 9
\`\`\`
**Exemplu ieșire:**
\`\`\`
Media rand 1: 5.00
Media rand N: 6.00
\`\`\``

const v7cpp = code('Varianta 7 — Media aritmetică a primului și ultimului rând', desc7, 'cpp',
  `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> a[i][j];

    double media1 = 0, mediaN = 0;
    // TODO: calculează media primului și ultimului rând

    cout << fixed << setprecision(2);
    cout << "Media rand 1: " << media1 << "\n";
    cout << "Media rand N: " << mediaN << "\n";
    return 0;
}`,
  'Sumează toate elementele rândului 0 și împarte la m; la fel pentru rândul n-1.',
  { difficulty: 'EASY', points: 20 })

const v7c = code('Varianta 7 — Media aritmetică a primului și ultimului rând', desc7, 'c',
  `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &a[i][j]);

    double media1 = 0, mediaN = 0;
    // TODO: calculează media primului și ultimului rând

    printf("Media rand 1: %.2f\\n", media1);
    printf("Media rand N: %.2f\\n", mediaN);
    return 0;
}`,
  v7cpp.explanation, { difficulty: 'EASY', points: 20 })

const v7js = code('Varianta 7 — Media aritmetică a primului și ultimului rând', desc7, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const [n, m] = lines[idx++].split(' ').map(Number);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

let media1 = 0, mediaN = 0;
// TODO: calculează media primului și ultimului rând

console.log('Media rand 1: ' + media1.toFixed(2));
console.log('Media rand N: ' + mediaN.toFixed(2));`,
  v7cpp.explanation, { difficulty: 'EASY', points: 20 })

const v7py = code('Varianta 7 — Media aritmetică a primului și ultimului rând', desc7, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n, m = int(data[idx]), int(data[idx+1]); idx += 2
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(m)]
    idx += m
    a.append(row)

# TODO: calculează media primului și ultimului rând
media1 = 0
mediaN = 0

print(f"Media rand 1: {media1:.2f}")
print(f"Media rand N: {mediaN:.2f}")`,
  v7cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 8 ──────────────────────────────────────────────────────────────
// Max și min pe fiecare rând cu poziția lor

const desc8 = `Citește o matrice **N×N**. Pentru fiecare rând, găsește elementul **maximal** și **minimal** și afișează valorile lor împreună cu **pozițiile** (coloanele) în care se află.

**Format ieșire per rând:**
\`\`\`
Rand i: max=VAL(col=J) min=VAL(col=K)
\`\`\`

**Exemplu intrare:**
\`\`\`
2
3 1 4
9 2 7
\`\`\`
**Exemplu ieșire:**
\`\`\`
Rand 0: max=4(col=2) min=1(col=1)
Rand 1: max=9(col=0) min=2(col=1)
\`\`\``

const v8cpp = code('Varianta 8 — Maxim și minim pe fiecare rând cu poziția', desc8, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    for (int i = 0; i < n; i++) {
        int maxVal = a[i][0], maxCol = 0;
        int minVal = a[i][0], minCol = 0;
        // TODO: parcurge rândul i și actualizează maxVal/maxCol, minVal/minCol

        cout << "Rand " << i << ": max=" << maxVal << "(col=" << maxCol << ")"
             << " min=" << minVal << "(col=" << minCol << ")\n";
    }
    return 0;
}`,
  'Pornești cu `maxVal = minVal = a[i][0]`. Compari fiecare `a[i][j]` (j≥1) și actualizezi dacă e mai mare/mai mic.',
  { difficulty: 'MEDIUM', points: 25 })

const v8c = code('Varianta 8 — Maxim și minim pe fiecare rând cu poziția', desc8, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    for (int i = 0; i < n; i++) {
        int maxVal = a[i][0], maxCol = 0;
        int minVal = a[i][0], minCol = 0;
        // TODO: parcurge rândul i și actualizează valorile

        printf("Rand %d: max=%d(col=%d) min=%d(col=%d)\\n",
               i, maxVal, maxCol, minVal, minCol);
    }
    return 0;
}`,
  v8cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v8js = code('Varianta 8 — Maxim și minim pe fiecare rând cu poziția', desc8, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

for (let i = 0; i < n; i++) {
    let maxVal = a[i][0], maxCol = 0;
    let minVal = a[i][0], minCol = 0;
    // TODO: parcurge a[i] și actualizează max/min

    console.log(\`Rand \${i}: max=\${maxVal}(col=\${maxCol}) min=\${minVal}(col=\${minCol})\`);
}`,
  v8cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v8py = code('Varianta 8 — Maxim și minim pe fiecare rând cu poziția', desc8, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

for i, row in enumerate(a):
    max_val, max_col = row[0], 0
    min_val, min_col = row[0], 0
    # TODO: parcurge row și actualizează max/min

    print(f"Rand {i}: max={max_val}(col={max_col}) min={min_val}(col={min_col})")`,
  v8cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

// ─── VARIANTA 9 ──────────────────────────────────────────────────────────────
// Suma și diferența a două tablouri

const desc9 = `Citește două matrice **N×N**: G și H. Calculează și afișează matricea **sumă** (G+H) și matricea **diferență** (G−H).

**Exemplu intrare:**
\`\`\`
2
1 2
3 4
5 6
7 8
\`\`\`
**Exemplu ieșire:**
\`\`\`
Suma:
6 8
10 12
Diferenta:
-4 -4
-4 -4
\`\`\``

const v9cpp = code('Varianta 9 — Suma și diferența a două matrice', desc9, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int g[100][100], h[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> g[i][j];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> h[i][j];

    cout << "Suma:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << g[i][j] + h[i][j] << " ";
        cout << "\n";
    }
    cout << "Diferenta:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << g[i][j] - h[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'Suma: `g[i][j] + h[i][j]`. Diferența: `g[i][j] - h[i][j]`. Nu e nevoie de matrice suplimentare.',
  { difficulty: 'EASY', points: 20 })

const v9c = code('Varianta 9 — Suma și diferența a două matrice', desc9, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int g[100][100], h[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &g[i][j]);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &h[i][j]);

    printf("Suma:\\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", g[i][j] + h[i][j]);
        printf("\\n");
    }
    printf("Diferenta:\\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", g[i][j] - h[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  v9cpp.explanation, { difficulty: 'EASY', points: 20 })

const v9js = code('Varianta 9 — Suma și diferența a două matrice', desc9, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const g = [], h = [];
for (let i = 0; i < n; i++) g.push(lines[idx++].split(' ').map(Number));
for (let i = 0; i < n; i++) h.push(lines[idx++].split(' ').map(Number));

console.log('Suma:');
for (let i = 0; i < n; i++)
    console.log(g[i].map((v, j) => v + h[i][j]).join(' '));
console.log('Diferenta:');
for (let i = 0; i < n; i++)
    console.log(g[i].map((v, j) => v - h[i][j]).join(' '));`,
  v9cpp.explanation, { difficulty: 'EASY', points: 20 })

const v9py = code('Varianta 9 — Suma și diferența a două matrice', desc9, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
g, h = [], []
for i in range(n):
    g.append([int(data[idx+j]) for j in range(n)]); idx += n
for i in range(n):
    h.append([int(data[idx+j]) for j in range(n)]); idx += n

print("Suma:")
for i in range(n):
    print(*[g[i][j] + h[i][j] for j in range(n)])
print("Diferenta:")
for i in range(n):
    print(*[g[i][j] - h[i][j] for j in range(n)])`,
  v9cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 10 ─────────────────────────────────────────────────────────────
// Suma diagonalelor principale și secundare

const desc10 = `Citește o matrice pătrată **N×N**. Calculează **suma elementelor de pe diagonala principală** (i==j) și **suma elementelor de pe diagonala secundară** (i+j==n-1). Afișează ambele sume.

**Exemplu intrare:**
\`\`\`
3
1 2 3
4 5 6
7 8 9
\`\`\`
**Exemplu ieșire:**
\`\`\`
Diagonala principala: 15
Diagonala secundara: 15
\`\`\``

const v10cpp = code('Varianta 10 — Suma diagonalelor principale și secundare', desc10, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    long long dp = 0, ds = 0;
    // TODO: calculează suma diagonalei principale (i==j) și secundare (i+j==n-1)

    cout << "Diagonala principala: " << dp << "\n";
    cout << "Diagonala secundara: " << ds << "\n";
    return 0;
}`,
  'Parcurge i=0..n-1: `dp += a[i][i]` și `ds += a[i][n-1-i]`. Dacă n e impar, elementul central e numărat o dată în fiecare.',
  { difficulty: 'EASY', points: 20 })

const v10c = code('Varianta 10 — Suma diagonalelor principale și secundare', desc10, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    long long dp = 0, ds = 0;
    // TODO: suma diagonalei principale și secundare

    printf("Diagonala principala: %lld\\n", dp);
    printf("Diagonala secundara: %lld\\n", ds);
    return 0;
}`,
  v10cpp.explanation, { difficulty: 'EASY', points: 20 })

const v10js = code('Varianta 10 — Suma diagonalelor principale și secundare', desc10, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

let dp = 0, ds = 0;
// TODO: suma diagonalei principale și secundare

console.log('Diagonala principala: ' + dp);
console.log('Diagonala secundara: ' + ds);`,
  v10cpp.explanation, { difficulty: 'EASY', points: 20 })

const v10py = code('Varianta 10 — Suma diagonalelor principale și secundare', desc10, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

dp = 0
ds = 0
# TODO: suma diagonalei principale și secundare

print(f"Diagonala principala: {dp}")
print(f"Diagonala secundara: {ds}")`,
  v10cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 11 ─────────────────────────────────────────────────────────────
// Verifică dacă două matrice sunt identice

const desc11 = `Citește dimensiunile **N** și **M**, apoi două matrice **N×M**: L și O. Verifică dacă sunt **identice** (toate elementele egale). Afișează \`DA\` sau \`NU\`.

**Exemplu intrare 1:**
\`\`\`
2 2
1 2
3 4
1 2
3 4
\`\`\`
**Ieșire:** \`DA\`

**Exemplu intrare 2:**
\`\`\`
2 2
1 2
3 4
1 2
3 5
\`\`\`
**Ieșire:** \`NU\``

const v11cpp = code('Varianta 11 — Verifică dacă două matrice sunt identice', desc11, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int l[100][100], o[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> l[i][j];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> o[i][j];

    bool identice = true;
    // TODO: verifică dacă l și o sunt identice

    cout << (identice ? "DA" : "NU") << "\n";
    return 0;
}`,
  'Dacă găsești orice `l[i][j] != o[i][j]` setezi `identice = false` și poți ieși din bucle cu `break` sau `goto`.',
  { difficulty: 'EASY', points: 20 })

const v11c = code('Varianta 11 — Verifică dacă două matrice sunt identice', desc11, 'c',
  `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int l[100][100], o[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &l[i][j]);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &o[i][j]);

    int identice = 1;
    // TODO: verifică dacă l și o sunt identice

    printf("%s\\n", identice ? "DA" : "NU");
    return 0;
}`,
  v11cpp.explanation, { difficulty: 'EASY', points: 20 })

const v11js = code('Varianta 11 — Verifică dacă două matrice sunt identice', desc11, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const [n, m] = lines[idx++].split(' ').map(Number);
const l = [], o = [];
for (let i = 0; i < n; i++) l.push(lines[idx++].split(' ').map(Number));
for (let i = 0; i < n; i++) o.push(lines[idx++].split(' ').map(Number));

let identice = true;
// TODO: verifică dacă l și o sunt identice

console.log(identice ? 'DA' : 'NU');`,
  v11cpp.explanation, { difficulty: 'EASY', points: 20 })

const v11py = code('Varianta 11 — Verifică dacă două matrice sunt identice', desc11, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n, m = int(data[idx]), int(data[idx+1]); idx += 2
l, o = [], []
for i in range(n):
    l.append([int(data[idx+j]) for j in range(m)]); idx += m
for i in range(n):
    o.append([int(data[idx+j]) for j in range(m)]); idx += m

# TODO: verifică dacă l și o sunt identice
identice = True

print("DA" if identice else "NU")`,
  v11cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 12 ─────────────────────────────────────────────────────────────
// Înlocuiește elementele identice cu 0, restul cu 1

const desc12 = `Citește o matrice **N×N**. Înlocuiește elementele care apar de **mai multe ori** în matrice cu **0**, iar elementele care apar o singură dată cu **1**. Afișează matricea rezultată.

**Exemplu intrare:**
\`\`\`
3
1 2 1
3 4 5
2 6 7
\`\`\`
**Exemplu ieșire:**
\`\`\`
0 0 0
1 1 1
0 1 1
\`\`\`
*(1 apare de 2 ori → 0; 2 apare de 2 ori → 0; restul apar o dată → 1)*`

const v12cpp = code('Varianta 12 — Elementele duplicate → 0, unice → 1', desc12, 'cpp',
  `#include <iostream>
#include <map>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // TODO: numără frecvența fiecărui element, apoi înlocuiește

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << a[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'Folosește `map<int,int> freq` pentru a număra apariții. Dacă `freq[a[i][j]] > 1` → 0, altfel → 1.',
  { difficulty: 'HARD', points: 30 })

const v12c = code('Varianta 12 — Elementele duplicate → 0, unice → 1', desc12, 'c',
  `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    // Hint: reține valorile originale, numără frecvența, apoi rescrie
    int orig[100][100];
    int freq[20001] = {0}; // pentru valori în [-10000, 10000]
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            orig[i][j] = a[i][j];
            freq[a[i][j] + 10000]++;
        }

    // TODO: înlocuiește a[i][j] cu 0 dacă duplicat, cu 1 dacă unic

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  'Parcurge din nou matricea; dacă `freq[orig[i][j] + 10000] > 1` scrie 0, altfel 1.',
  { difficulty: 'HARD', points: 30 })

const v12js = code('Varianta 12 — Elementele duplicate → 0, unice → 1', desc12, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

const freq = new Map();
for (const row of a)
    for (const v of row)
        freq.set(v, (freq.get(v) || 0) + 1);

// TODO: înlocuiește elementele duplicat cu 0 și cele unice cu 1

for (let i = 0; i < n; i++)
    console.log(a[i].join(' '));`,
  'Verifică `freq.get(a[i][j]) > 1` → 0, altfel → 1.',
  { difficulty: 'HARD', points: 30 })

const v12py = code('Varianta 12 — Elementele duplicate → 0, unice → 1', desc12, 'python',
  `import sys
from collections import Counter
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

freq = Counter(v for row in a for v in row)
# TODO: înlocuiește elementele duplicat cu 0 și cele unice cu 1

for row in a:
    print(*row)`,
  '`freq[v] > 1` → 0, altfel → 1. Rescrie `a[i][j]` în a doua parcurgere.',
  { difficulty: 'HARD', points: 30 })

// ─── VARIANTA 13 ─────────────────────────────────────────────────────────────
// Suma matricii triunghiulare superioare

const desc13 = `Citește o matrice **N×N**. Calculează **suma elementelor din triunghiul superior** (elementele pentru care j ≥ i, inclusiv diagonala principală).

**Exemplu intrare:**
\`\`\`
3
1 2 3
4 5 6
7 8 9
\`\`\`
**Exemplu ieșire:**
\`\`\`
26
\`\`\`
*(1+2+3+5+6+9 = 26)*`

const v13cpp = code('Varianta 13 — Suma triunghiului superior', desc13, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    long long suma = 0;
    // TODO: adaugă la sumă elementele cu j >= i

    cout << suma << "\n";
    return 0;
}`,
  'For i=0..n-1, for j=i..n-1: `suma += a[i][j]`.',
  { difficulty: 'EASY', points: 20 })

const v13c = code('Varianta 13 — Suma triunghiului superior', desc13, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    long long suma = 0;
    // TODO: adaugă la sumă elementele cu j >= i

    printf("%lld\\n", suma);
    return 0;
}`,
  v13cpp.explanation, { difficulty: 'EASY', points: 20 })

const v13js = code('Varianta 13 — Suma triunghiului superior', desc13, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

let suma = 0;
// TODO: adaugă la sumă elementele cu j >= i

console.log(suma);`,
  v13cpp.explanation, { difficulty: 'EASY', points: 20 })

const v13py = code('Varianta 13 — Suma triunghiului superior', desc13, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

suma = 0
# TODO: adaugă la sumă elementele cu j >= i

print(suma)`,
  v13cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 14 ─────────────────────────────────────────────────────────────
// Suma matricii triunghiulare inferioare

const desc14 = `Citește o matrice **N×N**. Calculează **suma elementelor din triunghiul inferior** (elementele pentru care j ≤ i, inclusiv diagonala principală).

**Exemplu intrare:**
\`\`\`
3
1 2 3
4 5 6
7 8 9
\`\`\`
**Exemplu ieșire:**
\`\`\`
34
\`\`\`
*(1+4+5+7+8+9 = 34)*`

const v14cpp = code('Varianta 14 — Suma triunghiului inferior', desc14, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    long long suma = 0;
    // TODO: adaugă la sumă elementele cu j <= i

    cout << suma << "\n";
    return 0;
}`,
  'For i=0..n-1, for j=0..i: `suma += a[i][j]`.',
  { difficulty: 'EASY', points: 20 })

const v14c = code('Varianta 14 — Suma triunghiului inferior', desc14, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    long long suma = 0;
    // TODO: adaugă la sumă elementele cu j <= i

    printf("%lld\\n", suma);
    return 0;
}`,
  v14cpp.explanation, { difficulty: 'EASY', points: 20 })

const v14js = code('Varianta 14 — Suma triunghiului inferior', desc14, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

let suma = 0;
// TODO: adaugă la sumă elementele cu j <= i

console.log(suma);`,
  v14cpp.explanation, { difficulty: 'EASY', points: 20 })

const v14py = code('Varianta 14 — Suma triunghiului inferior', desc14, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

suma = 0
# TODO: adaugă la sumă elementele cu j <= i

print(suma)`,
  v14cpp.explanation, { difficulty: 'EASY', points: 20 })

// ─── VARIANTA 15 ─────────────────────────────────────────────────────────────
// Schimbă elementele diagonalei principale cu cele ale celei secundare

const desc15 = `Citește o matrice **N×N**. Schimbă cu locul elementele **diagonalei principale** cu elementele **diagonalei secundare**. Afișează matricea rezultată.

**Exemplu intrare:**
\`\`\`
3
1 2 3
4 5 6
7 8 9
\`\`\`
**Exemplu ieșire:**
\`\`\`
3 2 1
4 5 6
9 8 7
\`\`\`
*(a[0][0]↔a[0][2], a[1][1]↔a[1][1], a[2][2]↔a[2][0])*`

const v15cpp = code('Varianta 15 — Schimbă diagonala principală cu cea secundară', desc15, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // TODO: schimbă a[i][i] cu a[i][n-1-i] pentru fiecare i

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << a[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'For i=0..n-1: `swap(a[i][i], a[i][n-1-i])`. Dacă n e impar, elementul central rămâne neschimbat (se schimbă cu el însuși).',
  { difficulty: 'MEDIUM', points: 25 })

const v15c = code('Varianta 15 — Schimbă diagonala principală cu cea secundară', desc15, 'c',
  `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100][100];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    // TODO: schimbă a[i][i] cu a[i][n-1-i] pentru fiecare i

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  v15cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v15js = code('Varianta 15 — Schimbă diagonala principală cu cea secundară', desc15, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));

// TODO: schimbă a[i][i] cu a[i][n-1-i] pentru fiecare i

for (let i = 0; i < n; i++)
    console.log(a[i].join(' '));`,
  v15cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

const v15py = code('Varianta 15 — Schimbă diagonala principală cu cea secundară', desc15, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)

# TODO: schimbă a[i][i] cu a[i][n-1-i] pentru fiecare i

for row in a:
    print(*row)`,
  v15cpp.explanation, { difficulty: 'MEDIUM', points: 25 })

// ─── VARIANTA 16 ─────────────────────────────────────────────────────────────
// Suma și numărul elementelor nenegative per coloană

const desc16 = `Citește o matrice **N×N**. Pentru fiecare coloană calculează **suma** și **numărul** elementelor **nenegative** (≥ 0). Memorează rezultatele în două linii suplimentare și afișează matricea extinsă (N+2 linii).

**Exemplu intrare:**
\`\`\`
2
-1 2
3 -4
\`\`\`
**Exemplu ieșire:**
\`\`\`
-1 2
3 -4
3 2
1 1
\`\`\`
*(Col 0: suma nenegative=3, count=1; Col 1: suma=2, count=1)*`

const v16cpp = code('Varianta 16 — Suma și numărul nenegativelor pe coloane (linii extra)', desc16, 'cpp',
  `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[102][100] = {};
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // TODO: calculează pentru fiecare coloană j:
    //   a[n][j]   = suma elementelor nenegative
    //   a[n+1][j] = numărul elementelor nenegative

    for (int i = 0; i < n + 2; i++) {
        for (int j = 0; j < n; j++)
            cout << a[i][j] << " ";
        cout << "\n";
    }
    return 0;
}`,
  'Parcurge fiecare coloană j; pentru i=0..n-1 dacă `a[i][j] >= 0`: `a[n][j] += a[i][j]` și `a[n+1][j]++`.',
  { difficulty: 'HARD', points: 30 })

const v16c = code('Varianta 16 — Suma și numărul nenegativelor pe coloane (linii extra)', desc16, 'c',
  `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[102][100];
    memset(a, 0, sizeof(a));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    // TODO: calculează a[n][j] = suma nenegative, a[n+1][j] = count nenegative

    for (int i = 0; i < n + 2; i++) {
        for (int j = 0; j < n; j++)
            printf("%d ", a[i][j]);
        printf("\\n");
    }
    return 0;
}`,
  v16cpp.explanation, { difficulty: 'HARD', points: 30 })

const v16js = code('Varianta 16 — Suma și numărul nenegativelor pe coloane (linii extra)', desc16, 'javascript',
  `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
const n = Number(lines[idx++]);
const a = [];
for (let i = 0; i < n; i++)
    a.push(lines[idx++].split(' ').map(Number));
// Adaugă două linii extra inițializate cu 0
a.push(new Array(n).fill(0));
a.push(new Array(n).fill(0));

// TODO: calculează a[n][j] = suma nenegative, a[n+1][j] = count nenegative

for (let i = 0; i < n + 2; i++)
    console.log(a[i].join(' '));`,
  v16cpp.explanation, { difficulty: 'HARD', points: 30 })

const v16py = code('Varianta 16 — Suma și numărul nenegativelor pe coloane (linii extra)', desc16, 'python',
  `import sys
data = sys.stdin.read().split()
idx = 0
n = int(data[idx]); idx += 1
a = []
for i in range(n):
    row = [int(data[idx+j]) for j in range(n)]
    idx += n
    a.append(row)
a.append([0] * n)
a.append([0] * n)

# TODO: calculează a[n][j] = suma nenegative, a[n+1][j] = count nenegative

for row in a:
    print(*row)`,
  v16cpp.explanation, { difficulty: 'HARD', points: 30 })

// ─── TOATE PROBLEMELE ────────────────────────────────────────────────────────

const allProblems = [
  v1cpp, v1c, v1js, v1py,
  v2cpp, v2c, v2js, v2py,
  v3cpp, v3c, v3js, v3py,
  v4cpp, v4c, v4js, v4py,
  v5cpp, v5c, v5js, v5py,
  v6cpp, v6c, v6js, v6py,
  v7cpp, v7c, v7js, v7py,
  v8cpp, v8c, v8js, v8py,
  v9cpp, v9c, v9js, v9py,
  v10cpp, v10c, v10js, v10py,
  v11cpp, v11c, v11js, v11py,
  v12cpp, v12c, v12js, v12py,
  v13cpp, v13c, v13js, v13py,
  v14cpp, v14c, v14js, v14py,
  v15cpp, v15c, v15js, v15py,
  v16cpp, v16c, v16js, v16py,
]

async function main() {
  console.log(`🚀 Seed: Probleme Matrice (tablouri bidimensionale)`)
  console.log(`   Total: ${allProblems.length} probleme (16 variante × 4 limbaje)`)

  const titles = allProblems.map((p) => p.title)

  const deleted = await prisma.problem.deleteMany({
    where: { lessonId: null, title: { in: titles } },
  })
  console.log(`   Șterse anterior: ${deleted.count}`)

  const created = await prisma.problem.createMany({
    data: allProblems.map((p) => ({
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      topic: p.topic,
      type: p.type,
      options: p.options,
      correctAnswer: p.correctAnswer,
      starterCode: p.starterCode,
      explanation: p.explanation,
      hint: p.hint,
      tags: p.tags,
      estimatedTime: p.estimatedTime,
      points: p.points,
      language: p.language,
      active: true,
      lessonId: null,
    })),
  })

  console.log(`   ✅ Create: ${created.count} probleme`)
  console.log(`\n📊 Detalii:`)
  const langs = ['cpp', 'c', 'javascript', 'python']
  for (const lang of langs) {
    const cnt = allProblems.filter((p) => p.language === lang).length
    console.log(`   ${lang.padEnd(12)}: ${cnt} probleme`)
  }
}

main()
  .catch((e) => { console.error('❌ Eroare:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
