// C# — pachet de lecții suplimentare (metodica-extra)
// Adaugă ~13 lecții noi pentru a ajunge la ~25 lecții totale.

import { mc, sa, io, code } from './helpers.mjs'

const T = 'csharp'

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 13: Tablouri și List<T>
// ────────────────────────────────────────────────────────────────────────────
const tablouriList = {
  title: 'Tablouri și List<T>',
  slug: 'tablouri-list',
  isFree: false,
  theory: `# 📚 Tablouri și List<T> în C#

## :rocket: Tablouri (mărime fixă)

\`\`\`csharp
int[] v = new int[5];        // 5 zerouri
int[] w = {10, 20, 30};      // inițializat
Console.WriteLine(w[1]);      // 20
Console.WriteLine(w.Length);  // 3
\`\`\`

## :memo: Tablouri 2D (matrice)

\`\`\`csharp
int[,] matrice = new int[3, 4];
matrice[0, 1] = 99;
int rânduri = matrice.GetLength(0);
int coloane = matrice.GetLength(1);
\`\`\`

## :star: List<T> — listă dinamică

\`\`\`csharp
using System.Collections.Generic;

List<int> lista = new List<int>();
lista.Add(10);
lista.Add(20);
lista.Add(30);

Console.WriteLine(lista.Count);  // 3
Console.WriteLine(lista[0]);     // 10
\`\`\`

## :wrench: Operații frecvente pe List<T>

| Operație | Cod |
|----------|-----|
| Adaugă | \`l.Add(x)\` |
| Inserare | \`l.Insert(i, x)\` |
| Ștergere | \`l.Remove(x)\` / \`l.RemoveAt(i)\` |
| Verifică existența | \`l.Contains(x)\` |
| Index | \`l.IndexOf(x)\` |
| Sortează | \`l.Sort()\` |
| Inversează | \`l.Reverse()\` |
| Mărimea | \`l.Count\` |
| Golește | \`l.Clear()\` |

## :bulb: Inițializare cu valori

\`\`\`csharp
List<string> nume = new List<string> { "Ana", "Mihai", "Ioana" };
\`\`\`

## :gear: foreach modern

\`\`\`csharp
foreach (var n in lista) {
    Console.WriteLine(n);
}
\`\`\`

## :books: Tablouri vs List<T>

| Tablou | List<T> |
|--------|---------|
| Mărime FIXĂ | Mărime DINAMICĂ |
| Mai rapid | Mai flexibil |
| Pentru algoritmi | Pentru aplicații |
| \`new int[5]\` | \`new List<int>()\` |

## :star: Sortare cu lambda

\`\`\`csharp
lista.Sort();                              // crescător
lista.Sort((a, b) => b.CompareTo(a));      // descrescător
\`\`\`
`,
  problems: [
    mc('Inițializare tablou',
      'Care declarație creează un tablou cu 5 zerouri?',
      ['int[] v = new int[5];', 'int v[5];', 'Array<int>(5) v;', 'int v = new int(5);'],
      'int[] v = new int[5];',
      'Sintaxa C# este `tip[] nume = new tip[mărime];`.', { topic: T }),
    mc('Mărime tablou',
      'Cum afli numărul de elemente?',
      ['v.Size()', 'v.Count', 'v.Length', 'v.size'], 'v.Length',
      'Tablourile au proprietatea `Length`.', { topic: T }),
    mc('List<T> mărime',
      'Cum afli numărul de elemente într-un List<T>?',
      ['l.Length', 'l.Size', 'l.Count', 'l.Total'], 'l.Count',
      'List<T> folosește `Count` (nu Length ca tablourile).', { topic: T }),
    mc('Adăugare la List',
      'Cum adaugi un element la un List<int> l?',
      ['l.Push(x)', 'l.Add(x)', 'l.Insert(x)', 'l += x'], 'l.Add(x)',
      '`Add(x)` adaugă la final.', { topic: T }),
    mc('Tablou 2D',
      'Care e sintaxa pentru un tablou 2D 3×4?',
      ['int[][] m = new int[3][4]', 'int[,] m = new int[3,4]', 'int[3,4] m', 'int m(3,4)'],
      'int[,] m = new int[3,4]',
      'Virgula în interiorul `[,]` indică un tablou multidimensional.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Acces 2D',
      'Cum accesezi elementul de pe rândul 1, coloana 2 dintr-un tablou int[,]?',
      'm[1,2]',
      'Folosești virgule între indici: `m[i,j]`.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Namespace List',
      'În ce namespace e clasa `List<T>`?',
      'System.Collections.Generic',
      'List<T>, Dictionary<K,V>, etc. sunt în `System.Collections.Generic`.', { topic: T }),
    code('Sumă tablou',
      'Citește n, apoi n întregi într-un tablou. Afișează suma elementelor.',
      'csharp',
      `using System;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        int[] v = new int[n];
        
        // TODO: citește n numere
        
        // TODO: calculează și afișează suma
    }
}`,
      'Folosește un loop for cu `int.Parse(Console.ReadLine())` la fiecare iterație.',
      { topic: T, difficulty: 'EASY' }),
    code('List sortare',
      'Citește n cuvinte într-un List<string>, sortează-le alfabetic și afișează-le câte unul pe linie.',
      'csharp',
      `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        List<string> lista = new List<string>();
        
        // TODO: citește n cuvinte și adaugă la listă
        
        // TODO: sortează și afișează
    }
}`,
      '`lista.Sort();` apoi `foreach (var s in lista) Console.WriteLine(s);`.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Filtrare pare',
      'Citește n numere într-un List<int>; folosește foreach pentru a afișa doar pe cele PARE separate prin spațiu.',
      'csharp',
      `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        List<int> lista = new List<int>();
        
        // TODO: citește n numere
        // TODO: foreach și afișează cele pare
    }
}`,
      'În foreach: `if (x % 2 == 0) Console.Write(x + " ");`.',
      { topic: T, difficulty: 'EASY' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 14: String avansat
// ────────────────────────────────────────────────────────────────────────────
const stringAvansatCs = {
  title: 'String — Operații Avansate',
  slug: 'string-avansat-cs',
  isFree: false,
  theory: `# 🔤 String avansat în C#

\`string\` în C# este o clasă **immutabilă** — modificarea creează un string nou.

## :rocket: Operații de bază

\`\`\`csharp
string s = "Hello";
Console.WriteLine(s.Length);          // 5
Console.WriteLine(s.ToUpper());        // HELLO
Console.WriteLine(s.ToLower());        // hello
Console.WriteLine(s[0]);               // 'H'
Console.WriteLine(s.Substring(1, 3));  // "ell"
\`\`\`

## :memo: Cele mai folosite metode

| Metodă | Descriere |
|--------|-----------|
| \`s.Length\` | Numărul de caractere |
| \`s.ToUpper()\` / \`ToLower()\` | Case conversion |
| \`s.Trim()\` | Elimină spații |
| \`s.Split(',')\` | Împarte în array |
| \`s.Replace("a", "b")\` | Înlocuiește |
| \`s.Contains("x")\` | Conține? |
| \`s.StartsWith("a")\` | Începe cu? |
| \`s.EndsWith("z")\` | Termină cu? |
| \`s.IndexOf("x")\` | Poziția (sau -1) |
| \`s.Substring(p, n)\` | Subșir |
| \`s.PadLeft(10, '*')\` | Umplere stânga |

## :star: String interpolation

\`\`\`csharp
string nume = "Ana";
int varsta = 14;

string mesaj = $"{nume} are {varsta} ani.";
// "Ana are 14 ani."
\`\`\`

## :wrench: Format string

\`\`\`csharp
double pret = 19.99;
string s = $"Preț: {pret:F2} lei";  // "Preț: 19.99 lei"
string h = $"{42:X}";                // "2A" (hex)
string p = $"{0.5:P}";               // "50.00 %"
\`\`\`

## :bulb: Split și Join

\`\`\`csharp
string csv = "Ana,Mihai,Ioana";
string[] nume = csv.Split(',');
// ["Ana", "Mihai", "Ioana"]

string r = string.Join(" - ", nume);
// "Ana - Mihai - Ioana"
\`\`\`

## :gear: StringBuilder (eficient pt concatenări multiple)

\`\`\`csharp
using System.Text;

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.Append(i + ",");
string rezultat = sb.ToString();
\`\`\`

> :warning: \`s += x\` în loop e LENT (creează string nou de fiecare dată). Folosește \`StringBuilder\`.

## :books: Conversii

| De la | La | Cum |
|-------|----|----|
| string | int | \`int.Parse(s)\` sau \`int.TryParse(s, out int x)\` |
| string | double | \`double.Parse(s)\` |
| int | string | \`x.ToString()\` sau \`$"{x}"\` |
| char | int | \`(int)c\` |

## :white_check_mark: Verificare null/empty

\`\`\`csharp
if (string.IsNullOrEmpty(s)) ...
if (string.IsNullOrWhiteSpace(s)) ...
\`\`\`
`,
  problems: [
    mc('Lungime',
      'Cum afli lungimea unui string?',
      ['s.Length', 's.Length()', 'len(s)', 's.Size'], 's.Length',
      'String.Length este o **proprietate** (fără paranteze).', { topic: T }),
    mc('Interpolation',
      'Care e sintaxa pentru interpolare?',
      ['"{nume}"', '$"{nume}"', '@"{nume}"', '#nume#'], '$"{nume}"',
      'Prefixul `$` activează interpolarea. Folosești `{variabila}`.', { topic: T }),
    mc('Substring',
      'Ce returnează `"hello".Substring(1, 3)`?',
      ['"hel"', '"ell"', '"llo"', '"ello"'], '"ell"',
      'Începe de la index 1 (`e`) și ia 3 caractere: e, l, l.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Split',
      'Ce returnează `"a,b,c".Split(\',\')`?',
      ['"abc"', 'Un array {"a", "b", "c"}', '3', 'Lista de chars'],
      'Un array {"a", "b", "c"}',
      'Split returnează `string[]`.', { topic: T }),
    mc('StringBuilder',
      'Pentru concatenări REPETATE (mii) ce e mai eficient?',
      ['s += x', 'string.Concat', 'StringBuilder', 'string.Format'],
      'StringBuilder',
      'StringBuilder evită crearea de string-uri intermediare.', { topic: T }),
    sa('To upper',
      'Ce metodă convertește un string la majuscule?',
      'ToUpper',
      '`s.ToUpper()` returnează un nou string în majuscule.', { topic: T }),
    sa('Conversie int',
      'Ce metodă convertește string-ul "42" la int?',
      'int.Parse',
      '`int.Parse("42")` → 42. Pentru siguranță folosește `TryParse`.',
      { topic: T }),
    code('Inversare string',
      'Citește un cuvânt și afișează-l inversat. (Hint: `new string(s.Reverse().ToArray())` din System.Linq.)',
      'csharp',
      `using System;
using System.Linq;

class Program {
    static void Main() {
        string s = Console.ReadLine();
        
        // TODO: inversează și afișează
    }
}`,
      '`Console.WriteLine(new string(s.Reverse().ToArray()));`',
      { topic: T, difficulty: 'EASY' }),
    code('Numără vocale',
      'Citește un cuvânt și afișează numărul de vocale (case-insensitive).',
      'csharp',
      `using System;

class Program {
    static void Main() {
        string s = Console.ReadLine().ToLower();
        int vocale = 0;
        
        // TODO: parcurge și verifică a, e, i, o, u
        
        Console.WriteLine(vocale);
    }
}`,
      '`foreach (char c in s) if ("aeiou".Contains(c)) vocale++;`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Split sumă',
      'Citește o linie cu numere separate prin virgulă (ex: "1,2,3,4,5"). Afișează suma.',
      'csharp',
      `using System;

class Program {
    static void Main() {
        string linie = Console.ReadLine();
        int suma = 0;
        
        // TODO: split, parse fiecare, adună
        
        Console.WriteLine(suma);
    }
}`,
      '`foreach (var s in linie.Split(\',\')) suma += int.Parse(s);`',
      { topic: T, difficulty: 'MEDIUM', points: 25 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 15: Recursivitate
// ────────────────────────────────────────────────────────────────────────────
const recursivitateCs = {
  title: 'Recursivitate',
  slug: 'recursivitate-cs',
  isFree: false,
  theory: `# :infinity: Recursivitate în C#

O funcție **recursivă** se cheamă pe sine însăși.

## :rocket: Structura

\`\`\`csharp
static int Functie(int n) {
    if (cazBaza) return ...;          // OPRIRE
    return ... Functie(n - 1) ...;    // APEL RECURSIV
}
\`\`\`

## :memo: Exemplu — Factorial

\`\`\`csharp
static long Factorial(int n) {
    if (n <= 1) return 1;
    return n * Factorial(n - 1);
}

Console.WriteLine(Factorial(5)); // 120
\`\`\`

## :star: Exemple clasice

**Suma de la 1 la n:**
\`\`\`csharp
static int Suma(int n) {
    if (n == 0) return 0;
    return n + Suma(n - 1);
}
\`\`\`

**Fibonacci:**
\`\`\`csharp
static int Fib(int n) {
    if (n <= 1) return n;
    return Fib(n - 1) + Fib(n - 2);
}
\`\`\`

**Putere:**
\`\`\`csharp
static long Putere(int a, int n) {
    if (n == 0) return 1;
    return a * Putere(a, n - 1);
}
\`\`\`

## :white_check_mark: Reguli de aur

1. **Cazul de bază** (oprire) — fără el → \`StackOverflowException\`
2. **Apropie problema** de cazul de bază
3. Asigură-te că **se termină** pentru orice intrare

## :bulb: Recursiv vs Iterativ

| Recursiv | Iterativ |
|----------|----------|
| Cod elegant | Cod mai lung |
| Folosește call stack | Folosește variabile |
| Mai lent (de obicei) | Mai rapid |
| Natural pt divide & conquer | Natural pt loop |

## :wrench: Optimizare — memoization

Pentru \`Fibonacci\` cu n mare, recursivitatea simplă e foarte lentă (recalculări). Soluție: cache.

\`\`\`csharp
static Dictionary<int, long> cache = new();

static long FibFast(int n) {
    if (n <= 1) return n;
    if (cache.ContainsKey(n)) return cache[n];
    return cache[n] = FibFast(n - 1) + FibFast(n - 2);
}
\`\`\`

## :rotating_light: Capcane

- Fără caz de bază → StackOverflow
- Recursivitate prea adâncă → StackOverflow
- Recursivitate fără memoization pentru probleme cu suprapuneri → exponențial
`,
  problems: [
    mc('Definiție', 'O funcție recursivă...',
      ['Are doar parametri', 'Se cheamă pe sine', 'Returnează un array', 'E mai rapidă'],
      'Se cheamă pe sine', 'Definiția fundamentală.', { topic: T }),
    mc('Caz de bază',
      'De ce e necesar?',
      ['Pentru lizibilitate', 'Pentru a opri recursivitatea', 'Pentru viteză', 'Nu e necesar'],
      'Pentru a opri recursivitatea',
      'Fără caz de bază: StackOverflowException.', { topic: T }),
    mc('Excepție',
      'Ce excepție arunci dacă recursivitatea nu se oprește?',
      ['NullException', 'StackOverflowException', 'OutOfMemory', 'InvalidOperation'],
      'StackOverflowException',
      'Stiva de apeluri se umple → StackOverflow.', { topic: T }),
    mc('Factorial(0)', 'Cât e Factorial(0) în convenția standard?',
      ['0', '1', '-1', 'eroare'], '1',
      '0! = 1 prin convenție matematică.', { topic: T }),
    mc('Fib(8)', 'Cu Fib(0)=0, Fib(1)=1, cât e Fib(8)?',
      ['13', '21', '34', '55'], '21',
      '0,1,1,2,3,5,8,13,21 → Fib(8) = **21**.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Optimizare', 'Cum se numește tehnica de cache pentru funcții recursive?',
      'memoization',
      'Memoization = reține rezultate calculate pentru a evita recalculul.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Suma 1..5',
      'Cu `int S(int n) { if(n==0) return 0; return n + S(n-1); }`, cât e `S(5)`?',
      '15',
      '5+4+3+2+1+0 = 15.', { topic: T }),
    code('Factorial recursiv',
      'Implementează `static long Factorial(int n)` recursiv. Citește n, afișează n!.',
      'csharp',
      `using System;

class Program {
    static long Factorial(int n) {
        // TODO
    }
    
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        Console.WriteLine(Factorial(n));
    }
}`,
      '`if (n <= 1) return 1; return n * Factorial(n - 1);`',
      { topic: T, difficulty: 'EASY' }),
    code('Suma cifrelor recursiv',
      'Implementează `static int SumaCifre(int n)` recursiv. Citește n, afișează suma cifrelor.',
      'csharp',
      `using System;

class Program {
    static int SumaCifre(int n) {
        // TODO: caz de bază n==0; recursiv n%10 + SumaCifre(n/10)
    }
    
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        Console.WriteLine(SumaCifre(n));
    }
}`,
      '`if (n == 0) return 0; return n % 10 + SumaCifre(n / 10);`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Putere recursivă',
      'Implementează `static long Putere(int a, int n)` recursiv. Citește a și n, afișează a^n.',
      'csharp',
      `using System;

class Program {
    static long Putere(int a, int n) {
        // TODO
    }
    
    static void Main() {
        var p = Console.ReadLine().Split(' ');
        int a = int.Parse(p[0]);
        int n = int.Parse(p[1]);
        Console.WriteLine(Putere(a, n));
    }
}`,
      '`if (n == 0) return 1; return a * Putere(a, n - 1);`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 16: Lucru cu fișiere
// ────────────────────────────────────────────────────────────────────────────
const fisiereCs = {
  title: 'Lucru cu Fișiere — System.IO',
  slug: 'fisiere-cs',
  isFree: false,
  theory: `# :file_folder: Lucru cu fișiere în C#

C# face lucrul cu fișiere foarte simplu cu \`System.IO\`.

## :rocket: Citire rapidă

\`\`\`csharp
using System.IO;

string text = File.ReadAllText("date.txt");          // tot fișierul
string[] linii = File.ReadAllLines("date.txt");      // array de linii
\`\`\`

## :memo: Scriere rapidă

\`\`\`csharp
File.WriteAllText("out.txt", "Hello");                          // suprascrie
File.WriteAllLines("out.txt", new[] {"linia 1", "linia 2"});    // suprascrie
File.AppendAllText("log.txt", "linie nouă\\n");                  // adaugă
\`\`\`

## :star: StreamReader / StreamWriter (fișiere mari)

\`\`\`csharp
using (var sr = new StreamReader("date.txt")) {
    string linie;
    while ((linie = sr.ReadLine()) != null) {
        Console.WriteLine(linie);
    }
}

using (var sw = new StreamWriter("out.txt")) {
    sw.WriteLine("primul rând");
    sw.WriteLine("al doilea rând");
}
\`\`\`

> :bulb: \`using\` închide automat fișierul la final, chiar și în caz de excepție.

## :wrench: Verificări utile

\`\`\`csharp
if (File.Exists("date.txt")) ...
if (Directory.Exists("folder")) ...
File.Delete("vechi.txt");
File.Copy("a.txt", "b.txt");
\`\`\`

## :books: Path — manipulare căi

\`\`\`csharp
string p = Path.Combine("data", "file.txt");   // "data/file.txt"
string ext = Path.GetExtension("foto.jpg");     // ".jpg"
string nume = Path.GetFileNameWithoutExtension("foto.jpg"); // "foto"
\`\`\`

## :gear: Tipic — citire număr + procesare

\`\`\`csharp
using System;
using System.IO;

class Program {
    static void Main() {
        string[] linii = File.ReadAllLines("input.txt");
        int n = int.Parse(linii[0]);
        long suma = 0;
        for (int i = 1; i <= n; i++)
            suma += int.Parse(linii[i]);
        File.WriteAllText("output.txt", suma.ToString());
    }
}
\`\`\`

## :white_check_mark: try/catch pentru fișiere

\`\`\`csharp
try {
    string t = File.ReadAllText("date.txt");
} catch (FileNotFoundException) {
    Console.WriteLine("Fișier inexistent");
} catch (IOException e) {
    Console.WriteLine($"Eroare IO: {e.Message}");
}
\`\`\`

## :warning: Diferențe vs C/C++

| Limbaj | API |
|--------|-----|
| C | \`fopen\` / \`fscanf\` / \`fclose\` |
| C++ | \`ifstream\` / \`ofstream\` |
| **C#** | \`File.ReadAllText\` / \`StreamReader\` |
`,
  problems: [
    mc('Namespace IO', 'Ce namespace conține clasele pentru fișiere?',
      ['System.File', 'System.IO', 'System.Disk', 'System.Storage'], 'System.IO',
      'Toate clasele de fișier sunt în `System.IO`.', { topic: T }),
    mc('Citire rapidă',
      'Cum citești tot conținutul unui fișier într-un string?',
      ['File.Read("a.txt")', 'File.ReadAllText("a.txt")', 'File.LoadString', 'new File("a.txt").Read()'],
      'File.ReadAllText("a.txt")',
      'Metoda statică `File.ReadAllText`.', { topic: T }),
    mc('Verificare existență',
      'Cum verifici dacă un fișier există?',
      ['File.Has("a.txt")', 'File.Exists("a.txt")', 'new File("a.txt").Ok', 'File.Check("a.txt")'],
      'File.Exists("a.txt")',
      '`File.Exists(path)` returnează bool.', { topic: T }),
    mc('using',
      'La ce folosește `using (var sr = new StreamReader(...)) { ... }`?',
      ['Importă namespace', 'Asigură închiderea automată a resursei', 'Optimizează codul', 'Definește alias'],
      'Asigură închiderea automată a resursei',
      'Apelează automat `Dispose()` (care face Close).', { topic: T, difficulty: 'MEDIUM' }),
    mc('Excepție fișier inexistent',
      'Ce excepție se aruncă dacă încerci să citești un fișier care nu există?',
      ['NullReferenceException', 'FileNotFoundException', 'IOException', 'NoSuchFileException'],
      'FileNotFoundException',
      'Tipul specific din System.IO.', { topic: T }),
    sa('Append', 'Ce metodă ADAUGĂ text la finalul unui fișier (fără să suprascrie)?',
      'File.AppendAllText',
      'Metoda statică pentru append.', { topic: T }),
    sa('Linii ca array',
      'Ce metodă citește toate liniile unui fișier într-un string[]?',
      'File.ReadAllLines',
      'Returnează un array cu fiecare linie ca element.', { topic: T }),
    code('Copie fișier',
      'Citește numele a 2 fișiere de la stdin (sursa și destinația). Copiază conținutul cu File.ReadAllText / File.WriteAllText.',
      'csharp',
      `using System;
using System.IO;

class Program {
    static void Main() {
        string sursa = Console.ReadLine();
        string dest = Console.ReadLine();
        
        // TODO: citește din sursa și scrie în dest
    }
}`,
      '`File.WriteAllText(dest, File.ReadAllText(sursa));`',
      { topic: T, difficulty: 'EASY' }),
    code('Suma din fișier',
      'În "input.txt" pe prima linie e n, apoi n linii cu câte un întreg. Calculează suma și scrie-o în "output.txt".',
      'csharp',
      `using System;
using System.IO;

class Program {
    static void Main() {
        string[] linii = File.ReadAllLines("input.txt");
        int n = int.Parse(linii[0]);
        long suma = 0;
        
        // TODO: parcurge liniile 1..n și adună
        
        File.WriteAllText("output.txt", suma.ToString());
    }
}`,
      '`for (int i = 1; i <= n; i++) suma += int.Parse(linii[i]);`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Numără linii',
      'Citește numele unui fișier de la stdin și afișează numărul de linii din el (folosind File.ReadAllLines.Length).',
      'csharp',
      `using System;
using System.IO;

class Program {
    static void Main() {
        string fisier = Console.ReadLine();
        
        // TODO: dacă există, afișează numărul de linii; altfel "Inexistent"
        
    }
}`,
      '`if (File.Exists(fisier)) Console.WriteLine(File.ReadAllLines(fisier).Length); else Console.WriteLine("Inexistent");`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 17: Delegates & Events
// ────────────────────────────────────────────────────────────────────────────
const delegatesEvents = {
  title: 'Delegates și Events',
  slug: 'delegates-events',
  isFree: false,
  theory: `# :electric_plug: Delegates și Events în C#

Un **delegate** este un "tip de funcție" — îți permite să stochezi o referință la o metodă și s-o apelezi mai târziu.

## :rocket: Definirea unui delegate

\`\`\`csharp
delegate int Operatie(int a, int b);

static int Aduna(int a, int b) => a + b;
static int Inmulteste(int a, int b) => a * b;

Operatie op = Aduna;
Console.WriteLine(op(3, 4));     // 7

op = Inmulteste;
Console.WriteLine(op(3, 4));     // 12
\`\`\`

## :memo: Func<> și Action<>

În loc să-ți definești delegate-uri, folosește cele predefinite:

\`\`\`csharp
Func<int, int, int> add = (a, b) => a + b;
Action<string> afisare = msg => Console.WriteLine(msg);
Predicate<int> esteParBuc = x => x % 2 == 0;
\`\`\`

| Tip | Returnează | Note |
|-----|-----------|------|
| \`Func<...>\` | DA (ultimul tip generic) | Pentru funcții |
| \`Action<...>\` | NU (void) | Pentru proceduri |
| \`Predicate<T>\` | bool | Pentru filtre |

## :star: Lambda expressions

\`\`\`csharp
Func<int, int> patrat = x => x * x;
Func<int, int, int> max = (a, b) => a > b ? a : b;

Action salutare = () => Console.WriteLine("Salut!");
\`\`\`

## :wrench: Events — pattern observer

\`\`\`csharp
class Buton {
    public event Action OnClick;
    
    public void Apasa() {
        OnClick?.Invoke();
    }
}

var b = new Buton();
b.OnClick += () => Console.WriteLine("Butonul a fost apăsat!");
b.Apasa();   // declanșează event-ul
\`\`\`

## :bulb: Events cu argumente

\`\`\`csharp
class Senzor {
    public event Action<double> Schimbare;
    
    public void Citeste(double valoare) {
        Schimbare?.Invoke(valoare);
    }
}

var s = new Senzor();
s.Schimbare += v => Console.WriteLine($"Valoare nouă: {v}");
s.Citeste(23.5);
\`\`\`

## :gear: Multicast delegates

Un delegate poate referenția **mai multe** metode:

\`\`\`csharp
Action toate = () => Console.Write("A ");
toate += () => Console.Write("B ");
toate += () => Console.Write("C ");

toate();   // A B C
\`\`\`

## :books: La ce folosește?

| Situație | Delegate / Event |
|----------|------------------|
| Callback (apelează când termini) | Action / Func |
| UI buttons | Events |
| Sortare custom | Comparison<T> |
| Filtrare | Predicate<T> / Func<T,bool> |
| Strategy pattern | Func / interfețe |

## :white_check_mark: Cu LINQ

\`\`\`csharp
var pare = lista.Where(x => x % 2 == 0);          // Func<int, bool>
var dublate = lista.Select(x => x * 2);            // Func<int, int>
\`\`\`
`,
  problems: [
    mc('Delegate este',
      'Un delegate în C# este:',
      ['O clasă specială', 'O variabilă care stochează referințe la metode', 'Un tip primitiv', 'O constantă'],
      'O variabilă care stochează referințe la metode',
      'Delegate = "pointer la funcție" type-safe.', { topic: T }),
    mc('Func<int,int>',
      'Ce reprezintă `Func<int, int>`?',
      ['Funcție cu 2 parametri int', 'Funcție cu 1 parametru int care returnează int', 'Funcție cu return int', 'Tablou de 2 int-uri'],
      'Funcție cu 1 parametru int care returnează int',
      'În `Func<...>`, ULTIMUL tip generic e tipul de return. Restul = parametri.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Action returnează',
      'Action<T> returnează:',
      ['T', 'int', 'void (nimic)', 'bool'], 'void (nimic)',
      'Action e pentru proceduri (fără return).', { topic: T }),
    mc('Lambda sintaxa',
      'Care e sintaxa lambda corectă?',
      ['x = > x + 1', 'x => x + 1', 'lambda x: x + 1', 'function(x) { return x + 1 }'],
      'x => x + 1',
      'Sintaxa C#: `(parametri) => expresie` (sau `{ instructiuni }`).', { topic: T }),
    mc('Event subscribe',
      'Cum înregistrezi un handler pe un event?',
      ['event = handler', 'event.Add(handler)', 'event += handler', 'event.Subscribe(handler)'],
      'event += handler',
      'Operatorul `+=` adaugă un handler la lista event-ului.', { topic: T }),
    sa('Predicate<T>', 'Predicate<T> returnează ce tip?',
      'bool', 'Predicate este `Func<T, bool>` — pentru filtre.', { topic: T }),
    sa('Apel sigur event', 'Care e operatorul folosit pentru a apela un event în siguranță (când e null)?',
      '?.',
      '`event?.Invoke()` apelează doar dacă event nu e null.', { topic: T, difficulty: 'MEDIUM' }),
    code('Folosire Func',
      'Definește un `Func<int, int> patrat = x => x * x;`. Citește n, afișează patrat(n).',
      'csharp',
      `using System;

class Program {
    static void Main() {
        Func<int, int> patrat = // TODO
        
        int n = int.Parse(Console.ReadLine());
        Console.WriteLine(patrat(n));
    }
}`,
      '`Func<int, int> patrat = x => x * x;`',
      { topic: T, difficulty: 'EASY' }),
    code('Action multiplu',
      'Definește un `Action<string> afisare`. Înregistrează DOUĂ comportamente: să afișeze cu Console.WriteLine și să afișeze cu prefix "LOG: ". Apoi apelează afisare("Test").',
      'csharp',
      `using System;

class Program {
    static void Main() {
        Action<string> afisare = msg => Console.WriteLine(msg);
        
        // TODO: adaugă încă un comportament cu prefix "LOG: "
        
        afisare("Test");
    }
}`,
      '`afisare += msg => Console.WriteLine("LOG: " + msg);` — apoi apelul afișează ambele.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Predicate filtrare',
      'Definește `Predicate<int> esteImpar = ...`. Citește 5 numere; afișează doar pe cele care satisfac predicate-ul, separate prin spațiu.',
      'csharp',
      `using System;

class Program {
    static void Main() {
        Predicate<int> esteImpar = // TODO
        
        for (int i = 0; i < 5; i++) {
            int x = int.Parse(Console.ReadLine());
            if (esteImpar(x)) Console.Write(x + " ");
        }
    }
}`,
      '`Predicate<int> esteImpar = x => x % 2 != 0;`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 18: Tuple și Records
// ────────────────────────────────────────────────────────────────────────────
const tupleRecords = {
  title: 'Tuple și Records',
  slug: 'tuple-records',
  isFree: false,
  theory: `# :package: Tuple și Records în C#

## :rocket: Tuple — grupezi mai multe valori rapid

\`\`\`csharp
(int, string) elev = (14, "Ana");
Console.WriteLine(elev.Item1);   // 14
Console.WriteLine(elev.Item2);   // Ana
\`\`\`

## :memo: Tuple cu nume

\`\`\`csharp
(int varsta, string nume) elev = (14, "Ana");
Console.WriteLine(elev.varsta);   // 14
Console.WriteLine(elev.nume);     // Ana
\`\`\`

## :star: Returnare multiplă din funcție

\`\`\`csharp
(int min, int max) GasesteMinMax(int[] v) {
    return (v.Min(), v.Max());
}

var (mn, mx) = GasesteMinMax(new[] {3, 1, 4, 1, 5});
Console.WriteLine($"min={mn}, max={mx}");
\`\`\`

## :wrench: Deconstrucție

\`\`\`csharp
var punct = (3, 4);
var (x, y) = punct;
\`\`\`

## :books: Records (C# 9+) — clase imutabile concise

\`\`\`csharp
record Persoana(string Nume, int Varsta);

var p1 = new Persoana("Ana", 14);
var p2 = new Persoana("Ana", 14);

Console.WriteLine(p1 == p2);     // true (compară valoric!)
Console.WriteLine(p1);            // Persoana { Nume = Ana, Varsta = 14 }
\`\`\`

## :bulb: Records vs Class

| Records | Class |
|---------|-------|
| Imutabile by default | Mutabile |
| Compară pe **VALORI** | Compară pe **REFERINȚE** |
| ToString automat | Trebuie scris |
| Pentru DTO-uri și date | Pentru obiecte cu logică |
| Sintaxă concisă | Sintaxă completă |

## :gear: Records cu metode

\`\`\`csharp
record Cerc(double Raza) {
    public double Aria => 3.14159 * Raza * Raza;
}

var c = new Cerc(5);
Console.WriteLine(c.Aria);    // 78.54
\`\`\`

## :white_check_mark: with — copie cu modificări

\`\`\`csharp
var ana = new Persoana("Ana", 14);
var anaPesteUnAn = ana with { Varsta = 15 };
\`\`\`

## :rainbow: Când folosești ce?

| Situație | Folosește |
|----------|-----------|
| Returnare temporară 2-3 valori | Tuple |
| Date imutabile (Persoana, Punct) | Record |
| Obiect cu state și metode | Class |
| Singleton sau helper | Static class |
`,
  problems: [
    mc('Sintaxa tuple',
      'Care e sintaxa pentru un tuple cu un int și un string?',
      ['Tuple<int, string>', '(int, string)', '[int, string]', '{int, string}'],
      '(int, string)',
      'Sintaxa modernă cu paranteze.', { topic: T }),
    mc('Record',
      'Ce face un record diferit față de o clasă?',
      [
        'E mai rapid',
        'Compară pe valori (nu referințe), e imutabil',
        'Permite mai multe câmpuri',
        'Nu permite metode',
      ],
      'Compară pe valori (nu referințe), e imutabil',
      'Records: value equality + immutability + sintaxă scurtă.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Tuple cu nume',
      'Care declarație e corectă pentru tuple cu câmpuri numite?',
      [
        '(int.varsta, string.nume) e = ...',
        '(int varsta, string nume) e = ...',
        '{varsta: int, nume: string} e = ...',
        'Tuple(varsta=int, nume=string) e',
      ],
      '(int varsta, string nume) e = ...',
      'Numele câmpurilor după tipul lor între paranteze.', { topic: T }),
    mc('Item1',
      'Pentru `(int, string) t = (14, "Ana");`, cum accesezi 14?',
      ['t[0]', 't.Item1', 't.First', 't.Get(0)'],
      't.Item1',
      'Tuple-urile fără nume folosesc Item1, Item2, etc.', { topic: T }),
    mc('with',
      'Ce face `var p2 = p1 with { Varsta = 20 };`?',
      ['Modifică p1', 'Creează o copie a lui p1 cu Varsta=20', 'Aruncă excepție', 'Compară p1 cu 20'],
      'Creează o copie a lui p1 cu Varsta=20',
      'Operatorul `with` creează o nouă instanță cu modificări.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Cuvânt cheie record',
      'Ce cuvânt cheie definește un record?', 'record',
      'Sintaxa: `record Nume(Param1, Param2);`.', { topic: T }),
    sa('Deconstrucție',
      'Pentru `var t = (3, 4);` cum extragi cele 2 valori în x și y?',
      'var (x, y) = t',
      'Sintaxa de deconstrucție: `var (x, y) = tuple;`.',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Returnare multiplă',
      'Scrie metoda `static (int min, int max) MinMax(int[] v)` care returnează minimul și maximul. Citește n + n numere, afișează "min max" separat prin spațiu.',
      'csharp',
      `using System;
using System.Linq;

class Program {
    static (int min, int max) MinMax(int[] v) {
        // TODO
    }
    
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        int[] v = new int[n];
        for (int i = 0; i < n; i++) v[i] = int.Parse(Console.ReadLine());
        
        var (mn, mx) = MinMax(v);
        Console.WriteLine($"{mn} {mx}");
    }
}`,
      '`return (v.Min(), v.Max());`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Record Persoana',
      'Definește `record Persoana(string Nume, int Varsta);`. Creează 2 persoane cu aceleași date. Afișează rezultatul comparării lor (== returnează true sau false).',
      'csharp',
      `using System;

// TODO: definește record Persoana

class Program {
    static void Main() {
        var p1 = new Persoana("Ana", 14);
        var p2 = new Persoana("Ana", 14);
        Console.WriteLine(p1 == p2);
    }
}`,
      '`record Persoana(string Nume, int Varsta);` — afișează `True` (compară valoric).',
      { topic: T, difficulty: 'EASY' }),
    code('with copie',
      'Definește `record Punct(int X, int Y);`. Citește 2 numere x și y; creează un Punct, apoi unul nou cu X=0 (folosind `with`); afișează ambele.',
      'csharp',
      `using System;

record Punct(int X, int Y);

class Program {
    static void Main() {
        int x = int.Parse(Console.ReadLine());
        int y = int.Parse(Console.ReadLine());
        
        var original = new Punct(x, y);
        // TODO: var modificat = original with { X = 0 };
        
        Console.WriteLine(original);
        // Console.WriteLine(modificat);
    }
}`,
      '`var modificat = original with { X = 0 };`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 19: Pattern matching
// ────────────────────────────────────────────────────────────────────────────
const patternMatching = {
  title: 'Pattern Matching',
  slug: 'pattern-matching',
  isFree: false,
  theory: `# :mag: Pattern Matching în C#

C# modern oferă un **switch expression** și pattern matching foarte puternic.

## :rocket: Switch expression (C# 8+)

\`\`\`csharp
string descriere = nota switch {
    >= 9 => "Excelent",
    >= 7 => "Bine",
    >= 5 => "Suficient",
    _ => "Insuficient"
};
\`\`\`

## :memo: Vechi vs nou

**Vechi (statement):**
\`\`\`csharp
string desc;
switch (nota) {
    case >= 9: desc = "Excelent"; break;
    case >= 7: desc = "Bine"; break;
    default: desc = "Altele"; break;
}
\`\`\`

**Nou (expression):**
\`\`\`csharp
string desc = nota switch {
    >= 9 => "Excelent",
    >= 7 => "Bine",
    _ => "Altele"
};
\`\`\`

## :star: Type pattern (verifică tipul)

\`\`\`csharp
object obj = 42;

string r = obj switch {
    int i => $"Int: {i}",
    string s => $"String: {s}",
    null => "Null",
    _ => "Necunoscut"
};
\`\`\`

## :wrench: Property pattern

\`\`\`csharp
record Persoana(string Nume, int Varsta);

string categorie = persoana switch {
    { Varsta: < 18 } => "Minor",
    { Varsta: >= 18 and < 65 } => "Adult",
    { Varsta: >= 65 } => "Vârstnic",
    _ => "Necunoscut"
};
\`\`\`

## :bulb: Tuple pattern

\`\`\`csharp
string evaluare = (nota, prezenta) switch {
    (>= 9, > 80) => "Excelent",
    (>= 7, > 60) => "Bine",
    (_, < 50) => "Absențe multe",
    _ => "Acceptabil"
};
\`\`\`

## :gear: is pattern (verificare în if)

\`\`\`csharp
if (obj is int n && n > 10) {
    Console.WriteLine($"Int > 10: {n}");
}

if (obj is string { Length: > 5 } s) {
    Console.WriteLine($"String lung: {s}");
}
\`\`\`

## :books: when (filtru extra)

\`\`\`csharp
string r = nota switch {
    int n when n < 0 => "Invalid",
    int n when n <= 4 => "Picat",
    int n when n <= 10 => "Promovat",
    _ => "Altele"
};
\`\`\`

## :white_check_mark: Pattern matching cu list (C# 11+)

\`\`\`csharp
int[] v = {1, 2, 3};
string d = v switch {
    [] => "Gol",
    [_] => "Un element",
    [_, _] => "Două elemente",
    [1, .., 3] => "Începe cu 1, termină cu 3",
    _ => "Mai mult"
};
\`\`\`

## :rainbow: Avantaje

- Cod mult mai concis
- Type-safe
- Cazurile exhaustive (compilatorul te avertizează)
- Funcțional, ușor de citit
`,
  problems: [
    mc('Switch expression',
      'Care e operatorul folosit în switch expression?',
      ['->', '=>', '::', ':'], '=>',
      'Sintaxa: `valoare switch { caz => rezultat }`.', { topic: T }),
    mc('Default',
      'Ce reprezintă `_` într-un switch expression?',
      ['Variabilă privată', 'Default (orice altceva)', 'Null', 'Constanta zero'],
      'Default (orice altceva)',
      'Underscore = "discard" / "anything else".', { topic: T }),
    mc('Pattern range',
      'Care e sintaxa pentru "nota între 7 și 9"?',
      ['7 <= n <= 9', '>= 7 and < 9', '7..9', 'between(7, 9)'],
      '>= 7 and < 9',
      'Pattern combinat cu `and`.', { topic: T, difficulty: 'MEDIUM' }),
    mc('is pattern',
      'Ce face `if (obj is int n) { ... }`?',
      ['Verifică doar tipul', 'Verifică tipul ȘI atribuie obj cast la n', 'Aruncă excepție', 'Compară obj cu n'],
      'Verifică tipul ȘI atribuie obj cast la n',
      'Combinat: type check + assignment.', { topic: T, difficulty: 'MEDIUM' }),
    mc('when',
      'La ce folosește `when` în switch?',
      ['Definește o variabilă', 'Adaugă o condiție extra', 'Iterează', 'Apelează o funcție'],
      'Adaugă o condiție extra',
      '`case X when (condiție)` — match doar dacă și condiția e true.', { topic: T }),
    sa('Property pattern sintaxa',
      'Care e simbolul folosit pentru property pattern (verifică un câmp al obiectului)?',
      '{}',
      'Acolade: `{ Varsta: > 18 }`.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Switch tradițional',
      'Cum se numește versiunea tradițională (cu `case`/`break`)?',
      'switch statement',
      'Switch statement = vechi; switch expression = nou (cu `=>`).',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Categorii vârstă',
      'Citește o vârstă și folosind switch expression afișează: < 13 → "copil", 13-17 → "adolescent", 18-64 → "adult", >= 65 → "varstnic".',
      'csharp',
      `using System;

class Program {
    static void Main() {
        int v = int.Parse(Console.ReadLine());
        
        string cat = // TODO: switch expression
        
        Console.WriteLine(cat);
    }
}`,
      '`v switch { < 13 => "copil", < 18 => "adolescent", < 65 => "adult", _ => "varstnic" }`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Tip object',
      'Scrie o metodă `static string Descrie(object obj)` care folosește switch expression cu type pattern: int → "număr", string → "text", bool → "logic", null → "null", _ → "altceva". În main testeaz-o cu 42, "Hello", true.',
      'csharp',
      `using System;

class Program {
    static string Descrie(object obj) {
        // TODO: switch expression cu type pattern
    }
    
    static void Main() {
        Console.WriteLine(Descrie(42));
        Console.WriteLine(Descrie("Hello"));
        Console.WriteLine(Descrie(true));
    }
}`,
      'Sintaxa: `obj switch { int => "număr", string => "text", bool => "logic", null => "null", _ => "altceva" }`',
      { topic: T, difficulty: 'HARD', points: 30 }),
    code('Notă cu when',
      'Citește o notă (1-10) și afișează: "Picat" dacă < 5, "Trecut" dacă 5-7, "Bine" dacă 8-9, "Excelent" dacă 10. Folosește switch expression cu when.',
      'csharp',
      `using System;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        
        string rez = // TODO: switch cu when sau patterns
        
        Console.WriteLine(rez);
    }
}`,
      'Cu patterns: `n switch { < 5 => "Picat", < 8 => "Trecut", < 10 => "Bine", 10 => "Excelent", _ => "Invalid" }`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 20: Nullable types & null safety
// ────────────────────────────────────────────────────────────────────────────
const nullSafety = {
  title: 'Nullable Types & Null Safety',
  slug: 'nullable-types',
  isFree: false,
  theory: `# :no_entry: Null Safety în C#

\`null\` e una dintre cele mai mari surse de bug-uri. C# modern oferă **nullable reference types** și operatori speciali pentru a-ți face viața mai sigură.

## :rocket: Nullable value types

\`\`\`csharp
int x = null;        // EROARE — int nu poate fi null
int? y = null;       // OK — Nullable<int>
y = 42;
Console.WriteLine(y.HasValue);   // true
Console.WriteLine(y.Value);       // 42
\`\`\`

## :memo: Nullable reference types (C# 8+)

În proiecte moderne (cu \`<Nullable>enable</Nullable>\` în .csproj):

\`\`\`csharp
string nume = null;      // WARNING — string nu trebuie null
string? nume = null;     // OK — explicit nullable
\`\`\`

## :star: Operatori utili

| Operator | Ce face |
|----------|---------|
| \`?.\` | Null-conditional (acces sigur) |
| \`??\` | Null-coalescing (default) |
| \`??=\` | Atribuire dacă e null |
| \`!\` | Null-forgiving (promit că nu e null) |

## :bulb: ?. (null-conditional)

\`\`\`csharp
string nume = null;
int? lung = nume?.Length;   // null (nu crash)

// Echivalent cu:
int? lung = (nume == null) ? (int?) null : nume.Length;
\`\`\`

## :wrench: ?? (default value)

\`\`\`csharp
string nume = null;
string afisat = nume ?? "Anonim";    // "Anonim"
\`\`\`

## :gear: ??= (atribuie dacă e null)

\`\`\`csharp
string nume = null;
nume ??= "Default";     // nume devine "Default"

string altul = "Ana";
altul ??= "Default";    // rămâne "Ana"
\`\`\`

## :books: ! (null-forgiving operator)

\`\`\`csharp
string? maybe = GetSomething();
int n = maybe!.Length;       // promit compilatorului că nu e null
\`\`\`

> :warning: Folosit greșit duce la \`NullReferenceException\` la runtime.

## :white_check_mark: Pattern null

\`\`\`csharp
if (obj is null) ...
if (obj is not null) ...

string descriere = obj switch {
    null => "lipsește",
    _ => "există"
};
\`\`\`

## :rainbow: Bune practici

| ✅ Recomandare | ❌ Anti-pattern |
|---------------|----------------|
| Verifică null înainte de utilizare | Folosește direct și speră |
| Folosește \`?.\` și \`??\` | If-uri lungi pentru null check |
| Returnează colecții goale, nu null | Returnezi null pentru "fără elemente" |
| Folosește \`string.IsNullOrEmpty\` | \`s == null \|\| s == ""\` |
| Activează nullable reference types | Las-o pe complacencă |

## :rotating_light: NullReferenceException

Cea mai comună excepție în .NET. Cauze:

\`\`\`csharp
string s = null;
s.Length;            // BOOM
\`\`\`

Cu null safety modern:
\`\`\`csharp
string? s = null;
int len = s?.Length ?? 0;   // SAFE
\`\`\`
`,
  problems: [
    mc('Sintaxă nullable',
      'Cum declari un int nullable?',
      ['int n = null', 'int? n = null', 'nullable int n', 'Nullable n = null'],
      'int? n = null',
      '`int?` = `Nullable<int>`. Permite null.', { topic: T }),
    mc('Operator ?.',
      'Ce face `obj?.Length`?',
      [
        'Aruncă excepție dacă obj e null',
        'Returnează null dacă obj e null, altfel obj.Length',
        'Returnează 0 dacă obj e null',
        'Forțează obj să nu fie null',
      ],
      'Returnează null dacă obj e null, altfel obj.Length',
      'Null-conditional: previne NullReferenceException.', { topic: T }),
    mc('Operator ??',
      'Ce face `nume ?? "Default"`?',
      ['Compară nume cu Default', 'Returnează "Default" dacă nume e null', 'Aruncă excepție', 'Atribuie Default lui nume'],
      'Returnează "Default" dacă nume e null',
      'Null-coalescing: alege prima valoare ne-null.', { topic: T }),
    mc('Operator ??=',
      'Ce face `x ??= "valoare"`?',
      ['Compară', 'Atribuie "valoare" lui x dacă x e null', 'Verifică egalitatea', 'Înlocuiește mereu x'],
      'Atribuie "valoare" lui x dacă x e null',
      'Atribuie doar dacă curent e null.', { topic: T, difficulty: 'MEDIUM' }),
    mc('Excepție null',
      'Care e excepția aruncată când accesezi un membru pe null?',
      ['NullException', 'NullReferenceException', 'ArgumentNullException', 'NoValueException'],
      'NullReferenceException',
      'NRE = cea mai comună excepție în .NET.', { topic: T }),
    sa('Pattern null',
      'Care e sintaxa pentru "obj is null"?',
      'is null',
      '`if (obj is null)` — pattern matching pentru null.', { topic: T }),
    sa('Verifică gol/null',
      'Care metodă verifică dacă un string e null SAU empty?',
      'string.IsNullOrEmpty',
      '`string.IsNullOrEmpty(s)` returnează true pentru null sau "".', { topic: T }),
    code('Default cu ??',
      'Citește un string. Dacă e gol, afișează "ANONIM"; altfel afișează string-ul (folosind operatorul `??`).',
      'csharp',
      `using System;

class Program {
    static void Main() {
        string? input = Console.ReadLine();
        
        // TODO: tratează null/empty cu ??
        
    }
}`,
      '`string rezultat = string.IsNullOrWhiteSpace(input) ? "ANONIM" : input; Console.WriteLine(rezultat);` sau cu `??`.',
      { topic: T, difficulty: 'EASY' }),
    code('Acces sigur',
      'Definește `string? nume = null;`. Folosește `?.` pentru a obține lungimea (sau null), apoi `??` pentru a afișa 0 dacă e null.',
      'csharp',
      `using System;

class Program {
    static void Main() {
        string? nume = null;
        
        int lung = // TODO: nume?.Length ?? 0
        
        Console.WriteLine(lung);
    }
}`,
      '`int lung = nume?.Length ?? 0;`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Nullable int',
      'Definește `int? n = null;`. Citește un string; dacă conține un număr valid, atribuie-l lui n; afișează `n.HasValue` și `n.GetValueOrDefault(0)`.',
      'csharp',
      `using System;

class Program {
    static void Main() {
        int? n = null;
        string? input = Console.ReadLine();
        
        // TODO: dacă int.TryParse reușește, atribuie n
        
        Console.WriteLine(n.HasValue);
        Console.WriteLine(n.GetValueOrDefault(0));
    }
}`,
      '`if (int.TryParse(input, out int x)) n = x;`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 21: Extension methods
// ────────────────────────────────────────────────────────────────────────────
const extensionMethods = {
  title: 'Extension Methods',
  slug: 'extension-methods',
  isFree: false,
  theory: `# :hammer: Extension Methods în C#

Extension methods îți permit să **adaugi metode noi** la tipuri existente fără să le modifici.

## :rocket: Definirea unei extensii

\`\`\`csharp
public static class StringExtensions {
    public static bool IsPalindrome(this string s) {
        for (int i = 0; i < s.Length / 2; i++) {
            if (s[i] != s[s.Length - 1 - i]) return false;
        }
        return true;
    }
}

// Folosire:
"abcba".IsPalindrome();   // true
\`\`\`

## :memo: Reguli

1. Trebuie să fie într-o **clasă static**
2. Metoda trebuie să fie **static**
3. Primul parametru cu **\`this\`** indică tipul extins
4. Apel: \`obiect.MetodaExt(restul argumentelor)\`

## :star: Exemple utile

**Pe int:**
\`\`\`csharp
public static class IntExtensions {
    public static bool IsEven(this int n) => n % 2 == 0;
    public static int Square(this int n) => n * n;
}

3.IsEven();    // false
5.Square();    // 25
\`\`\`

**Pe List<T>:**
\`\`\`csharp
public static class ListExtensions {
    public static T Random<T>(this List<T> list) {
        var rnd = new Random();
        return list[rnd.Next(list.Count)];
    }
}

new List<int> {1,2,3,4,5}.Random();  // valoare random
\`\`\`

## :wrench: Cu LINQ

LINQ folosește extension methods pe \`IEnumerable<T>\`:

\`\`\`csharp
lista.Where(x => x > 5)         // extension method
     .Select(x => x * 2)        // extension method
     .ToList();                  // extension method
\`\`\`

## :bulb: Discovery — cu using

Extensiile sunt vizibile doar dacă ai **using namespace-ul** lor:

\`\`\`csharp
using System.Linq;   // pentru .Where, .Select, etc.
using MyProject.Extensions;  // pentru extensiile tale
\`\`\`

## :books: Avantaje

| Avantaj | Detaliu |
|---------|---------|
| Cod mai natural | \`s.IsPalindrome()\` vs \`Helper.IsPalindrome(s)\` |
| Adaugi funcționalitate la tipuri sigilate | Poți "extinde" string, int, List |
| Fluent API | Înlănțuire de apeluri (.Where().Select().Sum()) |
| Discoverable | Apar în IntelliSense |

## :warning: Anti-patterns

❌ **NU** abuza extension methods (multă magie ascunsă).

❌ **NU** crea extensii pentru tipuri pe care le controlezi tu (folosește metode normale).

✅ Folosește pentru tipuri care **nu pot fi modificate** (string, int, etc).

## :rainbow: Combo cu nullable

\`\`\`csharp
public static bool IsNullOrShort(this string? s) {
    return string.IsNullOrEmpty(s) || s.Length < 3;
}

string? n = null;
n.IsNullOrShort();   // true (extension methods funcționează pe null!)
\`\`\`
`,
  problems: [
    mc('Marker',
      'Care cuvânt cheie marchează un parametru ca "tipul extins" într-o extension method?',
      ['extension', 'this', 'extends', 'on'], 'this',
      '`this Tip param` — primul parametru cu `this` indică tipul extins.', { topic: T }),
    mc('Container',
      'Extension methods trebuie definite într-o:',
      ['Clasă normală', 'Clasă static', 'Interfață', 'Struct'],
      'Clasă static',
      'Containerul trebuie să fie clasă `static`.', { topic: T }),
    mc('Metoda trebuie să fie',
      'Extension method însăși trebuie să fie:',
      ['public', 'static', 'virtual', 'abstract'], 'static',
      'Metoda statică, în clasă statică.', { topic: T }),
    mc('Discovery',
      'Cum face IntelliSense să vadă extension method-urile dintr-un alt fișier?',
      ['Sunt mereu vizibile', 'Cu `using` namespace-ul lor', 'Doar în același fișier', 'Cu attribute special'],
      'Cu `using` namespace-ul lor',
      'La fel ca orice alt tip, ai nevoie de `using`.', { topic: T }),
    mc('LINQ',
      'Metodele LINQ (Where, Select, Sum) sunt:',
      ['Built-in în compilator', 'Extension methods pe IEnumerable<T>', 'Funcții globale', 'Statice non-extensii'],
      'Extension methods pe IEnumerable<T>',
      'LINQ e implementat cu extension methods.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Sintaxa apel',
      'Cum se apelează o extension method `IsPalindrome` pe string-ul "abc"?',
      '"abc".IsPalindrome()',
      'Sintaxa naturală — exact ca o metodă normală.', { topic: T }),
    sa('Namespace LINQ',
      'În ce namespace sunt metodele LINQ standard?',
      'System.Linq',
      '`using System.Linq;` deschide accesul la Where, Select, etc.', { topic: T }),
    code('Extensie IsEven',
      'Definește o extensie `IsEven()` pe int. În main, citește un n și afișează "True" sau "False" cu n.IsEven().',
      'csharp',
      `using System;

public static class IntExt {
    // TODO: public static bool IsEven(this int n) => ...
}

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        Console.WriteLine(n.IsEven());
    }
}`,
      '`public static bool IsEven(this int n) => n % 2 == 0;`',
      { topic: T, difficulty: 'EASY' }),
    code('Extensie Reverse string',
      'Definește o extensie `Inversat()` pe string care returnează string-ul inversat. Citește un cuvânt și afișează-l inversat.',
      'csharp',
      `using System;
using System.Linq;

public static class StringExt {
    // TODO: public static string Inversat(this string s) => ...
}

class Program {
    static void Main() {
        string s = Console.ReadLine();
        Console.WriteLine(s.Inversat());
    }
}`,
      '`public static string Inversat(this string s) => new string(s.Reverse().ToArray());`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Extensie Sum custom',
      'Definește o extensie `SumPare()` pe `List<int>` care returnează suma elementelor pare. Citește n + n numere, pune-le într-o listă, afișează SumPare().',
      'csharp',
      `using System;
using System.Collections.Generic;

public static class ListExt {
    // TODO: public static int SumPare(this List<int> list) => ...
}

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        var lista = new List<int>();
        for (int i = 0; i < n; i++) lista.Add(int.Parse(Console.ReadLine()));
        Console.WriteLine(lista.SumPare());
    }
}`,
      '`public static int SumPare(this List<int> list) { int s=0; foreach(var x in list) if(x%2==0) s+=x; return s; }`',
      { topic: T, difficulty: 'HARD', points: 30 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 22: Multithreading basics
// ────────────────────────────────────────────────────────────────────────────
const multithreading = {
  title: 'Multithreading — Threads Basics',
  slug: 'multithreading',
  isFree: false,
  theory: `# :twisted_rightwards_arrows: Multithreading în C#

Multithreading îți permite să **rulezi mai multe operații simultan**.

## :rocket: Thread simplu

\`\`\`csharp
using System.Threading;

Thread t = new Thread(() => {
    for (int i = 0; i < 5; i++) {
        Console.WriteLine($"Thread: {i}");
        Thread.Sleep(100);
    }
});
t.Start();

// Main continuă în paralel
for (int i = 0; i < 5; i++) {
    Console.WriteLine($"Main: {i}");
    Thread.Sleep(100);
}

t.Join();   // așteaptă thread-ul să termine
\`\`\`

## :memo: Thread.Sleep

\`\`\`csharp
Thread.Sleep(1000);   // 1 secundă
Thread.Sleep(TimeSpan.FromSeconds(2));
\`\`\`

## :star: Task — modern și recomandat

\`\`\`csharp
using System.Threading.Tasks;

Task t = Task.Run(() => {
    Console.WriteLine("Rulează în background");
});

t.Wait();  // așteaptă finalizarea
\`\`\`

## :wrench: Task cu rezultat

\`\`\`csharp
Task<int> calcul = Task.Run(() => {
    Thread.Sleep(1000);
    return 42;
});

int rez = calcul.Result;   // așteaptă și returnează
\`\`\`

## :bulb: Mai multe task-uri în paralel

\`\`\`csharp
var task1 = Task.Run(() => OperatieGrea(1));
var task2 = Task.Run(() => OperatieGrea(2));
var task3 = Task.Run(() => OperatieGrea(3));

Task.WaitAll(task1, task2, task3);
\`\`\`

## :gear: Thread-safe cu lock

Când mai multe thread-uri scriu pe aceeași variabilă, ai **race conditions**:

\`\`\`csharp
int contor = 0;
object syncLock = new object();

Parallel.For(0, 1000, i => {
    lock (syncLock) {
        contor++;
    }
});
// fără lock, rezultatul ar fi nedefinit
\`\`\`

## :books: Parallel.For / Parallel.ForEach

\`\`\`csharp
Parallel.For(0, 1000, i => {
    // rulează paralelizat
    Process(i);
});

Parallel.ForEach(lista, item => {
    Process(item);
});
\`\`\`

## :white_check_mark: Capcane comune

| Capcană | Soluție |
|---------|---------|
| Race condition | \`lock\` sau \`Interlocked\` |
| Deadlock | Evită lock imbricat; ordine fixă |
| UI freeze | Folosește \`async/await\`, nu \`.Wait()\` |
| Excepții ne-prinse | try/catch în task |

## :rainbow: Async vs Threads

| Threads | async/await |
|---------|-------------|
| OS-level | Compiler-magic |
| Heavy (1MB+ stack) | Lightweight |
| Pentru CPU-bound | Pentru IO-bound |
| Folosești manual | Mai natural |

> :bulb: Pentru aplicații moderne, prefera **\`async/await\`** și **\`Task\`** în loc de \`Thread\` direct.
`,
  problems: [
    mc('Namespace Thread',
      'Ce namespace conține clasa `Thread`?',
      ['System.Concurrency', 'System.Threading', 'System.Tasks', 'System.Parallel'],
      'System.Threading',
      '`Thread` este în `System.Threading`.', { topic: T }),
    mc('Pornire',
      'Ce metodă pornește un thread?',
      ['Run()', 'Start()', 'Begin()', 'Execute()'], 'Start()',
      '`thread.Start()`.', { topic: T }),
    mc('Sleep',
      'Cum oprești thread-ul curent timp de 1 secundă?',
      ['Wait(1000)', 'Pause(1000)', 'Thread.Sleep(1000)', 'Hold(1000)'],
      'Thread.Sleep(1000)',
      'Sleep primește milisecunde.', { topic: T }),
    mc('Așteaptă terminare',
      'Cum aștepți ca un thread să termine?',
      ['t.Wait()', 't.Join()', 't.End()', 't.Block()'], 't.Join()',
      '`Join()` blochează thread-ul curent până când t termină.', { topic: T }),
    mc('Recomandat modern',
      'Care e recomandat în C# modern?',
      ['Thread', 'Task', 'BackgroundWorker', 'ThreadPool direct'],
      'Task',
      '`Task` (cu async/await) e abstracția modernă.', { topic: T }),
    sa('Race condition',
      'Cum se numește problema când mai multe thread-uri scriu pe aceeași variabilă?',
      'race condition',
      'Race condition = bug-ul fundamental al programării concurente.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Sincronizare',
      'Ce cuvânt cheie creează o secțiune critică (un thread la un moment dat)?',
      'lock',
      '`lock (obj) { ... }` asigură acces exclusiv.', { topic: T }),
    code('Task simplu',
      'Pornește un Task care afișează "Background" după ce face Thread.Sleep(100). În main, după t.Wait(), afișează "Done".',
      'csharp',
      `using System;
using System.Threading;
using System.Threading.Tasks;

class Program {
    static void Main() {
        // TODO: Task.Run(() => { Sleep, WriteLine })
        // TODO: t.Wait();
        
        Console.WriteLine("Done");
    }
}`,
      '`var t = Task.Run(() => { Thread.Sleep(100); Console.WriteLine("Background"); }); t.Wait();`',
      { topic: T, difficulty: 'EASY' }),
    code('Task cu rezultat',
      'Creează un Task<int> care face `Thread.Sleep(50)` și returnează 42. Afișează rezultatul cu .Result.',
      'csharp',
      `using System;
using System.Threading;
using System.Threading.Tasks;

class Program {
    static void Main() {
        Task<int> t = // TODO: Task.Run(() => { ... return 42; })
        
        Console.WriteLine(t.Result);
    }
}`,
      '`Task.Run(() => { Thread.Sleep(50); return 42; })`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Parallel.For',
      'Folosind Parallel.For, calculează suma 0..99 într-un long suma. Folosește lock pentru thread-safety. Afișează suma (=4950).',
      'csharp',
      `using System;
using System.Threading.Tasks;

class Program {
    static void Main() {
        long suma = 0;
        object syncLock = new object();
        
        // TODO: Parallel.For(0, 100, i => { lock(syncLock) suma += i; });
        
        Console.WriteLine(suma);
    }
}`,
      '`Parallel.For(0, 100, i => { lock (syncLock) suma += i; });`',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 23: JSON Serialization
// ────────────────────────────────────────────────────────────────────────────
const jsonSerialization = {
  title: 'JSON — Serializare și Deserializare',
  slug: 'json-serialization',
  isFree: false,
  theory: `# :package: JSON în C# (System.Text.Json)

JSON este formatul standard pentru schimbul de date pe Web. C# modern oferă \`System.Text.Json\` (rapid, integrat).

## :rocket: Serializare (object → JSON)

\`\`\`csharp
using System.Text.Json;

var p = new { Nume = "Ana", Varsta = 14 };
string json = JsonSerializer.Serialize(p);
// {"Nume":"Ana","Varsta":14}
\`\`\`

## :memo: Deserializare (JSON → object)

\`\`\`csharp
record Persoana(string Nume, int Varsta);

string json = "{\\"Nume\\":\\"Ana\\",\\"Varsta\\":14}";
var p = JsonSerializer.Deserialize<Persoana>(json);
Console.WriteLine(p.Nume);    // Ana
\`\`\`

## :star: Pretty print

\`\`\`csharp
var options = new JsonSerializerOptions {
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};
string json = JsonSerializer.Serialize(p, options);
\`\`\`

## :wrench: Liste / array-uri

\`\`\`csharp
var lista = new List<Persoana> {
    new("Ana", 14),
    new("Mihai", 13)
};

string json = JsonSerializer.Serialize(lista);
// [{"Nume":"Ana",...},{"Nume":"Mihai",...}]

var inapoi = JsonSerializer.Deserialize<List<Persoana>>(json);
\`\`\`

## :bulb: Salvare/citire fișier

\`\`\`csharp
File.WriteAllText("data.json", JsonSerializer.Serialize(lista));

string text = File.ReadAllText("data.json");
var loaded = JsonSerializer.Deserialize<List<Persoana>>(text);
\`\`\`

## :gear: Atribute pentru control

\`\`\`csharp
using System.Text.Json.Serialization;

class Produs {
    [JsonPropertyName("name")]
    public string Nume { get; set; }
    
    [JsonIgnore]
    public string Secret { get; set; }
}
\`\`\`

## :books: Newtonsoft.Json (Json.NET) — alternativă

Foarte populară, mai veche, mai flexibilă:

\`\`\`csharp
using Newtonsoft.Json;

string json = JsonConvert.SerializeObject(obj);
var obj = JsonConvert.DeserializeObject<MyClass>(json);
\`\`\`

| System.Text.Json | Newtonsoft.Json |
|------------------|-----------------|
| Built-in (.NET Core 3+) | Necesită NuGet |
| Mai rapid | Mai flexibil |
| Strict | Permisiv |

## :white_check_mark: Cazuri tipice

**API REST:**
\`\`\`csharp
var response = await httpClient.GetStringAsync(url);
var data = JsonSerializer.Deserialize<MyDto>(response);
\`\`\`

**Configuration:**
\`\`\`csharp
var config = JsonSerializer.Deserialize<Config>(File.ReadAllText("config.json"));
\`\`\`

## :warning: Capcane

- Nume case-sensitive (default) — folosește \`PropertyNameCaseInsensitive = true\`
- Date complexe → folosește atribute
- Cycles (referințe circulare) → \`ReferenceHandler.Preserve\`
`,
  problems: [
    mc('Namespace JSON',
      'Care e namespace-ul standard pentru JSON în .NET modern?',
      ['Newtonsoft.Json', 'System.Json', 'System.Text.Json', 'System.IO.Json'],
      'System.Text.Json',
      '`System.Text.Json` e built-in din .NET Core 3.', { topic: T }),
    mc('Serializare',
      'Cum convertești un obiect la JSON string?',
      ['JsonSerializer.Serialize(obj)', 'obj.ToJson()', 'new Json(obj)', 'JsonConvert(obj)'],
      'JsonSerializer.Serialize(obj)',
      'Metoda statică `Serialize`.', { topic: T }),
    mc('Deserializare',
      'Cum convertești un JSON string la obiect de tip Persoana?',
      [
        'JsonSerializer.Deserialize(json)',
        'JsonSerializer.Deserialize<Persoana>(json)',
        'new Persoana(json)',
        'Persoana.Parse(json)',
      ],
      'JsonSerializer.Deserialize<Persoana>(json)',
      'Generica T indică tipul de destinație.', { topic: T }),
    mc('Pretty print',
      'Care opțiune face JSON-ul indentat (frumos formatat)?',
      ['Format = true', 'Pretty = true', 'WriteIndented = true', 'Indent = true'],
      'WriteIndented = true',
      'Opțiunea `WriteIndented` în `JsonSerializerOptions`.', { topic: T }),
    mc('Atribut ignore',
      'Care atribut omite o proprietate din serializare?',
      ['[Ignore]', '[JsonIgnore]', '[Skip]', '[NoSerialize]'],
      '[JsonIgnore]',
      'Atribut din `System.Text.Json.Serialization`.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Numele alternativ',
      'Care e biblioteca veche dar foarte populară pentru JSON în .NET (NuGet)?',
      'Newtonsoft.Json',
      'Newtonsoft.Json (Json.NET) — extrem de populară încă.', { topic: T, difficulty: 'MEDIUM' }),
    sa('Format pe disc',
      'În ce format se salvează tipic JSON pe disc?',
      '.json',
      'Extensia standardă `.json`.', { topic: T }),
    code('Serializează obiect',
      'Definește `record Carte(string Titlu, int An);`. Creează `new Carte("C# Magic", 2024)` și afișează JSON-ul rezultat.',
      'csharp',
      `using System;
using System.Text.Json;

record Carte(string Titlu, int An);

class Program {
    static void Main() {
        var c = new Carte("C# Magic", 2024);
        
        // TODO: serializează și afișează
    }
}`,
      '`Console.WriteLine(JsonSerializer.Serialize(c));`',
      { topic: T, difficulty: 'EASY' }),
    code('Deserializare listă',
      'Citește un JSON string de la stdin care reprezintă o listă de obiecte `{Nume:string, Varsta:int}` (ex: `[{"Nume":"Ana","Varsta":14}]`). Deserializează la `List<Persoana>` și afișează numele primei persoane.',
      'csharp',
      `using System;
using System.Collections.Generic;
using System.Text.Json;

record Persoana(string Nume, int Varsta);

class Program {
    static void Main() {
        string json = Console.ReadLine();
        
        // TODO: deserializare la List<Persoana> și afișează lista[0].Nume
    }
}`,
      '`var lista = JsonSerializer.Deserialize<List<Persoana>>(json); Console.WriteLine(lista[0].Nume);`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Pretty print',
      'Definește `record Produs(string Nume, double Pret);`. Creează un produs și serializează-l cu `WriteIndented = true`. Afișează rezultatul.',
      'csharp',
      `using System;
using System.Text.Json;

record Produs(string Nume, double Pret);

class Program {
    static void Main() {
        var p = new Produs("Cafea", 12.5);
        var options = new JsonSerializerOptions { /* TODO */ };
        
        // TODO: serializează cu options și afișează
    }
}`,
      '`new JsonSerializerOptions { WriteIndented = true };` + `JsonSerializer.Serialize(p, options)`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 24: Unit Testing basics
// ────────────────────────────────────────────────────────────────────────────
const unitTesting = {
  title: 'Unit Testing — Bazele Testării',
  slug: 'unit-testing',
  isFree: false,
  theory: `# :white_check_mark: Unit Testing în C#

Testele automate îți **garantează** că codul tău funcționează corect — și **continuă** să funcționeze după modificări.

## :rocket: Framework-uri populare

| Framework | Note |
|-----------|------|
| **xUnit** | Cel mai modern, recomandat |
| **NUnit** | Veteran, foarte popular |
| **MSTest** | Built-in cu Visual Studio |

## :memo: Structura unui test (xUnit)

\`\`\`csharp
using Xunit;

public class CalculatorTests {
    [Fact]
    public void Aduna_DouaPositive_ReturneazaSuma() {
        // Arrange
        var calc = new Calculator();
        
        // Act
        int rezultat = calc.Aduna(2, 3);
        
        // Assert
        Assert.Equal(5, rezultat);
    }
}
\`\`\`

## :star: Pattern AAA

| Etapă | Scop |
|-------|------|
| **Arrange** | Pregătește datele și obiectele |
| **Act** | Execută acțiunea testată |
| **Assert** | Verifică rezultatul |

## :wrench: Assertions comune

\`\`\`csharp
Assert.Equal(expected, actual);
Assert.NotEqual(notExpected, actual);
Assert.True(condition);
Assert.False(condition);
Assert.Null(obj);
Assert.NotNull(obj);
Assert.Throws<ExceptionType>(() => action());
Assert.Contains("substr", "fullstring");
Assert.Empty(collection);
Assert.Single(collection);
\`\`\`

## :bulb: [Theory] — teste cu mai multe inputuri

\`\`\`csharp
[Theory]
[InlineData(2, 3, 5)]
[InlineData(0, 0, 0)]
[InlineData(-1, 1, 0)]
public void Aduna_TestMultiplu(int a, int b, int suma) {
    Assert.Equal(suma, new Calculator().Aduna(a, b));
}
\`\`\`

## :gear: Test naming convention

\`\`\`
Metoda_Conditie_RezultatAsteptat

Aduna_DouaPositive_ReturneazaSuma()
Imparte_LaZero_AruncaExceptie()
\`\`\`

## :books: De ce să scrii teste?

| Beneficiu | Explicație |
|-----------|-----------|
| Bug-uri prinse devreme | Mai ieftine de reparat |
| Refactoring sigur | Modifică fără frică |
| Documentație vie | Testele arată cum se folosește codul |
| Încredere | Știi că totul funcționează |
| Design mai bun | Cod testabil = cod cu responsabilități clare |

## :white_check_mark: Test Driven Development (TDD)

1. :red_circle: Scrii testul (eșuează — nimic nu există)
2. :green_circle: Scrii cod minim ca testul să treacă
3. :large_blue_circle: Refactorezi pentru cod curat

## :rainbow: Mocking — fake objects

Pentru a izola testul de dependențe externe (DB, API):

\`\`\`csharp
// Cu Moq
var mock = new Mock<IRepository>();
mock.Setup(x => x.GetUser(1)).Returns(new User { Name = "Test" });

var service = new UserService(mock.Object);
var user = service.GetUser(1);

Assert.Equal("Test", user.Name);
\`\`\`

## :rotating_light: Anti-patterns

❌ Teste lente (depind de DB real)
❌ Teste flaky (eșuează random)
❌ Un test care testează multe lucruri
❌ Teste fără assert
❌ Teste care depind unul de altul

## :hammer: Setup proiect

\`\`\`bash
dotnet new xunit -n MyTests
dotnet add package Moq
dotnet test
\`\`\`
`,
  problems: [
    mc('Atribut test xUnit',
      'Care atribut marchează o metodă ca test în xUnit?',
      ['[Test]', '[Fact]', '[TestMethod]', '[Spec]'], '[Fact]',
      'xUnit folosește `[Fact]` pentru un test simplu.', { topic: T }),
    mc('Pattern AAA',
      'Ce înseamnă AAA?',
      ['Always Add Asserts', 'Arrange Act Assert', 'Auto Async Await', 'Add Action Argument'],
      'Arrange Act Assert',
      'Pattern de structurare a testelor.', { topic: T }),
    mc('Assert egalitate',
      'Care e sintaxa pentru a verifica că rezultatul e egal cu 5?',
      ['Assert.Is(5, rez)', 'Assert.Equal(5, rez)', 'Assert.Same(5, rez)', 'rez.Should().Be(5)'],
      'Assert.Equal(5, rez)',
      'Sintaxa xUnit: `Assert.Equal(expected, actual)`.', { topic: T }),
    mc('Multiple inputuri',
      'Care atribut permite rularea aceluiași test cu mai multe seturi de date?',
      ['[Fact]', '[Theory]', '[Multiple]', '[Repeat]'], '[Theory]',
      '`[Theory]` + `[InlineData(...)]` pentru parametrizare.', { topic: T, difficulty: 'MEDIUM' }),
    mc('TDD',
      'TDD înseamnă:',
      ['Test-Driven Development', 'Type-Defined Design', 'Total Domain Definition', 'Test-Defined Doc'],
      'Test-Driven Development',
      'Scrii întâi testul, apoi codul.', { topic: T }),
    sa('Verifica excepție',
      'Cum verifici că o acțiune aruncă `InvalidOperationException`?',
      'Assert.Throws<InvalidOperationException>(() => action())',
      'Assert.Throws<T> verifică tipul excepției.',
      { topic: T, difficulty: 'MEDIUM' }),
    sa('Naming',
      'Care e convenția de denumire pentru teste? (Metoda_Conditie_____)',
      'RezultatAsteptat',
      '`Metoda_Conditie_RezultatAsteptat` — descriptiv și clar.', { topic: T }),
    code('Test simplu',
      'Scrie un test xUnit pentru o funcție `Suma(a, b)` care returnează a+b. Testează că Suma(2,3) === 5. (NU rula efectiv testul — doar scrie codul testului în main pentru demo.)',
      'csharp',
      `using System;

public class Calculator {
    public int Suma(int a, int b) => a + b;
}

class Program {
    static void Main() {
        // Simulăm un test
        var calc = new Calculator();
        int rez = calc.Suma(2, 3);
        
        // TODO: verifică dacă rez == 5 și afișează "PASS" sau "FAIL"
    }
}`,
      '`if (rez == 5) Console.WriteLine("PASS"); else Console.WriteLine("FAIL");`',
      { topic: T, difficulty: 'EASY' }),
    code('Pattern AAA',
      'Implementează un test (în main pentru simplitate) folosind pattern AAA pentru o funcție `Inversare(s)` care întoarce string-ul. Verifică pentru "abc" → "cba".',
      'csharp',
      `using System;
using System.Linq;

public class Helper {
    public string Inversare(string s) => new string(s.Reverse().ToArray());
}

class Program {
    static void Main() {
        // Arrange
        var helper = new Helper();
        string input = "abc";
        string asteptat = "cba";
        
        // Act
        string rezultat = // TODO
        
        // Assert
        // TODO: afișează "PASS" sau "FAIL"
    }
}`,
      '`string rezultat = helper.Inversare(input); if (rezultat == asteptat) Console.WriteLine("PASS"); else Console.WriteLine("FAIL");`',
      { topic: T, difficulty: 'MEDIUM' }),
    code('Multiple cazuri',
      'Pentru funcția `EsteImpar(n)`, simulează 3 teste (în main): pentru 1 → true, 4 → false, 7 → true. Pentru fiecare afișează "Test N: PASS/FAIL".',
      'csharp',
      `using System;

public class Helper {
    public bool EsteImpar(int n) => n % 2 != 0;
}

class Program {
    static void Test(Helper h, int input, bool asteptat, int nr) {
        bool actual = h.EsteImpar(input);
        Console.WriteLine($"Test {nr}: {(actual == asteptat ? "PASS" : "FAIL")}");
    }
    
    static void Main() {
        var h = new Helper();
        // TODO: 3 apeluri Test(h, ..., ..., ...)
    }
}`,
      '`Test(h, 1, true, 1); Test(h, 4, false, 2); Test(h, 7, true, 3);`',
      { topic: T, difficulty: 'MEDIUM' }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// LECȚIA 25: Bune practici recap
// ────────────────────────────────────────────────────────────────────────────
const bunePracticiCs = {
  title: 'Bune Practici C# — Recap Final',
  slug: 'bune-practici-cs',
  isFree: false,
  theory: `# :star2: Bune practici C#

După tot acest curs, iată **principiile** pe care le respectă programatorii C# profesioniști.

## :rocket: 1. Folosește C# modern

\`\`\`csharp
// Vechi
var lista = new List<int>();
lista.Add(1); lista.Add(2); lista.Add(3);

// Modern
var lista = new List<int> { 1, 2, 3 };
\`\`\`

## :memo: 2. Records pentru date imutabile

\`\`\`csharp
// În loc de:
class Persoana {
    public string Nume { get; init; }
    public int Varsta { get; init; }
    // + Equals + GetHashCode + ToString...
}

// Folosește:
record Persoana(string Nume, int Varsta);
\`\`\`

## :star: 3. Properties cu \`init\`

\`\`\`csharp
public class Produs {
    public string Nume { get; init; }    // setezi doar la construire
    public double Pret { get; set; }      // poți modifica
}
\`\`\`

## :wrench: 4. var pentru tipuri lungi

\`\`\`csharp
// Verbose
Dictionary<string, List<Persoana>> grupuri = new Dictionary<string, List<Persoana>>();

// Curat
var grupuri = new Dictionary<string, List<Persoana>>();
\`\`\`

## :bulb: 5. async/await pentru IO

\`\`\`csharp
// RĂU (UI freeze)
var data = httpClient.GetStringAsync(url).Result;

// BUN
var data = await httpClient.GetStringAsync(url);
\`\`\`

## :gear: 6. LINQ pentru manipulare colecții

\`\`\`csharp
// Loop manual
var rezultat = new List<int>();
foreach (var x in lista)
    if (x > 5) rezultat.Add(x * 2);

// LINQ
var rezultat = lista.Where(x => x > 5).Select(x => x * 2).ToList();
\`\`\`

## :books: 7. String interpolation

\`\`\`csharp
// Vechi
string s = "Ana are " + varsta + " ani.";

// Modern
string s = $"Ana are {varsta} ani.";
\`\`\`

## :white_check_mark: 8. Null safety

\`\`\`csharp
// Activează în .csproj: <Nullable>enable</Nullable>

string? nume = null;
int lung = nume?.Length ?? 0;
\`\`\`

## :rainbow: 9. Exception handling specific

\`\`\`csharp
// RĂU
try { ... } catch { }                    // ignoră tot

// BUN
try { ... } 
catch (FileNotFoundException) { ... }
catch (IOException ex) { Log(ex); throw; }
\`\`\`

## :hammer: 10. Folosește \`using\` pentru resurse

\`\`\`csharp
// Auto-cleanup
using var stream = File.OpenRead("date.txt");
\`\`\`

## :no_entry: Anti-patterns frecvente

| Anti-pattern | Soluția |
|--------------|---------|
| God class (face de toate) | Single Responsibility |
| Nume scurte (\`a\`, \`b\`, \`tmp\`) | Nume descriptive |
| Magic numbers | Constante: \`const int MAX_USERS = 100;\` |
| Comentarii explicând ce face | Cod auto-explicativ |
| Retorn de coduri în loc de excepții | Excepții sau Result<T> |
| Static peste tot | Dependency Injection |

## :bulb: SOLID Principles

- **S**ingle Responsibility — o clasă = o responsabilitate
- **O**pen/Closed — deschis pentru extindere, închis pentru modificare
- **L**iskov Substitution — clasele derivate trebuie să poată înlocui clasa de bază
- **I**nterface Segregation — interfețe mici, focusate
- **D**ependency Inversion — depinde de abstracții, nu de implementări

## :books: Ce să înveți mai departe

- :rocket: **ASP.NET Core** — pentru web (API REST, MVC, Razor Pages)
- :books: **Entity Framework Core** — pentru baze de date
- :wrench: **Blazor** — UI-uri web cu C# (SPA)
- :gear: **MAUI** — aplicații mobile/desktop cross-platform
- :star: **Microservices** cu .NET
- :hammer: **Cloud** — Azure, AWS
- :rainbow: **Game development** — Unity (folosește C#!)

## :tada: Felicitări!

Ai parcurs un curs complet de C# — de la \`Hello World\` până la concepte avansate ca pattern matching, async/await, LINQ, JSON, multithreading și unit testing. C# e un limbaj **excelent** pentru tot: aplicații desktop, web, mobile, jocuri (Unity!), cloud, AI.

**Continuă să exersezi**! Programarea se învață scriind cod, nu doar citind. :rocket:
`,
  problems: [
    mc('Records', 'Records sunt potrivite pentru:',
      ['Logică complexă', 'Date imutabile (DTO-uri)', 'Singleton', 'Threading'],
      'Date imutabile (DTO-uri)',
      'Records: value equality + immutability + sintaxă concisă.', { topic: T }),
    mc('var',
      'Cuvântul cheie `var`:',
      ['Înseamnă "variabil"', 'Deduce tipul din context', 'E echivalent cu object', 'Nu există'],
      'Deduce tipul din context',
      'Compilatorul deduce tipul exact din valoare.', { topic: T }),
    mc('async/await',
      'async/await e ideal pentru:',
      ['CPU-bound work', 'IO-bound work (rețea, disk)', 'Loops', 'Math intensiv'],
      'IO-bound work (rețea, disk)',
      'async/await elimină blocarea în timp ce aștepți IO.', { topic: T, difficulty: 'MEDIUM' }),
    mc('LINQ',
      'LINQ înseamnă:',
      ['Logical Integrated Query', 'Language-Integrated Query', 'Linked Query', 'Linear Query'],
      'Language-Integrated Query',
      'LINQ permite query-uri direct în C#.', { topic: T }),
    mc('SOLID S',
      '"S" din SOLID înseamnă:',
      ['Strict typing', 'Single Responsibility', 'Static methods', 'Sealed classes'],
      'Single Responsibility',
      'O clasă trebuie să aibă o singură responsabilitate.', { topic: T, difficulty: 'MEDIUM' }),
    sa('null-coalescing',
      'Care operator returnează prima valoare ne-null?', '??',
      '`a ?? b` returnează a dacă nu e null, altfel b.', { topic: T }),
    sa('Resource cleanup',
      'Care e cuvântul cheie pentru auto-cleanup al resurselor?',
      'using',
      'using apelează automat Dispose().', { topic: T }),
    code('Records modern',
      'Definește `record Cerc(double Raza)` cu proprietate calculată `Aria` (PI*R²). Citește raza, afișează aria cu 2 zecimale.',
      'csharp',
      `using System;

record Cerc(double Raza) {
    // TODO: public double Aria => ...
}

class Program {
    static void Main() {
        double r = double.Parse(Console.ReadLine());
        var c = new Cerc(r);
        Console.WriteLine($"{c.Aria:F2}");
    }
}`,
      '`public double Aria => 3.14159 * Raza * Raza;`',
      { topic: T, difficulty: 'EASY' }),
    code('LINQ chain',
      'Citește n numere într-o List<int>. Folosind LINQ, returnează suma pătratelor numerelor pare. Afișează rezultatul.',
      'csharp',
      `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        var lista = new List<int>();
        for (int i = 0; i < n; i++) lista.Add(int.Parse(Console.ReadLine()));
        
        // TODO: folosește Where + Select + Sum
        int rezultat = 0;
        
        Console.WriteLine(rezultat);
    }
}`,
      '`int rezultat = lista.Where(x => x % 2 == 0).Select(x => x * x).Sum();`',
      { topic: T, difficulty: 'MEDIUM', points: 30 }),
    code('Cod modern complet',
      'Definește `record Student(string Nume, double Medie);`. Citește n studenți (Nume Medie pe linii separate). Folosind LINQ + interpolation, afișează numele studentului cu cea mai mare medie.',
      'csharp',
      `using System;
using System.Collections.Generic;
using System.Linq;

record Student(string Nume, double Medie);

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        var studenti = new List<Student>();
        
        for (int i = 0; i < n; i++) {
            var p = Console.ReadLine().Split(' ');
            studenti.Add(new Student(p[0], double.Parse(p[1])));
        }
        
        // TODO: găsește studentul cu cea mai mare medie și afișează-i numele
    }
}`,
      '`var top = studenti.OrderByDescending(s => s.Medie).First(); Console.WriteLine(top.Nume);`',
      { topic: T, difficulty: 'HARD', points: 35 }),
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// EXPORT
// ────────────────────────────────────────────────────────────────────────────
export const csharpExtras = {
  newLessons: [
    { afterSlug: 'async-await', ...tablouriList },
    { afterSlug: 'tablouri-list', ...stringAvansatCs },
    { afterSlug: 'string-avansat-cs', ...recursivitateCs },
    { afterSlug: 'recursivitate-cs', ...fisiereCs },
    { afterSlug: 'fisiere-cs', ...delegatesEvents },
    { afterSlug: 'delegates-events', ...tupleRecords },
    { afterSlug: 'tuple-records', ...patternMatching },
    { afterSlug: 'pattern-matching', ...nullSafety },
    { afterSlug: 'nullable-types', ...extensionMethods },
    { afterSlug: 'extension-methods', ...multithreading },
    { afterSlug: 'multithreading', ...jsonSerialization },
    { afterSlug: 'json-serialization', ...unitTesting },
    { afterSlug: 'unit-testing', ...bunePracticiCs },
  ],
}
