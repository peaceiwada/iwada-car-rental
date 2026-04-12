'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaStar, FaGasPump, FaUsers, FaCog, FaMapMarkerAlt, FaCar, FaCheck, FaTimes, FaTrophy, FaMedal } from 'react-icons/fa'
import { getCarById } from '../lib/storage'
import { getCarImage } from '../lib/carImages'

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [bestValueCar, setBestValueCar] = useState(null)

  useEffect(() => {
    const ids = searchParams.get('ids')
    if (ids) {
      const carIds = ids.split(',').map(id => id)
      fetchCarsForComparison(carIds)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchCarsForComparison = async (carIds) => {
    try {
      const selectedCars = []
      
      for (const id of carIds) {
        // First try to get car from storage
        let car = getCarById(id)
        
        // If not in storage, use mock data for demo cars (1-8)
        if (!car && [1, 2, 3, 4, 5, 6, 7, 8].includes(parseInt(id))) {
          const mockCars = {
            1: { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.8, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'Backup Camera', 'Cruise Control'] },
            2: { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.7, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Cruise Control'] },
            3: { id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, fuelType: 'Petrol', transmission: 'Manual', location: 'Abuja', rating: 4.5, available: false, features: ['Air Conditioning', 'USB Port'] },
            4: { id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.9, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Sunroof', 'Heated Seats', 'Cruise Control'] },
            5: { id: 5, name: 'Mercedes C-Class', type: 'Luxury', pricePerDay: 75000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 5.0, available: false, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Sunroof', 'Leather Seats', 'Cruise Control'] },
            6: { id: 6, name: 'Hyundai Santa Fe', type: 'SUV', pricePerDay: 35000, seats: 7, fuelType: 'Diesel', transmission: 'Automatic', location: 'Abuja', rating: 4.6, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Cruise Control'] },
            7: { id: 7, name: 'Kia Picanto', type: 'Economy', pricePerDay: 12000, seats: 4, fuelType: 'Petrol', transmission: 'Manual', location: 'Port Harcourt', rating: 4.3, available: true, features: ['Air Conditioning', 'USB Port'] },
            8: { id: 8, name: 'Toyota Hilux', type: 'SUV', pricePerDay: 40000, seats: 5, fuelType: 'Diesel', transmission: 'Manual', location: 'Lagos', rating: 4.7, available: true, features: ['Air Conditioning', 'Bluetooth', 'USB Port', '4x4', 'Cruise Control'] }
          }
          car = mockCars[parseInt(id)]
        }
        
        if (car && car.available === true) {
          selectedCars.push(car)
        }
      }
      
      setCars(selectedCars)
      
      // Calculate best value car (highest rating per price)
      if (selectedCars.length > 0) {
        let best = selectedCars[0]
        let bestScore = (selectedCars[0].rating * 1000) / selectedCars[0].pricePerDay
        
        for (let i = 1; i < selectedCars.length; i++) {
          const score = (selectedCars[i].rating * 1000) / selectedCars[i].pricePerDay
          if (score > bestScore) {
            bestScore = score
            best = selectedCars[i]
          }
        }
        setBestValueCar(best)
      }
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

  const allFeatures = ['Air Conditioning', 'Bluetooth', 'USB Port', 'GPS', 'Backup Camera', 'Cruise Control', 'Sunroof', 'Heated Seats', 'Leather Seats', '4x4']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">No Available Cars to Compare</h1>
            <p className="text-gray-500 mb-6">The selected cars are unavailable or not found. Please select available cars.</p>
            <Link href="/cars" className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition">
              Browse Available Cars <FaArrowLeft className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/cars" className="group flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-all">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Cars</span>
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Compare Vehicles</h1>
              <p className="text-sm text-gray-500">Side-by-side comparison of {cars.length} available vehicles</p>
            </div>
          </div>
          <Link
            href="/cars"
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear All
          </Link>
        </div>

        {/* Best Value Banner */}
        {bestValueCar && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-white/20 p-3 rounded-full">
                <FaTrophy className="text-3xl text-yellow-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FaMedal className="text-yellow-300" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Best Value Pick</span>
                </div>
                <h2 className="text-2xl font-bold mt-1">{bestValueCar.name}</h2>
                <p className="text-amber-100 text-sm mt-1">
                  ⭐ {bestValueCar.rating}/5 rating • {formatPrice(bestValueCar.pricePerDay)}/day
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Best price-to-value ratio</p>
                <p className="text-lg font-bold">🎯 Recommended Choice</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            const isBestValue = bestValueCar?.id === car.id
            return (
              <div key={car.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${isBestValue ? 'ring-2 ring-amber-500 shadow-amber-100' : ''}`}>
                {/* Best Value Ribbon */}
                {isBestValue && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
                    <FaTrophy /> BEST VALUE CHOICE
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
                  {car.available && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      Available
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
                  <div className={`mb-4 p-3 rounded-xl text-center ${isBestValue ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200' : 'bg-gray-50'}`}>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(car.pricePerDay)}</span>
                    <span className="text-gray-500"> /day</span>
                    {isBestValue && (
                      <div className="text-xs text-green-600 font-semibold mt-1">⭐ Best Value!</div>
                    )}
                  </div>

                  {/* Specs */}
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
                      {car.features?.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <FaCheck className="text-green-500 text-xs" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                      {car.features?.length > 4 && (
                        <div className="text-xs text-gray-400 mt-1">+{car.features.length - 4} more features</div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <Link href={`/cars/${car.id}`}>
                    <button className={`w-full py-2 rounded-xl font-semibold text-sm transition ${isBestValue ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'bg-amber-600 text-white hover:bg-amber-700'}`}>
                      View Details
                    </button>
                  </Link>
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
                      <th key={car.id} className={`px-6 py-4 text-center text-sm font-semibold ${bestValueCar?.id === car.id ? 'text-amber-600' : 'text-gray-700'}`}>
                        {car.name}
                        {bestValueCar?.id === car.id && (
                          <span className="block text-xs text-amber-500 mt-1">🏆 Best Value</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">💰 Price per day</td>
                    {cars.map((car) => (
                      <td key={car.id} className={`px-6 py-4 text-center font-bold ${bestValueCar?.id === car.id ? 'text-amber-600 text-lg' : 'text-gray-800'}`}>
                        {formatPrice(car.pricePerDay)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">⭐ Rating</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span className={`font-semibold ${bestValueCar?.id === car.id ? 'text-amber-600' : 'text-gray-800'}`}>{car.rating}</span>
                          <span className="text-gray-400 text-sm">/5</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">🚗 Vehicle Type</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.type}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">👥 Seating Capacity</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.seats} seats</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">⛽ Fuel Type</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.fuelType}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">⚙️ Transmission</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.transmission}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">📍 Location</td>
                    {cars.map((car) => (
                      <td key={car.id} className="px-6 py-4 text-center">{car.location}</td>
                    ))}
                  </tr>
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

        {/* Recommendation Summary */}
        {bestValueCar && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 p-3 rounded-full">
                <FaTrophy className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Why {bestValueCar.name} is Our Top Pick</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>⭐ Highest rating-to-price ratio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>💰 Best value for money at {formatPrice(bestValueCar.pricePerDay)}/day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>🎯 {bestValueCar.features?.length || 0}+ premium features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>📍 Available for pickup in {bestValueCar.location}</span>
                  </li>
                </ul>
                <Link href={`/cars/${bestValueCar.id}`}>
                  <button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    Book {bestValueCar.name} Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}