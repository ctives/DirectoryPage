import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password
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

    // Hash the provided token to compare with stored hash
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find user with this token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('password_reset_token', tokenHash)
      .gt('password_reset_token_expires_at', new Date().toISOString())
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Update password in Supabase Auth
    const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
      password,
    })

    if (authError) {
      console.error('Error updating password:', authError)
      throw new Error('Failed to update password')
    }

    // Clear reset token from database
    const { error: clearError } = await supabase
      .from('users')
      .update({
        password_reset_token: null,
        password_reset_token_expires_at: null,
        password_reset_requested_at: null,
      })
      .eq('id', user.id)

    if (clearError) {
      console.error('Error clearing reset token:', clearError)
      // Don't fail, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
