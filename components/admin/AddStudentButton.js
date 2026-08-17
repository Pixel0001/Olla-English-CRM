'use client'

import Link from 'next/link'
import { PermissionGate } from '@/hooks/usePermissions'

export default function AddStudentButton() {
  return (
    <PermissionGate permission="students.create">
      <Link
        href="/admin/students/new"
        className="px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
      >
        + Adaugă elev
      </Link>
    </PermissionGate>
  )
}
