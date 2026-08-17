// Quiz pack pentru Python — completează fiecare lecție la min 10 probleme.
// Conține DOAR întrebări MC/SA scurte (cele de coding vin din metodici).

import { mc, sa } from './helpers.mjs'

// ============================================================
// 1. introducere-print  (are 6 → +4)
// ============================================================
const introducerePrintQuiz = [
  mc(
    'Ce afișează print(2+3)?',
    'Ce va apărea pe ecran după `print(2+3)`?',
    ['"2+3"', '5', '"5"', 'Eroare'],
    '5',
    'Python evaluează expresia și afișează rezultatul: `5`.',
    { topic: 'print', tags: ['print', 'aritmetica'] }
  ),
  mc(
    'Ghilimele',
    'Care variantă afișează corect textul `Salut`?',
    ['print(Salut)', 'print("Salut")', 'print[Salut]', 'echo Salut'],
    'print("Salut")',
    'Textul (string) trebuie pus între ghilimele duble sau simple.',
    { topic: 'print', tags: ['string'] }
  ),
  sa(
    'Funcția pentru afișare',
    'Cum se numește funcția folosită pentru a afișa text pe ecran în Python? (un cuvânt, fără paranteze)',
    'print',
    '`print` este funcția standard de afișare în Python.',
    { topic: 'print' }
  ),
  mc(
    'Comentariu',
    'Care simbol marchează un comentariu pe o singură linie în Python?',
    ['//', '#', '<!--', '/*'],
    '#',
    'În Python, comentariile pe o linie încep cu `#`.',
    { topic: 'comentarii', tags: ['comentarii'] }
  ),
]

// ============================================================
// 2. variabile-tipuri  (6 → +4)
// ============================================================
const variabileQuiz = [
  mc(
    'Tipul lui 3.14',
    'Ce tip are valoarea `3.14` în Python?',
    ['int', 'float', 'str', 'bool'],
    'float',
    'Numerele cu virgulă (zecimale) au tipul `float`.',
    { topic: 'tipuri', tags: ['float'] }
  ),
  mc(
    'Tipul lui "5"',
    'Ce tip are valoarea `"5"` (cu ghilimele)?',
    ['int', 'float', 'str', 'bool'],
    'str',
    'Orice valoare între ghilimele este string (`str`), chiar dacă pare număr.',
    { topic: 'tipuri', tags: ['str'] }
  ),
  sa(
    'Funcția pentru tip',
    'Cum verifici tipul unei variabile `x` în Python? Răspunde cu apelul complet, ex: `func(x)`.',
    'type(x)',
    '`type(x)` returnează tipul valorii, ex: `<class \'int\'>`.',
    { topic: 'tipuri' }
  ),
  mc(
    'Nume valid de variabilă',
    'Care nume de variabilă NU este valid?',
    ['nume_user', '_data', '2nume', 'varsta1'],
    '2nume',
    'Numele de variabile NU pot începe cu o cifră.',
    { topic: 'variabile', tags: ['naming'] }
  ),
]

// ============================================================
// 3. input-conversii  (8 → +2)
// ============================================================
const inputConversiiQuiz = [
  mc(
    'input() returnează…',
    'Ce tip returnează întotdeauna funcția `input()`?',
    ['int', 'float', 'str', 'bool'],
    'str',
    '`input()` returnează ÎNTOTDEAUNA un string, chiar dacă utilizatorul tastează un număr.',
    { topic: 'input', tags: ['input', 'str'] }
  ),
  mc(
    'Convertire la întreg',
    'Care e modul corect de a converti textul `"42"` la număr întreg?',
    ['number("42")', 'int("42")', 'parseInt("42")', 'toInt("42")'],
    'int("42")',
    'Funcția `int(...)` convertește un string la întreg.',
    { topic: 'conversii', tags: ['int'] }
  ),
]

