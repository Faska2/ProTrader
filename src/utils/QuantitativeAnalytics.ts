import { Trade, Session, Strategy } from '../store/useStore';

// ============================================
// QUANTITATIVE TRADING ANALYTICS ENGINE
// Advanced Metrics for Professional Trading
// ============================================

export interface QuantitativeMetrics {
  // Primary Metrics
  decisionQualityIndex: DecisionQualityIndex;
  emotionalImpactScore: EmotionalImpactScore;
  strategyReliabilityCoefficient: StrategyReliabilityCoefficient;
  sessionPerformanceStability: SessionPerformanceStability;
  
  // Secondary Metrics
  edgeConsistencyRatio: number;
  riskAdjustedDiscipline: number;
  behavioralEntropy: number;
  marketAdaptabilityIndex: number;
  
  // Composite Scores
  overallQuantitativeGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  compositeScore: number; // 0-100
}

// ============================================
// 1. DECISION QUALITY INDEX (DQI)
// ============================================
// 
// PURPOSE: Measures the quality of trading decisions 
// independent of outcome (process over profit)
//
// FORMULA: 
// DQI = Σ(wi × Ci) × (1 - Penalty) × Multiplier
//
// Where:
// - wi = Weight for component i
// - Ci = Component score (0-100)
// - Penalty = Reduction for violations
// - Multiplier = Consistency bonus

export interface DecisionQualityIndex {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  components: {
    planQuality: number;        // Weight: 25%
    riskManagement: number;     // Weight: 25%
    executionPrecision: number; // Weight: 20%
    emotionalControl: number;   // Weight: 15%
    documentation: number;      // Weight: 15%
  };
  violations: string[];
  confidenceInterval: [number, number]; // 95% CI
}

export function calculateDecisionQualityIndex(
  trades: Trade[],
  strategies: Strategy[]
): DecisionQualityIndex {
  const n = trades.length;
  
  if (n === 0) {
    return {
      score: 0,
      grade: 'F',
      components: {
        planQuality: 0,
        riskManagement: 0,
        executionPrecision: 0,
        emotionalControl: 0,
        documentation: 0,
      },
      violations: ['Insufficient data'],
      confidenceInterval: [0, 0],
    };
  }

  // Component 1: Plan Quality (25%)
  // Measures: Presence of plan, clarity of setup, defined targets
  const planQuality = calculatePlanQuality(trades);
  
  // Component 2: Risk Management (25%)
  // Measures: Position sizing, stop loss adherence, R:R ratio
  const riskManagement = calculateRiskManagementQuality(trades);
  
  // Component 3: Execution Precision (20%)
  // Measures: Entry/exit timing, slippage, order quality
  const executionPrecision = calculateExecutionPrecision(trades);
  
  // Component 4: Emotional Control (15%)
  // Measures: Emotional tracking, deviation from plan due to emotion
  const emotionalControl = calculateEmotionalControl(trades);
  
  // Component 5: Documentation (15%)
  // Measures: Completeness of journal entries
  const documentation = calculateDocumentationQuality(trades);

  // Calculate weighted score
  const weightedScore = 
    (planQuality * 0.25) +
    (riskManagement * 0.25) +
    (executionPrecision * 0.20) +
    (emotionalControl * 0.15) +
    (documentation * 0.15);

  // Penalty calculation
  const violations: string[] = [];
  let penalty = 0;

  // Violation: Trading without stop loss
  const noSLTrades = trades.filter(t => !t.sl || t.sl === 0).length;
  if (noSLTrades > 0) {
    violations.push(`${noSLTrades} trades without stop loss`);
    penalty += (noSLTrades / n) * 15;
  }

  // Violation: Oversized positions (>3% risk)
  const oversizedTrades = trades.filter(t => (t.riskPercent || 0) > 3).length;
  if (oversizedTrades > 0) {
    violations.push(`${oversizedTrades} oversized positions`);
    penalty += (oversizedTrades / n) * 10;
  }

  // Violation: No strategy defined
  const noStrategyTrades = trades.filter(t => !t.strategy).length;
  if (noStrategyTrades > 0) {
    violations.push(`${noStrategyTrades} trades without strategy`);
    penalty += (noStrategyTrades / n) * 10;
  }

  // Consistency multiplier (bonus for consistent performance)
  const consistencyBonus = calculateConsistencyBonus(trades);
  const multiplier = 1 + (consistencyBonus * 0.1);

  // Final score with penalty and multiplier
  const finalScore = Math.max(0, Math.min(100, 
    (weightedScore * (1 - penalty / 100)) * multiplier
  ));

  // Calculate 95% confidence interval
  const stdDev = calculateStandardDeviation(trades.map(t => t.profit));
  const marginOfError = 1.96 * (stdDev / Math.sqrt(n));
  const confidenceInterval: [number, number] = [
    Math.max(0, finalScore - marginOfError),
    Math.min(100, finalScore + marginOfError),
  ];

  return {
    score: Math.round(finalScore),
    grade: scoreToGrade(finalScore),
    components: {
      planQuality: Math.round(planQuality),
      riskManagement: Math.round(riskManagement),
      executionPrecision: Math.round(executionPrecision),
      emotionalControl: Math.round(emotionalControl),
      documentation: Math.round(documentation),
    },
    violations,
    confidenceInterval: [Math.round(confidenceInterval[0]), Math.round(confidenceInterval[1])],
  };
}

