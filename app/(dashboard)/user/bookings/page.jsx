'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { UserRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByUser, updateBookingStatus } from '../../../lib/storage'
import { formatNaira, formatDate } from '../../../lib/constants'
import { 
  FaCar, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaArrowLeft,
  FaSpinner,
  FaBan
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function UserBookingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [processingId, setProcessingId] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookings()
    }
  }, [isAuthenticated, user])

  const loadBookings = () => {
    try {
      const userBookings = getBookingsByUser(user?.id)
      setBookings(userBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Error loading your bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return
    }
    
    setProcessingId(bookingId)
    try {
      const result = updateBookingStatus(bookingId, 'cancelled')
      if (result) {
        toast.success('Booking cancelled successfully')
        loadBookings()
      } else {
        toast.error('Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Error cancelling booking')
    } finally {
      setProcessingId(null)
    }
  }

  const getFilteredBookings = () => {
    const now = new Date()
    
    if (activeTab === 'upcoming') {
      return bookings.filter(b => 
        b.status === 'confirmed' && new Date(b.pickupDate) >= now
      )
    } else if (activeTab === 'pending') {
      return bookings.filter(b => b.status === 'pending')
    } else if (activeTab === 'completed') {
      return bookings.filter(b => b.status === 'completed')
    } else if (activeTab === 'cancelled') {
      return bookings.filter(b => b.status === 'cancelled')
    }
    return bookings
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Pending Confirmation' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle, text: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Cancelled' }
    }
    return badges[status] || badges.pending
  }

  const filteredBookings = getFilteredBookings()
  
  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: FaCalendarAlt, count: bookings.filter(b => b.status === 'confirmed').length },
    { id: 'pending', label: 'Pending', icon: FaClock, count: bookings.filter(b => b.status === 'pending').length },
    { id: 'completed', label: 'Completed', icon: FaCheckCircle, count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', icon: FaTimesCircle, count: bookings.filter(b => b.status === 'cancelled').length }
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <UserRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/user/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your rental bookings</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCar className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'completed').length}</p>
              </div>
              <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-amber-600 truncate">
                  {formatNaira(bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0))}
                </p>
              </div>
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex gap-1 sm:gap-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold text-sm transition-all duration-300 border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-amber-500 text-3xl" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No {activeTab} Bookings</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming bookings"
                : activeTab === 'pending'
                ? "You don't have any pending bookings"
                : activeTab === 'completed'
                ? "You haven't completed any rentals yet"
                : "You don't have any cancelled bookings"}
            </p>
            <Link href="/cars" className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Browse Cars →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusBadge = getStatusBadge(booking.status)
              return (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <FaCar className="text-amber-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{booking.carName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${StatusBadge.color}`}>
                                <StatusBadge.icon size={10} />
                                {StatusBadge.text}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Booking Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-amber-500" />
                            <span>{formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt className="text-amber-500" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                        
                        {/* Message if any */}
                        {booking.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Section */}
                      <div className="lg:text-right">
                        <p className="text-2xl font-bold text-amber-600">{formatNaira(booking.totalPrice)}</p>
                        <p className="text-xs text-gray-500 mb-3">Total Amount</p>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={processingId === booking.id}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {processingId === booking.id ? <FaSpinner className="animate-spin" /> : <FaBan />}
                            Cancel Booking
                          </button>
                        )}
                        
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="mt-2 text-amber-600 text-sm hover:text-amber-700 flex items-center gap-1 lg:justify-end"
                        >
                          <FaEye size={12} /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600">Car</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.carName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600">Pickup Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedBooking.pickupDate)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600">Return Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedBooking.returnDate)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.location}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-amber-600">{formatNaira(selectedBooking.totalPrice)}</p>
                </div>
                
                {selectedBooking.message && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-600">Your Message</p>
                    <p className="text-gray-700">{selectedBooking.message}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600">Booking ID</p>
                  <p className="text-xs text-gray-500">{selectedBooking.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserRoute>
  )
}