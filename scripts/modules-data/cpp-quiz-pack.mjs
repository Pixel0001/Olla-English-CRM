// Quiz pack pentru C++ — adaugă MC/SA suplimentare la fiecare lecție.

import { mc, sa } from './helpers.mjs'

const introducereCoutQuiz = [
  mc('Compilator C++', 'Care e cel mai folosit compilator C++ open-source?', ['javac', 'g++', 'clang', 'cl.exe'], 'g++', 'g++ (parte din GCC) este standard pe Linux/Mac. clang++ și MSVC sunt și ele populare.', { topic: 'tools' }),
  mc('Extensie fișier', 'Care extensie e standard pentru un fișier sursă C++?', ['.c', '.cpp', '.hpp', '.cc'], '.cpp', '`.cpp` (sau `.cc`, `.cxx`) — toate sunt acceptate.', { topic: 'tools' }),
  sa('Comentariu', 'Ce simbol începe un comentariu pe o singură linie? (2 caractere)', '//', '`//` — la fel ca în C99 și mai noi.', { topic: 'syntax' }),
  mc('Mai multe valori în cout', 'Cum afișezi `a` urmat de `b` în cout?', ['cout << a, b;', 'cout << a << b;', 'cout(a, b);', 'cout.print(a, b);'], 'cout << a << b;', 'Înlănțuiești operatorii `<<`.', { topic: 'cout' }),
]

const variabileTipuriQuiz = [
  mc('Inițializare uniformă', 'Ce e `int x{5};` ?', ['Eroare', 'Inițializare uniformă (C++11)', 'Tablou', 'Lambda'], 'Inițializare uniformă (C++11)', 'Sintaxa cu acolade — împiedică conversii implicite cu pierdere.', { topic: 'tipuri', difficulty: 'MEDIUM' }),
  mc('nullptr', 'În C++ modern, ce folosim în loc de NULL?', ['0', 'NULL', 'nullptr', 'void'], 'nullptr', '`nullptr` are tip propriu (nullptr_t), evită ambiguități.', { topic: 'tipuri', difficulty: 'MEDIUM' }),
  sa('Tip pentru text', 'Care tip recomandat din STL e folosit pentru text?', 'std::string', 'Sau doar `string` cu `using namespace std`.', { topic: 'string' }),
]

const cinInputQuiz = [
  mc('Newline rămas', 'După `cin >> n`, ce rămâne în buffer?', ['Nimic', 'Caracterul newline (\\n)', 'Tot input-ul', 'Spațiile'], 'Caracterul newline (\\n)', 'De aceea `getline` imediat după `>>` poate eșua — folosește `cin.ignore()`.', { topic: 'cin', difficulty: 'MEDIUM' }),
  mc('Curățare buffer', 'Care metodă "ignoră" caractere din buffer?', ['cin.skip()', 'cin.ignore()', 'cin.flush()', 'cin.clear()'], 'cin.ignore()', '`cin.ignore(n, c)` ignoră până la n caractere sau până la `c`.', { topic: 'cin', difficulty: 'MEDIUM' }),
  sa('Citire string cu spații', 'Care funcție citește o linie întreagă într-un string s? (apelul complet cu cin)', 'getline(cin, s)', '`getline(cin, s)` citește până la `\\n`.', { topic: 'cin' }),
]

const conditiiBucleQuiz = [
  mc('range-based for cu auto', 'Care e cel mai concis range-based for?', ['for (int x : v)', 'for (auto x : v)', 'for x in v', 'for x of v'], 'for (auto x : v)', '`auto` deduce tipul din container.', { topic: 'for' }),
  mc('Modificare fără copie', 'Ce face `for (const auto& x : v)`?', ['Copiază', 'Referință read-only (eficient)', 'Pointer', 'Eroare'], 'Referință read-only (eficient)', 'Const reference = fără copie + nu poate modifica.', { topic: 'for', difficulty: 'MEDIUM' }),
  sa('Ternar', 'Care e operatorul ternar (3 caractere de bază)?', '?:', '`condiție ? a : b` — la fel ca C.', { topic: 'operatori' }),
]