// Helper: Plan Quality Calculation
function calculatePlanQuality(trades: Trade[]): number {
  let score = 0;
  const n = trades.length;

  trades.forEach(trade => {
    let tradeScore = 0;
    
    // Has defined R:R (30 points)
    if (trade.rrPlanned && trade.rrPlanned > 0) tradeScore += 30;
    
    // Has defined strategy (25 points)
    if (trade.strategy && trade.strategy !== '') tradeScore += 25;
    
    // Has defined entry/exit (25 points)
    if (trade.entry && (trade.exit || trade.tp || trade.sl)) tradeScore += 25;
    
    // Has notes/documentation (20 points)
    if (trade.notes && trade.notes.length > 10) tradeScore += 20;
    
    score += tradeScore;
  });

  return score / n;
}

// Helper: Risk Management Quality
function calculateRiskManagementQuality(trades: Trade[]): number {
  let score = 0;
  const n = trades.length;

  trades.forEach(trade => {
    let tradeScore = 0;
    
    // Position sizing (40 points)
    const risk = trade.riskPercent || 0;
    if (risk <= 1) tradeScore += 40;
    else if (risk <= 2) tradeScore += 30;
    else if (risk <= 3) tradeScore += 15;
    else tradeScore += 5;
    
    // Stop loss present (30 points)
    if (trade.sl && trade.sl > 0) tradeScore += 30;
    
    // Take profit present (20 points)
    if (trade.tp && trade.tp > 0) tradeScore += 20;
    
    // R:R ratio favorable (10 points)
    if (trade.rrPlanned && trade.rrPlanned >= 2) tradeScore += 10;
    else if (trade.rrPlanned && trade.rrPlanned >= 1.5) tradeScore += 5;
    
    score += tradeScore;
  });

  return score / n;
}

// Helper: Execution Precision
function calculateExecutionPrecision(trades: Trade[]): number {
  let score = 0;
  const n = trades.length;

  trades.forEach(trade => {
    let tradeScore = 0;
    
    // Entry quality: achieved planned R:R (40 points)
    if (trade.rrActual && trade.rrPlanned) {
      const rrAchievement = trade.rrActual / trade.rrPlanned;
      if (rrAchievement >= 0.9) tradeScore += 40;
      else if (rrAchievement >= 0.7) tradeScore += 25;
      else if (rrAchievement >= 0.5) tradeScore += 10;
    }
    
    // Exit quality: hit target or stop (30 points)
    if (trade.status === 'TP' || trade.status === 'SL') tradeScore += 30;
    else if (trade.status === 'BE') tradeScore += 20;
    
    // Timeliness: exited when planned (20 points)
    // (Would need exit time data)
    
    // Rule adherence (10 points)
    if (trade.rulesUsed && trade.rulesUsed.length > 0) tradeScore += 10;
    
    score += tradeScore;
  });

  return score / n;
}

