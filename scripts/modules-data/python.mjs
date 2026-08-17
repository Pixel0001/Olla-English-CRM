import { mc, sa, io, code } from './helpers.mjs'

// PYTHON — 20 lecții complete
// isFree: true pentru primele 2 lecții (trial gratuit)
export const pythonModule = {
  slug: 'python-fundamentals',
  title: 'Python Fundamentals',
  description: 'Învață Python de la zero — 20 de lecții complete cu teorie și probleme practice',
  language: 'python',
  order: 1,
  lessons: [
    // ============ LECȚIA 1 ============
    {
      slug: 'introducere-print',
      title: '1. Introducere + print()',
      isFree: true,
      theory: `# Bun venit în Python!

Python este un **limbaj de programare** simplu și puternic, folosit peste tot în lume — de la Google și Netflix până la NASA.

## De ce Python?
- Sintaxă **simplă**, aproape ca engleza
- Folosit în **AI, web, jocuri, automatizări**
- Cea mai cerută limbă în 2025

## Comanda \`print()\`
Servește la **afișarea** unui mesaj pe ecran:

\`\`\`python
print("Salut, lume!")
\`\`\`

Output:
\`\`\`
Salut, lume!
\`\`\`

Poți afișa și **numere**:

\`\`\`python
print(42)
print(3.14)
\`\`\`

Sau mai multe lucruri separate prin virgulă:

\`\`\`python
print("Vârsta mea este", 12, "ani")
\`\`\`
`,
      problems: [
        mc('Ce face print()?',
          'Care este rolul funcției `print()` în Python?',
          ['Citește de la utilizator', 'Afișează un mesaj pe ecran', 'Calculează o sumă', 'Șterge fișiere'],
          'Afișează un mesaj pe ecran',
          'print() trimite text/numere către consolă pentru a fi afișate utilizatorului.',
          { topic: 'print', difficulty: 'EASY' }),
        mc('Sintaxă corectă',
          'Care dintre următoarele afișează cuvântul "Buna" pe ecran?',
          ['print Buna', 'print("Buna")', 'console.log("Buna")', 'echo Buna'],
          'print("Buna")',
          'În Python, textul (string-ul) trebuie pus între ghilimele și transmis ca argument funcției `print()`.',
          { topic: 'print' }),
        sa('Afișează un număr',
          'Scrie comanda Python care afișează numărul **2026**.',
          'print(2026)',
          'Folosim `print(2026)` — numerele se transmit fără ghilimele.',
          { topic: 'print', hint: 'Folosește print() cu un număr înăuntru.' }),
        sa('String simplu',
          'Scrie comanda care afișează textul **Hello** (cu majusculă).',
          'print("Hello")',
          '`print("Hello")` — string-urile cer ghilimele duble (sau simple).',
          { topic: 'print' }),
        mc('Mai multe valori',
          'Ce afișează `print("a", "b", "c")`?',
          ['abc', 'a, b, c', 'a b c', 'Eroare'],
          'a b c',
          'Când transmiți mai multe argumente lui print(), acestea se afișează separate de **un spațiu** implicit.',
          { topic: 'print', difficulty: 'EASY' }),
        sa('Numere și text',
          'Scrie o comandă Python care afișează exact: **Am 12 ani**',
          'print("Am 12 ani")',
          'Textul se pune între ghilimele și se transmite la print().',
          { topic: 'print' }),
      ],
    },
    // ============ LECȚIA 2 ============
    {
      slug: 'variabile-tipuri',
      title: '2. Variabile + tipuri de date',
      isFree: true,
      theory: `# Variabile în Python

O **variabilă** este o "cutie" în care păstrezi o valoare. Îi dai un nume și apoi o folosești.

\`\`\`python
nume = "Ana"
varsta = 12
inaltime = 1.55
elev = True
\`\`\`

## Tipuri de date principale
- ****int**** — Exemplu: 12 • Descriere: Număr întreg
- ****float**** — Exemplu: 3.14 • Descriere: Număr cu virgulă
- ****str**** — Exemplu: "Ana" • Descriere: Text (string)
- ****bool**** — Exemplu: True / False • Descriere: Adevărat / Fals

## Reguli pentru nume de variabile
- Începe cu **literă** sau \`_\`
- Fără spații (folosește \`_\`)
- Case-sensitive: \`nume\` ≠ \`Nume\`

## Verifică tipul cu type()
\`\`\`python
x = 5
print(type(x))   # <class 'int'>
\`\`\`
`,
      problems: [
        mc('Tip int',
          'Ce tip are valoarea `42`?',
          ['str', 'float', 'int', 'bool'],
          'int',
          '42 este un număr întreg → tipul `int` (integer).',
          { topic: 'variables' }),
        mc('Tip string',
          'Ce tip are `"Python"`?',
          ['int', 'str', 'bool', 'float'],
          'str',
          'Textul între ghilimele este de tip `str` (string).',
          { topic: 'variables' }),
        sa('Creează variabilă',
          'Scrie linia de cod care creează variabila **nume** cu valoarea **"Maria"**.',
          'nume = "Maria"',
          'Sintaxa este: `nume_variabila = valoare`. String-ul trebuie între ghilimele.',
          { topic: 'variables' }),
        mc('Tip float',
          'Ce tip are `3.14`?',
          ['int', 'float', 'str', 'double'],
          'float',
          'Numerele cu virgulă (zecimale) sunt de tip `float` în Python.',
          { topic: 'variables' }),
        mc('Nume invalid',
          'Care nume de variabilă NU este valid în Python?',
          ['nume_elev', '_total', '2nume', 'numar1'],
          '2nume',
          'Numele de variabile **nu pot începe cu o cifră**. Pot începe doar cu literă sau underscore.',
          { topic: 'variables', difficulty: 'MEDIUM' }),
        sa('Tip bool',
          'Cum scrii valoarea booleană "adevărat" în Python? (un singur cuvânt)',
          'True',
          'În Python `True` și `False` se scriu cu majusculă inițială.',
          { topic: 'variables' }),
      ],
    },
    // ============ LECȚIA 3 ============
    {
      slug: 'input-conversii',
      title: '3. Input + conversii',
      isFree: false,
      theory: `# Citirea datelor de la utilizator

Funcția \`input()\` **citește** ce scrie utilizatorul de la tastatură.

\`\`\`python
nume = input("Cum te cheamă? ")
print("Salut,", nume)
\`\`\`

## ⚠️ Atenție!
\`input()\` returnează **mereu un string**, chiar dacă scrii un număr!

\`\`\`python
varsta = input("Ce vârstă ai? ")
print(varsta + 1)   # EROARE!
\`\`\`

## Conversii
- \`int(x)\` — string sau float → întreg
- \`float(x)\` — string → cu virgulă
- \`str(x)\` — orice → string

\`\`\`python
varsta = int(input("Ce vârstă ai? "))
print("Anul viitor vei avea", varsta + 1, "ani")
\`\`\`
`,
      problems: [
        mc('Ce returnează input()?',
          'Ce tip returnează `input()` în Python?',
          ['int', 'str', 'float', 'depinde de ce scrie utilizatorul'],
          'str',
          '`input()` returnează **întotdeauna un string**, indiferent ce scrie utilizatorul.',
          { topic: 'input' }),
        sa('Convertește la int',
          'Scrie expresia care convertește string-ul `"42"` la număr întreg.',
          'int("42")',
          'Folosim funcția `int()` cu string-ul ca argument.',
          { topic: 'input', hint: 'Funcția se cheamă int().' }),
        mc('Eroare la adunare',
          'De ce dă eroare codul: `x = input(); print(x + 5)` când scrii `10`?',
          ['Lipsește un punct', 'x este string, nu poate fi adunat cu int', 'Trebuie paranteze', 'Nu dă eroare'],
          'x este string, nu poate fi adunat cu int',
          'input() returnează string. `"10" + 5` dă eroare — trebuie întâi `int(input())`.',
          { topic: 'input', difficulty: 'MEDIUM' }),
        sa('Citește număr',
          'Scrie comanda care citește un număr întreg într-o variabilă numită **n**.',
          'n = int(input())',
          'Combinăm `input()` cu `int()` pentru a obține direct un întreg.',
          { topic: 'input' }),
        mc('Conversie float',
          'Care este rezultatul lui `float("3.14")`?',
          ['"3.14"', '3.14', '3', 'Eroare'],
          '3.14',
          '`float()` convertește string-ul "3.14" în numărul zecimal 3.14.',
          { topic: 'input' }),
      ],
    },
    // ============ LECȚIA 4 ============
    {
      slug: 'operatori',
      title: '4. Operatori',
      isFree: false,
      theory: `# Operatori în Python

## Aritmetici
- **\`+\`** — Exemplu: 5 + 3 • Rezultat: 8
- **\`-\`** — Exemplu: 5 - 3 • Rezultat: 2
- **\`*\`** — Exemplu: 5 * 3 • Rezultat: 15
- **\`/\`** — Exemplu: 10 / 3 • Rezultat: 3.333...
- **\`//\`** — Exemplu: 10 // 3 • Rezultat: 3 (cât întreg)
- **\`%\`** — Exemplu: 10 % 3 • Rezultat: 1 (rest)
- **\`**\`** — Exemplu: 2 ** 3 • Rezultat: 8 (putere)

## Comparație (returnează True/False)
- **\`!=\`** — egal: diferit • \`5 == 5\` → True: \`5 != 3\` → True
- **\`<\`, \`>\`, \`<=\`, \`>=\`** — egal: comparații • \`5 == 5\` → True: 
`,
      problems: [
        mc('Împărțire întreagă',
          'Cât este `17 // 5`?',
          ['3', '3.4', '2', '4'],
          '3',
          '`//` este împărțirea întreagă: 17 / 5 = 3.4 → trunchiat la 3.',
          { topic: 'operators' }),
        mc('Modulo',
          'Cât este `10 % 3`?',
          ['3', '1', '0', '3.33'],
          '1',
          '`%` returnează **restul** împărțirii: 10 = 3*3 + 1, deci restul este 1.',
          { topic: 'operators' }),
        mc('Putere',
          'Cât este `2 ** 4`?',
          ['8', '16', '6', '12'],
          '16',
          '`**` este ridicare la putere: 2⁴ = 2·2·2·2 = 16.',
          { topic: 'operators' }),
        mc('Comparație',
          'Ce returnează `7 > 3`?',
          ['True', 'False', '7', '3'],
          'True',
          '7 este mai mare decât 3, deci comparația returnează `True`.',
          { topic: 'operators' }),
        sa('Calcul rest',
          'Cât este `25 % 7`? (răspunde doar cu numărul)',
          '4',
          '25 = 7·3 + 4, deci restul este 4.',
          { topic: 'operators' }),
        mc('Egalitate',
          'Ce returnează `"5" == 5`?',
          ['True', 'False', 'Eroare', '5'],
          'False',
          'String-ul "5" și numărul 5 au tipuri diferite, deci nu sunt egale.',
          { topic: 'operators', difficulty: 'MEDIUM' }),
      ],
    },
    // ============ LECȚIA 5 ============
    {
      slug: 'if-else-elif',
      title: '5. If / Else / Elif',
      isFree: false,
      theory: `# Structuri de decizie

## if simplu
\`\`\`python
varsta = 18
if varsta >= 18:
    print("Ești major")
\`\`\`

## if / else
\`\`\`python
if varsta >= 18:
    print("Major")
else:
    print("Minor")
\`\`\`

## if / elif / else
\`\`\`python
nota = 8
if nota >= 9:
    print("Excelent")
elif nota >= 7:
    print("Bine")
elif nota >= 5:
    print("Suficient")
else:
    print("Insuficient")
\`\`\`

## Operatori logici
- \`and\` — ambele adevărate
- \`or\` — măcar una adevărată
- \`not\` — inversare

\`\`\`python
if varsta >= 18 and are_permis:
    print("Poate conduce")
\`\`\`

## ⚠️ Indentarea contează!
Codul de sub \`if\` trebuie indentat (4 spații).
`,
      problems: [
        mc('Indentare',
          'Câte spații se folosesc convențional pentru indentare în Python?',
          ['1', '2', '4', '8'],
          '4',
          'Convenția PEP 8 este 4 spații pentru fiecare nivel de indentare.',
          { topic: 'conditionals' }),
        mc('Operator and',
          'Când este `True and False`?',
          ['True', 'False', 'Eroare', 'depinde'],
          'False',
          '`and` returnează True doar dacă **ambele** operande sunt True.',
          { topic: 'conditionals' }),
        mc('Operator or',
          'Cât este `False or True`?',
          ['True', 'False', 'None', 'Eroare'],
          'True',
          '`or` returnează True dacă **măcar una** dintre operande este True.',
          { topic: 'conditionals' }),
        sa('Cuvânt cheie',
          'Ce cuvânt cheie folosim între `if` și `else` pentru o condiție suplimentară?',
          'elif',
          '`elif` (else if) permite verificarea unei condiții suplimentare după un if.',
          { topic: 'conditionals' }),
        io('Verifică major',
          'Scrie un program care citește vârsta de la tastatură și afișează "Major" dacă ≥ 18, altfel "Minor".\n\nInput: 20\nOutput: Major',
          'Major',
          'Citim vârsta cu `int(input())`, apoi `if varsta >= 18: print("Major") else: print("Minor")`.',
          { topic: 'conditionals', difficulty: 'MEDIUM',
            starterCode: 'varsta = int(input())\n# scrie aici\n',
            language: 'python' }),
      ],
    },
    // ============ LECȚIA 6 ============
    {
      slug: 'probleme-conditii',
      title: '6. Probleme cu condiții',
      isFree: false,
      theory: `# Aplicații practice cu condiții

## Exemplu: validare vârstă
\`\`\`python
varsta = int(input("Vârsta: "))
if varsta < 0:
    print("Vârstă invalidă!")
elif varsta < 13:
    print("Copil")
elif varsta < 18:
    print("Adolescent")
elif varsta < 65:
    print("Adult")
else:
    print("Senior")
\`\`\`

## Exemplu: calcul note
\`\`\`python
nota = float(input("Nota: "))
if nota < 5:
    print("Picat")
else:
    print("Promovat")
\`\`\`

## Exemplu: par sau impar
\`\`\`python
n = int(input())
if n % 2 == 0:
    print("Par")
else:
    print("Impar")
\`\`\`
`,
      problems: [
        mc('Par / impar',
          'Cum verifici dacă un număr `n` este par?',
          ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 0', 'n == 2'],
          'n % 2 == 0',
          'Un număr este par dacă restul împărțirii la 2 este 0: `n % 2 == 0`.',
          { topic: 'conditionals' }),
        mc('Maximul a 2 numere',
          'Ce face: `if a > b: print(a) else: print(b)`?',
          ['Afișează minimul', 'Afișează maximul', 'Afișează suma', 'Eroare'],
          'Afișează maximul',
          'Comparăm a cu b și afișăm pe cel mai mare.',
          { topic: 'conditionals' }),
        sa('Pozitiv/negativ',
          'Scrie expresia care verifică dacă numărul `n` este pozitiv strict.',
          'n > 0',
          'Pozitiv strict înseamnă mai mare decât zero: `n > 0`.',
          { topic: 'conditionals' }),
        io('Cea mai mare notă',
          'Citește 3 note și afișează cea mai mare.\n\nInput:\n7\n9\n5\n\nOutput: 9',
          '9',
          'Comparăm cele 3 valori cu if/elif sau folosim max(a, b, c).',
          { topic: 'conditionals', difficulty: 'MEDIUM',
            starterCode: 'a = int(input())\nb = int(input())\nc = int(input())\n',
            language: 'python' }),
        io('Validare vârstă',
          'Citește vârsta. Dacă e între 0 și 120 afișează "Valid", altfel "Invalid".\n\nInput: 25\nOutput: Valid',
          'Valid',
          'Folosim `if 0 <= varsta <= 120: print("Valid") else: print("Invalid")`.',
          { topic: 'conditionals', difficulty: 'MEDIUM',
            starterCode: 'varsta = int(input())\n',
            language: 'python' }),
      ],
    },
    // ============ LECȚIA 7 ============
    {
      slug: 'while-loop',
      title: '7. While loop',
      isFree: false,
      theory: `# Bucla while

\`while\` repetă un bloc de cod **cât timp** o condiție este adevărată.

\`\`\`python
i = 1
while i <= 5:
    print(i)
    i = i + 1
\`\`\`

Output:
\`\`\`
1
2
3
4
5
\`\`\`

## ⚠️ Buclă infinită!
Dacă uiți să modifici variabila condiției, bucla rulează la nesfârșit:
\`\`\`python
i = 1
while i <= 5:
    print(i)   # bug: i nu crește niciodată!
\`\`\`

## break și continue
- \`break\` — iese din buclă
- \`continue\` — sare la următoarea iterație

\`\`\`python
n = 0
while True:
    n = int(input())
    if n == 0:
        break
    print(n)
\`\`\`
`,
      problems: [
        mc('Câte iterații?',
          'Câte numere afișează: `i=1; while i<=10: print(i); i+=1`?',
          ['9', '10', '11', 'infinit'],
          '10',
          'Bucla rulează pentru i = 1, 2, 3, ..., 10, deci 10 iterații.',
          { topic: 'loops' }),
        mc('break',
          'Ce face `break`?',
          ['Trece la următoarea iterație', 'Iese din buclă', 'Repornește bucla', 'Dă eroare'],
          'Iese din buclă',
          '`break` întrerupe imediat bucla curentă.',
          { topic: 'loops' }),
        mc('continue',
          'Ce face `continue`?',
          ['Iese din program', 'Iese din buclă', 'Trece la următoarea iterație', 'Repornește variabilele'],
          'Trece la următoarea iterație',
          '`continue` sare codul rămas și trece direct la următoarea iterație.',
          { topic: 'loops' }),
        io('Suma 1..N',
          'Citește N. Calculează suma 1+2+...+N folosind while.\n\nInput: 5\nOutput: 15',
          '15',
          'Inițializăm s=0, i=1; while i<=N: s+=i; i+=1; la final print(s).',
          { topic: 'loops', difficulty: 'MEDIUM',
            starterCode: 'n = int(input())\ns = 0\ni = 1\n',
            language: 'python' }),
        io('Numărare descrescătoare',
          'Afișează numerele de la 5 la 1 (fiecare pe linie nouă).\n\nOutput:\n5\n4\n3\n2\n1',
          '5\n4\n3\n2\n1',
          'i=5; while i>=1: print(i); i-=1.',
          { topic: 'loops', starterCode: 'i = 5\n', language: 'python' }),
      ],
    },
    // ============ LECȚIA 8 ============
    {
      slug: 'for-range',
      title: '8. For + range()',
      isFree: false,
      theory: `# Bucla for

\`for\` parcurge o secvență de valori.

## range(n) — de la 0 la n-1
\`\`\`python
for i in range(5):
    print(i)   # 0, 1, 2, 3, 4
\`\`\`

## range(a, b) — de la a la b-1
\`\`\`python
for i in range(2, 6):
    print(i)   # 2, 3, 4, 5
\`\`\`

## range(a, b, pas)
\`\`\`python
for i in range(0, 10, 2):
    print(i)   # 0, 2, 4, 6, 8
\`\`\`

## Pas negativ (descrescător)
\`\`\`python
for i in range(10, 0, -1):
    print(i)   # 10, 9, ..., 1
\`\`\`
`,
      problems: [
        mc('Câte numere afișează range(5)?',
          'Câte iterații face `for i in range(5)`?',
          ['4', '5', '6', '0'],
          '5',
          '`range(5)` produce 0, 1, 2, 3, 4 — adică 5 valori.',
          { topic: 'loops' }),
        mc('Primul număr',
          'Care este prima valoare în `range(3, 8)`?',
          ['0', '3', '8', '7'],
          '3',
          '`range(start, stop)` începe de la start (inclusiv).',
          { topic: 'loops' }),
        mc('Ultima valoare',
          'Care este ultima valoare afișată de `for i in range(1, 5)`?',
          ['1', '4', '5', '6'],
          '4',
          '`range(1, 5)` exclude 5 — ultima valoare este 4.',
          { topic: 'loops' }),
        sa('Range descrescător',
          'Cum scrii `range()` care produce 10, 9, 8, ..., 1?',
          'range(10, 0, -1)',
          'Pas negativ: pornim de la 10, ne oprim înainte de 0, scădem cu 1.',
          { topic: 'loops', difficulty: 'MEDIUM' }),
        io('Suma cu for',
          'Calculează suma 1+2+...+100 folosind for.\n\nOutput: 5050',
          '5050',
          'for i in range(1, 101): s += i. Suma 1..100 = 5050.',
          { topic: 'loops', difficulty: 'MEDIUM',
            starterCode: 's = 0\n', language: 'python' }),
        io('Numere pare',
          'Afișează toate numerele pare de la 0 la 10 (inclusiv), pe linii separate.\n\nOutput:\n0\n2\n4\n6\n8\n10',
          '0\n2\n4\n6\n8\n10',
          '`for i in range(0, 11, 2): print(i)` — pas 2 garantează numere pare.',
          { topic: 'loops', starterCode: '', language: 'python' }),
      ],
    },
    // ============ LECȚIA 9 ============
    {
      slug: 'for-vs-while',
      title: '9. For vs While',
      isFree: false,
      theory: `# Când folosești for vs while?

## Folosește **for** când:
- Știi de la început câte iterații faci
- Parcurgi o listă, un string, range

\`\`\`python
for i in range(10):
    print(i)
\`\`\`

## Folosește **while** când:
- Nu știi câte iterații (depinde de input)
- Aștepți o condiție

\`\`\`python
while True:
    cmd = input("Comandă: ")
    if cmd == "exit":
        break
\`\`\`

## Echivalență
\`\`\`python
# for echivalent cu while
for i in range(5):
    print(i)
# echivalent cu:
i = 0
while i < 5:
    print(i)
    i += 1
\`\`\`
`,
      problems: [
        mc('Iterații cunoscute',
          'Pentru a parcurge numere de la 1 la 100, ce e mai potrivit?',
          ['for', 'while', 'if', 'break'],
          'for',
          'Când știm exact câte iterații, `for` cu `range()` e mai clar și mai sigur.',
          { topic: 'loops' }),
        mc('Așteaptă input',
          'Pentru a citi numere până utilizatorul scrie 0, ce e potrivit?',
          ['for', 'while', 'if', 'else'],
          'while',
          'Nu știm câte numere va scrie utilizatorul → folosim `while True` cu break.',
          { topic: 'loops' }),
        mc('Convertește for în while',
          'Care e echivalentul corect al `for i in range(3): print(i)`?',
          [
            'i=0; while i<=3: print(i); i+=1',
            'i=0; while i<3: print(i); i+=1',
            'i=1; while i<3: print(i); i+=1',
            'i=0; while i>3: print(i); i-=1',
          ],
          'i=0; while i<3: print(i); i+=1',
          '`range(3)` produce 0,1,2 — pornim de la 0, mergem cât timp i<3.',
          { topic: 'loops', difficulty: 'MEDIUM' }),
        io('Sumă până la 0',
          'Citește numere până la introducerea lui 0. Afișează suma lor (fără 0).\n\nInput:\n5\n3\n2\n0\n\nOutput: 10',
          '10',
          'Folosim while True, citim, dacă e 0 break, altfel adunăm la sumă.',
          { topic: 'loops', difficulty: 'MEDIUM',
            starterCode: 's = 0\n', language: 'python' }),
        io('Tabla înmulțirii cu 7',
          'Afișează tabla înmulțirii lui 7 (de la 7×1 la 7×10), câte un rezultat pe linie.\n\nOutput:\n7\n14\n21\n28\n35\n42\n49\n56\n63\n70',
          '7\n14\n21\n28\n35\n42\n49\n56\n63\n70',
          '`for i in range(1, 11): print(7*i)`.',
          { topic: 'loops', starterCode: '', language: 'python' }),
      ],
    },
    // ============ LECȚIA 10 ============
    {
      slug: 'nested-loops',
      title: '10. Bucle imbricate (nested loops)',
      isFree: false,
      theory: `# Bucle în bucle

Un \`for\` poate conține alt \`for\` — se numește **buclă imbricată**.

\`\`\`python
for i in range(3):
    for j in range(3):
        print(i, j)
\`\`\`

Output:
\`\`\`
0 0
0 1
0 2
1 0
1 1
1 2
2 0
2 1
2 2
\`\`\`

## Pattern triunghi
\`\`\`python
for i in range(1, 6):
    for j in range(i):
        print("*", end="")
    print()
\`\`\`
Output:
\`\`\`
*
**
***
****
*****
\`\`\`

## Tabla înmulțirii
\`\`\`python
for i in range(1, 11):
    for j in range(1, 11):
        print(i*j, end="\\t")
    print()
\`\`\`
`,
      problems: [
        mc('Câte print-uri?',
          'Câte print-uri face: `for i in range(3): for j in range(4): print()`?',
          ['7', '12', '3', '4'],
          '12',
          'Bucla externă face 3 iterații, fiecare conține 4 → 3·4 = 12 print-uri.',
          { topic: 'nested-loops', difficulty: 'MEDIUM' }),
        mc('end=""',
          'Ce face `print("*", end="")`?',
          ['Afișează * fără linie nouă', 'Adaugă o linie nouă în plus', 'Dă eroare', 'Afișează "*" și apoi END'],
          'Afișează * fără linie nouă',
          '`end=""` înlocuiește newline-ul implicit cu nimic — totul se afișează pe aceeași linie.',
          { topic: 'nested-loops', difficulty: 'MEDIUM' }),
        io('Pătrat de stele',
          'Afișează un pătrat de 4×4 stele (* fără spațiu).\n\nOutput:\n****\n****\n****\n****',
          '****\n****\n****\n****',
          'for i in range(4): for j in range(4): print("*", end=""); print().',
          { topic: 'nested-loops', difficulty: 'MEDIUM',
            starterCode: '', language: 'python' }),
        io('Triunghi de stele',
          'Afișează:\n\n*\n**\n***\n****\n*****',
          '*\n**\n***\n****\n*****',
          'for i in range(1, 6): for j in range(i): print("*", end=""); print().',
          { topic: 'nested-loops', difficulty: 'HARD',
            starterCode: '', language: 'python' }),
        io('Numere unei coloane',
          'Afișează (fiecare pe linie nouă) toate perechile (i, j) cu i de la 1 la 2 și j de la 1 la 2 sub forma `i j`.\n\nOutput:\n1 1\n1 2\n2 1\n2 2',
          '1 1\n1 2\n2 1\n2 2',
          'for i in range(1,3): for j in range(1,3): print(i, j).',
          { topic: 'nested-loops', difficulty: 'MEDIUM',
            starterCode: '', language: 'python' }),
      ],
    },
    // ============ LECȚIA 11 ============
    {
      slug: 'liste-introducere',
      title: '11. Liste (introducere)',
      isFree: false,
      theory: `# Liste în Python

O **listă** este o colecție ordonată de elemente.

\`\`\`python
fructe = ["mar", "banana", "para"]
numere = [1, 2, 3, 4, 5]
mixt = [1, "text", True, 3.14]
\`\`\`

## Acces la elemente (indexare de la 0)
\`\`\`python
fructe = ["mar", "banana", "para"]
print(fructe[0])   # mar
print(fructe[1])   # banana
print(fructe[-1])  # para (ultimul)
\`\`\`

## Modificare
\`\`\`python
fructe[1] = "kiwi"
print(fructe)  # ["mar", "kiwi", "para"]
\`\`\`

## Lungime
\`\`\`python
print(len(fructe))   # 3
\`\`\`
`,
      problems: [
        mc('Indexare',
          'Cu ce index începe primul element într-o listă?',
          ['1', '0', '-1', 'depinde'],
          '0',
          'În Python, indexarea începe de la **0**. Primul element are indexul 0.',
          { topic: 'lists' }),
        mc('Index negativ',
          'Ce returnează `lista[-1]`?',
          ['Primul element', 'Ultimul element', 'Eroare', 'O listă goală'],
          'Ultimul element',
          'Indexii negativi numără de la sfârșit: -1 = ultimul, -2 = penultimul.',
          { topic: 'lists' }),
        mc('Lungime',
          'Cum afli numărul de elemente dintr-o listă `l`?',
          ['size(l)', 'l.size', 'len(l)', 'l.len()'],
          'len(l)',
          'În Python folosim funcția `len()` pentru lungime.',
          { topic: 'lists' }),
        sa('Creează listă',
          'Scrie codul care creează o listă numită **n** cu elementele 1, 2, 3.',
          'n = [1, 2, 3]',
          'O listă se creează cu paranteze pătrate și elemente separate de virgulă.',
          { topic: 'lists' }),
        mc('Acces',
          'Care e `["a","b","c","d"][2]`?',
          ['"a"', '"b"', '"c"', '"d"'],
          '"c"',
          'Indexul 2 înseamnă al treilea element (numărăm de la 0).',
          { topic: 'lists' }),
      ],
    },
    // ============ LECȚIA 12 ============
    {
      slug: 'liste-operatii',
      title: '12. Liste — operații',
      isFree: false,
      theory: `# Operații pe liste

## Adăugare
\`\`\`python
l = [1, 2, 3]
l.append(4)        # [1, 2, 3, 4] — la final
l.insert(0, 0)     # [0, 1, 2, 3, 4] — la poziție
\`\`\`

## Ștergere
\`\`\`python
l.remove(2)    # șterge prima apariție a valorii 2
l.pop()        # scoate ultimul element
l.pop(0)       # scoate elementul de la index 0
del l[0]       # șterge elementul de la index 0
\`\`\`

## Sortare
\`\`\`python
l = [3, 1, 4, 1, 5, 9, 2, 6]
l.sort()             # crescător
l.sort(reverse=True) # descrescător
\`\`\`

## Verificare apartenență
\`\`\`python
if 5 in l:
    print("este în listă")
\`\`\`
`,
      problems: [
        mc('append',
          'Ce face `l.append(x)`?',
          ['Inserează x la început', 'Adaugă x la final', 'Înlocuiește ultimul element cu x', 'Sortează lista'],
          'Adaugă x la final',
          '`append()` adaugă elementul la sfârșitul listei.',
          { topic: 'lists' }),
        mc('pop',
          'Ce returnează `l.pop()` (fără argument)?',
          ['Primul element și-l șterge', 'Ultimul element și-l șterge', 'Lungimea listei', 'O listă goală'],
          'Ultimul element și-l șterge',
          '`pop()` fără argument scoate și returnează ultimul element.',
          { topic: 'lists' }),
        mc('sort',
          'Ce face `l.sort()`?',
          ['Returnează o listă sortată', 'Sortează lista pe loc', 'Inversează lista', 'Eroare'],
          'Sortează lista pe loc',
          '`sort()` modifică lista existentă, nu returnează nimic (None).',
          { topic: 'lists', difficulty: 'MEDIUM' }),
        mc('in',
          'Ce returnează `3 in [1, 2, 3]`?',
          ['True', 'False', '3', 'Eroare'],
          'True',
          'Operatorul `in` verifică dacă elementul există în listă.',
          { topic: 'lists' }),
        sa('Inserare',
          'Scrie metoda care adaugă valoarea 99 la finalul listei `l`.',
          'l.append(99)',
          '`append()` este metoda standard pentru adăugare la final.',
          { topic: 'lists' }),
      ],
    },
    // ============ LECȚIA 13 ============
    {
      slug: 'liste-loop',
      title: '13. Liste + loop',
      isFree: false,
      theory: `# Parcurgerea unei liste

## Cu for direct pe elemente
\`\`\`python
fructe = ["mar", "banana", "para"]
for f in fructe:
    print(f)
\`\`\`

## Cu indici
\`\`\`python
for i in range(len(fructe)):
    print(i, fructe[i])
\`\`\`

## Cu enumerate (cel mai elegant)
\`\`\`python
for i, f in enumerate(fructe):
    print(i, f)
\`\`\`

## Filtrare
\`\`\`python
numere = [1, 2, 3, 4, 5, 6]
pare = []
for n in numere:
    if n % 2 == 0:
        pare.append(n)
print(pare)   # [2, 4, 6]
\`\`\`
`,
      problems: [
        mc('Parcurgere',
          'Ce afișează: `for x in [10, 20, 30]: print(x)`?',
          ['0 1 2', '10 20 30 (pe linii)', '60', '[10,20,30]'],
          '10 20 30 (pe linii)',
          'For-ul iterează direct prin elemente și fiecare se afișează pe linie nouă.',
          { topic: 'lists' }),
        io('Suma listei',
          'Citește 5 numere și afișează suma lor.\n\nInput:\n1\n2\n3\n4\n5\n\nOutput: 15',
          '15',
          'Citim 5 numere într-o listă, apoi `sum(lista)` sau parcurgem cu for.',
          { topic: 'lists', difficulty: 'MEDIUM',
            starterCode: 'l = []\nfor _ in range(5):\n    l.append(int(input()))\n',
            language: 'python' }),
        io('Numere pare',
          'Citește 5 numere și afișează doar cele pare (pe linii).\n\nInput:\n1\n2\n3\n4\n5\n\nOutput:\n2\n4',
          '2\n4',
          'Pentru fiecare număr citit, dacă n%2==0, îl afișăm.',
          { topic: 'lists', difficulty: 'MEDIUM',
            starterCode: '', language: 'python' }),
        mc('enumerate',
          'Ce face `enumerate(lista)`?',
          ['Sortează lista', 'Returnează (index, valoare) pentru fiecare element', 'Numără elementele', 'Inversează'],
          'Returnează (index, valoare) pentru fiecare element',
          '`enumerate` returnează perechi (index, element) — util când ai nevoie și de poziție.',
          { topic: 'lists', difficulty: 'MEDIUM' }),
        sa('Numără elemente',
          'Care funcție returnează numărul de elemente dintr-o listă?',
          'len',
          '`len(lista)` returnează numărul de elemente.',
          { topic: 'lists' }),
      ],
    },
    // ============ LECȚIA 14 ============
    {
      slug: 'algoritmi-simpli',
      title: '14. Algoritmi simpli',
      isFree: false,
      theory: `# Algoritmi de bază pe liste

## Maxim
\`\`\`python
l = [3, 1, 4, 1, 5, 9, 2]
max_v = l[0]
for x in l:
    if x > max_v:
        max_v = x
print(max_v)   # 9
\`\`\`
Sau direct: \`max(l)\`.

## Minim
\`\`\`python
min_v = l[0]
for x in l:
    if x < min_v:
        min_v = x
\`\`\`
Sau: \`min(l)\`.

## Sumă
\`\`\`python
s = 0
for x in l:
    s += x
\`\`\`
Sau: \`sum(l)\`.

## Căutare liniară
\`\`\`python
def cauta(l, x):
    for i, v in enumerate(l):
        if v == x:
            return i
    return -1   # nu s-a găsit
\`\`\`
`,
      problems: [
        mc('Funcția max()',
          'Ce returnează `max([3, 1, 7, 2])`?',
          ['3', '1', '7', '13'],
          '7',
          '`max()` returnează cel mai mare element din listă.',
          { topic: 'algorithms' }),
        mc('Funcția sum()',
          'Cât e `sum([1, 2, 3, 4])`?',
          ['10', '4', '24', '1234'],
          '10',
          '1+2+3+4 = 10. `sum()` adună toate elementele.',
          { topic: 'algorithms' }),
        mc('Căutare nu există',
          'Ce returnează căutarea liniară când elementul nu există în listă (convențional)?',
          ['0', '-1', 'None', 'Eroare'],
          '-1',
          'Convenția este să returnăm -1 (un index invalid) când elementul nu se găsește.',
          { topic: 'algorithms', difficulty: 'MEDIUM' }),
        io('Maxim manual',
          'Citește 5 numere și afișează maximul (FĂRĂ a folosi max()).\n\nInput:\n3\n7\n2\n9\n1\n\nOutput: 9',
          '9',
          'Inițializăm max_v cu primul, apoi pentru fiecare număr verificăm dacă e mai mare.',
          { topic: 'algorithms', difficulty: 'MEDIUM',
            starterCode: '', language: 'python' }),
        io('Numără pozitivi',
          'Citește 5 numere și afișează câte sunt strict pozitive.\n\nInput:\n3\n-2\n0\n7\n-1\n\nOutput: 2',
          '2',
          'Inițializăm count=0, pentru fiecare număr citit dacă > 0 incrementăm.',
          { topic: 'algorithms', difficulty: 'MEDIUM',
            starterCode: 'count = 0\n', language: 'python' }),
      ],
    },
    // ============ LECȚIA 15 ============
    {
      slug: 'string-uri',
      title: '15. String-uri',
      isFree: false,
      theory: `# Lucrul cu string-uri

## Slicing
\`\`\`python
s = "Python"
print(s[0])      # P
print(s[-1])     # n
print(s[0:3])    # Pyt
print(s[2:])     # thon
print(s[::-1])   # nohtyP (inversat)
\`\`\`

## Metode utile
\`\`\`python
s = "Hello World"
s.lower()             # "hello world"
s.upper()             # "HELLO WORLD"
s.replace("l", "x")   # "Hexxo Worxd"
s.split(" ")          # ["Hello", "World"]
len(s)                # 11
"World" in s          # True
\`\`\`

## Concatenare și f-string
\`\`\`python
nume = "Ana"
print("Salut, " + nume)
print(f"Salut, {nume}!")
\`\`\`
`,
      problems: [
        mc('Slicing',
          'Ce returnează `"Python"[1:4]`?',
          ['Pyt', 'yth', 'ytho', 'Pyth'],
          'yth',
          'Slicing [1:4] înseamnă de la indexul 1 (inclusiv) până la 4 (exclusiv) → y, t, h.',
          { topic: 'strings', difficulty: 'MEDIUM' }),
        mc('upper()',
          'Ce returnează `"abc".upper()`?',
          ['ABC', 'abc', 'Abc', 'aBC'],
          'ABC',
          '`upper()` transformă tot string-ul în majuscule.',
          { topic: 'strings' }),
        mc('replace',
          'Ce returnează `"abc".replace("a", "x")`?',
          ['xbc', 'abc', 'axx', 'Eroare'],
          'xbc',
          '`replace(a, b)` înlocuiește toate aparițiile lui a cu b.',
          { topic: 'strings' }),
        mc('Inversare',
          'Cum inversezi string-ul `s`?',
          ['s.reverse()', 's[::-1]', 'reverse(s)', 's.invert()'],
          's[::-1]',
          'Slicing cu pas -1 parcurge invers și creează un string inversat.',
          { topic: 'strings', difficulty: 'MEDIUM' }),
        sa('Lungime',
          'Care funcție returnează lungimea unui string?',
          'len',
          '`len(s)` returnează numărul de caractere.',
          { topic: 'strings' }),
        io('Salut personalizat',
          'Citește un nume și afișează: "Salut, NUME!"\n\nInput: Maria\nOutput: Salut, Maria!',
          'Salut, Maria!',
          'Folosim f-string: `print(f"Salut, {nume}!")`.',
          { topic: 'strings', difficulty: 'MEDIUM',
            starterCode: 'nume = input()\n', language: 'python' }),
      ],
    },
    // ============ LECȚIA 16 ============
    {
      slug: 'dictionare',
      title: '16. Dicționare',
      isFree: false,
      theory: `# Dicționare (key → value)

Un **dicționar** stochează perechi cheie-valoare.

\`\`\`python
elev = {
    "nume": "Ana",
    "varsta": 12,
    "clasa": 6
}
\`\`\`

## Acces
\`\`\`python
print(elev["nume"])      # Ana
print(elev.get("nume"))  # Ana
print(elev.get("xyz", "necunoscut"))  # default
\`\`\`

## Modificare / adăugare
\`\`\`python
elev["varsta"] = 13      # modifică
elev["scoala"] = "X"     # adaugă
\`\`\`

## Ștergere
\`\`\`python
del elev["clasa"]
\`\`\`

## Parcurgere
\`\`\`python
for cheie, valoare in elev.items():
    print(cheie, "=", valoare)
\`\`\`
`,
      problems: [
        mc('Acces',
          'Cum acceși valoarea cheii "nume" din dicționarul `d`?',
          ['d.nume', 'd[0]', 'd["nume"]', 'd.get(0)'],
          'd["nume"]',
          'Folosim parantezele pătrate cu cheia: `d["nume"]`.',
          { topic: 'dicts' }),
        mc('Adăugare',
          'Cum adaugi cheia "x" cu valoarea 5 în dicționarul `d`?',
          ['d.add("x", 5)', 'd["x"] = 5', 'd.append(("x", 5))', 'd.x = 5'],
          'd["x"] = 5',
          'Atribuirea la o cheie nouă o adaugă automat.',
          { topic: 'dicts' }),
        mc('get vs []',
          'Care e diferența dintre `d["x"]` și `d.get("x")` când "x" nu există?',
          ['Ambele dau eroare', '[] dă eroare, get returnează None', 'Niciuna nu dă eroare', 'get dă eroare'],
          '[] dă eroare, get returnează None',
          '`d["x"]` aruncă KeyError, `d.get("x")` returnează `None` (sau valoarea default).',
          { topic: 'dicts', difficulty: 'MEDIUM' }),
        sa('Ștergere',
          'Cu ce instrucțiune ștergi cheia "y" din `d`?',
          'del d["y"]',
          'Folosim `del` urmat de elementul de șters.',
          { topic: 'dicts', difficulty: 'MEDIUM' }),
        mc('Iterare',
          'Ce returnează `d.items()`?',
          ['Doar cheile', 'Doar valorile', 'Perechi (cheie, valoare)', 'Eroare'],
          'Perechi (cheie, valoare)',
          '`items()` returnează perechi cheie-valoare, util pentru iterare.',
          { topic: 'dicts' }),
      ],
    },
    // ============ LECȚIA 17 ============
    {
      slug: 'functii-basic',
      title: '17. Funcții (basic)',
      isFree: false,
      theory: `# Funcții — reutilizarea codului

\`\`\`python
def saluta(nume):
    print("Salut,", nume)

saluta("Ana")
saluta("Ion")
\`\`\`

## Cu return
\`\`\`python
def patrat(x):
    return x * x

rez = patrat(5)   # 25
\`\`\`

## Mai mulți parametri
\`\`\`python
def aduna(a, b):
    return a + b

print(aduna(3, 7))   # 10
\`\`\`

## Parametri default
\`\`\`python
def saluta(nume="prietene"):
    print("Salut,", nume)

saluta()             # Salut, prietene
saluta("Ana")        # Salut, Ana
\`\`\`
`,
      problems: [
        mc('Cuvânt cheie',
          'Cu ce cuvânt cheie definești o funcție în Python?',
          ['function', 'def', 'fn', 'func'],
          'def',
          'În Python, funcțiile se definesc cu `def`.',
          { topic: 'functions' }),
        mc('return',
          'Ce face `return`?',
          ['Afișează rezultatul', 'Returnează o valoare din funcție', 'Repornește funcția', 'Iese din program'],
          'Returnează o valoare din funcție',
          '`return` trimite o valoare înapoi la cel care a apelat funcția.',
          { topic: 'functions' }),
        mc('Funcție fără return',
          'Ce returnează implicit o funcție fără `return`?',
          ['0', '""', 'None', 'Eroare'],
          'None',
          'Dacă nu există `return`, funcția returnează automat `None`.',
          { topic: 'functions', difficulty: 'MEDIUM' }),
        sa('Definire simplă',
          'Definește o funcție numită `dublu(x)` care returnează x * 2 (scrie corpul complet, fără indentare extra).',
          'def dublu(x):\n    return x * 2',
          'Folosim def, parametru x, și return cu expresia.',
          { topic: 'functions', difficulty: 'MEDIUM' }),
        io('Sumă cu funcție',
          'Definește o funcție `aduna(a, b)` care returnează suma. Apoi citește 2 numere și afișează rezultatul.\n\nInput:\n3\n7\n\nOutput: 10',
          '10',
          'def aduna(a,b): return a+b. Apoi a=int(input()); b=int(input()); print(aduna(a,b)).',
          { topic: 'functions', difficulty: 'MEDIUM',
            starterCode: 'def aduna(a, b):\n    pass\n',
            language: 'python' }),
      ],
    },
    // ============ LECȚIA 18 ============
    {
      slug: 'functii-avansat',
      title: '18. Funcții (avansat)',
      isFree: false,
      theory: `# Funcții avansate

## Funcții care apelează alte funcții
\`\`\`python
def patrat(x):
    return x * x

def suma_patrate(a, b):
    return patrat(a) + patrat(b)

print(suma_patrate(3, 4))   # 9 + 16 = 25
\`\`\`

## Variabile locale vs globale
\`\`\`python
x = 10   # global

def test():
    x = 5   # local — nu modifică globala
    print(x)

test()    # 5
print(x)  # 10
\`\`\`

## Recursivitate (funcție ce se cheamă pe sine)
\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120
\`\`\`
`,
      problems: [
        mc('Variabilă locală',
          'Ce se întâmplă cu o variabilă declarată într-o funcție?',
          ['Există în tot programul', 'Există doar în funcție', 'Devine globală automat', 'Dă eroare'],
          'Există doar în funcție',
          'Variabilele declarate într-o funcție sunt **locale** — există doar pe durata execuției ei.',
          { topic: 'functions', difficulty: 'MEDIUM' }),
        mc('factorial(3)',
          'Cât e factorial(3) folosind formula factorială?',
          ['3', '6', '9', '27'],
          '6',
          '3! = 3·2·1 = 6.',
          { topic: 'functions', difficulty: 'MEDIUM' }),
        mc('Recursivitate',
          'Ce trebuie să aibă orice funcție recursivă?',
          ['Un loop while', 'Un caz de bază (oprire)', 'Două funcții', 'Argumente default'],
          'Un caz de bază (oprire)',
          'Fără caz de bază, recursivitatea ar continua la infinit (stack overflow).',
          { topic: 'functions', difficulty: 'HARD' }),
        sa('Apel funcție',
          'Cum apelezi funcția `dublu(5)`? Scrie expresia.',
          'dublu(5)',
          'Numele funcției urmat de paranteze cu argumentele.',
          { topic: 'functions' }),
        io('Cub',
          'Definește funcția `cub(x)` care returnează x³. Citește un număr și afișează cubul.\n\nInput: 3\nOutput: 27',
          '27',
          'def cub(x): return x**3.',
          { topic: 'functions', difficulty: 'MEDIUM',
            starterCode: 'def cub(x):\n    pass\n',
            language: 'python' }),
      ],
    },
    // ============ LECȚIA 19 ============
    {
      slug: 'erori-try-except',
      title: '19. Erori (try/except)',
      isFree: false,
      theory: `# Tratarea erorilor

\`\`\`python
try:
    n = int(input("Număr: "))
    print(10 / n)
except ValueError:
    print("Nu e număr!")
except ZeroDivisionError:
    print("Nu poți împărți la 0!")
\`\`\`

## except generic
\`\`\`python
try:
    # cod periculos
    pass
except Exception as e:
    print("Eroare:", e)
\`\`\`

## finally — rulează indiferent
\`\`\`python
try:
    f = open("a.txt")
except:
    print("Nu pot deschide")
finally:
    print("Gata!")
\`\`\`

## Validare input
\`\`\`python
while True:
    try:
        n = int(input())
        break
    except ValueError:
        print("Mai încearcă!")
\`\`\`
`,
      problems: [
        mc('Cuvânt cheie',
          'Ce cuvânt cheie introduce blocul de cod care poate da eroare?',
          ['catch', 'try', 'error', 'handle'],
          'try',
          'În Python, blocul "periculos" se pune în `try`, iar erorile se prind în `except`.',
          { topic: 'errors' }),
        mc('Tip eroare',
          'Ce eroare apare la `int("abc")`?',
          ['TypeError', 'ValueError', 'NameError', 'SyntaxError'],
          'ValueError',
          '`int()` aruncă `ValueError` când string-ul nu reprezintă un număr valid.',
          { topic: 'errors', difficulty: 'MEDIUM' }),
        mc('Împărțire la 0',
          'Ce eroare apare la `10/0`?',
          ['ZeroDivisionError', 'MathError', 'ValueError', 'OverflowError'],
          'ZeroDivisionError',
          'Python aruncă `ZeroDivisionError` la împărțirea unui număr la 0.',
          { topic: 'errors' }),
        mc('finally',
          'Când rulează blocul `finally`?',
          ['Doar când nu e eroare', 'Doar când e eroare', 'Întotdeauna', 'Niciodată'],
          'Întotdeauna',
          '`finally` rulează mereu — și pe cazul cu eroare și pe cazul fără.',
          { topic: 'errors', difficulty: 'MEDIUM' }),
        sa('Catch generic',
          'Care clasă prinde **orice** tip de eroare? (un singur cuvânt)',
          'Exception',
          '`except Exception` prinde orice eroare standard.',
          { topic: 'errors', difficulty: 'MEDIUM' }),
      ],
    },
    // ============ LECȚIA 20 ============
    {
      slug: 'oop-introducere',
      title: '20. OOP (Introducere)',
      isFree: false,
      theory: `# Programare orientată pe obiecte

O **clasă** este un șablon. Un **obiect** este o instanță a unei clase.

\`\`\`python
class Elev:
    def __init__(self, nume, varsta):
        self.nume = nume
        self.varsta = varsta

    def saluta(self):
        print(f"Salut, sunt {self.nume}")

# Creăm obiecte
ana = Elev("Ana", 12)
ion = Elev("Ion", 13)

ana.saluta()      # Salut, sunt Ana
print(ion.varsta) # 13
\`\`\`

## __init__ — constructorul
Se apelează automat la crearea obiectului.

## self
Reprezintă **obiectul curent** — primul parametru în orice metodă.

## Atribute
Variabile asociate obiectului: \`obiect.atribut\`.

## Metode
Funcții asociate clasei: \`obiect.metoda()\`.
`,
      problems: [
        mc('Cuvânt cheie',
          'Cu ce cuvânt cheie definești o clasă?',
          ['object', 'class', 'def', 'new'],
          'class',
          'Clasele se definesc cu `class NumeClasa:`.',
          { topic: 'oop' }),
        mc('__init__',
          'La ce servește `__init__`?',
          ['Distruge obiectul', 'Inițializează un obiect nou', 'Definește o metodă privată', 'Sortează atributele'],
          'Inițializează un obiect nou',
          '`__init__` este **constructorul** — se apelează automat la crearea instanței.',
          { topic: 'oop', difficulty: 'MEDIUM' }),
        mc('self',
          'Ce reprezintă `self`?',
          ['Clasa', 'Obiectul curent', 'O variabilă globală', 'Modulul'],
          'Obiectul curent',
          '`self` se referă la instanța curentă pe care se apelează metoda.',
          { topic: 'oop', difficulty: 'MEDIUM' }),
        sa('Creare obiect',
          'Cum creezi un obiect din clasa `Cat` cu numele "Tom"? (Clasa primește un parametru `nume`)',
          'Cat("Tom")',
          'Apelăm clasa ca pe o funcție: `Cat("Tom")` declanșează `__init__`.',
          { topic: 'oop', difficulty: 'MEDIUM' }),
        mc('Acces atribut',
          'Cum acceși atributul `nume` al obiectului `e`?',
          ['e->nume', 'e.nume', 'e[nume]', 'e::nume'],
          'e.nume',
          'În Python, accesăm atributele cu **punct**: `obiect.atribut`.',
          { topic: 'oop' }),
      ],
    },
  ],
}
