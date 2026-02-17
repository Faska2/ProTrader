import { Trade, Session, Strategy } from '../store/useStore';

// ============================================
// TRADING PSYCHOLOGY & BEHAVIOR ANALYZER
// Professional-grade psychological profiling system
// Focus: Discipline, Consistency, Decision Quality
// ============================================

export interface PsychologicalProfile {
  traderId: string;
  analysisDate: string;
  overallScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  
  // Core Dimensions
  behavioralPatterns: BehavioralPattern[];
  riskManagement: RiskAnalysis;
  psychologicalWeaknesses: PsychologicalWeakness[];
  strategyExecution: StrategyExecutionScore;
  consistencyMetrics: ConsistencyMetrics;
  
  // Actionable Output
  improvementPlan: ImprovementPlan;
  redFlags: RedFlag[];
  strengths: Strength[];
}

export interface BehavioralPattern {
  id: string;
  name: string;
  description: string;
  frequency: 'rare' | 'occasional' | 'frequent' | 'persistent';
  impact: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  tradesAffected: number;
}

export interface RiskAnalysis {
  overallScore: number;
  positionSizingGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskRewardGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  maxDrawdownRespect: number; // % of trades that respected max loss
  averageRiskPerTrade: number; // %
  riskViolations: RiskViolation[];
  capitalPreservationScore: number;
}

export interface RiskViolation {
  type: 'oversized_position' | 'no_stop_loss' | 'martingale' | 'revenge_trading' | 'excessive_leverage';
  severity: 'warning' | 'critical';
  occurrences: number;
  examples: string[];
  recommendation: string;
}

export interface PsychologicalWeakness {
  id: string;
  type: 'emotional' | 'cognitive' | 'behavioral';
  name: string;
  description: string;
  triggers: string[];
  manifestations: string[];
  frequency: number; // % of trades
  severity: 'mild' | 'moderate' | 'severe';
  countermeasures: string[];
}

export interface StrategyExecutionScore {
  overallScore: number;
  planAdherence: number; // %
  entryTiming: number; // 0-100
  exitTiming: number; // 0-100
  strategyConsistency: number; // %
  ruleFollowing: number; // %
  commonDeviations: StrategyDeviation[];
}

export interface StrategyDeviation {
  rule: string;
  violationRate: number;
  impact: 'positive' | 'neutral' | 'negative';
  context: string;
}

export interface ConsistencyMetrics {
  winRate: number;
  profitFactor: number;
  expectancy: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  volatilityOfReturns: number;
  tradingFrequencyConsistency: number; // %
  emotionalConsistency: number; // %
}

export interface ImprovementPlan {
  immediateActions: ActionItem[];
  shortTermGoals: ActionItem[]; // 1-4 weeks
  mediumTermGoals: ActionItem[]; // 1-3 months
  longTermGoals: ActionItem[]; // 3-12 months
  dailyRoutines: Routine[];
  psychologicalExercises: Exercise[];
}

export interface ActionItem {
  id: string;
  category: 'risk' | 'psychology' | 'strategy' | 'discipline';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedOutcome: string;
  timeframe: string;
  measurableTarget: string;
  successCriteria: string[];
}

export interface Routine {
  timeOfDay: 'pre-market' | 'during-market' | 'post-market' | 'daily';
  activity: string;
  duration: string;
  purpose: string;
}

export interface Exercise {
  name: string;
  type: 'mindfulness' | 'journaling' | 'visualization' | 'review';
  frequency: string;
  instructions: string[];
  expectedBenefit: string;
}

export interface RedFlag {
  id: string;
  severity: 'warning' | 'critical';
  issue: string;
  description: string;
  consequence: string;
  urgentAction: string;
}

export interface Strength {
  id: string;
  area: string;
  description: string;
  evidence: string[];
  leverageOpportunity: string;
}

// ============================================
// ANALYSIS ENGINE
// ============================================

export class TradingPsychologyAnalyzer {
  private trades: Trade[];
  private sessions: Session[];
  private strategies: Strategy[];

  constructor(trades: Trade[], sessions: Session[], strategies: Strategy[]) {
    this.trades = trades;
    this.sessions = sessions;
    this.strategies = strategies;
  }

