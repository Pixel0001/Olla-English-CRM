'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FunnelIcon } from '@heroicons/react/24/outline'

const allStatuses = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'FARA_RASPUNS', label: 'Fără Răspuns' },
  { value: 'CONTACTAT', label: 'Contactat' },
  { value: 'PROGRAMAT', label: 'Programat' },
  { value: 'PRIMA_LECTIE', label: 'Prima Lecție' },
  { value: 'FINALIZAT_LECTIA', label: 'Finalizat Lecția' },
  { value: 'SE_GANDESTE', label: 'Se Gândește' },
  { value: 'ASTEPTAM_PLATA', label: 'Așteptăm Plata' },
  { value: 'PLATIT', label: 'Plătit' },
  { value: 'STUDIAZA', label: 'Studiază' },
  { value: 'PLECAT', label: 'Plecat' },
  { value: 'LOST_LEAD', label: 'Lost Lead' },
  { value: 'TEST', label: 'Test' },
]

export default function StatusFilter({ basePath }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || ''

  const handleStatusChange = (e) => {
    const status = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <FunnelIcon className="h-4 w-4 text-gray-500" />
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        className="block w-full sm:w-auto px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f]"
      >
        <option value="">Toate statusurile</option>
        {allStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  )
}
