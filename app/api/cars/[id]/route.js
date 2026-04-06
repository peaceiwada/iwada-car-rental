import { NextResponse } from 'next/server'

// Mock car data (same as in cars/route.js)
const cars = [
  {
    id: 1,
    name: 'Toyota Camry',
    type: 'Sedan',
    pricePerDay: 25000,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Lagos, Nigeria',
    image: '/images/cars/camry.jpg',
    featured: true,
    rating: 4.8,
    description: 'Comfortable and fuel-efficient sedan perfect for business and leisure travel.',
    year: 2023
  },
  {
    id: 2,
    name: 'Honda Accord',
    type: 'Sedan',
    pricePerDay: 27000,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Lagos, Nigeria',
    image: '/images/cars/accord.jpg',
    featured: true,
    rating: 4.7,
    description: 'Elegant and spacious sedan with premium features.',
    year: 2023
  },
  {
    id: 3,
    name: 'Toyota Corolla',
    type: 'Economy',
    pricePerDay: 18000,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Abuja, Nigeria',
    image: '/images/cars/corolla.jpg',
    featured: true,
    rating: 4.5,
    description: 'Reliable and economical car perfect for city driving.',
    year: 2022
  },
  {
    id: 4,
    name: 'Lexus RX 350',
    type: 'SUV',
    pricePerDay: 55000,
    seats: 7,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Lagos, Nigeria',
    image: '/images/cars/lexus.jpg',
    featured: true,
    rating: 4.9,
    description: 'Luxury SUV with premium comfort and advanced safety features.',
    year: 2023
  },
  {
    id: 5,
    name: 'Mercedes Benz C-Class',
    type: 'Luxury',
    pricePerDay: 75000,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Lagos, Nigeria',
    image: '/images/cars/mercedes.jpg',
    featured: false,
    rating: 5.0,
    description: 'Ultimate luxury sedan with exceptional performance and style.',
    year: 2024
  },
  {
    id: 6,
    name: 'Hyundai Santa Fe',
    type: 'SUV',
    pricePerDay: 35000,
    seats: 7,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Abuja, Nigeria',
    image: '/images/cars/santafe.jpg',
    featured: false,
    rating: 4.6,
    description: 'Spacious SUV perfect for family trips and long journeys.',
    year: 2023
  },
  {
    id: 7,
    name: 'Kia Picanto',
    type: 'Economy',
    pricePerDay: 12000,
    seats: 4,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Port Harcourt, Nigeria',
    image: '/images/cars/picanto.jpg',
    featured: false,
    rating: 4.3,
    description: 'Compact and fuel-efficient car ideal for city commuting.',
    year: 2022
  },
  {
    id: 8,
    name: 'Toyota Hilux',
    type: 'SUV',
    pricePerDay: 40000,
    seats: 5,
    fuelType: 'Diesel',
    transmission: 'Manual',
    location: 'Lagos, Nigeria',
    image: '/images/cars/hilux.jpg',
    featured: false,
    rating: 4.7,
    description: 'Durable pickup truck perfect for rough terrain and heavy loads.',
    year: 2023
  }
]

export async function GET(request, { params }) {
  const { id } = params
  const car = cars.find(c => c.id === parseInt(id))
  
  if (!car) {
    return NextResponse.json(
      { error: 'Car not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(car)
}