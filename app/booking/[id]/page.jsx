'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaArrowLeft, FaCar, FaCalendarAlt, FaUser, FaEnvelope, 
  FaPhone, FaCreditCard, FaCheckCircle, FaShieldAlt,
  FaInfoCircle, FaWhatsapp, FaTag, FaStar, FaGem
} from 'react-icons/fa'
import { useAuth } from '../../components/auth/AuthProvider'
import toast from 'react-hot-toast'
import { getCarImage } from '../../lib/carImages'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  
  // Booking details
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [extras, setExtras] = useState({
    insurance: false,
    gps: false,
    childSeat: false
  })
  
  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (params.id) {
      fetchCarDetails()
    }
  }, [params.id, isAuthenticated])

  useEffect(() => {
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
    }
  }, [user])

  const fetchCarDetails = async () => {
    try {
      const carsData = {
        1: { id: 1, name: 'Toyota Camry', pricePerDay: 25000, imageUrl: getCarImage('Toyota Camry'), available: true, dailyRate: 25000, weeklyRate: 150000, monthlyRate: 500000 },
        2: { id: 2, name: 'Honda Accord', pricePerDay: 27000, imageUrl: getCarImage('Honda Accord'), available: true, dailyRate: 27000, weeklyRate: 162000, monthlyRate: 540000 },
        3: { id: 3, name: 'Toyota Corolla', pricePerDay: 18000, imageUrl: getCarImage('Toyota Corolla'), available: false, dailyRate: 18000, weeklyRate: 108000, monthlyRate: 360000 },
        4: { id: 4, name: 'Lexus RX 350', pricePerDay: 55000, imageUrl: getCarImage('Lexus RX 350'), available: true, dailyRate: 55000, weeklyRate: 330000, monthlyRate: 1100000 },
        5: { id: 5, name: 'Mercedes C-Class', pricePerDay: 75000, imageUrl: getCarImage('Mercedes Benz C-Class'), available: false, dailyRate: 75000, weeklyRate: 450000, monthlyRate: 1500000 },
        6: { id: 6, name: 'Hyundai Santa Fe', pricePerDay: 35000, imageUrl: getCarImage('Hyundai Santa Fe'), available: true, dailyRate: 35000, weeklyRate: 210000, monthlyRate: 700000 },
        7: { id: 7, name: 'Kia Picanto', pricePerDay: 12000, imageUrl: getCarImage('Kia Picanto'), available: true, dailyRate: 12000, weeklyRate: 72000, monthlyRate: 240000 },
        8: { id: 8, name: 'Toyota Hilux', pricePerDay: 40000, imageUrl: getCarImage('Toyota Hilux'), available: true, dailyRate: 40000, weeklyRate: 240000, monthlyRate: 800000 }
      }
      
      const carData = carsData[params.id]
      if (carData && carData.available) {
        setCar(carData)
      } else {
        toast.error('This car is not available for booking')
        router.push('/cars')
      }
    } catch (error) {
      console.error('Error fetching car details:', error)
      toast.error('Failed to load car details')
      router.push('/cars')
    } finally {
      setLoading(false)
    }
  }

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    return Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
  }

  // Price Breakdown Calculator
  const calculatePriceBreakdown = () => {
    const days = calculateDays()
    if (days === 0) return null

    const dailyRate = car?.pricePerDay || 0
    const weeklyRate = car?.weeklyRate || dailyRate * 7 * 0.85
    const monthlyRate = car?.monthlyRate || dailyRate * 30 * 0.7
    
    const standardPrice = days * dailyRate
    
    let bestPrice = standardPrice
    let bestType = 'daily'
    let savings = 0
    
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    const weeklyPrice = (weeks * weeklyRate) + (remainingDays * dailyRate)
    
    const months = Math.floor(days / 30)
    const remainingDaysAfterMonth = days % 30
    const monthlyPrice = (months * monthlyRate) + (remainingDaysAfterMonth * dailyRate)
    
    if (weeklyPrice < bestPrice) {
      bestPrice = weeklyPrice
      bestType = 'weekly'
      savings = standardPrice - weeklyPrice
    }
    if (monthlyPrice < bestPrice) {
      bestPrice = monthlyPrice
      bestType = 'monthly'
      savings = standardPrice - monthlyPrice
    }
    
    return {
      days,
      standardPrice,
      bestPrice,
      bestType,
      savings,
      weeks: Math.floor(days / 7),
      remainingDays: days % 7,
      months: Math.floor(days / 30),
      dailyRate,
      weeklyRate,
      monthlyRate
    }
  }

  const calculateExtrasTotal = () => {
    const days = calculateDays()
    let total = 0
    if (extras.insurance) total += days * 5000
    if (extras.gps) total += days * 3000
    if (extras.childSeat) total += 5000
    return total
  }

  const calculateTotal = () => {
    const breakdown = calculatePriceBreakdown()
    if (!breakdown) return 0
    return breakdown.bestPrice + calculateExtrasTotal()
  }

  const handleNextStep = () => {
    if (step === 1 && (!pickupDate || !returnDate)) {
      toast.error('Please select pickup and return dates')
      return
    }
    if (step === 1 && new Date(pickupDate) >= new Date(returnDate)) {
      toast.error('Return date must be after pickup date')
      return
    }
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleSubmitBooking = async () => {
    if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    const breakdown = calculatePriceBreakdown()
    const days = calculateDays()
    const totalPrice = calculateTotal()

    const newBooking = {
      id: Date.now(),
      carId: car.id,
      carName: car.name,
      pickupDate: pickupDate,
      returnDate: returnDate,
      days: days,
      standardPrice: breakdown?.standardPrice,
      appliedDiscount: breakdown?.bestType,
      savings: breakdown?.savings,
      totalPrice: totalPrice,
      extras: extras,
      customerDetails: customerDetails,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    }

    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
    existingBookings.push(newBooking)
    localStorage.setItem('userBookings', JSON.stringify(existingBookings))

    toast.success(`Booking confirmed! You saved ₦${breakdown?.savings?.toLocaleString()} with ${breakdown?.bestType} rate!`)
    setTimeout(() => router.push('/dashboard'), 1500)
    setSubmitting(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!car) return null

  const breakdown = calculatePriceBreakdown()
  const days = calculateDays()
  const extrasTotal = calculateExtrasTotal()
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/cars/${car.id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors">
            <FaArrowLeft /> Back to Car Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
              {/* Progress Steps - Amber Theme */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  {[
                    { step: 1, label: 'Select Dates' },
                    { step: 2, label: 'Extras' },
                    { step: 3, label: 'Your Details' },
                    { step: 4, label: 'Confirm' }
                  ].map((item) => (
                    <div key={item.step} className={`flex-1 text-center ${step >= item.step ? 'text-white' : 'text-amber-200'}`}>
                      <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${step >= item.step ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'}`}>
                        {item.step}
                      </div>
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Select Dates with Price Calculator */}
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-800">Select Rental Dates</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Return Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          min={pickupDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      {/* Price Breakdown Calculator Display - Amber Theme */}
                      {pickupDate && returnDate && breakdown && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
                          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FaTag className="text-amber-600" /> Price Breakdown
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-semibold">{breakdown.days} days ({Math.floor(breakdown.days / 7)} week{Math.floor(breakdown.days / 7) !== 1 ? 's' : ''} {breakdown.days % 7} days)</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Standard Daily Rate:</span>
                              <span>{formatPrice(breakdown.standardPrice)}</span>
                            </div>
                            
                            {breakdown.days >= 7 && (
                              <div className="flex justify-between text-sm bg-emerald-50 p-2 rounded-lg">
                                <span className="text-emerald-700">📅 Weekly Rate ({breakdown.weeks} week{breakdown.weeks !== 1 ? 's' : ''}):</span>
                                <div className="text-right">
                                  <span className="text-emerald-700 line-through text-xs">{formatPrice(breakdown.weeks * breakdown.weeklyRate + breakdown.remainingDays * breakdown.dailyRate)}</span>
                                  <span className="font-semibold text-emerald-800 ml-2">{formatPrice(breakdown.weeks * breakdown.weeklyRate + breakdown.remainingDays * breakdown.dailyRate)}</span>
                                </div>
                              </div>
                            )}
                            
                            {breakdown.days >= 30 && (
                              <div className="flex justify-between text-sm bg-purple-50 p-2 rounded-lg">
                                <span className="text-purple-700">📆 Monthly Rate ({breakdown.months} month{breakdown.months !== 1 ? 's' : ''}):</span>
                                <div className="text-right">
                                  <span className="text-purple-700 line-through text-xs">{formatPrice(breakdown.months * breakdown.monthlyRate + breakdown.remainingDaysAfterMonth * breakdown.dailyRate)}</span>
                                  <span className="font-semibold text-purple-800 ml-2">{formatPrice(breakdown.months * breakdown.monthlyRate + breakdown.remainingDaysAfterMonth * breakdown.dailyRate)}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="border-t border-amber-200 pt-2 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Best Price ({breakdown.bestType} rate):</span>
                                <span className="text-xl font-bold text-amber-600">{formatPrice(breakdown.bestPrice)}</span>
                              </div>
                              {breakdown.savings > 0 && (
                                <div className="flex justify-between text-sm mt-1">
                                  <span className="text-emerald-600">🎉 You save:</span>
                                  <span className="text-emerald-600 font-semibold">{formatPrice(breakdown.savings)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-2 text-xs text-gray-500 flex items-center gap-1">
                            <FaStar className="text-amber-500 text-xs" />
                            <span>Weekly rentals save 15% • Monthly rentals save 30%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Extras */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-800">Add Extras</h2>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-50 transition">
                        <div className="flex items-center gap-3">
                          <FaShieldAlt className="text-amber-600 text-xl" />
                          <div>
                            <p className="font-semibold">Insurance Coverage</p>
                            <p className="text-sm text-gray-500">Full coverage for peace of mind</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">+₦5,000/day</p>
                          <input type="checkbox" checked={extras.insurance} onChange={(e) => setExtras({...extras, insurance: e.target.checked})} className="mt-1 w-5 h-5 text-amber-600 focus:ring-amber-500" />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-50 transition">
                        <div className="flex items-center gap-3">
                          <FaInfoCircle className="text-amber-600 text-xl" />
                          <div>
                            <p className="font-semibold">GPS Navigation</p>
                            <p className="text-sm text-gray-500">Never get lost with built-in GPS</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">+₦3,000/day</p>
                          <input type="checkbox" checked={extras.gps} onChange={(e) => setExtras({...extras, gps: e.target.checked})} className="mt-1 w-5 h-5 text-amber-600 focus:ring-amber-500" />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-50 transition">
                        <div className="flex items-center gap-3">
                          <FaCar className="text-amber-600 text-xl" />
                          <div>
                            <p className="font-semibold">Child Seat</p>
                            <p className="text-sm text-gray-500">Safe and comfortable for your little one</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">+₦5,000 (one-time)</p>
                          <input type="checkbox" checked={extras.childSeat} onChange={(e) => setExtras({...extras, childSeat: e.target.checked})} className="mt-1 w-5 h-5 text-amber-600 focus:ring-amber-500" />
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Customer Details */}
                {step === 3 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-800">Your Information</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            value={customerDetails.fullName}
                            onChange={(e) => setCustomerDetails({...customerDetails, fullName: e.target.value})}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                          <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            value={customerDetails.email}
                            onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                          <input
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            value={customerDetails.phone}
                            onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                            placeholder="+234 123 456 7890"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests (Optional)</label>
                        <textarea
                          rows="3"
                          className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          value={customerDetails.specialRequests}
                          onChange={(e) => setCustomerDetails({...customerDetails, specialRequests: e.target.value})}
                          placeholder="Any special requirements or notes..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-800">Confirm Your Booking</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <p className="font-semibold mb-2">📅 Rental Period</p>
                        <p className="text-sm text-gray-600">Pickup: {new Date(pickupDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Return: {new Date(returnDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Duration: {breakdown?.days} days</p>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <p className="font-semibold mb-2">💰 Price Breakdown</p>
                        <p className="text-sm text-gray-600">Car Rental: {formatPrice(breakdown?.bestPrice)} ({breakdown?.bestType} rate)</p>
                        {breakdown?.savings > 0 && (
                          <p className="text-sm text-emerald-600">Savings: {formatPrice(breakdown?.savings)}</p>
                        )}
                        {extras.insurance && <p className="text-sm text-gray-600">Insurance: +{formatPrice(calculateDays() * 5000)}</p>}
                        {extras.gps && <p className="text-sm text-gray-600">GPS: +{formatPrice(calculateDays() * 3000)}</p>}
                        {extras.childSeat && <p className="text-sm text-gray-600">Child Seat: +₦5,000</p>}
                        <div className="border-t border-amber-200 pt-2 mt-2">
                          <p className="font-bold">Total: {formatPrice(total)}</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <p className="font-semibold mb-2">👤 Your Details</p>
                        <p className="text-sm text-gray-600">Name: {customerDetails.fullName}</p>
                        <p className="text-sm text-gray-600">Email: {customerDetails.email}</p>
                        <p className="text-sm text-gray-600">Phone: {customerDetails.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-amber-100">
                  {step > 1 && (
                    <button onClick={handlePreviousStep} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
                      Back
                    </button>
                  )}
                  {step < 4 ? (
                    <button onClick={handleNextStep} className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition ml-auto">
                      Continue
                    </button>
                  ) : (
                    <button onClick={handleSubmitBooking} disabled={submitting} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition ml-auto disabled:opacity-50">
                      {submitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary - Amber Theme */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-24 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <FaGem className="text-amber-500" />
                <h3 className="font-bold text-lg text-gray-800">Booking Summary</h3>
              </div>
              
              {/* Car Info */}
              <div className="flex gap-3 pb-3 border-b border-amber-100">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden">
                  <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{car.name}</p>
                  <p className="text-sm text-amber-600 font-semibold">{formatPrice(car.pricePerDay)}/day</p>
                </div>
              </div>

              {/* Price Summary */}
              {breakdown && (
                <div className="py-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({breakdown.days} days)</span>
                    <span>{formatPrice(breakdown.standardPrice)}</span>
                  </div>
                  {breakdown.bestType !== 'daily' && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>{breakdown.bestType} discount</span>
                      <span>-{formatPrice(breakdown.savings)}</span>
                    </div>
                  )}
                  {extras.insurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Insurance</span>
                      <span>{formatPrice(calculateDays() * 5000)}</span>
                    </div>
                  )}
                  {extras.gps && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GPS</span>
                      <span>{formatPrice(calculateDays() * 3000)}</span>
                    </div>
                  )}
                  {extras.childSeat && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Child Seat</span>
                      <span>₦5,000</span>
                    </div>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t border-amber-100">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">{formatPrice(total)}</span>
                </div>
                {breakdown?.savings > 0 && (
                  <p className="text-xs text-emerald-600 mt-1">🎉 You saved {formatPrice(breakdown.savings)}!</p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-3 border-t border-amber-100 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <FaCheckCircle className="text-emerald-500" /> Secure Booking
                </p>
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2 mt-1">
                  <FaWhatsapp className="text-emerald-500" /> 24/7 Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}