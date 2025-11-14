import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || ''
    const serviceType = searchParams.get('serviceType') || 'both'
    const neighborhood = searchParams.get('neighborhood') || ''
    const zipCode = searchParams.get('zipCode') || ''

    // Use public anon key for read-only access to public data
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Build the query
    let sqlQuery = supabase
      .from('businesses')
      .select('id, name, description, average_rating, review_count, service_type, zip_code, address')
      .eq('status', 'active')

    // Filter by service type
    if (serviceType && serviceType !== 'both') {
      sqlQuery = sqlQuery.or(`service_type.eq.${serviceType},service_type.eq.both`)
    }

    // Filter by zip code if provided
    if (zipCode) {
      sqlQuery = sqlQuery.eq('zip_code', zipCode)
    }

    // Filter by search query (name, description, or zip code)
    if (query) {
      // Check if query looks like a zip code (all digits)
      if (/^\d+$/.test(query)) {
        // Search by name, description, OR zip code
        sqlQuery = sqlQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,zip_code.eq.${query}`)
      } else {
        // Regular text search on name and description
        sqlQuery = sqlQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      }
    }

    // Filter by neighborhood (using service_areas table join)
    if (neighborhood) {
      // We'll need to search in service_areas table for the neighborhood
      const { data: serviceAreas } = await supabase
        .from('service_areas')
        .select('business_id')
        .ilike('area_name', `%${neighborhood}%`)

      if (serviceAreas && serviceAreas.length > 0) {
        const businessIds = serviceAreas.map((sa: any) => sa.business_id)
        sqlQuery = sqlQuery.in('id', businessIds)
      } else {
        // No businesses found for this neighborhood
        return NextResponse.json({ data: [], count: 0 })
      }
    }

    const { data, error, count } = await sqlQuery

    if (error) {
      console.error('Search API error:', error)
      return NextResponse.json(
        { error: 'Failed to search businesses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
    })
  } catch (error) {
    console.error('Search API exception:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
