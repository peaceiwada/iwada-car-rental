'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getCarsByAgent, getBookingsByAgent } from '../../../lib/storage'
import { formatNaira } from '../../../lib/constants'
import { 
  FaCar, FaCalendarCheck, FaMoneyBillWave, FaStar, 
  FaEnvelope, FaPhone, FaWhatsapp, FaPlus, FaEye, FaChartLine
} from 'react-icons/fa'

export default function AgentDashboard() {
  const { user, isAgentVerified, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  const loadDashboardData = useCallback(() => {
    if (!user?.id || !isAgentVerified || dataLoaded) return
    
    try {
      const agentCars = getCarsByAgent(user.id) || []
      const agentBookings = getBookingsByAgent(user.id) || []
      const completedBookings = agentBookings.filter(b => b.status === 'completed')
      const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      
      setStats({
        totalCars: agentCars.length,
        totalBookings: agentBookings.length,
        totalEarnings: totalEarnings,
        averageRating: 4.8
      })
      
      setRecentBookings(agentBookings.slice(0, 5))
      setDataLoaded(true)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, isAgentVerified, dataLoaded])

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (!isAgentVerified) {
      router.push('/agent/pending')
      return
    }
    
    if (user?.id && isAgentVerified && !dataLoaded) {
      loadDashboardData()
    }
  }, [authLoading, isAuthenticated, isAgentVerified, user?.id, router, loadDashboardData, dataLoaded])

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAgentVerified) {
    return null
  }

  return (
    <AgentRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Agent Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Manage your car rental business
              </p>
            </div>
          </div>
          
          {/* Verified Badge */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Verified Agent Account</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Welcome back, {user?.name}! Your account has been verified. You can now list cars for rent.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCar className="text-amber-600 text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalCars}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Cars Listed</h3>
            <Link href="/agent/cars/my-cars" className="text-xs text-amber-600 hover:text-amber-700 mt-2 inline-block">
              View all →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCalendarCheck className="text-blue-600 text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalBookings}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
            <Link href="/agent/bookings" className="text-xs text-amber-600 hover:text-amber-700 mt-2 inline-block">
              View all →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="text-green-600 text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800 truncate">{formatNaira(stats.totalEarnings)}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
            <Link href="/agent/earnings" className="text-xs text-amber-600 hover:text-amber-700 mt-2 inline-block">
              View details →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 sm:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaStar className="text-purple-600 text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.averageRating}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
            <Link href="/agent/reviews" className="text-xs text-amber-600 hover:text-amber-700 mt-2 inline-block">
              View reviews →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link href="/agent/cars/add" className="group bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaPlus className="text-xl mb-1" />
                <h3 className="text-sm font-semibold">Add New Car</h3>
                <p className="text-amber-100 text-xs">List your vehicle</p>
              </div>
              <FaCar className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/agent/bookings" className="group bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaEye className="text-xl mb-1" />
                <h3 className="text-sm font-semibold">View Bookings</h3>
                <p className="text-blue-100 text-xs">Manage requests</p>
              </div>
              <FaCalendarCheck className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/agent/messages" className="group bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaEnvelope className="text-xl mb-1" />
                <h3 className="text-sm font-semibold">Messages</h3>
                <p className="text-emerald-100 text-xs">Customer inquiries</p>
              </div>
              <FaEnvelope className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/agent/earnings" className="group bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaChartLine className="text-xl mb-1" />
                <h3 className="text-sm font-semibold">Analytics</h3>
                <p className="text-purple-100 text-xs">View insights</p>
              </div>
              <FaMoneyBillWave className="text-3xl opacity-80" />
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <p className="text-xs text-gray-500">Latest rental requests</p>
              </div>
              <Link href="/agent/bookings" className="text-amber-600 text-sm hover:text-amber-700">
                View All →
              </Link>
            </div>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">No Bookings Yet</h3>
              <p className="text-sm text-gray-500">When customers book your cars, they'll appear here</p>
              <Link href="/agent/cars/add" className="inline-block mt-4 text-amber-600 text-sm font-semibold">
                List your first car →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{booking.carName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Booked by: {booking.userName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-600">{formatNaira(booking.totalPrice)}</p>
                      <Link href={`/agent/bookings/${booking.id}`} className="text-xs text-amber-600 hover:text-amber-700">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info Section */}
        <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaPhone className="text-amber-600" /> Your Contact Information
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Customers can reach you directly through these channels
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500" />
              <span>{user?.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500" />
              <span>{user?.agentVerification?.contactInfo?.whatsapp || user?.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <span>{user?.email}</span>
            </div>
          </div>
          <Link href="/agent/settings" className="inline-block mt-3 text-amber-600 text-sm hover:text-amber-700">
            Update Contact Info →
          </Link>
        </div>
      </div>
    </AgentRoute>
  )
}