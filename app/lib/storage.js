import { StorageKeys, generateId, VerificationStatus, UserRole, BookingStatus } from './constants'

// ==================== USER STORAGE ====================

// Get all users
export const getUsers = () => {
  try {
    const users = localStorage.getItem(StorageKeys.USERS)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error('Error getting users:', error)
    return []
  }
}

// Save user
export const saveUser = (user) => {
  try {
    const users = getUsers()
    users.push(user)
    localStorage.setItem(StorageKeys.USERS, JSON.stringify(users))
    return user
  } catch (error) {
    console.error('Error saving user:', error)
    return null
  }
}

// Update user
export const updateUser = (userId, updates) => {
  try {
    const users = getUsers()
    const index = users.findIndex(u => u.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      localStorage.setItem(StorageKeys.USERS, JSON.stringify(users))
      
      // If updating current user, also update current user in localStorage
      const currentUser = getCurrentUser()
      if (currentUser && currentUser.id === userId) {
        const updatedCurrentUser = { ...currentUser, ...updates }
        localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(updatedCurrentUser))
      }
      
      return users[index]
    }
    return null
  } catch (error) {
    console.error('Error updating user:', error)
    return null
  }
}

// Get user by ID
export const getUserById = (userId) => {
  try {
    const users = getUsers()
    return users.find(u => u.id === userId) || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Get user by email
export const getUserByEmail = (email) => {
  try {
    const users = getUsers()
    return users.find(u => u.email === email) || null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

// Get current logged in user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(StorageKeys.CURRENT_USER)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Set current user (login)
export const setCurrentUser = (user) => {
  try {
    localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(user))
    localStorage.setItem(StorageKeys.TOKEN, `mock_token_${user.id}`)
    return user
  } catch (error) {
    console.error('Error setting current user:', error)
    return null
  }
}

// Clear current user (logout)
export const clearCurrentUser = () => {
  try {
    localStorage.removeItem(StorageKeys.CURRENT_USER)
    localStorage.removeItem(StorageKeys.TOKEN)
    return true
  } catch (error) {
    console.error('Error clearing current user:', error)
    return false
  }
}

// Get all pending agents
export const getPendingAgents = () => {
  try {
    const users = getUsers()
    return users.filter(u => 
      u.role === UserRole.AGENT && 
      u.agentVerification?.status === VerificationStatus.PENDING
    )
  } catch (error) {
    console.error('Error getting pending agents:', error)
    return []
  }
}

// Get all approved agents
export const getApprovedAgents = () => {
  try {
    const users = getUsers()
    return users.filter(u => 
      u.role === UserRole.AGENT && 
      u.agentVerification?.status === VerificationStatus.APPROVED
    )
  } catch (error) {
    console.error('Error getting approved agents:', error)
    return []
  }
}

// Get agent by ID
export const getAgentById = (agentId) => {
  try {
    const users = getUsers()
    return users.find(u => u.id === agentId && u.role === UserRole.AGENT) || null
  } catch (error) {
    console.error('Error getting agent by ID:', error)
    return null
  }
}

// Approve agent
export const approveAgent = (agentId, adminId) => {
  try {
    const updates = {
      'agentVerification.status': VerificationStatus.APPROVED,
      'agentVerification.reviewedAt': new Date().toISOString(),
      'agentVerification.reviewedBy': adminId
    }
    return updateUser(agentId, updates)
  } catch (error) {
    console.error('Error approving agent:', error)
    return null
  }
}

// Reject agent
export const rejectAgent = (agentId, adminId, reason) => {
  try {
    const updates = {
      'agentVerification.status': VerificationStatus.REJECTED,
      'agentVerification.reviewedAt': new Date().toISOString(),
      'agentVerification.reviewedBy': adminId,
      'agentVerification.rejectionReason': reason
    }
    return updateUser(agentId, updates)
  } catch (error) {
    console.error('Error rejecting agent:', error)
    return null
  }
}

// ==================== CAR STORAGE ====================

// Get all cars
export const getCars = () => {
  try {
    const cars = localStorage.getItem(StorageKeys.CARS)
    return cars ? JSON.parse(cars) : []
  } catch (error) {
    console.error('Error getting cars:', error)
    return []
  }
}

// Get cars by agent ID
export const getCarsByAgent = (agentId) => {
  try {
    const cars = getCars()
    return cars.filter(car => car.agentId === agentId)
  } catch (error) {
    console.error('Error getting cars by agent:', error)
    return []
  }
}

// Get car by ID
export const getCarById = (carId) => {
  try {
    const cars = getCars()
    return cars.find(car => car.id === carId) || null
  } catch (error) {
    console.error('Error getting car by ID:', error)
    return null
  }
}

// Save car
export const saveCar = (car) => {
  try {
    const cars = getCars()
    const newCar = {
      ...car,
      id: generateId('car'),
      createdAt: new Date().toISOString(),
      available: true,
      rating: 0,
      totalReviews: 0
    }
    cars.push(newCar)
    localStorage.setItem(StorageKeys.CARS, JSON.stringify(cars))
    
    // Update agent's total listings count
    updateAgentStats(car.agentId)
    
    return newCar
  } catch (error) {
    console.error('Error saving car:', error)
    return null
  }
}

// Update car
export const updateCar = (carId, updates) => {
  try {
    const cars = getCars()
    const index = cars.findIndex(c => c.id === carId)
    if (index !== -1) {
      cars[index] = { ...cars[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem(StorageKeys.CARS, JSON.stringify(cars))
      return cars[index]
    }
    return null
  } catch (error) {
    console.error('Error updating car:', error)
    return null
  }
}

// Delete car
export const deleteCar = (carId, agentId) => {
  try {
    const cars = getCars()
    const filteredCars = cars.filter(c => c.id !== carId)
    localStorage.setItem(StorageKeys.CARS, JSON.stringify(filteredCars))
    
    // Update agent's total listings count
    if (agentId) {
      updateAgentStats(agentId)
    }
    
    return true
  } catch (error) {
    console.error('Error deleting car:', error)
    return false
  }
}

// ==================== BOOKING STORAGE ====================

// Get all bookings
export const getBookings = () => {
  try {
    const bookings = localStorage.getItem(StorageKeys.BOOKINGS)
    return bookings ? JSON.parse(bookings) : []
  } catch (error) {
    console.error('Error getting bookings:', error)
    return []
  }
}

// Get bookings by user ID
export const getBookingsByUser = (userId) => {
  try {
    const bookings = getBookings()
    return bookings.filter(booking => booking.userId === userId)
  } catch (error) {
    console.error('Error getting bookings by user:', error)
    return []
  }
}

// Get bookings by agent ID
export const getBookingsByAgent = (agentId) => {
  try {
    const bookings = getBookings()
    return bookings.filter(booking => booking.agentId === agentId)
  } catch (error) {
    console.error('Error getting bookings by agent:', error)
    return []
  }
}

// Save booking
export const saveBooking = (booking) => {
  try {
    const bookings = getBookings()
    const newBooking = {
      ...booking,
      id: generateId('booking'),
      createdAt: new Date().toISOString(),
      status: BookingStatus.PENDING
    }
    bookings.push(newBooking)
    localStorage.setItem(StorageKeys.BOOKINGS, JSON.stringify(bookings))
    
    // Update agent stats
    updateAgentStats(booking.agentId)
    
    return newBooking
  } catch (error) {
    console.error('Error saving booking:', error)
    return null
  }
}

// Update booking status
export const updateBookingStatus = (bookingId, status) => {
  try {
    const bookings = getBookings()
    const index = bookings.findIndex(b => b.id === bookingId)
    if (index !== -1) {
      bookings[index].status = status
      bookings[index].updatedAt = new Date().toISOString()
      localStorage.setItem(StorageKeys.BOOKINGS, JSON.stringify(bookings))
      
      // If completed, update agent earnings
      if (status === BookingStatus.COMPLETED) {
        updateAgentStats(bookings[index].agentId)
      }
      
      return bookings[index]
    }
    return null
  } catch (error) {
    console.error('Error updating booking status:', error)
    return null
  }
}

// ==================== MESSAGE STORAGE ====================

// Get all messages
export const getMessages = () => {
  try {
    const messages = localStorage.getItem(StorageKeys.MESSAGES)
    return messages ? JSON.parse(messages) : []
  } catch (error) {
    console.error('Error getting messages:', error)
    return []
  }
}

// Get messages between two users
export const getConversation = (userId1, userId2) => {
  try {
    const messages = getMessages()
    return messages.filter(msg => 
      (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
      (msg.fromUserId === userId2 && msg.toUserId === userId1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } catch (error) {
    console.error('Error getting conversation:', error)
    return []
  }
}

// Get messages for a user
export const getUserMessages = (userId) => {
  try {
    const messages = getMessages()
    return messages.filter(msg => msg.toUserId === userId || msg.fromUserId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error getting user messages:', error)
    return []
  }
}

// Save message
export const saveMessage = (message) => {
  try {
    const messages = getMessages()
    const newMessage = {
      ...message,
      id: generateId('msg'),
      createdAt: new Date().toISOString(),
      read: false
    }
    messages.push(newMessage)
    localStorage.setItem(StorageKeys.MESSAGES, JSON.stringify(messages))
    return newMessage
  } catch (error) {
    console.error('Error saving message:', error)
    return null
  }
}

// Mark message as read
export const markMessageAsRead = (messageId) => {
  try {
    const messages = getMessages()
    const index = messages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      messages[index].read = true
      localStorage.setItem(StorageKeys.MESSAGES, JSON.stringify(messages))
      return messages[index]
    }
    return null
  } catch (error) {
    console.error('Error marking message as read:', error)
    return null
  }
}

// ==================== AGENT STATS ====================

// Update agent statistics
export const updateAgentStats = (agentId) => {
  try {
    const cars = getCarsByAgent(agentId)
    const bookings = getBookingsByAgent(agentId)
    const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED)
    
    const totalListings = cars.length
    const totalBookings = bookings.length
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    
    // Calculate average rating from reviews (to be implemented)
    const averageRating = 0
    const totalReviews = 0
    
    const updates = {
      'agentStats.totalListings': totalListings,
      'agentStats.totalBookings': totalBookings,
      'agentStats.totalEarnings': totalEarnings,
      'agentStats.averageRating': averageRating,
      'agentStats.totalReviews': totalReviews
    }
    
    return updateUser(agentId, updates)
  } catch (error) {
    console.error('Error updating agent stats:', error)
    return null
  }
}

// ==================== HELPER FUNCTIONS ====================

// Clear all data (for testing)
export const clearAllData = () => {
  try {
    localStorage.removeItem(StorageKeys.USERS)
    localStorage.removeItem(StorageKeys.CARS)
    localStorage.removeItem(StorageKeys.BOOKINGS)
    localStorage.removeItem(StorageKeys.MESSAGES)
    localStorage.removeItem(StorageKeys.CURRENT_USER)
    localStorage.removeItem(StorageKeys.TOKEN)
    return true
  } catch (error) {
    console.error('Error clearing data:', error)
    return false
  }
}

// Check if user is logged in
export const isAuthenticated = () => {
  return getCurrentUser() !== null && localStorage.getItem(StorageKeys.TOKEN) !== null
}

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser()
  return user?.role || null
}

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser()
  return user?.role === UserRole.ADMIN
}

// Check if user is agent
export const isAgent = () => {
  const user = getCurrentUser()
  return user?.role === UserRole.AGENT
}

// Check if user is regular user
export const isUser = () => {
  const user = getCurrentUser()
  return user?.role === UserRole.USER
}

// Check if agent is verified
export const isAgentVerified = () => {
  const user = getCurrentUser()
  return user?.role === UserRole.AGENT && 
         user?.agentVerification?.status === VerificationStatus.APPROVED
}