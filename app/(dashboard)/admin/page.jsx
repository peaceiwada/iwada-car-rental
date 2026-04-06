'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../components/auth/AuthProvider'
import Link from 'next/link'
import { getPendingVerificationRequests, verifyAgent, rejectAgent, getAllAgents, refreshAgentSession } from '../../lib/agentStorage'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingAgents: 0,
    verifiedAgents: 0,
    rejectedAgents: 0
  })
  const [pendingAgents, setPendingAgents] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const allAgents = getAllAgents()
      const pending = allAgents.filter(a => a.agentStatus === 'pending')
      const verified = allAgents.filter(a => a.agentStatus === 'verified')
      const rejected = allAgents.filter(a => a.agentStatus === 'rejected')
      
      setStats({
        totalCars: 24,
        totalUsers: 156 + allAgents.length,
        totalBookings: 342,
        totalRevenue: 5840000,
        pendingAgents: pending.length,
        verifiedAgents: verified.length,
        rejectedAgents: rejected.length
      })
      
      setPendingAgents(getPendingVerificationRequests())
      
      setRecentActivities([
        { id: 1, action: 'New booking', car: 'Toyota Camry', user: 'John Doe', time: '5 minutes ago', status: 'confirmed' },
        { id: 2, action: 'Agent registered', user: 'Michael Adebayo', time: '1 hour ago', status: 'pending' },
        { id: 3, action: 'Car listed', car: 'Lexus RX 350', user: 'Verified Agent', time: '3 hours ago', status: 'approved' },
        { id: 4, action: 'Payment received', amount: '₦275,000', user: 'Jane Smith', time: '5 hours ago', status: 'completed' },
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = (agentId) => {
    setProcessingId(agentId)
    setTimeout(() => {
      const result = verifyAgent(agentId, user?.name || 'Admin')
      if (result.success) {
        refreshAgentSession(result.agent.email)
        toast.success(`${result.agent.name} has been verified!`)
        loadData()
      } else {
        toast.error('Verification failed')
      }
      setProcessingId(null)
    }, 500)
  }

  const handleReject = (agentId) => {
    const reason = prompt('Please enter a reason for rejection:')
    if (reason === null) return
    
    setProcessingId(agentId)
    setTimeout(() => {
      const result = rejectAgent(agentId, user?.name || 'Admin', reason)
      if (result.success) {
        toast.info('Agent application rejected')
        loadData()
      } else {
        toast.error('Rejection failed')
      }
      setProcessingId(null)
    }, 500)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your car rental business from here</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100">
          <div className="bg-emerald-50 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <span className="text-emerald-600 text-base sm:text-lg font-bold">₦</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900 break-words">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100">
          <div className="bg-blue-50 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <span className="text-blue-600 text-base sm:text-lg font-bold">📋</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.totalBookings}</p>
          <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100">
          <div className="bg-purple-50 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <span className="text-purple-600 text-base sm:text-lg font-bold">✓</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.verifiedAgents}</p>
          <p className="text-xs text-gray-500 mt-1">Verified Agents</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100">
          <div className="bg-amber-50 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <span className="text-amber-600 text-base sm:text-lg font-bold">⏳</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.pendingAgents}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100">
          <div className="bg-rose-50 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <span className="text-rose-600 text-base sm:text-lg font-bold">🚗</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.totalCars}</p>
          <p className="text-xs text-gray-500 mt-1">Total Vehicles</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100">
          <div className="bg-cyan-50 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
            <span className="text-cyan-600 text-base sm:text-lg font-bold">👥</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-xs text-gray-500 mt-1">Total Users</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Link href="/admin/cars/add" className="group bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-5 text-white hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">+</div>
              <h3 className="text-sm sm:text-base font-semibold">Add New Vehicle</h3>
              <p className="text-blue-100 text-xs">Expand your fleet</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-80">🚗</div>
          </div>
        </Link>
        
        <Link href="/admin/agents" className="group bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 sm:p-5 text-white hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">👥</div>
              <h3 className="text-sm sm:text-base font-semibold">Manage Agents</h3>
              <p className="text-emerald-100 text-xs">View all agents</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-80">🤝</div>
          </div>
        </Link>
        
        <Link href="/admin/reports" className="group bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-5 text-white hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">📊</div>
              <h3 className="text-sm sm:text-base font-semibold">Analytics Hub</h3>
              <p className="text-purple-100 text-xs">View insights</p>
            </div>
            <div className="text-3xl sm:text-4xl opacity-80">📈</div>
          </div>
        </Link>
      </div>

      {/* Agent Verification Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 sm:mb-8">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-gray-100">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Agent Verification Requests</h2>
              <p className="text-xs text-gray-600">Agent applications pending your approval</p>
            </div>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-medium">
              {pendingAgents.length} Pending
            </div>
          </div>
        </div>
        
        {pendingAgents.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl text-green-500 mb-3 sm:mb-4">✓</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">All Caught Up</h3>
            <p className="text-sm text-gray-500">No pending agent verification requests</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingAgents.map((agent) => (
              <div key={agent.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{agent.businessName || agent.business}</h3>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium w-12">Name:</span>
                        <span className="truncate">{agent.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium w-12">Email:</span>
                        <span className="truncate">{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium w-12">Phone:</span>
                        <span>{agent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium w-12">Registered:</span>
                        <span>{new Date(agent.registrationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleVerify(agent.id)}
                      disabled={processingId === agent.id}
                      className="px-3 sm:px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {processingId === agent.id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(agent.id)}
                      disabled={processingId === agent.id}
                      className="px-3 sm:px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {processingId === agent.id ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-xs text-gray-500">Latest platform updates</p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                    {activity.action === 'New booking' ? '🚗' : 
                     activity.action === 'Agent registered' ? '👤' : 
                     activity.action === 'Car listed' ? '📋' : '💰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 mb-0.5">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      {activity.car && <span className="text-gray-500 text-xs">• {activity.car}</span>}
                      {activity.amount && <span className="text-emerald-600 font-semibold text-xs">{activity.amount}</span>}
                    </div>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    activity.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    activity.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    activity.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-sm p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Revenue Analytics</h3>
              <p className="text-xs text-gray-400">Monthly performance</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px]">Live</span>
            </div>
          </div>
          
          <div className="h-36 sm:h-44 flex items-end justify-between gap-1 mt-3">
            {[65, 45, 70, 55, 80, 65, 75, 85, 70, 90, 85, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded transition-all group-hover:scale-105" style={{ height: height + '%' }}></div>
                <span className="text-[8px] text-gray-500">{i+1}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-1.5">
              <p className="text-sm font-bold text-emerald-400 break-words">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-[10px] text-gray-400">Revenue</p>
            </div>
            <div className="bg-white/5 rounded-lg p-1.5">
              <p className="text-sm font-bold text-amber-400">{stats.totalBookings}</p>
              <p className="text-[10px] text-gray-400">Bookings</p>
            </div>
            <div className="bg-white/5 rounded-lg p-1.5">
              <p className="text-sm font-bold text-purple-400">{stats.verifiedAgents}</p>
              <p className="text-[10px] text-gray-400">Agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-3 text-white text-center">
          <p className="text-lg sm:text-xl font-bold">98%</p>
          <p className="text-[10px] opacity-90">Satisfaction</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-3 text-white text-center">
          <p className="text-lg sm:text-xl font-bold">24/7</p>
          <p className="text-[10px] opacity-90">Support</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-3 text-white text-center">
          <p className="text-lg sm:text-xl font-bold">4.9</p>
          <p className="text-[10px] opacity-90">Rating</p>
        </div>
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-3 text-white text-center">
          <p className="text-lg sm:text-xl font-bold">100%</p>
          <p className="text-[10px] opacity-90">Secure</p>
        </div>
      </div>
    </div>
  )
}