import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (username === 'shrisant' && password === 'shrisantp') {
      return NextResponse.json({ token: 'mocked_token' });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error processing login request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}