'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import LoadingSkeleton from '../layout/LoadingSkeleton'

export default function RoleBasedRoute({ children, allowedRoles = [], redirectTo = '/' }) {
  const { isAuthenticated, loading, userRole, isAgentVerified, isAgentPending } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }
      
      // Check if user has allowed role
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        router.push(redirectTo)
        return
      }
      
      // SPECIAL CHECK: For agents, only allow access if verified
      if (userRole === 'agent') {
        if (!isAgentVerified()) {
          // Redirect to a pending page or home
          router.push('/agent/pending')
          return
        }
      }
    }
  }, [isAuthenticated, loading, userRole, allowedRoles, redirectTo, router, isAgentVerified])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!isAuthenticated) {
    return null
  }

  // Check allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null
  }
  
  // For agents, only show if verified
  if (userRole === 'agent' && !isAgentVerified()) {
    return null
  }

  return <>{children}</>
}