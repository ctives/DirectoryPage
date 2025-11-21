-- Clear existing photos and reseed with updated URLs
-- Run this in Supabase SQL Editor before running the seed script

DELETE FROM business_photos;

-- Then run the seed script again:
-- npx ts-node scripts/seed-business-photos.ts
