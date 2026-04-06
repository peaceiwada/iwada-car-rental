'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('iwada_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Mock login - In production, this would call your API
      if (email === 'user@example.com' && password === 'password123') {
        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'user@example.com',
          phone: '+234 123 456 7890'
        }
        const mockToken = 'mock-jwt-token-12345'
        
        setUser(mockUser)
        localStorage.setItem('iwada_user', JSON.stringify(mockUser))
        localStorage.setItem('iwada_token', mockToken)
        toast.success('Login successful!')
        return { success: true }
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // Mock registration - In production, this would call your API
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      setUser(mockUser)
      localStorage.setItem('iwada_user', JSON.stringify(mockUser))
      localStorage.setItem('iwada_token', mockToken)
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('iwada_user')
    localStorage.removeItem('iwada_token')
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}