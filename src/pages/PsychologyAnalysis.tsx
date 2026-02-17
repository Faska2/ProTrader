import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { TradingPsychologyAnalyzer } from '../utils/TradingPsychologyAnalyzer';
import { PsychologicalProfileView } from '../components/psychology/PsychologicalProfileView';
import { Brain, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { FadeIn } from '../components/Animations';
import { Skeleton } from '../components/Skeleton';

const PsychologyAnalysisPage: React.FC = () => {
  const { trades, sessions, strategies, loading, settings } = useStore();
  const lang = settings.language || 'en';

  // Generate psychological profile
  const profile = useMemo(() => {
    if (trades.length < 5) return null;
    const analyzer = new TradingPsychologyAnalyzer(trades, sessions, strategies);
    return analyzer.generateProfile();
  }, [trades, sessions, strategies]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <InsufficientDataView lang={lang} tradesCount={trades.length} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <FadeIn>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {lang === 'en' ? 'Trading Psychology Analysis' : 'تحليل علم النفس التداولي'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {lang === 'en' 
                    ? 'Deep behavioral analysis to improve your trading discipline'
                    : 'تحليل سلوكي عميق لتحسين انضباطك في التداول'}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <FadeIn delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat 
              label="Overall Grade" 
              value={profile.grade} 
              color={getGradeColor(profile.grade)}
              icon={TrendingUp}
            />
            <QuickStat 
              label="Psych Score" 
              value={`${profile.overallScore}/100`}
              color="text-purple-600"
              icon={Brain}
            />
            <QuickStat 
              label="Patterns" 
              value={profile.behavioralPatterns.length.toString()}
              color="text-amber-600"
              icon={Activity}
            />
            <QuickStat 
              label="Red Flags" 
              value={profile.redFlags.length.toString()}
              color={profile.redFlags.length > 0 ? 'text-red-600' : 'text-emerald-600'}
              icon={AlertTriangle}
            />
          </div>
        </FadeIn>
      </div>

      {/* Main Analysis */}
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn delay={200}>
          <PsychologicalProfileView profile={profile} />
        </FadeIn>
      </div>
    </div>
  );
};

// Helper Components

const QuickStat: React.FC<{
  label: string;
  value: string;
  color: string;
  icon: React.ElementType;
}> = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  </div>
);

const InsufficientDataView: React.FC<{ lang: string; tradesCount: number }> = ({ lang, tradesCount }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6">
    <div className="max-w-lg text-center">
      <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <Brain className="w-12 h-12 text-purple-600 dark:text-purple-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {lang === 'en' ? 'Not Enough Data' : 'لا توجد بيانات كافية'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        {lang === 'en' 
          ? `You have ${tradesCount} trade(s) logged.`
          : `لديك ${tradesCount} صفقة مسجلة.`}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {lang === 'en' 
          ? 'We need at least 5 trades to generate a meaningful psychological profile. Keep logging your trades to unlock deep behavioral insights!'
          : 'نحتاج على الأقل 5 صفقات لإنشاء ملف نفسي ذي معنى. استمر في تسجيل صفقاتك لفتح رؤى سلوكية عميقة!'}
      </p>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
          {lang === 'en' ? 'What We Analyze:' : 'ما نقوم بتحليله:'}
        </h3>
        <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            {lang === 'en' ? 'Behavioral patterns (overtrading, revenge trading)' : 'الأنماط السلوكية (الإفراط في التداول، التداول الانتقامي)'}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            {lang === 'en' ? 'Risk management discipline' : 'انضباط إدارة المخاطر'}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            {lang === 'en' ? 'Psychological weaknesses (FOMO, loss aversion)' : 'الضعف النفسي (الخوف من فوات الفرصة، رهاب الخسارة)'}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            {lang === 'en' ? 'Strategy execution quality' : 'جودة تنفيذ الاستراتيجية'}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            {lang === 'en' ? 'Personalized improvement plan' : 'خطة تحسين مخصصة'}
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A': return 'text-emerald-600';
    case 'B': return 'text-blue-600';
    case 'C': return 'text-amber-600';
    case 'D': return 'text-orange-600';
    case 'F': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default PsychologyAnalysisPage;
