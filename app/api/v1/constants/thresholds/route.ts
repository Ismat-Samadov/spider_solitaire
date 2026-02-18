import { NextResponse } from 'next/server';
import { getThresholds } from '@/lib/data-loader';

export async function GET() {
  return NextResponse.json(getThresholds());
}
