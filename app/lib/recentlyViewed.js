// Save car to recently viewed in localStorage
export const saveToRecentlyViewed = (car) => {
  if (typeof window === 'undefined') return
  
  try {
    // Get existing recently viewed cars
    const existing = localStorage.getItem('recentlyViewed')
    let recent = existing ? JSON.parse(existing) : []
    
    // Remove if car already exists (to move it to front)
    recent = recent.filter(item => item.id !== car.id)
    
    // Add current car to the beginning
    const newRecent = [
      {
        id: car.id,
        name: car.name,
        pricePerDay: car.pricePerDay,
        location: car.location,
        image: car.imageUrl || car.image,
        available: car.available,
        viewedAt: new Date().toISOString()
      },
      ...recent
    ]
    
    // Keep only last 6 cars
    const trimmed = newRecent.slice(0, 6)
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(trimmed))
    
  } catch (error) {
    console.error('Error saving to recently viewed:', error)
  }
}

// Get recently viewed cars
export const getRecentlyViewed = () => {
  if (typeof window === 'undefined') return []
  
  try {
    const existing = localStorage.getItem('recentlyViewed')
    return existing ? JSON.parse(existing) : []
  } catch (error) {
    console.error('Error getting recently viewed:', error)
    return []
  }
}

// Clear recently viewed history
export const clearRecentlyViewed = () => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('recentlyViewed')
  } catch (error) {
    console.error('Error clearing recently viewed:', error)
  }
}