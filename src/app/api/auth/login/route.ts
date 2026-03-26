import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Query the 'users' table in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
