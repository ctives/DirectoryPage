import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { sendClaimRejectedEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const session = await getServerSession()

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const { reason } = await request.json()

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get claim request
    const { data: claimRequest, error: claimError } = await supabase
      .from('claim_requests')
      .select('id, email, first_name, last_name, status')
      .eq('id', id)
      .single()

    if (claimError || !claimRequest) {
      return NextResponse.json(
        { error: 'Claim request not found' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (claimRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Claim has already been ${claimRequest.status}` },
        { status: 400 }
      )
    }

    // Get user ID from session
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    // Update claim request
    const { error: updateError } = await supabase
      .from('claim_requests')
      .update({
        status: 'rejected',
        admin_notes: reason || null,
        approved_at: new Date().toISOString(),
        approved_by: adminUser?.id,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error rejecting claim:', updateError)
      return NextResponse.json(
        { error: 'Failed to reject claim' },
        { status: 500 }
      )
    }

    // Send rejection email
    try {
      await sendClaimRejectedEmail({
        email: claimRequest.email,
        businessName: claimRequest.first_name,
        reason: reason,
      })
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError)
      // Don't fail the request
    }

    return NextResponse.json({
      success: true,
      message: 'Claim rejected successfully',
    })
  } catch (error) {
    console.error('Claim rejection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
