import { NextResponse } from 'next/server';
import { autoFetchWeather, mapLocationToRegion } from '@/lib/weather-service';

export async function GET() {
  try {
    const result = await autoFetchWeather();
    const region = mapLocationToRegion(
      result.location.city,
      result.location.region
    );

    return NextResponse.json({
      temperature: result.temperature,
      humidity: result.humidity,
      rainfall_last_24h: result.rainfall_last_24h,
      wind_speed: result.wind_speed,
      frost_warning: result.frost_warning,
      location: result.location,
      region,
      fallback: result.used_fallback,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: `Failed to fetch weather data: ${String(error)}` },
      { status: 500 }
    );
  }
}
