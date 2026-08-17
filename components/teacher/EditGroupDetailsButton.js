'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  PencilIcon, 
  XMarkIcon, 
  ClockIcon, 
  UserIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline'

const allDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

// Helper pentru a parsa ora din JSON sau string simplu
function parseScheduleTime(scheduleTime, scheduleDays = []) {
  if (!scheduleTime) return null
  
  // Daca e JSON
  if (scheduleTime.startsWith('{')) {
    try {
      const times = JSON.parse(scheduleTime)
      // Returneaza ore per zi
      const entries = Object.entries(times)
      if (entries.length === 0) return null
      
      // Daca toate orele sunt identice, returneaza una singura
      const uniqueTimes = [...new Set(entries.map(([, t]) => t))]
      if (uniqueTimes.length === 1) {
        return uniqueTimes[0]
      }
      
      // Altfel returneaza formatat
      return entries.map(([day, time]) => `${day}: ${time}`).join(', ')
    } catch {
      return scheduleTime
    }
  }
  
  return scheduleTime
}

// Helper pentru a parsa scheduleTime existent în obiect per zi
function parseScheduleTimeToObject(scheduleTime, scheduleDays = []) {
  if (!scheduleTime) return {}
  
  if (scheduleTime.startsWith('{')) {
    try {
      const parsed = JSON.parse(scheduleTime)
      return parsed
    } catch {
      return {}
    }
  }
  
  // E un string simplu - aplică la toate zilele selectate
  const result = {}
  scheduleDays.forEach(day => {
    result[day] = scheduleTime
  })
  // Păstrează și ca _default pentru zile noi
  result._default = scheduleTime
  return result
}

