/**
 * AgriAdvisor API Client
 * Handles all communication with the Next.js API routes
 */

// Client-side: relative path hits the same-origin Next.js API routes.
// Server-side (SSR/RSC): needs an absolute URL. Uses VERCEL_URL (auto-set by Vercel)
// or falls back to localhost for local development.
const API_BASE_URL = typeof window !== 'undefined'
  ? ''
  : process.env.NEXT_PUBLIC_API_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall_last_24h?: number;
  rainfall_last_7days?: number;
  rainfall_forecast_48h?: boolean;
  rainfall_forecast_amount_mm?: number;
  wind_speed?: number;
  frost_warning?: boolean;
  time_of_day?: string;
}

export interface SoilData {
  soil_moisture: number;
  soil_temperature?: number;
  soil_type?: string;
}

export interface CropContext {
  crop_type: string;
  stage: string;
  days_in_stage?: number;
  days_since_irrigation?: number;
  days_since_fertilization?: number;
  days_until_harvest?: number;
  growing_type?: 'open_field' | 'greenhouse';
  grain_moisture?: number;
}

export interface LivestockContext {
  animal_type: 'cattle' | 'sheep' | 'goat' | 'poultry';
  count?: number;
  barn_hygiene_score: number;
  days_since_vet_check?: number;
  vaccination_status?: string;
  days_since_deworming?: number;
  ventilation_quality?: string;
  water_availability?: string;
  lactation_stage?: string;
  reproductive_stage?: string;
  days_until_expected_birth?: number;
  age_days?: number;
}

export interface GreenhouseContext {
  inside_temperature: number;
  inside_humidity: number;
  ventilation_status?: string;
}

export interface RecommendationRequest {
  farm_type: string;
  region: string;
  weather: WeatherData;
  soil?: SoilData;
  crop_context?: CropContext;
  livestock_context?: LivestockContext;
  greenhouse_context?: GreenhouseContext;
}

export interface RecommendationAction {
  rule_id: string;
  name_az: string;
  name_en: string;
  category: string;
  urgency: string;
  urgency_score: number;
  message_az: string;
  message_en: string;
  action_type: string;
  action_details?: Record<string, any>;
  timing_az?: string;
}

export interface DailyScheduleItem {
  time_slot: string;
  task_az: string;
  task_en: string;
  priority: string;
  related_rule_id?: string;
  urgency_score: number;
}

export interface RecommendationResponse {
  farm_type: string;
  region: string;
  response_date: string;
  generated_at: string;
  critical_alerts: RecommendationAction[];
  high_priority: RecommendationAction[];
  medium_priority: RecommendationAction[];
  low_priority: RecommendationAction[];
  info: RecommendationAction[];
  daily_schedule: DailyScheduleItem[];
  total_recommendations: number;
  summary_az: string;
  summary_en: string;
}

export interface FarmType {
  id: string;
  name_az: string;
  name_en: string;
  description_az: string;
}

export interface Stats {
  total_rules: number;
  rules_by_farm_type: Record<string, number>;
  farm_types_count: number;
  regions_count: number;
}

