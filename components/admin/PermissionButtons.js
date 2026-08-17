'use client'

import Link from 'next/link'
import { PermissionGate } from '@/hooks/usePermissions'

export function AddGroupButton() {
  return (
    <PermissionGate permission="groups.create">
      <Link
        href="/admin/groups/new"
        className="px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
      >
        + Adaugă grupă
      </Link>
    </PermissionGate>
  )
}

export function AddTeacherButton() {
  return (
    <PermissionGate permission="teachers.create">
      <Link
        href="/admin/teachers/new"
        className="px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
      >
        + Adaugă personal
      </Link>
    </PermissionGate>
  )
}

export function AddBranchButton() {
  return (
    <PermissionGate permission="branches.create">
      <Link
        href="/admin/branches/new"
        className="px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
      >
        + Adaugă filială
      </Link>
    </PermissionGate>
  )
}

export function AddPaymentButton({ groupStudentId, children, className }) {
  return (
    <PermissionGate permission="payments.create">
      {children || (
        <button className={className || "px-3 xs:px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"}>
          + Adaugă plată
        </button>
      )}
    </PermissionGate>
  )
}

export function AddMakeupButton({ children, className }) {
  return (
    <PermissionGate permission="makeup.create">
      {children || (
        <button className={className || "px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"}>
          + Programează recuperare
        </button>
      )}
    </PermissionGate>
  )
}
