// Python enriched — partea 2 (lecțiile 9, 10, 12, 13, 14, 16, 18, 19, 20)
// Stil prietenos pentru elevi 9-10 ani

import { mc, sa } from './helpers.mjs'

export const pythonEnrichedPart2 = {

  // ============ LECȚIA: for vs while ============
  'for-vs-while': {
    theory: `# 🔁 \`for\` vs \`while\` — care când?

Ambele sunt **bucle** (repetiții), dar le folosim în situații diferite. Ca două unelte: un ciocan și o șurubelniță 🔨🪛.

## 📊 Tabel rapid de comparație

- ****Știu de câte ori repet?** (ex: 10 ori)** — \`for\` ✅
- ****Repet până se întâmplă ceva?** (necunoscut)** — \`while\` ✅
- ****Parcurg o listă?**** — \`for\` ✅
- ****Aștept input corect de la user?**** — \`while\` ✅

## 🎯 Exemplu 1 — Știu numărul de repetări

\`\`\`python
# Vreau să scriu de 5 ori "Salut"
for i in range(5):
    print("Salut")
\`\`\`

✅ **for** e perfect: știu exact 5 ori.

## 🎯 Exemplu 2 — Nu știu de câte ori

\`\`\`python
# Vreau ca utilizatorul să ghicească parola
parola = ""
while parola != "secret":
    parola = input("Parola: ")
print("Bravo!")
\`\`\`

✅ **while** e perfect: nu știu câte încercări face.

## 🔄 Aceeași problemă cu ambele

**Cu for** (când știu de câte ori):
\`\`\`python
for i in range(1, 6):
    print(i)
\`\`\`

**Cu while** (mai mult cod):
\`\`\`python
i = 1
while i <= 5:
    print(i)
    i += 1
\`\`\`

> 💡 Vezi? Cu \`for\` ai scris **2 linii**. Cu \`while\` ai scris **4 linii** și e mai ușor să greșești (să uiți \`i += 1\` → buclă infinită!).

## ⚠️ Greșeli frecvente

- **\`while\` fără să schimbi variabila** — **Buclă infinită** 💥
- **\`for i in range(5)\` apoi \`i = 100\` în interior** — Nu schimbă numărul de repetări

## 🎓 Ce ai învățat
- ✅ \`for\` = când **știi** de câte ori
- ✅ \`while\` = când **aștepți** ceva
- ✅ \`for\` cu \`range\` e mai sigur și mai scurt
`,
    extraProblems: [
      mc('Alege bucla — număr cunoscut',
        'Vrei să afișezi numerele de la 1 la 100. Ce buclă alegi?',
        ['for', 'while', 'if', 'oricare merge la fel'],
        'for',
        'Știi exact câte repetări (100), deci `for i in range(1, 101)` e cel mai potrivit.',
        { topic: 'loops' }),
      mc('Alege bucla — așteptare',
        'Vrei ca jucătorul să introducă răspunsul corect. Ce buclă?',
        ['for', 'while', 'print', 'input'],
        'while',
        'Nu știi câte încercări va face. `while raspuns != corect` repetă până ghicește.',
        { topic: 'loops' }),
      sa('Echivalent for→while',
        'Scrie codul echivalent pentru `for i in range(3): print(i)` folosind while. Doar prima linie din while.',
        'i = 0',
        'Înainte de while inițializezi `i = 0`. Apoi `while i < 3:` cu `i += 1` în interior.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
      mc('Pericol while',
        'Care este pericolul principal la `while`?',
        ['Nu există', 'Buclă infinită dacă uiți să schimbi variabila', 'Nu poate avea condiții', 'Merge doar de 10 ori'],
        'Buclă infinită dacă uiți să schimbi variabila',
        'Dacă condiția nu devine niciodată False, programul rulează la nesfârșit. La `for` Python gestionează singur contorul.',
        { topic: 'loops' }),
    ],
  },

  // ============ LECȚIA: nested loops ============
  'nested-loops': {
    theory: `# 🔁🔁 Bucle imbricate (una în alta)

Imaginează-ți o **tablă de șah**: ai 8 rânduri și pe fiecare rând 8 pătrățele. Pentru a merge prin toată tabla, ai **două bucle**: una pentru rând, una pentru coloană 🏁.

## 🎯 Exemplu de bază

\`\`\`python
for rand in range(3):
    for coloana in range(3):
        print(f"({rand},{coloana})", end=" ")
    print()  # linie nouă după fiecare rând
\`\`\`

**Output:**
\`\`\`
(0,0) (0,1) (0,2)
(1,0) (1,1) (1,2)
(2,0) (2,1) (2,2)
\`\`\`

## 🧮 Câte repetări?

Dacă bucla externă rulează **3** ori și cea internă **3** ori → **3 × 3 = 9** repetări totale.

> 💡 Regula: **înmulțești** numărul de repetări.

## 🎨 Desen cu stele

\`\`\`python
for i in range(1, 5):
    for j in range(i):
        print("⭐", end="")
    print()
\`\`\`

**Output:**
\`\`\`
⭐
⭐⭐
⭐⭐⭐
⭐⭐⭐⭐
\`\`\`

## 🎯 Tabla înmulțirii

\`\`\`python
for i in range(1, 4):
    for j in range(1, 4):
        print(i*j, end="\\t")
    print()
\`\`\`

**Output:**
\`\`\`
1   2   3
2   4   6
3   6   9
\`\`\`

## ⚠️ Atenție la indentare!

\`\`\`python
for i in range(3):
    for j in range(3):
        print(j)    # ← interior
    print("Rând gata")  # ← extern (după bucla j)
\`\`\`

Spațiile **decid** la ce buclă aparține comanda!

## 🎓 Ce ai învățat
- ✅ O buclă poate fi **înăuntru** alteia
- ✅ Prima rulează "lent", a doua "repede"
- ✅ Total repetări = **înmulțire**
- ✅ Indentarea e crucială
`,
    extraProblems: [
      mc('Câte repetări?',
        'Cât rulează `print` în: `for i in range(4):\\n  for j in range(5):\\n    print(i,j)`?',
        ['9', '20', '4', '5'],
        '20',
        '4 × 5 = 20 repetări totale (4 rânduri × 5 coloane).',
        { topic: 'loops' }),
      mc('Bucla externă',
        'În bucle imbricate, care buclă rulează **mai rar**?',
        ['Cea externă (de afară)', 'Cea internă (de dinăuntru)', 'Amândouă la fel', 'Niciuna'],
        'Cea externă (de afară)',
        'Bucla externă face un pas, apoi cea internă termină tot, apoi externa face următorul pas.',
        { topic: 'loops' }),
      sa('Tabla 2 pe 2',
        'Câte print-uri sunt apelate dacă ai for i in range(2) cu for j in range(2) în interior?',
        '4',
        '2 × 2 = 4 repetări.',
        { topic: 'loops' }),
      mc('Indentarea contează',
        'Ce face `print()` când e indentat la nivelul buclei externe (nu interne)?',
        ['Rulează după fiecare repetare a buclei externe', 'Rulează după fiecare repetare a buclei interne', 'Eroare', 'Nu rulează niciodată'],
        'Rulează după fiecare repetare a buclei externe',
        'Indentarea decide la ce buclă aparține. Aliniat cu bucla externă = rulează doar la sfârșitul rândului.',
        { topic: 'loops', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ LECȚIA: liste-operatii ============
  'liste-operatii': {
    theory: `# 🧰 Operații cu liste

Listele sunt ca **cutii cu compartimente**. Acum învățăm cum să **adăugăm**, **ștergem** și **schimbăm** lucruri în ele 📦.

## ➕ Adăugare

### \`append()\` — la sfârșit

\`\`\`python
fructe = ["mar", "banana"]
fructe.append("cireșe")
print(fructe)  # ['mar', 'banana', 'cireșe']
\`\`\`

### \`insert(poz, val)\` — la o poziție

\`\`\`python
fructe.insert(0, "kiwi")  # adaugă pe poziția 0 (început)
print(fructe)  # ['kiwi', 'mar', 'banana', 'cireșe']
\`\`\`

## ➖ Ștergere

### \`remove(val)\` — șterge prima apariție a valorii

\`\`\`python
fructe.remove("mar")
print(fructe)  # ['kiwi', 'banana', 'cireșe']
\`\`\`

### \`pop(poz)\` — șterge după poziție și **întoarce** valoarea

\`\`\`python
ultim = fructe.pop()      # șterge ultimul
print(ultim)              # 'cireșe'
\`\`\`

## 🔄 Modificare

\`\`\`python
fructe[0] = "ananas"      # schimbă elementul de pe poziția 0
\`\`\`

## 🔍 Verificare

- **Lungime** — Cod: \`len(fructe)\` • Rezultat: număr de elemente
- **Există?** — Cod: \`"mar" in fructe\` • Rezultat: True / False
- **Poziția unui element** — Cod: \`fructe.index("mar")\` • Rezultat: indexul
- **De câte ori apare** — Cod: \`fructe.count("mar")\` • Rezultat: un număr

## 🔗 Combinare

\`\`\`python
a = [1, 2]
b = [3, 4]
c = a + b              # [1, 2, 3, 4]
d = a * 3              # [1, 2, 1, 2, 1, 2]
\`\`\`

## 📋 Sortare

\`\`\`python
numere = [3, 1, 4, 1, 5]
numere.sort()           # crescător
print(numere)           # [1, 1, 3, 4, 5]

numere.sort(reverse=True)  # descrescător
\`\`\`

## ⚠️ Greșeli frecvente

- **\`fructe.append("mar", "para")\`** — \`fructe.append("mar")\` apoi \`fructe.append("para")\`
- **\`fructe[10] = "x"\` (poziție inexistentă)** — Verifică \`len()\` întâi
- **\`fructe = fructe.append(...)\`** — \`fructe.append(...)\` (e \`None\`!)

## 🎓 Ce ai învățat
- ✅ \`append\`, \`insert\`, \`remove\`, \`pop\`
- ✅ Modificare directă cu index
- ✅ Combinare cu \`+\` și \`*\`
- ✅ Sortare cu \`.sort()\`
`,
    extraProblems: [
      mc('append vs insert',
        'Care metodă adaugă la **începutul** listei?',
        ['append(x)', 'insert(0, x)', 'add(x)', 'pop(0)'],
        'insert(0, x)',
        '`append` adaugă mereu la sfârșit. Pentru început folosești `insert(0, x)`.',
        { topic: 'lists' }),
      mc('Ce întoarce append?',
        'Ce returnează `lista.append("x")`?',
        ['Lista nouă', 'None', 'Numărul de elemente', 'Elementul adăugat'],
        'None',
        '`append` modifică lista pe loc și întoarce `None`. Nu scrie `lista = lista.append(...)`!',
        { topic: 'lists', difficulty: 'MEDIUM' }),
      sa('Lungimea listei',
        'Ce funcție îți spune câte elemente are o listă?',
        'len',
        '`len(lista)` întoarce numărul de elemente.',
        { topic: 'lists' }),
      mc('Combinare',
        'Ce afișează `[1, 2] + [3, 4]`?',
        ['[1, 2, 3, 4]', '[4, 6]', '[[1,2],[3,4]]', 'Eroare'],
        '[1, 2, 3, 4]',
        'Operatorul `+` pe liste le **concatenează** (lipește una de alta).',
        { topic: 'lists' }),
    ],
  },

  // ============ LECȚIA: liste-loop ============
  'liste-loop': {
    theory: `# 🔁 Parcurgerea listelor cu \`for\`

Listele și \`for\` sunt **prieteni de nedespărțit** 👯. Cu o singură linie poți face ceva cu **fiecare** element.

## 🎯 Forma simplă — element cu element

\`\`\`python
fructe = ["mar", "banana", "kiwi"]
for f in fructe:
    print("Îmi place", f)
\`\`\`

**Output:**
\`\`\`
Îmi place mar
Îmi place banana
Îmi place kiwi
\`\`\`

## 🔢 Cu index — \`enumerate()\`

Când ai nevoie și de **poziție**:

\`\`\`python
for i, f in enumerate(fructe):
    print(i, "->", f)
\`\`\`

**Output:**
\`\`\`
0 -> mar
1 -> banana
2 -> kiwi
\`\`\`

## 🧮 Calcule pe listă

### Suma elementelor

\`\`\`python
numere = [4, 7, 2, 9]
suma = 0
for n in numere:
    suma += n
print(suma)  # 22
\`\`\`

### Maximul

\`\`\`python
numere = [4, 7, 2, 9]
maxim = numere[0]
for n in numere:
    if n > maxim:
        maxim = n
print(maxim)  # 9
\`\`\`

> 💡 **Truc**: Python are deja \`sum(numere)\` și \`max(numere)\`!

## 🎯 Filtrare — păstrează doar unele

\`\`\`python
numere = [1, 2, 3, 4, 5, 6]
pare = []
for n in numere:
    if n % 2 == 0:
        pare.append(n)
print(pare)  # [2, 4, 6]
\`\`\`

## 🔄 Modificare elemente (cu index)

\`\`\`python
preturi = [10, 20, 30]
for i in range(len(preturi)):
    preturi[i] = preturi[i] * 2  # dublează
print(preturi)  # [20, 40, 60]
\`\`\`

## ⚠️ Greșeli frecvente

- **\`for i in fructe: i = "x"\` (nu schimbă lista)** — \`for i in range(len(fructe)): fructe[i] = "x"\`
- **Uiți \`suma = 0\` înainte** — Inițializează acumulator înainte de buclă

## 🎓 Ce ai învățat
- ✅ \`for x in lista\` — parcurgere simplă
- ✅ \`enumerate\` când ai nevoie de index
- ✅ Acumulatori (sumă, max, min) inițializați înainte
- ✅ Filtrare cu \`if\` în interior
`,
    extraProblems: [
      mc('Cum afișezi fiecare element',
        'Care e cea mai simplă cale de a afișa fiecare element din `lista`?',
        ['for i in lista: print(i)', 'print(lista[every])', 'lista.print()', 'while lista:'],
        'for i in lista: print(i)',
        '`for x in lista` parcurge automat fiecare element.',
        { topic: 'lists' }),
      mc('enumerate',
        'Ce întoarce `enumerate(["a","b"])`?',
        ['Doar elementele', 'Doar indecșii', 'Perechi (index, valoare)', 'Nu există'],
        'Perechi (index, valoare)',
        '`enumerate` îți dă atât poziția, cât și valoarea: (0,"a"), (1,"b").',
        { topic: 'lists', difficulty: 'MEDIUM' }),
      sa('Funcția suma',
        'Ce funcție Python adună automat toate elementele unei liste de numere?',
        'sum',
        '`sum([1,2,3])` returnează 6.',
        { topic: 'lists' }),
      mc('Inițializare acumulator',
        'De ce scriem `suma = 0` înainte de buclă?',
        ['Decorație', 'Pentru a avea o valoare de start la care adunăm', 'Nu e necesar', 'Pentru a opri bucla'],
        'Pentru a avea o valoare de start la care adunăm',
        'Fără valoare inițială, `suma += n` ar da eroare (variabila nu există).',
        { topic: 'lists' }),
    ],
  },

  // ============ LECȚIA: algoritmi-simpli ============
  'algoritmi-simpli': {
    theory: `# 🧠 Algoritmi simpli

Un **algoritm** este o **rețetă** clară de pași pentru a rezolva o problemă 👨‍🍳. Hai să învățăm câțiva fundamentali!

## 🔍 1. Căutare — există elementul?

\`\`\`python
numere = [4, 7, 2, 9, 5]
cautat = 9
gasit = False
for n in numere:
    if n == cautat:
        gasit = True
        break  # ieșim — nu mai are sens să căutăm
print("Găsit!" if gasit else "Nu există")
\`\`\`

> 💡 În Python: \`if 9 in numere: ...\` face același lucru într-o linie.

## 🏆 2. Maxim / Minim

\`\`\`python
numere = [4, 7, 2, 9, 5]
maxim = numere[0]
for n in numere:
    if n > maxim:
        maxim = n
print(maxim)  # 9
\`\`\`

## 🔢 3. Numărarea

Câte numere pare sunt în listă?

\`\`\`python
numere = [1, 2, 3, 4, 5, 6]
contor = 0
for n in numere:
    if n % 2 == 0:
        contor += 1
print(contor)  # 3
\`\`\`

## ➕ 4. Sumă & Medie

\`\`\`python
note = [9, 7, 8, 10, 6]
suma = sum(note)
medie = suma / len(note)
print(medie)  # 8.0
\`\`\`

## 🔃 5. Inversare listă

\`\`\`python
a = [1, 2, 3, 4]
a.reverse()
print(a)  # [4, 3, 2, 1]
\`\`\`

## 🪞 6. Verificare palindrom

Un cuvânt e palindrom dacă citit invers e la fel: "anna", "abba".

\`\`\`python
cuvant = "anna"
if cuvant == cuvant[::-1]:
    print("Palindrom!")
else:
    print("Nu este")
\`\`\`

## 🎯 7. FizzBuzz (clasic!)

\`\`\`python
for i in range(1, 16):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
\`\`\`

## 🎓 Ce ai învățat
- ✅ Căutare cu \`break\`
- ✅ Min / Max cu acumulator
- ✅ Numărare cu contor
- ✅ Sumă & medie
- ✅ Inversare cu \`[::-1]\` sau \`.reverse()\`
- ✅ FizzBuzz — exercițiul clasic
`,
    extraProblems: [
      mc('Cum verifici existența',
        'Cea mai pythonică modalitate de a verifica dacă 5 e în lista `nums`:',
        ['for n in nums: if n==5: ...', '5 in nums', 'nums.has(5)', 'nums == 5'],
        '5 in nums',
        'Operatorul `in` e cel mai scurt și clar pentru a verifica existența.',
        { topic: 'algorithms' }),
      sa('Inversare cu slicing',
        'Cum inversezi un string `s` într-o singură expresie?',
        's[::-1]',
        'Slicing-ul `[::-1]` parcurge de la coadă la cap cu pas -1.',
        { topic: 'algorithms', difficulty: 'MEDIUM' }),
      mc('FizzBuzz — ordinea',
        'De ce verificăm `i % 15` ÎNAINTE de `i % 3` și `i % 5`?',
        ['Nu contează', 'Pentru că un număr divizibil cu 15 e și cu 3, dacă verificăm 3 întâi nu mai ajungem la FizzBuzz', 'Pentru viteză', '15 e mai mare'],
        'Pentru că un număr divizibil cu 15 e și cu 3, dacă verificăm 3 întâi nu mai ajungem la FizzBuzz',
        'Ordinea condițiilor e crucială: cazul mai specific (15 = 3 ȘI 5) trebuie verificat primul.',
        { topic: 'algorithms', difficulty: 'MEDIUM' }),
      sa('Funcția pentru medie',
        'Ce funcții Python folosești pentru a calcula media unei liste `note`?',
        'sum(note)/len(note)',
        '`sum` adună, `len` numără, împărțirea dă media.',
        { topic: 'algorithms' }),
    ],
  },

  // ============ LECȚIA: dictionare ============
  'dictionare': {
    theory: `# 📖 Dicționare — cheie & valoare

Imaginează-ți un **dicționar real**: cauți un cuvânt (**cheia**) și găsești explicația lui (**valoarea**) 📚.

În Python:

\`\`\`python
elev = {
    "nume": "Ana",
    "varsta": 11,
    "clasa": "5B"
}
\`\`\`

## 🔑 Acces la valori

\`\`\`python
print(elev["nume"])      # Ana
print(elev["varsta"])    # 11
\`\`\`

## ➕ Adăugare / modificare

\`\`\`python
elev["scoala"] = "Mihai Viteazul"   # adaugă
elev["varsta"] = 12                  # modifică
\`\`\`

## ➖ Ștergere

\`\`\`python
del elev["clasa"]
\`\`\`

## 🔍 Verificare

\`\`\`python
if "nume" in elev:
    print("Are nume")
\`\`\`

## 🔁 Parcurgere

\`\`\`python
for cheie in elev:
    print(cheie, "=", elev[cheie])

# sau direct chei + valori
for k, v in elev.items():
    print(k, "->", v)
\`\`\`

## 🎯 Exemplu real — caiet de note

\`\`\`python
note = {
    "Ana": 10,
    "Bogdan": 8,
    "Calin": 9
}
for elev, n in note.items():
    print(f"{elev}: {n}")
\`\`\`

## 📋 Comparație: listă vs dicționar

- **\`["mar", "para"]\`** — \`{"fruct1": "mar", "fruct2": "para"}\`
- **Acces prin **index** \`l[0]\`** — Acces prin **cheie** \`d["fruct1"]\`
- **Ordonată** — Ordonată (din Python 3.7+)
- **Bună pentru **secvențe**** — Bună pentru **etichete**

## ⚠️ Greșeli frecvente

- **\`elev["nume"]\` la o cheie ce nu există → eroare** — Folosește \`elev.get("nume", "default")\`
- **Cheie \`= valoare\` (cu \`=\`)** — Cheie \`:\` valoare (cu \`:\`)

## 🎓 Ce ai învățat
- ✅ \`{cheie: valoare}\`
- ✅ Acces, adăugare, ștergere
- ✅ \`.items()\` pentru parcurgere completă
- ✅ \`.get()\` pentru acces sigur
`,
    extraProblems: [
      mc('Sintaxa dicționar',
        'Care e sintaxa corectă pentru un dicționar?',
        ['{"a"=1, "b"=2}', '{"a": 1, "b": 2}', '["a"->1, "b"->2]', '("a"=1, "b"=2)'],
        '{"a": 1, "b": 2}',
        'Acolade `{}`, două puncte `:` între cheie și valoare, virgulă între perechi.',
        { topic: 'dict' }),
      mc('Acces sigur',
        'Cum accesezi `elev["telefon"]` fără eroare dacă cheia nu există?',
        ['elev["telefon"]', 'elev.get("telefon")', 'elev[telefon]', 'try elev["telefon"]'],
        'elev.get("telefon")',
        '`.get()` întoarce `None` (sau o valoare default) dacă cheia lipsește, fără eroare.',
        { topic: 'dict', difficulty: 'MEDIUM' }),
      sa('Parcurgere chei și valori',
        'Ce metodă a dicționarului întoarce perechi (cheie, valoare) pentru parcurgere?',
        'items',
        '`for k, v in d.items():` parcurge ambele simultan.',
        { topic: 'dict' }),
      mc('Listă vs dict',
        'Când e mai bun un dicționar decât o listă?',
        ['Niciodată', 'Când vrei să cauți după **etichetă** (nume, ID)', 'Când ai numere', 'Listele sunt întotdeauna mai bune'],
        'Când vrei să cauți după **etichetă** (nume, ID)',
        'Dicționarele oferă acces rapid prin nume; listele necesită parcurgere.',
        { topic: 'dict' }),
    ],
  },

  // ============ LECȚIA: functii-avansat ============
  'functii-avansat': {
    theory: `# 🚀 Funcții — nivel avansat

Acum că știi de bază, hai să descoperim **superputerile** funcțiilor 🦸.

## 🎯 1. Parametri impliciți (default)

Dacă nu primește valoare, folosește una predefinită.

\`\`\`python
def saluta(nume="prieten"):
    print("Salut,", nume)

saluta()           # Salut, prieten
saluta("Ana")      # Salut, Ana
\`\`\`

## 🎯 2. Argumente cu nume (keyword)

Poți schimba ordinea dacă specifici numele:

\`\`\`python
def comanda(produs, cantitate=1, preț=0):
    print(f"{cantitate}x {produs} = {cantitate*preț}")

comanda(preț=5, produs="mere", cantitate=3)
# 3x mere = 15
\`\`\`

## 🎯 3. Multiple valori returnate

Python returnează un **tuplu** (mai multe valori într-una):

\`\`\`python
def min_max(numere):
    return min(numere), max(numere)

mic, mare = min_max([3, 1, 7, 2])
print(mic, mare)   # 1 7
\`\`\`

## 🎯 4. \`*args\` — număr variabil de argumente

\`\`\`python
def suma_toate(*numere):
    total = 0
    for n in numere:
        total += n
    return total

print(suma_toate(1, 2, 3))         # 6
print(suma_toate(1, 2, 3, 4, 5))   # 15
\`\`\`

## 🎯 5. Funcție în funcție (apel)

\`\`\`python
def patrat(x):
    return x * x

def suma_patrate(a, b):
    return patrat(a) + patrat(b)

print(suma_patrate(3, 4))   # 25
\`\`\`

## 🎯 6. Variabile locale vs globale

\`\`\`python
x = 10  # globală

def schimba():
    x = 99  # LOCALĂ — nu afectează cea de afară
    print("în funcție:", x)

schimba()       # în funcție: 99
print(x)        # 10  ← rămâne neschimbată
\`\`\`

## 📋 Recapitulare rapidă

- **Default** — \`def f(x=5):\`
- **Keyword** — \`f(x=10)\`
- **Multiple return** — \`return a, b\`
- **Variable args** — \`def f(*nums):\`
- **Variabile locale** — Există doar în funcție

## ⚠️ Greșeli frecvente

- **\`def f(x=5, y):\`** — Defaults la final: \`def f(y, x=5):\`
- **Folosești variabilă locală în afară** — Returnează valoarea sau folosește globală

## 🎓 Ce ai învățat
- ✅ Parametri default și keyword
- ✅ Returnarea mai multor valori
- ✅ \`*args\` — argumente variabile
- ✅ Local vs global
`,
    extraProblems: [
      mc('Parametru default',
        'Ce afișează `f()` dacă `def f(x=10): print(x)`?',
        ['Eroare', '10', 'None', '0'],
        '10',
        'Fără argument, parametrul ia valoarea implicită 10.',
        { topic: 'functions' }),
      mc('Ordinea defaults',
        'Care definiție e CORECTĂ?',
        ['def f(x=1, y):', 'def f(x, y=2):', 'def f(=1, y):', 'def f(x=1=2):'],
        'def f(x, y=2):',
        'Parametrii cu default trebuie să fie **după** cei fără default.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      sa('Multiple return',
        'Ce tip returnează `def f(): return 1, 2, 3` (un singur cuvânt)?',
        'tuple',
        'Python ambalează automat valorile separate cu virgulă într-un tuplu.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
      mc('*args',
        'Ce face `*args` într-o funcție?',
        ['Înmulțește argumentele', 'Acceptă orice număr de argumente poziționale', 'Înlocuiește return', 'Eroare'],
        'Acceptă orice număr de argumente poziționale',
        '`*args` colectează toate argumentele rămase într-un tuplu.',
        { topic: 'functions', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ LECȚIA: erori-try-except ============
  'erori-try-except': {
    theory: `# 🛡️ Erori și \`try / except\`

Programele dau **erori** uneori. În loc să se prăbușească, le putem **prinde** cu \`try/except\` 🥅.

## 🐛 Tipuri comune de erori

- **\`SyntaxError\`** — Când apare: Cod scris greșit • Exemplu: \`print("hi"\` (lipsește \`)\`)
- **\`NameError\`** — Când apare: Variabilă inexistentă • Exemplu: \`print(x)\` când x nu există
- **\`TypeError\`** — Când apare: Operație imposibilă pe tipul respectiv • Exemplu: \`"a" + 5\`
- **\`ValueError\`** — Când apare: Tip corect, valoare greșită • Exemplu: \`int("abc")\`
- **\`ZeroDivisionError\`** — Când apare: Împărțire la 0 • Exemplu: \`5 / 0\`
- **\`IndexError\`** — Când apare: Index inexistent • Exemplu: \`l[100]\`
- **\`KeyError\`** — Când apare: Cheie inexistentă în dict • Exemplu: \`d["x"]\`

## 🎯 Sintaxa de bază

\`\`\`python
try:
    n = int(input("Număr: "))
    print(10 / n)
except ZeroDivisionError:
    print("Nu pot împărți la zero!")
except ValueError:
    print("Nu ai introdus un număr!")
\`\`\`

## 🌐 Capturare generală

\`\`\`python
try:
    # cod riscant
    rezultat = ceva_periculos()
except Exception as e:
    print("S-a întâmplat o eroare:", e)
\`\`\`

> ⚠️ **Atenție**: nu prinde TOT (\`except:\` gol) — ascunde bug-uri!

## 🎯 \`else\` — dacă **nu** a fost eroare

\`\`\`python
try:
    n = int(input("Număr: "))
except ValueError:
    print("Greșit!")
else:
    print("Mulțumesc, ai introdus", n)
\`\`\`

## 🎯 \`finally\` — rulează **întotdeauna**

\`\`\`python
try:
    fisier = open("date.txt")
except FileNotFoundError:
    print("Nu există fișierul")
finally:
    print("Curăț ce trebuie")
\`\`\`

## 🎯 Ridici tu o eroare cu \`raise\`

\`\`\`python
def imparte(a, b):
    if b == 0:
        raise ValueError("b nu poate fi 0")
    return a / b
\`\`\`

## ⚠️ Greșeli frecvente

- **\`except:\` gol prinde și \`Ctrl+C\`** — Specifică tipul: \`except ValueError:\`
- **Pui mult cod în \`try\`** — Doar linia care poate da eroare

## 🎓 Ce ai învățat
- ✅ Tipurile comune de erori
- ✅ \`try / except\` — prinzi erorile
- ✅ \`else\` și \`finally\`
- ✅ \`raise\` pentru a ridica erori proprii
`,
    extraProblems: [
      mc('Eroare la împărțire',
        'Ce eroare apare la `5 / 0`?',
        ['ValueError', 'ZeroDivisionError', 'TypeError', 'NameError'],
        'ZeroDivisionError',
        'Împărțirea la zero ridică `ZeroDivisionError`.',
        { topic: 'errors' }),
      mc('Eroare int()',
        'Ce eroare apare la `int("salut")`?',
        ['ValueError', 'TypeError', 'NameError', 'SyntaxError'],
        'ValueError',
        'Tipul (str) e ok, dar valoarea "salut" nu poate fi convertită → `ValueError`.',
        { topic: 'errors' }),
      sa('Cuvântul cheie',
        'Ce cuvânt cheie folosești pentru a "prinde" erori?',
        'except',
        '`except TipEroare:` prinde eroarea respectivă.',
        { topic: 'errors' }),
      mc('finally',
        'Când rulează blocul `finally`?',
        ['Doar dacă e eroare', 'Doar dacă NU e eroare', '**Întotdeauna**, eroare sau nu', 'Niciodată'],
        '**Întotdeauna**, eroare sau nu',
        '`finally` e perfect pentru curățare (închidere fișiere etc.) — rulează garantat.',
        { topic: 'errors', difficulty: 'MEDIUM' }),
    ],
  },

  // ============ LECȚIA: oop-introducere ============
  'oop-introducere': {
    theory: `# 🏗️ OOP — Programare orientată pe obiecte

OOP înseamnă să gândim codul ca pe **obiecte din lumea reală** 🚗🐶📱. Fiecare obiect are:
- **Atribute** (caracteristici): culoare, vârstă, model
- **Metode** (acțiuni): pornește, latră, sună

## 🎯 Clasă = șablonul (rețeta)

Imaginează-ți o **rețetă de prăjituri** 🍪. Rețeta = **clasa**. Fiecare prăjitură făcută = **obiect** (instanță).

\`\`\`python
class Caine:
    def __init__(self, nume, varsta):
        self.nume = nume
        self.varsta = varsta

    def latra(self):
        print(f"{self.nume}: Ham ham!")
\`\`\`

## 🎯 Crearea obiectelor

\`\`\`python
rex = Caine("Rex", 3)
buddy = Caine("Buddy", 5)

rex.latra()       # Rex: Ham ham!
buddy.latra()     # Buddy: Ham ham!
print(rex.varsta) # 3
\`\`\`

## 🔍 Ce este \`__init__\` și \`self\`?

- **\`__init__\`** — Funcția "constructor" — rulează automat la crearea obiectului
- **\`self\`** — "Eu, obiectul curent" — referința către instanță

> 💡 Fiecare metodă **trebuie** să aibă \`self\` ca prim parametru.

## 🎯 Atribute & metode

\`\`\`python
class Elev:
    def __init__(self, nume):
        self.nume = nume
        self.note = []

    def adauga_nota(self, n):
        self.note.append(n)

    def medie(self):
        if not self.note:
            return 0
        return sum(self.note) / len(self.note)

ana = Elev("Ana")
ana.adauga_nota(9)
ana.adauga_nota(10)
print(ana.medie())   # 9.5
\`\`\`

## 🌳 De ce OOP?

- **Funcții și variabile separate** — Totul grupat logic
- **Greu de scalat** — Ușor de extins
- **Duplicare cod** — Reutilizare

## 🎯 Mini-vocabular OOP

- **Clasă** — șablonul
- **Obiect** (instanță) — un exemplar concret
- **Atribut** — variabilă a obiectului (\`self.nume\`)
- **Metodă** — funcție a clasei (\`def latra(self):\`)
- **Constructor** — \`__init__\`

## ⚠️ Greșeli frecvente

- **Uiți \`self\` în metodă** — \`def metoda(self, x):\`
- **Apelezi clasa fără paranteze** — \`obj = Clasa(args)\`
- **\`nume = "x"\` în loc de \`self.nume = "x"\`** — Atributele se setează prin self

## 🎓 Ce ai învățat
- ✅ Diferența clasă / obiect
- ✅ \`__init__\` setează atributele inițiale
- ✅ \`self\` = obiectul curent
- ✅ Metode = funcții ale clasei
`,
    extraProblems: [
      mc('Clasă vs obiect',
        'Care e relația între o clasă și un obiect?',
        ['Sunt sinonime', 'Clasa = șablon, obiectul = instanță concretă', 'Obiectul vine înainte de clasă', 'Nu există relație'],
        'Clasa = șablon, obiectul = instanță concretă',
        'Gândește la clasă ca rețeta și la obiect ca prăjitura făcută după rețetă.',
        { topic: 'oop' }),
      sa('Constructor',
        'Ce metodă specială rulează automat la crearea unui obiect (cu underscore-uri)?',
        '__init__',
        '`__init__` (dunder init) e constructorul Python.',
        { topic: 'oop', difficulty: 'MEDIUM' }),
      mc('self',
        'La ce se referă `self` într-o metodă?',
        ['Un cuvânt Python rezervat fără sens', 'La obiectul curent (instanța)', 'La clasă', 'La modul'],
        'La obiectul curent (instanța)',
        '`self` e referința la obiectul pe care a fost apelată metoda.',
        { topic: 'oop' }),
      mc('Apelarea metodei',
        'Cum apelezi metoda `latra` a obiectului `rex`?',
        ['latra(rex)', 'rex.latra()', 'rex->latra()', 'Caine.latra'],
        'rex.latra()',
        'Sintaxa: `obiect.metoda()`. Python trimite automat `rex` ca `self`.',
        { topic: 'oop' }),
    ],
  },

}
