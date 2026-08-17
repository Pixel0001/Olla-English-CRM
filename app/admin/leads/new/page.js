export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import PermissionGuard from '@/components/admin/PermissionGuard'
import LeadForm from '@/components/admin/LeadForm'

export default function NewLeadPage() {
  return (
    <PermissionGuard permission="leads.create">
      <div className="space-y-4 xs:space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Lead nou</h1>
            <p className="text-sm text-gray-600">
              Introdu o cerere primită pe Instagram, WhatsApp, Messenger sau telefon
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-4 xs:p-6">
          <LeadForm />
        </div>
      </div>
    </PermissionGuard>
  )
}
