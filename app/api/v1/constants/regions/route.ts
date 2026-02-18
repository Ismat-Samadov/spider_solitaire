import { NextResponse } from 'next/server';
import { getRegions } from '@/lib/data-loader';

export async function GET() {
  return NextResponse.json(getRegions());
}
