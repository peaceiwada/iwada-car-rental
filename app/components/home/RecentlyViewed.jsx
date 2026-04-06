'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaEye, FaTrash, FaArrowRight, FaCar } from 'react-icons/fa'

export default function RecentlyViewed() {
  const [recentCars, setRecentCars] = useState([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadRecentlyViewed()
  }, [])

  const loadRecentlyViewed = () => {
    const saved = localStorage.getItem('recentlyViewed')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentCars(parsed.slice(0, 6))
      } catch (e) {
        console.error('Error loading recently viewed:', e)
      }
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed')
    setRecentCars([])
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!isClient || recentCars.length === 0) {
    return null
  }

  return (
    <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-full">
              <FaEye className="text-amber-600 text-sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Recently Viewed
            </h2>
            <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
              {recentCars.length}
            </span>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <FaTrash size={12} />
            Clear History
          </button>
        </div>

        {/* Horizontal Scrollable Car List */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-gray-100 pb-4">
            <div className="flex gap-4 min-w-max">
              {recentCars.map((car, index) => (
                <Link
                  key={car.id || index}
                  href={`/cars/${car.id}`}
                  className="group block w-[200px] sm:w-[220px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-amber-100"
                >
                  {/* Car Image */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCar className="text-gray-400 text-3xl" />
                      </div>
                    )}
                    {/* Availability Badge */}
                    {car.available !== undefined && (
                      <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold ${
                        car.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {car.available ? 'Available' : 'Unavailable'}
                      </div>
                    )}
                  </div>

                  {/* Car Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-amber-600 transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {car.location || 'Lagos, Nigeria'}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-bold text-amber-600">
                        {formatPrice(car.pricePerDay || 50000)}
                      </span>
                      <span className="text-[10px] text-gray-400">/day</span>
                    </div>
                    <button className="mt-2 w-full py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Scroll Hint for Mobile */}
          <div className="block sm:hidden text-center mt-2">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              ← Scroll to see more →
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}