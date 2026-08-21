// Configurația permisiunilor granulare pentru sistem
// SUPERADMIN are automat toate permisiunile
// ADMIN poate avea permisiuni selective setate de SUPERADMIN

export const PERMISSIONS = {
  // Leads (pipeline vânzări)
  'leads.view': {
    label: 'Vezi lead-urile',
    description: 'Poate vedea lista de lead-uri și detaliile lor',
    category: 'Leads'
  },
  'leads.create': {
    label: 'Adaugă lead-uri',
    description: 'Poate introduce lead-uri noi (Instagram, WhatsApp, telefon etc.)',
    category: 'Leads'
  },
  'leads.edit': {
    label: 'Editează lead-uri',
    description: 'Poate schimba statusul, datele, follow-up-ul și notițele',
    category: 'Leads'
  },
  'leads.delete': {
    label: 'Șterge lead-uri',
    description: 'Poate șterge lead-uri definitiv',
    category: 'Leads'
  },

  // Elevi
  'students.view': {
    label: 'Vezi elevii',
    description: 'Poate vedea lista de elevi',
    category: 'Elevi'
  },
  'students.create': {
    label: 'Creează elevi',
    description: 'Poate adăuga elevi noi',
    category: 'Elevi'
  },
  'students.edit': {
    label: 'Editează elevi',
    description: 'Poate modifica datele elevilor',
    category: 'Elevi'
  },
  'students.delete': {
    label: 'Șterge elevi',
    description: 'Poate șterge elevi',
    category: 'Elevi'
  },

  // Grupe
  'groups.view': {
    label: 'Vezi grupele',
    description: 'Poate vedea lista de grupe',
    category: 'Grupe'
  },
  'groups.create': {
    label: 'Creează grupe',
    description: 'Poate crea grupe noi',
    category: 'Grupe'
  },
  'groups.edit': {
    label: 'Editează grupe',
    description: 'Poate modifica setările grupelor',
    category: 'Grupe'
  },
  'groups.delete': {
    label: 'Șterge grupe',
    description: 'Poate șterge grupe',
    category: 'Grupe'
  },

  // Elevi în grupe
  'groups.students.view': {
    label: 'Vezi elevii din grupe',
    description: 'Poate vedea elevii înscriși în grupe',
    category: 'Elevi în Grupe'
  },
  'groups.students.add': {
    label: 'Adaugă elevi în grupe',
    description: 'Poate adăuga elevi în grupe',
    category: 'Elevi în Grupe'
  },
  'groups.students.remove': {
    label: 'Elimină elevi din grupe',
    description: 'Poate elimina elevi din grupe',
    category: 'Elevi în Grupe'
  },
  'groups.students.transfer': {
    label: 'Transferă elevi',
    description: 'Poate transfera elevi între grupe',
    category: 'Elevi în Grupe'
  },
  'groups.students.status': {
    label: 'Schimbă status elevi',
    description: 'Poate schimba statusul elevilor (activ, pauză, plecat)',
    category: 'Elevi în Grupe'
  },
  'groups.students.lessons': {
    label: 'Modifică lecții',
    description: 'Poate modifica numărul de lecții ale elevilor',
    category: 'Elevi în Grupe'
  },
  'groups.students.absences': {
    label: 'Modifică absențe',
    description: 'Poate modifica absențele elevilor',
    category: 'Elevi în Grupe'
  },
  'groups.students.payments.view': {
    label: 'Vezi plățile',
    description: 'Poate vedea istoricul plăților elevilor din grupe',
    category: 'Elevi în Grupe'
  },
  'groups.students.payments.create': {
    label: 'Adaugă plăți',
    description: 'Poate înregistra plăți noi pentru elevi',
    category: 'Elevi în Grupe'
  },
  'groups.students.payments.delete': {
    label: 'Șterge plăți',
    description: 'Poate șterge plăți',
    category: 'Elevi în Grupe'
  },

  // Plăți (statistici generale)
  'payments.view': {
    label: 'Vezi statistici plăți',
    description: 'Poate vedea statisticile generale de plăți',
    category: 'Plăți'
  },

  // Profesori
  'teachers.view': {
    label: 'Vezi profesorii',
    description: 'Poate vedea lista de profesori',
    category: 'Profesori'
  },
  'teachers.create': {
    label: 'Creează profesori',
    description: 'Poate adăuga profesori noi',
    category: 'Profesori'
  },
  'teachers.edit': {
    label: 'Editează profesori',
    description: 'Poate modifica datele profesorilor',
    category: 'Profesori'
  },
  'teachers.delete': {
    label: 'Șterge profesori',
    description: 'Poate șterge profesori',
    category: 'Profesori'
  },
  'teachers.impersonate': {
    label: 'Loghează-te ca profesor',
    description: 'Poate intra în contul unui profesor pentru a-l vedea/asista (doar profesori, nu alți admini)',
    category: 'Profesori'
  },

  // Filiale
  'branches.view': {
    label: 'Vezi filialele',
    description: 'Poate vedea lista de filiale',
    category: 'Filiale'
  },
  'branches.create': {
    label: 'Creează filiale',
    description: 'Poate adăuga filiale noi',
    category: 'Filiale'
  },
  'branches.edit': {
    label: 'Editează filiale',
    description: 'Poate modifica filialele',
    category: 'Filiale'
  },
  'branches.delete': {
    label: 'Șterge filiale',
    description: 'Poate șterge filiale',
    category: 'Filiale'
  },

  // Sesiuni/Prezențe
  'sessions.view': {
    label: 'Vezi sesiunile',
    description: 'Poate vedea sesiunile de curs',
    category: 'Sesiuni'
  },

  // Recuperări
  'makeup.view': {
    label: 'Vezi recuperările',
    description: 'Poate vedea cererile de recuperare',
    category: 'Recuperări'
  },
  'makeup.create': {
    label: 'Creează recuperări',
    description: 'Poate programa recuperări noi',
    category: 'Recuperări'
  },
  'makeup.edit': {
    label: 'Editează recuperări',
    description: 'Poate modifica programările de recuperare',
    category: 'Recuperări'
  },
  'makeup.delete': {
    label: 'Șterge recuperări',
    description: 'Poate șterge programări de recuperare',
    category: 'Recuperări'
  },

  // Notificări
  'notifications.view': {
    label: 'Vezi notificările',
    description: 'Poate vedea notificările',
    category: 'Notificări'
  },

  // Orar
  'schedule.view': {
    label: 'Vezi orarul',
    description: 'Poate vedea orarul complet',
    category: 'Orar'
  },

  // Audit & Securitate
  'audit.view': {
    label: 'Vezi audit logs',
    description: 'Poate vedea jurnalul de activitate',
    category: 'Securitate'
  },
  'security.view': {
    label: 'Vezi setările de securitate',
    description: 'Poate vedea alertele de securitate',
    category: 'Securitate'
  },
  'security.manage': {
    label: 'Gestionează securitatea',
    description: 'Poate gestiona setările de securitate',
    category: 'Securitate'
  },

  // Mesaje (Messenger / Instagram)
  'messages.view': {
    label: 'Vezi mesajele',
    description: 'Poate citi conversațiile de pe Messenger și Instagram ale paginii',
    category: 'Mesaje'
  },

  'messages.send': {
    label: 'Răspunde la mesaje',
    description: 'Poate trimite răspunsuri pe Messenger și Instagram în numele paginii',
    category: 'Mesaje'
  },

  // Reclame (Meta)
  'ads.view': {
    label: 'Vezi reclamele',
    description: 'Poate vedea cheltuielile, campaniile și rezultatele din Meta Ads',
    category: 'Reclame'
  },

  // Absențe ratate
  'missed-sessions.view': {
    label: 'Vezi sesiunile ratate',
    description: 'Poate vedea absențele',
    category: 'Sesiuni'
  },
}