  public generateProfile(): PsychologicalProfile {
    const behavioralPatterns = this.analyzeBehavioralPatterns();
    const riskManagement = this.analyzeRiskManagement();
    const psychologicalWeaknesses = this.identifyPsychologicalWeaknesses();
    const strategyExecution = this.analyzeStrategyExecution();
    const consistencyMetrics = this.calculateConsistencyMetrics();
    
    const overallScore = this.calculateOverallScore(
      riskManagement,
      strategyExecution,
      consistencyMetrics,
      psychologicalWeaknesses
    );

    return {
      traderId: crypto.randomUUID(),
      analysisDate: new Date().toISOString(),
      overallScore,
      grade: this.scoreToGrade(overallScore),
      behavioralPatterns,
      riskManagement,
      psychologicalWeaknesses,
      strategyExecution,
      consistencyMetrics,
      improvementPlan: this.generateImprovementPlan(
        behavioralPatterns,
        riskManagement,
        psychologicalWeaknesses,
        strategyExecution
      ),
      redFlags: this.identifyRedFlags(riskManagement, psychologicalWeaknesses),
      strengths: this.identifyStrengths(behavioralPatterns, consistencyMetrics),
    };
  }

  // ==========================================
  // BEHAVIORAL PATTERN ANALYSIS
  // ==========================================

  private analyzeBehavioralPatterns(): BehavioralPattern[] {
    const patterns: BehavioralPattern[] = [];

    // Pattern 1: Overtrading
    const dailyTradeCounts = this.getDailyTradeCounts();
    const highVolumeDays = Object.entries(dailyTradeCounts)
      .filter(([_, count]) => count > 5);
    
    if (highVolumeDays.length > 0) {
      patterns.push({
        id: 'overtrading',
        name: 'Overtrading',
        description: 'Taking too many trades in a single session, often a sign of boredom or FOMO',
        frequency: highVolumeDays.length > 5 ? 'frequent' : 'occasional',
        impact: 'high',
        evidence: highVolumeDays.map(([date, count]) => `${date}: ${count} trades`),
        tradesAffected: highVolumeDays.reduce((sum, [_, count]) => sum + count, 0),
      });
    }

    // Pattern 2: Revenge Trading
    const revengeTrades = this.identifyRevengeTrades();
    if (revengeTrades.length > 0) {
      patterns.push({
        id: 'revenge_trading',
        name: 'Revenge Trading',
        description: 'Entering trades immediately after losses to "make back" money',
        frequency: revengeTrades.length > 3 ? 'frequent' : 'occasional',
        impact: 'critical',
        evidence: revengeTrades.map(t => 
          `${t.date} ${t.time}: Entered ${t.symbol} ${t.type} after loss`
        ),
        tradesAffected: revengeTrades.length,
      });
    }

    // Pattern 3: Late Entry FOMO
    const lateEntries = this.trades.filter(t => {
      const time = parseInt(t.time?.split(':')[0] || '0');
      const hasEmotion = t.emotionBefore?.toLowerCase().includes('fomo') || 
                        t.emotionBefore?.toLowerCase().includes('fear');
      return time > 14 && hasEmotion && t.profit < 0; // Afternoon trades with negative emotion and loss
    });

    if (lateEntries.length > 2) {
      patterns.push({
        id: 'fomo_trading',
        name: 'FOMO Trading',
        description: 'Entering trades due to fear of missing out, often late in the move',
        frequency: lateEntries.length > 5 ? 'frequent' : 'occasional',
        impact: 'high',
        evidence: lateEntries.map(t => 
          `${t.date}: Late ${t.symbol} entry (${t.time}) with emotion: ${t.emotionBefore}`
        ),
        tradesAffected: lateEntries.length,
      });
    }

    // Pattern 4: Inconsistent Strategy Use
    const strategySwitchers = this.analyzeStrategySwitching();
    if (strategySwitchers.tooManyStrategies) {
      patterns.push({
        id: 'strategy_hopping',
        name: 'Strategy Hopping',
        description: 'Frequently switching strategies instead of mastering one',
        frequency: strategySwitchers.frequency,
        impact: 'medium',
        evidence: [`Used ${strategySwitchers.uniqueStrategies} different strategies in ${this.trades.length} trades`],
        tradesAffected: Math.floor(this.trades.length * 0.3),
      });
    }

    // Pattern 5: Emotional Trading
    const emotionalTrades = this.trades.filter(t => {
      const emotions = ['fear', 'greed', 'fomo', 'revenge', 'angry', 'anxious'];
      return emotions.some(e => t.emotionBefore?.toLowerCase().includes(e));
    });

    if (emotionalTrades.length > this.trades.length * 0.2) {
      patterns.push({
        id: 'emotional_trading',
        name: 'Emotional Trading',
        description: 'Making trading decisions based on emotions rather than plan',
        frequency: emotionalTrades.length > this.trades.length * 0.4 ? 'frequent' : 'occasional',
        impact: 'high',
        evidence: emotionalTrades.slice(0, 5).map(t => 
          `${t.date}: Traded ${t.symbol} while feeling ${t.emotionBefore}`
        ),
        tradesAffected: emotionalTrades.length,
      });
    }

    return patterns;
  }

