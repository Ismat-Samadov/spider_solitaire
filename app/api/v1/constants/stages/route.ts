import { NextResponse } from 'next/server';
import { getStages } from '@/lib/data-loader';

export async function GET() {
  return NextResponse.json(getStages());
}
