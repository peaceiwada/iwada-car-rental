// User Roles
export const UserRole = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin'
}

// Agent Verification Status
export const VerificationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NOT_SUBMITTED: 'not_submitted'
}

// Nigerian ID Types
export const NigerianIDTypes = {
  NIN: {
    id: 'nin',
    label: 'National Identification Number (NIN)',
    placeholder: 'Enter 11-digit NIN',
    pattern: '^[0-9]{11}$',
    example: '12345678901'
  },
  DRIVERS_LICENSE: {
    id: 'drivers_license',
    label: "Driver's License",
    placeholder: 'Enter Driver\'s License Number',
    pattern: '^[A-Za-z0-9-]{8,20}$',
    example: 'LAG-1234-ABCD'
  },
  VOTERS_CARD: {
    id: 'voters_card',
    label: "Permanent Voter's Card",
    placeholder: 'Enter 19-digit VIN',
    pattern: '^[0-9]{19}$',
    example: '1234567890123456789'
  },
  PASSPORT: {
    id: 'passport',
    label: 'International Passport',
    placeholder: 'Enter Passport Number',
    pattern: '^[A-Za-z0-9]{6,9}$',
    example: 'A12345678'
  }
}

// Booking Status
export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
}

// Payment Status
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

// Car Transmission Types
export const TransmissionTypes = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
}

// Car Fuel Types
export const FuelTypes = {
  PETROL: 'petrol',
  DIESEL: 'diesel',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid'
}

// Car Types
export const CarTypes = {
  SEDAN: 'Sedan',
  SUV: 'SUV',
  ECONOMY: 'Economy',
  LUXURY: 'Luxury',
  VAN: 'Van',
  SPORTS: 'Sports',
  TRUCK: 'Truck'
}

// Nigerian States
export const NigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT Abuja'
]

// LocalStorage Keys
export const StorageKeys = {
  USERS: 'iwada_users',
  CURRENT_USER: 'iwada_user',
  TOKEN: 'iwada_token',
  CARS: 'iwada_cars',
  BOOKINGS: 'iwada_bookings',
  MESSAGES: 'iwada_messages',
  CONVERSATIONS: 'iwada_conversations'
}

// Route Paths
export const Routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // User Routes
  USER_DASHBOARD: '/user/dashboard',
  USER_BOOKINGS: '/user/bookings',
  USER_FAVORITES: '/user/favorites',
  USER_PROFILE: '/user/profile',
  
  // Agent Routes
  AGENT_DASHBOARD: '/agent/dashboard',
  AGENT_VERIFICATION: '/agent/verification',
  AGENT_CARS: '/agent/cars',
  AGENT_ADD_CAR: '/agent/cars/add',
  AGENT_EDIT_CAR: '/agent/cars/edit',
  AGENT_MY_CARS: '/agent/cars/my-cars',
  AGENT_BOOKINGS: '/agent/bookings',
  AGENT_MESSAGES: '/agent/messages',
  AGENT_EARNINGS: '/agent/earnings',
  AGENT_REVIEWS: '/agent/reviews',
  AGENT_SETTINGS: '/agent/settings',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PENDING_AGENTS: '/admin/agents/pending',
  ADMIN_APPROVED_AGENTS: '/admin/agents/approved',
  ADMIN_ALL_AGENTS: '/admin/agents/all',
  ADMIN_CARS: '/admin/cars',
  ADMIN_BOOKINGS: '/admin/bookings'
}

// Status Badge Colors
export const StatusColors = {
  [VerificationStatus.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '🕒'
  },
  [VerificationStatus.APPROVED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '✅'
  },
  [VerificationStatus.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '❌'
  },
  [BookingStatus.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  [BookingStatus.CONFIRMED]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  [BookingStatus.COMPLETED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  [BookingStatus.CANCELLED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  }
}

// Helper function to get status color
export const getStatusColor = (status) => {
  return StatusColors[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  }
}

// Nigerian Currency Formatter
export const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Date Formatter
export const formatDate = (dateString, format = 'full') => {
  const date = new Date(dateString)
  if (format === 'full') {
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  if (format === 'short') {
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  return date.toLocaleDateString('en-NG')
}

// Generate Unique ID
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Validate Email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validate Phone (Nigerian)
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+234|0)[789][01]\d{8}$/.test(cleaned)
}

// Validate NIN
export const isValidNIN = (nin) => {
  return /^[0-9]{11}$/.test(nin)
}

// Mock Data Flag (set to false when backend is ready)
export const USE_MOCK_DATA = true