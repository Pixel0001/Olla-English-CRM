import TeacherForm from '@/components/admin/TeacherForm'
import PermissionGuard from '@/components/admin/PermissionGuard'

export default function NewTeacherPage() {
  return (
    <PermissionGuard permission="teachers.create">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Adaugă cont nou</h1>
          <p className="text-gray-600">Crează un cont de profesor sau administrator</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <TeacherForm />
        </div>
      </div>
    </PermissionGuard>
  )
}
