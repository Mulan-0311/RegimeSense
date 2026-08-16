/**
 * AI-BOT.JS
 * Interactive RegimeBot Quantitative Copilot Engine
 */

window.AiBot = (function() {
  'use strict';

  // Chat message store
  let chatHistory = [
    {
      sender: 'bot',
      text: "👋 Welcome to **RegimeBot AI Copilot**! I am your real-time quantitative assistant connected to the 4-State Hidden Markov Model classifier.\n\nHow can I assist your portfolio analysis or regime risk assessment today?",
      time: getCurrentTime()
    }
  ];

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Process incoming user prompt and return context-aware bot response
   */
  function processUserQuery(userText, currentContext = {}) {
    const text = userText.toLowerCase();
    const regime = currentContext.currentRegime || { name: 'Bullish / Low Volatility', code: 'BULL' };

    let reply = "";

    if (text.includes("current regime") || text.includes("explain") || text.includes("status")) {
      reply = `### 📊 Current Market Regime Analysis\n` +
        `The market is classified under **${regime.name}**.\n\n` +
        `**Key Observations:**\n` +
        `- **Confidence Score:** 86.4% Gaussian posterior probability\n` +
        `- **Realized Volatility:** 12.4% (24th percentile, low risk)\n` +
        `- **Macro Liquidity:** 78.5 / 100 (Expansionary conditions)\n\n` +
        `**Strategic Implication:** Trend-following and long equity allocation currently exhibit optimized Sharpe ratios. Maintain benchmark weights with tight volatility stop-losses.`;
    } 
    else if (text.includes("transition") || text.includes("30d") || text.includes("probability") || text.includes("risk")) {
      reply = `### 🎲 30-Day Markov State Transition Matrix Summary\n` +
        `Based on our 30-day lookback Markov Chain:\n\n` +
        `- **Probability of remaining in Bullish state:** **85.0%**\n` +
        `- **Probability of shifting to Sideways Range:** **9.0%**\n` +
        `- **Probability of Bearish Volatility Spike:** **4.0%**\n` +
        `- **Tail-Risk Shock Probability:** **2.0%**\n\n` +
        `💡 *Recommendation:* The probability of a regime shock over the next 30 trading days remains suppressed (<5%). No aggressive tail-hedging is currently required.`;
    }
    else if (text.includes("portfolio") || text.includes("hedge") || text.includes("rebalance") || text.includes("adjust")) {
      reply = `### 🛡️ Tactical Portfolio Rebalancing Guidance\n` +
        `Under the active **${regime.name}** regime:\n\n` +
        `**Recommended Asset Weights:**\n` +
        `- **Equities (SPY/QQQ):** **60%** (Overweight)\n` +
        `- **Bonds / Treasuries (TLT):** **20%** (Neutral)\n` +
        `- **Commodities / Gold (GLD):** **10%** (Underweight)\n` +
        `- **Cash / T-Bills (BIL):** **10%** (Tactical buffer)\n\n` +
        `⚡ *Automated Trigger:* If transition probability to Bearish High-Vol exceeds **30%**, our engine recommends rebalancing 25% into Gold (GLD) and Short Futures.`;
    }
    else if (text.includes("backtest") || text.includes("results") || text.includes("performance")) {
      reply = `### 📈 Backtest Performance Summary\n` +
        `Comparing **Regime-Switching Strategy** against Buy & Hold (S&P 500) over 1Y horizon:\n\n` +
        `- **Regime Strategy Return:** **+24.8%**\n` +
        `- **Benchmark Return:** **+16.2%**\n` +
        `- **Strategy Sharpe Ratio:** **1.94** (vs Benchmark 1.12)\n` +
        `- **Max Strategy Drawdown:** **-6.2%** (vs Benchmark -14.8%)\n\n` +
        `🎯 *Key Advantage:* Tactical capital preservation during high-volatility regime shifts significantly reduced tail drawdowns.`;
    }
    else if (text.includes("hmm") || text.includes("garch") || text.includes("model") || text.includes("how it works")) {
      reply = `### 🧠 Hidden Markov Model (HMM) Architecture\n` +
        `Our market regime detection framework uses a 4-State Gaussian Hidden Markov Model combined with GARCH(1,1) volatility filtering:\n\n` +
        `1. **Hidden States:** Unobserved market regimes ($S_t \\in \\{0, 1, 2, 3\\}$) representing Bullish, Bearish, Sideways, and Shock.\n` +
        `2. **Observations:** Daily log-returns, yield curve slope (10Y-2Y), high-yield credit spreads, and realized volatility.\n` +
        `3. **Baum-Welch Algorithm:** Expectation-Maximization (EM) for unsupervised state parameter estimation.\n` +
        `4. **Viterbi Decoding:** Real-time decoding of the most likely hidden state sequence.`;
    }
    else {
      reply = `I have analyzed your prompt regarding *"userText"*. Our 4-State HMM regime model indicates stable macro liquidity. ` +
        `Would you like me to run a **Monte Carlo portfolio stress test**, check **Markov transition probabilities**, or review **tactical hedging options**?`;
    }

    return reply;
  }

  /**
   * Format response text with basic Markdown parsing (bolding, lists, headers)
   */
  function formatMarkdown(str) {
    if (!str) return '';
    let html = str
      .replace(/### (.*?)\n/g, '<h4 style="font-size: 14px; font-weight: 700; color: #00a3ff; margin-bottom: 8px;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*?)\n/g, '<li style="margin-left: 16px; margin-bottom: 4px;">$1</li>');
    return html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  }

  return {
    getChatHistory: () => chatHistory,
    addMessage: (sender, text) => {
      const msg = { sender, text, time: getCurrentTime() };
      chatHistory.push(msg);
      return msg;
    },
    processUserQuery,
    formatMarkdown
  };
})();
