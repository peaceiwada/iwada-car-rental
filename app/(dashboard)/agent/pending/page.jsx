'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../components/auth/AuthProvider'
import { syncAgentStatus } from '../../../lib/agentStorage'
import Link from 'next/link'

export default function AgentPendingPage() {
  const { user, isAgentVerified, isAgentPending, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If verified, redirect to dashboard
    if (isAuthenticated && isAgentVerified()) {
      router.push('/agent/dashboard')
    }
    // If not agent, redirect to home
    if (isAuthenticated && user?.role !== 'agent') {
      router.push('/')
    }
  }, [isAgentVerified, isAuthenticated, router, user?.role])

  const handleRefreshStatus = () => {
    const updatedUser = syncAgentStatus(user?.email)
    if (updatedUser && updatedUser.agentStatus === 'verified') {
      window.location.href = '/agent/dashboard'
    } else {
      alert('Still pending verification. Please wait for admin approval.')
    }
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Pending Verification</h1>
          <p className="text-gray-600 mb-6">
            Your agent account is awaiting admin verification. You will be notified once approved.
          </p>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-amber-800 font-semibold mb-2">Account Details:</p>
            <p className="text-sm text-gray-700"> Name: {user?.name}</p>
            <p className="text-sm text-gray-700">Business: {user?.businessName}</p>
            <p className="text-sm text-gray-700">Email: {user?.email}</p>
            <p className="text-sm text-gray-700">Registered: {new Date(user?.registrationDate).toLocaleDateString()}</p>
          </div>
          
          <button
            onClick={handleRefreshStatus}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all mb-4"
          >
            🔄 Check Verification Status
          </button>
          
          <Link href="/">
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              Return to Home
            </button>
          </Link>
          
          <p className="text-xs text-gray-400 mt-6">
            Need help? Contact support at support@iwadarentals.com
          </p>
        </div>
      </div>
    </div>
  )
}