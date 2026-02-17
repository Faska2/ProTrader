import React, { useState } from 'react';
import { clsx } from 'clsx';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Calculator, 
  BookOpen, 
  Shield, 
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';

// ============================================
// FAQ DATA - 45 QUESTIONS BILINGUAL (EN/AR)
// ============================================

interface FAQItem {
  id: string;
  category: 'general' | 'trading' | 'calculations' | 'psychology' | 'technical' | 'features';
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
  icon?: React.ElementType;
  code?: string;
}

const faqData: FAQItem[] = [
  // ========== GENERAL (1-8) ==========
  {
    id: '1',
    category: 'general',
    question: {
      en: 'What is ProTrade and how does it help traders?',
      ar: 'ما هو بروتريد وكيف يساعد المتداولين؟'
    },
    answer: {
      en: 'ProTrade is a professional trading journal application designed to help traders track, analyze, and improve their trading performance. It focuses on decision quality, risk management, and psychological discipline rather than just profit/loss. The app provides AI-powered insights, behavioral pattern detection, and quantitative analytics to help you become a more consistent and profitable trader.',
      ar: 'بروتريد هو تطبيق يومية تداول احترافية مصمم لمساعدة المتداولين على تتبع وتحليل وتحسين أدائهم. يركز على جودة القرار وإدارة المخاطر والانضباط النفسي بدلاً من الربح/الخسارة فقط. يوفر التطبيق رؤى مدعومة بالذكاء الاصطناعي واكتشاف الأنماط السلوكية وتحليلات كمية لمساعدتك على أن تصبح متداولاً أكثر اتساقاً وربحية.'
    },
    icon: BookOpen
  },
  {
    id: '2',
    category: 'general',
    question: {
      en: 'Is ProTrade free to use?',
      ar: 'هل بروتريد مجاني للاستخدام؟'
    },
    answer: {
      en: 'Yes! ProTrade is completely free to use with all core features included. There are no hidden fees, subscriptions, or premium tiers. All features including advanced analytics, psychology profiling, and quantitative metrics are available to every user.',
      ar: 'نعم! بروتريد مجاني تماماً للاستخدام مع جميع الميزات الأساسية المتضمنة. لا توجد رسوم خفية أو اشتراكات أو مستويات مدفوعة. جميع الميزات بما في ذلك التحليلات المتقدمة والملف النفسي والمقاييس الكمية متاحة لكل مستخدم.'
    },
    icon: CheckCircle
  },
  {
    id: '3',
    category: 'general',
    question: {
      en: 'Does ProTrade require an internet connection?',
      ar: 'هل يتطلب بروتريد اتصالاً بالإنترنت؟'
    },
    answer: {
      en: 'ProTrade works offline! All your data is stored locally on your device using browser storage. You can log trades, view analytics, and use all features without an internet connection. Your data stays private and secure on your device.',
      ar: 'يعمل بروتريد بدون إنترنت! جميع بياناتك مخزنة محلياً على جهازك باستخدام تخزين المتصفح. يمكنك تسجيل الصفقات وعرض التحليلات واستخدام جميع الميزات دون اتصال بالإنترنت. بياناتك تبقى خاصة وآمنة على جهازك.'
    },
    icon: Shield
  },
  {
    id: '4',
    category: 'general',
    question: {
      en: 'Is my trading data secure and private?',
      ar: 'هل بيانات التداول الخاصة بي آمنة وخاصة؟'
    },
    answer: {
      en: 'Absolutely! Your data never leaves your device. We use local browser storage (localStorage) which means all your trading information, strategies, and psychological profiles are stored only on your computer. There are no servers, no cloud storage, and no data sharing. You have complete control over your data.',
      ar: 'بالتأكيد! بياناتك لا تغادر جهازك أبداً. نستخدم تخزين المتصفح المحلي مما يعني أن جميع معلومات التداول والاستراتيجيات والملفات النفسية مخزنة فقط على جهاز الكمبيوتر الخاص بك. لا توجد خوادم أو تخزين سحابي أو مشاركة بيانات. لديك السيطرة الكاملة على بياناتك.'
    },
    icon: Shield
  },
  {
    id: '5',
    category: 'general',
    question: {
      en: 'Can I use ProTrade on mobile devices?',
      ar: 'هل يمكنني استخدام بروتريد على الأجهزة المحمولة؟'
    },
    answer: {
      en: 'Yes! ProTrade is fully responsive and works on any device with a web browser - desktop, tablet, or mobile. The interface automatically adapts to your screen size. For the best experience, we recommend using a desktop or tablet for detailed analytics, while mobile is great for quick trade logging.',
      ar: 'نعم! بروتريد متجاوب تماماً ويعمل على أي جهاز يحتوي على متصفح ويب - سطح المكتب أو الجهاز اللوحي أو المحمول. يتكيف الواجهة تلقائياً مع حجم شاشتك. للحصول على أفضل تجربة، نوصي باستخدام سطح المكتب أو الجهاز اللوحي للتحليلات التفصيلية، بينما يعد المحمول رائعاً لتسجيل الصفقات السريع.'
    },
    icon: HelpCircle
  },
  {
    id: '6',
    category: 'general',
    question: {
      en: 'How do I backup my trading data?',
      ar: 'كيف يمكنني عمل نسخة احتياطية من بيانات التداول الخاصة بي؟'
    },
    answer: {
      en: 'Go to Settings → Danger Zone → Export CSV or Backup JSON. We recommend exporting your data weekly. You can also manually backup by going to your browser\'s developer tools (F12) → Application → Local Storage and copying the protrade_data entry.',
      ar: 'انتقل إلى الإعدادات → منطقة الخطر → تصدير CSV أو نسخ JSON احتياطية. نوصي بتصدير بياناتك أسبوعياً. يمكنك أيضاً عمل نسخة احتياطية يدوياً بالذهاب إلى أدوات المطور في المتصفح (F12) → التطبيق → التخزين المحلي ونسخ إدخال protrade_data.'
    },
    icon: Shield
  },
  {
    id: '7',
    category: 'general',
    question: {
      en: 'Can I import data from other trading journals?',
      ar: 'هل يمكنني استيراد البيانات من يوميات تداول أخرى؟'
    },
    answer: {
      en: 'Currently, ProTrade supports JSON import with a specific format. You can prepare your data in the required format and use Settings → Import Backup. We\'re working on CSV import from popular platforms like Tradervue and Edgewonk in future updates.',
      ar: 'حالياً، يدعم بروتريد استيراد JSON بتنسيق محدد. يمكنك إعداد بياناتك بالتنسيق المطلوب واستخدام الإعدادات → استيراد نسخة احتياطية. نعمل على استيراد CSV من المنصات الشائعة مثل تريديرفيو وإيدجوانك في التحديثات المستقبلية.'
    },
    icon: BookOpen
  },
  {
    id: '8',
    category: 'general',
    question: {
      en: 'What languages does ProTrade support?',
      ar: 'ما هي اللغات التي يدعمها بروتريد؟'
    },
    answer: {
      en: 'ProTrade currently supports English and Arabic with full RTL (Right-to-Left) support for Arabic. You can switch languages anytime in Settings → Visual & Language. More languages will be added based on user demand.',
      ar: 'يدعم بروتريد حالياً اللغتين الإنجليزية والعربية مع دعم كامل للغة العربية من اليمين لليسار (RTL). يمكنك تبديل اللغات في أي وقت من الإعدادات → المظهر واللغة. سيتم إضافة المزيد من اللغات بناءً على طلب المستخدمين.'
    },
    icon: BookOpen
  },

  // ========== TRADING (9-18) ==========
  {
    id: '9',
    category: 'trading',
    question: {
      en: 'What information should I log for each trade?',
      ar: 'ما هي المعلومات التي يجب تسجيلها لكل صفقة؟'
    },
    answer: {
      en: 'For best results, log: Symbol/Pair, Entry/Exit prices, Stop Loss & Take Profit, Position Size (lots), Risk percentage, Strategy used, Trading session, Emotions before/after, Mistakes made, and Screenshots. The more detailed your journal, the better your analytics will be.',
      ar: 'للحصول على أفضل النتائج، سجل: الرمز/الزوج، أسعار الدخول/الخروج، وقف الخسارة وجني الأرباح، حجم المركز (لوت)، نسبة المخاطرة، الاستراتيجية المستخدمة، جلسة التداول، المشاعر قبل/بعد، الأخطاء المرتكبة، ولقطات الشاشة. كلما كانت يوميتك أكثر تفصيلاً، كانت تحليلاتك أفضل.'
    },
    icon: BookOpen
  },
  {
    id: '10',
    category: 'trading',
    question: {
      en: 'How do I create a new trading session?',
      ar: 'كيف يمكنني إنشاء جلسة تداول جديدة؟'
    },
    answer: {
      en: 'Click the "New Session" button in the top navigation bar or go to the Sessions page and click "Create Session". Enter a name (e.g., "London Session Week 1"), select the session type (Day Trading, Swing, etc.), and set your initial capital for that session. Sessions help you organize trades by time period or strategy focus.',
      ar: 'انقر على زر "جلسة جديدة" في شريط التنقل العلوي أو انتقل إلى صفحة الجلسات وانقر على "إنشاء جلسة". أدخل اسم (مثل "جلسة لندن الأسبوع 1")، حدد نوع الجلسة (تداول يومي، سوينغ، إلخ)، وحدد رأس مالك الافتتاحي لتلك الجلسة. تساعدك الجلسات على تنظيم الصفقات حسب الفترة الزمنية أو تركيز الاستراتيجية.'
    },
    icon: BookOpen
  },
  {
    id: '11',
    category: 'trading',
    question: {
      en: 'What is a trading strategy in ProTrade?',
      ar: 'ما هي استراتيجية التداول في بروتريد؟'
    },
    answer: {
      en: 'A strategy in ProTrade is your trading plan or methodology. Examples include "ICT Silver Bullet", "Supply & Demand", "EMA Crossover", etc. When you create a strategy, you can define specific rules. ProTrade will then track your performance per strategy and calculate Strategy Reliability Coefficient (SRC) to show which strategies work best for you.',
      ar: 'الاستراتيجية في بروتريد هي خطة التداول أو المنهجية الخاصة بك. تشمل الأمثلة "فضية إict"، "العرض والطلب"، "تقاطع المتوسطات المتحركة"، إلخ. عند إنشاء استراتيجية، يمكنك تحديد قواعد محددة. سيقوم بروتريد بعد ذلك بتتبع أدائك لكل استراتيجية وحساب معامل موثوقية الاستراتيجية (SRC) لإظهار أي الاستراتيجيات تعمل بشكل أفضل بالنسبة لك.'
    },
    icon: TrendingUp
  },
  {
    id: '12',
    category: 'trading',
    question: {
      en: 'How do I track my emotions while trading?',
      ar: 'كيف يمكنني تتبع مشاعري أثناء التداول؟'
    },
    answer: {
      en: 'When logging a trade, scroll to the "Psychology & Analysis" section. Select your emotion BEFORE entering the trade (e.g., Focused, Anxious, FOMO) and AFTER closing it (e.g., Satisfied, Regretful, Neutral). ProTrade analyzes these emotions to calculate your Emotional Impact Score (EIS) and identify which emotions lead to better or worse performance.',
      ar: 'عند تسجيل صفقة، انتقل إلى قسم "التحليل النفسي". حدد شعورك BEFORE دخول الصفقة (مثل: مركز، قلق، FOMO) و AFTER إغلاقها (مثل: راضٍ، نادم، محايد). يقوم بروتريد بتحليل هذه المشاعر لحساب درجة التأثير العاطفي (EIS) وتحديد أي المشاعر تؤدي إلى أداء أفضل أو أسوأ.'
    },
    icon: Brain
  },
  {
    id: '13',
    category: 'trading',
    question: {
      en: 'What are "mistakes" and why should I track them?',
      ar: 'ما هي "الأخطاء" ولماذا يجب تتبعها؟'
    },
    answer: {
      en: 'Mistakes are behavioral errors that hurt your trading performance. Common mistakes include: Overtrading, Revenge Trading, No Stop Loss, Moving Stop Loss to Breakeven Too Early, FOMO Entry, Trading Without a Plan, and Counter-Trend Trading. Tracking mistakes helps ProTrade identify your behavioral patterns and provide targeted improvement recommendations.',
      ar: 'الأخطاء هي أخطاء سلوكية تؤثر سلباً على أداء التداول الخاص بك. تشمل الأخطاء الشائعة: الإفراط في التداول، التداول الانتقامي، عدم وجود وقف خسارة، نقل وقف الخسارة إلى التعادل مبكراً جداً، الدخول بسبب FOMO، التداول بدون خطة، والتداول ضد الاتجاه. يساعد تتبع الأخطاء بروتريد على تحديد أنماطك السلوكية وتقديم توصيات تحسين مستهدفة.'
    },
    icon: AlertCircle
  },
  {
    id: '14',
    category: 'trading',
    question: {
      en: 'How do I add a screenshot to my trade?',
      ar: 'كيف يمكنني إضافة لقطة شاشة إلى صفقتي؟'
    },
    answer: {
      en: 'In the trade entry form, go to the "Psychology & Analysis" section. Click on the screenshot upload area to select an image from your device. You can also paste a URL if your chart is hosted online. Screenshots help you review your setup later and provide visual context for your analysis.',
      ar: 'في نموذج إدخال الصفقة، انتقل إلى قسم "التحليل النفسي". انقر على منطقة تحميل لقطة الشاشة لتحديد صورة من جهازك. يمكنك أيضاً لصق عنوان URL إذا كان مخططك مستضافاً عبر الإنترنت. تساعدك لقطات الشاشة على مراجعة إعدادك لاحقاً وتوفير سياق مرئي لتحليلك.'
    },
    icon: BookOpen
  },
  {
    id: '15',
    category: 'trading',
    question: {
      en: 'What asset categories does ProTrade support?',
      ar: 'ما هي فئات الأصول التي يدعمها بروتريد؟'
    },
    answer: {
      en: 'ProTrade supports all major asset categories: Forex (EURUSD, GBPUSD, etc.), Crypto (BTCUSD, ETHUSD), Stocks (AAPL, TSLA), Indices (NAS100, US30), and Commodities (Gold, Oil). You can select the category when logging a trade, which helps analyze your performance across different markets.',
      ar: 'يدعم بروتريد جميع فئات الأصول الرئيسية: فوركس (يورو/دولار، جنيه/دولار، إلخ)، كريبتو (بيتكوين، إيثيريوم)، أسهم (آبل، تسلا)، مؤشرات (ناسداك، داو جونز)، وسلع (ذهب، نفط). يمكنك تحديد الفئة عند تسجيل صفقة، مما يساعد على تحليل أدائك عبر الأسواق المختلفة.'
    },
    icon: TrendingUp
  },
  {
    id: '16',
    category: 'trading',
    question: {
      en: 'How do I edit or delete a trade?',
      ar: 'كيف يمكنني تعديل أو حذف صفقة؟'
    },
    answer: {
      en: 'To edit a trade, go to the Trades page, find the trade you want to modify, and click on it to open the details. Click the edit button to make changes. To delete, click the trash icon next to the trade. You\'ll be asked to confirm before permanent deletion.',
      ar: 'لتعديل صفقة، انتقل إلى صفحة الصفقات، ابحث عن الصفقة التي تريد تعديلها، وانقر عليها لفتح التفاصيل. انقر على زر التعديل لإجراء التغييرات. للحذف، انقر على أيقونة سلة المهملات بجانب الصفقة. سيُطلب منك التأكيد قبل الحذف النهائي.'
    },
    icon: BookOpen
  },
  {
    id: '17',
    category: 'trading',
    question: {
      en: 'What is the difference between Planned RR and Actual RR?',
      ar: 'ما هو الفرق بين RR المخطط والRR الفعلي؟'
    },
    answer: {
      en: 'Planned RR (Risk:Reward) is the ratio you intended to achieve when you entered the trade (e.g., 1:3 means risking $1 to make $3). Actual RR is what you actually achieved when you closed the trade. The difference shows your execution quality - if Actual RR is much lower than Planned, you may be exiting winners too early.',
      ar: 'RR المخطط (نسبة المخاطرة:المكافأة) هي النسبة التي كنت تنوي تحقيقها عند دخولك الصفقة (على سبيل المثال، 1:3 تعني المخاطرة بـ1$ لكسب 3$). RR الفعلي هو ما حققته فعلياً عند إغلاقك للصفقة. يوضح الفرق جودة تنفيذك - إذا كان RR الفعلي أقل بكثير من المخطط، فقد تخرج من الصفقات الرابحة مبكراً جداً.'
    },
    icon: Calculator
  },
  {
    id: '18',
    category: 'trading',
    question: {
      en: 'How do I track rules followed in a trade?',
      ar: 'كيف يمكنني تتبع القواعد المتبعة في صفقة؟'
    },
    answer: {
      en: 'When you create a strategy, you can define specific rules (e.g., "Wait for 9:30 NY Open", "Minimum 1:3 RR"). When logging a trade with that strategy, ProTrade will show you the rules and let you check which ones you followed. This calculates your Strategy Compliance percentage.',
      ar: 'عند إنشاء استراتيجية، يمكنك تحديد قواعد محددة (مثل "الانتظار حتى 9:30 نيويورك"، "الحد الأدنى 1:3 RR"). عند تسجيل صفقة بتلك الاستراتيجية، سيعرض عليك بروتريد القواعد ويسمح لك بالتحقق من أيها اتبعت. هذا يحسب نسبة الامتثال لاستراتيجيتك.'
    },
    icon: CheckCircle
  },

  // ========== CALCULATIONS (19-28) ==========
  {
    id: '19',
    category: 'calculations',
    question: {
      en: 'How is trade profit calculated in ProTrade?',
      ar: 'كيف يتم حساب ربح الصفقة في بروتريد؟'
    },
    answer: {
      en: 'ProTrade calculates profit as: (Exit Price - Entry Price) for BUY trades, or (Entry Price - Exit Price) for SELL trades. This difference is then multiplied by your position size (lot size × pip value). For forex, 1 standard lot (1.0) = $10 per pip. For other assets, the calculation depends on the contract size.',
      ar: 'يحسب بروتريد الربح على النحو التالي: (سعر الخروج - سعر الدخول) لصفقات الشراء، أو (سعر الدخول - سعر الخروج) لصفقات البيع. يتم بعد ذلك ضرب هذا الفرق في حجم مركزك (حجم اللوت × قيمة النقطة). للفوركس، 1 لوت قياسي (1.0) = 10$ لكل نقطة. للأصول الأخرى، يعتمد الحساب على حجم العقد.'
    },
    icon: Calculator,
    code: `// Profit Calculation Formula
// For BUY trades:
Profit = (Exit - Entry) × LotSize × PipValue

// For SELL trades:
Profit = (Entry - Exit) × LotSize × PipValue

// Example (EURUSD):
// Entry: 1.08500, Exit: 1.09200
// Lot: 0.5, Pip Value: $10
Profit = (1.09200 - 1.08500) × 0.5 × 10
Profit = 0.00700 × 0.5 × 10 = $35`
  },
  {
    id: '20',
    category: 'calculations',
    question: {
      en: 'Show me the exact code for profit calculation',
      ar: 'أرني الكود الدقيق لحساب الربح'
    },
    answer: {
      en: 'Here is the exact TypeScript code used in ProTrade for calculating trade profit:',
      ar: 'إليك كود TypeScript الدقيق المستخدم في بروتريد لحساب ربح الصفقة:'
    },
    icon: Calculator,
    code: `// File: src/utils/calculations.ts

export function calculateTradeProfit(
  trade: Trade
): number {
  const { entry, exit, type, lotSize = 1, symbol } = trade;
  
  // Calculate pip/point difference
  const pipDiff = type === 'buy' 
    ? exit - entry 
    : entry - exit;
  
  // Get pip value based on asset
  const pipValue = getPipValue(symbol);
  
  // Calculate raw profit
  const rawProfit = pipDiff * lotSize * pipValue;
  
  // Round to 2 decimal places
  return Math.round(rawProfit * 100) / 100;
}

function getPipValue(symbol: string): number {
  // Forex pairs (5 decimal places)
  if (isForex(symbol)) {
    return symbol.includes('JPY') ? 1000 : 100000;
  }
  
  // Crypto (2 decimal places)
  if (isCrypto(symbol)) {
    return 1;
  }
  
  // Indices (varies by broker)
  if (isIndex(symbol)) {
    return symbol === 'NAS100' ? 1 : 0.1;
  }
  
  // Commodities
  if (symbol === 'XAUUSD') return 100;  // Gold
  if (symbol === 'XAGUSD') return 5000; // Silver
  
  return 1; // Default
}

// Example calculations:
// EURUSD Buy: (1.09210 - 1.08542) × 0.5 × 100000 = $334
// BTCUSD Buy: (52000 - 51000) × 0.1 × 1 = $100`
  },
  {
    id: '21',
    category: 'calculations',
    question: {
      en: 'How is Win Rate calculated?',
      ar: 'كيف يتم حساب نسبة النجاح؟'
    },
    answer: {
      en: 'Win Rate = (Number of Winning Trades / Total Closed Trades) × 100. A winning trade is any trade with profit > 0. Break-even trades (profit = 0) are excluded from the calculation. For example, if you have 8 wins, 2 losses, and 1 break-even out of 11 total trades, your win rate is 8/10 × 100 = 80%.',
      ar: 'نسبة النجاح = (عدد الصفقات الرابحة / إجمالي الصفقات المغلقة) × 100. الصفقة الرابحة هي أي صفقة بربح > 0. يتم استبعاد الصفقات المتعادلة (الربح = 0) من الحساب. على سبيل المثال، إذا كان لديك 8 مكاسب، و2 خسائر، و1 متعادلة من إجمالي 11 صفقة، فإن نسبة النجاح الخاصة بك هي 8/10 × 100 = 80%.'
    },
    icon: Calculator,
    code: `// Win Rate Calculation
const wins = trades.filter(t => t.profit > 0).length;
const closedTrades = trades.filter(t => t.status !== 'open').length;
const winRate = (wins / closedTrades) * 100;`
  },
  {
    id: '22',
    category: 'calculations',
    question: {
      en: 'How is Profit Factor calculated?',
      ar: 'كيف يتم حساب معامل الربح؟'
    },
    answer: {
      en: 'Profit Factor = Gross Profit / Gross Loss. Gross Profit is the sum of all winning trades. Gross Loss is the absolute sum of all losing trades. A profit factor > 1.0 means you\'re profitable. > 2.0 is excellent. For example, if your wins total $1000 and losses total $400, your profit factor is 2.5.',
      ar: 'معامل الربح = إجمالي الربح / إجمالي الخسارة. إجمالي الربح هو مجموع جميع الصفقات الرابحة. إجمالي الخسارة هو المجموع المطلق لجميع الصفقات الخاسرة. معامل ربح > 1.0 يعني أنك مربح. > 2.0 ممتاز. على سبيل المثال، إذا كان مجموع مكاسبك 1000$ وخسائرك 400$، فإن معامل ربحك هو 2.5.'
    },
    icon: Calculator,
    code: `// Profit Factor Calculation
const grossProfit = trades
  .filter(t => t.profit > 0)
  .reduce((sum, t) => sum + t.profit, 0);

const grossLoss = Math.abs(trades
  .filter(t => t.profit < 0)
  .reduce((sum, t) => sum + t.profit, 0));

const profitFactor = grossLoss === 0 
  ? grossProfit 
  : grossProfit / grossLoss;`
  },
  {
    id: '23',
    category: 'calculations',
    question: {
      en: 'How is Expectancy calculated?',
      ar: 'كيف يتم حساب التوقع؟'
    },
    answer: {
      en: 'Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss). This tells you the expected profit per trade. Positive expectancy means you\'ll be profitable long-term. For example: 50% win rate, $100 avg win, $40 avg loss → Expectancy = (0.5 × $100) - (0.5 × $40) = $30 per trade.',
      ar: 'التوقع = (نسبة النجاح × متوسط الربح) - (نسبة الخسارة × متوسط الخسارة). يخبرك هذا بالربح المتوقع لكل صفقة. التوقع الإيجابي يعني أنك ستكون مربحاً على المدى الطويل. على سبيل المثال: 50% نسبة نجاح، 100$ متوسط ربح، 40$ متوسط خسارة → التوقع = (0.5 × 100$) - (0.5 × 40$) = 30$ لكل صفقة.'
    },
    icon: Calculator,
    code: `// Expectancy Calculation
const winRate = wins / totalTrades;
const lossRate = 1 - winRate;
const avgWin = grossProfit / wins;
const avgLoss = grossLoss / losses;

const expectancy = (winRate * avgWin) - (lossRate * avgLoss);

// Interpretation:
// Expectancy > 0: Profitable system
// Expectancy = 0: Break-even
// Expectancy < 0: Losing system`
  },
  {
    id: '24',
    category: 'calculations',
    question: {
      en: 'How is Decision Quality Index (DQI) calculated?',
      ar: 'كيف يتم حساب مؤشر جودة القرار (DQI)؟'
    },
    answer: {
      en: 'DQI = Σ(Component × Weight) × (1 - Penalty) × Multiplier. Components: Plan Quality (25%), Risk Management (25%), Execution (20%), Emotional Control (15%), Documentation (15%). Penalties apply for violations like no stop loss (-15%). Consistency multiplier rewards stable performance (+10-20%). Score ranges 0-100 with A-F grades.',
      ar: 'DQI = Σ(المكون × الوزن) × (1 - العقوبة) × المعامل. المكونات: جودة الخطة (25%)، إدارة المخاطر (25%)، التنفيذ (20%)، السيطرة العاطفية (15%)، التوثيق (15%). تُطبق العقوبات على المخالفات مثل عدم وجود وقف خسارة (-15%). يكافئ معامل الاتساق الأداء المستقر (+10-20%). تتراوح الدرجات من 0-100 مع درجات A-F.'
    },
    icon: Calculator,
    code: `// DQI Calculation
const components = {
  planQuality: calculatePlanQuality(trades),      // 0-100
  riskManagement: calculateRiskScore(trades),     // 0-100
  execution: calculateExecution(trades),          // 0-100
  emotionalControl: calculateEmotionScore(trades),// 0-100
  documentation: calculateDocScore(trades)        // 0-100
};

const weightedScore = 
  (components.planQuality * 0.25) +
  (components.riskManagement * 0.25) +
  (components.execution * 0.20) +
  (components.emotionalControl * 0.15) +
  (components.documentation * 0.15);

const penalty = calculateViolations(trades);      // 0-0.30
const multiplier = calculateConsistency(trades);  // 1.0-1.2

const DQI = weightedScore * (1 - penalty) * multiplier;`
  },
  {
    id: '25',
    category: 'calculations',
    question: {
      en: 'How is Risk Percentage calculated?',
      ar: 'كيف يتم حساب نسبة المخاطرة؟'
    },
    answer: {
      en: 'Risk % = (Amount Risked / Account Balance) × 100. Amount Risked = |Entry - Stop Loss| × Position Size × Pip Value. For example: Account $10,000, risking $100 on a trade → Risk % = 1%. Professional traders typically risk 1-2% per trade.',
      ar: 'نسبة المخاطرة % = (المبلغ المعرض للمخاطرة / رصيد الحساب) × 100. المبلغ المعرض للمخاطرة = |الدخول - وقف الخسارة| × حجم المركز × قيمة النقطة. على سبيل المثال: حساب 10,000$، المخاطرة بـ100$ في صفقة → نسبة المخاطرة % = 1%. عادةً ما يخاطر المتداولون المحترفون بـ1-2% لكل صفقة.'
    },
    icon: Calculator,
    code: `// Risk Percentage Calculation
const riskAmount = Math.abs(entry - stopLoss) 
  × lotSize 
  × pipValue;

const riskPercent = (riskAmount / accountBalance) * 100;

// Example:
// Entry: 1.08500, SL: 1.08200
// Lot: 1.0, Pip Value: $10
// Account: $10,000
// Risk Amount = 0.00300 × 1.0 × 10 = $300
// Risk % = 3% (too high!)`
  },
  {
    id: '26',
    category: 'calculations',
    question: {
      en: 'How is Maximum Drawdown calculated?',
      ar: 'كيف يتم حساب أقصى تراجع؟'
    },
    answer: {
      en: 'Max Drawdown measures the largest peak-to-trough decline in your equity curve. It\'s calculated by tracking your running balance and finding the largest percentage drop from a previous high. For example, if your balance peaked at $12,000 then dropped to $10,000, your drawdown is 16.7%.',
      ar: 'يقيس أقصى تراجع أكبر انخفاض من القمة إلى القاع في منحنى الأسهم الخاص بك. يتم حسابه عن طريق تتبع رصيدك الجاري وإيجاد أكبر انخفاض نسبي من ارتفاع سابق. على سبيل المثال، إذا بلغ رصيدك ذروة عند 12,000$ ثم انخفض إلى 10,000$، فإن تراجعك هو 16.7%.'
    },
    icon: Calculator,
    code: `// Max Drawdown Calculation
let peak = initialBalance;
let maxDrawdown = 0;

trades.forEach(trade => {
  balance += trade.profit;
  
  if (balance > peak) {
    peak = balance;
  }
  
  const drawdown = (peak - balance) / peak;
  maxDrawdown = Math.max(maxDrawdown, drawdown);
});

// Result as percentage
const maxDrawdownPercent = maxDrawdown * 100;`
  },
  {
    id: '27',
    category: 'calculations',
    question: {
      en: 'How is the Confidence Interval calculated?',
      ar: 'كيف يتم حساب فترة الثقة؟'
    },
    answer: {
      en: 'Confidence Interval = Score ± (1.96 × Standard Error). Standard Error = Standard Deviation / √n. This gives you a 95% confidence range for your metrics. For example, if your win rate is 60% with a CI of [52%, 68%], you can be 95% confident your true win rate falls in that range.',
      ar: 'فترة الثقة = الدرجة ± (1.96 × الخطأ المعياري). الخطأ المعياري = الانحراف المعياري / √n. يعطيك هذا نطاق ثقة 95% لمقاييسك. على سبيل المثال، إذا كانت نسبة نجاحك 60% مع فترة ثقة [52%، 68%]، يمكنك أن تكون واثقاً بنسبة 95% من أن نسبة نجاحك الحقيقية تقع في هذا النطاق.'
    },
    icon: Calculator,
    code: `// Confidence Interval (95%)
const standardDeviation = calculateStdDev(values);
const standardError = standardDeviation / Math.sqrt(sampleSize);
const marginOfError = 1.96 * standardError;  // 95% CI

const confidenceInterval = [
  score - marginOfError,
  score + marginOfError
];

// Interpretation:
// 95% chance true value is within CI
// Larger sample = narrower CI`
  },
  {
    id: '28',
    category: 'calculations',
    question: {
      en: 'Show me complete profit calculation with pip values',
      ar: 'أرني حساب الربح الكامل مع قيم النقاط'
    },
    answer: {
      en: 'Complete profit calculation breakdown with different asset types:',
      ar: 'تفصيل حساب الربح الكامل مع أنواع أصول مختلفة:'
    },
    icon: Calculator,
    code: `// COMPLETE PROFIT CALCULATIONS

// 1. FOREX (5 decimal places)
// EURUSD: 1 pip = 0.00010
// Buy 0.5 lots at 1.08500, sell at 1.09200
Profit = (1.09200 - 1.08500) × 0.5 × 100000
       = 0.00700 × 50000 
       = $350

// USDJPY: 1 pip = 0.010 (3 decimals)
// Buy 1.0 lots at 149.500, sell at 150.200
Profit = (150.200 - 149.500) × 1.0 × 1000
       = 0.700 × 1000
       = $700

// 2. CRYPTO (2 decimal places)
// BTCUSD: 1 point = $1
// Buy 0.1 lots at 52000.00, sell at 53000.00
Profit = (53000.00 - 52000.00) × 0.1 × 1
       = 1000 × 0.1
       = $100

// 3. GOLD (XAUUSD)
// 1 pip = 0.01 (2 decimals)
// Buy 0.2 lots at 2015.00, sell at 2030.00
Profit = (2030.00 - 2015.00) × 0.2 × 100
       = 15.00 × 20
       = $300

// 4. INDICES
// NAS100: 1 point = $1 (usually)
// Buy 0.5 lots at 17500, sell at 17800
Profit = (17800 - 17500) × 0.5 × 1
       = 300 × 0.5
       = $150

// CODE IMPLEMENTATION:
function calculateProfit(
  entry: number,
  exit: number,
  type: 'buy' | 'sell',
  lotSize: number,
  symbol: string
): number {
  
  const multiplier = type === 'buy' ? 1 : -1;
  const priceDiff = (exit - entry) * multiplier;
  
  const pipValues: Record<string, number> = {
    'EURUSD': 100000,  // 5 decimals
    'GBPUSD': 100000,
    'USDJPY': 1000,    // 3 decimals
    'XAUUSD': 100,     // 2 decimals
    'BTCUSD': 1,       // 2 decimals
    'NAS100': 1,       // varies
    'US30': 0.1
  };
  
  const pipValue = pipValues[symbol] || 100000;
  
  return priceDiff * lotSize * pipValue;
}`
  },

  // ========== PSYCHOLOGY (29-36) ==========
  {
    id: '29',
    category: 'psychology',
    question: {
      en: 'What is the Trading Psychology Analyzer?',
      ar: 'ما هو محلل علم النفس التداولي؟'
    },
    answer: {
      en: 'The Trading Psychology Analyzer is an AI-powered system that examines your trading data to identify behavioral patterns, psychological weaknesses, and emotional biases. It provides a comprehensive psychological profile with actionable recommendations to improve your mental game and trading discipline.',
      ar: 'محلل علم النفس التداولي هو نظام مدعوم بالذكاء الاصطناعي يفحص بيانات التداول الخاصة بك لتحديد الأنماط السلوكية والضعف النفسي والتحيزات العاطفية. يوفر ملفاً نفسياً شاملاً مع توصيات قابلة للتنفيذ لتحسين لعبتك الذهنية وانضباطك في التداول.'
    },
    icon: Brain
  },
  {
    id: '30',
    category: 'psychology',
    question: {
      en: 'What behavioral patterns does ProTrade detect?',
      ar: 'ما هي الأنماط السلوكية التي يكتشفها بروتريد؟'
    },
    answer: {
      en: 'ProTrade detects 5 major patterns: 1) Overtrading (taking too many trades), 2) Revenge Trading (trading after losses to "make back" money), 3) FOMO Trading (fear of missing out), 4) Strategy Hopping (constantly switching strategies), 5) Emotional Trading (decisions based on feelings). Each pattern includes frequency analysis and impact assessment.',
      ar: 'يكتشف بروتريد 5 أنماط رئيسية: 1) الإفراط في التداول (إجراء صفقات كثيرة جداً)، 2) التداول الانتقامي (التداول بعد الخسائر لـ"استعادة" المال)، 3) تداول FOMO (الخوف من فوات الفرصة)، 4) تبديل الاستراتيجيات (التبديل المستمر بين الاستراتيجيات)، 5) التداول العاطفي (القرارات القائمة على المشاعر). يتضمن كل نمط تحليل التكرار وتقييم الأثر.'
    },
    icon: Brain
  },
  {
    id: '31',
    category: 'psychology',
    question: {
      en: 'What psychological weaknesses are identified?',
      ar: 'ما هي الضعف النفسي التي يتم تحديدها؟'
    },
    answer: {
      en: 'The system identifies 4 key weaknesses: 1) Loss Aversion (cutting winners short due to fear), 2) Confirmation Bias (only seeking confirming evidence), 3) Overconfidence (increasing risk after wins), 4) Impulsivity (acting without planning). Each weakness includes triggers, manifestations, and countermeasures.',
      ar: 'يحدد النظام 4 نقاط ضعف رئيسية: 1) رهاب الخسارة (قطع الصفقات الرابحة مبكراً بسبب الخوف)، 2) تحيز التأكيد (البحث فقط عن الأدلة المؤكدة)، 3) الثقة المفرطة (زيادة المخاطرة بعد المكاسب)، 4) الاندفاع (العمل بدون تخطيط). يتضمن كل ضعف المحفزات والتصنيعات والتدابير المضادة.'
    },
    icon: Brain
  },
  {
    id: '32',
    category: 'psychology',
    question: {
      en: 'How is the Emotional Impact Score calculated?',
      ar: 'كيف يتم حساب درجة التأثير العاطفي؟'
    },
    answer: {
      en: 'EIS = Awareness × Stability × (1 - |Bias|) × 25. Awareness = % of trades with emotions logged. Stability = Emotional consistency (low entropy). Bias = Correlation between negative emotions and losses. Score ranges 0-100. Higher scores indicate better emotional control and awareness.',
      ar: 'EIS = الوعي × الاستقرار × (1 - |التحيز|) × 25. الوعي = % من الصفقات مع تسجيل المشاعر. الاستقرار = الاتساق العاطفي (الانتروبيا المنخفضة). التحيز = الارتباط بين المشاعر السلبية والخسائر. تتراوح الدرجات من 0-100. تشير الدرجات الأعلى إلى سيطرة عاطفية ووعي أفضل.'
    },
    icon: Brain
  },
  {
    id: '33',
    category: 'psychology',
    question: {
      en: 'What is the Improvement Plan?',
      ar: 'ما هي خطة التحسين؟'
    },
    answer: {
      en: 'The Improvement Plan is a personalized action plan generated based on your psychological profile. It includes: Immediate Actions (do today), Short-term Goals (1-4 weeks), Medium-term Goals (1-3 months), Daily Routines, and Psychological Exercises. Each item has specific, measurable targets and timelines.',
      ar: 'خطة التحسين هي خطة عمل مخصصة يتم إنشاؤها بناءً على ملفك النفسي. تشمل: الإجراءات الفورية (افعلها اليوم)، الأهداف قصيرة المدى (1-4 أسابيع)، الأهداف متوسطة المدى (1-3 أشهر)، الروتينات اليومية، والتمارين النفسية. يحتوي كل عنصر على أهداف محددة وقابلة للقياس وجداول زمنية.'
    },
    icon: Brain
  },
  {
    id: '34',
    category: 'psychology',
    question: {
      en: 'How can I improve my trading discipline?',
      ar: 'كيف يمكنني تحسين انضباطي في التداول؟'
    },
    answer: {
      en: 'ProTrade recommends: 1) Set a maximum of 2-3 trades per day, 2) Use forced cooling-off periods between losses, 3) Pre-define all trade parameters before entry, 4) Complete a pre-trade checklist, 5) Stop trading after 2 consecutive losses, 6) Take regular breaks, 7) Practice mindfulness and emotional regulation techniques.',
      ar: 'يوصي بروتريد بـ: 1) تحديد حد أقصى من صفقتين إلى ثلاث صفقات يومياً، 2) استخدام فترات تبريد إجبارية بين الخسائر، 3) تحديد جميع معلمات الصفقة مسبقاً قبل الدخول، 4) إكمال قائمة التحقق قبل الصفقة، 5) التوقف عن التداول بعد خسارتين متتاليتين، 6) أخذ استراحات منتظمة، 7) ممارسة التقنيات الذهنية وتنظيم العواطف.'
    },
    icon: Brain
  },
  {
    id: '35',
    category: 'psychology',
    question: {
      en: 'What are Red Flags in my psychological profile?',
      ar: 'ما هي العلامات الحمراء في ملفي النفسي؟'
    },
    answer: {
      en: 'Red Flags are critical issues requiring immediate attention: Trading without stop losses, Martingale behavior (increasing size after losses), Multiple severe psychological weaknesses, Chronic overtrading, or Revenge trading patterns. The app will alert you with urgent action items if these are detected.',
      ar: 'العلامات الحمراء هي قضايا حرجة تتطلب اهتماماً فورياً: التداول بدون وقف خسارة، سلوك مارتينجال (زيادة الحجم بعد الخسائر)، ضعف نفسي شديد متعدد، إفراط مزمن في التداول، أو أنماط تداول انتقامي. سيقوم التطبيق بتنبيهك مع عناصر عمل عاجلة إذا تم اكتشاف هذه.'
    },
    icon: AlertCircle
  },
  {
    id: '36',
    category: 'psychology',
    question: {
      en: 'How do I use the psychological exercises?',
      ar: 'كيف يمكنني استخدام التمارين النفسية؟'
    },
    answer: {
      en: 'ProTrade provides three types of exercises: 1) The 5-Minute Pause (before every trade to reduce impulsivity), 2) Devil\'s Advocate (write 3 reasons the trade could fail to combat confirmation bias), 3) Win/Loss Visualization (daily practice to prepare mentally for both outcomes). Each includes step-by-step instructions and expected benefits.',
      ar: 'يوفر بروتريد ثلاثة أنواع من التمارين: 1) التوقف لمدة 5 دقائق (قبل كل صفقة لتقليل الاندفاع)، 2) محامي الشيطان (اكتب 3 أسباب قد تفشل فيها الصفقة لمكافحة تحيز التأكيد)، 3) التصور الذهني للربح/الخسارة (ممارسة يومية للاستعداد ذهنياً لكلا النتيجتين). يتضمن كل تمرين تعليمات خطوة بخطوة والفوائد المتوقعة.'
    },
    icon: Brain
  },

  // ========== TECHNICAL (37-42) ==========
  {
    id: '37',
    category: 'technical',
    question: {
      en: 'What technologies does ProTrade use?',
      ar: 'ما هي التقنيات التي يستخدمها بروتريد؟'
    },
    answer: {
      en: 'ProTrade is built with: React 18 for UI, TypeScript for type safety, Vite for fast development, Tailwind CSS for styling, Zustand for state management, Recharts for data visualization, Lucide for icons, and localStorage for data persistence. It\'s a modern, fast, and reliable tech stack.',
      ar: 'تم بناء بروتريد باستخدام: React 18 لواجهة المستخدم، TypeScript لسلامة الأنواع، Vite للتطوير السريع، Tailwind CSS للتنسيق، Zustand لإدارة الحالة، Recharts لتصور البيانات، Lucide للأيقونات، وlocalStorage للاستمرارية. إنه مكدس تقني حديث وسريع وموثوق.'
    },
    icon: Shield
  },
  {
    id: '38',
    category: 'technical',
    question: {
      en: 'Where is my data stored?',
      ar: 'أين يتم تخزين بياناتي؟'
    },
    answer: {
      en: 'Your data is stored in your browser\'s localStorage, which is local to your device. It never leaves your computer. You can verify this by pressing F12 → Application → Local Storage. Look for the "protrade_data" entry. This means complete privacy but also means you need to backup your data manually.',
      ar: 'يتم تخزين بياناتك في localStorage الخاص بالمتصفح، وهو محلي على جهازك. لا تغادر جهازك أبداً. يمكنك التحقق من ذلك بالضغط على F12 → التطبيق → التخزين المحلي. ابحث عن إدخال "protrade_data". هذا يعني خصوصية كاملة ولكنه يعني أيضاً أنك بحاجة لعمل نسخة احتياطية من بياناتك يدوياً.'
    },
    icon: Shield
  },
  {
    id: '39',
    category: 'technical',
    question: {
      en: 'How do I clear all data and start fresh?',
      ar: 'كيف يمكنني مسح جميع البيانات والبدء من جديد؟'
    },
    answer: {
      en: 'Go to Settings → Danger Zone → Reset All Data. This will permanently delete all your trades, sessions, and strategies. Alternatively, you can clear browser data for this site or manually delete the protrade_data entry from localStorage using browser developer tools.',
      ar: 'انتقل إلى الإعدادات → منطقة الخطر → إعادة تعيين جميع البيانات. سيؤدي هذا إلى حذف جميع صفقاتك وجلساتك واستراتيجياتك بشكل دائم. بدلاً من ذلك، يمكنك مسح بيانات المتصفح لهذا الموقع أو حذف إدخال protrade_data يدوياً من localStorage باستخدام أدوات مطور المتصفح.'
    },
    icon: Shield
  },
  {
    id: '40',
    category: 'technical',
    question: {
      en: 'ProTrade is not loading, what should I do?',
      ar: 'بروتريد لا يعمل، ماذا يجب أن أفعل؟'
    },
    answer: {
      en: 'Try these steps: 1) Refresh the page (F5), 2) Clear browser cache (Ctrl+Shift+R), 3) Check if localStorage is full (delete old data), 4) Try a different browser, 5) Check browser console (F12) for errors. If data is corrupted, you may need to reset and restore from backup.',
      ar: 'جرب هذه الخطوات: 1) تحديث الصفحة (F5)، 2) مسح ذاكرة التخزين المؤقت للمتصفح (Ctrl+Shift+R)، 3) تحقق مما إذا كان localStorage ممتلئاً (احذف البيانات القديمة)، 4) جرب متصفحاً مختلفاً، 5) تحقق من وحدة تحكم المتصفح (F12) للأخطاء. إذا كانت البيانات تالفة، قد تحتاج إلى إعادة التعيين والاستعادة من النسخة الاحتياطية.'
    },
    icon: AlertCircle
  },
  {
    id: '41',
    category: 'technical',
    question: {
      en: 'How do I report a bug or suggest a feature?',
      ar: 'كيف يمكنني الإبلاغ عن خطأ أو اقتراح ميزة؟'
    },
    answer: {
      en: 'Go to Settings → Help & Support → Contact Us. You can also email support@protrade.app or open an issue on our GitHub repository. Please include: What you were doing, what you expected, what actually happened, and screenshots if applicable.',
      ar: 'انتقل إلى الإعدادات → المساعدة والدعم → اتصل بنا. يمكنك أيضاً إرسال بريد إلكتروني إلى support@protrade.app أو فتح قضية في مستودع GitHub الخاص بنا. يرجى تضمين: ما كنت تفعله، ما توقعته، ما حدث فعلياً، ولقطات الشاشة إن أمكن.'
    },
    icon: HelpCircle
  },
  {
    id: '42',
    category: 'technical',
    question: {
      en: 'Can I use ProTrade on multiple devices?',
      ar: 'هل يمكنني استخدام بروتريد على أجهزة متعددة؟'
    },
    answer: {
      en: 'Currently, ProTrade stores data locally on each device. To use on multiple devices, you need to manually export your data from one device and import it to another. We\'re working on optional cloud sync in future updates while maintaining our privacy-first approach.',
      ar: 'حالياً، يقوم بروتريد بتخزين البيانات محلياً على كل جهاز. لاستخدام أجهزة متعددة، تحتاج إلى تصدير بياناتك يدوياً من جهاز واحد واستيرادها إلى آخر. نعمل على مزامنة سحابية اختيارية في التحديثات المستقبلية مع الحفاظ على نهجنا الذي يضع الخصوصية في المقام الأول.'
    },
    icon: Shield
  },

  // ========== FEATURES (43-45) ==========
  {
    id: '43',
    category: 'features',
    question: {
      en: 'What are Quantitative Analytics?',
      ar: 'ما هي التحليلات الكمية؟'
    },
    answer: {
      en: 'Quantitative Analytics are advanced mathematical metrics including: Decision Quality Index (DQI), Emotional Impact Score (EIS), Strategy Reliability Coefficient (SRC), and Session Performance Stability (SPS). These use statistical methods like standard deviation, correlation, and entropy to measure your trading objectively.',
      ar: 'التحليلات الكمية هي مقاييس رياضية متقدمة تشمل: مؤشر جودة القرار (DQI)، درجة التأثير العاطفي (EIS)، معامل موثوقية الاستراتيجية (SRC)، واستقرار أداء الجلسة (SPS). تستخدم هذه الطرق الإحصائية مثل الانحراف المعياري والارتباط والانتروبيا لقياس تداولك بموضوعية.'
    },
    icon: TrendingUp
  },
  {
    id: '44',
    category: 'features',
    question: {
      en: 'How does the Decision Quality Index work?',
      ar: 'كيف يعمل مؤشر جودة القرار؟'
    },
    answer: {
      en: 'DQI measures your trading process quality on a scale of 0-100 with A-F grades. It evaluates: Plan Quality (25%), Risk Management (25%), Execution Precision (20%), Emotional Control (15%), and Documentation (15%). It focuses on HOW you trade, not just your results. High DQI with losses = good process that needs time.',
      ar: 'يقيس DQI جودة عملية التداول الخاصة بك على مقياس 0-100 مع درجات A-F. يقيم: جودة الخطة (25%)، إدارة المخاطر (25%)، دقة التنفيذ (20%)، السيطرة العاطفية (15%)، والتوثيق (15%). يركز على كيفية تداولك، وليس فقط نتائجك. DQI عالي مع خسائر = عملية جيدة تحتاج وقت.'
    },
    icon: TrendingUp
  },
  {
    id: '45',
    category: 'features',
    question: {
      en: 'What makes ProTrade different from other trading journals?',
      ar: 'ما الذي يميز بروتريد عن يوميات التداول الأخرى؟'
    },
    answer: {
      en: 'ProTrade is unique because: 1) It focuses on Decision Quality over profit, 2) Provides AI-powered psychological analysis, 3) Uses quantitative metrics (DQI, EIS, SRC, SPS), 4) Detects behavioral patterns automatically, 5) Offers actionable improvement plans, 6) Completely free with no premium tiers, 7) Privacy-first (data never leaves your device).',
      ar: 'بروتريد فريد لأنه: 1) يركز على جودة القرار بدلاً من الربح، 2) يوفر تحليلاً نفسياً مدعوماً بالذكاء الاصطناعي، 3) يستخدم مقاييس كمية (DQI، EIS، SRC، SPS)، 4) يكتشف الأنماط السلوكية تلقائياً، 5) يقدم خطط تحسين قابلة للتنفيذ، 6) مجاني تماماً بدون مستويات مدفوعة، 7) يضع الخصوصية أولاً (البيانات لا تغادر جهازك أبداً).'
    },
    icon: CheckCircle
  }
];

