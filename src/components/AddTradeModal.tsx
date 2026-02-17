import React, { useState, useEffect } from 'react'
import { X, Save, TrendingUp, Camera } from 'lucide-react'
import { useStore } from '../store/useStore'
import { translations } from '../utils/translations'

interface AddTradeModalProps {
    isOpen: boolean
    onClose: () => void
    defaultSession?: string
}

const ASSET_CATEGORIES = {
    Forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'EURGBP', 'NZDUSD'],
    Crypto: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'BNBUSD', 'XRPUSD', 'ADAUSD'],
    Stocks: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META'],
    Indices: ['NAS100', 'US30', 'GER40', 'SPX500', 'UK100'],
    Commodities: ['XAUUSD', 'XAGUSD', 'WTI', 'BRENT']
}

const BASE_PRICES: Record<string, number> = {
    EURUSD: 1.0850, GBPUSD: 1.2640, USDJPY: 149.50, AUDUSD: 0.6520, USDCAD: 1.3480, EURGBP: 0.8580, NZDUSD: 0.6120,
    BTCUSD: 52140.00, ETHUSD: 2840.00, SOLUSD: 112.50, BNBUSD: 355.00, XRPUSD: 0.5520, ADAUSD: 0.5840,
    AAPL: 182.50, TSLA: 198.00, NVDA: 725.00, MSFT: 405.00, AMZN: 168.00, GOOGL: 142.00, META: 475.00,
    NAS100: 17850.00, US30: 38650.00, GER40: 17100.00, SPX500: 5010.00, UK100: 7720.00,
    XAUUSD: 2015.00, XAGUSD: 22.80, WTI: 78.40, BRENT: 83.20
}

