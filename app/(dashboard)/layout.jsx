'use client'

import { useAuth } from '../components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSkeleton from '../components/layout/LoadingSkeleton'

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </div>
    </div>
  )
}