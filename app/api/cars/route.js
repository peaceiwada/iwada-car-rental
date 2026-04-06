import { NextResponse } from 'next/server';

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
    featured: true,
    rating: 4.8,
    available: true,
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
    featured: true,
    rating: 4.7,
    available: true,
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
    featured: true,
    rating: 4.5,
    available: false,
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
    featured: true,
    rating: 4.9,
    available: true,
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
    featured: false,
    rating: 5.0,
    available: false,
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
    featured: false,
    rating: 4.6,
    available: true,
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
    featured: false,
    rating: 4.3,
    available: true,
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
    featured: false,
    rating: 4.7,
    available: true,
    description: 'Durable pickup truck perfect for rough terrain and heavy loads.',
    year: 2023
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  
  let filteredCars = [...cars];
  
  if (featured === 'true') {
    filteredCars = filteredCars.filter(car => car.featured === true);
  }
  
  return NextResponse.json(filteredCars);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newCar = {
      id: cars.length + 1,
      ...body,
      featured: false,
      rating: 0,
      available: true
    };
    cars.push(newCar);
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    );
  }
}