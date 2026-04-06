'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CompareContext = createContext()

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return context
}

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load from localStorage on mount
    const saved = localStorage.getItem('compareList')
    if (saved) {
      try {
        setCompareList(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading compare list:', e)
      }
    }
  }, [])

  // Save to localStorage whenever compareList changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('compareList', JSON.stringify(compareList))
    }
  }, [compareList, isClient])

  const addToCompare = (car) => {
    if (compareList.length >= 3) {
      alert('You can compare up to 3 cars only')
      return false
    }
    if (compareList.find(c => c.id === car.id)) {
      alert('This car is already in comparison list')
      return false
    }
    setCompareList([...compareList, car])
    return true
  }

  const removeFromCompare = (carId) => {
    setCompareList(compareList.filter(car => car.id !== carId))
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const isInCompare = (carId) => {
    return compareList.some(car => car.id === carId)
  }

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    compareCount: compareList.length
  }

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}