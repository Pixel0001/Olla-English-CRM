import SiteShell from '@/components/site/SiteShell'
import { SITE_URL } from '@/components/site/content'
import './site.css'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Olla English – Școală de limbă engleză în Chișinău',
    template: '%s – Olla English',
  },
  description:
    'Cursuri de engleză pentru copii (4–14 ani) și adulți, online și offline, la Chișinău. Prima lecție de probă gratuită pentru copii.',
  // Site-ul public se indexează (CRM-ul rămâne ascuns: vezi robots.js)
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Olla English',
    locale: 'ro_RO',
    images: ['/site/curs-engleza-1a.jpg'],
  },
}

export default function SiteLayout({ children }) {
  return <SiteShell>{children}</SiteShell>
}
