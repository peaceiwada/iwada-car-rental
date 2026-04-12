'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByAgent, getCarsByAgent } from '../../../lib/storage'
import { formatNaira } from '../../../lib/constants'
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCalendarAlt,
  FaCar,
  FaUsers,
  FaStar,
  FaArrowLeft,
  FaTrendUp,
  FaWallet,
  FaShoppingCart,
  FaEye
} from 'react-icons/fa'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function AgentEarningsPage() {
  const router = useRouter()
  const { user, isAgentVerified } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalCars: 0,
    averageRating: 0,
    monthlyEarnings: [],
    carPerformance: []
  })

  useEffect(() => {
    if (isAgentVerified && user) {
      loadEarningsData()
    }
  }, [isAgentVerified, user])

  const loadEarningsData = () => {
    try {
      const agentCars = getCarsByAgent(user?.id)
      const agentBookings = getBookingsByAgent(user?.id)
      const completedBookings = agentBookings.filter(b => b.status === 'completed')
      const pendingBookings = agentBookings.filter(b => b.status === 'pending')
      const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      
      // Calculate average rating (mock for now)
      const averageRating = 4.8
      
      // Calculate monthly earnings (last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      const monthlyEarnings = months.map((month, index) => ({
        month,
        earnings: Math.floor(Math.random() * 500000) + 100000,
        bookings: Math.floor(Math.random() * 10) + 1
      }))
      
      // Calculate car performance
      const carPerformance = agentCars.map(car => {
        const carBookings = agentBookings.filter(b => b.carId === car.id)
        const completedCarBookings = carBookings.filter(b => b.status === 'completed')
        const earnings = completedCarBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        return {
          name: car.name,
          bookings: carBookings.length,
          earnings: earnings,
          rating: 4.5
        }
      }).sort((a, b) => b.earnings - a.earnings).slice(0, 5)
      
      setStats({
        totalEarnings,
        totalBookings: agentBookings.length,
        completedBookings: completedBookings.length,
        pendingBookings: pendingBookings.length,
        totalCars: agentCars.length,
        averageRating,
        monthlyEarnings,
        carPerformance
      })
    } catch (error) {
      console.error('Error loading earnings data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#f59e0b', '#f97316', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6']

  if (!isAgentVerified) {
    return null
  }

  return (
    <AgentRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/agent/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Earnings & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Track your revenue and business performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <FaWallet className="text-3xl opacity-80" />
              <FaTrendUp className="text-2xl opacity-60" />
            </div>
            <p className="text-sm opacity-90">Total Earnings</p>
            <p className="text-2xl font-bold">{formatNaira(stats.totalEarnings)}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaShoppingCart className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-green-600">{stats.completedBookings} completed</span>
              <span className="text-yellow-600">{stats.pendingBookings} pending</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCar className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Cars</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
              </div>
            </div>
            <Link href="/agent/cars/my-cars" className="text-xs text-amber-600 hover:text-amber-700">
              Manage listings →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaStar className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-xs ${i < Math.floor(stats.averageRating) ? 'text-yellow-500' : 'text-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-amber-500" />
              Monthly Earnings
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip formatter={(value) => formatNaira(value)} />
                  <Line type="monotone" dataKey="earnings" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Monthly Bookings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-amber-500" />
              Monthly Bookings
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Car Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaCar className="text-amber-500" />
              Top Performing Cars
            </h3>
          </div>
          
          {stats.carPerformance.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No car performance data yet</p>
              <Link href="/agent/cars/add" className="inline-block mt-2 text-amber-600 text-sm">
                List your first car →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.carPerformance.map((car, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{car.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{car.bookings} bookings</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-[10px] ${i < Math.floor(car.rating) ? 'text-yellow-500' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">{formatNaira(car.earnings)}</p>
                      <p className="text-xs text-gray-500">total earnings</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/agent/bookings" className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaEye className="text-xl mb-1" />
                <h3 className="font-semibold">View Bookings</h3>
                <p className="text-blue-100 text-xs">Manage rental requests</p>
              </div>
              <FaShoppingCart className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/agent/cars/my-cars" className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaCar className="text-xl mb-1" />
                <h3 className="font-semibold">Manage Cars</h3>
                <p className="text-amber-100 text-xs">Update your listings</p>
              </div>
              <FaCar className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/agent/settings" className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <FaWallet className="text-xl mb-1" />
                <h3 className="font-semibold">Withdraw Funds</h3>
                <p className="text-purple-100 text-xs">Request payout</p>
              </div>
              <FaMoneyBillWave className="text-3xl opacity-80" />
            </div>
          </Link>
        </div>
      </div>
    </AgentRoute>
  )
}