// ============================================================
// 8. while-loop-part2  (4 → +6)
// ============================================================
const whileLoopPart2Quiz = [
  mc(
    'Ce face break?',
    'Ce face cuvântul cheie `break` într-o buclă?',
    ['Sare peste iterația curentă', 'Iese complet din buclă', 'Restartează bucla', 'Pune pe pauză'],
    'Iese complet din buclă',
    '`break` oprește bucla imediat și execuția continuă după buclă.',
    { topic: 'while', tags: ['break'] }
  ),
  mc(
    'Ce face continue?',
    'Ce face cuvântul cheie `continue`?',
    ['Iese din buclă', 'Sare la următoarea iterație', 'Repornește programul', 'Termină funcția'],
    'Sare la următoarea iterație',
    '`continue` sare peste codul rămas și trece la iterația următoare.',
    { topic: 'while', tags: ['continue'] }
  ),
  mc(
    'Buclă infinită neintenționată',
    'Care din variantele de mai jos creează o buclă infinită neintenționată?',
    ['`i = 0; while i < 5: i += 1`', '`i = 0; while i < 5: print(i)`', '`while False: print("hi")`', '`for i in range(5): print(i)`'],
    '`i = 0; while i < 5: print(i)`',
    'Lipsește `i += 1` — `i` rămâne 0 pentru totdeauna și condiția nu devine falsă.',
    { topic: 'while', tags: ['infinit'], difficulty: 'MEDIUM' }
  ),
  sa(
    'Operator combinat',
    'Cum scrii prescurtat `i = i + 1` în Python?',
    'i += 1',
    '`+=` adună la valoarea existentă.',
    { topic: 'while', tags: ['operatori'] }
  ),
  mc(
    'Câte iterații?',
    'Câte numere afișează:\n```python\ni = 1\nwhile i <= 5:\n    print(i)\n    i += 1\n```',
    ['4', '5', '6', 'Buclă infinită'],
    '5',
    'Afișează 1, 2, 3, 4, 5 → exact 5 numere.',
    { topic: 'while' }
  ),
  mc(
    'Condiție inițial falsă',
    'Câte ori se execută corpul:\n```python\ni = 10\nwhile i < 5:\n    print(i)\n```',
    ['0', '1', '5', '10'],
    '0',
    'Condiția e falsă de la început, deci corpul nu se execută niciodată.',
    { topic: 'while' }
  ),
]

// ============================================================
// 9. while-true  (5 → +5)
// ============================================================
const whileTrueQuiz = [
  mc(
    'Cum oprești while True?',
    'Cum ieși dintr-o buclă `while True:`?',
    ['return', 'exit', 'break', 'stop'],
    'break',
    '`break` e singurul mod de a ieși dintr-o buclă infinită.',
    { topic: 'while-true', tags: ['break'] }
  ),
  mc(
    'Ce înseamnă True?',
    'Ce reprezintă `True` în Python?',
    ['Numărul 1', 'Valoare booleană "adevărat"', 'Un string', 'O eroare'],
    'Valoare booleană "adevărat"',
    '`True` și `False` sunt valori booleene (logice).',
    { topic: 'bool' }
  ),
  sa(
    'Validare input',
    'Care cuvânt cheie folosim ca să REFUZĂM inputul greșit și să cerem din nou într-un `while True:`? (un cuvânt)',
    'continue',
    '`continue` sare la următoarea iterație, repetând întrebarea.',
    { topic: 'while-true' }
  ),
  mc(
    'while 1 vs while True',
    'Care variantă NU este o buclă infinită corectă?',
    ['`while True:`', '`while 1:`', '`while "ok":`', '`while False:`'],
    '`while False:`',
    '`False` e fals → bucla nu rulează niciodată. Restul sunt „adevărate".',
    { topic: 'while-true', difficulty: 'MEDIUM' }
  ),
  mc(
    'Risk de break uitat',
    'Ce se întâmplă dacă uiți `break` într-un `while True:`?',
    ['Programul rulează la nesfârșit', 'Eroare de sintaxă', 'Programul se închide', 'Python adaugă break automat'],
    'Programul rulează la nesfârșit',
    'Bucla nu se va opri niciodată — risc real, mai ales în producție!',
    { topic: 'while-true' }
  ),
]

