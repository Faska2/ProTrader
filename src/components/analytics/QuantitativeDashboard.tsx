import React from 'react';
import { clsx } from 'clsx';
import { 
  Brain, 
  Activity, 
  Target, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { QuantitativeMetrics } from '../../utils/QuantitativeAnalytics';

interface QuantitativeDashboardProps {
  metrics: QuantitativeMetrics;
}

export const QuantitativeDashboard: React.FC<QuantitativeDashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-8">
      {/* Header - Composite Score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Quantitative Analysis</h2>
            <p className="text-blue-100">
              Advanced mathematical metrics for professional trading assessment
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold">{metrics.compositeScore}</div>
            <div className="text-xl opacity-80">Grade {metrics.overallQuantitativeGrade}</div>
            <div className="text-sm opacity-60 mt-1">Composite Score</div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DecisionQualityCard dqi={metrics.decisionQualityIndex} />
        <EmotionalImpactCard eis={metrics.emotionalImpactScore} />
        <StrategyReliabilityCard src={metrics.strategyReliabilityCoefficient} />
        <SessionStabilityCard sps={metrics.sessionPerformanceStability} />
      </div>

      {/* Secondary Metrics */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Secondary Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SecondaryMetricCard
            label="Edge Consistency"
            value={(metrics.edgeConsistencyRatio * 100).toFixed(1)}
            unit="%"
            description="Win rate stability across time periods"
            color="text-emerald-500"
          />
          <SecondaryMetricCard
            label="Risk-Adj Discipline"
            value={metrics.riskAdjustedDiscipline.toString()}
            unit="/100"
            description="Discipline adjusted for risk levels"
            color="text-blue-500"
          />
          <SecondaryMetricCard
            label="Behavioral Entropy"
            value={(metrics.behavioralEntropy * 100).toFixed(1)}
            unit="%"
            description="Systematic vs random behavior"
            color="text-amber-500"
          />
          <SecondaryMetricCard
            label="Market Adaptability"
            value={metrics.marketAdaptabilityIndex.toString()}
            unit="/100"
            description="Performance across market conditions"
            color="text-purple-500"
          />
        </div>
      </div>

      {/* Formula Reference */}
      <FormulaReferenceSection />
    </div>
  );
};

// ==========================================
// DECISION QUALITY INDEX CARD
// ==========================================

