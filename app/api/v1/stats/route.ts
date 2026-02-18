import { NextResponse } from 'next/server';
import { countRules } from '@/lib/data-loader';

export async function GET() {
  const counts = countRules();

  return NextResponse.json({
    total_rules: counts._total || 0,
    rules_by_farm_type: Object.fromEntries(
      Object.entries(counts)
        .filter(([k]) => k !== '_total')
        .map(([k, v]) => [k, (v as any)._total || 0])
    ),
    farm_types_count: 5,
    regions_count: 5,
    rule_categories: {
      wheat: ['irrigation', 'fertilization', 'pest_disease', 'harvest'],
      livestock: ['disease_risk', 'feeding', 'veterinary'],
      orchard: ['irrigation', 'fertilization', 'pruning', 'pest_disease'],
      vegetable: ['irrigation', 'fertilization', 'greenhouse', 'pest_disease'],
      mixed: ['integration', 'resource_allocation', 'daily_coordination'],
    },
  });
}
