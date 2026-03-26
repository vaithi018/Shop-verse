import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const sort = searchParams.get('sort') || '';

  // Initialize query from the 'products' table in Supabase
  let query = supabase.from('products').select('*');

  // Filter by category
  if (category) {
    query = query.eq('category', category);
  }

  // Filter by price range
  query = query.gte('price', minPrice).lte('price', maxPrice);

  // Filter by search term
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // Handle sorting
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else if (sort === 'rating') {
    query = query.order('rating', { ascending: false });
  } else if (sort === 'name') {
    query = query.order('name', { ascending: true });
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products from Supabase table.' }, { status: 500 });
  }

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Insert new record into Supabase
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert([
        {
          name: body.name,
          price: parseFloat(body.price),
          description: body.description,
          image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
          category: body.category,
          rating: parseFloat(body.rating) || 4.0,
          stock: parseInt(body.stock) || 10,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Product insertion error:', error);
      return NextResponse.json({ error: 'Insertion failed.' }, { status: 500 });
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update record in Supabase
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        description: body.description,
        image: body.image,
        category: body.category,
        rating: body.rating !== undefined ? parseFloat(body.rating) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Update failed or product not found.' }, { status: 500 });
    }

    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0');
  
  // Delete record in Supabase
  const { data: deletedProduct, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Deletion failed or product not found.' }, { status: 500 });
  }

  return NextResponse.json(deletedProduct);
}
