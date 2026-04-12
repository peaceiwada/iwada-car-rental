'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEnvelope, FaLock, FaCar, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'
import { useAuth } from '../../components/auth/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Use redirectTo from login response if available
      if (result.redirectTo) {
        router.push(result.redirectTo)
      } else if (result.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (result.role === 'agent') {
        router.push('/agent/dashboard')
      } else if (result.role === 'booker') {
        router.push('/user/dashboard')
      } else {
        router.push('/')
      }
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 mt-11">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl shadow-lg">
              <FaCar className="text-4xl text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
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
                  className="block w-full pl-10 pr-3 py-3 border-2 border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
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
                  className="block w-full pl-10 pr-10 py-3 border-2 border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-500 border-2 border-amber-200 rounded focus:ring-amber-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FaArrowRight />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            Secure Login
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            24/7 Support
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  )
}