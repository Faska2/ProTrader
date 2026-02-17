# 📊 Quantitative Trading Analytics

## Professional Mathematical Metrics for Trading Journals

### Overview

A comprehensive quantitative analysis system that goes beyond basic P&L metrics to measure trading performance through mathematical rigor. These metrics focus on **process quality**, **behavioral consistency**, and **decision-making excellence**.

---

## 🎯 Primary Metrics

### 1. Decision Quality Index (DQI)

**Purpose**: Measures the quality of trading decisions independent of outcome (process over profit)

#### Formula

```
DQI = Σ(wi × Ci) × (1 - Penalty) × Multiplier

Where:
- wi = Weight for component i
- Ci = Component score (0-100)
- Penalty = Reduction for violations (0-1)
- Multiplier = Consistency bonus (1.0-1.2)
```

#### Components (Weighted)

| Component | Weight | Calculation |
|-----------|--------|-------------|
| **Plan Quality** | 25% | R:R defined (30) + Strategy defined (25) + Entry/exit planned (25) + Notes (20) |
| **Risk Management** | 25% | Position sizing (40) + Stop loss (30) + Take profit (20) + R:R ratio (10) |
| **Execution Precision** | 20% | R:R achievement (40) + Exit quality (30) + Rule adherence (10) |
| **Emotional Control** | 15% | Emotion before (40) + Emotion after (30) + No mistakes (30) |
| **Documentation** | 15% | Notes (25) + Screenshot (25) + Mistakes (25) + Complete data (25) |

#### Penalty System

| Violation | Penalty |
|-----------|---------|
| No stop loss | -15% × (trades/total) |
| Oversized position (>3% risk) | -10% × (trades/total) |
| No strategy defined | -10% × (trades/total) |

#### Consistency Bonus

```
CV (Coefficient of Variation) = StdDev(daily_returns) / Mean(daily_returns)

Bonus = 0% if CV ≥ 1.5
Bonus = 5% if CV < 1.5
Bonus = 10% if CV < 1.0
Bonus = 20% if CV < 0.5
```

#### Interpretation

| Score | Grade | Assessment |
|-------|-------|------------|
| 90-100 | A | Elite decision-making process |
| 80-89 | B | Solid process with minor gaps |
| 70-79 | C | Average - specific improvements needed |
| 60-69 | D | Below average - significant issues |
| 0-59 | F | Poor - requires immediate intervention |

#### Confidence Interval (95%)

```
Margin of Error = 1.96 × (Standard Deviation / √n)
CI = [Score - MoE, Score + MoE]
```

---

### 2. Emotional Impact Score (EIS)

**Purpose**: Quantifies the emotional component of trading and its correlation with performance

#### Formula

```
EIS = Awareness × (1 + Stability) × (1 - |Bias|) × 25

Where:
- Awareness = % of trades with emotion documented (0-100)
- Stability = Emotional consistency (0-1)
- Bias = Emotional bias index (-1 to 1)
```

#### Components

**1. Emotional Awareness (40% of score)**
```
Awareness = (Trades with emotion / Total trades) × 100
```

**2. Emotional Stability (30% of score)**
```
Entropy = -Σ(p_i × log₂(p_i))
Where p_i = frequency of emotion i

Stability = 1 - (Entropy / Max_Entropy)
Max_Entropy = log₂(Number of unique emotions)
```

**3. Emotional Bias Index (30% of score)**
```
Bias = (Losses with negative emotions / Total negative emotions) - 0.5

Negative emotions: fear, greed, fomo, anxiety, revenge, frustration
Range: -1 (no bias) to +1 (severe bias)
```

**4. Emotion-Performance Correlation (Pearson)**
```
r = [n(Σxy) - (Σx)(Σy)] / √[(nΣx² - (Σx)²)(nΣy² - (Σy)²)]

Where:
x = Emotion score (-1 negative, 0 neutral, +1 positive)
y = Trade profit
```

#### Dominant Emotions Analysis

For each emotion, calculates:
- **Frequency**: % of trades with this emotion
- **Average Profit**: Mean profit when trading with this emotion
- **Win Rate**: % of winning trades with this emotion

#### Recommendations Engine

Generates specific recommendations based on:
1. Low awareness → "Document emotions before every trade"
2. Low stability → "Work on emotional consistency"
3. High bias → "Negative emotions correlate with losses"
4. Poor emotion performance → "Avoid trading when feeling [emotion]"

---

### 3. Strategy Reliability Coefficient (SRC)

