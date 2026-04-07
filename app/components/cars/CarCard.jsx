'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaStar, FaGasPump, FaUsers, FaCog, FaMapMarkerAlt, FaCar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { getCarImage } from '../../lib/carImages'
import { useCompare } from '../../context/CompareContext'
import Tooltip from '../ui/Tooltip'

export default function CarCard({ car }) {
  const [imageError, setImageError] = useState(false)
  const { addToCompare, isInCompare, removeFromCompare } = useCompare()
  const imageUrl = getCarImage(car.name)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (!car) return null

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 h-full flex flex-col">
      {/* Car Image */}
      <Link href={`/cars/${car.id}`}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={car.name}
              className="w-full h-full object-contain bg-gray-50 p-2 group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <FaCar className="text-gray-400 text-5xl" />
              <span className="text-xs text-gray-500 font-medium">{car.name}</span>
            </div>
          )}
          
          {/* Availability Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg z-10 flex items-center gap-1 ${
            car.available 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {car.available ? (
              <>
                <FaCheckCircle size={10} /> Available
              </>
            ) : (
              <>
                <FaTimesCircle size={10} /> Unavailable
              </>
            )}
          </div>
          
          {/* Featured Badge */}
          {car.featured && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg z-10">
              Featured
            </div>
          )}
          
          {/* Rating Badge */}
          {car.rating && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow-md z-10">
              <FaStar className="text-amber-500" size={12} />
              <span className="font-semibold text-slate-700">{car.rating}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Car Details */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/cars/${car.id}`}>
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
              {car.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <FaMapMarkerAlt size={12} />
              <span>{car.location || 'Lagos, Nigeria'}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <FaUsers size={14} className="text-slate-400" />
              <span>{car.seats || 4} seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaGasPump size={14} className="text-slate-400" />
              <span>{car.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaCog size={14} className="text-slate-400" />
              <span>{car.transmission || 'Manual'}</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-slate-100 pt-3">
            <div className="mb-2">
              <span className="text-2xl font-bold text-amber-600">
                {formatPrice(car.pricePerDay || car.price || 50000)}
              </span>
              <span className="text-sm text-slate-500"> /day</span>
            </div>
          </div>
        </Link>

        {/* Action Buttons - Outside the Link */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={(e) => {
              e.preventDefault()
              if (isInCompare(car.id)) {
                removeFromCompare(car.id)
              } else {
                addToCompare(car)
              }
            }}
            className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isInCompare(car.id) 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-amber-600 hover:text-white'
            }`}
          >
            {isInCompare(car.id) ? '✅ Added' : '➕ Compare'}
          </button>
          <Link href={`/cars/${car.id}`} className="flex-1">
            <button 
              className="w-full py-2 rounded-xl font-semibold text-sm transition-all duration-300 bg-amber-600 text-white hover:bg-amber-700"
            >
              Rent Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}