import React, { useMemo } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Flame, Target } from 'lucide-react';
import { useStore, Trade } from '../store/useStore';
import { translations } from '../utils/translations';
import { DecisionQualityScore } from '../components/fintech/DecisionQualityScore';
import { DisciplineRadarChart } from '../components/fintech/DisciplineRadarChart';
import { SetupQualityCards } from '../components/fintech/SetupQualityCards';
import { DashboardSkeleton } from '../components/Skeleton';
import { FadeIn } from '../components/Animations';
import { clsx } from 'clsx';

// ============================================
// FINTECH DASHBOARD REDESIGN
// Focus: Decision Quality over Profit
// Layout: 3-Zone System for 5-Second Insights
// ============================================

const FinTechDashboard: React.FC = () => {
  const { trades, settings, loading } = useStore();
  const lang = settings.language || 'en';
  const t = translations[lang] as Record<string, string>;

  // ==========================================
  // CALCULATE METRICS (Decision Quality Focus)
  // ==========================================
  
  const metrics = useMemo(() => {
    if (trades.length === 0) return null;

    const totalTrades = trades.length;
    const wins = trades.filter((t: Trade) => t.profit > 0).length;
    const losses = totalTrades - wins;
    
    // Decision Quality Components
    const tradesWithPlan = trades.filter((t: Trade) => t.rrPlanned && t.rrPlanned > 0).length;
    const tradesWithEmotion = trades.filter((t: Trade) => t.emotionBefore).length;
    const tradesWithStrategy = trades.filter((t: Trade) => t.strategy && t.strategy !== '').length;
    const tradesWithRules = trades.filter((t: Trade) => t.rulesUsed && t.rulesUsed.length > 0).length;
    
    // Calculate Decision Quality Score (0-100)
    const planAdherence = (tradesWithPlan / totalTrades) * 100;
    const emotionalTracking = (tradesWithEmotion / totalTrades) * 100;
    const strategyCompliance = (tradesWithStrategy / totalTrades) * 100;
    const rulesFollowing = (tradesWithRules / totalTrades) * 100;
    const riskManagement = trades.reduce((acc, t) => {
      const hasProperRisk = t.riskPercent && t.riskPercent <= 2; // Max 2% risk
      return acc + (hasProperRisk ? 1 : 0);
    }, 0) / totalTrades * 100;

    const decisionQualityScore = Math.round(
      (planAdherence * 0.25) +
      (emotionalTracking * 0.20) +
      (strategyCompliance * 0.20) +
      (rulesFollowing * 0.20) +
      (riskManagement * 0.15)
    );

    // Determine Grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (decisionQualityScore >= 90) grade = 'A';
    else if (decisionQualityScore >= 80) grade = 'B';
    else if (decisionQualityScore >= 70) grade = 'C';
    else if (decisionQualityScore >= 60) grade = 'D';

    // Win Rate (outcome metric - secondary)
    const winRate = Math.round((wins / totalTrades) * 100);

    // Streak Calculation
    let currentStreak = 0;
    let maxStreak = 0;
    for (const trade of trades) {
      if (trade.profit > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Recent Mistakes
    const recentMistakes = trades
      .filter((t: Trade) => t.mistakes && t.mistakes.length > 0)
      .slice(0, 5)
      .flatMap((t: Trade) => t.mistakes || []);
    
    const mistakeCounts = recentMistakes.reduce((acc: Record<string, number>, mistake: string) => {
      acc[mistake] = (acc[mistake] || 0) + 1;
      return acc;
    }, {});

    const topMistakes = Object.entries(mistakeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      decisionQualityScore,
      grade,
      totalTrades,
      winRate,
      currentStreak,
      maxStreak,
      planAdherence,
      emotionalTracking,
      strategyCompliance,
      rulesFollowing,
      riskManagement,
      topMistakes,
    };
  }, [trades]);

  // Mock setup quality data (in real app, this would come from analysis)
  const setupQualityData = useMemo(() => [
    {
      id: '1',
      symbol: 'EURUSD',
      grade: 'A' as const,
      setupType: 'Breakout Pullback',
      conviction: 'High' as const,
      riskReward: 2.5,
      probability: 75,
      keyFactors: ['Trend Alignment', 'Volume Confirm', 'Key Level'],
      time: '2 hours ago',
    },
    {
      id: '2',
      symbol: 'GBPUSD',
      grade: 'B' as const,
      setupType: 'Range Play',
      conviction: 'Medium' as const,
      riskReward: 1.8,
      probability: 62,
      keyFactors: ['Support Test', 'Low Volume'],
      time: '5 hours ago',
    },
    {
      id: '3',
      symbol: 'XAUUSD',
      grade: 'C' as const,
      setupType: 'News Reaction',
      conviction: 'Low' as const,
      riskReward: 1.2,
      probability: 45,
      keyFactors: ['High Volatility', 'Spread Wide'],
      time: 'Yesterday',
    },
  ], []);

  if (loading) return <DashboardSkeleton />;
  if (!metrics) return <EmptyDashboard lang={lang} />;

  // Radar chart data
  const radarData = [
    { subject: 'Plan', score: Math.round(metrics.planAdherence), fullMark: 100 },
    { subject: 'Risk', score: Math.round(metrics.riskManagement), fullMark: 100 },
    { subject: 'Mindset', score: Math.round(metrics.emotionalTracking), fullMark: 100 },
    { subject: 'Strategy', score: Math.round(metrics.strategyCompliance), fullMark: 100 },
    { subject: 'Rules', score: Math.round(metrics.rulesFollowing), fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ==========================================
          ZONE 1: AT-A-GLANCE HEADER
          Purpose: Instant state recognition (< 5 seconds)
          ========================================== */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Decision Quality (Primary Metric) */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  style={{ 
                    backgroundColor: metrics.grade === 'A' ? '#10B981' : 
                                    metrics.grade === 'B' ? '#3B82F6' :
                                    metrics.grade === 'C' ? '#F59E0B' :
                                    metrics.grade === 'D' ? '#F97316' : '#EF4444'
                  }}
                >
                  {metrics.grade}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Decision Quality
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.decisionQualityScore}
                    <span className="text-sm text-gray-400 font-normal">/100</span>
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />

              {/* Streak Counter */}
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Win Streak
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {metrics.currentStreak}
                    <span className="text-sm text-gray-400 font-normal ml-1">
                      ({metrics.maxStreak} best)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex items-center gap-6">
              <StatusIndicator 
                label="Win Rate"
                value={`${metrics.winRate}%`}
                trend={metrics.winRate > 50 ? 'up' : 'down'}
              />
              <StatusIndicator 
                label="Total Trades"
                value={metrics.totalTrades.toString()}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN CONTENT: 2-COLUMN LAYOUT
          ========================================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Discipline & Behavior (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <FadeIn direction="left" delay={0}>
              <DecisionQualityScore
                score={metrics.decisionQualityScore}
                grade={metrics.grade}
                tradesAnalyzed={metrics.totalTrades}
                improvement={5.2}
                size="md"
              />
            </FadeIn>

            <FadeIn direction="left" delay={100}>
              <DisciplineRadarChart 
                data={radarData} 
                average={metrics.decisionQualityScore}
              />
            </FadeIn>

            <FadeIn direction="left" delay={200}>
              <MistakesPanel mistakes={metrics.topMistakes} lang={lang} />
            </FadeIn>
          </div>

          {/* RIGHT COLUMN: Setups & Activity (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <FadeIn direction="right" delay={0}>
              <SetupQualityCards setups={setupQualityData} />
            </FadeIn>

            {/* Quick Actions Bar */}
            <FadeIn direction="up" delay={100}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Ready to trade?</h3>
                      <p className="text-blue-100 text-sm">
                        Log your setup before entering the market
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                    Log Setup
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Recent Activity Summary */}
            <FadeIn direction="up" delay={200}>
              <RecentActivity trades={trades.slice(0, 5)} lang={lang} />
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const StatusIndicator: React.FC<{
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ label, value, trend = 'neutral' }) => (
  <div className="text-right">
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </p>
    <div className="flex items-center gap-2 justify-end">
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
      {trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
    </div>
  </div>
);

const MistakesPanel: React.FC<{
  mistakes: [string, number][];
  lang: string;
}> = ({ mistakes, lang }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-2 mb-4">
      <AlertCircle className="w-5 h-5 text-orange-500" />
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {lang === 'en' ? 'Recent Patterns' : 'الأنماط الأخيرة'}
      </h3>
    </div>

    {mistakes.length > 0 ? (
      <div className="space-y-3">
        {mistakes.map(([mistake, count]) => (
          <div key={mistake} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">{mistake}</span>
                <span className="text-xs font-bold text-gray-500">{count}x</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((count / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
        <CheckCircle className="w-5 h-5 text-emerald-500" />
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {lang === 'en' 
            ? 'Great job! No recurring mistakes detected.' 
            : 'أحسنت! لم يتم اكتشاف أخطاء متكررة.'}
        </p>
      </div>
    )}
  </div>
);

const RecentActivity: React.FC<{
  trades: Trade[];
  lang: string;
}> = ({ trades, lang }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
      {lang === 'en' ? 'Recent Activity' : 'النشاط الأخير'}
    </h3>
    
    <div className="space-y-3">
      {trades.map((trade, idx) => (
        <div 
          key={trade.id}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm',
              trade.profit > 0 
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {trade.symbol.slice(0, 1)}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{trade.symbol}</p>
              <p className="text-xs text-gray-500">{trade.strategy || 'No Strategy'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={clsx(
              'font-bold',
              trade.profit > 0 ? 'text-emerald-500' : 'text-red-500'
            )}>
              {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">{trade.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyDashboard: React.FC<{ lang: string }> = ({ lang }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="w-10 h-10 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {lang === 'en' ? 'Start Your Trading Journey' : 'ابدأ رحلتك في التداول'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {lang === 'en' 
          ? 'Log your first trade to see your decision quality metrics'
          : 'سجل صفقتك الأولى لرؤية مقاييس جودة القرار'}
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
        {lang === 'en' ? 'Add First Trade' : 'أضف أول صفقة'}
      </button>
    </div>
  </div>
);

export default FinTechDashboard;
