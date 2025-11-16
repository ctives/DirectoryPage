/**
 * Import Cleaning Services from CSV file
 *
 * Setup:
 * 1. Create a CSV file with business data (see template below)
 * 2. npm install csv-parser dotenv
 * 3. Run: node scripts/import-businesses-csv.js path/to/businesses.csv
 *
 * CSV Format (businesses.csv):
 * name,phone,website,address,city,zip_code,service_type,description
 * "ABC Cleaning","615-555-0100","https://abccleaning.com","123 Main St","Nashville","37201","both","Professional cleaning services"
 * "XYZ Janitorial","615-555-0200","","456 Oak Ave","Nashville","37203","commercial","Commercial office cleaning"
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Get CSV file path from command line
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Usage: node import-businesses-csv.js <path-to-csv-file>');
  process.exit(1);
}

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ File not found: ${csvFilePath}`);
  process.exit(1);
}

/**
 * Validate and normalize business data
 */
function normalizeBusinessData(row) {
  return {
    name: row.name?.trim() || null,
    description: row.description?.trim() || null,
    phone: row.phone?.trim() || null,
    email: row.email?.trim() || null,
    website: row.website?.trim() || null,
    address: row.address?.trim() || null,
    city: row.city?.trim() || 'Nashville',
    state: row.state?.trim() || 'TN',
    zip_code: row.zip_code?.trim() || null,
    service_type: ['residential', 'commercial', 'both'].includes(row.service_type)
      ? row.service_type
      : 'both',
    years_in_business: row.years_in_business ? parseInt(row.years_in_business) : null,
    status: 'pending',
    verified: false,
    insurance_verified: false,
    background_check_verified: false,
    subscription_tier: 'starter',
    languages: row.languages ? row.languages.split('|') : ['English']
  };
}

/**
 * Validate required fields
 */
function validateBusinessData(data) {
  const errors = [];

  if (!data.name) errors.push('name is required');
  if (!data.city) errors.push('city is required');

  return errors;
}

/**
 * Check if business already exists
 */
async function businessExists(name, address) {
  const { data, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('name', name)
    .eq('address', address || '')
    .maybeSingle();

  return !!data;
}

/**
 * Import businesses from CSV
 */
async function importFromCSV() {
  console.log('🚀 Starting CSV Import...\n');
  console.log(`📁 File: ${csvFilePath}\n`);

  const businesses = [];
  let lineNumber = 0;

  // Read and parse CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        lineNumber++;
        const normalized = normalizeBusinessData(row);
        const errors = validateBusinessData(normalized);

        if (errors.length > 0) {
          console.warn(`⚠️  Line ${lineNumber}: Validation errors - ${errors.join(', ')}`);
        } else {
          businesses.push({ lineNumber, data: normalized });
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📊 Parsed ${businesses.length} valid businesses from CSV\n`);

  // Import to database
  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const { lineNumber, data } of businesses) {
    console.log(`[${lineNumber}] Processing: ${data.name}`);

    // Check for duplicates
    if (await businessExists(data.name, data.address)) {
      console.log(`⏭️  Skipping duplicate: ${data.name}`);
      skippedCount++;
      continue;
    }

    // Insert
    const { error } = await supabase
      .from('businesses')
      .insert(data);

    if (error) {
      console.error(`❌ Error importing ${data.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Imported: ${data.name} (${data.service_type})`);
      importedCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${importedCount}`);
  console.log(`⏭️  Skipped (duplicates):  ${skippedCount}`);
  console.log(`❌ Errors:               ${errorCount}`);
  console.log(`📊 Total processed:      ${businesses.length}`);
  console.log('='.repeat(60));
}

// Run import
importFromCSV().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
