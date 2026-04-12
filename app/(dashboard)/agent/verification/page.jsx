'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { updateUser } from '../../../lib/storage'
import { NigerianIDTypes, Routes } from '../../../lib/constants'
import { 
  FaIdCard, 
  FaUpload, 
  FaCheckCircle, 
  FaClock,
  FaArrowLeft,
  FaSpinner,
  FaEye,
  FaRegIdCard
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AgentVerificationPage() {
  const router = useRouter()
  const { user, isAgent, isAgentVerified, isAgentPending } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    businessName: user?.agentVerification?.businessInfo?.businessName || user?.businessName || '',
    businessAddress: user?.agentVerification?.businessInfo?.businessAddress || user?.businessAddress || '',
    whatsapp: user?.agentVerification?.contactInfo?.whatsapp || user?.phone || '',
  })
  const [idCardPreview, setIdCardPreview] = useState(null)
  const [passportPreview, setPassportPreview] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // If already verified, redirect to agent dashboard
    if (isAgentVerified) {
      router.push(Routes.AGENT_DASHBOARD)
    }
  }, [isAgentVerified, router])

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'idCard') {
          setIdCardPreview(reader.result)
        } else if (type === 'passport') {
          setPassportPreview(reader.result)
        } else if (type === 'selfie') {
          setSelfiePreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.idType) {
      newErrors.idType = 'Please select an ID type'
    }
    if (!formData.idNumber) {
      newErrors.idNumber = 'ID number is required'
    }
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required'
    }
    if (!formData.businessAddress) {
      newErrors.businessAddress = 'Business address is required'
    }
    if (!idCardPreview) {
      newErrors.idCard = 'Please upload your ID card image'
    }
    if (!passportPreview) {
      newErrors.passport = 'Please upload a passport photo'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    
    try {
      const updates = {
        agentVerification: {
          status: 'pending',
          submittedAt: new Date().toISOString(),
          documents: {
            idType: formData.idType,
            idNumber: formData.idNumber,
            idCardImage: idCardPreview,
            passportPhoto: passportPreview,
            selfieWithId: selfiePreview || null
          },
          businessInfo: {
            businessName: formData.businessName,
            businessAddress: formData.businessAddress,
          },
          contactInfo: {
            phone: user?.phone,
            whatsapp: formData.whatsapp,
            email: user?.email
          }
        },
        agentStatus: 'pending',
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        agentStats: {
          totalListings: 0,
          totalBookings: 0,
          totalEarnings: 0,
          averageRating: 0,
          totalReviews: 0
        }
      }
      
      const updatedUser = updateUser(user.id, updates)
      
      if (updatedUser) {
        // Update local storage user
        const currentStoredUser = JSON.parse(localStorage.getItem('iwada_user') || '{}')
        const newUserData = { ...currentStoredUser, ...updates }
        localStorage.setItem('iwada_user', JSON.stringify(newUserData))
        
        toast.success('Verification documents submitted successfully! Admin will review your application.')
        
        // Redirect to pending page
        router.push('/agent/pending')
      } else {
        throw new Error('Failed to submit verification')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit verification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  // If not an agent, redirect
  if (!isAgent && !isAgentPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is for agents only.</p>
          <Link href="/" className="text-amber-600 hover:text-amber-700">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
            <FaRegIdCard className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Verification</h1>
          <p className="mt-2 text-gray-600">
            Please verify your identity to start listing cars for rent
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full">
            <FaClock className="text-amber-600 text-sm" />
            <span className="text-xs text-amber-700">Verification takes 24-48 hours</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-xs mt-1 text-amber-600">Register</span>
            </div>
            <div className="w-12 h-0.5 bg-amber-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-xs mt-1 text-amber-600">Verify</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-xs mt-1 text-gray-500">Start Selling</span>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* ID Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select ID Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(NigerianIDTypes).map(([key, type]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({...formData, idType: type.id})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.idType === type.id
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">
                        {key === 'NIN' && '🆔'}
                        {key === 'DRIVERS_LICENSE' && '🚗'}
                        {key === 'VOTERS_CARD' && '🗳️'}
                        {key === 'PASSPORT' && '📘'}
                      </div>
                      <span className="text-xs font-medium">
                        {key === 'NIN' && 'NIN'}
                        {key === 'DRIVERS_LICENSE' && 'Driver\'s License'}
                        {key === 'VOTERS_CARD' && 'Voter\'s Card'}
                        {key === 'PASSPORT' && 'Passport'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.idType && <p className="mt-1 text-xs text-red-500">{errors.idType}</p>}
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID Number *
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Enter your ID number"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.idNumber ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.idNumber && <p className="mt-1 text-xs text-red-500">{errors.idNumber}</p>}
            </div>

            {/* Business Information */}
            <div className="bg-amber-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaIdCard className="text-amber-600" /> Business Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your car rental business name"
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.businessName ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.businessName && <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address *
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Full business address"
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.businessAddress ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.businessAddress && <p className="mt-1 text-xs text-red-500">{errors.businessAddress}</p>}
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaUpload className="text-amber-600" /> Upload Documents
              </h3>
              
              {/* ID Card Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition">
                <input
                  type="file"
                  id="idCard"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'idCard')}
                  className="hidden"
                />
                <label htmlFor="idCard" className="cursor-pointer block">
                  {idCardPreview ? (
                    <div className="relative">
                      <img src={idCardPreview} alt="ID Card" className="max-h-40 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setIdCardPreview(null)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">🪪</div>
                      <p className="text-sm font-medium text-gray-700">Upload ID Card</p>
                      <p className="text-xs text-gray-500 mt-1">NIN, Driver's License, Voter's Card, or Passport</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.idCard && <p className="text-xs text-red-500">{errors.idCard}</p>}
              
              {/* Passport Photo Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 transition">
                <input
                  type="file"
                  id="passport"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'passport')}
                  className="hidden"
                />
                <label htmlFor="passport" className="cursor-pointer block">
                  {passportPreview ? (
                    <div className="relative">
                      <img src={passportPreview} alt="Passport" className="max-h-40 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setPassportPreview(null)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-sm font-medium text-gray-700">Upload Passport Photo</p>
                      <p className="text-xs text-gray-500 mt-1">Recent passport-sized photograph</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.passport && <p className="text-xs text-red-500">{errors.passport}</p>}
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+234 801 234 5678"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">Customers can reach you via WhatsApp</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Submit Verification
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <FaEye className="text-blue-600 text-lg mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Why verify your account?</p>
              <p className="text-xs text-blue-700 mt-1">
                Verification helps build trust with customers and unlocks the ability to:
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>✓ List unlimited cars for rent</li>
                <li>✓ Receive bookings directly from customers</li>
                <li>✓ Get featured in search results</li>
                <li>✓ Access agent-only support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-amber-600 text-sm flex items-center justify-center gap-1">
            <FaArrowLeft size={12} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}