// Patch suplimentar pentru modulul Python — Metodicile 2-6, 10-18
// Aplicat de index.mjs DUPĂ pythonMetodicaPatch.
// Se folosește aceeași structură: appendTheory / appendProblems / newLessons.

import { code, sa } from './helpers.mjs'

// ============================================================
// METODICA 2 — Input + bug-ul cu string + comparații
// → augment lecția existentă `input-conversii`
// ============================================================

const inputConversiiTheoryAppend = `

## ⚠️ Bug-ul clasic: \`input()\` întoarce întotdeauna text

Indiferent ce tastează utilizatorul, \`input()\` returnează un **string** (text). Dacă încercăm să adunăm două „numere” fără conversie, Python le va **lipi** ca pe niște texte:

\`\`\`python
a = input("Primul: ")   # "3"
b = input("Al doilea: ") # "4"
print(a + b)             # afișează "34" (nu 7!)
\`\`\`

🔧 **Soluția:** convertim cu \`int()\` (sau \`float()\` pentru zecimale):

\`\`\`python
a = int(input("Primul: "))   # 3
b = int(input("Al doilea: ")) # 4
print(a + b)                 # afișează 7 ✅
\`\`\`

> 💡 Regulă de aur: dacă vrei **operații matematice** pe ce tastează utilizatorul, înfășoară \`input()\` în \`int()\` sau \`float()\`.
`

const inputConversiiProblems = [
  code(
    'Bug-ul cu input — corectează adunarea',
    'Programul de mai jos ar trebui să adune două numere, dar afișează „34” în loc de 7. **Corectează-l** ca să facă adunarea corect.\n\n```python\na = input("Primul număr: ")\nb = input("Al doilea număr: ")\nprint("Suma:", a + b)\n```',
    'python',
    'a = input("Primul număr: ")\nb = input("Al doilea număr: ")\nprint("Suma:", a + b)\n',
    'Trebuie să convertim cu `int()` ÎNAINTE de adunare:\n\n```python\na = int(input("Primul număr: "))\nb = int(input("Al doilea număr: "))\nprint("Suma:", a + b)\n```',
    {
      topic: 'input',
      difficulty: 'EASY',
      points: 15,
      hint: 'Înfășoară fiecare `input(...)` în `int(...)`.',
      correctAnswer: 'a = int(input("Primul număr: "))\nb = int(input("Al doilea număr: "))\nprint("Suma:", a + b)',
      tags: ['input', 'int', 'conversie'],
    }
  ),
  code(
    'Aria dreptunghiului',
    'Citește **lungimea** și **lățimea** de la utilizator (numere întregi) și afișează aria dreptunghiului.',
    'python',
    'L = int(input("Lungimea: "))\nl = int(input("Lățimea: "))\n',
    '```python\nL = int(input("Lungimea: "))\nl = int(input("Lățimea: "))\nprint("Aria:", L * l)\n```',
    {
      topic: 'input',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'L = int(input("Lungimea: "))\nl = int(input("Lățimea: "))\nprint("Aria:", L * l)',
      tags: ['input', 'aritmetica'],
    }
  ),
  code(
    'Vârsta peste 5 ani',
    'Cere utilizatorului vârsta sa, apoi afișează „Peste 5 ani vei avea X ani”.',
    'python',
    'varsta = int(input("Câți ani ai? "))\n',
    '```python\nvarsta = int(input("Câți ani ai? "))\nprint("Peste 5 ani vei avea", varsta + 5, "ani")\n```',
    {
      topic: 'input',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'varsta = int(input("Câți ani ai? "))\nprint("Peste 5 ani vei avea", varsta + 5, "ani")',
      tags: ['input'],
    }
  ),
]

// ============================================================
// METODICA 4 + porțiuni din M2 — operatorii logici and / or / not
// → augment lecția `if-else-elif`
// ============================================================

const ifElseTheoryAppend = `

## 🔗 Operatorii logici: \`and\`, \`or\`, \`not\`

Putem combina mai multe condiții într-o singură expresie booleană.

### \`and\` — ȘI logic
Adevărat **doar dacă AMBELE** condiții sunt adevărate.

| A | B | A and B |
|---|---|---|
| True | True | **True** |
| True | False | False |
| False | True | False |
| False | False | False |

Truc de memorat: tratăm True=1, False=0 → \`and\` se comportă ca **înmulțirea** (\`1*1=1\`, restul 0).

### \`or\` — SAU logic
Adevărat dacă **cel puțin UNA** dintre condiții e adevărată.

| A | B | A or B |
|---|---|---|
| True | True | **True** |
| True | False | **True** |
| False | True | **True** |
| False | False | False |

Truc: \`or\` se comportă ca **adunarea** (\`0+0=0\`, restul ≥ 1 → True).

### \`not\` — NEGAȚIE
Inversează: \`not True\` → \`False\`, \`not False\` → \`True\`.

\`\`\`python
varsta = 20
if varsta >= 18 and varsta <= 65:
    print("Apt de muncă")

if zi == "sâmbătă" or zi == "duminică":
    print("Weekend!")

if not are_card:
    print("Acces refuzat")
\`\`\`

## 🔄 \`elif\` — verificări multiple

Când avem **mai multe cazuri** care se exclud, folosim \`elif\` (else if):

\`\`\`python
zi = int(input("Ziua (1-7): "))
if zi == 1:
    print("Luni")
elif zi == 2:
    print("Marți")
elif zi == 3:
    print("Miercuri")
# ... etc
else:
    print("Zi invalidă")
\`\`\`

🔹 Doar **una** dintre ramuri se execută (prima care e adevărată).
🔹 \`else\` final prinde toate cazurile rămase.
`

