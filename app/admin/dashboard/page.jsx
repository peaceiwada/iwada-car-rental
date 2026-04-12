'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/auth/AuthProvider'
import { getUsers, approveAgent, rejectAgent, updateUser } from '../../lib/storage'
import { formatNaira } from '../../lib/constants'
import { 
  FaUsers, FaStore, FaClock, FaMoneyBillWave, FaUserCheck, FaUserTimes, 
  FaSpinner, FaEye, FaTimes, FaIdCard, FaBuilding, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCheckCircle, FaWhatsapp
} from 'react-icons/fa'
import toast from 'react-hot-toast'

// Define AgentStatus locally
const AgentStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    pendingAgents: 0,
    verifiedAgents: 0,
    totalRevenue: 0
  })
  const [pendingAgents, setPendingAgents] = useState([])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (!isAdmin) {
      router.push('/')
      return
    }
    loadDashboardData()
  }, [authLoading, isAuthenticated, isAdmin, router])

  const loadDashboardData = () => {
    try {
      const allUsers = getUsers()
      const agents = allUsers.filter(u => u.role === 'agent')
      const pending = agents.filter(a => 
        a.agentVerification?.status === 'pending' || 
        a.agentStatus === 'pending'
      )
      const verified = agents.filter(a => 
        a.agentVerification?.status === 'verified' || 
        a.agentStatus === 'verified'
      )
      
      const allBookings = JSON.parse(localStorage.getItem('iwada_bookings') || '[]')
      const completedBookings = allBookings.filter(b => b.status === 'completed')
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      
      setStats({
        totalUsers: allUsers.length,
        totalAgents: agents.length,
        pendingAgents: pending.length,
        verifiedAgents: verified.length,
        totalRevenue: totalRevenue || 5840000
      })
      
      setPendingAgents(pending)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (agentId) => {
    setProcessingId(agentId)
    try {
      // Get all users
      const users = getUsers()
      const agentIndex = users.findIndex(u => u.id === agentId)
      
      if (agentIndex === -1) {
        toast.error('Agent not found')
        return
      }
      
      // Update agent status
      users[agentIndex].agentStatus = 'verified'
      users[agentIndex].agentVerification = {
        ...users[agentIndex].agentVerification,
        status: 'verified',
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.name || 'Admin'
      }
      
      // Save back to localStorage
      localStorage.setItem('iwada_users', JSON.stringify(users))
      
      // Also update current session if this is the logged-in user
      const currentUser = JSON.parse(localStorage.getItem('iwada_user') || '{}')
      if (currentUser.id === agentId) {
        currentUser.agentStatus = 'verified'
        if (currentUser.agentVerification) {
          currentUser.agentVerification.status = 'verified'
        }
        localStorage.setItem('iwada_user', JSON.stringify(currentUser))
      }
      
      toast.success('Agent approved successfully!')
      loadDashboardData()
    } catch (error) {
      console.error('Error approving agent:', error)
      toast.error('Error approving agent: ' + error.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (agentId) => {
    const reason = prompt('Please enter a reason for rejection:')
    if (!reason) return
    
    setProcessingId(agentId)
    try {
      const users = getUsers()
      const agentIndex = users.findIndex(u => u.id === agentId)
      
      if (agentIndex === -1) {
        toast.error('Agent not found')
        return
      }
      
      users[agentIndex].agentStatus = 'rejected'
      users[agentIndex].agentVerification = {
        ...users[agentIndex].agentVerification,
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.name || 'Admin'
      }
      
      localStorage.setItem('iwada_users', JSON.stringify(users))
      
      toast.info('Agent application rejected')
      loadDashboardData()
    } catch (error) {
      console.error('Error rejecting agent:', error)
      toast.error('Error rejecting agent: ' + error.message)
    } finally {
      setProcessingId(null)
    }
  }

  const getDocumentTypeLabel = (idType) => {
    const types = {
      nin: 'National Identification Number (NIN)',
      drivers_license: "Driver's License",
      voters_card: "Voter's Card",
      passport: 'International Passport'
    }
    return types[idType] || idType
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Admin'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <FaUsers className="text-blue-600 text-2xl mb-2"/>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <FaStore className="text-purple-600 text-2xl mb-2"/>
            <p className="text-2xl font-bold">{stats.totalAgents}</p>
            <p className="text-gray-500 text-sm">Total Agents</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <FaClock className="text-amber-600 text-2xl mb-2"/>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingAgents}</p>
            <p className="text-gray-500 text-sm">Pending Approval</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white">
            <FaMoneyBillWave className="text-2xl mb-2"/>
            <p className="text-2xl font-bold">{formatNaira(stats.totalRevenue)}</p>
            <p className="text-sm opacity-90">Total Revenue</p>
          </div>
        </div>

        {/* Agent Verification Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Agent Verification Requests</h2>
                <p className="text-sm text-gray-600">Agent applications pending your approval</p>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                {pendingAgents.length} Pending
              </div>
            </div>
          </div>
          
          {pendingAgents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">All Caught Up</h3>
              <p className="text-gray-500">No pending agent verification requests</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingAgents.map((agent) => (
                <div key={agent.id} className="p-4 hover:bg-gray-50 transition-all">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{agent.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" size={12} />
                          <span>{agent.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" size={12} />
                          <span>{agent.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-gray-400" size={12} />
                          <span>{agent.agentVerification?.businessInfo?.businessName || agent.businessName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" size={12} />
                          <span>{agent.agentVerification?.businessInfo?.businessAddress || agent.businessAddress || 'N/A'}</span>
                        </div>
                      </div>
                      
                      {/* ID Information */}
                      {agent.agentVerification?.documents && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <FaIdCard className="text-amber-500" size={14} />
                            <span className="font-medium">ID Submitted:</span>
                            <span>{getDocumentTypeLabel(agent.agentVerification.documents.idType)}</span>
                          </div>
                          <div className="text-gray-600 text-xs">
                            ID Number: {agent.agentVerification.documents.idNumber}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <FaEye size={14} /> View Details
                      </button>
                      <button
                        onClick={() => handleApprove(agent.id)}
                        disabled={processingId === agent.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                      >
                        {processingId === agent.id ? <FaSpinner className="animate-spin" /> : <FaUserCheck />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(agent.id)}
                        disabled={processingId === agent.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                      >
                        {processingId === agent.id ? <FaSpinner className="animate-spin" /> : <FaUserTimes />}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAgent(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Agent Application Details</h2>
              <button onClick={() => setSelectedAgent(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUserCheck className="text-amber-500" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedAgent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{selectedAgent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{selectedAgent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-medium text-gray-900">{selectedAgent.agentVerification?.contactInfo?.whatsapp || selectedAgent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registered On</p>
                    <p className="font-medium text-gray-900">{new Date(selectedAgent.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-amber-500" /> Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium text-gray-900">{selectedAgent.agentVerification?.businessInfo?.businessName || selectedAgent.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Address</p>
                    <p className="font-medium text-gray-900">{selectedAgent.agentVerification?.businessInfo?.businessAddress || selectedAgent.businessAddress}</p>
                  </div>
                </div>
              </div>

              {/* ID Verification Documents */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaIdCard className="text-amber-500" /> Verification Documents
                </h3>
                
                {selectedAgent.agentVerification?.documents ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700">ID Type</p>
                      <p className="text-gray-900">{getDocumentTypeLabel(selectedAgent.agentVerification.documents.idType)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700">ID Number</p>
                      <p className="text-gray-900">{selectedAgent.agentVerification.documents.idNumber}</p>
                    </div>
                    
                    {/* ID Card Image */}
                    {selectedAgent.agentVerification.documents.idCardImage && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">ID Card Image</p>
                        <img 
                          src={selectedAgent.agentVerification.documents.idCardImage} 
                          alt="ID Card" 
                          className="max-w-full max-h-64 rounded-lg border border-gray-200 object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Passport Photo */}
                    {selectedAgent.agentVerification.documents.passportPhoto && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Passport Photo</p>
                        <img 
                          src={selectedAgent.agentVerification.documents.passportPhoto} 
                          alt="Passport" 
                          className="max-w-full max-h-64 rounded-lg border border-gray-200 object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Selfie with ID */}
                    {selectedAgent.agentVerification.documents.selfieWithId && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Selfie with ID</p>
                        <img 
                          src={selectedAgent.agentVerification.documents.selfieWithId} 
                          alt="Selfie with ID" 
                          className="max-w-full max-h-64 rounded-lg border border-gray-200 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No verification documents submitted yet.</p>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaPhone className="text-amber-500" /> Contact Information
                </h3>
                <div className="flex gap-3">
                  <a 
                    href={`tel:${selectedAgent.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                  >
                    <FaPhone /> Call Agent
                  </a>
                  <a 
                    href={`https://wa.me/${selectedAgent.phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a 
                    href={`mailto:${selectedAgent.email}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
                  >
                    <FaEnvelope /> Email
                  </a>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    handleApprove(selectedAgent.id)
                    setSelectedAgent(null)
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Approve Agent
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedAgent.id)
                    setSelectedAgent(null)
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <FaTimes /> Reject Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
