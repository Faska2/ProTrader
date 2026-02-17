import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    History,
    LineChart,
    Brain,
    Target,
    Settings as SettingsIcon,
    Activity,
    Menu,
    X,
    Globe,
    Moon,
    Sun,
    Plus,
    HelpCircle
} from 'lucide-react'
import { clsx } from 'clsx'
import { useStore, Trade } from '../store/useStore'
import { translations } from '../utils/translations'
import { AddTradeModal } from '../components/AddTradeModal'

const navItems = [
    { icon: LayoutDashboard, labelKey: 'dashboard', path: '/' },
    { icon: History, labelKey: 'sessions', path: '/sessions' },
    { icon: Activity, labelKey: 'trades', path: '/trades' },
    { icon: LineChart, labelKey: 'analytics', path: '/analytics' },
    { icon: Brain, labelKey: 'psychology', path: '/psychology' },
    { icon: Target, labelKey: 'strategies', path: '/strategies' },
    { icon: SettingsIcon, labelKey: 'settings', path: '/settings' },
    { icon: HelpCircle, labelKey: 'faq', path: '/faq' },
]

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { settings, updateSettings, trades } = useStore()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const totalProfit = trades.reduce((acc: number, t: Trade) => acc + t.profit, 0)
    const winRate = trades.length > 0
        ? Math.round((trades.filter((t: Trade) => t.profit > 0).length / trades.length) * 100)
        : 0

    return (
        <div className={clsx(
            'flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300',
            isRTL ? 'font-arabic' : ''
        )} dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-md"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                'fixed inset-y-0 z-[70] w-72 border-r border-border transition-all duration-300 lg:static lg:translate-x-0',
                isRTL
                    ? (isSidebarOpen ? 'right-0' : '-right-72 lg:right-0')
                    : (isSidebarOpen ? 'left-0' : '-left-72 lg:left-0')
            )}>
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-accent/40">
                        P
                    </div>
                    <span className="text-2xl font-black tracking-tighter">ProTrade</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative',
                                    isActive ? 'bg-accent/10 active-link font-bold' : 'hover:bg-muted'
                                )}
                            >
                                <item.icon className={clsx(
                                    'w-5 h-5 transition-transform group-hover:scale-110',
                                    isActive ? 'text-accent' : ''
                                )} />
                                <span className="text-sm font-bold tracking-tight">{(t as any)[item.labelKey] || item.labelKey}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-border space-y-4 text-sm font-bold">
                    <div className="flex items-center justify-around">
                        <button
                            onClick={() => updateSettings({ language: lang === 'en' ? 'ar' : 'en' })}
                            className="p-3 hover:bg-muted rounded-2xl transition-all"
                        >
                            <Globe className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
                            className="p-3 hover:bg-muted rounded-2xl transition-all"
                        >
                            {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
                <header className="h-20 border-b border-border flex items-center justify-between px-6 lg:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 hover:bg-muted rounded-xl" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-black tracking-tight uppercase">
                            {(t as any)[navItems.find(i => i.path === location.pathname)?.labelKey || 'dashboard']}
                        </h2>
                    </div>

                    <button
                        onClick={() => navigate('/sessions', { state: { openCreateSessionModal: true } })}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">{(t as any).newSession || 'New Session'}</span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide bg-background">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    )
}
