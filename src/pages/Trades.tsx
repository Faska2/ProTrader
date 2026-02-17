import React, { useState } from 'react'
import { Search, Filter, Plus, Image as ImageIcon, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'
import { AddTradeModal } from '../components/AddTradeModal'
import { TableSkeleton } from '../components/Skeleton'
import { FadeIn } from '../components/Animations'
import { EmptyTrades } from '../components/EmptyStates'
import { useToast } from '../components/Toast'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'

const Trades: React.FC = () => {
    const { trades, sessions, settings, deleteTrade, loading } = useStore()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [sessionFilter, setSessionFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const filteredTrades = trades.filter((tr: Trade) => {
        const matchesSearch =
            tr.symbol.toLowerCase().includes(search.toLowerCase()) ||
            tr.strategy.toLowerCase().includes(search.toLowerCase()) ||
            tr.notes.toLowerCase().includes(search.toLowerCase())

        const matchesSession =
            sessionFilter === 'all' || tr.session === sessionFilter

        return matchesSearch && matchesSession
    })

    // Pagination
    const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)
    const paginatedTrades = filteredTrades.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleDelete = (id: string) => {
        if (confirm(t.confirmDelete)) {
            deleteTrade(id)
            showToast(
                lang === 'en' ? 'Trade deleted successfully' : 'تم حذف الصفقة بنجاح',
                'success'
            )
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    if (loading) {
        return <TableSkeleton />
    }

    if (trades.length === 0) {
        return <EmptyTrades onAddTrade={() => setIsModalOpen(true)} lang={lang} />
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}>
                <div className="flex-1 flex flex-col gap-2 max-w-xl">
                    <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                        <input
                            type="search"
                            placeholder={`${t.search}...`}
                            className={`input-field w-full ${isRTL ? 'pr-11' : 'pl-11'}`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            className="input-field w-full sm:w-64 text-sm"
                            value={sessionFilter}
                            onChange={e => setSessionFilter(e.target.value)}
                        >
                            <option value="all">
                                {lang === 'en' ? 'All sessions' : 'كل الجلسات'}
                            </option>
                            {sessions.map(s => (
                                <option key={s.id} value={s.name}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl hover:bg-muted transition-all text-sm font-bold shadow-sm">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">{t.filter}</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{t.newTrade}</span>
                    </button>
                </div>
            </div>

            {/* Trades Table */}
            <FadeIn direction="up" delay={200}>
                <div className="card !p-0 overflow-hidden shadow-lg dark:shadow-none border-border/50">
                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className={clsx(
                                    'border-b border-border bg-muted/50 backdrop-blur-sm text-[10px] text-muted-foreground uppercase tracking-widest font-bold',
                                    isRTL ? 'text-right' : 'text-left'
                                )}>
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
                                {paginatedTrades.length > 0 ? paginatedTrades.map((trade: Trade, index: number) => (
                                <tr
                                    key={trade.id}
                                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/trades/${trade.id}`)}
                                >
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className={clsx(
                                                'w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm border border-transparent shrink-0',
                                                trade.profit >= 0
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/10'
                                                    : 'bg-red-500/10 text-red-500 border-red-500/10'
                                            )}>
                                                {trade.symbol.slice(0, 1)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{trade.symbol}</p>
                                                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground mt-1 font-bold">
                                                    <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-md">
                                                        {(t as any)[trade.assetCategory?.toLowerCase() || 'forex'] || trade.assetCategory}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 bg-muted rounded-md">{trade.session}</span>
                                                    <span className="px-1.5 py-0.5 bg-muted rounded-md">{trade.strategy}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={clsx(
                                            'px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border',
                                            trade.type === 'buy' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                                        )}>
                                            {trade.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-[11px] font-mono leading-relaxed">
                                            <p className="text-foreground font-bold">IN: {trade.entry}</p>
                                            <p className="text-muted-foreground">OUT: {trade.exit || '-'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-xs font-mono">
                                            <span className="text-muted-foreground font-medium">{trade.rrPlanned || '0.0'}</span>
                                            <span className="mx-1.5 text-border">/</span>
                                            <span className={clsx(
                                                "font-bold px-1.5 py-0.5 rounded-md",
                                                trade.profit >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            )}>{trade.rrActual || '0.0'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap font-mono text-xs text-muted-foreground">
                                        {trade.pipsProfit ? (trade.pipsProfit > 0 ? `+${trade.pipsProfit}` : trade.pipsProfit) : '0'} pts
                                    </td>
                                    <td className={clsx(
                                        'px-6 py-5 whitespace-nowrap font-bold font-mono text-sm',
                                        trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                                    )}>
                                        {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString()}$
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <span className={clsx(
                                            'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border',
                                            trade.status === 'TP' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                trade.status === 'SL' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    trade.status === 'BE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-muted text-muted-foreground border-border'
                                        )}>
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
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(trade.id)
                                                }}
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-24 text-center text-muted-foreground bg-background">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-5 bg-muted rounded-full animate-pulse">
                                                <Search className="w-10 h-10 opacity-30" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-lg">{lang === 'en' ? 'No trades matching your criteria.' : 'لم نجد أي صفقات تطابق بحثك.'}</p>
                                                <p className="text-sm opacity-60">{lang === 'en' ? 'Try adjusting your filters or search query.' : 'حاول تعديل الفلاتر أو كلمة البحث.'}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>
            </FadeIn>

            {/* Pagination */}
            {totalPages > 1 && (
                <FadeIn direction="up" delay={300}>
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = Math.min(
                                    Math.max(1, currentPage - 2) + i,
                                    totalPages
                                )
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={clsx(
                                            'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                                            currentPage === page
                                                ? 'bg-accent text-white'
                                                : 'hover:bg-muted'
                                        )}
                                    >
                                        {page}
                                    </button>
                                )
                            })}
                        </div>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>
                </FadeIn>
            )}

            <AddTradeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default Trades
