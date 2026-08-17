// Patch pentru modulul Python — completări din metodicile profesorului
// Aplicat de index.mjs peste pythonModule (din python.mjs).
//
// Structura:
//   appendTheory: { '<lessonSlug>': '...markdown la finalul teoriei...' }
//   appendProblems: { '<lessonSlug>': [problem1, problem2, ...] }
//   newLessons: [ { afterSlug, slug, title, theory, isFree?, problems } ]

import { mc, sa, io, code } from './helpers.mjs'

// ============================================================
// METODICA 7 — While loop (augment lecția existentă `while-loop`)
// ============================================================

const whileLoopTheoryAppend = `

## ✏️ Identarea (indentarea) în Python

Python **nu folosește acolade** \`{}\` ca alte limbaje. În schimb, folosește **indentarea** (spațiile de la începutul liniei) pentru a marca blocurile de cod.

\`\`\`python
while i <= 5:
    print(i)      # ← 4 spații = aparține buclei
    i = i + 1     # ← 4 spații = aparține buclei
print("Gata")     # ← fără spații = afară din buclă
\`\`\`

🔹 **Regula:** toate liniile cu **același număr de spații** la început fac parte din **același bloc**.
🔹 Standardul Python recomandă **4 spații** pe nivel.
🔹 Dacă greșești indentarea → \`IndentationError\`.

## ➕ Incrementare

**Incrementare** = a mări o variabilă cu o valoare. Fără ea, bucla \`while\` rămâne infinită!

\`\`\`python
i = 0
i = i + 1   # incrementare clasică (i devine 1)
i += 1      # scurtătură — exact același efect (i devine 2)
i += 5      # adună 5 (i devine 7)
\`\`\`

## ➖ Decrementare

**Decrementare** = a micșora o variabilă cu o valoare.

\`\`\`python
i = 10
i = i - 1   # i devine 9
i -= 1      # scurtătură (i devine 8)
i -= 3      # scade 3 (i devine 5)
\`\`\`

## 🔁 Alți operatori de atribuire combinată

| Operator | Ce face | Exemplu |
|---|---|---|
| \`+=\` | adună | \`a += 5\` ⇔ \`a = a + 5\` |
| \`-=\` | scade | \`a -= 5\` ⇔ \`a = a - 5\` |
| \`*=\` | înmulțește | \`a *= 2\` ⇔ \`a = a * 2\` |
| \`/=\` | împarte | \`a /= 2\` ⇔ \`a = a / 2\` |
| \`//=\` | împărțire întreagă | \`a //= 2\` ⇔ \`a = a // 2\` |
| \`%=\` | modulo | \`a %= 2\` ⇔ \`a = a % 2\` |

## 📜 Trace pas cu pas — \`while i <= 5\`

| Iterație | Verifică \`i <= 5\` | print(i) | După \`i += 1\` |
|---|---|---|---|
| 1 | \`1 <= 5\` ✅ | 1 | i = 2 |
| 2 | \`2 <= 5\` ✅ | 2 | i = 3 |
| 3 | \`3 <= 5\` ✅ | 3 | i = 4 |
| 4 | \`4 <= 5\` ✅ | 4 | i = 5 |
| 5 | \`5 <= 5\` ✅ | 5 | i = 6 |
| 6 | \`6 <= 5\` ❌ | — | STOP |
`

