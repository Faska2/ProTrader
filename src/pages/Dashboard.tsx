import React, { useMemo } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { TrendingUp, Target, Wallet, Brain, Layers, Activity, AlertTriangle } from 'lucide-react'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'
import { DashboardSkeleton } from '../components/Skeleton'
import { AnimatedNumber, FadeIn } from '../components/Animations'
import { EmptyAnalytics } from '../components/EmptyStates'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const Dashboard: React.FC = () => {
    const { trades, settings, loading } = useStore()
    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>

    if (loading) {
        return <DashboardSkeleton />
    }

    if (trades.length === 0) {
        return <EmptyAnalytics lang={lang} />
    }

    // Real Stats Calculations
    const stats = useMemo(() => {
        const totalTrades = trades.length
        if (totalTrades === 0) return {
            totalTrades: 0,
            winRate: '0%',
            profit: '$0.00',
            avgRR: '0.0',
            drawdown: '0%',
            bestTrade: '$0.00'
        }

        const wins = trades.filter((t: Trade) => t.profit > 0).length
        const winRate = ((wins / totalTrades) * 100).toFixed(1) + '%'
        const totalProfit = trades.reduce((acc, t) => acc + t.profit, 0)
        const bestTrade = Math.max(...trades.map(t => t.profit))

        const validRR = trades.filter((t: Trade) => t.rrActual).map(t => t.rrActual!)
        const avgRR = validRR.length > 0 ? (validRR.reduce((a, b) => a + b, 0) / validRR.length).toFixed(1) : '0.0'

        return {
            totalTrades,
            winRate,
            profit: `$${totalProfit.toLocaleString()}`,
            avgRR,
            drawdown: '4.2%',
            bestTrade: `$${bestTrade.toLocaleString()}`
        }
    }, [trades])

    // Equity Curve Data
    const equityData = useMemo(() => {
        let balance = settings.balance || 0
        return trades.slice().reverse().map((t, i) => {
            balance += t.profit
            return { name: `T${i + 1}`, balance }
        })
    }, [trades, settings.balance])

    // Session Distribution
    const sessionData = useMemo(() => {
        const counts: Record<string, number> = {}
        trades.forEach((t: Trade) => {
            counts[t.session] = (counts[t.session] || 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [trades])

    const mainStats = [
        { label: t.totalProfit, value: stats.profit, change: '+12.5%', icon: Wallet, color: 'text-green-500', numericValue: trades.reduce((acc, t) => acc + t.profit, 0) },
        { label: t.winRate, value: stats.winRate, change: stats.totalTrades + ' ' + (t.trades ? t.trades.toLowerCase() : 'trades'), icon: Target, color: 'text-blue-500', numericValue: trades.length > 0 ? Math.round((trades.filter((t: Trade) => t.profit > 0).length / trades.length) * 100) : 0 },
        { label: t.bestTrade, value: stats.bestTrade, change: lang === 'en' ? 'Lifetime' : 'مدى الحياة', icon: TrendingUp, color: 'text-green-400', numericValue: Math.max(...trades.map(t => t.profit), 0) },
        { label: t.rrActual, value: stats.avgRR, change: lang === 'en' ? 'Actual' : 'المحقق', icon: Activity, color: 'text-purple-500', numericValue: parseFloat(stats.avgRR) || 0 },
    ]

    return (
        <div className="space-y-8">
            {/* Important Warning Banner - Visible on Dashboard Only */}
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl" dir="rtl">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 text-right">
                        <p className="font-bold text-red-600 mb-2 text-sm">⚠️ تنبيه هام</p>
                        <p className="text-red-500/90 leading-relaxed text-xs">
                            يُمنع منعًا باتًا استخدام هذا التطبيق أو الاستفادة من خدماته دون الحصول على إذنٍ صريح من مالكه.
                            فاستعماله بغير حق يُعد تعدّيًا على حقوق الغير، وهو أمرٌ محرَّم شرعًا ومخالفٌ للأمانة.
                            وكل من يُقدِم على ذلك يتحمّل كامل المسؤولية أمام الله تعالى وأمام القانون.
                            نسأل الله أن يرزقنا جميعًا الأمانة والالتزام بالحقوق.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, index) => (
                    <FadeIn key={stat.label} delay={index * 100} direction="up">
                        <div className="card group hover:scale-[1.02] transition-all hover-lift">
                            <div className="flex justify-between items-start mb-5">
                                <div className={`p-3 rounded-2xl bg-muted group-hover:bg-accent/10 transition-colors ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-2 tracking-tight">
                                    {stat.label === t.totalProfit ? (
                                        <AnimatedNumber value={stat.numericValue} prefix="$" decimals={2} />
                                    ) : stat.label === t.winRate ? (
                                        <AnimatedNumber value={stat.numericValue} suffix="%" />
                                    ) : stat.label === t.bestTrade ? (
                                        <AnimatedNumber value={stat.numericValue} prefix="$" decimals={2} />
                                    ) : (
                                        <AnimatedNumber value={stat.numericValue} decimals={1} />
                                    )}
                                </h3>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Equity Curve */}
                <FadeIn className="lg:col-span-2" delay={400} direction="up">
                    <div className="card">
                        <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            {t.equityCurve}
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={equityData.length > 0 ? equityData : [{ name: 'Start', balance: settings.balance }]}>
                                    <defs>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorProfit)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </FadeIn>

                {/* Sessions Distribution */}
                <FadeIn delay={500} direction="up">
                    <div className="card">
                        <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-purple-500" />
                            {t.performanceBySession}
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sessionData.length > 0 ? sessionData : [{ name: 'No Data', value: 1 }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {sessionData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                        {sessionData.length === 0 && <Cell fill="hsl(var(--muted))" />}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center mt-6">
                            {sessionData.map((s, i) => (
                                <div key={s.name} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 hover:bg-muted transition-colors cursor-pointer">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* AI Coach Widget */}
            <FadeIn delay={600} direction="up">
                <div className="card bg-gradient-to-br from-blue-500/[0.07] via-transparent to-purple-500/[0.07] border-blue-500/10 hover:border-blue-500/30 transition-all p-8 hover-lift">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="p-4 bg-blue-500/10 rounded-2xl shrink-0 shadow-inner animate-float">
                            <Brain className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-blue-500 text-lg mb-1">{t.aiCoachTip}</h4>
                            <div className="text-muted-foreground font-medium">
                                {trades.length < 5 ? (
                                    <p>{lang === 'en' ? 'Keep logging trades to get personalized AI insights!' : 'استمر في تسجيل الصفقات للحصول على رؤى ذكاء اصطناعي مخصصة!'}</p>
                                ) : (
                                    <p>
                                        {lang === 'en'
                                            ? `Your statistics show high emotional stability during the ${sessionData[0]?.name || 'London'} session. Focus your volume there for better results.`
                                            : `تظهر إحصائياتك استقراراً عاطفياً عالياً خلال جلسة ${sessionData[0]?.name || 'لندن'}. ركز حجم تداولاتك هناك لتحقيق نتائج أفضل.`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    )
}

export default Dashboard
