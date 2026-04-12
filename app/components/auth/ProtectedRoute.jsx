'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { UserRole, Routes } from '../../lib/constants'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireVerification = true,
  redirectTo = null 
}) {
  const router = useRouter()
  const { 
    user, 
    loading, 
    isAuthenticated, 
    isAdmin, 
    isAgent, 
    isBooker,
    isAgentVerified,
    isAgentPending
  } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      const redirectPath = redirectTo || Routes.LOGIN
      router.push(`${redirectPath}?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (allowedRoles.length > 0) {
      let hasAllowedRole = false
      
      for (const role of allowedRoles) {
        if (role === UserRole.ADMIN && isAdmin) {
          hasAllowedRole = true
          break
        }
        if (role === UserRole.AGENT && isAgent) {
          hasAllowedRole = true
          break
        }
        if (role === UserRole.BOOKER && isBooker) {
          hasAllowedRole = true
          break
        }
      }
      
      if (!hasAllowedRole) {
        if (isAdmin) {
          router.push(Routes.ADMIN_DASHBOARD)
        } else if (isAgent) {
          router.push(Routes.AGENT_DASHBOARD)
        } else if (isBooker) {
          router.push(Routes.USER_DASHBOARD)
        } else {
          router.push(Routes.HOME)
        }
        return
      }
    }

    if (requireVerification && isAgent && !isAgentVerified) {
      router.push(Routes.AGENT_VERIFICATION)
      return
    }

  }, [loading, isAuthenticated, router, allowedRoles, requireVerification, redirectTo, isAdmin, isAgent, isBooker, isAgentVerified])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles.length > 0) {
    let hasAllowedRole = false
    for (const role of allowedRoles) {
      if (role === UserRole.ADMIN && isAdmin) hasAllowedRole = true
      if (role === UserRole.AGENT && isAgent) hasAllowedRole = true
      if (role === UserRole.BOOKER && isBooker) hasAllowedRole = true
    }
    if (!hasAllowedRole) return null
  }

  if (requireVerification && isAgent && !isAgentVerified) {
    return null
  }

  return <>{children}</>
}

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
    {children}
  </ProtectedRoute>
)

export const AgentRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[UserRole.AGENT]} requireVerification={true}>
    {children}
  </ProtectedRoute>
)

export const UserRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[UserRole.BOOKER]}>
    {children}
  </ProtectedRoute>
)