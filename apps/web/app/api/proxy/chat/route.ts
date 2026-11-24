import { NextRequest, NextResponse } from 'next/server';

const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return NextResponse.json({ detail: 'Message cannot be empty' }, { status: 400 });
    }

    if (body.message.length > 4000) {
      return NextResponse.json({ detail: 'Message exceeds 4,000 characters' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_INTERNAL_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: body.message }),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { detail: error.message || 'MedCo API connection failed' },
      { status: 503 }
    );
  }
}
