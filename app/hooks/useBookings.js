'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const useBookings = () => {
  const { user, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('iwada_token')}`
        }
      })
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('iwada_token')}`
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed')
      }

      toast.success('Booking confirmed!')
      await fetchBookings()
      return { success: true, booking: data }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('iwada_token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Cancellation failed')
      }

      toast.success('Booking cancelled successfully')
      await fetchBookings()
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [isAuthenticated])

  return {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    cancelBooking
  }
}