// Format price to NGN currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0)
}

// Calculate number of days between two dates
export const calculateDays = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 0
  return Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
}

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Check if car is available for selected dates
export const isCarAvailable = (bookings, carId, pickupDate, returnDate) => {
  const pickup = new Date(pickupDate)
  const returnD = new Date(returnDate)
  
  return !bookings.some(booking => {
    if (booking.carId !== carId) return false
    if (booking.status === 'cancelled') return false
    
    const bookingPickup = new Date(booking.pickupDate)
    const bookingReturn = new Date(booking.returnDate)
    
    return (pickup < bookingReturn && returnD > bookingPickup)
  })
}

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}