  // ==========================================
  // RISK MANAGEMENT ANALYSIS
  // ==========================================

  private analyzeRiskManagement(): RiskAnalysis {
    const riskPercentages = this.trades
      .map(t => t.riskPercent || 0)
      .filter(r => r > 0);
    
    const avgRisk = riskPercentages.length > 0 
      ? riskPercentages.reduce((a, b) => a + b, 0) / riskPercentages.length 
      : 0;

    const violations: RiskViolation[] = [];

    // Check for oversized positions
    const oversizedTrades = this.trades.filter(t => (t.riskPercent || 0) > 3);
    if (oversizedTrades.length > 0) {
      violations.push({
        type: 'oversized_position',
        severity: oversizedTrades.length > 3 ? 'critical' : 'warning',
        occurrences: oversizedTrades.length,
        examples: oversizedTrades.slice(0, 3).map(t => 
          `${t.symbol}: ${t.riskPercent}% risk`
        ),
        recommendation: 'Reduce position size to maximum 2% per trade',
      });
    }

    // Check for missing stop losses
    const noSLTrades = this.trades.filter(t => !t.sl || t.sl === 0);
    if (noSLTrades.length > 0) {
      violations.push({
        type: 'no_stop_loss',
        severity: 'critical',
        occurrences: noSLTrades.length,
        examples: noSLTrades.slice(0, 3).map(t => `${t.symbol} on ${t.date}`),
        recommendation: 'Always set a stop loss before entering any trade',
      });
    }

    // Check for martingale behavior
    const martingalePattern = this.detectMartingale();
    if (martingalePattern.found) {
      violations.push({
        type: 'martingale',
        severity: 'critical',
        occurrences: martingalePattern.occurrences,
        examples: martingalePattern.examples,
        recommendation: 'Never increase position size after losses. Use fixed fractional sizing.',
      });
    }

    // Calculate grades
    const positionSizingGrade = avgRisk <= 1 ? 'A' : avgRisk <= 2 ? 'B' : avgRisk <= 3 ? 'C' : avgRisk <= 5 ? 'D' : 'F';
    
    const rrRatios = this.trades
      .map(t => t.rrPlanned || 0)
      .filter(rr => rr > 0);
    const avgRR = rrRatios.length > 0 
      ? rrRatios.reduce((a, b) => a + b, 0) / rrRatios.length 
      : 0;
    const riskRewardGrade = avgRR >= 3 ? 'A' : avgRR >= 2 ? 'B' : avgRR >= 1.5 ? 'C' : avgRR >= 1 ? 'D' : 'F';

    return {
      overallScore: this.calculateRiskScore(violations, avgRisk, avgRR),
      positionSizingGrade,
      riskRewardGrade,
      maxDrawdownRespect: this.calculateDrawdownRespect(),
      averageRiskPerTrade: avgRisk,
      riskViolations: violations,
      capitalPreservationScore: this.calculateCapitalPreservation(),
    };
  }

  // ==========================================
  // PSYCHOLOGICAL WEAKNESSES
  // ==========================================

