import { NextRequest, NextResponse } from 'next/server';
import { evaluate } from '@/lib/rule-engine';
import { loadAllRules } from '@/lib/data-loader';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const farm_type = searchParams.get('farm_type');
    const region = searchParams.get('region');
    const temperature = searchParams.get('temperature');
    const humidity = searchParams.get('humidity');

    if (!farm_type || !region || !temperature || !humidity) {
      return NextResponse.json(
        { detail: 'farm_type, region, temperature and humidity are required' },
        { status: 422 }
      );
    }

    const crop_type = searchParams.get('crop_type');
    const stage = searchParams.get('stage');
    const days_since_irrigation = Number(searchParams.get('days_since_irrigation') || 0);
    const soil_moisture = Number(searchParams.get('soil_moisture') || 50);

    const data = {
      farm_type,
      region,
      weather: { temperature: Number(temperature), humidity: Number(humidity) },
      soil: { soil_moisture },
      crop_context:
        crop_type && stage
          ? { crop_type, stage, days_since_irrigation }
          : undefined,
    };

    const rules = loadAllRules();
    const response = evaluate(data, rules);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ detail: String(error) }, { status: 500 });
  }
}