const whileLoopProblems = [
  code(
    'Numărare până la N',
    'Citește un număr **N** și afișează toate numerele de la 1 până la N (fiecare pe o linie).\n\n**Exemplu:**\n```\nIntrodu un număr: 5\n1\n2\n3\n4\n5\n```',
    'python',
    'N = int(input("Introdu un număr: "))\n# scrie bucla while aici\n',
    'Folosim o variabilă contor `x = 1` și o creștem cât timp `x <= N`.\n\n```python\nN = int(input("Introdu un număr: "))\nx = 1\nwhile x <= N:\n    print(x)\n    x += 1\n```\n\nNu uita `x += 1` — altfel bucla devine infinită!',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Inițializează `x = 1`, apoi `while x <= N:` și nu uita să incrementezi pe x.',
      correctAnswer: 'N = int(input("Introdu un număr: "))\nx = 1\nwhile x <= N:\n    print(x)\n    x += 1',
      tags: ['while', 'incrementare'],
    }
  ),
  code(
    'Numărare descrescătoare de la N la 1',
    'Citește un număr **N** și afișează toate numerele de la N până la 1 (descrescător).\n\n**Exemplu:**\n```\nIntrodu un număr: 5\n5\n4\n3\n2\n1\n```',
    'python',
    'N = int(input("Introdu un număr: "))\n# folosește decrementarea\n',
    'Folosim **decrementare** cu `N -= 1` cât timp `N >= 1`.\n\n```python\nN = int(input("Introdu un număr: "))\nwhile N >= 1:\n    print(N)\n    N -= 1\n```\n\n⚠️ Atenție la condiție: `N >= 1` (nu `N > 0` greșit, deși funcționează la fel pentru întregi pozitivi).',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Folosește `N -= 1` în loc de `N += 1` și verifică `N >= 1`.',
      correctAnswer: 'N = int(input("Introdu un număr: "))\nwhile N >= 1:\n    print(N)\n    N -= 1',
      tags: ['while', 'decrementare'],
    }
  ),
  code(
    'Suma numerelor pozitive',
    'Cere utilizatorului să introducă numere. Când introduce un număr **negativ**, programul se oprește și afișează suma tuturor numerelor introduse (exclusiv cel negativ).\n\n**Exemplu:**\n```\nIntrodu un număr: 4\nIntrodu un număr: 7\nIntrodu un număr: 2\nIntrodu un număr: -1\nSuma: 13\n```',
    'python',
    'suma = 0\n# citește numere până când utilizatorul tastează unul negativ\n',
    '```python\nsuma = 0\nnumar = int(input("Introdu un număr: "))\nwhile numar >= 0:\n    suma += numar\n    numar = int(input("Introdu un număr: "))\nprint("Suma:", suma)\n```\n\nObservă: citim un număr **înainte** de buclă, apoi în buclă citim următorul. Când e negativ, condiția `numar >= 0` devine falsă și ieșim.',
    {
      topic: 'while',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Citește primul număr înainte de while. În buclă: adună la sumă, apoi citește următorul.',
      correctAnswer: 'suma = 0\nnumar = int(input("Introdu un număr: "))\nwhile numar >= 0:\n    suma += numar\n    numar = int(input("Introdu un număr: "))\nprint("Suma:", suma)',
      tags: ['while', 'suma'],
    }
  ),
  code(
    'Numere pare până la N',
    'Citește un număr **N** și afișează doar numerele **pare** de la 1 la N.\n\n**Exemplu:**\n```\nIntrodu un număr: 10\n2\n4\n6\n8\n10\n```',
    'python',
    'N = int(input("Introdu un număr: "))\nx = 1\n# pare = divizibile cu 2\n',
    '```python\nN = int(input("Introdu un număr: "))\nx = 1\nwhile x <= N:\n    if x % 2 == 0:\n        print(x)\n    x += 1\n```\n\nUn număr e **par** dacă restul împărțirii la 2 este 0 (`x % 2 == 0`).',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Combină `while` cu `if x % 2 == 0` pentru a afișa doar numerele pare.',
      correctAnswer: 'N = int(input("Introdu un număr: "))\nx = 1\nwhile x <= N:\n    if x % 2 == 0:\n        print(x)\n    x += 1',
      tags: ['while', 'pare', 'modulo'],
    }
  ),
  code(
    'Validare număr în interval [1, 15]',
    'Cere utilizatorului să introducă numere. Pentru fiecare:\n- dacă e între **1** și **15**, afișează „Numărul este bun.”\n- altfel, afișează „Intrare nevalidă.”\n\nProgramul se oprește când utilizatorul introduce **0**, atunci afișează „Programul s-a finisat!”.\n\n**Exemplu:**\n```\nIntroduceți un număr: 100500\nIntrare nevalidă.\nIntroduceți un număr: 13\nNumărul este bun.\nIntroduceți un număr: 0\nProgramul s-a finisat!\n```',
    'python',
    'numar = int(input("Introduceți un număr: "))\nwhile numar != 0:\n    # verifică intervalul aici\n    pass\n',
    '```python\nnumar = int(input("Introduceți un număr: "))\nwhile numar != 0:\n    if 1 <= numar <= 15:\n        print("Numărul este bun.")\n    else:\n        print("Intrare nevalidă.")\n    numar = int(input("Introduceți un număr: "))\nprint("Programul s-a finisat!")\n```\n\nFolosim **comparație în lanț**: `1 <= numar <= 15` — este idiomatic Python pentru intervale.',
    {
      topic: 'while',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Buclă `while numar != 0`. În interior verifică `1 <= numar <= 15`. La final reciteste numar.',
      correctAnswer: 'numar = int(input("Introduceți un număr: "))\nwhile numar != 0:\n    if 1 <= numar <= 15:\n        print("Numărul este bun.")\n    else:\n        print("Intrare nevalidă.")\n    numar = int(input("Introduceți un număr: "))\nprint("Programul s-a finisat!")',
      tags: ['while', 'interval', 'validare'],
    }
  ),
]

// ============================================================
// METODICA 7 cont. — While loop part 2 (lecție nouă)
// ============================================================

const whileLoopPart2Theory = `# Bucla while — exersare avansată

În prima parte ai învățat:
- ce e o iterație
- incrementare/decrementare
- \`break\` și \`continue\`

Acum aplicăm \`while\` la **probleme reale** — joc, verificare numere prime, par/impar, sume.

## 💡 Pattern frecvent: contor + condiție compusă

\`\`\`python
i = 1
divizori = 0
while i <= numar:
    if numar % i == 0:
        divizori += 1
    i += 1
\`\`\`

## 💡 Pattern frecvent: stop pe semnal

\`\`\`python
x = input()
while x != 'stop':
    # procesează x
    x = input()
\`\`\`

Sfat: în problemele complexe, **scrie întâi pe foaie** trace-ul pentru câteva iterații.
`