const ifElseProblems = [
  code(
    'Verificare parolă',
    'Cere utilizatorului o parolă. Dacă este `qwerty`, afișează „Parolă corectă!”. Altfel: „Parolă greșită!”.',
    'python',
    'p = input("Parola: ")\n',
    '```python\np = input("Parola: ")\nif p == "qwerty":\n    print("Parolă corectă!")\nelse:\n    print("Parolă greșită!")\n```',
    {
      topic: 'if-else',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'p = input("Parola: ")\nif p == "qwerty":\n    print("Parolă corectă!")\nelse:\n    print("Parolă greșită!")',
      tags: ['if-else', 'string'],
    }
  ),
  code(
    'Major sau minor',
    'Cere vârsta utilizatorului. Dacă are **18 ani sau mai mult**, afișează „Ești major”. Altfel: „Ești minor”.',
    'python',
    'varsta = int(input("Vârsta: "))\n',
    '```python\nvarsta = int(input("Vârsta: "))\nif varsta >= 18:\n    print("Ești major")\nelse:\n    print("Ești minor")\n```',
    {
      topic: 'if-else',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'varsta = int(input("Vârsta: "))\nif varsta >= 18:\n    print("Ești major")\nelse:\n    print("Ești minor")',
      tags: ['if-else'],
    }
  ),
  code(
    'Ziua săptămânii (elif)',
    'Cere un număr de la 1 la 7 și afișează ziua săptămânii corespunzătoare (1=Luni, 2=Marți, …, 7=Duminică). Pentru orice altă valoare: „Zi invalidă”.',
    'python',
    'n = int(input("Ziua (1-7): "))\n',
    '```python\nn = int(input("Ziua (1-7): "))\nif n == 1: print("Luni")\nelif n == 2: print("Marți")\nelif n == 3: print("Miercuri")\nelif n == 4: print("Joi")\nelif n == 5: print("Vineri")\nelif n == 6: print("Sâmbătă")\nelif n == 7: print("Duminică")\nelse: print("Zi invalidă")\n```',
    {
      topic: 'elif',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește un lanț de `if` / `elif` / `else`.',
      correctAnswer: 'n = int(input("Ziua (1-7): "))\nif n == 1:\n    print("Luni")\nelif n == 2:\n    print("Marți")\nelif n == 3:\n    print("Miercuri")\nelif n == 4:\n    print("Joi")\nelif n == 5:\n    print("Vineri")\nelif n == 6:\n    print("Sâmbătă")\nelif n == 7:\n    print("Duminică")\nelse:\n    print("Zi invalidă")',
      tags: ['elif'],
    }
  ),
  code(
    'Număr par ȘI pozitiv',
    'Cere un număr și verifică dacă este **par ȘI pozitiv** (folosește `and`). Afișează `True` sau `False`.',
    'python',
    'n = int(input("Număr: "))\n',
    '```python\nn = int(input("Număr: "))\nprint(n % 2 == 0 and n > 0)\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      hint: 'Combină `n % 2 == 0` cu `n > 0` folosind `and`.',
      correctAnswer: 'n = int(input("Număr: "))\nprint(n % 2 == 0 and n > 0)',
      tags: ['and', 'modulo'],
    }
  ),
  code(
    'Divizibil cu 2 SAU cu 3',
    'Cere un număr și afișează „Da” dacă este divizibil cu 2 **sau** cu 3, altfel „Nu”.',
    'python',
    'n = int(input("Număr: "))\n',
    '```python\nn = int(input("Număr: "))\nif n % 2 == 0 or n % 3 == 0:\n    print("Da")\nelse:\n    print("Nu")\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'n = int(input("Număr: "))\nif n % 2 == 0 or n % 3 == 0:\n    print("Da")\nelse:\n    print("Nu")',
      tags: ['or', 'modulo'],
    }
  ),
  code(
    'Acces gratuit la muzeu',
    'Intrarea la muzeu este gratuită pentru copii (sub 7 ani) sau pensionari (peste 65 ani). Cere vârsta și afișează „Gratuit” sau „Plătește”.',
    'python',
    'varsta = int(input("Vârsta: "))\n',
    '```python\nvarsta = int(input("Vârsta: "))\nif varsta < 7 or varsta > 65:\n    print("Gratuit")\nelse:\n    print("Plătește")\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'varsta = int(input("Vârsta: "))\nif varsta < 7 or varsta > 65:\n    print("Gratuit")\nelse:\n    print("Plătește")',
      tags: ['or'],
    }
  ),
  code(
    'Login admin',
    'Cere `username` și `parolă`. Acceptă doar `admin` + `1234`. Afișează „Bun venit, admin!” sau „Date incorecte”.',
    'python',
    'u = input("Username: ")\np = input("Parolă: ")\n',
    '```python\nu = input("Username: ")\np = input("Parolă: ")\nif u == "admin" and p == "1234":\n    print("Bun venit, admin!")\nelse:\n    print("Date incorecte")\n```',
    {
      topic: 'and-or',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'u = input("Username: ")\np = input("Parolă: ")\nif u == "admin" and p == "1234":\n    print("Bun venit, admin!")\nelse:\n    print("Date incorecte")',
      tags: ['and'],
    }
  ),
  code(
    'Cont nou — validare',
    'Pentru a crea un cont, utilizatorul trebuie să introducă un **username nevid** ȘI o **parolă cu cel puțin 8 caractere**. Afișează „Cont creat” sau „Date invalide”.',
    'python',
    'u = input("Username: ")\np = input("Parolă: ")\n',
    '```python\nu = input("Username: ")\np = input("Parolă: ")\nif u != "" and len(p) >= 8:\n    print("Cont creat")\nelse:\n    print("Date invalide")\n```',
    {
      topic: 'and-or',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Verifică `u != ""` ȘI `len(p) >= 8`.',
      correctAnswer: 'u = input("Username: ")\np = input("Parolă: ")\nif u != "" and len(p) >= 8:\n    print("Cont creat")\nelse:\n    print("Date invalide")',
      tags: ['and', 'len'],
    }
  ),
  code(
    'An bisect',
    'Un an este **bisect** dacă: (este divizibil cu 4 ȘI NU este divizibil cu 100) SAU este divizibil cu 400.\nCere un an și afișează „Bisect” sau „Nu este bisect”.',
    'python',
    'an = int(input("Anul: "))\n',
    '```python\nan = int(input("Anul: "))\nif (an % 4 == 0 and an % 100 != 0) or an % 400 == 0:\n    print("Bisect")\nelse:\n    print("Nu este bisect")\n```',
    {
      topic: 'and-or',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Atenție la paranteze: `(div 4 AND NOT div 100) OR div 400`.',
      correctAnswer: 'an = int(input("Anul: "))\nif (an % 4 == 0 and an % 100 != 0) or an % 400 == 0:\n    print("Bisect")\nelse:\n    print("Nu este bisect")',
      tags: ['and', 'or', 'modulo'],
    }
  ),
  code(
    'Triunghi valid',
    'Cere 3 lungimi de laturi (`a`, `b`, `c`). Un triunghi este valid dacă **fiecare latură** este mai mică decât suma celorlalte două:\n`a < b + c` ȘI `b < a + c` ȘI `c < a + b`.\nAfișează „Da” sau „Nu”.',
    'python',
    'a = int(input("a: "))\nb = int(input("b: "))\nc = int(input("c: "))\n',
    '```python\na = int(input("a: "))\nb = int(input("b: "))\nc = int(input("c: "))\nif a < b + c and b < a + c and c < a + b:\n    print("Da")\nelse:\n    print("Nu")\n```',
    {
      topic: 'and-or',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'a = int(input("a: "))\nb = int(input("b: "))\nc = int(input("c: "))\nif a < b + c and b < a + c and c < a + b:\n    print("Da")\nelse:\n    print("Nu")',
      tags: ['and', 'triunghi'],
    }
  ),
]

// ============================================================
// METODICA 3 — Operatorii `//` și `%`
// → augment lecția `operatori`
// ============================================================

const operatoriTheoryAppend = `

## ➗ Împărțirea întreagă \`//\` și restul \`%\`

Python are **doi operatori de împărțire** speciali pe lângă \`/\`:

| Operator | Nume | Exemplu | Rezultat |
|---|---|---|---|
| \`/\` | împărțire reală | \`10 / 3\` | \`3.333...\` |
| \`//\` | împărțire întreagă (câtul) | \`10 // 3\` | \`3\` |
| \`%\` | modulo (restul) | \`10 % 3\` | \`1\` |

🔹 \`//\` aruncă partea fracționară: \`7 // 2 = 3\`, \`9 // 4 = 2\`.
🔹 \`%\` dă **restul** împărțirii: \`7 % 2 = 1\`, \`9 % 4 = 1\`.

### 💡 Aplicație clasică: convertire kg → kg + grame

\`\`\`python
total = 2750  # grame
kg = total // 1000   # 2
g  = total % 1000    # 750
print(f"{kg} kg și {g} g")
\`\`\`

### 🔍 Detectare paritate
Dacă \`n % 2 == 0\` → număr par. Altfel → impar.
`

const operatoriProblems = [
  code(
    'Câtul și restul',
    'Cere două numere `a` și `b` și afișează **câtul** (împărțirea întreagă) și **restul**.\n\nExemplu: `a=17`, `b=5` → cât = 3, rest = 2.',
    'python',
    'a = int(input("a: "))\nb = int(input("b: "))\n',
    '```python\na = int(input("a: "))\nb = int(input("b: "))\nprint("Cât:", a // b)\nprint("Rest:", a % b)\n```',
    {
      topic: 'operatori',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'a = int(input("a: "))\nb = int(input("b: "))\nprint("Cât:", a // b)\nprint("Rest:", a % b)',
      tags: ['div', 'mod'],
    }
  ),
  code(
    'Convertire grame în kg + grame',
    'Cere un număr de **grame** și afișează câte kg și câte grame sunt.\n\n**Exemplu:** 2750 → „2 kg și 750 g”',
    'python',
    'g = int(input("Grame: "))\n',
    '```python\ng = int(input("Grame: "))\nkg = g // 1000\nrest = g % 1000\nprint(kg, "kg și", rest, "g")\n```',
    {
      topic: 'operatori',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `// 1000` pentru kg și `% 1000` pentru grame.',
      correctAnswer: 'g = int(input("Grame: "))\nkg = g // 1000\nrest = g % 1000\nprint(kg, "kg și", rest, "g")',
      tags: ['div', 'mod'],
    }
  ),
  code(
    'Cost telegramă (lei și bani)',
    'O telegramă costă **40 de bani per caracter**. Cere lungimea (numărul de caractere) și afișează costul în formatul „X lei și Y bani”.\n\n**Exemplu:** 12 caractere → 12 × 40 = 480 bani → „4 lei și 80 bani”',
    'python',
    'n = int(input("Numărul de caractere: "))\n',
    '```python\nn = int(input("Numărul de caractere: "))\ntotal_bani = n * 40\nlei = total_bani // 100\nbani = total_bani % 100\nprint(lei, "lei și", bani, "bani")\n```',
    {
      topic: 'operatori',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'n = int(input("Numărul de caractere: "))\ntotal_bani = n * 40\nlei = total_bani // 100\nbani = total_bani % 100\nprint(lei, "lei și", bani, "bani")',
      tags: ['div', 'mod', 'aplicație'],
    }
  ),
  code(
    'Par sau impar',
    'Cere un număr și afișează „Par” sau „Impar”.',
    'python',
    'n = int(input("Număr: "))\n',
    '```python\nn = int(input("Număr: "))\nif n % 2 == 0:\n    print("Par")\nelse:\n    print("Impar")\n```',
    {
      topic: 'operatori',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'n = int(input("Număr: "))\nif n % 2 == 0:\n    print("Par")\nelse:\n    print("Impar")',
      tags: ['mod'],
    }
  ),
]

// ============================================================
// METODICA 5 — Probleme de matematică
// → augment lecția `probleme-conditii`
// ============================================================

