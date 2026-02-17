import React from 'react';

// ============================================
// FINTECH DASHBOARD REDESIGN - DESIGN SYSTEM
// ============================================
// 
// PRINCIPLES:
// 1. 5-Second Rule: Key insights visible immediately
// 2. Decision Quality > Profit: Focus on process, not outcome
// 3. Discipline Visibility: Make good/bad habits obvious
// 4. Cognitive Load: Minimal UI, maximum clarity
//
// ============================================

export const DesignSystem = {
  // Color System - Trust & Performance
  colors: {
    // Primary - Trust (Deep Blue)
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      900: '#1E3A8A',
    },
    // Success - Growth (Emerald)
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      500: '#10B981',
      600: '#059669',
    },
    // Warning - Caution (Amber)
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#F59E0B',
      600: '#D97706',
    },
    // Danger - Risk (Rose)
    danger: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      500: '#F43F5E',
      600: '#E11D48',
    },
    // Discipline Score - Purple
    discipline: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      500: '#8B5CF6',
      600: '#7C3AED',
    },
    // Neutral - Clean backgrounds
    neutral: {
      0: '#FFFFFF',
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },

  // Typography - Clear hierarchy
  typography: {
    // Display - Largest numbers
    display: {
      size: '48px',
      weight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    },
    // H1 - Section headers
    h1: {
      size: '32px',
      weight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
    },
    // H2 - Card titles
    h2: {
      size: '20px',
      weight: '600',
      lineHeight: '1.3',
    },
    // H3 - Labels
    h3: {
      size: '14px',
      weight: '600',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    // Body - Primary text
    body: {
      size: '16px',
      weight: '400',
      lineHeight: '1.5',
    },
    // Small - Secondary info
    small: {
      size: '14px',
      weight: '400',
      lineHeight: '1.5',
    },
    // Caption - Metadata
    caption: {
      size: '12px',
      weight: '500',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },

  // Spacing - Consistent rhythm
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },

  // Border Radius
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Shadows - Depth hierarchy
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },

  // Grid System
  grid: {
    columns: 12,
    gutter: '24px',
    maxWidth: '1440px',
  },
};

// ============================================
// LAYOUT STRUCTURE
// ============================================

export const LayoutStructure = {
  // 3-Zone Layout for 5-Second Insights
  zones: {
    // Zone 1: "At a Glance" - Top Bar (5 seconds)
    header: {
      height: '80px',
      purpose: 'Instant recognition of current state',
      components: [
        'Account Health Score (0-100)',
        'Today\'s Discipline Rating',
        'Active Session Status',
        'Quick Actions (3 max)',
      ],
    },
    
    // Zone 2: "Performance DNA" - Left Column
    sidebar: {
      width: '320px',
      purpose: 'Behavioral patterns & discipline metrics',
      components: [
        'Decision Quality Score',
        'Discipline Radar Chart',
        'Recent Mistakes (Top 3)',
        'Streak Counter',
        'Strategy Adherence %',
      ],
    },
    
    // Zone 3: "Live Markets" - Main Content
    main: {
      purpose: 'Current opportunities & recent activity',
      components: [
        'Trade Setup Quality Cards',
        'Market Context Strip',
        'Recent Trades (Last 5)',
        'Equity Curve (Mini)',
      ],
    },
  },
};

// ============================================
// COMPONENT HIERARCHY
// ============================================

export const ComponentHierarchy = {
  // Level 1: Primary Metrics (Most Important)
  primary: [
    {
      name: 'DecisionQualityScore',
      importance: 'Critical',
      visibility: 'Always visible',
      updateFrequency: 'Real-time',
      visual: 'Large circular progress with number',
    },
    {
      name: 'DisciplineIndex',
      importance: 'Critical',
      visibility: 'Always visible',
      updateFrequency: 'Per trade',
      visual: 'Color-coded gauge 0-100',
    },
    {
      name: 'AccountHealth',
      importance: 'High',
      visibility: 'Always visible',
      updateFrequency: 'Real-time',
      visual: 'Status pill with trend arrow',
    },
  ],

  // Level 2: Secondary Insights
  secondary: [
    {
      name: 'SetupQualityCards',
      importance: 'High',
      visibility: 'When opportunity exists',
      visual: 'Card stack with A-F grading',
    },
    {
      name: 'BehavioralPatterns',
      importance: 'High',
      visibility: 'Sidebar always',
      visual: 'Radar chart with 5 axes',
    },
    {
      name: 'RecentMistakes',
      importance: 'Medium',
      visibility: 'Sidebar always',
      visual: 'List with severity colors',
    },
  ],

  // Level 3: Supporting Data
  tertiary: [
    {
      name: 'EquityCurve',
      importance: 'Medium',
      visibility: 'Main area',
      visual: 'Sparkline chart (minimal)',
    },
    {
      name: 'TradeHistory',
      importance: 'Low',
      visibility: 'Below fold',
      visual: 'Compact table (5 rows)',
    },
    {
      name: 'SessionStats',
      importance: 'Low',
      visibility: 'Expandable',
      visual: 'Accordion sections',
    },
  ],
};