  private identifyPsychologicalWeaknesses(): PsychologicalWeakness[] {
    const weaknesses: PsychologicalWeakness[] = [];

    // Weakness 1: Loss Aversion
    const earlyExits = this.trades.filter(t => {
      const wasProfitable = t.profit > 0;
      const emotionAfter = t.emotionAfter?.toLowerCase() || '';
      return wasProfitable && emotionAfter.includes('relief') && (t.rrActual || 0) < 1;
    });

    if (earlyExits.length > 2) {
      weaknesses.push({
        id: 'loss_aversion',
        type: 'cognitive',
        name: 'Loss Aversion',
        description: 'Cutting winners short due to fear of giving back profits',
        triggers: ['Seeing unrealized profits', 'Market reversing slightly', 'Previous losses'],
        manifestations: ['Closing trades too early', 'Moving stops to breakeven too quickly', 'Taking partial profits prematurely'],
        frequency: Math.round((earlyExits.length / this.trades.length) * 100),
        severity: earlyExits.length > 5 ? 'severe' : 'moderate',
        countermeasures: [
          'Set profit targets before entering',
          'Use trailing stops instead of manual exits',
          'Practice letting winners run',
          'Journal the feeling of regret when exiting early',
        ],
      });
    }

    // Weakness 2: Confirmation Bias
    const confirmationBiasTrades = this.trades.filter(t => {
      const hasSetup = t.strategy && t.strategy !== '';
      const noContrarianCheck = !t.notes?.toLowerCase().includes('why wrong') && 
                                !t.notes?.toLowerCase().includes('opposite view');
      return hasSetup && noContrarianCheck && t.profit < 0;
    });

    if (confirmationBiasTrades.length > 3) {
      weaknesses.push({
        id: 'confirmation_bias',
        type: 'cognitive',
        name: 'Confirmation Bias',
        description: 'Only seeking information that confirms your trade idea',
        triggers: ['Strong conviction in trade', 'Previous success with similar setup', 'Social media reinforcement'],
        manifestations: ['Ignoring contrary signals', 'Overweighting supporting evidence', 'Dismissing risk factors'],
        frequency: Math.round((confirmationBiasTrades.length / this.trades.length) * 100),
        severity: 'moderate',
        countermeasures: [
          'Force yourself to write 3 reasons why the trade might fail',
          'Seek out contradictory opinions before trading',
          'Set predefined invalidation points',
          'Review losing trades for missed warning signs',
        ],
      });
    }

    // Weakness 3: Overconfidence
    const consecutiveWins = this.getConsecutiveWins();
    const increasedSizeAfterWins = this.detectIncreasedSizeAfterWins();
    
    if (consecutiveWins >= 5 && increasedSizeAfterWins) {
      weaknesses.push({
        id: 'overconfidence',
        type: 'emotional',
        name: 'Overconfidence',
        description: 'Increasing risk after winning streaks, assuming edge is stronger than it is',
        triggers: ['Winning streaks', 'Recent success', 'Positive feedback from others'],
        manifestations: ['Increasing position size', 'Taking lower quality setups', 'Skipping checklist items'],
        frequency: Math.round((increasedSizeAfterWins.count / this.trades.length) * 100),
        severity: 'severe',
        countermeasures: [
          'Maintain fixed position sizing regardless of recent results',
          'Review losing streaks to stay humble',
          'Implement a "cooling off" period after large wins',
          'Focus on process, not outcomes',
        ],
      });
    }

    // Weakness 4: Impulsivity
    const impulsiveTrades = this.trades.filter(t => {
      const noEmotion = !t.emotionBefore || t.emotionBefore === '';
      const noStrategy = !t.strategy || t.strategy === '';
      const noPlan = !t.rrPlanned || t.rrPlanned === 0;
      return (noEmotion || noStrategy || noPlan) && t.profit < 0;
    });

    if (impulsiveTrades.length > 3) {
      weaknesses.push({
        id: 'impulsivity',
        type: 'behavioral',
        name: 'Impulsivity',
        description: 'Acting on urges without proper planning or emotional awareness',
        triggers: ['Market volatility', 'Boredom', 'News events', 'Seeing others trade'],
        manifestations: ['Trading without plan', 'Skipping pre-trade routine', 'No emotion tracking', 'Chasing moves'],
        frequency: Math.round((impulsiveTrades.length / this.trades.length) * 100),
        severity: impulsiveTrades.length > 8 ? 'severe' : 'moderate',
        countermeasures: [
          'Mandatory 5-minute pause before every trade',
          'Complete trade plan worksheet before entry',
          'Set daily trade limit',
          'Use "trading contract" with yourself',
        ],
      });
    }

    return weaknesses;
  }

  // ==========================================
  // STRATEGY EXECUTION ANALYSIS
  // ==========================================

