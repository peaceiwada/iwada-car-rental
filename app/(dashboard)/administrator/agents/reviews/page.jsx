'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../components/auth/ProtectedRoute'
import { getBookingsByAgent, getCarsByAgent } from '../../../lib/storage'
import { formatDate, formatNaira } from '../../../lib/constants'
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar,
  FaUser,
  FaCar,
  FaCalendarAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaReply
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AgentReviewsPage() {
  const router = useRouter()
  const { user, isAgentVerified } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  })
  const [selectedRating, setSelectedRating] = useState('all')

  useEffect(() => {
    if (isAgentVerified && user) {
      loadReviews()
    }
  }, [isAgentVerified, user])

  const loadReviews = () => {
    try {
      const agentCars = getCarsByAgent(user?.id)
      const agentBookings = getBookingsByAgent(user?.id)
      const completedBookings = agentBookings.filter(b => b.status === 'completed' && b.rating)
      
      // Mock reviews data (in real app, this would come from storage)
      const mockReviews = [
        {
          id: 1,
          carName: 'Toyota Camry',
          carId: 1,
          userName: 'John Adebayo',
          userAvatar: 'JA',
          rating: 5,
          comment: 'Excellent car! Very clean and well maintained. The agent was very professional and responsive.',
          date: '2025-01-20T10:30:00Z',
          helpful: 12,
          notHelpful: 1,
          agentReply: null
        },
        {
          id: 2,
          carName: 'Lexus RX 350',
          carId: 2,
          userName: 'Sarah Okafor',
          userAvatar: 'SO',
          rating: 5,
          comment: 'Amazing experience! The car was in perfect condition. Will definitely rent again.',
          date: '2025-02-15T14:20:00Z',
          helpful: 8,
          notHelpful: 0,
          agentReply: 'Thank you so much for your kind words! We look forward to serving you again.'
        },
        {
          id: 3,
          carName: 'Mercedes C-Class',
          carId: 3,
          userName: 'Michael Eze',
          userAvatar: 'ME',
          rating: 4,
          comment: 'Great car, smooth ride. Slight delay in pickup but overall good experience.',
          date: '2025-03-10T09:45:00Z',
          helpful: 5,
          notHelpful: 2,
          agentReply: null
        },
        {
          id: 4,
          carName: 'Toyota Corolla',
          carId: 4,
          userName: 'Chioma Nwosu',
          userAvatar: 'CN',
          rating: 5,
          comment: 'Very affordable and reliable. The agent was very helpful throughout the process.',
          date: '2025-03-25T16:15:00Z',
          helpful: 15,
          notHelpful: 0,
          agentReply: 'We appreciate your feedback! Thank you for choosing us.'
        },
        {
          id: 5,
          carName: 'Hyundai Santa Fe',
          carId: 5,
          userName: 'David Okonkwo',
          userAvatar: 'DO',
          rating: 3,
          comment: 'Car was okay but had some minor issues. Agent was responsive though.',
          date: '2025-04-01T11:00:00Z',
          helpful: 3,
          notHelpful: 1,
          agentReply: null
        }
      ]
      
      setReviews(mockReviews)
      calculateStats(mockReviews)
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Error loading reviews')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviewsList) => {
    const total = reviewsList.length
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0)
    const average = total > 0 ? sum / total : 0
    
    const fiveStar = reviewsList.filter(r => r.rating === 5).length
    const fourStar = reviewsList.filter(r => r.rating === 4).length
    const threeStar = reviewsList.filter(r => r.rating === 3).length
    const twoStar = reviewsList.filter(r => r.rating === 2).length
    const oneStar = reviewsList.filter(r => r.rating === 1).length
    
    setStats({
      averageRating: average.toFixed(1),
      totalReviews: total,
      fiveStar,
      fourStar,
      threeStar,
      twoStar,
      oneStar
    })
  }

  const getFilteredReviews = () => {
    if (selectedRating === 'all') return reviews
    return reviews.filter(r => r.rating === parseInt(selectedRating))
  }

  const handleReply = (reviewId) => {
    const reply = prompt('Enter your reply to this review:')
    if (reply && reply.trim()) {
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, agentReply: reply.trim() } : r
      ))
      toast.success('Reply added successfully!')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-500" />)
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />)
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-gray-300" />)
    }
    return stars
  }

  const filteredReviews = getFilteredReviews()

  if (!isAgentVerified) {
    return null
  }

  return (
    <AgentRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/agent/dashboard" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h1>
            <p className="text-sm text-gray-500 mt-1">See what customers are saying about your cars</p>
          </div>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">{stats.averageRating}</span>
                <div>
                  <div className="flex gap-0.5">
                    {renderStars(parseFloat(stats.averageRating))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Based on {stats.totalReviews} reviews</p>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats[`${star}Star`]
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium">{star}</span>
                        <FaStar className="text-yellow-500 text-xs" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-xs text-gray-500">{count}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedRating('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedRating === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({stats.totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats[`${star}Star`]
            if (count === 0) return null
            return (
              <button
                key={star}
                onClick={() => setSelectedRating(star.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  selectedRating === star.toString()
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {star} <FaStar className="text-xs" /> ({count})
              </button>
            )
          })}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-amber-500 text-3xl" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500">When customers review your cars, they'll appear here</p>
            <Link href="/agent/cars/my-cars" className="inline-block mt-4 text-amber-600 text-sm font-semibold">
              View your cars →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  {/* Review Header */}
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {review.userAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{review.userName}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaCar className="text-amber-500" size={10} />
                          <span>{review.carName}</span>
                          <FaCalendarAlt className="text-amber-500 ml-1" size={10} />
                          <span>{formatDate(review.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {/* Helpful Section */}
                  <div className="flex items-center gap-4 mb-3">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition">
                      <FaThumbsUp size={12} />
                      <span>{review.helpful}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition">
                      <FaThumbsDown size={12} />
                      <span>{review.notHelpful}</span>
                    </button>
                  </div>

                  {/* Agent Reply */}
                  {review.agentReply ? (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                      <div className="flex items-center gap-2 mb-1">
                        <FaReply className="text-amber-500 text-xs" />
                        <span className="text-xs font-semibold text-amber-700">Your Reply:</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.agentReply}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleReply(review.id)}
                      className="mt-2 text-amber-600 text-sm hover:text-amber-700 flex items-center gap-1"
                    >
                      <FaReply size={12} /> Reply to Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AgentRoute>
  )
}