'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FaCar,
  FaShieldAlt,
  FaHeadset,
  FaMoneyBillWave,
  FaStar,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGem,
  FaClock,
  FaCheckCircle,
  FaRocket
} from 'react-icons/fa'
import CarCard from './components/cars/CarCard'
import LoadingSkeleton from './components/layout/LoadingSkeleton'
import RecentlyViewed from './components/home/RecentlyViewed'

// Parallax Section Component
const ParallaxSection = ({ children, speed = 0.3, className = '' }) => {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return
      
      const scrollPosition = window.scrollY
      const sectionTop = sectionRef.current.offsetTop
      const distanceFromTop = scrollPosition - sectionTop
      const yPos = distanceFromTop * speed
      
      bgRef.current.style.transform = `translateY(${yPos}px)`
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [counters, setCounters] = useState({ cars: 0, customers: 0, years: 0 })

  useEffect(() => {
    fetchFeaturedCars()
    startCounters()
  }, [])

  const startCounters = () => {
    const targets = { cars: 500, customers: 10000, years: 5 }
    const duration = 2000
    const stepTime = 20
    const steps = duration / stepTime
    
    let current = { cars: 0, customers: 0, years: 0 }
    const increments = {
      cars: targets.cars / steps,
      customers: targets.customers / steps,
      years: targets.years / steps
    }
    
    const timer = setInterval(() => {
      current.cars += increments.cars
      current.customers += increments.customers
      current.years += increments.years
      
      if (current.cars >= targets.cars) {
        current.cars = targets.cars
        current.customers = targets.customers
        current.years = targets.years
        clearInterval(timer)
      }
      
      setCounters({
        cars: Math.floor(current.cars),
        customers: Math.floor(current.customers),
        years: Math.floor(current.years)
      })
    }, stepTime)
  }

  const fetchFeaturedCars = async () => {
    try {
      const featuredCarsData = [
        { id: 1, name: 'Toyota Camry', type: 'Sedan', pricePerDay: 25000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.8, featured: true, available: true },
        { id: 2, name: 'Honda Accord', type: 'Sedan', pricePerDay: 27000, seats: 5, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.7, featured: true, available: true },
        { id: 3, name: 'Toyota Corolla', type: 'Economy', pricePerDay: 18000, seats: 5, fuelType: 'Petrol', transmission: 'Manual', location: 'Abuja', rating: 4.5, featured: true, available: false },
        { id: 4, name: 'Lexus RX 350', type: 'SUV', pricePerDay: 55000, seats: 7, fuelType: 'Petrol', transmission: 'Automatic', location: 'Lagos', rating: 4.9, featured: true, available: true }
      ]
      setFeaturedCars(featuredCarsData)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchLocation) params.append('location', searchLocation)
    if (pickupDate) params.append('pickupDate', pickupDate)
    if (returnDate) params.append('returnDate', returnDate)
    window.location.href = `/cars?${params.toString()}`
  }

  const features = [
    {
      icon: FaCar,
      title: '500+ Vehicles',
      description: 'Wide selection from economy to luxury',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    {
      icon: FaShieldAlt,
      title: 'Full Insurance',
      description: '100% coverage on all rentals',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Best Price Guarantee',
      description: 'Affordable rates with no hidden fees',
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  ]

  const testimonials = [
    {
      name: 'John Adebayo',
      location: 'Lagos, Nigeria',
      rating: 5,
      comment: 'Excellent service! The car was in perfect condition and pickup was seamless.',
      role: 'Business Traveler'
    },
    {
      name: 'Sarah Okafor',
      location: 'Abuja, Nigeria',
      rating: 5,
      comment: 'Best car rental experience in Nigeria. Very professional and reliable.',
      role: 'Frequent Renter'
    },
    {
      name: 'Michael Eze',
      location: 'Port Harcourt, Nigeria',
      rating: 4,
      comment: 'Great selection of cars and very competitive prices. Will definitely use again.',
      role: 'Family Vacationer'
    }
  ]

  if (loading) return <LoadingSkeleton />

  return (
    <div className="font-sans">
      {/* HERO with Parallax */}
      <ParallaxSection speed={0.3} className="min-h-[600px]">
        <div className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
          </div>
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-float">
                <FaRocket className="text-yellow-300" />
                <span className="text-sm font-medium">Nigeria's #1 Car Rental Service</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Drive Your <span className="text-yellow-300">Dream Car</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-amber-100 leading-relaxed">
                Premium car rentals across major cities with top-notch service and affordable rates.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/cars" className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition transform shadow-lg hover:shadow-amber-400/30 inline-flex items-center gap-2">
                  Browse Cars <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/20">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* STATS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <div className="text-5xl font-bold text-amber-500 mb-2">{counters.cars}+</div>
              <p className="text-gray-600 font-medium">Luxury Vehicles</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <div className="text-5xl font-bold text-orange-500 mb-2">{counters.customers}+</div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <div className="text-5xl font-bold text-amber-500 mb-2">{counters.years}+</div>
              <p className="text-gray-600 font-medium">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative -mt-12 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Ride</h2>
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition transform">
                Search Cars
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      <RecentlyViewed />

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
              <FaGem className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">Why Choose Us</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              The <span className="text-amber-500">Iwada</span> Advantage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide the best car rental experience with premium service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                  <feature.icon className={`text-3xl ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Featured <span className="text-amber-500">Vehicles</span>
              </h2>
              <p className="text-gray-600 text-lg">Our most popular cars for rent</p>
            </div>
            <Link href="/cars" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
              View All <FaArrowRight />
            </Link>
          </div>

          {featuredCars.length === 0 ? (
            <div className="text-center py-12">
              <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No cars available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4">
              <FaStar className="text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">Testimonials</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our <span className="text-amber-500">Customers Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join thousands of satisfied customers who trust Iwada Rentals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <FaClock className="text-white" />
            <span className="text-sm font-medium text-white">Limited Time Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Book your perfect car today and enjoy a seamless driving experience
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/cars" className="bg-white text-amber-500 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              Book Now <FaArrowRight />
            </Link>
            <Link href="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300">
              Contact Support
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-amber-100">
            <FaCheckCircle />
            <span>Free cancellation up to 24 hours before pickup</span>
          </div>
        </div>
      </section>
    </div>
  )
}