'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaSearch, FaFilter, FaTimes, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa'
import CarCard from '../components/cars/CarCard'
import LoadingSkeleton from '../components/layout/LoadingSkeleton'
import { useCompare } from '../context/CompareContext'
import { useAuth } from '../components/auth/AuthProvider'
import VoiceSearch from '../components/ui/VoiceSearch'
import { getCars } from '../lib/storage'
import toast from 'react-hot-toast'

export default function CarsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recommended')
  
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(100000)
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: '',
    seats: '',
    transmission: '',
    pickupDate: searchParams.get('pickupDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    minRating: '',
    availability: ''
  })

  const { compareList, removeFromCompare, clearCompare } = useCompare()

  const carTypes = ['All', 'Economy', 'Sedan', 'SUV', 'Luxury', 'Van', 'Sports']
  const availabilityOptions = ['All', 'Available', 'Unavailable']

  // Mock data cars (your existing cars)
  const mockCars = [
    { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.8, featured: true, year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals' },
    { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.7, featured: true, year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals' },
    { id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, fuelType: 'Petrol', transmission: 'Manual', location: 'Abuja', rating: 4.5, featured: true, year: 2022, available: false, agentId: null, agentName: 'Iwada Rentals' },
    { id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.9, featured: true, year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals' },
    { id: 5, name: 'Mercedes Benz C-Class', type: 'Luxury', pricePerDay: 75000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 5.0, featured: false, year: 2024, available: false, agentId: null, agentName: 'Iwada Rentals' },
    { id: 6, name: 'Hyundai Santa Fe', type: 'SUV', pricePerDay: 35000, seats: 7, fuelType: 'Diesel', transmission: 'Automatic', location: 'Abuja', rating: 4.6, featured: false, year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals' },
    { id: 7, name: 'Kia Picanto', type: 'Economy', pricePerDay: 12000, seats: 4, fuelType: 'Petrol', transmission: 'Manual', location: 'Port Harcourt', rating: 4.3, featured: false, year: 2022, available: true, agentId: null, agentName: 'Iwada Rentals' },
    { id: 8, name: 'Toyota Hilux', type: 'SUV', pricePerDay: 40000, seats: 5, fuelType: 'Diesel', transmission: 'Manual', location: 'Lagos', rating: 4.7, featured: false, year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals' }
  ]

  const getGlobalMinPrice = () => {
    if (cars.length === 0) return 0
    return Math.min(...cars.map(car => car.pricePerDay))
  }
  
  const getGlobalMaxPrice = () => {
    if (cars.length === 0) return 100000
    return Math.max(...cars.map(car => car.pricePerDay))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      location: '',
      type: '',
      seats: '',
      transmission: '',
      pickupDate: '',
      returnDate: '',
      minRating: '',
      availability: ''
    })
    setPriceMin(getGlobalMinPrice())
    setPriceMax(getGlobalMaxPrice())
    setSortBy('recommended')
    toast.success('All filters cleared!')
  }

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    if (cars.length > 0) {
      const minPrice = getGlobalMinPrice()
      const maxPrice = getGlobalMaxPrice()
      setPriceMin(minPrice)
      setPriceMax(maxPrice)
    }
  }, [cars])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [cars, filters, searchQuery, sortBy, priceMin, priceMax])

  const fetchCars = async () => {
    try {
      // Get cars added by agents from storage
      const agentCars = getCars()
      
      // Merge mock cars with agent cars
      // Agent cars get higher IDs to avoid conflicts
      const mergedCars = [...mockCars]
      
      // Add agent cars (they already have their own IDs)
      agentCars.forEach(car => {
        // Check if car with same ID doesn't already exist
        if (!mergedCars.some(c => c.id === car.id)) {
          mergedCars.push(car)
        }
      })
      
      setCars(mergedCars)
      setFilteredCars(mergedCars)
    } catch (error) {
      console.error('Error fetching cars:', error)
      // Fallback to just mock cars
      setCars(mockCars)
      setFilteredCars(mockCars)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...cars]

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(query) ||
        car.type.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query) ||
        query.split(' ').some(word => 
          car.name.toLowerCase().includes(word) || 
          car.type.toLowerCase().includes(word)
        )
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(car => 
        car.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Car type filter
    if (filters.type) {
      filtered = filtered.filter(car => car.type === filters.type)
    }

    // Availability filter
    if (filters.availability && filters.availability !== 'All') {
      filtered = filtered.filter(car => 
        filters.availability === 'Available' ? car.available : !car.available
      )
    }

    // Transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission)
    }

    // Price range filter
    filtered = filtered.filter(car => 
      car.pricePerDay >= priceMin && car.pricePerDay <= priceMax
    )

    // Sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.pricePerDay - b.pricePerDay)
        break
      case 'price_high':
        filtered.sort((a, b) => b.pricePerDay - a.pricePerDay)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'available':
        filtered.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0))
        break
      default:
        break
    }

    setFilteredCars(filtered)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Find Your Perfect Ride</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Browse through our extensive collection of premium vehicles at competitive rates
            </p>
          </div>

          {/* Search Bar with Voice */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  placeholder="Search by car name, location, or type... or click microphone to speak"
                  className="w-full pl-12 pr-4 py-4 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <VoiceSearch onSearch={(term, filterType) => {
                setSearchQuery(term)
                if (filterType) {
                  if (filterType.type === 'price' && filterType.value) {
                    setPriceMin(0)
                    setPriceMax(filterType.value)
                    toast.success(`Showing cars under ₦${filterType.value.toLocaleString()}`)
                  } else if (filterType.type === 'carType' && filterType.value) {
                    setFilters({...filters, type: filterType.value.charAt(0).toUpperCase() + filterType.value.slice(1)})
                    toast.success(`Showing ${filterType.value} cars`)
                  } else if (filterType.type === 'location' && filterType.value) {
                    setFilters({...filters, location: filterType.value.charAt(0).toUpperCase() + filterType.value.slice(1)})
                    toast.success(`Showing cars in ${filterType.value}`)
                  } else if (filterType.type === 'transmission' && filterType.value) {
                    setFilters({...filters, transmission: filterType.value.charAt(0).toUpperCase() + filterType.value.slice(1)})
                    toast.success(`Showing ${filterType.value} cars`)
                  } else if (filterType.type === 'availability' && filterType.value === 'available') {
                    setFilters({...filters, availability: 'Available'})
                    toast.success('Showing available cars only')
                  } else if (filterType.type === 'sort' && filterType.value === 'rating') {
                    setSortBy('rating')
                    toast.success('Showing highest rated cars first')
                  }
                }
              }} />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 transition-all"
            >
              <FaFilter className="text-amber-500" />
              <span className="font-medium">Filters</span>
              {(filters.location || filters.type || filters.availability || priceMin > getGlobalMinPrice() || priceMax < getGlobalMaxPrice()) && (
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center">
                  {[
                    filters.location ? 1 : 0,
                    filters.type ? 1 : 0,
                    filters.availability ? 1 : 0,
                    priceMin > getGlobalMinPrice() || priceMax < getGlobalMaxPrice() ? 1 : 0
                  ].filter(Boolean).length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Sort by:</span>
              <select
                className="px-4 py-2 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="available">Availability</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filter Cars</h3>
                <button onClick={clearFilters} className="text-sm text-amber-600 hover:text-amber-700">
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                    <input
                      type="text"
                      placeholder="City or area"
                      className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min ₦"
                      className="w-1/2 px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      placeholder="Max ₦"
                      className="w-1/2 px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Car Type</label>
                  <select
                    className="w-full px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    {carTypes.map(type => (
                      <option key={type} value={type === 'All' ? '' : type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <select
                    className="w-full px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                  >
                    {availabilityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-slate-500">
              Found <span className="font-semibold text-amber-600">{filteredCars.length}</span> cars
            </p>
          </div>

          {/* Cars Grid */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <FaCar className="text-6xl text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No cars found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition inline-flex items-center gap-2">
                <FaTimes /> Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car, index) => (
                <div key={car.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-amber-200 p-3 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              {compareList.map(car => (
                <div key={car.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-medium">{car.name}</span>
                  <button onClick={() => removeFromCompare(car.id)} className="text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </div>
              ))}
              {compareList.length < 3 && <div className="text-xs text-gray-400">Add {3 - compareList.length} more</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={clearCompare} className="text-sm text-gray-500 hover:text-red-500 px-3 py-1">
                Clear All
              </button>
              <Link
                href={`/compare?ids=${compareList.map(car => car.id).join(',')}`}
                onClick={(e) => {
                  if (compareList.length === 0) {
                    e.preventDefault()
                    alert('Please add cars to compare first')
                  }
                }}
              >
                <button className="bg-amber-600 text-white px-5 py-1.5 rounded-lg font-semibold text-sm hover:bg-amber-700 transition flex items-center gap-1">
                  Compare ({compareList.length}) <FaArrowRight size={12} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}