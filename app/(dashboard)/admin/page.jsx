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
        // Refresh the agent's session if they are logged in
        refreshAgentSession(result.agent.email)
        toast.success(`✨ ${result.agent.name} has been verified! They can now post cars.`)
        loadData()
      } else {
        toast.error('Verification failed')
      }
      setProcessingId(null)
    }, 500)
  }

  const handleReject = (agentId) => {
    const reason = prompt('📝 Please enter a reason for rejection:')
    if (reason === null) return
    
    setProcessingId(agentId)
    setTimeout(() => {
      const result = rejectAgent(agentId, user?.name || 'Admin', reason)
      if (result.success) {
        toast.info(`❌ Agent application rejected`)
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* ===== HEADER SECTION ===== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full shadow-sm">
            <span className="text-amber-600 text-lg">👑</span>
            <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Executive Admin Portal</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p className="text-gray-500 text-base">Complete business insights and management at your fingertips</p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
          <div className="p-5">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-emerald-600 text-2xl">💰</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-emerald-600 font-medium">↑ +12%</span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl"></div>
        </div>
        
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
          <div className="p-5">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-blue-600 text-2xl">📅</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-blue-600 font-medium">↑ +8%</span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-b-2xl"></div>
        </div>
        
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
          <div className="p-5">
            <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-purple-600 text-2xl">✅</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.verifiedAgents}</p>
            <p className="text-sm text-gray-500 mt-1">Verified Agents</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-purple-600 font-medium">Active sellers</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-2xl"></div>
        </div>
        
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
          <div className="p-5">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-amber-600 text-2xl">⏳</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingAgents}</p>
            <p className="text-sm text-gray-500 mt-1">Pending Verification</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-amber-600 font-medium">Awaiting review</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-b-2xl"></div>
        </div>
        
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
          <div className="p-5">
            <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-red-600 text-2xl">🚗</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
            <p className="text-sm text-gray-500 mt-1">Total Vehicles</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-red-600 font-medium">In fleet</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500 rounded-b-2xl"></div>
        </div>
        
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
          <div className="p-5">
            <div className="bg-cyan-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-cyan-600 text-2xl">👥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-1">Total Users</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-cyan-600 font-medium">Registered</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-b-2xl"></div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/cars/add" className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-3xl mb-2">➕</div>
              <h3 className="text-xl font-bold mb-1">Add New Vehicle</h3>
              <p className="text-amber-100 text-sm">Expand your fleet with new cars</p>
            </div>
            <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">🚗</div>
          </div>
        </Link>
        
        <Link href="/admin/agents" className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-xl font-bold mb-1">Manage Agents</h3>
              <p className="text-emerald-100 text-sm">View and manage all agents</p>
            </div>
            <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">🤝</div>
          </div>
        </Link>
        
        <Link href="/admin/reports" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-xl font-bold mb-1">Analytics Hub</h3>
              <p className="text-purple-100 text-sm">View insights and reports</p>
            </div>
            <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">📈</div>
          </div>
        </Link>
      </div>

      {/* ===== AGENT VERIFICATION SECTION ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📋</span>
                <h2 className="text-xl font-bold text-gray-900">Agent Verification Requests</h2>
              </div>
              <p className="text-sm text-gray-600">Real-time agent applications pending your approval</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md flex items-center gap-2">
              <span className="animate-pulse">●</span>
              {pendingAgents.length} Pending Request{pendingAgents.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        {pendingAgents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-7xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No pending agent verification requests</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingAgents.map((agent) => (
              <div key={agent.id} className="p-6 hover:bg-gray-50 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-2xl">🏢</span>
                      <h3 className="font-bold text-gray-900 text-lg">{agent.businessName || agent.business}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <span>⏳</span> Pending Review
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>👤</span>
                        <span className="font-medium">Name:</span>
                        <span>{agent.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📧</span>
                        <span className="font-medium">Email:</span>
                        <span className="truncate">{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📞</span>
                        <span className="font-medium">Phone:</span>
                        <span>{agent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📅</span>
                        <span className="font-medium">Registered:</span>
                        <span>{new Date(agent.registrationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {agent.documents?.idType && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 inline-flex px-3 py-1.5 rounded-lg">
                        <span>📄</span>
                        <span>Document: {agent.documents.idType} - {agent.documents.idNumber}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(agent.id)}
                      disabled={processingId === agent.id}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0"
                    >
                      {processingId === agent.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>✓</span>
                      )}
                      Approve Agent
                    </button>
                    <button
                      onClick={() => handleReject(agent.id)}
                      disabled={processingId === agent.id}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0"
                    >
                      {processingId === agent.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>✗</span>
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🔄</span>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <p className="text-sm text-gray-500">Latest platform updates</p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-5 hover:bg-gray-50 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {activity.action === 'New booking' ? '🚗' : 
                     activity.action === 'Agent registered' ? '🤝' : 
                     activity.action === 'Car listed' ? '📝' : '💰'}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-gray-900">
                        {activity.action}
                      </p>
                      {activity.car && <span className="text-gray-600">• {activity.car}</span>}
                      {activity.amount && <span className="text-emerald-600 font-bold">{activity.amount}</span>}
                    </div>
                    <p className="text-sm text-gray-500">
                      by {activity.user}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">📈</span>
                <h3 className="text-xl font-bold">Revenue Analytics</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">Monthly performance overview</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-medium">Live Data</span>
            </div>
          </div>
          
          {/* Chart Bars */}
          <div className="h-52 flex items-end justify-between gap-1.5 mt-4">
            {[65, 45, 70, 55, 80, 65, 75, 85, 70, 90, 85, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:from-emerald-400 group-hover:to-teal-400" style={{ height: height + '%' }}>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-6 text-xs font-bold text-emerald-300">{height}%</div>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">M{i + 1}</span>
              </div>
            ))}
          </div>
          
          {/* Bottom Stats */}
          <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-emerald-400">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-xs text-gray-400 mt-1">Total Revenue</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-amber-400">{stats.totalBookings}</p>
              <p className="text-xs text-gray-400 mt-1">Total Bookings</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-purple-400">{stats.verifiedAgents}</p>
              <p className="text-xs text-gray-400 mt-1">Active Agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM STATS ROW ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white text-center hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-3xl font-bold">98%</p>
          <p className="text-sm opacity-90 mt-1">Customer Satisfaction</p>
          <div className="mt-2 h-1 w-12 bg-white/30 rounded-full mx-auto"></div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white text-center hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-3xl mb-2">🕒</div>
          <p className="text-3xl font-bold">24/7</p>
          <p className="text-sm opacity-90 mt-1">Support Available</p>
          <div className="mt-2 h-1 w-12 bg-white/30 rounded-full mx-auto"></div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white text-center hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-3xl mb-2">🏆</div>
          <p className="text-3xl font-bold">4.9★</p>
          <p className="text-sm opacity-90 mt-1">Average Rating</p>
          <div className="mt-2 h-1 w-12 bg-white/30 rounded-full mx-auto"></div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white text-center hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="text-3xl mb-2">🔒</div>
          <p className="text-3xl font-bold">100%</p>
          <p className="text-sm opacity-90 mt-1">Secure Payments</p>
          <div className="mt-2 h-1 w-12 bg-white/30 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  )
}