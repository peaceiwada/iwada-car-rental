'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

// Create and export context
export const AuthContext = createContext()

// User roles
export const UserRole = {
  ADMIN: 'admin',
  AGENT: 'agent',
  BOOKER: 'booker'
}

// Agent verification status
export const AgentStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
}

// Mock users database
const mockUsers = {
  admin: {
    id: 1,
    name: 'Admin User',
    email: 'admin@iwada.com',
    phone: '+234 123 456 7890',
    role: UserRole.ADMIN,
    isVerified: true,
    permissions: ['manage_cars', 'manage_bookings', 'manage_users', 'verify_agents', 'approve_cars']
  },
  booker: {
    id: 2,
    name: 'Demo Booker',
    email: 'booker@example.com',
    phone: '+234 123 456 7890',
    role: UserRole.BOOKER,
    isVerified: true,
    permissions: ['book_cars', 'view_bookings', 'cancel_bookings']
  }
}

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('iwada_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      if (email === 'admin@iwada.com' && password === 'admin123') {
        const mockUser = mockUsers.admin
        const mockToken = 'mock-jwt-token-admin-' + Date.now()
        
        setUser(mockUser)
        localStorage.setItem('iwada_user', JSON.stringify(mockUser))
        localStorage.setItem('iwada_token', mockToken)
        toast.success(`Welcome Admin ${mockUser.name}!`)
        return { success: true, role: UserRole.ADMIN }
      }
      else if (email === 'booker@example.com' && password === 'password123') {
        const mockUser = mockUsers.booker
        const mockToken = 'mock-jwt-token-booker-' + Date.now()
        
        setUser(mockUser)
        localStorage.setItem('iwada_user', JSON.stringify(mockUser))
        localStorage.setItem('iwada_token', mockToken)
        toast.success(`Welcome ${mockUser.name}!`)
        return { success: true, role: UserRole.BOOKER }
      }
      else if (email === 'verified@example.com' && password === 'password123') {
        const verifiedAgent = {
          id: 4,
          name: 'Verified Agent',
          email: 'verified@example.com',
          phone: '+234 987 654 3210',
          role: UserRole.AGENT,
          agentStatus: AgentStatus.VERIFIED,
          isVerified: true,
          verificationMessage: 'Your account has been verified! You can now post cars for rent.',
          businessName: 'Elite Auto Rentals',
          businessAddress: 'Victoria Island, Lagos',
          verifiedAt: '2024-01-16T14:30:00Z',
          verifiedBy: 'Admin User'
        }
        const mockToken = 'mock-jwt-token-verified-' + Date.now()
        
        setUser(verifiedAgent)
        localStorage.setItem('iwada_user', JSON.stringify(verifiedAgent))
        localStorage.setItem('iwada_token', mockToken)
        toast.success(`Welcome Agent ${verifiedAgent.name}!`)
        return { success: true, role: UserRole.AGENT, agentStatus: AgentStatus.VERIFIED }
      }
      else if (email === 'agent@example.com' && password === 'password123') {
        const pendingAgent = {
          id: 3,
          name: 'Demo Agent',
          email: 'agent@example.com',
          phone: '+234 123 456 7890',
          role: UserRole.AGENT,
          agentStatus: AgentStatus.PENDING,
          isVerified: false,
          verificationMessage: 'Your account is pending admin verification.',
          businessName: 'Premium Car Rentals',
          businessAddress: 'Lagos, Nigeria'
        }
        const mockToken = 'mock-jwt-token-agent-' + Date.now()
        
        setUser(pendingAgent)
        localStorage.setItem('iwada_user', JSON.stringify(pendingAgent))
        localStorage.setItem('iwada_token', mockToken)
        toast.warning('Your account is pending admin verification.')
        return { success: true, role: UserRole.AGENT, agentStatus: AgentStatus.PENDING }
      }
      else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      if (userData.role === UserRole.AGENT) {
        const newAgent = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: UserRole.AGENT,
          agentStatus: AgentStatus.PENDING,
          isVerified: false,
          verificationMessage: 'Your account is pending admin verification.',
          businessName: userData.businessName || '',
          businessAddress: userData.businessAddress || '',
          registrationDate: new Date().toISOString()
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        setUser(newAgent)
        localStorage.setItem('iwada_user', JSON.stringify(newAgent))
        localStorage.setItem('iwada_token', mockToken)
        
        toast.success('Agent account created! Pending admin verification.')
        return { success: true, role: UserRole.AGENT, agentStatus: AgentStatus.PENDING }
      } else {
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: UserRole.BOOKER,
          isVerified: true,
          registrationDate: new Date().toISOString()
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        setUser(newUser)
        localStorage.setItem('iwada_user', JSON.stringify(newUser))
        localStorage.setItem('iwada_token', mockToken)
        
        toast.success(`Welcome ${newUser.name}!`)
        return { success: true, role: UserRole.BOOKER }
      }
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

  const isAdmin = () => user?.role === UserRole.ADMIN
  const isAgent = () => user?.role === UserRole.AGENT
  const isBooker = () => user?.role === UserRole.BOOKER
  const isAgentVerified = () => user?.agentStatus === AgentStatus.VERIFIED
  const isAgentPending = () => user?.agentStatus === AgentStatus.PENDING

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isAgent,
    isBooker,
    isAgentVerified,
    isAgentPending,
    userRole: user?.role || null,
    agentStatus: user?.agentStatus || null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}