// API Functions
export async function getRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getFarmTypes(): Promise<{ farm_types: FarmType[] }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/farms`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function getStats(): Promise<Stats> {
  const response = await fetch(`${API_BASE_URL}/api/v1/stats`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function getConstants(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/v1/constants`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function searchRules(query: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/v1/rules/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Auto-fetch weather based on IP location (backend-first approach)
 */
export interface AutoWeatherResult {
  temperature: number;
  humidity: number;
  rainfall_last_24h: number;
  wind_speed: number;
  frost_warning: boolean;
  location: {
    city: string;
    country: string;
    region: string;
    latitude: number;
    longitude: number;
  };
  region: string;
  fallback: boolean; // True if VPN/foreign IP detected, fallback to Baku used
}

export async function autoFetchWeather(): Promise<AutoWeatherResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/weather/auto`);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  return response.json();
}

export async function getScenarios(farmType: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/v1/scenarios/${farmType}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Utility functions
export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'critical':
      return 'danger';
    case 'high':
      return 'orange';
    case 'medium':
      return 'wheat';
    case 'low':
      return 'sky';
    default:
      return 'leaf';
  }
}

export function getUrgencyLabel(urgency: string): string {
  const labels: Record<string, string> = {
    critical: 'Kritik',
    high: 'Yüksək',
    medium: 'Orta',
    low: 'Aşağı',
    info: 'Məlumat',
  };
  return labels[urgency] || urgency;
}

export const REGIONS = [
  { id: 'aran', name_az: 'Aran', name_en: 'Aran' },
  { id: 'lankaran', name_az: 'Lənkəran', name_en: 'Lankaran' },
  { id: 'sheki_zagatala', name_az: 'Şəki-Zaqatala', name_en: 'Sheki-Zagatala' },
  { id: 'ganja_gazakh', name_az: 'Gəncə-Qazax', name_en: 'Ganja-Gazakh' },
  { id: 'mountainous', name_az: 'Dağlıq', name_en: 'Mountainous' },
];

export const CROP_STAGES: Record<string, { id: string; name_az: string }[]> = {
  wheat: [
    { id: 'germination', name_az: 'Cücərmə' },
    { id: 'tillering', name_az: 'Kollanma' },
    { id: 'stem_extension', name_az: 'Gövdə uzanması' },
    { id: 'heading', name_az: 'Sünbülləmə' },
    { id: 'grain_filling', name_az: 'Dən dolması' },
    { id: 'maturity', name_az: 'Yetişmə' },
  ],
  barley: [
    { id: 'germination', name_az: 'Cücərmə' },
    { id: 'tillering', name_az: 'Kollanma' },
    { id: 'stem_extension', name_az: 'Gövdə uzanması' },
    { id: 'heading', name_az: 'Sünbülləmə' },
    { id: 'grain_filling', name_az: 'Dən dolması' },
    { id: 'maturity', name_az: 'Yetişmə' },
  ],
  tomato: [
    { id: 'seedling', name_az: 'Şitil' },
    { id: 'vegetative', name_az: 'Vegetativ' },
    { id: 'flowering', name_az: 'Çiçəkləmə' },
    { id: 'fruiting', name_az: 'Meyvə dövrü' },
  ],
  cucumber: [
    { id: 'seedling', name_az: 'Şitil' },
    { id: 'vegetative', name_az: 'Vegetativ' },
    { id: 'flowering', name_az: 'Çiçəkləmə' },
    { id: 'fruiting', name_az: 'Meyvə dövrü' },
  ],
  grape: [
    { id: 'dormancy', name_az: 'Qış yuxusu' },
    { id: 'bud_break', name_az: 'Tumurcuqlanma' },
    { id: 'flowering', name_az: 'Çiçəkləmə' },
    { id: 'fruit_set', name_az: 'Gilə bağlama' },
    { id: 'fruit_development', name_az: 'Gilə böyüməsi' },
    { id: 'veraison', name_az: 'Veraison' },
    { id: 'harvest', name_az: 'Yığım' },
  ],
  pomegranate: [
    { id: 'dormancy', name_az: 'Qış yuxusu' },
    { id: 'bud_break', name_az: 'Tumurcuqlanma' },
    { id: 'flowering', name_az: 'Çiçəkləmə' },
    { id: 'fruit_set', name_az: 'Meyvə bağlama' },
    { id: 'fruit_development', name_az: 'Meyvə böyüməsi' },
    { id: 'maturity', name_az: 'Yetişmə' },
  ],
  apple: [
    { id: 'dormancy', name_az: 'Qış yuxusu' },
    { id: 'bud_break', name_az: 'Tumurcuqlanma' },
    { id: 'flowering', name_az: 'Çiçəkləmə' },
    { id: 'fruit_set', name_az: 'Meyvə bağlama' },
    { id: 'fruit_development', name_az: 'Meyvə böyüməsi' },
    { id: 'harvest', name_az: 'Yığım' },
  ],
  potato: [
    { id: 'sprouting', name_az: 'Cücərmə' },
    { id: 'vegetative', name_az: 'Vegetativ' },
    { id: 'tuber_initiation', name_az: 'Yumru başlanğıcı' },
    { id: 'tuber_bulking', name_az: 'Yumru böyüməsi' },
    { id: 'maturation', name_az: 'Yetişmə' },
  ],
};

export const ANIMAL_TYPES = [
  { id: 'cattle', name_az: 'Mal-qara', icon: '🐄' },
  { id: 'sheep', name_az: 'Qoyun', icon: '🐑' },
  { id: 'goat', name_az: 'Keçi', icon: '🐐' },
  { id: 'poultry', name_az: 'Quşçuluq', icon: '🐔' },
];