const whileLoopPart2Problems = [
  code(
    'Piatră – Hârtie – Foarfecă',
    'Implementează jocul **piatră-hârtie-foarfecă** pentru 2 jucători.\n\nReguli:\n- piatră bate foarfecă\n- foarfecă bate hârtie\n- hârtie bate piatră\n- la egalitate → „egalitate”\n\nProgramul rulează în buclă până când **unul** dintre jucători introduce „stop”. La final afișează „game over”.\n\n**Exemplu:**\n```\nJucător 1: piatra\nJucător 2: foarfeca\nprimul a castigat\nJucător 1: stop\ngame over\n```',
    'python',
    'x = input("Jucător 1: ")\ny = input("Jucător 2: ")\n# bucla while aici\n',
    '```python\nx = input("Jucător 1: ")\ny = input("Jucător 2: ")\nwhile x != "stop" and y != "stop":\n    if x == y:\n        print("egalitate")\n    elif (x == "piatra" and y == "foarfeca") or \\\n         (x == "foarfeca" and y == "hartie") or \\\n         (x == "hartie" and y == "piatra"):\n        print("primul a castigat")\n    else:\n        print("al doilea a castigat")\n    x = input("Jucător 1: ")\n    y = input("Jucător 2: ")\nprint("game over")\n```\n\nAtenție la **paranteze** în condiția compusă cu `or` și `and`.',
    {
      topic: 'while',
      difficulty: 'HARD',
      points: 30,
      hint: 'Listează cele 3 cazuri în care primul câștigă, separate prin `or`. Restul (mai puțin egalitate) → al doilea.',
      correctAnswer: 'x = input("Jucător 1: ")\ny = input("Jucător 2: ")\nwhile x != "stop" and y != "stop":\n    if x == y:\n        print("egalitate")\n    elif (x == "piatra" and y == "foarfeca") or (x == "foarfeca" and y == "hartie") or (x == "hartie" and y == "piatra"):\n        print("primul a castigat")\n    else:\n        print("al doilea a castigat")\n    x = input("Jucător 1: ")\n    y = input("Jucător 2: ")\nprint("game over")',
      tags: ['while', 'and', 'or'],
    }
  ),
  code(
    'Verifică dacă un număr este prim',
    'Citește un număr și afișează:\n- „Numărul este prim!” dacă are exact 2 divizori (1 și el însuși)\n- „Numărul nu este prim!” altfel\n\n**Exemplu:**\n```\nIntrodu un număr: 7\nNumărul este prim!\n```\n```\nIntrodu un număr: 9\nNumărul nu este prim!\n```',
    'python',
    'numar = int(input("Introdu un număr: "))\ni = 1\ndivizori = 0\n# numără divizorii\n',
    '```python\nnumar = int(input("Introdu un număr: "))\ni = 1\ndivizori = 0\nwhile i <= numar:\n    if numar % i == 0:\n        divizori += 1\n    i += 1\nif divizori == 2:\n    print("Numărul este prim!")\nelse:\n    print("Numărul nu este prim!")\n```\n\nIdee: numărăm câți divizori are. Un număr **prim** are **exact 2** divizori (1 și el însuși).',
    {
      topic: 'while',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Numără câte numere de la 1 la N îl divid pe N (rest 0). Dacă sunt exact 2 → prim.',
      correctAnswer: 'numar = int(input("Introdu un număr: "))\ni = 1\ndivizori = 0\nwhile i <= numar:\n    if numar % i == 0:\n        divizori += 1\n    i += 1\nif divizori == 2:\n    print("Numărul este prim!")\nelse:\n    print("Numărul nu este prim!")',
      tags: ['while', 'prim', 'divizori'],
    }
  ),
  code(
    'Par / Impar până la 0',
    'Cere repetat numere și pentru fiecare afișează „X este par!” sau „X este impar!”. Programul se oprește când utilizatorul introduce **0** — atunci afișează „Programul s-a finisat!”.\n\n**Exemplu:**\n```\nIntroduceti un numar: 7\n7 este impar!\nIntroduceti un numar: 4\n4 este par!\nIntroduceti un numar: 0\nProgramul s-a finisat!\n```',
    'python',
    'numar = int(input("Introduceti un numar: "))\nwhile numar != 0:\n    pass\n',
    '```python\nnumar = int(input("Introduceti un numar: "))\nwhile numar != 0:\n    if numar % 2 == 0:\n        print(numar, "este par!")\n    else:\n        print(numar, "este impar!")\n    numar = int(input("Introduceti un numar: "))\nprint("Programul s-a finisat!")\n```\n\n⚠️ Bug-ul tipic: să folosești `while i != 0` în loc de `while numar != 0`. Verifică numele variabilei.',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Citește numar înainte de while, apoi în buclă verifică `% 2`, apoi recitește numar.',
      correctAnswer: 'numar = int(input("Introduceti un numar: "))\nwhile numar != 0:\n    if numar % 2 == 0:\n        print(numar, "este par!")\n    else:\n        print(numar, "este impar!")\n    numar = int(input("Introduceti un numar: "))\nprint("Programul s-a finisat!")',
      tags: ['while', 'par', 'impar'],
    }
  ),
  code(
    'Suma de la 0 la 100',
    'Calculează **suma numerelor de la 0 la 100** folosind o buclă `while`.\n\n**Output așteptat:**\n```\nSuma numerelor de la 0 la 100 este: 5050\n```',
    'python',
    'suma = 0\ni = 0\n# scrie bucla while\n',
    '```python\nsuma = 0\ni = 0\nwhile i <= 100:\n    suma += i\n    i += 1\nprint("Suma numerelor de la 0 la 100 este:", suma)\n```\n\nVerificare matematică: formula sumei `n*(n+1)/2` = `100*101/2` = **5050** ✅',
    {
      topic: 'while',
      difficulty: 'EASY',
      points: 20,
      hint: 'Inițializează suma=0, i=0. În buclă: `suma += i` apoi `i += 1`.',
      correctAnswer: 'suma = 0\ni = 0\nwhile i <= 100:\n    suma += i\n    i += 1\nprint("Suma numerelor de la 0 la 100 este:", suma)',
      tags: ['while', 'suma', 'acumulator'],
    }
  ),
]

