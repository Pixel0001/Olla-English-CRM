// C — pachet de lecții suplimentare (metodica-extra)
// Adaugă ~13 lecții noi cu accent pe Matrice, Liste înlănțuite, File I/O (FILE*).

import { mc, sa, io, code } from './helpers.mjs'

const T = 'c'

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 13: Matrice (tablouri 2D în C)
// ────────────────────────────────────────────────────────────────────────────
const matriceC = {
  title: 'Matrice — Tablouri 2D în C',
  slug: 'matrice-c',
  isFree: false,
  theory: `# 🧮 Matrice în C

O **matrice** este un tablou cu **rânduri și coloane**. În C se declară cu două perechi de paranteze drepte:

\`\`\`c
int mat[3][4];   // 3 rânduri × 4 coloane
\`\`\`

## :rocket: Inițializare

\`\`\`c
int m[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
\`\`\`

## :gear: Acces la element

\`\`\`c
m[0][2] = 99;            // setezi (rând 0, col 2)
printf("%d", m[1][0]);   // citești → 4
\`\`\`

> :bulb: \`m[i][j]\` — primul indice = **rând**, al doilea = **coloană**.

## :memo: Citire matrice n×m

\`\`\`c
int n, m;
scanf("%d %d", &n, &m);
int mat[100][100];

for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        scanf("%d", &mat[i][j]);
\`\`\`

## :star: Afișare frumoasă

\`\`\`c
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++)
        printf("%4d ", mat[i][j]);
    printf("\\n");
}
\`\`\`

## :wrench: Pattern-uri uzuale

**Suma totală:**
\`\`\`c
long long suma = 0;
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        suma += mat[i][j];
\`\`\`

**Diagonala principală** (i == j, doar matrice pătratice):
\`\`\`c
for (int i = 0; i < n; i++)
    suma += mat[i][i];
\`\`\`

**Diagonala secundară** (i + j == n-1):
\`\`\`c
for (int i = 0; i < n; i++)
    suma += mat[i][n-1-i];
\`\`\`

**Maxim pe linie i:**
\`\`\`c
int maxLinie = mat[i][0];
for (int j = 1; j < m; j++)
    if (mat[i][j] > maxLinie)
        maxLinie = mat[i][j];
\`\`\`

## :warning: Capcană la dimensiuni mari

În C, matricele locale mari pot **depăși stiva**. Dacă ai nevoie de \`mat[1000][1000]\` declar-o **globală** sau folosește alocare dinamică (vezi lecția memorie dinamică).

## :rainbow: Matrice 2D ca "tablă de joc"

\`\`\`c
char tabla[8][8];  // tablă de șah
int harta[20][30]; // hartă labirint
\`\`\`
`,
  problems: [
    mc('Câte elemente?', 'Câte celule are `int m[4][5]`?',
      ['9', '20', '45', '54'], '20',
      '4 × 5 = 20 elemente.', { topic: T }),
    mc('Acces element',
      'Cum accesezi rândul 1, coloana 2?',
      ['m[1,2]', 'm(1)(2)', 'm[1][2]', 'm.at(1,2)'], 'm[1][2]',
      'În C — două perechi de paranteze drepte.', { topic: T }),
    mc('Scanf matrice',
      'Care e sintaxa corectă pentru a citi mat[i][j]?',
      ['scanf("%d", mat[i][j])', 'scanf("%d", &mat[i][j])', 'scanf(&mat[i][j])', 'cin >> mat[i][j]'],
      'scanf("%d", &mat[i][j])',
      'scanf cere ADRESA (`&`) variabilei.', { topic: T }),
    mc('Diagonală principală',
      'Care indici sunt pe diagonala principală a unei matrice n×n?',
      ['i == j', 'i + j == n', 'i == n', 'j == 0'], 'i == j',
      'Diagonala principală: rândul = coloana.', { topic: T }),
    mc('Diagonală secundară',
      'Pentru o matrice n×n, condiția pentru diagonala secundară:',
      ['i == j', 'i + j == n - 1', 'i - j == n', 'i * j == 0'], 'i + j == n - 1',
      'Pentru n=4: (0,3), (1,2), (2,1), (3,0) — toate au i+j=3=n-1.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Element specific',
      'Pentru `int m[3][3] = {{1,2,3},{4,5,6},{7,8,9}};`, ce afișează `printf("%d", m[2][1]);`?',
      '8',
      'm[2] = al treilea rând = {7,8,9}; [1] = al doilea = **8**.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Suma diagonală',
      'Suma diagonalei principale a matricei {{1,2,3},{4,5,6},{7,8,9}}?',
      '15',
      '1 + 5 + 9 = **15**.', { topic: T }),
    code('Citire & afișare matrice',
      'Citește n și m apoi n*m numere. Afișează matricea, fiecare rând pe linie nouă, elemente separate prin spațiu.',
      'c',
      `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int mat[100][100];
    
    // TODO: citește n*m elemente
    
    // TODO: afișează matricea
    
    return 0;
}`,
      'Două for-uri pentru citire (cu `&mat[i][j]`), apoi două for-uri pentru afișare.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Suma matricei',
      'Citește o matrice n×m și afișează suma totală a elementelor.',
      'c',
      `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int mat[100][100];
    long long suma = 0;
    
    // TODO
    
    printf("%lld", suma);
    return 0;
}`,
      'Citire + acumulator în for-urile imbricate.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Maxim pe fiecare coloană',
      'Citește o matrice n×m și afișează maximul de pe FIECARE coloană (separate prin spațiu pe o singură linie).',
      'c',
      `#include <stdio.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int mat[100][100];
    
    // citește matricea
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &mat[i][j]);
    
    // TODO: pentru fiecare coloană j, găsește max pe coloana j
    
    return 0;
}`,
      'For exterior pe j (coloane), interior pe i (rânduri); reține maximul.',
      { topic: T, difficulty: 'HARD', points: 30 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 14: Șiruri de caractere — operații avansate
// ────────────────────────────────────────────────────────────────────────────
const stringuriAvansat = {
  title: 'Șiruri de Caractere — operații avansate',
  slug: 'stringuri-avansat-c',
  isFree: false,
  theory: `# :abc: Șiruri de caractere — avansat

În C, un string este un \`char[]\` terminat cu \`\\0\` (NUL).

## :books: Funcții importante din \`<string.h>\`

| Funcție | Ce face |
|---------|---------|
| \`strlen(s)\` | Lungimea (fără \\0) |
| \`strcpy(dest, src)\` | Copiază src în dest |
| \`strcat(dest, src)\` | Adaugă src la finalul dest |
| \`strcmp(a, b)\` | Compară (0 = egal, <0 sau >0) |
| \`strchr(s, c)\` | Caută caracter, returnează pointer |
| \`strstr(s, sub)\` | Caută subșir |
| \`strncpy / strncat\` | Variante cu limită de caractere |

## :rocket: Citire string

\`\`\`c
char s[100];
scanf("%s", s);             // OPRESTE la spațiu!
fgets(s, 100, stdin);        // citește toată linia (cu \\n)
\`\`\`

> :warning: \`fgets\` păstrează \`\\n\`. Îl elimini cu:
> \`if (s[strlen(s)-1] == '\\n') s[strlen(s)-1] = '\\0';\`

## :memo: Funcții pe caractere — \`<ctype.h>\`

\`\`\`c
isalpha('a')   // litera?
isdigit('5')   // cifră?
isupper('A')   // majusculă?
islower('a')   // minusculă?
toupper('a')   // → 'A'
tolower('A')   // → 'a'
\`\`\`

## :star: Pattern-uri tipice

**Numără vocale:**
\`\`\`c
int vocale = 0;
char s[100] = "programare";
for (int i = 0; s[i] != '\\0'; i++) {
    char c = tolower(s[i]);
    if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') vocale++;
}
\`\`\`

**Inversare in-place:**
\`\`\`c
int n = strlen(s);
for (int i = 0; i < n / 2; i++) {
    char aux = s[i];
    s[i] = s[n-1-i];
    s[n-1-i] = aux;
}
\`\`\`

**Tot uppercase:**
\`\`\`c
for (int i = 0; s[i]; i++)
    s[i] = toupper(s[i]);
\`\`\`

## :gear: strcmp — interpretare rezultat

| Rezultat | Sensul |
|----------|--------|
| 0 | Stringurile sunt egale |
| < 0 | a < b lexicografic |
| > 0 | a > b lexicografic |

## :warning: NU folosiți \`gets\` !

Funcția \`gets\` e periculoasă (buffer overflow) și **eliminată** din standardul C11. Folosiți \`fgets\`.
`,
  problems: [
    mc('Header pentru strlen', 'În ce header e `strlen`?',
      ['<stdio.h>', '<string.h>', '<ctype.h>', '<stdlib.h>'], '<string.h>',
      'Toate funcțiile str* sunt în `<string.h>`.', { topic: T }),
    mc('Caracter NUL', 'Cu ce caracter se termină un string în C?',
      ['\\n', '\\0', ';', '#'], '\\0',
      'Caracterul NUL `\\0` marchează sfârșitul.', { topic: T }),
    mc('strcmp egal',
      'Ce returnează `strcmp(a, b)` dacă a și b sunt EGALE?',
      ['1', '0', '-1', 'true'], '0',
      'Convenția: 0 = egale; <0 sau >0 = diferite.', { topic: T }),
    mc('Citire cu spații',
      'Care funcție citește o linie cu spații?',
      ['scanf("%s", s)', 'fgets(s, 100, stdin)', 'gets(s)', 'getline(s)'],
      'fgets(s, 100, stdin)',
      'fgets este sigur și citește spații (până la `\\n`).', { topic: T }),
    mc('strlen calcul',
      'Cât returnează `strlen("Hello")`?',
      ['4', '5', '6', 'sizeof(char*)'], '5',
      'Numără caracterele FĂRĂ a include `\\0`.', { topic: T }),
    sa('Conversie majusculă', 'Ce funcție din ctype.h transformă \'a\' în \'A\'?',
      'toupper', '`toupper(c)` — convertește la majuscule.', { topic: T }),
    sa('Concatenare', 'Ce funcție adaugă src la finalul dest?',
      'strcat', '`strcat(dest, src)` — concatenare.', { topic: T }),
    code('Numără vocalele',
      'Citește un cuvânt și afișează numărul de vocale (a,e,i,o,u — case-insensitive).',
      'c',
      `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    int vocale = 0;
    
    // TODO: parcurge cu tolower; numără
    
    printf("%d", vocale);
    return 0;
}`,
      'Loop până la `\\0`; tolower(s[i]); compară cu vocale.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Inversare string',
      'Citește un cuvânt și afișează-l inversat.',
      'c',
      `#include <stdio.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    int n = strlen(s);
    
    // TODO: inversează in-place sau afișează de la coadă
    
    printf("%s", s);
    return 0;
}`,
      'Variantă simplă: `for (int i = n-1; i >= 0; i--) putchar(s[i]);`.',
      { topic: T, difficulty: 'EASY' }),
    code('Palindrom',
      'Citește un cuvânt; afișează "DA" dacă e palindrom, altfel "NU".',
      'c',
      `#include <stdio.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    int n = strlen(s);
    int ok = 1;
    
    // TODO: compară s[i] cu s[n-1-i] pentru i < n/2
    
    printf(ok ? "DA" : "NU");
    return 0;
}`,
      'Loop până la n/2; dacă găsești o pereche diferită → ok = 0.',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 15: Funcții recursive
// ────────────────────────────────────────────────────────────────────────────
const recursivitateC = {
  title: 'Funcții Recursive',
  slug: 'recursivitate-c',
  isFree: false,
  theory: `# :infinity: Recursivitate în C

O funcție **recursivă** se cheamă pe sine însăși, rezolvând o **versiune mai mică** a problemei.

## :brain: Structura

\`\`\`c
int functie(int n) {
    if (CAZ_BAZA) return ...;        // CONDIȚIA DE OPRIRE
    return ... functie(n - 1) ...;   // APEL RECURSIV
}
\`\`\`

## :rocket: Exemplu — Factorial

\`\`\`c
int factorial(int n) {
    if (n <= 1) return 1;            // caz de bază
    return n * factorial(n - 1);     // apel recursiv
}
\`\`\`

**Trace pentru factorial(4):**
\`\`\`
factorial(4) = 4 * factorial(3)
             = 4 * 3 * factorial(2)
             = 4 * 3 * 2 * factorial(1)
             = 4 * 3 * 2 * 1 = 24
\`\`\`

## :memo: Suma 1 + 2 + ... + n

\`\`\`c
int suma(int n) {
    if (n == 0) return 0;
    return n + suma(n - 1);
}
\`\`\`

## :star: Fibonacci

\`\`\`c
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
\`\`\`

> :warning: Atenție: \`fib\` recursiv e **lent** pentru n mare (multe recalculări). Pentru optimizare folosești **memoizare** sau iterație.

## :gear: Putere a^n

\`\`\`c
long long putere(int a, int n) {
    if (n == 0) return 1;
    return a * putere(a, n - 1);
}
\`\`\`

## :bulb: Suma cifrelor

\`\`\`c
int sumaCifre(int n) {
    if (n == 0) return 0;
    return n % 10 + sumaCifre(n / 10);
}
\`\`\`

## :white_check_mark: Reguli de aur

1. **Caz de bază** — fără el → stack overflow
2. **Apropie problema** de cazul de bază la fiecare apel
3. Verifică că **se termină** pentru toate intrările

## :warning: Capcane

| Greșeală | Consecință |
|----------|-----------|
| Fără caz de bază | Crash (stack overflow) |
| Caz de bază nealcătuibil | Crash |
| Recursivitate prea adâncă | Crash (limita stivei) |

## :rainbow: Recursiv vs iterativ

| Recursiv | Iterativ |
|----------|----------|
| Cod scurt, elegant | Cod mai lung |
| Folosește stiva | Folosește variabile |
| Poate fi mai lent | De obicei mai rapid |
`,
  problems: [
    mc('Recursiv?', 'O funcție recursivă...',
      ['Returnează un vector', 'Se cheamă pe sine însăși', 'Are doar un parametru', 'Nu poate avea bucle'],
      'Se cheamă pe sine însăși',
      'Definiția de bază a recursivității.', { topic: T }),
    mc('Caz de bază',
      'De ce e necesar?',
      ['Pentru lizibilitate', 'Pentru a opri recursivitatea', 'Pentru a returna 0', 'Nu e necesar'],
      'Pentru a opri recursivitatea',
      'Fără caz de bază → stack overflow.', { topic: T }),
    mc('factorial(0)', 'Cât e `factorial(0)`?',
      ['0', '1', '-1', 'eroare'], '1',
      'Convenție matematică: 0! = 1.', { topic: T }),
    mc('fib(7)',
      'Cât e fib(7) cu fib(0)=0, fib(1)=1?',
      ['8', '13', '21', '34'], '13',
      '0,1,1,2,3,5,8,13 → fib(7) = **13**.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Stack overflow',
      'Ce se întâmplă fără caz de bază?',
      ['Programul e mai rapid', 'Stack overflow', 'Returnează NULL', 'Compilatorul refuză'],
      'Stack overflow',
      'Apel-urile se acumulează infinit pe stivă → crash.', { topic: T }),
    sa('s(3) sumă',
      'Pentru `int s(int n) { if(n==0) return 0; return n + s(n-1); }`, cât e `s(3)`?',
      '6',
      's(3) = 3 + 2 + 1 + 0 = **6**.', { topic: T }),
    sa('factorial(6)', 'Cât e factorial(6)?', '720',
      '6! = 720.', { topic: T }),
    code('Factorial recursiv',
      'Implementează `long long factorial(int n)` recursiv. Citește n și afișează n!.',
      'c',
      `#include <stdio.h>

long long factorial(int n) {
    // TODO
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%lld", factorial(n));
    return 0;
}`,
      '`if (n <= 1) return 1; return n * factorial(n - 1);`',
      { topic: T, difficulty: 'EASY' }),
    code('Suma cifrelor recursiv',
      'Implementează `int sumaCifre(int n)` recursiv. Citește n și afișează suma cifrelor.',
      'c',
      `#include <stdio.h>

int sumaCifre(int n) {
    // TODO
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", sumaCifre(n));
    return 0;
}`,
      '`if (n == 0) return 0; return n % 10 + sumaCifre(n / 10);`',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
    code('Putere recursivă',
      'Implementează `long long putere(int a, int n)` recursiv. Citește a și n, afișează a^n.',
      'c',
      `#include <stdio.h>

long long putere(int a, int n) {
    // TODO
}

int main() {
    int a, n;
    scanf("%d %d", &a, &n);
    printf("%lld", putere(a, n));
    return 0;
}`,
      '`if (n == 0) return 1; return a * putere(a, n - 1);`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 16: Lucru cu fișiere — fopen, fprintf, fscanf
// ────────────────────────────────────────────────────────────────────────────
const fisiereC = {
  title: 'Lucru cu Fișiere — fopen, fprintf, fscanf',
  slug: 'fisiere-c',
  isFree: false,
  theory: `# :file_folder: Lucru cu Fișiere în C

În C folosești tipul \`FILE*\` și funcțiile \`fopen\`, \`fclose\`, \`fprintf\`, \`fscanf\`, \`fgets\`, etc.

## :rocket: Schemă rapidă

\`\`\`c
#include <stdio.h>

FILE *fin  = fopen("date.in", "r");    // CITIRE
FILE *fout = fopen("date.out", "w");   // SCRIERE

int n;
fscanf(fin, "%d", &n);                 // citește (ca scanf)
fprintf(fout, "Rezultat: %d\\n", n);    // scrie (ca printf)

fclose(fin);
fclose(fout);
\`\`\`

> :bulb: \`fscanf\` și \`fprintf\` sunt **identice** cu \`scanf\` / \`printf\` — doar primesc \`FILE*\` ca prim parametru.

## :memo: Moduri de deschidere

| Mod | Descriere |
|-----|-----------|
| \`"r"\` | Read — citire (fișier trebuie să existe) |
| \`"w"\` | Write — scriere (suprascrie) |
| \`"a"\` | Append — adaugă la final |
| \`"r+"\` | Read + write |
| \`"rb" / "wb"\` | Binar |

## :gear: Verificare deschidere

\`\`\`c
FILE *f = fopen("date.in", "r");
if (f == NULL) {
    printf("Nu s-a putut deschide fișierul!\\n");
    return 1;
}
\`\`\`

## :star: Citire până la sfârșitul fișierului

\`\`\`c
int x;
while (fscanf(fin, "%d", &x) == 1) {
    printf("%d ", x);
}
\`\`\`

> \`fscanf\` returnează numărul de elemente citite. Dacă e diferit de cel cerut → s-a terminat fișierul (sau eroare).

## :books: Citire linie cu linie

\`\`\`c
char linie[256];
while (fgets(linie, 256, fin) != NULL) {
    printf("%s", linie);
}
\`\`\`

## :white_check_mark: Exemplu complet — concurs tipic

\`\`\`c
#include <stdio.h>

int main() {
    FILE *fin  = fopen("input.in", "r");
    FILE *fout = fopen("output.out", "w");
    
    int n;
    fscanf(fin, "%d", &n);
    long long suma = 0;
    
    for (int i = 0; i < n; i++) {
        int x;
        fscanf(fin, "%d", &x);
        suma += x;
    }
    
    fprintf(fout, "%lld", suma);
    
    fclose(fin);
    fclose(fout);
    return 0;
}
\`\`\`

## :warning: Erori frecvente

| Greșeala | Soluția |
|----------|---------|
| Uiți să verifici NULL | Mereu \`if (f == NULL) ...\` |
| Uiți \`fclose\` | Datele scrise se pot pierde |
| Mod greșit | "r" pentru citire, "w" pentru scriere |
| Cale greșită | Verifică unde rulezi programul |

## :rainbow: \`feof\` — sfârșit de fișier

\`\`\`c
while (!feof(fin)) {
    // citește ...
}
\`\`\`
Dar e mai sigur să verifici returnul lui \`fscanf\`.
`,
  problems: [
    mc('Tip pentru fișier', 'Ce tip e folosit pentru a manipula fișiere?',
      ['file_t', 'FILE*', 'fstream', 'int'], 'FILE*',
      '`FILE*` (pointer către structura FILE) — definit în `<stdio.h>`.', { topic: T }),
    mc('Mod citire', 'Ce mod folosești pentru CITIRE?',
      ['"r"', '"w"', '"a"', '"i"'], '"r"',
      '`"r"` = read (citire).', { topic: T }),
    mc('Mod scriere', 'Ce mod folosești pentru SCRIERE (suprascriere)?',
      ['"r"', '"w"', '"a"', '"o"'], '"w"',
      '`"w"` = write. ATENȚIE: dacă fișierul există, e ȘTERS și suprascris!', { topic: T }),
    mc('Funcție citire',
      'Care funcție citește dintr-un fișier exact ca scanf?',
      ['fread', 'fscanf', 'fget', 'sscanf'], 'fscanf',
      'fscanf = file scanf, primește FILE* ca prim argument.', { topic: T }),
    mc('Funcție scriere',
      'Care funcție scrie într-un fișier exact ca printf?',
      ['fwrite', 'fprintf', 'fput', 'sprintf'], 'fprintf',
      'fprintf = file printf.', { topic: T }),
    mc('Verificare deschidere',
      'Cum verifici că `fopen` a reușit?',
      ['if (f != 0)', 'if (f != NULL)', 'if (f.ok())', 'if (open(f))'],
      'if (f != NULL)',
      'fopen returnează NULL în caz de eșec.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Închidere fișier', 'Ce funcție închide un fișier?',
      'fclose', '`fclose(f)` — eliberează resursele și salvează datele scrise.', { topic: T }),
    code('Copie număr',
      'Citește un întreg din "date.in" și scrie dublul lui în "date.out".',
      'c',
      `#include <stdio.h>

int main() {
    FILE *fin  = fopen("date.in", "r");
    FILE *fout = fopen("date.out", "w");
    
    int n;
    fscanf(fin, "%d", &n);
    
    // TODO: scrie 2*n în fout
    
    fclose(fin);
    fclose(fout);
    return 0;
}`,
      '`fprintf(fout, "%d", 2 * n);`',
      { topic: T, difficulty: 'EASY' }),
    code('Suma din fișier',
      'În "input.in": pe prima linie n, apoi n întregi. Scrie suma în "output.out".',
      'c',
      `#include <stdio.h>

int main() {
    FILE *fin  = fopen("input.in", "r");
    FILE *fout = fopen("output.out", "w");
    int n;
    fscanf(fin, "%d", &n);
    long long suma = 0;
    
    // TODO: citește n numere și adună
    
    fprintf(fout, "%lld", suma);
    fclose(fin); fclose(fout);
    return 0;
}`,
      'Loop for cu `fscanf(fin, "%d", &x); suma += x;`.',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
    code('Linii dintr-un fișier',
      'Citește toate liniile din "text.in" și scrie-le numerotate în "text.out" (format `1: linia`).',
      'c',
      `#include <stdio.h>
#include <string.h>

int main() {
    FILE *fin  = fopen("text.in", "r");
    FILE *fout = fopen("text.out", "w");
    char linie[256];
    int nr = 1;
    
    // TODO: while fgets ... fprintf
    
    fclose(fin); fclose(fout);
    return 0;
}`,
      '`while (fgets(linie, 256, fin)) { fprintf(fout, "%d: %s", nr++, linie); }`',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 17: Liste înlănțuite
// ────────────────────────────────────────────────────────────────────────────
const listeInlantuite = {
  title: 'Liste Înlănțuite (Linked Lists)',
  slug: 'liste-inlantuite',
  isFree: false,
  theory: `# :link: Liste Înlănțuite în C

O **listă înlănțuită** este o structură dinamică formată din **noduri**. Fiecare nod conține:
- O **valoare** (date)
- Un **pointer** către următorul nod

## :rocket: Definirea unui nod

\`\`\`c
typedef struct Nod {
    int valoare;
    struct Nod *urmator;
} Nod;
\`\`\`

## :memo: Vizualizare

\`\`\`
[10|→]──>[20|→]──>[30|→]──>NULL
 cap                      sfârșit
\`\`\`

## :gear: Crearea unui nod

\`\`\`c
#include <stdlib.h>

Nod* creeazaNod(int val) {
    Nod *n = (Nod*) malloc(sizeof(Nod));
    n->valoare = val;
    n->urmator = NULL;
    return n;
}
\`\`\`

## :star: Adăugare la început (O(1))

\`\`\`c
void adaugaLaInceput(Nod **cap, int val) {
    Nod *nou = creeazaNod(val);
    nou->urmator = *cap;
    *cap = nou;
}
\`\`\`

## :wrench: Adăugare la sfârșit (O(n))

\`\`\`c
void adaugaLaSfarsit(Nod **cap, int val) {
    Nod *nou = creeazaNod(val);
    if (*cap == NULL) {
        *cap = nou;
        return;
    }
    Nod *curent = *cap;
    while (curent->urmator != NULL)
        curent = curent->urmator;
    curent->urmator = nou;
}
\`\`\`

## :bulb: Parcurgere

\`\`\`c
void afiseaza(Nod *cap) {
    Nod *p = cap;
    while (p != NULL) {
        printf("%d ", p->valoare);
        p = p->urmator;
    }
}
\`\`\`

## :white_check_mark: Eliberare memorie

\`\`\`c
void elibereaza(Nod **cap) {
    Nod *p = *cap;
    while (p != NULL) {
        Nod *aux = p;
        p = p->urmator;
        free(aux);
    }
    *cap = NULL;
}
\`\`\`

## :books: Liste vs Tablouri

| | Tablou | Listă înlănțuită |
|---|--------|------------------|
| Mărime | Fixă (sau realloc) | Dinamică |
| Acces după index | O(1) | O(n) |
| Inserare la început | O(n) | O(1) |
| Memorie | Continuă | Fragmentată |
| Cache-friendly | DA | NU |

## :warning: Capcane

- Mereu inițializează \`urmator\` cu \`NULL\`
- Verifică \`malloc\` returnat NULL
- **NU uita \`free\`** pentru fiecare nod (memory leak!)
- Pentru a modifica capul: pasează \`Nod**\` (pointer la pointer)
`,
  problems: [
    mc('Nod conține', 'Un nod dintr-o listă înlănțuită conține:',
      ['Doar valoarea', 'Doar pointerul', 'Valoare + pointer', 'Index + valoare'],
      'Valoare + pointer',
      'Fiecare nod știe valoarea sa + adresa nodului următor.', { topic: T }),
    mc('Sfârșitul listei',
      'Cum se marchează sfârșitul unei liste înlănțuite?',
      ['Cu valoarea 0', 'Cu pointer NULL', 'Cu un caracter special', 'Nu se marchează'],
      'Cu pointer NULL',
      'Ultimul nod are `urmator = NULL`.', { topic: T }),
    mc('Alocare nod',
      'Cu ce funcție aloci memorie pentru un nod nou?',
      ['new', 'malloc', 'create', 'alloc'], 'malloc',
      'În C, `malloc(sizeof(Nod))`.', { topic: T }),
    mc('Eliberare', 'Ce funcție eliberează memoria unui nod?',
      ['delete', 'remove', 'free', 'destroy'], 'free',
      '`free(nod)` — perechea lui malloc.', { topic: T }),
    mc('Inserare la început complexitate',
      'Care e complexitatea adăugării la ÎNCEPUTUL unei liste?',
      ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 'O(1)',
      'Doar 2 setări de pointeri — operație constantă.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Câmp următor', 'Ce convenție de denumire e des folosită pentru pointer-ul către nodul următor?',
      'urmator', 'Sau `next` în engleză.', { topic: T }),
    sa('Acces câmp prin pointer',
      'Cu ce operator accesezi un câmp dintr-un nod **prin pointer** (ex: `Nod *p`)?',
      '->',
      '`p->valoare` ≡ `(*p).valoare`. Operatorul săgeată e prescurtarea.', { topic: T }),
    code('Construiește listă',
      'Construiește o listă cu valorile 1, 2, 3 (în această ordine), apoi afișează-le separate prin spațiu.',
      'c',
      `#include <stdio.h>
#include <stdlib.h>

typedef struct Nod {
    int valoare;
    struct Nod *urmator;
} Nod;

int main() {
    Nod *cap = NULL;
    
    // TODO: adaugă 3, apoi 2, apoi 1 la început (rezultă 1,2,3)
    // sau adaugă la sfârșit
    
    // TODO: afișează
    
    return 0;
}`,
      'Adaugă la început în ordine 3,2,1 → rezultă 1,2,3. Sau scrie funcție de inserare la sfârșit.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Numără noduri',
      'Construiește o listă din n numere citite din stdin (la sfârșit) și afișează numărul de noduri.',
      'c',
      `#include <stdio.h>
#include <stdlib.h>

typedef struct Nod {
    int valoare;
    struct Nod *urmator;
} Nod;

int main() {
    int n;
    scanf("%d", &n);
    Nod *cap = NULL, *coada = NULL;
    
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        Nod *nou = (Nod*)malloc(sizeof(Nod));
        nou->valoare = x;
        nou->urmator = NULL;
        if (cap == NULL) cap = nou;
        else coada->urmator = nou;
        coada = nou;
    }
    
    // TODO: parcurge și numără
    
    return 0;
}`,
      'Loop while cu p; incrementează un counter la fiecare pas; afișează la final.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Suma listei',
      'Citește n, apoi n numere; pune-le într-o listă înlănțuită; afișează suma valorilor.',
      'c',
      `#include <stdio.h>
#include <stdlib.h>

typedef struct Nod {
    int valoare;
    struct Nod *urmator;
} Nod;

int main() {
    int n;
    scanf("%d", &n);
    Nod *cap = NULL, *coada = NULL;
    
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        Nod *nou = (Nod*)malloc(sizeof(Nod));
        nou->valoare = x;
        nou->urmator = NULL;
        if (!cap) cap = nou;
        else coada->urmator = nou;
        coada = nou;
    }
    
    // TODO: parcurge lista și calculează suma
    
    return 0;
}`,
      'While prin listă, acumulator suma += p->valoare; afișează la final.',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 18: Preprocesor (#define, #include, macro-uri)
// ────────────────────────────────────────────────────────────────────────────
const preprocesor = {
  title: 'Preprocesor — #define, #include, macro-uri',
  slug: 'preprocesor',
  isFree: false,
  theory: `# :gear: Preprocesorul C

Preprocesorul rulează **ÎNAINTE** de compilare și transformă codul sursă conform directivelor (\`#\`).

## :rocket: Directive principale

| Directivă | Descriere |
|-----------|-----------|
| \`#include\` | Include un fișier header |
| \`#define\` | Definește constante / macro-uri |
| \`#undef\` | Șterge o definiție |
| \`#ifdef / #ifndef\` | Compilare condițională |
| \`#if / #else / #endif\` | Logică condițională |
| \`#pragma\` | Directive compilator-specifice |

## :memo: \`#include\`

\`\`\`c
#include <stdio.h>      // header standard (din lib)
#include "fisier.h"      // header local (din directorul curent)
\`\`\`

## :star: \`#define\` — Constante

\`\`\`c
#define PI 3.14159
#define MAX 100

double aria = PI * r * r;
int v[MAX];
\`\`\`

## :bulb: \`#define\` — Macro-uri cu parametri

\`\`\`c
#define PATRAT(x) ((x) * (x))

int n = PATRAT(5);     // 25
int m = PATRAT(3 + 2); // 25 (din cauza parantezelor)
\`\`\`

> :warning: **Folosește mereu paranteze** la macro-uri. Fără ele:
> \`#define PATRAT(x) x*x\` → \`PATRAT(3+2)\` devine \`3+2*3+2 = 11\` (greșit!)

## :white_check_mark: Macro util — MIN / MAX

\`\`\`c
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

int x = MAX(10, 20);  // 20
\`\`\`

## :wrench: Compilare condițională

\`\`\`c
#define DEBUG

#ifdef DEBUG
    printf("Debugging activ\\n");
#endif

#ifndef MAX
    #define MAX 100
#endif
\`\`\`

## :books: Header guards (esențial!)

În fișiere \`.h\`, pentru a evita includere multiplă:

\`\`\`c
// fisier.h
#ifndef FISIER_H
#define FISIER_H

void f();

#endif
\`\`\`

Sau modern:
\`\`\`c
#pragma once
\`\`\`

## :rainbow: De ce e important preprocesorul?

| Avantaj | Exemplu |
|---------|---------|
| Constante numite | \`#define MAX_USERS 100\` |
| Reutilizare cod | \`#include "header.h"\` |
| Configurări multiple | \`#ifdef WINDOWS / #ifdef LINUX\` |
| Macro-uri rapide | \`#define ABS(x) ((x)<0?-(x):(x))\` |

## :no_entry: Capcane

- **Macro-uri fără paranteze** = bug-uri grele
- **NU evaluează tipuri** (sunt înlocuiri text)
- **Greu de debugat** — codul real diferă de ce vezi
- Modern preferi \`const\` și \`inline\` în loc de \`#define\`
`,
  problems: [
    mc('Caracter directivă', 'Cu ce caracter încep directivele de preprocesor?',
      ['$', '#', '@', '%'], '#',
      'Toate: `#include`, `#define`, `#if`, etc.', { topic: T }),
    mc('Constantă', 'Care e sintaxa pentru o constantă PI = 3.14?',
      ['const PI = 3.14', '#define PI 3.14', '#const PI 3.14', 'pi := 3.14'],
      '#define PI 3.14',
      'Sintaxa preprocesor — fără `=`, fără `;`.', { topic: T }),
    mc('Header standard',
      'Ce sintaxă includ un header standard?',
      ['#include "stdio.h"', '#include <stdio.h>', '#import stdio', 'use stdio.h'],
      '#include <stdio.h>',
      'Paranteze unghiulare pentru header-uri standard, ghilimele pentru local.', { topic: T }),
    mc('Macro paranteze',
      'De ce e bine să pui paranteze în jur la macro-uri?',
      ['Pentru viteză', 'Pentru a evita evaluări greșite', 'E doar stil', 'Pentru a compila'],
      'Pentru a evita evaluări greșite',
      'Fără paranteze, prioritatea operatorilor poate da rezultate greșite.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Header guard',
      'Ce face un "header guard" cu `#ifndef` / `#define` / `#endif`?',
      ['Securizează header-ul', 'Previne includere multiplă', 'Optimizează compilarea', 'Verifică sintaxa'],
      'Previne includere multiplă',
      'Asigură că header-ul e procesat doar o singură dată per unitate de compilare.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Punct și virgulă', 'La sfârșitul unui `#define` se pune `;`?',
      'nu',
      'Nu! `#define MAX 100` — fără `;`. Punctul ar fi inclus în înlocuire.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Modern alternativă', 'Care directivă modernă înlocuiește header guard-ul tradițional?',
      '#pragma once',
      'Compilatoarele moderne suportă `#pragma once`.', { topic: T }),
    code('Macro PATRAT',
      'Definește macro-ul `PATRAT(x)` corect (cu paranteze). Citește n și afișează PATRAT(n+1).',
      'c',
      `#include <stdio.h>

// TODO: #define PATRAT(x) ...

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", PATRAT(n + 1));
    return 0;
}`,
      '`#define PATRAT(x) ((x) * (x))` — paranteze peste tot.',
      { topic: T, difficulty: 'EASY' }),
    code('Constante și calcul',
      'Definește PI ca 3.14159 și G ca 9.81 cu #define. Citește o masă m și o rază r. Afișează: greutatea (m*G) pe prima linie și aria cercului (PI*r*r) pe a doua linie, ambele cu 2 zecimale.',
      'c',
      `#include <stdio.h>

// TODO: #define PI și G

int main() {
    double m, r;
    scanf("%lf %lf", &m, &r);
    
    // TODO: afișează cu %.2f
    
    return 0;
}`,
      '`#define PI 3.14159` și `#define G 9.81`. `printf("%.2f\\n%.2f", m*G, PI*r*r);`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('MAX macro',
      'Definește macro-ul `MAX(a,b)`. Citește 3 numere și afișează maximul folosind macro-ul de două ori (MAX(MAX(a,b),c)).',
      'c',
      `#include <stdio.h>

// TODO: #define MAX(a,b) ...

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    printf("%d", MAX(MAX(a, b), c));
    return 0;
}`,
      '`#define MAX(a,b) ((a) > (b) ? (a) : (b))`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 19: enum și typedef
// ────────────────────────────────────────────────────────────────────────────
const enumTypedef = {
  title: 'enum și typedef — Tipuri Personalizate',
  slug: 'enum-typedef',
  isFree: false,
  theory: `# :label: enum și typedef în C

## :rocket: enum — Constante simbolice

Un \`enum\` îți permite să dai **nume** unor valori întregi.

\`\`\`c
enum Zi { LUNI, MARTI, MIERCURI, JOI, VINERI, SAMBATA, DUMINICA };

enum Zi azi = MARTI;
if (azi == VINERI) printf("Aproape weekend!");
\`\`\`

**Implicit:** LUNI=0, MARTI=1, MIERCURI=2, ... DUMINICA=6.

## :memo: enum cu valori specificate

\`\`\`c
enum Status {
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};
\`\`\`

\`\`\`c
enum Cod { A, B = 10, C, D };  // A=0, B=10, C=11, D=12
\`\`\`

## :star: enum cu switch

\`\`\`c
enum Sezon { PRIMAVARA, VARA, TOAMNA, IARNA };

void afisare(enum Sezon s) {
    switch (s) {
        case PRIMAVARA: printf("flori"); break;
        case VARA:      printf("soare"); break;
        case TOAMNA:    printf("ploaie"); break;
        case IARNA:     printf("zapada"); break;
    }
}
\`\`\`

## :wrench: typedef — Aliasuri pentru tipuri

\`typedef\` îți permite să dai un **nume nou** unui tip existent.

\`\`\`c
typedef unsigned long ulong;
typedef int Varsta;

ulong x = 1000000;
Varsta v = 25;
\`\`\`

## :bulb: typedef + struct (foarte util!)

Fără typedef:
\`\`\`c
struct Punct {
    int x, y;
};
struct Punct p;     // trebuie tot timpul "struct Punct"
\`\`\`

Cu typedef:
\`\`\`c
typedef struct {
    int x, y;
} Punct;

Punct p;             // mult mai curat!
\`\`\`

## :books: typedef + enum

\`\`\`c
typedef enum {
    ROSU, VERDE, ALBASTRU
} Culoare;

Culoare c = VERDE;
\`\`\`

## :white_check_mark: typedef pentru tipuri complexe

\`\`\`c
typedef int (*Operatie)(int, int);  // pointer la funcție

int aduna(int a, int b) { return a + b; }
Operatie op = aduna;
int r = op(3, 4);   // 7
\`\`\`

## :rainbow: Avantaje

| typedef | Beneficiu |
|---------|-----------|
| Cod mai lizibil | \`Distanta d = 100;\` vs \`int d = 100;\` |
| Schimbare ușoară | Modifici typedef, nu tot codul |
| Tipuri portabile | \`size_t\`, \`int32_t\` etc. |

## :warning: Convenții

- Nume **PascalCase** pentru tipuri create de tine: \`Elev\`, \`Punct\`, \`Culoare\`
- Sau \`_t\` la sfârșit pentru "type" (stil POSIX): \`time_t\`, \`size_t\`
`,
  problems: [
    mc('Valoare implicită', 'Pentru `enum E { A, B, C };`, ce valoare are C?',
      ['0', '1', '2', '3'], '2',
      'Numerotare implicită începe de la 0: A=0, B=1, C=2.', { topic: T }),
    mc('typedef face',
      'Ce face `typedef`?',
      ['Definește o constantă', 'Creează un alias pentru un tip', 'Importă un fișier', 'Definește o funcție'],
      'Creează un alias pentru un tip',
      'Permite să dai un nume nou (mai scurt sau mai descriptiv) unui tip existent.', { topic: T }),
    mc('typedef + struct',
      'Care e avantajul `typedef struct {...} Nume;`?',
      [
        'E mai rapid',
        'Permite folosirea ca `Nume p;` în loc de `struct Nume p;`',
        'Folosește mai puțină memorie',
        'Permite mai multe câmpuri',
      ],
      'Permite folosirea ca `Nume p;` în loc de `struct Nume p;`',
      'Elimină necesitatea de a scrie `struct` la fiecare folosire.', { topic: T }),
    mc('Valoare după 10',
      'Pentru `enum X { A, B = 10, C, D };`, ce valoare are C?',
      ['2', '11', '20', '0'], '11',
      'După B=10, valorile cresc cu 1: C=11, D=12.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Nume convenție',
      'Care e o convenție comună pentru tipuri create cu typedef?',
      ['ALL_CAPS', 'camelCase', 'PascalCase', 'snake_case'], 'PascalCase',
      'Sau `_t` la final (stil POSIX). PascalCase e cel mai comun pentru struct-uri.', { topic: T }),
    sa('Header pentru enum',
      'Ce header ai nevoie să incluzi pentru a folosi `enum`?',
      'niciunul',
      '`enum` e construit în limbajul C, nu necesită header.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Sintaxa enum',
      'Care e cuvântul cheie pentru a defini o enumerare?',
      'enum', '`enum NumeEnum { ... };`', { topic: T }),
    code('typedef Punct',
      'Folosind `typedef struct { int x, y; } Punct;`, citește 2 puncte și afișează suma componentelor (x1+x2 spațiu y1+y2).',
      'c',
      `#include <stdio.h>

typedef struct {
    int x, y;
} Punct;

int main() {
    Punct a, b;
    scanf("%d %d %d %d", &a.x, &a.y, &b.x, &b.y);
    
    // TODO: afișează a.x+b.x și a.y+b.y
    
    return 0;
}`,
      '`printf("%d %d", a.x + b.x, a.y + b.y);`',
      { topic: T, difficulty: 'EASY' }),
    code('Enum zile',
      'Definește `enum Zi { LUNI, ..., DUMINICA };`. Citește un număr 0-6 și afișează "weekend" dacă e SAMBATA(5) sau DUMINICA(6), altfel "lucratoare".',
      'c',
      `#include <stdio.h>

enum Zi { LUNI, MARTI, MIERCURI, JOI, VINERI, SAMBATA, DUMINICA };

int main() {
    int n;
    scanf("%d", &n);
    enum Zi z = n;
    
    // TODO: dacă z == SAMBATA sau z == DUMINICA → "weekend", altfel "lucratoare"
    
    return 0;
}`,
      '`if (z == SAMBATA || z == DUMINICA) printf("weekend"); else printf("lucratoare");`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Cod HTTP',
      'Definește `enum Status { OK = 200, NOT_FOUND = 404, SERVER_ERROR = 500 };`. Citește un cod (200/404/500) și afișează numele.',
      'c',
      `#include <stdio.h>

enum Status { OK = 200, NOT_FOUND = 404, SERVER_ERROR = 500 };

int main() {
    int cod;
    scanf("%d", &cod);
    
    // TODO: switch (cod) { case OK: ... }
    
    return 0;
}`,
      'Switch case pe constantele enum-ului — afișează "OK", "NOT_FOUND", "SERVER_ERROR".',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 20: Sortare și căutare
// ────────────────────────────────────────────────────────────────────────────
const sortareCautare = {
  title: 'Sortare și Căutare',
  slug: 'sortare-cautare',
  isFree: false,
  theory: `# :wrench: Sortare și căutare

Algoritmi fundamentali pentru organizarea datelor.

## :rocket: Sortare prin selecție (Selection Sort)

Idee: găsești minimul, îl pui pe prima poziție; repeți pentru restul.

\`\`\`c
void selectionSort(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int idxMin = i;
        for (int j = i + 1; j < n; j++)
            if (v[j] < v[idxMin]) idxMin = j;
        // schimb
        int aux = v[i];
        v[i] = v[idxMin];
        v[idxMin] = aux;
    }
}
\`\`\`

**Complexitate:** O(n²)

## :memo: Bubble Sort

\`\`\`c
void bubbleSort(int v[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (v[j] > v[j+1]) {
                int aux = v[j];
                v[j] = v[j+1];
                v[j+1] = aux;
            }
}
\`\`\`

**Complexitate:** O(n²)

## :star: qsort — sortare standard (rapidă!)

\`\`\`c
#include <stdlib.h>

int comparator(const void *a, const void *b) {
    return (*(int*)a) - (*(int*)b);
}

int v[] = {3, 1, 4, 1, 5, 9, 2, 6};
qsort(v, 8, sizeof(int), comparator);
\`\`\`

**Complexitate:** O(n log n) — mult mai rapid!

## :bulb: Căutare liniară

\`\`\`c
int liniara(int v[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (v[i] == x) return i;
    return -1;
}
\`\`\`

**Complexitate:** O(n)

## :wrench: Căutare binară (vector SORTAT!)

\`\`\`c
int binara(int v[], int n, int x) {
    int st = 0, dr = n - 1;
    while (st <= dr) {
        int m = (st + dr) / 2;
        if (v[m] == x) return m;
        else if (v[m] < x) st = m + 1;
        else dr = m - 1;
    }
    return -1;
}
\`\`\`

**Complexitate:** O(log n) — extrem de rapid!

> :warning: Căutare binară funcționează **DOAR** pe vectori sortați!

## :books: Comparare complexități

| Mărime n | O(n) | O(n log n) | O(n²) |
|----------|------|-----------|-------|
| 100 | 100 | ~700 | 10.000 |
| 1.000 | 1.000 | ~10.000 | 1.000.000 |
| 10.000 | 10.000 | ~130.000 | 100.000.000 :rotating_light: |

## :white_check_mark: Când folosești ce?

| Situație | Algoritm |
|----------|----------|
| Vectori mici (< 50) | bubble / selection (cod simplu) |
| Vectori normali | **qsort** mereu |
| Căutare în date sortate | binară |
| Căutare în date nesortate | liniară (sau sortează apoi binar) |
`,
  problems: [
    mc('Selection sort idea',
      'Care e ideea sortării prin selecție?',
      [
        'Compari adiacente și schimbi',
        'Găsești minimul și îl pui în față',
        'Împarți în jumătăți',
        'Inserezi în poziția corectă',
      ],
      'Găsești minimul și îl pui în față',
      'Selection: la pasul i, găsești min din [i..n-1] și îl pui pe poziția i.', { topic: T }),
    mc('Complexitate selection',
      'Care e complexitatea selection sort?',
      ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'], 'O(n²)',
      'Două for-uri imbricate → O(n²).', { topic: T }),
    mc('qsort viteză',
      'Care e complexitatea lui `qsort`?',
      ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], 'O(n log n)',
      'qsort folosește algoritmul quicksort — O(n log n) în medie.', { topic: T }),
    mc('Căutare binară premisa',
      'Pentru căutare binară, vectorul trebuie să fie:',
      ['Mic', 'Sortat', 'De numere întregi', 'Cu duplicate'],
      'Sortat',
      'Algoritmul împarte intervalul presupunând ordinea.', { topic: T }),
    mc('Complexitate căutare binară',
      'Care e complexitatea căutării binare?',
      ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 'O(log n)',
      'La fiecare pas elimină jumătate din candidate.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Căutare liniară complexitate',
      'Complexitatea căutării liniare?',
      'O(n)', 'În cel mai rău caz parcurgi tot vectorul.', { topic: T }),
    sa('Header qsort', 'În ce header e `qsort`?',
      '<stdlib.h>', '`qsort` este în `<stdlib.h>` standard.', { topic: T }),
    code('Bubble sort',
      'Citește n și n numere. Sortează crescător cu bubble sort și afișează.',
      'c',
      `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int v[1000];
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    
    // TODO: bubble sort
    
    for (int i = 0; i < n; i++) printf("%d ", v[i]);
    return 0;
}`,
      'Două for-uri: exterior `i 0..n-2`, interior `j 0..n-2-i`; dacă `v[j] > v[j+1]` schimbă-le.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('qsort cu comparator',
      'Folosește qsort pentru a sorta n numere DESCRESCĂTOR. Afișează rezultatul separat prin spațiu.',
      'c',
      `#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b) {
    // TODO: descrescător
}

int main() {
    int n;
    scanf("%d", &n);
    int v[1000];
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    
    qsort(v, n, sizeof(int), cmp);
    for (int i = 0; i < n; i++) printf("%d ", v[i]);
    return 0;
}`,
      'Pentru descrescător: `return *(int*)b - *(int*)a;`.',
      { topic: T, difficulty: 'HARD', points: 30 }),
    code('Căutare binară',
      'Citește n și n numere SORTATE crescător, apoi un x. Afișează poziția (0-indexat) a lui x în vector sau -1 dacă nu există.',
      'c',
      `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int v[1000];
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    int x;
    scanf("%d", &x);
    
    // TODO: căutare binară
    
    return 0;
}`,
      'st=0, dr=n-1; loop while st<=dr; m=(st+dr)/2; compari și ajustezi.',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 21: Multi-fișier (program organizat)
// ────────────────────────────────────────────────────────────────────────────
const multiFisier = {
  title: 'Programe pe Mai Multe Fișiere',
  slug: 'multi-fisier',
  isFree: false,
  theory: `# :file_folder: Programe organizate pe mai multe fișiere

Programele mari **NU** se țin într-un singur \`main.c\`. Se împart logic în mai multe fișiere.

## :rocket: Structură tipică

\`\`\`
proiect/
├── main.c           ← funcția main
├── matematica.c     ← implementări
├── matematica.h     ← declarații
├── stringuri.c
└── stringuri.h
\`\`\`

## :memo: Header (.h) — declarații

\`\`\`c
// matematica.h
#ifndef MATEMATICA_H
#define MATEMATICA_H

int aduna(int a, int b);
int inmulteste(int a, int b);

#endif
\`\`\`

## :wrench: Sursă (.c) — implementări

\`\`\`c
// matematica.c
#include "matematica.h"

int aduna(int a, int b) {
    return a + b;
}

int inmulteste(int a, int b) {
    return a * b;
}
\`\`\`

## :star: main.c

\`\`\`c
#include <stdio.h>
#include "matematica.h"

int main() {
    printf("%d\\n", aduna(3, 4));         // 7
    printf("%d\\n", inmulteste(3, 4));    // 12
    return 0;
}
\`\`\`

## :gear: Compilare

\`\`\`bash
gcc main.c matematica.c -o program
./program
\`\`\`

## :books: De ce header guards?

Dacă două fișiere includ același header, fără guard ai **redefiniri** → eroare de compilare.

\`\`\`c
#ifndef NUMENUME_H        // dacă NU e definit
#define NUMENUME_H        // definește-l
// ... conținut
#endif
\`\`\`

## :bulb: extern — variabile globale partajate

\`\`\`c
// global.h
extern int contor;        // DECLARAȚIE

// global.c
int contor = 0;           // DEFINIȚIE (o singură dată!)

// main.c
#include "global.h"
contor = 100;
\`\`\`

## :white_check_mark: static — funcții/variabile private fișierului

\`\`\`c
// utils.c
static int helper(int x) {  // doar în acest fișier
    return x * 2;
}
\`\`\`

## :rainbow: Avantaje organizare

| Avantaj | Detaliu |
|---------|---------|
| Lizibilitate | Fiecare fișier are un scop |
| Compilare incrementală | Recompilezi doar ce ai schimbat |
| Reutilizare | Header-urile pot fi folosite în alte proiecte |
| Lucru în echipă | Fiecare lucrează în fișierul lui |

## :warning: Reguli de aur

1. **DECLARAȚIE** în .h, **DEFINIȚIE** în .c
2. **Header guards** mereu (sau \`#pragma once\`)
3. NU \`#include\` un \`.c\` (greșeală frecventă!)
4. \`static\` pentru funcții helper interne
5. Compilați cu **toate** fișierele .c împreună
`,
  problems: [
    mc('Header conține', 'Ce conține tipic un fișier .h?',
      ['Implementări de funcții', 'Declarații (semnături) de funcții', 'Variabile inițializate', 'main()'],
      'Declarații (semnături) de funcții',
      '.h = interfață (declarații); .c = implementare.', { topic: T }),
    mc('Implementare în', 'În ce fișier scrii corpul funcțiilor?',
      ['.h', '.c', '.txt', '.exe'], '.c',
      'Implementarea (corpul) merge în .c; doar declarațiile în .h.', { topic: T }),
    mc('Sintaxă include local',
      'Cum incluzi un header local "util.h"?',
      ['#include <util.h>', '#include "util.h"', '#include util.h', '#import "util.h"'],
      '#include "util.h"',
      'Ghilimele pentru header-uri locale, paranteze unghiulare pentru standard.', { topic: T }),
    mc('Header guard scop',
      'Ce previne `#ifndef ... #define ... #endif`?',
      ['Erori de compilare', 'Redefinirea simbolurilor (la includere multiplă)', 'Incluziunea greșită', 'Compilare lentă'],
      'Redefinirea simbolurilor (la includere multiplă)',
      'Asigură că header-ul e procesat o singură dată per unitate de compilare.', { topic: T }),
    mc('static funcție',
      'Ce înseamnă `static` la o funcție?',
      ['Mai rapidă', 'Vizibilă doar în fișierul respectiv', 'Globală peste tot', 'Inline'],
      'Vizibilă doar în fișierul respectiv',
      '`static` la nivel de fișier = "private" — invizibil pentru alte fișiere.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Compilare GCC',
      'Cum compilezi `main.c` și `util.c` împreună într-un program numit `app`?',
      'gcc main.c util.c -o app',
      'Listezi toate fișierele .c, urmate de `-o nume`.', { topic: T, difficulty: 'MEDIUM' }),
    sa('extern',
      'Ce cuvânt cheie folosești pentru a DECLARA (nu defini) o variabilă globală în .h?',
      'extern',
      '`extern int contor;` în .h, `int contor = 0;` în .c.', { topic: T }),
    code('Funcție în alt fișier (simulare)',
      'Conceptual, ai header `mat.h` cu `int aduna(int a, int b);` și `mat.c` cu implementarea. Aici, în main.c, scrie programul care citește 2 numere și afișează suma. Inclusiv comentariul `// #include "mat.h"`.',
      'c',
      `#include <stdio.h>
// #include "mat.h"

int aduna(int a, int b);  // declarație externă (ca în header)

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    
    // TODO: apelează aduna(a, b) și afișează
    
    return 0;
}

int aduna(int a, int b) {
    return a + b;
}`,
      '`printf("%d", aduna(a, b));`',
      { topic: T, difficulty: 'EASY' }),
    code('Header guards corect',
      'Scrie conținutul EXACT al unui fișier `util.h` cu header guard care declară doar `void salut(void);`. Apoi în main.c apelează `salut()` (definește-o local pentru execuție).',
      'c',
      `// În util.h ai avea:
// #ifndef UTIL_H
// #define UTIL_H
// void salut(void);
// #endif

#include <stdio.h>

void salut(void);

int main() {
    salut();
    return 0;
}

void salut(void) {
    // TODO: printează "Salut!"
}`,
      '`printf("Salut!");`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Modulare cu static',
      'Scrie o funcție `static int dublu(int x)` (helper privat) și o funcție publică `int proceseaza(int x)` care folosește `dublu` și returnează `dublu(x) + 1`. În main, citește n și afișează `proceseaza(n)`.',
      'c',
      `#include <stdio.h>

static int dublu(int x) {
    return x * 2;
}

int proceseaza(int x) {
    // TODO
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", proceseaza(n));
    return 0;
}`,
      '`return dublu(x) + 1;`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 22: Bune practici și debugging C
// ────────────────────────────────────────────────────────────────────────────
const bunePracticiC = {
  title: 'Bune Practici și Debugging C',
  slug: 'bune-practici-c',
  isFree: false,
  theory: `# :star2: Bune practici în C

C este un limbaj puternic dar **nepăsător** — nu te avertizează la multe greșeli. Aceste practici te ajută să eviți bug-urile.

## :white_check_mark: 1. Inițializează **mereu** variabilele

\`\`\`c
// RĂU
int suma;        // valoare aleatorie!
for (...) suma += v[i];

// BUN
int suma = 0;
\`\`\`

## :rocket: 2. Verifică valorile returnate

\`\`\`c
FILE *f = fopen("date.in", "r");
if (f == NULL) {
    perror("fopen");
    return 1;
}

int *p = malloc(n * sizeof(int));
if (p == NULL) {
    printf("Out of memory\\n");
    return 1;
}
\`\`\`

## :memo: 3. Eliberează memoria

\`\`\`c
int *p = malloc(...);
// ... folosire
free(p);          // OBLIGATORIU
p = NULL;         // bonus — evită dangling pointer
\`\`\`

## :wrench: 4. Compilează cu warnings activate

\`\`\`bash
gcc -Wall -Wextra -Wpedantic -O2 program.c
\`\`\`

| Flag | Ce face |
|------|---------|
| \`-Wall\` | Avertismente comune |
| \`-Wextra\` | Avertismente extra |
| \`-Wpedantic\` | Strict ANSI C |
| \`-O2\` | Optimizări (compilare release) |
| \`-g\` | Debug info (pentru gdb) |

## :bulb: 5. Folosește \`const\` pentru ce nu se modifică

\`\`\`c
void afisare(const int *v, int n) {
    // promit că nu modific v
    for (int i = 0; i < n; i++) printf("%d ", v[i]);
}
\`\`\`

## :star: 6. Nume clare, nu enigmatice

\`\`\`c
// RĂU
int n, m, x, y;
for (int i = 0; i < n; i++) ...

// BUN
int rânduri, coloane;
for (int rând = 0; rând < rânduri; rând++) ...
\`\`\`

## :gear: 7. Funcții scurte (50 linii max)

O funcție lungă = greu de citit, greu de testat, greu de debugat.

## :books: 8. Comentarii utile (ce face & DE CE)

\`\`\`c
// RĂU: i++; // incrementează i

// BUN: counter++; // numărăm câte cuvinte încep cu majusculă
\`\`\`

## :rotating_light: Bug-uri tipice în C

| Bug | Simptom | Soluție |
|-----|---------|---------|
| Buffer overflow | Crash random | Folosește scanf cu limită: \`scanf("%99s", s);\` |
| Variabilă neinițializată | Comportament random | Inițializează la declarare |
| Dangling pointer | Crash sau date stricate | După free, setează = NULL |
| Memory leak | Programul folosește tot mai multă RAM | free pentru fiecare malloc |
| Off-by-one | Iterezi cu unul prea mult/puțin | Verifică <= vs < |
| Pierderi precizie | int + double | Cast explicit |

## :wrench: Tools utile

| Tool | Pentru ce |
|------|-----------|
| **gcc -Wall** | Warning-uri statice |
| **gdb** | Debugger interactiv |
| **valgrind** | Detectează memory leak / acces invalid |
| **clang-format** | Formatează codul |
| **cppcheck** | Static analysis |

## :white_check_mark: Debugging cu printf

\`\`\`c
printf("DEBUG: i=%d, suma=%lld\\n", i, suma);
\`\`\`

Mereu mai bun decât să nu știi ce face programul!

## :rainbow: Recap final

1. :white_check_mark: Inițializează variabilele
2. :white_check_mark: Verifică NULL după malloc/fopen
3. :white_check_mark: free pentru fiecare malloc
4. :white_check_mark: const pentru date imuabile
5. :white_check_mark: Nume clare, funcții scurte
6. :white_check_mark: Compilează cu -Wall -Wextra
7. :white_check_mark: Testează cu intrări extreme

## :tada: Felicitări!

Ai parcurs un curs C complet — de la \`hello world\` până la liste înlănțuite, fișiere și bune practici. C e fundamental pentru orice programator serios — îți dă **înțelegerea** despre cum funcționează computerele cu adevărat.
`,
  problems: [
    mc('Inițializare', 'O variabilă neinițializată în C are:',
      ['Valoarea 0', 'NULL', 'Valoare aleatorie ("garbage")', 'Compilatorul refuză'],
      'Valoare aleatorie ("garbage")',
      'C nu inițializează automat. Trebuie să o faci tu.', { topic: T }),
    mc('malloc verificare',
      'După un malloc, trebuie:',
      ['Să folosești direct pointerul', 'Să verifici dacă e NULL', 'Să apelezi free imediat', 'Să cast-ezi la int'],
      'Să verifici dacă e NULL',
      'malloc poate eșua (lipsă memorie) și returnează NULL.', { topic: T }),
    mc('free regulă',
      'Pentru câte malloc trebuie un free?',
      ['0', '1', 'Câți malloc, atâtea free', 'Niciun free e necesar'],
      'Câți malloc, atâtea free',
      'Fiecare malloc trebuie eliberat cu un free corespunzător.', { topic: T }),
    mc('Flag warnings',
      'Care flag GCC activează majoritatea avertismentelor?',
      ['-w', '-Wall', '-warnings', '-debug'], '-Wall',
      '`-Wall` = "all warnings" — extrem de util.', { topic: T }),
    mc('Tool memory leak',
      'Ce tool detectează memory leaks în C?',
      ['gdb', 'gcc', 'valgrind', 'make'], 'valgrind',
      'valgrind verifică folosirea memoriei la rulare.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Off-by-one', 'Care e numele clasic al bug-ului "iterez cu unul prea mult sau puțin"?',
      'off-by-one',
      'Bug-ul off-by-one = `< n` vs `<= n` greșit.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Dangling pointer prevention',
      'Ce ar trebui să atribui unui pointer DUPĂ free?',
      'NULL',
      'Setarea la NULL previne folosirea accidentală (dangling pointer).', { topic: T }),
    code('Cod robust',
      'Citește n, apoi alocă dinamic un vector de n întregi. Verifică malloc. Citește n numere, calculează și afișează media (cu 2 zecimale). Nu uita free!',
      'c',
      `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    
    // TODO: malloc + verificare NULL
    int *v = NULL;
    
    // TODO: citește n numere și calculează media
    
    // TODO: afișează cu %.2f
    
    // TODO: free
    
    return 0;
}`,
      '`v = malloc(n * sizeof(int)); if(!v) return 1; ... free(v);`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Const corectness',
      'Scrie funcția `void afisare(const int *v, int n)` care afișează elementele. Citește n și n numere, apoi apelează funcția.',
      'c',
      `#include <stdio.h>

void afisare(const int *v, int n) {
    // TODO: parcurge și afișează
}

int main() {
    int n;
    scanf("%d", &n);
    int v[1000];
    for (int i = 0; i < n; i++) scanf("%d", &v[i]);
    afisare(v, n);
    return 0;
}`,
      'For loop cu `printf("%d ", v[i]);`. `const` garantează că funcția nu modifică v.',
      { topic: T, difficulty: 'EASY' }),
    code('Nume clare',
      'Refactorează acest cod cu nume CLARE: `int n, m, x = 0; scanf("%d %d", &n, &m); for(int i=0;i<n;i++){int t; scanf("%d", &t); x += t;} printf("%d", x/n);`. Citește numarStudenti, divizor (folosește ca extra), n note. Afișează media (sumaNote/numarStudenti).',
      'c',
      `#include <stdio.h>

int main() {
    int numarStudenti, divizor;
    scanf("%d %d", &numarStudenti, &divizor);
    int sumaNote = 0;
    
    for (int i = 0; i < numarStudenti; i++) {
        int nota;
        scanf("%d", &nota);
        // TODO: adună nota la sumaNote
    }
    
    // TODO: afișează media (sumaNote / numarStudenti)
    
    return 0;
}`,
      '`sumaNote += nota;` apoi `printf("%d", sumaNote / numarStudenti);`',
      { topic: T, difficulty: 'EASY' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// EXPORT
// ────────────────────────────────────────────────────────────────────────────
export const cExtras = {
  newLessons: [
    { afterSlug: 'memorie-dinamica', ...matriceC },
    { afterSlug: 'matrice-c', ...stringuriAvansat },
    { afterSlug: 'stringuri-avansat-c', ...recursivitateC },
    { afterSlug: 'recursivitate-c', ...fisiereC },
    { afterSlug: 'fisiere-c', ...listeInlantuite },
    { afterSlug: 'liste-inlantuite', ...preprocesor },
    { afterSlug: 'preprocesor', ...enumTypedef },
    { afterSlug: 'enum-typedef', ...sortareCautare },
    { afterSlug: 'sortare-cautare', ...multiFisier },
    { afterSlug: 'multi-fisier', ...bunePracticiC },
  ],
}
