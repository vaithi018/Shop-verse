import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Fetch orders from Supabase table
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, items, total } = body;

    // Insert new order into Supabase
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([
        {
          user_email: userEmail,
          items: items, // JSONB field in Supabase
          total: parseFloat(total),
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