export default function EditGroupDetailsButton({ group, branches }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [schedulePreview, setSchedulePreview] = useState([])
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  
  // Parse existing scheduleTime to object - include zilele pentru string simplu
  const initialTimes = parseScheduleTimeToObject(group.scheduleTime, group.scheduleDays || [])
  
  const [formData, setFormData] = useState({
    scheduleDays: group.scheduleDays || [],
    scheduleTimes: initialTimes, // Obiect { "Luni": "16:00", "Marți": "17:00" }
    locationDetails: group.locationDetails || '',
    branchId: group.branch?.id || group.branchId || '',
    locationType: group.locationType || 'offline'
  })

  // Fetch schedule preview when branch or days change
  useEffect(() => {
    if (!showModal || !formData.branchId || formData.scheduleDays.length === 0) {
      setSchedulePreview([])
      return
    }

    const fetchSchedule = async () => {
      setLoadingSchedule(true)
      try {
        const res = await fetch('/api/teacher/schedule')
        if (res.ok) {
          const data = await res.json()
          
          // Filter groups by selected branch and days
          const filtered = data.groups.filter(g => {
            if (g.id === group.id) return false // Exclude current group
            
            // Check branch match - compare branch.id (from API include)
            const groupBranchId = g.branch?.id
            const selectedBranchId = formData.branchId
            
            // Skip groups without branch if we selected one
            if (!groupBranchId && selectedBranchId) return false
            if (groupBranchId !== selectedBranchId) return false
            
            // Pentru grupele profesorului curent: arată toate de la aceeași filială
            if (g.teacherId === data.currentUserId) {
              return true
            }
            
            // Pentru alte grupe: arată doar cele care se suprapun cu zilele selectate
            const hasOverlap = formData.scheduleDays.some(day => 
              g.scheduleDays?.includes(day)
            )
            return hasOverlap
          }).map(g => ({
            name: g.name,
            teacher: g.teacher?.name || 'Nealocat',
            teacherId: g.teacherId,
            days: g.scheduleDays || [],
            time: parseScheduleTime(g.scheduleTime, g.scheduleDays),
            isOwn: g.teacherId === data.currentUserId // Marchează grupele profesorului curent
          }))

          // Sortează: grupele proprii primele
          filtered.sort((a, b) => {
            if (a.isOwn && !b.isOwn) return -1
            if (!a.isOwn && b.isOwn) return 1
            return 0
          })

          setSchedulePreview(filtered)
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error)
      } finally {
        setLoadingSchedule(false)
      }
    }

    fetchSchedule()
  }, [formData.branchId, formData.scheduleDays, showModal, group.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Construiește scheduleTime ca JSON string
      const timesObj = {}
      formData.scheduleDays.forEach(day => {
        timesObj[day] = formData.scheduleTimes[day] || formData.scheduleTimes._default || ''
      })
      
      const submitData = {
        scheduleDays: formData.scheduleDays,
        scheduleTime: JSON.stringify(timesObj),
        locationDetails: formData.locationDetails,
        branchId: formData.branchId,
        locationType: formData.locationType
      }
      
      const res = await fetch(`/api/teacher/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (res.ok) {
        toast.success('Grupa a fost actualizată!')
        setShowModal(false)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Eroare la actualizare')
      }
    } catch (error) {
      toast.error('Eroare la actualizare')
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (day) => {
    setFormData(prev => {
      const newDays = prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter(d => d !== day)
        : [...prev.scheduleDays, day]
      
      // Dacă adăugăm o zi nouă, setăm ora default
      const newTimes = { ...prev.scheduleTimes }
      if (!prev.scheduleDays.includes(day) && !newTimes[day]) {
        // Copiază ora de la _default sau prima zi existentă
        newTimes[day] = prev.scheduleTimes._default || 
          Object.values(prev.scheduleTimes).find(t => t && t !== '') || ''
      }
      
      return {
        ...prev,
        scheduleDays: newDays,
        scheduleTimes: newTimes
      }
    })
  }

  const updateTimeForDay = (day, time) => {
    setFormData(prev => ({
      ...prev,
      scheduleTimes: {
        ...prev.scheduleTimes,
        [day]: time
      }
    }))
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <PencilIcon className="w-4 h-4" />
        <span>Editează detalii</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Editează Detalii Grupă</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5 text-gray-900" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Zilele cursului */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zilele cursului *
                </label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.scheduleDays.includes(day)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ora cursului - un input per zi selectată */}
              {formData.scheduleDays.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ora cursului *
                  </label>
                  <div className="space-y-3">
                    {formData.scheduleDays.map(day => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="w-24 text-sm font-medium text-gray-700">{day}:</span>
                        <input
                          type="text"
                          value={formData.scheduleTimes[day] || formData.scheduleTimes._default || ''}
                          onChange={(e) => updateTimeForDay(day, e.target.value)}
                          placeholder="13:00"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Introduceți ora în format 24h (ex: 13:00, 16:30)
                  </p>
                </div>
              )}

              {/* Tip locație */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip locație *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="offline"
                      checked={formData.locationType === 'offline'}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Fizic</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={formData.locationType === 'online'}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Online</span>
                  </label>
                </div>
              </div>

              {/* Filiala */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filiala
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                >
                  <option value="">Fără filială</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              {/* Sala/Locația */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sala / Link Zoom / Detalii locație
                </label>
                <textarea
                  value={formData.locationDetails}
                  onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                  rows={3}
                  placeholder="ex: Sala 12, https://zoom.us/j/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>

              {/* Schedule Preview */}
              {formData.branchId && formData.scheduleDays.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      Orar {branches.find(b => b.id === formData.branchId)?.name} - {formData.scheduleDays.join(', ')}
                    </h3>
                  </div>
                  
                  {loadingSchedule ? (
                    <p className="text-sm text-blue-600">Se încarcă orarul...</p>
                  ) : schedulePreview.length === 0 ? (
                    <p className="text-sm text-green-700">✓ Nu există alte grupe în aceste zile</p>
                  ) : (
                    <div className="space-y-2">
                      {schedulePreview.filter(item => item.isOwn).length > 0 && (
                        <>
                          <p className="text-xs font-semibold text-blue-900 mb-2">📚 Grupele tale:</p>
                          {schedulePreview.filter(item => item.isOwn).map((item, idx) => (
                            <div key={`own-${idx}`} className="bg-indigo-50 border border-indigo-200 rounded p-3 text-sm">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-indigo-900">{item.name}</p>
                                  <div className="flex items-center gap-1 text-indigo-700 text-xs mt-1">
                                    <UserIcon className="w-3 h-3" />
                                    <span>{item.teacher} (tu)</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-indigo-600 flex items-center gap-1 justify-end">
                                    <ClockIcon className="w-4 h-4" />
                                    {item.time || 'Nesetată'}
                                  </p>
                                  <p className="text-xs text-indigo-500 flex items-center gap-1 justify-end mt-1">
                                    <CalendarDaysIcon className="w-3 h-3" />
                                    {item.days.join(', ') || 'Nestabilit'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {schedulePreview.filter(item => !item.isOwn).length > 0 && (
                        <>
                          <p className="text-xs font-semibold text-gray-700 mb-2 mt-3">👥 Alte grupe:</p>
                          {schedulePreview.filter(item => !item.isOwn).map((item, idx) => (
                            <div key={`other-${idx}`} className="bg-white rounded p-3 text-sm">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-gray-900">{item.name}</p>
                                  <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                                    <UserIcon className="w-3 h-3" />
                                    <span>{item.teacher}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-blue-600 flex items-center gap-1 justify-end">
                                    <ClockIcon className="w-4 h-4" />
                                    {item.time || 'Nesetată'}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                                    <CalendarDaysIcon className="w-3 h-3" />
                                    {item.days.join(', ') || 'Nestabilit'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || 
                    formData.scheduleDays.length === 0 || 
                    !formData.scheduleDays.every(day => 
                      formData.scheduleTimes[day] || formData.scheduleTimes._default
                    )
                  }
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Se salvează...' : 'Salvează modificările'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