const functiiCppQuiz = [
  mc('Returnare prin referință', 'Ce e `int& f()`?', ['Eroare', 'Funcție care returnează o referință la int', 'Funcție inline', 'Pointer la int'], 'Funcție care returnează o referință la int', 'Returnezi o referință la o variabilă (atenție la lifetime!).', { topic: 'functii', difficulty: 'MEDIUM' }),
  mc('inline', 'Ce face `inline` la o funcție?', ['O face statică', 'Sugerează compilatorului inlining (evită apel)', 'O face virtuală', 'O face constantă'], 'Sugerează compilatorului inlining (evită apel)', 'Util la funcții mici, definite în headere.', { topic: 'functii', difficulty: 'MEDIUM' }),
  mc('Diferență referință vs pointer', 'Ce e adevărat pentru referințe?', ['Pot fi NULL', 'Trebuie inițializate la declarare și nu pot fi reasignate', 'Sunt mai lente', 'Necesită delete'], 'Trebuie inițializate la declarare și nu pot fi reasignate', 'Referințele sunt aliasuri permanente.', { topic: 'referinte', difficulty: 'MEDIUM' }),
]

const vectorStringQuiz = [
  mc('Acces la element', 'Diferența între `v[i]` și `v.at(i)`?', ['Niciuna', 'at() verifică limitele și aruncă excepție', 'at() e mai rapid', '[] returnează pointer'], 'at() verifică limitele și aruncă excepție', '`v.at(i)` aruncă `std::out_of_range` dacă indexul e invalid.', { topic: 'vector', difficulty: 'MEDIUM' }),
  mc('Iteratori', 'Ce returnează `v.begin()`?', ['Primul element', 'Iterator la primul element', 'Index 0', 'Pointer la mărime'], 'Iterator la primul element', 'Iteratorii sunt o abstracție peste pointeri.', { topic: 'vector', difficulty: 'MEDIUM' }),
  sa('Goliciune', 'Care metodă verifică dacă un vector e gol?', 'empty()', '`v.empty()` returnează bool.', { topic: 'vector' }),
]

const claseObiecteQuiz = [
  mc('this', 'Ce e `this` într-o metodă?', ['Variabilă globală', 'Pointer la obiectul curent', 'Numele clasei', 'Referință la bază'], 'Pointer la obiectul curent', '`this` e un pointer (nu referință) la obiect — `this->x` accesează membri.', { topic: 'class', difficulty: 'MEDIUM' }),
  mc('Constructor implicit', 'Ce e un constructor "default"?', ['Cu un singur parametru', 'Fără parametri', 'Care returnează void', 'Care apelează părinte'], 'Fără parametri', 'Compilatorul îl generează dacă nu definești niciunul.', { topic: 'constructor' }),
  mc('Inițializare în listă', 'De ce e mai eficient `MyClass(int x) : a(x) {}` decât `MyClass(int x) { a = x; }`?', ['E identic', 'Lista de inițializare evită apelul constructorului default + asignare', 'Lista e mai scurtă', 'Lista e obligatorie'], 'Lista de inițializare evită apelul constructorului default + asignare', 'În corpul constructorului, membrii sunt deja construiți (apoi reasignați).', { topic: 'constructor', difficulty: 'MEDIUM' }),
]

const mostenireQuiz = [
  mc('Moștenire multiplă', 'C++ permite moștenire din mai multe clase?', ['Nu', 'Da, dar atenție la "diamond problem"', 'Doar prin interfețe', 'Doar 2 clase'], 'Da, dar atenție la "diamond problem"', 'C++ permite, dar trebuie folosită cu grijă (virtual inheritance).', { topic: 'mostenire', difficulty: 'MEDIUM' }),
  mc('Acces moștenit', 'Membrii `private` din bază sunt accesibili în clasa derivată?', ['Da', 'Nu', 'Doar dacă moștenire publică', 'Doar prin getters'], 'Nu', '`private` rămâne accesibil doar în clasa care le-a definit.', { topic: 'mostenire', difficulty: 'MEDIUM' }),
  sa('Cuvânt cheie suprascriere', 'Care cuvânt cheie modern (C++11) marchează explicit suprascrierea unei metode virtuale?', 'override', '`void f() override;` — compilatorul verifică.', { topic: 'mostenire' }),
]

const polimorfismQuiz = [
  mc('Apel non-virtual', 'Dacă metoda nu e `virtual`, ce face `forma->arie()` pe pointer la bază?', ['Apelează versiunea derivată', 'Apelează versiunea bazei (statică)', 'Eroare', 'Crash'], 'Apelează versiunea bazei (statică)', 'Fără `virtual`, dispatch-ul e static (la compilare).', { topic: 'polimorfism', difficulty: 'MEDIUM' }),
  mc('Clasă abstractă', 'Care e o caracteristică a clasei abstracte?', ['Nu poate fi instanțiată', 'Nu are constructor', 'Nu are membri', 'E mai rapidă'], 'Nu poate fi instanțiată', 'Are cel puțin o metodă pură (`= 0`).', { topic: 'polimorfism' }),
  sa('Down-casting sigur', 'Care cast verifică la runtime tipul real al obiectului? (numele complet)', 'dynamic_cast', '`dynamic_cast<Derivat*>(p)` returnează nullptr dacă tipul nu se potrivește.', { topic: 'polimorfism', difficulty: 'MEDIUM' }),
]

