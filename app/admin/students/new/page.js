import StudentForm from '@/components/admin/StudentForm'

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Adaugă elev nou</h1>
        <p className="text-gray-600">Completează datele elevului</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <StudentForm />
      </div>
    </div>
  )
}
