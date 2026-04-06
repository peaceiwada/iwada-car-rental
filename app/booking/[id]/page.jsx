'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaCar, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { useAuth } from '../../components/auth/AuthProvider'
import { useBookings } from '../../hooks/useBookings'
import { formatPrice, calculateDays, formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { createBooking } = useBookings()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking/${params.id}`)
      return
    }
    fetchCarDetails()
  }, [params.id, isAuthenticated])

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`/api/cars/${params.id}`)
      const data = await response.json()
      setCar(data)
    } catch (error) {
      console.error('Error fetching car:', error)
      toast.error('Failed to load car details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!bookingData.pickupDate || !bookingData.returnDate) {
      toast.error('Please select pickup and return dates')
      return
    }

    const pickup = new Date(bookingData.pickupDate)
    const returnD = new Date(bookingData.returnDate)
    
    if (pickup >= returnD) {
      toast.error('Return date must be after pickup date')
      return
    }

    const days = calculateDays(bookingData.pickupDate, bookingData.returnDate)
    const totalPrice = days * (car.pricePerDay || car.price)

    setIsSubmitting(true)
    const result = await createBooking({
      carId: car.id,
      pickupDate: bookingData.pickupDate,
      returnDate: bookingData.returnDate,
      totalPrice
    })
    
    if (result.success) {
      router.push('/dashboard')
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
        <Link href="/cars" className="text-blue-600 hover:underline">
          Browse Available Cars
        </Link>
      </div>
    )
  }

  const days = calculateDays(bookingData.pickupDate, bookingData.returnDate)
  const totalPrice = days * (car.pricePerDay || car.price)

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href={`/cars/${car.id}`} 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <FaArrowLeft /> Back to Car Details
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600 mt-1">Review details and confirm your reservation</p>
          </div>

          <div className="p-6">
            {/* Car Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FaCar className="text-gray-400 text-3xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FaMapMarkerAlt size={12} />
                    <span>{car.location || 'Lagos, Nigeria'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(car.pricePerDay || car.price)}
                    </span>
                    <span className="text-gray-500"> / day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookingData.pickupDate}
                      onChange={(e) => setBookingData({...bookingData, pickupDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookingData.returnDate}
                      onChange={(e) => setBookingData({...bookingData, returnDate: e.target.value})}
                      min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {bookingData.pickupDate && bookingData.returnDate && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-3">Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>{formatPrice(car.pricePerDay || car.price)} x {days} {days === 1 ? 'day' : 'days'}</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !bookingData.pickupDate || !bookingData.returnDate}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  By confirming, you agree to our terms and conditions. Free cancellation up to 24 hours before pickup.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}