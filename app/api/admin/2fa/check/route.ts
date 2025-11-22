import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user has 2FA enabled
    const { data: user } = await supabase
      .from('users')
      .select('two_fa_enabled, role')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Only admins need 2FA
    const requiresTwoFA = user.role === 'admin' && user.two_fa_enabled

    return NextResponse.json({
      requiresTwoFA,
      message: requiresTwoFA
        ? 'Please verify with your authenticator app'
        : 'No 2FA required',
    })
  } catch (error) {
    console.error('2FA check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