const problemeConditiiProblems = [
  code(
    'Aria și perimetrul dreptunghiului',
    'Cere lungimea `L` și lățimea `l`. Afișează **aria** (`L*l`) și **perimetrul** (`2*(L+l)`).',
    'python',
    'L = int(input("Lungimea: "))\nl = int(input("Lățimea: "))\n',
    '```python\nL = int(input("Lungimea: "))\nl = int(input("Lățimea: "))\nprint("Aria:", L * l)\nprint("Perimetrul:", 2 * (L + l))\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'L = int(input("Lungimea: "))\nl = int(input("Lățimea: "))\nprint("Aria:", L * l)\nprint("Perimetrul:", 2 * (L + l))',
      tags: ['geometrie'],
    }
  ),
  code(
    'Celsius → Fahrenheit',
    'Cere o temperatură în Celsius și convertește în Fahrenheit cu formula: `F = C * 9/5 + 32`.',
    'python',
    'C = float(input("Celsius: "))\n',
    '```python\nC = float(input("Celsius: "))\nF = C * 9 / 5 + 32\nprint("Fahrenheit:", F)\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'C = float(input("Celsius: "))\nF = C * 9 / 5 + 32\nprint("Fahrenheit:", F)',
      tags: ['conversie'],
    }
  ),
  code(
    'Media a două numere',
    'Cere două numere și afișează media lor aritmetică.',
    'python',
    'a = float(input("a: "))\nb = float(input("b: "))\n',
    '```python\na = float(input("a: "))\nb = float(input("b: "))\nprint("Media:", (a + b) / 2)\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'a = float(input("a: "))\nb = float(input("b: "))\nprint("Media:", (a + b) / 2)',
      tags: ['medie'],
    }
  ),
  code(
    'Aria și circumferința cercului',
    'Cere raza unui cerc și afișează **aria** (`π * r²`) și **circumferința** (`2 * π * r`). Folosește `π = 3.14`.',
    'python',
    'r = float(input("Raza: "))\n',
    '```python\nr = float(input("Raza: "))\npi = 3.14\nprint("Aria:", pi * r ** 2)\nprint("Circumferința:", 2 * pi * r)\n```',
    {
      topic: 'matematica',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `r ** 2` pentru ridicare la pătrat.',
      correctAnswer: 'r = float(input("Raza: "))\npi = 3.14\nprint("Aria:", pi * r ** 2)\nprint("Circumferința:", 2 * pi * r)',
      tags: ['geometrie', 'pi'],
    }
  ),
  code(
    'Ipotenuza (Pitagora)',
    'Cere lungimile celor două catete `a` și `b`. Calculează ipotenuza folosind `(a² + b²) ** 0.5`.',
    'python',
    'a = float(input("a: "))\nb = float(input("b: "))\n',
    '```python\na = float(input("a: "))\nb = float(input("b: "))\nip = (a ** 2 + b ** 2) ** 0.5\nprint("Ipotenuza:", ip)\n```',
    {
      topic: 'matematica',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'a = float(input("a: "))\nb = float(input("b: "))\nip = (a ** 2 + b ** 2) ** 0.5\nprint("Ipotenuza:", ip)',
      tags: ['pitagora'],
    }
  ),
  code(
    'Ecuația liniară ax + b = c',
    'Citește `a`, `b`, `c` și rezolvă ecuația `ax + b = c`. Tratează cazurile speciale:\n- dacă `a == 0` și `b == c` → „Soluții infinite”\n- dacă `a == 0` și `b != c` → „Fără soluții”\n- altfel → afișează `x = (c - b) / a`',
    'python',
    'a = float(input("a: "))\nb = float(input("b: "))\nc = float(input("c: "))\n',
    '```python\na = float(input("a: "))\nb = float(input("b: "))\nc = float(input("c: "))\nif a == 0:\n    if b == c:\n        print("Soluții infinite")\n    else:\n        print("Fără soluții")\nelse:\n    print("x =", (c - b) / a)\n```',
    {
      topic: 'matematica',
      difficulty: 'HARD',
      points: 30,
      hint: 'Tratează separat cazul `a == 0` (cu sub-cazuri).',
      correctAnswer: 'a = float(input("a: "))\nb = float(input("b: "))\nc = float(input("c: "))\nif a == 0:\n    if b == c:\n        print("Soluții infinite")\n    else:\n        print("Fără soluții")\nelse:\n    print("x =", (c - b) / a)',
      tags: ['ecuatie', 'if'],
    }
  ),
  code(
    'Ecuația de gradul II',
    'Citește `a`, `b`, `c` (cu `a != 0`). Rezolvă `ax² + bx + c = 0` folosind discriminantul `Δ = b² - 4ac`:\n- `Δ > 0` → 2 soluții reale: `(-b ± √Δ) / (2a)`\n- `Δ == 0` → 1 soluție: `-b / (2a)`\n- `Δ < 0` → „Fără soluții reale”',
    'python',
    'import math\na = float(input("a: "))\nb = float(input("b: "))\nc = float(input("c: "))\n',
    '```python\nimport math\na = float(input("a: "))\nb = float(input("b: "))\nc = float(input("c: "))\nD = b ** 2 - 4 * a * c\nif D > 0:\n    x1 = (-b + math.sqrt(D)) / (2 * a)\n    x2 = (-b - math.sqrt(D)) / (2 * a)\n    print("x1 =", x1, "x2 =", x2)\nelif D == 0:\n    print("x =", -b / (2 * a))\nelse:\n    print("Fără soluții reale")\n```',
    {
      topic: 'matematica',
      difficulty: 'HARD',
      points: 30,
      hint: 'Calculează `Δ = b**2 - 4*a*c`, apoi `if/elif/else`.',
      correctAnswer: 'import math\na = float(input("a: "))\nb = float(input("b: "))\nc = float(input("c: "))\nD = b ** 2 - 4 * a * c\nif D > 0:\n    x1 = (-b + math.sqrt(D)) / (2 * a)\n    x2 = (-b - math.sqrt(D)) / (2 * a)\n    print("x1 =", x1, "x2 =", x2)\nelif D == 0:\n    print("x =", -b / (2 * a))\nelse:\n    print("Fără soluții reale")',
      tags: ['discriminant', 'math', 'sqrt'],
    }
  ),
]

// ============================================================
// METODICA 6 — Operatorii `in` și `not`
// → augment lecția `string-uri` (theory + probleme cu in pe text)
// ============================================================

const stringUriTheoryAppend = `

## 🔍 Operatorul \`in\` (apartenență)

Operatorul \`in\` verifică dacă un caracter sau un subșir se află într-un text:

\`\`\`python
"a" in "salut"        # True
"xyz" in "abcdef"     # False
"@" in "user@mail.com" # True
\`\`\`

## 🚫 Operatorul \`not in\`

Inversul lui \`in\` — verifică **absența**:

\`\`\`python
"@" not in "salut"     # True (nu există @)
" " not in "fara_spatii" # True
\`\`\`

## ✏️ Funcția \`len()\` pe string-uri

\`len(text)\` returnează **numărul de caractere** dintr-un text:

\`\`\`python
len("salut")    # 5
len("")         # 0
len("a b c")    # 5 (spațiile contează)
\`\`\`

## 🔡 .isalpha() și .isdigit()

| Metodă | Returnează \`True\` dacă… |
|---|---|
| \`text.isalpha()\` | toate caracterele sunt **litere** |
| \`text.isdigit()\` | toate caracterele sunt **cifre** |

\`\`\`python
"abc".isalpha()    # True
"abc1".isalpha()   # False (1 nu e literă)
"123".isdigit()    # True
"12.5".isdigit()   # False (punctul nu e cifră)
\`\`\`

> 💡 \`isdigit()\` funcționează doar pe **string-uri**, nu pe \`int\`.

## ➕ String-urile sunt „aproape ca liste”

| Operație | Exemplu |
|---|---|
| Acces caracter | \`s[0]\`, \`s[-1]\` (ultimul) |
| Lungime | \`len(s)\` |
| Iterare | \`for c in s:\` sau \`while i < len(s):\` |
| Concatenare | \`s + "x"\` (în loc de \`.append\`) |
| Slicing | \`s[1:4]\` |

⚠️ String-urile sunt **imutabile**: nu poți face \`s[0] = "X"\`. Dar poți **reconstrui** un string nou.
`

