import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'
import { clsx } from 'clsx'

const TradeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { trades, settings } = useStore()

    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const trade = trades.find((tr: Trade) => tr.id === id)

    if (!trade) {
        return (
            <div className={isRTL ? 'font-arabic' : ''} dir={isRTL ? 'rtl' : 'ltr'}>
                <button
                    onClick={() => navigate('/trades')}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'en' ? 'Back to Trades' : 'الرجوع للصفقات'}
                </button>
                <p className="text-muted-foreground">
                    {lang === 'en' ? 'Trade not found.' : 'الصفقة غير موجودة.'}
                </p>
            </div>
        )
    }

    return (
        <div className={`space-y-8 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/trades')}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'en' ? 'Back' : 'رجوع'}
                </button>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        {trade.session} • {trade.strategy}
                    </p>
                    <h3 className="text-2xl font-bold">{trade.symbol}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core info */}
                <div className="card space-y-4 lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">{t.date}</p>
                            <p className="font-semibold">{trade.date}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">{t.time}</p>
                            <p className="font-semibold">{trade.time}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">{t.type}</p>
                            <p
                                className={clsx(
                                    'inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border mt-1',
                                    trade.type === 'buy'
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                        : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                                )}
                            >
                                {trade.type.toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">{t.status}</p>
                            <p
                                className={clsx(
                                    'inline-flex px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border mt-1',
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
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.entryPrice}
                            </p>
                            <p className="font-mono font-semibold">{trade.entry}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.exitPrice}
                            </p>
                            <p className="font-mono font-semibold">
                                {trade.exit || (lang === 'en' ? '-' : '-')}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.stopLoss}
                            </p>
                            <p className="font-mono font-semibold">{trade.sl}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.takeProfit}
                            </p>
                            <p className="font-mono font-semibold">{trade.tp}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.riskPercent}
                            </p>
                            <p className="font-mono font-semibold">
                                {trade.riskPercent ?? 0}%
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.lotSize}
                            </p>
                            <p className="font-mono font-semibold">{trade.lotSize ?? 0}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                RR (P/A)
                            </p>
                            <p className="font-mono font-semibold">
                                {trade.rrPlanned ?? 0} /{' '}
                                <span
                                    className={clsx(
                                        'px-1.5 py-0.5 rounded-md',
                                        trade.profit >= 0
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-red-500/10 text-red-500'
                                    )}
                                >
                                    {trade.rrActual ?? 0}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.pips}
                            </p>
                            <p className="font-mono font-semibold">
                                {trade.pipsProfit
                                    ? trade.pipsProfit > 0
                                        ? `+${trade.pipsProfit}`
                                        : trade.pipsProfit
                                    : 0}{' '}
                                pts
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.profit}
                            </p>
                            <p
                                className={clsx(
                                    'font-mono text-lg font-bold',
                                    trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                                )}
                            >
                                {trade.profit >= 0 ? '+' : ''}
                                {trade.profit.toLocaleString()}$
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.assetCategory}
                            </p>
                            <p className="font-semibold">
                                {(t as any)[trade.assetCategory?.toLowerCase() || 'forex'] ||
                                    trade.assetCategory}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Psychology & notes */}
                <div className="space-y-4">
                    <div className="card space-y-3 text-xs">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                            {t.psychologyAnalysis}
                        </p>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                {t.emotionBefore}
                            </p>
                            <p className="font-semibold mt-1">{trade.emotionBefore}</p>
                        </div>
                        {trade.emotionAfter && (
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">
                                    {t.emotionAfter}
                                </p>
                                <p className="font-semibold mt-1">{trade.emotionAfter}</p>
                            </div>
                        )}
                        {trade.mistakes && trade.mistakes.length > 0 && (
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">
                                    {t.mistakes}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {trade.mistakes.map(m => (
                                        <span
                                            key={m}
                                            className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold"
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card space-y-3 text-xs">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                            {t.notes}
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {trade.notes || (lang === 'en' ? 'No notes.' : 'لا توجد ملاحظات.')}
                        </p>
                    </div>

                    {trade.screenshot && (
                        <div className="card space-y-3 text-xs">
                            <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                {t.screenshot}
                            </p>
                            <img
                                src={trade.screenshot}
                                alt="Trade screenshot"
                                className="w-full max-h-72 object-contain rounded-xl border border-border"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TradeDetails