// ============================================================
// METODICA 8 — While True + break/continue (lecție nouă)
// ============================================================

const whileTrueTheory = `# Bucla \`while True\` — bucle infinite cu \`break\`

## 🔁 Ce este o buclă infinită?

O buclă este **infinită** atunci când condiția ei este **mereu adevărată**. Exemplu evident:

\`\`\`python
while 0 < 5:   # mereu True → bucla nu se oprește niciodată
    print("la nesfârșit")
\`\`\`

În loc să scriem o condiție artificială, putem scrie direct \`True\`:

\`\`\`python
while True:
    # cod care se repetă... pentru totdeauna
\`\`\`

## 🛑 Cum oprim o buclă \`while True\`?

Singura modalitate normală e prin instrucțiunea \`break\`.

| Instrucțiune | Ce face |
|---|---|
| \`break\` | **iese imediat** din buclă |
| \`continue\` | **sare** restul iterației și începe alta |

\`\`\`python
while True:
    n = int(input("Număr (0 = stop): "))
    if n == 0:
        break          # gata, ieșim
    if n < 0:
        continue       # negativele le ignorăm, mergem la următoarea citire
    print(n * 2)
\`\`\`

## 🎯 Pattern „validare input"

Foarte des folosit:

\`\`\`python
while True:
    parola = input("Parola: ")
    if len(parola) >= 8:
        break
    print("Prea scurtă, mai încearcă!")
print("Parolă acceptată!")
\`\`\`

⚠️ **Niciodată** nu scrie \`while True:\` fără un \`break\` — programul tău nu se va opri.
`

