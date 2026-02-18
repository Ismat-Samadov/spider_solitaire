/**
 * Data Loader - loads rules, profiles and constants from JSON files
 * Port of Python rule_loader.py
 */

import path from 'path';
import fs from 'fs';

const FARM_RULE_CATEGORIES: Record<string, string[]> = {
  wheat: ['irrigation', 'fertilization', 'pest_disease', 'harvest'],
  livestock: ['disease_risk', 'feeding', 'veterinary'],
  orchard: ['irrigation', 'fertilization', 'pruning', 'pest_disease'],
  vegetable: ['irrigation', 'fertilization', 'greenhouse', 'pest_disease'],
  mixed: ['integration', 'resource_allocation', 'daily_coordination'],
};

const DATA_PATH = path.join(process.cwd(), 'data');

function loadJson(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error loading ${filePath}:`, e);
    return null;
  }
}

// Module-level cache — warm within same Lambda instance
let _rules: Record<string, Record<string, any>> | null = null;
let _profiles: Record<string, any> | null = null;
let _constants: Record<string, any> | null = null;

export function loadAllRules(): Record<string, Record<string, any>> {
  if (_rules) return _rules;

  const rules: Record<string, Record<string, any>> = {};

  for (const [farmType, categories] of Object.entries(FARM_RULE_CATEGORIES)) {
    rules[farmType] = {};
    for (const category of categories) {
      const filePath = path.join(DATA_PATH, 'rules', farmType, `${category}.json`);
      const data = loadJson(filePath);
      if (data) rules[farmType][category] = data;
    }
  }

  _rules = rules;
  return rules;
}

export function loadConstants(): Record<string, any> {
  if (_constants) return _constants;

  const constants: Record<string, any> = {};
  const constantsPath = path.join(DATA_PATH, 'constants');

  for (const name of ['stages', 'regions', 'thresholds']) {
    const data = loadJson(path.join(constantsPath, `${name}.json`));
    if (data) constants[name] = data;
  }

  _constants = constants;
  return constants;
}

export function loadProfiles(): Record<string, any> {
  if (_profiles) return _profiles;

  const profiles: Record<string, any> = {};
  const profilesPath = path.join(DATA_PATH, 'profiles');

  for (const farmType of ['wheat', 'livestock', 'orchard', 'vegetable', 'mixed']) {
    const data = loadJson(path.join(profilesPath, `${farmType}_profile.json`));
    if (data) profiles[farmType] = data;
  }

  _profiles = profiles;
  return profiles;
}

export function getRulesForFarmType(farmType: string): Record<string, any> {
  return loadAllRules()[farmType] || {};
}

export function getThresholds(): any {
  return loadConstants()['thresholds'] || {};
}

export function getRegions(): any {
  return loadConstants()['regions'] || {};
}

export function getStages(): any {
  return loadConstants()['stages'] || {};
}

export function countRules(): Record<string, any> {
  const rules = loadAllRules();
  const counts: Record<string, any> = {};
  let total = 0;

  for (const [farmType, categories] of Object.entries(rules)) {
    counts[farmType] = {};
    let farmTotal = 0;

    for (const [category, data] of Object.entries(categories)) {
      if (data && data.rules) {
        const count = data.rules.length;
        counts[farmType][category] = count;
        farmTotal += count;
      }
    }

    counts[farmType]._total = farmTotal;
    total += farmTotal;
  }

  counts._total = total;
  return counts;
}

export function searchRules(keyword: string): any[] {
  const rules = loadAllRules();
  const keywordLower = keyword.toLowerCase();
  const results: any[] = [];

  for (const [farmType, categories] of Object.entries(rules)) {
    for (const [category, data] of Object.entries(categories)) {
      if (data && data.rules) {
        for (const rule of data.rules) {
          const searchable = [
            rule.name_az || '',
            rule.name_en || '',
            rule.message_az || '',
            rule.message_en || '',
            rule.rule_id || '',
          ];
          if (searchable.some((s: string) => s.toLowerCase().includes(keywordLower))) {
            results.push({ farm_type: farmType, category, ...rule });
          }
        }
      }
    }
  }

  return results;
}