**Purpose**: Measures the statistical reliability and consistency of trading strategies using probability theory

#### Formula

```
SRC = (Normalized_WR × 0.25) + (Normalized_PF × 0.30) + 
      (Consistency × 0.25) + (Volatility_Score × 0.20)

Where:
- Normalized_WR = Win rate (0-100)
- Normalized_PF = Profit Factor × 25 (capped at 100)
- Consistency = (1 - CV) × 100
- Volatility_Score = max(0, 100 - (StdDev × 2))
```

#### Per-Strategy Metrics

For each strategy, calculates:

**1. Win Rate**
```
WR = (Winning trades / Total trades) × 100
```

**2. Profit Factor**
```
PF = Gross Profit / Gross Loss

Grade:
A: PF ≥ 2.0
B: PF ≥ 1.5
C: PF ≥ 1.0
D: PF ≥ 0.8
F: PF < 0.8
```

**3. Consistency (Anti-Volatility)**
```
CV = Standard Deviation / Mean Return
Consistency = max(0, 1 - CV)
```

**4. Expectancy**
```
E = (Win% × Avg Win) - (Loss% × Avg Loss)

Interpretation:
E > 0: Positive expectancy (profitable long-term)
E < 0: Negative expectancy (losing long-term)
```

**5. Maximum Consecutive Losses**
```
Counts longest streak of losing trades
Important for position sizing (Kelly Criterion)
```

**6. Confidence Interval (95%)**
```
CI = Coefficient ± (1.96 × SE)
SE = Standard Deviation / √n
```

#### Reliability Classification

| Coefficient | Reliability | Sample Size | Recommendation |
|-------------|-------------|-------------|----------------|
| 70-100 | High | ≥10 | Primary strategy - increase size |
| 50-69 | Medium | ≥10 | Secondary strategy - continue testing |
| 0-49 | Low | ≥10 | Review or eliminate |
| N/A | Untested | <10 | Insufficient data |

#### Diversification Score

```
Diversification = min(100, Number of strategies × 25)

Optimal: 3-4 uncorrelated strategies
```

---

### 4. Session Performance Stability (SPS)

**Purpose**: Measures consistency and stability across different trading sessions and time periods

#### Formula

```
SPS = (1 - CV_Sessions) × 100

Where:
CV_Sessions = StdDev(Session P&L) / Mean(|Session P&L|)

Alternative formula:
SPS = 100 - (Variance_Coefficient × 50)
```

#### Session Breakdown Metrics

For each trading session (London, New York, Asia, etc.):

**1. Total Profit**: Sum of all profits/losses
**2. Win Rate**: % of winning trades
**3. Average Trade**: Mean profit per trade
**4. Volatility**: Standard deviation of returns
**5. Trend**: 
   - Improving: Second half profit > First half + 2×Avg
   - Declining: Second half profit < First half - 2×Avg
   - Stable: Between thresholds

#### Session Consistency Index

```
SCI = 100 - (Variance_of_WinRates / 10)

Measures how similar win rates are across sessions
Higher = more consistent performance
```

#### Time-Based Pattern Analysis

**Best/Worst Hours:**
```
For each hour with ≥3 trades:
  Avg Profit = Total Profit / Trade Count
Best Hour = Max(Avg Profit)
Worst Hour = Min(Avg Profit)
```

**Best/Worst Days:**
```
For each day with ≥3 trades:
  Avg Profit = Total Profit / Trade Count
Best Day = Max(Avg Profit)
Worst Day = Min(Avg Profit)
```

#### Interpretation

| Stability Score | Assessment | Action |
|-----------------|------------|--------|
| 80-100 | Highly stable | Maintain current approach |
| 60-79 | Moderately stable | Minor adjustments needed |
| 40-59 | Unstable | Identify and address causes |
| 0-39 | Highly volatile | Major intervention required |

---

## 📈 Secondary Metrics

### 5. Edge Consistency Ratio (ECR)

**Purpose**: Measures whether trading edge is consistent over time

```
ECR = 1 - StdDev(Win_Rate_Windows)

Method:
1. Divide trades into 3 time windows
2. Calculate win rate for each window
3. Measure standard deviation across windows
4. Lower deviation = higher consistency

Interpretation:
ECR > 0.8: Highly consistent edge
ECR 0.6-0.8: Moderately consistent
ECR < 0.6: Inconsistent - review strategy
```

### 6. Risk-Adjusted Discipline (RAD)

**Purpose**: Measures discipline weighted by risk levels

