import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, Calendar, Plus, Trash2, Tag, Globe, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { translations } from '../utils/translations'

const Sessions: React.FC = () => {
    const { sessions, trades, strategies, settings, addSession, deleteSession } = useStore()
    const location = useLocation()
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(
        Boolean((location.state as any)?.openCreateSessionModal)
    )
    const [newSession, setNewSession] = useState({
        name: '',
        type: 'Scalping',
        timezone: 'UTC',
        strategyName: '',
        initialCapital: ''
    })

    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    // Calculate real performance per session
    const sessionStats = useMemo(() => {
        return sessions.map(session => {
            const sessionTrades = trades.filter(t => t.session === session.name || t.session.toLowerCase() === session.name.toLowerCase())
            const profit = sessionTrades.reduce((acc, t) => acc + t.profit, 0)
            const winRate = sessionTrades.length > 0
                ? (sessionTrades.filter(t => t.profit > 0).length / sessionTrades.length * 100).toFixed(0) + '%'
                : '0%'

            const starting = session.initialCapital ?? settings.balance
            const equity = starting + profit

            return {
                ...session,
                tradeCount: sessionTrades.length,
                profit,
                winRate,
                starting,
                equity
            }
        })
    }, [sessions, trades, settings.balance])

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        addSession({
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            name: newSession.name,
            type: newSession.type,
            timezone: newSession.timezone,
            strategyName: newSession.strategyName,
            initialCapital: newSession.initialCapital ? Number(newSession.initialCapital) : undefined
        })
        setIsModalOpen(false)
        setNewSession({ name: '', type: 'Scalping', timezone: 'UTC', strategyName: '', initialCapital: '' })
    }

    const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ')

    return (
        <div className={`space-y-8 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold">{t.sessions}</h3>
                    <p className="text-sm text-gray-500">
                        {lang === 'en' ? 'Track performance by trading windows' : 'تتبع الأداء حسب فترات التداول'}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    {lang === 'en' ? 'Create Session' : 'إنشاء جلسة'}
                </button>
            </div>

            {sessionStats.length === 0 ? (
                <div className="card py-20 text-center space-y-4 border-dashed border-2 flex flex-col items-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                        <Clock className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <p className="text-lg font-bold">
                            {lang === 'en' ? 'No sessions created' : 'لم يتم إنشاء جلسات'}
                        </p>
                        <p className="text-sm text-gray-500">
                            {lang === 'en' ? 'Create your first trading window to start categorizing trades' : 'قم بإنشاء أول فترة تداول لتبدأ في تصنيف صفقاتك'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessionStats.map(session => (
                    <div
                        key={session.id}
                        className="card group hover:border-accent/30 transition-all cursor-pointer"
                        onClick={() => navigate(`/sessions/${session.id}`)}
                    >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className={`text-lg font-bold font-mono ${session.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {session.profit >= 0 ? '+' : ''}{session.profit.toLocaleString()}$
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteSession(session.id)
                                        }}
                                        className="p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg lg:opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-xl">{session.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Tag className="w-3 h-3 text-gray-400" />
                                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{session.type}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl border border-border">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">{t.trades}</p>
                                        <p className="font-bold text-sm">{session.tradeCount}</p>
                                    </div>
                                    <div className="text-center border-x border-border">
                                        <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">{t.winRate}</p>
                                        <p className="font-bold text-accent text-sm">{session.winRate}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">
                                            {lang === 'en' ? 'Equity' : 'رصيد الجلسة'}
                                        </p>
                                        <p className="font-bold text-sm">
                                            {session.equity.toFixed(0)}$
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] pt-2 text-gray-500 font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5" />
                                        {session.timezone}
                                    </div>
                                    {session.strategyName && (
                                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest">
                                            <Tag className="w-3.5 h-3.5" />
                                            {session.strategyName}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {session.date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{lang === 'en' ? 'New Session' : 'جلسة جديدة'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{lang === 'en' ? 'Session Name' : 'اسم الجلسة'}</label>
                                <input required className="input-field w-full" value={newSession.name} onChange={e => setNewSession({ ...newSession, name: e.target.value })} placeholder="e.g. London Breakout" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">
                                    {lang === 'en' ? 'Main Strategy' : 'الاستراتيجية الرئيسية'}
                                </label>
                                <select
                                    className="input-field w-full"
                                    value={newSession.strategyName}
                                    onChange={e => setNewSession({ ...newSession, strategyName: e.target.value })}
                                >
                                    <option value="">
                                        {lang === 'en' ? 'Select strategy' : 'اختر الاستراتيجية'}
                                    </option>
                                    {strategies.map(s => (
                                        <option key={s.id} value={s.name}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">
                                    {t.initialBalance}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="input-field w-full"
                                    value={newSession.initialCapital}
                                    onChange={e => setNewSession({ ...newSession, initialCapital: e.target.value })}
                                    placeholder={lang === 'en' ? 'e.g. 500' : 'مثال: 500'}
                                />
                                <p className="text-[11px] text-gray-500">
                                    {lang === 'en'
                                        ? 'If empty, session will use main account balance.'
                                        : 'إذا تركته فارغاً ستستخدم الجلسة رصيد الحساب الرئيسي.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">{lang === 'en' ? 'Style' : 'النمط'}</label>
                                    <select className="input-field w-full" value={newSession.type} onChange={e => setNewSession({ ...newSession, type: e.target.value })}>
                                        <option>Scalping</option>
                                        <option>Day Trading</option>
                                        <option>Swing</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">{lang === 'en' ? 'Timezone' : 'المنطقة الزمنية'}</label>
                                    <select className="input-field w-full" value={newSession.timezone} onChange={e => setNewSession({ ...newSession, timezone: e.target.value })}>
                                        <option>UTC</option>
                                        <option>EST</option>
                                        <option>GMT+1</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full py-3 mt-4">
                                {lang === 'en' ? 'Create Session' : 'إنشاء جلسة'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sessions
