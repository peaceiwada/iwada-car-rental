'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../../components/auth/AuthProvider'
import { getCarsByAgent, deleteCar, updateCar } from '../../../../lib/storage'
import { formatNaira } from '../../../../lib/constants'
import { FaCar, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function MyCarsPage() {
  const router = useRouter()
  const { user, isAgentVerified } = useAuth()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    if (isAgentVerified && user) {
      loadCars()
    }
  }, [isAgentVerified, user])

  const loadCars = () => {
    try {
      const agentCars = getCarsByAgent(user?.id) || []
      setCars(agentCars)
    } catch (error) {
      console.error('Error loading cars:', error)
      toast.error('Error loading your cars')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (carId) => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) return
    setDeletingId(carId)
    try {
      const result = deleteCar(carId, user?.id)
      if (result) {
        toast.success('Car deleted successfully')
        loadCars()
      } else {
        toast.error('Failed to delete car')
      }
    } catch (error) {
      toast.error('Error deleting car')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleAvailability = async (car) => {
    setTogglingId(car.id)
    try {
      const result = updateCar(car.id, { available: !car.available })
      if (result) {
        toast.success(`Car is now ${!car.available ? 'available' : 'unavailable'}`)
        loadCars()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Error updating car status')
    } finally {
      setTogglingId(null)
    }
  }

  if (!isAgentVerified) return null

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-amber-200 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading your cars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/agent/cars" className="text-gray-500 hover:text-amber-600">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
            <p className="text-sm text-gray-500">Manage your vehicle listings</p>
          </div>
        </div>
        <Link href="/agent/cars/add" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2 w-fit">
          <FaPlus size={14} /> Add New Car
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Cars</p>
              <p className="text-2xl font-bold text-gray-800">{cars.length}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-xl">
              <FaCar className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-2xl font-bold text-green-600">{cars.filter(c => c.available).length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Unavailable</p>
              <p className="text-2xl font-bold text-red-600">{cars.filter(c => !c.available).length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border text-center py-16">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cars Listed Yet</h3>
          <p className="text-gray-500 mb-6">Start earning by listing your first car for rent</p>
          <Link href="/agent/cars/add" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
            <FaPlus /> List Your First Car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {car.images && car.images[0] ? (
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCar className="text-5xl text-gray-400" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold shadow-lg ${car.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {car.available ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
                    <p className="text-sm text-gray-500">{car.type}</p>
                  </div>
                  <p className="text-xl font-bold text-amber-600">{formatNaira(car.pricePerDay)}<span className="text-xs text-gray-400">/day</span></p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  <span>{car.seats || 4} seats</span>
                  <span>•</span>
                  <span>{car.transmission || 'Manual'}</span>
                  <span>•</span>
                  <span>{car.fuelType || 'Petrol'}</span>
                  <span>•</span>
                  <span>{car.location}</span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleAvailability(car)}
                    disabled={togglingId === car.id}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${car.available ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {togglingId === car.id ? <FaSpinner className="animate-spin mx-auto" /> : (car.available ? 'Mark Unavailable' : 'Mark Available')}
                  </button>
                  <Link href={`/agent/cars/edit/${car.id}`} className="flex-1">
                    <button className="w-full py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 transition">
                      <FaEdit className="inline mr-1" size={12} /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    disabled={deletingId === car.id}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    {deletingId === car.id ? <FaSpinner className="animate-spin mx-auto" /> : <FaTrash className="inline mr-1" size={12} />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}