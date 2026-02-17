import React from 'react';
import { clsx } from 'clsx';

interface DecisionQualityScoreProps {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  tradesAnalyzed: number;
  improvement: number; // Percentage change
  size?: 'sm' | 'md' | 'lg';
}

const gradeConfig = {
  A: { color: '#10B981', bg: 'bg-emerald-500', label: 'Excellent' },
  B: { color: '#3B82F6', bg: 'bg-blue-500', label: 'Good' },
  C: { color: '#F59E0B', bg: 'bg-amber-500', label: 'Average' },
  D: { color: '#F97316', bg: 'bg-orange-500', label: 'Below Average' },
  F: { color: '#EF4444', bg: 'bg-red-500', label: 'Poor' },
};

export const DecisionQualityScore: React.FC<DecisionQualityScoreProps> = ({
  score,
  grade,
  tradesAnalyzed,
  improvement,
  size = 'lg',
}) => {
  const config = gradeConfig[grade];
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
    md: { container: 'w-32 h-32', text: 'text-4xl', label: 'text-sm' },
    lg: { container: 'w-40 h-40', text: 'text-5xl', label: 'text-base' },
  };

  const classes = sizeClasses[size];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Decision Quality
        </h3>
        <span className={clsx(
          'px-2 py-1 rounded-full text-xs font-bold',
          config.bg,
          'text-white'
        )}>
          Grade {grade}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className={clsx('relative', classes.container)}>
          <svg className="transform -rotate-90 w-full h-full">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-100 dark:text-gray-800"
            />
            {/* Progress Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke={config.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx('font-bold text-gray-900 dark:text-white', classes.text)}>
              {score}
            </span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {config.label}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Based on {tradesAnalyzed} recent trades
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={clsx(
              'text-sm font-bold',
              improvement >= 0 ? 'text-emerald-500' : 'text-red-500'
            )}>
              {improvement >= 0 ? '+' : ''}{improvement}%
            </span>
            <span className="text-xs text-gray-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* Quality Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-3">
          <QualityIndicator label="Plan Adherence" value={92} color="#8B5CF6" />
          <QualityIndicator label="Risk Control" value={87} color="#3B82F6" />
          <QualityIndicator label="Emotional Balance" value={78} color="#10B981" />
          <QualityIndicator label="Strategy Compliance" value={85} color="#F59E0B" />
        </div>
      </div>
    </div>
  );
};

const QualityIndicator: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-bold" style={{ color }}>{value}%</span>
    </div>
    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export default DecisionQualityScore;
