'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

// Mapare zi săptămână JS -> română
const dayMapping = {
  0: 'Duminică',
  1: 'Luni',
  2: 'Marți',
  3: 'Miercuri',
  4: 'Joi',
  5: 'Vineri',
  6: 'Sâmbătă'
}

const allDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

// Sortează zilele începând de la ziua curentă
const getSortedDays = () => {
  const today = new Date().getDay()
  const todayName = dayMapping[today]
  const todayIndex = allDays.indexOf(todayName)
  return [...allDays.slice(todayIndex), ...allDays.slice(0, todayIndex)]
}

// Parse scheduleTime pentru a obține ora pentru o zi specifică
const getTimeForDay = (scheduleTime, day) => {
  if (!scheduleTime) return null
  try {
    const parsed = JSON.parse(scheduleTime)
    if (typeof parsed === 'object') return parsed[day] || null
  } catch {
    return scheduleTime
  }
  return null
}

export default function TeacherOrarPage() {
  const [groups, setGroups] = useState([])
  const [teachers, setTeachers] = useState([])
  const [branches, setBranches] = useState([])
  const [makeupLessons, setMakeupLessons] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Filtre
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [showOnlyMine, setShowOnlyMine] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch all groups using the schedule endpoint (accessible to all authenticated users)
      const res = await fetch('/api/teacher/schedule')
      const data = await res.json()
      setGroups(data.groups || [])
      setTeachers(data.teachers || [])
      setBranches(data.branches || [])
      setMakeupLessons(data.makeupLessons || [])
      setCurrentUserId(data.currentUserId)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrare grupe
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      if (!group.active) return false
      
      // Filtru "doar ale mele"
      if (showOnlyMine && group.teacherId !== currentUserId) return false
      
      // Filtru profesor
      if (selectedTeacher && group.teacherId !== selectedTeacher) return false
      
      // Filtru filială
      if (selectedBranch) {
        if (selectedBranch === 'none' && group.branchId) return false
        if (selectedBranch !== 'none' && group.branchId !== selectedBranch) return false
      }
      
      // Filtru zi
      if (selectedDay && (!group.scheduleDays || !group.scheduleDays.includes(selectedDay))) {
        return false
      }
      
      return true
    })
  }, [groups, selectedTeacher, selectedBranch, selectedDay, showOnlyMine, currentUserId])

  // Generează orarul sortat pe zile
  const schedule = useMemo(() => {
    const sortedDays = getSortedDays()
    const todayName = dayMapping[new Date().getDay()]
    const tomorrowIndex = (new Date().getDay() + 1) % 7
    const tomorrowName = dayMapping[tomorrowIndex]
    
    const scheduleByDay = {}
    sortedDays.forEach(day => {
      scheduleByDay[day] = []
    })
    
    filteredGroups.forEach(group => {
      if (!group.scheduleDays) return
      
      group.scheduleDays.forEach(day => {
        // Dacă e selectată o zi specifică, arătăm doar acea zi
        if (selectedDay && day !== selectedDay) return
        
        if (scheduleByDay[day]) {
          const time = getTimeForDay(group.scheduleTime, day)
          scheduleByDay[day].push({
            id: group.id,
            name: group.name,
            time: time || '-',
            branch: group.branch?.name || '-',
            branchId: group.branchId,
            room: group.locationDetails || '-',
            locationType: group.locationType,
            level: group.level || '-',
            teacher: group.teacher?.name || group.teacher?.email || '-',
            teacherId: group.teacherId,
            studentsCount: group.groupStudents?.filter(gs => gs.status === 'ACTIVE' || !gs.status)?.length || 0,
            isMyGroup: group.teacherId === currentUserId,
            isMakeup: false
          })
        }
      })
    })
    
    // Adaugă lecțiile de recuperare programate
    makeupLessons.forEach(makeup => {
      // Filtru "doar ale mele"
      if (showOnlyMine && makeup.teacherId !== currentUserId) return
      
      // Filtru profesor
      if (selectedTeacher && makeup.teacherId !== selectedTeacher) return
      
      // Filtru filială
      if (selectedBranch) {
        if (selectedBranch === 'none' && makeup.branchId) return
        if (selectedBranch !== 'none' && makeup.branchId !== selectedBranch) return
      }
      
      const scheduledDate = new Date(makeup.scheduledAt)
      const makeupDayName = dayMapping[scheduledDate.getDay()]
      
      // Filtru zi
      if (selectedDay && makeupDayName !== selectedDay) return
      
      // Extrage ora din scheduledAt (care e stocat în UTC)
      const hours = String(scheduledDate.getUTCHours()).padStart(2, '0')
      const minutes = String(scheduledDate.getUTCMinutes()).padStart(2, '0')
      const time = `${hours}:${minutes}`
      
      // Formatează data pentru afișare
      const dateStr = scheduledDate.toLocaleDateString('ro-RO', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'short'
      })
      
      if (scheduleByDay[makeupDayName]) {
        scheduleByDay[makeupDayName].push({
          id: makeup.id,
          name: makeup.group?.name || 'Recuperare',
          time: time,
          branch: makeup.branch?.name || '-',
          branchId: makeup.branchId,
          room: makeup.locationDetails || '-',
          locationType: 'offline',
          level: 'Recuperare',
          teacher: makeup.teacher?.name || makeup.teacher?.email || '-',
          teacherId: makeup.teacherId,
          studentsCount: makeup.students?.length || 0,
          isMyGroup: makeup.teacherId === currentUserId,
          isMakeup: true,
          makeupDate: dateStr,
          makeupStatus: makeup.status
        })
      }
    })
    
    // Sortăm fiecare zi după oră
    Object.keys(scheduleByDay).forEach(day => {
      scheduleByDay[day].sort((a, b) => {
        if (!a.time || a.time === '-') return 1
        if (!b.time || b.time === '-') return -1
        return a.time.localeCompare(b.time)
      })
    })
    
    return { scheduleByDay, todayName, tomorrowName, sortedDays }
  }, [filteredGroups, makeupLessons, selectedDay, selectedTeacher, selectedBranch, showOnlyMine, currentUserId])

  const resetFilters = () => {
    setSelectedTeacher('')
    setSelectedBranch('')
    setSelectedDay('')
    setShowOnlyMine(false)
  }

  const hasActiveFilters = selectedTeacher || selectedBranch || selectedDay || showOnlyMine

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const totalLessons = schedule.sortedDays.reduce((sum, day) => sum + schedule.scheduleByDay[day].length, 0)

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Orar Complet</h1>
        <p className="text-sm xs:text-base text-gray-600">Vizualizează orarul tuturor grupelor</p>
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 xs:p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Toggle "Doar grupele mele" */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyMine}
                onChange={(e) => {
                  setShowOnlyMine(e.target.checked)
                  if (e.target.checked) {
                    setSelectedTeacher('') // Resetează filtrul de profesor
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-700">Doar ale mele</span>
            </label>
          </div>

          {/* Filtru zi */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Zi</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Toate zilele</option>
              {allDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {/* Filtru profesor - ascuns dacă "doar ale mele" e activ */}
          {!showOnlyMine && (
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Profesor</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Toți profesorii</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name || t.email}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filtru filială */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Filiala</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-gray-700 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Toate filialele</option>
              <option value="none">Fără filială</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Resetare filtre */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Resetează
            </button>
          )}
        </div>

        {/* Statistici filtre */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
            Se afișează {totalLessons} {totalLessons === 1 ? 'lecție' : 'lecții'} din {filteredGroups.length} {filteredGroups.length === 1 ? 'grupă' : 'grupe'}
          </div>
        )}
      </div>

      {/* Orar pe zile */}
      <div className="space-y-6">
        {schedule.sortedDays.map((day) => {
          const daySchedule = schedule.scheduleByDay[day]
          const isToday = day === schedule.todayName
          const isTomorrow = day === schedule.tomorrowName
          
          if (daySchedule.length === 0) return null
          
          return (
            <div key={day} className="space-y-3">
              {/* Header zi */}
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-semibold ${
                  isToday ? 'text-indigo-700' : isTomorrow ? 'text-amber-700' : 'text-gray-800'
                }`}>
                  {day}
                </h2>
                {isToday && (
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded-full">
                    Azi
                  </span>
                )}
                {isTomorrow && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                    Mâine
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  ({daySchedule.length} {daySchedule.length === 1 ? 'lecție' : 'lecții'})
                </span>
              </div>

              {/* Card-uri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {daySchedule.map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`} 
                    className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow ${
                      item.isMakeup
                        ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/30'
                        : item.isMyGroup 
                          ? 'border-indigo-300 ring-1 ring-indigo-200' 
                          : isToday ? 'border-indigo-200' : 'border-gray-100'
                    }`}
                  >
                    {/* Header card - oră și badge-uri */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${
                          item.isMakeup ? 'text-amber-600' : item.isMyGroup ? 'text-indigo-600' : 'text-gray-700'
                        }`}>
                          {item.time}
                        </span>
                        {item.isMakeup && item.makeupDate && (
                          <span className="text-xs text-amber-600 font-medium">
                            ({item.makeupDate})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        {item.isMakeup && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                            item.makeupStatus === 'IN_PROGRESS' 
                              ? 'bg-green-100 text-green-800 animate-pulse' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.makeupStatus === 'IN_PROGRESS' ? (
                              <>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                În curs
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Recuperare
                              </>
                            )}
                          </span>
                        )}
                        {item.isMyGroup && !item.isMakeup && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Mea
                          </span>
                        )}
                        {item.branch !== '-' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {item.branch}
                          </span>
                        )}
                        {item.isMyGroup && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.studentsCount} elevi
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numele grupei */}
                    <h3 className={`font-semibold mb-1 ${item.isMakeup ? 'text-amber-800' : 'text-gray-900'}`}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{item.level}</p>
                    
                    {/* Profesor */}
                    {!showOnlyMine && !selectedTeacher && (
                      <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className={item.isMyGroup ? 'font-medium text-indigo-600' : ''}>
                          {item.teacher}
                        </span>
                      </p>
                    )}

                    {/* Locație */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                      {item.locationType === 'online' ? (
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <span className="truncate">{item.room}</span>
                    </div>

                    {/* Link la grupă/recuperare (doar pentru grupele mele) */}
                    {item.isMyGroup && (
                      <Link
                        href={item.isMakeup ? `/teacher/makeup/${item.id}` : `/teacher/groups/${item.id}`}
                        className={`mt-3 block text-center text-xs font-medium ${
                          item.isMakeup 
                            ? 'text-amber-600 hover:text-amber-800' 
                            : 'text-indigo-600 hover:text-indigo-800'
                        }`}
                      >
                        {item.isMakeup ? 'Vezi recuperarea →' : 'Vezi grupa →'}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        
        {/* Mesaj dacă nu sunt grupe */}
        {schedule.sortedDays.every(day => schedule.scheduleByDay[day].length === 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 xs:p-12 text-center text-gray-500">
            {hasActiveFilters 
              ? 'Nu există grupe care să corespundă filtrelor selectate.'
              : 'Nu există grupe programate.'
            }
          </div>
        )}
      </div>
    </div>
  )
}
