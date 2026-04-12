'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { UserRoute } from '../../../components/auth/ProtectedRoute'
import { useFavorites } from '../../../context/FavoritesContext'
import { formatNaira } from '../../../lib/constants'
import { 
  FaHeart, 
  FaTrash, 
  FaCar, 
  FaMapMarkerAlt, 
  FaStar,
  FaArrowLeft,
  FaShoppingCart,
  FaEye
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function UserFavoritesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { favorites, removeFromFavorites, favoritesCount, clearFavorites } = useFavorites()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleRemoveFromFavorites = (carId, carName) => {
    removeFromFavorites(carId)
    toast.success(`${carName} removed from favorites`)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all cars from your favorites?')) {
      clearFavorites()
      toast.success('All favorites cleared')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <UserRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard" className="text-gray-500 hover:text-amber-600 transition">
              <FaArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FaHeart className="text-red-500" />
                My Favorites
              </h1>
              <p className="text-sm text-gray-500 mt-1">Cars you've saved for later</p>
            </div>
          </div>
          
          {favoritesCount > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <FaTrash size={14} />
              Clear All ({favoritesCount})
            </button>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Favorites</p>
                <p className="text-2xl font-bold text-red-500">{favoritesCount}</p>
              </div>
              <div className="bg-red-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaHeart className="text-red-500" />
              </div>
            </div>
          </div>
          
          <Link href="/cars" className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Browse More Cars</p>
                <p className="text-xl font-bold">Discover New</p>
              </div>
              <FaCar className="text-3xl opacity-80" />
            </div>
          </Link>
          
          <Link href="/user/bookings" className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Your Bookings</p>
                <p className="text-xl font-bold">View Rentals</p>
              </div>
              <FaShoppingCart className="text-3xl opacity-80" />
            </div>
          </Link>
        </div>

        {/* Favorites List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-200 mx-auto mb-4 animate-pulse"></div>
              <p className="text-gray-500">Loading favorites...</p>
            </div>
          </div>
        ) : favoritesCount === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 mb-6">
              Start adding cars to your favorites by clicking the heart icon on any car card
            </p>
            <Link href="/cars" className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Browse Cars →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Car Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {car.images && car.images[0] ? (
                    <img 
                      src={car.images[0]} 
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaCar className="text-5xl text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => handleRemoveFromFavorites(car.id, car.name)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-50 transition-all z-10"
                    title="Remove from favorites"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                  
                  {/* Availability Badge */}
                  <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg ${
                    car.available 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {car.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                
                {/* Car Details */}
                <div className="p-4">
                  <Link href={`/cars/${car.id}`}>
                    <h3 className="font-bold text-gray-800 text-lg hover:text-amber-600 transition-colors">
                      {car.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <FaMapMarkerAlt size={12} />
                    <span>{car.location || 'Lagos, Nigeria'}</span>
                  </div>
                  
                  {/* Rating */}
                  {car.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <FaStar className="text-yellow-500" size={14} />
                      <span className="text-sm font-semibold text-gray-700">{car.rating}</span>
                      <span className="text-xs text-gray-400">(24 reviews)</span>
                    </div>
                  )}
                  
                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                    <span>{car.seats || 4} seats</span>
                    <span>•</span>
                    <span>{car.transmission || 'Manual'}</span>
                    <span>•</span>
                    <span>{car.fuelType || 'Petrol'}</span>
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-amber-600 font-bold text-lg">
                        {formatNaira(car.pricePerDay || car.price || 50000)}
                      </p>
                      <p className="text-xs text-gray-500">per day</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/cars/${car.id}`}>
                        <button className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1">
                          <FaEye size={12} /> View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserRoute>
  )
}