const stringUriProblems = [
  code(
    'Verifică litera în cuvânt',
    'Cere un cuvânt și o literă. Afișează „Da” dacă litera apare în cuvânt, altfel „Nu”.',
    'python',
    'cuvant = input("Cuvânt: ")\nlitera = input("Literă: ")\n',
    '```python\ncuvant = input("Cuvânt: ")\nlitera = input("Literă: ")\nif litera in cuvant:\n    print("Da")\nelse:\n    print("Nu")\n```',
    {
      topic: 'string-in',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'cuvant = input("Cuvânt: ")\nlitera = input("Literă: ")\nif litera in cuvant:\n    print("Da")\nelse:\n    print("Nu")',
      tags: ['in', 'string'],
    }
  ),
  code(
    'Email valid (conține @)',
    'Cere o adresă de email. Verifică dacă conține caracterul `@`. Afișează „Valid” sau „Invalid”.',
    'python',
    'email = input("Email: ")\n',
    '```python\nemail = input("Email: ")\nif "@" in email:\n    print("Valid")\nelse:\n    print("Invalid")\n```',
    {
      topic: 'string-in',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'email = input("Email: ")\nif "@" in email:\n    print("Valid")\nelse:\n    print("Invalid")',
      tags: ['in'],
    }
  ),
  code(
    'Username fără spații',
    'Cere un username. Dacă **nu conține spații** și are cel puțin 3 caractere, afișează „Valid”. Altfel „Invalid”.',
    'python',
    'u = input("Username: ")\n',
    '```python\nu = input("Username: ")\nif " " not in u and len(u) >= 3:\n    print("Valid")\nelse:\n    print("Invalid")\n```',
    {
      topic: 'string-in',
      difficulty: 'EASY',
      points: 20,
      hint: 'Combină `" " not in u` cu `len(u) >= 3` folosind `and`.',
      correctAnswer: 'u = input("Username: ")\nif " " not in u and len(u) >= 3:\n    print("Valid")\nelse:\n    print("Invalid")',
      tags: ['not in', 'len'],
    }
  ),
  code(
    'Verifică doar litere',
    'Cere un text și afișează `True` dacă este format **doar din litere**, altfel `False`.',
    'python',
    'x = input("Text: ")\n',
    '```python\nx = input("Text: ")\nprint(x.isalpha())\n```',
    {
      topic: 'isalpha',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'x = input("Text: ")\nprint(x.isalpha())',
      tags: ['isalpha'],
    }
  ),
  code(
    'Numără litere, cifre și semne',
    'Cere o propoziție. Numără separat câte **litere**, câte **cifre** și câte **alte semne** (excluzând spațiul) conține. Afișează rezultatele.',
    'python',
    'x = input("Propoziția: ")\nlitere = 0\ncifre = 0\nsemne = 0\n',
    '```python\nx = input("Propoziția: ")\nlitere = cifre = semne = 0\nfor c in x:\n    if c.isalpha():\n        litere += 1\n    elif c.isdigit():\n        cifre += 1\n    elif c != " ":\n        semne += 1\nprint("Litere:", litere, "Cifre:", cifre, "Semne:", semne)\n```',
    {
      topic: 'isalpha',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Parcurge cu `for c in x:` și verifică cu `.isalpha()`, `.isdigit()` și `c != " "`.',
      correctAnswer: 'x = input("Propoziția: ")\nlitere = cifre = semne = 0\nfor c in x:\n    if c.isalpha():\n        litere += 1\n    elif c.isdigit():\n        cifre += 1\n    elif c != " ":\n        semne += 1\nprint("Litere:", litere, "Cifre:", cifre, "Semne:", semne)',
      tags: ['for', 'isalpha', 'isdigit'],
    }
  ),
  code(
    'Inversează șirul',
    'Cere un text și afișează-l **invers** (ex: `"Salut"` → `"tulaS"`).',
    'python',
    'x = input("Text: ")\n',
    '```python\nx = input("Text: ")\np = ""\ni = len(x) - 1\nwhile i >= 0:\n    p += x[i]\n    i -= 1\nprint(p)\n```\n\n💡 Variantă scurtă: `print(x[::-1])`.',
    {
      topic: 'string',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Pornește de la `i = len(x) - 1` și mergi descrescător adăugând `x[i]` la un șir nou.',
      correctAnswer: 'x = input("Text: ")\nprint(x[::-1])',
      tags: ['reverse', 'while'],
    }
  ),
  code(
    'Prima și ultima literă',
    'Cere un cuvânt și afișează prima și ultima literă (separate prin spațiu).',
    'python',
    'x = input("Cuvânt: ")\n',
    '```python\nx = input("Cuvânt: ")\nprint(x[0], x[-1])\n```',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'x = input("Cuvânt: ")\nprint(x[0], x[-1])',
      tags: ['index'],
    }
  ),
  code(
    'Înlocuiește / cu .',
    'Cere o dată în formatul `ZZ/LL/AAAA` și afișează-o ca `ZZ.LL.AAAA` (înlocuiește `/` cu `.`).',
    'python',
    'x = input("Data: ")\n',
    '```python\nx = input("Data: ")\ny = ""\nfor c in x:\n    if c == "/":\n        y += "."\n    else:\n        y += c\nprint(y)\n```',
    {
      topic: 'string',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'x = input("Data: ")\ny = ""\nfor c in x:\n    if c == "/":\n        y += "."\n    else:\n        y += c\nprint(y)',
      tags: ['for', 'string'],
    }
  ),
]

// ============================================================
// METODICA 10 — Liste de bază
// → augment lecția `liste-introducere`
// ============================================================

const listeIntroducereProblems = [
  code(
    'Pușculița (3 monede)',
    'Cere de 3 ori valoarea unei monede și salvează-le într-o **listă**. Afișează lista la final.\n\n**Exemplu:**\n```\nMonedă: 50\nMonedă: 20\nMonedă: 100\nÎn pușculiță: [50, 20, 100]\n```',
    'python',
    'pusculita = []\n',
    '```python\npusculita = []\ni = 0\nwhile i < 3:\n    valoare = int(input("Monedă: "))\n    pusculita.append(valoare)\n    i += 1\nprint("În pușculiță:", pusculita)\n```',
    {
      topic: 'liste',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `pusculita.append(valoare)` în interiorul unei bucle while.',
      correctAnswer: 'pusculita = []\ni = 0\nwhile i < 3:\n    valoare = int(input("Monedă: "))\n    pusculita.append(valoare)\n    i += 1\nprint("În pușculiță:", pusculita)',
      tags: ['append', 'while'],
    }
  ),
  code(
    'Pușculița (până la 0)',
    'Modifică problema anterioară: utilizatorul introduce monede **până când introduce 0**. La final afișează lista cu toate monedele.',
    'python',
    'pusculita = []\nwhile True:\n    pass\n',
    '```python\npusculita = []\nwhile True:\n    valoare = int(input("Monedă: "))\n    if valoare == 0:\n        break\n    pusculita.append(valoare)\nprint("În pușculiță:", pusculita)\n```',
    {
      topic: 'liste',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'pusculita = []\nwhile True:\n    valoare = int(input("Monedă: "))\n    if valoare == 0:\n        break\n    pusculita.append(valoare)\nprint("În pușculiță:", pusculita)',
      tags: ['append', 'break'],
    }
  ),
  code(
    'Suma monedelor mici / mari',
    'După ce ai citit lista de monede (până la 0), afișează **suma monedelor ≤ 100** și **suma monedelor > 100** separate.',
    'python',
    'pusculita = []\n',
    '```python\npusculita = []\nwhile True:\n    v = int(input("Monedă: "))\n    if v == 0:\n        break\n    pusculita.append(v)\n\nmici = mari = 0\nfor m in pusculita:\n    if m <= 100:\n        mici += m\n    else:\n        mari += m\nprint("Mici:", mici)\nprint("Mari:", mari)\n```',
    {
      topic: 'liste',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'pusculita = []\nwhile True:\n    v = int(input("Monedă: "))\n    if v == 0:\n        break\n    pusculita.append(v)\nmici = mari = 0\nfor m in pusculita:\n    if m <= 100:\n        mici += m\n    else:\n        mari += m\nprint("Mici:", mici)\nprint("Mari:", mari)',
      tags: ['for', 'liste'],
    }
  ),
  code(
    'Listă de la 1 la 30',
    'Generează o listă cu numerele de la 1 la 30 și afișează-o.',
    'python',
    'numere = []\n',
    '```python\nnumere = []\ni = 1\nwhile i <= 30:\n    numere.append(i)\n    i += 1\nprint(numere)\n```',
    {
      topic: 'liste',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'numere = []\ni = 1\nwhile i <= 30:\n    numere.append(i)\n    i += 1\nprint(numere)',
      tags: ['append'],
    }
  ),
  code(
    'Numere pare descrescător',
    'Generează o listă cu numerele pare de la 30 la 2 (descrescător, pasul 2). Afișează lista.\n\n**Așteptat:** `[30, 28, 26, ..., 4, 2]`',
    'python',
    'lista = []\ni = 30\n',
    '```python\nlista = []\ni = 30\nwhile i >= 2:\n    lista.append(i)\n    i -= 2\nprint(lista)\n```',
    {
      topic: 'liste',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'lista = []\ni = 30\nwhile i >= 2:\n    lista.append(i)\n    i -= 2\nprint(lista)',
      tags: ['append', 'pas'],
    }
  ),
  code(
    'Modifică al doilea element',
    'Pornind de la lista `["salut", "carte", "Ion"]`, modifică elementul de la indexul 1 în `"Python"` și afișează lista.',
    'python',
    'lista = ["salut", "carte", "Ion"]\n',
    '```python\nlista = ["salut", "carte", "Ion"]\nlista[1] = "Python"\nprint(lista)\n```',
    {
      topic: 'liste',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'lista = ["salut", "carte", "Ion"]\nlista[1] = "Python"\nprint(lista)',
      tags: ['index'],
    }
  ),
]

// ============================================================
// METODICA 12 — `in` cu liste + sumă/produs random
// → augment lecția `liste-operatii`
// ============================================================

