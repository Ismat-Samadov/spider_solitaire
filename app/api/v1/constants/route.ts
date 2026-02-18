import { NextResponse } from 'next/server';
import { loadConstants } from '@/lib/data-loader';

export async function GET() {
  return NextResponse.json(loadConstants());
}
