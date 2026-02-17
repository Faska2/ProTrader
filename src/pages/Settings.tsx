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

            {/* Developer Profile Section */}
            <section className="card bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-600">
                    <span className="text-2xl">👨‍💻</span>
                    {lang === 'en' ? 'About the Developer' : 'عن المطور'}
                </h3>
                
                <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            FE
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-bold text-foreground">Faska El Ouaaziki</h4>
                            <p className="text-blue-600 font-medium">Full Stack Developer</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <span>📍</span> Agadir, Maroc
                            </p>
                        </div>
                        <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                            ✅ {lang === 'en' ? 'Available for freelance' : 'متاح للعمل الحر'}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="p-4 bg-muted/50 rounded-xl">
                        <p className="text-muted-foreground leading-relaxed">
                            {lang === 'en' 
                                ? "Passionate Full Stack Developer specializing in creating immersive and performant web and desktop applications. Focused on code quality and user experience."
                                : "مطور Full Stack متحمس متخصص في إنشاء تطبيقات ويب وغامرة وعالية الأداء. يركز على جودة الكود وتجربة المستخدم."
                            }
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a 
                            href="mailto:faska2002elouaaziki@gmail.com" 
                            className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                        >
                            <span className="text-xl">📧</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground uppercase">Email</p>
                                <p className="font-medium truncate text-sm">faska2002elouaaziki@gmail.com</p>
                            </div>
                        </a>
                        
                        <a 
                            href="tel:+212706217356" 
                            className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                        >
                            <span className="text-xl">📱</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground uppercase">Phone</p>
                                <p className="font-medium text-sm">+212 706-217356</p>
                            </div>
                        </a>

                        <a 
                            href="https://wa.me/212706217356" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl hover:bg-green-500/20 transition-colors border border-green-500/20"
                        >
                            <span className="text-xl">💬</span>
                            <div className="flex-1">
                                <p className="text-xs text-green-600 uppercase">WhatsApp</p>
                                <p className="font-medium text-green-700 text-sm">{lang === 'en' ? 'Chat on WhatsApp' : 'دردشة على واتساب'}</p>
                            </div>
                        </a>

                        <a 
                            href="https://www.linkedin.com/in/faska-el-ouaaziki-a3726b308" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        >
                            <span className="text-xl">💼</span>
                            <div className="flex-1">
                                <p className="text-xs text-blue-600 uppercase">LinkedIn</p>
                                <p className="font-medium text-blue-700 text-sm">Faska El Ouaaziki</p>
                            </div>
                        </a>

                        <a 
                            href="https://github.com/Faska2" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-500/10 rounded-xl hover:bg-gray-500/20 transition-colors border border-gray-500/20 md:col-span-2"
                        >
                            <span className="text-xl">🐙</span>
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 uppercase">GitHub</p>
                                <p className="font-medium text-gray-700 text-sm">github.com/Faska2</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{lang === 'en' ? 'View Projects →' : 'عرض المشاريع →'}</span>
                        </a>
                    </div>

                    {/* Warning Button - Hover to see full message */}
                    <div className="relative group">
                        <button 
                            className="w-full flex items-center justify-center gap-3 p-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all transform hover:scale-[1.02]"
                            dir="rtl"
                        >
                            <AlertTriangle className="w-6 h-6" />
                            <span>⚠️ ضروري / تنبيه هام</span>
                        </button>
                        
                        {/* Hover Tooltip - Full Message */}
                        <div className="absolute bottom-full left-0 right-0 mb-2 p-6 bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" dir="rtl">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                                <div className="text-right">
                                    <h4 className="font-bold text-red-700 text-lg mb-3">تنبيه هام / تنبيه مهم</h4>
                                    <p className="text-red-600 leading-loose text-base font-medium">
                                        يُمنع منعًا باتًا استخدام هذا التطبيق أو الاستفادة من خدماته دون الحصول على إذنٍ صريح من مالكه.
                                        <br /><br />
                                        فاستعماله بغير حق يُعد تعدّيًا على حقوق الغير، وهو أمرٌ محرَّم شرعًا ومخالفٌ للأمانة.
                                        <br /><br />
                                        وكل من يُقدِم على ذلك يتحمّل كامل المسؤولية أمام الله تعالى وأمام القانون.
                                        <br /><br />
                                        <span className="font-bold text-red-800">نسأل الله أن يرزقنا جميعًا الأمانة والالتزام بالحقوق.</span>
                                    </p>
                                </div>
                            </div>
                            {/* Arrow pointing down */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-red-50 dark:bg-red-950 border-r-2 border-b-2 border-red-500 rotate-45"></div>
                        </div>
                    </div>

                    {/* Copyright Notice */}
                    <div className="pt-4 border-t border-border/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="font-bold text-foreground">ProTrade Journal</p>
                                <p className="text-xs text-muted-foreground">© 2024 Faska El Ouaaziki. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings
