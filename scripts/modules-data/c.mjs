import { mc, sa } from './helpers.mjs'

// C — limbaj de bază pentru programare de sistem
// 12 lecții complete, focus pe sintaxă, pointeri, memorie, structuri
export const cModule = {
  slug: 'programare-c',
  title: 'Programare C',
  description:
    'Învață C — limbajul fundamental al programării. 12 lecții despre sintaxă, pointeri, memorie și structuri.',
  language: 'c',
  order: 5,
  lessons: [
    // ============ LECȚIA 1 ============
    {
      slug: 'introducere-printf',
      title: '1. Introducere + printf()',
      isFree: true,
      theory: `# Bun venit în C!

C este unul dintre cele mai vechi și **influente** limbaje de programare. Pe el sunt construite Linux, Windows, bazele de date și majoritatea limbajelor moderne (C++, Java, Python sunt scrise în C).

## De ce C?
- Foarte **rapid** — aproape ca limbajul mașinii
- Folosit în **sisteme de operare**, microcontrollere, drivere
- Te învață să gândești cum funcționează **calculatorul cu adevărat**

## Primul program în C
\`\`\`c
#include <stdio.h>

int main() {
    printf("Salut, lume!\\n");
    return 0;
}
\`\`\`

## Ce înseamnă fiecare linie?
- \`#include <stdio.h>\` — include biblioteca standard de input/output
- \`int main()\` — funcția **main** — punctul de pornire al oricărui program C
- \`printf(...)\` — afișează text pe ecran
- \`\\n\` — caracter de **linie nouă**
- \`return 0;\` — semnalează că programul s-a terminat cu succes

## ⚠️ În C, fiecare instrucțiune se termină cu \`;\`
`,
      problems: [
        mc('Funcția de afișare în C',
          'Care funcție afișează text pe ecran în C?',
          ['print()', 'printf()', 'console.log()', 'echo()'],
          'printf()',
          '`printf()` este funcția standard de afișare în C, definită în `<stdio.h>`.',
          { topic: 'printf' }),
        mc('Punctul de intrare',
          'Cum se numește funcția cu care începe orice program C?',
          ['start', 'begin', 'main', 'init'],
          'main',
          'Funcția `main()` este **punctul de intrare** al oricărui program C.',
          { topic: 'basics' }),
        mc('Linie nouă',
          'Ce afișează `\\n` în printf?',
          ['Litera n', 'Tab', 'O linie nouă', 'Spațiu'],
          'O linie nouă',
          '`\\n` este caracterul escape pentru **newline** (linie nouă).',
          { topic: 'printf' }),
        sa('Header pentru printf',
          'Ce header trebuie inclus pentru a folosi `printf()`? Răspunde cu directiva completă.',
          '#include <stdio.h>',
          '`stdio.h` (standard input/output) conține declarațiile pentru `printf` și `scanf`.',
          { topic: 'preprocessor' }),
        mc('Sfârșit instrucțiune',
          'Cu ce caracter se termină o instrucțiune în C?',
          [':', '.', ';', 'newline'],
          ';',
          'În C, fiecare instrucțiune se termină OBLIGATORIU cu `;`.',
          { topic: 'syntax' }),
        sa('Afișează text',
          'Scrie linia care afișează exact textul `Hello` (fără linie nouă).',
          'printf("Hello");',
          'Folosim `printf("Hello");` — string-ul între ghilimele duble.',
          { topic: 'printf' }),
      ],
    },

    // ============ LECȚIA 2 ============
    {
      slug: 'variabile-tipuri',
      title: '2. Variabile și tipuri de date',
      isFree: true,
      theory: `# Variabile în C

În C, **trebuie să declari tipul** unei variabile înainte de a o folosi.

\`\`\`c
int varsta = 12;
float inaltime = 1.55;
double precis = 3.141592653589;
char litera = 'A';
\`\`\`

## Tipuri primitive principale
- **int** — număr întreg (ex: \`42\`, \`-5\`)
- **float** — număr cu virgulă (4 octeți)
- **double** — număr cu virgulă, dublă precizie (8 octeți)
- **char** — un singur caracter, scris între **ghilimele simple** \`'A'\`
- **_Bool** / **bool** (din \`<stdbool.h>\`) — adevărat/fals

## Specificatori de format pentru printf
| Tip | Specificator |
|-----|--------------|
| int | \`%d\` |
| float / double | \`%f\` |
| char | \`%c\` |
| string (char*) | \`%s\` |

\`\`\`c
int varsta = 12;
printf("Am %d ani\\n", varsta);
\`\`\`

## ⚠️ C nu are tip "string" nativ
Un text este un **tablou de char-uri**, terminat cu caracterul special \`'\\0'\`:

\`\`\`c
char nume[] = "Ana";
\`\`\`
`,
      problems: [
        mc('Tipul pentru întregi',
          'Ce tip de date folosim pentru numere întregi în C?',
          ['number', 'int', 'integer', 'long_int_only'],
          'int',
          'Tipul `int` reprezintă numere întregi (de obicei pe 4 octeți).',
          { topic: 'tipuri' }),
        mc('Specificator %d',
          'Pentru ce tip se folosește `%d` în printf?',
          ['float', 'char', 'int', 'string'],
          'int',
          '`%d` (decimal) afișează un întreg.',
          { topic: 'printf' }),
        mc('Caracter în C',
          'Cum scriem caracterul A ca valoare în C?',
          ['"A"', '\'A\'', 'A', '<A>'],
          '\'A\'',
          'Un singur caracter se pune între **ghilimele simple**: `\'A\'`. Ghilimelele duble fac string.',
          { topic: 'tipuri' }),
        sa('Declarație variabilă',
          'Scrie o linie care declară o variabilă întreagă numită `n` cu valoarea `10`.',
          'int n = 10;',
          'Sintaxa: `tip nume = valoare;` — nu uita `;` la final.',
          { topic: 'variabile' }),
        mc('String în C',
          'Cum reprezintă C un string?',
          ['Tip nativ string', 'Tablou de char terminat cu \\0', 'Listă de litere', 'Obiect String'],
          'Tablou de char terminat cu \\0',
          'În C un string este un `char[]` care se termină cu caracterul nul `\'\\0\'`.',
          { topic: 'string', difficulty: 'MEDIUM' }),
        sa('Specificator pentru float',
          'Care specificator de format folosim pentru a afișa un `float` cu printf?',
          '%f',
          '`%f` se folosește pentru `float` și `double`.',
          { topic: 'printf' }),
      ],
    },

    // ============ LECȚIA 3 ============
    {
      slug: 'scanf-input',
      title: '3. Citire date cu scanf()',
      isFree: false,
      theory: `# Citirea datelor cu scanf()

\`scanf()\` citește date de la tastatură și le pune într-o variabilă.

\`\`\`c
#include <stdio.h>

int main() {
    int varsta;
    printf("Ce vârstă ai? ");
    scanf("%d", &varsta);
    printf("Ai %d ani.\\n", varsta);
    return 0;
}
\`\`\`

## ⚠️ Atenție la operatorul \`&\`
\`\`\`c
scanf("%d", &varsta);   // & = ADRESA variabilei
\`\`\`

\`scanf\` are nevoie de **adresa în memorie** unde să scrie valoarea. Asta se face cu operatorul **address-of** \`&\`.

## Citire mai multe valori
\`\`\`c
int a, b;
scanf("%d %d", &a, &b);
\`\`\`

## Citire string
\`\`\`c
char nume[50];
scanf("%s", nume);   // FĂRĂ & — pentru tablouri
\`\`\`

(Numele tabloului este deja o adresă!)
`,
      problems: [
        mc('Operatorul address-of',
          'Ce face operatorul `&` în `scanf("%d", &x)`?',
          ['Și logic', 'Returnează adresa variabilei x', 'Înmulțește', 'Comentariu'],
          'Returnează adresa variabilei x',
          '`&x` returnează **adresa în memorie** a lui `x`, necesară pentru ca `scanf` să scrie acolo.',
          { topic: 'scanf', difficulty: 'MEDIUM' }),
        mc('Citire int',
          'Care e sintaxa corectă pentru a citi un întreg `n`?',
          ['scanf("%d", n)', 'scanf("%d", &n)', 'scanf("%i", n)', 'cin >> n'],
          'scanf("%d", &n)',
          'Specificator `%d` pentru int + adresa `&n` (scanf scrie acolo).',
          { topic: 'scanf' }),
        sa('Citire float',
          'Scrie linia care citește un `float` numit `pret` (variabila există deja).',
          'scanf("%f", &pret);',
          '`%f` pentru float + `&pret` pentru adresă.',
          { topic: 'scanf' }),
        mc('Două valori',
          'Cum citim 2 întregi `a` și `b` într-un singur `scanf`?',
          ['scanf("%d %d", a, b)', 'scanf("%d %d", &a, &b)', 'scanf("%d", &a, &b)', 'scanf(a, b)'],
          'scanf("%d %d", &a, &b)',
          'Specificatorii separați prin spațiu, urmate de adresele variabilelor.',
          { topic: 'scanf' }),
        mc('De ce nu & la string?',
          'De ce nu folosim `&` când citim un string `char nume[50]`?',
          [
            'Pentru că & nu există pentru tablouri',
            'Numele tabloului este deja o adresă',
            'scanf nu citește string-uri',
            'Pentru că e bug în C',
          ],
          'Numele tabloului este deja o adresă',
          'Numele unui tablou se "decăde" în pointer la primul element — deci e deja o adresă.',
          { topic: 'scanf', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 4 ============
    {
      slug: 'operatori-expresii',
      title: '4. Operatori și expresii',
      isFree: false,
      theory: `# Operatori în C

## Aritmetici
\`+\`, \`-\`, \`*\`, \`/\`, \`%\` (rest)

\`\`\`c
int a = 10, b = 3;
printf("%d\\n", a / b);   // 3 (împărțire ÎNTREAGĂ!)
printf("%d\\n", a % b);   // 1 (rest)
\`\`\`

## ⚠️ Împărțire întreagă
Dacă ambii operanzi sunt \`int\`, rezultatul este **trunchiat**:
\`\`\`c
printf("%d\\n", 7 / 2);     // 3, NU 3.5!
printf("%f\\n", 7.0 / 2);   // 3.500000
\`\`\`

## Atribuire compusă
\`\`\`c
x += 5;   // x = x + 5
x -= 2;   // x = x - 2
x *= 3;   // x = x * 3
x++;      // x = x + 1
x--;      // x = x - 1
\`\`\`

## Comparare
\`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\` — returnează **1** (true) sau **0** (false).

## Logici
\`&&\` (AND), \`||\` (OR), \`!\` (NOT)
`,
      problems: [
        mc('Împărțire întregi',
          'Cât face `7 / 2` în C, dacă ambele sunt `int`?',
          ['3.5', '3', '4', 'Eroare'],
          '3',
          'Împărțirea între doi `int` produce `int` — partea întreagă (trunchiat).',
          { topic: 'operatori', difficulty: 'MEDIUM' }),
        mc('Modulo',
          'Cât face `17 % 5`?',
          ['3', '2', '5', '12'],
          '2',
          '`%` returnează **restul împărțirii**: 17 = 3*5 + 2.',
          { topic: 'operatori' }),
        sa('Egal',
          'Care operator verifică **egalitatea** a două valori în C? (un singur token)',
          '==',
          '`==` este operatorul de comparație. Atenție: `=` este atribuire!',
          { topic: 'operatori' }),
        mc('Atribuire compusă',
          'La ce e echivalent `x += 3` ?',
          ['x = 3', 'x = x + 3', 'x++', 'x * 3'],
          'x = x + 3',
          '`x += 3` este o scurtătură pentru `x = x + 3`.',
          { topic: 'operatori' }),
        mc('AND logic',
          'Care este operatorul AND logic în C?',
          ['and', '&', '&&', 'AND'],
          '&&',
          '`&&` este AND logic; `&` este AND pe biți (bitwise) — diferit!',
          { topic: 'operatori' }),
      ],
    },

    // ============ LECȚIA 5 ============
    {
      slug: 'conditii',
      title: '5. Condiții — if, else, switch',
      isFree: false,
      theory: `# Condiții în C

## if / else if / else
\`\`\`c
int nota = 8;

if (nota >= 9) {
    printf("Foarte bine\\n");
} else if (nota >= 7) {
    printf("Bine\\n");
} else {
    printf("Mai exersează\\n");
}
\`\`\`

## ⚠️ Folosește **acolade** \`{ }\`
Chiar dacă ai o singură instrucțiune, e **bună practică** să folosești acolade.

## Operator ternar
\`\`\`c
int max = (a > b) ? a : b;
\`\`\`

## switch
\`\`\`c
int zi = 3;
switch (zi) {
    case 1: printf("Luni\\n"); break;
    case 2: printf("Marți\\n"); break;
    case 3: printf("Miercuri\\n"); break;
    default: printf("Altă zi\\n");
}
\`\`\`

## ⚠️ Nu uita \`break;\`
Fără \`break\`, execuția continuă în următorul case (**fall-through**).
`,
      problems: [
        mc('Sintaxă if',
          'Care este sintaxa corectă pentru if în C?',
          ['if x > 5 then', 'if (x > 5) { ... }', 'if x > 5: ...', 'if [x > 5] ...'],
          'if (x > 5) { ... }',
          'Condiția trebuie între paranteze rotunde, blocul între acolade.',
          { topic: 'if' }),
        mc('Operator ternar',
          'Ce returnează `(5 > 3) ? "DA" : "NU"` ?',
          ['"DA"', '"NU"', '5', '3'],
          '"DA"',
          'Ternar: `condiție ? valoare_dacă_true : valoare_dacă_false`.',
          { topic: 'ternary', difficulty: 'MEDIUM' }),
        mc('break în switch',
          'Ce se întâmplă într-un switch dacă uiți `break` la sfârșitul unui case?',
          [
            'Eroare de compilare',
            'Programul se oprește',
            'Execuția cade în case-ul următor (fall-through)',
            'Nimic, e identic',
          ],
          'Execuția cade în case-ul următor (fall-through)',
          'Fără `break`, execuția continuă cu instrucțiunile din case-urile următoare.',
          { topic: 'switch', difficulty: 'MEDIUM' }),
        sa('Operator NOT',
          'Care operator inversează valoarea logică (NOT)? (un singur caracter)',
          '!',
          '`!` neagă valoarea: `!1` → `0`, `!0` → `1`.',
          { topic: 'operatori' }),
        mc('Echivalența 0',
          'În C, ce valoare reprezintă "fals"?',
          ['false', '-1', '0', 'NULL'],
          '0',
          'În C clasic, `0` este fals, **orice altă valoare** este adevărat.',
          { topic: 'bool' }),
      ],
    },

    // ============ LECȚIA 6 ============
    {
      slug: 'bucle',
      title: '6. Bucle — for, while, do-while',
      isFree: false,
      theory: `# Bucle în C

## for
\`\`\`c
for (int i = 0; i < 10; i++) {
    printf("%d\\n", i);
}
\`\`\`
Trei părți: **inițializare ; condiție ; pas**.

## while
\`\`\`c
int n = 5;
while (n > 0) {
    printf("%d\\n", n);
    n--;
}
\`\`\`

## do-while (rulează **cel puțin o dată**)
\`\`\`c
int n;
do {
    printf("Introdu un număr pozitiv: ");
    scanf("%d", &n);
} while (n <= 0);
\`\`\`

## break și continue
- \`break;\` — iese din buclă imediat
- \`continue;\` — sare la **următoarea iterație**

\`\`\`c
for (int i = 0; i < 10; i++) {
    if (i == 5) break;       // se oprește la 5
    if (i % 2 == 0) continue; // sare numerele pare
    printf("%d ", i);
}
// Output: 1 3
\`\`\`
`,
      problems: [
        mc('Sintaxă for',
          'Care este structura unui for în C?',
          [
            'for (i = 0 to 10)',
            'for (init; condiție; pas)',
            'for i in range(10)',
            'for (condiție)',
          ],
          'for (init; condiție; pas)',
          'Cele 3 părți separate prin `;`: inițializare, condiție, pas.',
          { topic: 'for' }),
        mc('Câte ori rulează?',
          'De câte ori rulează `for (int i = 0; i < 5; i++)`?',
          ['4', '5', '6', 'infinit'],
          '5',
          'i ia valorile 0, 1, 2, 3, 4 — 5 iterații.',
          { topic: 'for' }),
        mc('do-while',
          'Care e diferența între `while` și `do-while`?',
          [
            'do-while e mai rapid',
            'do-while rulează cel puțin o dată',
            'while nu există în C',
            'Sunt identice',
          ],
          'do-while rulează cel puțin o dată',
          'În `do-while`, condiția e verificată **după** corpul buclei, deci rulează minim o dată.',
          { topic: 'do-while', difficulty: 'MEDIUM' }),
        sa('Ieșire forțată',
          'Care cuvânt cheie iese imediat din bucla curentă? (un cuvânt)',
          'break',
          '`break;` întrerupe bucla curentă imediat.',
          { topic: 'bucle' }),
        sa('Buclă infinită',
          'Scrie un `while` infinit (cea mai scurtă variantă cu 1).',
          'while(1)',
          '`while(1)` rulează la infinit pentru că `1` este mereu adevărat în C.',
          { topic: 'while', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 7 ============
    {
      slug: 'functii',
      title: '7. Funcții',
      isFree: false,
      theory: `# Funcții în C

O funcție este un **bloc reutilizabil** de cod.

\`\`\`c
#include <stdio.h>

// Definiție
int suma(int a, int b) {
    return a + b;
}

int main() {
    int rezultat = suma(3, 5);
    printf("%d\\n", rezultat);   // 8
    return 0;
}
\`\`\`

## Sintaxa
\`\`\`
tip_returnat nume(tip param1, tip param2) {
    // ...
    return valoare;
}
\`\`\`

## Funcții fără valoare returnată
Folosește \`void\`:
\`\`\`c
void salut() {
    printf("Salut!\\n");
}
\`\`\`

## Prototip (declarare înainte de folosire)
\`\`\`c
int patrat(int);   // prototip

int main() {
    printf("%d\\n", patrat(5));
    return 0;
}

int patrat(int x) {
    return x * x;
}
\`\`\`
`,
      problems: [
        mc('Tipul fără returnare',
          'Ce tip se folosește pentru funcții care **NU returnează nimic**?',
          ['null', 'none', 'void', 'empty'],
          'void',
          '`void` indică o funcție fără valoare de returnare.',
          { topic: 'functii' }),
        mc('Cuvânt pentru returnare',
          'Care cuvânt cheie returnează o valoare din funcție?',
          ['give', 'return', 'yield', 'output'],
          'return',
          '`return valoare;` returnează valoarea apelantului.',
          { topic: 'functii' }),
        sa('Definește funcție',
          'Scrie antetul (signatura, fără corp) unei funcții `dublu` care primește un `int x` și returnează un `int`.',
          'int dublu(int x)',
          'Sintaxa: `tip_returnat nume(tip parametru)` — fără `;` pentru definiție.',
          { topic: 'functii' }),
        mc('Prototip',
          'Ce este un **prototip de funcție** în C?',
          [
            'O variabilă specială',
            'Declararea funcției înainte de definire',
            'Un comentariu',
            'O bibliotecă',
          ],
          'Declararea funcției înainte de definire',
          'Prototipul îi spune compilatorului semnătura unei funcții, înainte ca ea să fie folosită.',
          { topic: 'functii', difficulty: 'MEDIUM' }),
        mc('Apel funcție',
          'Cum apelăm funcția `f(int x, int y)` cu valorile 2 și 3?',
          ['f 2 3', 'f(2, 3)', 'call f(2, 3)', 'f[2][3]'],
          'f(2, 3)',
          'Apel: `nume(arg1, arg2)`.',
          { topic: 'functii' }),
      ],
    },

    // ============ LECȚIA 8 ============
    {
      slug: 'tablouri',
      title: '8. Tablouri (arrays)',
      isFree: false,
      theory: `# Tablouri în C

Un **tablou** este o colecție de elemente de **același tip**, stocate consecutiv în memorie.

\`\`\`c
int note[5] = {8, 9, 7, 10, 6};

printf("%d\\n", note[0]);   // 8 — primul element
printf("%d\\n", note[4]);   // 6 — ultimul (index 4!)
\`\`\`

## ⚠️ Indexare de la 0
Tablourile încep de la indexul **0**, nu 1!

## Parcurgere
\`\`\`c
int n = 5;
for (int i = 0; i < n; i++) {
    printf("%d ", note[i]);
}
\`\`\`

## C **NU verifică** limitele!
\`\`\`c
int a[3] = {1, 2, 3};
printf("%d", a[10]);   // COMPORTAMENT NEDEFINIT!
\`\`\`

Tu ești responsabil să nu ieși din tablou.

## Tablou cu dimensiune fixă, valori inițializate
\`\`\`c
int v[100] = {0};   // toate elementele 0
\`\`\`
`,
      problems: [
        mc('Index primul element',
          'Care este indexul **primului** element într-un tablou C?',
          ['1', '0', '-1', 'depinde'],
          '0',
          'În C (și majoritatea limbajelor), indexarea începe de la **0**.',
          { topic: 'arrays' }),
        mc('Acces la element',
          'Care e ultimul index valid pentru `int a[10]`?',
          ['10', '9', '11', '0'],
          '9',
          'Tabloul `a[10]` are 10 elemente, indecșii **0..9**.',
          { topic: 'arrays' }),
        sa('Declarație',
          'Scrie o linie care declară un tablou de 5 întregi numit `v`, **neinițializat**.',
          'int v[5];',
          'Sintaxa: `tip nume[dimensiune];`.',
          { topic: 'arrays' }),
        mc('Limite tablou',
          'Ce face C dacă accesezi `a[100]` într-un tablou de 5 elemente?',
          [
            'Eroare de compilare',
            'Returnează 0',
            'Comportament nedefinit (undefined behavior)',
            'Returnează NULL',
          ],
          'Comportament nedefinit (undefined behavior)',
          'C **NU verifică** limitele tabloului. Accesul în afara tabloului e UB.',
          { topic: 'arrays', difficulty: 'MEDIUM' }),
        sa('Inițializare',
          'Scrie o linie care declară `int t[3]` cu valorile `1, 2, 3`.',
          'int t[3] = {1, 2, 3};',
          'Lista de inițializare se pune între acolade `{}`.',
          { topic: 'arrays' }),
      ],
    },

    // ============ LECȚIA 9 ============
    {
      slug: 'stringuri',
      title: '9. Stringuri (char arrays)',
      isFree: false,
      theory: `# Stringuri în C

În C, un **string este un \`char[]\`** care se termină cu caracterul special **\`'\\0'\`** (caracterul nul).

\`\`\`c
char nume[] = "Ana";
// Echivalent cu: { 'A', 'n', 'a', '\\0' }
\`\`\`

## Afișare cu %s
\`\`\`c
printf("Salut, %s!\\n", nume);
\`\`\`

## Funcții utile din \`<string.h>\`
\`\`\`c
#include <string.h>

char a[20] = "Salut";
char b[20] = "Lume";

strlen(a);          // 5 — lungimea (fără \\0)
strcpy(a, b);       // copiază b în a
strcat(a, b);       // adaugă b la finalul lui a
strcmp(a, b);       // 0 dacă sunt egale
\`\`\`

## ⚠️ NU folosești \`==\` pentru stringuri!
\`\`\`c
if (a == b)         // GREȘIT! compară pointeri
if (strcmp(a, b) == 0)  // CORECT
\`\`\`

## Citire string
\`\`\`c
char buf[100];
scanf("%s", buf);          // un cuvânt (stop la spațiu)
fgets(buf, 100, stdin);    // o linie întreagă
\`\`\`
`,
      problems: [
        mc('Caracter terminator',
          'Cu ce caracter se termină un string în C?',
          ['\\n', '\\0', '0', 'EOF'],
          '\\0',
          '`\'\\0\'` (caracter nul) marchează sfârșitul unui string în C.',
          { topic: 'string' }),
        mc('Lungimea unui string',
          'Care funcție returnează lungimea unui string?',
          ['length()', 'len()', 'strlen()', 'sizeof()'],
          'strlen()',
          '`strlen()` din `<string.h>` returnează numărul de caractere (fără `\\0`).',
          { topic: 'string' }),
        mc('Compararea string-urilor',
          'Cum comparăm corect două string-uri în C?',
          ['a == b', 'strcmp(a, b) == 0', 'a.equals(b)', 'compare(a, b)'],
          'strcmp(a, b) == 0',
          '`==` compară **pointeri** (adrese), nu conținut. Folosește `strcmp` care returnează 0 la egalitate.',
          { topic: 'string', difficulty: 'MEDIUM' }),
        sa('Header pentru string',
          'Ce header trebuie inclus pentru `strlen`, `strcpy`, etc.?',
          '#include <string.h>',
          'Toate funcțiile de string sunt în `<string.h>`.',
          { topic: 'string' }),
        mc('Citire linie',
          'Ce funcție citește o **linie întreagă** (cu spații) într-un buffer?',
          ['scanf("%s")', 'gets()', 'fgets()', 'getline()'],
          'fgets()',
          '`fgets()` citește o linie până la `\\n` sau EOF, sigur (limitează dimensiunea).',
          { topic: 'string', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 10 ============
    {
      slug: 'pointeri',
      title: '10. Pointeri',
      isFree: false,
      theory: `# Pointeri — superputerea lui C

Un **pointer** este o variabilă care **stochează o adresă de memorie**.

\`\`\`c
int x = 42;
int *p = &x;     // p deține ADRESA lui x

printf("%d\\n", x);    // 42
printf("%p\\n", p);    // adresa: ex. 0x7ffe...
printf("%d\\n", *p);   // 42 — valoarea din adresa p (DEREFERENȚIERE)
\`\`\`

## Doi operatori cheie
- \`&x\` — **adresa** lui x (address-of)
- \`*p\` — **valoarea** din adresa p (dereference)

## Pointer NULL
\`\`\`c
int *p = NULL;   // pointer "gol", nu pointează nicăieri
\`\`\`

Înainte de a dereferenția, verifică:
\`\`\`c
if (p != NULL) {
    printf("%d", *p);
}
\`\`\`

## Modificare prin pointer
\`\`\`c
int x = 10;
int *p = &x;
*p = 99;
printf("%d\\n", x);   // 99 — am modificat x prin pointer
\`\`\`

## Pointeri și funcții (pass by reference)
\`\`\`c
void dubleaza(int *n) {
    *n = *n * 2;
}

int main() {
    int x = 5;
    dubleaza(&x);
    printf("%d\\n", x);   // 10
    return 0;
}
\`\`\`
`,
      problems: [
        mc('Ce e un pointer',
          'Ce stochează un pointer?',
          ['O valoare numerică', 'O adresă de memorie', 'Un string', 'O funcție'],
          'O adresă de memorie',
          'Un pointer stochează **adresa unei variabile** în memorie.',
          { topic: 'pointeri' }),
        mc('Operator dereferențiere',
          'Care operator obține **valoarea** dintr-un pointer?',
          ['&', '*', '->', '@'],
          '*',
          '`*p` (dereferențiere) returnează valoarea din adresa stocată de p.',
          { topic: 'pointeri', difficulty: 'MEDIUM' }),
        mc('Operator address-of',
          'Care operator obține **adresa** unei variabile?',
          ['*', '&', '#', '$'],
          '&',
          '`&x` returnează adresa lui x în memorie.',
          { topic: 'pointeri' }),
        sa('Declară pointer',
          'Scrie linia care declară un pointer la `int` numit `p`.',
          'int *p;',
          '`int *p;` — asteriscul leagă tipul de pointer.',
          { topic: 'pointeri' }),
        mc('Pointer gol',
          'Ce valoare specială înseamnă "pointer care nu pointează nicăieri"?',
          ['0.0', 'NULL', 'EMPTY', '"none"'],
          'NULL',
          '`NULL` (definit în `<stddef.h>`/`<stdio.h>`) marchează un pointer gol.',
          { topic: 'pointeri' }),
        mc('Pass by reference',
          'Cum modifici o variabilă din **interiorul** unei funcții?',
          [
            'Direct, ca parametru',
            'Folosind un pointer la ea',
            'Imposibil în C',
            'Cu return',
          ],
          'Folosind un pointer la ea',
          'Trimiți **adresa** (`&x`) și funcția modifică prin `*p = ...`.',
          { topic: 'pointeri', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 11 ============
    {
      slug: 'structuri',
      title: '11. Structuri (struct)',
      isFree: false,
      theory: `# Structuri în C

O **structură** grupează variabile diferite sub un singur nume.

\`\`\`c
struct Persoana {
    char nume[50];
    int varsta;
    float inaltime;
};

int main() {
    struct Persoana p1;
    strcpy(p1.nume, "Ana");
    p1.varsta = 12;
    p1.inaltime = 1.55;

    printf("%s, %d ani\\n", p1.nume, p1.varsta);
    return 0;
}
\`\`\`

## Inițializare la declarare
\`\`\`c
struct Persoana p2 = {"Ion", 14, 1.65};
\`\`\`

## typedef — alias mai scurt
\`\`\`c
typedef struct {
    int x;
    int y;
} Punct;

Punct p = {3, 4};   // fără "struct" în față
\`\`\`

## Pointer la struct — operator \`->\`
\`\`\`c
Punct p = {1, 2};
Punct *pp = &p;

printf("%d\\n", (*pp).x);   // 1
printf("%d\\n", pp->x);     // 1 — mai elegant
\`\`\`

\`pp->x\` este echivalent cu \`(*pp).x\`.
`,
      problems: [
        mc('Cuvânt pentru struct',
          'Care cuvânt cheie definește o structură în C?',
          ['class', 'struct', 'object', 'record'],
          'struct',
          '`struct` introduce o structură — colecție de câmpuri grupate.',
          { topic: 'struct' }),
        mc('Acces la câmp',
          'Cum accesăm câmpul `varsta` al variabilei `p` (struct)?',
          ['p->varsta', 'p:varsta', 'p.varsta', 'varsta(p)'],
          'p.varsta',
          'Pentru variabilă struct: `.`. Pentru pointer la struct: `->`.',
          { topic: 'struct' }),
        mc('Acces prin pointer',
          'Dacă `p` este un **pointer** la struct, cum accesăm `varsta`?',
          ['p.varsta', 'p->varsta', 'p::varsta', '*p.varsta'],
          'p->varsta',
          '`p->varsta` este echivalent cu `(*p).varsta` — operatorul săgeată pentru pointeri.',
          { topic: 'struct', difficulty: 'MEDIUM' }),
        sa('typedef',
          'Care cuvânt cheie creează un **alias** pentru un tip (ex: pentru a evita scrierea "struct X")?',
          'typedef',
          '`typedef struct {...} Nume;` permite folosirea lui `Nume` direct.',
          { topic: 'struct', difficulty: 'MEDIUM' }),
        mc('Struct conține',
          'Ce poate conține o structură?',
          [
            'Doar int-uri',
            'Doar variabile de același tip',
            'Variabile de tipuri diferite',
            'Doar funcții',
          ],
          'Variabile de tipuri diferite',
          'Asta e diferența față de tablouri — struct grupează câmpuri **eterogene**.',
          { topic: 'struct' }),
      ],
    },

    // ============ LECȚIA 12 ============
    {
      slug: 'memorie-dinamica',
      title: '12. Memorie dinamică (malloc / free)',
      isFree: false,
      theory: `# Memorie dinamică în C

Până acum am folosit memorie **statică** (variabile cu dimensiune fixă, cunoscută la compilare). Pentru memorie alocată **la runtime**, folosim funcțiile din \`<stdlib.h>\`.

## malloc()
Alocă un bloc de memorie și returnează un pointer la el (sau \`NULL\` la eroare).

\`\`\`c
#include <stdlib.h>

int n = 100;
int *v = (int*) malloc(n * sizeof(int));

if (v == NULL) {
    printf("Memorie insuficientă!\\n");
    return 1;
}

// folosește v ca pe orice tablou
v[0] = 42;
\`\`\`

## sizeof
Returnează **dimensiunea în octeți** a unui tip:
\`\`\`c
sizeof(int)        // de obicei 4
sizeof(double)     // de obicei 8
\`\`\`

## free()
**OBLIGATORIU** eliberează memoria când nu o mai folosești:
\`\`\`c
free(v);
v = NULL;   // bună practică
\`\`\`

## ⚠️ Memory leak
Dacă uiți \`free()\`, memoria rămâne ocupată până la închiderea programului — **scurgere de memorie** (memory leak).

## calloc — alocă și pune pe 0
\`\`\`c
int *v = (int*) calloc(n, sizeof(int));   // toate elementele 0
\`\`\`

## realloc — redimensionează
\`\`\`c
v = (int*) realloc(v, 200 * sizeof(int));
\`\`\`
`,
      problems: [
        mc('Funcția de alocare',
          'Care funcție alocă memorie dinamic în C?',
          ['new', 'alloc', 'malloc', 'create'],
          'malloc',
          '`malloc(n)` alocă `n` octeți și returnează un pointer.',
          { topic: 'memorie' }),
        mc('Header pentru malloc',
          'Ce header trebuie inclus pentru `malloc` și `free`?',
          ['<stdio.h>', '<stdlib.h>', '<string.h>', '<malloc.h>'],
          '<stdlib.h>',
          '`malloc`, `free`, `calloc`, `realloc` sunt în `<stdlib.h>`.',
          { topic: 'memorie' }),
        mc('Eliberare',
          'Care funcție eliberează memoria alocată cu malloc?',
          ['delete', 'free', 'release', 'remove'],
          'free',
          '`free(p)` eliberează memoria de la adresa `p`.',
          { topic: 'memorie' }),
        sa('Dimensiunea unui tip',
          'Care operator returnează **dimensiunea în octeți** a unui tip?',
          'sizeof',
          '`sizeof(int)` returnează numărul de octeți (de obicei 4).',
          { topic: 'memorie' }),
        mc('Memory leak',
          'Ce se întâmplă dacă uiți `free()` după `malloc()`?',
          [
            'Eroare de compilare',
            'Programul crapă imediat',
            'Memorie rămâne ocupată — memory leak',
            'Nimic, OS-ul gestionează',
          ],
          'Memorie rămâne ocupată — memory leak',
          'Memoria nu e eliberată până la închiderea programului — scurgere (leak).',
          { topic: 'memorie', difficulty: 'MEDIUM' }),
        mc('malloc returnează NULL',
          'Ce înseamnă dacă `malloc` returnează `NULL`?',
          [
            'Memoria a fost alocată',
            'Alocarea a eșuat (memorie insuficientă)',
            'Variabila e goală',
            'Funcția nu există',
          ],
          'Alocarea a eșuat (memorie insuficientă)',
          'Întotdeauna verifică `if (p == NULL)` după malloc!',
          { topic: 'memorie', difficulty: 'MEDIUM' }),
      ],
    },
  ],
}