  private analyzeStrategyExecution(): StrategyExecutionScore {
    const totalTrades = this.trades.length;
    
    // Plan Adherence
    const tradesWithPlan = this.trades.filter(t => 
      t.rrPlanned && t.rrPlanned > 0 && 
      t.strategy && t.strategy !== '' &&
      t.emotionBefore && t.emotionBefore !== ''
    ).length;
    const planAdherence = (tradesWithPlan / totalTrades) * 100;

    // Entry Timing
    const goodEntries = this.trades.filter(t => {
      // Simple heuristic: profitable trades with clear strategy
      return t.profit > 0 && t.strategy && t.strategy !== '';
    }).length;
    const entryTiming = (goodEntries / Math.max(this.trades.filter(t => t.profit > 0).length, 1)) * 100;

    // Exit Timing
    const plannedExits = this.trades.filter(t => {
      const hitTarget = t.status === 'TP';
      const hitStop = t.status === 'SL';
      return hitTarget || hitStop; // Followed exit plan
    }).length;
    const exitTiming = (plannedExits / totalTrades) * 100;

    // Strategy Consistency
    const strategies = this.trades.map(t => t.strategy).filter(Boolean);
    const uniqueStrategies = new Set(strategies).size;
    const strategyConsistency = totalTrades > 0 
      ? Math.min((strategies.length / (totalTrades * 0.7)) * 100, 100) 
      : 0;

    // Rule Following
    const tradesWithRules = this.trades.filter(t => 
      t.rulesUsed && t.rulesUsed.length > 0
    ).length;
    const ruleFollowing = (tradesWithRules / totalTrades) * 100;

    // Identify deviations
    const deviations: StrategyDeviation[] = [];
    
    // Check if trader deviates from profitable strategy
    const strategyPerformance: Record<string, { wins: number; total: number }> = {};
    this.trades.forEach(t => {
      if (!t.strategy) return;
      if (!strategyPerformance[t.strategy]) {
        strategyPerformance[t.strategy] = { wins: 0, total: 0 };
      }
      strategyPerformance[t.strategy].total++;
      if (t.profit > 0) strategyPerformance[t.strategy].wins++;
    });

    Object.entries(strategyPerformance).forEach(([strategy, stats]) => {
      const winRate = stats.wins / stats.total;
      if (winRate > 0.6 && stats.total >= 5) {
        deviations.push({
          rule: `Stick to ${strategy} strategy`,
          violationRate: 100 - strategyConsistency,
          impact: 'negative',
          context: `This strategy has ${(winRate * 100).toFixed(0)}% win rate but you only use it ${(strategyConsistency).toFixed(0)}% of the time`,
        });
      }
    });

    return {
      overallScore: Math.round((planAdherence + entryTiming + exitTiming + strategyConsistency + ruleFollowing) / 5),
      planAdherence,
      entryTiming,
      exitTiming,
      strategyConsistency,
      ruleFollowing,
      commonDeviations: deviations,
    };
  }

  // ==========================================
  // CONSISTENCY METRICS
  // ==========================================

