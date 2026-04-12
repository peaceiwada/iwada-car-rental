'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { UserRoute } from '../../../components/auth/ProtectedRoute'
import { updateUser, getBookingsByUser } from '../../../lib/storage'
import { formatNaira, formatDate } from '../../../lib/constants'
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaCalendarAlt,
  FaCar,
  FaMoneyBillWave
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function UserProfilePage() {
  const router = useRouter()
  const { user, updateProfile, changePassword, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    memberSince: ''
  })
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    location: ''
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
        location: user?.userProfile?.preferredLocation || ''
      })
      
      // Load user stats
      const userBookings = getBookingsByUser(user?.id)
      const completedBookings = userBookings.filter(b => b.status === 'completed')
      const totalSpent = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      
      setStats({
        totalBookings: userBookings.length,
        totalSpent: totalSpent,
        memberSince: user?.createdAt || new Date().toISOString()
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
        userProfile: {
          ...user?.userProfile,
          preferredLocation: profileForm.location
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

  const formatMemberSince = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <UserRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/user/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-amber-600 truncate">{formatNaira(stats.totalSpent)}</p>
              </div>
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-sm font-semibold text-gray-800">{formatMemberSince(stats.memberSince)}</p>
              </div>
              <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-amber-500" />
                Profile Information
              </h2>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
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
                  Preferred Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    placeholder="e.g., Lagos, Nigeria"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Used for car search recommendations</p>
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
                    Confirm Password *
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Link href="/user/bookings" className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">My Bookings</h3>
                <p className="text-blue-100 text-sm">View your rental history</p>
              </div>
              <FaCalendarAlt className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/user/favorites" className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">My Favorites</h3>
                <p className="text-red-100 text-sm">View saved cars</p>
              </div>
              <FaHeart className="text-3xl opacity-80" />
            </div>
          </Link>
        </div>
      </div>
    </UserRoute>
  )
}