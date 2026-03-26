require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedProducts() {
  console.log('Reading products.json...');
  const productsPath = path.join(__dirname, '../src/data/products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  // Prepare products for insertion (removing the numeric ID to let Supabase generate it or keep it if SERIAL)
  // Our SQL used SERIAL PRIMARY KEY for products, so it will handle auto-incrementing if we don't provide ID
  // but if we want to keep the same IDs, we can provide them.
  const productsToInsert = productsData.map(({ id, ...rest }) => ({
    ...rest,
  }));

  console.log(`Inserting ${productsToInsert.length} products into Supabase...`);
  
  const { data, error } = await supabase
    .from('products')
    .insert(productsToInsert);

  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log('Successfully seeded products!');
  }
}

seedProducts();
