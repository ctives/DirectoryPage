import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession()

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'pending'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Fetch pending claims with business and user info
    const { data: claims, error: claimsError, count } = await supabase
      .from('claim_requests')
      .select(
        `
        id,
        business_id,
        first_name,
        last_name,
        email,
        phone,
        status,
        created_at,
        verified_at,
        businesses:business_id (
          id,
          name,
          address,
          city,
          phone as business_phone
        )
      `,
        { count: 'exact' }
      )
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (claimsError) {
      console.error('Error fetching claims:', claimsError)
      return NextResponse.json(
        { error: 'Failed to fetch claims' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: claims || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Claims fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