const templateUriQuiz = [
  mc('Specializare', 'Putem specializa un template pentru un tip anume?', ['Nu', 'Da, prin "template specialization"', 'Doar pentru int', 'Doar la clase'], 'Da, prin "template specialization"', '`template<> class Cutie<bool> { ... };` definește comportament special.', { topic: 'templates', difficulty: 'MEDIUM' }),
  mc('Eroare template', 'Când apare o eroare template?', ['La parsing', 'La instanțiere (când e folosit)', 'Niciodată', 'La link'], 'La instanțiere (când e folosit)', 'De aceea erorile sunt deseori lungi și criptice.', { topic: 'templates', difficulty: 'MEDIUM' }),
  sa('Numerice template', 'Pe lângă tipuri, template-urile pot accepta și valori. Cum o numim? (eng., 2 cuvinte)', 'non-type parameter', '`template<int N>` — parametru de tip non-type.', { topic: 'templates', difficulty: 'MEDIUM' }),
]

const stlQuiz = [
  mc('Iteratori begin/end', 'Ce înseamnă convenția `[begin, end)`?', ['Inclusiv ambele', 'Exclusiv ambele', 'Inclusiv begin, exclusiv end', 'Inclusiv end, exclusiv begin'], 'Inclusiv begin, exclusiv end', 'Half-open range — `end` pointează după ultimul element.', { topic: 'stl', difficulty: 'MEDIUM' }),
  mc('Sortare descrescător', 'Cum sortezi descrescător cu sort?', ['sort(v.begin(), v.end(), greater<>())', 'sort(v.end(), v.begin())', 'reverse_sort(v)', 'sort(v, DESC)'], 'sort(v.begin(), v.end(), greater<>())', '`std::greater<>()` e un functor de comparare descrescătoare.', { topic: 'stl', difficulty: 'MEDIUM' }),
  mc('count vs find', 'Care e diferența?', ['Niciuna', 'count returnează număr de apariții, find returnează iterator', 'find e mai rapid', 'count nu există'], 'count returnează număr de apariții, find returnează iterator', 'Ambele sunt în `<algorithm>`.', { topic: 'stl', difficulty: 'MEDIUM' }),
  sa('Inversează vector', 'Care funcție din `<algorithm>` inversează un vector? (numele funcției fără paranteze)', 'reverse', '`reverse(v.begin(), v.end())` modifică vectorul in-place.', { topic: 'stl' }),
]

const smartPointersQuiz = [
  mc('weak_ptr scop', 'La ce folosește `weak_ptr`?', ['Pointer rapid', 'Observator slab care nu împiedică distrugerea', 'Pointer la stack', 'Pointer privat'], 'Observator slab care nu împiedică distrugerea', 'Util pentru a sparge cicluri shared_ptr.', { topic: 'memorie', difficulty: 'MEDIUM' }),
  mc('Cost shared_ptr', 'Ce overhead are shared_ptr?', ['Niciunul', 'Reference count + alocare control block', 'Dublă alocare mereu', 'GC'], 'Reference count + alocare control block', 'Folosește unique_ptr când nu ai nevoie de partajare.', { topic: 'memorie', difficulty: 'MEDIUM' }),
  mc('move semantics', 'Ce face `std::move(p)` la un `unique_ptr`?', ['Copiază', 'Transferă proprietatea (sursa devine null)', 'Distruge', 'Nimic'], 'Transferă proprietatea (sursa devine null)', 'Move e obligatoriu pentru tipuri non-copiable.', { topic: 'memorie', difficulty: 'MEDIUM' }),
  sa('Funcția pentru shared_ptr', 'Care funcție recomandată creează un `shared_ptr<int>` cu valoarea 5? (numele fără paranteze)', 'make_shared', '`make_shared<int>(5)` — alocă obiect + control block într-o singură alocare.', { topic: 'memorie' }),
]

export const cppQuizPack = {
  appendProblems: {
    'introducere-cout': introducereCoutQuiz,
    'variabile-tipuri': variabileTipuriQuiz,
    'cin-input': cinInputQuiz,
    'conditii-bucle': conditiiBucleQuiz,
    'functii-cpp': functiiCppQuiz,
    'vector-string': vectorStringQuiz,
    'clase-obiecte': claseObiecteQuiz,
    'mostenire': mostenireQuiz,
    'polimorfism': polimorfismQuiz,
    'template-uri': templateUriQuiz,
    'stl': stlQuiz,
    'smart-pointers': smartPointersQuiz,
  },
}
