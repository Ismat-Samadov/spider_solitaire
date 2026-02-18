import { NextResponse } from 'next/server';
import { loadAllRules, countRules } from '@/lib/data-loader';

export async function GET() {
  const rules = loadAllRules();
  const counts = countRules();

  const rules_by_category: Record<string, any> = {};

  for (const [farmType, categories] of Object.entries(rules)) {
    rules_by_category[farmType] = {};
    for (const [category, data] of Object.entries(categories as Record<string, any>)) {
      if (data && data.rules) {
        rules_by_category[farmType][category] = data.rules.map((r: any) => ({
          rule_id: r.rule_id || '',
          name_az: r.name_az || '',
          name_en: r.name_en || '',
          priority: r.priority || 'medium',
          category,
          farm_type: farmType,
        }));
      }
    }
  }

  return NextResponse.json({
    total_rules: counts._total || 0,
    counts_by_farm_type: Object.fromEntries(
      Object.entries(counts).filter(([k]) => k !== '_total')
    ),
    rules_by_category,
  });
}
