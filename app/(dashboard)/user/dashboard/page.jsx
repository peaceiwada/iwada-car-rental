'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { UserRoute } from '../../../components/auth/ProtectedRoute'
import { useFavorites } from '../../../context/FavoritesContext'
import { getBookingsByUser } from '../../../lib/storage'
import { formatNaira, formatDate } from '../../../lib/constants'
import { 
  FaCar, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, 
  FaStar, FaClock, FaCheckCircle, FaTimesCircle, 
  FaBan, FaArrowRight, FaGem, FaHeart, FaTrash, FaRegHeart
} from 'react-icons/fa'

export default function UserDashboard() {
  const { user } = useAuth()
  const { favorites, removeFromFavorites, favoritesCount } = useFavorites()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showAllFavorites, setShowAllFavorites] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserBookings()
    }
  }, [user])

  const fetchUserBookings = async () => {
    try {
      let userBookings = getBookingsByUser(user?.id) || []
      
      if (userBookings.length === 0) {
        const mockBookings = [
          {
            id: 1,
            carName: 'Toyota Camry',
            pickupDate: '2025-01-15',
            returnDate: '2025-01-18',
            location: 'Lagos, Nigeria',
            totalPrice: 75000,
            status: 'completed',
            rating: 5,
          },
          {
            id: 2,
            carName: 'Lexus RX 350',
            pickupDate: '2025-02-10',
            returnDate: '2025-02-15',
            location: 'Abuja, Nigeria',
            totalPrice: 275000,
            status: 'upcoming',
            rating: null,
          },
          {
            id: 3,
            carName: 'Mercedes C-Class',
            pickupDate: '2025-03-01',
            returnDate: '2025-03-05',
            location: 'Lagos, Nigeria',
            totalPrice: 300000,
            status: 'cancelled',
            rating: null,
            cancelledAt: '2025-02-20',
            cancellationReason: 'Changed travel plans'
          }
        ]
        setBookings(mockBookings)
      } else {
        setBookings(userBookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredBookings = () => {
    if (activeTab === 'upcoming') {
      return bookings.filter(b => b.status === 'upcoming')
    } else if (activeTab === 'completed') {
      return bookings.filter(b => b.status === 'completed')
    } else if (activeTab === 'cancelled') {
      return bookings.filter(b => b.status === 'cancelled')
    }
    return bookings
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return { color: 'bg-blue-100 text-blue-700', icon: FaClock, text: 'Upcoming' }
      case 'completed':
        return { color: 'bg-emerald-100 text-emerald-700', icon: FaCheckCircle, text: 'Completed' }
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, text: 'Cancelled' }
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: FaClock, text: status }
    }
  }

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: FaCalendarAlt, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Upcoming', value: bookings.filter(b => b.status === 'upcoming').length, icon: FaClock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: FaCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: FaTimesCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Total Spent', value: formatNaira(bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)), icon: FaMoneyBillWave, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Favorites', value: favoritesCount, icon: FaHeart, color: 'text-red-600', bg: 'bg-red-100' },
  ]

  const filteredBookings = getFilteredBookings()
  const displayedFavorites = showAllFavorites ? favorites : favorites.slice(0, 3)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-200 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <UserRoute>
      <div className="px-2 sm:px-4 md:px-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <FaGem className="text-amber-600 text-sm sm:text-base" />
            <span className="text-xs sm:text-sm font-semibold text-amber-700">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Manage your bookings and track your rentals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300">
              <div className={`${stat.bg} w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3`}>
                <stat.icon className={`${stat.color} text-base sm:text-lg`} />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/cars" className="group bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1">Book a New Car</h3>
                <p className="text-amber-100 text-xs sm:text-sm">Explore our wide selection</p>
              </div>
              <FaCar className="text-2xl sm:text-3xl text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
          <Link href="/favorites" className="group bg-gradient-to-r from-red-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1">My Favorites</h3>
                <p className="text-red-100 text-xs sm:text-sm">{favoritesCount} saved cars</p>
              </div>
              <FaHeart className="text-2xl sm:text-3xl text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Favorites Section */}
        {favoritesCount > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden mb-6 sm:mb-8">
            <div className="border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <FaHeart className="text-red-500 text-lg sm:text-xl" />
                <h2 className="font-bold text-gray-800 text-base sm:text-lg">Your Favorite Cars</h2>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {favoritesCount} cars
                </span>
              </div>
              {favoritesCount > 3 && (
                <button
                  onClick={() => setShowAllFavorites(!showAllFavorites)}
                  className="text-amber-600 text-xs sm:text-sm font-semibold hover:text-amber-700 transition-colors"
                >
                  {showAllFavorites ? 'Show Less ↑' : `View All (${favoritesCount}) →`}
                </button>
              )}
            </div>
            
            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {displayedFavorites.map((car) => (
                  <div key={car.id} className="border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/cars/${car.id}`} className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-amber-600 transition-colors">
                          {car.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FaMapMarkerAlt size={10} /> {car.location || 'Lagos, Nigeria'}
                        </p>
                      </Link>
                      <button
                        onClick={() => removeFromFavorites(car.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove from favorites"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                      <div>
                        <p className="text-amber-600 font-bold text-sm sm:text-base">
                          {formatNaira(car.pricePerDay || car.price || 50000)}
                        </p>
                        <p className="text-[10px] text-gray-500">per day</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/cars/${car.id}`}>
                          <button className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors">
                            Rent Now
                          </button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2 text-[10px] text-gray-500">
                      <span>{car.seats || 4} seats</span>
                      <span>•</span>
                      <span>{car.transmission || 'Manual'}</span>
                      <span>•</span>
                      <span>{car.fuelType || 'Petrol'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
          <div className="border-b border-gray-100 px-4 sm:px-6 pt-3 sm:pt-4 overflow-x-auto">
            <div className="flex gap-2 sm:gap-4 min-w-max">
              {['upcoming', 'completed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-xs sm:text-sm transition-all duration-300 border-b-2 ${
                    activeTab === tab
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Trips
                  {tab === 'cancelled' && (
                    <span className="ml-1 text-xs text-red-500">
                      ({bookings.filter(b => b.status === 'cancelled').length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                {activeTab === 'cancelled' ? (
                  <FaTimesCircle className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                ) : (
                  <FaCar className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                )}
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">No {activeTab} bookings</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {activeTab === 'cancelled' 
                    ? "You don't have any cancelled bookings"
                    : activeTab === 'upcoming'
                    ? "When you book a car, it will appear here"
                    : "When you complete a rental, it will appear here"}
                </p>
                {activeTab === 'upcoming' && (
                  <Link href="/cars" className="inline-block mt-3 sm:mt-4 text-amber-600 font-semibold text-xs sm:text-sm hover:text-amber-700">
                    Browse Cars →
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredBookings.map((booking) => {
                  const StatusBadge = getStatusBadge(booking.status)
                  return (
                    <div key={booking.id} className="border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                            booking.status === 'cancelled' ? 'bg-red-100' : 'bg-gradient-to-br from-amber-100 to-orange-100'
                          }`}>
                            <FaCar className={`${booking.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'} text-lg sm:text-xl`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{booking.carName}</h3>
                              <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${StatusBadge.color}`}>
                                <StatusBadge.icon size={10} />
                                {StatusBadge.text}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt size={10} /> {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt size={10} /> {booking.location}
                              </span>
                            </div>
                            {booking.status === 'cancelled' && booking.cancellationReason && (
                              <p className="text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                <FaBan size={10} /> Reason: {booking.cancellationReason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 ml-13 sm:ml-0">
                          <div className="text-right">
                            <p className="font-bold text-amber-600 text-sm sm:text-base">{formatNaira(booking.totalPrice)}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
                          </div>
                          <Link href={`/cars/${booking.id}`}>
                            <button className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 whitespace-nowrap">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                      {booking.rating && (
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < booking.rating ? 'text-amber-500 text-xs sm:text-sm' : 'text-gray-200 text-xs sm:text-sm'} />
                          ))}
                          <span className="text-[10px] sm:text-xs text-gray-500 ml-2">Rated {booking.rating}/5</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserRoute>
  )
}