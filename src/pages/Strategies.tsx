import React, { useState, useMemo } from 'react'
import { Target, Plus, Trash2, Activity, PieChart as PieIcon } from 'lucide-react'
import { useStore } from '../store/useStore'
import { translations } from '../utils/translations'

const Strategies: React.FC = () => {
    const { strategies, trades, settings, addStrategy, deleteStrategy } = useStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newStrategy, setNewStrategy] = useState({ name: '', description: '', status: 'Active' as any, rules: [] as string[] })
    const [ruleInput, setRuleInput] = useState('')

    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const strategyStats = useMemo(() => {
        return strategies.map(strategy => {
            const stratTrades = trades.filter(t => t.strategy === strategy.name)
            const wins = stratTrades.filter(t => t.profit > 0).length
            const winRate = stratTrades.length > 0 ? (wins / stratTrades.length * 100).toFixed(0) + '%' : '0%'
            const totalProfit = stratTrades.reduce((acc, t) => acc + t.profit, 0)

            return {
                ...strategy,
                tradeCount: stratTrades.length,
                winRate,
                profit: totalProfit
            }
        })
    }, [strategies, trades])

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        addStrategy({
            id: crypto.randomUUID(),
            ...newStrategy,
            rules: newStrategy.rules
        })
        setIsModalOpen(false)
        setNewStrategy({ name: '', description: '', status: 'Active', rules: [] })
        setRuleInput('')
    }

    const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ')

    return (
        <div className={`space-y-8 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">{t.strategies}</h3>
                    <p className="text-sm text-gray-500">
                        {lang === 'en' ? 'Analyze performance by trading system' : 'تحليل الأداء حسب نوع الاستراتيجية'}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {lang === 'en' ? 'Add Strategy' : 'إضافة استراتيجية'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {strategyStats.length > 0 ? strategyStats.map(item => (
                    <div key={item.id} className="card group hover:border-accent/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-accent/10 rounded-2xl shrink-0">
                                <Target className="w-8 h-8 text-accent" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-xl">{item.name}</h4>
                                <p className="text-sm text-gray-500 max-w-md">{item.description || (lang === 'en' ? 'No description provided.' : 'لا يوجد وصف.')}</p>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <PieIcon className="w-3.5 h-3.5 text-accent" />
                                        <span className="text-xs font-bold text-accent">{item.winRate} {t.winRate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-xs text-gray-400">{item.tradeCount} {t.trades}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{t.totalProfit}</p>
                                <p className={`text-xl font-mono font-bold ${item.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString()}$
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                    item.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                        item.status === 'Testing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                )}>
                                    {item.status}
                                </div>
                                <button
                                    onClick={() => deleteStrategy(item.id)}
                                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="card py-16 text-center border-dashed border-2 flex flex-col items-center justify-center gap-3">
                        <Target className="w-12 h-12 text-gray-600 opacity-20" />
                        <div>
                            <p className="text-gray-500 font-medium">
                                {lang === 'en' ? 'No strategies defined yet.' : 'لم يتم تحديد استراتيجيات بعد.'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                {lang === 'en' ? 'Start by adding your trading system (e.g. ICT, S&D, Breakouts)' : 'ابدأ بإضافة نظام التداول الخاص بك (مثل ICT، العرض والطلب، الكسر)'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{lang === 'en' ? 'New Strategy' : 'استراتيجية جديدة'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{lang === 'en' ? 'Strategy Name' : 'اسم الاستراتيجية'}</label>
                                <input required className="input-field w-full" value={newStrategy.name} onChange={e => setNewStrategy({ ...newStrategy, name: e.target.value })} placeholder="e.g. ICT Silver Bullet" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{lang === 'en' ? 'Description' : 'الوصف'}</label>
                                <textarea rows={3} className="input-field w-full resize-none" value={newStrategy.description} onChange={e => setNewStrategy({ ...newStrategy, description: e.target.value })} placeholder="Rules, setup criteria..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">
                                    {lang === 'en' ? 'Rules (optional)' : 'القواعد (اختياري)'}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        className="input-field flex-1"
                                        value={ruleInput}
                                        onChange={e => setRuleInput(e.target.value)}
                                        placeholder={lang === 'en' ? 'e.g. Only trade with HTF bias' : 'مثال: التداول فقط مع اتجاه الفريم الأكبر'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!ruleInput.trim()) return
                                            setNewStrategy(prev => ({
                                                ...prev,
                                                rules: [...prev.rules, ruleInput.trim()]
                                            }))
                                            setRuleInput('')
                                        }}
                                        className="px-3 py-2 rounded-xl text-xs font-bold bg-accent/10 text-accent hover:bg-accent/20"
                                    >
                                        {lang === 'en' ? 'Add' : 'إضافة'}
                                    </button>
                                </div>
                                {newStrategy.rules.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newStrategy.rules.map((rule) => (
                                            <span
                                                key={rule}
                                                className="px-2 py-1 rounded-lg bg-muted text-xs flex items-center gap-1"
                                            >
                                                {rule}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setNewStrategy(prev => ({
                                                            ...prev,
                                                            rules: prev.rules.filter(r => r !== rule)
                                                        }))
                                                    }
                                                    className="text-gray-500 hover:text-red-500 text-xs"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">{t.status}</label>
                                <select className="input-field w-full" value={newStrategy.status} onChange={e => setNewStrategy({ ...newStrategy, status: e.target.value as any })}>
                                    <option value="Active">Active</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary w-full py-3 mt-4">
                                {lang === 'en' ? 'Save Strategy' : 'حفظ الاستراتيجية'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Strategies
