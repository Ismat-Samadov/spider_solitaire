import { NextRequest, NextResponse } from 'next/server';
import { loadProfiles } from '@/lib/data-loader';

export async function GET(
  _req: NextRequest,
  { params }: { params: { farm_type: string } }
) {
  const { farm_type } = params;
  const profiles = loadProfiles();
  const profile = profiles[farm_type];

  if (!profile) {
    return NextResponse.json(
      { detail: `Profile not found for ${farm_type}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    farm_type,
    scenarios: profile.synthetic_scenarios || profile.synthetic_scenario_examples || {},
  });
}
