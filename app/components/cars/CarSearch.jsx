'use client'

import { useState } from 'react'
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'

export default function CarSearch({ onSearch, initialValues = {} }) {
  const [searchData, setSearchData] = useState({
    location: initialValues.location || '',
    pickupDate: initialValues.pickupDate || '',
    returnDate: initialValues.returnDate || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchData)
  }

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="location"
            placeholder="Location (Lagos, Abuja...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            name="pickupDate"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchData.pickupDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            name="returnDate"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchData.returnDate}
            onChange={handleChange}
            min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaSearch /> Search Cars
        </button>
      </div>
    </form>
  )
}