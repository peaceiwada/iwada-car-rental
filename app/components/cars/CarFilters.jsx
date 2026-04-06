'use client'

import { FaMapMarkerAlt, FaFilter } from 'react-icons/fa'

export default function CarFilters({ filters, onFilterChange, onClearFilters }) {
  const carTypes = ['All', 'Economy', 'Sedan', 'SUV', 'Luxury', 'Van', 'Sports']
  const seatOptions = ['Any', '2+', '4+', '5+', '6+', '7+', '8+']
  const transmissionOptions = ['Any', 'Manual', 'Automatic']

  const handleSeatChange = (value) => {
    if (value === 'Any') {
      onFilterChange('seats', '')
    } else {
      onFilterChange('seats', parseInt(value))
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaFilter /> Filters
        </h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Clear All
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Location</label>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter city or area"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters?.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Price Range (per day)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₦"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters?.priceMin || ''}
            onChange={(e) => onFilterChange('priceMin', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max ₦"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters?.priceMax || ''}
            onChange={(e) => onFilterChange('priceMax', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Car Type</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters?.type || 'All'}
          onChange={(e) => onFilterChange('type', e.target.value === 'All' ? '' : e.target.value)}
        >
          {carTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Seats</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters?.seats ? `${filters.seats}+` : 'Any'}
          onChange={(e) => handleSeatChange(e.target.value)}
        >
          {seatOptions.map(seats => (
            <option key={seats} value={seats}>{seats}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Transmission</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters?.transmission || 'Any'}
          onChange={(e) => onFilterChange('transmission', e.target.value === 'Any' ? '' : e.target.value)}
        >
          {transmissionOptions.map(trans => (
            <option key={trans} value={trans}>{trans}</option>
          ))}
        </select>
      </div>
    </div>
  )
}