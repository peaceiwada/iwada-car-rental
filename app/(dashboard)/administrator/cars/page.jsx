'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../components/auth/AuthProvider'
import { AdminRoute } from '../../../components/auth/ProtectedRoute'
import { getCars, deleteCar, updateCar, getUsers } from '../../../lib/storage'
import { formatNaira } from '../../../lib/constants'
import { 
  FaCar, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaStar,
  FaSearch,
  FaFilter,
  FaUser
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminCarsPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      loadCars()
    }
  }, [isAdmin])

  useEffect(() => {
    filterCars()
  }, [cars, searchQuery, filterStatus])

  const loadCars = () => {
    try {
      const allCars = getCars()
      // If no cars in storage, use mock data
      if (allCars.length === 0) {
        const mockCars = [
          { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, transmission: 'Automatic', location: 'Lagos', rating: 4.8, available: true, featured: true, agentName: 'Iwada Rentals' },
          { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, transmission: 'Automatic', location: 'Lagos', rating: 4.7, available: true, featured: true, agentName: 'Iwada Rentals' },
          { id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, transmission: 'Manual', location: 'Abuja', rating: 4.5, available: false, featured: false, agentName: 'Iwada Rentals' },
          { id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, transmission: 'Automatic', location: 'Lagos', rating: 4.9, available: true, featured: true, agentName: 'Iwada Rentals' },
          { id: 5, name: 'Mercedes C-Class', type: 'Luxury', pricePerDay: 75000, seats: 5, transmission: 'Automatic', location: 'Lagos', rating: 5.0, available: false, featured: false, agentName: 'Elite Autos' },
          { id: 6, name: 'Hyundai Santa Fe', type: 'SUV', pricePerDay: 35000, seats: 7, transmission: 'Automatic', location: 'Abuja', rating: 4.6, available: true, featured: false, agentName: 'Premium Rentals' },
        ]
        setCars(mockCars)
        setFilteredCars(mockCars)
      } else {
        setCars(allCars)
        setFilteredCars(allCars)
      }
    } catch (error) {
      console.error('Error loading cars:', error)
      toast.error('Error loading cars')
    } finally {
      setLoading(false)
    }
  }

  const filterCars = () => {
    let filtered = [...cars]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(query) ||
        car.type.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query) ||
        (car.agentName && car.agentName.toLowerCase().includes(query))
      )
    }
    
    // Status filter
    if (filterStatus === 'available') {
      filtered = filtered.filter(car => car.available === true)
    } else if (filterStatus === 'unavailable') {
      filtered = filtered.filter(car => car.available === false)
    } else if (filterStatus === 'featured') {
      filtered = filtered.filter(car => car.featured === true)
    }
    
    setFilteredCars(filtered)
  }

  const handleDelete = async (carId, carName) => {
    if (!confirm(`Are you sure you want to delete "${carName}"? This action cannot be undone.`)) {
      return
    }
    
    setProcessingId(carId)
    try {
      const result = deleteCar(carId)
      if (result) {
        toast.success('Car deleted successfully')
        loadCars()
      } else {
        toast.error('Failed to delete car')
      }
    } catch (error) {
      console.error('Error deleting car:', error)
      toast.error('Error deleting car')
    } finally {
      setProcessingId(null)
    }
  }

  const handleToggleAvailability = async (car) => {
    setProcessingId(car.id)
    try {
      const updatedCar = {
        ...car,
        available: !car.available
      }
      const result = updateCar(car.id, { available: !car.available })
      if (result) {
        toast.success(`Car is now ${!car.available ? 'available' : 'unavailable'}`)
        loadCars()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
      toast.error('Error updating car status')
    } finally {
      setProcessingId(null)
    }
  }

  const handleToggleFeatured = async (car) => {
    setProcessingId(car.id)
    try {
      const result = updateCar(car.id, { featured: !car.featured })
      if (result) {
        toast.success(`Car is ${!car.featured ? 'now featured' : 'no longer featured'}`)
        loadCars()
      } else {
        toast.error('Failed to update featured status')
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Error updating featured status')
    } finally {
      setProcessingId(null)
    }
  }

  const stats = {
    total: cars.length,
    available: cars.filter(c => c.available).length,
    unavailable: cars.filter(c => !c.available).length,
    featured: cars.filter(c => c.featured).length
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Cars</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all vehicles on the platform</p>
          </div>
          <Link 
            href="/admin/cars/add" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2 w-fit"
          >
            <FaPlus size={14} />
            Add New Car
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCar className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unavailable</p>
                <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
              </div>
              <div className="bg-red-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Featured</p>
                <p className="text-2xl font-bold text-amber-600">{stats.featured}</p>
              </div>
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <FaStar className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car name, type, location, or agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <FaFilter className="text-gray-500" />
                <span>Filter</span>
              </button>
              {(filterStatus !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('all')
                  }}
                  className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterStatus === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Cars
              </button>
              <button
                onClick={() => setFilterStatus('available')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterStatus === 'available' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilterStatus('unavailable')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterStatus === 'unavailable' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unavailable
              </button>
              <button
                onClick={() => setFilterStatus('featured')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  filterStatus === 'featured' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Featured
              </button>
            </div>
          )}
        </div>

        {/* Cars List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-amber-500 text-3xl" />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cars Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Car</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Price/Day</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Location</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Agent</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Featured</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <FaCar className="text-amber-600" />
                          </div>
                          <span className="font-medium text-gray-800">{car.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{car.type}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-amber-600">{formatNaira(car.pricePerDay)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{car.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaUser size={10} className="text-gray-400" />
                          {car.agentName || 'Iwada Rentals'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleAvailability(car)}
                          disabled={processingId === car.id}
                          className={`px-2 py-1 rounded-full text-xs font-semibold transition ${
                            car.available 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {processingId === car.id ? <FaSpinner className="animate-spin" /> : (car.available ? 'Available' : 'Unavailable')}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleFeatured(car)}
                          disabled={processingId === car.id}
                          className={`px-2 py-1 rounded-full text-xs font-semibold transition ${
                            car.featured 
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {processingId === car.id ? <FaSpinner className="animate-spin" /> : (car.featured ? 'Featured' : 'Not Featured')}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/cars/${car.id}`}>
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View">
                              <FaEye size={16} />
                            </button>
                          </Link>
                          <Link href={`/admin/cars/edit/${car.id}`}>
                            <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Edit">
                              <FaEdit size={16} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(car.id, car.name)}
                            disabled={processingId === car.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            {processingId === car.id ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  )
}