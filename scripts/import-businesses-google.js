/**
 * Import Cleaning Services from Google Places API
 *
 * Setup:
 * 1. Get a Google Places API key from https://console.cloud.google.com/
 * 2. npm install axios dotenv
 * 3. Add GOOGLE_PLACES_API_KEY to .env.local
 * 4. Run: node scripts/import-businesses-google.js
 *
 * Cost: ~$17 per 1,000 place searches (Nearby Search + Place Details)
 * Expected: 200-500 Nashville cleaning businesses = ~$10-20
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service key to bypass RLS

// Nashville coordinates and radius
const NASHVILLE_CENTER = { lat: 36.1627, lng: -86.7816 };
const SEARCH_RADIUS_METERS = 40000; // ~25 miles

// Search queries for different types of cleaning services
const SEARCH_QUERIES = [
  'house cleaning service',
  'commercial cleaning service',
  'janitorial service',
  'carpet cleaning service',
  'maid service',
  'office cleaning service'
];

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Rate limiting delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search for places using Google Places API
 */
async function searchPlaces(query) {
  console.log(`\n🔍 Searching for: "${query}"`);

  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const params = {
    location: `${NASHVILLE_CENTER.lat},${NASHVILLE_CENTER.lng}`,
    radius: SEARCH_RADIUS_METERS,
    keyword: query,
    key: GOOGLE_API_KEY
  };

  try {
    const response = await axios.get(url, { params });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`API Error: ${response.data.status} - ${response.data.error_message}`);
    }

    console.log(`✅ Found ${response.data.results?.length || 0} results`);
    return response.data.results || [];
  } catch (error) {
    console.error(`❌ Error searching for "${query}":`, error.message);
    return [];
  }
}

/**
 * Get detailed place information
 */
async function getPlaceDetails(placeId) {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json';
  const params = {
    place_id: placeId,
    fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,business_status,opening_hours',
    key: GOOGLE_API_KEY
  };

  try {
    const response = await axios.get(url, { params });

    if (response.data.status !== 'OK') {
      throw new Error(`API Error: ${response.data.status}`);
    }

    return response.data.result;
  } catch (error) {
    console.error(`❌ Error getting details for place ${placeId}:`, error.message);
    return null;
  }
}

/**
 * Determine service type from Google place types
 */
function determineServiceType(types, name, description) {
  const typesStr = types.join(' ').toLowerCase();
  const nameStr = (name || '').toLowerCase();
  const descStr = (description || '').toLowerCase();
  const combined = `${typesStr} ${nameStr} ${descStr}`;

  const isResidential = /house|home|maid|residential|apartment/i.test(combined);
  const isCommercial = /commercial|office|janitorial|industrial/i.test(combined);

  if (isResidential && isCommercial) return 'both';
  if (isCommercial) return 'commercial';
  if (isResidential) return 'residential';

  return 'both'; // Default to both if unclear
}

/**
 * Parse address into components
 */
function parseAddress(formattedAddress) {
  // Format: "123 Main St, Nashville, TN 37201, USA"
  const parts = formattedAddress.split(',').map(p => p.trim());

  return {
    address: parts[0] || null,
    city: parts[1] || 'Nashville',
    state: 'TN',
    zip_code: parts[2]?.match(/\d{5}/)?.[0] || null
  };
}

/**
 * Transform Google Place data to our schema
 */
