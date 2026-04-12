'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('carFavorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('carFavorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (car) => {
    if (!favorites.find(fav => fav.id === car.id)) {
      setFavorites([...favorites, car])
      toast.success(`${car.name} added to favorites! ❤️`)
    }
  }

  const removeFromFavorites = (carId) => {
    const removedCar = favorites.find(car => car.id === carId)
    setFavorites(favorites.filter(car => car.id !== carId))
    if (removedCar) {
      toast.success(`${removedCar.name} removed from favorites`)
    }
  }

  const isInFavorites = (carId) => {
    return favorites.some(car => car.id === carId)
  }

  const toggleFavorite = (car) => {
    if (isInFavorites(car.id)) {
      removeFromFavorites(car.id)
    } else {
      addToFavorites(car)
    }
  }

  const clearFavorites = () => {
    setFavorites([])
    toast.success('All favorites cleared')
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isInFavorites,
      toggleFavorite,
      clearFavorites,
      favoritesCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}