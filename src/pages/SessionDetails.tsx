import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, Tag, Globe, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'
import { AddTradeModal } from '../components/AddTradeModal'
import { clsx } from 'clsx'

const SessionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { sessions, trades, settings, deleteTrade } = useStore()
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const session = sessions.find(s => s.id === id)

    const sessionData = useMemo(() => {
        if (!session) return null
        const sessionTrades = trades.filter(
            (tr: Trade) =>
                tr.session === session.name ||
                tr.session.toLowerCase() === session.name.toLowerCase()
        )
        const profit = sessionTrades.reduce((acc, tr) => acc + tr.profit, 0)
        const tradeCount = sessionTrades.length
        const winRate = tradeCount
            ? `${Math.round(
                (sessionTrades.filter(tr => tr.profit > 0).length / tradeCount) * 100
            )}%`
            : '0%'

        const starting = session.initialCapital ?? settings.balance
        const equity = starting + profit

        return {
            session,
            trades: sessionTrades,
            profit,
            tradeCount,
            winRate,
            starting,
            equity
        }
    }, [session, trades, settings.balance])

    const handleDeleteTrade = (tradeId: string) => {
        if (confirm(t.confirmDelete)) {
            deleteTrade(tradeId)
        }
    }

    if (!session || !sessionData) {
        return (
            <div className={isRTL ? 'font-arabic' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                <button
                    onClick={() => navigate('/sessions')}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'en' ? 'Back to Sessions' : 'الرجوع للجلسات'}
                </button>
                <p className="text-muted-foreground">
                    {lang === 'en' ? 'Session not found.' : 'الجلسة غير موجودة.'}
                </p>
            </div>
        )
    }

    return (
        <div className={`space-y-8 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/sessions')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {lang === 'en' ? 'Back' : 'رجوع'}
                    </button>
                    <div>
                        <h3 className="text-2xl font-bold">{session.name}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                            {session.type}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsTradeModalOpen(true)}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={sessionData.equity <= 0}
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {sessionData.equity <= 0
                            ? (lang === 'en' ? 'Capital depleted' : 'رأس مال الجلسة انتهى')
                            : t.newTrade}
                    </span>
                </button>
            </div>

            {/* Session summary card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card md:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                {lang === 'en'
                                    ? 'Trading window details'
                                    : 'تفاصيل فترة التداول'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" />
                                    {session.timezone}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {session.date}
                                </div>
                                {session.strategyName && (
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5" />
                                        {session.strategyName}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">
                        {t.trades}
                    </p>
                    <p className="text-2xl font-black">{sessionData.tradeCount}</p>
                </div>
                <div className="card flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">
                        {t.winRate}
                    </p>
                    <p className="text-xl font-black text-accent">{sessionData.winRate}</p>
                </div>
                <div className="card flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">
                        {t.profit}
                    </p>
                    <p
                        className={clsx(
                            'text-xl font-black',
                            sessionData.profit >= 0 ? 'text-green-500' : 'text-red-500'
                        )}
                    >
                        {sessionData.profit >= 0 ? '+' : ''}
                        {sessionData.profit.toLocaleString()}$
                    </p>
                </div>
                <div className="card flex flex-col items-center justify-center text-center md:col-span-2">
                    <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">
                        {lang === 'en' ? 'Session Equity' : 'رصيد الجلسة'}
                    </p>
                    <p
                        className={clsx(
                            'text-xl font-black',
                            sessionData.equity > 0 ? 'text-green-500' : 'text-red-500'
                        )}
                    >
                        {sessionData.equity.toFixed(2)}$
                    </p>
                </div>
            </div>

            {/* Trades table for this session */}
            <div className="card !p-0 overflow-hidden shadow-lg dark:shadow-none border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr
                                className={clsx(
                                    'border-b border-border bg-muted/30 text-[10px] text-muted-foreground uppercase tracking-widest font-bold',
                                    isRTL ? 'text-right' : 'text-left'
                                )}
                            >
                                <th className="px-6 py-4">{t.symbol}</th>
                                <th className="px-6 py-4">{t.type}</th>
                                <th className="px-6 py-4">{t.execution}</th>
                                <th className="px-6 py-4">RR (P/A)</th>
                                <th className="px-6 py-4">{t.pips}</th>
                                <th className="px-6 py-4">{t.profit}</th>
                                <th className="px-6 py-4 text-center">{t.status}</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sessionData.trades.length > 0 ? (
                                sessionData.trades.map((trade: Trade) => (
                                    <tr key={trade.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={clsx(
                                                        'w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm border border-transparent shrink-0',
                                                        trade.profit >= 0
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/10'
                                                            : 'bg-red-500/10 text-red-500 border-red-500/10'
                                                    )}
                                                >
                                                    {trade.symbol.slice(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">
                                                        {trade.symbol}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground mt-1 font-bold">
                                                        {trade.strategy && (
                                                            <span className="px-1.5 py-0.5 bg-muted rounded-md">
                                                                {trade.strategy}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span
                                                className={clsx(
                                                    'px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border',
                                                    trade.type === 'buy'
                                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                        : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                                                )}
                                            >
                                                {trade.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-[11px] font-mono leading-relaxed">
                                                <p className="text-foreground font-bold">
                                                    IN: {trade.entry}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    OUT: {trade.exit || '-'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-xs font-mono">
                                                <span className="text-muted-foreground font-medium">
                                                    {trade.rrPlanned || '0.0'}
                                                </span>
                                                <span className="mx-1.5 text-border">/</span>
                                                <span
                                                    className={clsx(
                                                        'font-bold px-1.5 py-0.5 rounded-md',
                                                        trade.profit >= 0
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : 'bg-red-500/10 text-red-500'
                                                    )}
                                                >
                                                    {trade.rrActual || '0.0'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap font-mono text-xs text-muted-foreground">
                                            {trade.pipsProfit
                                                ? trade.pipsProfit > 0
                                                    ? `+${trade.pipsProfit}`
                                                    : trade.pipsProfit
                                                : '0'}{' '}
                                            pts
                                        </td>
                                        <td
                                            className={clsx(
                                                'px-6 py-5 whitespace-nowrap font-bold font-mono text-sm',
                                                trade.profit >= 0
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            )}
                                        >
                                            {trade.profit >= 0 ? '+' : ''}
                                            {trade.profit.toLocaleString()}$
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <span
                                                className={clsx(
                                                    'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border',
                                                    trade.status === 'TP'
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : trade.status === 'SL'
                                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            : trade.status === 'BE'
                                                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                                : 'bg-muted text-muted-foreground border-border'
                                                )}
                                            >
                                                {trade.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                {trade.screenshot && (
                                                    <a
                                                        href={trade.screenshot}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors"
                                                    >
                                                        <ImageIcon className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteTrade(trade.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-16 text-center text-muted-foreground bg-background"
                                    >
                                        {lang === 'en'
                                            ? 'No trades logged for this session yet.'
                                            : 'لا توجد صفقات مسجلة لهذه الجلسة بعد.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddTradeModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                defaultSession={session.name}
            />
        </div>
    )
}

export default SessionDetails

