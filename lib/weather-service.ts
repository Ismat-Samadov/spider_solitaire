/**
 * Weather Service - auto-fetch weather from Open-Meteo via IP geolocation
 * Port of Python weather_service.py
 */

const IPAPI_URL = 'https://ipapi.co/json/';
const OPENMETEO_URL = 'https://api.open-meteo.com/v1/forecast';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall_last_24h: number;
  wind_speed: number;
  frost_warning: boolean;
}

export interface AutoWeatherResult extends WeatherData {
  location: LocationData;
  used_fallback: boolean;
}

const DEFAULT_LOCATION: LocationData = {
  latitude: 40.4093,
  longitude: 49.8671,
  city: 'Bakı',
  country: 'Azerbaijan',
  region: 'Bakı',
};

async function getLocationFromIp(): Promise<LocationData> {
  const res = await fetch(IPAPI_URL, {
    headers: { Accept: 'application/json' },
    // 10s timeout via AbortController
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`ipapi.co responded ${res.status}`);

  const data = await res.json();
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    city: data.city || 'Unknown',
    country: data.country_name || 'Unknown',
    region: data.region || '',
  };
}

async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
    timezone: 'auto',
    forecast_days: '1',
  });

  const res = await fetch(`${OPENMETEO_URL}?${params}`, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);

  const data = await res.json();
  const current = data.current || {};
  const temperature = Math.round(current.temperature_2m ?? 0);

  return {
    temperature,
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    rainfall_last_24h: current.precipitation ?? 0,
    wind_speed: Math.round(current.wind_speed_10m ?? 0),
    frost_warning: temperature < 0,
  };
}

export async function autoFetchWeather(): Promise<AutoWeatherResult> {
  let location: LocationData = DEFAULT_LOCATION;
  let used_fallback = false;

  try {
    const detected = await getLocationFromIp();

    if (!['azerbaijan', 'azərbaycan'].includes(detected.country.toLowerCase())) {
      used_fallback = true;
    } else {
      location = detected;
    }
  } catch {
    used_fallback = true;
  }

  const weather = await fetchWeatherData(location.latitude, location.longitude);

  return { ...weather, location, used_fallback };
}

export function mapLocationToRegion(city: string, region: string): string {
  const c = city.toLowerCase();
  const r = region.toLowerCase();

  if (/ganja|gəncə|gazakh/.test(c)) return 'ganja_gazakh';
  if (/lankaran|lənkəran|astara/.test(c)) return 'lankaran';
  if (/sheki|şəki|zagatala|zaqatala|balakan|qax/.test(c)) return 'sheki_zagatala';
  if (/quba|qusar|xinaliq|qabala/.test(c)) return 'mountainous';

  if (/ganja|gəncə|gazakh/.test(r)) return 'ganja_gazakh';
  if (/lankaran|lənkəran/.test(r)) return 'lankaran';
  if (/sheki|şəki|zagatala/.test(r)) return 'sheki_zagatala';
  if (/quba|mountain/.test(r)) return 'mountainous';

  return 'aran';
}
