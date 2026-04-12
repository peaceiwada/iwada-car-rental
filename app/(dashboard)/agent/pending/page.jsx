'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { getUserByEmail } from '../../../lib/storage'
import { Routes } from '../../../lib/constants'
import { 
  FaClock, FaSpinner, FaEnvelope, FaPhone, FaStore, 
  FaMapMarkerAlt, FaCheckCircle, FaArrowLeft, FaSyncAlt
} from 'react-icons/fa'

export default function AgentPendingPage() {
  const router = useRouter()
  const { user, isAgentVerified, isAuthenticated, logout } = useAuth()
  const [checking, setChecking] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (isAgentVerified) {
      router.push(Routes.AGENT_DASHBOARD)
    }
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAgentVerified, isAuthenticated, router])

  useEffect(() => {
    const submittedAt = user?.agentVerification?.submittedAt || user?.registrationDate
    if (submittedAt) {
      const submittedDate = new Date(submittedAt)
      const estimatedDate = new Date(submittedDate)
      estimatedDate.setHours(submittedDate.getHours() + 48)
      const now = new Date()
      const diff = estimatedDate - now
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        setTimeLeft(`~${hours} hours remaining`)
      } else {
        setTimeLeft('Any moment now')
      }
    } else {
      setTimeLeft('24-48 hours')
    }
  }, [user])

  const handleCheckStatus = async () => {
    setChecking(true)
    
    try {
      // Refresh user data from localStorage
      const updatedUser = getUserByEmail(user?.email)
      
      if (updatedUser) {
        const isNowVerified = updatedUser.agentVerification?.status === 'verified' || 
                              updatedUser.agentStatus === 'verified'
        
        if (isNowVerified) {
          // Update local storage and force logout/login to refresh session
          localStorage.setItem('iwada_user', JSON.stringify(updatedUser))
          // Small delay then redirect
          setTimeout(() => {
            window.location.href = '/agent/dashboard'
          }, 500)
        } else {
          alert('Your account is still pending verification. Please check back later.')
        }
      } else {
        alert('Unable to check status. Please try again.')
      }
    } catch (error) {
      console.error('Error checking status:', error)
      alert('Error checking status. Please refresh the page.')
    } finally {
      setChecking(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <FaClock className="text-white text-4xl animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification in Progress</h1>
            <p className="text-amber-100">Your agent account is being reviewed</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <FaSpinner className="text-amber-600 animate-spin" />
                <h3 className="font-semibold text-gray-800">Status: Pending Review</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Thank you for submitting your verification documents. Our admin team is reviewing your application.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-blue-600" />
                <h3 className="font-semibold text-blue-800">Estimated Wait Time</h3>
              </div>
              <p className="text-blue-700 text-sm">⏱️ {timeLeft} • Typical approval time is 24-48 hours</p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Application Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaStore className="text-amber-500" />
                  <span className="font-medium">Business:</span>
                  <span>{user?.agentVerification?.businessInfo?.businessName || user?.businessName || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-amber-500" />
                  <span className="font-medium">Address:</span>
                  <span>{user?.agentVerification?.businessInfo?.businessAddress || user?.businessAddress || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-amber-500" />
                  <span className="font-medium">Email:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-amber-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{user?.phone}</span>
                </div>
              </div>
            </div>
            
            {user?.agentVerification?.documents?.idType && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600 text-sm" />
                  <span className="text-sm text-green-700">
                    ID Submitted: {user.agentVerification.documents.idType.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleCheckStatus}
                disabled={checking}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {checking ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <FaSyncAlt />
                    Check Status
                  </>
                )}
              </button>
              
              <Link href="/">
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <FaArrowLeft size={14} />
                  Return to Homepage
                </button>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Need help? Contact us at{' '}
                <a href="mailto:support@iwadarentals.com" className="text-amber-600 hover:text-amber-700">
                  support@iwadarentals.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}