// Helper: Emotional Control
function calculateEmotionalControl(trades: Trade[]): number {
  let score = 0;
  const n = trades.length;

  trades.forEach(trade => {
    let tradeScore = 0;
    
    // Documented emotion before (40 points)
    if (trade.emotionBefore && trade.emotionBefore !== '') tradeScore += 40;
    
    // Documented emotion after (30 points)
    if (trade.emotionAfter && trade.emotionAfter !== '') tradeScore += 30;
    
    // No emotional mistakes (30 points)
    if (!trade.mistakes || trade.mistakes.length === 0) {
      tradeScore += 30;
    } else {
      // Deduct for emotional mistakes
      const emotionalMistakes = trade.mistakes.filter(m => 
        ['fomo', 'revenge', 'greed', 'fear'].some(e => m.toLowerCase().includes(e))
      ).length;
      tradeScore += Math.max(0, 30 - (emotionalMistakes * 10));
    }
    
    score += tradeScore;
  });

  return score / n;
}

// Helper: Documentation Quality
function calculateDocumentationQuality(trades: Trade[]): number {
  let score = 0;
  const n = trades.length;

  trades.forEach(trade => {
    let tradeScore = 0;
    
    // Has notes (25 points)
    if (trade.notes && trade.notes.length > 20) tradeScore += 25;
    else if (trade.notes && trade.notes.length > 0) tradeScore += 15;
    
    // Has screenshot (25 points)
    if (trade.screenshot) tradeScore += 25;
    
    // Documented mistakes (25 points)
    if (trade.mistakes && trade.mistakes.length > 0) tradeScore += 25;
    
    // Complete data entry (25 points)
    const hasAllFields = trade.symbol && trade.entry && trade.type && 
                        trade.date && trade.time;
    if (hasAllFields) tradeScore += 25;
    
    score += tradeScore;
  });

  return score / n;
}

// Helper: Consistency Bonus
function calculateConsistencyBonus(trades: Trade[]): number {
  if (trades.length < 10) return 0;
  
  // Calculate coefficient of variation of daily returns
  const dailyReturns = getDailyReturns(trades);
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / Math.abs(mean);
  
  // Lower CV = more consistent = higher bonus
  if (cv < 0.5) return 0.2;
  if (cv < 1.0) return 0.1;
  if (cv < 1.5) return 0.05;
  return 0;
}

// ============================================
// 2. EMOTIONAL IMPACT SCORE (EIS)
// ============================================
//
// PURPOSE: Quantifies the emotional component of trading
// and its correlation with performance
//
// FORMULA:
// EIS = Emotional_Awareness × (1 + Emotional_Stability) × Performance_Correlation
//
// Where:
// - Emotional_Awareness = % of trades with emotion documented
// - Emotional_Stability = Consistency of emotional state
// - Performance_Correlation = Relationship between emotion and outcome

export interface EmotionalImpactScore {
  score: number; // 0-100
  emotionalAwareness: number; // %
  emotionalStability: number; // 0-1
  emotionalBiasIndex: number; // -1 to 1
  emotionPerformanceCorrelation: number; // -1 to 1
  dominantEmotions: Array<{
    emotion: string;
    frequency: number;
    avgProfit: number;
    winRate: number;
  }>;
  recommendations: string[];
}

