'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByAgent } from '../../../lib/storage'
import { formatDate } from '../../../lib/constants'
import { FaArrowLeft, FaStar, FaUser } from 'react-icons/fa'

export default function AgentReviewsPage() {
  const { user, isAgentVerified } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAgentVerified && user) loadReviews()
  }, [isAgentVerified, user])

  const loadReviews = () => {
    try {
      const bookings = getBookingsByAgent(user.id) || []
      const completedWithRating = bookings.filter(b => b.status === 'completed' && b.rating)
      setReviews(completedWithRating)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAgentVerified) return null
  if (loading) return <div className='p-6 text-center'>Loading reviews...</div>

  return (
    <AgentRoute>
      <div className='p-6 max-w-7xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <Link href='/agent/dashboard'><FaArrowLeft className='text-gray-500 hover:text-amber-600' /></Link>
          <h1 className='text-2xl font-bold'>Customer Reviews</h1>
        </div>
        {reviews.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-xl shadow'>No reviews yet.</div>
        ) : (
          <div className='space-y-4'>
            {reviews.map(r => (
              <div key={r.id} className='bg-white rounded-xl shadow p-4 border'>
                <div className='flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <FaUser className='text-gray-400' />
                    <span className='font-semibold'>{r.userName}</span>
                  </div>
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < r.rating ? 'text-yellow-500' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className='mt-2 text-gray-600'>{r.comment || 'No comment provided.'}</p>
                <p className='text-xs text-gray-400 mt-2'>{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AgentRoute>
  )
}