const listeOperatiiProblems = [
  code(
    'Mâncare preferată',
    'Pornind de la lista `["pizza","sushi","burger","salată"]`, cere un fel de mâncare. Afișează „Gustos!” dacă e în listă, altfel „Nu îmi place”.',
    'python',
    'meniu = ["pizza", "sushi", "burger", "salată"]\n',
    '```python\nmeniu = ["pizza", "sushi", "burger", "salată"]\nf = input("Fel: ")\nif f in meniu:\n    print("Gustos!")\nelse:\n    print("Nu îmi place")\n```',
    {
      topic: 'liste',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'meniu = ["pizza", "sushi", "burger", "salată"]\nf = input("Fel: ")\nif f in meniu:\n    print("Gustos!")\nelse:\n    print("Nu îmi place")',
      tags: ['in', 'lista'],
    }
  ),
  code(
    'Suma și produsul listei',
    'Cere un număr `N`, apoi cere `N` numere și salvează-le într-o listă. Afișează **suma** și **produsul** elementelor.',
    'python',
    'n = int(input("Câte numere: "))\nlista = []\n',
    '```python\nn = int(input("Câte numere: "))\nlista = []\nfor i in range(n):\n    lista.append(int(input("Număr: ")))\n\nsuma = 0\nprodus = 1\nfor x in lista:\n    suma += x\n    produs *= x\nprint("Suma:", suma, "Produs:", produs)\n```',
    {
      topic: 'liste',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Inițializează `produs = 1` (NU 0!), altfel produsul rămâne 0.',
      correctAnswer: 'n = int(input("Câte numere: "))\nlista = []\nfor i in range(n):\n    lista.append(int(input("Număr: ")))\nsuma = 0\nprodus = 1\nfor x in lista:\n    suma += x\n    produs *= x\nprint("Suma:", suma, "Produs:", produs)',
      tags: ['for', 'agregare'],
    }
  ),
  code(
    'Acces blacklist',
    'Există o listă neagră: `["Gigel", "Marcel", "Admin"]`. Cere un nume și un răspuns (`da`/`nu`) pentru cardul de acces. Permite accesul DOAR DACĂ numele NU e în blacklist ȘI persoana are card.',
    'python',
    'blacklist = ["Gigel", "Marcel", "Admin"]\nnume = input("Nume: ")\ncard = input("Card? (da/nu): ")\n',
    '```python\nblacklist = ["Gigel", "Marcel", "Admin"]\nnume = input("Nume: ")\ncard = input("Card? (da/nu): ")\nif nume not in blacklist and card == "da":\n    print("Acces permis, bun venit", nume)\nelse:\n    print("Acces refuzat")\n```',
    {
      topic: 'liste',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'blacklist = ["Gigel", "Marcel", "Admin"]\nnume = input("Nume: ")\ncard = input("Card? (da/nu): ")\nif nume not in blacklist and card == "da":\n    print("Acces permis, bun venit", nume)\nelse:\n    print("Acces refuzat")',
      tags: ['not in', 'and'],
    }
  ),
  code(
    'Filtrare spam',
    'Cuvinte interzise: `["spam", "ofertă", "gratis"]`. Cere un mesaj. Afișează „Suspect” dacă conține ORICARE dintre cuvintele interzise, altfel „Curat”.',
    'python',
    'interzise = ["spam", "ofertă", "gratis"]\nmesaj = input("Mesaj: ")\n',
    '```python\ninterzise = ["spam", "ofertă", "gratis"]\nmesaj = input("Mesaj: ")\nsuspect = False\nfor cuv in interzise:\n    if cuv in mesaj:\n        suspect = True\n        break\nif suspect:\n    print("Suspect")\nelse:\n    print("Curat")\n```',
    {
      topic: 'liste',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește un flag `suspect = False` și setează-l pe True dacă găsești vreun cuvânt.',
      correctAnswer: 'interzise = ["spam", "ofertă", "gratis"]\nmesaj = input("Mesaj: ")\nsuspect = False\nfor cuv in interzise:\n    if cuv in mesaj:\n        suspect = True\n        break\nprint("Suspect" if suspect else "Curat")',
      tags: ['for', 'in', 'flag'],
    }
  ),
]

// ============================================================
// METODICA 16 — `for` pe stringuri (în plus față de while)
// → augment lecția `for-vs-while`
// ============================================================

const forVsWhileProblems = [
  code(
    'Litere în coloană (cu for)',
    'Cere un cuvânt și afișează **fiecare literă pe o linie nouă**, folosind `for`.\n\nExemplu: `Elefant` → \nE\nl\ne\nf\na\nn\nt',
    'python',
    'x = input("Cuvânt: ")\n',
    '```python\nx = input("Cuvânt: ")\nfor c in x:\n    print(c)\n```\n\n💡 Mult mai scurt decât `while i < len(x): print(x[i]); i += 1`!',
    {
      topic: 'for',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'x = input("Cuvânt: ")\nfor c in x:\n    print(c)',
      tags: ['for', 'string'],
    }
  ),
  code(
    'Email cu un singur @',
    'Cere o adresă de email și verifică folosind un `for` că ea conține **exact un singur** `@`. Afișează `True` sau `False`.',
    'python',
    'x = input("Email: ")\nq = 0\n',
    '```python\nx = input("Email: ")\nq = 0\nfor c in x:\n    if c == "@":\n        q += 1\nprint(q == 1)\n```',
    {
      topic: 'for',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'x = input("Email: ")\nq = 0\nfor c in x:\n    if c == "@":\n        q += 1\nprint(q == 1)',
      tags: ['for', 'contor'],
    }
  ),
  code(
    'Numără caracterele fără spațiu',
    'Cere o frază și afișează numărul de caractere **excluzând spațiile**.',
    'python',
    'x = input("Fraza: ")\n',
    '```python\nx = input("Fraza: ")\nn = 0\nfor c in x:\n    if c != " ":\n        n += 1\nprint(n)\n```',
    {
      topic: 'for',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'x = input("Fraza: ")\nn = 0\nfor c in x:\n    if c != " ":\n        n += 1\nprint(n)',
      tags: ['for'],
    }
  ),
  code(
    'Înlocuiește primele 2 litere a → j',
    'Cere o propoziție și înlocuiește **doar primele 2 apariții** ale literei `a` cu `j`. Restul `a`-urilor rămân neschimbate.\n\nExemplu: `"mama face mancare"` → `"mjmj face mancare"`',
    'python',
    'x = input("Propoziție: ")\n',
    '```python\nx = input("Propoziție: ")\nz = 0\nrez = ""\nfor c in x:\n    if c == "a" and z < 2:\n        rez += "j"\n        z += 1\n    else:\n        rez += c\nprint(rez)\n```',
    {
      topic: 'for',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește un contor `z` care numără câte `a`-uri ai înlocuit deja.',
      correctAnswer: 'x = input("Propoziție: ")\nz = 0\nrez = ""\nfor c in x:\n    if c == "a" and z < 2:\n        rez += "j"\n        z += 1\n    else:\n        rez += c\nprint(rez)',
      tags: ['for', 'contor'],
    }
  ),
]

// ============================================================
// METODICA 18 — Dicționare + JSON
// → augment lecția `dictionare`
// ============================================================

const dictionareTheoryAppend = `

## 📦 JSON — verișorul dicționarelor

**JSON** (JavaScript Object Notation) este un format universal de schimb de date, folosit între aplicații și servere.

### ✨ Asemănări cu dicționarele Python
\`\`\`json
{
  "nume": "Maria",
  "varsta": 20,
  "activ": true
}
\`\`\`

\`\`\`python
{
  "nume": "Maria",
  "varsta": 20,
  "activ": True
}
\`\`\`

### 🔄 Diferențe minore

| JSON | Python |
|---|---|
| \`true\` | \`True\` |
| \`false\` | \`False\` |
| \`null\` | \`None\` |

### 📂 Citirea unui fișier JSON

\`\`\`python
import json

with open("date.json", "r") as f:
    date = json.load(f)

print(date["nume"])    # accesare ca la dicționar
\`\`\`

### 📝 Scriere într-un fișier JSON

\`\`\`python
import json

date = {"nume": "Andrei", "varsta": 18}
with open("date.json", "w") as f:
    json.dump(date, f)
\`\`\`

> 💡 \`"r"\` = read (citire), \`"w"\` = write (scriere).
`