export function calculateEmotionalImpactScore(trades: Trade[]): EmotionalImpactScore {
  const n = trades.length;
  
  if (n === 0) {
    return {
      score: 0,
      emotionalAwareness: 0,
      emotionalStability: 0,
      emotionalBiasIndex: 0,
      emotionPerformanceCorrelation: 0,
      dominantEmotions: [],
      recommendations: ['Start tracking emotions to see analysis'],
    };
  }

  // 1. Emotional Awareness
  const tradesWithEmotion = trades.filter(t => 
    t.emotionBefore && t.emotionBefore !== ''
  ).length;
  const emotionalAwareness = (tradesWithEmotion / n) * 100;

  // 2. Emotional Stability
  // Measures consistency of emotional state over time
  const emotions = trades
    .filter(t => t.emotionBefore)
    .map(t => t.emotionBefore!.toLowerCase());
  
  const emotionCounts: Record<string, number> = {};
  emotions.forEach(e => {
    emotionCounts[e] = (emotionCounts[e] || 0) + 1;
  });
  
  // Calculate entropy (lower = more stable)
  const entropy = Object.values(emotionCounts).reduce((sum, count) => {
    const p = count / emotions.length;
    return sum - (p * Math.log2(p));
  }, 0);
  
  // Normalize: max entropy for 8 emotions = 3, so stability = 1 - (entropy/3)
  const emotionalStability = Math.max(0, 1 - (entropy / 3));

  // 3. Emotional Bias Index
  // Measures if certain emotions lead to poor decisions
  let negativeEmotionCount = 0;
  let negativeEmotionLosses = 0;
  
  const negativeEmotions = ['fear', 'greed', 'fomo', 'anxiety', 'revenge', 'frustration'];
  
  trades.forEach(trade => {
    if (trade.emotionBefore) {
      const emotion = trade.emotionBefore.toLowerCase();
      if (negativeEmotions.some(ne => emotion.includes(ne))) {
        negativeEmotionCount++;
        if (trade.profit < 0) negativeEmotionLosses++;
      }
    }
  });
  
  const emotionalBiasIndex = negativeEmotionCount > 0
    ? (negativeEmotionLosses / negativeEmotionCount) - 0.5 // Center around 0
    : 0;

  // 4. Emotion-Performance Correlation
  // Calculate correlation between emotion positivity and profit
  const emotionScores: { emotion: string; profit: number; result: 1 | 0 }[] = [];
  
  const positiveEmotions = ['focused', 'calm', 'confident', 'disciplined', 'patient'];
  const negativeEmotionList = ['fear', 'greed', 'anxiety', 'revenge', 'fomo'];
  
  trades.forEach(trade => {
    if (trade.emotionBefore) {
      const emotion = trade.emotionBefore.toLowerCase();
      let score = 0;
      
      if (positiveEmotions.some(pe => emotion.includes(pe))) score = 1;
      else if (negativeEmotionList.some(ne => emotion.includes(ne))) score = -1;
      
      emotionScores.push({
        emotion: trade.emotionBefore,
        profit: trade.profit,
        result: trade.profit > 0 ? 1 : 0,
      });
    }
  });
  
  // Calculate Pearson correlation
  const emotionPerformanceCorrelation = calculateCorrelation(
    emotionScores.map(es => positiveEmotions.some(pe => es.emotion.toLowerCase().includes(pe)) ? 1 : -1),
    emotionScores.map(es => es.profit)
  );

  // 5. Dominant Emotions Analysis
  const dominantEmotions = Object.entries(emotionCounts)
    .map(([emotion, count]) => {
      const emotionTrades = trades.filter(t => 
        t.emotionBefore?.toLowerCase() === emotion
      );
      const totalProfit = emotionTrades.reduce((sum, t) => sum + t.profit, 0);
      const wins = emotionTrades.filter(t => t.profit > 0).length;
      
      return {
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        frequency: Math.round((count / emotions.length) * 100),
        avgProfit: totalProfit / emotionTrades.length,
        winRate: (wins / emotionTrades.length) * 100,
      };
    })
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  // Calculate final EIS
  const score = Math.round(
    (emotionalAwareness * 0.4) +
    (emotionalStability * 100 * 0.3) +
    ((1 - Math.abs(emotionalBiasIndex)) * 100 * 0.3)
  );

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (emotionalAwareness < 50) {
    recommendations.push('Increase emotional tracking: Document emotions before every trade');
  }
  
  if (emotionalStability < 0.5) {
    recommendations.push('Work on emotional consistency: Your emotional state varies significantly');
  }
  
  if (emotionalBiasIndex > 0.3) {
    recommendations.push('Address emotional bias: Negative emotions correlate with losses');
  }
  
  if (dominantEmotions.some(de => de.winRate < 40)) {
    const poorEmotion = dominantEmotions.find(de => de.winRate < 40);
    recommendations.push(`Avoid trading when feeling ${poorEmotion?.emotion}: ${poorEmotion?.winRate.toFixed(0)}% win rate`);
  }

  return {
    score,
    emotionalAwareness,
    emotionalStability,
    emotionalBiasIndex,
    emotionPerformanceCorrelation,
    dominantEmotions,
    recommendations,
  };
}

// ============================================
// 3. STRATEGY RELIABILITY COEFFICIENT (SRC)
// ============================================
//
// PURPOSE: Measures the statistical reliability and 
// consistency of trading strategies
//
// FORMULA:
// SRC = (Win_Rate × Profit_Factor × Consistency) / Volatility
//
// Where:
// - Win_Rate = Winning trades / Total trades
// - Profit_Factor = Gross Profit / Gross Loss
// - Consistency = 1 - Coefficient of Variation
// - Volatility = Standard deviation of returns