// ============================================
// BEHAVIOR-DRIVEN VISUAL PATTERNS
// ============================================

export const BehaviorPatterns = {
  // Pattern 1: Loss Aversion Mitigation
  // Show losses smaller than wins visually, emphasize process over outcome
  visualBiases: {
    lossAversion: {
      technique: 'Emphasize R:R ratio, not $ amount',
      visual: 'R:R badge larger than profit number',
      goal: 'Focus on good decisions, not outcomes',
    },
    recencyBias: {
      technique: 'Show streak counter prominently',
      visual: 'Large streak number with fire emoji',
      goal: 'Encourage consistent behavior',
    },
    overconfidence: {
      technique: 'Show max drawdown next to profit',
      visual: 'Dual metric card with risk context',
      goal: 'Maintain humility and risk awareness',
    },
  },

  // Pattern 2: Discipline Visualization
  disciplineMetrics: {
    // Plan Adherence
    planAdherence: {
      label: 'Plan',
      icon: '🎯',
      description: 'Followed entry/exit rules',
    },
    // Risk Management
    riskManagement: {
      label: 'Risk',
      icon: '🛡️',
      description: 'Proper position sizing',
    },
    // Emotional Control
    emotionalControl: {
      label: 'Mindset',
      icon: '🧠',
      description: 'Pre-defined emotions',
    },
    // Strategy Compliance
    strategyCompliance: {
      label: 'Strategy',
      icon: '📋',
      description: 'Followed strategy rules',
    },
    // Journal Quality
    journalQuality: {
      label: 'Journal',
      icon: '✍️',
      description: 'Complete documentation',
    },
  },

  // Pattern 3: Decision Quality Framework
  decisionQuality: {
    // A-Grade: High probability setup + perfect execution
    gradeA: {
      criteria: ['Clear setup', 'Proper risk', 'Full plan', 'Good emotion'],
      color: '#10B981',
      badge: 'A',
    },
    // B-Grade: Good setup, minor execution issue
    gradeB: {
      criteria: ['Clear setup', 'Slight risk deviation', 'Mostly followed plan'],
      color: '#3B82F6',
      badge: 'B',
    },
    // C-Grade: Okay setup, significant issue
    gradeC: {
      criteria: ['Setup present', 'Risk issue OR plan deviation'],
      color: '#F59E0B',
      badge: 'C',
    },
    // D-Grade: Poor setup or execution
    gradeD: {
      criteria: ['Weak setup', 'Multiple issues'],
      color: '#F97316',
      badge: 'D',
    },
    // F-Grade: No setup, emotional trade
    gradeF: {
      criteria: ['No clear setup', 'Revenge/FOMO trading'],
      color: '#EF4444',
      badge: 'F',
    },
  },
};

// ============================================
// COGNITIVE LOAD REDUCTION TECHNIQUES
// ============================================

export const CognitiveLoadReduction = {
  // Technique 1: Progressive Disclosure
  progressiveDisclosure: {
    level1: 'Only show grade (A-F)',
    level2: 'Show grade + 1 key metric',
    level3: 'Show full breakdown on hover/click',
  },

  // Technique 2: Chunking
  chunking: {
    financialMetrics: 'Grouped by theme',
    behavioralMetrics: 'Grouped by discipline',
    recentActivity: 'Max 5 items',
  },

  // Technique 3: Visual Anchors
  visualAnchors: {
    upTrend: '📈 Green arrow',
    downTrend: '📉 Red arrow',
    neutral: '➡️ Gray dash',
    attentionNeeded: '🔴 Red dot',
    goodStatus: '🟢 Green dot',
    warning: '🟡 Yellow dot',
  },

  // Technique 4: Color Consistency
  colorConsistency: {
    profit: 'Always green (success)',
    loss: 'Always red (danger)',
    discipline: 'Always purple (distinct)',
    neutral: 'Always gray (information)',
  },
};

export default DesignSystem;
