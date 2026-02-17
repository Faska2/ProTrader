import React from 'react';
import { clsx } from 'clsx';
import { 
  AlertTriangle, 
  AlertCircle, 
  Brain, 
  TrendingUp, 
  Shield, 
  Target,
  Clock,
  CheckCircle,
  Activity,
  BookOpen,
  Flame,
  Zap
} from 'lucide-react';
import { 
  PsychologicalProfile, 
  BehavioralPattern,
  RiskViolation,
  PsychologicalWeakness,
  ActionItem,
  RedFlag,
  Strength
} from '../../utils/TradingPsychologyAnalyzer';

interface PsychologicalProfileViewProps {
  profile: PsychologicalProfile;
}

export const PsychologicalProfileView: React.FC<PsychologicalProfileViewProps> = ({ profile }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500 text-white';
      case 'B': return 'bg-blue-500 text-white';
      case 'C': return 'bg-amber-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'F': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Overall Assessment */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={clsx('w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg', getGradeColor(profile.grade))}>
              {profile.grade}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Psychological Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Based on {profile.behavioralPatterns.reduce((sum: number, p: BehavioralPattern) => sum + p.tradesAffected, 0)} trades analyzed
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(profile.analysisDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Overall Score</p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {profile.overallScore}
              <span className="text-2xl text-gray-400 font-normal">/100</span>
            </p>
          </div>
        </div>

        {/* Red Flags Alert */}
        {profile.redFlags.length > 0 && (
          <div className="mt-6 space-y-3">
            {profile.redFlags.map((flag: RedFlag) => (
              <div 
                key={flag.id}
                className={clsx(
                  'flex items-start gap-3 p-4 rounded-xl border',
                  flag.severity === 'critical' 
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                    : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                )}
              >
                {flag.severity === 'critical' ? (
                  <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={clsx('font-bold', flag.severity === 'critical' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400')}>
                    {flag.issue}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {flag.description}
                  </p>
                  <p className={clsx('text-sm font-medium mt-2', flag.severity === 'critical' ? 'text-red-600 dark:text-red-300' : 'text-amber-600 dark:text-amber-300')}>
                    ⚠️ {flag.urgentAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <BehavioralPatternsPanel patterns={profile.behavioralPatterns} />
          <PsychologicalWeaknessesPanel weaknesses={profile.psychologicalWeaknesses} />
          <StrengthsPanel strengths={profile.strengths} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RiskAnalysisPanel risk={profile.riskManagement} />
          <StrategyExecutionPanel execution={profile.strategyExecution} />
          <ConsistencyPanel metrics={profile.consistencyMetrics} />
        </div>
      </div>

      {/* Improvement Plan */}
      <ImprovementPlanView plan={profile.improvementPlan} />
    </div>
  );
};

// ==========================================
// BEHAVIORAL PATTERNS PANEL
// ==========================================

const BehavioralPatternsPanel: React.FC<{ patterns: BehavioralPattern[] }> = ({ patterns }) => {
  if (patterns.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Behavioral Patterns</h3>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <p className="text-emerald-700 dark:text-emerald-400">
            Excellent! No significant behavioral patterns detected. Your trading discipline is strong.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Behavioral Patterns</h3>
        </div>
        <span className="text-sm text-gray-500">{patterns.length} patterns identified</span>
      </div>

      <div className="space-y-4">
        {patterns.map(pattern => (
          <div key={pattern.id} className="border-l-4 border-purple-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-gray-900 dark:text-white">{pattern.name}</h4>
              <div className="flex items-center gap-2">
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  pattern.frequency === 'persistent' ? 'bg-red-100 text-red-700' :
                  pattern.frequency === 'frequent' ? 'bg-orange-100 text-orange-700' :
                  pattern.frequency === 'occasional' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {pattern.frequency}
                </span>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  pattern.impact === 'critical' ? 'bg-red-100 text-red-700' :
                  pattern.impact === 'high' ? 'bg-orange-100 text-orange-700' :
                  pattern.impact === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                )}>
                  {pattern.impact} impact
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {pattern.description}
            </p>
            <p className="text-xs text-gray-500">
              Affected {pattern.tradesAffected} trades
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// RISK ANALYSIS PANEL
// ==========================================

const RiskAnalysisPanel: React.FC<{ risk: any }> = ({ risk }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-amber-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Risk Management</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Position Sizing</p>
          <p className={clsx('text-2xl font-bold', getGradeColor(risk.positionSizingGrade))}>
            {risk.positionSizingGrade}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg: {risk.averageRiskPerTrade.toFixed(1)}%</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Risk:Reward</p>
          <p className={clsx('text-2xl font-bold', getGradeColor(risk.riskRewardGrade))}>
            {risk.riskRewardGrade}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg: 1:{risk.averageRiskPerTrade.toFixed(1)}</p>
        </div>
      </div>

      {risk.riskViolations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
            Violations Detected
          </h4>
          {risk.riskViolations.map((violation: RiskViolation, idx: number) => (
            <div 
              key={idx}
              className={clsx(
                'p-3 rounded-lg text-sm',
                violation.severity === 'critical' 
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{violation.type.replace(/_/g, ' ').toUpperCase()}</span>
              </div>
              <p className="text-xs opacity-80">
                {violation.occurrences} occurrences • {violation.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Risk Score</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{risk.overallScore}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PSYCHOLOGICAL WEAKNESSES PANEL
// ==========================================

const PsychologicalWeaknessesPanel: React.FC<{ weaknesses: PsychologicalWeakness[] }> = ({ weaknesses }) => {
  if (weaknesses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Psychological Profile</h3>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <p className="text-emerald-700 dark:text-emerald-400">
            Strong psychological profile! No major weaknesses identified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Psychological Weaknesses</h3>
        </div>
        <span className="text-sm text-gray-500">{weaknesses.length} identified</span>
      </div>

      <div className="space-y-4">
        {weaknesses.map(weakness => (
          <div key={weakness.id} className="border-l-4 border-red-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-gray-900 dark:text-white">{weakness.name}</h4>
              <div className="flex items-center gap-2">
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  weakness.severity === 'severe' ? 'bg-red-100 text-red-700' :
                  weakness.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                  'bg-amber-100 text-amber-700'
                )}>
                  {weakness.severity}
                </span>
                <span className="text-xs text-gray-500">{weakness.frequency}% of trades</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {weakness.description}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Common Triggers:</p>
              <div className="flex flex-wrap gap-2">
                {weakness.triggers.map((trigger: string, idx: number) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-2">
                💡 Recommended Countermeasures:
              </p>
              <ul className="text-xs text-purple-600 dark:text-purple-300 space-y-1">
                {weakness.countermeasures.slice(0, 2).map((measure: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// STRATEGY EXECUTION PANEL
// ==========================================

const StrategyExecutionPanel: React.FC<{ execution: any }> = ({ execution }) => {
  const metrics = [
    { label: 'Plan Adherence', value: execution.planAdherence, icon: Target, color: 'bg-blue-500' },
    { label: 'Entry Timing', value: execution.entryTiming, icon: Clock, color: 'bg-emerald-500' },
    { label: 'Exit Timing', value: execution.exitTiming, icon: Clock, color: 'bg-amber-500' },
    { label: 'Strategy Consistency', value: execution.strategyConsistency, icon: Activity, color: 'bg-purple-500' },
    { label: 'Rule Following', value: execution.ruleFollowing, icon: CheckCircle, color: 'bg-cyan-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-cyan-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategy Execution</h3>
      </div>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Overall Execution Score</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{execution.overallScore}</p>
      </div>

      <div className="space-y-4">
        {metrics.map(metric => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.label}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {metric.value.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={clsx('h-full rounded-full transition-all duration-500', metric.color)}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// CONSISTENCY PANEL
// ==========================================

const ConsistencyPanel: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Consistency Metrics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.winRate.toFixed(1)}%</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Profit Factor</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.profitFactor.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Expectancy</p>
          <p className={clsx('text-xl font-bold', metrics.expectancy >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            ${metrics.expectancy.toFixed(2)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500">Best Streak</p>
          <p className="text-xl font-bold text-emerald-500">{metrics.consecutiveWins}W</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STRENGTHS PANEL
// ==========================================

const StrengthsPanel: React.FC<{ strengths: Strength[] }> = ({ strengths }) => {
  if (strengths.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Strengths</h3>
      </div>

      <div className="space-y-4">
        {strengths.map(strength => (
          <div key={strength.id} className="border-l-4 border-emerald-500 pl-4 py-2">
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{strength.area}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {strength.description}
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                <span className="font-medium">💪 Leverage:</span> {strength.leverageOpportunity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// IMPROVEMENT PLAN VIEW
// ==========================================

const ImprovementPlanView: React.FC<{ plan: any }> = ({ plan }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Improvement Plan</h2>
      </div>

      {/* Immediate Actions */}
      {plan.immediateActions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Immediate Actions (Do Today)
          </h3>
          <div className="space-y-3">
            {plan.immediateActions.map((action: ActionItem) => (
              <ActionCard key={action.id} action={action} type="critical" />
            ))}
          </div>
        </div>
      )}

      {/* Short Term Goals */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-4">
          Short-Term Goals (1-4 Weeks)
        </h3>
        <div className="space-y-3">
          {plan.shortTermGoals.map((action: ActionItem) => (
            <ActionCard key={action.id} action={action} type="high" />
          ))}
        </div>
      </div>

      {/* Medium Term Goals */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
          Medium-Term Goals (1-3 Months)
        </h3>
        <div className="space-y-3">
          {plan.mediumTermGoals.map((action: ActionItem) => (
            <ActionCard key={action.id} action={action} type="medium" />
          ))}
        </div>
      </div>

      {/* Daily Routines */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Daily Routines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.dailyRoutines.map((routine: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-xs font-bold uppercase px-2 py-0.5 rounded',
                  routine.timeOfDay === 'pre-market' ? 'bg-blue-100 text-blue-700' :
                  routine.timeOfDay === 'during-market' ? 'bg-amber-100 text-amber-700' :
                  routine.timeOfDay === 'post-market' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {routine.timeOfDay.replace('-', ' ')}
                </span>
                <span className="text-xs text-gray-500">{routine.duration}</span>
              </div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">{routine.activity}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{routine.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Psychological Exercises */}
      <div>
        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Psychological Exercises
        </h3>
        <div className="space-y-4">
          {plan.psychologicalExercises.map((exercise: any, idx: number) => (
            <div key={idx} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-400">{exercise.name}</h4>
                <span className="text-xs px-2 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded">
                  {exercise.frequency}
                </span>
              </div>
              <ul className="text-sm text-emerald-800 dark:text-emerald-300 space-y-1 mb-3">
                {exercise.instructions.map((instruction: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500">{i + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">
                💡 {exercise.expectedBenefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{ action: ActionItem; type: string }> = ({ action, type }) => {
  const colors = {
    critical: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    high: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    medium: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  };

  return (
    <div className={clsx('p-4 rounded-xl border', colors[type as keyof typeof colors])}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-gray-900 dark:text-white">{action.title}</h4>
        <span className={clsx(
          'text-xs px-2 py-0.5 rounded-full font-medium',
          action.category === 'risk' ? 'bg-red-100 text-red-700' :
          action.category === 'psychology' ? 'bg-purple-100 text-purple-700' :
          action.category === 'strategy' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        )}>
          {action.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {action.description}
      </p>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="text-gray-500">
          <span className="font-medium">Target:</span> {action.measurableTarget}
        </span>
        <span className="text-gray-500">
          <span className="font-medium">Timeframe:</span> {action.timeframe}
        </span>
      </div>
    </div>
  );
};

export default PsychologicalProfileView;
