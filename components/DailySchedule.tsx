
'use client';

import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import type { DailyScheduleItem } from '@/lib/api';

interface DailyScheduleProps {
  schedule: DailyScheduleItem[];
}

export default function DailySchedule({ schedule }: DailyScheduleProps) {
  if (schedule.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-leaf-600" />
        </div>
        <p className="text-earth-600">Bu gün üçün planlanmış xüsusi tapşırıq yoxdur.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-leaf-600 to-leaf-500 px-6 py-4">
        <h3 className="text-white font-display font-semibold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Gündəlik Cədvəl
        </h3>
      </div>
      
      <div className="divide-y divide-earth-100">
        {schedule.map((item, index) => (
          <div
            key={index}
            className={clsx(
              'flex items-center gap-4 p-4 transition-colors hover:bg-earth-50',
              item.priority === 'must_do' && 'bg-danger-50/30'
            )}
          >
            {/* Time */}
            <div className="flex-shrink-0 w-24">
              <div className="text-sm font-mono font-semibold text-earth-600">
                {item.time_slot}
              </div>
            </div>

            {/* Priority indicator */}
            <div className="flex-shrink-0">
              {item.priority === 'must_do' ? (
                <div className="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-danger-600" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-leaf-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-leaf-500 rounded-full" />
                </div>
              )}
            </div>

            {/* Task */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-earth-800 truncate">
                {item.task_az}
              </p>
              {item.related_rule_id && (
                <p className="text-xs text-earth-400 font-mono">
                  {item.related_rule_id}
                </p>
              )}
            </div>

            {/* Score */}
            <div className="flex-shrink-0">
              <span className={clsx(
                'inline-block px-2 py-1 rounded-full text-xs font-bold',
                item.urgency_score >= 80 ? 'bg-danger-100 text-danger-700' :
                item.urgency_score >= 60 ? 'bg-orange-100 text-orange-700' :
                item.urgency_score >= 40 ? 'bg-wheat-100 text-wheat-700' :
                'bg-leaf-100 text-leaf-700'
              )}>
                {item.urgency_score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
