import { createServiceRoleClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, name, userType } = body

    if (!userId || !email || !name || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use server-side Supabase client with service role key
    // This bypasses RLS policies
    const supabase = createServiceRoleClient()

    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          name,
          role: userType,
          verified: false,
          created_at: new Date().toISOString(),
        },
      ])

    if (dbError) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { error: dbError.message || 'Failed to create user record' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
