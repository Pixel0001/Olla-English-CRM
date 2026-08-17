// Quiz pack pentru C# — adaugă MC/SA suplimentare la fiecare lecție.

import { mc, sa } from './helpers.mjs'

const introducereConsoleQuiz = [
  mc('Extensie fișier', 'Care e extensia standard a unui fișier sursă C#?', ['.c', '.cs', '.csharp', '.net'], '.cs', 'Toate fișierele C# au extensia `.cs`.', { topic: 'tools' }),
  mc('Platformă', 'C# rulează pe ce platformă principală?', ['JVM', '.NET', 'V8', 'Ruby VM'], '.NET', '.NET (CoreCLR) — cross-platform în versiunile moderne.', { topic: 'tools' }),
  sa('Top-level statements', 'Începând cu ce versiune C# permite cod fără clasa Program și fără Main? (un număr)', '9', 'C# 9 (cu .NET 5+) introduce top-level statements.', { topic: 'main', difficulty: 'MEDIUM' }),
  mc('Comentariu', 'Care simbol începe un comentariu pe o singură linie?', ['#', '//', '--', ';;'], '//', '`//` la fel ca în C/C++/Java.', { topic: 'syntax' }),
]

const variabileTipuriQuiz = [
  mc('Alias bool', 'Pentru ce tip e alias `bool`?', ['System.Boolean', 'System.Bool', 'System.Logic', 'Bool'], 'System.Boolean', '`bool` (lowercase) = alias pentru `System.Boolean`.', { topic: 'tipuri', difficulty: 'MEDIUM' }),
  mc('Suffix decimal', 'Care suffix indică o constantă `decimal`?', ['d', 'm', 'D', 'C'], 'm', '`3.14m` = decimal. `3.14f` = float, `3.14d` sau `3.14` = double.', { topic: 'tipuri', difficulty: 'MEDIUM' }),
  mc('var local', 'În ce context se poate folosi `var`?', ['Câmpuri de clasă', 'Variabile locale cu inițializare', 'Parametri', 'Return type'], 'Variabile locale cu inițializare', '`var` necesită inițializare imediată pentru a deduce tipul.', { topic: 'var', difficulty: 'MEDIUM' }),
  sa('Nullable int', 'Cum declari un int care poate fi null? (sintaxa scurtă)', 'int?', '`int?` = `Nullable<int>` — poate fi `null`.', { topic: 'tipuri', difficulty: 'MEDIUM' }),
]

const inputConversiiQuiz = [
  mc('Convert', 'Care e diferența între `int.Parse` și `Convert.ToInt32`?', ['Niciuna', 'Convert tratează null ca 0', 'Parse e mai rapid', 'Convert nu există'], 'Convert tratează null ca 0', '`int.Parse(null)` aruncă; `Convert.ToInt32(null)` returnează 0.', { topic: 'conversii', difficulty: 'MEDIUM' }),
  mc('TryParse out', 'Care e sintaxa modernă pentru TryParse?', ['int.TryParse(s, n)', 'int.TryParse(s, out int n)', 'int.TryParse(s) → n', 'int.TryParse(s, ref n)'], 'int.TryParse(s, out int n)', '`out int n` declară variabila inline (C# 7+).', { topic: 'conversii' }),
  sa('Cast string→int', 'Cum convertești un string `s` la int folosind metoda Parse? (apelul complet)', 'int.Parse(s)', '`int.Parse(s)` aruncă FormatException dacă s nu e valid.', { topic: 'conversii' }),
]

const conditiiBucleQuiz = [
  mc('switch break', 'În switch clasic C#, ce rol are `break`?', ['Opțional', 'Obligatoriu (fără el → eroare compilare)', 'Doar pentru int', 'Pune în cache'], 'Obligatoriu (fără el → eroare compilare)', 'Spre deosebire de C/C++/Java, C# NU permite fall-through implicit.', { topic: 'switch', difficulty: 'MEDIUM' }),
  mc('Pattern matching', 'Care versiune C# a introdus switch expression?', ['7', '8', '9', '10'], '8', 'C# 8 (.NET Core 3.0+).', { topic: 'switch', difficulty: 'MEDIUM' }),
  sa('Buclă infinită', 'Scrie un `while` infinit (cea mai scurtă formă).', 'while(true)', '`while(true)` rulează la nesfârșit.', { topic: 'while' }),
]

