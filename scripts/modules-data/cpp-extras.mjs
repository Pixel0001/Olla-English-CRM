// C++ — pachet de lecții suplimentare (metodica-extra)
// Adaugă ~13 lecții noi cu accent pe Liste/Matrice/Struct/File I/O.
// Stil: teorie prietenoasă cu icons (ca la JS/Python enriched) + 10 probleme/lecție.

import { mc, sa, io, code } from './helpers.mjs'

const T = 'cpp'

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 13: Matrice (tablouri 2D)
// ────────────────────────────────────────────────────────────────────────────
const matrice = {
  title: 'Matrice (Tablouri 2D)',
  slug: 'matrice',
  isFree: false,
  theory: `# 🧮 Matrice în C++

O **matrice** este un tablou cu **rânduri și coloane** — exact ca o tablă de șah, un tabel Excel sau o hartă de joc.

\`\`\`cpp
int matrice[3][4]; // 3 rânduri × 4 coloane = 12 elemente
\`\`\`

## :bulb: Cum o vedem mental

| col→ | 0 | 1 | 2 | 3 |
|------|---|---|---|---|
| **0** | 0 | 0 | 0 | 0 |
| **1** | 0 | 0 | 0 | 0 |
| **2** | 0 | 0 | 0 | 0 |

## :rocket: Inițializare

\`\`\`cpp
int m[2][3] = {
  {1, 2, 3},
  {4, 5, 6}
};
\`\`\`

## :gear: Acces la element
\`\`\`cpp
m[0][2] = 99;          // setezi
cout << m[1][0];       // citești → 4
\`\`\`

## :arrow_forward: Parcurgere completă (două for-uri)
\`\`\`cpp
for (int i = 0; i < 2; i++) {
  for (int j = 0; j < 3; j++) {
    cout << m[i][j] << " ";
  }
  cout << "\\n";
}
\`\`\`

> :warning: **ATENȚIE:** \`m[i][j]\` — primul indice este **rândul**, al doilea este **coloana**.

## :star: Aplicații tipice
- **Tabla de șah** (8×8)
- **Imagini pixel** (lățime × înălțime)
- **Hărți de joc** (labirinturi)
- **Tabele de scoruri** pentru clasamente
- **Matricea unei probleme** la olimpiadă (sume, diagonale)

## :memo: Pattern-uri uzuale

**Suma elementelor:**
\`\`\`cpp
int suma = 0;
for (int i = 0; i < n; i++)
  for (int j = 0; j < m; j++)
    suma += mat[i][j];
\`\`\`

**Diagonala principală** (i == j):
\`\`\`cpp
for (int i = 0; i < n; i++) cout << mat[i][i];
\`\`\`

**Diagonala secundară** (i + j == n-1):
\`\`\`cpp
for (int i = 0; i < n; i++) cout << mat[i][n-1-i];
\`\`\`
`,
  problems: [
    mc('Câte elemente are int m[3][5]?',
      'Câte celule conține o matrice declarată `int m[3][5]`?',
      ['8', '15', '35', '53'], '15',
      'Numărul total = rânduri × coloane = 3 × 5 = **15** elemente.',
      { topic: T, tags: ['matrice'] }),
    mc('Acces la element',
      'Care este sintaxa pentru a accesa elementul de pe rândul 2, coloana 1?',
      ['m(2,1)', 'm[2][1]', 'm[2,1]', 'm.at(2)(1)'], 'm[2][1]',
      'În C++ se folosesc două perechi de paranteze drepte, una pentru rând, alta pentru coloană.',
      { topic: T }),
    mc('Ordinea indicilor',
      'În `m[i][j]`, ce reprezintă `i`?',
      ['Coloana', 'Rândul', 'Elementul total', 'Mărimea matricei'], 'Rândul',
      'Convenția este: **primul** indice = rândul, **al doilea** = coloana.',
      { topic: T }),
    mc('Suma diagonalei principale',
      'Pentru matricea\n```\n1 2 3\n4 5 6\n7 8 9\n```\nCare este suma diagonalei principale?',
      ['12', '15', '24', '45'], '15',
      'Diagonala principală: 1 + 5 + 9 = **15**.',
      { topic: T, difficulty: 'MEDIUM' }),
    mc('Iterare corectă',
      'Care for-uri parcurg corect o matrice 3×4?',
      [
        'for(i=0;i<3;i++) for(j=0;j<4;j++)',
        'for(i=0;i<4;i++) for(j=0;j<3;j++)',
        'for(i=1;i<=3;i++) for(j=1;j<=4;j++)',
        'for(i=0;i<=3;i++) for(j=0;j<=4;j++)',
      ], 'for(i=0;i<3;i++) for(j=0;j<4;j++)',
      'Indicii merg de la 0 la **rânduri-1** și de la 0 la **coloane-1**.',
      { topic: T }),
    sa('Element din matrice',
      'Pentru `int m[2][3] = {{10,20,30},{40,50,60}};`, ce afișează `cout << m[1][2];`?',
      '60',
      '`m[1]` = al doilea rând = {40,50,60}; apoi `[2]` = al treilea element = **60**.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Total elemente',
      'Câte elemente are `double tabel[5][7]`?',
      '35',
      '5 × 7 = 35 elemente de tip double.',
      { topic: T }),
    code('Citește și afișează matricea',
      'Citește `n` și `m` (dimensiuni) apoi `n*m` numere și afișează matricea pe ecran, separate prin spații, fiecare rând pe o linie nouă.',
      'cpp',
      `#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int mat[100][100];
    // citește elementele
    
    // afișează matricea
    
    return 0;
}`,
      'Folosește două for-uri imbricate pentru citire și încă două pentru afișare.',
      { topic: T, difficulty: 'MEDIUM', estimatedTime: 10 }),
    code('Suma matricei',
      'Citește o matrice n×m și afișează suma tuturor elementelor.',
      'cpp',
      `#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int mat[100][100];
    long long suma = 0;
    
    // TODO: citește și calculează suma
    
    cout << suma;
    return 0;
}`,
      'Acumulator `suma` pornește de la 0; în for-urile imbricate `suma += mat[i][j]`.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Maxim pe fiecare rând',
      'Citește o matrice și afișează maximul de pe fiecare rând (un număr per linie).',
      'cpp',
      `#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int mat[100][100];
    
    // TODO: citește matricea și afișează maximul pe rând
    
    return 0;
}`,
      'Pentru fiecare rând: inițializezi `maxim = mat[i][0]`, apoi compari cu restul elementelor de pe rând.',
      { topic: T, difficulty: 'HARD', points: 30 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 14: Struct în C++
// ────────────────────────────────────────────────────────────────────────────
const structCpp = {
  title: 'Struct — Date Grupate',
  slug: 'struct-cpp',
  isFree: false,
  theory: `# :package: Struct în C++

Un **struct** îți permite să **grupezi mai multe date** despre același obiect într-o singură variabilă.

## :thinking: De ce struct?

Imaginează-ți că vrei să stochezi un **elev**:
- nume
- vârstă
- nota la matematică

Fără struct ai avea 3 variabile separate. **Cu struct** — toate într-un singur "container":

\`\`\`cpp
struct Elev {
    string nume;
    int varsta;
    double nota;
};
\`\`\`

## :rocket: Folosire

\`\`\`cpp
Elev e;
e.nume = "Ana";
e.varsta = 14;
e.nota = 9.5;

cout << e.nume << " are " << e.varsta << " ani.";
\`\`\`

## :bulb: Inițializare rapidă
\`\`\`cpp
Elev e = {"Ana", 14, 9.5};
\`\`\`

## :gear: Vector de structuri (LISTĂ de obiecte!)
\`\`\`cpp
Elev clasa[30];
clasa[0] = {"Ana", 14, 9.5};
clasa[1] = {"Mihai", 13, 8.2};

for (int i = 0; i < 2; i++) {
    cout << clasa[i].nume << " — " << clasa[i].nota << "\\n";
}
\`\`\`

## :star: Avantaje

| Fără struct | Cu struct |
|-------------|-----------|
| 3 vectori paraleli (nume[], varsta[], nota[]) | 1 vector de struct |
| Greu de transmis funcțiilor | Pasezi 1 obiect |
| Erori dacă uiți să sincronizezi | Date legate logic |

## :warning: Atenție la \`;\` după \`}\`

\`\`\`cpp
struct Punct {
    int x;
    int y;
}; // ← punct și virgulă OBLIGATORIU!
\`\`\`

## :memo: Struct cu metode (mini-clasă)
\`\`\`cpp
struct Cerc {
    double raza;
    double aria() {
        return 3.14159 * raza * raza;
    }
};

Cerc c = {5.0};
cout << c.aria(); // 78.54
\`\`\`
`,
  problems: [
    mc('Operator pentru câmp',
      'Cu ce operator accesezi un câmp dintr-un struct?',
      ['->', '.', '::', '@'], '.',
      'Pentru variabile struct (nu pointeri) folosești operatorul **punct** (`.`).',
      { topic: T, tags: ['struct'] }),
    mc('Sintaxă corectă declarare',
      'Care este declarația corectă a unui struct?',
      [
        'struct Punct { int x; int y; }',
        'struct Punct { int x; int y; };',
        'class Punct { int x, y };',
        'Punct = { int x; int y; }',
      ],
      'struct Punct { int x; int y; };',
      'OBLIGATORIU `;` la final, după acolada de închidere.',
      { topic: T }),
    mc('Vectori vs struct',
      'Care e avantajul folosirii unui struct în loc de mai mulți vectori paraleli?',
      [
        'E mai rapid',
        'Datele rămân logic legate într-un singur obiect',
        'Folosește mai puțină memorie',
        'Permite mai multe elemente',
      ],
      'Datele rămân logic legate într-un singur obiect',
      'Struct grupează datele înrudite, eliminând riscul de desincronizare între vectori paraleli.',
      { topic: T, difficulty: 'MEDIUM' }),
    mc('Acces la câmp prin index',
      'Pentru `Elev clasa[10];` cum accesezi numele elevului 3?',
      ['clasa.nume[3]', 'clasa[3].nume', 'clasa->3.nume', 'clasa(3).nume'], 'clasa[3].nume',
      'Întâi indexezi în vector (`clasa[3]`), apoi accesezi câmpul (`.nume`).',
      { topic: T }),
    mc('Inițializare rapidă',
      'Care e o sintaxă validă pentru a inițializa un Punct cu x=3 și y=5?',
      ['Punct p(3, 5);', 'Punct p = {3, 5};', 'Punct p[3][5];', 'Punct p = 3, 5;'], 'Punct p = {3, 5};',
      'Cu acolade poți inițializa toate câmpurile în ordinea declarării.',
      { topic: T }),
    sa('Câte câmpuri',
      'Câte câmpuri are: `struct Carte { string titlu; string autor; int anAparitie; double pret; };`',
      '4',
      'Sunt 4 câmpuri: titlu, autor, anAparitie, pret.',
      { topic: T }),
    sa('Caracter de separare',
      'Ce caracter trebuie să apară OBLIGATORIU după acolada de închidere a unui struct?',
      ';',
      'Punct și virgulă (`;`) este obligatoriu — altfel apare eroare de compilare.',
      { topic: T }),
    code('Struct Cerc',
      'Definește un struct `Cerc` cu un singur câmp `raza` (double). Citește raza de la utilizator și afișează aria (π × r²) cu 2 zecimale.',
      'cpp',
      `#include <iostream>
#include <iomanip>
using namespace std;

struct Cerc {
    double raza;
};

int main() {
    Cerc c;
    cin >> c.raza;
    
    // TODO: afișează aria cu 2 zecimale
    cout << fixed << setprecision(2);
    
    return 0;
}`,
      'Aria = 3.14159 * c.raza * c.raza. Folosește `setprecision(2)` pentru 2 zecimale.',
      { topic: T, difficulty: 'EASY' }),
    code('Vector de structuri',
      'Definește struct `Elev { string nume; double nota; }`. Citește n, apoi n elevi (nume + notă) și afișează numele elevului cu nota cea mai mare.',
      'cpp',
      `#include <iostream>
using namespace std;

struct Elev {
    string nume;
    double nota;
};

int main() {
    int n;
    cin >> n;
    Elev clasa[100];
    
    // TODO: citește n elevi și afișează numele celui cu nota maximă
    
    return 0;
}`,
      'Reține indicele celui cu cea mai mare notă în timpul citirii, apoi afișează `clasa[idxMax].nume`.',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
    code('Distanța între 2 puncte',
      'Definește struct `Punct { double x, y; }`. Citește două puncte și afișează distanța euclidiană dintre ele cu 3 zecimale.',
      'cpp',
      `#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

struct Punct {
    double x, y;
};

int main() {
    Punct p1, p2;
    cin >> p1.x >> p1.y >> p2.x >> p2.y;
    
    // TODO: distanța = sqrt((x2-x1)² + (y2-y1)²)
    
    return 0;
}`,
      'Folosește `sqrt` din `<cmath>`: `sqrt(pow(p2.x-p1.x, 2) + pow(p2.y-p1.y, 2))`.',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 15: Liste (vector avansat + listă înlănțuită simplă)
// ────────────────────────────────────────────────────────────────────────────
const listeAvansat = {
  title: 'Liste — vector & list',
  slug: 'liste-avansate',
  isFree: false,
  theory: `# :books: Liste în C++

În C++ ai mai multe tipuri de **liste**:

| Tip | Header | Caracteristică |
|-----|--------|----------------|
| \`vector<T>\` | \`<vector>\` | Listă dinamică (cea mai folosită) |
| \`list<T>\` | \`<list>\` | Listă dublu-înlănțuită |
| \`deque<T>\` | \`<deque>\` | Coadă cu acces la ambele capete |
| Tablou \`T arr[N]\` | — | Mărime fixă |

## :rocket: vector — vedeta C++

\`\`\`cpp
#include <vector>
using namespace std;

vector<int> v;          // listă goală
v.push_back(10);        // adaugă la final
v.push_back(20);
v.push_back(30);

cout << v.size();       // 3
cout << v[0];           // 10
cout << v.back();       // 30
\`\`\`

## :bulb: Operații frecvente

| Operație | Cod |
|----------|-----|
| Adaugă la final | \`v.push_back(x)\` |
| Șterge ultimul | \`v.pop_back()\` |
| Mărimea | \`v.size()\` |
| Golire | \`v.clear()\` |
| Verifică gol | \`v.empty()\` |
| Inserare poziție | \`v.insert(v.begin()+i, x)\` |
| Ștergere poziție | \`v.erase(v.begin()+i)\` |

## :gear: Parcurgere modernă (range-based for)

\`\`\`cpp
for (int x : v) cout << x << " ";
\`\`\`

## :star: Inițializare cu valori

\`\`\`cpp
vector<int> v = {1, 2, 3, 4, 5};      // 5 elemente
vector<int> z(10, 0);                  // 10 zerouri
vector<int> p(5);                      // 5 elemente "default" (0)
\`\`\`

## :wrench: Sortare rapidă

\`\`\`cpp
#include <algorithm>
sort(v.begin(), v.end());              // crescător
sort(v.begin(), v.end(), greater<int>()); // descrescător
\`\`\`

## :warning: Diferența \`vector\` vs tablou clasic

\`\`\`cpp
int t[100];          // FIX 100 elemente, mereu
vector<int> v;       // CRESCE/SCADE după nevoie ✨
\`\`\`

## :memo: Listă 2D (vector de vectori)

\`\`\`cpp
vector<vector<int>> matrice(3, vector<int>(4, 0));
// 3 rânduri, 4 coloane, toate 0
\`\`\`
`,
  problems: [
    mc('Header pentru vector',
      'Ce header trebuie inclus pentru `vector<int>`?',
      ['<list>', '<vector>', '<array>', '<stdio.h>'], '<vector>',
      'Pentru `vector` din STL — `#include <vector>`.',
      { topic: T, tags: ['vector', 'liste'] }),
    mc('Adăugare la final',
      'Care metodă adaugă un element la finalul unui vector?',
      ['add()', 'append()', 'push_back()', 'insert()'], 'push_back()',
      '`push_back(x)` adaugă x la sfârșitul vectorului.',
      { topic: T }),
    mc('Mărimea',
      'Cum afli câte elemente are un vector?',
      ['v.length()', 'v.count()', 'v.size()', 'sizeof(v)'], 'v.size()',
      '`v.size()` returnează numărul de elemente curente.',
      { topic: T }),
    mc('Inițializare cu zerouri',
      'Care declarație creează un vector cu 5 zerouri?',
      [
        'vector<int> v[5];',
        'vector<int> v(5);',
        'vector<int> v(5, 0);',
        'Toate 3 răspunsurile B și C',
      ], 'Toate 3 răspunsurile B și C',
      'Ambele variante (`v(5)` și `v(5,0)`) creează 5 elemente initializate cu 0.',
      { topic: T, difficulty: 'MEDIUM' }),
    mc('Range-based for',
      'Care e sintaxa modernă pentru parcurgerea unui vector?',
      [
        'for(int x in v)',
        'for(int x : v)',
        'foreach(int x; v)',
        'for x in v:',
      ], 'for(int x : v)',
      'Range-based for: `for (tip variabilă : container)`.',
      { topic: T }),
    sa('După push_back-uri',
      'Câte elemente are vectorul după:\n```cpp\nvector<int> v;\nv.push_back(1);\nv.push_back(2);\nv.push_back(3);\nv.pop_back();\n```',
      '2',
      'Trei push, un pop: 3-1 = **2** elemente.',
      { topic: T }),
    sa('Acces ultimul element',
      'Ce metodă returnează ultimul element dintr-un vector v?',
      'back()',
      '`v.back()` returnează ultimul element. Echivalent cu `v[v.size()-1]`.',
      { topic: T }),
    code('Sumă vector',
      'Citește n, apoi n numere întregi într-un vector. Afișează suma lor.',
      'cpp',
      `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v;
    
    // TODO: citește n numere și pune-le în v
    // TODO: calculează și afișează suma
    
    return 0;
}`,
      'Folosește `v.push_back(x)` în loop. Acumulează suma cu `for (int x : v) suma += x;`.',
      { topic: T, difficulty: 'EASY' }),
    code('Sortare descrescătoare',
      'Citește n, apoi n numere. Afișează-le sortate **descrescător**, separate prin spațiu.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    
    // TODO: citește elementele
    // TODO: sortează descrescător și afișează
    
    return 0;
}`,
      'Folosește `sort(v.begin(), v.end(), greater<int>());` apoi parcurge cu range-for.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Filtrare pare',
      'Citește n numere și afișează doar pe cele PARE, pe o linie, separate prin spațiu, în ordinea citirii.',
      'cpp',
      `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    
    // TODO: citește, filtrează și afișează doar numerele pare
    
    return 0;
}`,
      'În for parcurgi v; dacă `v[i] % 2 == 0` afișezi.',
      { topic: T, difficulty: 'EASY', points: 20 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 16: Lucru cu fișiere (fin / fout)
// ────────────────────────────────────────────────────────────────────────────
const fisiere = {
  title: 'Lucru cu Fișiere — fin & fout',
  slug: 'fisiere-fin-fout',
  isFree: false,
  theory: `# :file_folder: Lucru cu Fișiere în C++

În C++ folosești clasele \`ifstream\` (input) și \`ofstream\` (output) din header-ul \`<fstream>\`.

## :rocket: Schemă rapidă

\`\`\`cpp
#include <fstream>
using namespace std;

ifstream fin("date.in");    // citire
ofstream fout("date.out");  // scriere

int n;
fin >> n;                    // citește din fișier (la fel ca cin)
fout << "rezultat: " << n;   // scrie în fișier (la fel ca cout)

fin.close();                 // bună practică — închide!
fout.close();
\`\`\`

> :bulb: **Trick:** \`fin\` și \`fout\` se folosesc EXACT ca \`cin\` și \`cout\`. Doar sursa/destinația se schimbă!

## :memo: Citire până la sfârșitul fișierului

\`\`\`cpp
int x;
while (fin >> x) {
    cout << x << " ";
}
// se oprește singur când nu mai sunt date
\`\`\`

## :star: Tipic la concursuri (input.in / output.out)

\`\`\`cpp
#include <fstream>
using namespace std;

ifstream fin("input.in");
ofstream fout("output.out");

int main() {
    int n;
    fin >> n;
    
    int suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        fin >> x;
        suma += x;
    }
    
    fout << suma;
    return 0;
}
\`\`\`

## :gear: Citire linie cu linie (text)

\`\`\`cpp
string linie;
while (getline(fin, linie)) {
    cout << linie << "\\n";
}
\`\`\`

## :warning: Erori frecvente

| Greșeala | Soluția |
|----------|---------|
| Fișier inexistent | Verifică \`if (!fin) { ... }\` |
| Uiți \`fin.close()\` | Programul rulează, dar e ne-curat |
| Confunzi \`>>\` cu \`<<\` | \`>>\` = citire (din), \`<<\` = scriere (în) |
| Cale greșită | Folosește căi relative ("data.in") |

## :white_check_mark: Verificare deschidere

\`\`\`cpp
ifstream fin("date.in");
if (!fin.is_open()) {
    cout << "Nu s-a putut deschide fișierul!";
    return 1;
}
\`\`\`

## :rainbow: Mod append (adaugă la final, nu suprascrie)

\`\`\`cpp
ofstream fout("log.txt", ios::app);
fout << "linie nouă\\n";
\`\`\`
`,
  problems: [
    mc('Header pentru fișiere',
      'Ce header trebuie inclus pentru `ifstream` și `ofstream`?',
      ['<iostream>', '<fstream>', '<file>', '<stdio.h>'], '<fstream>',
      'Toate operațiile cu fișiere C++ sunt în `<fstream>`.',
      { topic: T, tags: ['fisiere'] }),
    mc('Pentru citire',
      'Care clasă o folosești pentru a CITI dintr-un fișier?',
      ['ofstream', 'ifstream', 'fstream', 'cinstream'], 'ifstream',
      '`i` vine de la **input** = citire.',
      { topic: T }),
    mc('Pentru scriere',
      'Care clasă o folosești pentru a SCRIE într-un fișier?',
      ['ofstream', 'ifstream', 'wstream', 'coutstream'], 'ofstream',
      '`o` vine de la **output** = scriere.',
      { topic: T }),
    mc('Operatorul de scriere',
      'Cu ce operator scrii într-un fișier?',
      ['>>', '<<', '->', '='], '<<',
      'La fel ca la `cout`, folosești `<<` pentru scriere.',
      { topic: T }),
    mc('Operatorul de citire',
      'Cu ce operator citești dintr-un fișier?',
      ['>>', '<<', '..', '->'], '>>',
      'La fel ca la `cin`, folosești `>>` pentru citire.',
      { topic: T }),
    mc('Închidere bună practică',
      'După ce termini cu un fișier, ar trebui să...',
      [
        '... îl ștergi cu delete',
        '... îl închizi cu close()',
        '... îl resetezi cu reset()',
        '... nu trebuie să faci nimic',
      ], '... îl închizi cu close()',
      'Apelul `.close()` eliberează resursele și salvează datele scrise.',
      { topic: T }),
    sa('Cum oprești citirea',
      'Cum scrii o buclă `while` care citește numere până la sfârșitul fișierului în variabila `x` (din `fin`)?',
      'while(fin>>x)',
      'Operatorul `>>` returnează un obiect care evaluează la `false` când fișierul s-a terminat.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Copie fișier',
      'Deschide fișierul "date.in" pentru citire și "date.out" pentru scriere. Citește un întreg n din date.in și scrie 2*n în date.out.',
      'cpp',
      `#include <fstream>
using namespace std;

ifstream fin("date.in");
ofstream fout("date.out");

int main() {
    int n;
    fin >> n;
    
    // TODO: scrie 2*n în fout
    
    return 0;
}`,
      '`fout << 2 * n;` — folosești `<<` exact ca la cout.',
      { topic: T, difficulty: 'EASY' }),
    code('Suma din fișier',
      'În fișierul "input.in" se află pe prima linie un număr n, apoi n întregi separați prin spații. Calculează suma lor și scrie-o în "output.out".',
      'cpp',
      `#include <fstream>
using namespace std;

ifstream fin("input.in");
ofstream fout("output.out");

int main() {
    int n;
    fin >> n;
    long long suma = 0;
    
    // TODO: citește n numere și adună-le; scrie suma în fout
    
    return 0;
}`,
      'Loop `for (i=0; i<n; i++) { int x; fin >> x; suma += x; }` apoi `fout << suma;`.',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
    code('Citire linie cu linie',
      'Citește toate liniile din fișierul "text.in" și scrie-le pe toate în "text.out", numerotate (1: linia, 2: linia, ...).',
      'cpp',
      `#include <fstream>
#include <string>
using namespace std;

ifstream fin("text.in");
ofstream fout("text.out");

int main() {
    string linie;
    int nr = 1;
    
    // TODO: citește cu getline și scrie numerotat
    
    return 0;
}`,
      'Folosește `while (getline(fin, linie)) { fout << nr << ": " << linie << "\\n"; nr++; }`.',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 17: Recursivitate
// ────────────────────────────────────────────────────────────────────────────
const recursivitate = {
  title: 'Recursivitate',
  slug: 'recursivitate',
  isFree: false,
  theory: `# :infinity: Recursivitate în C++

O funcție **recursivă** este o funcție care **se cheamă pe sine însăși**.

## :brain: Idea de bază

> "Pentru a urca scările, urc o treaptă, apoi urc restul scărilor."

Fiecare apel recursiv rezolvă o **versiune mai mică** a problemei, până ajunge la **cazul de bază**.

## :rocket: Exemplu clasic — factorial

\`\`\`cpp
int factorial(int n) {
    if (n <= 1) return 1;          // CAZ DE BAZĂ
    return n * factorial(n - 1);    // CAZ RECURSIV
}

cout << factorial(5); // 120
\`\`\`

**Cum se evaluează \`factorial(4)\`:**

\`\`\`
factorial(4) = 4 * factorial(3)
             = 4 * 3 * factorial(2)
             = 4 * 3 * 2 * factorial(1)
             = 4 * 3 * 2 * 1
             = 24
\`\`\`

## :warning: REGULA DE AUR

Orice funcție recursivă trebuie să aibă:

1. :white_check_mark: **Cazul de bază** — când se oprește (NU se mai cheamă pe sine)
2. :white_check_mark: **Cazul recursiv** — care apropie problema de cazul de bază

> :no_entry: **Fără caz de bază** = **stack overflow** (se blochează programul)!

## :star: Exemple uzuale

**Sumă de la 1 la n:**
\`\`\`cpp
int suma(int n) {
    if (n == 0) return 0;
    return n + suma(n - 1);
}
\`\`\`

**Fibonacci:**
\`\`\`cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
\`\`\`

**Putere a^n:**
\`\`\`cpp
int putere(int a, int n) {
    if (n == 0) return 1;
    return a * putere(a, n - 1);
}
\`\`\`

## :bulb: Recursiv vs Iterativ

| Recursiv | Iterativ |
|----------|----------|
| Cod scurt, elegant | Cod mai lung |
| Folosește stiva (stack) | Folosește variabile |
| Poate fi mai lent | De obicei mai rapid |
| Natural pentru divide & conquer | Natural pentru loop-uri |

## :memo: Trace tip "muncă vs înapoi"

În factorial(3):
- :arrow_down: **Coboară:** apel-uri se acumulează pe stivă
- :arrow_up: **Urcă:** rezultatele se calculează la întoarcere
`,
  problems: [
    mc('Definiția recursivității',
      'O funcție recursivă este o funcție care...',
      [
        'Se execută rapid',
        'Se cheamă pe sine însăși',
        'Returnează mai multe valori',
        'Nu are parametri',
      ], 'Se cheamă pe sine însăși',
      'Recursivitatea = funcția se apelează singură.',
      { topic: T }),
    mc('Caz de bază',
      'De ce e necesar cazul de bază?',
      [
        'Pentru lizibilitate',
        'Pentru a opri recursivitatea',
        'Pentru a returna 0',
        'Nu e necesar',
      ], 'Pentru a opri recursivitatea',
      'Fără caz de bază, funcția se cheamă infinit → stack overflow.',
      { topic: T, difficulty: 'MEDIUM' }),
    mc('factorial(0)',
      'Ce returnează `factorial(0)` din exemplul standard?',
      ['0', '1', '-1', 'eroare'], '1',
      'Convenția matematică: 0! = 1. În cod: `if (n <= 1) return 1;`.',
      { topic: T }),
    mc('factorial(5)',
      'Cât este factorial(5)?',
      ['25', '60', '120', '720'], '120',
      '5! = 5 × 4 × 3 × 2 × 1 = 120.',
      { topic: T }),
    mc('Stack overflow',
      'Ce se întâmplă dacă uiți cazul de bază?',
      [
        'Programul rulează rapid',
        'Stack overflow / crash',
        'Returnează 0',
        'Nimic',
      ], 'Stack overflow / crash',
      'Apel-urile se acumulează infinit pe stivă → memorie depășită.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('fib(6)',
      'Cu definiția fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2), cât este fib(6)?',
      '8',
      'Șirul: 0,1,1,2,3,5,8,13,... → fib(6) = **8**.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Sumă recursivă',
      'Funcția `int s(int n) { if(n==0) return 0; return n + s(n-1); }`. Cât este `s(4)`?',
      '10',
      's(4) = 4+3+2+1+0 = **10**.',
      { topic: T }),
    code('Factorial recursiv',
      'Scrie o funcție recursivă `factorial(n)` care returnează n!. Citește n din stdin și afișează rezultatul.',
      'cpp',
      `#include <iostream>
using namespace std;

long long factorial(int n) {
    // TODO: implementează recursiv
}

int main() {
    int n;
    cin >> n;
    cout << factorial(n);
    return 0;
}`,
      'Cazul de bază: `if (n <= 1) return 1;`. Cazul recursiv: `return n * factorial(n - 1);`.',
      { topic: T, difficulty: 'EASY' }),
    code('Sumă cifre recursiv',
      'Scrie o funcție recursivă `sumaCifre(n)` care returnează suma cifrelor unui număr.',
      'cpp',
      `#include <iostream>
using namespace std;

int sumaCifre(int n) {
    // TODO: cazul de bază: n == 0 → 0
    // TODO: caz recursiv: ultima cifră (n%10) + sumaCifre(n/10)
}

int main() {
    int n;
    cin >> n;
    cout << sumaCifre(n);
    return 0;
}`,
      '`if (n == 0) return 0;` apoi `return n%10 + sumaCifre(n/10);`.',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
    code('Putere recursivă',
      'Scrie funcția recursivă `putere(a, n)` care calculează a^n (a la puterea n). Citește a și n.',
      'cpp',
      `#include <iostream>
using namespace std;

long long putere(int a, int n) {
    // TODO: implementează recursiv
}

int main() {
    int a, n;
    cin >> a >> n;
    cout << putere(a, n);
    return 0;
}`,
      'Cazul de bază: `n == 0` → 1. Caz recursiv: `a * putere(a, n-1)`.',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 18: String class avansat
// ────────────────────────────────────────────────────────────────────────────
const stringAvansat = {
  title: 'Șiruri de Caractere — string avansat',
  slug: 'string-avansat',
  isFree: false,
  theory: `# :abc: Clasa string în C++

\`string\` din \`<string>\` e mult mai prietenoasă decât \`char[]\` din C.

## :rocket: Operații de bază

\`\`\`cpp
string s = "Salut";
string t = " lume";

string r = s + t;          // concatenare → "Salut lume"
cout << r.length();         // 10
cout << r.size();           // 10 (la fel)
cout << r[0];               // 'S'
cout << r.substr(0, 5);     // "Salut" (start, lungime)
\`\`\`

## :memo: Cele mai folosite metode

| Metodă | Descriere |
|--------|-----------|
| \`s.length()\` / \`s.size()\` | Numărul de caractere |
| \`s.empty()\` | true dacă e gol |
| \`s.push_back(c)\` | Adaugă un caracter |
| \`s.pop_back()\` | Șterge ultimul caracter |
| \`s.substr(p, n)\` | Subșir de n chars de la poziția p |
| \`s.find("x")\` | Returnează poziția sau \`string::npos\` |
| \`s.replace(p, n, "y")\` | Înlocuiește |
| \`s.erase(p, n)\` | Șterge |
| \`s.insert(p, "x")\` | Inserează la poziția p |

## :bulb: Citire cu spații (getline)

\`\`\`cpp
string nume;
getline(cin, nume);   // citește toată linia
\`\`\`

> :warning: \`cin >> s\` se oprește la primul spațiu! Pentru fraze folosești \`getline\`.

## :gear: Conversie număr ↔ string

\`\`\`cpp
int n = 42;
string s = to_string(n);     // "42"

string t = "123";
int x = stoi(t);              // 123
double d = stod("3.14");      // 3.14
\`\`\`

## :star: Iterare pe caractere

\`\`\`cpp
string s = "Salut";
for (char c : s) cout << c << "-";
// S-a-l-u-t-
\`\`\`

## :rainbow: Funcții utile pe caractere

\`\`\`cpp
#include <cctype>
isdigit('5')    // true
isalpha('a')    // true
isupper('A')    // true
tolower('A')    // 'a'
toupper('a')    // 'A'
\`\`\`

## :hammer: Exemplu: numără vocalele

\`\`\`cpp
int vocale = 0;
string cuvant = "programare";
for (char c : cuvant) {
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        vocale++;
}
cout << vocale; // 4
\`\`\`
`,
  problems: [
    mc('Concatenare', 'Care operator concatenează două string-uri?',
      ['+', '++', '&', '.'], '+',
      'În C++, `+` între string-uri concatenează: `"a" + "b"` → `"ab"`.', { topic: T }),
    mc('Lungime', 'Cum afli numărul de caractere?',
      ['s.count()', 's.length() sau s.size()', 'sizeof(s)', 'len(s)'],
      's.length() sau s.size()',
      'Ambele metode returnează același lucru.', { topic: T }),
    mc('Subșir',
      'Ce face `s.substr(2, 3)` pentru `s = "programare"`?',
      ['"pro"', '"ogr"', '"gra"', '"ram"'],
      '"ogr"',
      'Începe de la poziția 2 (al treilea caracter) și ia 3 caractere: o, g, r.',
      { topic: T, difficulty: 'MEDIUM' }),
    mc('Citire cu spații',
      'Cum citești o linie întreagă (cu spații) într-un string?',
      ['cin >> s', 'getline(cin, s)', 'gets(s)', 'cin.read(s)'],
      'getline(cin, s)',
      '`getline` citește până la `\\n`, inclusiv spațiile.', { topic: T }),
    mc('to_string',
      'Ce face `to_string(42)`?',
      ['Returnează "42"', 'Returnează 42', 'Eroare', 'Returnează \'4\''],
      'Returnează "42"',
      '`to_string(int)` convertește un număr în string.', { topic: T }),
    sa('Lungime', 'Cât returnează `string("Hello").size()`?', '5',
      'String-ul "Hello" are 5 caractere.', { topic: T }),
    sa('Conversie', 'Ce funcție convertește string-ul "123" în int?', 'stoi',
      '`stoi` = **s**tring **to** **i**nt.', { topic: T }),
    code('Numără vocale',
      'Citește un string și afișează numărul de vocale (a, e, i, o, u — case-insensitive).',
      'cpp',
      `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string s;
    cin >> s;
    int vocale = 0;
    
    // TODO: parcurge s, normalizează cu tolower, verifică vocale
    
    cout << vocale;
    return 0;
}`,
      'Folosește `tolower(c)` apoi compari cu \'a\', \'e\', \'i\', \'o\', \'u\'.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Inversare string',
      'Citește un string și afișează-l inversat.',
      'cpp',
      `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // TODO: inversează și afișează
    // Hint: poți folosi reverse(s.begin(), s.end());
    
    cout << s;
    return 0;
}`,
      'Cea mai simplă cale: `reverse(s.begin(), s.end());` din `<algorithm>`.',
      { topic: T, difficulty: 'EASY' }),
    code('Palindrom',
      'Citește un cuvânt și verifică dacă e palindrom (citit la fel de la stânga la dreapta și invers). Afișează "DA" sau "NU".',
      'cpp',
      `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    
    // TODO: verifică palindrom — compară s[i] cu s[len-1-i]
    
    return 0;
}`,
      'Loop până la `s.length()/2`; dacă găsești o pereche `s[i] != s[len-1-i]` → NU. Altfel DA.',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 19: map & set
// ────────────────────────────────────────────────────────────────────────────
const mapSet = {
  title: 'map și set — Containere Asociative',
  slug: 'map-set',
  isFree: false,
  theory: `# :card_index: map și set în C++

Containerele asociative din STL îți permit să **cauți rapid** elemente fără să parcurgi tot vectorul.

## :books: set — Mulțime de elemente unice

\`\`\`cpp
#include <set>
set<int> s;
s.insert(5);
s.insert(3);
s.insert(5);   // ignorat — deja există
cout << s.size();  // 2
\`\`\`

> :bulb: Elementele se păstrează **automat sortate** și **fără duplicate**.

## :open_book: map — Pereche cheie → valoare (dicționar)

\`\`\`cpp
#include <map>
map<string, int> note;
note["Ana"] = 9;
note["Mihai"] = 7;
note["Ioana"] = 10;

cout << note["Ana"];        // 9
cout << note.size();         // 3
\`\`\`

## :rocket: Operații utile

| Operație | set | map |
|----------|-----|-----|
| Inserare | \`s.insert(x)\` | \`m[k] = v\` |
| Verificare existență | \`s.count(x)\` sau \`s.find(x) != s.end()\` | \`m.count(k)\` |
| Ștergere | \`s.erase(x)\` | \`m.erase(k)\` |
| Mărime | \`s.size()\` | \`m.size()\` |
| Iterare | \`for(auto x : s)\` | \`for(auto& [k,v] : m)\` |

## :star: Aplicații practice

**Numără apariții într-un text:**
\`\`\`cpp
map<string, int> aparitii;
string cuvant;
while (cin >> cuvant) aparitii[cuvant]++;

for (auto& [c, n] : aparitii) {
    cout << c << ": " << n << "\\n";
}
\`\`\`

**Verifică dacă numerele sunt unice:**
\`\`\`cpp
set<int> distincte;
for (int x : v) distincte.insert(x);
bool toateUnice = (distincte.size() == v.size());
\`\`\`

## :gear: Iterare modernă C++17

\`\`\`cpp
for (auto& [cheie, valoare] : harta) {
    cout << cheie << " → " << valoare << "\\n";
}
\`\`\`

## :warning: Diferențe cheie

| | set | vector |
|---|-----|--------|
| Duplicate | NU | DA |
| Sortat | DA (automat) | NU |
| Acces după index | NU | DA |
| Căutare | O(log n) | O(n) |
`,
  problems: [
    mc('Set proprietate', 'Set păstrează elementele:',
      ['Sortate, cu duplicate', 'Sortate, fără duplicate', 'În ordinea inserării', 'În ordine inversă'],
      'Sortate, fără duplicate',
      'Set garantează: 1) ordine sortată, 2) elemente unice.', { topic: T }),
    mc('Map structură',
      'Map e o structură de tip:', ['listă', 'cheie → valoare', 'doar valori', 'matrice'],
      'cheie → valoare',
      'Map = "dicționar": fiecare element are o cheie unică și o valoare asociată.', { topic: T }),
    mc('Adăugare în map', 'Cum atribui valoarea 8 cheii "x" într-un map<string,int> m?',
      ['m.add("x", 8);', 'm["x"] = 8;', 'm.set("x", 8);', 'm("x") = 8;'],
      'm["x"] = 8;',
      'Operatorul `[]` permite atât setare cât și citire.', { topic: T }),
    mc('Insert duplicat în set',
      'Ce se întâmplă dacă faci `s.insert(5)` într-un set care deja conține 5?',
      ['Eroare', 'Adaugă încă un 5', 'E ignorat', 'Înlocuiește vechiul 5'],
      'E ignorat',
      'Set NU permite duplicate — al doilea insert nu schimbă nimic.', { topic: T }),
    mc('Verificare existență',
      'Cum verifici dacă `7` se află într-un `set<int> s`?',
      ['s == 7', 's.contains(7)', 's.count(7) > 0', 's.has(7)'],
      's.count(7) > 0',
      '`count` returnează 0 sau 1 pentru set; `>0` înseamnă că există.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Mărime după inserări',
      'Câte elemente are `set<int> s` după `s.insert(1); s.insert(2); s.insert(1); s.insert(3);`?',
      '3',
      'Cele 3 valori distincte: 1, 2, 3. Al doilea `insert(1)` e ignorat.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Header pentru map', 'Ce header trebuie inclus pentru `map`?',
      '<map>', 'Toate containerele STL au header-ul cu numele lor: `<map>`.', { topic: T }),
    code('Frecvența cuvintelor',
      'Citește cuvinte separate prin spațiu până la EOF și afișează fiecare cuvânt cu numărul de apariții (în ordine alfabetică, un cuvânt per linie: `cuvant: nr`).',
      'cpp',
      `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> freq;
    string c;
    
    while (cin >> c) freq[c]++;
    
    // TODO: afișează în ordinea sortată (map e deja sortat)
    
    return 0;
}`,
      'Map se iterează automat în ordine sortată după cheie. Folosește range-for cu `auto& [k,v]`.',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
    code('Numere distincte',
      'Citește n, apoi n numere. Afișează câte sunt **distincte** (unice).',
      'cpp',
      `#include <iostream>
#include <set>
using namespace std;

int main() {
    int n;
    cin >> n;
    set<int> distincte;
    
    // TODO: inserează cele n numere și afișează size-ul setului
    
    return 0;
}`,
      'Loop de inserare; la final `cout << distincte.size();`.',
      { topic: T, difficulty: 'EASY' }),
    code('Cel mai frecvent caracter',
      'Citește un cuvânt și afișează caracterul care apare cel mai des.',
      'cpp',
      `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    map<char, int> freq;
    
    // TODO: numără frecvența și afișează caracterul cu frecvență maximă
    
    return 0;
}`,
      'După populare, parcurgi map-ul și ții indicele celui cu valoare maximă.',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 20: Algoritmi STL
// ────────────────────────────────────────────────────────────────────────────
const algoritmiSTL = {
  title: 'Algoritmi STL — sort, find, count',
  slug: 'algoritmi-stl',
  isFree: false,
  theory: `# :wrench: Algoritmi STL — \`<algorithm>\`

Header-ul \`<algorithm>\` conține zeci de funcții gata făcute pentru containere STL (vector, set, etc.).

## :rocket: Top algoritmi

| Funcție | Descriere |
|---------|-----------|
| \`sort\` | Sortează |
| \`reverse\` | Inversează |
| \`find\` | Caută un element |
| \`count\` | Numără aparițiile |
| \`min_element\` / \`max_element\` | Iterator către min/max |
| \`accumulate\` (din \`<numeric>\`) | Sumă totală |
| \`binary_search\` | Caută binar (vector sortat) |
| \`unique\` | Elimină duplicate consecutive |
| \`next_permutation\` | Următoarea permutare |

## :star: Sortare

\`\`\`cpp
#include <algorithm>
#include <vector>
using namespace std;

vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};
sort(v.begin(), v.end());
// v este acum: {1, 1, 2, 3, 4, 5, 6, 9}

sort(v.begin(), v.end(), greater<int>()); // descrescător
\`\`\`

## :memo: Maxim & minim

\`\`\`cpp
auto maxIt = max_element(v.begin(), v.end());
cout << *maxIt;          // valoarea maxă
cout << maxIt - v.begin(); // poziția
\`\`\`

## :gear: Sumă totală

\`\`\`cpp
#include <numeric>
int suma = accumulate(v.begin(), v.end(), 0);
\`\`\`

## :bulb: Numărare

\`\`\`cpp
int câte_de_5 = count(v.begin(), v.end(), 5);
\`\`\`

## :white_check_mark: Căutare

\`\`\`cpp
auto it = find(v.begin(), v.end(), 7);
if (it != v.end()) cout << "Găsit la poziția " << it - v.begin();
else cout << "Nu există";
\`\`\`

## :rainbow: Sortare cu funcție custom (lambda)

\`\`\`cpp
vector<int> v = {3, 1, 4, 1, 5};

// Sortare după valoare absolută:
sort(v.begin(), v.end(), [](int a, int b) {
    return abs(a) < abs(b);
});

// Sortare descrescătoare cu lambda:
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;
});
\`\`\`

## :warning: Iteratori — \`begin()\` & \`end()\`

\`\`\`
v.begin() ──> primul element
v.end()   ──> CHIAR DUPĂ ultimul (santinel)
\`\`\`

Algoritmii STL primesc **interval** \`[begin, end)\` — adică includ start, exclud end.
`,
  problems: [
    mc('Header sort', 'Ce header trebuie inclus pentru `sort`?',
      ['<vector>', '<algorithm>', '<sort>', '<numeric>'], '<algorithm>',
      'Toți algoritmii STL sunt în `<algorithm>`.', { topic: T }),
    mc('Interval sort',
      'Care e sintaxa pentru a sorta un vector v?',
      ['sort(v)', 'sort(v.begin(), v.end())', 'v.sort()', 'sortVector(v)'],
      'sort(v.begin(), v.end())',
      'STL folosește perechi de iteratori `[begin, end)`.', { topic: T }),
    mc('Descrescător',
      'Cum sortezi descrescător?',
      ['sort(v.begin(), v.end(), desc)', 'sort(v.begin(), v.end(), greater<int>())', 'sort(v.rbegin(), v.rbegin())', 'reverseSort(v)'],
      'sort(v.begin(), v.end(), greater<int>())',
      '`greater<int>()` e un comparator standard pentru ordine descrescătoare.', { topic: T }),
    mc('Maximul', 'Cum afli iteratorul către elementul maxim?',
      ['max(v)', 'v.max()', 'max_element(v.begin(), v.end())', 'maxim(v)'],
      'max_element(v.begin(), v.end())',
      'Returnează un iterator; dereferențiezi cu `*` pentru a obține valoarea.', { topic: T }),
    mc('find returnează',
      'Ce returnează `find()` dacă elementul nu există?',
      ['nullptr', '-1', 'v.end()', 'NULL'],
      'v.end()',
      'Convenția STL: dacă nu găsește, returnează iteratorul "după ultimul" — `end()`.', { topic: T, difficulty: 'MEDIUM' }),
    sa('count rezultat',
      'Pentru `vector<int> v = {1,2,2,3,2,4};`, ce returnează `count(v.begin(), v.end(), 2)`?',
      '3',
      'Cifra 2 apare de **3** ori.', { topic: T }),
    sa('Sumă cu accumulate',
      'Pentru `vector<int> v = {1,2,3,4};`, ce returnează `accumulate(v.begin(), v.end(), 0)`?',
      '10',
      '0 + 1 + 2 + 3 + 4 = **10**. Al treilea parametru e valoarea inițială.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Sortează & afișează',
      'Citește n numere, sortează-le crescător și afișează-le pe o linie, separate prin spațiu.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    
    // TODO: citește, sortează, afișează
    
    return 0;
}`,
      '`for (int& x : v) cin >> x;` apoi `sort(v.begin(), v.end());` apoi loop de afișare.',
      { topic: T, difficulty: 'EASY' }),
    code('Maxim și poziție',
      'Citește n numere și afișează valoarea maximă și poziția ei (0-indexat), separate prin spațiu.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    
    // TODO: găsește max_element și poziția sa
    
    return 0;
}`,
      '`auto it = max_element(v.begin(), v.end()); cout << *it << " " << (it - v.begin());`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Câte aparții',
      'Citește n numere, apoi un număr `x`. Afișează de câte ori apare x în vector.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int& a : v) cin >> a;
    int x;
    cin >> x;
    
    // TODO: folosește count și afișează rezultatul
    
    return 0;
}`,
      '`cout << count(v.begin(), v.end(), x);`',
      { topic: T, difficulty: 'EASY' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 21: Excepții (try/catch)
// ────────────────────────────────────────────────────────────────────────────
const exceptii = {
  title: 'Excepții — try / catch',
  slug: 'exceptii-cpp',
  isFree: false,
  theory: `# :rotating_light: Excepții în C++

**Excepțiile** sunt o modalitate de a gestiona **erori** care apar în timpul execuției — fără să "spargi" programul.

## :brain: Idea de bază

\`\`\`cpp
try {
    // cod care POATE genera o eroare
} catch (Tip e) {
    // ce facem dacă apare eroarea
}
\`\`\`

## :rocket: Exemplu simplu

\`\`\`cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int impart(int a, int b) {
    if (b == 0) throw runtime_error("Împărțire la zero!");
    return a / b;
}

int main() {
    try {
        cout << impart(10, 0);
    } catch (runtime_error& e) {
        cout << "Eroare: " << e.what();
    }
    return 0;
}
\`\`\`

## :memo: Tipuri standard de excepții

| Excepție | Când apare |
|----------|-----------|
| \`runtime_error\` | Eroare la rulare (din \`<stdexcept>\`) |
| \`logic_error\` | Eroare de logică |
| \`invalid_argument\` | Argument invalid |
| \`out_of_range\` | Index în afara intervalului (ex: \`v.at(100)\`) |
| \`bad_alloc\` | Alocare memorie eșuată |

## :warning: throw vs return

| return | throw |
|--------|-------|
| Returnare normală | Semnalează **EROARE** |
| Continuă execuția | Sare la primul catch |
| Tip de date | Orice obiect |

## :star: catch multiplu

\`\`\`cpp
try {
    risca();
} catch (out_of_range& e) {
    cout << "Index greșit: " << e.what();
} catch (runtime_error& e) {
    cout << "Eroare runtime: " << e.what();
} catch (...) {
    cout << "Orice altă eroare";
}
\`\`\`

## :gear: vector::at vs operator[]

\`\`\`cpp
vector<int> v = {1, 2, 3};
v[10];        // UB (undefined behavior)
v.at(10);     // throw out_of_range — SIGUR ✓
\`\`\`

## :bulb: De ce excepții?

- Coduri de eroare se uită ușor să fie verificate
- Excepțiile **nu pot fi ignorate** — dacă nu le prinzi, programul crash-uiește
- Separă logica normală de gestionarea erorilor
`,
  problems: [
    mc('Aruncare excepție', 'Ce cuvânt cheie aruncă o excepție?',
      ['raise', 'throw', 'except', 'fail'], 'throw', '`throw` aruncă o excepție.', { topic: T }),
    mc('Prindere', 'Ce cuvânt cheie o prinde?',
      ['try', 'catch', 'except', 'handle'], 'catch', '`catch (Tip e)` prinde excepția.', { topic: T }),
    mc('Bloc execuție',
      'Codul care **poate** genera eroare se pune în:',
      ['catch', 'try', 'do', 'when'], 'try',
      'Block `try` conține codul "riscant"; `catch` gestionează erorile.', { topic: T }),
    mc('what()', 'Ce returnează `e.what()`?',
      ['Tipul excepției', 'Mesajul ei', 'Codul de eroare', 'Linia'], 'Mesajul ei',
      'Metoda standard pentru obținerea mesajului unei excepții.', { topic: T }),
    mc('vector siguranță',
      'Care metodă verifică limitele și aruncă excepție pentru index invalid?',
      ['v[i]', 'v.get(i)', 'v.at(i)', 'v.safe(i)'], 'v.at(i)',
      '`at(i)` verifică limitele și aruncă `out_of_range`. Operatorul `[]` NU verifică.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Header excepții', 'Ce header conține `runtime_error`?', '<stdexcept>',
      'Toate clasele standard de excepții sunt în `<stdexcept>`.', { topic: T }),
    sa('Catch all', 'Ce sintaxă prinde **orice** tip de excepție?',
      'catch(...)',
      'Trei puncte între paranteze prind orice excepție (catch-all).', { topic: T, difficulty: 'MEDIUM' }),
    code('Verifică împărțire',
      'Scrie funcția `int impart(int a, int b)` care aruncă `runtime_error` dacă b==0, altfel returnează a/b. În main, citește a și b și folosește try/catch.',
      'cpp',
      `#include <iostream>
#include <stdexcept>
using namespace std;

int impart(int a, int b) {
    // TODO: dacă b == 0 → throw runtime_error("...")
    return a / b;
}

int main() {
    int a, b;
    cin >> a >> b;
    try {
        cout << impart(a, b);
    } catch (runtime_error& e) {
        cout << "Eroare: " << e.what();
    }
    return 0;
}`,
      'În funcție: `if (b == 0) throw runtime_error("impartire la zero");`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Validare vârstă',
      'Scrie funcția care primește o vârstă (int) și aruncă `invalid_argument` dacă e < 0 sau > 150. Altfel afișează "OK". Folosește try/catch în main.',
      'cpp',
      `#include <iostream>
#include <stdexcept>
using namespace std;

void verifica(int v) {
    // TODO: validare
}

int main() {
    int v;
    cin >> v;
    try {
        verifica(v);
    } catch (invalid_argument& e) {
        cout << "Invalid: " << e.what();
    }
    return 0;
}`,
      'Verifică condiția; dacă e îndeplinită → throw, altfel cout << "OK".',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
    code('Acces sigur vector',
      'Citește n și un vector v de n elemente, apoi citește un index i. Folosește `v.at(i)` într-un try/catch — afișează valoarea sau un mesaj de eroare.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int& x : v) cin >> x;
    int i;
    cin >> i;
    
    // TODO: try { cout << v.at(i); } catch (out_of_range& e) { cout << "Index invalid"; }
    
    return 0;
}`,
      '`v.at(i)` aruncă `out_of_range` dacă i nu e valid.',
      { topic: T, difficulty: 'EASY', points: 20 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 22: Operatori supraîncărcați
// ────────────────────────────────────────────────────────────────────────────
const operatoriSupra = {
  title: 'Supraîncărcarea Operatorilor',
  slug: 'operator-overloading',
  isFree: false,
  theory: `# :symbols: Supraîncărcarea operatorilor

În C++ poți **defini comportamentul** operatorilor (\`+\`, \`-\`, \`<\`, etc.) pentru clasele tale.

## :rocket: De ce?

Imaginează-ți o clasă \`Vector2D\`. Vrei să poți face:
\`\`\`cpp
Vector2D a(1, 2), b(3, 4);
Vector2D c = a + b;   // (4, 6) — natural!
\`\`\`

În loc de:
\`\`\`cpp
Vector2D c = a.aduna(b);  // urât
\`\`\`

## :memo: Sintaxa generală

\`\`\`cpp
struct Vector2D {
    double x, y;
    
    Vector2D operator+(const Vector2D& alt) const {
        return {x + alt.x, y + alt.y};
    }
};
\`\`\`

## :gear: Operatori comuni de supraîncărcat

| Operator | Folosire |
|----------|----------|
| \`+ - * /\` | Aritmetică |
| \`== !=\` | Egalitate |
| \`< > <= >=\` | Ordonare (pentru sort) |
| \`<<\` | Output (\`cout << obj\`) |
| \`>>\` | Input (\`cin >> obj\`) |
| \`[]\` | Indexare |
| \`()\` | Apel ca funcție |

## :star: Exemplu complet — Fracție

\`\`\`cpp
struct Fractie {
    int sus, jos;
    
    Fractie operator+(const Fractie& f) const {
        return {sus * f.jos + f.sus * jos, jos * f.jos};
    }
    
    bool operator==(const Fractie& f) const {
        return sus * f.jos == f.sus * jos;
    }
};
\`\`\`

## :bulb: Operator \`<<\` (afișare)

Trebuie definit ca **funcție prietenă** sau **externă**:
\`\`\`cpp
ostream& operator<<(ostream& out, const Fractie& f) {
    out << f.sus << "/" << f.jos;
    return out;
}

// Acum:
Fractie f = {1, 2};
cout << f;  // 1/2
\`\`\`

## :warning: Reguli de aur

1. :white_check_mark: Definește operatori care au **sens** pentru clasa ta
2. :white_check_mark: Comportamentul trebuie să fie **intuitiv** (a+b ≠ a-b)
3. :no_entry: NU supraîncarci operatori doar pentru "smart code"
4. :white_check_mark: Operatorii \`<\` și \`==\` sunt **esențiali** pentru STL (sort, set, map)

## :books: Pentru sort cu obiecte

\`\`\`cpp
struct Punct {
    int x, y;
    bool operator<(const Punct& p) const {
        return x < p.x;  // sortez după x
    }
};

vector<Punct> v = {{3,1}, {1,2}, {2,3}};
sort(v.begin(), v.end());  // funcționează!
\`\`\`
`,
  problems: [
    mc('Cuvânt cheie',
      'Ce cuvânt cheie supraîncarcă un operator?',
      ['overload', 'operator', 'def', 'override'], 'operator',
      'Sintaxa: `tipReturn operator<simbol>(parametri)`.', { topic: T }),
    mc('Pentru sort',
      'Ce operator trebuie supraîncărcat ca un vector de obiecte să fie sortabil cu `sort()`?',
      ['+', '<', '=', '*'], '<',
      '`sort` folosește implicit operatorul `<`.', { topic: T }),
    mc('Pentru cout',
      'Ce operator se supraîncarcă pentru a afișa un obiect cu cout?',
      ['+', '<<', '>>', '<'], '<<',
      'Operatorul `<<` se definește ca funcție externă cu primul parametru `ostream&`.', { topic: T }),
    mc('Pentru cin', 'Iar pentru a citi un obiect cu cin?',
      ['<<', '>>', '+', '<'], '>>',
      '`>>` cu primul parametru `istream&`.', { topic: T }),
    mc('const corectness',
      'Ce înseamnă `const` la finalul `operator+ (const X& x) const`?',
      [
        'Operatorul nu modifică obiectul curent',
        'Returnează const',
        'Argumentul e const',
        'Nu compilează',
      ],
      'Operatorul nu modifică obiectul curent',
      'Marca `const` la finalul metodei garantează că nu se modifică `this`.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Operator []',
      'Ce operator supraîncarci pentru a permite acces stil array `obj[i]`?',
      '[]',
      'Operatorul `[]` permite indexare custom.', { topic: T }),
    sa('Pentru set',
      'Ce operator e necesar minim ca să poți pune un obiect într-un `set<MyType>`?',
      '<', 'Set folosește `<` pentru ordonare. Egalitatea se deduce: `!(a<b) && !(b<a)`.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Operator + pentru Punct',
      'Definește struct `Punct` cu x și y. Supraîncarcă `operator+` ca să returneze suma componentelor. Citește 4 numere (x1 y1 x2 y2) și afișează x și y din p1+p2 separate prin spațiu.',
      'cpp',
      `#include <iostream>
using namespace std;

struct Punct {
    int x, y;
    // TODO: operator+
};

int main() {
    Punct a, b;
    cin >> a.x >> a.y >> b.x >> b.y;
    Punct c = a + b;
    cout << c.x << " " << c.y;
    return 0;
}`,
      '`Punct operator+(const Punct& alt) const { return {x + alt.x, y + alt.y}; }`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Operator < pentru sort',
      'Definește struct `Elev { string nume; double nota; };` cu `operator<` care sortează DESCRESCĂTOR după notă. Citește n elevi, sortează și afișează numele câștigătorului.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Elev {
    string nume;
    double nota;
    bool operator<(const Elev& e) const {
        // TODO: descrescător după notă
    }
};

int main() {
    int n; cin >> n;
    vector<Elev> v(n);
    for (auto& e : v) cin >> e.nume >> e.nota;
    sort(v.begin(), v.end());
    cout << v[0].nume;
    return 0;
}`,
      'Pentru descrescător: `return nota > e.nota;` (NU `<`).',
      { topic: T, difficulty: 'HARD', points: 30 }),
    code('Operator << pentru Fractie',
      'Definește struct `Fractie { int sus, jos; };` și operatorul `<<` care o afișează ca "sus/jos". Citește o fracție și afișează-o.',
      'cpp',
      `#include <iostream>
using namespace std;

struct Fractie {
    int sus, jos;
};

// TODO: operator<< extern

int main() {
    Fractie f;
    cin >> f.sus >> f.jos;
    cout << f;
    return 0;
}`,
      '`ostream& operator<<(ostream& o, const Fractie& f) { o << f.sus << "/" << f.jos; return o; }`',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 23: Enum class
// ────────────────────────────────────────────────────────────────────────────
const enumCpp = {
  title: 'Enumerări — enum class',
  slug: 'enum-class',
  isFree: false,
  theory: `# :traffic_light: Enumerări în C++

Un \`enum\` îți permite să dai **nume citibile** unor valori întregi.

## :rocket: enum clasic (vechi)

\`\`\`cpp
enum Zi { LUNI, MARTI, MIERCURI, JOI, VINERI };

Zi azi = MARTI;
if (azi == VINERI) cout << "Weekend!";
\`\`\`

> :warning: Problemă: \`MARTI\` "scapă" în spațiul global; coliziuni cu alte enum-uri sunt posibile.

## :star: enum class (modern, recomandat)

\`\`\`cpp
enum class Culoare { ROSU, VERDE, ALBASTRU };

Culoare c = Culoare::ROSU;       // explicit, fără coliziuni
\`\`\`

## :memo: Specificare valori

\`\`\`cpp
enum class StatusCod {
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};
\`\`\`

## :bulb: Folosit cu switch

\`\`\`cpp
enum class Sezon { PRIMAVARA, VARA, TOAMNA, IARNA };

void afisare(Sezon s) {
    switch (s) {
        case Sezon::PRIMAVARA: cout << "🌸"; break;
        case Sezon::VARA:      cout << "☀️";  break;
        case Sezon::TOAMNA:    cout << "🍂"; break;
        case Sezon::IARNA:     cout << "❄️";  break;
    }
}
\`\`\`

## :gear: Conversie în int

\`\`\`cpp
Culoare c = Culoare::VERDE;
int x = static_cast<int>(c);  // 1 (al doilea, indexat de la 0)
\`\`\`

## :white_check_mark: Avantaje enum class

| Avantaj | Detaliu |
|---------|---------|
| **Scope** | Numele NU "se scurg" în global |
| **Strong typed** | Nu poți compara cu alt enum sau int direct |
| **Implicit valori** | Pornesc de la 0 |
| **Sigur** | Mai puține bug-uri |

## :star: Pattern tipic — stări

\`\`\`cpp
enum class StareJoc { MENIU, IN_JOC, PAUZA, GAME_OVER };

StareJoc starea = StareJoc::MENIU;

while (starea != StareJoc::GAME_OVER) {
    if (starea == StareJoc::MENIU) deseneazaMeniu();
    else if (starea == StareJoc::IN_JOC) jocLogic();
    // ...
}
\`\`\`
`,
  problems: [
    mc('enum modern',
      'Care formă este recomandată în C++ modern?',
      ['enum X { ... }', 'enum class X { ... }', 'typedef enum X', 'class enum X'],
      'enum class X { ... }',
      '`enum class` evită coliziunile de nume și forțează typing strict.', { topic: T }),
    mc('Acces valoare',
      'Cum accesezi valoarea VERDE dintr-un `enum class Culoare { ROSU, VERDE };`?',
      ['VERDE', 'Culoare.VERDE', 'Culoare::VERDE', 'Culoare->VERDE'],
      'Culoare::VERDE',
      'Cu `enum class` trebuie folosit prefix-ul `NumeEnum::VALOARE`.', { topic: T }),
    mc('Valori implicite',
      'Pentru `enum class E { A, B, C };` ce valoare are B?',
      ['0', '1', '2', 'undefined'], '1',
      'Valorile încep de la 0; A=0, B=1, C=2.', { topic: T }),
    mc('Conversie în int',
      'Cum convertești `Culoare c = Culoare::VERDE` în int?',
      ['int(c)', '(int)c — funcționează implicit', 'static_cast<int>(c)', 'c.toInt()'],
      'static_cast<int>(c)',
      '`enum class` cere conversie explicită cu `static_cast<int>(...)`.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Avantaj principal',
      'Care e cel mai mare avantaj al `enum class` față de `enum`?',
      [
        'E mai rapid',
        'Nu se "scurg" numele în spațiul global',
        'Folosește mai puțină memorie',
        'Permite mai multe valori',
      ],
      'Nu se "scurg" numele în spațiul global',
      'Numele rămân scoped în interiorul enum-ului.', { topic: T }),
    sa('Tip switch',
      'Ce instrucțiune e ideală pentru a verifica multiple valori dintr-un enum?',
      'switch',
      '`switch` e clar, lizibil și eficient pentru valori discrete.', { topic: T }),
    sa('Setare custom',
      'Cum atribui valoarea 200 lui OK într-un enum?',
      'OK = 200',
      'Sintaxa: `enum class X { OK = 200, ... };`.', { topic: T }),
    code('Enum zile',
      'Definește `enum class Zi { LUNI, MARTI, ..., DUMINICA }`. Citește un număr 0-6 și afișează "weekend" dacă e 5 sau 6, altfel "lucru".',
      'cpp',
      `#include <iostream>
using namespace std;

enum class Zi { LUNI, MARTI, MIERCURI, JOI, VINERI, SAMBATA, DUMINICA };

int main() {
    int n;
    cin >> n;
    Zi zi = static_cast<Zi>(n);
    
    // TODO: afișează "weekend" sau "lucru"
    
    return 0;
}`,
      'Compari `if (zi == Zi::SAMBATA || zi == Zi::DUMINICA) cout << "weekend";`.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Stare joc',
      'Definește `enum class Stare { MENIU, JOC, GAME_OVER }`. Citește 3 numere (0, 1, 2) și pentru fiecare afișează numele stării respective.',
      'cpp',
      `#include <iostream>
using namespace std;

enum class Stare { MENIU, JOC, GAME_OVER };

int main() {
    for (int i = 0; i < 3; i++) {
        int x; cin >> x;
        Stare s = static_cast<Stare>(x);
        // TODO: switch case pentru afișare
        cout << "\\n";
    }
    return 0;
}`,
      'Switch cu 3 case-uri: `case Stare::MENIU: cout << "MENIU"; break;` etc.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Cod HTTP',
      'Definește `enum class Status { OK = 200, NOT_FOUND = 404, SERVER_ERROR = 500 }`. Citește un cod (200/404/500) și afișează numele constantei.',
      'cpp',
      `#include <iostream>
using namespace std;

enum class Status { OK = 200, NOT_FOUND = 404, SERVER_ERROR = 500 };

int main() {
    int cod;
    cin >> cod;
    Status s = static_cast<Status>(cod);
    
    // TODO: switch — afișează "OK", "NOT_FOUND", "SERVER_ERROR"
    
    return 0;
}`,
      'Switch case pe `Status::OK`, `Status::NOT_FOUND`, `Status::SERVER_ERROR`.',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 24: namespace
// ────────────────────────────────────────────────────────────────────────────
const namespaces = {
  title: 'Namespaces — Organizarea Codului',
  slug: 'namespaces',
  isFree: false,
  theory: `# :file_folder: Namespaces în C++

Un **namespace** e un "folder logic" care **grupează** funcții, clase și variabile pentru a evita coliziunile de nume.

## :rocket: De ce?

Imaginează: 2 biblioteci au amândouă o funcție \`sort\`. Fără namespace → conflict!

\`\`\`cpp
namespace MathUtils {
    int sort(int a, int b) { ... }
}

namespace SortAlgorithms {
    void sort(vector<int>& v) { ... }
}

MathUtils::sort(1, 2);
SortAlgorithms::sort(v);
\`\`\`

## :star: std — namespace-ul standard

Tot ce e în C++ STL e în \`std::\`:

\`\`\`cpp
std::cout << std::endl;
std::vector<int> v;
std::string s = "Hello";
\`\`\`

Pentru a evita repetarea, folosești:
\`\`\`cpp
using namespace std;
cout << endl;  // mai scurt
\`\`\`

> :warning: \`using namespace std;\` în header-e (.h) e **rău** — strica scope-ul peste tot.
> În \`.cpp\` și școală e **OK**.

## :memo: Definirea propriului namespace

\`\`\`cpp
namespace MyApp {
    int versiune = 1;
    
    void salut() {
        std::cout << "Salut din MyApp v" << versiune;
    }
}

int main() {
    MyApp::salut();
}
\`\`\`

## :gear: using selectiv

\`\`\`cpp
using std::cout;       // doar cout
using std::endl;       // doar endl

cout << "rapid" << endl;
// std::vector<int> v; // restul: tot cu std::
\`\`\`

## :bulb: Namespace nested (în alt namespace)

\`\`\`cpp
namespace Game {
    namespace Audio {
        void play() { ... }
    }
}

Game::Audio::play();   // sau
namespace GA = Game::Audio;
GA::play();            // alias
\`\`\`

## :white_check_mark: Bune practici

| Practică | De ce |
|----------|-------|
| Folosește namespace-uri pentru biblioteci | Evită coliziunile |
| **NU** \`using namespace\` în .h | Poluare globală |
| Folosește alias scurte | Lizibilitate |
| std:: explicit în cod profesional | Claritate |
`,
  problems: [
    mc('Operator scope',
      'Care e operatorul de acces la un nume dintr-un namespace?',
      ['.', '->', '::', '#'], '::',
      'Operatorul `::` (scope resolution) accesează numele dintr-un namespace.', { topic: T }),
    mc('Scopul namespace',
      'La ce folosesc namespace-urile?',
      ['Securitate', 'Performanță', 'Evitare coliziuni de nume', 'Compilare mai rapidă'],
      'Evitare coliziuni de nume',
      'Permit ca două funcții cu același nume să coexiste în namespace-uri diferite.', { topic: T }),
    mc('using',
      'Ce face `using namespace std;`?',
      ['Activează STL', 'Permite folosirea numelor din std fără prefix', 'Reduce dimensiunea executabilului', 'Importă tot codul std'],
      'Permite folosirea numelor din std fără prefix',
      'După `using namespace std;`, scrii `cout` în loc de `std::cout`.', { topic: T }),
    mc('Header și using',
      'De ce e o practică PROASTĂ `using namespace std;` într-un fișier header `.h`?',
      [
        'Crește timpul de compilare',
        'Poluează scope-ul global pentru oricine include header-ul',
        'Nu compilează',
        'E doar stil',
      ],
      'Poluează scope-ul global pentru oricine include header-ul',
      'Toate fișierele care includ acel `.h` vor avea numele std în scope global, ducând la coliziuni neașteptate.',
      { topic: T, difficulty: 'MEDIUM' }),
    mc('Alias namespace',
      'Cum creezi un alias `GA` pentru `Game::Audio`?',
      ['typedef Game::Audio GA', 'namespace GA = Game::Audio;', 'using GA = Game::Audio;', 'alias GA Game::Audio'],
      'namespace GA = Game::Audio;',
      'Sintaxa specială pentru alias de namespace.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Cuvântul cheie', 'Ce cuvânt cheie definește un namespace nou?',
      'namespace', 'Sintaxa: `namespace Nume { ... }`.', { topic: T }),
    sa('Namespace standard',
      'În ce namespace se află `cout`, `cin`, `vector`?', 'std',
      'Toate elementele STL sunt în namespace-ul `std`.', { topic: T }),
    code('Namespace propriu',
      'Definește namespace `MyMath` cu funcția `int patrat(int x)` care returnează x*x. În main citește n și afișează MyMath::patrat(n).',
      'cpp',
      `#include <iostream>
using namespace std;

namespace MyMath {
    // TODO: int patrat(int x)
}

int main() {
    int n;
    cin >> n;
    cout << MyMath::patrat(n);
    return 0;
}`,
      'În namespace: `int patrat(int x) { return x * x; }`.',
      { topic: T, difficulty: 'EASY' }),
    code('Două namespace-uri',
      'Definește `namespace EN { void salut(); }` și `namespace RO { void salut(); }`. EN::salut() afișează "Hello", RO::salut() afișează "Salut". Citește un caracter (E/R) și apelează corespunzător.',
      'cpp',
      `#include <iostream>
using namespace std;

namespace EN { void salut() { cout << "Hello"; } }
namespace RO { void salut() { cout << "Salut"; } }

int main() {
    char c;
    cin >> c;
    
    // TODO: dacă E → EN::salut, dacă R → RO::salut
    
    return 0;
}`,
      'Switch sau if pe c; apelează `EN::salut()` sau `RO::salut()`.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Constants in namespace',
      'Definește `namespace Config { const double PI = 3.14159; const int MAX = 100; }`. Citește o rază r și afișează 2 * PI * r (perimetru cerc) cu 4 zecimale.',
      'cpp',
      `#include <iostream>
#include <iomanip>
using namespace std;

namespace Config {
    // TODO: PI și MAX
}

int main() {
    double r;
    cin >> r;
    cout << fixed << setprecision(4);
    
    // TODO: afișează 2 * Config::PI * r
    
    return 0;
}`,
      '`cout << 2 * Config::PI * r;`',
      { topic: T, difficulty: 'EASY' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 25: Bune practici (recap)
// ────────────────────────────────────────────────────────────────────────────
const bunePractici = {
  title: 'Bune Practici C++ — Recap',
  slug: 'bune-practici-cpp',
  isFree: false,
  theory: `# :star2: Bune practici în C++ modern

După parcurgerea cursului, iată **principiile** pe care un programator C++ profesional le respectă.

## :white_check_mark: 1. Folosește C++ modern (C++11/14/17/20)

\`\`\`cpp
// Vechi
for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) ...

// Modern
for (auto& x : v) ...
\`\`\`

## :rocket: 2. \`auto\` pentru tipuri lungi

\`\`\`cpp
auto it = m.find("ana");           // în loc de map<string,int>::iterator
auto suma = accumulate(...);
\`\`\`

## :memo: 3. const peste tot unde poți

\`\`\`cpp
void afisare(const Vector& v);     // promit că nu modific
const int MAX = 100;
\`\`\`

## :gear: 4. Folosește vector în loc de tablouri C-style

\`\`\`cpp
// Greu
int t[100];
int n;
// trebuie să ții socoteala separat de n

// Ușor
vector<int> v;
v.size();   // știe singur
\`\`\`

## :bulb: 5. Reference în loop-uri pentru obiecte mari

\`\`\`cpp
for (string& s : lista) ...        // FĂRĂ copiere
for (string s : lista) ...          // CU copiere — lent
\`\`\`

## :wrench: 6. Inițializare uniformă (acolade)

\`\`\`cpp
vector<int> v{1, 2, 3, 4};
Punct p{3, 5};
\`\`\`

## :rainbow: 7. Smart pointers în loc de \`new\`/\`delete\`

\`\`\`cpp
// Vechi & periculos
MyClass* p = new MyClass();
// ... uiți delete? memory leak!

// Modern & sigur
auto p = make_unique<MyClass>();
// se șterge automat
\`\`\`

## :star: 8. Folosește STL — nu reinventa roata

| Vrei să... | Folosește |
|-----------|-----------|
| sortezi | \`sort\` |
| cauți | \`find\` / \`binary_search\` |
| numeri | \`count\` |
| listă unică | \`set\` |
| dicționar | \`map\` |

## :white_check_mark: 9. Nume clare

\`\`\`cpp
// Rău
int n, m, x, y;
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        ...

// Bun
int rânduri, coloane;
for (int rând = 0; rând < rânduri; rând++)
    for (int coloană = 0; coloană < coloane; coloană++)
        ...
\`\`\`

## :no_entry: 10. Evită \`using namespace std;\` în header

E OK în \`.cpp\` la școală. **Nu** în \`.h\` în proiecte profesionale.

## :books: Ce să înveți mai departe

- :rocket: **Algoritmi & structuri de date** (graf, hash, arbori)
- :books: **Design patterns** (singleton, factory, observer)
- :wrench: **Build systems** (CMake)
- :star: **Library-uri populare** (Boost, Qt, SFML pentru jocuri)
- :hammer: **Multithreading** (\`<thread>\`, \`<mutex>\`)
- :rainbow: **Concurență modernă** (\`<future>\`, coroutines)

## :tada: Felicitări!

Ai parcurs un curs C++ complet — de la \`hello world\` până la programare modernă cu STL, OOP, fișiere și bune practici. **Continuă să exersezi** — programarea se învață scriind cod, nu doar citind!
`,
  problems: [
    mc('auto', 'La ce folosește `auto`?',
      ['Compilare automată', 'Deduce automat tipul variabilei', 'Run automat', 'Format automat'],
      'Deduce automat tipul variabilei',
      'Compilatorul deduce tipul din valoarea de inițializare.', { topic: T }),
    mc('Range-for cu modificare',
      'Cum scrii corect un range-for care modifică elementele unui vector?',
      ['for(int x : v)', 'for(int& x : v)', 'for(const int& x : v)', 'for(int* x : v)'],
      'for(int& x : v)',
      'Referință (`&`) — fără `&` lucrezi pe o copie.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Smart pointer',
      'Ce înlocuiește perechea `new`/`delete` în C++ modern?',
      ['Garbage collector', 'Smart pointers (unique_ptr, shared_ptr)', 'auto', 'malloc/free'],
      'Smart pointers (unique_ptr, shared_ptr)',
      'Smart pointers eliberează automat memoria când ies din scop.', { topic: T }),
    mc('const',
      'Ce promite `void f(const X& x)`?',
      ['Funcția nu modifică x', 'Funcția va fi rapidă', 'x e statically allocated', 'x nu poate fi nul'],
      'Funcția nu modifică x',
      '`const` e o garanție pentru cititor și compilator.', { topic: T }),
    mc('Vector vs tablou C',
      'De ce `vector` e mai bun decât `int t[100]`?',
      [
        'E mai rapid mereu',
        'Cunoaște singur mărimea + crește/scade dinamic',
        'Folosește mai puțină memorie',
        'Nu permite indexare',
      ],
      'Cunoaște singur mărimea + crește/scade dinamic',
      'vector e self-contained: are size, capacity, push/pop, etc.', { topic: T }),
    sa('Numele standard', 'Ce namespace conține tot STL-ul?', 'std',
      'Toate funcțiile/clasele STL sunt în namespace `std`.', { topic: T }),
    sa('Range-for sintaxa', 'Care e cuvântul cheie după paranteză în range-for? (ex: for(int x __ v))',
      ':',
      'Sintaxa: `for (tip variabilă : container)` — cu două puncte.', { topic: T }),
    code('Vector const',
      'Scrie funcția `int suma(const vector<int>& v)` care returnează suma elementelor. În main citește n, n numere, și afișează suma folosind range-for cu referință.',
      'cpp',
      `#include <iostream>
#include <vector>
using namespace std;

int suma(const vector<int>& v) {
    // TODO: range-for, acumulator
}

int main() {
    int n; cin >> n;
    vector<int> v(n);
    for (int& x : v) cin >> x;
    cout << suma(v);
    return 0;
}`,
      'În funcție: `int s = 0; for (int x : v) s += x; return s;`.',
      { topic: T, difficulty: 'EASY' }),
    code('Auto cu map',
      'Citește n perechi (cuvânt, frecvență) într-un map. Folosește `auto` pentru iterator. Afișează perechile în ordine sortată după cheie, format `cuvant=frecv`, separate prin spațiu.',
      'cpp',
      `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n; cin >> n;
    map<string, int> m;
    
    for (int i = 0; i < n; i++) {
        string c; int f;
        cin >> c >> f;
        m[c] = f;
    }
    
    // TODO: range-for cu auto& [k,v] (sau auto it)
    
    return 0;
}`,
      'Cea mai elegantă: `for (auto& [k, v] : m) cout << k << "=" << v << " ";`.',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
    code('Modern & curat',
      'Scrie un program care: citește n cuvinte, le salvează într-un vector<string>, sortează lexicografic, afișează doar pe cele care încep cu literă mare. Folosește range-for, auto, vector. Câte un cuvânt per linie.',
      'cpp',
      `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cctype>
using namespace std;

int main() {
    int n; cin >> n;
    vector<string> v(n);
    
    // TODO: citește, sortează, filtrează & afișează
    
    return 0;
}`,
      'După sort, `for (const auto& s : v) if (isupper(s[0])) cout << s << "\\n";`.',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// EXPORT — patch pentru index.mjs
// ────────────────────────────────────────────────────────────────────────────
export const cppExtras = {
  newLessons: [
    { afterSlug: 'smart-pointers', ...matrice },
    { afterSlug: 'matrice', ...structCpp },
    { afterSlug: 'struct-cpp', ...listeAvansat },
    { afterSlug: 'liste-avansate', ...fisiere },
    { afterSlug: 'fisiere-fin-fout', ...recursivitate },
    { afterSlug: 'recursivitate', ...stringAvansat },
    { afterSlug: 'string-avansat', ...mapSet },
    { afterSlug: 'map-set', ...algoritmiSTL },
    { afterSlug: 'algoritmi-stl', ...exceptii },
    { afterSlug: 'exceptii-cpp', ...operatoriSupra },
    { afterSlug: 'operator-overloading', ...enumCpp },
    { afterSlug: 'enum-class', ...namespaces },
    { afterSlug: 'namespaces', ...bunePractici },
  ],
}
