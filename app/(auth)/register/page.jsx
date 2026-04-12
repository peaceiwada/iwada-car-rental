'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaCar, FaEye, FaEyeSlash, 
  FaStore, FaMapMarkerAlt, FaArrowRight, FaShieldAlt, FaCheckCircle,
  FaUserPlus, FaIdCard
} from 'react-icons/fa'
import { useAuth } from '../../components/auth/AuthProvider'

// Define UserRole locally if not exported from AuthProvider
const UserRole = {
  BOOKER: 'booker',
  AGENT: 'agent',
  ADMIN: 'admin'
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(UserRole.BOOKER)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.BOOKER,
    businessName: '',
    businessAddress: ''
  })
  const [errors, setErrors] = useState({})
  const [agreeTerms, setAgreeTerms] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Agent-specific validation
    if (selectedRole === UserRole.AGENT) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required for agents'
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required for agents'
      }
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // THIS IS THE UPDATED handleSubmit FUNCTION - REPLACE YOUR OLD ONE WITH THIS
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    const { confirmPassword, ...userData } = formData
    userData.role = selectedRole
    
    const result = await register(userData)
    
    if (result.success) {
      // Use the redirectTo from the result
      if (result.redirectTo) {
        router.push(result.redirectTo)
      } else if (result.requiresApproval) {
        router.push('/agent/pending')
      } else if (selectedRole === UserRole.AGENT) {
        router.push('/agent/pending')
      } else if (selectedRole === UserRole.BOOKER) {
        router.push('/user/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
    
    setLoading(false)
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

  const handleRoleChange = (role) => {
    setSelectedRole(role)
    setFormData({
      ...formData,
      role: role
    })
    if (role !== UserRole.AGENT) {
      setErrors({
        ...errors,
        businessName: '',
        businessAddress: ''
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 mt-10">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl shadow-lg">
              <FaUserPlus className="text-4xl text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="mt-2 text-gray-500">
            Join Iwada Rentals - Choose your account type
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-amber-100">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaCar className="text-amber-500" />
            I want to:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange(UserRole.BOOKER)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === UserRole.BOOKER
                  ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <FaCar className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-semibold">Book Cars</span>
              <p className="text-xs mt-1 opacity-75">Rent cars from agents</p>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange(UserRole.AGENT)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === UserRole.AGENT
                  ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <FaStore className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-semibold">Become Agent</span>
              <p className="text-xs mt-1 opacity-75">Rent/Sell my cars</p>
            </button>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="+234 123 456 7890"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Agent-specific fields */}
            {selectedRole === UserRole.AGENT && (
              <div className="space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                  <FaStore /> Business Information
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaStore className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                        errors.businessName ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Your Car Rental Business"
                    />
                  </div>
                  {errors.businessName && <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="businessAddress"
                      type="text"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                        errors.businessAddress ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Lagos, Nigeria"
                    />
                  </div>
                  {errors.businessAddress && <p className="mt-1 text-xs text-red-500">{errors.businessAddress}</p>}
                </div>

                <div className="bg-amber-100/50 p-3 rounded-lg">
                  <p className="text-xs text-amber-700 flex items-start gap-2">
                    <FaShieldAlt className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Agent accounts require admin verification. You'll be notified once approved.</span>
                  </p>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-amber-500 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-amber-500 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-400">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCheckCircle className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-amber-500 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-amber-500 transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-amber-500 border-2 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <FaArrowRight />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <FaIdCard className="text-amber-600 text-lg mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Account Types:</p>
              <p className="text-xs text-amber-700 mt-1">
                • <span className="font-medium">Booker:</span> Regular user who rents cars<br />
                • <span className="font-medium">Agent:</span> Car owner who lists vehicles (requires verification)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}