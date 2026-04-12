'use client'

import { useFavorites } from '../context/FavoritesContext'
import CarCard from '../components/cars/CarCard'
import { FaHeart, FaTrash, FaCar } from 'react-icons/fa'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites()

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaHeart className="text-red-500 text-4xl" />
            <h1 className="text-4xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your collection of preferred vehicles
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-500">
            You have <span className="font-semibold text-amber-600">{favoritesCount}</span> favorite {favoritesCount === 1 ? 'car' : 'cars'}
          </p>
          {favoritesCount > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <FaTrash size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favoritesCount === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No favorites yet</h3>
            <p className="text-slate-500 mb-6">
              Start adding cars to your favorites by clicking the heart icon on any car card
            </p>
            <Link href="/cars">
              <button className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition inline-flex items-center gap-2">
                <FaCar /> Browse Cars
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}