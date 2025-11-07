#!/bin/bash

# Seed the database with 50 random businesses
# Usage: ./seed.sh

echo "🌱 Seeding database with 50 random businesses..."
npm run seed

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database seeding completed successfully!"
  echo "You can now search for businesses on the homepage."
else
  echo ""
  echo "❌ Database seeding failed. Check the error message above."
  exit 1
fi