  private calculateConsistencyMetrics(): ConsistencyMetrics {
    const profits = this.trades.map(t => t.profit);
    const wins = profits.filter(p => p > 0);
    const losses = profits.filter(p => p < 0);
    
    const winRate = (wins.length / this.trades.length) * 100;
    
    const grossProfit = wins.reduce((a, b) => a + b, 0);
    const grossLoss = Math.abs(losses.reduce((a, b) => a + b, 0));
    const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
    
    const expectancy = (winRate / 100) * (grossProfit / Math.max(wins.length, 1)) - 
                      ((100 - winRate) / 100) * (grossLoss / Math.max(losses.length, 1));

    // Calculate consecutive wins/losses
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentWins = 0;
    let currentLosses = 0;

    this.trades.forEach(t => {
      if (t.profit > 0) {
        currentWins++;
        currentLosses = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWins);
      } else {
        currentLosses++;
        currentWins = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLosses);
      }
    });

    // Volatility of returns (standard deviation)
    const avgReturn = profits.reduce((a, b) => a + b, 0) / profits.length;
    const variance = profits.reduce((sum, p) => sum + Math.pow(p - avgReturn, 2), 0) / profits.length;
    const volatility = Math.sqrt(variance);

    // Trading frequency consistency
    const dailyCounts = this.getDailyTradeCounts();
    const countValues = Object.values(dailyCounts);
    const avgDaily = countValues.reduce((a, b) => a + b, 0) / countValues.length;
    const varianceDaily = countValues.reduce((sum, c) => sum + Math.pow(c - avgDaily, 2), 0) / countValues.length;
    const frequencyConsistency = Math.max(0, 100 - (varianceDaily / Math.max(avgDaily, 1)) * 20);

    // Emotional consistency
    const emotionsTracked = this.trades.filter(t => t.emotionBefore && t.emotionBefore !== '').length;
    const emotionalConsistency = (emotionsTracked / this.trades.length) * 100;

    return {
      winRate,
      profitFactor,
      expectancy,
      consecutiveWins: maxConsecutiveWins,
      consecutiveLosses: maxConsecutiveLosses,
      volatilityOfReturns: volatility,
      tradingFrequencyConsistency: frequencyConsistency,
      emotionalConsistency,
    };
  }

  // ==========================================
  // IMPROVEMENT PLAN GENERATOR
  // ==========================================

  private generateImprovementPlan(
    patterns: BehavioralPattern[],
    risk: RiskAnalysis,
    weaknesses: PsychologicalWeakness[],
    execution: StrategyExecutionScore
  ): ImprovementPlan {
    const immediateActions: ActionItem[] = [];
    const shortTermGoals: ActionItem[] = [];
    const mediumTermGoals: ActionItem[] = [];
    const longTermGoals: ActionItem[] = [];

    // Critical risk violations = immediate action
    risk.riskViolations
      .filter(v => v.severity === 'critical')
      .forEach(v => {
        immediateActions.push({
          id: `risk-${v.type}`,
          category: 'risk',
          priority: 'critical',
          title: `Fix ${v.type.replace('_', ' ')}`,
          description: v.recommendation,
          expectedOutcome: 'Reduce account volatility and prevent large losses',
          timeframe: 'Starting immediately',
          measurableTarget: 'Zero violations in next 10 trades',
          successCriteria: ['No oversized positions', 'All trades have stop loss', 'Fixed position sizing'],
        });
      });

    // Psychological weaknesses = short-term focus
    weaknesses.forEach(w => {
      shortTermGoals.push({
        id: `psych-${w.id}`,
        category: 'psychology',
        priority: w.severity === 'severe' ? 'high' : 'medium',
        title: `Address ${w.name}`,
        description: w.description,
        expectedOutcome: 'Reduced emotional interference in trading',
        timeframe: '2-4 weeks',
        measurableTarget: `Reduce ${w.name.toLowerCase()} occurrences by 50%`,
        successCriteria: w.countermeasures.slice(0, 3),
      });
    });

    // Execution issues = medium-term
    if (execution.planAdherence < 80) {
      mediumTermGoals.push({
        id: 'exec-plan',
        category: 'discipline',
        priority: 'high',
        title: 'Improve Plan Adherence',
        description: 'Currently only planning ' + execution.planAdherence.toFixed(0) + '% of trades',
        expectedOutcome: 'Every trade has a clear plan before entry',
        timeframe: '1-2 months',
        measurableTarget: '90% plan adherence rate',
        successCriteria: [
          'Document R:R before every trade',
          'Define entry/exit criteria',
          'Note emotional state',
        ],
      });
    }

    // Behavioral patterns = long-term
    patterns
      .filter(p => p.impact === 'high' || p.impact === 'critical')
      .forEach(p => {
        longTermGoals.push({
          id: `behavior-${p.id}`,
          category: 'discipline',
          priority: p.impact === 'critical' ? 'critical' : 'high',
          title: `Eliminate ${p.name}`,
          description: p.description,
          expectedOutcome: 'Sustainable trading behavior',
          timeframe: '3-6 months',
          measurableTarget: `Reduce ${p.name.toLowerCase()} by 80%`,
          successCriteria: [
            'Awareness of triggers',
            'Implementation of interventions',
            'Consistent improvement over time',
          ],
        });
      });

    // Daily routines
    const dailyRoutines: Routine[] = [
      {
        timeOfDay: 'pre-market',
        activity: 'Meditation & Market Review',
        duration: '15 minutes',
        purpose: 'Clear mind and identify key levels',
      },
      {
        timeOfDay: 'pre-market',
        activity: 'Trade Plan Creation',
        duration: '10 minutes',
        purpose: 'Define setups to watch and rules',
      },
      {
        timeOfDay: 'during-market',
        activity: 'Pre-Trade Checklist',
        duration: '2 minutes',
        purpose: 'Ensure all criteria met before entry',
      },
      {
        timeOfDay: 'post-market',
        activity: 'Trade Review & Journaling',
        duration: '20 minutes',
        purpose: 'Document emotions, mistakes, and lessons',
      },
    ];

    // Psychological exercises
    const psychologicalExercises: Exercise[] = [
      {
        name: 'The 5-Minute Pause',
        type: 'mindfulness',
        frequency: 'Before every trade',
        instructions: [
          'Step away from screens',
          'Take 5 deep breaths',
          'Ask: "Am I trading my plan or my emotions?"',
          'Only proceed if plan is clear',
        ],
        expectedBenefit: 'Reduces impulsive trades by creating space between urge and action',
      },
      {
        name: 'Devil\'s Advocate',
        type: 'journaling',
        frequency: 'Before every trade',
        instructions: [
          'Write down your trade thesis',
          'List 3 reasons why this trade could fail',
          'Identify what would invalidate your idea',
          'Decide if you still want to proceed',
        ],
        expectedBenefit: 'Combats confirmation bias and improves decision quality',
      },
      {
        name: 'Win/Loss Visualization',
        type: 'visualization',
        frequency: 'Daily',
        instructions: [
          'Visualize a successful trade step-by-step',
          'Visualize handling a losing trade calmly',
          'Feel the emotions of both scenarios',
          'Commit to process over outcome',
        ],
        expectedBenefit: 'Prepares mind for both outcomes, reduces emotional volatility',
      },
    ];

    return {
      immediateActions,
      shortTermGoals,
      mediumTermGoals,
      longTermGoals,
      dailyRoutines,
      psychologicalExercises,
    };
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  private getDailyTradeCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.trades.forEach(t => {
      counts[t.date] = (counts[t.date] || 0) + 1;
    });
    return counts;
  }

  private identifyRevengeTrades(): Trade[] {
    const revengeTrades: Trade[] = [];
    let lastWasLoss = false;
    
    this.trades.forEach(t => {
      if (lastWasLoss && t.profit < 0) {
        // Check if entered quickly after loss (within same session)
        revengeTrades.push(t);
      }
      lastWasLoss = t.profit < 0;
    });
    
    return revengeTrades;
  }

  private analyzeStrategySwitching(): { tooManyStrategies: boolean; uniqueStrategies: number; frequency: 'rare' | 'occasional' | 'frequent' | 'persistent' } {
    const strategies = this.trades.map(t => t.strategy).filter(Boolean);
    const unique = new Set(strategies).size;
    const ratio = unique / Math.max(strategies.length, 1);
    
    return {
      tooManyStrategies: unique > 3 && ratio > 0.5,
      uniqueStrategies: unique,
      frequency: ratio > 0.7 ? 'frequent' : ratio > 0.4 ? 'occasional' : 'rare',
    };
  }

  private detectMartingale(): { found: boolean; occurrences: number; examples: string[] } {
    let occurrences = 0;
    const examples: string[] = [];
    
    for (let i = 1; i < this.trades.length; i++) {
      const prev = this.trades[i - 1];
      const curr = this.trades[i];
      
      if (prev.profit < 0 && (curr.lotSize || 0) > (prev.lotSize || 0) * 1.5) {
        occurrences++;
        examples.push(`${curr.date}: Increased size from ${prev.lotSize} to ${curr.lotSize} after loss`);
      }
    }
    
    return { found: occurrences > 0, occurrences, examples };
  }

  private detectIncreasedSizeAfterWins(): { found: boolean; count: number } {
    let count = 0;
    let consecutiveWins = 0;
    
    for (let i = 1; i < this.trades.length; i++) {
      const prev = this.trades[i - 1];
      const curr = this.trades[i];
      
      if (prev.profit > 0) {
        consecutiveWins++;
        if (consecutiveWins >= 3 && (curr.riskPercent || 0) > 2) {
          count++;
        }
      } else {
        consecutiveWins = 0;
      }
    }
    
    return { found: count > 0, count };
  }

  private getConsecutiveWins(): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    this.trades.forEach(t => {
      if (t.profit > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }

  private calculateDrawdownRespect(): number {
    const tradesWithSL = this.trades.filter(t => t.sl && t.sl > 0).length;
    return (tradesWithSL / this.trades.length) * 100;
  }

  private calculateCapitalPreservation(): number {
    const worstTrade = Math.min(...this.trades.map(t => t.profit), 0);
    const avgLoss = this.trades
      .filter(t => t.profit < 0)
      .reduce((sum, t) => sum + Math.abs(t.profit), 0) / 
      Math.max(this.trades.filter(t => t.profit < 0).length, 1);
    
    // Score based on max single loss and average loss
    const maxLossScore = worstTrade > -5 ? 100 : worstTrade > -10 ? 70 : worstTrade > -20 ? 40 : 20;
    const avgLossScore = avgLoss < 2 ? 100 : avgLoss < 3 ? 80 : avgLoss < 5 ? 60 : 40;
    
    return Math.round((maxLossScore + avgLossScore) / 2);
  }

  private calculateRiskScore(violations: RiskViolation[], avgRisk: number, avgRR: number): number {
    let score = 100;
    
    // Deduct for violations
    violations.forEach(v => {
      score -= v.severity === 'critical' ? 25 : 15;
    });
    
    // Deduct for high average risk
    if (avgRisk > 5) score -= 20;
    else if (avgRisk > 3) score -= 15;
    else if (avgRisk > 2) score -= 10;
    
    // Deduct for poor R:R
    if (avgRR < 1) score -= 15;
    else if (avgRR < 1.5) score -= 10;
    else if (avgRR < 2) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateOverallScore(
    risk: RiskAnalysis,
    execution: StrategyExecutionScore,
    consistency: ConsistencyMetrics,
    weaknesses: PsychologicalWeakness[]
  ): number {
    const weaknessPenalty = weaknesses.reduce((sum, w) => {
      const severityWeight = w.severity === 'severe' ? 15 : w.severity === 'moderate' ? 10 : 5;
      return sum + (w.frequency / 100) * severityWeight;
    }, 0);

    return Math.round(
      (risk.overallScore * 0.35) +
      (execution.overallScore * 0.30) +
      (consistency.emotionalConsistency * 0.15) +
      (Math.min(consistency.profitFactor * 20, 100) * 0.20) -
      weaknessPenalty
    );
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private identifyRedFlags(risk: RiskAnalysis, weaknesses: PsychologicalWeakness[]): RedFlag[] {
    const flags: RedFlag[] = [];

    if (risk.riskViolations.some(v => v.type === 'no_stop_loss' && v.occurrences > 3)) {
      flags.push({
        id: 'no-sl',
        severity: 'critical',
        issue: 'Trading Without Stop Losses',
        description: 'Multiple trades executed without defined stop losses',
        consequence: 'Catastrophic losses can wipe out account',
        urgentAction: 'Implement mandatory stop loss rule immediately',
      });
    }

    if (risk.riskViolations.some(v => v.type === 'martingale')) {
      flags.push({
        id: 'martingale',
        severity: 'critical',
        issue: 'Martingale Behavior Detected',
        description: 'Increasing position size after losses',
        consequence: 'Account destruction through exponential risk',
        urgentAction: 'Use fixed fractional position sizing only',
      });
    }

    const severeWeaknesses = weaknesses.filter(w => w.severity === 'severe');
    if (severeWeaknesses.length >= 2) {
      flags.push({
        id: 'multiple-weaknesses',
        severity: 'warning',
        issue: 'Multiple Severe Psychological Weaknesses',
        description: `${severeWeaknesses.length} severe behavioral patterns identified`,
        consequence: 'Consistent losses due to unmanaged psychology',
        urgentAction: 'Consider working with trading psychologist',
      });
    }

    return flags;
  }

  private identifyStrengths(patterns: BehavioralPattern[], consistency: ConsistencyMetrics): Strength[] {
    const strengths: Strength[] = [];

    if (consistency.emotionalConsistency > 80) {
      strengths.push({
        id: 'emotional-awareness',
        area: 'Emotional Awareness',
        description: 'Consistently tracks emotions before and after trades',
        evidence: [`${consistency.emotionalConsistency.toFixed(0)}% of trades have emotion documented`],
        leverageOpportunity: 'Use this awareness to identify your optimal trading mindset',
      });
    }

    if (consistency.winRate > 55 && consistency.profitFactor > 1.5) {
      strengths.push({
        id: 'edge-recognition',
        area: 'Strategy Edge',
        description: 'Demonstrates positive expectancy in trading',
        evidence: [
          `${consistency.winRate.toFixed(0)}% win rate`,
          `${consistency.profitFactor.toFixed(2)} profit factor`,
        ],
        leverageOpportunity: 'Focus on your winning setups and eliminate marginal trades',
      });
    }

    if (patterns.length === 0) {
      strengths.push({
        id: 'discipline',
        area: 'Trading Discipline',
        description: 'No significant behavioral patterns detected',
        evidence: ['Consistent execution without overtrading or revenge trading'],
        leverageOpportunity: 'Maintain current routines and focus on incremental improvements',
      });
    }

    return strengths;
  }
}

export default TradingPsychologyAnalyzer;
