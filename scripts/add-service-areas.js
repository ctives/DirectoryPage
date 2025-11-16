/**
 * Add Service Areas to Imported Businesses
 *
 * After importing businesses, they need service areas (neighborhoods/zip codes)
 * This script automatically adds Nashville-area service areas based on business location
 *
 * Run: node scripts/add-service-areas.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Nashville neighborhoods and their approximate zip codes
const NASHVILLE_AREAS = [
  // Urban core
  { name: 'Downtown Nashville', type: 'neighborhood', zip_codes: ['37201', '37203', '37219'] },
  { name: 'The Gulch', type: 'neighborhood', zip_codes: ['37203'] },
  { name: 'Midtown', type: 'neighborhood', zip_codes: ['37203', '37212'] },
  { name: 'Music Row', type: 'neighborhood', zip_codes: ['37203'] },

  // East Nashville
  { name: 'East Nashville', type: 'neighborhood', zip_codes: ['37206', '37216'] },
  { name: 'Inglewood', type: 'neighborhood', zip_codes: ['37216'] },
  { name: 'Lockeland Springs', type: 'neighborhood', zip_codes: ['37206'] },

  // South Nashville
  { name: 'Berry Hill', type: 'neighborhood', zip_codes: ['37204'] },
  { name: 'Melrose', type: 'neighborhood', zip_codes: ['37204'] },
  { name: '12 South', type: 'neighborhood', zip_codes: ['37204'] },

  // West Nashville
  { name: 'The Nations', type: 'neighborhood', zip_codes: ['37209'] },
  { name: 'Sylvan Park', type: 'neighborhood', zip_codes: ['37209'] },
  { name: 'West End', type: 'neighborhood', zip_codes: ['37205', '37212'] },

  // Green Hills area
  { name: 'Green Hills', type: 'neighborhood', zip_codes: ['37215'] },
  { name: 'Forest Hills', type: 'neighborhood', zip_codes: ['37215'] },

  // Suburbs
  { name: 'Belle Meade', type: 'neighborhood', zip_codes: ['37205'] },
  { name: 'Donelson', type: 'neighborhood', zip_codes: ['37214'] },
  { name: 'Hermitage', type: 'neighborhood', zip_codes: ['37076'] },
  { name: 'Madison', type: 'neighborhood', zip_codes: ['37115'] },
  { name: 'Antioch', type: 'neighborhood', zip_codes: ['37013'] },

  // Popular surrounding cities
  { name: 'Brentwood', type: 'neighborhood', zip_codes: ['37027'] },
  { name: 'Franklin', type: 'neighborhood', zip_codes: ['37064', '37067'] },
  { name: 'Murfreesboro', type: 'neighborhood', zip_codes: ['37128', '37129', '37130'] },
  { name: 'Hendersonville', type: 'neighborhood', zip_codes: ['37075'] },
  { name: 'Mount Juliet', type: 'neighborhood', zip_codes: ['37122'] },
];

/**
 * Add service areas for a business
 * Strategy: Add 5-10 areas based on business location
 */
async function addServiceAreasForBusiness(business) {
  console.log(`\n📍 Adding service areas for: ${business.name}`);

  const businessZip = business.zip_code;
  const serviceAreas = [];

  // Strategy 1: Add their own zip code
  if (businessZip) {
    const matchingArea = NASHVILLE_AREAS.find(area =>
      area.zip_codes.includes(businessZip)
    );

    if (matchingArea) {
      serviceAreas.push({
        business_id: business.id,
        area_type: matchingArea.type,
        area_name: matchingArea.name,
        zip_code: businessZip
      });
    }
  }

  // Strategy 2: Add nearby/related areas
  // For starter tier, add 5-10 areas (simulating local service area)
  const areasToAdd = business.service_type === 'commercial'
    ? NASHVILLE_AREAS.filter(area => ['Downtown Nashville', 'Midtown', 'The Gulch', 'Music Row', 'Green Hills', 'Brentwood'].includes(area.name))
    : NASHVILLE_AREAS.slice(0, 10); // Residential gets broader coverage

  for (const area of areasToAdd) {
    // Add primary zip code for each area
    const primaryZip = area.zip_codes[0];
    serviceAreas.push({
      business_id: business.id,
      area_type: area.type,
      area_name: area.name,
      zip_code: primaryZip
    });
  }

  // Remove duplicates
  const uniqueAreas = Array.from(
    new Map(serviceAreas.map(area => [`${area.area_name}-${area.zip_code}`, area])).values()
  );

  console.log(`   Adding ${uniqueAreas.length} service areas...`);

  // Insert service areas
  const { error } = await supabase
    .from('service_areas')
    .insert(uniqueAreas);

  if (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }

  console.log(`   ✅ Added ${uniqueAreas.length} service areas`);
  return true;
}

/**
 * Main function
 */
async function addServiceAreas() {
  console.log('🚀 Adding Service Areas to Businesses...\n');

  // Get all businesses without service areas
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select(`
      id,
      name,
      zip_code,
      service_type,
      service_areas (id)
    `);

  if (error) {
    console.error('❌ Error fetching businesses:', error);
    process.exit(1);
  }

  // Filter businesses that don't have service areas
  const businessesWithoutAreas = businesses.filter(
    b => !b.service_areas || b.service_areas.length === 0
  );

  console.log(`📊 Found ${businessesWithoutAreas.length} businesses without service areas\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const business of businessesWithoutAreas) {
    const success = await addServiceAreasForBusiness(business);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 SERVICE AREAS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully processed: ${successCount}`);
  console.log(`❌ Errors:                ${errorCount}`);
  console.log('='.repeat(60));
}

addServiceAreas().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
