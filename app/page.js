import { redirect } from 'next/navigation'

// Nu există site public — rădăcina duce direct în ecranul de autentificare al CRM-ului.
export default function Home() {
  redirect('/login')
}