const metodeQuiz = [
  mc('Apel cu nume', 'Cum apelezi metoda `f(int a, int b)` cu numele parametrilor?', ['f(a:1, b:2)', 'f(a=1, b=2)', 'f(1=a, 2=b)', 'Imposibil'], 'f(a:1, b:2)', 'Argumente numite: `nume:valoare`.', { topic: 'metode', difficulty: 'MEDIUM' }),
  mc('Expression-bodied', 'Care e sintaxa unei metode "expression-bodied"?', ['void f() => expr;', 'void f() { expr; }', 'void f() : expr;', 'def f(): expr'], 'void f() => expr;', 'Sintaxa concisă pentru metode dintr-o singură expresie (C# 6+).', { topic: 'metode', difficulty: 'MEDIUM' }),
  sa('Return multiple', 'Care construcție C# 7+ permite returnarea mai multor valori "tip valoare"?', 'tuple', 'Tupluri: `(int, string) f() => (1, "ok");` — apelat ca `var (n, s) = f();`.', { topic: 'metode', difficulty: 'MEDIUM' }),
]

const colectiiQuiz = [
  mc('Inițializare List', 'Cum inițializezi `List<int>` cu valorile 1,2,3?', ['new List<int>(1,2,3)', 'new List<int> { 1, 2, 3 }', 'List<int>(1,2,3)', '[1,2,3]'], 'new List<int> { 1, 2, 3 }', 'Sintaxa de inițializare cu acolade — collection initializer.', { topic: 'list' }),
  mc('Convert array→list', 'Cum convertești un array la List?', ['new List(arr)', 'arr.ToList()', 'List.From(arr)', '(List)arr'], 'arr.ToList()', 'Metodă de extensie LINQ — `using System.Linq;`.', { topic: 'list', difficulty: 'MEDIUM' }),
  sa('Iterare Dictionary', 'Care proprietate dă cheia într-o pereche dintr-un Dictionary, în foreach? (sintaxa completă pentru variabila kv)', 'kv.Key', '`foreach (var kv in dict) { kv.Key, kv.Value }`.', { topic: 'dictionary' }),
]

const claseProperteisQuiz = [
  mc('Object initializer', 'Cum creezi un Persoana cu Nume="Ana", Varsta=12 fără constructor explicit?', ['new Persoana("Ana", 12)', 'new Persoana { Nume = "Ana", Varsta = 12 }', 'new Persoana(Nume:"Ana", Varsta:12)', 'Persoana { "Ana", 12 }'], 'new Persoana { Nume = "Ana", Varsta = 12 }', 'Object initializer — folosește setters publici.', { topic: 'class', difficulty: 'MEDIUM' }),
  mc('Static class', 'Ce caracteristică are o `static class`?', ['Doar metode private', 'Nu poate fi instanțiată; doar membri statici', 'E mai rapidă', 'E imutabilă'], 'Nu poate fi instanțiată; doar membri statici', 'Ex: `Math`, `Console` — utilități.', { topic: 'class', difficulty: 'MEDIUM' }),
  sa('this', 'Care cuvânt cheie referă obiectul curent într-o metodă?', 'this', '`this.Nume = nume;` — referință la instanța curentă.', { topic: 'class' }),
]

const mostenireInterfeteQuiz = [
  mc('base', 'Care cuvânt cheie apelează membri din clasa de bază?', ['super', 'parent', 'base', 'this.base'], 'base', '`base.Metoda()` apelează versiunea din clasa părinte.', { topic: 'mostenire' }),
  mc('Implementare interfață', 'Cum implementează `Persoana` interfața `IComparable`?', ['Persoana implements IComparable', 'Persoana : IComparable', 'Persoana <- IComparable', 'Persoana inherits IComparable'], 'Persoana : IComparable', 'La fel ca moștenirea — `class A : Bază, Interfață1, Interfață2`.', { topic: 'interface' }),
  sa('Convenție', 'Cu ce literă încep convențional numele de interfețe în C#?', 'I', '`IComparable`, `IDisposable`, `IEnumerable` — convenție Microsoft.', { topic: 'interface' }),
]

const genericeQuiz = [
  mc('Tip generic builtin', 'Care e cea mai folosită colecție generică?', ['ArrayList', 'List<T>', 'Vector<T>', 'GenericList'], 'List<T>', '`List<T>` din `System.Collections.Generic` — type-safe + rapid.', { topic: 'generics' }),
  mc('Boxing', 'Ce evită genericele cu `List<int>` față de `ArrayList`?', ['Compilarea', 'Boxing/unboxing pentru tipuri valoare', 'Memoria stack', 'Erorile compilare'], 'Boxing/unboxing pentru tipuri valoare', '`ArrayList` stochează `object` → boxing pentru int. `List<int>` evită.', { topic: 'generics', difficulty: 'MEDIUM' }),
  sa('Constrângere new()', 'Care constrângere cere ca T să aibă constructor fără parametri?', 'new()', '`where T : new()` — permite `new T()`.', { topic: 'generics', difficulty: 'MEDIUM' }),
]

