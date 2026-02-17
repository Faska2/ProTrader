import React, { useMemo, useState } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'
import { Activity, TrendingUp, TrendingDown, Target, Clock, Calculator, PieChart as PieIcon } from 'lucide-react'

const Analytics: React.FC = () => {
    const { trades, sessions, settings } = useStore()
    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>

    const [selectedSession, setSelectedSession] = useState<string>('all')

    const sessionNames = useMemo(
        () =>
            Array.from(
                new Set([
                    ...sessions.map(s => s.name),
                    ...trades.map(tr => tr.session).filter(Boolean)
                ])
            ),
        [sessions, trades]
    )

    const filteredTrades = useMemo(
        () =>
            selectedSession === 'all'
                ? trades
                : trades.filter((tr: Trade) => tr.session === selectedSession),
        [trades, selectedSession]
    )

    const stats = useMemo(() => {
        if (filteredTrades.length === 0) return {
            profitFactor: '0.00',
            expectancy: '$0.00',
            sharpeRatio: '0.00',
            avgRR: '0.0',
            winRate: 0,
            totalProfit: 0,
            maxDrawdown: '0.0%'
        }

        const wins = filteredTrades.filter((tr: Trade) => tr.profit > 0)
        const losses = filteredTrades.filter((tr: Trade) => tr.profit < 0)

        const grossProfit = wins.reduce((acc: number, tr: Trade) => acc + tr.profit, 0)
        const grossLoss = Math.abs(losses.reduce((acc: number, tr: Trade) => acc + tr.profit, 0))

        const profitFactor = grossLoss === 0 ? grossProfit.toFixed(2) : (grossProfit / grossLoss).toFixed(2)

        const winRate = wins.length / trades.length
        const avgWin = wins.length > 0 ? grossProfit / wins.length : 0
        const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0
        const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss)

        const validRR = filteredTrades.filter((tr: Trade) => tr.rrActual).map((tr: Trade) => tr.rrActual!)
        const avgRR = validRR.length > 0 ? (validRR.reduce((a: number, b: number) => a + b, 0) / validRR.length).toFixed(1) : '0.0'

        const sharpe = (expectancy / (avgLoss || 1)).toFixed(2)

        return {
            profitFactor,
            expectancy: `$${expectancy.toFixed(2)}`,
            sharpeRatio: sharpe,
            avgRR,
            winRate: Math.round(winRate * 100),
            totalProfit: grossProfit - grossLoss,
            maxDrawdown: '4.2%'
        }
    }, [filteredTrades])

    const chartData = useMemo(() => {
        let balance = settings.balance || 0
        let peak = balance
        const results = []

        const sortedTrades = [...filteredTrades].reverse()
        results.push({ name: 'Start', balance: balance, drawdown: 0 })

        for (const tr of sortedTrades) {
            balance += tr.profit
            if (balance > peak) peak = balance
            const dd = peak === 0 ? 0 : ((peak - balance) / peak) * 100
            results.push({
                name: tr.date,
                balance: Number(balance.toFixed(2)),
                drawdown: Number((-dd).toFixed(2))
            })
        }
        return results
    }, [filteredTrades, settings.balance])

    const hourlyData = useMemo(() => {
        const hours = Array(24).fill(0).map((_, i) => ({
            hour: `${String(i).padStart(2, '0')}:00`,
            count: 0
        }))

        filteredTrades.forEach((tr: Trade) => {
            if (tr.time) {
                const h = parseInt(tr.time.split(':')[0])
                if (!isNaN(h)) hours[h].count++
            }
        })
        return hours
    }, [filteredTrades])

    const sessionStats = useMemo(() => {
        const sessionsMap: Record<string, { trades: number, profit: number, wins: number }> = {}
        trades.forEach((tr: Trade) => {
            if (!sessionsMap[tr.session]) sessionsMap[tr.session] = { trades: 0, profit: 0, wins: 0 }
            sessionsMap[tr.session].trades++
            sessionsMap[tr.session].profit += tr.profit
            if (tr.profit > 0) sessionsMap[tr.session].wins++
        })
        return Object.entries(sessionsMap).map(([name, s]) => ({
            name,
            ...s,
            winRate: Math.round((s.wins / s.trades) * 100) + '%'
        }))
    }, [trades])

    const assetStats = useMemo(() => {
        const stats: Record<string, number> = {}
        filteredTrades.forEach((tr: Trade) => {
            const cat = tr.assetCategory || 'Forex'
            stats[cat] = (stats[cat] || 0) + 1
        })
        return Object.entries(stats).map(([name, value]) => ({ name, value }))
    }, [filteredTrades])

    const dailyStats = useMemo(() => {
        const map: Record<string, { profit: number; winsVolume: number; lossVolume: number }> = {}
        filteredTrades.forEach((tr: Trade) => {
            if (!map[tr.date]) {
                map[tr.date] = { profit: 0, winsVolume: 0, lossVolume: 0 }
            }
            map[tr.date].profit += tr.profit
            if (tr.profit > 0) map[tr.date].winsVolume += tr.profit
            if (tr.profit < 0) map[tr.date].lossVolume += Math.abs(tr.profit)
        })
        return Object.entries(map)
            .sort(([d1], [d2]) => d1.localeCompare(d2))
            .map(([date, v]) => {
                const totalVol = v.winsVolume + v.lossVolume
                const winPct = totalVol > 0 ? (v.winsVolume / totalVol) * 100 : 0
                const lossPct = totalVol > 0 ? (v.lossVolume / totalVol) * 100 : 0
                return {
                    date,
                    profit: v.profit,
                    winPct: Math.round(winPct),
                    lossPct: Math.round(lossPct)
                }
            })
    }, [filteredTrades])

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {lang === 'en' ? 'Analytics' : 'التحليلات'}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {lang === 'en'
                            ? 'Drill down performance by session'
                            : 'حلّل أداءك حسب كل جلسة على حدة'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {t.session}
                    </span>
                    <select
                        className="input-field w-40 text-sm"
                        value={selectedSession}
                        onChange={e => setSelectedSession(e.target.value)}
                    >
                        <option value="all">
                            {lang === 'en' ? 'All sessions' : 'كل الجلسات'}
                        </option>
                        {sessionNames.map(name => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Profit Factor', value: stats.profitFactor, icon: Calculator, color: 'text-blue-500' },
                    { label: t.rrPlanned, value: stats.expectancy, icon: Target, color: 'text-accent' },
                    { label: 'Sharpe Ratio', value: stats.sharpeRatio, icon: Activity, color: 'text-purple-500' },
                    { label: t.maxDrawdown, value: stats.maxDrawdown, icon: TrendingDown, color: 'text-red-500' },
                ].map(m => (
                    <div key={m.label} className="card">
                        <div className="flex items-center gap-3 mb-2">
                            <m.icon className={`w-4 h-4 ${m.color}`} />
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{m.label}</span>
                        </div>
                        <p className="text-2xl font-bold">{m.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-accent" />
                            {t.equityCurve}
                        </h3>
                        <div className="flex gap-4 text-[10px] uppercase font-bold">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent"></div> {lang === 'en' ? 'Equity' : 'الرصيد'}</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/30"></div> {t.maxDrawdown}</div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={settings.theme === 'dark' ? '#2a2a2a' : '#e5e7eb'} />
                                <XAxis dataKey="name" hide />
                                <YAxis yAxisId="left" stroke="#666" domain={['auto', 'auto']} />
                                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" domain={[-20, 0]} hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: settings.theme === 'dark' ? '#121212' : '#fff',
                                        border: settings.theme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e5e7eb',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} fill="url(#colorBalance)" />
                                <Area yAxisId="right" type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-accent" />
                        {lang === 'en' ? 'Trades by Hour' : 'الصفقات حسب الساعة'}
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="hour" type="category" stroke="#666" fontSize={10} width={40} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: settings.theme === 'dark' ? '#121212' : '#fff',
                                        border: settings.theme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Asset Distribution */}
                <div className="card">
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-accent" />
                        {t.assetCategory}
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {assetStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                        {assetStats.map((s, i) => (
                            <div key={s.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <span className="text-xs text-gray-400">{(t as any)[s.name.toLowerCase()] || s.name} ({s.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Session Table */}
                <div className="card !p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-bold">{t.performanceBySession}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">{t.session}</th>
                                    <th className="px-6 py-4 text-center">{t.trades}</th>
                                    <th className="px-6 py-4 text-center">{t.winRate}</th>
                                    <th className="px-6 py-4 text-right">{lang === 'en' ? 'Net Profit' : 'صافي الربح'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {sessionStats.map(s => (
                                    <tr key={s.name} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">{s.name}</td>
                                        <td className="px-6 py-4 text-center">{s.trades}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 bg-accent/10 text-accent rounded-lg text-xs font-bold">{s.winRate}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${s.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {s.profit >= 0 ? '+' : ''}{s.profit.toLocaleString()}$
                                        </td>
                                    </tr>
                                ))}
                                {sessionStats.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">{lang === 'en' ? 'No session data available yet.' : 'لا توجد بيانات متاحة بعد.'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Daily win/loss ratio for current filter */}
            <div className="card !mt-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                        {lang === 'en' ? 'Daily Win/Loss Ratio' : 'نسبة الربح/الخسارة لكل يوم'}
                    </h3>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {selectedSession === 'all'
                            ? (lang === 'en' ? 'All sessions' : 'كل الجلسات')
                            : selectedSession}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-3">{t.date}</th>
                                <th className="px-6 py-3 text-right">{t.profit}</th>
                                <th className="px-6 py-3 text-center">
                                    {lang === 'en' ? 'Win %' : 'نسبة الربح'}
                                </th>
                                <th className="px-6 py-3 text-center">
                                    {lang === 'en' ? 'Loss %' : 'نسبة الخسارة'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {dailyStats.map(d => (
                                <tr key={d.date} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3 text-sm font-mono">{d.date}</td>
                                    <td className={`px-6 py-3 text-right font-mono text-sm ${d.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {d.profit >= 0 ? '+' : ''}{d.profit.toFixed(2)}$
                                    </td>
                                    <td className="px-6 py-3 text-center text-xs font-bold text-green-500">
                                        {d.winPct}%
                                    </td>
                                    <td className="px-6 py-3 text-center text-xs font-bold text-red-500">
                                        {d.lossPct}%
                                    </td>
                                </tr>
                            ))}
                            {dailyStats.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-6 text-center text-gray-500 text-sm">
                                        {lang === 'en'
                                            ? 'No trades yet for this filter.'
                                            : 'لا توجد صفقات بعد لهذا الفلتر.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Analytics
