'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaStar, FaGasPump, FaUsers, FaCog, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaMapMarkerAlt, FaCar, FaTimesCircle, FaChevronLeft, FaChevronRight, FaTimes, FaChevronRight as FaNext, FaChevronLeft as FaPrev, FaExpand } from 'react-icons/fa'
import { useAuth } from '../../components/auth/AuthProvider'
import toast from 'react-hot-toast'
import { getCarImage } from '../../lib/carImages'
import { saveToRecentlyViewed } from '../../lib/recentlyViewed'
import ShareButton from '../../components/ui/ShareButton'

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  // Image Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [galleryImages, setGalleryImages] = useState([])
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [bookedDates, setBookedDates] = useState([])
  const [hoverDate, setHoverDate] = useState(null)

  // Generate multiple images for the gallery (mock data)
  const generateGalleryImages = (carName, baseImageUrl) => {
    // Use the main image plus generate additional angles
    const images = [
      baseImageUrl,
      baseImageUrl?.replace('w=600', 'w=600&angle=front') || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop',
      baseImageUrl?.replace('w=600', 'w=600&angle=side') || 'https://images.unsplash.com/photo-1607853554439-0069f0b29d9c?w=600&h=400&fit=crop',
      baseImageUrl?.replace('w=600', 'w=600&angle=interior') || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop',
      baseImageUrl?.replace('w=600', 'w=600&angle=back') || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
    ]
    return images.filter(img => img && img !== baseImageUrl).slice(0, 5)
  }

  // Get existing bookings for this car from localStorage
  useEffect(() => {
    if (car) {
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
      const carBookings = existingBookings.filter(b => b.carId === car.id && b.status !== 'cancelled')
      const booked = carBookings.flatMap(booking => {
        const start = new Date(booking.pickupDate)
        const end = new Date(booking.returnDate)
        const dates = []
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d).toISOString().split('T')[0])
        }
        return dates
      })
      setBookedDates(booked)
      
      // Generate gallery images
      if (car.imageUrl) {
        const images = [car.imageUrl, ...generateGalleryImages(car.name, car.imageUrl)]
        setGalleryImages(images)
      }
    }
  }, [car])

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
      const carsData = {
        1: { 
          id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', 
          transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 4.8, 
          description: 'Comfortable and fuel-efficient sedan perfect for business and leisure travel.', 
          year: 2023, available: true, imageUrl: getCarImage('Toyota Camry')
        },
        2: { 
          id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', 
          transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 4.7, 
          description: 'Elegant and spacious sedan with premium features.', 
          year: 2023, available: true, imageUrl: getCarImage('Honda Accord')
        },
        3: { 
          id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, fuelType: 'Petrol', 
          transmission: 'Manual', location: 'Abuja, Nigeria', rating: 4.5, 
          description: 'Reliable and economical car perfect for city driving.', 
          year: 2022, available: false, imageUrl: getCarImage('Toyota Corolla')
        },
        4: { 
          id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, fuelType: 'Petrol', 
          transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 4.9, 
          description: 'Luxury SUV with premium comfort and advanced safety features.', 
          year: 2023, available: true, imageUrl: getCarImage('Lexus RX 350')
        },
        5: { 
          id: 5, name: 'Mercedes Benz C-Class', type: 'Luxury', pricePerDay: 75000, seats: 5, fuelType: 'Petrol', 
          transmission: 'Automatic', location: 'Lagos, Nigeria', rating: 5.0, 
          description: 'Ultimate luxury sedan with exceptional performance and style.', 
          year: 2024, available: false, imageUrl: getCarImage('Mercedes Benz C-Class')
        },
        6: { 
          id: 6, name: 'Hyundai Santa Fe', type: 'SUV', pricePerDay: 35000, seats: 7, fuelType: 'Diesel', 
          transmission: 'Automatic', location: 'Abuja, Nigeria', rating: 4.6, 
          description: 'Spacious SUV perfect for family trips and long journeys.', 
          year: 2023, available: true, imageUrl: getCarImage('Hyundai Santa Fe')
        },
        7: { 
          id: 7, name: 'Kia Picanto', type: 'Economy', pricePerDay: 12000, seats: 4, fuelType: 'Petrol', 
          transmission: 'Manual', location: 'Port Harcourt, Nigeria', rating: 4.3, 
          description: 'Compact and fuel-efficient car ideal for city commuting.', 
          year: 2022, available: true, imageUrl: getCarImage('Kia Picanto')
        },
        8: { 
          id: 8, name: 'Toyota Hilux', type: 'SUV', pricePerDay: 40000, seats: 5, fuelType: 'Diesel', 
          transmission: 'Manual', location: 'Lagos, Nigeria', rating: 4.7, 
          description: 'Durable pickup truck perfect for rough terrain and heavy loads.', 
          year: 2023, available: true, imageUrl: getCarImage('Toyota Hilux')
        }
      }
      
      const carData = carsData[params.id]
      if (carData) {
        setCar(carData)
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

  // Gallery functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index)
    setShowLightbox(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox])

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateBooked = (date) => {
    return bookedDates.includes(date.toISOString().split('T')[0])
  }

  const isDatePast = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (date) => {
    if (startDate && date.toDateString() === startDate.toDateString()) return true
    if (endDate && date.toDateString() === endDate.toDateString()) return true
    return false
  }

  const isInRange = (date) => {
    if (!startDate || !endDate) return false
    return date > startDate && date < endDate
  }

  const isInHoverRange = (date) => {
    if (!startDate || !hoverDate || endDate) return false
    return date > startDate && date < hoverDate
  }

  const handleDateClick = (date) => {
    if (isDatePast(date) || isDateBooked(date)) return
    
    if (!startDate) {
      setStartDate(date)
      setEndDate(null)
    } else if (!endDate) {
      if (date > startDate) {
        setEndDate(date)
      } else {
        setStartDate(date)
        setEndDate(null)
      }
    } else {
      setStartDate(date)
      setEndDate(null)
    }
  }

  const changeMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1))
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  }

  const calculateTotalPrice = () => {
    const days = calculateDays()
    return days * (car?.pricePerDay || 0)
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a car')
      router.push('/login')
      return
    }

    if (!car?.available) {
      toast.error('This car is currently unavailable for booking')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select pickup and return dates from the calendar')
      return
    }

    const days = calculateDays()
    const totalPrice = calculateTotalPrice()

    const newBooking = {
      id: Date.now(),
      carId: car.id,
      carName: car.name,
      pickupDate: startDate.toISOString().split('T')[0],
      returnDate: endDate.toISOString().split('T')[0],
      totalPrice: totalPrice,
      days: days,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      location: car.location
    }

    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
    existingBookings.push(newBooking)
    localStorage.setItem('userBookings', JSON.stringify(existingBookings))

    toast.success(`✓ Booking confirmed! ${car.name} for ${days} day(s). Total: ${formatPrice(totalPrice)}`)
    router.push('/dashboard')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0)
  }

  const formatDateDisplay = (date) => {
    if (!date) return 'Not selected'
    return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const days = []
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-12" />)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
      const isPast = isDatePast(date)
      const isBooked = isDateBooked(date)
      const isSelected = isDateSelected(date)
      const inRange = isInRange(date)
      const inHoverRange = isInHoverRange(date)
      const isToday = date.toDateString() === today.toDateString()

      let bgColor = 'bg-white hover:bg-gray-50'
      if (isSelected) bgColor = 'bg-blue-600 text-white hover:bg-blue-700'
      else if (inRange) bgColor = 'bg-blue-100 text-blue-800'
      else if (inHoverRange) bgColor = 'bg-blue-50'
      else if (isBooked) bgColor = 'bg-red-100 text-red-500 line-through cursor-not-allowed'
      else if (isPast) bgColor = 'bg-gray-100 text-gray-400 cursor-not-allowed'

      let cursor = 'cursor-pointer'
      if (isPast || isBooked) cursor = 'cursor-not-allowed'

      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => !isPast && !isBooked && !endDate && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          disabled={isPast || isBooked}
          className={`h-10 sm:h-12 rounded-lg text-sm sm:text-base font-medium transition-all ${bgColor} ${cursor} relative`}
        >
          {d}
          {isToday && !isSelected && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
          )}
        </button>
      )
    }

    return { days, monthNames }
  }

  const { days, monthNames } = renderCalendar()
  const daysCount = calculateDays()
  const totalPrice = calculateTotalPrice()

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
        <Link href="/cars" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
          Browse Available Cars
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cars" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Images & Details with Gallery */}
          <div className="lg:col-span-2">
            {/* Main Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
              <div 
                className="relative h-96 bg-gradient-to-r from-gray-100 to-gray-200 cursor-pointer group"
                onClick={() => openLightbox(currentImageIndex)}
              >
                {!imageError && galleryImages[currentImageIndex] ? (
                  <img 
                    src={galleryImages[currentImageIndex]} 
                    alt={car.name} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <FaCar className="text-gray-400 text-6xl" />
                    <span className="text-gray-500 font-medium">{car.name}</span>
                  </div>
                )}
                {/* Expand icon overlay */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaExpand size={16} />
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="p-3 border-t border-gray-100">
                  <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt={`${car.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Car Info Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt size={14} />
                    <span>{car.location || 'Lagos, Nigeria'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                  <FaUsers className="text-2xl text-gray-400" /><div><p className="text-xs text-gray-500">Seats</p><p className="font-semibold text-gray-800">{car.seats} Seats</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGasPump className="text-2xl text-gray-400" /><div><p className="text-xs text-gray-500">Fuel Type</p><p className="font-semibold text-gray-800">{car.fuelType}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCog className="text-2xl text-gray-400" /><div><p className="text-xs text-gray-500">Transmission</p><p className="font-semibold text-gray-800">{car.transmission}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-2xl text-gray-400" /><div><p className="text-xs text-gray-500">Model Year</p><p className="font-semibold text-gray-800">{car.year}</p></div>
                </div>
              </div>

              <div><h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3><p className="text-gray-600 leading-relaxed">{car.description}</p></div>
              <div className="mt-6"><h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Air Conditioning', 'Bluetooth Connectivity', 'USB Port', 'GPS Navigation', 'Backup Camera', 'Cruise Control', 'Power Steering', 'ABS Brakes'].map(feature => (
                    <div key={feature} className="flex items-center gap-2 text-gray-600"><FaCheckCircle className="text-green-500 text-sm flex-shrink-0" /><span className="text-sm">{feature}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card with Interactive Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-24">
              <div className="mb-4 pb-3 border-b border-gray-200">
                <span className="text-2xl font-bold text-blue-600">{formatPrice(car.pricePerDay)}</span>
                <span className="text-gray-500"> / day</span>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                <p className="font-semibold text-gray-800 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500 text-sm" />{car.location}</p>
              </div>

              {/* Interactive Calendar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition"><FaChevronLeft size={16} /></button>
                  <h3 className="font-semibold text-gray-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition"><FaChevronRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="text-xs text-gray-500 py-1">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">{days}</div>
              </div>

              {/* Selected Dates Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-medium text-gray-800">{formatDateDisplay(startDate)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Return:</span>
                  <span className="font-medium text-gray-800">{formatDateDisplay(endDate)}</span>
                </div>
                {startDate && endDate && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-800">{daysCount} {daysCount === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold mt-1">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-600"></div><span className="text-gray-500">Selected</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-100"></div><span className="text-gray-500">In Range</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-100"></div><span className="text-gray-500">Booked</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-100"></div><span className="text-gray-500">Past</span></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <ShareButton car={car} />
                <button onClick={handleBooking} disabled={!car.available || !startDate || !endDate} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {!startDate || !endDate ? 'Select Dates' : car.available ? 'Book Now' : 'Unavailable'}
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">Free cancellation up to 24 hours before pickup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition z-10">
            <FaTimes size={24} />
          </button>
          
          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
          
          {/* Previous button */}
          {galleryImages.length > 1 && (
            <button onClick={prevImage} className="absolute left-4 text-white text-3xl hover:text-gray-300 transition bg-black/50 w-10 h-10 rounded-full flex items-center justify-center">
              <FaPrev size={20} />
            </button>
          )}
          
          {/* Main Image */}
          <img 
            src={galleryImages[currentImageIndex]} 
            alt={`${car.name} view ${currentImageIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          
          {/* Next button */}
          {galleryImages.length > 1 && (
            <button onClick={nextImage} className="absolute right-4 text-white text-3xl hover:text-gray-300 transition bg-black/50 w-10 h-10 rounded-full flex items-center justify-center">
              <FaNext size={20} />
            </button>
          )}
          
          {/* Thumbnail strip in lightbox */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-2 bg-black/50">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                    currentImageIndex === idx ? 'border-white ring-2 ring-blue-500' : 'border-gray-600'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}