const linqQuiz = [
  mc('Query syntax keyword', 'Care e cuvântul cheie LINQ pentru sortare în query syntax?', ['order', 'orderby', 'sort', 'sortby'], 'orderby', '`orderby p.Nume ascending` în query syntax.', { topic: 'linq' }),
  mc('First fără excepție', 'Care metodă returnează primul element SAU default dacă lista e goală?', ['First()', 'FirstOrDefault()', 'TryFirst()', 'GetFirst()'], 'FirstOrDefault()', 'Returnează `default(T)` (null pentru ref types) la lista goală.', { topic: 'linq', difficulty: 'MEDIUM' }),
  sa('Câte', 'Care metodă LINQ numără elementele care satisfac o condiție? (cu paranteze, nu)', 'Count', '`lista.Count(p => p.Activ)` numără doar elementele active.', { topic: 'linq' }),
  mc('Group by', 'Ce returnează `GroupBy(p => p.Categorie)`?', ['Listă plată', 'O secvență de grupuri (key + elemente)', 'Eroare', 'Dictionar'], 'O secvență de grupuri (key + elemente)', 'Fiecare grup are `.Key` și e enumerabil.', { topic: 'linq', difficulty: 'MEDIUM' }),
]

const exceptiiQuiz = [
  mc('Catch ordine', 'În ce ordine trebuie aranjate catch-urile?', ['De la general la specific', 'De la specific la general', 'Nu contează', 'Doar unul permis'], 'De la specific la general', 'Catch-urile mai specifice trebuie ÎNAINTEA celor generale (Exception).', { topic: 'exceptii', difficulty: 'MEDIUM' }),
  mc('Rethrow corect', 'Cum re-arunci o excepție păstrând stack trace-ul?', ['throw ex;', 'throw;', 'rethrow ex;', 'throw new Exception(ex);'], 'throw;', '`throw;` (fără variabilă) păstrează stack trace-ul original.', { topic: 'exceptii', difficulty: 'MEDIUM' }),
  sa('IDisposable', 'Care interfață implementează obiectele care necesită cleanup explicit?', 'IDisposable', '`IDisposable` are metoda `Dispose()` — apelată automat de `using`.', { topic: 'exceptii', difficulty: 'MEDIUM' }),
]

const asyncAwaitQuiz = [
  mc('Task vs Thread', 'Care e diferența principală?', ['Niciuna', 'Task = unitate de muncă, Thread = fir de execuție OS', 'Task e doar pentru async', 'Thread e mai rapid'], 'Task = unitate de muncă, Thread = fir de execuție OS', 'Multe Task-uri pot rula pe puține Thread-uri (thread pool).', { topic: 'async', difficulty: 'MEDIUM' }),
  mc('ConfigureAwait', 'La ce folosește `.ConfigureAwait(false)`?', ['Anulează task', 'Evită re-revenirea pe contextul original (UI thread)', 'Face mai rapid', 'Decorativ'], 'Evită re-revenirea pe contextul original (UI thread)', 'Util în librării — evită deadlock-uri.', { topic: 'async', difficulty: 'MEDIUM' }),
  sa('Așteaptă oricare', 'Care metodă Task așteaptă să se termine PRIMUL Task din mai multe?', 'Task.WhenAny', '`Task.WhenAny(t1, t2)` returnează Task-ul care s-a terminat primul.', { topic: 'async', difficulty: 'MEDIUM' }),
  mc('Deadlock', 'Ce poate cauza deadlock în cod async?', ['await', 'Apelul .Result sau .Wait() pe Task într-un context sincron', 'Task.Delay', 'async void'], 'Apelul .Result sau .Wait() pe Task într-un context sincron', 'Cauză frecventă în UI / ASP.NET clasic — folosește await peste tot.', { topic: 'async', difficulty: 'MEDIUM' }),
]

export const csharpQuizPack = {
  appendProblems: {
    'introducere-console': introducereConsoleQuiz,
    'variabile-tipuri': variabileTipuriQuiz,
    'input-conversii': inputConversiiQuiz,
    'conditii-bucle': conditiiBucleQuiz,
    'metode': metodeQuiz,
    'colectii': colectiiQuiz,
    'clase-properties': claseProperteisQuiz,
    'mostenire-interfete': mostenireInterfeteQuiz,
    'generice': genericeQuiz,
    'linq': linqQuiz,
    'exceptii': exceptiiQuiz,
    'async-await': asyncAwaitQuiz,
  },
}
