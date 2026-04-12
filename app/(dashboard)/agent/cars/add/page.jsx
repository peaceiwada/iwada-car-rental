'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../components/auth/AuthProvider'
import { saveCar } from '../../../../lib/storage'
import { CarTypes, FuelTypes, TransmissionTypes } from '../../../../lib/constants'
import { FaCar, FaArrowLeft, FaSpinner, FaCheckCircle, FaUpload, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Link from 'next/link'

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
    if (!formData.name.trim()) newErrors.name = 'Car name is required'
    if (!formData.type) newErrors.type = 'Please select car type'
    if (!formData.pricePerDay || formData.pricePerDay <= 0) newErrors.pricePerDay = 'Valid price is required'
    if (!formData.fuelType) newErrors.fuelType = 'Please select fuel type'
    if (!formData.transmission) newErrors.transmission = 'Please select transmission'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (imagePreviews.length === 0) newErrors.images = 'Please upload at least one car image'
    
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleFeatureAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault()
      setFormData({ ...formData, features: [...formData.features, e.target.value.trim()] })
      e.target.value = ''
    }
  }

  const removeFeature = (index) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  if (!isAgentVerified) {
    return <div className="p-6 text-center">Please complete verification first.</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/agent/cars" className="text-gray-500 hover:text-amber-600">
          <FaArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">List a New Car</h1>
          <p className="text-sm text-gray-500">Add a vehicle to your rental fleet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Car Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Car Type *</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl">
              <option value="">Select type</option>
              {Object.values(CarTypes).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price Per Day (₦) *</label>
            <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
            {errors.pricePerDay && <p className="text-xs text-red-500 mt-1">{errors.pricePerDay}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Seats</label>
            <select name="seats" value={formData.seats} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl">
              <option value="2">2 seats</option>
              <option value="4">4 seats</option>
              <option value="5">5 seats</option>
              <option value="7">7 seats</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fuel Type *</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl">
              <option value="">Select fuel type</option>
              {Object.values(FuelTypes).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.fuelType && <p className="text-xs text-red-500 mt-1">{errors.fuelType}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Transmission *</label>
            <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl">
              <option value="">Select transmission</option>
              {Object.values(TransmissionTypes).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.transmission && <p className="text-xs text-red-500 mt-1">{errors.transmission}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-xl"></textarea>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Features</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.features.map((feature, idx) => (
              <span key={idx} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {feature}
                <button type="button" onClick={() => removeFeature(idx)}><FaTimes size={12} /></button>
              </span>
            ))}
          </div>
          <input type="text" placeholder="Type feature and press Enter" onKeyDown={handleFeatureAdd} className="w-full px-4 py-2 border rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Car Images *</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} className="w-full h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><FaTimes size={10} /></button>
              </div>
            ))}
          </div>
          <div className="border-2 border-dashed rounded-xl p-4 text-center">
            <input type="file" id="images" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            <label htmlFor="images" className="cursor-pointer block">
              <FaUpload className="text-2xl text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload car images</p>
            </label>
          </div>
          {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
          {loading ? 'Listing Car...' : 'List Car for Rent'}
        </button>
      </form>
    </div>
  )
}
