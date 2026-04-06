import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Mock user validation - In production, this would check against a database
    if (email === 'user@example.com' && password === 'password123') {
      const user = {
        id: 1,
        name: 'Demo User',
        email: 'user@example.com',
        phone: '+234 123 456 7890',
        createdAt: new Date().toISOString()
      }
      
      const token = 'mock-jwt-token-' + Date.now()
      
      return NextResponse.json({
        success: true,
        user,
        token
      })
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}