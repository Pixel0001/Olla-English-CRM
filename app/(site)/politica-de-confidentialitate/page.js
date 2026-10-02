import LegalPage from '@/components/site/LegalPage'
import { PRIVACY } from '@/components/site/legal'

export const metadata = {
  title: 'Politica de confidențialitate',
  description: 'Cum prelucrează OLLA English Center datele cu caracter personal, conform Legii nr. 195/2024.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      sections={PRIVACY}
      other={{ href: '/termeni-si-conditii', label: 'Termenii și condițiile' }}
    />
  )
}
