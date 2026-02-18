import { NextRequest, NextResponse } from 'next/server';
import { getRulesForFarmType } from '@/lib/data-loader';

export async function GET(
  _req: NextRequest,
  { params }: { params: { farm_type: string } }
) {
  const { farm_type } = params;
  const farmRules = getRulesForFarmType(farm_type);

  if (!farmRules || Object.keys(farmRules).length === 0) {
    return NextResponse.json(
      { detail: `No rules found for ${farm_type}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    farm_type,
    categories: Object.keys(farmRules),
    rules: farmRules,
  });
}
