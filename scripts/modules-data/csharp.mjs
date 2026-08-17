import { mc, sa } from './helpers.mjs'

// C# (CSharp) — limbajul Microsoft pentru .NET, jocuri (Unity), backend
// 12 lecții complete
export const csharpModule = {
  slug: 'programare-csharp',
  title: 'Programare C#',
  description:
    'Învață C# — limbajul Microsoft folosit în Unity, ASP.NET și aplicații desktop. 12 lecții despre OOP, LINQ, async și .NET.',
  language: 'csharp',
  order: 7,
  lessons: [
    // ============ LECȚIA 1 ============
    {
      slug: 'introducere-console',
      title: '1. Introducere + Console.WriteLine',
      isFree: true,
      theory: `# Bun venit în C#!

C# (citit "C-sharp") este un limbaj **modern, orientat pe obiecte**, creat de Microsoft pentru platforma **.NET**.

## De ce C#?
- **Unity** — cel mai folosit motor de jocuri
- **ASP.NET** — aplicații web enterprise
- **Aplicații desktop** — WPF, WinForms, MAUI
- **Cross-platform** — Linux, macOS, mobile (cu .NET 6+)

## Primul program (.NET 6+, top-level statements)
\`\`\`csharp
Console.WriteLine("Salut, lume!");
\`\`\`

## Forma clasică (cu Main)
\`\`\`csharp
using System;

namespace MyApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Salut, lume!");
        }
    }
}
\`\`\`

## Explicații
- \`using System;\` — import namespace standard (similar cu \`#include\`)
- \`namespace\` — organizează codul logic
- \`class Program\` — orice cod e într-o clasă
- \`Main\` — punctul de intrare
- \`Console.WriteLine\` — afișare cu linie nouă; \`Console.Write\` afișează fără newline
`,
      problems: [
        mc('Funcție de afișare', 'Care funcție afișează text + linie nouă?', ['print()', 'Console.WriteLine()', 'echo()', 'Print()'], 'Console.WriteLine()', '`Console.WriteLine` afișează text și adaugă `\\n` la final.', { topic: 'console' }),
        mc('Fără linie nouă', 'Care variantă afișează text **fără** linie nouă?', ['Console.Print()', 'Console.Write()', 'Console.NoLine()', 'Console.Out()'], 'Console.Write()', '`Console.Write` nu adaugă newline.', { topic: 'console' }),
        sa('Namespace standard', 'Ce namespace trebuie importat pentru `Console`? (instrucțiunea completă)', 'using System;', '`System` conține clasele de bază: Console, String, Math, etc.', { topic: 'namespace' }),
        mc('Punct de intrare', 'Care metodă e punctul de intrare al unui program C# clasic?', ['Start', 'Main', 'Run', 'Init'], 'Main', '`static void Main(string[] args)` — clasic. În .NET 6+ se pot folosi top-level statements.', { topic: 'main' }),
        mc('Sfârșit instrucțiune', 'Cu ce caracter se termină instrucțiunile?', [':', '.', ';', 'newline'], ';', 'C# moștenește sintaxa C/Java: `;` la final.', { topic: 'syntax' }),
        sa('Linie nouă în string', 'Cum scrii un caracter de linie nouă într-un string C#?', '\\n', '`"\\n"` — la fel ca în C/Java.', { topic: 'console' }),
      ],
    },

    // ============ LECȚIA 2 ============
    {
      slug: 'variabile-tipuri',
      title: '2. Variabile, tipuri, var',
      isFree: true,
      theory: `# Variabile în C#

C# este **strongly typed** — fiecare variabilă are un tip declarat (sau dedus).

\`\`\`csharp
int n = 42;
double pi = 3.14;
char c = 'A';
bool ok = true;
string nume = "Ana";   // string e tip integrat (alias pentru System.String)
\`\`\`

## Tipuri primitive principale
| Tip | Mărime | Exemplu |
|-----|--------|---------|
| \`int\` | 4 octeți | \`42\` |
| \`long\` | 8 octeți | \`42L\` |
| \`double\` | 8 octeți | \`3.14\` |
| \`float\` | 4 octeți | \`3.14f\` |
| \`decimal\` | 16 octeți | \`3.14m\` (precizie financiară) |
| \`bool\` | 1 octet | \`true\` / \`false\` |
| \`char\` | 2 octeți (Unicode) | \`'A'\` |
| \`string\` | variabilă | \`"text"\` |

## var — tipul dedus
\`\`\`csharp
var n = 42;        // int
var s = "Salut";   // string
var lista = new List<int>();   // List<int>
\`\`\`

## Constante
\`\`\`csharp
const double PI = 3.14159;
\`\`\`

## String interpolation (\`$""\`)
\`\`\`csharp
string nume = "Ana";
int varsta = 12;
Console.WriteLine($"Salut {nume}, ai {varsta} ani!");
\`\`\`

## Verbatim string (\`@""\`)
\`\`\`csharp
string cale = @"C:\\Users\\Stefan";   // \\ literal, fără escape
\`\`\`
`,
      problems: [
        mc('Tip text', 'Care e tipul standard pentru text în C#?', ['String', 'string', 'text', 'CharArray'], 'string', '`string` (cu literă mică) e alias pentru `System.String`.', { topic: 'tipuri' }),
        mc('var', 'Ce face cuvântul cheie `var`?', ['Variabilă globală', 'Compilatorul deduce tipul', 'Variabilă dinamică', 'Variabilă opțională'], 'Compilatorul deduce tipul', 'Tipul e fix după compilare — `var` nu înseamnă "dynamic".', { topic: 'var' }),
        mc('Decimal', 'Pentru ce e tipul `decimal`?', ['Numere foarte mari', 'Calcule financiare cu precizie ridicată', 'Doar pentru bani', 'Numere negative'], 'Calcule financiare cu precizie ridicată', '`decimal` evită erorile de rotunjire ale `double` — esențial în finanțe.', { topic: 'tipuri', difficulty: 'MEDIUM' }),
        sa('String interpolation', 'Care prefix marchează o interpolare de string în C#?', '$', '`$"text {variabilă}"` evaluează expresiile în acolade.', { topic: 'string' }),
        mc('Verbatim string', 'Ce face prefixul `@` la un string?', ['Concatenează', 'Tratează backslash literal (fără escape)', 'Face string-ul global', 'Marchează regex'], 'Tratează backslash literal (fără escape)', 'Util pentru căi de fișiere și regex-uri.', { topic: 'string', difficulty: 'MEDIUM' }),
        sa('Constantă', 'Care cuvânt cheie declară o constantă (compile-time)?', 'const', '`const` cere inițializare imediată cu o expresie evaluabilă la compilare.', { topic: 'const' }),
      ],
    },

    // ============ LECȚIA 3 ============
    {
      slug: 'input-conversii',
      title: '3. Input și conversii',
      isFree: false,
      theory: `# Citirea datelor în C#

\`Console.ReadLine()\` returnează **mereu un string** (sau \`null\` la EOF).

\`\`\`csharp
Console.Write("Cum te cheamă? ");
string? nume = Console.ReadLine();

Console.Write("Câți ani ai? ");
string varstaText = Console.ReadLine() ?? "0";
int varsta = int.Parse(varstaText);

Console.WriteLine($"Salut, {nume}, ai {varsta} ani.");
\`\`\`

## Conversii
\`\`\`csharp
int n = int.Parse("42");           // string → int (aruncă excepție la eroare)
double d = double.Parse("3.14");
bool b = bool.Parse("true");
\`\`\`

## TryParse — fără excepție
\`\`\`csharp
if (int.TryParse(text, out int n)) {
    Console.WriteLine($"Număr: {n}");
} else {
    Console.WriteLine("Nu e un număr valid!");
}
\`\`\`

## Convert (alternativ)
\`\`\`csharp
int n = Convert.ToInt32("42");
\`\`\`

## ⚠️ Cultură (separator zecimal)
În România: \`3,14\` (virgulă). Pentru parsare invariantă:
\`\`\`csharp
double d = double.Parse("3.14", CultureInfo.InvariantCulture);
\`\`\`
`,
      problems: [
        mc('Citire de la utilizator', 'Care metodă citește o linie de la consolă?', ['Console.Read()', 'Console.ReadLine()', 'Console.Input()', 'Console.GetLine()'], 'Console.ReadLine()', '`Console.ReadLine()` returnează un `string?` (nullable).', { topic: 'input' }),
        mc('Tip returnat', 'Ce tip returnează `Console.ReadLine()`?', ['int', 'string', 'string?', 'object'], 'string?', 'În C# modern, e nullable (`string?`) pentru că poate returna `null` la EOF.', { topic: 'input', difficulty: 'MEDIUM' }),
        sa('Convertește la int', 'Scrie expresia care convertește string-ul `"42"` la int (folosind Parse).', 'int.Parse("42")', '`int.Parse(s)` aruncă FormatException dacă s nu e valid.', { topic: 'conversii' }),
        mc('Fără excepție', 'Care e cea mai sigură metodă de conversie?', ['int.Parse()', 'int.TryParse()', 'Convert.ToInt32()', 'Cast (int)'], 'int.TryParse()', '`TryParse` returnează `bool` și nu aruncă excepție — mai sigur.', { topic: 'conversii', difficulty: 'MEDIUM' }),
        mc('Operator null-coalescing', 'Ce face `x ?? "default"` ?', ['XOR logic', 'Returnează "default" dacă x e null', 'Concatenare', 'Comparare'], 'Returnează "default" dacă x e null', '`??` returnează operandul drept dacă cel stâng e null.', { topic: 'null', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 4 ============
    {
      slug: 'conditii-bucle',
      title: '4. Condiții și bucle (foreach, switch expression)',
      isFree: false,
      theory: `# Condiții și bucle în C#

## if / else if / else — la fel ca C/C++/Java
\`\`\`csharp
if (nota >= 9) Console.WriteLine("Foarte bine");
else if (nota >= 7) Console.WriteLine("Bine");
else Console.WriteLine("Mai exersează");
\`\`\`

## switch clasic
\`\`\`csharp
switch (zi) {
    case 1: Console.WriteLine("Luni"); break;
    case 2: Console.WriteLine("Marți"); break;
    default: Console.WriteLine("Altă zi"); break;
}
\`\`\`

## switch expression (C# 8+) — modern
\`\`\`csharp
string nume = zi switch {
    1 => "Luni",
    2 => "Marți",
    3 => "Miercuri",
    _ => "Altă zi"
};
\`\`\`

## for, while, do-while — la fel
\`\`\`csharp
for (int i = 0; i < 10; i++) Console.WriteLine(i);

int n = 5;
while (n > 0) { n--; }
\`\`\`

## foreach — pentru colecții
\`\`\`csharp
int[] note = {8, 9, 7, 10};
foreach (int n in note) {
    Console.WriteLine(n);
}
\`\`\`

## Pattern matching (C# 9+)
\`\`\`csharp
object o = 42;
if (o is int n && n > 0) {
    Console.WriteLine($"Pozitiv: {n}");
}
\`\`\`
`,
      problems: [
        mc('foreach', 'Care buclă iterează "pentru fiecare" element într-o colecție?', ['for', 'foreach', 'iterate', 'each'], 'foreach', '`foreach (T item in colecție) { ... }`.', { topic: 'foreach' }),
        mc('switch expression', 'Care e operatorul în switch expression?', [':', '=>', '->', '|>'], '=>', '`valoare => rezultat,` — sintaxă concisă (C# 8+).', { topic: 'switch', difficulty: 'MEDIUM' }),
        mc('Wildcard în switch expression', 'Ce simbol reprezintă "orice altceva" în switch expression?', ['*', '_', 'else', 'default'], '_', '`_` = discard, înlocuiește `default:` în switch expression.', { topic: 'switch', difficulty: 'MEDIUM' }),
        sa('Pattern is', 'Care operator verifică dacă `o` este de tipul `int` (cuvânt cheie)?', 'is', '`if (o is int n)` — și capturează valoarea în `n`.', { topic: 'pattern' }),
        mc('Bool', 'Cum se numește tipul adevărat/fals în C#?', ['bool', 'boolean', 'Boolean', 'true_false'], 'bool', '`bool` (alias pentru `System.Boolean`).', { topic: 'tipuri' }),
      ],
    },

    // ============ LECȚIA 5 ============
    {
      slug: 'metode',
      title: '5. Metode (static, params, ref, out)',
      isFree: false,
      theory: `# Metode în C#

În C#, **toate metodele sunt în interiorul claselor**.

\`\`\`csharp
class Calculator
{
    public static int Suma(int a, int b)
    {
        return a + b;
    }
}

// Apel
int rez = Calculator.Suma(3, 5);
\`\`\`

## static vs instanță
- \`static\` → apelată pe **clasă**: \`Calculator.Suma(...)\`
- non-static → apelată pe **instanță**: \`new Calculator().Metoda(...)\`

## Parametri impliciți
\`\`\`csharp
void Salut(string nume = "lume")
{
    Console.WriteLine($"Salut {nume}!");
}
\`\`\`

## Parametri numiți
\`\`\`csharp
Salut(nume: "Ana");
\`\`\`

## ref — pass by reference
\`\`\`csharp
void Dubleaza(ref int n) {
    n *= 2;
}

int x = 5;
Dubleaza(ref x);   // ref obligatoriu și la apel
Console.WriteLine(x);   // 10
\`\`\`

## out — variabila NU trebuie inițializată
\`\`\`csharp
bool TryDivide(int a, int b, out int rezultat) {
    if (b == 0) { rezultat = 0; return false; }
    rezultat = a / b;
    return true;
}

if (TryDivide(10, 2, out int r)) {
    Console.WriteLine(r);
}
\`\`\`

## params — număr variabil de argumente
\`\`\`csharp
int Suma(params int[] numere) {
    int s = 0;
    foreach (int n in numere) s += n;
    return s;
}

Suma(1, 2, 3, 4, 5);   // 15
\`\`\`
`,
      problems: [
        mc('Apel metodă static', 'Cum apelezi o metodă static `Suma` din clasa `Calculator`?', ['Suma()', 'Calculator.Suma()', 'new Calculator().Suma()', 'static.Suma()'], 'Calculator.Suma()', 'Static = apelată pe clasă, nu pe instanță.', { topic: 'metode' }),
        mc('ref', 'La ce folosește `ref`?', ['Pointer', 'Pass by reference (modifică originalul)', 'Variabilă globală', 'Constantă'], 'Pass by reference (modifică originalul)', '`ref` permite modificarea variabilei apelantului.', { topic: 'metode', difficulty: 'MEDIUM' }),
        mc('out vs ref', 'Diferența între `out` și `ref`?', ['Niciuna', 'out: variabila NU trebuie inițializată în apelant', 'out e mai rapid', 'ref e doar pentru int'], 'out: variabila NU trebuie inițializată în apelant', 'Compilatorul cere ca metoda să atribuie `out` înainte de return.', { topic: 'metode', difficulty: 'MEDIUM' }),
        sa('params', 'Care cuvânt cheie permite număr variabil de argumente la o metodă?', 'params', '`params int[] x` — apelat ca `f(1, 2, 3)`.', { topic: 'metode' }),
        mc('Parametru implicit', 'Care e sintaxa unui parametru cu valoare default?', ['void f(int n = 5)', 'void f(default int n = 5)', 'void f(int n ?= 5)', 'void f(int n: 5)'], 'void f(int n = 5)', 'Valoarea default direct după nume.', { topic: 'metode' }),
      ],
    },

    // ============ LECȚIA 6 ============
    {
      slug: 'colectii',
      title: '6. Array și List<T>',
      isFree: false,
      theory: `# Array și List în C#

## Array (dimensiune fixă)
\`\`\`csharp
int[] note = new int[5];
note[0] = 10;
note[1] = 9;

int[] init = {8, 9, 7, 10, 6};

Console.WriteLine(note.Length);   // 5
\`\`\`

## List<T> — dimensiune dinamică
\`\`\`csharp
using System.Collections.Generic;

List<int> lista = new List<int>();
lista.Add(10);
lista.Add(20);
lista.Add(30);

Console.WriteLine(lista.Count);   // 3
Console.WriteLine(lista[0]);      // 10
\`\`\`

## Inițializare
\`\`\`csharp
List<string> nume = new() { "Ana", "Ion", "Maria" };
\`\`\`

## Operații utile
\`\`\`csharp
lista.Add(40);          // adaugă
lista.Remove(20);       // șterge prima apariție
lista.RemoveAt(0);      // șterge la index
lista.Contains(30);     // bool
lista.IndexOf(30);      // index sau -1
lista.Sort();           // sortează in-place
lista.Reverse();        // inversează
lista.Clear();          // golește
\`\`\`

## Dictionary<K, V>
\`\`\`csharp
Dictionary<string, int> varste = new();
varste["Ana"] = 12;
varste["Ion"] = 14;

if (varste.ContainsKey("Ana")) {
    Console.WriteLine(varste["Ana"]);
}
\`\`\`

## foreach pe Dictionary
\`\`\`csharp
foreach (var kv in varste) {
    Console.WriteLine($"{kv.Key}: {kv.Value}");
}
\`\`\`
`,
      problems: [
        mc('Array length', 'Care proprietate dă numărul de elemente al unui array?', ['Count', 'Size', 'Length', 'Len'], 'Length', 'Array-urile au `.Length` (proprietate).', { topic: 'array' }),
        mc('List size', 'Care proprietate dă numărul de elemente al unui `List<T>`?', ['Length', 'Count', 'Size', 'Total'], 'Count', '`List<T>` folosește `.Count`. Diferit de array (`.Length`).', { topic: 'list' }),
        mc('Adăugare în List', 'Care metodă adaugă un element la finalul unui List?', ['Push', 'Add', 'Append', 'Insert'], 'Add', '`lista.Add(x)` adaugă la final.', { topic: 'list' }),
        sa('Dictionary', 'Care colecție generică reprezintă o asociere "cheie → valoare"?', 'Dictionary<TKey, TValue>', '`Dictionary<K,V>` din `System.Collections.Generic`.', { topic: 'dictionary' }),
        mc('Verificare cheie', 'Cum verifici dacă un Dictionary conține cheia "x"?', ['dict.Has("x")', 'dict.ContainsKey("x")', 'dict["x"] != null', '"x" in dict'], 'dict.ContainsKey("x")', '`ContainsKey` e metoda corectă (acces direct aruncă excepție dacă lipsește).', { topic: 'dictionary', difficulty: 'MEDIUM' }),
        mc('Sortare List', 'Care metodă sortează un List in-place?', ['OrderBy()', 'Sort()', 'Order()', 'Arrange()'], 'Sort()', '`lista.Sort()` modifică lista. `OrderBy` (LINQ) returnează una nouă.', { topic: 'list' }),
      ],
    },

    // ============ LECȚIA 7 ============
    {
      slug: 'clase-properties',
      title: '7. Clase și properties (get/set)',
      isFree: false,
      theory: `# Clase și properties

## Clasă de bază
\`\`\`csharp
class Persoana
{
    // Câmpuri private
    private string _nume;
    private int _varsta;

    // Constructor
    public Persoana(string nume, int varsta)
    {
        _nume = nume;
        _varsta = varsta;
    }

    // Metodă
    public void Afiseaza()
    {
        Console.WriteLine($"{_nume}, {_varsta} ani");
    }
}

var p = new Persoana("Ana", 12);
p.Afiseaza();
\`\`\`

## Properties — în loc de getter/setter manuale
\`\`\`csharp
class Persoana
{
    public string Nume { get; set; }      // auto-property
    public int Varsta { get; set; }

    public Persoana(string nume, int varsta)
    {
        Nume = nume;
        Varsta = varsta;
    }
}

var p = new Persoana("Ana", 12);
p.Nume = "Ana Maria";          // setter
Console.WriteLine(p.Nume);     // getter
\`\`\`

## Properties cu logică
\`\`\`csharp
private int _varsta;
public int Varsta
{
    get => _varsta;
    set {
        if (value < 0) throw new ArgumentException("Vârsta negativă!");
        _varsta = value;
    }
}
\`\`\`

## Properties read-only
\`\`\`csharp
public string Nume { get; init; }      // setabil doar la creare (C# 9+)
public DateTime Acum => DateTime.Now;  // expression-bodied (read-only)
\`\`\`

## Records (C# 9+) — clasă simplă pentru date
\`\`\`csharp
public record Punct(int X, int Y);

var p1 = new Punct(3, 4);
var p2 = new Punct(3, 4);
Console.WriteLine(p1 == p2);   // True (egalitate de valoare!)
\`\`\`
`,
      problems: [
        mc('Auto-property', 'Care e sintaxa unei auto-property cu get/set publici?', ['public string Nume;', 'public string Nume { get; set; }', 'public { get, set } string Nume;', 'public string Nume() { ... }'], 'public string Nume { get; set; }', 'Compilatorul generează automat câmpul backing.', { topic: 'properties' }),
        mc('init-only', 'Ce face accessor-ul `init` (C# 9+)?', ['Inițializare doar în constructor', 'Setabil doar la inițializare (object initializer)', 'Inițializare lazy', 'Privatizează property'], 'Setabil doar la inițializare (object initializer)', 'Permite immutabilitate cu sintaxă curată.', { topic: 'properties', difficulty: 'MEDIUM' }),
        mc('value în setter', 'Ce reprezintă `value` într-un setter?', ['Numele property', 'Valoarea atribuită', 'Câmpul backing', 'Eroare'], 'Valoarea atribuită', 'Cuvânt cheie special — valoarea din partea dreaptă a `=`.', { topic: 'properties', difficulty: 'MEDIUM' }),
        sa('record', 'Care cuvânt cheie definește o clasă "de date" cu egalitate de valoare?', 'record', '`record Persoana(string Nume, int Varsta);` — concis, immutable.', { topic: 'record', difficulty: 'MEDIUM' }),
        mc('new', 'Cum creezi o instanță a clasei `Persoana`?', ['Persoana p;', 'new Persoana()', 'create Persoana()', 'Persoana()'], 'new Persoana()', '`new` alocă pe heap și apelează constructorul.', { topic: 'class' }),
        mc('Constructor', 'Cum se numește metoda specială care inițializează un obiect?', ['init', 'create', 'constructor (același nume cu clasa)', 'new'], 'constructor (același nume cu clasa)', 'Fără tip de return, exact numele clasei.', { topic: 'class' }),
      ],
    },

    // ============ LECȚIA 8 ============
    {
      slug: 'mostenire-interfete',
      title: '8. Moștenire și interfețe',
      isFree: false,
      theory: `# Moștenire și interfețe în C#

## Moștenire (o singură clasă bază)
\`\`\`csharp
class Animal
{
    public string Nume { get; set; }
    public virtual void Sunet() => Console.WriteLine("Sunet generic");
}

class Caine : Animal
{
    public override void Sunet() => Console.WriteLine("Hau!");
}

Animal a = new Caine { Nume = "Rex" };
a.Sunet();   // "Hau!" (polimorfism)
\`\`\`

## ⚠️ C# permite **o singură clasă bază** (spre deosebire de C++)
Dar permite **multiple interfețe**.

## Interfețe — contract pur
\`\`\`csharp
interface IAfisabil
{
    void Afiseaza();
}

interface IComparabil
{
    int CompareTo(object other);
}

class Persoana : IAfisabil, IComparabil
{
    public string Nume { get; set; }
    public int Varsta { get; set; }

    public void Afiseaza() => Console.WriteLine(Nume);
    public int CompareTo(object other) => Varsta - ((Persoana)other).Varsta;
}
\`\`\`

## Convenție: numele interfețelor încep cu \`I\`
\`IComparable\`, \`IDisposable\`, \`IEnumerable\`...

## Clase abstracte
\`\`\`csharp
abstract class Forma
{
    public abstract double Arie();   // fără implementare
    public void Afiseaza() => Console.WriteLine(Arie());
}

class Cerc : Forma
{
    public double R { get; set; }
    public override double Arie() => 3.14 * R * R;
}
\`\`\`

## sealed — împiedică moștenirea
\`\`\`csharp
sealed class Final { ... }
\`\`\`
`,
      problems: [
        mc('Moștenire', 'Care e sintaxa pentru moștenire în C#?', ['class A extends B', 'class A : B', 'class A(B)', 'class A inherits B'], 'class A : B', 'Sintaxa: `class Derivat : Bază`.', { topic: 'mostenire' }),
        mc('Moștenire multiplă', 'C# permite moștenirea din mai multe clase?', ['Da', 'Nu, doar o clasă; dar permite multiple interfețe', 'Doar 2', 'Doar virtual'], 'Nu, doar o clasă; dar permite multiple interfețe', 'Spre deosebire de C++, C# evită problemele moștenirii multiple.', { topic: 'mostenire', difficulty: 'MEDIUM' }),
        mc('Suprascriere metodă', 'Care cuvinte cheie sunt necesare pentru polimorfism?', ['static / static', 'virtual (în bază) și override (în derivată)', 'abstract / new', 'public / private'], 'virtual (în bază) și override (în derivată)', 'Bază: `virtual`; derivată: `override`.', { topic: 'mostenire', difficulty: 'MEDIUM' }),
        sa('Interfață', 'Care cuvânt cheie definește o interfață?', 'interface', '`interface INume { ... }` — convențional începe cu I.', { topic: 'interface' }),
        mc('Clasă abstractă', 'Care cuvânt cheie face o clasă abstractă?', ['virtual', 'abstract', 'pure', 'interface'], 'abstract', '`abstract class X` — nu poate fi instanțiată direct.', { topic: 'mostenire' }),
        mc('sealed', 'Ce face `sealed` la o clasă?', ['O face statică', 'Împiedică moștenirea din ea', 'O face publică', 'O optimizează'], 'Împiedică moștenirea din ea', 'Echivalent cu `final` în Java.', { topic: 'mostenire', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 9 ============
    {
      slug: 'generice',
      title: '9. Generice (Generics)',
      isFree: false,
      theory: `# Generice în C#

Genericele permit scrierea de clase și metode care funcționează **cu orice tip**, păstrând type-safety.

## Metodă generică
\`\`\`csharp
T Maxim<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}

int m = Maxim(3, 5);          // T = int
string s = Maxim("ab", "ac"); // T = string
\`\`\`

## Clasă generică
\`\`\`csharp
class Cutie<T>
{
    public T Continut { get; set; }

    public Cutie(T x) {
        Continut = x;
    }
}

var c1 = new Cutie<int>(42);
var c2 = new Cutie<string>("Hello");
\`\`\`

## Constrângeri (\`where\`)
\`\`\`csharp
where T : class           // T trebuie să fie tip referință
where T : struct          // T trebuie să fie tip valoare
where T : new()           // T trebuie să aibă constructor fără param
where T : IComparable<T>  // T trebuie să implementeze interfața
where T : Animal          // T trebuie să moștenească din Animal
\`\`\`

## Multipli parametri
\`\`\`csharp
class Pereche<K, V>
{
    public K Cheie { get; set; }
    public V Valoare { get; set; }
}

var p = new Pereche<string, int> { Cheie = "Ana", Valoare = 12 };
\`\`\`

## Beneficii
- **Type safety** — verificat la compilare, fără cast
- **Performanță** — fără boxing/unboxing pentru tipuri valoare
- \`List<T>\`, \`Dictionary<K,V>\`, \`Func<T,R>\` — toate sunt generice
`,
      problems: [
        mc('Sintaxă generic', 'Care e sintaxa pentru un parametru generic la o metodă?', ['void F<T>()', 'void F[T]()', 'void F(T)()', '<T>void F()'], 'void F<T>()', 'Parametri generici în paranteze unghiulare după nume.', { topic: 'generics' }),
        mc('where', 'La ce folosește `where` într-un generic?', ['Filtru LINQ', 'Constrânge tipul T', 'Comentariu', 'Eroare'], 'Constrânge tipul T', '`where T : ...` impune restricții asupra lui T.', { topic: 'generics', difficulty: 'MEDIUM' }),
        mc('List<T>', 'Ce reprezintă `List<int>`?', ['Listă cu un singur int', 'Listă generică instanțiată cu int', 'Array de int', 'Eroare'], 'Listă generică instanțiată cu int', 'Generic = un singur cod, mai multe tipuri.', { topic: 'generics' }),
        sa('Constrângere "tip referință"', 'Care e constrângerea care cere ca T să fie un tip referință (un cuvânt)?', 'class', '`where T : class`.', { topic: 'generics', difficulty: 'MEDIUM' }),
        mc('Beneficii generice', 'Care e avantajul principal față de `object`?', ['Mai rapid întotdeauna', 'Type safety + fără boxing', 'Memorie mai puțină', 'Mai simplu'], 'Type safety + fără boxing', 'Compilatorul verifică tipurile, fără conversii la runtime.', { topic: 'generics', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 10 ============
    {
      slug: 'linq',
      title: '10. LINQ — Language Integrated Query',
      isFree: false,
      theory: `# LINQ — interogări funcționale peste colecții

LINQ este una dintre cele mai puternice trăsături ale C#.

\`\`\`csharp
using System.Linq;

int[] numere = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// Filtrare + transformare
var pareDublate = numere
    .Where(n => n % 2 == 0)
    .Select(n => n * 2)
    .ToList();
// → {4, 8, 12, 16, 20}
\`\`\`

## Operatori principali
\`\`\`csharp
.Where(x => ...)        // filtrare
.Select(x => ...)       // transformare (map)
.OrderBy(x => ...)      // sortare crescător
.OrderByDescending(...) // sortare descrescător
.Take(n)                // primele n
.Skip(n)                // sare peste n
.First()                // primul (eroare dacă lista e goală)
.FirstOrDefault()       // primul sau default
.Count()                // număr
.Sum() / .Average()     // sumă / medie
.Max() / .Min()         // max / min
.Any(x => ...)          // există vreunul?
.All(x => ...)          // toate?
.GroupBy(x => ...)      // grupare
.Distinct()             // unice
.Contains(x)            // bool
\`\`\`

## Exemple
\`\`\`csharp
var elevi = new List<Persoana> {
    new("Ana", 12), new("Ion", 14), new("Maria", 11)
};

// Cei mai mari de 12 ani, sortați după nume
var rezultat = elevi
    .Where(p => p.Varsta > 12)
    .OrderBy(p => p.Nume)
    .Select(p => p.Nume)
    .ToList();

// Suma vârstelor
int total = elevi.Sum(p => p.Varsta);

// Media
double medie = elevi.Average(p => p.Varsta);
\`\`\`

## Query syntax (alternativă SQL-like)
\`\`\`csharp
var rez = from p in elevi
          where p.Varsta > 12
          orderby p.Nume
          select p.Nume;
\`\`\`

## Lazy evaluation
LINQ e **lazy** — nu execută până nu enumerezi (\`ToList\`, \`foreach\`, \`First\`, etc.).
`,
      problems: [
        mc('Filtrare LINQ', 'Care metodă LINQ filtrează elementele?', ['Filter', 'Where', 'Select', 'Find'], 'Where', '`Where(predicate)` păstrează doar elementele care satisfac condiția.', { topic: 'linq' }),
        mc('Transformare LINQ', 'Care metodă transformă fiecare element (map)?', ['Map', 'Select', 'Transform', 'Convert'], 'Select', '`Select(x => f(x))` — echivalent cu map din alte limbaje.', { topic: 'linq' }),
        mc('Materializare', 'Care metodă forțează evaluarea unui query LINQ într-o listă?', ['Run()', 'ToList()', 'Eval()', 'Collect()'], 'ToList()', 'Sau `ToArray()`, `ToDictionary()`, etc.', { topic: 'linq', difficulty: 'MEDIUM' }),
        sa('Sumă cu LINQ', 'Care metodă LINQ calculează suma?', 'Sum', '`numere.Sum()` sau `obiecte.Sum(o => o.Pret)`.', { topic: 'linq' }),
        mc('Lazy evaluation', 'Ce înseamnă că LINQ e "lazy"?', ['Mai lent', 'Execută doar când rezultatul e enumerat', 'Nu funcționează corect', 'Doar pentru small data'], 'Execută doar când rezultatul e enumerat', 'Permite optimizări și evită calcule inutile.', { topic: 'linq', difficulty: 'MEDIUM' }),
        mc('Namespace pentru LINQ', 'Ce trebuie importat pentru LINQ?', ['System.Linq', 'System.Query', 'System.Collections', 'Microsoft.LINQ'], 'System.Linq', '`using System.Linq;` activează metodele de extensie.', { topic: 'linq' }),
      ],
    },

    // ============ LECȚIA 11 ============
    {
      slug: 'exceptii',
      title: '11. Excepții (try/catch/finally)',
      isFree: false,
      theory: `# Excepții în C#

Excepțiile semnalează **erori la runtime** și permit gestionarea lor controlată.

\`\`\`csharp
try {
    int n = int.Parse("abc");   // aruncă FormatException
}
catch (FormatException ex) {
    Console.WriteLine($"Format invalid: {ex.Message}");
}
catch (Exception ex) {
    Console.WriteLine($"Eroare generică: {ex.Message}");
}
finally {
    Console.WriteLine("Se execută INDIFERENT.");
}
\`\`\`

## Ierarhia
- \`Exception\` (rădăcină)
  - \`SystemException\`
    - \`ArgumentException\`, \`ArgumentNullException\`
    - \`InvalidOperationException\`
    - \`NullReferenceException\`
    - \`IndexOutOfRangeException\`
    - \`FormatException\`
    - \`DivideByZeroException\`
  - \`IOException\` ...

## throw
\`\`\`csharp
void SetVarsta(int v) {
    if (v < 0)
        throw new ArgumentException("Vârsta nu poate fi negativă");
}
\`\`\`

## throw rethrow (păstrează stack trace)
\`\`\`csharp
catch (Exception ex) {
    LogError(ex);
    throw;     // FĂRĂ "ex" — păstrează stack-ul original
}
\`\`\`

## Excepții personalizate
\`\`\`csharp
class VarstaInvalidaException : Exception
{
    public VarstaInvalidaException(string msg) : base(msg) {}
}
\`\`\`

## using — eliberare automată (IDisposable)
\`\`\`csharp
using (var f = File.OpenRead("date.txt")) {
    // ...
}   // Dispose() apelat automat aici
\`\`\`

## using statement (C# 8+)
\`\`\`csharp
using var f = File.OpenRead("date.txt");
// f.Dispose() la sfârșitul scope-ului
\`\`\`
`,
      problems: [
        mc('Block obligatoriu', 'Care block prinde excepțiile?', ['try', 'catch', 'finally', 'except'], 'catch', '`catch (TipExceptie)` prinde și gestionează.', { topic: 'exceptii' }),
        mc('finally', 'Când se execută `finally`?', ['Doar la succes', 'Doar la eroare', 'Întotdeauna (succes sau excepție)', 'La final de program'], 'Întotdeauna (succes sau excepție)', '`finally` se execută INDIFERENT — util pentru cleanup.', { topic: 'exceptii' }),
        mc('throw', 'Cum arunci o excepție?', ['raise ex', 'throw ex', 'fire ex', 'panic(ex)'], 'throw ex', '`throw new Exception("mesaj");` — sau `throw;` pentru rethrow.', { topic: 'exceptii' }),
        sa('Excepție de bază', 'Care e clasa rădăcină a tuturor excepțiilor?', 'Exception', '`System.Exception` — toate moștenesc din ea.', { topic: 'exceptii' }),
        mc('using statement', 'La ce folosește `using` (cu paranteze rotunde / `using var`)?', ['Import namespace', 'Eliberare automată a resurselor (IDisposable)', 'Definește bloc', 'Ascunde excepții'], 'Eliberare automată a resurselor (IDisposable)', 'Apelează `.Dispose()` automat la sfârșitul scope-ului.', { topic: 'exceptii', difficulty: 'MEDIUM' }),
        mc('Catch general', 'Care excepție prinde TOATE erorile?', ['catch (Error)', 'catch (Exception)', 'catch (object)', 'catch ()'], 'catch (Exception)', 'Dar e bună practică să prinzi tipuri specifice când posibil.', { topic: 'exceptii', difficulty: 'MEDIUM' }),
      ],
    },

    // ============ LECȚIA 12 ============
    {
      slug: 'async-await',
      title: '12. Async / await',
      isFree: false,
      theory: `# Async și await — programare asincronă

C# are unul dintre cele mai elegante modele async din toate limbajele.

## Problema
Operațiile **lente** (rețea, fișiere, baze de date) **blochează** firul de execuție:
\`\`\`csharp
string raspuns = HttpGet("https://api.com/data");   // BLOCHEAZĂ
Console.WriteLine(raspuns);
\`\`\`

## Soluția — async/await
\`\`\`csharp
async Task<string> CitesteAsync()
{
    using var client = new HttpClient();
    string raspuns = await client.GetStringAsync("https://api.com/data");
    return raspuns;
}

// Apel
string date = await CitesteAsync();
\`\`\`

## Reguli
- \`async\` marchează metoda ca asincronă
- Tipul de return: **\`Task\`** (void async), **\`Task<T>\`** (returnează T)
- \`await\` "așteaptă" rezultatul **fără a bloca firul**

## Task.Delay
\`\`\`csharp
async Task AsteaptaAsync(int ms)
{
    Console.WriteLine("Start");
    await Task.Delay(ms);    // așteaptă, NU blochează
    Console.WriteLine("Gata");
}
\`\`\`

## Task.WhenAll — paralel
\`\`\`csharp
Task<string> t1 = client.GetStringAsync(url1);
Task<string> t2 = client.GetStringAsync(url2);
Task<string> t3 = client.GetStringAsync(url3);

string[] rezultate = await Task.WhenAll(t1, t2, t3);
// Toate 3 rulează în PARALEL
\`\`\`

## Top-level await (C# 7.1+)
\`\`\`csharp
// În Main:
string date = await CitesteAsync();
\`\`\`

## ⚠️ Reguli importante
1. \`await\` poate fi folosit DOAR în metode \`async\`
2. \`async void\` doar pentru event handlers — altfel folosește \`Task\`
3. NU apelezi \`.Result\` sau \`.Wait()\` pe Task într-un context async (deadlock!)
`,
      problems: [
        mc('async', 'Ce rol are cuvântul `async` la o metodă?', ['Marchează metoda ca asincronă', 'O face statică', 'O face publică', 'O paralelizează automat'], 'Marchează metoda ca asincronă', '`async` permite folosirea lui `await` în corpul metodei.', { topic: 'async' }),
        mc('Tip de return', 'Ce tip ar trebui să returneze o metodă async care produce un int?', ['int', 'Task', 'Task<int>', 'async int'], 'Task<int>', '`Task<T>` reprezintă o operație asincronă care produce T.', { topic: 'async', difficulty: 'MEDIUM' }),
        mc('await', 'Ce face `await`?', ['Blochează firul', 'Așteaptă completarea fără a bloca firul', 'Anulează operația', 'Returnează imediat'], 'Așteaptă completarea fără a bloca firul', 'Firul e eliberat pentru alt lucru până când Task-ul e gata.', { topic: 'async', difficulty: 'MEDIUM' }),
        sa('Așteaptă timp', 'Care metodă async face o "pauză" non-blocantă de N ms? (numele complet)', 'Task.Delay', '`await Task.Delay(1000);` — o secundă fără să blocheze.', { topic: 'async' }),
        mc('Paralelism', 'Care metodă rulează mai multe Task-uri în paralel și așteaptă toate?', ['Task.Run', 'Task.WhenAll', 'Task.All', 'Task.Parallel'], 'Task.WhenAll', '`Task.WhenAll(t1, t2, ...)` așteaptă toate.', { topic: 'async', difficulty: 'MEDIUM' }),
        mc('async void', 'Când e OK să folosești `async void`?', ['Niciodată', 'Doar pentru event handlers', 'Întotdeauna', 'Pentru main'], 'Doar pentru event handlers', '`async void` nu poate fi awaited; excepțiile pot crăpa procesul.', { topic: 'async', difficulty: 'MEDIUM' }),
      ],
    },
  ],
}
