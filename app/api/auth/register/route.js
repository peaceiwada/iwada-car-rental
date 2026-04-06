import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, email, phone, password, role, businessName, businessAddress } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Validate agent-specific fields
    if (role === 'agent') {
      if (!businessName || !businessAddress) {
        return NextResponse.json(
          { success: false, message: 'Business name and address are required for agents' },
          { status: 400 }
        )
      }
    }

    // Mock user creation - In production, this would save to a database
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      role: role || 'booker',
      ...(role === 'agent' && { businessName, businessAddress, agentStatus: 'pending' }),
      createdAt: new Date().toISOString()
    }
    
    const token = 'mock-jwt-token-' + Date.now()
    
    return NextResponse.json({
      success: true,
      user: newUser,
      token
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    )
  }
}