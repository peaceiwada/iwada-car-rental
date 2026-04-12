'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../components/auth/AuthProvider'
import { getPendingAgents, approveAgent, rejectAgent } from '../../../lib/storage'
import { formatNaira } from '../../../lib/constants'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pendingAgents, setPendingAgents] = useState([])
  const [processingId, setProcessingId] = useState(null)

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
    loadData()
  }, [authLoading, isAuthenticated, isAdmin, router])

  const loadData = () => {
    try {
      const pending = getPendingAgents()
      setPendingAgents(pending)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (agentId) => {
    setProcessingId(agentId)
    try {
      const result = approveAgent(agentId, user?.id)
      if (result) {
        toast.success('Agent approved successfully!')
        loadData()
      } else {
        toast.error('Failed to approve agent')
      }
    } catch (error) {
      toast.error('Error approving agent')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (agentId) => {
    const reason = prompt('Please enter a reason for rejection:')
    if (!reason) return
    setProcessingId(agentId)
    try {
      const result = rejectAgent(agentId, user?.id, reason)
      if (result) {
        toast.info('Agent application rejected')
        loadData()
      } else {
        toast.error('Failed to reject agent')
      }
    } catch (error) {
      toast.error('Error rejecting agent')
    } finally {
      setProcessingId(null)
    }
  }

  if (authLoading || loading) {
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
      </div>

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
              <div key={agent.id} className="p-5 hover:bg-gray-50 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><span className="font-medium">Email:</span> {agent.email}</div>
                      <div><span className="font-medium">Phone:</span> {agent.phone}</div>
                      <div><span className="font-medium">Business:</span> {agent.businessName || agent.agentVerification?.businessInfo?.businessName || 'N/A'}</div>
                      <div><span className="font-medium">Address:</span> {agent.businessAddress || agent.agentVerification?.businessInfo?.businessAddress || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(agent.id)}
                      disabled={processingId === agent.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {processingId === agent.id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(agent.id)}
                      disabled={processingId === agent.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
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
    </div>
  )
}
