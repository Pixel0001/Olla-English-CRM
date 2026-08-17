// Conținut enriched pentru lecțiile Python — explicat ca pentru elevi de 9-10 ani
// Fiecare cheie = slug-ul lecției. Conține teoria EXTINSĂ (înlocuiește) + probleme SUPLIMENTARE (adaugă)

import { mc, sa, io } from './helpers.mjs'

export const pythonEnriched = {

  // ============ LECȚIA 1 ============
  'introducere-print': {
    theory: `# 🐍 Bun venit în Python!

## Ce este programarea?

Imaginează-ți că ai un **robot magic** care face **exact** ce îi spui. Programarea înseamnă să **scrii instrucțiuni** pentru acest robot. Robotul nostru se numește **Python** 🐍.

> 💡 Numele "Python" vine de la o emisiune de comedie britanică pe care o iubea autorul, **NU** de la șarpele python!

## De ce Python?

Python este folosit de **toată lumea**:
- 🎬 **Netflix** îl folosește să-ți recomande filme
- 🚀 **NASA** îl folosește pentru rachete
- 🤖 **Google** îl folosește pentru inteligență artificială
- 🎮 **Multe jocuri** sunt scrise în Python

## Prima ta comandă: \`print()\`

\`print()\` este ca un **microfon** pentru robot — îl pui să spună ceva pe ecran.

\`\`\`python
print("Salut, lume!")
\`\`\`

Ce face computerul când vede asta?
1. Vede cuvântul \`print\` → înțelege "trebuie să afișez ceva"
2. Vede \`(\` → "începe ce trebuie afișat"
3. Vede \`"Salut, lume!"\` → "asta e mesajul"
4. Vede \`)\` → "gata, afișează acum"

**Rezultat pe ecran:**
\`\`\`
Salut, lume!
\`\`\`

## 🎯 Reguli importante

### 1. Ghilimelele sunt obligatorii pentru text
\`\`\`python
print("Salut")     # ✅ corect
print(Salut)       # ❌ EROARE! Python crede că Salut e o variabilă
\`\`\`

### 2. Ghilimele duble SAU simple — la fel
\`\`\`python
print("Buna")      # ✅ funcționează
print('Buna')      # ✅ funcționează LA FEL
\`\`\`

### 3. Numerele NU au ghilimele
\`\`\`python
print(42)          # ✅ afișează: 42
print(3.14)        # ✅ afișează: 3.14
print("42")        # ✅ afișează: 42 (dar e text, nu număr!)
\`\`\`

## 🎨 Mai multe lucruri într-un singur \`print()\`

Poți afișa mai multe valori separate cu **virgulă**:

\`\`\`python
print("Vârsta mea este", 12, "ani")
\`\`\`

**Output:**
\`\`\`
Vârsta mea este 12 ani
\`\`\`

> 🔍 Observă: Python pune **automat un spațiu** între ele!

## 🌈 Print pe mai multe linii

Fiecare \`print()\` afișează pe o linie nouă:

\`\`\`python
print("Mă numesc Ana")
print("Am 11 ani")
print("Iubesc Python!")
\`\`\`

**Output:**
\`\`\`
Mă numesc Ana
Am 11 ani
Iubesc Python!
\`\`\`

## ⚠️ Greșeli frecvente

- **\`Print("hi")\`** — Corect: \`print("hi")\` • De ce: Python e **case-sensitive** — minusculă!
- **\`print("hi)\`** — Corect: \`print("hi")\` • De ce: Lipsește ghilimea de închidere
- **\`print"hi"\`** — Corect: \`print("hi")\` • De ce: Lipsesc parantezele
- **\`print(hi)\`** — Corect: \`print("hi")\` • De ce: Lipsesc ghilimelele

## 🎓 Ce ai învățat
- ✅ Ce este Python și de ce e important
- ✅ Funcția \`print()\` afișează text/numere
- ✅ Textul are nevoie de ghilimele, numerele NU
- ✅ Poți afișa multe lucruri cu virgulă
- ✅ Fiecare \`print()\` = linie nouă

## 🎮 Mini-provocare
Încearcă mental: ce afișează codul de mai jos?
\`\`\`python
print("Numele meu:", "Maria")
print(2026)
print("Pa!")
\`\`\`

<details>
<summary>Răspuns 👇</summary>

\`\`\`
Numele meu: Maria
2026
Pa!
\`\`\`
</details>
`,
    extraProblems: [
      mc('Linie nouă',
        'Câte linii afișează codul: `print("a")\\nprint("b")\\nprint("c")`?',
        ['1', '2', '3', '6'],
        '3',
        'Fiecare apel `print()` afișează rezultatul pe o linie nouă. Avem 3 print-uri → 3 linii.',
        { topic: 'print', difficulty: 'EASY' }),
      mc('Eroare de sintaxă',
        'Care din liniile de mai jos va da EROARE?',
        ['print("Salut")', 'print(42)', 'print(Salut)', 'print("42")'],
        'print(Salut)',
        '`print(Salut)` dă eroare pentru că Python crede că `Salut` este o variabilă (care nu există). Pentru text trebuie ghilimele!',
        { topic: 'print', difficulty: 'EASY' }),
      sa('Afișează propriul nume',
        'Scrie comanda care afișează cuvântul **Maria**.',
        'print("Maria")',
        'Folosim `print()` cu textul între ghilimele duble (sau simple).',
        { topic: 'print' }),
      mc('Spațiul automat',
        'Ce afișează `print("Salut", "Maria")`?',
        ['SalutMaria', 'Salut Maria', 'Salut, Maria', 'Salut\\nMaria'],
        'Salut Maria',
        'Când transmiți argumente separate cu virgulă, Python pune **un spațiu** între ele automat.',
        { topic: 'print' }),
      sa('Două valori',
        'Scrie comanda care afișează: **Anul 2026** (folosind virgulă pentru a separa textul de număr)',
        'print("Anul", 2026)',
        '`print("Anul", 2026)` — Python pune automat un spațiu între cele două valori.',
        { topic: 'print', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ LECȚIA 2 ============
  'variabile-tipuri': {
    theory: `# 📦 Variabile — cutiuțele cu valori

## Ce este o variabilă?

O **variabilă** este ca o **cutiuță cu etichetă** unde păstrezi ceva. Pe etichetă scrii numele, iar înăuntru pui valoarea.

\`\`\`python
nume = "Ana"
\`\`\`

🎯 **Ce s-a întâmplat?**
- Am creat o cutiuță numită \`nume\`
- Am pus în ea textul \`"Ana"\`

Acum, oriunde vrei să folosești "Ana", folosești \`nume\`:

\`\`\`python
nume = "Ana"
print(nume)              # afișează: Ana
print("Salut,", nume)    # afișează: Salut, Ana
\`\`\`

## 🎨 Cele 4 tipuri de date principale

### 1️⃣ Numere întregi — \`int\`
\`\`\`python
varsta = 12
elevi_in_clasa = 25
temperatura = -5
\`\`\`
Sunt numere **fără virgulă** — pot fi pozitive, negative sau zero.

### 2️⃣ Numere cu virgulă — \`float\`
\`\`\`python
inaltime = 1.55
pret = 9.99
pi = 3.14159
\`\`\`
Sunt numere **cu virgulă** (în programare folosim **punctul** \`.\`, nu virgula!).

### 3️⃣ Text — \`str\` (string)
\`\`\`python
nume = "Maria"
oras = 'Chișinău'
mesaj = "Bună ziua!"
\`\`\`
Orice este **între ghilimele** este text.

### 4️⃣ Adevărat/Fals — \`bool\` (boolean)
\`\`\`python
elev = True
profesor = False
e_zi_de_nastere = False
\`\`\`
Doar **două valori posibile**: \`True\` sau \`False\` (cu majusculă!).

## 🎭 Cum verifici tipul cu \`type()\`

\`\`\`python
x = 42
print(type(x))       # <class 'int'>

y = 3.14
print(type(y))       # <class 'float'>

z = "Salut"
print(type(z))       # <class 'str'>
\`\`\`

## 📝 Reguli pentru numele variabilelor

### ✅ Permis:
\`\`\`python
nume = "Ana"           # literă mică — recomandat
varsta_elev = 11       # underscore între cuvinte
_intern = 5            # poate începe cu underscore
nume2 = "Bob"          # cifre la sfârșit OK
\`\`\`

### ❌ INTERZIS:
\`\`\`python
2nume = "Ana"          # ❌ NU începe cu cifră!
nume elev = "Ana"      # ❌ NU spațiu!
nume-elev = "Ana"      # ❌ NU minus!
print = "ceva"         # ⚠️ NU folosi nume rezervate!
\`\`\`

## 🔥 Case-sensitive — atenție!

Python **face diferență** între litere mari și mici:

\`\`\`python
nume = "Ana"
Nume = "Maria"
NUME = "Bob"
print(nume)  # afișează: Ana
print(Nume)  # afișează: Maria
print(NUME)  # afișează: Bob
\`\`\`
> Sunt **3 variabile diferite**, deși seamănă!

## 🔄 Schimbarea valorii

O variabilă poate fi **schimbată** oricând:

\`\`\`python
scor = 0
print(scor)           # 0

scor = 10
print(scor)           # 10

scor = scor + 5       # adaugă 5 la ce avea
print(scor)           # 15
\`\`\`

## 🎁 Mai multe variabile odată

\`\`\`python
a, b, c = 1, 2, 3
print(a, b, c)        # afișează: 1 2 3

# sau toate la fel:
x = y = z = 0
\`\`\`

## ⚠️ Capcană: int vs str

\`\`\`python
a = 5         # int — un număr
b = "5"       # str — un text!
print(a + a)  # 10 (adunare)
print(b + b)  # 55 (alipire de text!)
\`\`\`

## 🎓 Ce ai învățat
- ✅ Variabilele sunt cutiuțe cu valori
- ✅ Cele 4 tipuri: \`int\`, \`float\`, \`str\`, \`bool\`
- ✅ \`type()\` îți spune ce tip are o valoare
- ✅ Numele cu litere/underscore, **fără spații/cifre la început**
- ✅ \`Nume\` ≠ \`nume\` (case-sensitive)
- ✅ Valoarea unei variabile poate fi schimbată
`,
    extraProblems: [
      mc('Tip bool',
        'Ce tip are valoarea `True`?',
        ['int', 'str', 'bool', 'float'],
        'bool',
        '`True` și `False` sunt valori booleene — tipul `bool`. Atenție: cu majusculă!',
        { topic: 'variables' }),
      sa('Schimbare valoare',
        'Dacă avem `x = 10` și apoi scriem `x = x + 5`, ce valoare are `x` la final?',
        '15',
        'La `x = x + 5`, Python calculează partea dreaptă (10 + 5 = 15) și pune rezultatul în x.',
        { topic: 'variables', difficulty: 'MEDIUM' }),
      mc('Concatenare vs adunare',
        'Ce afișează: `print("3" + "4")`?',
        ['7', '34', '"34"', 'Eroare'],
        '34',
        'Cu ghilimele, `"3"` și `"4"` sunt **string-uri**. `+` între string-uri le **alipește** → `"34"`.',
        { topic: 'variables', difficulty: 'MEDIUM' }),
      sa('Boolean fals',
        'Cum scrii valoarea booleană "fals" în Python? (un singur cuvânt)',
        'False',
        'În Python `False` se scrie cu **F mare** la început, restul minuscule.',
        { topic: 'variables' }),
      mc('Variabilă invalidă',
        'Care nume de variabilă este INVALID?',
        ['nume_meu', '_total', 'numar1', 'nume meu'],
        'nume meu',
        'Numele de variabile **nu pot conține spații**. Folosește underscore: `nume_meu`.',
        { topic: 'variables' }),
      sa('Multi-asignare',
        'Scrie o linie care creează 3 variabile `a`, `b`, `c` cu valorile 1, 2, 3 (separate prin virgulă).',
        'a, b, c = 1, 2, 3',
        'Sintaxa multi-asignare: `nume1, nume2, nume3 = val1, val2, val3`.',
        { topic: 'variables', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ LECȚIA 3 ============
  'input-conversii': {
    theory: `# 🎤 Citirea datelor de la utilizator

Până acum, programele noastre **doar afișau** lucruri. Acum vom învăța să **întrebăm utilizatorul** ce vrea!

## Funcția \`input()\`

\`input()\` **așteaptă** ca utilizatorul să scrie ceva și apasă Enter, apoi îți dă ce a scris.

\`\`\`python
nume = input("Cum te cheamă? ")
print("Salut,", nume)
\`\`\`

**Ce se întâmplă pas cu pas:**
1. Computerul afișează: \`Cum te cheamă? \`
2. Așteaptă să scrii ceva
3. Tu scrii: \`Maria\` și apeși Enter
4. Variabila \`nume\` primește valoarea \`"Maria"\`
5. Se afișează: \`Salut, Maria\`

## ⚠️ ATENȚIE — Capcana mare!

\`input()\` returnează **MEREU UN STRING** (text)! Chiar dacă utilizatorul scrie un număr!

\`\`\`python
varsta = input("Câți ani ai? ")
# Tu scrii: 12
print(varsta + 1)
# 💥 EROARE!  Nu poți aduna un text cu un număr!
\`\`\`

**De ce eroare?** Pentru că \`varsta\` este \`"12"\` (text), nu \`12\` (număr)!

## 🔧 Conversii — transformări de tipuri

Avem **3 funcții magice** pentru conversii:

- **\`int()\`** — Ce face: text/float → întreg • Exemplu: \`int("42") = 42\`
- **\`float()\`** — Ce face: text/int → cu virgulă • Exemplu: \`float("3.14") = 3.14\`
- **\`str()\`** — Ce face: orice → text • Exemplu: \`str(42) = "42"\`

### Exemple:
\`\`\`python
# Text "42" → număr 42
n = int("42")
print(n + 1)        # 43 ✅

# Text "3.14" → număr cu virgulă
p = float("3.14")
print(p * 2)        # 6.28 ✅

# Număr 100 → text "100"
s = str(100)
print(s + " puncte")  # 100 puncte ✅
\`\`\`

## 🎯 Pattern: input + conversie pe aceeași linie

Acesta e un truc **foarte folosit**:

\`\`\`python
varsta = int(input("Câți ani ai? "))
print("Anul viitor vei avea", varsta + 1, "ani")
\`\`\`

**Cum funcționează?**
1. \`input()\` întreabă și primește text \`"12"\`
2. \`int(...)\` îl transformă în număr \`12\`
3. Se salvează în variabila \`varsta\`

## 💡 Exemple practice

### Calcul vârstă peste 10 ani
\`\`\`python
varsta = int(input("Câți ani ai? "))
print("Peste 10 ani vei avea", varsta + 10, "ani")
\`\`\`

### Suma a două numere
\`\`\`python
a = int(input("Primul număr: "))
b = int(input("Al doilea număr: "))
print("Suma este:", a + b)
\`\`\`

### Numele complet
\`\`\`python
prenume = input("Prenume: ")
nume = input("Nume de familie: ")
print("Salut,", prenume, nume)
\`\`\`

### Conversie greșită
\`\`\`python
n = int(input("Număr: "))
# Dacă utilizatorul scrie "abc" → 💥 EROARE!
\`\`\`

## 🛡️ Atenție la \`int()\` cu virgulă

\`\`\`python
int("3.14")    # 💥 EROARE!
int(3.14)      # 3 (taie virgula)
float("3.14")  # 3.14 ✅
\`\`\`

## ⚡ Trucuri utile

### Mesaj cu newline
\`\`\`python
nume = input("Numele tău:\\n> ")
\`\`\`
Afișează:
\`\`\`
Numele tău:
> 
\`\`\`

### Întrebare yes/no
\`\`\`python
raspuns = input("Vrei să continui? (da/nu): ")
print("Ai răspuns:", raspuns)
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`input()\` citește ce scrie utilizatorul
- ✅ \`input()\` returnează **mereu string**
- ✅ Pentru numere folosești \`int()\` sau \`float()\`
- ✅ \`str()\` transformă orice în text
- ✅ Patternul: \`int(input("..."))\` pentru a primi numere

## 🎮 Mini-provocare
Scrie cum ar trebui să arate un program care:
1. Întreabă numele
2. Întreabă vârsta
3. Afișează: "Salut, [nume]! Peste 5 ani vei avea [vârsta+5] ani."

<details>
<summary>Soluție 👇</summary>

\`\`\`python
nume = input("Cum te cheamă? ")
varsta = int(input("Câți ani ai? "))
print("Salut,", nume + "! Peste 5 ani vei avea", varsta + 5, "ani.")
\`\`\`
</details>
`,
    extraProblems: [
      mc('Conversie eroare',
        'Ce se întâmplă dacă rulezi `int("abc")`?',
        ['Returnează 0', 'Returnează "abc"', 'Eroare', 'Returnează None'],
        'Eroare',
        '`int()` poate converti doar text care arată ca un număr (de ex. "42"). Pentru "abc" → eroare ValueError.',
        { topic: 'input', difficulty: 'MEDIUM' }),
      sa('Citire număr cu virgulă',
        'Scrie linia care citește un număr cu virgulă de la utilizator și îl pune în variabila `pret`.',
        'pret = float(input())',
        '`float(input())` — `input()` citește text, `float()` îl transformă în număr cu virgulă.',
        { topic: 'input', difficulty: 'MEDIUM' }),
      mc('Tip după input',
        'După `n = input("?")` și utilizatorul scrie `5`, ce tip are `n`?',
        ['int', 'float', 'str', 'bool'],
        'str',
        '`input()` returnează ÎNTOTDEAUNA un string, indiferent ce a scris utilizatorul!',
        { topic: 'input' }),
      sa('Conversie int la str',
        'Scrie expresia care transformă numărul `42` într-un string.',
        'str(42)',
        '`str(42)` returnează textul `"42"`.',
        { topic: 'input' }),
    ],
  },

  // ============ LECȚIA 4 ============
  'operatori': {
    theory: `# ➕ Operatori în Python

Operatorii sunt **simboluri** care fac operații pe valori. Sunt ca **uneltele** unui matematician.

## 🧮 Operatori aritmetici (matematici)

- **\`+\`** — Nume: Adunare • Exemplu: \`5 + 3\` • Rezultat: \`8\`
- **\`-\`** — Nume: Scădere • Exemplu: \`10 - 4\` • Rezultat: \`6\`
- **\`*\`** — Nume: Înmulțire • Exemplu: \`6 * 7\` • Rezultat: \`42\`
- **\`/\`** — Nume: Împărțire • Exemplu: \`10 / 4\` • Rezultat: \`2.5\`
- **\`//\`** — Nume: Împărțire întreagă • Exemplu: \`10 // 4\` • Rezultat: \`2\`
- **\`%\`** — Nume: Rest (modulo) • Exemplu: \`10 % 4\` • Rezultat: \`2\`
- **\`**\`** — Nume: Putere • Exemplu: \`2 ** 3\` • Rezultat: \`8\`

### 🎯 Diferența dintre \`/\` și \`//\`

\`\`\`python
print(10 / 3)    # 3.333... (cu virgulă)
print(10 // 3)   # 3 (doar partea întreagă)
\`\`\`

### 🎯 La ce folosim \`%\` (modulo)?

\`%\` îți dă **restul** împărțirii. Foarte util pentru:

**Verifică dacă un număr e par sau impar:**
\`\`\`python
n = 7
if n % 2 == 0:
    print("Par")
else:
    print("Impar")    # se afișează asta
\`\`\`
> Dacă restul împărțirii la 2 este 0 → par. Altfel → impar!

**Ultima cifră a unui număr:**
\`\`\`python
n = 12345
print(n % 10)        # 5 (ultima cifră!)
\`\`\`

### 🎯 Putere — \`**\`

\`\`\`python
print(2 ** 10)       # 1024 (2 la puterea 10)
print(3 ** 2)        # 9
print(5 ** 0)        # 1
print(16 ** 0.5)     # 4.0 (rădăcina pătrată!)
\`\`\`

## 🔍 Operatori de comparare (returnează True/False)

- **\`==\`** — Nume: Egal • Exemplu: \`5 == 5\` → True
- **\`!=\`** — Nume: Diferit • Exemplu: \`5 != 3\` → True
- **\`>\`** — Nume: Mai mare • Exemplu: \`5 > 3\` → True
- **\`<\`** — Nume: Mai mic • Exemplu: \`5 < 3\` → False
- **\`>=\`** — Nume: Mai mare sau egal • Exemplu: \`5 >= 5\` → True
- **\`<=\`** — Nume: Mai mic sau egal • Exemplu: \`5 <= 4\` → False

### ⚠️ \`=\` vs \`==\`

\`\`\`python
x = 5         # ATRIBUIRE: pune 5 în x
x == 5        # COMPARARE: e x egal cu 5?
\`\`\`

> Cea mai frecventă greșeală a începătorilor!

## 🧠 Operatori logici

### \`and\` — ambele trebuie să fie True
\`\`\`python
varsta = 12
ore = 8

if varsta >= 10 and ore >= 7:
    print("Poți merge la curs!")    # se afișează (ambele True)
\`\`\`

### \`or\` — măcar una să fie True
\`\`\`python
e_sambata = False
e_duminica = True

if e_sambata or e_duminica:
    print("Weekend!")    # se afișează (or = una True)
\`\`\`

### \`not\` — inversează
\`\`\`python
e_zi_lucratoare = False
print(not e_zi_lucratoare)    # True
\`\`\`

### 📊 Tabela completă

- **True** — B: True • A and B: True • A or B: True • not A: False
- **True** — B: False • A and B: False • A or B: True • not A: False
- **False** — B: True • A and B: False • A or B: True • not A: True
- **False** — B: False • A and B: False • A or B: False • not A: True

## 🔢 Ordinea operațiilor (PEMDAS)

Python respectă regulile matematice:
1. **P**aranteze ()
2. **E**xponenți \`**\`
3. **M**ultiplication / **D**ivision (\`*\`, \`/\`, \`//\`, \`%\`)
4. **A**ddition / **S**ubtraction (\`+\`, \`-\`)

\`\`\`python
print(2 + 3 * 4)         # 14 (nu 20!)
print((2 + 3) * 4)       # 20
print(2 ** 3 + 1)        # 9
print(10 - 4 / 2)        # 8.0 (împărțirea prima)
\`\`\`

## 💡 Operatori de atribuire scurtată

În loc de:
\`\`\`python
scor = scor + 5
scor = scor * 2
scor = scor - 1
\`\`\`

Poți scrie:
\`\`\`python
scor += 5    # scor = scor + 5
scor *= 2    # scor = scor * 2
scor -= 1    # scor = scor - 1
scor /= 4    # scor = scor / 4
\`\`\`

## 🔗 Operatori pe string-uri

\`\`\`python
prenume = "Ion"
nume = "Popescu"
print(prenume + " " + nume)   # Ion Popescu

salut = "Hi! " * 3
print(salut)                   # Hi! Hi! Hi!
\`\`\`

## 🎓 Ce ai învățat
- ✅ Operatori matematici: \`+ - * / // % **\`
- ✅ \`%\` dă restul, foarte util pentru "par/impar"
- ✅ Operatori comparare: \`== != > < >= <=\`
- ✅ Operatori logici: \`and or not\`
- ✅ \`=\` ≠ \`==\` (atribuire vs comparare)
- ✅ Ordinea operațiilor: PEMDAS
- ✅ Atribuire scurtată: \`+= -= *= /=\`

## 🎮 Mini-provocare
Cât e: \`(10 + 5) * 2 - 3 ** 2 // 2\`?

<details>
<summary>Răspuns 👇</summary>

\`\`\`
1. (10 + 5) = 15
2. 3 ** 2 = 9
3. 9 // 2 = 4
4. 15 * 2 = 30
5. 30 - 4 = 26
\`\`\`
</details>
`,
    extraProblems: [
      sa('Modulo',
        'Cât face `17 % 5`?',
        '2',
        'Modulo (`%`) returnează restul împărțirii. 17 împărțit la 5 = 3 rest 2.',
        { topic: 'operators', difficulty: 'MEDIUM' }),
      mc('Diferența / și //',
        'Care este rezultatul lui `7 // 2`?',
        ['3.5', '3', '4', '3.0'],
        '3',
        '`//` este împărțirea întreagă — păstrează doar partea întreagă, fără virgulă.',
        { topic: 'operators', difficulty: 'EASY' }),
      sa('Putere',
        'Scrie expresia care calculează 5 la puterea 3.',
        '5 ** 3',
        '`**` este operatorul de putere în Python. `5 ** 3 = 5 × 5 × 5 = 125`.',
        { topic: 'operators' }),
      mc('and logic',
        'Ce returnează `True and False`?',
        ['True', 'False', 'None', 'Eroare'],
        'False',
        '`and` returnează True doar dacă **ambele** sunt True. Dacă măcar una e False → False.',
        { topic: 'operators' }),
      mc('Ordine operații',
        'Cât face `2 + 3 * 4`?',
        ['20', '14', '24', '11'],
        '14',
        'Înmulțirea are prioritate: `3 * 4 = 12`, apoi `2 + 12 = 14`.',
        { topic: 'operators', difficulty: 'MEDIUM' }),
      sa('Atribuire scurtată',
        'Care e echivalentul lui `x = x + 7` folosind atribuirea scurtată?',
        'x += 7',
        '`x += 7` este același lucru cu `x = x + 7`, doar mai scurt.',
        { topic: 'operators' }),
    ],
  },

}

// ============ LECȚII 5-20: voi continua aici ============
Object.assign(pythonEnriched, {

  // ============ LECȚIA 5 ============
  'if-else-elif': {
    theory: `# 🚦 Decizii cu \`if / else\`

Programele inteligente **iau decizii**. La fel ca tine: "dacă plouă, iau umbrela".

## Sintaxa de bază

\`\`\`python
if condiție:
    # cod care se execută DACĂ condiția e True
\`\`\`

### Exemplu simplu:
\`\`\`python
varsta = 12
if varsta >= 10:
    print("Ești destul de mare!")
\`\`\`

> 🎯 **Atenție la \`:\`** la finalul liniei \`if\`!  
> 🎯 **Atenție la indentare** (4 spații sau Tab) pentru codul din interior!

## \`if / else\` — alternativă

\`\`\`python
varsta = 8
if varsta >= 10:
    print("Mare!")
else:
    print("Mic!")    # se afișează asta
\`\`\`

## \`if / elif / else\` — multiple ramuri

\`elif\` = "else if" = "altfel dacă"

\`\`\`python
nota = 8

if nota >= 9:
    print("Excelent!")
elif nota >= 7:
    print("Bine!")           # se afișează asta
elif nota >= 5:
    print("Suficient")
else:
    print("Insuficient")
\`\`\`

> 🔑 Python verifică **în ordine**. Prima condiție True → execută acel bloc → **sare peste restul**.

## 🎨 Indentarea — REGULA DE AUR

Python folosește **indentarea** (spațiile de la stânga) ca să știe ce cod aparține unde.

### ✅ Corect:
\`\`\`python
if x > 5:
    print("Mare")
    print("Foarte mare")
print("Mereu se afișează")
\`\`\`

### ❌ Greșit:
\`\`\`python
if x > 5:
print("Mare")          # ❌ EROARE de indentare!
\`\`\`

> 📐 **Regula:** mereu **4 spații** (sau un Tab) pentru fiecare nivel.

## 🔢 Condiții complexe

### Cu \`and\`:
\`\`\`python
varsta = 12
ora = 16

if varsta >= 10 and ora < 18:
    print("Poți merge la cursuri!")
\`\`\`

### Cu \`or\`:
\`\`\`python
zi = "sambata"
if zi == "sambata" or zi == "duminica":
    print("Weekend!")
\`\`\`

### Cu \`not\`:
\`\`\`python
plouă = False
if not plouă:
    print("Mergem afară!")
\`\`\`

## 🎯 If-uri imbricate (în interior)

\`\`\`python
varsta = 12
are_bilet = True

if varsta >= 10:
    if are_bilet:
        print("Poți intra!")
    else:
        print("Trebuie bilet!")
else:
    print("Ești prea mic.")
\`\`\`

> 💡 De obicei e mai bine să folosești \`and\`:
\`\`\`python
if varsta >= 10 and are_bilet:
    print("Poți intra!")
\`\`\`

## 🧪 Exemple practice

### 1. Verifică par/impar
\`\`\`python
n = int(input("Număr: "))
if n % 2 == 0:
    print(n, "este PAR")
else:
    print(n, "este IMPAR")
\`\`\`

### 2. Cel mai mare din 2
\`\`\`python
a = int(input("a: "))
b = int(input("b: "))
if a > b:
    print(a, "e mai mare")
elif b > a:
    print(b, "e mai mare")
else:
    print("Egale!")
\`\`\`

### 3. Calculator notă
\`\`\`python
nota = float(input("Nota ta: "))
if nota < 0 or nota > 10:
    print("Notă invalidă!")
elif nota >= 9:
    print("⭐ Excelent")
elif nota >= 7:
    print("👍 Bine")
elif nota >= 5:
    print("✓ Suficient")
else:
    print("✗ Insuficient")
\`\`\`

### 4. Anul bisect
\`\`\`python
an = int(input("Anul: "))
if an % 4 == 0 and (an % 100 != 0 or an % 400 == 0):
    print("E an bisect!")
else:
    print("NU e bisect.")
\`\`\`

## ⚠️ Greșeli frecvente

- **\`if x = 5:\`** — Corect: \`if x == 5:\` • Problemă: Comparare = \`==\`
- **\`if x > 5\`** — Corect: \`if x > 5:\` • Problemă: Lipsește \`:\`
- **\`If x:\`** — Corect: \`if x:\` • Problemă: i mic!
- **\`if x and y > 5\`** — Corect: \`if x > 5 and y > 5\` • Problemă: "x și y mai mari" se scrie complet

## 🎓 Ce ai învățat
- ✅ \`if / elif / else\` pentru decizii
- ✅ \`:\` la final de \`if\`
- ✅ **Indentarea** definește blocul de cod
- ✅ Combinii condiții cu \`and / or / not\`
- ✅ \`==\` pentru comparare, **NU** \`=\`!

## 🎮 Mini-provocare
Scrie un program care:
1. Cere o vârstă
2. Dacă < 13 → "copil"
3. Dacă 13-19 → "adolescent"
4. Dacă 20-64 → "adult"
5. Dacă ≥ 65 → "senior"

<details>
<summary>Soluție 👇</summary>

\`\`\`python
varsta = int(input("Vârsta: "))
if varsta < 13:
    print("copil")
elif varsta <= 19:
    print("adolescent")
elif varsta <= 64:
    print("adult")
else:
    print("senior")
\`\`\`
</details>
`,
    extraProblems: [
      mc('Indentare',
        'Câte spații (sau ce caracter) recomandă Python pentru indentare?',
        ['1 spațiu', '2 spații', '4 spații', '8 spații'],
        '4 spații',
        'Convenția Python (PEP 8) recomandă **4 spații** sau un Tab pentru fiecare nivel de indentare.',
        { topic: 'if-else' }),
      mc('elif',
        'Ce înseamnă `elif`?',
        ['Else last if', 'Else if', 'Exit if', 'Else last'],
        'Else if',
        '`elif` = `else if` — verifică o nouă condiție DOAR dacă cele de mai sus au fost False.',
        { topic: 'if-else' }),
      sa('Cea mai folosită eroare',
        'Ce simbol lipsește la finalul liniei `if x > 5` pentru ca Python să nu dea eroare?',
        ':',
        'Liniile `if`, `elif`, `else` se termină **mereu cu două puncte** `:`.',
        { topic: 'if-else' }),
      mc('Operator par',
        'Ce expresie verifică dacă `n` este număr **par**?',
        ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 0', 'n == 2'],
        'n % 2 == 0',
        '`%` dă restul. Dacă restul împărțirii la 2 este 0 → numărul e par.',
        { topic: 'if-else', difficulty: 'MEDIUM' }),
      mc('Logică and',
        'Cu `x = 5`, ce returnează `x > 0 and x < 10`?',
        ['True', 'False', 'Eroare', 'None'],
        'True',
        '5 > 0 → True, și 5 < 10 → True. `and` cere ambele True → True.',
        { topic: 'if-else', difficulty: 'MEDIUM' }),
    ],
  },

})

// ============ LECȚII 6-20 — versiuni îmbogățite ============
Object.assign(pythonEnriched, {

  'probleme-conditii': {
    theory: `# 🎯 Probleme practice cu condiții

Acum că știi \`if/elif/else\`, hai să rezolvăm probleme reale!

## 🌡️ Exemplul 1: Termometru

\`\`\`python
temp = float(input("Temperatura: "))
if temp < 0:
    print("🥶 Îngheț! Pune fular!")
elif temp < 15:
    print("🧥 Răcoare. Geacă subțire.")
elif temp < 25:
    print("😊 Plăcut. Tricou e OK.")
else:
    print("🥵 Cald. Fă-ți vânt!")
\`\`\`

## 🚦 Exemplul 2: Semafor
\`\`\`python
culoare = input("Culoarea semaforului: ").lower()
if culoare == "rosu":
    print("⛔ STOP")
elif culoare == "galben":
    print("⚠️  Atenție")
elif culoare == "verde":
    print("✅ Treci")
else:
    print("Culoare necunoscută!")
\`\`\`

> 💡 \`.lower()\` transformă textul în litere mici → "ROSU" și "rosu" devin la fel!

## 📅 Exemplul 3: Anotimpul
\`\`\`python
luna = int(input("Luna (1-12): "))
if luna in [12, 1, 2]:
    print("Iarnă ❄️")
elif luna in [3, 4, 5]:
    print("Primăvară 🌸")
elif luna in [6, 7, 8]:
    print("Vară ☀️")
elif luna in [9, 10, 11]:
    print("Toamnă 🍂")
else:
    print("Lună invalidă!")
\`\`\`

## 💰 Exemplul 4: Calcul reducere

\`\`\`python
suma = float(input("Suma cumpărăturilor: "))
if suma >= 500:
    reducere = 20
elif suma >= 200:
    reducere = 10
elif suma >= 100:
    reducere = 5
else:
    reducere = 0

final = suma - suma * reducere / 100
print(f"Plătești {final} lei (reducere {reducere}%)")
\`\`\`

## 🔢 Exemplul 5: Triunghi valid?

\`\`\`python
a = int(input("Latura a: "))
b = int(input("Latura b: "))
c = int(input("Latura c: "))

if a + b > c and a + c > b and b + c > a:
    print("Triunghi VALID ✓")
    if a == b == c:
        print("Echilateral!")
    elif a == b or b == c or a == c:
        print("Isoscel!")
    else:
        print("Oarecare.")
else:
    print("NU formează triunghi ✗")
\`\`\`

## 🎓 Tipare comune

### Verificare interval
\`\`\`python
if 0 <= x <= 100:    # Python permite asta!
    print("OK")
\`\`\`

### Multiple egalități
\`\`\`python
# În loc de:
if x == 1 or x == 2 or x == 3:
    pass
# Mai elegant:
if x in [1, 2, 3]:
    print("Una din primele 3")
\`\`\`

### Verificare gol
\`\`\`python
nume = input("Nume: ")
if nume == "":
    print("Trebuie să introduci un nume!")
\`\`\`
`,
    extraProblems: [
      mc('Interval Python',
        'Cum verifici dacă x este între 1 și 10 (inclusiv) în mod elegant?',
        ['if 1 < x < 10:', 'if 1 <= x <= 10:', 'if x in [1,10]:', 'if x = 1 to 10:'],
        'if 1 <= x <= 10:',
        'Python permite verificarea elegantă: `if a <= x <= b:` — echivalent cu `x >= a and x <= b`.',
        { topic: 'conditionals', difficulty: 'MEDIUM' }),
      sa('In list',
        'Cum verifici elegant dacă `x` este 1, 2 SAU 3?',
        'x in [1, 2, 3]',
        '`x in [1, 2, 3]` — mult mai scurt decât `x == 1 or x == 2 or x == 3`.',
        { topic: 'conditionals', difficulty: 'MEDIUM' }),
      mc('Lower case',
        'Ce face `"HELLO".lower()`?',
        ['"HELLO"', '"hello"', '"Hello"', 'Eroare'],
        '"hello"',
        '`.lower()` transformă tot stringul în litere mici. Util pentru a compara fără a-ți păsa de majuscule.',
        { topic: 'conditionals' }),
    ],
  },

  'while-loop': {
    theory: `# 🔁 Bucla while

Imaginează că faci flotări: **cât timp** ai energie, mai faci una. Asta e \`while\`!

## Sintaxa
\`\`\`python
while condiție:
    # cod care se repetă cât timp condiția e True
\`\`\`

## Exemplu de bază
\`\`\`python
i = 1
while i <= 5:
    print(i)
    i = i + 1
\`\`\`
**Output:** 1, 2, 3, 4, 5

### Pas cu pas:
- **1** — i <= 5?: True • Acțiune: print(1), i devine 2
- **2** — i <= 5?: True • Acțiune: print(2), i devine 3
- **3** — i <= 5?: True • Acțiune: print(3), i devine 4
- **4** — i <= 5?: True • Acțiune: print(4), i devine 5
- **5** — i <= 5?: True • Acțiune: print(5), i devine 6
- **6** — i <= 5?: False • Acțiune: STOP

## ⚠️ BUCLA INFINITĂ — pericol!

Dacă uiți să schimbi variabila → bucla rulează **la nesfârșit**!

\`\`\`python
i = 1
while i <= 5:
    print(i)    # 💥 BUG! i nu se schimbă niciodată!
\`\`\`

> 💡 **Salvare:** Ctrl+C în terminal oprește programul.

## 🔂 \`while True\` + \`break\`

Pentru bucle "până când utilizatorul vrea":

\`\`\`python
while True:
    raspuns = input("Continui? (da/nu): ")
    if raspuns == "nu":
        break    # iese din buclă
    print("OK, mai facem o tură!")
print("Pa!")
\`\`\`

## 🔀 \`continue\` — sări peste

\`continue\` sare la **următoarea iterație**, fără a executa restul codului din buclă.

\`\`\`python
i = 0
while i < 10:
    i += 1
    if i % 2 == 0:
        continue       # sări peste numerele pare
    print(i)           # afișează doar 1, 3, 5, 7, 9
\`\`\`

## 📊 Exemple practice

### 1. Suma 1 + 2 + ... + N
\`\`\`python
n = int(input("N: "))
suma = 0
i = 1
while i <= n:
    suma += i
    i += 1
print("Suma:", suma)
\`\`\`

### 2. Numărătoare inversă
\`\`\`python
i = 10
while i > 0:
    print(i)
    i -= 1
print("Decolare! 🚀")
\`\`\`

### 3. Validare input
\`\`\`python
varsta = -1
while varsta < 0 or varsta > 120:
    varsta = int(input("Vârstă (0-120): "))
print("Mulțumesc!", varsta)
\`\`\`

### 4. Ghicește numărul
\`\`\`python
import random
secret = random.randint(1, 100)
incercari = 0

while True:
    g = int(input("Ghicește (1-100): "))
    incercari += 1
    if g == secret:
        print(f"🎉 Ai ghicit din {incercari} încercări!")
        break
    elif g < secret:
        print("Mai mare!")
    else:
        print("Mai mic!")
\`\`\`

## 🆚 break vs continue

- **\`break\`** — **Iese** complet din buclă
- **\`continue\`** — Sare la **următoarea iterație**
- **\`pass\`** — Nu face nimic (placeholder)

## 🎓 Ce ai învățat
- ✅ \`while\` repetă cât timp condiția e True
- ✅ Trebuie să schimbi variabila condiției — altfel buclă infinită!
- ✅ \`break\` iese, \`continue\` sare la următoarea iterație
- ✅ \`while True\` + \`break\` = pattern util
`,
    extraProblems: [
      mc('Diferența break/continue',
        'Care e diferența dintre `break` și `continue`?',
        ['Sunt la fel', '`break` iese din buclă, `continue` sare la următoarea iterație', '`continue` iese, `break` continuă', 'Ambele dau eroare'],
        '`break` iese din buclă, `continue` sare la următoarea iterație',
        '`break` oprește bucla complet. `continue` doar sare peste restul iterației curente și verifică condiția din nou.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      sa('Oprire program',
        'Ce combinație de taste oprește un program în terminal blocat într-o buclă infinită?',
        'Ctrl+C',
        '`Ctrl+C` trimite semnal de întrerupere către proces și-l oprește.',
        { topic: 'loops' }),
      mc('Validare cu while',
        'De ce folosim `while` pentru validarea input-ului?',
        ['Pentru a afișa mesaje', 'Pentru a cere input până e valid', 'Pentru a calcula', 'Nu se folosește'],
        'Pentru a cere input până e valid',
        'Cu `while` putem repeta întrebarea utilizatorului până când răspunsul respectă regulile noastre.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
    ],
  },

  'for-range': {
    theory: `# 🔄 Bucla for + range()

\`for\` este folosit când **știi câte iterații** vrei să faci. E mai sigur decât \`while\` (nu riști buclă infinită).

## Sintaxa
\`\`\`python
for variabilă in secvență:
    # cod care se execută pentru fiecare valoare
\`\`\`

## \`range()\` — generatorul de numere

### \`range(n)\` — de la 0 la n-1
\`\`\`python
for i in range(5):
    print(i)
# Afișează: 0, 1, 2, 3, 4
\`\`\`
> ⚠️ **NU include n!** Se oprește la n-1.

### \`range(start, stop)\` — de la start la stop-1
\`\`\`python
for i in range(2, 6):
    print(i)
# Afișează: 2, 3, 4, 5
\`\`\`

### \`range(start, stop, pas)\` — cu pas
\`\`\`python
for i in range(0, 10, 2):
    print(i)
# Afișează: 0, 2, 4, 6, 8
\`\`\`

### Pas negativ — descrescător
\`\`\`python
for i in range(10, 0, -1):
    print(i)
# Afișează: 10, 9, 8, ..., 1
\`\`\`

## 🎯 Exemple

### Suma 1 + 2 + ... + 100
\`\`\`python
suma = 0
for i in range(1, 101):
    suma += i
print(suma)    # 5050
\`\`\`

### Tabla înmulțirii cu 7
\`\`\`python
for i in range(1, 11):
    print(7, "×", i, "=", 7 * i)
\`\`\`

### Doar pare de la 0 la 20
\`\`\`python
for i in range(0, 21, 2):
    print(i)
\`\`\`

## 🔁 \`for\` peste un string
\`\`\`python
for litera in "Python":
    print(litera)
# Afișează: P, y, t, h, o, n
\`\`\`

## 🔁 \`for\` peste o listă
\`\`\`python
fructe = ["mar", "para", "banana"]
for fruct in fructe:
    print("Îmi place", fruct)
\`\`\`

## 🎯 enumerate() — index + valoare
\`\`\`python
fructe = ["mar", "para", "banana"]
for i, fruct in enumerate(fructe):
    print(i, "-", fruct)
# 0 - mar
# 1 - para
# 2 - banana
\`\`\`

## 🆚 for vs while

- **Știi câte iterații (10 ori)** — Nu știi câte iterații
- **Parcurgi o listă/string** — Aștepți o condiție
- **range(...)** — utilizator răspunde "stop"

## 🎓 Ce ai învățat
- ✅ \`for variabilă in secvență:\` parcurge fiecare valoare
- ✅ \`range(n)\` → 0..n-1
- ✅ \`range(a, b)\` → a..b-1
- ✅ \`range(a, b, p)\` → cu pas
- ✅ Pas negativ = descrescător
- ✅ \`enumerate()\` îți dă și index, și valoare
`,
    extraProblems: [
      mc('range exclude stop',
        'Ce afișează `for i in range(3, 7): print(i)`?',
        ['3 4 5 6', '3 4 5 6 7', '3 4 5', '4 5 6'],
        '3 4 5 6',
        '`range(3, 7)` produce numerele 3, 4, 5, 6 — **nu include 7**.',
        { topic: 'loops' }),
      sa('Doar impare',
        'Cum scrii `range()` care produce 1, 3, 5, 7, 9?',
        'range(1, 10, 2)',
        'Pornim de la 1, ne oprim înainte de 10, pas 2 → 1, 3, 5, 7, 9.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      mc('enumerate',
        'Ce face `enumerate(["a", "b"])`?',
        ['Returnează ["a", "b"]', 'Returnează perechi (index, valoare)', 'Sortează lista', 'Numără elementele'],
        'Returnează perechi (index, valoare)',
        '`enumerate()` îți dă pentru fiecare element o pereche (index, valoare): (0, "a"), (1, "b").',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      sa('For pe string',
        'Câte iterații face `for c in "Python"`?',
        '6',
        'Stringul "Python" are 6 litere → 6 iterații.',
        { topic: 'loops' }),
    ],
  },

  'liste-introducere': {
    theory: `# 📋 Liste — colecții de valori

O **listă** este o cutie mare în care pui **mai multe valori** ordonate.

## Crearea listei

\`\`\`python
fructe = ["mar", "para", "banana"]
numere = [1, 2, 3, 4, 5]
mixt = [1, "doi", 3.14, True]
goala = []
\`\`\`

> 🎯 Listele se scriu cu **paranteze pătrate** \`[ ]\` și valorile separate cu **virgulă**.

## 🔢 Indexare — ce loc are fiecare element

Indexarea **începe de la 0**!

\`\`\`python
fructe = ["mar", "para", "banana", "kiwi"]
#          [0]    [1]      [2]       [3]

print(fructe[0])    # mar
print(fructe[1])    # para
print(fructe[2])    # banana
\`\`\`

### Index negativ — de la sfârșit
\`\`\`python
print(fructe[-1])   # kiwi (ultimul)
print(fructe[-2])   # banana (penultimul)
\`\`\`

## 📏 \`len()\` — câte elemente are

\`\`\`python
fructe = ["mar", "para", "banana"]
print(len(fructe))    # 3
\`\`\`

## ➕ Adăugare elemente

### \`.append(x)\` — adaugă la sfârșit
\`\`\`python
fructe = ["mar", "para"]
fructe.append("kiwi")
print(fructe)    # ['mar', 'para', 'kiwi']
\`\`\`

### \`.insert(poz, x)\` — adaugă pe o poziție
\`\`\`python
fructe = ["mar", "para"]
fructe.insert(1, "banana")
print(fructe)    # ['mar', 'banana', 'para']
\`\`\`

## ❌ Ștergere elemente

### \`.remove(x)\` — șterge prima apariție a lui x
\`\`\`python
fructe = ["mar", "para", "mar"]
fructe.remove("mar")
print(fructe)    # ['para', 'mar']
\`\`\`

### \`.pop()\` — scoate ultimul (sau cel cu index)
\`\`\`python
fructe = ["mar", "para", "banana"]
ultim = fructe.pop()
print(ultim)     # banana
print(fructe)    # ['mar', 'para']
\`\`\`

## 🔄 Modificare element

\`\`\`python
fructe = ["mar", "para", "banana"]
fructe[0] = "ananas"
print(fructe)    # ['ananas', 'para', 'banana']
\`\`\`

## 🔍 Verificare existență cu \`in\`

\`\`\`python
fructe = ["mar", "para"]
print("mar" in fructe)        # True
print("kiwi" in fructe)       # False

if "para" in fructe:
    print("Avem para!")
\`\`\`

## 🍰 Slicing — felii din listă

\`lista[start:stop]\` — de la start la stop-1

\`\`\`python
n = [10, 20, 30, 40, 50]
print(n[1:4])      # [20, 30, 40]
print(n[:3])       # [10, 20, 30] (de la început)
print(n[2:])       # [30, 40, 50] (până la sfârșit)
print(n[:])        # copie completă
print(n[::-1])     # [50, 40, 30, 20, 10] (inversată!)
\`\`\`

## 🎓 Ce ai învățat
- ✅ Liste = colecții ordonate cu \`[ ]\`
- ✅ Indexarea începe de la 0
- ✅ \`-1\` = ultimul element
- ✅ \`len()\` numără elementele
- ✅ \`.append()\`, \`.insert()\` adaugă
- ✅ \`.remove()\`, \`.pop()\` șterg
- ✅ \`x in lista\` verifică existența
- ✅ Slicing \`[a:b]\` — sub-listă
`,
    extraProblems: [
      mc('Index primul',
        'Care este indexul primului element din `["a", "b", "c"]`?',
        ['1', '0', '-1', 'a'],
        '0',
        'În Python, indexarea începe de la **0**. Primul element are index 0.',
        { topic: 'lists' }),
      sa('Adaugă la sfârșit',
        'Ce metodă adaugă un element la sfârșitul unei liste?',
        'append',
        '`lista.append(x)` adaugă elementul x la sfârșitul listei.',
        { topic: 'lists' }),
      mc('Slicing',
        'Ce returnează `[1, 2, 3, 4, 5][1:3]`?',
        ['[1, 2]', '[2, 3]', '[2, 3, 4]', '[1, 2, 3]'],
        '[2, 3]',
        '`[1:3]` ia elementele de la indexul 1 (inclusiv) la 3 (exclusiv) → [2, 3].',
        { topic: 'lists', difficulty: 'MEDIUM' }),
      sa('Inversează listă',
        'Ce expresie de slicing inversează lista `n`?',
        'n[::-1]',
        '`n[::-1]` înseamnă slicing complet cu pas -1 → listă în ordine inversă.',
        { topic: 'lists', difficulty: 'MEDIUM' }),
      mc('len',
        'Cât returnează `len([10, 20, 30])`?',
        ['2', '3', '60', '0'],
        '3',
        '`len()` returnează **numărul de elemente** dintr-o listă.',
        { topic: 'lists' }),
    ],
  },

  'string-uri': {
    theory: `# 📝 Lucrul cu string-uri (text)

String-urile sunt **secvențe de caractere**. La fel ca listele, dar fixe (nu poți modifica un caracter direct).

## Crearea unui string
\`\`\`python
s1 = "Hello"
s2 = 'World'
s3 = """Mai multe
linii"""
\`\`\`

## 📏 Lungimea cu \`len()\`
\`\`\`python
s = "Python"
print(len(s))    # 6
\`\`\`

## 🔢 Indexare — ca la liste
\`\`\`python
s = "Python"
print(s[0])      # P
print(s[1])      # y
print(s[-1])     # n (ultimul)
\`\`\`

## 🍰 Slicing
\`\`\`python
s = "Programare"
print(s[0:4])    # Prog
print(s[:5])     # Progr
print(s[5:])     # amare
print(s[::-1])   # eramargorP (inversat)
\`\`\`

## ➕ Concatenare (alipire)
\`\`\`python
a = "Hello"
b = "World"
print(a + " " + b)    # Hello World

# Înmulțire — repetare!
print("Hi! " * 3)     # Hi! Hi! Hi! 
\`\`\`

## 🎨 Metode utile

### \`.upper()\` — totul cu majuscule
\`\`\`python
print("hello".upper())    # HELLO
\`\`\`

### \`.lower()\` — totul cu minuscule
\`\`\`python
print("HELLO".lower())    # hello
\`\`\`

### \`.title()\` — prima literă a fiecărui cuvânt
\`\`\`python
print("hello world".title())    # Hello World
\`\`\`

### \`.strip()\` — taie spațiile de la margini
\`\`\`python
print("  Salut  ".strip())    # "Salut"
\`\`\`

### \`.replace(a, b)\` — înlocuiește
\`\`\`python
print("Salut Maria".replace("Maria", "Ion"))    # Salut Ion
\`\`\`

### \`.split(separator)\` — împarte în listă
\`\`\`python
"Ana,Bob,Carla".split(",")
# ['Ana', 'Bob', 'Carla']

"hello world python".split()
# ['hello', 'world', 'python']  (default: spațiu)
\`\`\`

### \`.join(lista)\` — invers, lipește o listă
\`\`\`python
", ".join(["Ana", "Bob"])    # "Ana, Bob"
\`\`\`

### \`.count(x)\` — câte ori apare
\`\`\`python
"banana".count("a")    # 3
\`\`\`

### \`.startswith() / .endswith()\`
\`\`\`python
"document.pdf".endswith(".pdf")    # True
"hello".startswith("he")           # True
\`\`\`

## 🔍 Verificare cu \`in\`
\`\`\`python
"py" in "Python"       # True (case-sensitive!)
"PY" in "Python"       # False
\`\`\`

## 🎯 f-strings — formatare modernă

\`\`\`python
nume = "Ana"
varsta = 12
print(f"Salut, {nume}! Ai {varsta} ani.")
# Salut, Ana! Ai 12 ani.
\`\`\`

### Cu calcule
\`\`\`python
print(f"Suma: {2 + 3}")               # Suma: 5
print(f"Pătrat: {5 ** 2}")            # Pătrat: 25
\`\`\`

### Cu formatare
\`\`\`python
pi = 3.14159
print(f"Pi = {pi:.2f}")    # Pi = 3.14 (2 zecimale)
\`\`\`

## ⚠️ String-urile sunt IMUTABILE
Nu poți face: \`s[0] = "X"\` — eroare!

Dar poți crea unul nou:
\`\`\`python
s = "Hello"
s = "X" + s[1:]
print(s)    # Xello
\`\`\`

## 🎓 Ce ai învățat
- ✅ String = secvență de caractere
- ✅ \`len()\`, indexare, slicing — la fel ca liste
- ✅ \`.upper()\`, \`.lower()\`, \`.strip()\`, \`.replace()\`
- ✅ \`.split()\` → listă, \`.join()\` → invers
- ✅ f-strings: \`f"...{var}..."\` pentru formatare
- ✅ String-urile sunt **imutabile**
`,
    extraProblems: [
      mc('Upper',
        'Ce returnează `"abc".upper()`?',
        ['abc', 'ABC', 'Abc', 'cba'],
        'ABC',
        '`.upper()` transformă tot stringul în litere mari.',
        { topic: 'strings' }),
      sa('Lungime',
        'Cât returnează `len("Python")`?',
        '6',
        'Stringul "Python" are 6 caractere.',
        { topic: 'strings' }),
      sa('f-string',
        'Cu `nume = "Ana"`, scrie un f-string care formatează: `Salut, Ana!`',
        'f"Salut, {nume}!"',
        'f-strings folosesc `f` înainte de ghilimele și `{var}` pentru a insera valori.',
        { topic: 'strings', difficulty: 'MEDIUM' }),
      mc('Split',
        'Ce returnează `"a,b,c".split(",")`?',
        ['"abc"', '["a", "b", "c"]', '["a,b,c"]', 'Eroare'],
        '["a", "b", "c"]',
        '`.split(",")` împarte stringul după virgulă și returnează o listă.',
        { topic: 'strings', difficulty: 'MEDIUM' }),
      mc('Replace',
        'Ce returnează `"hello".replace("l", "L")`?',
        ['"hello"', '"heLLo"', '"hLLLo"', '"helo"'],
        '"heLLo"',
        '`.replace(a, b)` înlocuiește **toate** aparițiile lui a cu b.',
        { topic: 'strings', difficulty: 'MEDIUM' }),
    ],
  },

  'functii-basic': {
    theory: `# 🎯 Funcții — reutilizarea codului

O **funcție** este un bloc de cod cu un nume, pe care îl poți **chema** de oricâte ori.

## De ce funcții?
- ✅ Eviți să rescrii același cod
- ✅ Codul e mai ordonat
- ✅ Mai ușor de modificat

## Sintaxa
\`\`\`python
def nume_functie(parametri):
    # cod
    return valoare    # opțional
\`\`\`

## Exemplu simplu — fără parametri
\`\`\`python
def saluta():
    print("Salut!")

saluta()    # Salut!
saluta()    # Salut!
saluta()    # Salut!
\`\`\`

> 🎯 Definirea cu \`def\` **nu execută** codul. Doar **chemarea** \`saluta()\` îl execută!

## Cu parametri
\`\`\`python
def saluta(nume):
    print(f"Salut, {nume}!")

saluta("Ana")     # Salut, Ana!
saluta("Bob")     # Salut, Bob!
\`\`\`

## Cu mai mulți parametri
\`\`\`python
def aduna(a, b):
    print(a + b)

aduna(2, 3)       # 5
aduna(10, 20)     # 30
\`\`\`

## 🎁 \`return\` — funcția întoarce o valoare

\`\`\`python
def aduna(a, b):
    return a + b

rezultat = aduna(2, 3)
print(rezultat)         # 5
print(aduna(10, 20))    # 30
\`\`\`

### Diferența \`print\` vs \`return\`
\`\`\`python
def f1(x):
    print(x * 2)        # afișează direct

def f2(x):
    return x * 2        # întoarce valoarea

a = f1(5)               # afișează 10, dar a = None
b = f2(5)               # b = 10
print(b * 3)            # 30 — putem folosi b
\`\`\`

## 🎯 Parametri cu valori default

\`\`\`python
def saluta(nume="prieten"):
    print(f"Salut, {nume}!")

saluta()              # Salut, prieten!
saluta("Ana")         # Salut, Ana!
\`\`\`

## 🎯 Argumente cu nume

\`\`\`python
def info(nume, varsta, oras):
    print(f"{nume}, {varsta} ani, din {oras}")

info("Ana", 12, "Chișinău")
info(varsta=12, oras="Chișinău", nume="Ana")    # ordinea contează mai puțin
\`\`\`

## 🎯 Multiple return-uri (tuplu)

\`\`\`python
def min_max(lista):
    return min(lista), max(lista)

a, b = min_max([3, 1, 4, 1, 5, 9])
print(a)    # 1
print(b)    # 9
\`\`\`

## 🌍 Variabile locale vs globale

\`\`\`python
x = 10              # globală

def f():
    x = 5           # locală — dispare după funcție
    print(x)        # 5

f()
print(x)            # 10 (cea globală nu s-a schimbat!)
\`\`\`

## 🔧 Exemple practice

### Verifică număr par
\`\`\`python
def este_par(n):
    return n % 2 == 0

print(este_par(4))    # True
print(este_par(7))    # False
\`\`\`

### Salut cu mesaj
\`\`\`python
def mesaj(nume, tip="prieten"):
    return f"Salut, {tip} {nume}!"

print(mesaj("Ana"))                  # Salut, prieten Ana!
print(mesaj("Pop", "domnul"))        # Salut, domnul Pop!
\`\`\`

### Calcul medie
\`\`\`python
def medie(lista):
    if len(lista) == 0:
        return 0
    return sum(lista) / len(lista)

print(medie([7, 8, 9, 10]))    # 8.5
\`\`\`

## 🎓 Ce ai învățat
- ✅ \`def nume():\` definește funcția
- ✅ \`return\` întoarce o valoare
- ✅ \`print\` afișează, \`return\` întoarce — sunt diferite!
- ✅ Parametri pot avea valori default
- ✅ Funcțiile pot returna multiple valori
- ✅ Variabilele din funcție sunt locale
`,
    extraProblems: [
      mc('def vs call',
        'Ce face linia `def saluta():`?',
        ['Execută funcția', 'Definește funcția (nu o execută)', 'Importă o funcție', 'Eroare'],
        'Definește funcția (nu o execută)',
        '`def` doar **definește** funcția. Pentru a o executa scrii numele cu paranteze: `saluta()`.',
        { topic: 'functions' }),
      sa('Return',
        'Ce cuvânt cheie întoarce o valoare din funcție?',
        'return',
        '`return` întoarce o valoare din funcție și oprește execuția ei.',
        { topic: 'functions' }),
      mc('print vs return',
        'Care este diferența principală dintre `print` și `return`?',
        ['Sunt la fel', '`print` afișează pe ecran, `return` întoarce o valoare folosibilă', '`return` afișează, `print` întoarce', 'Niciuna nu există'],
        '`print` afișează pe ecran, `return` întoarce o valoare folosibilă',
        '`print` doar arată ceva utilizatorului. `return` dă valoarea înapoi pentru a fi folosită în alte calcule.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      sa('Parametru default',
        'Cum definești o funcție `saluta(nume)` care folosește "prieten" dacă nu primește nume?',
        'def saluta(nume="prieten"):',
        'Adaugă valoarea după `=` în lista de parametri: `def saluta(nume="prieten"):`.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
    ],
  },

})
