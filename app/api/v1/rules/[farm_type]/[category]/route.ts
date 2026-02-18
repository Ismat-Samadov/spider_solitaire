import { NextRequest, NextResponse } from 'next/server';
import { getRulesForFarmType } from '@/lib/data-loader';

export async function GET(
  _req: NextRequest,
  { params }: { params: { farm_type: string; category: string } }
) {
  const { farm_type, category } = params;
  const farmRules = getRulesForFarmType(farm_type);

  if (!farmRules || !farmRules[category]) {
    return NextResponse.json(
      { detail: `No rules found for ${farm_type}/${category}` },
      { status: 404 }
    );
  }

  return NextResponse.json(farmRules[category]);
}
