'use client';

import { AlertTriangle, AlertCircle, Info, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import type { RecommendationAction } from '@/lib/api';

interface RecommendationCardProps {
  recommendation: RecommendationAction;
}

const urgencyConfig = {
  critical: {
    icon: AlertTriangle,
    bgClass: 'bg-danger-50',
    borderClass: 'border-danger-200',
    iconBgClass: 'bg-danger-100',
    iconColor: 'text-danger-600',
    badgeClass: 'badge-critical',
    label: 'Kritik',
  },
  high: {
    icon: AlertCircle,
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    iconBgClass: 'bg-orange-100',
    iconColor: 'text-orange-600',
    badgeClass: 'badge-high',
    label: 'Yüksək',
  },
  medium: {
    icon: Clock,
    bgClass: 'bg-wheat-50',
    borderClass: 'border-wheat-200',
    iconBgClass: 'bg-wheat-100',
    iconColor: 'text-wheat-600',
    badgeClass: 'badge-medium',
    label: 'Orta',
  },
  low: {
    icon: Info,
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    iconBgClass: 'bg-sky-100',
    iconColor: 'text-sky-600',
    badgeClass: 'badge-low',
    label: 'Aşağı',
  },
  info: {
    icon: Info,
    bgClass: 'bg-leaf-50',
    borderClass: 'border-leaf-200',
    iconBgClass: 'bg-leaf-100',
    iconColor: 'text-leaf-600',
    badgeClass: 'badge-info',
    label: 'Məlumat',
  },
};

const categoryLabels: Record<string, string> = {
  irrigation: 'Suvarma',
  fertilization: 'Gübrələmə',
  pest_disease: 'Zərərverici/Xəstəlik',
  harvest: 'Yığım',
  disease_risk: 'Xəstəlik Riski',
  feeding: 'Yemləmə',
  veterinary: 'Baytar',
  pruning: 'Budama',
  greenhouse: 'Sera',
  integration: 'İnteqrasiya',
  resource_allocation: 'Resurs',
  daily_coordination: 'Koordinasiya',
};

// Azerbaijani translations for common field labels
const fieldTranslations: Record<string, string> = {
  cattle: 'Mal-qara',
  sheep: 'Qoyun',
  goat: 'Keçi',
  poultry: 'Quşçuluq',
  feed_increase_percent: 'Yem artımı (%)',
  feed_reduction_percent: 'Yem azalması (%)',
  water_increase_percent: 'Su artımı (%)',
  timing_change_az: 'Vaxt dəyişikliyi',
  additional_az: 'Əlavə təlimatlar',
  recommendations_az: 'Tövsiyələr',
  adjustments_by_animal: 'Heyvan növünə görə tənzimlənmələr',
  water_change_az: 'Su dəyişikliyi',
  feed_reduction_note_az: 'Yem qeydi',
};

// Helper function to render complex values
const renderValue = (key: string, value: any): React.ReactNode => {
  if (value === null || value === undefined) return '-';

  // Handle arrays
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside space-y-1">
        {value.map((item, idx) => (
          <li key={idx} className="text-earth-700">{String(item)}</li>
        ))}
      </ul>
    );
  }

  // Handle objects (like adjustments_by_animal)
  if (typeof value === 'object') {
    return (
      <div className="space-y-2 pl-2 border-l-2 border-earth-200">
        {Object.entries(value).map(([subKey, subValue]) => (
          <div key={subKey} className="space-y-1">
            <div className="font-medium text-earth-800 text-sm">
              {fieldTranslations[subKey] || subKey.replace(/_/g, ' ')}:
            </div>
            <div className="pl-3">{renderValue(subKey, subValue)}</div>
          </div>
        ))}
      </div>
    );
  }

  // Handle primitives
  return <span className="text-earth-700">{String(value)}</span>;
};

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = urgencyConfig[recommendation.urgency as keyof typeof urgencyConfig] || urgencyConfig.info;
  const Icon = config.icon;

  return (
    <div className={clsx(
      'rounded-xl border-2 overflow-hidden transition-all duration-300',
      config.bgClass,
      config.borderClass,
      expanded && 'shadow-lg'
    )}>
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            config.iconBgClass
          )}>
            <Icon className={clsx('w-6 h-6', config.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={config.badgeClass}>{config.label}</span>
              <span className="text-xs text-earth-500 bg-earth-100 px-2 py-0.5 rounded-full">
                {categoryLabels[recommendation.category] || recommendation.category}
              </span>
              <span className="text-xs text-earth-400 font-mono">
                #{recommendation.rule_id}
              </span>
            </div>

            <h3 className="font-semibold text-earth-800 text-lg mb-1">
              {recommendation.name_az}
            </h3>
            
            <p className="text-earth-600">
              {recommendation.message_az}
            </p>

            {recommendation.timing_az && (
              <div className="mt-2 flex items-center gap-2 text-sm text-earth-500">
                <Clock className="w-4 h-4" />
                <span>{recommendation.timing_az}</span>
              </div>
            )}
          </div>

          {/* Score */}
          <div className="flex-shrink-0 text-right">
            <div className={clsx(
              'text-2xl font-bold',
              recommendation.urgency_score >= 80 ? 'text-danger-600' :
              recommendation.urgency_score >= 60 ? 'text-orange-600' :
              recommendation.urgency_score >= 40 ? 'text-wheat-600' :
              'text-leaf-600'
            )}>
              {recommendation.urgency_score}
            </div>
            <div className="text-xs text-earth-400">skor</div>
          </div>
        </div>
      </div>

      {/* Expandable details */}
      {recommendation.action_details && Object.keys(recommendation.action_details).length > 2 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={clsx(
              'w-full px-4 py-2 flex items-center justify-center gap-2',
              'text-sm font-medium text-earth-500 hover:text-earth-700',
              'border-t transition-colors',
              config.borderClass
            )}
          >
            {expanded ? (
              <>
                <span>Daha az</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Ətraflı</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {expanded && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed" style={{ borderColor: 'inherit' }}>
              <div className="bg-white/50 rounded-lg p-4 text-sm space-y-3">
                <h4 className="font-semibold text-earth-800 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Təfərrüatlar
                </h4>
                {Object.entries(recommendation.action_details).map(([key, value]) => {
                  if (key === 'type' || key === 'urgency' || key === 'urgency_score') return null;
                  return (
                    <div key={key} className="space-y-2">
                      <div className="text-earth-700 font-semibold text-sm">
                        {fieldTranslations[key] || key.replace(/_/g, ' ')}
                      </div>
                      <div className="pl-2">
                        {renderValue(key, value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
