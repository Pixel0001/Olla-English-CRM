'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BellIcon, 
  CheckIcon, 
  FunnelIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const TYPE_CONFIG = {
  TEACHER_DAILY_SCHEDULE: {
    icon: '📚',
    label: 'Program zilnic',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  LOW_LESSONS: {
    icon: '📉',
    label: 'Lecții puține',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  },
  ZERO_LESSONS: {
    icon: '⚠️',
    label: 'Zero lecții',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50 border-orange-200 text-orange-800'
  },
  NEGATIVE_LESSONS: {
    icon: '🔴',
    label: 'Lecții negative',
    color: 'bg-red-500',
    lightColor: 'bg-red-50 border-red-200 text-red-800'
  },
  PAYMENT_RECEIVED: {
    icon: '💰',
    label: 'Plată primită',
    color: 'bg-green-500',
    lightColor: 'bg-green-50 border-green-200 text-green-800'
  },
  NEW_ENROLLMENT: {
    icon: '📝',
    label: 'Înscriere nouă',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  MISSED_SESSION: {
    icon: '❌',
    label: 'Lecție ratată',
    color: 'bg-red-500',
    lightColor: 'bg-red-50 border-red-200 text-red-800'
  },
  CANCELLED_SESSION: {
    icon: '🚫',
    label: 'Lecție anulată',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50 border-orange-200 text-orange-800'
  }
}

export default function NotificationsPageClient({ notifications: initialNotifications, isAdmin }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all') // 'all', 'unread', or specific type
  const [loading, setLoading] = useState(false)

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString('ro-RO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(notification)
    return groups
  }, {})

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      })
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    setLoading(true)
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Get unique types for filter
  const availableTypes = [...new Set(notifications.map(n => n.type))]

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BellIcon className="w-6 h-6 xs:w-7 xs:h-7 text-[#30919f]" />
            Notificări
          </h1>
          <p className="text-sm xs:text-base text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} notificări necitite` : 'Toate notificările au fost citite'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#30919f] text-white rounded-xl text-sm font-medium hover:bg-[#277a85] disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <CheckIcon className="w-4 h-4" />
            )}
            Marchează toate ca citite
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <FunnelIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs xs:text-sm font-medium transition-all whitespace-nowrap ${
            filter === 'all' 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Toate ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs xs:text-sm font-medium transition-all whitespace-nowrap ${
            filter === 'unread' 
              ? 'bg-[#30919f] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Necitite ({unreadCount})
        </button>
        {availableTypes.map(type => {
          const config = TYPE_CONFIG[type]
          const count = notifications.filter(n => n.type === type).length
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs xs:text-sm font-medium transition-all whitespace-nowrap inline-flex items-center gap-1 ${
                filter === type 
                  ? `${config.color} text-white` 
                  : `${config.lightColor} border`
              }`}
            >
              <span>{config.icon}</span>
              <span className="hidden xs:inline">{config.label}</span>
              <span>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <BellIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nicio notificare</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Nu ai nicio notificare momentan.' 
              : 'Nu există notificări care să corespundă filtrului selectat.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 capitalize">{date}</h3>
              <div className="space-y-2">
                {dateNotifications.map((notification) => {
                  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.LOW_LESSONS
                  
                  return (
                    <div
                      key={notification.id}
                      className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                        !notification.read ? `${config.lightColor}` : 'border-gray-100'
                      }`}
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.color}`}></div>
                      )}
                      
                      <div className="p-4 flex gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-xl`}>
                          {config.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                                {notification.message}
                              </p>
                              {notification.student && (
                                <Link 
                                  href={`/admin/students/${notification.student.id}`}
                                  className="inline-flex items-center gap-1 text-xs text-[#30919f] mt-2 hover:underline"
                                >
                                  👤 {notification.student.fullName}
                                </Link>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-3 mt-3">
                            {notification.link && (
                              <Link
                                href={notification.link}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                className="text-xs font-medium text-[#30919f] hover:text-[#277a85]"
                              >
                                Vezi detalii →
                              </Link>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1"
                              >
                                <CheckIcon className="w-3 h-3" />
                                Marchează ca citită
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