export interface StrategyReliabilityCoefficient {
  overallCoefficient: number; // 0-100
  strategyScores: Array<{
    strategy: string;
    coefficient: number;
    reliability: 'high' | 'medium' | 'low' | 'untested';
    winRate: number;
    profitFactor: number;
    sampleSize: number;
    expectancy: number;
    maxConsecutiveLosses: number;
    confidenceInterval: [number, number];
  }>;
  bestStrategy: string | null;
  worstStrategy: string | null;
  diversificationScore: number;
}

export function calculateStrategyReliabilityCoefficient(
  trades: Trade[],
  strategies: Strategy[]
): StrategyReliabilityCoefficient {
  // Group trades by strategy
  const strategyTrades: Record<string, Trade[]> = {};
  
  trades.forEach(trade => {
    const strategy = trade.strategy || 'Unspecified';
    if (!strategyTrades[strategy]) {
      strategyTrades[strategy] = [];
    }
    strategyTrades[strategy].push(trade);
  });

  const strategyScores: StrategyReliabilityCoefficient['strategyScores'] = [];
  
  Object.entries(strategyTrades).forEach(([strategyName, trades]) => {
    const n = trades.length;
    
    if (n < 5) {
      // Insufficient data
      strategyScores.push({
        strategy: strategyName,
        coefficient: 0,
        reliability: 'untested',
        winRate: 0,
        profitFactor: 0,
        sampleSize: n,
        expectancy: 0,
        maxConsecutiveLosses: 0,
        confidenceInterval: [0, 0],
      });
      return;
    }

    // Calculate metrics
    const wins = trades.filter(t => t.profit > 0);
    const losses = trades.filter(t => t.profit < 0);
    
    const winRate = (wins.length / n) * 100;
    
    const grossProfit = wins.reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.profit, 0));
    const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
    
    // Calculate returns for consistency
    const returns = trades.map(t => t.profit);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / n;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / Math.abs(meanReturn || 1); // Coefficient of variation
    const consistency = Math.max(0, 1 - cv);
    
    // Expectancy
    const expectancy = (winRate / 100) * (grossProfit / Math.max(wins.length, 1)) - 
                      ((100 - winRate) / 100) * (grossLoss / Math.max(losses.length, 1));
    
    // Max consecutive losses
    let maxConsecutiveLosses = 0;
    let currentLosses = 0;
    trades.forEach(t => {
      if (t.profit < 0) {
        currentLosses++;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLosses);
      } else {
        currentLosses = 0;
      }
    });
    
    // Calculate coefficient
    // Normalize components to 0-100 scale
    const normalizedWinRate = winRate;
    const normalizedPF = Math.min(profitFactor * 25, 100); // PF of 4 = 100
    const normalizedConsistency = consistency * 100;
    const normalizedVolatility = Math.max(0, 100 - (stdDev * 2)); // Lower stdDev = higher score
    
    const coefficient = Math.round(
      (normalizedWinRate * 0.25) +
      (normalizedPF * 0.30) +
      (normalizedConsistency * 0.25) +
      (normalizedVolatility * 0.20)
    );
    
    // Confidence interval (95%)
    const marginOfError = 1.96 * (stdDev / Math.sqrt(n));
    const confidenceInterval: [number, number] = [
      Math.max(0, coefficient - marginOfError),
      Math.min(100, coefficient + marginOfError),
    ];
    
    // Determine reliability
    let reliability: 'high' | 'medium' | 'low' | 'untested';
    if (n < 10) reliability = 'untested';
    else if (coefficient >= 70 && winRate >= 55) reliability = 'high';
    else if (coefficient >= 50) reliability = 'medium';
    else reliability = 'low';
    
    strategyScores.push({
      strategy: strategyName,
      coefficient,
      reliability,
      winRate,
      profitFactor,
      sampleSize: n,
      expectancy,
      maxConsecutiveLosses,
      confidenceInterval: [Math.round(confidenceInterval[0]), Math.round(confidenceInterval[1])],
    });
  });

  // Sort by coefficient
  strategyScores.sort((a, b) => b.coefficient - a.coefficient);
  
  // Calculate overall coefficient (weighted by sample size)
  const totalTrades = strategyScores.reduce((sum, s) => sum + s.sampleSize, 0);
  const overallCoefficient = Math.round(
    strategyScores.reduce((sum, s) => sum + (s.coefficient * (s.sampleSize / totalTrades)), 0)
  );
  
  // Best and worst strategies (with minimum sample size)
  const testedStrategies = strategyScores.filter(s => s.sampleSize >= 10);
  const bestStrategy = testedStrategies.length > 0 ? testedStrategies[0].strategy : null;
  const worstStrategy = testedStrategies.length > 1 ? testedStrategies[testedStrategies.length - 1].strategy : null;
  
  // Diversification score (based on number of strategies used)
  const strategyCount = Object.keys(strategyTrades).length;
  const diversificationScore = Math.min(100, strategyCount * 25); // 4+ strategies = 100

  return {
    overallCoefficient,
    strategyScores,
    bestStrategy,
    worstStrategy,
    diversificationScore,
  };
}

