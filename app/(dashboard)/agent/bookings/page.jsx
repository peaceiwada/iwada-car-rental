'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByAgent, updateBookingStatus } from '../../../lib/storage'
import { formatNaira, formatDate } from '../../../lib/constants'
import { FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AgentBookingsPage() {
  const router = useRouter()
  const { user, isAgentVerified } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    if (isAgentVerified && user) {
      loadBookings()
    }
  }, [isAgentVerified, user])

  const loadBookings = () => {
    try {
      const agentBookings = getBookingsByAgent(user?.id) || []
      setBookings(agentBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Error loading bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setProcessingId(bookingId)
    try {
      const result = updateBookingStatus(bookingId, newStatus)
      if (result) {
        toast.success(`Booking ${newStatus} successfully!`)
        loadBookings()
      } else {
        toast.error('Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Error updating booking status')
    } finally {
      setProcessingId(null)
    }
  }

  const getFilteredBookings = () => {
    if (activeTab === 'pending') return bookings.filter(b => b.status === 'pending')
    if (activeTab === 'confirmed') return bookings.filter(b => b.status === 'confirmed')
    if (activeTab === 'completed') return bookings.filter(b => b.status === 'completed')
    if (activeTab === 'cancelled') return bookings.filter(b => b.status === 'cancelled')
    return bookings
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle, text: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Cancelled' }
    }
    return badges[status] || badges.pending
  }

  const filteredBookings = getFilteredBookings()
  const tabs = ['pending', 'confirmed', 'completed', 'cancelled']

  if (!isAgentVerified) return null

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-amber-200 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <AgentRoute>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/agent/dashboard" className="text-gray-500 hover:text-amber-600">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-sm text-gray-500">Manage all rental requests for your cars</p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold text-sm border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                  {bookings.filter(b => b.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No {activeTab} bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusBadge = getStatusBadge(booking.status)
              return (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.carName}</h3>
                      <p className="text-sm text-gray-600">Booked by: {booking.userName}</p>
                      <p className="text-sm text-gray-500">{formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</p>
                      <p className="text-sm text-gray-500">Total: {formatNaira(booking.totalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${StatusBadge.color}`}>
                        <StatusBadge.icon size={12} /> {StatusBadge.text}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Confirm</button>
                        <button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Reject</button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => handleUpdateStatus(booking.id, 'completed')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Mark Completed</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AgentRoute>
  )
}
