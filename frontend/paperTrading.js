/**
 * PAPER-TRADING.JS
 * Client-side mock execution engine and portfolio tracker
 */

window.PaperTrading = (function() {
  'use strict';

  let portfolio = {
    cash: 100000,
    positions: {},
    history: []
  };

  // Load from localStorage if available
  const saved = localStorage.getItem('regimeSense_portfolio');
  if (saved) {
    try {
      portfolio = JSON.parse(saved);
    } catch(e) {
      console.error('Failed to load portfolio state', e);
    }
  }

  function saveState() {
    localStorage.setItem('regimeSense_portfolio', JSON.stringify(portfolio));
  }

  function executeTrade(asset, action, quantity, price) {
    const cost = quantity * price;

    if (action === 'BUY') {
      if (portfolio.cash < cost) return { success: false, error: 'Insufficient funds' };
      
      portfolio.cash -= cost;
      if (!portfolio.positions[asset]) {
        portfolio.positions[asset] = { quantity: 0, averagePrice: 0 };
      }
      
      const pos = portfolio.positions[asset];
      pos.averagePrice = ((pos.averagePrice * pos.quantity) + cost) / (pos.quantity + quantity);
      pos.quantity += quantity;
      
    } else if (action === 'SELL') {
      if (!portfolio.positions[asset] || portfolio.positions[asset].quantity < quantity) {
        return { success: false, error: 'Insufficient position size' };
      }
      
      portfolio.cash += cost;
      portfolio.positions[asset].quantity -= quantity;
      
      if (portfolio.positions[asset].quantity === 0) {
        delete portfolio.positions[asset];
      }
    }

    portfolio.history.push({
      date: new Date().toISOString(),
      asset,
      action,
      quantity,
      price,
      value: cost
    });

    saveState();
    return { success: true, portfolio };
  }

  function getPortfolioValue(currentPrices) {
    let value = portfolio.cash;
    for (const [asset, pos] of Object.entries(portfolio.positions)) {
      if (currentPrices[asset]) {
        value += pos.quantity * currentPrices[asset];
      }
    }
    return value;
  }

  return {
    getPortfolio: () => portfolio,
    executeTrade,
    getPortfolioValue,
    reset: () => {
      portfolio = { cash: 100000, positions: {}, history: [] };
      saveState();
    }
  };
})();
