'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaStar, FaGasPump, FaUsers, FaCog, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaMapMarkerAlt, FaCar, FaTimesCircle, FaExpand, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useAuth } from '../../components/auth/AuthProvider'
import toast from 'react-hot-toast'
import { getCarImage } from '../../lib/carImages'
import { saveToRecentlyViewed } from '../../lib/recentlyViewed'
import { getCarById, saveBooking, getUserById } from '../../lib/storage'
import ShareButton from '../../components/ui/ShareButton'

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [car, setCar] = useState(null)
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDates, setBookingDates] = useState({
    pickupDate: '',
    returnDate: ''
  })
  const [message, setMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCarDetails()
    }
  }, [params.id])

  useEffect(() => {
    if (car) {
      saveToRecentlyViewed(car)
    }
  }, [car])

  const fetchCarDetails = async () => {
    try {
      // First try to get car from storage
      let carData = getCarById(params.id)
      
      // If not in storage, use mock data
      if (!carData) {
        const mockCars = {
          1: { 
            id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', 
            transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 4.8, 
            description: 'Comfortable and fuel-efficient sedan perfect for business and leisure travel.', 
            year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Toyota Camry')
          },
          2: { 
            id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', 
            transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 4.7, 
            description: 'Elegant and spacious sedan with premium features.', 
            year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Honda Accord')
          },
          3: { 
            id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, fuelType: 'Petrol', 
            transmission: 'Manual', location: 'Abuja, Nigeria', rating: 4.5, 
            description: 'Reliable and economical car perfect for city driving.', 
            year: 2022, available: false, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Toyota Corolla')
          },
          4: { 
            id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, fuelType: 'Petrol', 
            transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 4.9, 
            description: 'Luxury SUV with premium comfort and advanced safety features.', 
            year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Lexus RX 350')
          },
          5: { 
            id: 5, name: 'Mercedes Benz C-Class', type: 'Luxury', pricePerDay: 75000, seats: 5, fuelType: 'Petrol', 
            transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 5.0, 
            description: 'Ultimate luxury sedan with exceptional performance and style.', 
            year: 2024, available: false, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Mercedes Benz C-Class')
          },
          6: { 
            id: 6, name: 'Hyundai Santa Fe', type: 'SUV', pricePerDay: 35000, seats: 7, fuelType: 'Diesel', 
            transmission: 'Automatic', location: 'Abuja, Nigeria', rating: 4.6, 
            description: 'Spacious SUV perfect for family trips and long journeys.', 
            year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Hyundai Santa Fe')
          },
          7: { 
            id: 7, name: 'Kia Picanto', type: 'Economy', pricePerDay: 12000, seats: 4, fuelType: 'Petrol', 
            transmission: 'Manual', location: 'Port Harcourt, Nigeria', rating: 4.3, 
            description: 'Compact and fuel-efficient car ideal for city commuting.', 
            year: 2022, available: true, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Kia Picanto')
          },
          8: { 
            id: 8, name: 'Toyota Hilux', type: 'SUV', pricePerDay: 40000, seats: 5, fuelType: 'Diesel', 
            transmission: 'Manual', location: 'Lagos, Nigeria', rating: 4.7, 
            description: 'Durable pickup truck perfect for rough terrain and heavy loads.', 
            year: 2023, available: true, agentId: null, agentName: 'Iwada Rentals',
            imageUrl: getCarImage('Toyota Hilux')
          }
        }
        carData = mockCars[params.id]
      }
      
      if (carData) {
        setCar(carData)
        
        // If car has an agent, fetch agent details
        if (carData.agentId) {
          const agentData = getUserById(carData.agentId)
          setAgent(agentData)
        }
      } else {
        throw new Error('Car not found')
      }
    } catch (error) {
      console.error('Error fetching car details:', error)
      toast.error('Failed to load car details')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book this car')
      router.push('/login')
      return
    }
    
    if (!car.available) {
      toast.error('This car is currently not available for booking')
      return
    }
    
    setShowBookingModal(true)
  }

  const calculateTotalPrice = () => {
    if (!bookingDates.pickupDate || !bookingDates.returnDate) return 0
    
    const pickup = new Date(bookingDates.pickupDate)
    const returnDate = new Date(bookingDates.returnDate)
    const days = Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24))
    
    return days > 0 ? days * car.pricePerDay : car.pricePerDay
  }

  const handleConfirmBooking = async () => {
    if (!bookingDates.pickupDate || !bookingDates.returnDate) {
      toast.error('Please select pickup and return dates')
      return
    }
    
    const pickup = new Date(bookingDates.pickupDate)
    const returnDate = new Date(bookingDates.returnDate)
    
    if (returnDate <= pickup) {
      toast.error('Return date must be after pickup date')
      return
    }
    
    setBookingLoading(true)
    
    try {
      const bookingData = {
        carId: car.id,
        carName: car.name,
        agentId: car.agentId,
        agentName: car.agentName || 'Iwada Rentals',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        pickupDate: bookingDates.pickupDate,
        returnDate: bookingDates.returnDate,
        totalPrice: calculateTotalPrice(),
        location: car.location,
        message: message,
        status: 'pending'
      }
      
      const savedBooking = saveBooking(bookingData)
      
      if (savedBooking) {
        toast.success('Booking request sent successfully! The agent will confirm your booking.')
        setShowBookingModal(false)
        setBookingDates({ pickupDate: '', returnDate: '' })
        setMessage('')
        router.push('/user/bookings')
      } else {
        throw new Error('Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
        <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
        <Link href="/cars" className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition inline-block">
          Browse Available Cars
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/cars" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Cars
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Car Image with Zoom on Hover */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div 
                  className="relative h-96 bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden cursor-zoom-in group"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                >
                  {!imageError && car.imageUrl ? (
                    <>
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isZoomed ? 'scale-150' : 'scale-100'
                        }`}
                        style={{
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                        }}
                        onError={() => setImageError(true)}
                      />
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaExpand size={16} />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <FaCar className="text-gray-400 text-6xl" />
                      <span className="text-gray-500 font-medium">{car.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Car Info */}
              <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt size={14} />
                      <span>{car.location || 'Lagos, Nigeria'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {car.available ? <FaCheckCircle size={14} /> : <FaTimesCircle size={14} />}
                      {car.available ? 'Available' : 'Unavailable'}
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <FaStar className="text-yellow-500" />
                      <span className="font-semibold text-gray-700">{car.rating}</span>
                      <span className="text-gray-500 text-sm">(24 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200 mb-6">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Seats</p>
                      <p className="font-semibold text-gray-800">{car.seats} Seats</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaGasPump className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Fuel Type</p>
                      <p className="font-semibold text-gray-800">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCog className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Transmission</p>
                      <p className="font-semibold text-gray-800">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Model Year</p>
                      <p className="font-semibold text-gray-800">{car.year}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Air Conditioning', 'Bluetooth Connectivity', 'USB Port', 'GPS Navigation', 'Backup Camera', 'Cruise Control', 'Power Steering', 'ABS Brakes'].map(feature => (
                      <div key={feature} className="flex items-center gap-2 text-gray-600">
                        <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <span className="text-3xl font-bold text-amber-600">{formatPrice(car.pricePerDay)}</span>
                  <span className="text-gray-500"> / day</span>
                </div>

                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-amber-500 text-sm" />
                    {car.location}
                  </p>
                </div>

                {/* Agent Contact Info */}
                {(agent || car.agentName) && (
                  <div className="mb-6 p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-600 mb-2 font-semibold">Provided by</p>
                    <p className="font-semibold text-gray-800">{agent?.name || car.agentName}</p>
                    {agent?.agentVerification?.contactInfo?.whatsapp && (
                      <a 
                        href={`https://wa.me/${agent.agentVerification.contactInfo.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-green-600 mt-2 hover:text-green-700"
                      >
                        <FaWhatsapp /> Contact on WhatsApp
                      </a>
                    )}
                  </div>
                )}

                <button 
                  onClick={handleBookNow}
                  disabled={!car.available}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    car.available 
                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {car.available ? 'Book Now' : 'Not Available'}
                </button>

                <div className="flex gap-3 mt-3">
                  <ShareButton car={car} />
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Free cancellation up to 24 hours before pickup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Book {car.name}</h2>
                <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    value={bookingDates.pickupDate}
                    onChange={(e) => setBookingDates({...bookingDates, pickupDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    value={bookingDates.returnDate}
                    onChange={(e) => setBookingDates({...bookingDates, returnDate: e.target.value})}
                    min={bookingDates.pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                {bookingDates.pickupDate && bookingDates.returnDate && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Daily Rate:</span>
                      <span className="font-semibold">{formatPrice(car.pricePerDay)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-amber-600">{formatPrice(calculateTotalPrice())}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Agent (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    placeholder="Any special requests or questions for the agent?"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>
                
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}