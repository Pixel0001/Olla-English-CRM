// Quiz pack pentru C — adaugă MC/SA suplimentare la fiecare lecție.

import { mc, sa } from './helpers.mjs'

const introducerePrintfQuiz = [
  mc('Ce afișează printf("%d", 2+3)?', 'Care este output-ul?', ['"2+3"', '5', '"5"', 'Eroare'], '5', 'C evaluează expresia și `%d` afișează 5.', { topic: 'printf' }),
  mc('Compilator C', 'Care e cel mai folosit compilator C open-source?', ['javac', 'gcc', 'python', 'cl.exe'], 'gcc', 'GCC (GNU Compiler Collection) — standard pe Linux/Mac/Windows (MinGW).', { topic: 'tools' }),
  sa('Comentariu o linie', 'Ce simbol începe un comentariu pe o singură linie în C? (2 caractere)', '//', '`//` (din C99). Comentariile multi-linie folosesc `/* ... */`.', { topic: 'syntax' }),
  mc('Return în main', 'Ce semnifică `return 0;` la finalul lui main?', ['Eroare', 'Programul s-a terminat cu succes', 'Reîncepe programul', 'Nimic, e doar convenție'], 'Programul s-a terminat cu succes', 'Cod 0 = succes; orice alt cod = eroare.', { topic: 'main', difficulty: 'MEDIUM' }),
]

const variabileTipuriQuiz = [
  mc('Mărimea int', 'Câți octeți ocupă de obicei un `int` pe sistemele moderne?', ['1', '2', '4', '8'], '4', 'De obicei 4 octeți (32 biți), dar depinde de platformă. Folosește `sizeof(int)`.', { topic: 'tipuri' }),
  mc('Diferența float vs double', 'Care e diferența principală?', ['Sunt identice', 'double are dublă precizie (8 octeți)', 'float e mai precis', 'double doar pe 64-bit'], 'double are dublă precizie (8 octeți)', '`float` = 4 octeți, `double` = 8 octeți (mai multă precizie).', { topic: 'tipuri', difficulty: 'MEDIUM' }),
  mc('Constantă', 'Cum declari o constantă în C?', ['final int X = 5;', 'const int X = 5;', 'let X = 5;', 'static X = 5;'], 'const int X = 5;', '`const` face variabila imodificabilă.', { topic: 'const' }),
  sa('Specificator pentru char', 'Care specificator de format afișează un caracter cu printf?', '%c', '`%c` afișează un singur caracter.', { topic: 'printf' }),
]

const scanfInputQuiz = [
  mc('Format pentru double', 'Ce specificator se folosește la `scanf` pentru un `double`?', ['%f', '%lf', '%d', '%g'], '%lf', 'La SCANF, double cere `%lf` (l = long). La printf merge și `%f`.', { topic: 'scanf', difficulty: 'MEDIUM' }),
  mc('Eroare frecventă', 'Care e cea mai frecventă greșeală la scanf?', ['Folosirea ghilimelelor', 'Uitarea operatorului &', 'Folosirea %d', 'Lipsa break'], 'Uitarea operatorului &', 'Fără `&`, scanf primește o valoare în loc de adresă → comportament nedefinit.', { topic: 'scanf' }),
  sa('Citește un caracter', 'Scrie linia care citește un caracter `c` cu scanf.', 'scanf("%c", &c);', '`%c` pentru caracter + `&c` pentru adresă.', { topic: 'scanf' }),
]

const operatoriExpresiiQuiz = [
  mc('Cast la float', 'Cum forțăm `7 / 2` să returneze 3.5?', ['(float)(7/2)', '(float)7 / 2', 'float(7/2)', '7 // 2'], '(float)7 / 2', 'Convertim **înainte** de împărțire → împărțire în virgulă mobilă.', { topic: 'cast', difficulty: 'MEDIUM' }),
  mc('OR logic', 'Care e operatorul OR logic?', ['|', '||', 'or', '|||'], '||', '`||` = OR logic; `|` = OR pe biți.', { topic: 'operatori' }),
  mc('Increment', 'Ce face `x++`?', ['Înmulțește x', 'Crește x cu 1', 'Scade 1', 'Compară x'], 'Crește x cu 1', 'Echivalent cu `x = x + 1;`.', { topic: 'operatori' }),
  sa('Diferent de', 'Care operator verifică **inegalitatea** a două valori? (2 caractere)', '!=', '`!=` returnează 1 dacă valorile diferă.', { topic: 'operatori' }),
]

