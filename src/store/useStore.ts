import { create } from 'zustand'

export interface Trade {
    id: string
    date: string
    time: string
    symbol: string
    type: 'buy' | 'sell'
    entry: number
    exit: number
    sl: number
    tp: number
    lotSize?: number
    riskPercent?: number
    rrPlanned?: number
    rrActual?: number
    pipsProfit?: number
    profit: number
    status: 'TP' | 'SL' | 'BE' | 'open'
    assetCategory?: 'Forex' | 'Crypto' | 'Stocks' | 'Indices' | 'Commodities'
    notes: string
    emotionBefore?: string
    emotionAfter?: string
    mistakes?: string[]
    strategy: string
    session: string
    screenshot?: string
    // Optional list of strategy rules followed in this trade
    rulesUsed?: string[]
}

export interface Session {
    id: string
    name: string
    type: string
    date: string
    timezone: string
    // Optional main strategy name used in this session
    strategyName?: string
    // Session-specific starting capital
    initialCapital?: number
}

export interface Strategy {
    id: string
    name: string
    description: string
    status: 'Active' | 'Testing' | 'Archived'
    // Optional list of trading rules for this strategy
    rules?: string[]
}

export interface AppState {
    trades: Trade[]
    sessions: Session[]
    strategies: Strategy[]
    settings: {
        balance: number
        riskDefault: number
        theme: 'dark' | 'light'
        language: 'en' | 'ar'
    }
    loading: boolean

    // Actions
    fetchData: () => void
    saveToStorage: (data: Partial<AppState>) => void
    addTrade: (trade: Trade) => void
    updateTrade: (trade: Trade) => void
    deleteTrade: (id: string) => void
    addSession: (session: Session) => void
    updateSession: (session: Session) => void
    deleteSession: (id: string) => void
    addStrategy: (strategy: Strategy) => void
    updateStrategy: (strategy: Strategy) => void
    deleteStrategy: (id: string) => void
    resetData: (newData?: any) => void
    updateSettings: (settings: Partial<AppState['settings']>) => void
}

const STORAGE_KEY = 'protrade_data'

const initialData = {
    trades: [],
    sessions: [],
    strategies: [],
    settings: {
        balance: 1000,
        riskDefault: 1,
        theme: 'dark' as const,
        language: 'en' as const
    }
}

export const useStore = create<AppState>((set, get) => ({
    ...initialData,
    loading: true,

    saveToStorage: (data) => {
        const currentState = get()
        const dataToSave = {
            trades: data.trades || currentState.trades,
            sessions: data.sessions || currentState.sessions,
            strategies: data.strategies || currentState.strategies,
            settings: data.settings || currentState.settings,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    },

    fetchData: () => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                set({ ...parsed, loading: false })
            } catch (e) {
                set({ ...initialData, loading: false })
            }
        } else {
            set({ ...initialData, loading: false })
        }
    },

    // Trades
    addTrade: (trade: Trade) => {
        const newTrades = [trade, ...get().trades]
        set({ trades: newTrades })
        get().saveToStorage({ trades: newTrades })
    },
    updateTrade: (trade: Trade) => {
        const newTrades = get().trades.map((t: Trade) => t.id === trade.id ? trade : t)
        set({ trades: newTrades })
        get().saveToStorage({ trades: newTrades })
    },
    deleteTrade: (id: string) => {
        const newTrades = get().trades.filter((t: Trade) => t.id !== id)
        set({ trades: newTrades })
        get().saveToStorage({ trades: newTrades })
    },

    // Sessions
    addSession: (session: Session) => {
        const newSessions = [session, ...get().sessions]
        set({ sessions: newSessions })
        get().saveToStorage({ sessions: newSessions })
    },
    updateSession: (session: Session) => {
        const newSessions = get().sessions.map((s: Session) => s.id === session.id ? session : s)
        set({ sessions: newSessions })
        get().saveToStorage({ sessions: newSessions })
    },
    deleteSession: (id: string) => {
        const newSessions = get().sessions.filter((s: Session) => s.id !== id)
        set({ sessions: newSessions })
        get().saveToStorage({ sessions: newSessions })
    },

    // Strategies
    addStrategy: (strategy: Strategy) => {
        const newStrategies = [strategy, ...get().strategies]
        set({ strategies: newStrategies })
        get().saveToStorage({ strategies: newStrategies })
    },
    updateStrategy: (strategy: Strategy) => {
        const newStrategies = get().strategies.map((s: Strategy) => s.id === strategy.id ? strategy : s)
        set({ strategies: newStrategies })
        get().saveToStorage({ strategies: newStrategies })
    },
    deleteStrategy: (id: string) => {
        const newStrategies = get().strategies.filter((s: Strategy) => s.id !== id)
        set({ strategies: newStrategies })
        get().saveToStorage({ strategies: newStrategies })
    },

    resetData: (newData: any) => {
        const data = newData || initialData
        set({ ...data })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },

    updateSettings: (newSettings: Partial<AppState['settings']>) => {
        const updatedSettings = { ...get().settings, ...newSettings }
        set({ settings: updatedSettings })
        get().saveToStorage({ settings: updatedSettings })
    }
}))