const whileTrueProblems = [
  code(
    'Setare parolă cu confirmare',
    'Scrie un program care cere utilizatorului să introducă o **parolă**, apoi să o **reintroducă** pentru confirmare.\n\n- Dacă parolele coincid → „Parolă setată!” și gata.\n- Dacă diferă → „Parolele nu sunt egale. Încercați din nou.” și se reia.\n- Parolă goală nu este permisă (dacă apasă Enter direct, cere din nou).\n\n**Exemplu:**\n```\nIntrodu parola: qwerty\nReintrodu parola: 123\nParolele nu sunt egale. Încercați din nou.\nIntrodu parola: qwerty\nReintrodu parola: qwerty\nParolă setată!\n```',
    'python',
    'while True:\n    parola1 = input("Intrdou parola: ")\n    # ...\n',
    '```python\nwhile True:\n    parola1 = input("Introdu parola: ")\n    if parola1 == "":\n        print("Parola nu poate fi goală.")\n        continue\n    parola2 = input("Reintrodu parola: ")\n    if parola1 == parola2:\n        print("Parolă setată!")\n        break\n    else:\n        print("Parolele nu sunt egale. Încercați din nou.")\n```\n\n- `continue` — sare la o nouă iterație fără a cere a doua parolă.\n- `break` — oprește bucla când parolele coincid.',
    {
      topic: 'while-true',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Buclă `while True`. Dacă prima parolă e goală → `continue`. Dacă cele 2 coincid → `break`.',
      correctAnswer: 'while True:\n    parola1 = input("Introdu parola: ")\n    if parola1 == "":\n        print("Parola nu poate fi goală.")\n        continue\n    parola2 = input("Reintrodu parola: ")\n    if parola1 == parola2:\n        print("Parolă setată!")\n        break\n    else:\n        print("Parolele nu sunt egale. Încercați din nou.")',
      tags: ['while-true', 'break', 'continue'],
    }
  ),
  code(
    'Parolă cu lungime minimă (8 caractere)',
    'Modifică programul de mai sus astfel încât **parola să aibă cel puțin 8 caractere**. Dacă e mai scurtă, afișează „Parola este prea scurtă. Reintroduceți!” și se cere din nou.\n\n**Exemplu:**\n```\nIntrodu parola: qwerty\nParola este prea scurtă. Reintroduceți!\nIntrodu parola: qwerty1234\nReintrodu parola: qwerty1234\nParolă setată!\n```',
    'python',
    'while True:\n    parola1 = input("Introdu parola: ")\n    # ...\n',
    '```python\nwhile True:\n    parola1 = input("Introdu parola: ")\n    if parola1 == "":\n        print("Parola nu poate fi goală.")\n        continue\n    if len(parola1) < 8:\n        print("Parola este prea scurtă. Reintroduceți!")\n        continue\n    parola2 = input("Reintrodu parola: ")\n    if parola1 == parola2:\n        print("Parolă setată!")\n        break\n    else:\n        print("Parolele nu sunt egale. Încercați din nou.")\n```\n\nFolosim funcția `len()` pentru a obține numărul de caractere dintr-un string.',
    {
      topic: 'while-true',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Adaugă încă un `if len(parola1) < 8: ... continue` între verificarea „goală" și citirea celei de-a doua parole.',
      correctAnswer: 'while True:\n    parola1 = input("Introdu parola: ")\n    if parola1 == "":\n        print("Parola nu poate fi goală.")\n        continue\n    if len(parola1) < 8:\n        print("Parola este prea scurtă. Reintroduceți!")\n        continue\n    parola2 = input("Reintrodu parola: ")\n    if parola1 == parola2:\n        print("Parolă setată!")\n        break\n    else:\n        print("Parolele nu sunt egale. Încercați din nou.")',
      tags: ['while-true', 'len', 'validare'],
    }
  ),
  code(
    'Sandwich din 3 ingrediente',
    'Scrie un program care cere utilizatorului să introducă **3 ingrediente** pentru un sandwich. La final, afișează ingredientele alese, separate prin spațiu.\n\n**Exemplu:**\n```\nIngredient 1: Pâine\nIngredient 2: Piept de pui\nIngredient 3: Brânză\nAți creat un sandwich din: Pâine Piept de pui Brânză\n```',
    'python',
    '# 3 input-uri și un print final\n',
    '```python\ningredient1 = input("Ingredient 1: ")\ningredient2 = input("Ingredient 2: ")\ningredient3 = input("Ingredient 3: ")\nprint("Ați creat un sandwich din:", ingredient1, ingredient2, ingredient3)\n```\n\nProblema asta nu folosește încă `while`, dar e baza pentru următoarea — vei generaliza la „oricâte ingrediente, până la stop".',
    {
      topic: 'while-true',
      difficulty: 'EASY',
      points: 15,
      hint: 'Trei `input()` și un `print()` cu mai multe argumente.',
      correctAnswer: 'ingredient1 = input("Ingredient 1: ")\ningredient2 = input("Ingredient 2: ")\ningredient3 = input("Ingredient 3: ")\nprint("Ați creat un sandwich din:", ingredient1, ingredient2, ingredient3)',
      tags: ['input', 'print'],
    }
  ),
  code(
    'Sandwich cu 4 ingrediente și preț',
    'Cere utilizatorului **3 ingrediente**. Calculează prețul total folosind tabela:\n\n| Ingredient | Preț |\n|---|---|\n| Pâine | 20 lei |\n| Piept de pui | 80 lei |\n| Brânză | 35 lei |\n| Sos | 15 lei |\n\nDacă scrie altceva → „Ingredient invalid: X”.\n\n**Exemplu:**\n```\nIngredient 1: Pâine\nIngredient 2: Piept de pui\nIngredient 3: Sos\nAți creat un sandwich din: Pâine Piept de pui Sos\nPrețul: 115 lei\n```',
    'python',
    'ingredient1 = input("Ingredient 1: ")\n# ...\npret_total = 0\n',
    '```python\ningredient1 = input("Ingredient 1: ")\ningredient2 = input("Ingredient 2: ")\ningredient3 = input("Ingredient 3: ")\npret_total = 0\nfor ing in (ingredient1, ingredient2, ingredient3):\n    if ing == "Pâine":\n        pret_total += 20\n    elif ing == "Piept de pui":\n        pret_total += 80\n    elif ing == "Brânză":\n        pret_total += 35\n    elif ing == "Sos":\n        pret_total += 15\n    else:\n        print("Ingredient invalid:", ing)\nprint("Ați creat un sandwich din:", ingredient1, ingredient2, ingredient3)\nprint("Prețul:", pret_total, "lei")\n```\n\n💡 Versiunea fără `for` (cum apare în metodică) are codul triplicat — bucla `for` peste tuplu îl scurtează la 1/3.',
    {
      topic: 'while-true',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Pune cele 3 ingrediente într-un tuplu și folosește un `for` cu lanț `if/elif/else`.',
      correctAnswer: 'ingredient1 = input("Ingredient 1: ")\ningredient2 = input("Ingredient 2: ")\ningredient3 = input("Ingredient 3: ")\npret_total = 0\nfor ing in (ingredient1, ingredient2, ingredient3):\n    if ing == "Pâine":\n        pret_total += 20\n    elif ing == "Piept de pui":\n        pret_total += 80\n    elif ing == "Brânză":\n        pret_total += 35\n    elif ing == "Sos":\n        pret_total += 15\n    else:\n        print("Ingredient invalid:", ing)\nprint("Ați creat un sandwich din:", ingredient1, ingredient2, ingredient3)\nprint("Prețul:", pret_total, "lei")',
      tags: ['if-elif', 'for'],
    }
  ),
  code(
    'Sandwich cu oricâte ingrediente (până la „stop")',
    'Generalizează problema anterioară: utilizatorul poate introduce **oricâte ingrediente**, până când scrie **„stop”**. Afișează la final lista și prețul total.\n\nIngrediente: Pâine 20, Piept de pui 80, Brânză 35, Sos 15.\n\n**Exemplu:**\n```\nIngredient 1: Pâine\nIngredient 2: Piept de pui\nIngredient 3: Brânză\nIngredient 4: Sos\nIngredient 5: Piept de pui\nIngredient 6: stop\nAți creat un sandwich din: Pâine Piept de pui Brânză Sos Piept de pui\nPrețul: 230 lei\n```',
    'python',
    'suma = 0\nproduse = ""\nn = 1\nwhile True:\n    x = input("Ingredient " + str(n) + ": ")\n    # ...\n',
    '```python\nsuma = 0\nproduse = ""\nn = 1\nwhile True:\n    x = input("Ingredient " + str(n) + ": ")\n    if x == "stop":\n        break\n    if x == "Pâine":\n        suma += 20\n    elif x == "Piept de pui":\n        suma += 80\n    elif x == "Brânză":\n        suma += 35\n    elif x == "Sos":\n        suma += 15\n    produse += x + " "\n    n += 1\nprint("Ați creat un sandwich din", produse)\nprint("Prețul:", suma, "lei")\n```\n\nObservă: combinăm `while True` + `break` + acumulator pentru text și pentru sumă.',
    {
      topic: 'while-true',
      difficulty: 'HARD',
      points: 30,
      hint: 'Folosește `while True` cu `if x == "stop": break`. Concatenează produsele într-un string.',
      correctAnswer: 'suma = 0\nproduse = ""\nn = 1\nwhile True:\n    x = input("Ingredient " + str(n) + ": ")\n    if x == "stop":\n        break\n    if x == "Pâine":\n        suma += 20\n    elif x == "Piept de pui":\n        suma += 80\n    elif x == "Brânză":\n        suma += 35\n    elif x == "Sos":\n        suma += 15\n    produse += x + " "\n    n += 1\nprint("Ați creat un sandwich din", produse)\nprint("Prețul:", suma, "lei")',
      tags: ['while-true', 'break', 'acumulator'],
    }
  ),
]

