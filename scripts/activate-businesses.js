/**
 * Bulk Activate Businesses
 *
 * After manually verifying businesses (calling them, checking websites),
 * use this script to activate multiple businesses at once.
 *
 * Usage:
 * node scripts/activate-businesses.js <business-ids-file.txt>
 *
 * Or activate ALL pending businesses (careful!):
 * node scripts/activate-businesses.js --all
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Activate a single business
 */
async function activateBusiness(businessId) {
  const { data, error } = await supabase
    .from('businesses')
    .update({
      status: 'active',
      verified: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', businessId)
    .select('id, name, status')
    .single();

  if (error) {
    console.error(`❌ Error activating business ${businessId}:`, error.message);
    return { success: false, error };
  }

  console.log(`✅ Activated: ${data.name}`);
  return { success: true, data };
}

/**
 * Activate multiple businesses by ID
 */
async function activateByIds(businessIds) {
  console.log(`🚀 Activating ${businessIds.length} businesses...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const id of businessIds) {
    const result = await activateBusiness(id.trim());
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  return { successCount, errorCount };
}

/**
 * Activate all pending businesses (use with caution!)
 */
async function activateAllPending() {
  console.log('⚠️  Activating ALL pending businesses...\n');

  // Get all pending businesses
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('status', 'pending');

  if (error) {
    console.error('❌ Error fetching pending businesses:', error);
    return { successCount: 0, errorCount: 1 };
  }

  console.log(`📊 Found ${businesses.length} pending businesses\n`);

  // Confirm
  if (businesses.length > 10) {
    console.log('⚠️  WARNING: This will activate', businesses.length, 'businesses!');
    console.log('⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  let successCount = 0;
  let errorCount = 0;

  for (const business of businesses) {
    const result = await activateBusiness(business.id);
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  return { successCount, errorCount };
}

/**
 * Interactive mode - show pending businesses and select which to activate
 */
async function interactiveMode() {
  console.log('🔍 Fetching pending businesses...\n');

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, phone, address, service_type')
    .eq('status', 'pending')
    .order('name');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (businesses.length === 0) {
    console.log('✅ No pending businesses found!');
    return;
  }

  console.log(`📋 PENDING BUSINESSES (${businesses.length})\n`);
  console.log('Copy the IDs of businesses you want to activate:\n');

  businesses.forEach((b, index) => {
    console.log(`${index + 1}. ${b.name}`);
    console.log(`   ID: ${b.id}`);
    console.log(`   Type: ${b.service_type} | Phone: ${b.phone || 'N/A'}`);
    console.log(`   Address: ${b.address || 'N/A'}`);
    console.log('');
  });

  console.log('\n💡 To activate businesses:');
  console.log('   1. Create a text file with one ID per line');
  console.log('   2. Run: node scripts/activate-businesses.js business-ids.txt');
  console.log('\n   Or run: node scripts/activate-businesses.js --all (to activate all)');
}

/**
 * Main function
 */
async function main() {
  const arg = process.argv[2];

  if (!arg) {
    // No argument - show interactive list
    await interactiveMode();
    return;
  }

  if (arg === '--all') {
    // Activate all pending
    const { successCount, errorCount } = await activateAllPending();
    printSummary(successCount, errorCount);
    return;
  }

  // Assume it's a file path
  if (!fs.existsSync(arg)) {
    console.error(`❌ File not found: ${arg}`);
    console.log('\nUsage:');
    console.log('  node scripts/activate-businesses.js                    # Show pending businesses');
    console.log('  node scripts/activate-businesses.js business-ids.txt   # Activate from file');
    console.log('  node scripts/activate-businesses.js --all              # Activate all pending');
    process.exit(1);
  }

  // Read business IDs from file
  const fileContent = fs.readFileSync(arg, 'utf-8');
  const businessIds = fileContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#')); // Filter empty lines and comments

  if (businessIds.length === 0) {
    console.error('❌ No business IDs found in file');
    process.exit(1);
  }

  const { successCount, errorCount } = await activateByIds(businessIds);
  printSummary(successCount, errorCount);
}

/**
 * Print summary
 */
function printSummary(successCount, errorCount) {
  console.log('\n' + '='.repeat(60));
  console.log('📈 ACTIVATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully activated: ${successCount}`);
  console.log(`❌ Errors:                ${errorCount}`);
  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
