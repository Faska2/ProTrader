import React, { useRef } from 'react'
import {
    Download,
    Upload,
    Shield,
    Database,
    Globe,
    Moon,
    Sun,
    FileText,
    AlertTriangle
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { fakeTrades, fakeSessions, fakeStrategies } from '../utils/seedData'
import { translations } from '../utils/translations'

const Settings: React.FC = () => {
    const { trades, sessions, strategies, settings, resetData, updateSettings } = useStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const lang = settings.language || 'en'
    const t = translations[lang] as Record<string, string>
    const isRTL = lang === 'ar'

    const handleSeed = () => {
        if (confirm(lang === 'en' ? 'This will replace current data with demo data. Continue?' : 'سيتم استبدال البيانات الحالية ببيانات تجريبية. هل تريد الاستمرار؟')) {
            resetData({
                trades: fakeTrades,
                sessions: fakeSessions,
                strategies: fakeStrategies,
                settings: settings
            })
            window.location.reload()
        }
    }

    const handleReset = () => {
        if (confirm(lang === 'en' ? '🚨 PERMANENT DATA LOSS! Are you sure?' : '🚨 فقدان دائم للبيانات! هل أنت متأكد؟')) {
            resetData()
            window.location.reload()
        }
    }

    const exportJSON = () => {
        const data = JSON.stringify({ trades, sessions, strategies, settings }, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `protrade_backup_${new Date().toISOString().split('T')[0]}.json`
        link.click()
    }

    const exportCSV = () => {
        if (trades.length === 0) return alert(lang === 'en' ? 'No trades to export' : 'لا توجد صفقات لتصديرها')
        const headers = ['Date', 'Symbol', 'Type', 'Entry', 'Exit', 'Profit', 'Status', 'Strategy', 'Session']
        const rows = trades.map(tr => [
            tr.date, tr.symbol, tr.type, tr.entry, tr.exit, tr.profit, tr.status, tr.strategy, tr.session
        ])
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `protrade_trades_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string)
                if (json.trades || json.settings) {
                    resetData(json)
                    alert(lang === 'en' ? 'Data imported successfully!' : 'تم استيراد البيانات بنجاح!')
                    window.location.reload()
                }
            } catch (err) {
                alert(lang === 'en' ? 'Invalid backup file.' : 'ملف نسخة احتياطية غير صالح.')
            }
        }
        reader.readAsText(file)
    }

    const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ')

    const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            onClick={onClick}
            className={clsx(
                'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2',
                active
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-muted-foreground hover:bg-muted'
            )}
        >
            {children}
        </button>
    )

    return (
        <div className={`max-w-4xl space-y-8 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Visual & Language Settings */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        {t.language}
                    </h3>
                    <div className="flex p-1 bg-muted rounded-xl border border-border">
                        <TabButton active={lang === 'en'} onClick={() => updateSettings({ language: 'en' })}>
                            English
                        </TabButton>
                        <TabButton active={lang === 'ar'} onClick={() => updateSettings({ language: 'ar' })}>
                            العربية
                        </TabButton>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        {settings.theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-blue-500" />}
                        {t.theme}
                    </h3>
                    <div className="flex p-1 bg-muted rounded-xl border border-border">
                        <TabButton active={settings.theme === 'dark'} onClick={() => updateSettings({ theme: 'dark' })}>
                            <Moon className="w-4 h-4" />
                            {t.dark}
                        </TabButton>
                        <TabButton active={settings.theme === 'light'} onClick={() => updateSettings({ theme: 'light' })}>
                            <Sun className="w-4 h-4" />
                            {t.light}
                        </TabButton>
                    </div>
                </div>
            </section>

            {/* Account Settings */}
            <section className="card">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    {t.accountManagement}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t.initialBalance} ($)</label>
                        <input
                            type="number"
                            className="input-field w-full"
                            value={settings.balance}
                            onChange={e => updateSettings({ balance: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t.riskDefault}</label>
                        <input
                            type="number"
                            className="input-field w-full"
                            value={settings.riskDefault}
                            onChange={e => updateSettings({ riskDefault: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </section>

            {/* Data Export/Import */}
            <section className="card">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                    <Download className="w-5 h-5 text-blue-500" />
                    {lang === 'en' ? 'Export & Backup' : 'التصدير والنسخ الاحتياطي'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <button onClick={exportJSON} className={`flex items-center gap-4 p-5 bg-muted/40 border border-border/50 rounded-2xl hover:border-blue-500/50 transition-all hover:scale-[1.02] shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Database className="w-6 h-6" /></div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{t.backupJSON}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{lang === 'en' ? 'Secure file' : 'ملف آمن'}</p>
                        </div>
                    </button>
                    <button onClick={exportCSV} className={`flex items-center gap-4 p-5 bg-muted/40 border border-border/50 rounded-2xl hover:border-green-500/50 transition-all hover:scale-[1.02] shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><FileText className="w-6 h-6" /></div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{t.exportCSV}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{lang === 'en' ? 'Open in Excel' : 'فتح في Excel'}</p>
                        </div>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-4 p-5 bg-muted/40 border border-border/50 rounded-2xl hover:border-blue-500/50 transition-all hover:scale-[1.02] shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Upload className="w-6 h-6" /></div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{t.importBackup}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{lang === 'en' ? 'Restore data' : 'استعادة بياناتك'}</p>
                        </div>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                </div>
            </section>

            {/* Danger Zone */}
            <section className="card bg-red-500/[0.02] border-red-500/20">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                    {t.dangerZone}
                </h3>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-muted rounded-2xl border border-border gap-4">
                        <div>
                            <p className="font-bold">{t.seed}</p>
                            <p className="text-xs text-muted-foreground">
                                {lang === 'en' ? 'Fill your journal with realistic demo data' : 'املأ سجلاتك ببيانات تجريبية واقعية'}
                            </p>
                        </div>
                        <button
                            onClick={handleSeed}
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-bold text-xs shadow-lg shadow-blue-500/20"
                        >
                            DEMO DATA
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-red-500/[0.04] rounded-2xl border border-red-500/10 gap-4">
                        <div>
                            <p className="font-bold text-red-500">{t.reset}</p>
                            <p className="text-xs text-muted-foreground italic">
                                {lang === 'en' ? 'This action cannot be undone. All trades will be lost.' : 'لا يمكن التراجع عن هذا الإجراء. ستفقد كافة الصفقات.'}
                            </p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="w-full sm:w-auto px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold text-xs shadow-lg shadow-red-500/20"
                        >
                            DELETE ALL
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings
