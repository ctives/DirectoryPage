import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

/**
 * Admin Setup Endpoint - Creates initial admin account
 *
 * Note: When using curl, be careful with special characters in passwords.
 * The exclamation mark (!) needs special escaping in bash double-quoted strings.
 * Use single quotes for the JSON data to avoid shell escaping issues:
 * curl -X POST http://localhost:3000/api/admin/setup \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"user@example.com","password":"Password123#","setupToken":"your-token"}'
 */
export async function POST(request: NextRequest) {
  try {
    // Read the raw text body and parse it
    const text = await request.text()
    let body
    try {
      body = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw body:', text)
      console.error('Body length:', text.length)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { email, password, setupToken } = body

    // Verify setup token for security
    if (setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid setup token' },
        { status: 401 }
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Password validation (at least 8 chars, 1 uppercase, 1 number, 1 special char)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters with uppercase, number, and special character',
        },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
      },
    })

    if (authError || !authData.user) {
      console.error('Auth user creation error:', authError)
      return NextResponse.json(
        {
          error:
            authError?.message || 'Failed to create auth user (may already exist)',
        },
        { status: 500 }
      )
    }

    // Create user profile in database
    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name: 'Admin User',
      role: 'admin',
      verified: true,
    })

    if (userError) {
      console.error('User profile creation error:', userError)
      // If profile already exists, that's okay
      if (!userError.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      userId: authData.user.id,
    })
  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