```
RAD = (DQI × 0.6) + (Risk_Score × 0.4)

Risk_Score:
  Avg Risk ≤ 1%: 100
  Avg Risk 1-2%: 80
  Avg Risk 2-3%: 60
  Avg Risk > 3%: 40

High DQI with low risk = Elite discipline
```

### 7. Behavioral Entropy (BE)

**Purpose**: Measures randomness vs systematic behavior

```
BE = -Σ(p_i × log₂(p_i)) / log₂(N)

Where:
- p_i = Probability of behavior i
- N = Number of possible behaviors

Interpretation:
BE ≈ 0: Highly systematic (good)
BE ≈ 1: Random behavior (bad)
```

Lower entropy indicates more consistent, systematic trading.

### 8. Market Adaptability Index (MAI)

**Purpose**: Measures ability to profit across different market conditions

```
MAI = (Profitable_Asset_Categories / Total_Asset_Categories) × 100

Categories: Forex, Crypto, Stocks, Indices, Commodities

Interpretation:
MAI > 80: Highly adaptable
MAI 60-80: Moderately adaptable
MAI < 60: Specialized (not necessarily bad)
```

---

## 🧮 Composite Score Calculation

**Final Composite Score** (0-100):

```
Composite = (DQI × 0.30) + 
            (EIS × 0.20) + 
            (SRC × 0.25) + 
            (SPS × 0.15) + 
            (ECR × 10 × 0.10)

Weights:
- Decision Quality: 30% (most important)
- Strategy Reliability: 25% (process quality)
- Emotional Impact: 20% (psychology)
- Session Stability: 15% (consistency)
- Edge Consistency: 10% (time-based)
```

---

## 📊 Statistical Methods Used

### 1. Standard Deviation
```
σ = √[Σ(x_i - μ)² / N]

Measures volatility of returns
```

### 2. Coefficient of Variation (CV)
```
CV = σ / μ

Normalized measure of dispersion
Lower CV = more consistent
```

### 3. Pearson Correlation
```
r = Cov(X,Y) / (σ_X × σ_Y)

Range: -1 to +1
Measures linear relationship
```

### 4. Entropy (Information Theory)
```
H = -Σ(p_i × log₂(p_i))

Measures uncertainty/randomness
```

### 5. Confidence Intervals
```
CI = Mean ± (Z × SE)
Z = 1.96 for 95% confidence
SE = Standard Error
```

---

## 🎯 Implementation Example

```typescript
import { 
  calculateDecisionQualityIndex,
  calculateEmotionalImpactScore,
  calculateStrategyReliabilityCoefficient,
  calculateSessionPerformanceStability,
  calculateCompositeQuantitativeMetrics
} from './utils/QuantitativeAnalytics';

// Calculate all metrics
const metrics = calculateCompositeQuantitativeMetrics(trades, sessions, strategies);

console.log(metrics);
// {
//   decisionQualityIndex: { score: 82, grade: 'B', ... },
//   emotionalImpactScore: { score: 75, ... },
//   strategyReliabilityCoefficient: { overallCoefficient: 68, ... },
//   sessionPerformanceStability: { stabilityScore: 71, ... },
//   compositeScore: 74,
//   overallQuantitativeGrade: 'B'
// }
```

---

## 📚 Mathematical References

### Key Concepts

1. **Probability Theory**: Win rates, expectancy
2. **Statistics**: Standard deviation, variance, correlation
3. **Information Theory**: Entropy measurements
4. **Time Series Analysis**: Trend detection, windowing
5. **Hypothesis Testing**: Confidence intervals

### Recommended Reading

- "Quantitative Trading" by Ernest Chan
- "Advances in Financial Machine Learning" by Marcos López de Prado
- "Evidence-Based Technical Analysis" by David Aronson

---

## ⚠️ Important Notes

1. **Sample Size**: Minimum 10 trades for reliability metrics
2. **Outliers**: Extreme values may skew standard deviation
3. **Market Regimes**: Metrics should be recalculated in different conditions
4. **Overfitting**: Avoid optimizing for historical metrics
5. **Stationarity**: Markets change - metrics need regular updates

---

## 🔄 Update Frequency

- **Daily**: All metrics for active monitoring
- **Weekly**: Trend analysis and pattern detection
- **Monthly**: Comprehensive review and recalibration
- **Quarterly**: Strategy reliability assessment

---

**Built for quantitative traders who demand mathematical rigor** 📐

*Last updated: 2026-02-17*
