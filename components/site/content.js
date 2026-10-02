/**
 * Tot textul site-ului public (ollaenglish.md), într-un singur loc.
 * Schimbările de conținut se fac aici; componentele din components/site/
 * se ocupă doar de aspect.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ollaenglish.md').replace(/\/$/, '')

export const CONTACT = {
  phone: '+373 69 855 352',
  phoneShort: '069 855 352',
  phoneHref: 'tel:+37369855352',
  email: 'contact@ollaenglish.md',
  address: 'Calea Ieșilor 49/A, Chișinău, Moldova',
  // Profilul școlii pe Google Maps (pinul „Olla English Center")
  mapsLink: 'https://www.google.com/maps/place/Olla+English+Center/@47.0434348,28.7903032,17z/data=!3m1!4b1!4m6!3m5!1s0x40c97d511d083015:0xea574d0d95b0e6d9!8m2!3d47.0434348!4d28.7903032!16s%2Fg%2F11l22cy4xb',
  mapsEmbed: 'https://maps.google.com/maps?q=Olla+English+Center,+Calea+Ie%C8%99ilor+49%2FA,+Chi%C8%99in%C4%83u&ll=47.0434348,28.7903032&z=17&output=embed',
  // Butoanele de sub hartă: fiecare deschide locația în aplicația lui.
  // „Altă aplicație" (geo:) îi dă telefonului Android lista lui de hărți.
  mapApps: [
    { label: 'Google Maps', icon: '📍', href: 'https://www.google.com/maps/place/Olla+English+Center/@47.0434348,28.7903032,17z/data=!3m1!4b1!4m6!3m5!1s0x40c97d511d083015:0xea574d0d95b0e6d9!8m2!3d47.0434348!4d28.7903032!16s%2Fg%2F11l22cy4xb' },
    { label: 'Waze', icon: '🚗', href: 'https://waze.com/ul?ll=47.0434348,28.7903032&navigate=yes' },
    { label: 'Apple Maps', icon: '🍎', href: 'https://maps.apple.com/?q=Olla+English+Center&ll=47.0434348,28.7903032&daddr=47.0434348,28.7903032' },
    { label: 'Altă aplicație', icon: '🗺️', href: 'geo:47.0434348,28.7903032?q=47.0434348,28.7903032(Olla+English+Center)', mobileOnly: true },
  ],
}

export const NAV = [
  { label: 'Cursuri', href: '/#cursuri' },
  { label: 'Despre', href: '/#despre' },
  { label: 'Lecție de probă', href: '/#test' },
]

export const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/ollaenglishcenter/' },
  { label: 'Facebook', href: 'https://www.facebook.com/ollaenglish.cursurideengleza?locale=ro_RO' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@ollaenglishcenter' },
]

export const EYEBROW = 'OLLA English Center'

export const HERO = {
  title: 'Învață engleza prin practică, nu teorie plictisitoare',
  text: 'La OLLA English Center, cursurile sunt interactive, adaptate pentru copii și adulți, online sau offline. Începe acum și vezi diferența încă din prima lecție.',
  images: ['curs-engleza-1a.jpg', 'curs-engleza-3a.jpg', 'curs-engleza-2a.jpg'],
}

export const TICKER = ['Engleză Fluentă', 'Încredere Totală', 'Viitor Sigur']

export const NEXT_COURSE = {
  title: 'Următorul curs începe în curând!',
  text: 'Rezervă-ți locul astăzi și primești prima lecție gratuit.',
  benefits: [
    'Manuale Oxford & Cambridge incluse pentru cursurile online',
    'Conversație la fiecare lecție – nu doar gramatică',
    'Profesori certificați și atenți la progresul tău',
    'Începi să vorbești din primele săptămâni',
    'Mai multă practică, mai puțină teorie plictisitoare',
  ],
  avatars: ['t4.png', 't3.png', 't2.png', 't1.png'],
}

// Cronometrul „evergreen": fiecare vizitator vede aceeași durată, socotită de
// la prima lui vizită (4 zile 7 ore 45 de minute), apoi o ia de la capăt.
export const COUNTDOWN_SECONDS = 4 * 86400 + 7 * 3600 + 45 * 60

const KIDS_FEATURES = (frequency, duration) => [
  ['display', 'Format: Online / Offline'],
  ['calendar', frequency],
  ['clock', duration],
  ['book', 'Manuale Oxford/Cambridge (gratis online, contra cost offline)'],
  ['laugh', 'Activități interactive: jocuri, cântece, dans'],
  ['star', 'Diplomă de absolvire'],
  ['card', 'Profesori calificați internațional TESOL/TEFL'],
]

const ADULT_FEATURES = (frequency, lessons) => [
  ['display', 'Format: Online (Zoom) sau Offline (Calea Ieșilor 49/A)'],
  ['calendar', frequency],
  ['calendarDay', 'Luni/Miercuri/Vineri sau Marți/Joi/Sâmbătă'],
  ['video', lessons],
  ['personCheck', 'Grupe: Maxim 8 online, 12 offline'],
  ['book', 'Manuale Oxford/Cambridge (gratis online, contra cost offline)'],
  ['laugh', 'Multă comunicare și feedback la fiecare lecție'],
  ['star', 'Diplomă + testare finală (scrisă & orală)'],
  ['card', 'Profesori calificați internațional TESOL/TEFL'],
]

const ADULT_INTENSIVE_TEXT = 'Perfecte pentru cei care au nevoie să progreseze rapid, cursurile intensive se concentrează pe conversație și aplicarea imediată a noțiunilor. În doar câteva săptămâni vei observa rezultate clare.'

export const COURSES = {
  title: 'Cursuri de Engleză pentru Copii și Adulți - Online & Offline',
  text: 'Descoperă pachetele OLLA English Center adaptate pentru toate vârstele și nivelurile',
  tabs: [
    {
      tab: 'Engleză pentru copii (4-6 ani)',
      title: 'Engleză pentru copii 4–6 ani – învățare prin joacă și activități interactive',
      text: 'La OLLA English Center, cei mici descoperă engleza într-un mod natural, prin cântece, jocuri și povești. Cursurile sunt create special pentru preșcolari și îi ajută să-și dezvolte vocabularul, pronunția și încrederea în vorbire.',
      cards: [
        {
          label: 'Cursuri de Grup',
          name: 'Engleză pentru copii',
          age: '4–6 ANI',
          text: 'Ideal pentru copiii care vor să învețe într-un mediu prietenos și interactiv. Grupele mici asigură atenție individuală, iar copiii învață prin cântece, jocuri și activități creative, dezvoltându-și abilitățile de comunicare în limba engleză.',
          features: KIDS_FEATURES('Frecvență: 2×/săptămână', '45 min/lecție - 8 lecții/lună'),
        },
        {
          label: 'Lecții Individuale (1:1)',
          name: 'Engleză pentru copii',
          age: '4–6 ANI',
          text: 'Pentru părinții care vor rezultate mai rapide, oferim lecții individuale de engleză pentru copii. La fiecare oră, profesorul lucrează pe ritmul și nevoile copilului, folosind metode personalizate care accelerează progresul și aduc rezultate vizibile.',
          features: KIDS_FEATURES('Frecvență: 2×/săptămână', 'Durată: 30 min/lecție'),
        },
      ],
    },
    {
      tab: 'Pentru copii (7-14 ani)',
      mobile: 'Engleză pentru copii (7-14 ani)',
      title: 'Engleză pentru copii 7–14 ani – cursuri adaptate pentru școală și viața de zi cu zi',
      text: 'La OLLA English Center, copiii își dezvoltă vocabularul, gramatica și abilitățile de conversație prin exerciții practice, proiecte și jocuri educative. Cursurile îi ajută să aibă rezultate mai bune la școală și să vorbească engleza cu încredere.',
      cards: [
        {
          label: 'Lunar sau semestrial',
          name: 'Engleză pentru copii',
          age: '7-14 ANI',
          text: 'Pachetele de cursuri de engleză pentru copii 7–14 ani sunt concepute să dezvolte vocabularul, gramatica și mai ales încrederea în exprimarea orală. Fie că aleg lecții de grup sau individuale, copiii învață engleza într-un mod interactiv și aplicat.',
          features: KIDS_FEATURES('Frecvență: 3 lecții/săptămână', 'Durată: 60 min/lecție'),
        },
        {
          label: 'Lecții Individuale (1:1)',
          name: 'Engleză pentru copii',
          age: '7-14 ANI',
          text: 'Pentru un progres mai rapid și atenție 100% din partea profesorului, lecțiile individuale oferă o experiență personalizată. Accent pe comunicare, corectarea greșelilor și pregătire pentru școală sau examene.',
          features: KIDS_FEATURES('Frecvență: 3 lecții/săptămână', 'Durată: 60 min/lecție'),
        },
      ],
    },
    {
      tab: 'Engleza pentru adulți',
      title: 'Engleză pentru adulți – comunicare fluentă pentru carieră și călătorii',
      text: 'La OLLA English Center, adulții învață engleza pas cu pas, prin conversații reale, simulări și materiale Oxford & Cambridge. Cursurile sunt flexibile și adaptate obiectivelor tale: avansarea în carieră, interviuri de succes sau călătorii fără bariere.',
      cards: [
        {
          label: 'Ore Individuale (1:1)',
          name: 'Engleza adulți',
          age: 'Adulți +15 ani',
          text: 'Dacă îți dorești atenție personalizată și progres rapid, lecțiile individuale sunt cea mai bună alegere. Profesorul adaptează conținutul în funcție de nivel și obiective: engleză pentru afaceri, pregătire pentru interviuri sau conversație fluentă.',
          features: ADULT_FEATURES('Frecvență: 3 lecții/săptămână – 90 min fiecare', '20 lecții / per sub nivel ( A1.1, A1.2 etc.)'),
        },
        {
          label: 'Grup Extensiv (A1-B2)',
          name: 'Engleza adulți',
          age: 'Adulți +15 ani',
          text: ADULT_INTENSIVE_TEXT,
          features: ADULT_FEATURES('Frecvență: 3 lecții/săptămână – 90 min fiecare', '20 lecții / per sub nivel ( A1.1, A1.2 etc.)'),
        },
        {
          label: 'Grup Intensiv (A1-B2)',
          name: 'Engleza adulți',
          age: 'Adulți +15 ani',
          text: ADULT_INTENSIVE_TEXT,
          features: ADULT_FEATURES('3 lecții/săptămână – 60 min fiecare', '10 lecții / lună'),
        },
      ],
    },
    {
      tab: 'Pregătire Bacalaureat',
      title: 'Pregătirea pentru Bacalaureat la limba engleză la Olla English',
      intro: 'Cursurile noastre de engleză te ajută să înveți eficient și să obții nota maximă la BAC.',
      skills: [
        ['speaking', 'Speaking', 'exerciții pentru exprimare clară'],
        ['writing', 'Writing', 'tehnici de redactare pentru subiecte diferite'],
        ['listening', 'Listening & Reading', 'strategii pentru teste și înțelegerea textelor'],
      ],
      goal: 'Să îți oferim nu doar un rezultat bun, ci și o bază solidă de engleză pentru viitor.',
    },
    {
      tab: 'Pregătire Cambridge',
      mobile: 'Pregătire Cambridge',
      title: 'Pregătire pentru examene Cambridge',
      intro: 'La Olla English Center îți oferim posibilitatea de a te pregăti pentru examenele Cambridge (A2 Key, B1 Preliminary, B2 First). Cursurile sunt structurate pe niveluri clare, cu accent pe:',
      skills: [
        ['speaking', 'Speaking', 'dezvoltarea fluenței și a încrederii în exprimare'],
        ['writing', 'Writing', 'redactarea corectă și creativă a textelor'],
        ['listening', 'Listening', 'înțelegerea mesajelor autentice din conversații reale'],
        ['reading', 'Reading', 'strategii de citire și analiză a textelor'],
      ],
      note: 'Profesorii noștri folosesc materiale moderne și tehnici interactive, astfel încât pregătirea să fie eficientă, practică și motivantă.',
      goal: 'Ca fiecare cursant să obțină rezultate excelente la examen, dar și să dobândească o engleză aplicabilă în viața de zi cu zi, la studii sau la job.',
    },
  ],
}

export const TRIAL = {
  title: 'Încearcă engleza fără risc',
  text: 'Programează o lecție de test gratuită și vezi cum decurge cursul înainte să iei decizia.',
  closing: 'Testează metoda OLLA English și convinge-te singur că funcționează.',
}

export const AUDIENCE = {
  title: 'Pentru cine este OLLA English Center?',
  text: 'Indiferent dacă vrei să-ți ajuți copilul să vorbească fluent limba engleză sau să-ți deschizi tu noi oportunități, la OLLA găsești exact sprijinul de care ai nevoie.',
  cards: [
    { title: 'Pentru părinți', text: 'care își doresc ca cei mici să învețe engleza prin joacă, cântece și activități interactive.' },
    { title: 'Pentru elevi și adolescenți', text: 'care vor să aibă rezultate mai bune la școală, să se pregătească pentru examene și să vorbească fluent.' },
    { title: 'Pentru adulți', text: 'care au nevoie de engleză pentru carieră, călătorii sau examene internaționale (Cambridge, BAC).' },
  ],
}

// Capturi cu mesajele părinților și ale cursanților
export const REVIEW_IMAGES = [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => `curs-engleza-r${n}.jpg`)

export const ABOUT = {
  tagline: 'Școală de engleză',
  title: 'OLLA English Center',
  text: 'Oferim cursuri de engleză pentru copii (4–14 ani) și adulți, adaptate fiecărui nivel. Poți învăța online sau la sediu, cu flexibilitate maximă, indiferent de program sau locație.',
  // Pe site-ul vechi a patra cifră avea eticheta de umplutură „Vestibulum"
  counters: [
    { value: 5, suffix: '+', label: 'Ani experiență' },
    { value: 5, suffix: 'k', label: 'Cursuri' },
    { value: 5, suffix: '+', label: 'Profesori' },
    { value: 1000, suffix: '+', label: 'Cursanți' },
  ],
  images: [6, 5, 4, 3, 2, 1, 6, 5, 5, 3].map((n) => `curs-engleza-chisinau-${n}.jpg`),
}

export const TEAM = {
  title: 'Echipa OLLA English Center',
  text: 'La OLLA English credem că învățarea limbii engleze trebuie să fie clară, plăcută și adaptată fiecărui cursant.',
  members: [
    {
      photo: 'olla-english-4.jpg',
      name: 'Olga Lazarchevici – Fondator Olla English',
      text: 'Fondatoarea școlii, cu peste 8 ani experiență și certificare internațională TESOL. A instruit sute de copii și adulți, creând programe moderne și eficiente, adaptate fiecărui nivel.',
    },
    {
      photo: 'olla-english-1.jpg',
      name: 'Mihaela – Profesor de engleză',
      text: 'Licențiată în filologie, cu 2 ani experiență. Pasionată de lectură și călătorii, inspiră elevii să privească engleza ca pe o poartă spre noi culturi și oportunități.',
    },
    {
      photo: 'olla-english-2.jpg',
      name: 'Andoni Oxana – Profesor de limbi străine',
      text: '20 de ani experiență în predarea englezei și francezei. Specializată în pregătirea pentru examene Cambridge, IELTS și Bacalaureat.',
    },
    {
      photo: 'olla-english-3.jpg',
      name: 'Marina – Profesor de engleză',
      text: 'Licențiată în Științe ale Educației, cu peste 3 ani experiență. Transformă lecțiile în joc și descoperire, ajutând copiii să învețe cu bucurie și să câștige încredere.',
    },
  ],
}

// Pagina /team. Pe site-ul vechi, cardul Olgăi avea din greșeală poza Mihaelei.
export const TEAM_PAGE = {
  title: 'Despre noi',
  text: 'La OLLA English Center credem că învățarea limbii engleze trebuie să fie clară, plăcută și adaptată fiecărui cursant.',
  members: [
    {
      photo: 'olla-english-4.jpg',
      name: 'Olga Lazarchevici',
      role: 'Fondatoarea Olla English & Expert în predarea Limbii Engleze',
      bio: [
        'Sunt Olga Lazarchevici, fondatoarea Olla English Center și profesor de engleză cu peste 8 ani de experiență.',
        'Am diplomă internațională TESOL, licență în limbi străine și master în traduceri. Am predat într-una dintre cele mai mari școli de limbi din Moldova, unde am format mii de studenți, de la nivel A1 la B2.',
        'Mă specializez în pedagogie, psihologie și metode moderne de predare, ceea ce îmi permite să creez programe eficiente, adaptate atât copiilor, cât și adulților.',
        'Misiunea mea este să ofer o educație de calitate, cu rezultate vizibile, într-un cadru profesionist și prietenos.',
        'Dincolo de carieră, sunt mamă a doi băieți, soție și antreprenor, roluri care îmi oferă echilibru și motivație să construiesc o școală unde fiecare cursant își atinge potențialul.',
      ],
    },
    {
      photo: 'olla-english-2.jpg',
      name: 'Andoni Oxana',
      role: 'Experiență: 20 ani de predare, cu clase primare, gimnaziale, liceu și adulți',
      bio: [
        'Vârstă: 43 ani',
        'Studii: Universitatea de Stat din Moldova, specializarea Engleză și Franceză',
        'Master: Studii Anglofone',
        'Experiență: peste 20 de ani de predare la clase primare, gimnaziale, liceu și adulți',
        'Specializări: pregătire pentru examene Cambridge, IELTS și Bacalaureat',
        'Citat preferat: „Never stop learning because life never stop teaching.” – Lin Pernille',
      ],
    },
    {
      photo: 'olla-english-3.jpg',
      name: 'Marina',
      role: 'Licențiată în Științe ale Educației. Predau limba engleză de peste 3 ani.',
      bio: [
        'Mă numesc Marina, sunt profesoară licențiată în Științe ale Educației. Predau limba engleză de peste 3 ani și cred cu tărie că învățarea poate fi o aventură plină de descoperiri.',
        'Îmi place să lucrez cu copiii, pentru că energia și curiozitatea lor fac fiecare lecție specială și unică. Prin jocuri și activități interactive, transform orele de engleză într-o experiență plăcută și motivantă.',
        'Cred că limba engleză nu este doar o materie de studiat, ci o cheie către prietenii noi, aventuri și oportunități nelimitate.',
        'Misiunea mea este să îi ajut pe copii să învețe cu bucurie, să capete încredere în abilitățile lor și să privească engleza ca pe un instrument care le va deschide drumul către viitor.',
      ],
    },
  ],
}

export const VIDEO_REVIEWS = {
  eyebrow: 'Recenzii',
  title: 'Ce spun participanții la cursurile noastre...',
  text: 'Descoperă povești reale, de la oameni ca tine, care au aplicat și au obținut rezultate vizibile.',
  videos: ['N2PuBEC0h-0', 'ub2IACCrz-o', 'f33ZQRKAzN0', '2R1sOD2n9HY', 'ub2IACCrz-o'],
}

export const STEPS = {
  title: 'Cum te înscrii la cursuri?',
  text: '3 pași simpli ca să începi să înveți engleza eficient în 2-6 luni.',
  items: [
    { title: 'Completează formularul sau contactează-ne', text: 'Lasă-ne datele tale și îți răspundem rapid cu toate detaliile.' },
    { title: 'Fă o testare gratuită de nivel', text: 'În doar câteva minute aflăm exact unde te afli și ce tip de curs ți se potrivește.' },
    { title: 'Începe cursurile și progresează vizibil', text: 'Alege formatul potrivit și vezi cum fiecare oră te duce mai aproape de obiectivele tale.' },
  ],
}

export const FAQ = {
  title: 'Întrebări frecvente (FAQ)',
  text: 'Poate că te întrebi același lucru ca și alți cursanți înainte să te înscrii la cursurile noastre.',
  items: [
    { q: '1. Cum știu ce nivel de engleză am eu sau copilul meu?', a: ['Inițial se face o testare gratuită orală, conversație, prin apel telefonic, pentru a stabili nivelul și grupa potrivită.'] },
    { q: '2. Ce se întâmplă dacă lipsesc de la o lecție?', a: ['Lecțiile online le înregistrăm, cele offline, oferim suport si ajutor adițional dacă nu ați înțeles tema.'] },
    { q: '3. Copilul meu este timid. Cum îl va ajuta cursul?', a: ['Grupele sunt mici și interactive, profesorii au experiență cu copii timizi și folosesc metode ludice (jocuri, cântece, role-play) pentru a-l face să prindă încredere și să participe cu plăcere.'] },
    {
      q: '4. Dacă după lecția de probă nu îmi place?',
      a: [
        'Pentru copii 4-14 ani, prima lecție de probă este gratuită, daca nu vă place, nu continuați cursul și nu achitați nimic.',
        'Pentru adulți și orele individuale, prima lecție de probă se achită integral, după care puteți lua o decizie de a continua sau de a renunța la curs.',
      ],
    },
    { q: '5. Cât durează până încep să văd rezultate?', a: ['Majoritatea cursanților observă progrese în primele 3–4 săptămâni: vocabular mai bogat, fraze simple și mai multă încredere. Evident, progresul depinde și de frecvența cursurilor și implicarea ta.'] },
    { q: '6. Cursurile sunt doar teorie și gramatică?', a: ['Nu. La fiecare lecție există partea de conversație. Practic, vorbim engleză din prima săptămână. Teoria este prezentată simplu și aplicată imediat în exerciții și jocuri de rol.'] },
    { q: '7. Ce manuale și materiale folosiți?', a: ['Folosim manuale Oxford și Cambridge, recunoscute internațional, adaptate nivelului de vârstă și nivelului de cunoștințe. Materialele online sunt gratuite, iar cele offline pot fi achiziționate la sediu.'] },
    { q: '8. Profesorii sunt calificați?', a: ['Da. Toți profesorii noștri sunt certificați internațional (TESOL/TEFL), cu experiență în predarea limbii engleze pentru copii și adulți.'] },
    { q: '9. Cât de mari sunt grupele?', a: ['Online – maximum 8 cursanți.\nOffline – maximum 12 cursanți.\nAstfel, fiecare participant primește atenție individuală.'] },
    { q: '10. Pot să mă înscriu oricând?', a: ['Da, înscrierile sunt deschise permanent. Totuși, grupele au locuri limitate, iar unele pachete încep la date fixe. De aceea îți recomandăm să rezervi locul cât mai curând.'] },
  ],
}

export const DEMO = {
  // „Tagline" e textul de umplutură al șablonului, rămas vizibil pe site-ul vechi
  tagline: 'Tagline',
  title: 'Încearcă o lecție demo gratuită',
  text: 'Îți oferim o lecție demo gratuită ca să vezi dacă ți se potrivește stilul nostru.',
  points: [
    'Testezi metoda Olla English fără niciun cost.',
    'Primești feedback personalizat despre nivelul tău.',
    'Vezi dacă ți se potrivește formatul (online sau offline).',
  ],
  images: [8, 7, 6, 5, 4, 2, 3, 1].map((n) => `curs-engleza-${n}.jpg`),
}

export const POPUP = {
  title: 'Completează formularul și vom reveni cu un apel în cel mai scurt timp posibil',
  consent: 'Sunt de acord ca OLLA English Center să-mi prelucreze datele pentru a mă contacta prin telefon și email despre cursuri, conform',
  consentLink: 'Politicii de confidențialitate',
  submit: 'TRIMITE',
  success: 'Mulțumim! Te sunăm în cel mai scurt timp.',
}
