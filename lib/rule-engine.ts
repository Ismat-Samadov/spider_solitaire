/**
 * Rule Engine - evaluates JSON rules against input context
 * Port of Python rule_engine.py
 */

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface RecommendationAction {
  rule_id: string;
  name_az: string;
  name_en: string;
  category: string;
  urgency: UrgencyLevel;
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

export interface RecommendationRequest {
  farm_type: string;
  region: string;
  request_date?: string;
  weather: {
    temperature: number;
    humidity: number;
    rainfall_last_24h?: number;
    rainfall_last_7days?: number;
    rainfall_forecast_48h?: boolean;
    rainfall_forecast_amount_mm?: number;
    wind_speed?: number;
    frost_warning?: boolean;
    time_of_day?: string;
  };
  soil?: {
    soil_moisture: number;
    soil_temperature?: number;
    soil_type?: string;
    ph?: number;
  };
  crop_context?: {
    crop_type: string;
    stage: string;
    days_in_stage?: number;
    days_since_irrigation?: number;
    days_since_fertilization?: number;
    days_until_harvest?: number;
    growing_type?: string;
    grain_moisture?: number;
    grain_shattering?: boolean;
    nitrogen_deficiency_signs?: boolean;
    calcium_deficiency_signs?: boolean;
    aphid_count_per_head?: number;
    seed_treated?: boolean;
    diseased_branches_present?: boolean;
    previous_crop?: string;
    tree_age_years?: number;
    days_after_harvest?: number;
  };
  livestock_context?: {
    animal_type: string;
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
  };
  greenhouse_context?: {
    inside_temperature: number;
    inside_humidity: number;
    ventilation_status?: string;
    heating_status?: string;
  };
  resource_context?: {
    water_availability?: string;
    labor_availability?: string;
    financial_status?: string;
  };
  farm_components?: {
    crop_types?: string[];
    livestock_types?: string[];
  };
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

// ── Context builder ────────────────────────────────────────────────────────────

function buildContext(request: RecommendationRequest): Record<string, any> {
  const context: Record<string, any> = {
    farm_type: request.farm_type,
    region: request.region,
    date: request.request_date || new Date().toISOString().split('T')[0],
  };

  if (request.weather) {
    for (const [k, v] of Object.entries(request.weather)) {
      if (v !== undefined) context[`weather.${k}`] = v;
    }
  }

  if (request.soil) {
    for (const [k, v] of Object.entries(request.soil)) {
      if (v !== undefined) context[`soil.${k}`] = v;
    }
  }

  if (request.crop_context) {
    for (const [k, v] of Object.entries(request.crop_context)) {
      if (v !== undefined) context[`crop_context.${k}`] = v;
    }
  }

  if (request.livestock_context) {
    for (const [k, v] of Object.entries(request.livestock_context)) {
      if (v !== undefined) context[`livestock_context.${k}`] = v;
    }
  }

  if (request.greenhouse_context) {
    for (const [k, v] of Object.entries(request.greenhouse_context)) {
      if (v !== undefined) context[`greenhouse_context.${k}`] = v;
    }
  }

  if (request.resource_context) {
    for (const [k, v] of Object.entries(request.resource_context)) {
      if (v !== undefined) context[`resource_context.${k}`] = v;
    }
  }

  if (request.farm_components) {
    for (const [k, v] of Object.entries(request.farm_components)) {
      context[`farm_components.${k}`] = v;
    }
  }

  // Time of day
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) context.time_of_day = 'morning';
  else if (hour >= 12 && hour < 17) context.time_of_day = 'midday';
  else if (hour >= 17 && hour < 21) context.time_of_day = 'evening';
  else context.time_of_day = 'night';

  return context;
}

// ── Condition evaluator ────────────────────────────────────────────────────────

function evaluateSingleCondition(
  condition: Record<string, any>,
  context: Record<string, any>
): boolean {
  const field = condition.field || '';
  const op = condition.operator || '==';
  const expected = condition.value;

  const actual = context[field];

  if (actual === undefined || actual === null) {
    if (op === 'NOT_EMPTY') return false;
    if (op === 'EMPTY') return true;
    return false;
  }

  try {
    switch (op) {
      case '==':
        return actual === expected;
      case '!=':
        return actual !== expected;
      case '>':
        return Number(actual) > Number(expected);
      case '>=':
        return Number(actual) >= Number(expected);
      case '<':
        return Number(actual) < Number(expected);
      case '<=':
        return Number(actual) <= Number(expected);
      case 'IN':
        return Array.isArray(expected) && expected.includes(actual);
      case 'NOT_IN':
        return Array.isArray(expected) ? !expected.includes(actual) : true;
      case 'CONTAINS':
        if (Array.isArray(actual)) {
          if (Array.isArray(expected)) return expected.some((e) => actual.includes(e));
          return actual.includes(expected);
        }
        return false;
      case 'NOT_EMPTY':
        return Array.isArray(actual) ? actual.length > 0 : Boolean(actual);
      case 'EMPTY':
        return Array.isArray(actual) ? actual.length === 0 : !actual;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

function evaluateConditions(
  conditions: Record<string, any>,
  context: Record<string, any>
): boolean {
  if (!conditions || Object.keys(conditions).length === 0) return true;

  const operator = conditions.operator || 'AND';
  const items: any[] = conditions.items || [];

  if (items.length === 0) return true;

  const results = items.map((item: any) => {
    if ('operator' in item && 'items' in item) {
      return evaluateConditions(item, context);
    }
    return evaluateSingleCondition(item, context);
  });

  return operator === 'OR' ? results.some(Boolean) : results.every(Boolean);
}

// ── Template processor ─────────────────────────────────────────────────────────

function processTemplate(template: string, context: Record<string, any>): string {
  if (!template) return template;

  return template.replace(/\{(\w+)\}/g, (_match, fieldName) => {
    // Direct lookup
    if (context[fieldName] !== undefined) return String(context[fieldName]);

    // Prefix lookup
    const prefixes = [
      'weather.',
      'soil.',
      'crop_context.',
      'livestock_context.',
      'greenhouse_context.',
    ];
    for (const prefix of prefixes) {
      const val = context[`${prefix}${fieldName}`];
      if (val !== undefined) return String(val);
    }

    return `{${fieldName}}`;
  });
}

// ── Action builder ─────────────────────────────────────────────────────────────

function buildAction(
  rule: Record<string, any>,
  context: Record<string, any>,
  category: string
): RecommendationAction {
  const actionData = rule.action || {};

  const urgencyStr: string = actionData.urgency || 'medium';
  const urgency = ['critical', 'high', 'medium', 'low', 'info'].includes(urgencyStr)
    ? (urgencyStr as UrgencyLevel)
    : 'medium';

  return {
    rule_id: rule.rule_id || '',
    name_az: rule.name_az || '',
    name_en: rule.name_en || '',
    category,
    urgency,
    urgency_score: actionData.urgency_score ?? 50,
    message_az: processTemplate(rule.message_az || '', context),
    message_en: processTemplate(rule.message_en || '', context),
    action_type: actionData.type || 'info',
    action_details: actionData,
    timing_az: actionData.timing_az,
  };
}

// ── Schedule generator ─────────────────────────────────────────────────────────

const TIME_SLOTS: Record<string, string> = {
  early_morning: '05:00-07:00',
  morning: '07:00-10:00',
  late_morning: '10:00-12:00',
  midday: '12:00-15:00',
  afternoon: '15:00-17:00',
  evening: '17:00-19:00',
  night: '19:00-21:00',
};

const ACTION_TIME_MAP: Record<string, string> = {
  irrigate: 'early_morning',
  fertilize: 'morning',
  apply_fungicide: 'morning',
  apply_insecticide: 'early_morning',
  harvest: 'late_morning',
  prune: 'morning',
  vaccination_reminder: 'morning',
  vet_checkup_reminder: 'morning',
  feeding_recommendation: 'early_morning',
  emergency_cooling: 'midday',
  monitor: 'morning',
};

function generateSchedule(recommendations: RecommendationAction[]): DailyScheduleItem[] {
  const schedule: DailyScheduleItem[] = recommendations.slice(0, 10).map((rec) => {
    const timeKey = ACTION_TIME_MAP[rec.action_type] || 'morning';
    const timeSlot = TIME_SLOTS[timeKey] || '08:00-10:00';
    const priority =
      rec.urgency === 'critical' || rec.urgency === 'high' ? 'must_do' : 'should_do';

    return {
      time_slot: timeSlot,
      task_az: rec.name_az,
      task_en: rec.name_en,
      priority,
      related_rule_id: rec.rule_id,
      urgency_score: rec.urgency_score,
    };
  });

  return schedule.sort((a, b) => a.time_slot.localeCompare(b.time_slot));
}

// ── Summary generator ──────────────────────────────────────────────────────────

function generateSummary(response: Omit<RecommendationResponse, 'summary_az' | 'summary_en'>): {
  summary_az: string;
  summary_en: string;
} {
  const criticalCount = response.critical_alerts.length;
  const highCount = response.high_priority.length;
  const mediumCount = response.medium_priority.length;
  const total = criticalCount + highCount + mediumCount + response.low_priority.length;

  if (criticalCount > 0) {
    return {
      summary_az: `⚠️ DİQQƏT: ${criticalCount} kritik xəbərdarlıq var! Dərhal müdaxilə lazımdır. Ümumi ${total} tövsiyə.`,
      summary_en: `⚠️ ATTENTION: ${criticalCount} critical alerts! Immediate action required. Total ${total} recommendations.`,
    };
  }
  if (highCount > 0) {
    return {
      summary_az: `📋 Bu gün ${highCount} yüksək prioritetli və ${mediumCount} orta prioritetli tapşırıq var.`,
      summary_en: `📋 Today you have ${highCount} high priority and ${mediumCount} medium priority tasks.`,
    };
  }
  if (total > 0) {
    return {
      summary_az: `✅ Vəziyyət sabitdir. ${total} ümumi tövsiyə var.`,
      summary_en: `✅ Situation stable. ${total} total recommendations.`,
    };
  }
  return {
    summary_az: '✅ Heç bir xüsusi tövsiyə yoxdur. Hər şey qaydasındadır.',
    summary_en: '✅ No special recommendations. Everything is in order.',
  };
}

// ── Main evaluate function ─────────────────────────────────────────────────────

export function evaluate(
  request: RecommendationRequest,
  rules: Record<string, Record<string, any>>
): RecommendationResponse {
  const farmType = request.farm_type;
  const farmRules = rules[farmType] || {};
  const context = buildContext(request);

  const matched: RecommendationAction[] = [];

  for (const [category, categoryData] of Object.entries(farmRules)) {
    if (!categoryData || !categoryData.rules) continue;

    for (const rule of categoryData.rules) {
      if (!rule.enabled) continue;

      // applicable_to filter
      const applicableTo: string[] | undefined = rule.applicable_to;
      if (applicableTo) {
        const cropType = context['crop_context.crop_type'];
        const animalType = context['livestock_context.animal_type'];
        if (cropType && !applicableTo.includes(cropType)) continue;
        if (animalType && !applicableTo.includes(animalType)) continue;
      }

      if (!evaluateConditions(rule.conditions || {}, context)) continue;

      matched.push(buildAction(rule, context, category));
    }
  }

  // Sort by urgency score descending
  matched.sort((a, b) => b.urgency_score - a.urgency_score);

  // Group by urgency level
  const critical_alerts: RecommendationAction[] = [];
  const high_priority: RecommendationAction[] = [];
  const medium_priority: RecommendationAction[] = [];
  const low_priority: RecommendationAction[] = [];
  const info: RecommendationAction[] = [];

  for (const rec of matched) {
    switch (rec.urgency) {
      case 'critical':
        critical_alerts.push(rec);
        break;
      case 'high':
        high_priority.push(rec);
        break;
      case 'medium':
        medium_priority.push(rec);
        break;
      case 'low':
        low_priority.push(rec);
        break;
      default:
        info.push(rec);
    }
  }

  const responseDate =
    request.request_date || new Date().toISOString().split('T')[0];

  const partial = {
    farm_type: farmType,
    region: request.region,
    response_date: responseDate,
    generated_at: new Date().toISOString(),
    critical_alerts,
    high_priority,
    medium_priority,
    low_priority,
    info,
    daily_schedule: [] as DailyScheduleItem[],
    total_recommendations: matched.length,
  };

  const { summary_az, summary_en } = generateSummary(partial);

  return {
    ...partial,
    daily_schedule: generateSchedule(matched),
    summary_az,
    summary_en,
  };
}
