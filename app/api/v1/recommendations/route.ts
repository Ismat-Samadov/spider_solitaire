import { NextRequest, NextResponse } from 'next/server';
import { evaluate, RecommendationRequest } from '@/lib/rule-engine';
import { loadAllRules } from '@/lib/data-loader';

export async function POST(req: NextRequest) {
  try {
    const data: RecommendationRequest = await req.json();

    if (!data.farm_type || !data.region || !data.weather) {
      return NextResponse.json(
        { detail: 'farm_type, region and weather are required' },
        { status: 422 }
      );
    }

    const rules = loadAllRules();
    const response = evaluate(data, rules);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ detail: String(error) }, { status: 500 });
  }
}
