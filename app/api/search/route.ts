import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface Business {
  id: string
  name: string
  description: string | null
  rating: number
  review_count: number
  service_type: string
  zip_code: string | null
  address: string | null
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || ''
    const serviceType = searchParams.get('serviceType') || 'both'
    const neighborhood = searchParams.get('neighborhood') || ''
    const zipCode = searchParams.get('zipCode') || ''

    const supabase = await createClient()

    // Build the query
    let sqlQuery = supabase
      .from('businesses')
      .select('id, name, description, average_rating as rating, review_count, service_type, zip_code, address')
      .eq('status', 'active')

    // Filter by service type
    if (serviceType && serviceType !== 'both') {
      sqlQuery = sqlQuery.or(`service_type.eq.${serviceType},service_type.eq.both`)
    }

    // Filter by zip code if provided
    if (zipCode) {
      sqlQuery = sqlQuery.eq('zip_code', zipCode)
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

    // Filter by search query (name or description)
    if (query) {
      sqlQuery = sqlQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
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
