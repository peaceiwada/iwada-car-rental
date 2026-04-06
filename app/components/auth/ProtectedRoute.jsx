'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import LoadingSkeleton from '../layout/LoadingSkeleton'

export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}