// Grupează permisiunile pe categorii
export const getPermissionsByCategory = () => {
  const categories = {}

  Object.entries(PERMISSIONS).forEach(([key, value]) => {
    if (!categories[value.category]) {
      categories[value.category] = []
    }
    categories[value.category].push({
      key,
      ...value
    })
  })

  return categories
}

// Verifică dacă un utilizator are o permisiune
export const hasPermission = (user, permission) => {
  // SUPERADMIN are toate permisiunile
  if (user?.role === 'SUPERADMIN') return true

  // Verifică dacă are permisiunea specifică
  return user?.permissions?.includes(permission) || false
}

// Verifică dacă un utilizator are cel puțin una din permisiuni
export const hasAnyPermission = (user, permissions) => {
  if (user?.role === 'SUPERADMIN') return true
  return permissions.some(p => user?.permissions?.includes(p))
}

// Verifică dacă un utilizator are toate permisiunile
export const hasAllPermissions = (user, permissions) => {
  if (user?.role === 'SUPERADMIN') return true
  return permissions.every(p => user?.permissions?.includes(p))
}

// Export lista de categorii pentru ordine
export const PERMISSION_CATEGORIES = [
  'Leads',
  'Elevi',
  'Grupe',
  'Elevi în Grupe',
  'Plăți',
  'Profesori',
  'Filiale',
  'Sesiuni',
  'Recuperări',
  'Mesaje',
  'Reclame',
  'Notificări',
  'Orar',
  'Securitate'
]

export default PERMISSIONS