const conditiiQuiz = [
  mc('switch pe ce tipuri', 'Pe ce tipuri funcționează `switch` în C?', ['Doar string-uri', 'int și char (valori întregi)', 'Orice tip', 'Doar bool'], 'int și char (valori întregi)', '`switch` funcționează doar pe **valori întregi** (inclusiv `char` și `enum`).', { topic: 'switch', difficulty: 'MEDIUM' }),
  mc('Else if', 'Care e sintaxa corectă?', ['elif', 'else if', 'elseif', 'or if'], 'else if', 'În C: `else if` (două cuvinte separate).', { topic: 'if' }),
  sa('default', 'Care cuvânt cheie definește cazul "altfel" într-un switch?', 'default', '`default:` se execută dacă nimic altceva nu s-a potrivit.', { topic: 'switch' }),
]

const bucleQuiz = [
  mc('continue', 'Ce face `continue;` într-o buclă?', ['Iese din buclă', 'Sare la următoarea iterație', 'Repornește bucla', 'Pauzează'], 'Sare la următoarea iterație', '`continue` ignoră restul corpului și trece la următoarea iterație.', { topic: 'bucle', difficulty: 'MEDIUM' }),
  mc('Nested loop', 'Ce face `break;` într-o buclă **dublă**?', ['Iese din ambele', 'Iese doar din bucla interioară', 'Iese din funcție', 'Eroare'], 'Iese doar din bucla interioară', '`break` iese doar din bucla **curentă** (cea mai apropiată).', { topic: 'bucle', difficulty: 'MEDIUM' }),
  sa('for invers', 'Scrie un for care numără **descrescător** de la 10 la 1, antetul complet.', 'for (int i = 10; i >= 1; i--)', 'Inițializare: 10, condiție: i >= 1, pas: --.', { topic: 'for' }),
]

const functiiQuiz = [
  mc('Recursivitate', 'Ce este o funcție recursivă?', ['Care nu are return', 'Care se apelează pe sine însăși', 'Care returnează void', 'Care e statică'], 'Care se apelează pe sine însăși', 'Recursivitatea este apelarea funcției din interiorul ei.', { topic: 'recursie', difficulty: 'MEDIUM' }),
  mc('Domeniu variabilă', 'O variabilă declarată **în interiorul** unei funcții este:', ['Globală', 'Locală', 'Statică', 'Constantă'], 'Locală', 'Variabilele declarate în funcție există doar pe durata apelului.', { topic: 'scope' }),
  mc('main returnează', 'Ce tip returnează `main` în C standard?', ['void', 'int', 'char', 'double'], 'int', 'Standard ANSI C: `int main(void)` sau `int main(int argc, char *argv[])`.', { topic: 'main' }),
]

const tablouriQuiz = [
  mc('Lungime tablou', 'Cum afli numărul de elemente al unui tablou static `int v[N]`?', ['v.length', 'sizeof(v)/sizeof(v[0])', 'len(v)', 'count(v)'], 'sizeof(v)/sizeof(v[0])', 'C nu stochează lungimea; o calculezi cu `sizeof`.', { topic: 'arrays', difficulty: 'MEDIUM' }),
  mc('Tablou 2D', 'Cum declari o matrice 3x4 de int?', ['int m[3][4];', 'int m[3, 4];', 'int[3][4] m;', 'matrix m(3, 4);'], 'int m[3][4];', 'Sintaxa: `tip nume[rows][cols];`.', { topic: 'arrays' }),
  sa('Acces 2D', 'Cum accesezi elementul de pe linia 1, coloana 2 din matricea `m`?', 'm[1][2]', 'Folosești paranteze drepte separate pentru fiecare dimensiune.', { topic: 'arrays' }),
]

const stringuriQuiz = [
  mc('strcpy', 'Ce face `strcpy(a, b)` ?', ['Compară a și b', 'Copiază b în a', 'Concatenează', 'Returnează lungimea'], 'Copiază b în a', '`strcpy` copiază string-ul `b` în buffer-ul `a` (atenție la spațiu!).', { topic: 'string' }),
  mc('Concatenare', 'Care funcție concatenează două stringuri?', ['strcat', 'strappend', 'strjoin', 'concat'], 'strcat', '`strcat(dest, src)` adaugă `src` la finalul lui `dest`.', { topic: 'string' }),
  sa('Lungime "Salut"', 'Cât returnează `strlen("Salut")`?', '5', '`strlen` numără caracterele FĂRĂ `\\0` final.', { topic: 'string' }),
]

