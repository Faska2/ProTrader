import React, { useMemo } from 'react'
import { Brain, AlertCircle, TrendingUp, Heart, Zap, Target } from 'lucide-react'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'

const Psychology: React.FC = () => {
    const { trades, settings } = useStore()
    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>

    // Psychology Data Analysis
    const analysis = useMemo(() => {
        const total = trades.length
        if (total === 0) return {
            discipline: 0,
            stability: 0,
            riskAdherence: 0,
            mistakes: [],
            emotionStats: []
        }

        // 1. Discipline Score (based on having notes and strategy selection)
        const withNotes = trades.filter((t: Trade) => t.notes && t.notes.length > 20).length
        const withStrategy = trades.filter((t: Trade) => t.strategy).length
        const noMistakes = trades.filter((t: Trade) => !t.mistakes || t.mistakes.length === 0).length
        const discipline = Math.round(((withNotes / total + withStrategy / total + noMistakes / total) / 3) * 100)

        // 2. Emotional Stability (based on emotion consistency)
        const positiveEmotions = ['Focused', 'Disciplined', 'Patient']
        const stableTrades = trades.filter((t: Trade) => positiveEmotions.includes(t.emotionBefore || '')).length
        const stability = Math.round((stableTrades / total) * 100)

        // 3. Risk Adherence (based on SL/TP presence)
        const withRiskPlan = trades.filter((t: Trade) => t.sl > 0 && t.tp > 0).length
        const riskAdherence = Math.round((withRiskPlan / total) * 100)

        // 4. Mistakes Ranking
        const mistakeCounts: Record<string, number> = {}
        trades.forEach((t: Trade) => {
            t.mistakes?.forEach(m => {
                mistakeCounts[m] = (mistakeCounts[m] || 0) + 1
            })
        })
        const mistakes = Object.entries(mistakeCounts)
            .map(([label, count]) => ({ label, count, tendency: 'Stable' }))
            .sort((a, b) => b.count - a.count)

        // 5. Win Rate by Emotion
        const emotionMap: Record<string, { total: number, wins: number }> = {}
        trades.forEach((t: Trade) => {
            const e = t.emotionBefore || 'Neutral'
            if (!emotionMap[e]) emotionMap[e] = { total: 0, wins: 0 }
            emotionMap[e].total++
            if (t.profit > 0) emotionMap[e].wins++
        })
        const emotionStats = Object.entries(emotionMap).map(([emotion, stats]) => ({
            emotion,
            winRate: Math.round((stats.wins / stats.total) * 100)
        }))

        return {
            discipline,
            stability,
            riskAdherence,
            mistakes,
            emotionStats
        }
    }, [trades])

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mindset Overview */}
                <div className="card">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-blue-500" />
                        {t.psychologyAnalysis}
                    </h3>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium">{t.disciplineScore}</span>
                                </div>
                                <span className="text-xl font-bold text-green-500">{analysis.discipline}%</span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.3)]" style={{ width: `${analysis.discipline}%` }}></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                {lang === 'en' ? 'Based on strategy adherence and journaling consistency' : 'يعتمد على الالتزام بالاستراتيجية والتدوين المستمر'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium">{t.emotionalStability}</span>
                                </div>
                                <span className="text-xl font-bold text-blue-500">{analysis.stability}%</span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${analysis.stability}%` }}></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                {lang === 'en' ? 'Frequency of trading while focused and patient' : 'نسبة التداول في حالة التركيز والصبر'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-medium">{t.riskAdherence}</span>
                                </div>
                                <span className="text-xl font-bold text-purple-500">{analysis.riskAdherence}%</span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.3)]" style={{ width: `${analysis.riskAdherence}%` }}></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                {lang === 'en' ? 'Consistent use of Stop Loss and Take Profit levels' : 'الاستخدام المتواصل لمستويات وقف الخسارة وجني الأرباح'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Common Mistakes */}
                <div className="card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        {lang === 'en' ? 'Mistake Patterns' : 'أنماط الأخطاء'}
                    </h3>

                    <div className="space-y-4">
                        {analysis.mistakes.length > 0 ? analysis.mistakes.map(mistake => (
                            <div key={mistake.label} className="p-5 bg-red-500/[0.03] border border-red-500/10 rounded-2xl flex justify-between items-center group hover:bg-red-500/[0.06] transition-all">
                                <div>
                                    <h4 className="font-bold text-red-500/90">{mistake.label}</h4>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {lang === 'en' ? `Detected in ${mistake.count} trades` : `تم اكتشافه في ${mistake.count} صفقات`}
                                    </p>
                                </div>
                                <div className="px-3 py-1 bg-red-500/10 rounded-lg text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                    {lang === 'en' ? 'CRITICAL' : 'حرج'}
                                </div>
                            </div>
                        )) : (
                            <div className="py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl flex flex-col items-center gap-3">
                                <Target className="w-10 h-10 opacity-20" />
                                <p className="font-medium">
                                    {lang === 'en' ? 'No major mistakes detected yet. Keep up the discipline!' : 'لم يتم اكتشاف أي أخطاء جسيمة بعد. استمر في الانضباط!'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Win Rate by Emotion */}
            <div className="card">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    {lang === 'en' ? 'Win Rate by Primary Emotion' : 'نسبة النجاح حسب الشعور الأساسي'}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {analysis.emotionStats.length > 0 ? analysis.emotionStats.map(stat => (
                        <div key={stat.emotion} className="p-6 bg-background border border-border rounded-2xl text-center group hover:border-blue-500/50 transition-all shadow-sm dark:shadow-none translate-y-0 hover:-translate-y-1">
                            <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-bold">{stat.emotion}</p>
                            <p className={clsx(
                                "text-3xl font-bold",
                                stat.winRate > 50 ? "text-blue-500" : "text-muted-foreground"
                            )}>{stat.winRate}%</p>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            {lang === 'en' ? 'Not enough emotional data. Start tagging emotions when logging trades.' : 'لا توجد بيانات كافية لمشاعر التداول. ابدأ بتحديد المشاعر عند تسجيل الصفقات.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ')

export default Psychology
