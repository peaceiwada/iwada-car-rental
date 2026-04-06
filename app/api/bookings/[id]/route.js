import { NextResponse } from 'next/server'

// Mock bookings storage (same as above)
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

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(id))
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check if booking can be cancelled (more than 24 hours before pickup)
    const booking = bookings[bookingIndex]
    const pickupDate = new Date(booking.pickupDate)
    const now = new Date()
    const hoursUntilPickup = (pickupDate - now) / (1000 * 60 * 60)
    
    if (hoursUntilPickup < 24) {
      return NextResponse.json(
        { error: 'Bookings can only be cancelled 24 hours before pickup' },
        { status: 400 }
      )
    }
    
    // Update booking status to cancelled
    bookings[bookingIndex] = {
      ...booking,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      booking: bookings[bookingIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { status } = await request.json()
    
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(id))
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      status,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json(bookings[bookingIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}