// ============================================================
// METODICA 9 — While True practică (lecție nouă)
// ============================================================

const whileTruePracticaTheory = `# \`while True\` — exersare practică

În această lecție aplicăm **\`while True\` + \`break\`** la probleme reale din viața de zi cu zi:
- selecția candidaților după criterii (înălțime, vârstă)
- contoare (câți au îndeplinit condiția)
- agregare în text (lista celor selectați)
- mecanisme de seif și automate de plată

## 🧠 Trace pe foaie

Înainte de a porni, **calculează cu pixul** câteva iterații:

\`\`\`python
x = 1
while True:
    x += 1
    if x == 2:
        continue
    elif x > 3:
        break
    x *= 2
print(x)
\`\`\`

| Iterație | x după \`x+=1\` | Verificare | x după \`*=2\` |
|---|---|---|---|
| 1 | 2 | \`x==2\` → continue | — |
| 2 | 3 | nici 2, nici >3 | 6 |
| 3 | 7 | \`7 > 3\` → **break** | — |

Rezultat: **7**

## 🎯 Pattern „colecționar de valori"

\`\`\`python
total = 0
contor = 0
selectati = ""
while True:
    val = int(input())
    if val == 0:
        break
    if val_ok(val):
        total += val
        contor += 1
        selectati += str(val) + " "
print(total, contor, selectati)
\`\`\`
`