// ============================================================
// 10. while-true-practica  (9 → +1)
// ============================================================
const whileTruePracticaQuiz = [
  mc(
    'Cont de încercări',
    'Vrei să dai utilizatorului doar 3 încercări de parolă. Ce structură folosești?',
    ['`for _ in range(3): ...`', '`while True: ...` fără contor', '`if x == 3: break`', 'Un singur `if`'],
    '`for _ in range(3): ...`',
    'Pentru un număr FIX de încercări, `for range(N)` este cel mai potrivit.',
    { topic: 'while-true', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 11. for-range  (6 → +4)
// ============================================================
const forRangeQuiz = [
  mc(
    'range(5) generează…',
    'Ce numere generează `range(5)`?',
    ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '0, 1, 2, 3, 4, 5', '1, 2, 3, 4'],
    '0, 1, 2, 3, 4',
    '`range(N)` începe de la 0 și se oprește ÎNAINTE de N. Generează N valori.',
    { topic: 'range', tags: ['range'] }
  ),
  mc(
    'range(2, 7)',
    'Ce numere generează `range(2, 7)`?',
    ['2, 3, 4, 5, 6, 7', '2, 3, 4, 5, 6', '3, 4, 5, 6', '2, 7'],
    '2, 3, 4, 5, 6',
    'Începe de la 2 (inclusiv) și se oprește înainte de 7.',
    { topic: 'range' }
  ),
  mc(
    'range cu pas',
    'Ce numere generează `range(0, 10, 2)`?',
    ['0, 2, 4, 6, 8', '0, 2, 4, 6, 8, 10', '2, 4, 6, 8', '1, 3, 5, 7, 9'],
    '0, 2, 4, 6, 8',
    'Al treilea argument e pasul. Începe de la 0, sare câte 2, oprește înainte de 10.',
    { topic: 'range', difficulty: 'MEDIUM' }
  ),
  mc(
    'Descrescător',
    'Care `range(...)` afișează 5, 4, 3, 2, 1?',
    ['range(5, 0)', 'range(5, 0, -1)', 'range(1, 5, -1)', 'range(-5, 0)'],
    'range(5, 0, -1)',
    'Pas negativ înseamnă numărătoare inversă. Începe la 5, oprește înainte de 0.',
    { topic: 'range', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 12. for-vs-while  (9 → +1)
// ============================================================
const forVsWhileQuiz = [
  mc(
    'Când for, când while?',
    'Trebuie să citești numere până când utilizatorul tastează 0. Ce folosești?',
    ['for', 'while', 'if', 'break'],
    'while',
    'Nu știi câte numere va introduce → `while` cu condiție pe input.',
    { topic: 'for-vs-while' }
  ),
]

// ============================================================
// 13. nested-loops  (5 → +5)
// ============================================================
const nestedLoopsQuiz = [
  mc(
    'Câte iterații totale?',
    'Câte ori se execută `print(...)`?\n```python\nfor i in range(3):\n    for j in range(4):\n        print(i, j)\n```',
    ['7', '12', '3', '4'],
    '12',
    '3 × 4 = 12 iterații. Fiecare iterație externă rulează toate cele 4 interne.',
    { topic: 'nested', difficulty: 'MEDIUM' }
  ),
  mc(
    'Tabla de înmulțire',
    'Care variantă creează tabla de înmulțire 3×3?',
    [
      '`for i in range(3): print(i*i)`',
      '`for i in range(1,4):\n  for j in range(1,4):\n    print(i*j)`',
      '`for i,j in range(9): print(i*j)`',
      '`while i<3: print(i)`',
    ],
    '`for i in range(1,4):\n  for j in range(1,4):\n    print(i*j)`',
    'Două bucle imbricate, fiecare 1-3.',
    { topic: 'nested', difficulty: 'MEDIUM' }
  ),
  sa(
    'Variabilă pentru exterior',
    'Convențional, ce literă folosim pentru variabila buclei EXTERIOARE? (o singură literă)',
    'i',
    'Convenția: `i` exterior, `j` interior, `k` al treilea nivel.',
    { topic: 'nested' }
  ),
  mc(
    'Break în nested',
    'Un `break` într-o buclă internă oprește…',
    ['Tot programul', 'Doar bucla internă', 'Ambele bucle', 'Bucla externă'],
    'Doar bucla internă',
    '`break` oprește DOAR bucla din care face parte direct.',
    { topic: 'nested', difficulty: 'MEDIUM' }
  ),
  mc(
    'Matrice 2D',
    'Pentru a parcurge o matrice (listă de liste), folosim de obicei…',
    ['Un singur for', 'Două for-uri imbricate', 'while True', 'O recursie'],
    'Două for-uri imbricate',
    'Una pentru rânduri, una pentru coloane.',
    { topic: 'nested' }
  ),
]

// ============================================================
// 15. liste-operatii  (9 → +1)
// ============================================================
const listeOperatiiQuiz = [
  mc(
    'Lungimea listei',
    'Cum afli lungimea listei `[1, 2, 3, 4]`?',
    ['size(lista)', 'lista.length', 'len(lista)', 'count(lista)'],
    'len(lista)',
    '`len()` returnează numărul de elemente.',
    { topic: 'liste', tags: ['len'] }
  ),
]

// ============================================================
// 16. liste-random  (5 → +5)
// ============================================================
const listeRandomQuiz = [
  sa(
    'Importă random',
    'Cum imporți biblioteca random? (linia completă)',
    'import random',
    'Modulul standard `random` se importă cu `import random`.',
    { topic: 'random' }
  ),
  mc(
    'random.randint',
    'Ce face `random.randint(1, 10)`?',
    ['Număr între 1 și 9', 'Număr între 1 și 10 (inclusiv)', 'Număr între 0 și 10', '10 numere'],
    'Număr între 1 și 10 (inclusiv)',
    '`randint(a, b)` include AMBELE capete.',
    { topic: 'random' }
  ),
  mc(
    'random.choice',
    'Ce face `random.choice([1,2,3])`?',
    ['Suma listei', 'Un element aleator din listă', 'Lungimea listei', 'O listă nouă'],
    'Un element aleator din listă',
    '`choice` selectează aleator UN element.',
    { topic: 'random' }
  ),
  mc(
    'Amestecă lista',
    'Cum amesteci aleator o listă `lst`?',
    ['random.shuffle(lst)', 'random.mix(lst)', 'lst.random()', 'shuffle(lst)'],
    'random.shuffle(lst)',
    '`shuffle` modifică lista pe loc (in-place).',
    { topic: 'random' }
  ),
  sa(
    'Număr între 0 și 1',
    'Ce funcție din random returnează un float aleator între 0 și 1? (doar numele, fără paranteze)',
    'random',
    '`random.random()` → float în [0, 1).',
    { topic: 'random' }
  ),
]

// ============================================================
// 17. liste-loop  (5 → +5)
// ============================================================
const listeLoopQuiz = [
  mc(
    'For pe listă',
    'Care e modul corect de a parcurge `lista = [10, 20, 30]`?',
    ['for i in lista:', 'for i = 1 to 3:', 'foreach i in lista', 'while lista:'],
    'for i in lista:',
    'În Python iterăm direct cu `for x in lista:`.',
    { topic: 'liste-loop' }
  ),
  mc(
    'Acces cu index și valoare',
    'Cum obții ATÂT indexul cât și valoarea într-un for?',
    ['for i, v in lista:', 'for i, v in enumerate(lista):', 'for i in lista, v:', 'for index in lista:'],
    'for i, v in enumerate(lista):',
    '`enumerate()` returnează perechi (index, valoare).',
    { topic: 'liste-loop', difficulty: 'MEDIUM' }
  ),
  mc(
    'Suma listei',
    'Care variantă calculează suma listei `[1,2,3,4]`?',
    ['len([1,2,3,4])', 'sum([1,2,3,4])', 'max([1,2,3,4])', 'list([1,2,3,4])'],
    'sum([1,2,3,4])',
    'Funcția `sum()` calculează suma unei liste de numere.',
    { topic: 'liste-loop', tags: ['sum'] }
  ),
  mc(
    'Maxim',
    'Cum afli cel mai mare element dintr-o listă `lst`?',
    ['max(lst)', 'lst.max()', 'big(lst)', 'lst[-1]'],
    'max(lst)',
    '`max()` găsește cea mai mare valoare.',
    { topic: 'liste-loop', tags: ['max'] }
  ),
  mc(
    'List comprehension',
    'Ce face `[x*2 for x in [1,2,3]]`?',
    ['[1,2,3]', '[2,4,6]', '[1,4,9]', 'Eroare'],
    '[2,4,6]',
    'Fiecare element e dublat → o listă nouă.',
    { topic: 'liste-loop', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 18. algoritmi-simpli  (5 → +5)
// ============================================================
const algoritmiQuiz = [
  mc(
    'Caută în listă',
    'Cea mai simplă cale de a verifica dacă `5` se află în `[1,2,3,5]`?',
    ['lista.find(5)', '5 in lista', 'search(5, lista)', 'lista[5]'],
    '5 in lista',
    'Operatorul `in` returnează `True`/`False`.',
    { topic: 'algoritmi' }
  ),
  mc(
    'Numără apariții',
    'Cum numeri câte 3-uri sunt în `[1,3,2,3,3]`?',
    ['lista.count(3)', 'count(lista, 3)', 'lista.find(3)', 'len(3, lista)'],
    'lista.count(3)',
    'Metoda `.count(x)` numără aparițiile.',
    { topic: 'algoritmi' }
  ),
  mc(
    'Sortare crescătoare',
    'Cum sortezi crescător lista `lst` în loc?',
    ['lst.sort()', 'sort(lst)', 'lst.order()', 'lst.asc()'],
    'lst.sort()',
    '`.sort()` modifică lista. `sorted(lst)` returnează una nouă.',
    { topic: 'algoritmi' }
  ),
  mc(
    'Inversează lista',
    'Cum inversezi ordinea elementelor în `lst`?',
    ['lst.reverse()', 'lst.invert()', 'lst.flip()', 'lst[::-1].sort()'],
    'lst.reverse()',
    '`.reverse()` modifică lista pe loc. Și `lst[::-1]` returnează una inversată.',
    { topic: 'algoritmi' }
  ),
  mc(
    'Media',
    'Care formula calculează media unei liste de numere?',
    ['sum(lst) / len(lst)', 'sum(lst) * len(lst)', 'len(lst) / sum(lst)', 'avg(lst)'],
    'sum(lst) / len(lst)',
    'Suma împărțită la numărul de elemente.',
    { topic: 'algoritmi' }
  ),
]

// ============================================================
// 20. text-validare  (4 → +6)
// ============================================================
const textValidareQuiz = [
  mc(
    'isalpha()',
    'Ce verifică metoda `c.isalpha()`?',
    ['Dacă e cifră', 'Dacă e literă', 'Dacă e spațiu', 'Dacă e majusculă'],
    'Dacă e literă',
    '`isalpha()` returnează True dacă caracterul e literă (a-z, A-Z, +diacritice).',
    { topic: 'string', tags: ['isalpha'] }
  ),
  mc(
    'isdigit()',
    'Ce returnează `"123".isdigit()`?',
    ['True', 'False', '123', 'Eroare'],
    'True',
    '`isdigit()` returnează True dacă TOATE caracterele sunt cifre.',
    { topic: 'string', tags: ['isdigit'] }
  ),
  mc(
    'isspace()',
    'Ce returnează `" ".isspace()`?',
    ['True', 'False', '0', 'Eroare'],
    'True',
    '`isspace()` returnează True pentru caractere de spațiu.',
    { topic: 'string' }
  ),
  mc(
    'isalnum()',
    'Ce verifică `s.isalnum()`?',
    ['Doar litere', 'Doar cifre', 'Litere SAU cifre (fără spații)', 'Doar litere mari'],
    'Litere SAU cifre (fără spații)',
    '`isalnum` = alphanumeric: doar caractere alfanumerice.',
    { topic: 'string', difficulty: 'MEDIUM' }
  ),
  mc(
    'Lungime minimă',
    'Cum verifici că un string `s` are cel puțin 3 caractere?',
    ['s.size > 3', 'len(s) >= 3', 's.length > 3', 'count(s) >= 3'],
    'len(s) >= 3',
    '`len(s)` și `>=` pentru „cel puțin".',
    { topic: 'string' }
  ),
  mc(
    'Începe cu...',
    'Cum verifici că `s` începe cu litera `A`?',
    ['s.startsWith("A")', 's.startswith("A")', 's[0] = "A"', 'A in s'],
    's.startswith("A")',
    'În Python: `startswith` (litere mici, snake_case).',
    { topic: 'string' }
  ),
]

// ============================================================
// 21. pizzeria-exersare  (3 → +7)
// ============================================================
const pizzeriaQuiz = [
  mc(
    'Cod necunoscut',
    'În if/elif lung pentru coduri A-H, ce folosim pentru cod necunoscut?',
    ['if cod == None', 'else', 'continue', 'pass'],
    'else',
    '`else` la sfârșit acoperă toate celelalte cazuri.',
    { topic: 'pizzerie' }
  ),
  mc(
    'Iterare comandă',
    'Cum parcurgem fiecare literă din `comanda = "ABEF"`?',
    ['for cod in comanda:', 'for cod in comanda[]:', 'while comanda:', 'comanda.each()'],
    'for cod in comanda:',
    'Iterăm direct pe caracterele unui string.',
    { topic: 'pizzerie' }
  ),
  mc(
    'Fără duplicate',
    'Pentru a păstra doar primele apariții ale codurilor, ce verificare folosim?',
    ['if cod not in lista:', 'if cod == lista:', 'if cod in lista:', 'if lista.has(cod):'],
    'if cod not in lista:',
    '`not in` verifică absența — adăugăm doar dacă nu e deja.',
    { topic: 'pizzerie', difficulty: 'MEDIUM' }
  ),
  mc(
    'Dicționar pentru meniu',
    'Care structură e mai elegantă decât un lanț lung de elif pentru meniu?',
    ['Listă', 'Dicționar', 'Tuple', 'Set'],
    'Dicționar',
    'Un dicționar `{cod: nume}` permite lookup direct fără elif-uri.',
    { topic: 'pizzerie', difficulty: 'MEDIUM' }
  ),
  sa(
    'Lookup în dicționar',
    'Cum obții valoarea pentru cheia `"A"` din `meniu = {"A":"pizza", "B":"cola"}`?',
    'meniu["A"]',
    'Notația cu paranteze drepte și cheia.',
    { topic: 'pizzerie' }
  ),
  mc(
    'Lungime comandă',
    'Cum afli câte produse sunt în `comanda = "BEGF"`?',
    ['comanda.size', 'len(comanda)', 'count(comanda)', 'comanda.length'],
    'len(comanda)',
    '`len()` pe un string returnează numărul de caractere.',
    { topic: 'pizzerie' }
  ),
  mc(
    'Concatenare în loop',
    'Ce face acest cod?\n```python\ns = ""\nfor c in "abc":\n    s += c.upper()\n```',
    ['Eroare', '"abc"', '"ABC"', '"a"+"b"+"c"'],
    '"ABC"',
    'Construim string nou caracter cu caracter, fiecare uppercase.',
    { topic: 'pizzerie', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 23. tupluri  (6 → +4)
// ============================================================
const tupluriQuiz = [
  mc(
    'Sintaxă tuplu',
    'Care e sintaxa corectă pentru un tuplu cu 3 elemente?',
    ['[1, 2, 3]', '(1, 2, 3)', '{1, 2, 3}', '<1, 2, 3>'],
    '(1, 2, 3)',
    'Tuplurile folosesc paranteze rotunde.',
    { topic: 'tupluri' }
  ),
  mc(
    'Imutabilitate',
    'Ce se întâmplă dacă încerci `t = (1,2,3); t[0] = 5`?',
    ['t devine (5,2,3)', 'TypeError', 'Nu se întâmplă nimic', 't devine [5,2,3]'],
    'TypeError',
    'Tuplurile sunt IMUTABILE — nu pot fi modificate după creare.',
    { topic: 'tupluri', tags: ['imutabil'] }
  ),
  mc(
    'Tuplu cu un element',
    'Care e sintaxa corectă pentru un tuplu cu UN singur element?',
    ['(5)', '(5,)', '[5]', '{5}'],
    '(5,)',
    'Fără virgulă, `(5)` e doar un număr între paranteze. Virgula creează tuplul!',
    { topic: 'tupluri', difficulty: 'MEDIUM' }
  ),
  mc(
    'Unpacking',
    'Ce se întâmplă cu `a, b = (10, 20)`?',
    ['a=10, b=20', 'a=(10,20), b=None', 'Eroare', 'a=20, b=10'],
    'a=10, b=20',
    'Unpacking — desfaci tupluri în variabile separate.',
    { topic: 'tupluri', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 24. functii-basic  (5 → +5)
// ============================================================
const functiiBasicQuiz = [
  sa(
    'Cuvântul cheie',
    'Cu ce cuvânt cheie definești o funcție în Python?',
    'def',
    '`def nume(...)` definește o funcție.',
    { topic: 'functii' }
  ),
  mc(
    'Sintaxă corectă',
    'Care variantă definește corect o funcție `salut(nume)`?',
    ['function salut(nume):', 'def salut(nume):', 'fn salut(nume):', 'salut(nume) =>'],
    'def salut(nume):',
    'Sintaxa Python: `def nume(parametri):`.',
    { topic: 'functii' }
  ),
  mc(
    'Returnare valoare',
    'Cum returnezi o valoare dintr-o funcție?',
    ['print x', 'return x', 'give x', 'yield x'],
    'return x',
    '`return` trimite valoarea înapoi la apelator.',
    { topic: 'functii' }
  ),
  mc(
    'Funcție fără return',
    'Ce returnează o funcție care NU are `return`?',
    ['0', '""', 'None', 'Eroare'],
    'None',
    'Implicit, funcțiile fără `return` returnează `None`.',
    { topic: 'functii' }
  ),
  mc(
    'Apel funcție',
    'Cum APELEZI funcția `salut(nume)` cu valoarea `"Ana"`?',
    ['salut Ana', 'call salut("Ana")', 'salut("Ana")', 'salut[Ana]'],
    'salut("Ana")',
    'Paranteze + argumente între ghilimele pentru string.',
    { topic: 'functii' }
  ),
]

// ============================================================
// 25. functii-avansat  (5 → +5)
// ============================================================
const functiiAvansatQuiz = [
  mc(
    'Parametru cu default',
    'Care variantă definește un parametru cu valoare implicită?',
    ['def f(x = 10):', 'def f(x: 10):', 'def f(x = default 10):', 'def f(x | 10):'],
    'def f(x = 10):',
    'Sintaxă: `nume = valoare` în lista de parametri.',
    { topic: 'functii-avansat' }
  ),
  mc(
    'Argumente nominale',
    'Apelează `f(a=1, b=2)`. Acest stil se numește…',
    ['poziționale', 'keyword arguments', 'lambda', 'default'],
    'keyword arguments',
    'Numele parametrului = explicit la apel = mai clar.',
    { topic: 'functii-avansat', difficulty: 'MEDIUM' }
  ),
  mc(
    '*args',
    'Ce permite `*args` într-o definiție de funcție?',
    ['Un singur parametru obligatoriu', 'Număr variabil de argumente poziționale', 'Un dicționar', 'Doar string-uri'],
    'Număr variabil de argumente poziționale',
    '`*args` colectează toate argumentele suplimentare într-un tuplu.',
    { topic: 'functii-avansat', difficulty: 'MEDIUM' }
  ),
  mc(
    '**kwargs',
    'Ce face `**kwargs`?',
    ['Listă de erori', 'Dicționar de argumente nominale', 'Operator de putere', 'Importă bibliotecă'],
    'Dicționar de argumente nominale',
    '`**kwargs` colectează argumente nominale într-un dicționar.',
    { topic: 'functii-avansat', difficulty: 'HARD' }
  ),
  mc(
    'Lambda',
    'Care variantă creează o funcție lambda care înmulțește cu 2?',
    ['lambda x: x*2', 'def lambda(x): x*2', 'fn(x) => x*2', 'lambda(x) = x*2'],
    'lambda x: x*2',
    'Sintaxă lambda: `lambda parametri: expresie`.',
    { topic: 'functii-avansat', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 26. erori-try-except  (5 → +5)
// ============================================================
const eroriQuiz = [
  mc(
    'Cuvinte cheie',
    'Care pereche de cuvinte cheie folosim pentru tratarea erorilor?',
    ['try / catch', 'try / except', 'attempt / rescue', 'do / handle'],
    'try / except',
    'Python folosește `try` + `except` (NU `catch` ca Java/JS).',
    { topic: 'erori' }
  ),
  mc(
    'Împărțire la 0',
    'Ce excepție generează `10 / 0`?',
    ['ValueError', 'ZeroDivisionError', 'TypeError', 'IndexError'],
    'ZeroDivisionError',
    'Împărțirea la zero generează `ZeroDivisionError`.',
    { topic: 'erori' }
  ),
  mc(
    'int("abc")',
    'Ce excepție generează `int("abc")`?',
    ['NameError', 'ValueError', 'TypeError', 'KeyError'],
    'ValueError',
    'Valoarea nu poate fi convertită → `ValueError`.',
    { topic: 'erori' }
  ),
  mc(
    'lista[100]',
    'Ce excepție generează `[1,2,3][100]`?',
    ['KeyError', 'IndexError', 'ValueError', 'AttributeError'],
    'IndexError',
    'Index în afara intervalului → `IndexError`.',
    { topic: 'erori' }
  ),
  mc(
    'finally',
    'La ce folosește blocul `finally`?',
    ['Numai dacă nu e eroare', 'ÎNTOTDEAUNA, indiferent de eroare', 'Doar pentru ValueError', 'Înlocuiește try'],
    'ÎNTOTDEAUNA, indiferent de eroare',
    '`finally` rulează garantat — pentru cleanup (închidere fișiere etc.).',
    { topic: 'erori', difficulty: 'MEDIUM' }
  ),
]

// ============================================================
// 27. oop-introducere  (5 → +5)
// ============================================================
const oopQuiz = [
  sa(
    'Cuvântul cheie pentru clasă',
    'Cu ce cuvânt cheie definești o clasă în Python?',
    'class',
    '`class NumeClasa:` definește o clasă.',
    { topic: 'oop' }
  ),
  mc(
    'Constructor',
    'Cum se numește metoda specială pentru constructor în Python?',
    ['__init__', '__new__', 'constructor', 'init'],
    '__init__',
    '`__init__` este apelat automat la crearea unui obiect.',
    { topic: 'oop' }
  ),
  mc(
    'Primul parametru',
    'Cum se numește (prin convenție) primul parametru al metodelor unei clase?',
    ['this', 'self', 'me', 'cls'],
    'self',
    'În Python, `self` reprezintă instanța curentă (echivalent cu `this` din alte limbaje).',
    { topic: 'oop' }
  ),
  mc(
    'Creare obiect',
    'Cum creezi un obiect din clasa `Caine`?',
    ['Caine.new()', 'new Caine()', 'Caine()', 'create Caine'],
    'Caine()',
    'În Python: pur și simplu `NumeClasa(...)`.',
    { topic: 'oop' }
  ),
  mc(
    'Atribut de instanță',
    'Cum accesezi atributul `nume` al obiectului `c`?',
    ['c.nume', 'c["nume"]', 'c->nume', 'c::nume'],
    'c.nume',
    'Notația cu punct: `obiect.atribut`.',
    { topic: 'oop' }
  ),
]

// ============================================================
// EXPORT
// ============================================================
export const pythonQuizPack = {
  appendProblems: {
    'introducere-print': introducerePrintQuiz,
    'variabile-tipuri': variabileQuiz,
    'input-conversii': inputConversiiQuiz,
    'while-loop-part2': whileLoopPart2Quiz,
    'while-true': whileTrueQuiz,
    'while-true-practica': whileTruePracticaQuiz,
    'for-range': forRangeQuiz,
    'for-vs-while': forVsWhileQuiz,
    'nested-loops': nestedLoopsQuiz,
    'liste-operatii': listeOperatiiQuiz,
    'liste-random': listeRandomQuiz,
    'liste-loop': listeLoopQuiz,
    'algoritmi-simpli': algoritmiQuiz,
    'text-validare': textValidareQuiz,
    'pizzeria-exersare': pizzeriaQuiz,
    'tupluri': tupluriQuiz,
    'functii-basic': functiiBasicQuiz,
    'functii-avansat': functiiAvansatQuiz,
    'erori-try-except': eroriQuiz,
    'oop-introducere': oopQuiz,
  },
}