// ============================================
// 4. SESSION PERFORMANCE STABILITY (SPS)
// ============================================
//
// PURPOSE: Measures consistency and stability across 
// different trading sessions
//
// FORMULA:
// SPS = 1 - (StdDev(Session_Performance) / Mean(Session_Performance))
//
// Where:
// - Session_Performance = Net profit per session
// - Lower volatility across sessions = higher stability

export interface SessionPerformanceStability {
  stabilityScore: number; // 0-100
  sessionBreakdown: Array<{
    session: string;
    trades: number;
    totalProfit: number;
    winRate: number;
    avgTrade: number;
    volatility: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  mostStableSession: string | null;
  mostVolatileSession: string | null;
  sessionConsistencyIndex: number;
  timeBasedPatterns: {
    bestHour: number | null;
    worstHour: number | null;
    bestDay: string | null;
    worstDay: string | null;
  };
}

export function calculateSessionPerformanceStability(
  trades: Trade[],
  sessions: Session[]
): SessionPerformanceStability {
  // Group trades by session name
  const sessionTrades: Record<string, Trade[]> = {};
  
  trades.forEach(trade => {
    const sessionName = trade.session || 'Unspecified';
    if (!sessionTrades[sessionName]) {
      sessionTrades[sessionName] = [];
    }
    sessionTrades[sessionName].push(trade);
  });

  const sessionBreakdown: SessionPerformanceStability['sessionBreakdown'] = [];
  
  Object.entries(sessionTrades).forEach(([sessionName, trades]) => {
    const n = trades.length;
    const wins = trades.filter(t => t.profit > 0);
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const winRate = (wins.length / n) * 100;
    const avgTrade = totalProfit / n;
    
    // Calculate volatility (standard deviation of returns)
    const returns = trades.map(t => t.profit);
    const mean = totalProfit / n;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / n;
    const volatility = Math.sqrt(variance);
    
    // Determine trend (compare first half vs second half)
    const midPoint = Math.floor(n / 2);
    const firstHalfProfit = trades.slice(0, midPoint).reduce((sum, t) => sum + t.profit, 0);
    const secondHalfProfit = trades.slice(midPoint).reduce((sum, t) => sum + t.profit, 0);
    
    let trend: 'improving' | 'stable' | 'declining';
    const profitChange = secondHalfProfit - firstHalfProfit;
    if (profitChange > avgTrade * 2) trend = 'improving';
    else if (profitChange < -avgTrade * 2) trend = 'declining';
    else trend = 'stable';
    
    sessionBreakdown.push({
      session: sessionName,
      trades: n,
      totalProfit,
      winRate,
      avgTrade,
      volatility,
      trend,
    });
  });

  // Calculate stability score
  // Lower volatility across sessions = higher stability
  const sessionAvgProfits = sessionBreakdown.map(s => s.avgTrade);
  const meanProfit = sessionAvgProfits.reduce((a, b) => a + b, 0) / sessionAvgProfits.length;
  const variance = sessionAvgProfits.reduce((sum, p) => sum + Math.pow(p - meanProfit, 2), 0) / sessionAvgProfits.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation
  const cv = stdDev / Math.abs(meanProfit || 1);
  
  // Stability score: 1 - CV, normalized to 0-100
  const stabilityScore = Math.round(Math.max(0, (1 - cv) * 100));

  // Find most and least stable sessions
  const sortedByVolatility = [...sessionBreakdown].sort((a, b) => a.volatility - b.volatility);
  const mostStableSession = sortedByVolatility.length > 0 ? sortedByVolatility[0].session : null;
  const mostVolatileSession = sortedByVolatility.length > 1 ? sortedByVolatility[sortedByVolatility.length - 1].session : null;

  // Session consistency index (how similar are sessions to each other)
  const consistencyValues = sessionBreakdown.map(s => s.winRate);
  const consistencyMean = consistencyValues.reduce((a, b) => a + b, 0) / consistencyValues.length;
  const consistencyVariance = consistencyValues.reduce((sum, v) => sum + Math.pow(v - consistencyMean, 2), 0) / consistencyValues.length;
  const sessionConsistencyIndex = Math.round(Math.max(0, 100 - (consistencyVariance / 10)));

  // Time-based patterns
  const timePatterns = analyzeTimePatterns(trades);

  return {
    stabilityScore,
    sessionBreakdown,
    mostStableSession,
    mostVolatileSession,
    sessionConsistencyIndex,
    timeBasedPatterns: timePatterns,
  };
}

// Helper: Analyze time-based patterns
function analyzeTimePatterns(trades: Trade[]): SessionPerformanceStability['timeBasedPatterns'] {
  // Analyze by hour
  const hourlyPerformance: Record<number, { profit: number; count: number }> = {};
  const dailyPerformance: Record<string, { profit: number; count: number }> = {};
  
  trades.forEach(trade => {
    if (trade.time) {
      const hour = parseInt(trade.time.split(':')[0]);
      if (!isNaN(hour)) {
        if (!hourlyPerformance[hour]) {
          hourlyPerformance[hour] = { profit: 0, count: 0 };
        }
        hourlyPerformance[hour].profit += trade.profit;
        hourlyPerformance[hour].count++;
      }
    }
    
    if (trade.date) {
      const date = new Date(trade.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!dailyPerformance[day]) {
        dailyPerformance[day] = { profit: 0, count: 0 };
      }
      dailyPerformance[day].profit += trade.profit;
      dailyPerformance[day].count++;
    }
  });
  
  // Find best/worst hours (minimum 3 trades)
  const validHours = Object.entries(hourlyPerformance)
    .filter(([_, data]) => data.count >= 3)
    .map(([hour, data]) => ({ 
      hour: parseInt(hour), 
      avgProfit: data.profit / data.count 
    }));
  
  const bestHour = validHours.length > 0 
    ? validHours.reduce((max, h) => h.avgProfit > max.avgProfit ? h : max).hour 
    : null;
  const worstHour = validHours.length > 0 
    ? validHours.reduce((min, h) => h.avgProfit < min.avgProfit ? h : min).hour 
    : null;
  
  // Find best/worst days (minimum 3 trades)
  const validDays = Object.entries(dailyPerformance)
    .filter(([_, data]) => data.count >= 3)
    .map(([day, data]) => ({ day, avgProfit: data.profit / data.count }));
  
  const bestDay = validDays.length > 0 
    ? validDays.reduce((max, d) => d.avgProfit > max.avgProfit ? d : max).day 
    : null;
  const worstDay = validDays.length > 0 
    ? validDays.reduce((min, d) => d.avgProfit < min.avgProfit ? d : min).day 
    : null;
  
  return {
    bestHour,
    worstHour,
    bestDay,
    worstDay,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function calculateStandardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function getDailyReturns(trades: Trade[]): number[] {
  const dailyPnL: Record<string, number> = {};
  
  trades.forEach(trade => {
    if (!dailyPnL[trade.date]) {
      dailyPnL[trade.date] = 0;
    }
    dailyPnL[trade.date] += trade.profit;
  });
  
  return Object.values(dailyPnL);
}

// ============================================
// COMPOSITE SCORE CALCULATION
// ============================================

export function calculateCompositeQuantitativeMetrics(
  trades: Trade[],
  sessions: Session[],
  strategies: Strategy[]
): QuantitativeMetrics {
  const dqi = calculateDecisionQualityIndex(trades, strategies);
  const eis = calculateEmotionalImpactScore(trades);
  const src = calculateStrategyReliabilityCoefficient(trades, strategies);
  const sps = calculateSessionPerformanceStability(trades, sessions);
  
  // Calculate secondary metrics
  const edgeConsistencyRatio = calculateEdgeConsistencyRatio(trades);
  const riskAdjustedDiscipline = calculateRiskAdjustedDiscipline(trades, dqi.score);
  const behavioralEntropy = calculateBehavioralEntropy(trades);
  const marketAdaptabilityIndex = calculateMarketAdaptabilityIndex(trades);
  
  // Calculate composite score
  const compositeScore = Math.round(
    (dqi.score * 0.30) +
    (eis.score * 0.20) +
    (src.overallCoefficient * 0.25) +
    (sps.stabilityScore * 0.15) +
    (edgeConsistencyRatio * 10) // 0-10 scale
  );
  
  return {
    decisionQualityIndex: dqi,
    emotionalImpactScore: eis,
    strategyReliabilityCoefficient: src,
    sessionPerformanceStability: sps,
    edgeConsistencyRatio,
    riskAdjustedDiscipline,
    behavioralEntropy,
    marketAdaptabilityIndex,
    overallQuantitativeGrade: scoreToGrade(compositeScore),
    compositeScore,
  };
}

// Secondary metric: Edge Consistency Ratio
function calculateEdgeConsistencyRatio(trades: Trade[]): number {
  if (trades.length < 10) return 0;
  
  // Calculate win rate consistency across time windows
  const windowSize = Math.floor(trades.length / 3);
  const windows: number[] = [];
  
  for (let i = 0; i < 3; i++) {
    const start = i * windowSize;
    const end = start + windowSize;
    const windowTrades = trades.slice(start, end);
    const wins = windowTrades.filter(t => t.profit > 0).length;
    windows.push(wins / windowTrades.length);
  }
  
  // Calculate standard deviation of win rates across windows
  const mean = windows.reduce((a, b) => a + b, 0) / windows.length;
  const variance = windows.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / windows.length;
  const stdDev = Math.sqrt(variance);
  
  // Consistency ratio: 1 - normalized stdDev
  return Math.max(0, 1 - (stdDev * 3));
}

// Secondary metric: Risk-Adjusted Discipline
function calculateRiskAdjustedDiscipline(trades: Trade[], dqiScore: number): number {
  const avgRisk = trades.reduce((sum, t) => sum + (t.riskPercent || 0), 0) / trades.length;
  
  // Higher DQI with lower risk = better discipline
  const riskScore = avgRisk <= 1 ? 100 : avgRisk <= 2 ? 80 : avgRisk <= 3 ? 60 : 40;
  
  return Math.round((dqiScore * 0.6) + (riskScore * 0.4));
}

// Secondary metric: Behavioral Entropy
function calculateBehavioralEntropy(trades: Trade[]): number {
  // Measures randomness in trading behavior
  // Lower entropy = more systematic = better
  
  const strategies = trades.map(t => t.strategy || 'none');
  const strategyCounts: Record<string, number> = {};
  strategies.forEach(s => {
    strategyCounts[s] = (strategyCounts[s] || 0) + 1;
  });
  
  const total = strategies.length;
  const entropy = Object.values(strategyCounts).reduce((sum, count) => {
    const p = count / total;
    return sum - (p * Math.log2(p));
  }, 0);
  
  // Normalize: max entropy is log2(numStrategies)
  const maxEntropy = Math.log2(Object.keys(strategyCounts).length || 1);
  return maxEntropy === 0 ? 0 : entropy / maxEntropy;
}

// Secondary metric: Market Adaptability Index
function calculateMarketAdaptabilityIndex(trades: Trade[]): number {
  // Measures ability to profit in different market conditions
  // Based on performance across different asset categories
  
  const categoryPerformance: Record<string, { profit: number; count: number }> = {};
  
  trades.forEach(trade => {
    const category = trade.assetCategory || 'Unknown';
    if (!categoryPerformance[category]) {
      categoryPerformance[category] = { profit: 0, count: 0 };
    }
    categoryPerformance[category].profit += trade.profit;
    categoryPerformance[category].count++;
  });
  
  const categories = Object.values(categoryPerformance);
  if (categories.length < 2) return 50; // Neutral if only one category
  
  // Calculate % of profitable categories
  const profitableCategories = categories.filter(c => c.profit > 0).length;
  const adaptability = (profitableCategories / categories.length) * 100;
  
  return Math.round(adaptability);
}

export default {
  calculateDecisionQualityIndex,
  calculateEmotionalImpactScore,
  calculateStrategyReliabilityCoefficient,
  calculateSessionPerformanceStability,
  calculateCompositeQuantitativeMetrics,
};