export const AddTradeModal: React.FC<AddTradeModalProps> = ({ isOpen, onClose, defaultSession }) => {
    const { addTrade, settings, sessions, strategies, trades } = useStore()
    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const [formData, setFormData] = useState({
        assetCategory: 'Forex' as keyof typeof ASSET_CATEGORIES,
        symbol: 'EURUSD',
        type: 'buy' as 'buy' | 'sell',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        entry: '',
        exit: '',
        sl: '',
        tp: '',
        lotSize: '',
        riskPercent: '',
        rrPlanned: '',
        rrActual: '',
        pipsProfit: '',
        status: 'open' as any,
        notes: '',
        emotionBefore: 'Focused',
        emotionAfter: 'Neutral',
        mistakes: [] as string[],
        rulesUsed: [] as string[],
        strategy: '',
        session: 'London',
        screenshot: ''
    })

    const setAutoPrices = (symbol: string) => {
        const basePrice = BASE_PRICES[symbol]
        if (basePrice) {
            const variation = basePrice * (Math.random() * 0.001 - 0.0005)
            const entry = Number((basePrice + variation).toFixed(symbol.includes('JPY') ? 3 : 5))
            const sl = Number((entry * 0.995).toFixed(symbol.includes('JPY') ? 3 : 5))
            const tp = Number((entry * 1.015).toFixed(symbol.includes('JPY') ? 3 : 5))

            setFormData(prev => ({
                ...prev,
                symbol,
                entry: String(entry),
                sl: String(sl),
                tp: String(tp)
            }))
        } else {
            setFormData(prev => ({ ...prev, symbol }))
        }
    }

    useEffect(() => {
        const defaultSymbol = ASSET_CATEGORIES[formData.assetCategory][0]
        setAutoPrices(defaultSymbol)
    }, [formData.assetCategory])

    // Reset some defaults when the modal opens, and bind to a specific session if provided
    useEffect(() => {
        if (isOpen) {
            const today = new Date()
            setFormData(prev => ({
                ...prev,
                date: today.toISOString().split('T')[0],
                time: today.toTimeString().slice(0, 5),
                session: defaultSession || prev.session || sessions[0]?.name || 'London'
            }))
        }
    }, [isOpen, defaultSession, sessions])

    const selectedSession = sessions.find(s => s.name === formData.session)
    const sessionTrades = trades.filter(tr => tr.session === formData.session)
    const sessionProfit = sessionTrades.reduce((acc, tr) => acc + tr.profit, 0)
    const sessionStarting = selectedSession?.initialCapital ?? settings.balance
    const sessionEquity = sessionStarting + sessionProfit
    const isSessionDepleted = sessionEquity <= 0

    const selectedStrategy = strategies.find(s => s.name === formData.strategy)

    const emotions = [
        { value: 'Focused', label: lang === 'ar' ? 'مركّز' : 'Focused' },
        { value: 'Disciplined', label: lang === 'ar' ? 'منضبط' : 'Disciplined' },
        { value: 'Anxious', label: lang === 'ar' ? 'قلِق' : 'Anxious' },
        { value: 'Greedy', label: lang === 'ar' ? 'طماع' : 'Greedy' },
        { value: 'Fearful', label: lang === 'ar' ? 'خائف' : 'Fearful' },
        { value: 'FOMO', label: lang === 'ar' ? 'خوف من فوات الفرصة' : 'FOMO' },
        { value: 'Neutral', label: lang === 'ar' ? 'محايد' : 'Neutral' },
        { value: 'Patient', label: lang === 'ar' ? 'صبور' : 'Patient' }
    ]

    const mistakeOptions = [
        { value: 'Early Exit', label: lang === 'ar' ? 'خروج مبكر' : 'Early Exit' },
        { value: 'Late Entry', label: lang === 'ar' ? 'دخول متأخر' : 'Late Entry' },
        { value: 'Overtrading', label: lang === 'ar' ? 'الإفراط في التداول' : 'Overtrading' },
        { value: 'Revenge Trading', label: lang === 'ar' ? 'تداول انتقامي' : 'Revenge Trading' },
        { value: 'Bad Risk', label: lang === 'ar' ? 'إدارة مخاطر سيئة' : 'Bad Risk' },
        { value: 'No SL', label: lang === 'ar' ? 'بدون وقف خسارة' : 'No SL' },
        { value: 'FOMO', label: lang === 'ar' ? 'خوف من فوات الفرصة' : 'FOMO' }
    ]

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isSessionDepleted) return

        let profitValue = 0
        if (formData.exit && formData.entry) {
            const diff = Number(formData.exit) - Number(formData.entry)
            profitValue = formData.type === 'buy' ? diff : -diff
            if (formData.lotSize) profitValue *= (Number(formData.lotSize) * 10)
        }

        addTrade({
            ...formData,
            id: crypto.randomUUID(),
            entry: Number(formData.entry),
            exit: Number(formData.exit) || 0,
            sl: Number(formData.sl) || 0,
            tp: Number(formData.tp) || 0,
            lotSize: Number(formData.lotSize) || 0,
            riskPercent: Number(formData.riskPercent) || 0,
            rrPlanned: Number(formData.rrPlanned) || 0,
            rrActual: Number(formData.rrActual) || 0,
            pipsProfit: Number(formData.pipsProfit) || 0,
            profit: profitValue,
            status: formData.status,
            rulesUsed: formData.rulesUsed
        })
        onClose()
    }

    const toggleMistake = (m: string) => {
        setFormData(prev => ({
            ...prev,
            mistakes: prev.mistakes.includes(m) ? prev.mistakes.filter(x => x !== m) : [...prev.mistakes, m]
        }))
    }

    const toggleRule = (rule: string) => {
        setFormData(prev => ({
            ...prev,
            rulesUsed: prev.rulesUsed.includes(rule)
                ? prev.rulesUsed.filter(r => r !== rule)
                : [...prev.rulesUsed, rule]
        }))
    }

    const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ')

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <div className={clsx(
                "bg-card border border-border w-full max-w-3xl rounded-2xl shadow-2xl my-auto transition-colors",
                isRTL ? "text-right" : "text-left"
            )} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{t.logNewTrade}</h2>
                            <p className="text-xs text-gray-500">{t.execution} & details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    {/* Section 1: Core Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-accent uppercase tracking-wider">{t.marketSelection}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t.assetCategory}</label>
                                <select
                                    className="input-field w-full"
                                    value={formData.assetCategory}
                                    onChange={e => setFormData({ ...formData, assetCategory: e.target.value as any })}
                                >
                                    <option value="Forex">{t.forex}</option>
                                    <option value="Crypto">{t.crypto}</option>
                                    <option value="Stocks">{t.stocks}</option>
                                    <option value="Indices">{t.indices}</option>
                                    <option value="Commodities">{t.commodities}</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t.symbol}</label>
                                <select
                                    className="input-field w-full"
                                    value={formData.symbol}
                                    onChange={e => setAutoPrices(e.target.value)}
                                >
                                    {ASSET_CATEGORIES[formData.assetCategory].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                    <option value="custom">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t.type}</label>
                                <div className="flex p-1 bg-background rounded-lg border border-border">
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'buy' })} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${formData.type === 'buy' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500'}`}>BUY</button>
                                    <button type="button" onClick={() => setFormData({ ...formData, type: 'sell' })} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${formData.type === 'sell' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500'}`}>SELL</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.date}</label>
                            <input type="date" className="input-field w-full" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.time}</label>
                            <input type="time" className="input-field w-full" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.status}</label>
                            <select className="input-field w-full" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
                                <option value="open">Open</option>
                                <option value="TP">TP</option>
                                <option value="SL">SL</option>
                                <option value="BE">BE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.strategy}</label>
                            <select className="input-field w-full" value={formData.strategy} onChange={e => setFormData({ ...formData, strategy: e.target.value })}>
                                <option value="">Select Strategy</option>
                                {strategies.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Section 2: Numbers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.entryPrice}</label>
                            <input required type="number" step="any" className="input-field w-full" value={formData.entry} onChange={e => setFormData({ ...formData, entry: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.exitPrice}</label>
                            <input type="number" step="any" className="input-field w-full" value={formData.exit} onChange={e => setFormData({ ...formData, exit: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.stopLoss}</label>
                            <input type="number" step="any" className="input-field w-full" value={formData.sl} onChange={e => setFormData({ ...formData, sl: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.takeProfit}</label>
                            <input type="number" step="any" className="input-field w-full" value={formData.tp} onChange={e => setFormData({ ...formData, tp: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.riskPercent}</label>
                            <input type="number" step="0.1" className="input-field w-full" value={formData.riskPercent} onChange={e => setFormData({ ...formData, riskPercent: e.target.value })} placeholder="1.0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.lotSize}</label>
                            <input type="number" step="0.01" className="input-field w-full" value={formData.lotSize} onChange={e => setFormData({ ...formData, lotSize: e.target.value })} placeholder="0.10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.rrActual}</label>
                            <input type="number" step="0.1" className="input-field w-full" value={formData.rrActual} onChange={e => setFormData({ ...formData, rrActual: e.target.value })} placeholder="2.1" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.session}</label>
                            <select className="input-field w-full" value={formData.session} onChange={e => setFormData({ ...formData, session: e.target.value })}>
                                {sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                <option value="London">London</option>
                                <option value="New York">New York</option>
                                <option value="Asia">Asia</option>
                            </select>
                        </div>
                    </div>

                    {/* Section 3: Analysis */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-accent uppercase tracking-wider">{t.psychologyAnalysis}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t.emotionBefore}</label>
                                <div className="flex flex-wrap gap-2">
                                    {emotions.map(em => (
                                        <button key={em.value} type="button" onClick={() => setFormData({ ...formData, emotionBefore: em.value })} className={clsx(
                                            "px-2 py-1 rounded-md text-[10px] border transition-all",
                                            formData.emotionBefore === em.value ? "bg-accent/20 border-accent text-accent" : "border-border text-gray-500"
                                        )}>
                                            {em.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t.mistakes}</label>
                                <div className="flex flex-wrap gap-2">
                                    {mistakeOptions.map(m => (
                                        <button key={m.value} type="button" onClick={() => toggleMistake(m.value)} className={clsx(
                                            "px-2 py-1 rounded-md text-[10px] border transition-all",
                                            formData.mistakes.includes(m.value) ? "bg-red-500/10 border-red-500 text-red-500" : "border-border text-gray-500"
                                        )}>
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedStrategy?.rules && selectedStrategy.rules.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">
                                    {lang === 'en' ? 'Strategy Rules' : 'قواعد الاستراتيجية'}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStrategy.rules.map(rule => (
                                        <button
                                            key={rule}
                                            type="button"
                                            onClick={() => toggleRule(rule)}
                                            className={clsx(
                                                "px-2 py-1 rounded-md text-[10px] border transition-all text-left",
                                                formData.rulesUsed.includes(rule)
                                                    ? "bg-green-500/10 border-green-500 text-green-500"
                                                    : "border-border text-gray-500"
                                            )}
                                        >
                                            {rule}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                {t.screenshot}
                            </label>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            const base64 = reader.result as string
                                            setFormData(prev => ({ ...prev, screenshot: base64 }))
                                        }
                                        reader.readAsDataURL(file)
                                    }}
                                />
                                {formData.screenshot && (
                                    <div className="mt-1">
                                        <img
                                            src={formData.screenshot}
                                            alt="Trade screenshot preview"
                                            className="max-h-40 rounded-xl border border-border object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">{t.notes}</label>
                            <textarea rows={3} placeholder={lang === 'en' ? 'Journal your thoughts...' : 'دوّن أفكارك ودروسك هنا...'} className="input-field w-full resize-none" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-border sticky bottom-0 bg-card z-10 pb-2">
                        {isSessionDepleted && (
                            <p className="text-[11px] text-red-400 font-bold">
                                {lang === 'en'
                                    ? 'Session capital is fully depleted. You cannot place more trades in this session.'
                                    : 'رأس مال هذه الجلسة انتهى بالكامل، لا يمكنك فتح صفقات جديدة في هذه الجلسة.'}
                            </p>
                        )}
                        <div className="flex items-center gap-3 ml-auto">
                            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold hover:bg-white/5 transition-colors">{t.cancel}</button>
                            <button
                                type="submit"
                                disabled={isSessionDepleted}
                                className="btn-primary px-8 py-2.5 flex items-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                            <Save className="w-5 h-5" />
                            {t.save}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
