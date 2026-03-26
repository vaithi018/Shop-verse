import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Check if user already exists in Supabase
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Insert new user record
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          name, 
          email, 
          password, // Note: In a real app, hash this!
          role: 'user' 
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Signup error:', insertError);
      return NextResponse.json({ error: 'Signup failed. Check your Supabase tables.' }, { status: 500 });
    }

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
