'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  FaCar, FaCheck, FaTimes, FaArrowLeft, FaStar, 
  FaGasPump, FaUsers, FaCog, FaMapMarkerAlt, 
  FaInfoCircle
} from 'react-icons/fa'
import { getCarImage } from '../lib/carImages'

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get('ids')
    if (ids) {
      const carIds = ids.split(',').map(id => parseInt(id))
      fetchCarsForComparison(carIds)
    } else {
      const saved = localStorage.getItem('compareList')
      if (saved) {
        const compareList = JSON.parse(saved)
        fetchCarsForComparison(compareList.map(c => c.id))
      } else {
        setLoading(false)
      }
    }
  }, [searchParams])

  const fetchCarsForComparison = async (carIds) => {
    try {
      const allCars = {
        1: { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.8, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'Backup Camera', 'Cruise Control'] },
        2: { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.7, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Cruise Control'] },
        3: { id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, fuelType: 'Petrol', transmission: 'Manual', location: 'Abuja', rating: 4.5, available: false, features: ['Air Conditioning', 'USB Port'] },
        4: { id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.9, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Sunroof', 'Heated Seats', 'Cruise Control'] },
        5: { id: 5, name: 'Mercedes Benz C-Class', type: 'Luxury', pricePerDay: 75000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 5.0, available: false, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Sunroof', 'Leather Seats', 'Cruise Control'] },
        6: { id: 6, name: 'Hyundai Santa Fe', type: 'SUV', pricePerDay: 35000, seats: 7, fuelType: 'Diesel', transmission: 'Automatic', location: 'Abuja', rating: 4.6, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Cruise Control'] },
        7: { id: 7, name: 'Kia Picanto', type: 'Economy', pricePerDay: 12000, seats: 4, fuelType: 'Petrol', transmission: 'Manual', location: 'Port Harcourt', rating: 4.3, available: true, features: ['Air Conditioning', 'USB Port'] },
        8: { id: 8, name: 'Toyota Hilux', type: 'SUV', pricePerDay: 40000, seats: 5, fuelType: 'Diesel', transmission: 'Manual', location: 'Lagos', rating: 4.7, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', '4x4', 'Cruise Control'] }
      }
      
      const selectedCars = carIds.map(id => allCars[id]).filter(car => car)
      setCars(selectedCars)
    } catch (error) {
      console.error('Error fetching cars for comparison:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Find best value car - FIXED: handle null best properly
  const getBestValueCar = () => {
    if (cars.length === 0) return null
    
    let bestCar = cars[0]
    let bestScore = (cars[0].rating * 1000) / cars[0].pricePerDay
    
    for (let i = 1; i < cars.length; i++) {
      const score = (cars[i].rating * 1000) / cars[i].pricePerDay
      if (score > bestScore) {
        bestScore = score
        bestCar = cars[i]
      }
    }
    
    return bestCar
  }

  const bestValueCar = getBestValueCar()
  const allFeatures = ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Cruise Control', 'Sunroof', 'Heated Seats', 'Leather Seats', '4x4']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">No Cars to Compare</h1>
            <p className="text-gray-500 mb-6">Add some cars to compare from the cars page</p>
            <Link href="/cars" className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition">
              Browse Cars <FaArrowLeft className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 mt-20">
              <Link href="/cars" className="group flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Cars</span>
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Compare Vehicles</h1>
                <p className="text-sm text-gray-500">Side-by-side comparison of {cars.length} vehicles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 px-3 py-1.5 rounded-full">
                <span className="text-sm font-semibold text-amber-700">{cars.length} of 3 selected</span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('compareList')
                  window.location.href = '/cars'
                }}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Best Value Badge */}
        {bestValueCar && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <FaStar className="text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Best Value Pick</p>
                  <p className="text-lg font-bold">{bestValueCar.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Highest rated for its price</p>
                <p className="text-2xl font-bold">{bestValueCar.rating} ⭐</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            const isBestValue = bestValueCar?.id === car.id
            return (
              <div key={car.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${isBestValue ? 'ring-2 ring-amber-500' : ''}`}>
                {/* Best Value Ribbon */}
                {isBestValue && (
                  <div className="bg-amber-500 text-white text-center py-1 text-sm font-semibold">
                    ⭐ Best Value Choice
                  </div>
                )}
                
                {/* Car Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={getCarImage(car.name)}
                    alt={car.name}
                    className="w-full h-full object-contain bg-gray-50 p-4"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'
                    }}
                  />
                  {!car.available && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      Unavailable
                    </div>
                  )}
                </div>

                {/* Car Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{car.name}</h2>
                      <p className="text-sm text-gray-500">{car.type}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <FaStar className="text-yellow-500 text-sm" />
                      <span className="font-semibold text-gray-700">{car.rating}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 p-3 bg-amber-50 rounded-xl">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-amber-600">{formatPrice(car.pricePerDay)}</span>
                      <span className="text-gray-500"> /day</span>
                      {car.pricePerDay <= 25000 && (
                        <div className="mt-1 text-xs text-green-600 font-semibold">Best Budget Option</div>
                      )}
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUsers className="text-amber-500" />
                      <span className="text-sm">{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaGasPump className="text-amber-500" />
                      <span className="text-sm">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCog className="text-amber-500" />
                      <span className="text-sm">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-amber-500" />
                      <span className="text-sm">{car.location}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Features</h3>
                    <div className="space-y-1.5">
                      {car.features?.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <FaCheck className="text-green-500 text-xs" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                      {car.features?.length > 5 && (
                        <div className="text-xs text-gray-400 mt-1">+{car.features.length - 5} more features</div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Link href={`/cars/${car.id}`} className="flex-1">
                      <button className="w-full bg-amber-600 text-white py-2 rounded-xl font-semibold text-sm hover:bg-amber-700 transition">
                        View Details
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        const compareList = JSON.parse(localStorage.getItem('compareList') || '[]')
                        const newList = compareList.filter(c => c.id !== car.id)
                        localStorage.setItem('compareList', JSON.stringify(newList))
                        window.location.reload()
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Full Feature Comparison Table */}
        {cars.length >= 2 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Detailed Feature Comparison</h2>
              <p className="text-sm text-gray-500">Compare all features side by side</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feature</th>
                    {cars.map((car) => (
                      <th key={car.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        {car.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Price Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">💰 Price per day</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center font-bold text-amber-600">
                        {formatPrice(car.pricePerDay)}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Rating Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">⭐ Rating</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span className="font-semibold">{car.rating}</span>
                          <span className="text-gray-400 text-sm">/5</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Type Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">🚗 Vehicle Type</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.type}</td>
                    ))}
                  </tr>
                  
                  {/* Seats Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">👥 Seating Capacity</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.seats} seats</td>
                    ))}
                  </tr>
                  
                  {/* Fuel Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">⛽ Fuel Type</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.fuelType}</td>
                    ))}
                  </tr>
                  
                  {/* Transmission Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">⚙️ Transmission</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.transmission}</td>
                    ))}
                  </tr>
                  
                  {/* Location Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">📍 Location</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.location}</td>
                    ))}
                  </tr>
                  
                  {/* Availability Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">✅ Availability</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {car.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Features Section */}
                  <tr className="bg-gray-50">
                    <td colSpan={cars.length + 1} className="px-6 py-3 font-semibold text-gray-700">
                      🎯 Features & Amenities
                    </td>
                  </tr>
                  
                  {allFeatures.map((feature) => (
                    <tr key={feature} className="hover:bg-gray-50">
                      <td className="px-6 py-3 pl-10 text-gray-600">{feature}</td>
                      {cars.map((car) => (
                        <td key={car.id} className="px-6 py-3 text-center">
                          {car.features?.includes(feature) ? (
                            <FaCheck className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimes className="text-red-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommendation Section */}
        {cars.length >= 2 && bestValueCar && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-full">
                <FaInfoCircle className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Our Recommendation</h3>
                <p className="text-gray-700 mb-3">
                  Based on your comparison, we recommend the <span className="font-bold text-amber-600">{bestValueCar.name}</span> as it offers the best value for money with a {bestValueCar.rating}⭐ rating at {formatPrice(bestValueCar.pricePerDay)}/day.
                </p>
                <div className="flex gap-3">
                  <Link href={`/cars/${bestValueCar.id}`}>
                    <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-amber-700 transition">
                      View {bestValueCar.name}
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('compareList')
                      window.location.href = '/cars'
                    }}
                    className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-amber-50 transition"
                  >
                    Compare More Cars
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}