function transformPlaceToBusinessData(place, details) {
  const addressParts = parseAddress(details?.formatted_address || place.vicinity);
  const serviceType = determineServiceType(
    place.types,
    place.name,
    details?.editorial_summary?.overview
  );

  return {
    // Basic info from Google
    name: place.name,
    description: details?.editorial_summary?.overview || `Professional cleaning service in ${addressParts.city}`,
    phone: details?.formatted_phone_number || null,
    website: details?.website || null,

    // Address
    address: addressParts.address,
    city: addressParts.city,
    state: addressParts.state,
    zip_code: addressParts.zip_code,

    // Service classification
    service_type: serviceType,

    // Status - mark as 'pending' for manual review/claiming
    status: 'pending',
    verified: false,
    insurance_verified: false,
    background_check_verified: false,

    // Google ratings (can be used as initial rating)
    average_rating: place.rating ? parseFloat(place.rating.toFixed(2)) : 0,
    review_count: place.user_ratings_total || 0,

    // Default subscription tier for imported businesses
    subscription_tier: 'starter',

    // Metadata for tracking source
    // Note: You might want to add a 'source' field to track this
    languages: ['English']
  };
}

/**
 * Check if business already exists (by name and address)
 */
async function businessExists(name, address) {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, address')
    .eq('name', name)
    .eq('address', address)
    .maybeSingle();

  if (error) {
    console.error('Error checking existing business:', error);
    return false;
  }

  return !!data;
}

/**
 * Insert business into database
 */
async function insertBusiness(businessData) {
  // Check if already exists
  if (await businessExists(businessData.name, businessData.address)) {
    console.log(`⏭️  Skipping duplicate: ${businessData.name}`);
    return { skipped: true };
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert(businessData)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error inserting ${businessData.name}:`, error.message);
    return { error };
  }

  console.log(`✅ Imported: ${businessData.name} (${businessData.service_type})`);
  return { data };
}

/**
 * Main import function
 */
async function importBusinesses() {
  console.log('🚀 Starting Nashville Cleaning Services Import...\n');
  console.log(`📍 Search area: Nashville, TN (${SEARCH_RADIUS_METERS}m radius)`);
  console.log(`🔑 API Key: ${GOOGLE_API_KEY ? '✅ Configured' : '❌ Missing'}\n`);

  if (!GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env.local');
    process.exit(1);
  }

  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
    process.exit(1);
  }

  const allPlaces = new Map(); // Use Map to deduplicate by place_id
  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Step 1: Search for places
  for (const query of SEARCH_QUERIES) {
    const results = await searchPlaces(query);
    results.forEach(place => allPlaces.set(place.place_id, place));
    await delay(1000); // Rate limiting: 1 second between searches
  }

  console.log(`\n📊 Total unique places found: ${allPlaces.size}`);
  console.log('\n🔄 Fetching detailed information and importing...\n');

  // Step 2: Get details and import
  let index = 0;
  for (const [placeId, place] of allPlaces) {
    index++;
    console.log(`\n[${index}/${allPlaces.size}] Processing: ${place.name}`);

    // Get detailed information
    const details = await getPlaceDetails(placeId);
    await delay(500); // Rate limiting: 0.5 seconds between detail requests

    if (!details) {
      console.log('⚠️  Skipping - could not fetch details');
      errorCount++;
      continue;
    }

    // Skip if business is closed
    if (details.business_status === 'CLOSED_PERMANENTLY') {
      console.log('⏭️  Skipping - business permanently closed');
      skippedCount++;
      continue;
    }

    // Transform and insert
    const businessData = transformPlaceToBusinessData(place, details);
    const result = await insertBusiness(businessData);

    if (result.skipped) {
      skippedCount++;
    } else if (result.error) {
      errorCount++;
    } else {
      importedCount++;
    }

    await delay(500); // Rate limiting: 0.5 seconds between inserts
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${importedCount}`);
  console.log(`⏭️  Skipped (duplicates):  ${skippedCount}`);
  console.log(`❌ Errors:               ${errorCount}`);
  console.log(`📊 Total processed:      ${allPlaces.size}`);
  console.log('='.repeat(60));
  console.log('\n✨ Import complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review imported businesses in Supabase dashboard');
  console.log('   2. Update status from "pending" to "active" for verified businesses');
  console.log('   3. Reach out to businesses to claim their listings');
  console.log('   4. Add service areas and services for each business');
}

// Run the import
importBusinesses().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