const DecisionQualityCard: React.FC<{ dqi: QuantitativeMetrics['decisionQualityIndex'] }> = ({ dqi }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Decision Quality Index</h3>
      </div>
      <div className={clsx('px-3 py-1 rounded-full text-sm font-bold', getGradeColor(dqi.grade))}>
        {dqi.grade}
      </div>
    </div>

    <div className="text-center mb-6">
      <div className="text-4xl font-bold text-gray-900 dark:text-white">{dqi.score}</div>
      <div className="text-sm text-gray-500">95% CI: [{dqi.confidenceInterval[0]}, {dqi.confidenceInterval[1]}]</div>
    </div>

    <div className="space-y-3">
      <ComponentBar label="Plan Quality" value={dqi.components.planQuality} weight={25} color="bg-blue-500" />
      <ComponentBar label="Risk Management" value={dqi.components.riskManagement} weight={25} color="bg-emerald-500" />
      <ComponentBar label="Execution" value={dqi.components.executionPrecision} weight={20} color="bg-purple-500" />
      <ComponentBar label="Emotional Control" value={dqi.components.emotionalControl} weight={15} color="bg-amber-500" />
      <ComponentBar label="Documentation" value={dqi.components.documentation} weight={15} color="bg-cyan-500" />
    </div>

    {dqi.violations.length > 0 && (
      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Violations Detected:</p>
        <ul className="text-xs text-red-600 dark:text-red-300 space-y-1">
          {dqi.violations.map((v: string, i: number) => (
            <li key={i}>• {v}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// ==========================================
// EMOTIONAL IMPACT SCORE CARD
// ==========================================

const EmotionalImpactCard: React.FC<{ eis: QuantitativeMetrics['emotionalImpactScore'] }> = ({ eis }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Emotional Impact Score</h3>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{eis.score}</div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{eis.emotionalAwareness.toFixed(0)}%</div>
        <div className="text-xs text-gray-500">Awareness</div>
      </div>
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{(eis.emotionalStability * 100).toFixed(0)}%</div>
        <div className="text-xs text-gray-500">Stability</div>
      </div>
    </div>

    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">Emotional Bias</span>
        <span className={clsx('font-bold', eis.emotionalBiasIndex > 0.3 ? 'text-red-500' : 'text-emerald-500')}>
          {eis.emotionalBiasIndex > 0 ? '+' : ''}{eis.emotionalBiasIndex.toFixed(2)}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={clsx('h-full rounded-full', eis.emotionalBiasIndex > 0.3 ? 'bg-red-500' : 'bg-emerald-500')}
          style={{ width: `${Math.min(Math.abs(eis.emotionalBiasIndex) * 100, 100)}%` }}
        />
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dominant Emotions:</p>
      <div className="flex flex-wrap gap-2">
        {eis.dominantEmotions.slice(0, 3).map((emotion: { emotion: string; frequency: number; winRate: number }, i: number) => (
          <span 
            key={i} 
            className={clsx(
              'px-2 py-1 rounded text-xs font-medium',
              emotion.winRate > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            )}
          >
            {emotion.emotion} ({emotion.frequency}%)
          </span>
        ))}
      </div>
    </div>

    {eis.recommendations.length > 0 && (
      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">💡 Recommendations:</p>
        <p className="text-xs text-purple-600 dark:text-purple-300">{eis.recommendations[0]}</p>
      </div>
    )}
  </div>
);

// ==========================================
// STRATEGY RELIABILITY CARD
// ==========================================

const StrategyReliabilityCard: React.FC<{ src: QuantitativeMetrics['strategyReliabilityCoefficient'] }> = ({ src }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <PieChart className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategy Reliability</h3>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{src.overallCoefficient}</div>
    </div>

    <div className="space-y-3 mb-4">
      {src.strategyScores.slice(0, 3).map((strategy: { strategy: string; winRate: number; profitFactor: number; sampleSize: number; coefficient: number; reliability: 'high' | 'medium' | 'low' | 'untested' }, i: number) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{strategy.strategy}</p>
            <p className="text-xs text-gray-500">
              WR: {strategy.winRate.toFixed(0)}% | PF: {strategy.profitFactor.toFixed(2)} | n={strategy.sampleSize}
            </p>
          </div>
          <div className={clsx(
            'px-2 py-1 rounded text-xs font-bold',
            strategy.reliability === 'high' ? 'bg-emerald-100 text-emerald-700' :
            strategy.reliability === 'medium' ? 'bg-amber-100 text-amber-700' :
            strategy.reliability === 'low' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          )}>
            {strategy.coefficient}
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">Best: <span className="font-medium text-emerald-600">{src.bestStrategy || 'N/A'}</span></span>
      <span className="text-gray-600 dark:text-gray-400">Diversification: <span className="font-medium">{src.diversificationScore}%</span></span>
    </div>
  </div>
);

// ==========================================
// SESSION STABILITY CARD
// ==========================================

const SessionStabilityCard: React.FC<{ sps: QuantitativeMetrics['sessionPerformanceStability'] }> = ({ sps }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Session Stability</h3>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{sps.stabilityScore}</div>
    </div>

    <div className="space-y-3 mb-4">
      {sps.sessionBreakdown.slice(0, 3).map((session: { session: string; trades: number; totalProfit: number; winRate: number; trend: 'improving' | 'stable' | 'declining' }, i: number) => (
        <div key={i} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{session.session}</p>
            <p className="text-xs text-gray-500">
              {session.trades} trades | ${session.totalProfit.toFixed(0)} | 
              <span className={clsx(
                session.trend === 'improving' ? 'text-emerald-500' :
                session.trend === 'declining' ? 'text-red-500' :
                'text-gray-500'
              )}>
                {' '}{session.trend}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 dark:text-white">{session.winRate.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">win rate</p>
          </div>
        </div>
      ))}
    </div>

    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600 dark:text-gray-400">Most Stable:</span>
        <span className="font-medium text-emerald-600">{sps.mostStableSession || 'N/A'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Best Time:</span>
        <span className="font-medium text-blue-600">
          {sps.timeBasedPatterns.bestHour !== null ? `${sps.timeBasedPatterns.bestHour}:00` : 'N/A'}
        </span>
      </div>
    </div>
  </div>
);

// ==========================================
// HELPER COMPONENTS
// ==========================================

const ComponentBar: React.FC<{
  label: string;
  value: number;
  weight: number;
  color: string;
}> = ({ label, value, weight, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600 dark:text-gray-400">{label} <span className="text-xs">({weight}%)</span></span>
      <span className="font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div 
        className={clsx('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const SecondaryMetricCard: React.FC<{
  label: string;
  value: string;
  unit: string;
  description: string;
  color: string;
}> = ({ label, value, unit, description, color }) => (
  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className={clsx('text-2xl font-bold', color)}>
      {value}<span className="text-sm">{unit}</span>
    </p>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

// ==========================================
// FORMULA REFERENCE SECTION
// ==========================================

const FormulaReferenceSection: React.FC = () => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
      <LineChart className="w-5 h-5 text-blue-500" />
      Formula Reference
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormulaCard
        title="Decision Quality Index (DQI)"
        formula="DQI = Σ(wi × Ci) × (1 - Penalty) × Multiplier"
        components={[
          'wi = Weight for component i',
          'Ci = Component score (0-100)',
          'Penalty = Violation reduction',
          'Multiplier = Consistency bonus'
        ]}
        interpretation="Measures trading decision quality independent of outcome"
      />
      
      <FormulaCard
        title="Emotional Impact Score (EIS)"
        formula="EIS = Awareness × (1 + Stability) × Correlation"
        components={[
          'Awareness = % with emotion tracked',
          'Stability = Emotional consistency',
          'Correlation = Emotion-performance link'
        ]}
        interpretation="Quantifies emotional component and its impact on performance"
      />
      
      <FormulaCard
        title="Strategy Reliability Coefficient (SRC)"
        formula="SRC = (WR × PF × Consistency) / Volatility"
        components={[
          'WR = Win rate (normalized)',
          'PF = Profit factor × 25',
          'Consistency = 1 - Coefficient of Variation'
        ]}
        interpretation="Statistical reliability of trading strategies"
      />
      
      <FormulaCard
        title="Session Performance Stability (SPS)"
        formula="SPS = 1 - (StdDev(Session P&L) / Mean(Session P&L))"
        components={[
          'StdDev = Standard deviation',
          'Lower volatility = Higher stability',
          'Normalized to 0-100 scale'
        ]}
        interpretation="Consistency across different trading sessions"
      />
    </div>
  </div>
);

const FormulaCard: React.FC<{
  title: string;
  formula: string;
  components: string[];
  interpretation: string;
}> = ({ title, formula, components, interpretation }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
    <div className="bg-gray-100 dark:bg-gray-900 rounded p-2 mb-3 font-mono text-sm text-gray-700 dark:text-gray-300">
      {formula}
    </div>
    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
      {components.map((comp, i) => (
        <li key={i}>• {comp}</li>
      ))}
    </ul>
    <p className="text-xs text-gray-500 italic">{interpretation}</p>
  </div>
);

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A': return 'bg-emerald-500 text-white';
    case 'B': return 'bg-blue-500 text-white';
    case 'C': return 'bg-amber-500 text-white';
    case 'D': return 'bg-orange-500 text-white';
    case 'F': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export default QuantitativeDashboard;