// ============================================
// FAQ PAGE COMPONENT
// ============================================

const FAQPage: React.FC = () => {
  const { settings } = useStore();
  const lang = settings.language || 'en';
  const isRTL = lang === 'ar';
  
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const categories = [
    { id: 'all', label: { en: 'All Questions', ar: 'جميع الأسئلة' } },
    { id: 'general', label: { en: 'General', ar: 'عام' } },
    { id: 'trading', label: { en: 'Trading', ar: 'التداول' } },
    { id: 'calculations', label: { en: 'Calculations', ar: 'الحسابات' } },
    { id: 'psychology', label: { en: 'Psychology', ar: 'علم النفس' } },
    { id: 'technical', label: { en: 'Technical', ar: 'تقني' } },
    { id: 'features', label: { en: 'Features', ar: 'الميزات' } }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">
            {lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
          </h1>
          <p className="text-xl text-blue-100">
            {lang === 'en' 
              ? 'Everything you need to know about ProTrade. 45+ questions answered.' 
              : 'كل ما تحتاج لمعرفته عن بروتريد. أكثر من 45 سؤال مجاب.'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {cat.label[lang as keyof typeof cat.label]}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {lang === 'en' 
            ? `Showing ${filteredFAQs.length} questions`
            : `عرض ${filteredFAQs.length} سؤال`}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const Icon = faq.icon || HelpCircle;
            const isOpen = openItems.has(faq.id);

            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {faq.question[lang as keyof typeof faq.question]}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pl-14">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {faq.answer[lang as keyof typeof faq.answer]}
                      </p>
                      
                      {faq.code && (
                        <div className="mt-4">
                          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm text-green-400 font-mono whitespace-pre">
                              {faq.code}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
