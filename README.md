<div align="center">

# 📈 ProTrade

### **Professional Trading Journal & Analytics Platform**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**🌍 Multi-Language Support | 🌙 Dark/Light Mode | 📊 Real-time Analytics | 🧠 AI-Powered Insights**

[🚀 Live Demo](#) · [📖 Documentation](#features) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

<img src="https://via.placeholder.com/800x400/3b82f6/ffffff?text=ProTrade+Dashboard+Preview" alt="ProTrade Dashboard" width="800"/>

</div>

---

## 🎯 Overview

**ProTrade** is a powerful, professional-grade trading journal application designed to help traders track, analyze, and improve their trading performance. Built with modern web technologies, it offers a seamless experience for logging trades, analyzing sessions, and gaining AI-powered insights to become a more disciplined and profitable trader.

Whether you're a beginner learning the ropes or a professional managing multiple strategies, ProTrade provides the tools you need to succeed in the markets.

---

## ✨ Key Features

### 📊 **Advanced Analytics Dashboard**
- Real-time equity curve visualization
- Performance metrics with animated counters
- Win rate calculations and profit tracking
- Session-based performance analysis
- Asset category distribution charts

### 📝 **Comprehensive Trade Logging**
- Detailed trade entry with symbol, entry/exit prices, SL/TP
- Risk management (risk %, lot size, R:R ratio)
- Emotion tracking (before/after trade psychology)
- Mistake tagging for continuous improvement
- Screenshot attachment for visual reference

### 🧠 **Psychology & Mindset Tracking**
- Pre-trade emotion assessment
- Post-trade reflection
- Mistake pattern recognition
- Behavioral analytics to identify psychological weaknesses

### 🎯 **Strategy Management**
- Create and manage multiple trading strategies
- Define strategy-specific rules
- Track performance per strategy
- Strategy compliance scoring

### ⏰ **Session Management**
- Organize trades by trading sessions
- Session-specific capital tracking
- Timezone support for global markets
- Session performance breakdown

### 🌐 **Multi-Language Support**
- **English** - Full support
- **Arabic** - كامل الدعم باللغة العربية (RTL layout)
- Easy to extend for more languages

### 🎨 **Modern UI/UX**
- **Dark & Light mode** with smooth transitions
- Fully responsive design (Mobile, Tablet, Desktop)
- Glassmorphism effects and animations
- Skeleton loading states for better perceived performance
- Toast notifications for user feedback
- Smooth page transitions and micro-interactions

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning fast build tool

### State Management
- **Zustand** - Lightweight, powerful state management
- **LocalStorage Persistence** - Data saved locally, no backend required

### UI/Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icon set
- **Recharts** - Powerful charting library
- **CLSX** - Conditional class names utility

### Developer Experience
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Hot Module Replacement** - Instant updates during development

---

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/protrade.git
cd protrade
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The production build will be in the `dist` folder.

---

## 📱 Features Deep Dive

### 🎛️ Dashboard
The dashboard provides a comprehensive overview of your trading performance:

- **Live Stats Cards**: Total profit, win rate, best trade, average R:R
- **Equity Curve**: Visual representation of account growth
- **Session Distribution**: Pie chart showing performance by trading session
- **AI Coach Tips**: Personalized insights based on your trading data

### 📝 Trade Management

#### Adding a Trade
1. Click "New Trade" or "New Session"
2. Select asset category and symbol
3. Enter trade details (entry, exit, SL, TP)
4. Add risk management metrics
5. Track emotions and mistakes
6. Attach screenshots for reference

#### Trade Analysis
- Filter by session, symbol, or strategy
- Search across all trade data
- View detailed trade information
- Export data for external analysis

### 🧠 Psychology Module
Track your mental state to identify patterns:

- **Emotions**: Focused, Anxious, Greedy, Fearful, FOMO, etc.
- **Mistakes**: Early exit, late entry, overtrading, revenge trading, etc.
- **Patterns**: Identify recurring psychological issues

### 📊 Analytics
Deep dive into your performance:

- **Profit Factor**: Gross profit / Gross loss
- **Expectancy**: Average expected return per trade
- **Sharpe Ratio**: Risk-adjusted returns
- **Max Drawdown**: Largest peak-to-trough decline
- **Hourly Analysis**: Best trading hours identification
- **Daily Win/Loss**: Track consistency over time

---

## 🌍 Internationalization

ProTrade supports multiple languages with RTL (Right-to-Left) layout support:

```typescript
// Current supported languages
- English (en)
- Arabic (ar) - العربية

// Easy to add more languages in:
src/utils/translations.ts
```

---

## 🎨 Customization

### Themes
Toggle between **Dark** and **Light** mode with the theme switcher in the sidebar.

### Settings
- Default balance
- Default risk percentage
- Language preference
- Theme preference

All settings are persisted in localStorage.

---

## 📸 Screenshots

<div align="center">

| Dashboard | Trades | Analytics |
|-----------|---------|-----------|
| ![Dashboard](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Dashboard) | ![Trades](https://via.placeholder.com/300x200/10b981/ffffff?text=Trades) | ![Analytics](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Analytics) |

| Add Trade | Sessions | Settings |
|-----------|----------|----------|
| ![Add Trade](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Add+Trade) | ![Sessions](https://via.placeholder.com/300x200/ec4899/ffffff?text=Sessions) | ![Settings](https://via.placeholder.com/300x200/ef4444/ffffff?text=Settings) |

</div>

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features

---

## 🗺️ Roadmap

- [ ] **Export/Import** - CSV and JSON data export
- [ ] **Cloud Sync** - Optional cloud backup
- [ ] **Mobile App** - React Native version
- [ ] **Advanced AI** - ML-powered trade predictions
- [ ] **Social Features** - Share trades with community
- [ ] **Broker Integration** - Auto-import from supported brokers
- [ ] **Calendar View** - Visual trading calendar
- [ ] **Reports** - Generate PDF performance reports

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - Rapidly build modern websites
- [Recharts](https://recharts.org/) - A composable charting library
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Zustand](https://github.com/pmndrs/zustand) - A small, fast and scalable bearbones state-management solution

---

## 📞 Support

If you found this project helpful, please consider giving it a ⭐!

For questions, issues, or feature requests:
- Open an [Issue](../../issues)
- Join our [Discussions](../../discussions)

---

<div align="center">

**Made with ❤️ for traders worldwide**

[⬆ Back to Top](#-protrade)

</div>
