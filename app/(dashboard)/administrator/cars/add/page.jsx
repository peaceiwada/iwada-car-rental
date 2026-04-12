'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../../components/auth/AuthProvider'
import { AgentRoute } from '../../../../components/auth/ProtectedRoute'
import { saveCar } from '../../../../lib/storage'
import { CarTypes, FuelTypes, TransmissionTypes, formatNaira } from '../../../../lib/constants'
import { 
  FaCar, 
  FaUpload, 
  FaArrowLeft, 
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaImage
} from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AddCarPage() {
  const router = useRouter()
  const { user, isAgentVerified } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    pricePerDay: '',
    seats: '4',
    fuelType: '',
    transmission: '',
    location: '',
    description: '',
    features: []
  })
  const [errors, setErrors] = useState({})

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = []
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result)
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Car name is required'
    }
    if (!formData.type) {
      newErrors.type = 'Please select car type'
    }
    if (!formData.pricePerDay || formData.pricePerDay <= 0) {
      newErrors.pricePerDay = 'Valid price is required'
    }
    if (!formData.fuelType) {
      newErrors.fuelType = 'Please select fuel type'
    }
    if (!formData.transmission) {
      newErrors.transmission = 'Please select transmission'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (imagePreviews.length === 0) {
      newErrors.images = 'Please upload at least one car image'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    
    try {
      const carData = {
        agentId: user.id,
        agentName: user.name,
        name: formData.name,
        type: formData.type,
        pricePerDay: parseInt(formData.pricePerDay),
        seats: parseInt(formData.seats),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        location: formData.location,
        description: formData.description || '',
        images: imagePreviews,
        features: formData.features.filter(f => f.trim()),
        available: true
      }
      
      const savedCar = saveCar(carData)
      
      if (savedCar) {
        toast.success('Car listed successfully!')
        router.push('/agent/cars/my-cars')
      } else {
        throw new Error('Failed to save car')
      }
    } catch (error) {
      console.error('Error saving car:', error)
      toast.error('Failed to list car. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleFeatureAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault()
      setFormData({
        ...formData,
        features: [...formData.features, e.target.value.trim()]
      })
      e.target.value = ''
    }
  }

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  if (!isAgentVerified) {
    return null
  }

  return (
    <AgentRoute>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/agent/cars" className="text-gray-500 hover:text-amber-600 transition">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">List a New Car</h1>
            <p className="text-sm text-gray-500 mt-1">Add a vehicle to your rental fleet</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCar className="text-amber-500" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Toyota Camry 2023"
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.name ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.type ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select type</option>
                    {Object.entries(CarTypes).map(([key, value]) => (
                      <option key={key} value={value}>{value}</option>
                    ))}
                  </select>
                  {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Day (₦) *
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder="e.g., 25000"
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.pricePerDay ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.pricePerDay && <p className="mt-1 text-xs text-red-500">{errors.pricePerDay}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats
                  </label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="2">2 seats</option>
                    <option value="4">4 seats</option>
                    <option value="5">5 seats</option>
                    <option value="7">7 seats</option>
                    <option value="8">8 seats</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Type *
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.fuelType ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select fuel type</option>
                    {Object.entries(FuelTypes).map(([key, value]) => (
                      <option key={key} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
                    ))}
                  </select>
                  {errors.fuelType && <p className="mt-1 text-xs text-red-500">{errors.fuelType}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission *
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.transmission ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select transmission</option>
                    {Object.entries(TransmissionTypes).map(([key, value]) => (
                      <option key={key} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
                    ))}
                  </select>
                  {errors.transmission && <p className="mt-1 text-xs text-red-500">{errors.transmission}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Lagos, Nigeria"
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.location ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Car Description */}
            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the car's condition, features, and any special notes..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Features */}
            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Features & Amenities</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.features.map((feature, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                    {feature}
                    <button type="button" onClick={() => removeFeature(index)} className="hover:text-red-500">
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a feature and press Enter (e.g., Air Conditioning, GPS, Bluetooth)"
                onKeyDown={handleFeatureAdd}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-400 mt-1">Press Enter to add each feature</p>
            </div>

            {/* Image Upload */}
            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaImage className="text-amber-500" /> Car Images *
              </h2>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Car ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-amber-400 transition ${
                errors.images ? 'border-red-400' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  id="carImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="carImages" className="cursor-pointer block">
                  <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload car images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
              {errors.images && <p className="mt-1 text-xs text-red-500">{errors.images}</p>}
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-100 pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Listing Car...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    List Car for Rent
                  </>
                )}
              </button>
              
              <Link href="/agent/cars" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition text-center">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AgentRoute>
  )
}