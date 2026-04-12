'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AdminRoute } from '../../../components/auth/ProtectedRoute'
import { getBookings, updateBookingStatus, getUsers, getCars } from '../../../lib/storage'
import { formatNaira, formatDate } from '../../../lib/constants'
import { 
  FaCalendarAlt, 
  FaUser, 
  FaCar, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaArrowLeft,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminBookingsPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      loadBookings()
    }
  }, [isAdmin])

  useEffect(() => {
    filterBookings()
  }, [bookings, activeTab, searchQuery])

  const loadBookings = () => {
    try {
      const allBookings = getBookings()
      
      // If no bookings in storage, use mock data
      if (allBookings.length === 0) {
        const mockBookings = [
          { 
            id: 'booking_1', carName: 'Toyota Camry', carId: 1, 
            userName: 'John Doe', userEmail: 'john@example.com', userPhone: '+234 801 234 5678',
            pickupDate: '2025-01-15', returnDate: '2025-01-18', totalPrice: 75000,
            status: 'completed', location: 'Lagos', createdAt: '2025-01-10T10:00:00Z',
            agentName: 'Iwada Rentals', message: 'Need car for business trip'
          },
          { 
            id: 'booking_2', carName: 'Lexus RX 350', carId: 2, 
            userName: 'Jane Smith', userEmail: 'jane@example.com', userPhone: '+234 802 345 6789',
            pickupDate: '2025-02-10', returnDate: '2025-02-15', totalPrice: 275000,
            status: 'confirmed', location: 'Abuja', createdAt: '2025-02-05T14:30:00Z',
            agentName: 'Premium Rentals', message: 'Family vacation'
          },
          { 
            id: 'booking_3', carName: 'Mercedes C-Class', carId: 3, 
            userName: 'Michael Adebayo', userEmail: 'michael@example.com', userPhone: '+234 803 456 7890',
            pickupDate: '2025-03-01', returnDate: '2025-03-05', totalPrice: 300000,
            status: 'pending', location: 'Lagos', createdAt: '2025-02-25T09:15:00Z',
            agentName: 'Elite Autos', message: 'Wedding event'
          },
          { 
            id: 'booking_4', carName: 'Toyota Corolla', carId: 4, 
            userName: 'Sarah Okafor', userEmail: 'sarah@example.com', userPhone: '+234 804 567 8901',
            pickupDate: '2025-01-20', returnDate: '2025-01-22', totalPrice: 36000,
            status: 'cancelled', location: 'Abuja', createdAt: '2025-01-15T16:45:00Z',
            agentName: 'Iwada Rentals', message: 'Changed plans'
          },
          { 
            id: 'booking_5', carName: 'Hyundai Santa Fe', carId: 5, 
            userName: 'David Okonkwo', userEmail: 'david@example.com', userPhone: '+234 805 678 9012',
            pickupDate: '2025-03-10', returnDate: '2025-03-15', totalPrice: 175000,
            status: 'pending', location: 'Port Harcourt', createdAt: '2025-03-01T11:20:00Z',
            agentName: 'Premium Rentals', message: 'Airport pickup needed'
          }
        ]
        setBookings(mockBookings)
        setFilteredBookings(mockBookings)
      } else {
        setBookings(allBookings)
        setFilteredBookings(allBookings)
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Error loading bookings')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = [...bookings]
    
    // Status filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(b => b.status === activeTab)
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.carName.toLowerCase().includes(query) ||
        booking.userName.toLowerCase().includes(query) ||
        booking.userEmail.toLowerCase().includes(query) ||
        (booking.agentName && booking.agentName.toLowerCase().includes(query)) ||
        booking.id.toLowerCase().includes(query)
      )
    }
    
    setFilteredBookings(filtered)
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle, text: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Cancelled' }
    }
    return badges[status] || badges.pending
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  }

  const tabs = [
    { id: 'all', label: 'All', count: stats.total, icon: FaCalendarAlt },
    { id: 'pending', label: 'Pending', count: stats.pending, icon: FaClock },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmed, icon: FaCheckCircle },
    { id: 'completed', label: 'Completed', count: stats.completed, icon: FaCheckCircle },
    { id: 'cancelled', label: 'Cancelled', count: stats.cancelled, icon: FaTimesCircle }
  ]

  if (!isAdmin) {
    return null
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all platform bookings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaClock className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-amber-600 truncate">{formatNaira(stats.totalRevenue)}</p>
              </div>
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car, customer, agent, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {(searchQuery || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('all')
                }}
                className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl transition"
              >
                Clear Filters
              </button>
            )}
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">No bookings match your current filters</p>
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
                              <span className="text-xs text-gray-400">ID: {booking.id}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Booking Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-amber-500" />
                            <span>{formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaUser className="text-amber-500" />
                            <span>{booking.userName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCar className="text-amber-500" />
                            <span>Agent: {booking.agentName || 'Iwada Rentals'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMoneyBillWave className="text-amber-500" />
                            <span className="font-semibold text-amber-600">{formatNaira(booking.totalPrice)}</span>
                          </div>
                        </div>
                        
                        {/* Message if any */}
                        {booking.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Section - Actions */}
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              disabled={processingId === booking.id}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                            >
                              {processingId === booking.id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              disabled={processingId === booking.id}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                            >
                              {processingId === booking.id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                              Cancel
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                            disabled={processingId === booking.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                          >
                            {processingId === booking.id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                            Mark Completed
                          </button>
                        )}
                        
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center gap-1"
                        >
                          <FaEye size={14} /> View Details
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Booking Info */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Booking ID</p>
                  <p className="font-mono text-sm">{selectedBooking.id}</p>
                  <p className="text-sm opacity-90 mt-2">Status</p>
                  <p className="font-semibold capitalize">{selectedBooking.status}</p>
                </div>
                
                {/* Car Details */}
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCar className="text-amber-500" /> Car Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Car Name</p>
                      <p className="font-semibold">{selectedBooking.carName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-semibold">{selectedBooking.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pickup Date</p>
                      <p className="font-semibold">{formatDate(selectedBooking.pickupDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Return Date</p>
                      <p className="font-semibold">{formatDate(selectedBooking.returnDate)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Customer Details */}
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaUser className="text-amber-500" /> Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-semibold">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <a href={`mailto:${selectedBooking.userEmail}`} className="text-amber-600 hover:underline">
                        {selectedBooking.userEmail}
                      </a>
                    </div>
                    {selectedBooking.userPhone && (
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <a href={`tel:${selectedBooking.userPhone}`} className="text-amber-600 hover:underline">
                          {selectedBooking.userPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Agent Details */}
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCar className="text-amber-500" /> Agent Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Agent Name</p>
                      <p className="font-semibold">{selectedBooking.agentName || 'Iwada Rentals'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaMoneyBillWave className="text-amber-500" /> Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-amber-600">{formatNaira(selectedBooking.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Booked On</p>
                      <p>{formatDate(selectedBooking.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Customer Message */}
                {selectedBooking.message && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Customer Message</h3>
                    <p className="text-gray-700 italic">"{selectedBooking.message}"</p>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="flex gap-3 pt-2">
                  {selectedBooking.userPhone && (
                    <a
                      href={`https://wa.me/${selectedBooking.userPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                    >
                      <FaWhatsapp /> WhatsApp Customer
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedBooking.userEmail}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
                  >
                    <FaEnvelope /> Email Customer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  )
}