const pointeriQuiz = [
  mc('Aritmetică pointeri', 'Dacă `int *p` și incrementăm `p++`, cu cât crește adresa?', ['1 octet', 'sizeof(int) octeți (de obicei 4)', '8 octeți', '0 — pointerii sunt imutabili'], 'sizeof(int) octeți (de obicei 4)', 'Aritmetica pointerilor merge în pași de mărimea **tipului** pointat.', { topic: 'pointeri', difficulty: 'MEDIUM' }),
  mc('Pointer la pointer', 'Ce e `int **pp`?', ['Eroare', 'Pointer către un pointer la int', 'Tablou 2D', 'Două variabile'], 'Pointer către un pointer la int', 'Folosit pentru matrice dinamice sau modificarea unui pointer dintr-o funcție.', { topic: 'pointeri', difficulty: 'MEDIUM' }),
  sa('Dereferențiere', 'Cum obții valoarea din adresa stocată în pointer-ul `p`?', '*p', '`*p` este dereferențierea — îți dă valoarea de la adresa p.', { topic: 'pointeri' }),
]

const structuriQuiz = [
  mc('Mărimea struct', 'Care funcție/operator returnează dimensiunea unui struct?', ['size()', 'len()', 'sizeof', 'count'], 'sizeof', '`sizeof(struct X)` sau `sizeof(p)` — atenție la padding!', { topic: 'struct' }),
  mc('Struct vs Class', 'Diferența majoră struct C vs class C++?', ['Niciuna', 'Struct C nu are metode/private', 'Struct e mai rapid', 'Struct e doar pentru numere'], 'Struct C nu are metode/private', 'În C, struct grupează doar **date**. C++ adaugă metode + control acces.', { topic: 'struct', difficulty: 'MEDIUM' }),
  mc('Struct anonim cu typedef', 'De ce folosim `typedef struct { ... } Nume;`?', ['Pentru viteză', 'Pentru a folosi `Nume` fără cuvântul `struct`', 'Pentru a o face publică', 'Nu e legal'], 'Pentru a folosi `Nume` fără cuvântul `struct`', 'Fără typedef trebuie scris `struct Nume p;` peste tot.', { topic: 'struct', difficulty: 'MEDIUM' }),
]

const memorieDinamicaQuiz = [
  mc('calloc vs malloc', 'Care e diferența între `calloc` și `malloc`?', ['Niciuna', 'calloc inițializează memoria cu 0', 'malloc e mai nou', 'calloc nu necesită free'], 'calloc inițializează memoria cu 0', '`calloc(n, size)` zeroizează; `malloc(n*size)` lasă memoria "murdară".', { topic: 'memorie', difficulty: 'MEDIUM' }),
  mc('Double free', 'Ce se întâmplă dacă apelezi `free(p)` de două ori?', ['Eliberează mai multă memorie', 'Comportament nedefinit / crash', 'Returnează NULL', 'Nu face nimic'], 'Comportament nedefinit / crash', 'Dublu-free este un bug grav. Pune `p = NULL;` după free.', { topic: 'memorie', difficulty: 'MEDIUM' }),
  mc('Stack vs heap', 'Variabilele locale obișnuite sunt alocate pe:', ['Heap', 'Stack', 'Disk', 'Cache'], 'Stack', 'Variabilele locale → stack (rapid, automat). `malloc` → heap (manual).', { topic: 'memorie', difficulty: 'MEDIUM' }),
  sa('Realocare', 'Care funcție redimensionează un bloc de memorie alocat?', 'realloc', '`realloc(p, n)` returnează un nou pointer cu dimensiune `n`.', { topic: 'memorie' }),
]

export const cQuizPack = {
  appendProblems: {
    'introducere-printf': introducerePrintfQuiz,
    'variabile-tipuri': variabileTipuriQuiz,
    'scanf-input': scanfInputQuiz,
    'operatori-expresii': operatoriExpresiiQuiz,
    'conditii': conditiiQuiz,
    'bucle': bucleQuiz,
    'functii': functiiQuiz,
    'tablouri': tablouriQuiz,
    'stringuri': stringuriQuiz,
    'pointeri': pointeriQuiz,
    'structuri': structuriQuiz,
    'memorie-dinamica': memorieDinamicaQuiz,
  },
}
