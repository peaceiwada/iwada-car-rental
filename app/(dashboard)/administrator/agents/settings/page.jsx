'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { updateUser } from '../../../lib/storage'
import { 
  FaUser, 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaStore, 
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AgentSettingsPage() {
  const router = useRouter()
  const { user, updateProfile, changePassword, isAgentVerified } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    businessName: '',
    businessAddress: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user?.name || '',
        phone: user?.phone || '',
        whatsapp: user?.agentVerification?.contactInfo?.whatsapp || user?.phone || '',
        businessName: user?.agentVerification?.businessInfo?.businessName || user?.businessName || '',
        businessAddress: user?.agentVerification?.businessInfo?.businessAddress || user?.businessAddress || ''
      })
    }
  }, [user])

  const validateProfileForm = () => {
    const newErrors = {}
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!profileForm.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!profileForm.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }
    if (!profileForm.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateProfileForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setLoading(true)
    
    try {
      const updates = {
        name: profileForm.name,
        phone: profileForm.phone,
        businessName: profileForm.businessName,
        businessAddress: profileForm.businessAddress,
        agentVerification: {
          ...user?.agentVerification,
          contactInfo: {
            ...user?.agentVerification?.contactInfo,
            phone: profileForm.phone,
            whatsapp: profileForm.whatsapp,
            email: user?.email
          },
          businessInfo: {
            ...user?.agentVerification?.businessInfo,
            businessName: profileForm.businessName,
            businessAddress: profileForm.businessAddress
          }
        }
      }
      
      const result = await updateProfile(updates)
      
      if (result.success) {
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setPasswordLoading(true)
    
    try {
      const result = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )
      
      if (result.success) {
        toast.success('Password changed successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  if (!isAgentVerified) {
    return null
  }

  return (
    <AgentRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/agent/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account and business information</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-amber-500" />
                Profile Information
              </h2>
              <p className="text-sm text-gray-500">Update your personal and business details</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.name ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="+234 801 234 5678"
                      className={`w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.phone ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <FaWhatsapp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={profileForm.whatsapp}
                      onChange={handleProfileChange}
                      placeholder="+234 801 234 5678"
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Customers can reach you via WhatsApp</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaStore className="text-amber-500" />
                  Business Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <div className="relative">
                      <FaStore className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="businessName"
                        value={profileForm.businessName}
                        onChange={handleProfileChange}
                        className={`w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          errors.businessName ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.businessName && <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address *
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="businessAddress"
                        value={profileForm.businessAddress}
                        onChange={handleProfileChange}
                        className={`w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          errors.businessAddress ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.businessAddress && <p className="mt-1 text-xs text-red-500">{errors.businessAddress}</p>}
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Profile Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaLock className="text-amber-500" />
                Change Password
              </h2>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.currentPassword ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-500"
                  >
                    {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.newPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-500"
                    >
                      {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <FaCheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-500"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Verification Status */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-green-600 text-lg mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">Verified Agent Account</p>
                <p className="text-xs text-green-700 mt-1">
                  Your account has been verified. You have full access to all agent features including listing cars, managing bookings, and receiving payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgentRoute>
  )
}