const dictionareProblems = [
  code(
    'Dicționar persoană',
    'Creează un dicționar cu cheile `nume`, `varsta`, `oras`. Completează-le și afișează numele și orașul (etichetate).',
    'python',
    'persoana = {}\n',
    '```python\npersoana = {\n    "nume": "Ana",\n    "varsta": 25,\n    "oras": "București"\n}\nprint("Nume:", persoana["nume"])\nprint("Oraș:", persoana["oras"])\n```',
    {
      topic: 'dictionare',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'persoana = {\n    "nume": "Ana",\n    "varsta": 25,\n    "oras": "București"\n}\nprint("Nume:", persoana["nume"])\nprint("Oraș:", persoana["oras"])',
      tags: ['dict'],
    }
  ),
  code(
    'Adaugă și modifică',
    'Pornind de la dicționarul persoanei, adaugă cheia `email` cu valoarea `"ana@example.com"` și schimbă `oras` în `"Cluj"`. Afișează dicționarul.',
    'python',
    'persoana = {"nume": "Ana", "varsta": 25, "oras": "București"}\n',
    '```python\npersoana = {"nume": "Ana", "varsta": 25, "oras": "București"}\npersoana["email"] = "ana@example.com"\npersoana["oras"] = "Cluj"\nprint(persoana)\n```',
    {
      topic: 'dictionare',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'persoana = {"nume": "Ana", "varsta": 25, "oras": "București"}\npersoana["email"] = "ana@example.com"\npersoana["oras"] = "Cluj"\nprint(persoana)',
      tags: ['dict'],
    }
  ),
  code(
    'Șterge dintr-un dicționar',
    'Pornind de la `birou = {"pixuri": 10, "caiete": 5, "radiera": 2, "creioane": 7}`, șterge cheia `radiera` și afișează dicționarul.',
    'python',
    'birou = {"pixuri": 10, "caiete": 5, "radiera": 2, "creioane": 7}\n',
    '```python\nbirou = {"pixuri": 10, "caiete": 5, "radiera": 2, "creioane": 7}\ndel birou["radiera"]\nprint(birou)\n```',
    {
      topic: 'dictionare',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'birou = {"pixuri": 10, "caiete": 5, "radiera": 2, "creioane": 7}\ndel birou["radiera"]\nprint(birou)',
      tags: ['del', 'dict'],
    }
  ),
  code(
    'Caută nota la materie',
    'Ai un dicționar `note = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}`. Cere o materie și afișează nota dacă există, altfel „Materia nu există”.',
    'python',
    'note = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}\n',
    '```python\nnote = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}\nm = input("Materia: ").lower()\nif m in note:\n    print(f"Nota la {m} este {note[m]}")\nelse:\n    print("Materia nu există")\n```',
    {
      topic: 'dictionare',
      difficulty: 'MEDIUM',
      points: 20,
      correctAnswer: 'note = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}\nm = input("Materia: ").lower()\nif m in note:\n    print(f"Nota la {m} este {note[m]}")\nelse:\n    print("Materia nu există")',
      tags: ['dict', 'in'],
    }
  ),
  code(
    'Media notelor (dict)',
    'Pornind de la dicționarul `note`, calculează **media** și afișeaz-o cu 2 zecimale.',
    'python',
    'note = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}\n',
    '```python\nnote = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}\nsuma = 0\nfor m in note:\n    suma += note[m]\nmedia = suma / len(note)\nprint(f"{media:.2f}")\n```',
    {
      topic: 'dictionare',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Iterează cu `for m in note:` și adună `note[m]`.',
      correctAnswer: 'note = {"matematica": 9, "romana": 8, "biologie": 7, "istorie": 10}\nsuma = 0\nfor m in note:\n    suma += note[m]\nmedia = suma / len(note)\nprint(f"{media:.2f}")',
      tags: ['for', 'dict', 'medie'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Random + Liste
// (după `liste-operatii`)
// ============================================================

const listeRandomTheory = `# 🎲 Biblioteca \`random\` și listele

## 📚 Ce este o bibliotecă?

O **bibliotecă** este un set de funcții gata făcute pe care le putem folosi în programele noastre, **fără să le scriem de la zero**.

Python vine cu sute de biblioteci utile. Dacă toate ar fi încărcate automat la pornire, programul s-ar deschide foarte greu — de aceea le **importăm** doar pe cele de care avem nevoie.

## 🎲 Biblioteca \`random\`

Pentru a genera **numere aleatorii**.

\`\`\`python
import random

x = random.randint(1, 100)   # număr întreg între 1 și 100 (inclusiv)
y = random.random()          # număr zecimal între 0 și 1
z = random.choice([1, 2, 3]) # alege unul aleator din listă
\`\`\`

## 🎁 Aplicație: cadouri aleatorii pentru copii

\`\`\`python
import random
cadouri = []
for i in range(10):
    cadouri.append(random.randint(2, 10))
print(cadouri)   # ex: [9, 5, 3, 2, 8, 10, 4, 2, 8, 6]
\`\`\`

## 🔁 Trucuri utile

### Numere unice (fără duplicate)
\`\`\`python
unice = []
while len(unice) < 5:
    n = random.randint(1, 30)
    if n not in unice:
        unice.append(n)
\`\`\`

### Sortare descrescătoare
\`\`\`python
sorted(lista, reverse=True)   # listă sortată descrescător
\`\`\`
`

const listeRandomProblems = [
  code(
    '3 numere aleatorii',
    'Generează 3 numere aleatorii între 1 și 100 și afișează-le pe o singură linie, separate prin spațiu.',
    'python',
    'import random\n',
    '```python\nimport random\na = random.randint(1, 100)\nb = random.randint(1, 100)\nc = random.randint(1, 100)\nprint(a, b, c)\n```',
    {
      topic: 'random',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'import random\na = random.randint(1, 100)\nb = random.randint(1, 100)\nc = random.randint(1, 100)\nprint(a, b, c)',
      tags: ['random'],
    }
  ),
  code(
    'Lista cadourilor lui Moș',
    'Generează o listă cu 10 cadouri, fiecare un număr aleator între 2 și 10. Afișează lista.',
    'python',
    'import random\ncadouri = []\n',
    '```python\nimport random\ncadouri = []\nfor i in range(10):\n    cadouri.append(random.randint(2, 10))\nprint(cadouri)\n```',
    {
      topic: 'random',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'import random\ncadouri = []\nfor i in range(10):\n    cadouri.append(random.randint(2, 10))\nprint(cadouri)',
      tags: ['random', 'append'],
    }
  ),
  code(
    'Loto — 5 butoaie unice',
    'Extrage 5 numere **unice** între 1 și 30 și afișează-le într-o listă.\n\n⚠️ Nu trebuie să existe duplicate.',
    'python',
    'import random\nbutoaie = []\n',
    '```python\nimport random\nbutoaie = []\nwhile len(butoaie) < 5:\n    n = random.randint(1, 30)\n    if n not in butoaie:\n        butoaie.append(n)\nprint(butoaie)\n```',
    {
      topic: 'random',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește `while len(...) < 5` și verifică `if n not in butoaie`.',
      correctAnswer: 'import random\nbutoaie = []\nwhile len(butoaie) < 5:\n    n = random.randint(1, 30)\n    if n not in butoaie:\n        butoaie.append(n)\nprint(butoaie)',
      tags: ['random', 'unice'],
    }
  ),
  code(
    'Butoaiele rămase',
    'După ce ai extras 5 butoaie unice (1-30), afișează și **lista butoaielor rămase** în sac (cele 25 de numere care nu au fost extrase).',
    'python',
    'import random\nbutoaie = []\n',
    '```python\nimport random\nbutoaie = []\nwhile len(butoaie) < 5:\n    n = random.randint(1, 30)\n    if n not in butoaie:\n        butoaie.append(n)\nprint(butoaie)\nramase = []\nfor i in range(1, 31):\n    if i not in butoaie:\n        ramase.append(i)\nprint(ramase)\n```',
    {
      topic: 'random',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'import random\nbutoaie = []\nwhile len(butoaie) < 5:\n    n = random.randint(1, 30)\n    if n not in butoaie:\n        butoaie.append(n)\nprint(butoaie)\nramase = []\nfor i in range(1, 31):\n    if i not in butoaie:\n        ramase.append(i)\nprint(ramase)',
      tags: ['random', 'not in'],
    }
  ),
  code(
    'Frunze: Ana vs Ion',
    'Ana și Ion strâng frunze. În fiecare „zi” introduci câte au strâns ambii. Programul se oprește când AMBII introduc 0. Afișează totalurile și câștigătorul (sau „Egalitate”).',
    'python',
    'frunze_ion = 0\nfrunze_ana = 0\n',
    '```python\nfrunze_ion = 0\nfrunze_ana = 0\nzi = 1\nwhile True:\n    print("Ziua", zi)\n    ion = int(input("Ion: "))\n    ana = int(input("Ana: "))\n    if ion == 0 and ana == 0:\n        break\n    frunze_ion += ion\n    frunze_ana += ana\n    zi += 1\nprint("Ion:", frunze_ion, "Ana:", frunze_ana)\nif frunze_ion > frunze_ana:\n    print("Câștigător: Ion")\nelif frunze_ana > frunze_ion:\n    print("Câștigător: Ana")\nelse:\n    print("Egalitate")\n```',
    {
      topic: 'random',
      difficulty: 'MEDIUM',
      points: 30,
      correctAnswer: 'frunze_ion = 0\nfrunze_ana = 0\nzi = 1\nwhile True:\n    print("Ziua", zi)\n    ion = int(input("Ion: "))\n    ana = int(input("Ana: "))\n    if ion == 0 and ana == 0:\n        break\n    frunze_ion += ion\n    frunze_ana += ana\n    zi += 1\nprint("Ion:", frunze_ion, "Ana:", frunze_ana)\nif frunze_ion > frunze_ana:\n    print("Câștigător: Ion")\nelif frunze_ana > frunze_ion:\n    print("Câștigător: Ana")\nelse:\n    print("Egalitate")',
      tags: ['while', 'acumulare'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Validare text — isalpha / isdigit avansat
// (după `string-uri`)
// ============================================================

const textValidareTheory = `# 🔡 Validare text avansată cu \`isalpha()\` și \`isdigit()\`

În lecția anterioară am văzut metodele de bază. Aici învățăm cum să le folosim pentru a **filtra** și **transforma** șiruri.

## 🎯 Filtrare cu \`for\` + condiție

\`\`\`python
text = "Am 5 mere"
rezultat = ""
for c in text:
    if not c.isdigit():   # păstrăm tot ce NU e cifră
        rezultat += c
print(rezultat)   # "Am  mere"
\`\`\`

## 🔄 Transformare în loc de eliminare

\`\`\`python
text = "De 7 ori"
rez = ""
for c in text:
    if c.isdigit():
        rez += str(int(c) + 1)   # mărește cifra cu 1
    else:
        rez += c
print(rez)   # "De 8 ori"
\`\`\`

## ✅ Validări tipice

| Validare | Cod |
|---|---|
| Doar litere | \`text.isalpha()\` |
| Doar cifre | \`text.isdigit()\` |
| Începe cu literă | \`text[0].isalpha()\` |
| Lungime ≥ 3 | \`len(text) >= 3\` |
| Fără spațiu la capete | \`text[0] != " " and text[-1] != " "\` |
`

const textValidareProblems = [
  code(
    'Verifică doar litere',
    'Cere un text și afișează `True` dacă e format **doar din litere**, altfel `False`.',
    'python',
    'x = input("Text: ")\n',
    '```python\nx = input("Text: ")\nprint(x.isalpha())\n```',
    {
      topic: 'isalpha',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'x = input("Text: ")\nprint(x.isalpha())',
      tags: ['isalpha'],
    }
  ),
  code(
    'Șterge cifrele',
    'Cere o frază și afișează aceeași frază **fără cifre**.\n\nExemplu: `"Am 5 mere"` → `"Am  mere"`',
    'python',
    'x = input("Frază: ")\n',
    '```python\nx = input("Frază: ")\nrez = ""\nfor c in x:\n    if not c.isdigit():\n        rez += c\nprint(rez)\n```',
    {
      topic: 'isdigit',
      difficulty: 'EASY',
      points: 15,
      correctAnswer: 'x = input("Frază: ")\nrez = ""\nfor c in x:\n    if not c.isdigit():\n        rez += c\nprint(rez)',
      tags: ['isdigit', 'for'],
    }
  ),
  code(
    'Mărește cifrele cu 1',
    'Cere o frază. Înlocuiește **fiecare cifră** cu cifra + 1 (rămâne tot ce nu e cifră).\n\nExemplu: `"De 7 ori, de 1 ori"` → `"De 8 ori, de 2 ori"`',
    'python',
    'x = input("Frază: ")\n',
    '```python\nx = input("Frază: ")\nrez = ""\nfor c in x:\n    if c.isdigit():\n        rez += str(int(c) + 1)\n    else:\n        rez += c\nprint(rez)\n```',
    {
      topic: 'isdigit',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Convertește caracterul cu `int(c)`, adună 1, transformă înapoi cu `str(...)`.',
      correctAnswer: 'x = input("Frază: ")\nrez = ""\nfor c in x:\n    if c.isdigit():\n        rez += str(int(c) + 1)\n    else:\n        rez += c\nprint(rez)',
      tags: ['isdigit', 'transformare'],
    }
  ),
  code(
    'Username valid',
    'Un username e valid dacă: lungimea ≥ 3 caractere, începe cu literă, NU începe sau se termină cu spațiu. Cere unul și afișează `True`/`False`.',
    'python',
    'u = input("Username: ")\n',
    '```python\nu = input("Username: ")\nif len(u) >= 3 and u[0].isalpha() and u[0] != " " and u[-1] != " ":\n    print(True)\nelse:\n    print(False)\n```',
    {
      topic: 'isalpha',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Combină 4 condiții cu `and`.',
      correctAnswer: 'u = input("Username: ")\nif len(u) >= 3 and u[0].isalpha() and u[0] != " " and u[-1] != " ":\n    print(True)\nelse:\n    print(False)',
      tags: ['and', 'isalpha', 'len'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Pizzeria — exersare if/elif
// (după `text-validare`)
// ============================================================

const pizzeriaTheory = `# 🍕 Exersare: Sistemul pizzeriei

Pune cap la cap tot ce ai învățat: \`if\`/\`elif\`, \`while\`, \`liste\`, \`in\`. Vei construi un mic „terminal de comenzi” pentru o pizzerie.

## 📋 Codurile produselor

| Cod | Produs |
|---|---|
| A | Pizza 4 anotimpuri |
| B | Pizza Pepperoni |
| C | Pizza cu legume și ciuperci |
| D | Pizza Cheeseburger |
| E | Cola |
| F | Morse |
| G | Cacao |
| H | Cartofi |

## 💡 Strategie

- Citește un cod (sau un șir de coduri).
- Pentru fiecare cod, folosește \`if/elif\` ca să afișezi numele produsului.
- Pentru cod necunoscut: \`else\` cu mesaj de eroare.
- Pentru produse fără duplicate: ține o listă auxiliară și folosește \`in\`/\`not in\`.
`

const pizzeriaProblems = [
  code(
    'Comandă 1 produs',
    'Cere un **cod** (literă A-H). Afișează numele produsului corespunzător. Pentru cod necunoscut: „Nu este în meniu”.',
    'python',
    'cod = input("Codul produsului: ")\n',
    '```python\ncod = input("Codul produsului: ")\nif cod == "A":\n    print("Pizza 4 anotimpuri")\nelif cod == "B":\n    print("Pizza Pepperoni")\nelif cod == "C":\n    print("Pizza cu legume și ciuperci")\nelif cod == "D":\n    print("Pizza Cheeseburger")\nelif cod == "E":\n    print("Cola")\nelif cod == "F":\n    print("Morse")\nelif cod == "G":\n    print("Cacao")\nelif cod == "H":\n    print("Cartofi")\nelse:\n    print("Nu este în meniu")\n```',
    {
      topic: 'pizzerie',
      difficulty: 'EASY',
      points: 20,
      correctAnswer: 'cod = input("Codul produsului: ")\nif cod == "A":\n    print("Pizza 4 anotimpuri")\nelif cod == "B":\n    print("Pizza Pepperoni")\nelif cod == "C":\n    print("Pizza cu legume și ciuperci")\nelif cod == "D":\n    print("Pizza Cheeseburger")\nelif cod == "E":\n    print("Cola")\nelif cod == "F":\n    print("Morse")\nelif cod == "G":\n    print("Cacao")\nelif cod == "H":\n    print("Cartofi")\nelse:\n    print("Nu este în meniu")',
      tags: ['elif'],
    }
  ),
  code(
    'Comandă mai multe produse',
    'Cere o comandă (un șir de litere, ex: `"BEGF"`). Afișează numărul de produse, apoi pentru fiecare literă afișează `Produs <i>: <nume>` pe linii separate.',
    'python',
    'comanda = input("Introdu comanda: ")\n',
    '```python\ncomanda = input("Introdu comanda: ")\nprint("Produse comandate:", len(comanda))\ni = 0\nfor cod in comanda:\n    if cod == "A": nume = "Pizza 4 anotimpuri"\n    elif cod == "B": nume = "Pizza Pepperoni"\n    elif cod == "C": nume = "Pizza cu legume și ciuperci"\n    elif cod == "D": nume = "Pizza Cheeseburger"\n    elif cod == "E": nume = "Cola"\n    elif cod == "F": nume = "Morse"\n    elif cod == "G": nume = "Cacao"\n    elif cod == "H": nume = "Cartofi"\n    else: nume = "?"\n    print(f"Produs {i}: {nume}")\n    i += 1\n```',
    {
      topic: 'pizzerie',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Iterează cu `for cod in comanda:` și folosește un contor `i`.',
      correctAnswer: 'comanda = input("Introdu comanda: ")\nprint("Produse comandate:", len(comanda))\ni = 0\nfor cod in comanda:\n    if cod == "A": nume = "Pizza 4 anotimpuri"\n    elif cod == "B": nume = "Pizza Pepperoni"\n    elif cod == "C": nume = "Pizza cu legume și ciuperci"\n    elif cod == "D": nume = "Pizza Cheeseburger"\n    elif cod == "E": nume = "Cola"\n    elif cod == "F": nume = "Morse"\n    elif cod == "G": nume = "Cacao"\n    elif cod == "H": nume = "Cartofi"\n    else: nume = "?"\n    print(f"Produs {i}: {nume}")\n    i += 1',
      tags: ['for', 'elif'],
    }
  ),
  code(
    'Comandă fără duplicate',
    'Cere o comandă, dar ignoră produsele care apar **de mai multe ori** (păstrează doar prima apariție a fiecărui cod).\n\nExemplu: `"BEBEE"` → afișează doar `B` și `E`.',
    'python',
    'comanda = input("Introdu comanda: ")\n',
    '```python\ncomanda = input("Introdu comanda: ")\nunice = []\nfor cod in comanda:\n    if cod not in unice:\n        unice.append(cod)\nprint("Produse comandate:", len(unice))\nfor i, cod in enumerate(unice):\n    print(f"Produs {i}: {cod}")\n```',
    {
      topic: 'pizzerie',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește o listă `unice` și `if cod not in unice: unice.append(cod)`.',
      correctAnswer: 'comanda = input("Introdu comanda: ")\nunice = []\nfor cod in comanda:\n    if cod not in unice:\n        unice.append(cod)\nprint("Produse comandate:", len(unice))\nfor i, cod in enumerate(unice):\n    print(f"Produs {i}: {cod}")',
      tags: ['not in', 'append'],
    }
  ),
]

// ============================================================
// LECȚIE NOUĂ: Tupluri (PY ONLY — JS nu are tupluri native)
// (după `dictionare`)
// ============================================================

const tupluriTheory = `# 📐 Tuplurile în Python

## Ce este un tuplu?

Un **tuplu** este o colecție de valori, **exact ca o listă**, dar cu câteva diferențe importante.

| Listă | Tuplu |
|---|---|
| \`[1, 2, 3]\` | \`(1, 2, 3)\` |
| paranteze pătrate | paranteze rotunde |
| **mutabil** (poți modifica) | **imutabil** (NU poți modifica) |
| \`.append\`, \`del\`, \`x[0] = ...\` | NU se pot face |
| mai lent | **mai rapid** la citire |

## ✏️ Crearea unui tuplu

\`\`\`python
gol = ()
zile = ("luni", "marți", "miercuri")
o_singura_valoare = (5,)   # ⚠️ virgula e obligatorie!
\`\`\`

## 🔍 Acces (la fel ca listele)

\`\`\`python
zile = ("luni", "marți", "miercuri")
print(zile[0])    # "luni"
print(zile[-1])   # "miercuri"
print(len(zile))  # 3
\`\`\`

## 🚫 Ce NU poți face

\`\`\`python
zile[0] = "duminică"   # ❌ TypeError: 'tuple' object does not support item assignment
zile.append("joi")     # ❌ AttributeError
del zile[0]            # ❌ TypeError
\`\`\`

## ✅ Ce poți face: concatenare (creează tuplu nou)

\`\`\`python
a = (1, 2)
b = (3, 4)
c = a + b   # (1, 2, 3, 4)
\`\`\`

## 🎯 Când folosim tupluri?

Pentru date care **NU se schimbă**:
- coordonate \`(x, y)\`
- date de naștere \`(zi, lună, an)\`
- numele lunilor / zilelor
- valori de configurare
`

const tupluriProblems = [
  code(
    'Prima și ultima valoare egale?',
    'Pornind de la `tuplu = (1, 2, 3, 4, 1)`, verifică dacă **prima** și **ultima** valoare sunt identice. Afișează `True` sau `False`.',
    'python',
    'tuplu = (1, 2, 3, 4, 1)\n',
    '```python\ntuplu = (1, 2, 3, 4, 1)\nprint(tuplu[0] == tuplu[-1])\n```',
    {
      topic: 'tupluri',
      difficulty: 'EASY',
      points: 10,
      correctAnswer: 'tuplu = (1, 2, 3, 4, 1)\nprint(tuplu[0] == tuplu[-1])',
      tags: ['tuple', 'index'],
    }
  ),
  code(
    'Numără tipurile de date',
    'Pornind de la `tuplu = (1, 2, True, 3, 4, False, 1.15, 0.23, "Salut", "Buna")`, numără separat câte sunt: cuvinte (`str`), numere întregi (`int`), zecimale (`float`), valori `True`/`False` (`bool`). Afișează rezultatul.',
    'python',
    'tuplu = (1, 2, True, 3, 4, False, 1.15, 0.23, "Salut", "Buna")\n',
    '```python\ntuplu = (1, 2, True, 3, 4, False, 1.15, 0.23, "Salut", "Buna")\ntext = numar = zec = adevar = 0\nfor i in tuplu:\n    if type(i) == bool:   # bool ÎNAINTE de int!\n        adevar += 1\n    elif type(i) == int:\n        numar += 1\n    elif type(i) == float:\n        zec += 1\n    elif type(i) == str:\n        text += 1\nprint(f"{text} cuvinte, {numar} numere, {zec} zecimale, {adevar} bool")\n```',
    {
      topic: 'tupluri',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Verifică `bool` ÎNAINTE de `int` — în Python `True` e și `int`!',
      correctAnswer: 'tuplu = (1, 2, True, 3, 4, False, 1.15, 0.23, "Salut", "Buna")\ntext = numar = zec = adevar = 0\nfor i in tuplu:\n    if type(i) == bool:\n        adevar += 1\n    elif type(i) == int:\n        numar += 1\n    elif type(i) == float:\n        zec += 1\n    elif type(i) == str:\n        text += 1\nprint(f"{text} cuvinte, {numar} numere, {zec} zecimale, {adevar} bool")',
      tags: ['type', 'tuple'],
    }
  ),
  code(
    'Tuplu cu numere random',
    'Generează un tuplu cu **10 numere** aleatorii între 1 și 100. (Reține: nu poți face `.append`, dar poți concatena cu `+`.)',
    'python',
    'import random\ntuplu = ()\n',
    '```python\nimport random\ntuplu = ()\nfor i in range(10):\n    tuplu += (random.randint(1, 100),)   # virgulă obligatorie!\nprint(tuplu)\n```',
    {
      topic: 'tupluri',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește `tuplu += (n,)` — atenție la virgulă!',
      correctAnswer: 'import random\ntuplu = ()\nfor i in range(10):\n    tuplu += (random.randint(1, 100),)\nprint(tuplu)',
      tags: ['tuple', 'random'],
    }
  ),
  code(
    'Media tuplului',
    'Generează un tuplu cu 10 numere între 1 și 100. Calculează și afișează **media** lor.',
    'python',
    'import random\ntuplu = ()\n',
    '```python\nimport random\ntuplu = ()\nfor i in range(10):\n    tuplu += (random.randint(1, 100),)\nsuma = 0\nfor x in tuplu:\n    suma += x\nprint("Tuplu:", tuplu)\nprint("Media:", suma / len(tuplu))\n```',
    {
      topic: 'tupluri',
      difficulty: 'MEDIUM',
      points: 25,
      correctAnswer: 'import random\ntuplu = ()\nfor i in range(10):\n    tuplu += (random.randint(1, 100),)\nsuma = 0\nfor x in tuplu:\n    suma += x\nprint("Tuplu:", tuplu)\nprint("Media:", suma / len(tuplu))',
      tags: ['tuple', 'medie'],
    }
  ),
  code(
    'Min și max din tuplu',
    'Generează un tuplu cu 10 numere între 1 și 100. Afișează **minimul** și **maximul** (fără să folosești `min()`/`max()` direct — implementează cu un for).',
    'python',
    'import random\ntuplu = ()\n',
    '```python\nimport random\ntuplu = ()\nfor i in range(10):\n    tuplu += (random.randint(1, 100),)\nminim = tuplu[0]\nmaxim = tuplu[0]\nfor x in tuplu:\n    if x < minim:\n        minim = x\n    if x > maxim:\n        maxim = x\nprint("Tuplu:", tuplu)\nprint("Min:", minim, "Max:", maxim)\n```',
    {
      topic: 'tupluri',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Inițializează `minim` și `maxim` cu `tuplu[0]`, apoi compară cu fiecare element.',
      correctAnswer: 'import random\ntuplu = ()\nfor i in range(10):\n    tuplu += (random.randint(1, 100),)\nminim = tuplu[0]\nmaxim = tuplu[0]\nfor x in tuplu:\n    if x < minim:\n        minim = x\n    if x > maxim:\n        maxim = x\nprint("Tuplu:", tuplu)\nprint("Min:", minim, "Max:", maxim)',
      tags: ['tuple', 'min', 'max'],
    }
  ),
  code(
    'Reconstruiește fără primul element',
    'Pornind de la `tuplu = (24, 31, 80, 56, 51)`, creează un **tuplu nou** care conține toate elementele EXCEPT primul.\n\n💡 Atenție: la tupluri NU putem `del tuplu[0]`. Trebuie să **reconstruim**.',
    'python',
    'tuplu = (24, 31, 80, 56, 51)\nnou = ()\n',
    '```python\ntuplu = (24, 31, 80, 56, 51)\nnou = ()\nfor i in range(1, len(tuplu)):\n    nou += (tuplu[i],)\nprint("Vechi:", tuplu)\nprint("Nou:", nou)\n```\n\n💡 Variantă scurtă cu slicing: `nou = tuplu[1:]`',
    {
      topic: 'tupluri',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Iterează de la indexul 1 până la `len(tuplu)` și concatenează.',
      correctAnswer: 'tuplu = (24, 31, 80, 56, 51)\nnou = tuplu[1:]\nprint("Vechi:", tuplu)\nprint("Nou:", nou)',
      tags: ['tuple', 'slice'],
    }
  ),
]

// ============================================================
// EXPORT
// ============================================================

export const pythonMetodicaExtraPatch = {
  appendTheory: {
    'input-conversii': inputConversiiTheoryAppend,
    'if-else-elif': ifElseTheoryAppend,
    'operatori': operatoriTheoryAppend,
    'string-uri': stringUriTheoryAppend,
    'dictionare': dictionareTheoryAppend,
  },
  appendProblems: {
    'input-conversii': inputConversiiProblems,
    'if-else-elif': ifElseProblems,
    'operatori': operatoriProblems,
    'probleme-conditii': problemeConditiiProblems,
    'string-uri': stringUriProblems,
    'liste-introducere': listeIntroducereProblems,
    'liste-operatii': listeOperatiiProblems,
    'for-vs-while': forVsWhileProblems,
    'dictionare': dictionareProblems,
  },
  newLessons: [
    {
      afterSlug: 'liste-operatii',
      slug: 'liste-random',
      title: '11b. Liste + biblioteca random',
      isFree: false,
      theory: listeRandomTheory,
      problems: listeRandomProblems,
    },
    {
      afterSlug: 'string-uri',
      slug: 'text-validare',
      title: '15b. Validare text — isalpha / isdigit',
      isFree: false,
      theory: textValidareTheory,
      problems: textValidareProblems,
    },
    {
      afterSlug: 'text-validare',
      slug: 'pizzeria-exersare',
      title: '15c. Exersare — Sistemul pizzeriei',
      isFree: false,
      theory: pizzeriaTheory,
      problems: pizzeriaProblems,
    },
    {
      afterSlug: 'dictionare',
      slug: 'tupluri',
      title: '17. Tupluri (Python)',
      isFree: false,
      theory: tupluriTheory,
      problems: tupluriProblems,
    },
  ],
}
