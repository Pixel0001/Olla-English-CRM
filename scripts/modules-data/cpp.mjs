import { mc, sa } from './helpers.mjs'

// C++ — extinde C cu OOP, template-uri, STL
// 12 lecții complete
export const cppModule = {
  slug: 'programare-cpp',
  title: 'Programare C++',
  description:
    'Învață C++ — limbajul folosit în jocuri, motoare grafice și performanță maximă. 12 lecții despre OOP, STL și template-uri.',
  language: 'cpp',
  order: 6,
  lessons: [
    // ============ LECȚIA 1 ============
    {
      slug: 'introducere-cout',
      title: '1. Introducere + cout',
      isFree: true,
      theory: `# Bun venit în C++!

C++ este o **extensie** a limbajului C, care adaugă **programare orientată pe obiecte (OOP)**, template-uri și o bibliotecă standard puternică (**STL**).

## De ce C++?
- **Jocuri video** — Unreal Engine, Unity (parțial)
- **Browsere** — Chrome, Firefox
- **Sisteme de operare** — părți din Windows, macOS
- **Aplicații high-performance** — baze de date, finance, AI

## Primul program
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Salut, lume!" << endl;
    return 0;
}
\`\`\`

## Explicații
- \`#include <iostream>\` — biblioteca pentru intrare/ieșire
- \`using namespace std;\` — evită prefixarea cu \`std::\`
- \`cout\` — stream-ul standard de output
- \`<<\` — operator de **inserție** (trimite valori spre stream)
- \`endl\` — linie nouă + flush

## Fără using namespace
\`\`\`cpp
std::cout << "Hello" << std::endl;
\`\`\`
`,
      problems: [
        mc('Stream output', 'Care obiect se folosește pentru afișare în C++?', ['print', 'cout', 'console', 'output'], 'cout', '`cout` (console out) este stream-ul standard de output.', { topic: 'cout' }),
        mc('Operator inserție', 'Ce operator trimite valori în cout?', ['>>', '<<', '->', '|'], '<<', '`<<` (inserție) trimite valori în stream-ul de output.', { topic: 'cout' }),
        sa('Header iostream', 'Ce header trebuie inclus pentru `cout` și `cin`?', '#include <iostream>', '`<iostream>` conține `cin`, `cout`, `cerr`.', { topic: 'preprocessor' }),
        mc('Linie nouă', 'Care e modul "C++ idiomatic" pentru linie nouă?', ['\\n', 'endl', 'newline', '<br>'], 'endl', '`endl` adaugă `\\n` și face flush la buffer (`\\n` doar adaugă newline).', { topic: 'cout', difficulty: 'MEDIUM' }),
        mc('Fără using namespace std', 'Cum afișezi "Hi" fără `using namespace std;`?', ['cout << "Hi";', 'std::cout << "Hi";', 'std.cout("Hi");', 'std->cout << "Hi";'], 'std::cout << "Hi";', '`std::` este namespace-ul standard.', { topic: 'namespace' }),
        sa('Punctul de intrare', 'Cum se numește funcția cu care începe orice program C++?', 'main', '`int main()` — la fel ca în C.', { topic: 'main' }),
      ],
    },

    // ============ LECȚIA 2 ============
    {
      slug: 'variabile-tipuri',
      title: '2. Variabile, tipuri și auto',
      isFree: true,
      theory: `# Variabile în C++

C++ păstrează toate tipurile din C și adaugă altele noi.

\`\`\`cpp
int n = 42;
double pi = 3.14;
char c = 'A';
bool ok = true;        // bool nativ în C++
string nume = "Ana";   // string OBIECT, nu char[]
\`\`\`

## ⚠️ Pentru \`string\`:
\`\`\`cpp
#include <string>
\`\`\`

## auto — tipul dedus
Compilatorul deduce tipul:
\`\`\`cpp
auto n = 42;       // int
auto pi = 3.14;    // double
auto s = "Salut";  // const char*
\`\`\`

## Constante
\`\`\`cpp
const int MAX = 100;
constexpr int N = 50;   // evaluat la compilare
\`\`\`

## Inițializare uniformă (C++11)
\`\`\`cpp
int x{5};
double y{3.14};
string s{"Hello"};
\`\`\`

## string vs char[]
În C++ folosește **\`std::string\`** — dimensiune dinamică, operatori comozi:
\`\`\`cpp
string a = "Salut";
string b = " lume";
string c = a + b;        // concatenare!
cout << c.length();      // 10
\`\`\`
`,
      problems: [
        mc('Tip pentru string în C++', 'Care e tipul recomandat pentru text în C++?', ['char[]', 'string', 'String', 'text'], 'string', '`std::string` din `<string>` — flexibil, sigur, cu metode utile.', { topic: 'tipuri' }),
        mc('auto', 'Ce face cuvântul cheie `auto` în C++ modern?', ['Variabilă globală', 'Compilatorul deduce tipul', 'Variabilă atomică', 'Auto-incrementare'], 'Compilatorul deduce tipul', '`auto x = 5;` → x este int. Util pentru tipuri lungi.', { topic: 'auto' }),
        sa('Header string', 'Ce header trebuie inclus pentru `std::string`?', '#include <string>', '`<string>` definește `std::string`.', { topic: 'string' }),
        mc('Concatenare string', 'Cum concatenezi două `string` în C++?', ['strcat(a, b)', 'a + b', 'a.concat(b)', 'a.append(b) DOAR'], 'a + b', 'Operator `+` e suprasarcinat pentru string.', { topic: 'string', difficulty: 'MEDIUM' }),
        mc('constexpr vs const', 'Diferența între `const` și `constexpr`?', ['Niciuna', 'constexpr e evaluat la compilare', 'const e doar pentru int', 'constexpr e mai lent'], 'constexpr e evaluat la compilare', '`constexpr` garantează evaluare la compile-time, util pentru optimizări.', { topic: 'const', difficulty: 'MEDIUM' }),
        sa('Lungimea unui string', 'Cum afli lungimea unui `string s`? (apelul complet)', 's.length()', 'Sau `s.size()` — ambele returnează `size_t`.', { topic: 'string' }),
      ],
    },

    // ============ LECȚIA 3 ============
    {
      slug: 'cin-input',
      title: '3. Input cu cin',
      isFree: false,
      theory: `# Citire date cu cin

\`cin\` este stream-ul standard de input. Folosim operatorul **\`>>\`** (extracție) pentru a citi.

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int varsta;
    string nume;

    cout << "Cum te cheamă? ";
    cin >> nume;

    cout << "Câți ani ai? ";
    cin >> varsta;

    cout << "Salut, " << nume << ", ai " << varsta << " ani.\\n";
    return 0;
}
\`\`\`

## ⚠️ cin >> oprește la spațiu
Pentru a citi o **linie întreagă** (cu spații):
\`\`\`cpp
string linie;
getline(cin, linie);
\`\`\`

## Citire mai multe valori
\`\`\`cpp
int a, b, c;
cin >> a >> b >> c;
\`\`\`

## Verificare succes
\`\`\`cpp
if (cin >> n) {
    cout << "Citire OK\\n";
} else {
    cout << "Eroare\\n";
}
\`\`\`
`,
      problems: [
        mc('Operator extracție', 'Ce operator citește din cin?', ['<<', '>>', '->', '<-'], '>>', '`>>` extrage din stream → variabilă.', { topic: 'cin' }),
        mc('Linie întreagă', 'Cum citim o linie cu spații?', ['cin >> s', 'getline(cin, s)', 'scanf("%s", s)', 'cin.read(s)'], 'getline(cin, s)', '`getline` citește până la `\\n`.', { topic: 'cin', difficulty: 'MEDIUM' }),
        mc('cin >> nume', 'Ce citește `cin >> nume` dacă utilizatorul tastează "Ana Maria"?', ['"Ana Maria"', '"Ana"', '"Maria"', 'Eroare'], '"Ana"', '`>>` se oprește la primul whitespace (spațiu/tab/newline).', { topic: 'cin', difficulty: 'MEDIUM' }),
        sa('Citire 2 numere', 'Scrie linia care citește două int-uri `a` și `b` într-un singur cin.', 'cin >> a >> b;', 'Operatorii `>>` se înlănțuiesc.', { topic: 'cin' }),
      ],
    },

    // ============ LECȚIA 4 ============
    {
      slug: 'conditii-bucle',
      title: '4. Condiții și bucle (range-based for)',
      isFree: false,
      theory: `# Condiții și bucle în C++

Sintaxa pentru \`if\`, \`switch\`, \`for\`, \`while\` este **identică** cu C. C++ adaugă:

## range-based for (C++11) — buclă "pentru fiecare"
\`\`\`cpp
#include <vector>
vector<int> v = {1, 2, 3, 4, 5};

for (int x : v) {
    cout << x << " ";
}
\`\`\`

## Cu auto + referință
\`\`\`cpp
for (auto& x : v) {   // & = referință → poți modifica
    x *= 2;
}
\`\`\`

## Structured bindings (C++17)
\`\`\`cpp
map<string, int> m = {{"Ana", 12}, {"Ion", 14}};
for (auto& [nume, varsta] : m) {
    cout << nume << ": " << varsta << "\\n";
}
\`\`\`

## bool nativ
\`\`\`cpp
bool ok = (n > 0);
if (ok) { ... }
\`\`\`
`,
      problems: [
        mc('Range-based for', 'Care e sintaxa range-based for în C++?', ['for (x in v)', 'for (int x : v)', 'foreach (x in v)', 'for x of v'], 'for (int x : v)', 'Sintaxa: `for (tip variabilă : container)`.', { topic: 'for' }),
        mc('Modificare prin range for', 'Cum modifici elementele din vector în range-based for?', ['for (auto x : v)', 'for (auto& x : v)', 'for (const auto& x : v)', 'for (auto* x : v)'], 'for (auto& x : v)', '`&` = referință, permite modificarea elementului original.', { topic: 'for', difficulty: 'MEDIUM' }),
        sa('Bool', 'Care tip reprezintă adevărat/fals nativ în C++?', 'bool', '`bool` cu valori `true` și `false`.', { topic: 'tipuri' }),
        mc('switch-case', 'Pe ce tipuri funcționează `switch` în C++?', ['Doar string', 'Tipuri întregi (int, char, enum)', 'Orice tip', 'Doar double'], 'Tipuri întregi (int, char, enum)', 'La fel ca în C — doar pe valori întregi.', { topic: 'switch' }),
      ],
    },

    // ============ LECȚIA 5 ============
    {
      slug: 'functii-cpp',
      title: '5. Funcții — supraîncărcare, referințe, default',
      isFree: false,
      theory: `# Funcții în C++

## Sintaxă de bază — la fel ca C
\`\`\`cpp
int suma(int a, int b) {
    return a + b;
}
\`\`\`

## Parametri impliciți (default)
\`\`\`cpp
void salut(string nume = "lume") {
    cout << "Salut, " << nume << "!\\n";
}

salut();          // "Salut, lume!"
salut("Ana");     // "Salut, Ana!"
\`\`\`

## Supraîncărcare (overloading)
Mai multe funcții cu **același nume**, diferite tipuri/numere de parametri:
\`\`\`cpp
int suma(int a, int b) { return a + b; }
double suma(double a, double b) { return a + b; }
int suma(int a, int b, int c) { return a + b + c; }
\`\`\`

## Pass by reference (\`&\`)
\`\`\`cpp
void dubleaza(int& n) {   // referință
    n = n * 2;
}

int x = 5;
dubleaza(x);
cout << x;   // 10
\`\`\`

## const reference — eficient + read-only
\`\`\`cpp
void afiseaza(const string& s) {
    cout << s;
}
\`\`\`
Folosit pentru obiecte mari — **fără copie**, dar nu pot fi modificate.
`,
      problems: [
        mc('Overloading', 'Ce înseamnă supraîncărcarea funcțiilor?', ['Funcții recursive', 'Mai multe funcții cu același nume', 'Funcții fără return', 'Funcții constante'], 'Mai multe funcții cu același nume', 'Diferă prin numărul/tipul parametrilor.', { topic: 'overloading' }),
        mc('Pass by reference', 'Care e sintaxa pentru parametru "prin referință"?', ['void f(int n)', 'void f(int& n)', 'void f(int* n)', 'void f(&int n)'], 'void f(int& n)', '`&` după tip = referință.', { topic: 'referinte', difficulty: 'MEDIUM' }),
        mc('const reference', 'De ce folosim `const string&` ca parametru?', ['Mai rapid + nu modifică originalul', 'E obligatoriu', 'Pentru stringuri scurte', 'Permite modificarea'], 'Mai rapid + nu modifică originalul', 'Evită copia (eficient) + garantează că funcția nu modifică argumentul.', { topic: 'referinte', difficulty: 'MEDIUM' }),
        sa('Parametru implicit', 'Adaugă un parametru implicit `int n = 10`. Scrie semnătura completă a unei funcții void `f` cu un singur astfel de parametru.', 'void f(int n = 10)', 'Valoarea default se specifică în declarație.', { topic: 'functii' }),
      ],
    },

    // ============ LECȚIA 6 ============
    {
      slug: 'vector-string',
      title: '6. std::vector și std::string',
      isFree: false,
      theory: `# Containere STL — vector și string

## std::vector — tablou dinamic
\`\`\`cpp
#include <vector>
vector<int> v;          // gol
v.push_back(10);        // adaugă la final
v.push_back(20);
v.push_back(30);

cout << v[0];           // 10
cout << v.size();       // 3
\`\`\`

## Inițializare
\`\`\`cpp
vector<int> a = {1, 2, 3, 4, 5};
vector<int> b(10, 0);   // 10 elemente, toate 0
\`\`\`

## Operații utile
\`\`\`cpp
v.size()         // câte elemente
v.empty()        // bool: e gol?
v.push_back(x)   // adaugă la final
v.pop_back()     // elimină ultimul
v.front()        // primul
v.back()         // ultimul
v.clear()        // șterge tot
\`\`\`

## Parcurgere
\`\`\`cpp
for (int i = 0; i < v.size(); i++) cout << v[i];
for (int x : v) cout << x;          // mai elegant
\`\`\`

## std::string — flexibil
\`\`\`cpp
string s = "Hello";
s += " World";                  // concatenare
s.length()                      // 11
s.substr(0, 5)                  // "Hello"
s.find("World")                 // 6
\`\`\`
`,
      problems: [
        mc('Adăugare în vector', 'Care metodă adaugă un element la finalul unui vector?', ['add()', 'push_back()', 'append()', 'insert()'], 'push_back()', '`v.push_back(x)` adaugă x la final, redimensionând automat.', { topic: 'vector' }),
        mc('Mărimea vectorului', 'Care metodă returnează numărul de elemente?', ['length()', 'size()', 'count()', 'len()'], 'size()', '`v.size()` — funcționează pe toate containerele STL.', { topic: 'vector' }),
        mc('Vector inițializare', 'Cum creezi un vector cu 5 elemente, toate 0?', ['vector<int> v(5);', 'vector<int> v(5, 0);', 'vector<int> v[5]={0};', 'vector<int> v = 5;'], 'vector<int> v(5, 0);', 'Constructor: `vector<T>(n, valoare)` — n copii ale valorii.', { topic: 'vector', difficulty: 'MEDIUM' }),
        sa('Header vector', 'Ce header trebuie inclus pentru `std::vector`?', '#include <vector>', '`<vector>` definește `std::vector<T>`.', { topic: 'vector' }),
        mc('Substring', 'Care metodă extrage o subsecvență dintr-un string?', ['slice()', 'substring()', 'substr()', 'cut()'], 'substr()', '`s.substr(start, length)` returnează un nou string.', { topic: 'string' }),
        mc('Caută în string', 'Ce returnează `s.find("xyz")` dacă "xyz" NU apare?', ['-1', '0', 'string::npos', 'NULL'], 'string::npos', '`string::npos` este o constantă specială (de obicei size_t maxim).', { topic: 'string', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 7 ============
    {
      slug: 'clase-obiecte',
      title: '7. Clase și obiecte',
      isFree: false,
      theory: `# Clase în C++ — OOP

O **clasă** este un șablon pentru obiecte. Combină **date** (atribute) cu **funcții** (metode).

\`\`\`cpp
class Persoana {
private:
    string nume;
    int varsta;

public:
    // Constructor
    Persoana(string n, int v) {
        nume = n;
        varsta = v;
    }

    // Metodă
    void afiseaza() {
        cout << nume << ", " << varsta << " ani\\n";
    }

    // Getter
    string getNume() { return nume; }
};

int main() {
    Persoana p("Ana", 12);
    p.afiseaza();
    cout << p.getNume();
    return 0;
}
\`\`\`

## Modificatori de acces
- **private** — accesibile doar din clasă (default)
- **public** — accesibile din afară
- **protected** — accesibile în clasă + clase derivate

## Constructor cu lista de inițializare (mai eficient)
\`\`\`cpp
Persoana(string n, int v) : nume(n), varsta(v) {}
\`\`\`

## Destructor — apelat la distrugerea obiectului
\`\`\`cpp
~Persoana() {
    cout << "Adio " << nume << "\\n";
}
\`\`\`
`,
      problems: [
        mc('Cuvânt cheie clasă', 'Care cuvânt cheie definește o clasă în C++?', ['struct', 'class', 'object', 'type'], 'class', '`class Nume { ... };` (atenție la `;` final).', { topic: 'class' }),
        mc('Membru privat', 'Care modificator de acces e implicit într-o `class`?', ['public', 'private', 'protected', 'internal'], 'private', 'În `class`, membrii sunt **privați** implicit. În `struct` sunt publici.', { topic: 'class', difficulty: 'MEDIUM' }),
        mc('Constructor', 'Cum se numește metoda specială apelată la creare?', ['init', 'create', 'constructor (același nume cu clasa)', 'new'], 'constructor (același nume cu clasa)', 'Constructorul are exact numele clasei și nu are tip de return.', { topic: 'constructor' }),
        sa('Destructor sintaxă', 'Care simbol prefixează numele unui destructor în C++? (1 caracter)', '~', '`~Nume()` definește destructorul.', { topic: 'destructor' }),
        mc('Acces metodă', 'Cum apelezi metoda `f` a obiectului `p`?', ['p::f()', 'p.f()', 'p->f()', 'f(p)'], 'p.f()', '`.` pentru obiect; `->` pentru pointer la obiect.', { topic: 'class' }),
        mc('struct vs class', 'Diferența principală în C++?', ['Niciuna', 'struct e public default, class e private default', 'class e mai rapidă', 'struct nu are metode'], 'struct e public default, class e private default', 'Tehnic, sunt aproape identice — doar accesul implicit diferă.', { topic: 'class', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 8 ============
    {
      slug: 'mostenire',
      title: '8. Moștenire (Inheritance)',
      isFree: false,
      theory: `# Moștenire în C++

O clasă poate **moșteni** atribute și metode dintr-o altă clasă.

\`\`\`cpp
class Animal {
public:
    string nume;
    void mananca() { cout << nume << " mănâncă\\n"; }
};

class Caine : public Animal {
public:
    void latra() { cout << nume << " latră: Hau!\\n"; }
};

int main() {
    Caine c;
    c.nume = "Rex";
    c.mananca();   // moștenită
    c.latra();     // proprie
    return 0;
}
\`\`\`

## Tipuri de moștenire
- \`public\` — interfață "is-a"
- \`protected\` — rar folosit
- \`private\` — implementare ascunsă

## Apelarea constructorului bazei
\`\`\`cpp
class Caine : public Animal {
public:
    Caine(string n) : Animal(n) {}
};
\`\`\`

## override — suprascriere metodă
\`\`\`cpp
class Animal {
public:
    virtual void sunet() { cout << "Sunet generic\\n"; }
};

class Caine : public Animal {
public:
    void sunet() override { cout << "Hau!\\n"; }
};
\`\`\`

\`virtual\` permite **polimorfism** (subiect următor).
`,
      problems: [
        mc('Sintaxă moștenire', 'Cum moștenește `Caine` din `Animal` (public)?', ['class Caine extends Animal', 'class Caine : public Animal', 'class Caine inherits Animal', 'class Caine << Animal'], 'class Caine : public Animal', 'Sintaxa: `class Derivată : public Bază`.', { topic: 'mostenire' }),
        mc('Apel constructor bază', 'Cum apelăm constructorul clasei părinte?', ['super(n)', 'parent::init(n)', 'lista de inițializare: : Animal(n)', 'Bază.constructor(n)'], 'lista de inițializare: : Animal(n)', 'Lista de inițializare apelează constructorul bazei.', { topic: 'mostenire', difficulty: 'MEDIUM' }),
        mc('override', 'La ce folosește cuvântul `override` (C++11)?', ['Face metoda mai rapidă', 'Indică explicit suprascrierea unei metode virtuale', 'Face metoda statică', 'O ascunde'], 'Indică explicit suprascrierea unei metode virtuale', 'Compilatorul verifică că metoda chiar suprascrie ceva — protejează de typos.', { topic: 'mostenire', difficulty: 'MEDIUM' }),
        sa('protected', 'Care modificator de acces face membrii vizibili în clasele derivate dar nu în afară?', 'protected', '`protected` = accesibil în clasă + descendenți, dar nu în afară.', { topic: 'access' }),
      ],
    },

    // ============ LECȚIA 9 ============
    {
      slug: 'polimorfism',
      title: '9. Polimorfism și virtual',
      isFree: false,
      theory: `# Polimorfism în C++

**Polimorfismul** = capacitatea de a apela metoda corectă la **runtime**, în funcție de tipul real al obiectului.

\`\`\`cpp
class Forma {
public:
    virtual double arie() { return 0; }
    virtual ~Forma() = default;   // destructor virtual!
};

class Cerc : public Forma {
    double r;
public:
    Cerc(double r) : r(r) {}
    double arie() override { return 3.14 * r * r; }
};

class Patrat : public Forma {
    double l;
public:
    Patrat(double l) : l(l) {}
    double arie() override { return l * l; }
};

void afiseaza(Forma* f) {
    cout << f->arie() << "\\n";   // apelează metoda CORECTĂ
}

int main() {
    Forma* f1 = new Cerc(5);
    Forma* f2 = new Patrat(4);
    afiseaza(f1);   // 78.5
    afiseaza(f2);   // 16
    delete f1; delete f2;
}
\`\`\`

## ⚠️ Fără \`virtual\`, polimorfismul NU funcționează
Fără \`virtual\`, \`f->arie()\` ar apela mereu \`Forma::arie()\`.

## Clase abstracte (pure virtual)
\`\`\`cpp
class Forma {
public:
    virtual double arie() = 0;   // = 0 → metodă pură
};
\`\`\`
\`Forma\` nu mai poate fi instanțiată — doar moștenită.

## Destructor virtual — ESENȚIAL la moștenire
Fără el, \`delete f1\` (cu \`f1\` de tip \`Forma*\`) nu va apela destructorul lui \`Cerc\`.
`,
      problems: [
        mc('Cuvânt cheie pt polimorfism', 'Care cuvânt cheie permite polimorfismul în runtime?', ['static', 'virtual', 'override', 'final'], 'virtual', '`virtual` la metoda din baza permite ca derivata să o suprascrie polimorfic.', { topic: 'polimorfism' }),
        mc('Metodă pură', 'Care e sintaxa pentru o metodă pură (abstractă)?', ['virtual void f();', 'virtual void f() = 0;', 'abstract void f();', 'pure void f();'], 'virtual void f() = 0;', '`= 0` o face **pură** — clasa devine abstractă.', { topic: 'polimorfism', difficulty: 'MEDIUM' }),
        mc('Destructor virtual', 'De ce avem nevoie de destructor virtual la moștenire?', ['Pentru viteză', 'Ca delete pe pointer la bază să cheme destructorul corect', 'Obligatoriu de standard', 'Nu e necesar'], 'Ca delete pe pointer la bază să cheme destructorul corect', 'Fără el → leak de resurse + UB.', { topic: 'polimorfism', difficulty: 'MEDIUM' }),
        sa('Clasă abstractă', 'Cum se numește o clasă care **NU poate fi instanțiată** (are metode pure)?', 'abstractă', 'Clasa abstractă servește doar ca bază pentru moștenire.', { topic: 'polimorfism' }),
        mc('final', 'Ce face cuvântul `final` după o metodă virtuală?', ['O face mai rapidă', 'Împiedică suprascrierea în derivate', 'O șterge', 'O face statică'], 'Împiedică suprascrierea în derivate', '`virtual void f() final;` — derivatele NU mai pot override-ui.', { topic: 'polimorfism', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 10 ============
    {
      slug: 'template-uri',
      title: '10. Template-uri (generic programming)',
      isFree: false,
      theory: `# Template-uri în C++

Template-urile permit scrierea de cod **generic**, care funcționează pentru orice tip.

## Function template
\`\`\`cpp
template <typename T>
T maxim(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << maxim(3, 5);          // T = int
    cout << maxim(2.5, 1.7);      // T = double
    cout << maxim<string>("ab", "ac");  // T = string
}
\`\`\`

## Class template
\`\`\`cpp
template <typename T>
class Cutie {
    T continut;
public:
    Cutie(T x) : continut(x) {}
    T get() { return continut; }
};

Cutie<int> c1(42);
Cutie<string> c2("Hello");
\`\`\`

## Multiple parametri
\`\`\`cpp
template <typename K, typename V>
class Pereche {
    K cheie;
    V valoare;
};
\`\`\`

## De ce template-uri?
- **STL** este construită pe template-uri (\`vector<T>\`, \`map<K,V>\`)
- Cod **reutilizabil** fără pierderi de performanță (zero-cost abstraction)
- Verificare la **compilare**, nu runtime
`,
      problems: [
        mc('Cuvânt template', 'Care cuvânt cheie începe un template?', ['generic', 'template', 'typename', 'using'], 'template', '`template <typename T>` introduce un template.', { topic: 'templates' }),
        mc('typename vs class', 'În `template <typename T>`, putem folosi și:', ['var', 'auto', 'class', 'object'], 'class', '`template <class T>` este echivalent (istoric).', { topic: 'templates', difficulty: 'MEDIUM' }),
        sa('Instanțiere explicită', 'Cum apelezi `maxim` cerând explicit `T = double`? Apelul complet.', 'maxim<double>(a, b)', 'Specifici tipul în paranteze unghiulare.', { topic: 'templates' }),
        mc('STL e bazată pe', 'STL e construită pe:', ['Macros', 'Template-uri', 'Moștenire', 'Pointers'], 'Template-uri', 'Toate containerele și algoritmii STL sunt template-uri.', { topic: 'templates' }),
      ],
    },

    // ============ LECȚIA 11 ============
    {
      slug: 'stl',
      title: '11. STL — map, set, algoritmi',
      isFree: false,
      theory: `# STL — Standard Template Library

## std::map — dicționar (cheie → valoare) sortat
\`\`\`cpp
#include <map>
map<string, int> varste;

varste["Ana"] = 12;
varste["Ion"] = 14;
varste["Maria"] = 11;

cout << varste["Ana"];   // 12
cout << varste.size();   // 3

if (varste.count("Ion")) {
    cout << "există";
}
\`\`\`

## std::set — mulțime fără duplicate
\`\`\`cpp
#include <set>
set<int> nums;
nums.insert(5);
nums.insert(3);
nums.insert(5);   // ignorat (duplicat)

cout << nums.size();   // 2
\`\`\`

## std::unordered_map — hash table (mai rapid în general)
\`\`\`cpp
#include <unordered_map>
unordered_map<string, int> u;
\`\`\`

## Algoritmi din \`<algorithm>\`
\`\`\`cpp
#include <algorithm>
#include <vector>
vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

sort(v.begin(), v.end());          // sortare
reverse(v.begin(), v.end());       // inversare
auto it = find(v.begin(), v.end(), 4);
int s = accumulate(v.begin(), v.end(), 0);   // sumă (din <numeric>)
int m = *max_element(v.begin(), v.end());     // max
\`\`\`

## Lambda — funcție anonimă
\`\`\`cpp
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;   // sortare descrescătoare
});
\`\`\`
`,
      problems: [
        mc('std::map e:', 'Ce structură de date este `std::map`?', ['Tablou', 'Dicționar sortat (cheie → valoare)', 'Listă', 'Mulțime'], 'Dicționar sortat (cheie → valoare)', 'Implementare cu **red-black tree** — operații O(log n).', { topic: 'stl' }),
        mc('Set proprietate', 'Care e proprietatea principală a `std::set`?', ['Permite duplicate', 'Nu permite duplicate', 'Indexat', 'Nu e sortat'], 'Nu permite duplicate', 'Set păstrează doar elemente **unice**, sortate.', { topic: 'stl' }),
        mc('Sortare', 'Care funcție sortează un vector?', ['order()', 'sort()', 'arrange()', 'qsort()'], 'sort()', '`std::sort(begin, end)` — sortare in-place, O(n log n).', { topic: 'stl' }),
        sa('Header pentru sort', 'Ce header trebuie inclus pentru `std::sort`?', '#include <algorithm>', '`<algorithm>` conține sort, find, reverse, etc.', { topic: 'stl' }),
        mc('Lambda', 'Care e sintaxa unei lambda în C++?', ['function(x) { ... }', '[](int x) { ... }', '\\x -> { ... }', 'lambda x: ...'], '[](int x) { ... }', '`[capture](params) { body }` — paranteze pătrate pentru capture list.', { topic: 'lambda', difficulty: 'MEDIUM' }),
        mc('unordered_map vs map', 'Care e diferența?', ['Niciuna', 'unordered_map e hash, map e tree (sortat)', 'map e mai rapid', 'unordered_map nu permite duplicate'], 'unordered_map e hash, map e tree (sortat)', 'unordered_map = O(1) amortizat, dar nesortat. map = O(log n) și sortat.', { topic: 'stl', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 12 ============
    {
      slug: 'smart-pointers',
      title: '12. Smart pointers și RAII',
      isFree: false,
      theory: `# Smart pointers — gestionarea automată a memoriei

În C clasic, \`malloc\`/\`free\` și \`new\`/\`delete\` sunt **manuale** → bug-uri (leak, double-free, dangling).

## RAII — Resource Acquisition Is Initialization
Resursa se ține într-un obiect; destructorul îi dă drumul **automat**.

## std::unique_ptr — proprietate exclusivă
\`\`\`cpp
#include <memory>

unique_ptr<int> p = make_unique<int>(42);
cout << *p;   // 42

// La ieșirea din scope, memoria e eliberată AUTOMAT
\`\`\`

\`unique_ptr\` **nu poate fi copiat** — doar **mutat**:
\`\`\`cpp
unique_ptr<int> p2 = std::move(p);  // p devine null
\`\`\`

## std::shared_ptr — proprietate partajată (reference counting)
\`\`\`cpp
shared_ptr<int> p1 = make_shared<int>(42);
shared_ptr<int> p2 = p1;   // OK — count = 2

cout << p1.use_count();    // 2

// Memoria se eliberează când count == 0
\`\`\`

## std::weak_ptr — observator slab (fără să țină în viață)
Util pentru a sparge **cicluri** cu shared_ptr.

## ⚠️ În C++ modern, evită \`new\` și \`delete\`!
Folosește mereu smart pointers și containere STL.
`,
      problems: [
        mc('unique_ptr', 'Care e caracteristica principală a `unique_ptr`?', ['Permite copiere', 'Are un singur proprietar', 'Reference counting', 'Eliberare manuală'], 'Are un singur proprietar', 'Nu poate fi copiat, doar mutat (`std::move`).', { topic: 'memorie', difficulty: 'MEDIUM' }),
        mc('shared_ptr', 'Cum gestionează `shared_ptr` memoria?', ['Manual', 'Reference counting', 'Mark and sweep', 'Stack-based'], 'Reference counting', 'Numără câți shared_ptr partajează aceeași memorie; eliberează la 0.', { topic: 'memorie', difficulty: 'MEDIUM' }),
        sa('make_unique', 'Care e modul recomandat să creezi un `unique_ptr<int>` cu valoarea 5? (apelul fără tipul de return)', 'make_unique<int>(5)', '`make_unique<T>(args)` (C++14) este safer decât `new`.', { topic: 'memorie' }),
        mc('Header smart pointers', 'Ce header conține smart pointers?', ['<pointer>', '<memory>', '<smart>', '<ptr>'], '<memory>', '`<memory>` definește `unique_ptr`, `shared_ptr`, `weak_ptr`, `make_unique`, `make_shared`.', { topic: 'memorie' }),
        mc('RAII', 'Ce înseamnă RAII?', ['Run And Initialize Immediately', 'Resource Acquisition Is Initialization', 'Random Access Index Iteration', 'Reverse Allocation Internal Identifier'], 'Resource Acquisition Is Initialization', 'Idiomul C++: resursa e legată de durata unui obiect.', { topic: 'raii', difficulty: 'MEDIUM' }),
        mc('Înlocuiește new/delete', 'În C++ modern, ce înlocuiește `new`/`delete`?', ['malloc/free', 'Smart pointers + STL', 'Garbage collector', 'Nimic, încă se folosesc'], 'Smart pointers + STL', 'Best practice: evită gestionarea manuală.', { topic: 'memorie' }),
      ],
    },
  ],
}
