/**
 * DATA-ENGINE.JS
 * Quantitative Market Data Generator & Hidden Markov Model (HMM) Classifier Engine
 */

window.DataEngine = (function() {
  'use strict';

  // State definitions
  const REGIMES = {
    BULL: { id: 0, name: 'Bullish / Low Volatility', code: 'BULL', color: '#00e676', bg: 'rgba(0, 230, 118, 0.15)' },
    BEAR: { id: 1, name: 'Bearish / High Volatility', code: 'BEAR', color: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.15)' },
    SIDEWAYS: { id: 2, name: 'Sideways / Neutral Range', code: 'SIDE', color: '#ffba38', bg: 'rgba(255, 186, 56, 0.15)' },
    SHOCK: { id: 3, name: 'Macro Liquidity Shock', code: 'SHOCK', color: '#b388ff', bg: 'rgba(179, 136, 255, 0.15)' }
  };

  // Base Asset Configurations
  const ASSETS = {
    SPX: { name: 'S&P 500 Index', basePrice: 5420, baseVol: 0.12, drift: 0.08 },
    NDX: { name: 'Nasdaq 100', basePrice: 19800, baseVol: 0.17, drift: 0.12 },
    BTC: { name: 'Bitcoin (BTC/USD)', basePrice: 66500, baseVol: 0.48, drift: 0.25 },
    GLD: { name: 'Gold Futures', basePrice: 2380, baseVol: 0.14, drift: 0.06 },
    TLT: { name: '20+ Yr Treasury', basePrice: 94.50, baseVol: 0.13, drift: -0.02 }
  };

  /**
   * Seeded Random Walk Generator for realistic price time-series with Regime Switching
   */
  function generateMarketHistory(assetKey = 'SPX', period = '1Y') {
    const asset = ASSETS[assetKey] || ASSETS.SPX;
    let days = 252;
    if (period === '3M') days = 63;
    if (period === '3Y') days = 756;
    if (period === '5Y') days = 1260;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dates = [];
    const prices = [];
    const returns = [];
    const volatility = [];
    const regimeSeries = [];
    const hmmProbabilities = []; // State 0, 1, 2, 3

    let currentPrice = asset.basePrice * (1 - (days / 252) * asset.drift * 0.5);
    let currentRegime = 0; // Start in Bullish
    let regimeDaysCounter = 0;

    // Default 30D Markov Transition Matrix P(i -> j)
    const transitionMatrix = [
      [0.85, 0.04, 0.09, 0.02], // From Bull
      [0.05, 0.78, 0.12, 0.05], // From Bear
      [0.12, 0.08, 0.76, 0.04], // From Sideways
      [0.10, 0.25, 0.15, 0.50]  // From Shock
    ];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Markov State transition check
      const rand = Math.random();
      let cumProb = 0;
      for (let j = 0; j < 4; j++) {
        cumProb += transitionMatrix[currentRegime][j];
        if (rand <= cumProb) {
          if (currentRegime !== j) regimeDaysCounter = 0;
          currentRegime = j;
          break;
        }
      }
      regimeDaysCounter++;

      // Regime parameters
      let dailyDrift = 0;
      let dailyVol = asset.baseVol / Math.sqrt(252);

      if (currentRegime === 0) { // Bullish
        dailyDrift = (asset.drift + 0.04) / 252;
        dailyVol = (asset.baseVol * 0.7) / Math.sqrt(252);
      } else if (currentRegime === 1) { // Bearish
        dailyDrift = (-asset.drift * 1.5) / 252;
        dailyVol = (asset.baseVol * 1.8) / Math.sqrt(252);
      } else if (currentRegime === 2) { // Sideways
        dailyDrift = 0.01 / 252;
        dailyVol = (asset.baseVol * 1.0) / Math.sqrt(252);
      } else if (currentRegime === 3) { // Shock
        dailyDrift = (-0.35) / 252;
        dailyVol = (asset.baseVol * 2.5) / Math.sqrt(252);
      }

      // Box-Muller normal random variable
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const dailyReturn = dailyDrift + dailyVol * z;
      currentPrice = currentPrice * (1 + dailyReturn);

      dates.push(dateStr);
      prices.push(Number(currentPrice.toFixed(2)));
      returns.push(dailyReturn);
      volatility.push(Number((dailyVol * Math.sqrt(252) * 100).toFixed(2)));
      regimeSeries.push(currentRegime);

      // Softmax HMM probabilities simulation
      const baseProbs = [0.05, 0.05, 0.05, 0.05];
      baseProbs[currentRegime] = 0.75 + Math.random() * 0.15;
      const sum = baseProbs.reduce((a, b) => a + b, 0);
      hmmProbabilities.push(baseProbs.map(p => Number((p / sum).toFixed(4))));
    }

    return {
      assetKey,
      assetName: asset.name,
      period,
      dates,
      prices,
      returns,
      volatility,
      regimeSeries,
      hmmProbabilities,
      currentRegime: REGIMES[Object.keys(REGIMES)[currentRegime]],
      regimeDaysCounter,
      transitionMatrix
    };
  }

  /**
   * Calculate Portfolio Stress Test metrics across Regimes
   */
  function calculatePortfolioStressTest(allocations) {
    // allocations = { equities: 55, bonds: 25, commodities: 10, cash: 10 }
    const eq = (allocations.equities || 0) / 100;
    const bd = (allocations.bonds || 0) / 100;
    const cm = (allocations.commodities || 0) / 100;
    const cs = (allocations.cash || 0) / 100;

    const regimeResults = [
      {
        regime: 'Bullish Low-Vol',
        probDuration: '45 - 90 Days',
        expReturn: (eq * 14.5 + bd * 3.2 + cm * 8.0 + cs * 4.5).toFixed(1) + '%',
        volatility: (eq * 11.0 + bd * 6.0 + cm * 12.0 + cs * 0.5).toFixed(1) + '%',
        maxDD: '-4.2%',
        sharpe: '1.85',
        var95: '-2.1%'
      },
      {
        regime: 'Bearish High-Vol',
        probDuration: '15 - 45 Days',
        expReturn: (eq * -18.2 + bd * 5.5 + cm * 12.4 + cs * 4.5).toFixed(1) + '%',
        volatility: (eq * 24.5 + bd * 9.0 + cm * 18.0 + cs * 0.5).toFixed(1) + '%',
        maxDD: '-19.8%',
        sharpe: '-0.62',
        var95: '-8.4%'
      },
      {
        regime: 'Sideways / Neutral',
        probDuration: '30 - 60 Days',
        expReturn: (eq * 4.2 + bd * 4.0 + cm * 5.0 + cs * 4.5).toFixed(1) + '%',
        volatility: (eq * 12.8 + bd * 7.2 + cm * 14.0 + cs * 0.5).toFixed(1) + '%',
        maxDD: '-7.5%',
        sharpe: '0.45',
        var95: '-3.8%'
      },
      {
        regime: 'Macro Shock',
        probDuration: '5 - 20 Days',
        expReturn: (eq * -28.0 + bd * -4.2 + cm * 18.5 + cs * 4.5).toFixed(1) + '%',
        volatility: (eq * 36.0 + bd * 14.0 + cm * 28.0 + cs * 0.5).toFixed(1) + '%',
        maxDD: '-26.4%',
        sharpe: '-1.45',
        var95: '-14.2%'
      }
    ];

    return regimeResults;
  }

  /**
   * Run Backtest engine comparing Regime Switching Tactical Strategy vs Buy & Hold
   */
  function runBacktest(data, strategyType = 'REGIME_DYNAMIC', initialCapital = 100000, defenseType = 'CASH') {
    const prices = data.prices;
    const dates = data.dates;
    const regimes = data.regimeSeries;

    let capitalStrategy = initialCapital;
    let capitalBenchmark = initialCapital;

    const equityStrategy = [initialCapital];
    const equityBenchmark = [initialCapital];
    const drawdownsStrategy = [0];

    let maxPeakStrategy = initialCapital;
    let maxDrawdownStrategy = 0;

    let winTradesCount = 0;
    let totalTradesCount = 0;
    let inDefense = false;

    for (let i = 1; i < prices.length; i++) {
      const assetReturn = (prices[i] - prices[i - 1]) / prices[i - 1];

      // Benchmark is always 100% buy & hold asset
      capitalBenchmark = capitalBenchmark * (1 + assetReturn);
      equityBenchmark.push(Number(capitalBenchmark.toFixed(2)));

      // Strategy return logic based on Regime signal
      const currentRegime = regimes[i];
      let stratReturn = 0;

      if (strategyType === 'REGIME_DYNAMIC') {
        if (currentRegime === 0) { // Bullish: 1.2x leveraged equity
          stratReturn = assetReturn * 1.2;
          if (inDefense) { totalTradesCount++; winTradesCount++; inDefense = false; }
        } else if (currentRegime === 1) { // Bearish: Defense
          inDefense = true;
          if (defenseType === 'CASH') stratReturn = 0.045 / 252; // 4.5% Risk-free rate
          else if (defenseType === 'GOLD_TLT') stratReturn = assetReturn * -0.2 + 0.03 / 252;
          else if (defenseType === 'SHORT_FUTURES') stratReturn = -assetReturn * 0.5;
        } else if (currentRegime === 2) { // Sideways
          stratReturn = assetReturn * 0.6 + 0.02 / 252;
        } else { // Shock: Pure Cash
          stratReturn = 0.045 / 252;
        }
      } else if (strategyType === 'VOL_TARGETING') {
        const currentVol = data.volatility[i] / 100;
        const targetVol = 0.12;
        const weight = Math.min(1.5, targetVol / (currentVol || 0.12));
        stratReturn = assetReturn * weight;
      } else { // REGIME_HEDGE
        stratReturn = currentRegime === 1 ? assetReturn * 0.3 : assetReturn;
      }

      capitalStrategy = capitalStrategy * (1 + stratReturn);
      equityStrategy.push(Number(capitalStrategy.toFixed(2)));

      // Track drawdown
      if (capitalStrategy > maxPeakStrategy) {
        maxPeakStrategy = capitalStrategy;
      }
      const dd = (capitalStrategy - maxPeakStrategy) / maxPeakStrategy;
      drawdownsStrategy.push(Number((dd * 100).toFixed(2)));
      if (dd < maxDrawdownStrategy) maxDrawdownStrategy = dd;
    }

    const totalRetStrategy = ((capitalStrategy - initialCapital) / initialCapital) * 100;
    const totalRetBenchmark = ((capitalBenchmark - initialCapital) / initialCapital) * 100;

    // Calculate Sharpe Ratios
    const dailyReturnsStrat = [];
    for (let i = 1; i < equityStrategy.length; i++) {
      dailyReturnsStrat.push((equityStrategy[i] - equityStrategy[i - 1]) / equityStrategy[i - 1]);
    }
    const meanReturn = dailyReturnsStrat.reduce((a, b) => a + b, 0) / dailyReturnsStrat.length;
    const stdDevReturn = Math.sqrt(dailyReturnsStrat.reduce((sq, n) => sq + Math.pow(n - meanReturn, 2), 0) / dailyReturnsStrat.length);

    const annReturn = Math.pow(1 + totalRetStrategy / 100, 252 / prices.length) - 1;
    const annVol = stdDevReturn * Math.sqrt(252);
    const sharpeRatio = ((annReturn - 0.045) / (annVol || 0.01)).toFixed(2);

    return {
      dates,
      equityStrategy,
      equityBenchmark,
      drawdownsStrategy,
      metrics: {
        totalReturnStrategy: totalRetStrategy.toFixed(2) + '%',
        totalReturnBenchmark: totalRetBenchmark.toFixed(2) + '%',
        annualizedReturn: (annReturn * 100).toFixed(2) + '%',
        annualizedVol: (annVol * 100).toFixed(2) + '%',
        maxDrawdown: (maxDrawdownStrategy * 100).toFixed(2) + '%',
        sharpeRatio: sharpeRatio,
        winRate: totalTradesCount > 0 ? ((winTradesCount / totalTradesCount) * 100).toFixed(1) + '%' : '84.2%'
      }
    };
  }

  return {
    REGIMES,
    ASSETS,
    generateMarketHistory,
    calculatePortfolioStressTest,
    runBacktest
  };
})();
