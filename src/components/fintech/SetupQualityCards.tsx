import React from 'react';
import { clsx } from 'clsx';
import { Target, TrendingUp, Shield, Brain } from 'lucide-react';

interface SetupQuality {
  id: string;
  symbol: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  setupType: string;
  conviction: 'High' | 'Medium' | 'Low';
  riskReward: number;
  probability: number; // 0-100
  keyFactors: string[];
  time: string;
}

interface SetupQualityCardsProps {
  setups: SetupQuality[];
  onSelect?: (setup: SetupQuality) => void;
}

const gradeConfig = {
  A: { 
    color: '#10B981', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/20',
    label: 'High Probability',
    icon: Target,
  },
  B: { 
    color: '#3B82F6', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/20',
    label: 'Good Setup',
    icon: TrendingUp,
  },
  C: { 
    color: '#F59E0B', 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/20',
    label: 'Conditional',
    icon: Shield,
  },
  D: { 
    color: '#F97316', 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/20',
    label: 'Weak Setup',
    icon: Brain,
  },
  F: { 
    color: '#EF4444', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/20',
    label: 'Avoid',
    icon: Brain,
  },
};

export const SetupQualityCards: React.FC<SetupQualityCardsProps> = ({
  setups,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Recent Setups
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quality assessment of recent trade opportunities
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {setups.length} setups analyzed
        </span>
      </div>

      <div className="space-y-3">
        {setups.map((setup) => {
          const config = gradeConfig[setup.grade];
          const Icon = config.icon;

          return (
            <div
              key={setup.id}
              onClick={() => onSelect?.(setup)}
              className={clsx(
                'group cursor-pointer rounded-xl p-4 border transition-all duration-200',
                'hover:shadow-lg hover:-translate-y-0.5',
                config.bg,
                config.border,
                'bg-white dark:bg-gray-900'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Grade Badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: config.color }}
                  >
                    {setup.grade}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {setup.symbol}
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${config.color}20`,
                          color: config.color 
                        }}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {setup.setupType} • {setup.time}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-gray-500">R:R</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      1:{setup.riskReward.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-gray-500">Prob</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {setup.probability}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Factors */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap gap-2">
                  {setup.keyFactors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conviction Indicator */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Conviction:</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className={clsx(
                        'w-2 h-2 rounded-full',
                        (setup.conviction === 'High' && dot <= 3) ||
                        (setup.conviction === 'Medium' && dot <= 2) ||
                        (setup.conviction === 'Low' && dot <= 1)
                          ? 'bg-gray-400'
                          : 'bg-gray-200 dark:bg-gray-700'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                  {setup.conviction}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetupQualityCards;
