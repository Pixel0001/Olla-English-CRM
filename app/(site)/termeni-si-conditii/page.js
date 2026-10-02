import LegalPage from '@/components/site/LegalPage'
import { TERMS } from '@/components/site/legal'

export const metadata = {
  title: 'Termeni și condiții',
  description: 'Termenii și condițiile de folosire a site-ului și a cursurilor OLLA English Center.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Termeni și condiții"
      sections={TERMS}
      other={{ href: '/politica-de-confidentialitate', label: 'Politica de confidențialitate' }}
    />
  )
}