const whileTruePracticaProblems = [
  code(
    'Selecție atletism (un atlet)',
    'Citește **înălțimea** unui candidat (cm). Dacă e între **150 și 190 cm** → „Selectat pentru competiție.”, altfel „Nu sunteți eligibil.”\n\n**Exemplu:**\n```\nÎnălțime: 160\nSelectat pentru competiție.\n```',
    'python',
    'inaltime = int(input("Înălțime: "))\n',
    '```python\ninaltime = int(input("Înălțime: "))\nif 150 <= inaltime <= 190:\n    print("Selectat pentru competiție.")\nelse:\n    print("Nu sunteți eligibil.")\n```',
    {
      topic: 'while-practica',
      difficulty: 'EASY',
      points: 15,
      hint: 'Folosește comparația în lanț `150 <= inaltime <= 190`.',
      correctAnswer: 'inaltime = int(input("Înălțime: "))\nif 150 <= inaltime <= 190:\n    print("Selectat pentru competiție.")\nelse:\n    print("Nu sunteți eligibil.")',
      tags: ['if', 'interval'],
    }
  ),
  code(
    'Selecție atletism (mai mulți atleți)',
    'Repetă verificarea pentru mai mulți candidați, până când utilizatorul introduce **0** (atunci afișează „STOP”).\n\n**Exemplu:**\n```\nÎnălțime: 160\nSelectat\nÎnălțime: 100\nNu sunteți eligibil\nÎnălțime: 0\nSTOP\n```',
    'python',
    'while True:\n    inaltime = int(input("Înălțime: "))\n    # ...\n',
    '```python\nwhile True:\n    inaltime = int(input("Înălțime: "))\n    if inaltime == 0:\n        print("STOP")\n        break\n    elif 150 <= inaltime <= 190:\n        print("Selectat")\n    else:\n        print("Nu sunteți eligibil")\n```\n\nDouă puncte de atenție: verifică `inaltime == 0` **înainte** de comparația de interval, altfel 0 va trece la else.',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'În buclă: dacă e 0 → break. Altfel verifică intervalul.',
      correctAnswer: 'while True:\n    inaltime = int(input("Înălțime: "))\n    if inaltime == 0:\n        print("STOP")\n        break\n    elif 150 <= inaltime <= 190:\n        print("Selectat")\n    else:\n        print("Nu sunteți eligibil")',
      tags: ['while-true', 'break'],
    }
  ),
  code(
    'Selecție atletism + contor',
    'Adaugă un contor care numără câți candidați au fost selectați. La final afișează „Total candidați: X”.\n\n**Exemplu:**\n```\nÎnălțime: 160\nSelectat\nÎnălțime: 100\nNu sunteți eligibil\nÎnălțime: 180\nSelectat\nÎnălțime: 0\nSTOP\nTotal candidați: 2\n```',
    'python',
    'selectati = 0\nwhile True:\n    inaltime = int(input("Înălțime: "))\n    # ...\n',
    '```python\nselectati = 0\nwhile True:\n    inaltime = int(input("Înălțime: "))\n    if inaltime == 0:\n        print("STOP")\n        break\n    elif 150 <= inaltime <= 190:\n        print("Selectat")\n        selectati += 1\n    else:\n        print("Nu sunteți eligibil")\nprint("Total candidați:", selectati)\n```',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 20,
      hint: 'Inițializează `selectati = 0` și incrementează doar când e selectat.',
      correctAnswer: 'selectati = 0\nwhile True:\n    inaltime = int(input("Înălțime: "))\n    if inaltime == 0:\n        print("STOP")\n        break\n    elif 150 <= inaltime <= 190:\n        print("Selectat")\n        selectati += 1\n    else:\n        print("Nu sunteți eligibil")\nprint("Total candidați:", selectati)',
      tags: ['contor', 'while-true'],
    }
  ),
  code(
    'Selecție atletism + listă înălțimi',
    'Pe lângă contor, păstrează și **lista înălțimilor** celor selectați (separate prin spațiu) și afișeaz-o la final.\n\n**Exemplu:**\n```\n...\nTotal candidați: 3\nÎnălțimile selectate: 160 170 180\n```',
    'python',
    'selectati = 0\ninaltimi = ""\nwhile True:\n    # ...\n',
    '```python\nselectati = 0\ninaltimi = ""\nwhile True:\n    inaltime = int(input("Înălțime: "))\n    if inaltime == 0:\n        print("STOP")\n        break\n    elif 150 <= inaltime <= 190:\n        print("Selectat")\n        selectati += 1\n        inaltimi += str(inaltime) + " "\n    else:\n        print("Nu sunteți eligibil")\nprint("Total candidați:", selectati)\nprint("Înălțimile selectate:", inaltimi)\n```\n\nNu uita `str(inaltime)` — nu poți concatena `int` direct cu `str`.',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Concatenează în `inaltimi += str(inaltime) + " "` (conversie la string!).',
      correctAnswer: 'selectati = 0\ninaltimi = ""\nwhile True:\n    inaltime = int(input("Înălțime: "))\n    if inaltime == 0:\n        print("STOP")\n        break\n    elif 150 <= inaltime <= 190:\n        print("Selectat")\n        selectati += 1\n        inaltimi += str(inaltime) + " "\n    else:\n        print("Nu sunteți eligibil")\nprint("Total candidați:", selectati)\nprint("Înălțimile selectate:", inaltimi)',
      tags: ['while-true', 'concat', 'str'],
    }
  ),
  code(
    'Numărarea notelor excelente',
    'Citește note până când utilizatorul introduce **0**. Afișează câte au fost **excelente** (9 sau 10).\n\n**Exemplu:**\n```\nNotă: 7\nNotă: 10\nNotă: 9\nNotă: 0\nNote excelente: 2\n```',
    'python',
    'note_excelente = 0\nwhile True:\n    nota = int(input("Notă: "))\n    # ...\n',
    '```python\nnote_excelente = 0\nwhile True:\n    nota = int(input("Notă: "))\n    if nota == 0:\n        break\n    if nota == 9 or nota == 10:\n        note_excelente += 1\nprint("Note excelente:", note_excelente)\n```\n\nVariantă echivalentă: `if nota in (9, 10):`.',
    {
      topic: 'while-practica',
      difficulty: 'EASY',
      points: 20,
      hint: 'Buclă infinită; `if nota == 0: break`; `if nota == 9 or nota == 10` → contor+=1.',
      correctAnswer: 'note_excelente = 0\nwhile True:\n    nota = int(input("Notă: "))\n    if nota == 0:\n        break\n    if nota == 9 or nota == 10:\n        note_excelente += 1\nprint("Note excelente:", note_excelente)',
      tags: ['while-true', 'or', 'contor'],
    }
  ),
  code(
    'Seif electronic — sumă totală',
    'Utilizatorul depune sume succesive în seif. Când introduce **0**, programul se oprește și afișează totalul.\n\n**Exemplu:**\n```\nSumă: 1000\nSumă: 500\nSumă: 0\nTotal economisit: 1500 lei\n```',
    'python',
    'suma_totala = 0\nwhile True:\n    suma = int(input("Sumă: "))\n    # ...\n',
    '```python\nsuma_totala = 0\nwhile True:\n    suma = int(input("Sumă: "))\n    if suma == 0:\n        print("Total economisit:", suma_totala, "lei")\n        break\n    suma_totala += suma\n```',
    {
      topic: 'while-practica',
      difficulty: 'EASY',
      points: 15,
      hint: 'Acumulator `suma_totala += suma`. La 0 → afișează și break.',
      correctAnswer: 'suma_totala = 0\nwhile True:\n    suma = int(input("Sumă: "))\n    if suma == 0:\n        print("Total economisit:", suma_totala, "lei")\n        break\n    suma_totala += suma',
      tags: ['acumulator', 'while-true'],
    }
  ),
  code(
    'Seif cu bancnote acceptate (100/500/1000)',
    'Modifică seiful: acceptă **doar** 100, 500, 1000 lei. Pentru orice altceva afișează „Nominalul nu este acceptat. Reintroduceți.” Introducerea valorii 0 oprește programul.\n\n**Exemplu:**\n```\nSumă: 500\nSumă: 100500\nNominalul nu este acceptat. Reintroduceți.\nSumă: 100\nSumă: 0\nTotal economisit: 600 lei\n```',
    'python',
    'suma_totala = 0\nwhile True:\n    suma = int(input("Sumă: "))\n    # ...\n',
    '```python\nsuma_totala = 0\nwhile True:\n    suma = int(input("Sumă: "))\n    if suma == 0:\n        print("Total economisit:", suma_totala, "lei")\n        break\n    if suma in (100, 500, 1000):\n        suma_totala += suma\n    else:\n        print("Nominalul nu este acceptat. Reintroduceți.")\n```\n\n`suma in (100, 500, 1000)` e mai elegant decât `suma == 100 or suma == 500 or suma == 1000`.',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Folosește `in (100, 500, 1000)` pentru a verifica nominalul.',
      correctAnswer: 'suma_totala = 0\nwhile True:\n    suma = int(input("Sumă: "))\n    if suma == 0:\n        print("Total economisit:", suma_totala, "lei")\n        break\n    if suma in (100, 500, 1000):\n        suma_totala += suma\n    else:\n        print("Nominalul nu este acceptat. Reintroduceți.")',
      tags: ['in', 'while-true'],
    }
  ),
  code(
    'Automat de băuturi calde (40 lei)',
    'O băutură costă **40 lei**. Utilizatorul introduce monede una câte una. Când suma totală **>= 40** → „Băutura este pregătită. Savurați!”. Dacă a depășit 40 → afișează și „Restul dvs. este de X lei”.\n\n**Exemplu:**\n```\nMonedă: 10\nMonedă: 10\nMonedă: 10\nMonedă: 10\nBăutura este pregătită. Savurați!\n```',
    'python',
    'pret = 40\nsuma = 0\n# while ...\n',
    '```python\npret = 40\nsuma = 0\nwhile suma < pret:\n    moneda = int(input("Monedă: "))\n    suma += moneda\nprint("Băutura este pregătită. Savurați!")\nif suma > pret:\n    print("Restul dvs. este de", suma - pret, "lei")\n```\n\n💡 Aici condiția `while suma < pret` face același lucru ca `while True + break` — nu mai e nevoie de `break`.',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Condiția `while suma < pret` e suficientă. La final, dacă `suma > pret` → afișează restul.',
      correctAnswer: 'pret = 40\nsuma = 0\nwhile suma < pret:\n    moneda = int(input("Monedă: "))\n    suma += moneda\nprint("Băutura este pregătită. Savurați!")\nif suma > pret:\n    print("Restul dvs. este de", suma - pret, "lei")',
      tags: ['while', 'acumulator'],
    }
  ),
  code(
    'Automat — număr de monede introduse',
    'Suplimentează automatul: numără și **câte monede** a introdus utilizatorul. Afișează la final „Numărul de monede introduse: X”.\n\n**Exemplu:**\n```\nMonedă: 5\nMonedă: 5\nMonedă: 5\nMonedă: 10\nMonedă: 10\nMonedă: 10\nBăutura este pregătită. Savurați!\nRestul dvs. este de 5 lei\nNumărul de monede introduse: 6\n```',
    'python',
    'pret = 40\nsuma = 0\nnr = 0\n# while ...\n',
    '```python\npret = 40\nsuma = 0\nnr = 0\nwhile suma < pret:\n    moneda = int(input("Monedă: "))\n    suma += moneda\n    nr += 1\nprint("Băutura este pregătită. Savurați!")\nif suma > pret:\n    print("Restul dvs. este de", suma - pret, "lei")\nprint("Numărul de monede introduse:", nr)\n```',
    {
      topic: 'while-practica',
      difficulty: 'MEDIUM',
      points: 25,
      hint: 'Adaugă un contor `nr += 1` în interiorul buclei.',
      correctAnswer: 'pret = 40\nsuma = 0\nnr = 0\nwhile suma < pret:\n    moneda = int(input("Monedă: "))\n    suma += moneda\n    nr += 1\nprint("Băutura este pregătită. Savurați!")\nif suma > pret:\n    print("Restul dvs. este de", suma - pret, "lei")\nprint("Numărul de monede introduse:", nr)',
      tags: ['contor', 'while'],
    }
  ),
]

// ============================================================
// EXPORT
// ============================================================

export const pythonMetodicaPatch = {
  appendTheory: {
    'while-loop': whileLoopTheoryAppend,
  },
  appendProblems: {
    'while-loop': whileLoopProblems,
  },
  newLessons: [
    {
      afterSlug: 'while-loop',
      slug: 'while-loop-part2',
      title: '7b. While loop — Exersare avansată',
      isFree: false,
      theory: whileLoopPart2Theory,
      problems: whileLoopPart2Problems,
    },
    {
      afterSlug: 'while-loop-part2',
      slug: 'while-true',
      title: '7c. While True + break / continue',
      isFree: false,
      theory: whileTrueTheory,
      problems: whileTrueProblems,
    },
    {
      afterSlug: 'while-true',
      slug: 'while-true-practica',
      title: '7d. While True — Probleme practice',
      isFree: false,
      theory: whileTruePracticaTheory,
      problems: whileTruePracticaProblems,
    },
  ],
}
