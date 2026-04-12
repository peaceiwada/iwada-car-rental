'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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

// Create Context
export const AuthContext = createContext()

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

export default function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialCheckDone = useRef(false)

  useEffect(() => {
    if (initialCheckDone.current) return
    initialCheckDone.current = true
    
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('iwada_user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          console.log('Session restored for:', parsedUser.email)
        }
      } catch (error) {
        console.error('Error loading user session:', error)
        localStorage.removeItem('iwada_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email)
      
      // Check registered users from localStorage first
      const existingUsers = JSON.parse(localStorage.getItem('iwada_users') || '[]')
      const registeredUser = existingUsers.find(u => u.email === email && u.password === password)
      
      if (registeredUser) {
        if (registeredUser.role === UserRole.AGENT) {
          const agentStatus = registeredUser.agentVerification?.status || AgentStatus.PENDING
          
          if (agentStatus === AgentStatus.PENDING) {
            const { password: _, ...userWithoutPassword } = registeredUser
            setUser(userWithoutPassword)
            localStorage.setItem('iwada_user', JSON.stringify(userWithoutPassword))
            localStorage.setItem('iwada_token', 'mock-jwt-token-' + Date.now())
            toast.warning('Your account is pending admin verification.')
            return { success: true, role: UserRole.AGENT, agentStatus: AgentStatus.PENDING }
          }
          
          if (agentStatus === AgentStatus.VERIFIED) {
            const { password: _, ...userWithoutPassword } = registeredUser
            setUser(userWithoutPassword)
            localStorage.setItem('iwada_user', JSON.stringify(userWithoutPassword))
            localStorage.setItem('iwada_token', 'mock-jwt-token-' + Date.now())
            toast.success(`Welcome back, ${registeredUser.name}!`)
            return { success: true, role: UserRole.AGENT, agentStatus: AgentStatus.VERIFIED }
          }
        }
        
        // Regular user login
        const { password: _, ...userWithoutPassword } = registeredUser
        setUser(userWithoutPassword)
        localStorage.setItem('iwada_user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('iwada_token', 'mock-jwt-token-' + Date.now())
        toast.success(`Welcome back, ${registeredUser.name}!`)
        return { success: true, role: registeredUser.role }
      }
      
      // Demo accounts
      if (email === 'admin@iwada.com' && password === 'admin123') {
        const mockUser = mockUsers.admin
        setUser(mockUser)
        localStorage.setItem('iwada_user', JSON.stringify(mockUser))
        localStorage.setItem('iwada_token', 'mock-jwt-token-admin-' + Date.now())
        toast.success(`Welcome Admin ${mockUser.name}!`)
        return { success: true, role: UserRole.ADMIN }
      }
      else if (email === 'booker@example.com' && password === 'password123') {
        const mockUser = mockUsers.booker
        setUser(mockUser)
        localStorage.setItem('iwada_user', JSON.stringify(mockUser))
        localStorage.setItem('iwada_token', 'mock-jwt-token-booker-' + Date.now())
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
          businessName: 'Elite Auto Rentals',
          businessAddress: 'Victoria Island, Lagos'
        }
        setUser(verifiedAgent)
        localStorage.setItem('iwada_user', JSON.stringify(verifiedAgent))
        localStorage.setItem('iwada_token', 'mock-jwt-token-verified-' + Date.now())
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
          businessName: 'Premium Car Rentals',
          businessAddress: 'Lagos, Nigeria'
        }
        setUser(pendingAgent)
        localStorage.setItem('iwada_user', JSON.stringify(pendingAgent))
        localStorage.setItem('iwada_token', 'mock-jwt-token-agent-' + Date.now())
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
      const existingUsers = JSON.parse(localStorage.getItem('iwada_users') || '[]')
      const userExists = existingUsers.some(u => u.email === userData.email)
      
      if (userExists) {
        throw new Error('User already exists with this email. Please login instead.')
      }
      
      if (userData.role === UserRole.AGENT) {
        const newAgent = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          role: UserRole.AGENT,
          agentStatus: AgentStatus.PENDING,
          isVerified: false,
          businessName: userData.businessName || '',
          businessAddress: userData.businessAddress || '',
          registrationDate: new Date().toISOString(),
          agentVerification: {
            status: AgentStatus.PENDING,
            submittedAt: new Date().toISOString(),
            documents: {
              idType: userData.idType || null,
              idNumber: userData.idNumber || '',
            },
            businessInfo: {
              businessName: userData.businessName || '',
              businessAddress: userData.businessAddress || '',
            },
            contactInfo: {
              phone: userData.phone || '',
              whatsapp: userData.whatsapp || '',
              email: userData.email
            }
          },
          agentStats: {
            totalListings: 0,
            totalBookings: 0,
            totalEarnings: 0,
            averageRating: 0,
            totalReviews: 0
          }
        }
        
        existingUsers.push(newAgent)
        localStorage.setItem('iwada_users', JSON.stringify(existingUsers))
        
        const { password: _, ...userWithoutPassword } = newAgent
        setUser(userWithoutPassword)
        localStorage.setItem('iwada_user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('iwada_token', 'mock-jwt-token-' + Date.now())
        
        toast.success('Agent account created! Please complete verification.')
        return { success: true, role: UserRole.AGENT, agentStatus: AgentStatus.PENDING, redirectTo: '/agent/verification' }
      } else {
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          role: UserRole.BOOKER,
          isVerified: true,
          registrationDate: new Date().toISOString(),
          userProfile: {
            preferredLocation: '',
            rentalHistory: [],
            savedCars: []
          }
        }
        
        existingUsers.push(newUser)
        localStorage.setItem('iwada_users', JSON.stringify(existingUsers))
        
        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)
        localStorage.setItem('iwada_user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('iwada_token', 'mock-jwt-token-' + Date.now())
        
        toast.success(`Welcome ${newUser.name}!`)
        return { success: true, role: UserRole.BOOKER, redirectTo: '/user/dashboard' }
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
    router.push('/')
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const existingUsers = JSON.parse(localStorage.getItem('iwada_users') || '[]')
      const userIndex = existingUsers.findIndex(u => u.id === user.id)
      
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates }
        localStorage.setItem('iwada_users', JSON.stringify(existingUsers))
        
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem('iwada_user', JSON.stringify(updatedUser))
        
        toast.success('Profile updated successfully!')
        return { success: true, user: updatedUser }
      }
      throw new Error('Failed to update profile')
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isAgent: user?.role === UserRole.AGENT,
    isBooker: user?.role === UserRole.BOOKER,
    isAgentVerified: user?.role === UserRole.AGENT && (user?.agentStatus === AgentStatus.VERIFIED || user?.agentVerification?.status === AgentStatus.VERIFIED),
    isAgentPending: user?.role === UserRole.AGENT && (user?.agentStatus === AgentStatus.PENDING || user?.agentVerification?.status === AgentStatus.PENDING),
    userRole: user?.role || null,
    userId: user?.id || null,
    userName: user?.name || null,
    userEmail: user?.email || null,
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}