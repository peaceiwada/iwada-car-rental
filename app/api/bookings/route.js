import { NextResponse } from 'next/server'

// Mock bookings storage (in production, this would be a database)
let bookings = [
  {
    id: 1,
    userId: 1,
    carId: 1,
    carName: 'Toyota Camry',
    pickupDate: '2024-01-15',
    returnDate: '2024-01-18',
    location: 'Lagos, Nigeria',
    totalPrice: 75000,
    status: 'confirmed',
    bookingDate: '2024-01-10T10:30:00Z'
  },
  {
    id: 2,
    userId: 1,
    carId: 4,
    carName: 'Lexus RX 350',
    pickupDate: '2024-02-10',
    returnDate: '2024-02-15',
    location: 'Abuja, Nigeria',
    totalPrice: 275000,
    status: 'upcoming',
    bookingDate: '2024-01-20T15:45:00Z'
  }
]

export async function GET(request) {
  try {
    // Get user ID from token (in production, this would be from auth)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    // Mock user ID extraction
    const userId = 1 // In production, decode token to get user ID
    
    const userBookings = bookings.filter(booking => booking.userId === userId)
    
    return NextResponse.json(userBookings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { carId, pickupDate, returnDate, totalPrice } = await request.json()
    
    // Validate dates
    if (!pickupDate || !returnDate) {
      return NextResponse.json(
        { error: 'Pickup and return dates are required' },
        { status: 400 }
      )
    }
    
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    
    if (pickup >= returnD) {
      return NextResponse.json(
        { error: 'Return date must be after pickup date' },
        { status: 400 }
      )
    }
    
    // Check for double booking (in production, check database)
    const existingBooking = bookings.find(booking => 
      booking.carId === carId &&
      booking.status !== 'cancelled' &&
      ((new Date(pickupDate) >= new Date(booking.pickupDate) && 
        new Date(pickupDate) < new Date(booking.returnDate)) ||
       (new Date(returnDate) > new Date(booking.pickupDate) && 
        new Date(returnDate) <= new Date(booking.returnDate)))
    )
    
    if (existingBooking) {
      return NextResponse.json(
        { error: 'Car is already booked for the selected dates' },
        { status: 409 }
      )
    }
    
    // Mock car data (in production, fetch from database)
    const cars = {
      1: { name: 'Toyota Camry', location: 'Lagos, Nigeria' },
      2: { name: 'Honda Accord', location: 'Lagos, Nigeria' },
      3: { name: 'Toyota Corolla', location: 'Abuja, Nigeria' },
      4: { name: 'Lexus RX 350', location: 'Lagos, Nigeria' },
      5: { name: 'Mercedes Benz C-Class', location: 'Lagos, Nigeria' },
      6: { name: 'Hyundai Santa Fe', location: 'Abuja, Nigeria' },
      7: { name: 'Kia Picanto', location: 'Port Harcourt, Nigeria' },
      8: { name: 'Toyota Hilux', location: 'Lagos, Nigeria' }
    }
    
    const car = cars[carId]
    
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }
    
    // Create new booking
    const newBooking = {
      id: bookings.length + 1,
      userId: 1, // In production, get from auth token
      carId,
      carName: car.name,
      pickupDate,
      returnDate,
      location: car.location,
      totalPrice,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    }
    
    bookings.push(newBooking)
    
    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}