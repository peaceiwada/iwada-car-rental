'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByAgent, getCarsByAgent } from '../../../lib/storage'
import { formatNaira } from '../../../lib/constants'
import { FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa'

export default function AgentEarningsPage() {
  const { user, isAgentVerified } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalEarnings: 0, totalBookings: 0, totalCars: 0 })

  useEffect(() => {
    if (isAgentVerified && user) {
      const agentCars = getCarsByAgent(user.id) || []
      const agentBookings = getBookingsByAgent(user.id) || []
      const completed = agentBookings.filter(b => b.status === 'completed')
      const earnings = completed.reduce((s, b) => s + (b.totalPrice || 0), 0)
      setStats({ totalEarnings: earnings, totalBookings: agentBookings.length, totalCars: agentCars.length })
      setLoading(false)
    }
  }, [isAgentVerified, user])

  if (loading) return <div className='p-6 text-center'>Loading...</div>

  return (
    <AgentRoute>
      <div className='p-6 max-w-7xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <Link href='/agent/dashboard' className='text-gray-500 hover:text-amber-600'><FaArrowLeft size={20} /></Link>
          <h1 className='text-2xl font-bold'>Earnings</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white'>
            <FaMoneyBillWave className='text-3xl mb-2' />
            <p className='text-sm opacity-90'>Total Earnings</p>
            <p className='text-2xl font-bold'>{formatNaira(stats.totalEarnings)}</p>
          </div>
          <div className='bg-white rounded-xl shadow p-5 border'>
            <p className='text-gray-500'>Total Bookings</p>
            <p className='text-2xl font-bold'>{stats.totalBookings}</p>
          </div>
          <div className='bg-white rounded-xl shadow p-5 border'>
            <p className='text-gray-500'>Active Cars</p>
            <p className='text-2xl font-bold'>{stats.totalCars}</p>
          </div>
        </div>
      </div>
    </AgentRoute>
  )
}
