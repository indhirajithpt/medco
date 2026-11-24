import { NextResponse } from 'next/server';

const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/health`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ status: 'unhealthy' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { status: 'unhealthy', error: error.message || 'Cannot reach FastAPI backend' },
      { status: 503 }
    );
  }
}
