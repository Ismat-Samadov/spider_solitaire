import { NextRequest, NextResponse } from 'next/server';
import { searchRules } from '@/lib/data-loader';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');

  if (!q) {
    return NextResponse.json({ detail: 'Query parameter q is required' }, { status: 422 });
  }

  const results = searchRules(q);
  return NextResponse.json({ query: q, count: results.length, results });
}
